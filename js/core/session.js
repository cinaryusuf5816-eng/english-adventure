// Practice session state and scoring. Pure (no DOM, no storage) and unit-tested.
//
// Each question keeps its own record:
//   firstResponse   what the learner gave on the first Check
//   firstCorrect    true / false / null (not checked yet) — never rewritten later
//   attempts        number of real checks (empty answers are not counted)
//   hintUsed        the learner opened the hint
//   answerShown     "Show answer" was used
//   current         the answer on screen now (draft)
//   status          unanswered | trying | correct-first | correct-retry | shown
//   v               question version; a changed question starts fresh

import { newSeed } from './rng.js';

export const FINAL = new Set(['correct-first', 'correct-retry', 'shown']);

export function createSession({ weekId, bank, questionIds, mode, settings, round = 1, parentId = null, seed = newSeed(), now = Date.now() }) {
  return {
    id: `s${now.toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`,
    weekId,
    bank,
    mode,
    settings: { ...settings },
    round,
    parentId,
    seed,
    createdAt: now,
    index: 0,
    questionIds: questionIds.slice(),
    states: {},
    finished: false
  };
}

export function blankState(version = 1) {
  return {
    v: version,
    firstResponse: null,
    firstCorrect: null,
    attempts: 0,
    hintUsed: false,
    answerShown: false,
    current: null,
    status: 'unanswered'
  };
}

export function getState(session, question) {
  const existing = session.states[question.id];
  if (existing && existing.v === (question.v ?? 1)) return existing;
  const fresh = blankState(question.v ?? 1);
  session.states[question.id] = fresh;
  return fresh;
}

export function isFinal(state) {
  return FINAL.has(state.status);
}

/**
 * Record a Check. Repeated checks after the question is finished are ignored,
 * so double clicks can never add points.
 */
export function recordCheck(state, response, correct) {
  if (isFinal(state)) return { ignored: true, state };
  state.attempts += 1;
  if (state.attempts === 1) {
    state.firstResponse = response;
    state.firstCorrect = !!correct;
  }
  state.current = response;
  if (correct) state.status = state.attempts === 1 ? 'correct-first' : 'correct-retry';
  else state.status = 'trying';
  return { ignored: false, state };
}

export function recordHint(state) {
  if (!isFinal(state)) state.hintUsed = true;
  return state;
}

export function recordShowAnswer(state) {
  if (isFinal(state)) return state;
  state.answerShown = true;
  state.status = 'shown';
  return state;
}

/** Clear the answer on screen. Records (first try, attempts) stay. */
export function clearCurrent(state) {
  if (!isFinal(state)) state.current = null;
  return state;
}

export function summarize(session, questionsById) {
  const out = { total: session.questionIds.length, firstTry: 0, withHelp: 0, shown: 0, notDone: 0, toPractise: [] };
  const weakTargets = {};
  for (const id of session.questionIds) {
    const q = questionsById.get(id);
    const s = session.states[id];
    if (!q) { out.total -= 1; continue; }
    const status = s && s.v === (q.v ?? 1) ? s.status : 'unanswered';
    if (status === 'correct-first') out.firstTry += 1;
    else if (status === 'correct-retry') out.withHelp += 1;
    else if (status === 'shown') out.shown += 1;
    else out.notDone += 1;
    if (status !== 'correct-first') weakTargets[q.target] = (weakTargets[q.target] || 0) + 1;
  }
  out.done = out.firstTry + out.withHelp + out.shown;
  out.toPractise = Object.entries(weakTargets).sort((a, b) => b[1] - a[1]).map(([t]) => t);
  return out;
}

/** IDs to practise again: everything that was not right on the first try. */
export function mistakesOf(session, questionsById) {
  return session.questionIds.filter((id) => {
    const q = questionsById.get(id);
    if (!q) return false;
    const s = session.states[id];
    return !(s && s.v === (q.v ?? 1) && s.status === 'correct-first');
  });
}

/** A new round with only the mistakes. The old session is not changed. */
export function retrySession(session, questionsById) {
  return createSession({
    weekId: session.weekId,
    bank: session.bank,
    mode: session.mode,
    settings: session.settings,
    questionIds: mistakesOf(session, questionsById),
    round: session.round + 1,
    parentId: session.id
  });
}

/** Drop states of questions that no longer exist (e.g. removed in an update). */
export function pruneSession(session, questionsById) {
  session.questionIds = session.questionIds.filter((id) => questionsById.has(id));
  for (const id of Object.keys(session.states)) if (!questionsById.has(id)) delete session.states[id];
  if (session.index >= session.questionIds.length) session.index = Math.max(0, session.questionIds.length - 1);
  return session;
}

/** Choose questions for a new session. */
export function pickQuestions(all, { bank, target = 'all', count = 10, rng }) {
  let pool = all.filter((q) => bank === 'all-types' || (q.bank || q.type) === bank);
  if (target !== 'all') pool = pool.filter((q) => q.target === target);
  // keep reading questions together with their text order
  if (bank === 'reading') return pool.slice(0, count === 'all' ? pool.length : Number(count));
  const order = pool.slice();
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const n = count === 'all' ? order.length : Math.min(Number(count), order.length);
  return order.slice(0, n).sort((a, b) => (a.level - b.level) || 0);
}
