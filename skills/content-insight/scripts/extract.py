#!/usr/bin/env python3
"""Execute a content extraction strategy on a page.

Strategies are source-based, not platform-based:
  ssr  — read window.__INITIAL_STATE__ / __NEXT_DATA__ / ytInitialData
  api  — replay a discovered JSON endpoint, with cursor paging
  dom  — heuristic DOM extraction for pages without structured data

Usage:
    extract.py <url> --source ssr|api|dom [--limit N] [--api-url URL]
                [--cursor C] [--max-pages N] [--session NAME]
                [--profile PATH] [--direct] [--keep]

Output: unified JSON schema on stdout.
"""
import argparse
import json
import os
import re
import subprocess
import sys

from common import normalize_url


def run(cmd, env):
    return subprocess.run(cmd, capture_output=True, text=True, env=env, timeout=300)


def extract_json(text):
    text = text.strip()
    if text.startswith('"') and text.endswith('"'):
        try:
            text = json.loads(text)
        except json.JSONDecodeError:
            pass
    if text.startswith("```"):
        text = re.sub(r"^```[a-zA-Z]*\n", "", text)
        text = re.sub(r"\n```$", "", text)
    start = text.find("{")
    end = text.rfind("}")
    if start >= 0 and end > start:
        return text[start:end + 1]
    return text


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("--source", required=True, choices=["ssr", "api", "dom", "text"])
    ap.add_argument("--limit", type=int, default=10)
    ap.add_argument("--selector", default="")
    ap.add_argument("--api-url", default="")
    ap.add_argument("--cursor", default="")
    ap.add_argument("--max-pages", type=int, default=1)
    ap.add_argument("--session", default="content-extract")
    ap.add_argument("--profile", default="~/.config/content-probe-profile")
    ap.add_argument("--direct", action="store_true")
    ap.add_argument("--close", action="store_true")
    args = ap.parse_args()

    env = os.environ.copy()
    if args.direct:
        for k in ("http_proxy", "https_proxy", "all_proxy",
                  "HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY"):
            env.pop(k, None)

    profile = os.path.expanduser(args.profile)
    target = normalize_url(args.url)
    template_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "extract.js")
    if not os.path.exists(template_path):
        print(json.dumps({"error": f"missing extract.js at {template_path}"}))
        return 1

    payload = {
        "source": args.source,
        "limit": args.limit,
        "apiUrl": args.api_url,
        "cursor": args.cursor,
        "maxPages": args.max_pages,
        "selector": args.selector,
    }

    template = open(template_path, "r", encoding="utf-8").read()
    script = template.replace("__ARGS__", json.dumps(payload, ensure_ascii=False))
    tmp_path = f"/tmp/opencode/content-extract-{os.getpid()}.js"
    os.makedirs(os.path.dirname(tmp_path), exist_ok=True)
    with open(tmp_path, "w", encoding="utf-8") as f:
        f.write(script)

    try:
        listed = run(["playwright-cli", "list"], env).stdout
        if f"- {args.session}:" not in listed:
            opened = run([
                "playwright-cli", f"-s={args.session}", "open",
                "--persistent", f"--profile={profile}", target
            ], env)
            if opened.returncode != 0:
                print(json.dumps({"error": "open failed", "stderr": opened.stderr[-500:]}))
                return 1
        else:
            navigated = run([
                "playwright-cli", f"-s={args.session}", "goto", target
            ], env)
            if navigated.returncode != 0:
                print(json.dumps({"error": "goto failed", "stderr": navigated.stderr[-500:]}))
                return 1

        result = run([
            "playwright-cli", f"-s={args.session}", "--raw",
            "run-code", f"--filename={tmp_path}"
        ], env)

        if result.returncode != 0:
            print(json.dumps({"error": "extract failed", "stderr": result.stderr[-800:]}))
            return 1

        raw = extract_json(result.stdout)
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            print(raw)
            return 0
        parsed["requestedUrl"] = args.url
        parsed["normalizedUrl"] = target
        print(json.dumps(parsed, ensure_ascii=False, indent=2))

        if args.close:
            run(["playwright-cli", f"-s={args.session}", "close"], env)
        return 0
    finally:
        try:
            os.unlink(tmp_path)
        except FileNotFoundError:
            pass


if __name__ == "__main__":
    sys.exit(main())
