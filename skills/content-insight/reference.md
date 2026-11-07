# Content Insight — Reference

## Unified schema

| 字段 | 说明 |
|---|---|
| `platform` | 只在 probe 或 URL 明确时填；不确定写 `unknown` |
| `content_type` | `video` / `image_text` / `thread` / `article` |
| `meta.title` | 标题 |
| `meta.author` | 作者 / UP 主 / 楼主 |
| `meta.published_at` | 发布时间，统一为 ISO 或平台原样 |
| `meta.stats` | 播放、点赞、评论、转发等，字段因平台而异 |
| `body` | 正文 / 描述 / 推文文本 / 主帖内容 |
| `media.video` | 视频 URL 或平台内部 ID |
| `media.images` | 图片列表，原图优先 |
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

- `content_type`：通常 `video`
- **comments**：probe 通常能发现 `/aweme/v1/web/comment/list/`，请求可能延迟 6–8 秒
- 重放只替换 `cursor` / `count`，`a_bogus` / `msToken` / `uifid` 原样保留
- **楼中楼**：`/aweme/v1/web/comment/list/reply/`，替换 `comment_id` / `cursor`
- **chapters**：DOM 里 `.CF6KbEyh`，格式为「时间戳 + 标题 + 描述」
- **subtitle**：无 `<track>`，无字幕接口；只能 ASR / OCR
- **body**：视频文案通常在 `video-detail` 或 `preview.description`
- **网络**：代理下通常可用，直连更稳

### 小红书 / xiaohongshu.com

- `content_type`：`video` 或 `image_text`
- **comments**：首屏 10 条在 `window.__INITIAL_STATE__.note.noteDetailMap[noteId].comments.list`，优先走 SSR
- 翻页 `/api/sns/web/v2/comment/page`，需要 `x-s` header；裸 `fetch` 通常 406
- **图文正文**：`note.desc`；**图片**：`note.imageList`
- **视频**：`note.video.media.stream`
- **chapters**：无
- **subtitle**：无
- **网络**：**必须国内直连**，代理 IP 会返回 `300012 IP at risk`
- **登录**：扫码后可用；未登录只能看公开部分

### B 站 / bilibili.com

- `content_type`：`video`（专栏是 `article`）
- **comments**：`/x/v2/reply/wbi/main`，一次命中；热门评论 `mode=3` 可能只有一页
- **subtitle**：`/x/v2/subtitle/web/view`，可能是 protobuf
- **danmaku**：`/x/v2/dm/web/view`，protobuf，不是 JSON
- **chapters**：无原生章节字段；DOM 可能有分P/热门时刻
- **网络**：直连

### YouTube

- `content_type`：`video`
- 优先 `yt-dlp`，不要走 probe：
  - 元数据/章节：`yt-dlp --dump-json`
  - 字幕：`--write-subs --write-auto-subs --sub-langs "zh-Hans,en"`
  - 评论：`--write-comments --extractor-args "youtube:comment_sort=top;max_comments=20"`
- **网络**：需要代理
- **注意**：`--dump-json` 可能提示缺少 JS runtime，不影响元数据/字幕

### 贴吧 / tieba.baidu.com

- `content_type`：`thread`
- **主帖**：DOM 正文；`preview.body` 可能只取到摘要
- **回复**：楼层列表通常分页加载，需要滚动或翻页
- **楼中楼**：楼内回复单独展开
- 需要登录才能看部分楼 / 发帖人信息
- **网络**：直连

### X / Twitter

- `content_type`：`thread`（推文串）或 `article`
- 需要登录；未登录只能看部分推文
- API v2 收费；优先浏览器
- 回复链需要点 "Show more replies" 展开
- 视频/图片在 `media` 里单独提取
- **网络**：需要代理

### 微博 / weibo.com

- `content_type`：`thread` 或 `article`
- 需要登录；评论接口有签名
- 正文在 `preview.body`；图片在 `preview.images`
- **网络**：直连

### 知乎 / zhihu.com

- `content_type`：`article`（回答/文章）或 `thread`（问题页）
- 正文优先 `__INITIAL_STATE__` / JSON-LD
- 评论接口需要签名；DOM 方式要滚动加载
- **网络**：直连

### 未知平台

- 先跑 probe
- 优先找：JSON-LD、OpenGraph、`__NEXT_DATA__`、`__INITIAL_STATE__`
- 再找：返回数组且含 `author` / `text` / `like` 的接口
- 最后：DOM 启发式
- 失败就标注 `unavailable`，不要编造

## Engine choice

```
HTTP + 结构化数据  →  yt-dlp  →  browser (playwright)
   （最便宜）                    （最通用、最贵）
```

- **HTTP**：静态页面、公开 API、JSON-LD / OG。适合新闻、博客、文档站。
- **yt-dlp**：YouTube、B 站视频等。字幕/章节/评论都有原生支持。
- **browser**：SPA、登录态、签名接口。中文社交平台基本都要走这一档。

当前 `probe.py` 只实现 browser 档；另外两档可以在需要时直接调用，不必都塞进 probe。

## Known limits

1. **强签名接口**：抖音 `a_bogus`、小红书 `x-s`、B 站 `wbi`。原样重放通常有效；改参数后可能失效。
2. **二进制协议**：protobuf（B 站字幕/弹幕）无法用文本正则解析。
3. **验证码/登录墙**：必须人工。
4. **画面理解**：probe 只处理文本/接口；"画面里有什么"需要抽帧 + 视觉模型。
5. **平台改版**：DOM 选择器和接口路径会变；notes 过期时退回 probe 的通用路径。
6. **隐私与合规**：只采集公开内容；控制频率；不要用于批量商用或绕过访问控制。
