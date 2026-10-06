// Play: six small games. Games are never locked.
import { h, picture, button, icon, announce, rich } from '../ui.js';
import { buildHash, go } from '../router.js';
import { screen, weekBar, listenButton, progressText } from './common.js';
import { buildSentence } from '../core/grammar.js';
import { makeRng, newSeed, shuffledNotSame, hashString } from '../core/rng.js';
import { memoryMatch, yesNo, spinSay, listenChoose } from './games-more.js';
import { markDone } from '../progress.js';

const GAMES = [
  { id: 'picture-reveal', title: 'Picture Reveal', text: 'Open the picture bit by bit. Guess the action. Say a sentence.', icon: 'grid' },
  { id: 'sentence-switch', title: 'Sentence Switch', text: 'Choose who and what. Switch +, − and ? and see every change.', icon: 'shuffle' },
  { id: 'question-door', title: 'Question Door', text: 'Make the right Do / Does question. The door opens.', icon: 'door' },
  { id: 'memory', title: 'Memory Match', text: 'Find the picture and its words.', icon: 'words' },
  { id: 'yes-or-no', title: 'Yes or No?', text: 'Read the clue. Choose the short answer.', icon: 'check' },
  { id: 'spin-and-say', title: 'Spin and Say', text: 'Spin who and what. Say +, − or ?.', icon: 'speak' },
  { id: 'listen', title: 'Listen and Choose', text: 'Listen to the sentence. Choose the right picture.', icon: 'sound' }
];

export function renderPlay(ctx) {
  const { week } = ctx.week;
  const game = ctx.route.game;
  if (game && GAMES.some((g) => g.id === game)) markDone(week.id, 'play', game);
  if (game === 'picture-reveal') return pictureReveal(ctx);
  if (game === 'sentence-switch') return sentenceSwitch(ctx);
  if (game === 'question-door') return questionDoor(ctx);
  if (game === 'memory') return memoryMatch(ctx, gameHead);
  if (game === 'yes-or-no') return yesNo(ctx, gameHead);
  if (game === 'spin-and-say') return spinSay(ctx, gameHead);
  if (game === 'listen') return listenChoose(ctx, gameHead);
  return screen('Play', weekBar(ctx, 'play'),
    h('header', { class: 'section-head' }, h('h1', {}, 'Play'), h('p', { class: 'lead' }, 'Choose a game.'),
      game ? h('p', { class: 'muted' }, 'We could not find that game.') : null),
    h('div', { class: 'game-grid' }, GAMES.map((g) => h('a', { class: 'game-card', href: buildHash(['week', week.id, 'play', g.id]) },
      h('span', { class: 'sc-icon', 'aria-hidden': 'true' }, icon(g.icon, { size: 34 })),
      h('span', { class: 'sc-title' }, g.title),
      h('span', { class: 'sc-text' }, g.text)))));
}

function gameHead(ctx, title, lead, extra = null) {
  return h('header', { class: 'section-head learn-head' },
    h('p', { class: 'eyebrow' }, 'Game'),
    h('h1', {}, title),
    h('div', { class: 'head-tools' }, extra,
      h('a', { class: 'btn btn-ghost', href: buildHash(['week', ctx.week.week.id, 'play']) }, icon('back'), h('span', { class: 'btn-label' }, 'All games'))),
    h('p', { class: 'lead' }, lead));
}

