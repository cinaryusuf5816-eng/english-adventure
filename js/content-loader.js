// Loads JSON content relative to the page (works at / and at /repo-name/).
// Each week is loaded only when it is opened.

const cache = new Map();

export class ContentError extends Error {
  constructor(message, detail) {
    super(message);
    this.detail = detail;
  }
}

export function assetUrl(path) {
  return new URL(path, document.baseURI).href;
}

async function getJSON(path) {
  if (cache.has(path)) return cache.get(path);
  const promise = (async () => {
    let res;
    try {
      res = await fetch(assetUrl(path), { cache: 'no-cache' });
    } catch (err) {
      throw new ContentError('The file could not be loaded.', `${path}: ${err.message}`);
    }
    if (!res.ok) throw new ContentError('The file was not found.', `${path}: HTTP ${res.status}`);
    try {
      return await res.json();
    } catch {
      throw new ContentError('The file is broken.', `${path}: invalid JSON`);
    }
  })();
  cache.set(path, promise);
  promise.catch(() => cache.delete(path));
  return promise;
}

export async function loadSite() {
  const site = await getJSON('data/site.json');
  const curriculum = await getJSON(site.curriculum || 'data/curriculum.json');
  if (!Array.isArray(curriculum.weeks)) throw new ContentError('The week list is broken.', 'curriculum.weeks missing');
  return { site, curriculum };
}

function folderOf(path) {
  return path.slice(0, path.lastIndexOf('/') + 1);
}

function prepareQuestion(q) {
  // Options get stable ids (a, b, c …) from their position in the file.
  if (Array.isArray(q.options)) q.options = q.options.map((text, i) => ({ id: String.fromCharCode(97 + i), text }));
  if (q.type === 'fix' && Array.isArray(q.fixes)) q.fixes = q.fixes.map((text, i) => ({ id: String.fromCharCode(97 + i), text }));
  if (q.type === 'jumbled') q.tokens = q.tokens.map((text, i) => ({ id: `t${i}`, text }));
  q.v = q.v ?? 1;
  return q;
}

/** Load one week (meta + question banks). */
export async function loadWeek(curriculum, weekId) {
  const entry = curriculum.weeks.find((w) => w.id === weekId);
  if (!entry) throw new ContentError('This week does not exist.', weekId);
  if (!entry.published) throw new ContentError('This week is coming soon.', weekId);
  const week = structuredClone(await getJSON(entry.file));
  if (week.id !== weekId) throw new ContentError('The week file is broken.', `id mismatch in ${entry.file}`);
  const base = folderOf(entry.file);
  let bank = { banks: [], questions: [], cards: {}, passages: {} };
  if (week.questionsFile) bank = structuredClone(await getJSON(base + week.questionsFile));
  const questions = (bank.questions || []).map(prepareQuestion);
  const byId = new Map(questions.map((q) => [q.id, q]));
  return {
    entry,
    week,
    banks: bank.banks || [],
    questions,
    byId,
    cards: bank.cards || {},
    passages: bank.passages || {},
    image(key) {
      return week.images?.[key] ? { key, ...week.images[key] } : null;
    }
  };
}
