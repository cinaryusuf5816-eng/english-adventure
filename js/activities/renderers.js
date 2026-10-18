// One renderer per question type. Every renderer returns the same small interface:
//   el                 the question UI
//   getResponse()      { value, text, empty }
//   evaluate(resp)     { correct, notes[] }
//   restore(value)     put a saved draft / final answer back on screen
//   lock()             stop changes (after a final result)
//   clear()            empty the learner's answer
//   showAnswer()       show the right answer on screen
//   answerText         the full right answer to print in the feedback
import { h, picture, button, rich, clock, calendar, icon } from '../ui.js';
import { checkText, checkJumbled } from '../core/answer-check.js';
import { makeRng, hashString, shuffledNotSame } from '../core/rng.js';

function blankify(text) {
  // "Sam ___ football." → fragment with a visible gap box
  const parts = String(text).split('___');
  const frag = document.createDocumentFragment();
  parts.forEach((p, i) => {
    frag.append(p);
    if (i < parts.length - 1) frag.append(h('span', { class: 'gap', 'aria-label': 'gap' }, '_____'));
  });
  return frag;
}

function questionPicture(ctx, key, opts = {}) {
  const img = key ? ctx.week.image(key) : null;
  return img ? picture(img, { className: 'q-pic', eager: true, sizes: '(max-width: 760px) 80vw, 34vw', ...opts }) : null;
}

/** Info card for Look-and-decide and dialogues. */
export function infoCard(ctx, card) {
  if (!card) return null;
  const marks = { yes: '✓', no: '✗', time: '' };
  const words = { yes: 'yes', no: 'no', time: '' };
  return h('aside', { class: 'clue-card', 'aria-label': `Clue: ${card.title}` },
    card.image ? questionPicture(ctx, card.image) : null,
    h('div', { class: 'clue-body' },
      h('h3', { class: 'clue-title' }, icon('envelope', { size: 20 }), h('span', {}, card.title)),
      card.text ? h('p', { class: 'clue-text' }, card.text) : null,
      card.lines ? h('ul', { class: 'clue-lines' }, card.lines.map((l) => h('li', { class: `mark-${l.mark}` },
        l.mark === 'time' ? clock(l.time) : h('span', { class: 'mark', 'aria-label': words[l.mark] }, marks[l.mark]),
        h('span', {}, l.text)))) : null,
      card.calendar ? calendar(card.calendar) : null));
}

// ---------- choice-based types ----------
function choiceRenderer(ctx, q, session, { header, options }) {
  const rng = makeRng(session.seed ^ hashString(q.id));
  const shown = shuffledNotSame(options, rng);
  let selected = null;
  const group = h('div', { class: 'options', role: 'radiogroup', 'aria-label': 'Answers' });
  const buttons = shown.map((opt) => {
    const b = h('button', { type: 'button', class: 'btn btn-option', role: 'radio', 'aria-checked': 'false', 'data-option': opt.id }, h('span', { class: 'opt-text' }, opt.text));
    b.addEventListener('click', () => select(opt.id));
    group.append(b);
    return b;
  });
  // arrow keys inside the radio group
  group.addEventListener('keydown', (e) => {
    const i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); buttons[(i + 1) % buttons.length].focus(); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); buttons[(i - 1 + buttons.length) % buttons.length].focus(); }
  });
  function select(id) {
    if (group.classList.contains('is-locked')) return;
    selected = id;
    buttons.forEach((b) => {
      const on = b.dataset.option === id;
      b.setAttribute('aria-checked', String(on));
      b.classList.toggle('is-selected', on);
      b.classList.remove('is-wrong');
    });
  }
  const right = options.find((o) => o.id === q.answer);
  return {
    el: h('div', { class: 'q-choice' }, header, group),
    getResponse: () => ({ value: selected, text: selected ? options.find((o) => o.id === selected).text : '', empty: !selected }),
    evaluate: (r) => ({ correct: r.value === q.answer, notes: [] }),
    markResult(r, correct) {
      buttons.forEach((b) => {
        if (b.dataset.option === r.value) b.classList.add(correct ? 'is-right' : 'is-wrong');
      });
    },
    restore(value) { if (value) select(value); },
    lock() { group.classList.add('is-locked'); buttons.forEach((b) => { b.disabled = true; }); },
    clear() { selected = null; buttons.forEach((b) => { b.setAttribute('aria-checked', 'false'); b.classList.remove('is-selected', 'is-wrong'); }); },
    showAnswer() { buttons.forEach((b) => b.classList.toggle('is-right', b.dataset.option === q.answer)); },
    answerText: q.explain || (right && right.text)
  };
}