// ---------------- Picture Reveal ----------------
function pictureReveal(ctx) {
  const items = ctx.week.week.games.pictureReveal;
  let i = 0;
  const stage = h('div', { class: 'reveal-wrap' });
  const counter = h('div');

  function draw() {
    const item = items[i];
    const img = ctx.week.image(item.image);
    const tiles = [];
    const cover = h('div', { class: 'reveal-cover', role: 'group', 'aria-label': 'Picture pieces' });
    for (let t = 0; t < 9; t++) {
      const tile = h('button', { type: 'button', class: 'reveal-tile', 'aria-label': `Open piece ${t + 1}` }, String(t + 1));
      tile.addEventListener('click', () => openTile(tile));
      tiles.push(tile);
      cover.append(tile);
    }
    function openTile(tile) {
      tile.classList.add('is-open');
      tile.disabled = true;
      tile.setAttribute('aria-label', 'Open');
    }
    const word = h('p', { class: 'reveal-word', hidden: true }, item.word);
    const sentence = h('p', { class: 'reveal-sentence', hidden: true }, item.sentence);
    const toggle = (el, b, show, hide) => {
      el.hidden = !el.hidden;
      b.querySelector('.btn-label').textContent = el.hidden ? show : hide;
      b.setAttribute('aria-expanded', String(!el.hidden));
      if (!el.hidden) announce(el.textContent);
    };
    const bWord = button('Reveal word', { icon: 'eye', kind: 'primary', attrs: { 'aria-expanded': 'false' } });
    bWord.addEventListener('click', () => toggle(word, bWord, 'Reveal word', 'Hide word'));
    const bSent = button('Reveal sentence', { icon: 'eye', kind: 'gold', attrs: { 'aria-expanded': 'false' } });
    bSent.addEventListener('click', () => toggle(sentence, bSent, 'Reveal sentence', 'Hide sentence'));
    const rng = makeRng(newSeed());
    stage.replaceChildren(
      h('div', { class: 'reveal-board' }, picture(img, { className: 'reveal-pic', eager: true, sizes: '(max-width: 760px) 92vw, 60vw' }), cover),
      h('div', { class: 'stage-side' },
        h('p', { class: 'stage-kicker' }, 'What is happening?'),
        h('p', { class: 'subject-chip' }, 'Use: ', h('strong', {}, item.subject)),
        h('div', { class: 'actions col' },
          button('Open a piece', { icon: 'grid', onClick: () => {
            const closed = tiles.filter((t) => !t.disabled);
            if (closed.length) openTile(closed[Math.floor(rng() * closed.length)]);
          } }),
          button('Open all', { icon: 'eye', kind: 'ghost', onClick: () => tiles.forEach(openTile) }),
          bWord, bSent),
        word, sentence, listenButton(ctx, () => item.sentence)));
    counter.replaceChildren(h('div', { class: 'step-nav' },
      button('Previous', { icon: 'prev', onClick: () => { i -= 1; draw(); }, attrs: { disabled: i === 0 } }),
      progressText(i + 1, items.length, 'Picture'),
      button('Next picture', { icon: 'next', kind: 'primary', onClick: () => { i += 1; draw(); }, attrs: { disabled: i === items.length - 1 } })));
  }
  draw();
  return screen('Picture Reveal', weekBar(ctx, 'play'), gameHead(ctx, 'Picture Reveal', 'Open pieces. Guess the action. Then say a sentence.'), stage, counter);
}

// ---------------- Sentence Switch ----------------
function sentenceSwitch(ctx) {
  const data = ctx.week.week.games.sentenceSwitch;
  let subject = data.subjects.find((s) => s.id === 'he');
  let verb = data.verbs[0];
  let form = 'positive';
  const out = h('div', { class: 'switch-out', 'aria-live': 'polite' });

  const subjectSel = h('select', { id: 'sw-subject', class: 'select' }, data.subjects.map((s) => h('option', { value: s.id }, s.text)));
  const verbSel = h('select', { id: 'sw-verb', class: 'select' });
  subjectSel.value = subject.id;

  function allowedVerbs() {
    return subject.onlyVerbs ? data.verbs.filter((v) => subject.onlyVerbs.includes(v.id)) : data.verbs;
  }
  function fillVerbs() {
    const list = allowedVerbs();
    if (!list.includes(verb)) verb = list[0];
    verbSel.replaceChildren(...list.map((v) => h('option', { value: v.id }, `${v.base} ${v.rest.replace('{poss}', '…')}`)));
    verbSel.value = verb.id;
  }
  subjectSel.addEventListener('change', () => { subject = data.subjects.find((s) => s.id === subjectSel.value); fillVerbs(); draw(); });
  verbSel.addEventListener('change', () => { verb = data.verbs.find((v) => v.id === verbSel.value); draw(); });

  const forms = [
    { id: 'positive', label: '+ Positive' },
    { id: 'negative', label: '− Negative' },
    { id: 'question', label: '? Question' }
  ];
  const formBtns = forms.map((f) => {
    const b = button(f.label, { kind: 'option', attrs: { 'aria-pressed': String(f.id === form) } });
    b.addEventListener('click', () => { form = f.id; formBtns.forEach((x, i) => x.setAttribute('aria-pressed', String(forms[i].id === form))); draw(); });
    return b;
  });

  function draw() {
    const s = buildSentence(subject, verb, form);
    const line = h('p', { class: 'switch-sentence' }, s.parts.map((p, i) => [
      h('span', { class: `part part-${p.role}` }, p.text),
      i < s.parts.length - 1 ? ' ' : ''
    ]), form === 'question' ? '?' : '.');
    const legend = h('ul', { class: 'switch-legend' },
      h('li', { class: 'part-helper' }, 'helper: do / does / don\'t / doesn\'t'),
      h('li', { class: 'part-verb' }, 'verb (base): play'),
      h('li', { class: 'part-verb-s' }, 'verb + s: plays'));
    const ans = s.answers ? h('p', { class: 'switch-answers' }, h('span', {}, s.answers.yes), h('span', {}, s.answers.no)) : null;
    out.replaceChildren(...[line, ans, legend].filter(Boolean));
  }
  fillVerbs();
  draw();

  return screen('Sentence Switch', weekBar(ctx, 'play'),
    gameHead(ctx, 'Sentence Switch', 'Choose who and what. Then switch: + − ?'),
    h('section', { class: 'switch panel' },
      h('div', { class: 'switch-pick' },
        h('label', { for: 'sw-subject' }, 'Who?'), subjectSel,
        h('label', { for: 'sw-verb' }, 'What?'), verbSel),
      h('div', { class: 'options switch-forms', role: 'group', 'aria-label': 'Sentence type' }, formBtns),
      out,
      listenButton(ctx, () => out.querySelector('.switch-sentence').textContent)));
}

