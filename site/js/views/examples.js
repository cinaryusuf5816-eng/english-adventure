// Examples: picture cards → the Change Machine shows + / − / ? step by step.
import { h, picture, button, icon } from '../ui.js';
import { buildHash, go } from '../router.js';
import { screen, weekBar, progressText } from './common.js';
import { machineView, legend } from './machine.js';
import { buildSentence } from '../core/grammar.js';
import { markDone } from '../progress.js';

const MODES = [
  { id: 'negative', label: '+ → −', name: 'Make it negative' },
  { id: 'question', label: '+ → ?', name: 'Make a question' },
  { id: 'positive-s', label: 'I → he', name: 'I play → He plays', singleOnly: true },
  { id: 'all', label: '+ − ?', name: 'All three' }
];

export function renderExamples(ctx) {
  const { week } = ctx.week;
  const list = week.examples || [];
  const sw = week.games.sentenceSwitch;
  const subjectOf = (id) => sw.subjects.find((s) => s.id === id);
  const verbOf = (id) => sw.verbs.find((v) => v.id === id);

  if (!ctx.route.example) {
    return screen('Examples', weekBar(ctx, 'examples'),
      h('header', { class: 'section-head' },
        h('h1', {}, 'Examples'),
        h('p', { class: 'lead' }, 'Choose a picture. Watch the sentence change: + → − → ?'),
        legend()),
      h('div', { class: 'example-grid' }, list.map((ex) => {
        const s = buildSentence(subjectOf(ex.subject), verbOf(ex.verb), 'positive');
        return h('a', { class: 'example-card', href: buildHash(['week', week.id, 'examples', ex.id]) },
          picture(ctx.week.image(ex.image), { sizes: '(max-width: 760px) 46vw, 22vw' }),
          h('span', { class: 'example-text' }, s.text),
          ex.note ? h('span', { class: 'example-note' }, ex.note) : null);
      })));
  }

  const idx = list.findIndex((x) => x.id === ctx.route.example);
  if (idx < 0) return screen('Examples', weekBar(ctx, 'examples'), h('section', { class: 'panel message' }, h('h1', {}, 'We could not find that example.'), h('a', { class: 'btn btn-primary', href: buildHash(['week', week.id, 'examples']) }, 'All examples')));
  const ex = list[idx];
  const subject = subjectOf(ex.subject);
  const verb = verbOf(ex.verb);
  const single = subject.person === 'single';
  const modes = MODES.filter((m) => !m.singleOnly || single);
  const mode = modes.find((m) => m.id === ctx.route.mode) || modes[0];

  const tabs = h('div', { class: 'mode-tabs', role: 'group', 'aria-label': 'Change' }, modes.map((m) =>
    h('a', { class: `mode-tab${m.id === mode.id ? ' is-active' : ''}`, href: buildHash(['week', week.id, 'examples', ex.id, m.id]), 'aria-current': m.id === mode.id ? 'true' : undefined },
      h('strong', {}, m.label), h('span', {}, m.name))));

  const machine = machineView(ctx, { subject, verb, to: mode.id, onDone: () => markDone(week.id, 'examples', ex.id) });

  return screen('Examples', weekBar(ctx, 'examples'),
    h('header', { class: 'section-head learn-head' },
      h('p', { class: 'eyebrow' }, `Example ${idx + 1} of ${list.length}`),
      h('h1', {}, 'Watch it change'),
      h('div', { class: 'head-tools' }, h('a', { class: 'btn btn-ghost', href: buildHash(['week', week.id, 'examples']) }, icon('grid'), h('span', { class: 'btn-label' }, 'All examples')))),
    h('section', { class: 'lesson-stage machine-stage' },
      picture(ctx.week.image(ex.image), { className: 'stage-pic', eager: true, sizes: '(max-width: 760px) 92vw, 40vw' }),
      h('div', { class: 'stage-side' }, tabs, machine)),
    h('div', { class: 'step-nav' },
      button('Previous', { icon: 'prev', onClick: () => go(['week', week.id, 'examples', list[idx - 1].id]), attrs: { disabled: idx === 0 } }),
      progressText(idx + 1, list.length, 'Example'),
      button('Next example', { icon: 'next', kind: 'primary', onClick: () => go(['week', week.id, 'examples', list[idx + 1].id]), attrs: { disabled: idx === list.length - 1 } })));
}
