// Week progress, saved only in this browser. Nothing is ever locked by progress.
// Shape: { words: [setId], learn: [topicId], examples: [exampleId], practise: [bankId], play: [gameId], challenge: [score], speak: [cardId] }
import { readJSON, writeJSON, storageKey, removeKey } from './storage.js';

const key = (weekId) => storageKey(weekId, 'progress');

export function getProgress(weekId) {
  const p = readJSON(key(weekId), {}) || {};
  for (const k of ['words', 'learn', 'examples', 'practise', 'play', 'challenge', 'speak']) if (!Array.isArray(p[k])) p[k] = [];
  return p;
}

/** Add one item to a section (no duplicates). Returns true when it is new. */
export function markDone(weekId, section, id) {
  const p = getProgress(weekId);
  if (p[section].includes(id)) return false;
  p[section].push(id);
  writeJSON(key(weekId), p);
  return true;
}

export function resetProgress(weekId) {
  removeKey(key(weekId));
}

/** Totals for each section of a week (what "done" means). */
export function sectionTotals(data) {
  const w = data.week;
  return {
    words: 1 + (w.extraWordSets || []).length,
    learn: w.learn.length,
    examples: Math.min(6, (w.examples || []).length),
    practise: data.banks.length,
    play: 6,
    challenge: 1,
    speak: Math.min(6, w.speaking.length)
  };
}

export const SECTION_LABELS = {
  words: 'Words', learn: 'Learn', examples: 'Examples', practise: 'Practice', play: 'Games', challenge: 'Challenge', speak: 'Speak'
};

export function summary(data) {
  const p = getProgress(data.week.id);
  const totals = sectionTotals(data);
  const rows = Object.keys(totals).filter((s) => totals[s] > 0).map((s) => {
    const done = Math.min(p[s].length, totals[s]);
    return { id: s, label: SECTION_LABELS[s], done, total: totals[s], complete: done >= totals[s] };
  });
  const pct = Math.round((rows.reduce((n, r) => n + r.done / r.total, 0) / rows.length) * 100);
  return { rows, pct, raw: p };
}

/** Today's Mission items with done / not done. */
export function missions(data) {
  const p = getProgress(data.week.id);
  const list = (data.week.missions || []).map((m) => ({ ...m, done: m.check.all ? false : (p[m.check.section] || []).length >= (m.check.min || 1) }));
  const others = list.filter((m) => !m.check.all);
  list.forEach((m) => { if (m.check.all) m.done = others.length > 0 && others.every((o) => o.done); });
  return list;
}
