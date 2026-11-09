"""Shared helpers for content-insight scripts."""
import re
from urllib.parse import parse_qs, urlparse


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
