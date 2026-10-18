import { h, icon, button } from '../ui.js';
import { buildHash } from '../router.js';
import { onSpeechReady, speak } from '../speech.js';

export const SECTIONS = [
  { id: 'words', label: 'Words', icon: 'words', text: 'Look, guess and learn the new words.' },
  { id: 'learn', label: 'Learn', icon: 'learn', text: 'Read and watch simple explanations.' },
  { id: 'examples', label: 'Examples', icon: 'note', text: 'See clear examples with pictures.' },
  { id: 'practise', label: 'Practice', icon: 'practise', text: 'Try different question types.' },
  { id: 'play', label: 'Games', icon: 'play', text: 'Have fun and learn at the same time!' },
  { id: 'challenge', label: 'Challenge', icon: 'star', text: 'Test what you have learned!' },
  { id: 'speak', label: 'Speak', icon: 'speak', text: 'Ask and answer with cards.' }
];

export function screen(title, ...children) {
  const el = h('div', { class: 'screen' }, ...children);
  el.dataset.title = title;
  return el;
}

/** Week top bar: link to the week home + section tabs. */
export function weekBar(ctx, active) {
  const weekId = ctx.week.week.id;
  const e = ctx.week.entry;
  return h('div', { class: 'week-bar' },
    h('a', { class: 'btn btn-ghost back-link', href: buildHash(['week', weekId]) }, icon('back'), h('span', { class: 'btn-label' }, `${e.unit ? `${e.unit} · ` : ''}Week ${e.number}`)),
    h('nav', { class: 'section-tabs', 'aria-label': `Week ${ctx.week.entry.number} sections` },
      SECTIONS.map((s) => h('a', {
        href: buildHash(['week', weekId, s.id]),
        class: `tab tab-${s.id}${active === s.id ? ' is-active' : ''}`,
        'aria-current': active === s.id ? 'page' : undefined
      }, icon(s.icon, { size: 20 }), h('span', {}, s.label))))
  );
}

/** A "Listen" button that only appears when the device can speak English. */
export function listenButton(ctx, getText, label = 'Listen') {
  const b = button(label, { icon: 'sound', kind: 'ghost', onClick: () => speak(typeof getText === 'function' ? getText() : getText) });
  b.classList.add('listen-btn');
  b.hidden = true;
  const off = onSpeechReady((ok) => { b.hidden = !ok; });
  ctx.onCleanup(off);
  return b;
}

export function progressText(current, total, noun = 'Step') {
  return h('p', { class: 'progress-text', 'aria-live': 'off' }, `${noun} ${current} of ${total}`);
}

export function progressBar(current, total) {
  const pct = total ? Math.round((current / total) * 100) : 0;
  return h('div', { class: 'progress-bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(total), 'aria-valuenow': String(current), 'aria-label': 'Progress' },
    h('span', { style: `width:${pct}%` }));
}

export const TARGET_LABELS = {
  all: 'All',
  affirmative: 'Positive (+)',
  negative: 'Negative (−)',
  question: 'Questions (?)',
  mixed: 'Mixed',
  vocabulary: 'Words'
};
