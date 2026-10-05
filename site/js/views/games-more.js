// More games: Memory Match, Yes or No?, Spin and Say.
// All content comes from the week file; no game locks any lesson.
import { h, picture, button, icon, announce, clock } from '../ui.js';
import { screen, weekBar, listenButton, progressText } from './common.js';
import { buildSentence } from '../core/grammar.js';
import { makeRng, newSeed, shuffled, shuffledNotSame, hashString } from '../core/rng.js';
import { wordSets } from './words.js';

const reducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------- Memory Match ----------------
export function memoryMatch(ctx, gameHead) {
  const sets = wordSets(ctx.week.week);
  let words = sets[0].words;
  let pairsWanted = Math.min(ctx.week.week.games.memory?.pairs || 6, words.length);
  const setChips = sets.length > 1 ? h('div', { class: 'mode-tabs set-tabs', role: 'group', 'aria-label': 'Word set' }) : null;
  if (setChips) sets.forEach((s, k) => {
    const b = h('button', { type: 'button', class: `mode-tab${k === 0 ? ' is-active' : ''}`, 'aria-pressed': String(k === 0) }, h('strong', {}, s.title));
    b.addEventListener('click', () => {
      setChips.querySelectorAll('.mode-tab').forEach((x) => { x.classList.remove('is-active'); x.setAttribute('aria-pressed', 'false'); });
      b.classList.add('is-active'); b.setAttribute('aria-pressed', 'true');
      words = s.words; pairsWanted = Math.min(ctx.week.week.games.memory?.pairs || 6, words.length); newGame();
    });
    setChips.append(b);
  });
  const board = h('div', { class: 'memory-board', role: 'group', 'aria-label': 'Memory cards' });
  const status = h('p', { class: 'memory-status', role: 'status' });
  let timer = null;
  ctx.onCleanup(() => window.clearTimeout(timer));

  function newGame() {
    window.clearTimeout(timer);
    const rng = makeRng(newSeed());
    const chosen = shuffled(words, rng).slice(0, pairsWanted);
    const cards = shuffled(chosen.flatMap((w) => [{ pair: w.id, kind: 'pic', w }, { pair: w.id, kind: 'word', w }]), rng);
    let open = [];
    let found = 0;
    let moves = 0;
    let busy = false;
    const draw = () => { status.replaceChildren(icon('star', { size: 18 }), h('span', {}, `Pairs: ${found} of ${pairsWanted} · Turns: ${moves}`)); };

    const btns = cards.map((c, i) => {
      const face = c.kind === 'pic'
        ? picture(ctx.week.image(c.w.image), { className: 'memory-pic', sizes: '(max-width: 760px) 30vw, 14vw' })
        : h('span', { class: 'memory-word' }, c.w.phrase);
      const b = h('button', { type: 'button', class: `memory-card kind-${c.kind}`, 'aria-label': `Card ${i + 1}, closed`, 'data-pair': c.pair },
        h('span', { class: 'memory-back', 'aria-hidden': 'true' }, icon('key', { size: 34 })),
        h('span', { class: 'memory-face' }, face));
      b.addEventListener('click', () => flip(b, c, i));
      return b;
    });

    function label(b, c, i, state) {
      b.setAttribute('aria-label', state === 'closed' ? `Card ${i + 1}, closed` : `Card ${i + 1}: ${c.kind === 'pic' ? `picture — ${ctx.week.image(c.w.image)?.alt || ''}` : c.w.phrase}${state === 'done' ? ' (matched)' : ''}`);
    }

    function flip(b, c, i) {
      if (busy || b.classList.contains('is-open') || b.classList.contains('is-done')) return;
      b.classList.add('is-open');
      label(b, c, i, 'open');
      open.push({ b, c, i });
      if (open.length < 2) return;
      moves += 1;
      const [x, y] = open;
      if (x.c.pair === y.c.pair && x.c.kind !== y.c.kind) {
        [x, y].forEach((o) => { o.b.classList.add('is-done'); o.b.disabled = true; label(o.b, o.c, o.i, 'done'); });
        found += 1;
        open = [];
        announce(`Match! ${x.c.w.phrase}.`);
        if (found === pairsWanted) {
          status.replaceChildren(icon('check'), h('span', {}, `All pairs found in ${moves} turns! Say a sentence for each one.`));
          announce('All pairs found!');
          return;
        }
      } else {
        busy = true;
        announce('Not a pair. Try again.');
        timer = window.setTimeout(() => {
          [x, y].forEach((o) => { o.b.classList.remove('is-open'); label(o.b, o.c, o.i, 'closed'); });
          open = [];
          busy = false;
        }, reducedMotion() ? 700 : 1100);
      }
      draw();
    }
    board.replaceChildren(...btns);
    draw();
  }
  newGame();

  return screen('Memory Match', weekBar(ctx, 'play'),
    gameHead(ctx, 'Memory Match', 'Find a picture and its words. Then say a sentence.'),
    h('section', { class: 'memory-wrap notebook-page' },
      setChips,
      h('div', { class: 'memory-tools' }, status, button('New game', { icon: 'shuffle', kind: 'gold', onClick: newGame })),
      board));
}

