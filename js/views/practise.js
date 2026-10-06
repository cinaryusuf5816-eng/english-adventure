// Practise: choose a bank → settings → one question at a time → short results.
import { h, button, icon, announce, confirmAction, link, picture } from '../ui.js';
import { buildHash, go } from '../router.js';
import { screen, weekBar, progressBar, TARGET_LABELS } from './common.js';
import { readJSON, writeJSON, removeKey, storageKey, isAvailable } from '../storage.js';
import { createSession, getState, recordCheck, recordHint, recordShowAnswer, clearCurrent, isFinal, summarize, retrySession, pruneSession, pickQuestions, mistakesOf } from '../core/session.js';
import { makeRng, newSeed } from '../core/rng.js';
import { renderQuestion } from '../activities/renderers.js';
import { markDone } from '../progress.js';

export const CHALLENGE = { id: 'challenge', letter: '★', title: 'Challenge', instruction: 'Show what you know!', description: 'Mixed questions from every activity.' };
const playPath = (weekId, bankId) => (bankId === 'challenge' ? ['week', weekId, 'challenge', 'play'] : ['week', weekId, 'practise', bankId, 'play']);
const setupPath = (weekId, bankId) => (bankId === 'challenge' ? ['week', weekId, 'challenge'] : ['week', weekId, 'practise', bankId]);
const bankOf = (q) => q.bank || q.type;

const COUNTS = ['5', '10', '15', 'all'];
const SUPPORT_TYPES = new Set(['fill', 'change']);

function sessionKey(weekId, bank, mode) {
  return storageKey(weekId, 'practise', bank, mode);
}

function loadSession(ctx, bank) {
  const s = readJSON(sessionKey(ctx.week.week.id, bank, ctx.mode));
  if (!s || typeof s !== 'object' || !Array.isArray(s.questionIds) || typeof s.states !== 'object') return null;
  return pruneSession(s, ctx.week.byId);
}

function saveSession(ctx, session) {
  writeJSON(sessionKey(ctx.week.week.id, session.bank, ctx.mode), session);
}

function bankById(ctx, id) {
  if (id === 'challenge') return CHALLENGE;
  return ctx.week.banks.find((b) => b.id === id);
}

function countsFor(ctx, bankId) {
  const qs = ctx.week.questions.filter((q) => bankOf(q) === bankId);
  const c = { all: qs.length };
  for (const q of qs) c[q.target] = (c[q.target] || 0) + 1;
  return c;
}

// ---------------- menu ----------------
export function renderPractiseMenu(ctx) {
  const { week } = ctx.week;
  const total = ctx.week.questions.length;
  const cards = ctx.week.banks.map((b) => {
    const c = countsFor(ctx, b.id);
    const saved = loadSession(ctx, b.id);
    const savedInfo = saved && !saved.finished ? h('span', { class: 'saved-pill' }, icon('note', { size: 16 }), `Saved: question ${saved.index + 1} of ${saved.questionIds.length}`) : null;
    return h('a', { class: 'bank-card', href: buildHash(['week', week.id, 'practise', b.id]) },
      h('span', { class: 'bank-letter', 'aria-hidden': 'true' }, b.letter),
      h('span', { class: 'bank-title' }, b.title),
      h('span', { class: 'bank-text' }, b.description),
      h('span', { class: 'bank-count' }, `${c.all} questions`),
      savedInfo);
  });

  const newLesson = button('New lesson (new class)', { icon: 'restart', onClick: async () => {
    const ok = await confirmAction({ title: 'Start a new lesson?', text: `This removes saved practice for Week ${ctx.week.entry.number} in ${ctx.mode === 'classroom' ? 'Classroom' : 'Practice'} mode on this device.`, ok: 'Yes, start new', cancel: 'Cancel' });
    if (!ok) return;
    for (const b of ctx.week.banks) removeKey(sessionKey(week.id, b.id, ctx.mode));
    announce('New lesson ready.');
    ctx.rerender();
  } });

  return screen('Practise', weekBar(ctx, 'practise'),
    h('header', { class: 'section-head' },
      h('h1', {}, 'Practise'),
      h('p', { class: 'lead' }, 'Choose an activity. Then choose 5, 10 or 15 questions.'),
      h('p', { class: 'muted small' }, `${total} questions in Week ${ctx.week.entry.number}. Progress is saved only in this browser${isAvailable() ? '' : ' (saving is off now)'}.`)),
    h('div', { class: 'bank-grid' }, cards),
    h('div', { class: 'actions end' },
      h('a', { class: 'btn btn-ghost', href: buildHash(['week', week.id, 'worksheet']) }, icon('note'), h('span', { class: 'btn-label' }, 'Printable worksheet')),
      newLesson));
}

