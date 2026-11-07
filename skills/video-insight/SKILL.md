---
name: video-insight
description: Analyze a video from any platform when the user provides a video URL and wants a summary, chapters, transcript/subtitles, or comments. Works with YouTube, Douyin, Xiaohongshu, Bilibili, and unfamiliar sites by probing the page generically first. Use this when the user says "看这个视频", "总结这条视频", "读评论", "抓字幕", or "分析这个链接".
---

# Video Insight

## When to use

- 用户给出任意平台的视频链接，要求总结、看章节、读字幕、抓评论
- 用户没有指定平台，或者平台不在常见名单里
- 不要先假设平台；先探测

## Core rule

`probe` 是平台无关的。它只发现候选、标注能力，不承诺"支持某平台"。
平台差异放在 `reference.md` 的 notes 里，作为提示，不作为代码路径。

## Step 1 — probe

```bash
python3 <skill-dir>/scripts/probe.py "<video-url>" \
  --session <session-name> --profile <profile-path> [--direct]
```

参数选择：

| 目标 | 网络 | 建议 profile |
|---|---|---|
| YouTube | 继承代理（不加 `--direct`） | `~/.config/yt-profile` |
| 抖音 | `--direct` 或代理均可 | `~/.config/douyin-profile` |
| 小红书 | **必须 `--direct`** | `~/.config/xhs-profile` |
| B 站 | `--direct` | `~/.config/bili-profile` |

第一次用某个 profile 时，需要人工扫码登录；之后复用。

输出是一段 JSON，重点看：

```json
{
  "capabilities": {
    "comments":  { "source": "api|ssr|dom|none", "confidence": "high|medium|low|none" },
    "subtitle":  { "source": "api|track|none", "format": "text|unknown" },
    "chapters":  { "source": "api|dom|none" }
  },
  "candidates": [ { "kind": "comments|subtitle|chapters|meta|binary|other", "url": "...", "status": 200 } ],
  "notes": [ "... " ]
}
```

## Step 2 — 按 source 执行

### comments.source = "api"

1. 取 `candidates` 里 `kind=comments` 且 `status=200` 的 URL
2. 在页面内 `fetch(url, {credentials:'include'})`
3. 翻页只替换分页参数（`cursor` / `offset` / `pagination_str`），其余参数原样保留
4. 每页间隔 1.5–2 秒
5. 若返回 `406/401/403`，说明缺签名/头部上下文：
   - 不要硬试
   - 回到 `playwright-cli requests` 找一条刚发出的真实请求，复制其 header（尤其 `x-s` / `x-t`）
   - 仍失败则标记 `comments: unavailable`，改用 SSR/DOM/人工

### comments.source = "ssr"

从页面全局状态里取，不要重放接口：

- `window.__INITIAL_STATE__`
- `window.__NEXT_DATA__`
- `window.ytInitialData`

常见路径：`note.noteDetailMap[id].comments.list`（小红书）、`props.pageProps`（Next.js）。
取到多少算多少，标注 `source: ssr`。

### comments.source = "dom"

1. `playwright-cli --raw snapshot` 找评论容器
2. 滚动容器本身（不是 `window`），触发懒加载
3. 边滚边收，按 `id` 去重
4. 虚拟列表会卸载节点，不要"滚到底再抓"

### subtitle.source = "api" / "track"

- `format: text`：直接下载 VTT/SRT，解析成 `{start, end, text}`
- `format: unknown` 或 `contentType: octet-stream`：可能是 protobuf
  - 不要猜 schema
  - 标记 `subtitle: unavailable (binary)`，走 ASR 兜底

### subtitle.source = "none"

降级链，逐级标注来源：

1. **ASR**：下载音轨 → faster-whisper → `source: asr`
2. **OCR**：抽帧 → tesseract → `source: ocr`
3. 都没有：`source: none`，不要伪造

### chapters.source = "api" / "dom"

- `api`：按字段解析（`chapters` / `points` / `video_chapters`）
- `dom`：按时间戳正则提取，例如 `00:23 标题`
- `none`：用字幕按时间切分，或让模型从 transcript 生成，标注 `source: derived`

## Step 3 — 输出

统一 schema：

```json
{
  "platform": "unknown|douyin|xiaohongshu|bilibili|youtube",
  "meta": { "title": "", "author": "", "duration": 0, "stats": {} },
  "chapters": [ { "start": 0, "title": "", "desc": "" } ],
  "transcript": { "source": "api|asr|ocr|none", "segments": [] },
  "comments": [ { "author": "", "text": "", "likes": 0, "replies": [] } ],
  "capabilities": { "chapters": true, "subtitle": false, "comment_paging": true }
}
```

## Judgment rules

1. **有来源才算有**：空数组不等于"没有评论"，要区分 `none` 和 `not_fetched`
2. **标注 confidence**：API 200 为 high；SSR 为 medium；DOM 启发式为 low
3. **验证码/登录墙**：停下，请用户人工完成，不要代点
4. **频率**：每页 1.5–2 秒；同一视频不要反复整轮重抓
5. **二进制**：`octet-stream` / `protobuf` 不要用文本正则硬解
6. **不要假装看过**：章节摘要、弹幕、评论都是文本来源，不等于看画面；如果用户问"画面里有什么"，必须走抽帧 + 视觉模型

## Platform notes

只有当 probe 返回的 host 命中已知平台时，才读 `reference.md` 对应小节。
notes 只写"probe 之后通常还要补什么"，不写抓取代码。

- 抖音：接口重放可翻页；章节在 DOM；无字幕
- 小红书：首屏评论优先走 SSR；翻页接口可能需要 `x-s`
- B 站：评论接口通常一次命中；字幕/弹幕可能是 protobuf
- YouTube：优先 `yt-dlp`，字幕/章节/评论都有原生支持