// ---------------- Yes or No? ----------------
export function yesNo(ctx, gameHead) {
  const items = ctx.week.week.games.yesNo || [];
  const seed = newSeed();
  let i = 0;
  const results = new Map(); // id → 'first' | 'later'
  const stage = h('div', { class: 'yesno-wrap notebook-spread' });
  const nav = h('div');
  const score = h('p', { class: 'score' });
  const drawScore = () => {
    const first = [...results.values()].filter((v) => v === 'first').length;
    score.replaceChildren(icon('star', { size: 18 }), h('span', {}, `First try: ${first} · Done: ${results.size} of ${items.length}`));
  };

  function draw() {
    const it = items[i];
    const rng = makeRng(seed ^ hashString(it.id));
    const opts = shuffledNotSame(it.options.map((text, k) => ({ id: String.fromCharCode(97 + k), text })), rng);
    const feedback = h('p', { class: 'feedback', role: 'status' });
    let tries = 0;
    const group = h('div', { class: 'options', role: 'group', 'aria-label': 'Answers' });
    opts.forEach((o) => {
      const b = button(o.text, { kind: 'option' });
      b.dataset.option = o.id;
      if (results.has(it.id) && o.id === it.answer) b.classList.add('is-right');
      if (results.has(it.id)) b.disabled = true;
      b.addEventListener('click', () => {
        if (results.has(it.id)) return;
        tries += 1;
        if (o.id === it.answer) {
          results.set(it.id, tries === 1 ? 'first' : 'later');
          b.classList.add('is-right');
          group.querySelectorAll('button').forEach((x) => { x.disabled = true; });
          feedback.className = 'feedback is-right';
          feedback.replaceChildren(icon('check'), h('span', {}, `${o.text}`));
          announce(`Correct. ${o.text}`);
          drawScore();
        } else {
          b.classList.add('is-wrong');
          feedback.className = 'feedback is-try';
          feedback.replaceChildren(icon('bulb'), h('span', {}, `Try again. ${it.hint}`));
          announce(`Try again. ${it.hint}`);
        }
      });
      group.append(b);
    });
    if (results.has(it.id)) {
      const right = it.options[it.answer.charCodeAt(0) - 97];
      feedback.className = 'feedback is-right';
      feedback.replaceChildren(icon('check'), h('span', {}, right));
    }
    stage.replaceChildren(
      picture(ctx.week.image(it.image), { className: 'stage-pic', eager: true, sizes: '(max-width: 760px) 92vw, 50vw' }),
      h('div', { class: 'stage-side' },
        h('div', { class: 'sticky-note clue-note' }, h('span', { class: 'note-title' }, 'Clue'), h('span', {}, it.clue), it.time ? clock(it.time) : null),
        h('p', { class: 'ex-sentence' }, it.question),
        group, feedback,
        listenButton(ctx, () => `${it.question}`)));
    nav.replaceChildren(h('div', { class: 'step-nav' },
      button('Previous', { icon: 'prev', onClick: () => { i -= 1; draw(); }, attrs: { disabled: i === 0 } }),
      progressText(i + 1, items.length, 'Clue'),
      i === items.length - 1
        ? button('Start again', { icon: 'restart', kind: 'gold', onClick: () => { results.clear(); i = 0; drawScore(); draw(); } })
        : button('Next clue', { icon: 'next', kind: 'primary', onClick: () => { i += 1; draw(); } })));
  }
  drawScore();
  draw();
  return screen('Yes or No?', weekBar(ctx, 'play'),
    gameHead(ctx, 'Yes or No?', 'Read the clue. Choose the short answer.', score),
    stage, nav);
}

