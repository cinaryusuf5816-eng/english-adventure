// Speak: question → optional word help → optional example answer.
// Open questions: no automatic marking, no microphone.
import { h, picture, button, clock, announce, preloadImage } from '../ui.js';
import { go } from '../router.js';
import { screen, weekBar, listenButton, progressText } from './common.js';
import { markDone } from '../progress.js';

export function renderSpeak(ctx) {
  const { week } = ctx.week;
  const cards = week.speaking;
  const index = Math.min(Math.max(parseInt(ctx.route.index || '1', 10) || 1, 1), cards.length) - 1;
  const c = cards[index];

  const help = h('ul', { class: 'speak-help', hidden: true }, c.help.map((x) => h('li', {}, x)));
  const sample = h('p', { class: 'speak-sample', hidden: true }, h('span', { class: 'who' }, 'For example: '), c.sample);
  const toggle = (el, b, show, hide) => () => {
    el.hidden = !el.hidden;
    b.querySelector('.btn-label').textContent = el.hidden ? show : hide;
    b.setAttribute('aria-expanded', String(!el.hidden));
    if (!el.hidden) announce(el.textContent);
  };
  const bHelp = button('Word help', { icon: 'bulb', attrs: { 'aria-expanded': 'false' } });
  bHelp.addEventListener('click', toggle(help, bHelp, 'Word help', 'Hide word help'));
  const bSample = button('Example answer', { icon: 'eye', attrs: { 'aria-expanded': 'false' } });
  bSample.addEventListener('click', toggle(sample, bSample, 'Example answer', 'Hide example'));

  const mark = h('p', { class: 'speak-mark', role: 'status' });
  const done = button('Done', { icon: 'check', kind: 'primary', onClick: () => { mark.className = 'speak-mark is-done'; mark.textContent = 'Well spoken!'; markDone(week.id, 'speak', c.id); } });
  const again = button('Try again', { icon: 'restart', onClick: () => { mark.className = 'speak-mark is-again'; mark.textContent = 'Let’s say it one more time.'; } });

  if (cards[index + 1]) preloadImage(ctx.week.image(cards[index + 1].image));

  return screen('Speak', weekBar(ctx, 'speak'),
    h('header', { class: 'section-head' },
      h('h1', {}, 'Speak'),
      h('p', { class: 'lead' }, 'Ask. Answer. Help is there if you need it.')),
    h('article', { class: 'speak-card lesson-stage' },
      picture(ctx.week.image(c.image), { className: 'stage-pic', eager: true, sizes: '(max-width: 760px) 92vw, 55vw' }),
      h('div', { class: 'stage-side' },
        h('p', { class: 'stage-kicker' }, `Card ${index + 1}`),
        h('p', { class: 'speak-q' }, c.question),
        c.time ? clock(c.time) : null,
        c.personal ? h('p', { class: 'muted small' }, 'Answers can be different. Yes and No can both be right.') : null,
        h('div', { class: 'actions' }, bHelp, bSample),
        help, sample,
        listenButton(ctx, () => c.question),
        h('div', { class: 'actions teacher-marks', role: 'group', 'aria-label': 'Teacher' }, done, again),
        mark,
        h('p', { class: 'muted small' }, 'The site does not listen or record. The teacher decides.'))),
    h('div', { class: 'step-nav' },
      button('Previous', { icon: 'prev', onClick: () => go(['week', week.id, 'speak', String(index)]), attrs: { disabled: index === 0 } }),
      progressText(index + 1, cards.length, 'Card'),
      button('Next card', { icon: 'next', kind: 'primary', onClick: () => go(['week', week.id, 'speak', String(index + 2)]), attrs: { disabled: index === cards.length - 1 } })));
}