function mcq(ctx, q, session) {
  const header = h('div', { class: 'q-head' },
    questionPicture(ctx, q.image),
    h('div', { class: 'q-prompt' }, h('p', { class: 'q-sentence' }, blankify(q.prompt)), q.time ? clock(q.time) : null));
  return choiceRenderer(ctx, q, session, { header, options: q.options });
}

function dialogue(ctx, q, session, data) {
  const card = q.card ? infoCard(ctx, data.cards[q.card]) : questionPicture(ctx, q.image);
  const lines = h('ol', { class: 'dialogue' }, q.lines.map((l) =>
    h('li', {}, h('span', { class: 'who' }, l.who), h('p', { class: 'line' }, blankify(l.text)))));
  const header = h('div', { class: 'q-head' }, card, h('div', { class: 'q-prompt' }, lines));
  return choiceRenderer(ctx, q, session, { header, options: q.options });
}

function reading(ctx, q, session, data) {
  const p = data.passages[q.passage];
  const passage = h('article', { class: 'passage', 'aria-label': `Text: ${p.title}` },
    questionPicture(ctx, p.image),
    h('div', {}, h('h3', {}, p.title), h('p', { class: 'passage-text' }, p.text)));
  const header = h('div', { class: 'q-head reading-head' }, passage, h('div', { class: 'q-prompt' }, h('p', { class: 'q-sentence' }, q.prompt)));
  const r = choiceRenderer(ctx, q, session, { header, options: q.options });
  r.el.classList.add('is-reading');
  return r;
}

function decide(ctx, q, session, data) {
  const options = [{ id: 'true', text: 'True' }, { id: 'false', text: 'False' }];
  const header = h('div', { class: 'q-head' },
    infoCard(ctx, data.cards[q.card]),
    h('div', { class: 'q-prompt' }, h('p', { class: 'q-kicker' }, 'Is it true?'), h('p', { class: 'q-sentence statement' }, `“${q.statement}”`)));
  // True / False stay in this order (not shuffled): easier for young learners.
  const r = choiceRenderer(ctx, q, { seed: 0 }, { header, options });
  const fixed = r.el.querySelector('.options');
  const [t, f] = ['true', 'false'].map((id) => fixed.querySelector(`[data-option="${id}"]`));
  fixed.append(t, f);
  r.evaluate = (resp) => ({ correct: resp.value === String(q.answer), notes: [] });
  r.showAnswer = () => fixed.querySelectorAll('.btn-option').forEach((b) => b.classList.toggle('is-right', b.dataset.option === String(q.answer)));
  r.answerText = q.explain;
  return r;
}

