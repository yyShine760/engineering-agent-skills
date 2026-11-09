---
name: content-insight
description: Retrieve and analyze content from any platform — video, image-text notes, forum threads, or articles — when the user provides a URL and wants a summary, body text, chapters, subtitles, comments, or replies. Works with YouTube, Douyin, Xiaohongshu, Bilibili, Tieba, X/Twitter, Weibo, Zhihu, and unfamiliar sites by probing the page generically first.
---

# Content Insight

## When to use

- 用户给出任意平台的链接，要求总结、正文、评论、字幕、章节、回复
- 内容类型可能是视频、图文笔记、论坛帖子、推文、文章
- 不要先假设平台，也不要先假设内容类型

## Core rule

`probe` 是平台无关的。它先判断 `content_type`，再决定抓什么。
平台差异放在 `reference.md` 的 notes 里，作为提示，不作为代码路径。

## Step 1 — probe

```bash
python3 <skill-dir>/scripts/probe.py "<url>" \
  --session <session-name> --profile <profile-path> [--direct] [--close]
```

默认保留浏览器会话，方便后续 `extract.py` 复用同一个 session；只有 `--close` 才关闭。

`probe.py` 会自动归一化 URL：`douyin.com/user/self?modal_id=...` → `douyin.com/video/<id>`，输出里的 `normalizedUrl` 是实际打开的地址。

参数选择：

| 目标 | 网络 | 建议 profile |
|---|---|---|
| YouTube / X | 继承代理（不加 `--direct`） | `~/.config/probe-profile` |
| 抖音 / 小红书 / B 站 / 贴吧 / 微博 / 知乎 | `--direct` | 对应平台 profile |

第一次用某个 profile 时可能需要人工扫码；之后复用。

输出重点：

```json
{
  "platform": "unknown|douyin|xiaohongshu|bilibili|youtube|tieba|x|weibo|zhihu",
  "contentType": "video|image_text|thread|article",
  "preview": {
    "title": "...",
    "description": "...",
    "body": "...",
    "bodySource": "jsonld|og|dom|none",
    "images": ["..."],
    "video": "...",
    "chapters": [ { "start": "00:23", "title": "..." } ]
  },
  "capabilities": {
    "comments": { "source": "api|ssr|dom|none", "confidence": "high|medium|low|none" },
    "subtitle": { "source": "api|track|none", "format": "text|unknown" },
    "chapters": { "source": "api|dom|none" }
  },
  "candidates": [ { "kind": "comments|subtitle|chapters|meta|binary|other", "url": "..." } ]
}
```

## Step 2 — 执行抽取

probe 给出 capabilities 后，用 `extract.py` 执行：

```bash
python3 <skill-dir>/scripts/extract.py "<url>" \
  --source text|ssr|api|dom \
  --limit 10 [--selector "CSS"] [--api-url URL] [--cursor C] [--max-pages 1] \
  --session <name> --profile <path> [--direct]
```

- `text`：直接读 `document.body.innerText`；带 `--selector` 时只取匹配元素，返回 `texts`。**默认优先用它**——最便宜，也不会像启发式那样猜错。
- `ssr`：从 `__INITIAL_STATE__` / `__NEXT_DATA__` / `ytInitialData` 提取正文、图片、评论。
- `api`：重放 probe 发现的评论接口；`--api-url` 必填，`--cursor` 可选。
- `dom`：无结构化数据时的启发式兜底，低置信度。

正确的选择顺序：`text` → `api` / `ssr`（有结构化数据时）→ `dom`。

输出已经是统一 schema；如果某字段为空，先看 `warnings`。

## Step 3 — 按 content_type + source 执行

### contentType = "video"

- `comments` / `chapters` / `subtitle` 按 capabilities 走
- 没有字幕时走 ASR；没有章节时用字幕切分或从 transcript 生成
- 需要画面内容时抽帧 + 视觉模型，不要用章节摘要冒充

### contentType = "image_text"

- 正文：优先 `preview.body`，不够再从 DOM 的正文容器取全文
- 图片：`preview.images`，按原图 URL 去重；需要内容时下载后 OCR/视觉模型
- 评论：按 `comments.source` 执行（API / SSR / DOM）
- 不需要字幕/章节

### contentType = "thread"

- 主帖：`preview.body`
- 回复链：优先找返回楼层数组的接口；DOM 方式要按楼层 id 去重
- 楼中楼：区分一级回复与二级回复，保留父子关系
- 常见平台：贴吧、X/Twitter、微博、知乎