// ---------------- setup ----------------
export function renderPractiseSetup(ctx) {
  const { week } = ctx.week;
  const bank = bankById(ctx, ctx.route.bank);
  if (!bank) return notFoundBank(ctx);
  const counts = countsFor(ctx, bank.id);
  const q = ctx.route.query || {};
  const saved = loadSession(ctx, bank.id);

  const targets = ['all', 'affirmative', 'negative', 'question', 'mixed'].filter((t) => t === 'all' || counts[t]);
  const form = h('form', { class: 'setup-form panel', 'aria-label': 'Settings' });
  const fieldset = (legend, name, values, current, labelOf) => h('fieldset', { class: 'choice-set' },
    h('legend', {}, legend),
    h('div', { class: 'chips' }, values.map((v) => h('label', { class: 'chip' },
      h('input', { type: 'radio', name, value: v, checked: v === current }),
      h('span', {}, labelOf(v))))));

  form.append(fieldset('Topic', 'target', targets, targets.includes(q.target) ? q.target : 'all', (t) => `${TARGET_LABELS[t]} · ${t === 'all' ? counts.all : counts[t]}`));
  form.append(fieldset('How many?', 'n', COUNTS, COUNTS.includes(q.n) ? q.n : '10', (n) => (n === 'all' ? 'All' : n)));
  if (SUPPORT_TYPES.has(bank.id)) {
    form.append(fieldset('Help', 'support', ['help', 'less'], q.support === 'less' ? 'less' : 'help', (s) => (s === 'help' ? (bank.id === 'fill' ? 'With a word box' : 'With word cards') : 'Less help: write it')));
  }

  const readSettings = () => {
    const fd = new FormData(form);
    return { target: fd.get('target') || 'all', n: fd.get('n') || '10', support: fd.get('support') || 'help' };
  };

  const startNew = async () => {
    if (saved && !saved.finished) {
      const ok = await confirmAction({ title: 'Start again?', text: 'Your saved place in this activity will be removed.', ok: 'Start again', cancel: 'Cancel' });
      if (!ok) return;
    }
    const settings = readSettings();
    const rng = makeRng(newSeed());
    const picked = pickQuestions(ctx.week.questions, { bank: bank.id, target: settings.target, count: settings.n, rng });
    if (!picked.length) { announce('No questions for this topic.'); return; }
    const session = createSession({ weekId: week.id, bank: bank.id, questionIds: picked.map((x) => x.id), mode: ctx.mode, settings });
    saveSession(ctx, session);
    go(playPath(week.id, bank.id));
  };

  form.addEventListener('submit', (e) => { e.preventDefault(); startNew(); });
  form.addEventListener('change', () => {
    const s = readSettings();
    window.history.replaceState(null, '', buildHash(['week', week.id, 'practise', bank.id], { target: s.target, n: s.n, support: SUPPORT_TYPES.has(bank.id) ? s.support : undefined }));
  });

  const actions = h('div', { class: 'actions' },
    saved && !saved.finished ? button(`Resume (question ${saved.index + 1} of ${saved.questionIds.length})`, { icon: 'play', kind: 'gold', onClick: () => go(playPath(week.id, bank.id)) }) : null,
    h('button', { type: 'submit', class: 'btn btn-primary' }, icon('play'), h('span', { class: 'btn-label' }, 'Start')));
  form.append(actions);

  return screen(bank.title, weekBar(ctx, 'practise'),
    h('header', { class: 'section-head' },
      h('p', { class: 'eyebrow' }, `Activity ${bank.letter}`),
      h('h1', {}, bank.title),
      h('p', { class: 'lead' }, bank.description),
      h('a', { class: 'btn btn-ghost', href: buildHash(['week', week.id, 'practise']) }, icon('back'), h('span', { class: 'btn-label' }, 'All activities'))),
    form);
}

