// Hash router for GitHub Pages: #/week/week-01/learn/habits/2
// Hash text is only ever used as data (matched against known ids), never as HTML.

const SAFE_SEGMENT = /^[a-z0-9-]{1,40}$/i;

export function parseHash(hash = window.location.hash) {
  let raw = hash.replace(/^#/, '');
  if (!raw.startsWith('/')) raw = '/' + raw;
  const [pathPart, queryPart = ''] = raw.split('?');
  let segments;
  try {
    segments = pathPart.split('/').filter(Boolean).map((s) => decodeURIComponent(s));
  } catch {
    return { segments: [], query: {}, bad: true };
  }
  const bad = segments.some((s) => !SAFE_SEGMENT.test(s));
  const query = {};
  for (const pair of queryPart.split('&')) {
    if (!pair) continue;
    const [k, v = ''] = pair.split('=');
    try {
      const key = decodeURIComponent(k);
      const val = decodeURIComponent(v);
      if (SAFE_SEGMENT.test(key) && /^[a-z0-9-]{0,20}$/i.test(val)) query[key] = val;
    } catch { /* ignore broken pair */ }
  }
  return { segments: bad ? [] : segments, query, bad };
}

export function buildHash(segments, query = {}) {
  const path = '#/' + segments.map((s) => encodeURIComponent(s)).join('/');
  const q = Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== '');
  return q.length ? `${path}?${q.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}` : path;
}

export function go(segments, query, { replace = false } = {}) {
  const hash = buildHash(segments, query);
  if (replace) {
    window.history.replaceState(null, '', hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else if (window.location.hash !== hash) {
    window.location.hash = hash;
  } else {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
}

/** Match parsed segments to a route name + params. */
export function matchRoute({ segments, query, bad }) {
  if (bad) return { name: 'bad' };
  const [a, b, c, d, e] = segments;
  if (!a) return { name: 'home' };
  if (a === 'weeks' && !b) return { name: 'weeks' };
  if (a === 'teacher' && !b) return { name: 'teacher' };
  if (a === 'week' && b) {
    const weekId = b;
    if (!c) return { name: 'week', weekId };
    if (c === 'words') return { name: 'words', weekId, index: d, view: query.view, set: query.set };
    if (c === 'examples') return { name: 'examples', weekId, example: d, mode: e };
    if (c === 'challenge') return { name: e === 'play' || d === 'play' ? 'practise-play' : 'challenge', weekId, bank: 'challenge', query };
    if (c === 'progress') return { name: 'progress', weekId };
    if (c === 'certificate') return { name: 'certificate', weekId };
    if (c === 'worksheet') return { name: 'worksheet', weekId, query };
    if (c === 'learn') return { name: 'learn', weekId, topic: d, step: e };
    if (c === 'practise') {
      if (!d) return { name: 'practise-menu', weekId, query };
      if (e === 'play' || !e) return { name: e === 'play' ? 'practise-play' : 'practise-setup', weekId, bank: d, query };
    }
    if (c === 'play') return { name: 'play', weekId, game: d };
    if (c === 'speak') return { name: 'speak', weekId, index: d };
  }
  return { name: 'not-found' };
}
