// My Progress: what is done this week (saved in this browser only).
import { h, button, confirmAction, announce } from '../ui.js';
import { buildHash } from '../router.js';
import { screen, weekBar } from './common.js';
import { summary, missions, resetProgress } from '../progress.js';
import { progressPanel, owl } from './home.js';
import { weekBadges, badgeEl } from '../badges.js';

export function renderProgress(ctx) {
  const s = summary(ctx.week);
  const weekId = ctx.week.week.id;
  const reset = button('Start the week again', { icon: 'restart', onClick: async () => {
    const ok = await confirmAction({ title: 'Clear the progress?', text: `This clears the ticks for Week ${ctx.week.entry.number} on this device. Lessons stay open.`, ok: 'Clear', cancel: 'Cancel' });
    if (!ok) return;
    resetProgress(weekId);
    announce('Progress cleared.');
    ctx.rerender();
  } });
  return screen('My Progress', weekBar(ctx, 'progress'),
    h('header', { class: 'section-head' }, h('h1', {}, 'My Progress'),
      h('p', { class: 'lead' }, `Week ${ctx.week.entry.number}: ${s.pct}% done. Every step counts!`)),
    h('div', { class: 'progress-page' },
      progressPanel(ctx),
      h('section', { class: 'panel progress-detail' },
        h('h2', {}, 'What to do next'),
        h('ul', { class: 'next-list' }, s.rows.filter((r) => !r.complete).map((r) =>
          h('li', {}, h('a', { href: buildHash(['week', weekId, r.id]) }, r.label), ` — ${r.total - r.done} more to go`))),
        s.rows.every((r) => r.complete) ? h('p', { class: 'lead' }, 'Everything is done. Amazing work, Explorer!') : null,
        h('h2', {}, 'My badges'),
        h('div', { class: 'badge-row' }, weekBadges(ctx.week).map((b) => badgeEl(b))),
        h('p', {}, h('a', { class: 'btn btn-gold', href: buildHash(['week', weekId, 'certificate']) }, h('span', { class: 'btn-label' }, 'Open my certificate'))),
        h('h2', {}, "Today's Mission"),
        h('ul', { class: 'next-list' }, missions(ctx.week).map((m) => h('li', {}, m.done ? '✓ ' : '○ ', m.text))),
        h('p', { class: 'muted small' }, 'Progress is saved only in this browser on this device.'),
        h('div', { class: 'actions' }, reset)),
      owl(ctx)));
}