function notFoundBank(ctx) {
  return screen('Practise', weekBar(ctx, 'practise'),
    h('section', { class: 'panel message' }, h('h1', {}, 'We could not find this activity.'),
      link('All activities', buildHash(['week', ctx.week.week.id, 'practise']), { kind: 'primary', icon: 'back' })));
}

// ---------------- play ----------------
export function renderPractisePlay(ctx) {
  const { week } = ctx.week;
  const bank = bankById(ctx, ctx.route.bank);
  if (!bank) return notFoundBank(ctx);
  const session = loadSession(ctx, bank.id);
  if (!session || !session.questionIds.length) return bank.id === 'challenge' ? renderChallenge(ctx) : renderPractiseSetup(ctx);
  if (session.finished) return resultsView(ctx, bank, session);

  const data = { cards: ctx.week.cards, passages: ctx.week.passages };
  const total = session.questionIds.length;
  const idx = Math.min(session.index, total - 1);
  const q = ctx.week.byId.get(session.questionIds[idx]);
  const st = getState(session, q);
  const r = renderQuestion(ctx, q, session, data);

  const feedback = h('div', { class: 'feedback', role: 'status', 'aria-live': 'polite' });
  const hintBox = h('p', { class: 'hint-box', hidden: true }, icon('bulb'), h('span', {}, q.hint || 'Look again.'));

  const btnHint = button('Hint', { icon: 'bulb', kind: 'ghost' });
  const btnClear = button('Clear', { icon: 'clear', kind: 'ghost' });
  const btnShow = button('Show answer', { icon: 'eye', kind: 'ghost' });
  const btnCheck = button('Check', { icon: 'check', kind: 'primary' });
  btnCheck.classList.add('btn-check');

  const save = () => saveSession(ctx, session);

  function showFinal() {
    r.lock();
    [btnCheck, btnClear, btnHint, btnShow].forEach((b) => { b.disabled = true; });
    const s = st.status;
    if (s === 'shown') {
      r.showAnswer();
      feedback.className = 'feedback is-shown';
      feedback.replaceChildren(icon('eye'), h('div', {}, h('strong', {}, 'The answer: '), h('span', { class: 'full-answer' }, r.answerText), h('p', { class: 'small' }, 'Read it together. This one is not counted as correct.')));
    } else {
      if (r.onCorrect) r.onCorrect();
      feedback.className = 'feedback is-right';
      feedback.replaceChildren(icon('check'), h('div', {},
        h('strong', {}, s === 'correct-first' ? 'Correct! ' : 'Correct — well done for trying again! '),
        h('span', { class: 'full-answer' }, r.answerText)));
    }
  }

  // Restore what is on screen.
  if (st.current != null) r.restore(st.current);
  if (st.hintUsed) hintBox.hidden = false;
  if (isFinal(st)) showFinal();
  else if (st.status === 'trying') {
    feedback.className = 'feedback is-try';
    feedback.replaceChildren(icon('bulb'), h('span', {}, 'Not yet. Try again.'));
  }

  let busy = false;
  btnCheck.addEventListener('click', () => {
    if (busy || isFinal(st)) return; // double clicks never add points
    const resp = r.getResponse();
    if (resp.empty) {
      feedback.className = 'feedback is-info';
      feedback.replaceChildren(icon('bulb'), h('span', {}, r.emptyMessage ? r.emptyMessage(resp) : 'Choose or write an answer first.'));
      return;
    }
    busy = true;
    const result = r.evaluate(resp);
    recordCheck(st, resp.value, result.correct);
    if (r.markResult) r.markResult(resp, result.correct);
    save();
    if (result.correct) {
      showFinal();
      if (result.notes && result.notes.length) feedback.append(h('p', { class: 'note' }, result.notes.join(' ')));
      announce(`Correct. ${r.answerText}`);
      updateScore();
      busy = false;
    } else {
      feedback.className = 'feedback is-try';
      const tip = (result.notes && result.notes[0]) || q.hint || 'Look again.';
      feedback.replaceChildren(icon('bulb'), h('div', {}, h('strong', {}, 'Not yet. '), h('span', {}, tip), h('p', { class: 'small' }, 'Try again, or tap Show answer.')));
      announce(`Not yet. ${tip}`);
      window.setTimeout(() => { busy = false; }, 350);
    }
  });
  btnHint.addEventListener('click', () => {
    recordHint(st);
    hintBox.hidden = false;
    save();
    announce(q.hint || '');
  });
  btnClear.addEventListener('click', () => {
    r.clear();
    clearCurrent(st);
    feedback.className = 'feedback';
    feedback.replaceChildren();
    save();
  });
  btnShow.addEventListener('click', () => {
    if (isFinal(st)) return;
    recordShowAnswer(st);
    save();
    showFinal();
    announce(`The answer: ${r.answerText}`);
    updateScore();
  });

  // Save drafts when leaving the question (not graded).
  ctx.onCleanup(() => {
    if (isFinal(st)) return;
    // Only if this session is still the saved one (not restarted / replaced).
    const stored = readJSON(sessionKey(week.id, bank.id, ctx.mode));
    if (!stored || stored.id !== session.id) return;
    const resp = r.getResponse();
    st.current = resp.empty ? null : resp.value;
    save();
  });

  // Enter = Check while typing.
  [r.input].filter(Boolean).forEach((inp) => inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); btnCheck.click(); } }));

  const goIndex = (i) => {
    session.index = i;
    save();
    ctx.rerender();
  };
  const finish = async () => {
    const left = session.questionIds.filter((id) => !isFinal(getState(session, ctx.week.byId.get(id)))).length;
    if (left) {
      const ok = await confirmAction({ title: 'Finish now?', text: `${left} question${left > 1 ? 's are' : ' is'} not finished. You can still see your results.`, ok: 'See results', cancel: 'Keep going' });
      if (!ok) return;
    }
    session.finished = true;
    save();
    markDone(week.id, bank.id === 'challenge' ? 'challenge' : 'practise', bank.id === 'challenge' ? 'done' : bank.id);
    ctx.rerender();
  };
  const restart = async () => {
    const ok = await confirmAction({ title: 'Restart this activity?', text: 'A new set of questions starts. Your answers in this set will be removed.', ok: 'Restart', cancel: 'Cancel' });
    if (!ok) return;
    removeKey(sessionKey(week.id, bank.id, ctx.mode));
    go(setupPath(week.id, bank.id), { target: session.settings.target, n: session.settings.n, support: session.settings.support });
  };

  const scoreEl = h('p', { class: 'score' });
  function updateScore() {
    const sum = summarize(session, ctx.week.byId);
    scoreEl.replaceChildren(icon('star', { size: 18 }), h('span', {}, `First try: ${sum.firstTry} · Done: ${sum.done} of ${sum.total}`));
  }
  updateScore();

  const isLast = idx === total - 1;
  const nav = h('div', { class: 'step-nav' },
    button('Previous', { icon: 'prev', onClick: () => goIndex(idx - 1), attrs: { disabled: idx === 0 } }),
    h('p', { class: 'progress-text' }, `Question ${idx + 1} of ${total}`),
    isLast ? button('Finish', { icon: 'star', kind: 'gold', onClick: finish })
      : button('Next', { icon: 'next', kind: 'primary', onClick: () => goIndex(idx + 1) }));

  return screen(bank.title, weekBar(ctx, 'practise'),
    h('header', { class: 'practice-head' },
      h('div', {}, h('p', { class: 'eyebrow' }, `${bank.letter} · ${bank.title}${session.round > 1 ? ` · Round ${session.round}` : ''}`), h('h1', { class: 'q-instruction' }, bank.instruction)),
      h('div', { class: 'head-tools' }, scoreEl, button('Restart activity', { icon: 'restart', kind: 'ghost', onClick: restart }))),
    progressBar(idx + 1, total),
    h('section', { class: `question-card type-${q.type}`, 'aria-label': `Question ${idx + 1}` },
      r.el, hintBox,
      h('div', { class: 'q-controls' }, btnHint, btnClear, btnShow, btnCheck),
      feedback),
    nav);
}

