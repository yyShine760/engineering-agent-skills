# Video Insight — Reference

## Unified schema

| 字段 | 说明 |
|---|---|
| `platform` | 只在 probe 或 URL 明确时填；不确定写 `unknown` |
| `meta.title` | 视频标题 |
| `meta.author` | 作者/UP 主 |
| `meta.duration` | 秒 |
| `meta.stats` | 播放、点赞、评论数等，字段因平台而异 |
| `chapters[].start` | 秒或 `HH:MM:SS` |
| `chapters[].title` | 章节标题 |
| `chapters[].desc` | 章节描述，没有就空字符串 |
| `transcript.source` | `api` / `asr` / `ocr` / `derived` / `none` |
| `transcript.segments[]` | `{start, end, text}` |
| `comments[].author` | 昵称 |
| `comments[].text` | 原文，保留表情文本 |
| `comments[].likes` | 数字 |
| `comments[].replies[]` | 楼中楼，结构同 comments |
| `capabilities` | 显式声明哪些能力真的拿到了 |

## Platform notes（probe 之后的注意事项）

### 抖音 / douyin.com

- **comments**：probe 通常能发现 `/aweme/v1/web/comment/list/`，但请求可能延迟 6–8 秒，必须事件驱动等待
- 重放只替换 `cursor` / `count`，`a_bogus` / `msToken` / `uifid` 原样保留
- **楼中楼**：`/aweme/v1/web/comment/list/reply/`，替换 `comment_id` / `cursor`
- **chapters**：DOM 里 `.CF6KbEyh` 容器，格式为「时间戳 + 标题 + 描述」，可直接解析
- **subtitle**：无 `<track>`，无字幕接口；只能 ASR / OCR
- **网络**：代理下通常可用，直连更稳
- **登录**：需要扫码；profile 可复用

### 小红书 / xiaohongshu.com

- **comments**：首屏 10 条在 `window.__INITIAL_STATE__.note.noteDetailMap[noteId].comments.list`，**优先走 SSR**
- 翻页接口 `/api/sns/web/v2/comment/page`，需要 `x-s` header；probe 的裸 `fetch` 通常返回 406
- **chapters**：无
- **subtitle**：无
- **网络**：**必须国内直连**，代理 IP 会返回 `300012 IP at risk`
- **登录**：扫码后可用；未登录只能看公开部分

### B 站 / bilibili.com

- **comments**：`/x/v2/reply/wbi/main`，一次命中；热门评论 `mode=3` 可能只有一页
- **subtitle**：`/x/v2/subtitle/web/view`，可能是 protobuf；`content-type: application/octet-stream` 时不要当 JSON
- **danmaku**：`/x/v2/dm/web/view`，protobuf，不是 JSON
- **chapters**：无原生章节字段；DOM 可能有分P/热门时刻
- **网络**：直连
- **登录**：公开视频不需要；高画质/部分字幕可能需要

### YouTube

- 优先用 `yt-dlp`，不要走 probe：
  - 元数据/章节：`yt-dlp --dump-json`
  - 字幕：`--write-subs --write-auto-subs --sub-langs "zh-Hans,en"`
  - 评论：`--write-comments --extractor-args "youtube:comment_sort=top;max_comments=20"`
- **网络**：需要代理
- **注意**：`--dump-json` 可能提示缺少 JS runtime，不影响元数据/字幕

### 未知平台

- 先跑 probe
- 优先找：JSON-LD、OpenGraph、`__NEXT_DATA__`、`__INITIAL_STATE__`
- 再找：返回数组且含 `author`/`text`/`like` 的接口
- 最后：DOM 启发式
- 失败就标注 `unavailable`，不要编造

## Known limits

1. **强签名接口**：抖音 `a_bogus`、小红书 `x-s`、B 站 `wbi`。原样重放通常有效；改参数后可能失效。
2. **二进制协议**：protobuf（B 站字幕/弹幕）无法用文本正则解析。
3. **验证码/登录墙**：必须人工。
4. **画面理解**：probe 只处理文本/接口；"画面里有什么"需要抽帧 + 视觉模型。
5. **平台改版**：DOM 选择器和接口路径会变；notes 过期时退回 probe 的通用路径。