### contentType = "article"

- 正文：`preview.body`（`bodySource` 标注来源）
- 图片：`preview.images`
- 评论：按 `comments.source`

## Step 4 — source 细节

### comments.source = "api"

1. 取 `candidates` 里 `kind=comments` 且 `status=200` 的 URL
2. 页面内 `fetch(url, {credentials:'include'})`
3. 翻页只替换分页参数（`cursor` / `offset` / `page` / `pagination_str`），其余原样
4. 每页间隔 1.5–2 秒
5. `406/401/403` → 需要签名/头部上下文，不要硬试；改用页面模板或标记 unavailable

### comments.source = "ssr"

从页面全局状态里取：

- `window.__INITIAL_STATE__`
- `window.__NEXT_DATA__`
- `window.ytInitialData`

取到多少算多少，标注 `source: ssr`。

### comments.source = "dom"

1. 先用 `document.querySelectorAll('[class*=comment], [data-e2e*=comment]')` 统计候选
2. 虚拟列表和 `aria-hidden` 内容不在可访问性树里，`snapshot` 只作辅助，不要作为主路径
3. 滚动容器本身（不是 `window`）
4. 边滚边收，按 id 去重
5. 找不到结构时退回 `extract.py --source text`

### subtitle.source = "api" / "track"

- `format: text` → 下载 VTT/SRT，解析成 `{start, end, text}`
- `format: unknown` / `content-type: octet-stream` → 可能是 protobuf，不要猜 schema，走 ASR

### subtitle.source = "none"

先做环境自检：

```bash
command -v ffmpeg || echo "ffmpeg missing"
python3 -c "import faster_whisper" 2>/dev/null || echo "faster_whisper missing"
```

降级链，逐级标注：

1. ASR：下载音轨 → faster-whisper → `source: asr`
2. OCR：抽帧 → tesseract → `source: ocr`
3. 工具缺失：`source: unavailable`，不要给跑不起来的方案
4. 都没有：`source: none`，不要伪造

### chapters.source = "api" / "dom"

- `api`：按字段解析（`chapters` / `points` / `video_chapters`）
- `dom`：抖音等平台把章节渲染成普通文本，**直接读 `innerText` 比猜选择器稳**；probe 的 `preview.chapters` 已给出前几条
- `none`：用字幕切分，或从 transcript 生成，标注 `source: derived`

## Step 5 — 输出

统一 schema：

```json
{
  "platform": "unknown|douyin|xiaohongshu|bilibili|youtube|tieba|x|weibo|zhihu",
  "content_type": "video|image_text|thread|article",
  "meta": {
    "title": "",
    "author": "",
    "published_at": "",
    "stats": {}
  },
  "body": "",
  "media": {
    "video": "",
    "images": []
  },
  "chapters": [ { "start": 0, "title": "", "desc": "" } ],
  "transcript": { "source": "api|asr|ocr|none", "segments": [] },
  "comments": [ { "author": "", "text": "", "likes": 0, "replies": [] } ],
  "capabilities": {
    "chapters": false,
    "subtitle": false,
    "comment_paging": false
  }
}
```

## Judgment rules

1. **有来源才算有**：空数组不等于"没有评论"，区分 `none` 与 `not_fetched`
2. **标注 confidence**：API 200 为 high；SSR 为 medium；DOM 启发式为 low
3. **验证码/登录墙**：停下，请用户人工完成，不要代点
4. **频率**：每页 1.5–2 秒；同一内容不要反复整轮重抓
5. **二进制**：`octet-stream` / `protobuf` 不要用文本正则硬解
6. **不要假装看过**：章节摘要、弹幕、评论都是文本来源；"画面里有什么"必须走抽帧 + 视觉模型

## Engine choice

当前 probe 使用 Playwright 驱动浏览器，因为登录态、签名、SPA 都靠它。
如果目标站点是静态页面或纯 API，可以改用 HTTP / `yt-dlp`，成本更低：

```
HTTP + 结构化数据  →  yt-dlp  →  browser (playwright)
   （最便宜）                    （最通用、最贵）
```

详见 `reference.md`。

## Platform notes

只有当 probe 返回的 `platform` 命中已知平台时才读 `reference.md` 对应小节。
notes 只写"probe 之后通常还要补什么"，不写抓取代码。
