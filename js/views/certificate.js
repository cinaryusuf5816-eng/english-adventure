// Explorer Certificate: printable. The name is typed for printing only and is never saved.
import { h, button, picture } from '../ui.js';
import { screen, weekBar } from './common.js';
import { weekBadges, badgeEl } from '../badges.js';
import { summary } from '../progress.js';

export function renderCertificate(ctx) {
  const { week, entry } = ctx.week;
  const badges = weekBadges(ctx.week);
  const earned = badges.filter((b) => b.earned);
  const s = summary(ctx.week);
  const nameInput = h('input', { type: 'text', class: 'cert-name-input', maxlength: '40', autocomplete: 'off', 'aria-label': 'Explorer name (for printing only, not saved)', placeholder: 'Write your name' });
  const nameLine = h('span', { class: 'cert-name' }, ' ');
  nameInput.addEventListener('input', () => { nameLine.textContent = nameInput.value.trim() || ' '; });
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return screen('Certificate', weekBar(ctx, 'progress'),
    h('section', { class: 'cert-tools panel no-print' },
      h('h1', {}, 'My Explorer Certificate'),
      h('p', { class: 'lead' }, 'Write your name. Then print it or show it on the board.'),
      h('label', { class: 'input-label' }, 'Name (not saved):', nameInput),
      h('div', { class: 'actions' },
        button('Print', { icon: 'note', kind: 'primary', onClick: () => window.print() }),
        earned.length ? null : h('span', { class: 'muted' }, 'Tip: finish a section to earn your first badge!'))),
    h('article', { class: 'certificate', 'aria-label': 'Certificate' },
      h('div', { class: 'cert-inner' },
        picture({ src: 'assets/images/ui/cert-frame', w: 1400, h: 933, alt: '' }, { className: 'cert-frame', decorative: true, sizes: '(max-width: 960px) 100vw, 960px', eager: true }),
        h('div', { class: 'cert-content' },
          h('h2', { class: 'cert-title' }, h('span', { class: 'cert-title-small' }, 'Certificate of'), 'Achievement'),
          h('p', { class: 'cert-line' }, 'This certificate is proudly given to'),
          nameLine,
          h('p', { class: 'cert-line' }, `for exploring ${entry.unit ? `${entry.unit}, ` : ''}Week ${entry.number}: `, h('strong', {}, week.title), '.'),
          h('p', { class: 'cert-score' }, `Week progress: ${s.pct}%  ·  Badges: ${earned.length} of ${badges.length}`),
          h('div', { class: 'badge-row cert-badges' }, badges.map((b) => badgeEl(b, { small: true }))),
          h('div', { class: 'cert-foot' },
            h('div', {}, h('span', { class: 'cert-sign' }, ' '), h('span', {}, 'Teacher')),
            h('div', { class: 'cert-seal', 'aria-hidden': 'true' },
              picture({ src: ctx.site.owlImage, w: 1000, h: 1000, alt: '' }, { className: 'cert-owl', decorative: true, sizes: '120px', eager: true }),
              h('span', { class: 'cert-ribbon' }, `Week ${entry.number}`)),
            h('div', {}, h('span', { class: 'cert-sign' }, today), h('span', {}, 'Date')))))));
}