// ---------- token builder (jumbled + change with help) ----------
function tokenBuilder(tokens, { endMark = '' } = {}) {
  let placed = [];
  const bank = h('div', { class: 'token-bank', role: 'group', 'aria-label': 'Word cards' });
  const line = h('div', { class: 'token-line', role: 'group', 'aria-label': 'Your sentence' });
  const end = h('span', { class: 'token-end', 'aria-hidden': 'true' }, endMark);
  const emptyHint = h('span', { class: 'token-empty' }, 'Tap the words.');
  const tokenBtns = new Map();
  let locked = false;
  let onChange = () => {};

  tokens.forEach((t) => {
    const b = h('button', { type: 'button', class: 'token', 'data-token': t.id }, t.text);
    b.addEventListener('click', () => {
      if (locked || placed.includes(t.id)) return;
      placed.push(t.id);
      draw();
      onChange();
    });
    tokenBtns.set(t.id, b);
    bank.append(b);
  });

  function draw() {
    line.replaceChildren();
    if (!placed.length) line.append(emptyHint);
    placed.forEach((id, i) => {
      const t = tokens.find((x) => x.id === id);
      const b = h('button', { type: 'button', class: 'token is-placed', 'aria-label': `${t.text} (remove)` }, t.text);
      b.addEventListener('click', () => {
        if (locked) return;
        placed.splice(i, 1);
        draw();
        onChange();
        const back = tokenBtns.get(id);
        if (back) back.focus();
      });
      line.append(b);
    });
    if (placed.length) line.append(end);
    tokenBtns.forEach((b, id) => {
      const used = placed.includes(id);
      b.disabled = used || locked;
      b.classList.toggle('is-used', used);
    });
  }
  draw();
  const undo = button('Undo', { icon: 'undo', kind: 'ghost', onClick: () => { if (!locked && placed.length) { placed.pop(); draw(); onChange(); } } });
  return {
    el: h('div', { class: 'token-builder' }, line, bank, h('div', { class: 'token-tools' }, undo)),
    get ids() { return placed.slice(); },
    get texts() { return placed.map((id) => tokens.find((x) => x.id === id).text); },
    set(ids) { placed = (ids || []).filter((id) => tokenBtns.has(id)); draw(); },
    lock() { locked = true; undo.disabled = true; draw(); },
    clear() { placed = []; draw(); },
    onChange(fn) { onChange = fn; }
  };
}

function jumbled(ctx, q, session) {
  const rng = makeRng(session.seed ^ hashString(q.id));
  const tb = tokenBuilder(shuffledNotSame(q.tokens, rng), { endMark: q.end || '' });
  const answerLine = h('p', { class: 'model-answer', hidden: true });
  return {
    el: h('div', { class: 'q-jumbled' },
      h('div', { class: 'q-head' }, questionPicture(ctx, q.image), h('div', { class: 'q-prompt' }, h('p', { class: 'q-kicker' }, q.end === '?' ? 'Make a question.' : 'Make a sentence.'), q.time ? clock(q.time) : null)),
      tb.el, answerLine),
    getResponse: () => ({ value: tb.ids, text: tb.texts.join(' ') + (q.end || ''), empty: tb.ids.length === 0 }),
    evaluate: () => checkJumbled(tb.texts, q.answers),
    restore(value) { if (Array.isArray(value)) tb.set(value); },
    lock: () => tb.lock(),
    clear: () => tb.clear(),
    showAnswer() { answerLine.textContent = q.answers[0] + (q.end || ''); answerLine.hidden = false; },
    answerText: q.explain,
    builder: tb
  };
}

