import { h, picture, icon } from '../ui.js';
import { buildHash } from '../router.js';
import { screen } from './common.js';

export function weekCard(w) {
  if (!w.published) {
    return h('div', { class: 'week-card is-soon', 'aria-disabled': 'true' },
      h('div', { class: 'week-soon-art', 'aria-hidden': 'true' }, icon('lock', { size: 40 })),
      h('div', { class: 'week-card-body' },
        h('p', { class: 'eyebrow' }, `Week ${w.number}`),
        h('h3', {}, 'Coming soon'),
        h('p', { class: 'muted' }, 'Not open yet.')));
  }
  return h('a', { class: 'week-card', href: buildHash(['week', w.id]) },
    picture(w.coverFile ? { file: w.coverFile, w: 1400, h: 788, alt: '' } : w.cover ? { src: w.cover, w: 1400, h: 788, alt: '' } : null, { decorative: true, sizes: '(max-width: 760px) 92vw, 40vw' }),
    h('div', { class: 'week-card-body' },
      h('p', { class: 'eyebrow' }, `Week ${w.number}`),
      h('h3', {}, w.title),
      h('p', { class: 'muted' }, w.subtitle)));
}

export function renderWeeks(ctx) {
  return screen('Weeks',
    h('section', { class: 'panel' },
      h('h1', {}, 'Weeks'),
      h('p', { class: 'lead' }, 'Choose a week.'),
      h('div', { class: 'week-grid' }, ctx.curriculum.weeks.map(weekCard))));
}
