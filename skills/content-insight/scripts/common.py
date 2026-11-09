"""Shared helpers for content-insight scripts."""
import importlib.util
import os
import re
import shutil
import urllib.request
from urllib.parse import parse_qs, urlparse


def profile_owners(list_output, profile, exclude=None):
    """Find sessions currently holding the given profile directory."""
    owners = []
    current = None
    target = os.path.expanduser(profile)
    for line in list_output.splitlines():
        if line.startswith("- "):
            m = re.match(r"^\- ([^:]+):", line)
            if m:
                current = m.group(1).strip()
            continue
        if current and "user-data-dir:" in line:
            path = line.split("user-data-dir:", 1)[1].strip()
            if os.path.expanduser(path) == target and current != exclude:
                owners.append(current)
            current = None
    return owners


def environment():
    """Report which local extraction fallbacks are actually available."""
    return {
        "ffmpeg": shutil.which("ffmpeg") is not None,
        "faster_whisper": importlib.util.find_spec("faster_whisper") is not None,
    }


def resolve_short_url(url, timeout=8):
    """Follow a short-link redirect (e.g. v.douyin.com) once."""
    if not url:
        return url
    req = urllib.request.Request(
        url,
        method="HEAD",
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"},
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.geturl() or url
    except Exception:
        return url


def normalize_url(url):
    """Turn share/user-page URLs into canonical content URLs when possible."""
    try:
        u = urlparse(url)
    except ValueError:
        return url

    host = u.netloc.lower()
    q = parse_qs(u.query)

    if "douyin.com" in host:
        for key in ("modal_id", "aweme_id", "vid"):
            if q.get(key):
                return f"https://www.douyin.com/video/{q[key][0]}"

    if "xiaohongshu.com" in host:
        m = re.search(r"/(?:search_result|discovery/item)/([0-9a-zA-Z]+)", u.path)
        if m:
            token = q.get("xsec_token", [""])[0]
            base = f"https://www.xiaohongshu.com/explore/{m.group(1)}"
            return base + (f"?xsec_token={token}" if token else "")

    if "bilibili.com" in host:
        m = re.search(r"/video/(BV[0-9A-Za-z]+)", u.path)
        if m:
            return f"https://www.bilibili.com/video/{m.group(1)}"

    if "tieba.baidu.com" in host:
        m = re.search(r"/p/(\d+)", u.path)
        if m:
            return f"https://tieba.baidu.com/p/{m.group(1)}"

    return url
