// Week dashboard (home): hero sign, Choose Your Path, My Progress, owl tip, Today's Mission.
import { h, picture, icon } from '../ui.js';
import { buildHash } from '../router.js';
import { screen } from './common.js';
import { weekCard } from './weeks.js';
import { summary, missions } from '../progress.js';

const PATHS = [
  { id: 'learn', title: 'Learn', text: 'Read and watch simple explanations.', tone: 'blue' },
  { id: 'examples', title: 'Examples', text: 'See clear examples with pictures.', tone: 'pink' },
  { id: 'practise', title: 'Practice', text: 'Try different question types.', tone: 'lilac' },
  { id: 'play', title: 'Games', text: 'Have fun and learn at the same time!', tone: 'yellow' },
  { id: 'challenge', title: 'Challenge', text: 'Test what you’ve learned!', tone: 'peach' }
];

function bubble(lines, side) {
  return h('p', { class: `hero-bubble bubble-${side}` }, lines.flatMap((l, i) => (i ? [h('br'), l] : [l])));
}

function checkCircle(done) {
  return h('span', { class: `check-circle${done ? ' is-done' : ''}`, 'aria-hidden': 'true' }, done ? '✓' : '');
}

export function progressPanel(ctx) {
  const s = summary(ctx.week);
  return h('section', { class: 'progress-panel wood', 'aria-labelledby': 'mp-h' },
    h('h2', { id: 'mp-h' }, icon('grid', { size: 22 }), h('span', {}, 'My Progress')),
    h('div', { class: 'mp-inner' },
      h('p', { class: 'mp-week' }, `Week ${ctx.week.entry.number}`),
      h('div', { class: 'mp-bar' },
        h('div', { class: 'progress-bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(s.pct), 'aria-label': 'Week progress' }, h('span', { style: `width:${s.pct}%` })),
        h('span', { class: 'mp-pct' }, `${s.pct}%`)),
      h('ul', { class: 'mp-list' }, s.rows.map((r) => h('li', { class: r.complete ? 'is-done' : '' },
        checkCircle(r.complete),
        h('a', { href: buildHash(['week', ctx.week.week.id, r.id]) }, r.label),
        h('span', { class: 'mp-count' }, `${r.done}/${r.total}`))))));
}

export function owl(ctx) {
  const tips = ctx.site.owlTips || ['Mistakes help you learn!'];
  let i = Math.floor(Date.now() / 60000) % tips.length;
  const text = h('span', {}, tips[i]);
  const btn = h('button', { type: 'button', class: 'owl-bubble', 'aria-live': 'polite', title: 'Next tip' }, '“', text, '”');
  btn.addEventListener('click', () => { i = (i + 1) % tips.length; text.textContent = tips[i]; });
  return h('div', { class: 'owl' },
    btn,
    picture({ src: ctx.site.owlImage, w: 1000, h: 1000, alt: 'Hoot the owl, your guide.' }, { className: 'owl-pic', sizes: '220px' }));
}

export function renderHome(ctx) {
  const { site } = ctx;
  if (!ctx.week) {
    return screen('Home', h('section', { class: 'panel' }, h('h1', {}, site.title), h('p', { class: 'lead' }, 'Choose a week.'),
      h('div', { class: 'week-grid' }, ctx.curriculum.weeks.map(weekCard))));
  }
  const { week, entry } = ctx.week;
  const d = week.dashboard || {};
  const link = (id) => buildHash(['week', week.id, id]);

  const hero = h('section', { class: 'dash-hero', 'aria-labelledby': 'hero-title' },
    picture({ src: site.heroImage, w: 1400, h: 700, alt: site.heroAlt }, { className: 'hero-art', eager: true, sizes: '(max-width: 900px) 100vw, 70vw' }),
    d.bubbleLeft ? bubble(d.bubbleLeft, 'left') : null,
    d.bubbleRight ? bubble(d.bubbleRight, 'right') : null,
    h('div', { class: 'wood-sign' },
      h('p', { class: 'sign-unit' }, `${entry.unit ? `${entry.unit} – ` : ''}Week ${entry.number}`),
      h('h1', { id: 'hero-title' }, week.title),
      h('p', { class: 'sign-tag' }, d.tagline || week.subtitle),
      h('a', { class: 'btn btn-primary btn-start', href: link('learn') }, h('span', { class: 'btn-label' }, 'Start Learning'), icon('next'))),
    h('nav', { class: 'signposts', 'aria-label': 'Shortcuts' },
      h('a', { href: link('learn'), class: 'post' }, 'Explanation'),
      h('a', { href: link('practise'), class: 'post' }, 'Practice'),
      h('a', { href: link('play'), class: 'post' }, 'Games'),
      h('a', { href: link('challenge'), class: 'post' }, 'You can do it!')));

  const path = h('section', { class: 'path-panel', 'aria-labelledby': 'path-h' },
    h('header', { class: 'path-head' },
      h('span', { class: 'path-compass', 'aria-hidden': 'true' }, icon('star', { size: 26 })),
      h('div', {}, h('h2', { id: 'path-h' }, 'Choose Your Path'), h('p', {}, 'Explore the activities and complete them one by one.'))),
    h('div', { class: 'path-grid' }, PATHS.map((p) => h('a', { class: `path-card tone-${p.tone}`, href: link(p.id) },
      picture({ src: site.pathIcons[p.id], w: 600, h: 600, alt: '' }, { className: 'path-icon', decorative: true, sizes: '120px' }),
      h('span', { class: 'path-title' }, p.title),
      h('span', { class: 'path-text' }, p.text),
      h('span', { class: 'path-go', 'aria-hidden': 'true' }, icon('next', { size: 20 }))))),
    h('p', { class: 'path-more' }, 'Also: ',
      h('a', { href: link('words') }, 'Words'), ' · ',
      h('a', { href: link('speak') }, 'Speak'), ' · ',
      h('a', { href: link('progress') }, 'My Progress')));

  const mission = h('section', { class: 'mission parchment', 'aria-labelledby': 'mission-h' },
    h('h2', { id: 'mission-h' }, h('span', { class: 'target', 'aria-hidden': 'true' }, '◎'), "Today's Mission"),
    h('ul', {}, missions(ctx.week).map((m) => h('li', { class: m.done ? 'is-done' : '' }, checkCircle(m.done), h('span', {}, m.text, m.check.all ? ' ★' : '')))));

  const banner = h('section', { class: 'dash-banner' },
    picture({ src: site.landscapeImage, w: 1400, h: 700, alt: '' }, { className: 'banner-art', decorative: true, sizes: '(max-width: 900px) 100vw, 60vw' }),
    h('p', { class: 'banner-text' }, site.tagline));

  const weeks = h('section', { class: 'dash-weeks', 'aria-labelledby': 'weeks-h' },
    h('h2', { id: 'weeks-h' }, 'Your weeks'),
    h('div', { class: 'week-grid' }, ctx.curriculum.weeks.map(weekCard)));

  return screen(`Week ${entry.number}`,
    h('div', { class: 'dash' },
      h('div', { class: 'dash-main' }, hero, path),
      h('div', { class: 'dash-side' }, progressPanel(ctx), owl(ctx)),
      h('div', { class: 'dash-bottom' }, mission, banner),
      weeks));
}
