// Printable worksheet + answer key made from the question banks.
import { h, button, icon, picture } from '../ui.js';
import { screen, weekBar } from './common.js';
import { makeRng, newSeed, shuffled, shuffledNotSame, hashString } from '../core/rng.js';

const LINE = '______________________________';
const bankOf = (q) => q.bank || q.type;

function itemEl(ctx, q, n, opts, rng) {
  const parts = [];
  const pic = opts.pictures && q.image ? picture(ctx.week.image(q.image), { className: 'ws-pic', sizes: '120px', eager: true }) : null;
  const letters = (list) => h('ol', { class: 'ws-options', type: 'a' }, list.map((t) => h('li', {}, t)));
  switch (q.type) {
    case 'mcq':
      parts.push(h('p', {}, q.prompt.replace('___', '________')), letters(q.options.map((o) => o.text)));
      break;
    case 'dialogue':
      parts.push(h('div', { class: 'ws-dialogue' }, q.lines.map((l) => h('p', {}, h('strong', {}, `${l.who}: `), l.text.replace('___', '________')))), letters(q.options.map((o) => o.text)));
      break;
    case 'reading':
      parts.push(h('p', {}, q.prompt), letters(q.options.map((o) => o.text)));
      break;
    case 'jumbled': {
      const toks = shuffledNotSame(q.tokens.map((t) => t.text), makeRng(hashString(q.id) ^ opts.seed));
      parts.push(h('p', { class: 'ws-tokens' }, toks.map((t) => h('span', {}, t))), h('p', { class: 'ws-line' }, `${LINE}${q.end || ''}`));
      break;
    }
    case 'fill':
      parts.push(h('p', {}, q.text.replace('___', '__________'), q.base ? h('em', {}, ` (${q.base})`) : null),
        opts.wordBox && q.pool ? h('p', { class: 'ws-box' }, 'Word box: ', q.pool.join(' / ')) : null);
      break;
    case 'change':
      parts.push(h('p', {}, h('strong', {}, q.task === 'negative' ? 'Make it negative: ' : 'Make a question: '), q.from), h('p', { class: 'ws-line' }, LINE));
      break;
    case 'fix':
      parts.push(h('p', {}, q.words.join(' ')), h('p', { class: 'ws-line' }, 'Circle the mistake. Write it right: ', LINE));
      break;
    case 'decide': {
      const c = ctx.week.cards[q.card] || {};
      const info = c.text || (c.lines || []).map((l) => `${l.mark === 'yes' ? '✓' : l.mark === 'no' ? '✗' : '⏰'} ${l.text}${l.time ? ` ${l.time}` : ''}`).join(' · ') ||
        (c.calendar ? `${c.title}: ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => `${d} ${c.calendar[i] ? '✓' : '✗'}`).join(' ')}` : '');
      parts.push(h('p', { class: 'ws-clue' }, h('strong', {}, `${c.title || 'Clue'}: `), info), h('p', {}, `“${q.statement}”`, h('span', { class: 'ws-tf' }, '  True  /  False')));
      break;
    }
    default:
      parts.push(h('p', {}, q.prompt || ''));
  }
  return h('li', { class: 'ws-item' }, h('span', { class: 'ws-n' }, `${n}.`), pic, h('div', { class: 'ws-body' }, parts));
}

function answerOf(q) {
  if (q.type === 'decide') return q.answer ? 'True' : 'False';
  if (q.type === 'jumbled') return q.answers[0] + (q.end || '');
  if (q.type === 'fill') return q.answers[0];
  if (q.options && q.answer) {
    const o = q.options.find((x) => x.id === q.answer);
    return `${q.answer}) ${o ? o.text : ''}`;
  }
  return q.explain;
}