// ---------------- Question Door ----------------
function questionDoor(ctx) {
  const doors = ctx.week.week.games.questionDoor;
  let i = 0;
  const stage = h('div', { class: 'door-wrap' });
  const nav = h('div');
  const seed = newSeed();

  function draw() {
    const d = doors[i];
    const rng = makeRng(seed ^ hashString(d.id));
    const options = shuffledNotSame(d.options.map((text, k) => ({ id: String.fromCharCode(97 + k), text })), rng);
    const door = h('div', { class: 'door', 'aria-hidden': 'true' },
      h('div', { class: 'door-inside' }, icon('envelope', { size: 54 }), h('p', { class: 'door-answer' }, d.reveal)),
      h('div', { class: 'door-leaf' }, h('span', { class: 'door-knob' })));
    const status = h('p', { class: 'feedback', role: 'status' });
    const opts = h('div', { class: 'options', role: 'group', 'aria-label': 'Questions' });
    options.forEach((o) => {
      const b = button(o.text, { kind: 'option' });
      b.addEventListener('click', () => {
        if (door.classList.contains('is-open')) return;
        if (o.id === d.answer) {
          b.classList.add('is-right');
          door.classList.add('is-open');
          opts.querySelectorAll('button').forEach((x) => { x.disabled = true; });
          status.className = 'feedback is-right';
          status.replaceChildren(icon('check'), h('span', {}, `The door opens! ${o.text} — ${d.reveal}`));
          announce(`Correct. The door opens. ${d.reveal}`);
        } else {
          b.classList.add('is-wrong');
          status.className = 'feedback is-try';
          status.replaceChildren(icon('bulb'), h('span', {}, `Try again. ${d.hint}`));
          announce(`Try again. ${d.hint}`);
        }
      });
      opts.append(b);
    });
    stage.replaceChildren(
      h('div', { class: 'door-scene' },
        picture(ctx.week.image(d.image), { className: 'door-pic', eager: true, sizes: '(max-width: 760px) 60vw, 26vw' }),
        door),
      h('div', { class: 'stage-side' },
        h('p', { class: 'stage-kicker' }, 'Clue'),
        h('p', { class: 'ex-sentence' }, d.clue),
        h('p', {}, 'Ask a question about ', h('strong', {}, d.who), '.'),
        opts, status));
    nav.replaceChildren(h('div', { class: 'step-nav' },
      button('Previous', { icon: 'prev', onClick: () => { i -= 1; draw(); }, attrs: { disabled: i === 0 } }),
      progressText(i + 1, doors.length, 'Door'),
      button('Next door', { icon: 'next', kind: 'primary', onClick: () => { i += 1; draw(); }, attrs: { disabled: i === doors.length - 1 } })));
  }
  draw();
  return screen('Question Door', weekBar(ctx, 'play'), gameHead(ctx, 'Question Door', 'Read the clue. Choose the right question.'), stage, nav);
}