// ---------------- results ----------------
function resultsView(ctx, bank, session) {
  const { week } = ctx.week;
  const sum = summarize(session, ctx.week.byId);
  const mistakes = mistakesOf(session, ctx.week.byId);
  const row = (label, value, cls) => h('li', { class: cls }, h('span', { class: 'res-num' }, String(value)), h('span', {}, label));
  const retry = button(`Practise mistakes again (${mistakes.length})`, { icon: 'restart', kind: 'primary', onClick: () => {
    const next = retrySession(session, ctx.week.byId);
    saveSession(ctx, next);
    ctx.rerender();
  } });
  if (!mistakes.length) retry.disabled = true;
  const again = button('New set of questions', { icon: 'shuffle', onClick: () => {
    removeKey(sessionKey(week.id, bank.id, ctx.mode));
    go(setupPath(week.id, bank.id), { target: session.settings.target, n: session.settings.n, support: session.settings.support });
  } });

  return screen('Results', weekBar(ctx, 'practise'),
    h('section', { class: 'results panel' },
      h('p', { class: 'eyebrow' }, `${bank.letter} · ${bank.title}${session.round > 1 ? ` · Round ${session.round}` : ''}`),
      bank.id === 'challenge' ? h('div', { class: 'stars', 'aria-label': `${starsFor(sum)} of 3 stars` }, [1, 2, 3].map((n) => h('span', { class: n <= starsFor(sum) ? 'star on' : 'star' }, '★'))) : null,
      h('h1', {}, sum.done ? (bank.id === 'challenge' ? 'Challenge complete!' : 'Clue found!') : 'Let’s try again!'),
      h('p', { class: 'lead' }, `You finished ${sum.done} of ${sum.total} questions.`),
      h('ul', { class: 'result-list' },
        row('right on the first try', sum.firstTry, 'res-first'),
        row('right after trying again', sum.withHelp, 'res-help'),
        row('answer was shown', sum.shown, 'res-shown'),
        row('not answered', sum.notDone, 'res-skip')),
      sum.toPractise.length ? h('p', {}, 'You can practise: ', h('strong', {}, sum.toPractise.map((t) => TARGET_LABELS[t] || t).join(', '))) : h('p', {}, 'Great work!'),
      h('div', { class: 'actions' }, retry, again,
        link('Back to activities', buildHash(['week', week.id, 'practise']), { icon: 'back' }))));
}

