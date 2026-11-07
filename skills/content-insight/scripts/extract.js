async page => {
  const args = __ARGS__;
  const warnings = [];

  await page.waitForTimeout(3000);

  const platform = await page.evaluate(() => {
    const h = location.hostname;
    return /douyin/.test(h) ? 'douyin' :
      /xiaohongshu/.test(h) ? 'xiaohongshu' :
      /bilibili/.test(h) ? 'bilibili' :
      /youtube/.test(h) ? 'youtube' :
      /tieba/.test(h) ? 'tieba' :
      /(x\.com|twitter\.com)/.test(h) ? 'x' :
      /weibo/.test(h) ? 'weibo' :
      /zhihu/.test(h) ? 'zhihu' : 'unknown';
  });

  const textOf = v => (typeof v === 'string' ? v : v == null ? '' : String(v));

  const normalizeComment = c => {
    const user = c.userInfo || c.user || c.author || c.member || {};
    const author = (user && (user.nickname || user.name || user.uname || user.screen_name)) || c.nickname || c.author_name || '';
    let text = '';
    if (typeof c.content === 'string') text = c.content;
    else if (c.content && typeof c.content.message === 'string') text = c.content.message;
    else if (typeof c.text === 'string') text = c.text;
    else if (typeof c.comment === 'string') text = c.comment;
    else if (typeof c.message === 'string') text = c.message;
    if (!text) {
      if (c.pictures && c.pictures.length) text = '[image]';
      else if (c.video || c.video_url) text = '[video]';
      else text = '[media]';
    }
    const repliesSrc = c.subComments || c.sub_comments || c.replies || c.reply_comment || [];
    const replies = Array.isArray(repliesSrc) ? repliesSrc.map(normalizeComment) : [];
    return {
      id: textOf(c.id || c.cid || c.comment_id || c.rpid || c.commentId || ''),
      author,
      text,
      likes: Number(c.likeCount || c.likes || c.digg_count || c.like_count || c.like || 0) || 0,
      replies,
    };
  };

  const looksLikeComment = c =>
    c && typeof c === 'object' && !Array.isArray(c) &&
    ('content' in c || 'text' in c || 'comment' in c || 'message' in c) &&
    (c.userInfo || c.user || c.author || c.nickname || c.mid || c.uid || c.user_id);

  const collectComments = (root, limit) => {
    const out = [];
    const seen = new Set();
    const add = c => {
      const n = normalizeComment(c);
      const key = n.id || (n.author + '|' + n.text.slice(0, 40));
      if (seen.has(key)) return;
      seen.add(key);
      out.push(n);
    };
    const walk = (o, depth) => {
      if (out.length >= limit || depth > 10 || !o || typeof o !== 'object') return;
      if (Array.isArray(o)) {
        for (const x of o) {
          if (looksLikeComment(x)) add(x);
          else walk(x, depth + 1);
          if (out.length >= limit) return;
        }
        return;
      }
      for (const v of Object.values(o)) walk(v, depth + 1);
    };
    walk(root, 0);
    return out;
  };

  const findContentObject = root => {
    const candidates = [];
    const walk = (o, depth) => {
      if (depth > 8 || !o || typeof o !== 'object') return;
      if (!Array.isArray(o)) {
        const title = o.title || o.noteTitle || o.desc || o.description || o.content_title;
        const user = o.user || o.owner || o.author || {};
        const author = (user && (user.nickname || user.name)) || o.nickname || o.author_name;
        const images = o.imageList || o.images || o.pictures;
        const comments = o.comments || o.commentList;
        if (title && author) {
          const descLen = typeof (o.desc || o.description || '') === 'string'
            ? (o.desc || o.description || '').length
            : 0;
          const score =
            (Array.isArray(images) ? images.length * 10 : 0) +
            (comments ? 5 : 0) +
            (o.video ? 10 : 0) +
            Math.min(descLen / 100, 10);
          candidates.push({ obj: o, score });
        }
      }
      for (const v of Object.values(o)) walk(v, depth + 1);
    };
    walk(root, 0);
    candidates.sort((a, b) => b.score - a.score);
    return candidates.length ? candidates[0].obj : null;
  };

  const preview = await page.evaluate(() => {
    const meta = n => {
      const m = document.querySelector(`meta[name="${n}"], meta[property="${n}"]`);
      return m && m.content ? m.content.trim() : '';
    };
    const imgs = () => {
      const out = [];
      const junk = /(banner|recommend|rcmd|avatar|icon|logo|sprite|qrcode|qr-code|bg-)/i;
      for (const img of document.querySelectorAll('img')) {
        const src = img.currentSrc || img.src || '';
        if (!src || !/^https?:/.test(src) || junk.test(src)) continue;
        if ((img.naturalWidth || 0) < 200 || (img.naturalHeight || 0) < 200) continue;
        if (!out.includes(src)) out.push(src);
        if (out.length >= 9) break;
      }
      return out;
    };
    return {
      title: meta('og:title') || document.title,
      description: meta('og:description') || meta('description'),
      images: imgs(),
      video: (document.querySelector('video') || {}).currentSrc || '',
    };
  });

  const result = {
    platform,
    content_type: 'article',
    meta: { title: preview.title, author: '', published_at: '', stats: {} },
    body: preview.description,
    media: { video: preview.video, images: preview.images },
    chapters: [],
    transcript: { source: 'none', segments: [] },
    comments: [],
    capabilities: { chapters: false, subtitle: false, comment_paging: false },
    source: args.source,
    warnings,
  };

  const applyContent = c => {
    if (!c) return;
    result.meta.title = textOf(c.title || c.noteTitle || c.content_title || result.meta.title);
    result.body = textOf(c.desc || c.description || c.content || c.body || result.body);
    const user = c.user || c.owner || c.author || {};
    result.meta.author = (user && (user.nickname || user.name)) || c.nickname || c.author_name || result.meta.author;
    result.meta.published_at = textOf(c.time || c.create_time || c.publish_time || c.created_at || '');
    if (c.interactInfo) result.meta.stats = c.interactInfo;
    const imgs = c.imageList || c.images || c.pictures || [];
    if (Array.isArray(imgs) && imgs.length) {
      result.media.images = imgs
        .map(x => textOf((x && (x.urlDefault || x.url || x.src)) || x))
        .map(u => u.replace(/^http:/, 'https:'))
        .filter(Boolean)
        .slice(0, 9);
    }
    if (c.video) {
      const v = c.video;
      const u = v.play_addr && v.play_addr.url_list && v.play_addr.url_list[0];
      result.media.video = textOf(u || result.media.video);
    }
    if (c.video || c.videos || c.pages || (c.duration && Number(c.duration) > 0)) {
      result.content_type = 'video';
    } else if (result.media.video || preview.video) {
      result.content_type = 'video';
    } else if (result.media.images.length >= 2) {
      result.content_type = 'image_text';
    }
  };

  const embedded = await page.evaluate(() => {
    const s = window.__INITIAL_STATE__ || window.__NEXT_DATA__ || window.ytInitialData;
    if (!s) return null;
    const safeClone = (v, depth, seen) => {
      if (depth > 9) return null;
      if (v === null || typeof v !== 'object') {
        return typeof v === 'function' ? null : v;
      }
      if (seen.has(v)) return null;
      seen.add(v);
      if (Array.isArray(v)) {
        return v.slice(0, 60).map(x => safeClone(x, depth + 1, seen));
      }
      const out = {};
      let keys = [];
      try { keys = Object.keys(v); } catch (e) { return null; }
      for (const k of keys.slice(0, 120)) {
        try { out[k] = safeClone(v[k], depth + 1, seen); } catch (e) {}
      }
      return out;
    };
    try {
      return JSON.stringify(safeClone(s, 0, new WeakSet()));
    } catch (e) {
      return null;
    }
  });

  let parsed = null;
  if (embedded) {
    try { parsed = JSON.parse(embedded); } catch (e) { parsed = null; }
  }
  if (parsed) {
    const content = findContentObject(parsed);
    applyContent(content);
  }

  if (args.source === 'ssr') {
    if (!parsed) {
      warnings.push('no embedded state found');
    } else {
      const limit = Number(args.limit || 10);
      result.comments = collectComments(parsed, limit);
      if (!result.comments.length) warnings.push('no comment array found in embedded state');
      if (result.comments.length >= limit) result.capabilities.comment_paging = true;
    }
  }

  if (args.source === 'api') {
    if (!args.apiUrl) {
      warnings.push('api source requires --api-url');
    } else {
      const limit = Number(args.limit || 10);
      const maxPages = Number(args.maxPages || 1);
      let cursor = args.cursor || '';
      const all = [];
      const seen = new Set();

      for (let pageNo = 0; pageNo < maxPages && all.length < limit; pageNo++) {
        const payload = await page.evaluate(async ({ apiUrl, cursor }) => {
          const u = new URL(apiUrl, location.origin);
          if (cursor) {
            for (const k of ['cursor', 'offset', 'page']) {
              if (u.searchParams.has(k)) u.searchParams.set(k, cursor);
            }
            if (u.searchParams.has('pagination_str')) {
              u.searchParams.set('pagination_str', JSON.stringify({ offset: cursor }));
            }
          }
          const res = await fetch(u.toString(), { credentials: 'include' });
          const ct = res.headers.get('content-type') || '';
          const body = await res.text();
          return { status: res.status, contentType: ct, body };
        }, { apiUrl: args.apiUrl, cursor });

        if (payload.status < 200 || payload.status >= 300) {
          warnings.push(`api returned ${payload.status}`);
          break;
        }
        let json;
        try { json = JSON.parse(payload.body); } catch (e) {
          warnings.push('api response is not JSON');
          break;
        }

        const batch = collectComments(json, limit - all.length);
        for (const c of batch) {
          const key = c.id || (c.author + '|' + c.text.slice(0, 40));
          if (seen.has(key)) continue;
          seen.add(key);
          all.push(c);
        }

        const nextCursor =
          (json.cursor && (json.cursor.next || json.cursor.next_cursor)) ||
          json.next_cursor || json.nextCursor ||
          (json.data && json.data.cursor && json.data.cursor.next) ||
          '';
        const hasMore =
          json.has_more !== undefined ? !!json.has_more :
          json.hasMore !== undefined ? !!json.hasMore :
          (json.data && json.data.has_more !== undefined) ? !!json.data.has_more :
          !!nextCursor;

        if (!hasMore || !nextCursor || nextCursor === cursor) break;
        cursor = String(nextCursor);
        await page.waitForTimeout(1800);
      }

      result.comments = all;
      result.capabilities.comment_paging = all.length >= limit;
    }
  }

  if (args.source === 'dom') {
    const limit = Number(args.limit || 10);
    const data = await page.evaluate(() => {
      const selectors = [
        '[data-e2e="comment-item"]',
        '[class*=comment-item]',
        '[class*=reply-item]',
        '[class*=l_post]',
        '.l_post',
        '[class*=comment]',
      ];
      const seen = new Set();
      const kept = [];
      const items = [];
      for (const sel of selectors) {
        for (const el of document.querySelectorAll(sel)) {
          if (seen.has(el)) continue;
          if (kept.some(p => p.contains(el))) continue;
          seen.add(el);
          const text = (el.innerText || '').trim();
          if (text.length < 8) continue;
          kept.push(el);
          items.push(text);
        }
        if (items.length >= 30) break;
      }
      const bodyEl =
        document.querySelector('.d_post_content') ||
        document.querySelector('[class*=post_content]') ||
        document.querySelector('[class*=p_content]') ||
        document.querySelector('[class*=article-content]') ||
        document.querySelector('article') ||
        document.querySelector('main');
      return {
        items,
        body: bodyEl ? (bodyEl.innerText || '').trim().slice(0, 800) : '',
        replyish: document.querySelectorAll('[class*=reply],[class*=l_post]').length,
      };
    });

    if (data.body) result.body = data.body;
    result.comments = data.items.slice(0, limit).map(t => {
      const lines = t.split('\n').map(s => s.trim()).filter(Boolean);
      return {
        id: '',
        author: lines[0] || '',
        text: lines.slice(1).join(' ') || lines[0] || '',
        likes: 0,
        replies: [],
      };
    });
    if (result.media.video || preview.video) result.content_type = 'video';
    else if (data.replyish > 3) result.content_type = 'thread';
    else if (result.media.images.length >= 2) result.content_type = 'image_text';
    else result.content_type = 'article';
    warnings.push('dom extraction is heuristic; author/text may be approximate');
    if (result.comments.length >= limit) result.capabilities.comment_paging = true;
  }

  if (!result.meta.title) result.meta.title = preview.title || '';
  if (!result.body) result.body = preview.description || '';
  if (!result.meta.author) warnings.push('author not resolved');

  return JSON.stringify(result);
}