// ---------------- Spin and Say ----------------
export function spinSay(ctx, gameHead) {
  const data = ctx.week.week.games.sentenceSwitch;
  const rng = makeRng(newSeed());
  const FORMS = [
    { id: 'positive', label: '+', name: 'positive' },
    { id: 'negative', label: '−', name: 'negative' },
    { id: 'question', label: '?', name: 'question' }
  ];
  let subject = data.subjects[4];
  let verb = data.verbs[0];
  let form = FORMS[0];
  let spinTimer = null;
  ctx.onCleanup(() => window.clearInterval(spinTimer));

  const wSubject = h('span', { class: 'slot-value' });
  const wVerb = h('span', { class: 'slot-value' });
  const wForm = h('span', { class: 'slot-value slot-form' });
  const answer = h('div', { class: 'spin-answer', hidden: true, 'aria-live': 'polite' });
  const reveal = button('Show the answer', { icon: 'eye', kind: 'primary', attrs: { 'aria-expanded': 'false' } });

  const verbsFor = (s) => (s.onlyVerbs ? data.verbs.filter((v) => s.onlyVerbs.includes(v.id)) : data.verbs);
  const pick = (list) => list[Math.floor(rng() * list.length)];

  function show() {
    wSubject.textContent = subject.text;
    wVerb.textContent = `${verb.base} ${verb.rest.replace('{poss}', '…')}`;
    wForm.textContent = `${form.label} ${form.name}`;
    const s = buildSentence(subject, verb, form.id);
    answer.replaceChildren(h('p', { class: 'switch-sentence' }, s.text), s.answers ? h('p', { class: 'switch-answers' }, h('span', {}, s.answers.yes), h('span', {}, s.answers.no)) : null);
  }
  function hideAnswer() {
    answer.hidden = true;
    reveal.setAttribute('aria-expanded', 'false');
    reveal.querySelector('.btn-label').textContent = 'Show the answer';
  }
  function finalPick() {
    subject = pick(data.subjects);
    verb = pick(verbsFor(subject));
    form = pick(FORMS);
    show();
    announce(`${subject.text}. ${verb.base} ${verb.rest.replace('{poss}', '')}. ${form.name}.`);
  }
  function spin() {
    window.clearInterval(spinTimer);
    hideAnswer();
    if (reducedMotion()) { finalPick(); return; }
    let n = 0;
    spinBtn.disabled = true;
    spinTimer = window.setInterval(() => {
      subject = pick(data.subjects); verb = pick(verbsFor(subject)); form = pick(FORMS);
      show();
      n += 1;
      if (n >= 8) { window.clearInterval(spinTimer); finalPick(); spinBtn.disabled = false; }
    }, 70);
  }
  const spinBtn = button('Spin', { icon: 'shuffle', kind: 'gold', onClick: spin });
  spinBtn.classList.add('btn-spin');
  reveal.addEventListener('click', () => {
    const open = answer.hidden;
    answer.hidden = !open;
    reveal.setAttribute('aria-expanded', String(open));
    reveal.querySelector('.btn-label').textContent = open ? 'Hide the answer' : 'Show the answer';
    if (open) announce(answer.textContent);
  });
  show();

  return screen('Spin and Say', weekBar(ctx, 'play'),
    gameHead(ctx, 'Spin and Say', 'Spin. Say the sentence. Then check.'),
    h('section', { class: 'spin notebook-page' },
      h('div', { class: 'slots' },
        h('div', { class: 'slot' }, h('span', { class: 'slot-label' }, 'Who?'), wSubject),
        h('div', { class: 'slot' }, h('span', { class: 'slot-label' }, 'What?'), wVerb),
        h('div', { class: 'slot' }, h('span', { class: 'slot-label' }, 'Make it'), wForm)),
      h('div', { class: 'actions' }, spinBtn, reveal, listenButton(ctx, () => answer.textContent)),
      answer));
}
