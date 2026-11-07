async page => {
  // ------------------------------------------------------------------
  // 1. Inject hooks BEFORE load, so every XHR/fetch is observable.
  // ------------------------------------------------------------------
  await page.addInitScript(() => {
    try { performance.setResourceTimingBufferSize(3000); } catch (e) {}
    window.__probeReqs = [];
    const push = o => { try { window.__probeReqs.push(o); } catch (e) {} };

    const origFetch = window.fetch;
    window.fetch = async function (...args) {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) || '';
      const opts = args[1] || {};
      const h = {};
      try { new Headers(opts.headers || {}).forEach((v, k) => { h[k] = String(v); }); } catch (e) {}
      const entry = { url, method: (opts.method || 'GET').toUpperCase(), headers: h };
      push(entry);
      try {
        const res = await origFetch.apply(this, args);
        entry.status = res.status;
        entry.ct = res.headers.get('content-type') || '';
        return res;
      } catch (e) { entry.error = String(e).slice(0, 60); throw e; }
    };

    const xhrMap = new WeakMap();
    const OrigOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      const entry = { url: String(url), method: String(method).toUpperCase(), headers: {} };
      xhrMap.set(this, entry);
      push(entry);
      this.addEventListener('load', () => {
        entry.status = this.status;
        entry.ct = this.getResponseHeader('content-type') || '';
      });
      return OrigOpen.apply(this, arguments);
    };
    const OrigSetHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function (k, v) {
      const e = xhrMap.get(this);
      if (e) e.headers[k] = String(v);
      return OrigSetHeader.apply(this, arguments);
    };
  });

  // ------------------------------------------------------------------
  // 2. Reload so hooks see the whole load sequence.
  // ------------------------------------------------------------------
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  // ------------------------------------------------------------------
  // 3. Generic interactions: open comment panel, then scroll it.
  // ------------------------------------------------------------------
  await page.evaluate(() => {
    const ic = document.querySelector(
      '[data-e2e="feed-comment-icon"], [class*=comment-icon], [aria-label*=评论]'
    );
    if (ic) ic.click();
  });

  // Wait for a comment-ish request instead of assuming a fixed delay.
  let sawComment = false;
  let waited = 0;
  for (let i = 0; i < 18; i++) {
    await page.waitForTimeout(800);
    waited += 800;
    sawComment = await page.evaluate(() =>
      (window.__probeReqs || []).some(r => /comment|reply/i.test(r.url))
    );
    if (sawComment) break;
  }

  await page.evaluate(() => {
    const list =
      document.querySelector('[data-e2e="comment-list"]') ||
      document.querySelector('[class*=comment-list]') ||
      document.querySelector('#comment');
    if (list) {
      list.scrollIntoView({ block: 'center' });
      let el = list;
      for (let i = 0; i < 6 && el; i++) {
        if (el.scrollHeight > el.clientHeight + 10) el.scrollTop = el.scrollHeight;
        el = el.parentElement;
      }
    }
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Let the lazily-triggered requests arrive, then re-read once more.
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  const reqs = await page.evaluate(() => window.__probeReqs || []);

  // ------------------------------------------------------------------
  // 4. Filter and rank candidates.
  // ------------------------------------------------------------------
  const skip = /\.(js|css|png|jpg|jpeg|webp|gif|svg|woff2?|ttf|otf|mp4|m4s|webm|ico)(\?|$)/i;
  const cdn = /(xhscdn|douyinpic|hdslb|byteimg|ibytedapm|pstatp|snssdk)/i;
  const noise = /(data\.|(\/|\.)log(\/|\.|\?|$)|track|beacon|report|stat|metric|monitor|sentry|analytics|log-sdk|slardar)/i;

  const uniq = [...new Map(reqs.map(r => [r.url, r])).values()]
    .filter(r => r.url && !skip.test(r.url) && !cdn.test(r.url) && !noise.test(r.url));

  const scored = uniq.map(r => ({
    ...r,
    score:
      (/\/api\//.test(r.url) ? 2 : 0) +
      (/aweme|graphql|rest|x\/|v\d+/.test(r.url) ? 1 : 0) +
      (r.url.includes('?') ? 1 : 0) +
      (/comment|reply|subtitle|caption|chapter|detail|view|feed|note/i.test(r.url) ? 3 : 0),
  })).sort((a, b) => b.score - a.score).slice(0, 12);

  // ------------------------------------------------------------------
  // 5. Replay top candidates with their original headers.
  // ------------------------------------------------------------------
  const results = [];
  for (const r of scored) {
    try {
      const url = r.url.startsWith('//') ? 'https:' + r.url : r.url;
      const out = await page.evaluate(async ({ url, method, headers }) => {
        const h = {};
        for (const [k, v] of Object.entries(headers || {})) {
          const lk = k.toLowerCase();
          if (['cookie', 'host', 'content-length', 'origin', 'referer', 'user-agent', 'connection'].includes(lk)) continue;
          h[k] = v;
        }
        const res = await fetch(url, { method, headers: h, credentials: 'include' });
        const ct = res.headers.get('content-type') || '';
        const text = (await res.text()).slice(0, 2200);
        return { status: res.status, ct, text };
      }, { url, method: r.method, headers: r.headers });

      const lower = out.text.toLowerCase();
      const binary = /octet-stream|protobuf|application\/zip/.test(out.ct);
      const kind =
        /"replies"|"comments"|"comment_list"|"commentlist"|"sub_comments"/.test(lower) ? 'comments' :
        /"subtitle"|"subtitles"|"caption"|"vtt"|"srt"|ai-zh|webvtt|subtitle\.bilibili/.test(lower) ? 'subtitle' :
        /"chapter"|"chapters"|"points"|"video_chapters"/.test(lower) ? 'chapters' :
        /"title"/.test(lower) && /"author"|"owner"|"user"|"uploader"/.test(lower) ? 'meta' :
        binary ? 'binary' : 'other';

      results.push({
        url: url.slice(0, 150),
        method: r.method,
        score: r.score,
        status: out.status,
        contentType: out.ct.slice(0, 40),
        authHeader: !!(r.headers && (r.headers['x-s'] || r.headers['X-S'] || r.headers['x-t'])),
        kind,
        head: out.text.slice(0, 90).replace(/\s+/g, ' '),
      });
    } catch (e) {
      results.push({ url: r.url.slice(0, 150), method: r.method, error: String(e).slice(0, 50) });
    }
  }

  // ------------------------------------------------------------------
  // 6. DOM + embedded-state capability detection.
  // ------------------------------------------------------------------
  const dom = await page.evaluate(() => {
    let embedded = false;
    let embeddedHasComments = false;
    const scan = (o, d) => {
      if (d > 6 || !o || typeof o !== 'object') return false;
      try {
        for (const [k, val] of Object.entries(o)) {
          if (/comments|replies|commentList/i.test(k)) {
            if (Array.isArray(val) ? val.length > 0 : !!val) return true;
          }
          if (val && typeof val === 'object' && scan(val, d + 1)) return true;
        }
      } catch (e) {}
      return false;
    };
    for (const key of ['__INITIAL_STATE__', '__NEXT_DATA__', 'ytInitialData']) {
      try {
        if (window[key]) {
          embedded = true;
          if (scan(window[key], 0)) embeddedHasComments = true;
        }
      } catch (e) {}
    }
    return {
      url: location.href,
      title: document.title,
      video: document.querySelectorAll('video').length,
      track: document.querySelectorAll('track').length,
      commentish: document.querySelectorAll('[class*=comment],[data-e2e*=comment]').length,
      chapterish: document.querySelectorAll('[class*=chapter]').length,
      embedded,
      embeddedHasComments,
    };
  });

  // ------------------------------------------------------------------
  // 7. Capability summary with source + confidence.
  // ------------------------------------------------------------------
  const best = k => results.find(r => r.kind === k && r.status >= 200 && r.status < 300);

  const capabilities = {
    comments: best('comments')
      ? { source: 'api', confidence: 'high', url: best('comments').url }
      : dom.embeddedHasComments
        ? { source: 'ssr', confidence: 'medium' }
        : dom.commentish > 0
          ? { source: 'dom', confidence: 'low' }
          : { source: 'none', confidence: 'none' },
    subtitle: best('subtitle')
      ? { source: 'api', confidence: 'high', format: /webvtt|vtt|srt/.test(best('subtitle').head) ? 'text' : 'unknown', url: best('subtitle').url }
      : dom.track > 0
        ? { source: 'track', confidence: 'medium' }
        : { source: 'none', confidence: 'none' },
    chapters: best('chapters')
      ? { source: 'api', confidence: 'high', url: best('chapters').url }
      : dom.chapterish > 0
        ? { source: 'dom', confidence: 'medium' }
        : { source: 'none', confidence: 'none' },
  };

  const notes = [];
  if (sawComment) notes.push(`comment-ish request observed after ${waited}ms`);
  if (results.some(r => r.kind === 'binary')) notes.push('binary payload detected; may need a platform-specific decoder');
  if (results.some(r => r.status === 406 || r.status === 401 || r.status === 403)) notes.push('some replays were rejected; signature/header context may be required');

  return JSON.stringify({
    url: dom.url,
    title: dom.title,
    capabilities,
    dom: { video: dom.video, track: dom.track, commentish: dom.commentish, chapterish: dom.chapterish, embedded: dom.embedded },
    totalRequests: reqs.length,
    candidates: results,
    notes,
  });
}