export function renderWorksheet(ctx) {
  const { week, entry } = ctx.week;
  const banks = ctx.week.banks;
  const state = { picked: new Set(['mcq', 'fill', 'jumbled', 'verbs']), n: 5, pictures: true, wordBox: true, key: true, seed: newSeed() };
  const sheetWrap = h('div', { class: 'ws-output' });

  const form = h('form', { class: 'panel ws-controls no-print', 'aria-label': 'Worksheet settings' });
  const draw = () => {
    const rng = makeRng(state.seed);
    const chosen = [];
    for (const b of banks) {
      if (!state.picked.has(b.id)) continue;
      const pool = ctx.week.questions.filter((q) => bankOf(q) === b.id);
      const take = b.id === 'reading' ? pool.slice(0, Math.min(pool.length, Math.max(4, Math.ceil(state.n / 4) * 4))) : shuffled(pool, rng).slice(0, state.n);
      if (take.length) chosen.push({ bank: b, qs: take });
    }
    let n = 0;
    const sections = chosen.map(({ bank, qs }, si) => {
      const passages = bank.id === 'reading' ? [...new Set(qs.map((q) => q.passage))] : [];
      return h('section', { class: `ws-section ws-c${si % 6}` },
        h('h3', { class: 'ws-sec-head' }, h('span', { class: 'ws-letter' }, bank.letter), h('span', { class: 'ws-sec-title' }, bank.title), bank.instruction && bank.instruction !== bank.title ? h('span', { class: 'ws-sec-inst' }, bank.instruction) : null),
        passages.map((pid) => {
          const p = ctx.week.passages[pid];
          return h('div', { class: 'ws-passage' }, h('strong', {}, p.title), h('p', {}, p.text),
            h('ol', { class: 'ws-list', start: String(n + 1) }, qs.filter((q) => q.passage === pid).map((q) => itemEl(ctx, q, ++n, state, rng))));
        }),
        bank.id === 'reading' ? null : h('ol', { class: 'ws-list' }, qs.map((q) => itemEl(ctx, q, ++n, state, rng))));
    });
    let k = 0;
    const key = state.key ? h('section', { class: 'ws-key' },
      h('h2', {}, 'Answer key'),
      h('ol', { class: 'ws-key-list' }, chosen.flatMap(({ qs, bank }) => (bank.id === 'reading' ? [...new Set(qs.map((q) => q.passage))].flatMap((pid) => qs.filter((q) => q.passage === pid)) : qs).map((q) => h('li', {}, h('span', {}, `${++k}. `), answerOf(q)))))) : null;
    sheetWrap.replaceChildren(
      h('article', { class: 'ws-sheet' },
        h('header', { class: 'ws-head' },
          picture({ src: ctx.site.owlImage, w: 1000, h: 1000, alt: '' }, { className: 'ws-owl', decorative: true, sizes: '90px', eager: true }),
          h('div', { class: 'ws-title' }, h('p', { class: 'ws-site' }, ctx.site.title), h('h2', {}, `Week ${entry.number}: ${week.title}`), entry.unit ? h('p', { class: 'ws-unit' }, entry.unit) : null),
          h('div', { class: 'ws-score', 'aria-label': 'Score' }, h('span', {}, 'My score'), h('span', { class: 'ws-stars' }, '☆ ☆ ☆ ☆ ☆'))),
        h('div', { class: 'ws-name' }, h('p', {}, 'Name: ', h('span', { class: 'ws-blank' })), h('p', {}, 'Class: ', h('span', { class: 'ws-blank is-short' })), h('p', {}, 'Date: ', h('span', { class: 'ws-blank is-short' }))),
        n ? sections : h('p', {}, 'Choose at least one activity.'),
        n ? h('footer', { class: 'ws-foot' }, h('span', {}, 'Great job, Explorer!'), h('span', { class: 'ws-check' }, 'Teacher check: ☐')) : null),
      key);
  };

  const chk = (label, checked, onChange) => {
    const input = h('input', { type: 'checkbox', checked });
    input.addEventListener('change', () => { onChange(input.checked); draw(); });
    return h('label', { class: 'chip' }, input, h('span', {}, label));
  };
  const countSel = h('select', { class: 'select ws-count', 'aria-label': 'Questions per activity' }, [3, 5, 8, 10].map((v) => h('option', { value: String(v), selected: v === state.n }, `${v} per activity`)));
  countSel.addEventListener('change', () => { state.n = Number(countSel.value); draw(); });
  form.append(
    h('h1', {}, 'Printable worksheet'),
    h('p', { class: 'lead' }, 'Choose activities. Print the worksheet and the answer key.'),
    h('fieldset', { class: 'choice-set' }, h('legend', {}, 'Activities'),
      h('div', { class: 'chips' }, banks.map((b) => chk(`${b.letter} ${b.title}`, state.picked.has(b.id), (on) => (on ? state.picked.add(b.id) : state.picked.delete(b.id)))))),
    h('fieldset', { class: 'choice-set' }, h('legend', {}, 'Options'),
      h('div', { class: 'chips' }, countSel,
        chk('Pictures', state.pictures, (on) => { state.pictures = on; }),
        chk('Word box', state.wordBox, (on) => { state.wordBox = on; }),
        chk('Answer key (new page)', state.key, (on) => { state.key = on; }))),
    h('div', { class: 'actions' },
      button('New mix', { icon: 'shuffle', onClick: () => { state.seed = newSeed(); draw(); } }),
      button('Print', { icon: 'note', kind: 'primary', onClick: () => window.print() })));
  form.addEventListener('submit', (e) => e.preventDefault());
  draw();
  return screen('Worksheet', weekBar(ctx, 'practise'), form, sheetWrap);
}