// ---------- typed answers ----------
function textInput(label, { wide = false } = {}) {
  return h('input', { type: 'text', class: `answer-input${wide ? ' wide' : ''}`, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': label });
}

function fill(ctx, q, session) {
  const help = session.settings.support !== 'less';
  const parts = q.text.split('___');
  const sentence = h('p', { class: 'q-sentence fill-sentence' });
  let input = null;
  let chosen = null;
  const slot = h('span', { class: 'gap gap-slot', 'aria-live': 'polite' }, '_____');
  sentence.append(parts[0]);
  if (help) sentence.append(slot);
  else { input = textInput('Missing word'); sentence.append(input); }
  sentence.append(parts[1] || '');

  const pool = help ? h('div', { class: 'options pool', role: 'radiogroup', 'aria-label': 'Word box' }) : null;
  const poolBtns = [];
  if (help) {
    const rng = makeRng(session.seed ^ hashString(q.id));
    shuffledNotSame(q.pool, rng).forEach((w) => {
      const b = h('button', { type: 'button', class: 'btn btn-option', role: 'radio', 'aria-checked': 'false' }, w);
      b.addEventListener('click', () => { if (!b.disabled) setChoice(w); });
      poolBtns.push(b);
      pool.append(b);
    });
  }
  function setChoice(w) {
    chosen = w;
    slot.textContent = w || '_____';
    slot.classList.toggle('is-filled', !!w);
    poolBtns.forEach((b) => { const on = b.textContent === w; b.setAttribute('aria-checked', String(on)); b.classList.toggle('is-selected', on); });
  }
  const base = q.base ? h('p', { class: 'base-word' }, 'Use: ', h('strong', {}, q.base)) : null;
  return {
    el: h('div', { class: 'q-fill' },
      h('div', { class: 'q-head' }, questionPicture(ctx, q.image),
        h('div', { class: 'q-prompt' }, h('p', { class: 'q-kicker' }, help ? 'Choose the word.' : 'Write the word.'), sentence, base, q.time ? clock(q.time) : null)),
      pool),
    getResponse() {
      const v = help ? chosen : input.value;
      return { value: v, text: v || '', empty: !v || !String(v).trim() };
    },
    evaluate: (r) => checkText(r.value, q.answers),
    restore(value) { if (value == null) return; if (help) setChoice(value); else input.value = value; },
    lock() { if (input) input.readOnly = true; poolBtns.forEach((b) => { b.disabled = true; }); },
    clear() { if (help) setChoice(null); else { input.value = ''; input.focus(); } },
    showAnswer() { if (help) setChoice(q.answers[0]); else input.value = q.answers[0]; },
    answerText: q.explain,
    input
  };
}

function change(ctx, q, session) {
  const help = session.settings.support !== 'less';
  const target = q.answers[0];
  const end = /[?.!]$/.test(target) ? target.slice(-1) : '';
  const words = target.replace(/[?.!]$/, '').split(' ');
  const task = q.task === 'negative' ? 'Make it negative (−).' : 'Make a question (?).';
  let tb = null;
  let input = null;
  const answerLine = h('p', { class: 'model-answer', hidden: true });
  const work = h('div', { class: 'change-work' });
  if (help) {
    const rng = makeRng(session.seed ^ hashString(q.id));
    tb = tokenBuilder(shuffledNotSame(words.map((w, i) => ({ id: `w${i}`, text: w })), rng), { endMark: end });
    work.append(tb.el);
  } else {
    input = textInput('Your new sentence', { wide: true });
    work.append(h('label', { class: 'input-label' }, 'Write the new sentence:', input));
  }
  return {
    el: h('div', { class: 'q-change' },
      h('div', { class: 'q-head' }, questionPicture(ctx, q.image),
        h('div', { class: 'q-prompt' }, h('p', { class: 'q-kicker' }, task), h('p', { class: 'q-sentence from-sentence' }, q.from), q.time ? clock(q.time) : null)),
      work, answerLine),
    getResponse() {
      if (help) return { value: tb.ids, text: tb.texts.join(' ') + end, empty: !tb.ids.length };
      return { value: input.value, text: input.value, empty: !input.value.trim() };
    },
    evaluate(r) { return checkText(help ? r.text : r.value, q.answers); },
    restore(value) { if (value == null) return; if (help && Array.isArray(value)) tb.set(value); else if (!help && typeof value === 'string') input.value = value; },
    lock() { if (tb) tb.lock(); if (input) input.readOnly = true; },
    clear() { if (tb) tb.clear(); if (input) { input.value = ''; input.focus(); } },
    showAnswer() { answerLine.textContent = target; answerLine.hidden = false; },
    answerText: q.explain,
    input
  };
}

// ---------- fix the mistake ----------
function fix(ctx, q, session) {
  let wordSel = null;
  let fixSel = null;
  let locked = false;
  const wordsRow = h('div', { class: 'fix-words', role: 'radiogroup', 'aria-label': 'Which word is wrong?' });
  const wordBtns = q.words.map((w, i) => {
    const b = h('button', { type: 'button', class: 'token fix-word', role: 'radio', 'aria-checked': 'false' }, w);
    b.addEventListener('click', () => { if (!locked) { wordSel = i; draw(); } });
    wordsRow.append(b);
    return b;
  });
  const rng = makeRng(session.seed ^ hashString(q.id));
  const fixesShown = shuffledNotSame(q.fixes, rng);
  const fixRow = h('div', { class: 'options fix-options', role: 'radiogroup', 'aria-label': 'Change it to' });
  const fixBtns = fixesShown.map((f) => {
    const b = h('button', { type: 'button', class: 'btn btn-option', role: 'radio', 'aria-checked': 'false', 'data-option': f.id }, f.text);
    b.addEventListener('click', () => { if (!locked) { fixSel = f.id; draw(); } });
    fixRow.append(b);
    return b;
  });
  const step2 = h('div', { class: 'fix-step2', hidden: true }, h('p', { class: 'q-kicker' }, '2. Change it to:'), fixRow);
  const corrected = h('p', { class: 'model-answer fix-correct', hidden: true });
  function draw() {
    wordBtns.forEach((b, i) => { const on = i === wordSel; b.setAttribute('aria-checked', String(on)); b.classList.toggle('is-selected', on); });
    fixBtns.forEach((b) => { const on = b.dataset.option === fixSel; b.setAttribute('aria-checked', String(on)); b.classList.toggle('is-selected', on); });
    step2.hidden = wordSel === null;
  }
  const rightFix = q.fixes.find((f) => f.id === q.fix);
  return {
    el: h('div', { class: 'q-fix' },
      h('div', { class: 'q-head' }, questionPicture(ctx, q.image),
        h('div', { class: 'q-prompt' }, h('p', { class: 'q-kicker' }, '1. Tap the wrong word.'), wordsRow, step2)),
      corrected),
    getResponse: () => ({ value: wordSel === null ? null : { word: wordSel, fix: fixSel }, text: wordSel === null ? '' : `${q.words[wordSel]} → ${fixSel ? q.fixes.find((f) => f.id === fixSel).text : '?'}`, empty: wordSel === null || fixSel === null }),
    evaluate(r) {
      const wordOk = r.value.word === q.wrong;
      return { correct: wordOk && r.value.fix === q.fix, notes: wordOk ? [] : ['Look again: which word is wrong?'] };
    },
    restore(value) { if (value && typeof value === 'object') { wordSel = value.word; fixSel = value.fix; draw(); } },
    lock() { locked = true; wordBtns.concat(fixBtns).forEach((b) => { b.disabled = true; }); },
    clear() { wordSel = null; fixSel = null; draw(); },
    showAnswer() {
      wordSel = q.wrong; fixSel = q.fix; draw();
      wordBtns[q.wrong].classList.add('is-wrong-word');
      corrected.replaceChildren(icon('check'), h('span', {}, q.explain));
      corrected.hidden = false;
    },
    onCorrect() {
      wordBtns[q.wrong].classList.add('is-wrong-word');
      corrected.replaceChildren(icon('check'), h('span', {}, q.explain));
      corrected.hidden = false;
    },
    emptyMessage: (r) => (r.value === null ? 'Tap the wrong word first.' : 'Now choose the new word.'),
    answerText: q.explain || rightFix.text
  };
}

const RENDERERS = { mcq, jumbled, fill, change, fix, decide, dialogue, reading };

export function renderQuestion(ctx, q, session, data) {
  const fn = RENDERERS[q.type];
  if (!fn) throw new Error(`Unknown question type: ${q.type}`);
  const r = fn(ctx, q, session, data);
  // Layout: picture / clue on the left, prompt + answer area together on the right,
  // so the answer stays on screen next to the picture.
  const head = r.el.querySelector(':scope > .q-head');
  const prompt = head && head.querySelector(':scope > .q-prompt');
  if (prompt) [...r.el.children].filter((c) => c !== head).forEach((c) => prompt.append(c));
  return r;
}

export const QUESTION_TYPES = Object.keys(RENDERERS);
export { rich };
