// Change Machine view: a sentence turns into a negative or a question, one change at a time.
// Colour + label for every block (who / helper / verb / ending), never colour alone.
import { h, button, icon, announce } from '../ui.js';
import { machineSteps, stepText, formula } from '../core/machine.js';
import { listenButton } from './common.js';

const ROLE_NAMES = { subject: 'who', helper: 'helper', verb: 'verb', end: 'ending', rest: '', mark: '' };
const reducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function blockEl(x) {
  const label = ROLE_NAMES[x.role];
  return h('span', { class: `blk blk-${x.role}${x.state ? ` is-${x.state}` : ''}`, 'data-role': x.role },
    h('span', { class: 'blk-t' }, x.t),
    label ? h('span', { class: 'blk-l', 'aria-hidden': 'true' }, label) : null);
}

export function legend() {
  return h('ul', { class: 'blk-legend', 'aria-label': 'Colours' },
    h('li', {}, h('span', { class: 'blk blk-subject mini' }, 'who')),
    h('li', {}, h('span', { class: 'blk blk-helper mini' }, 'do / does / don’t / doesn’t')),
    h('li', {}, h('span', { class: 'blk blk-verb mini' }, 'verb')),
    h('li', {}, h('span', { class: 'blk blk-end mini' }, '-s / -es')));
}

/**
 * @param opts {subject, verb, to, onDone, compact}
 */
export function machineView(ctx, { subject, verb, to, onDone, compact = false }) {
  const steps = machineSteps(subject, verb, to);
  const rows = h('ol', { class: 'm-rows' });
  const caption = h('p', { class: 'm-caption', 'aria-live': 'polite' });
  const frame = h('div', { class: 'm-formula', hidden: true });
  let shown = 0;
  let anims = [];
  ctx.onCleanup(() => anims.forEach((a) => a.cancel && a.cancel()));

  const next = button('Show the next change', { icon: 'next', kind: 'primary' });
  const again = button('Start again', { icon: 'restart', kind: 'ghost' });

  function rowEl(step, i) {
    return h('li', { class: 'm-row is-current', 'data-step': String(i) },
      h('span', { class: `m-label lab-${step.label === '+' ? 'pos' : step.label === '?' ? 'q' : 'neg'}`, 'aria-label': step.label === '+' ? 'positive' : step.label === '?' ? 'question' : 'negative' }, step.label),
      h('span', { class: 'm-blocks' }, step.blocks.map(blockEl)),
      h('span', { class: 'sr-only' }, stepText(step)));
  }

  function fly(fromRow, toRow, text) {
    if (reducedMotion() || !fromRow || !toRow) return;
    const from = fromRow.querySelector('.blk-end');
    const target = toRow.querySelector('.blk-helper');
    if (!from || !target) return;
    const a = from.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const chip = h('span', { class: 'blk blk-end fly-chip', 'aria-hidden': 'true' }, text);
    chip.style.left = `${a.left}px`;
    chip.style.top = `${a.top}px`;
    document.body.append(chip);
    const anim = chip.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${(b.left + b.width - 18 - a.left) / 2}px, ${(b.top - a.top) / 2 - 50}px) scale(1.4)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${b.left + b.width - 18 - a.left}px, ${b.top - a.top}px) scale(1)`, opacity: 0.2 }
    ], { duration: 900, easing: 'cubic-bezier(.3,.7,.3,1)' });
    anims.push(anim);
    anim.onfinish = () => chip.remove();
    anim.oncancel = () => chip.remove();
  }

  function show(i) {
    const step = steps[i];
    rows.querySelectorAll('.m-row').forEach((r) => r.classList.remove('is-current'));
    const prev = rows.lastElementChild;
    const row = rowEl(step, i);
    rows.append(row);
    caption.replaceChildren(icon('bulb', { size: 20 }), h('span', {}, step.caption));
    if (step.fly) fly(prev, row, step.fly.text);
    shown = i + 1;
    const end = shown >= steps.length;
    next.disabled = end;
    if (end) {
      if (to !== 'all' && to !== 'positive-s') {
        frame.replaceChildren(h('span', { class: 'm-frame-title' }, 'The rule:'), ...formula(subject, to).map((f) => h('span', { class: `blk blk-${f.role} slot` }, f.t)));
        frame.hidden = false;
      }
      if (onDone) onDone();
    }
    announce(`${stepText(step)} ${step.caption}`);
  }

  function restart() {
    anims.forEach((a) => a.cancel && a.cancel());
    anims = [];
    rows.replaceChildren();
    frame.hidden = true;
    shown = 0;
    show(0);
    next.disabled = steps.length < 2;
  }

  next.addEventListener('click', () => { if (shown < steps.length) show(shown); });
  again.addEventListener('click', restart);
  restart();

  return h('div', { class: `machine${compact ? ' is-compact' : ''}` },
    compact ? null : legend(),
    rows,
    caption,
    frame,
    h('div', { class: 'actions m-actions' }, next, again, listenButton(ctx, () => stepText(steps[Math.max(0, shown - 1)]))));
}