// ---------------- challenge ----------------
const CHALLENGE_SIZE = 15;
export function renderChallenge(ctx) {
  const { week } = ctx.week;
  const saved = loadSession(ctx, 'challenge');
  const start = async () => {
    if (saved && !saved.finished) {
      const ok = await confirmAction({ title: 'Start a new challenge?', text: 'Your saved place in the challenge will be removed.', ok: 'Start again', cancel: 'Cancel' });
      if (!ok) return;
    }
    const core = ctx.week.questions.filter((q) => !q.bank);
    const picked = pickQuestions(core, { bank: 'all-types', target: 'all', count: String(CHALLENGE_SIZE), rng: makeRng(newSeed()) });
    const session = createSession({ weekId: week.id, bank: 'challenge', questionIds: picked.map((x) => x.id), mode: ctx.mode, settings: { target: 'all', n: String(CHALLENGE_SIZE), support: 'help' } });
    saveSession(ctx, session);
    go(['week', week.id, 'challenge', 'play']);
  };
  const icon1 = ctx.site.pathIcons && ctx.site.pathIcons.challenge;
  return screen('Challenge', weekBar(ctx, 'challenge'),
    h('section', { class: 'challenge-start panel' },
      icon1 ? picture({ src: icon1, w: 600, h: 600, alt: '' }, { className: 'challenge-trophy', decorative: true, eager: true, sizes: '200px' }) : null,
      h('div', {},
        h('p', { class: 'eyebrow' }, `Week ${ctx.week.entry.number} · Final mission`),
        h('h1', {}, 'The Challenge'),
        h('p', { class: 'lead' }, `${CHALLENGE_SIZE} mixed questions from every activity. Hints are there if you need them.`),
        h('ul', { class: 'challenge-rules' },
          h('li', {}, icon('star', { size: 18 }), h('span', {}, '3 stars: 13 or more right on the first try')),
          h('li', {}, icon('star', { size: 18 }), h('span', {}, '2 stars: 9 or more')),
          h('li', {}, icon('star', { size: 18 }), h('span', {}, '1 star: you finish the challenge'))),
        h('div', { class: 'actions' },
          saved && !saved.finished ? button(`Resume (question ${saved.index + 1} of ${saved.questionIds.length})`, { icon: 'play', kind: 'gold', onClick: () => go(['week', week.id, 'challenge', 'play']) }) : null,
          button('Start the challenge', { icon: 'play', kind: 'primary', onClick: start })))));
}

export function starsFor(sum) {
  if (!sum.done) return 0;
  if (sum.firstTry >= 13) return 3;
  if (sum.firstTry >= 9) return 2;
  return 1;
}
