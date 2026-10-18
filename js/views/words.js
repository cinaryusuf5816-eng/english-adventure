// Words: word sets (everyday words + book words). One big card (picture first → Show → Hide) or all cards.
import { h, picture, button, rich, clock, announce, preloadImage } from '../ui.js';
import { buildHash, go } from '../router.js';
import { screen, weekBar, listenButton, progressText } from './common.js';
import { markDone } from '../progress.js';

export function wordSets(week) {
  return [{ id: 'everyday', title: 'Everyday actions', words: week.words }, ...(week.extraWordSets || [])];
}

export function renderWords(ctx) {
  const { week } = ctx.week;
  const sets = wordSets(week);
  const set = sets.find((s) => s.id === ctx.route.set) || sets[0];
  const setQuery = set.id === sets[0].id ? {} : { set: set.id };
  const words = set.words;
  const view = ctx.route.view === 'grid' ? 'grid' : 'single';
  const index = Math.min(Math.max(parseInt(ctx.route.index || '1', 10) || 1, 1), words.length) - 1;

  const setTabs = sets.length > 1 ? h('div', { class: 'mode-tabs set-tabs', role: 'group', 'aria-label': 'Word sets' }, sets.map((s) =>
    h('a', { class: `mode-tab${s.id === set.id ? ' is-active' : ''}`, href: buildHash(['week', week.id, 'words'], s.id === sets[0].id ? {} : { set: s.id }), 'aria-current': s.id === set.id ? 'true' : undefined },
      h('strong', {}, s.title), h('span', {}, `${s.words.length} words`)))) : null;

  const toggle = h('div', { class: 'view-toggle', role: 'group', 'aria-label': 'View' },
    h('a', { class: `btn btn-ghost${view === 'single' ? ' is-active' : ''}`, href: buildHash(['week', week.id, 'words', String(index + 1)], setQuery), 'aria-current': view === 'single' ? 'true' : undefined }, 'One card'),
    h('a', { class: `btn btn-ghost${view === 'grid' ? ' is-active' : ''}`, href: buildHash(['week', week.id, 'words'], { ...setQuery, view: 'grid' }), 'aria-current': view === 'grid' ? 'true' : undefined }, 'All cards'));

  const head = h('header', { class: 'section-head' },
    h('h1', {}, 'Words'),
    h('p', { class: 'lead' }, 'Look. Guess. Then open the card.'),
    setTabs,
    set.source ? h('p', { class: 'muted small' }, set.source) : null,
    toggle);

  if (view === 'grid') {
    const grid = h('div', { class: 'word-grid' }, words.map((w) => wordTile(ctx, w)));
    const allBtns = h('div', { class: 'actions' },
      button('Open all', { icon: 'eye', onClick: () => { grid.querySelectorAll('.word-tile').forEach((t) => t.setOpen(true)); markDone(week.id, 'words', set.id); } }),
      button('Hide all', { icon: 'eyeOff', onClick: () => grid.querySelectorAll('.word-tile').forEach((t) => t.setOpen(false)) }));
    return screen('Words', weekBar(ctx, 'words'), head, allBtns, grid);
  }

  const w = words[index];
  if (index === words.length - 1) markDone(week.id, 'words', set.id);
  const img = ctx.week.image(w.image);
  const answer = h('div', { class: 'word-answer', hidden: true, id: 'word-answer' },
    w.word && w.word !== w.phrase ? h('p', { class: 'word-key' }, w.word) : null,
    h('p', { class: 'word-phrase' }, w.phrase),
    h('p', { class: 'word-example' }, rich(w.example), w.time ? clock(w.time) : null),
    w.note ? h('p', { class: 'word-note' }, w.note) : null,
    listenButton(ctx, () => `${w.phrase}. ${w.example}`));
  const reveal = button('Show the word', { icon: 'eye', kind: 'primary', attrs: { 'aria-controls': 'word-answer', 'aria-expanded': 'false' } });
  reveal.addEventListener('click', () => {
    const open = answer.hidden;
    answer.hidden = !open;
    reveal.setAttribute('aria-expanded', String(open));
    reveal.querySelector('.btn-label').textContent = open ? 'Hide the word' : 'Show the word';
    if (open) announce(w.phrase);
  });
  const nav = h('div', { class: 'step-nav' },
    button('Previous', { icon: 'prev', onClick: () => go(['week', week.id, 'words', String(index)], setQuery), attrs: { disabled: index === 0 } }),
    progressText(index + 1, words.length, 'Card'),
    button('Next', { icon: 'next', kind: 'primary', onClick: () => go(['week', week.id, 'words', String(index + 2)], setQuery), attrs: { disabled: index === words.length - 1 } }));
  if (words[index + 1]) preloadImage(ctx.week.image(words[index + 1].image));

  const card = h('article', { class: 'word-stage' },
    picture(img, { className: 'stage-pic', eager: true, sizes: '(max-width: 760px) 92vw, 60vw' }),
    h('div', { class: 'stage-side' }, h('p', { class: 'stage-q' }, 'What is it?'), reveal, answer));
  return screen('Words', weekBar(ctx, 'words'), head, card, nav);
}

function wordTile(ctx, w) {
  const img = ctx.week.image(w.image);
  const label = h('div', { class: 'tile-answer', hidden: true },
    h('strong', {}, w.phrase), h('span', {}, w.example));
  const btn = button('Show', { icon: 'eye', kind: 'ghost' });
  const tile = h('article', { class: 'word-tile' }, picture(img, { sizes: '(max-width: 760px) 46vw, 22vw' }), h('div', { class: 'tile-foot' }, btn, label));
  tile.setOpen = (open) => {
    label.hidden = !open;
    btn.querySelector('.btn-label').textContent = open ? 'Hide' : 'Show';
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => tile.setOpen(label.hidden));
  return tile;
}
