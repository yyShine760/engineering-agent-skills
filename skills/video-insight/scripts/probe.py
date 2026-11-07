#!/usr/bin/env python3
"""Generic video-page probe.

Discovers comment / subtitle / chapter / metadata candidates without knowing
which platform it is looking at. Uses playwright-cli to drive a persistent
browser session, injects fetch/XHR hooks, and replays the top candidates.

Usage:
    probe.py <url> [--session NAME] [--profile PATH] [--direct]

Output: JSON on stdout.
"""
import argparse
import json
import os
import re
import subprocess
import sys


def run(cmd, env):
    return subprocess.run(cmd, capture_output=True, text=True, env=env, timeout=300)


def extract_json(text):
    text = text.strip()
    # playwright-cli --raw may return a JSON-encoded string
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
    ap.add_argument("--session", default="video-probe")
    ap.add_argument("--profile", default="~/.config/video-probe-profile")
    ap.add_argument("--direct", action="store_true",
                    help="remove proxy env vars (needed by some CN platforms)")
    ap.add_argument("--keep", action="store_true", help="leave the browser session open")
    args = ap.parse_args()

    env = os.environ.copy()
    if args.direct:
        for k in ("http_proxy", "https_proxy", "all_proxy",
                  "HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY"):
            env.pop(k, None)

    profile = os.path.expanduser(args.profile)
    probe_js = os.path.join(os.path.dirname(os.path.abspath(__file__)), "probe.js")
    if not os.path.exists(probe_js):
        print(json.dumps({"error": f"missing probe.js at {probe_js}"}))
        return 1

    listed = run(["playwright-cli", "list"], env).stdout
    if f"- {args.session}:" not in listed:
        opened = run([
            "playwright-cli", f"-s={args.session}", "open",
            "--persistent", f"--profile={profile}", args.url
        ], env)
        if opened.returncode != 0:
            print(json.dumps({"error": "open failed", "stderr": opened.stderr[-500:]}))
            return 1
    else:
        navigated = run([
            "playwright-cli", f"-s={args.session}", "goto", args.url
        ], env)
        if navigated.returncode != 0:
            print(json.dumps({"error": "goto failed", "stderr": navigated.stderr[-500:]}))
            return 1

    result = run([
        "playwright-cli", f"-s={args.session}", "--raw",
        "run-code", f"--filename={probe_js}"
    ], env)

    if result.returncode != 0:
        print(json.dumps({"error": "probe failed", "stderr": result.stderr[-800:]}))
        return 1

    raw = extract_json(result.stdout)
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        print(raw)
        return 0
    print(json.dumps(parsed, ensure_ascii=False, indent=2))

    if not args.keep:
        run(["playwright-cli", f"-s={args.session}", "close"], env)
    return 0


if __name__ == "__main__":
    sys.exit(main())
