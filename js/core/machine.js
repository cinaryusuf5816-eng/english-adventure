// Change Machine: the step-by-step change from a positive sentence to a negative
// or a question, as coloured blocks. Pure (no DOM) and unit-tested.
//
// Block roles: subject · helper (do / does / don't / doesn't) · verb · end (-s / -es / -ies) · rest · mark (?)
// Block states: '' (same as before) · 'new' (just added) · 'changed' (just changed) · 'gone' (about to leave)
// A step may say { fly: { from: 'end', to: 'helper' } }: the ending moves into the helper.

const PRONOUNS = ['He', 'She', 'It', 'We', 'They', 'You'];

function questionSubject(subject) {
  if (subject.text === 'I') return 'I';
  if (PRONOUNS.includes(subject.text)) return subject.text.toLowerCase();
  return subject.text; // names keep their capital letter
}

function splitVerb(verb) {
  // plays → play + s · watches → watch + es · does → do + es ; has / studies are special
  if (verb.s.startsWith(verb.base)) return { stem: verb.base, end: verb.s.slice(verb.base.length), special: false };
  return { stem: verb.s, end: '', special: true };
}

const b = (t, role, state = '') => ({ t, role, state });
const restOf = (verb, subject) => verb.rest.replace('{poss}', subject.poss);

/** Sentence text of a step (for captions, tests and Listen). */
export function stepText(step) {
  const words = [];
  let text = '';
  for (const x of step.blocks) {
    if (x.state === 'gone') continue;
    if (x.role === 'end') { text += x.t; continue; }
    if (x.role === 'mark') { text += x.t; continue; }
    if (text) words.push(text);
    text = x.t;
  }
  if (text) words.push(text);
  const s = words.join(' ');
  return /[?]$/.test(s) ? s : `${s}.`;
}

/**
 * @param subject {text, person, poss}
 * @param verb    {base, s, rest}
 * @param to      'negative' | 'question' | 'positive-s' | 'all'
 * @returns steps: [{ blocks, caption, label, fly? }]
 */
export function machineSteps(subject, verb, to) {
  const single = subject.person === 'single';
  const rest = restOf(verb, subject);
  const v = splitVerb(verb);
  const S = (state = '') => b(subject.text, 'subject', state);
  const R = () => b(rest, 'rest');

  // positive sentence blocks
  const positive = () => (single
    ? (v.special ? [S(), b(verb.s, 'verb'), R()] : [S(), b(v.stem, 'verb'), b(v.end, 'end'), R()])
    : [S(), b(verb.base, 'verb'), R()]);
  const positiveCaption = single
    ? (v.special ? `${subject.text}: ${verb.base} → ${verb.s}.` : `One person: ${verb.base} + ${v.end} = ${verb.s}.`)
    : `${subject.text}: ${verb.base}. No s.`;

  if (to === 'positive-s') {
    // I play → He plays
    const I = { text: 'I', person: 'plural', poss: 'my' };
    const restI = restOf(verb, I);
    const steps = [
      { label: '+', blocks: [b('I', 'subject'), b(verb.base, 'verb'), b(restI, 'rest')], caption: `I ${verb.base}.` },
      { label: '+', blocks: [S('changed'), b(verb.base, 'verb'), b(rest, 'rest')], caption: `Now: ${subject.text}. One person!` }
    ];
    if (v.special) steps.push({ label: '+', blocks: [S(), b(verb.s, 'verb', 'changed'), R()], caption: `${verb.base} → ${verb.s}.` });
    else steps.push({ label: '+', blocks: [S(), b(v.stem, 'verb'), b(v.end, 'end', 'new'), R()], caption: `Add ${v.end}: ${verb.s}.` });
    return steps;
  }

  const negSteps = () => {
    if (!single) {
      return [
        { label: '+', blocks: positive(), caption: positiveCaption },
        { label: '−', blocks: [S(), b("don't", 'helper', 'new'), b(verb.base, 'verb'), R()], caption: `Add don't. ${verb.base} does not change.` }
      ];
    }
    if (v.special) {
      return [
        { label: '+', blocks: positive(), caption: positiveCaption },
        { label: '−', blocks: [S(), b('do', 'helper', 'new'), b(verb.s, 'verb'), R()], caption: 'Add do.' },
        { label: '−', blocks: [S(), b('does', 'helper', 'changed'), b(verb.base, 'verb', 'changed'), R()], caption: `do → does. ${verb.s} → ${verb.base}.` },
        { label: '−', blocks: [S(), b("doesn't", 'helper', 'changed'), b(verb.base, 'verb'), R()], caption: `does + not = doesn't. After doesn't, use ${verb.base}.` }
      ];
    }
    return [
      { label: '+', blocks: positive(), caption: positiveCaption },
      { label: '−', blocks: [S(), b('do', 'helper', 'new'), b(v.stem, 'verb'), b(v.end, 'end'), R()], caption: 'Add do.' },
      { label: '−', blocks: [S(), b(`do${v.end === 's' ? 'es' : v.end}`, 'helper', 'changed'), b(verb.base, 'verb'), R()], caption: `The ${v.end} jumps to do → does. ${verb.s} → ${verb.base}.`, fly: { text: v.end } },
      { label: '−', blocks: [S(), b("doesn't", 'helper', 'changed'), b(verb.base, 'verb'), R()], caption: `does + not = doesn't. After doesn't, use ${verb.base}.` }
    ];
  };

  const qSteps = () => {
    const qs = (state = '') => b(questionSubject(subject), 'subject', state);
    if (!single) {
      return [
        { label: '+', blocks: positive(), caption: positiveCaption },
        { label: '?', blocks: [b('Do', 'helper', 'new'), qs(), b(verb.base, 'verb'), R(), b('?', 'mark', 'new')], caption: 'Start with Do. Add ?.' }
      ];
    }
    if (v.special) {
      return [
        { label: '+', blocks: positive(), caption: positiveCaption },
        { label: '?', blocks: [b('Do', 'helper', 'new'), qs(), b(verb.s, 'verb'), R(), b('?', 'mark', 'new')], caption: 'Start with Do. Add ?.' },
        { label: '?', blocks: [b('Does', 'helper', 'changed'), qs(), b(verb.base, 'verb', 'changed'), R(), b('?', 'mark')], caption: `Do → Does. ${verb.s} → ${verb.base}.` }
      ];
    }
    return [
      { label: '+', blocks: positive(), caption: positiveCaption },
      { label: '?', blocks: [b('Do', 'helper', 'new'), qs(), b(v.stem, 'verb'), b(v.end, 'end'), R(), b('?', 'mark', 'new')], caption: 'Start with Do. Add ?.' },
      { label: '?', blocks: [b('Does', 'helper', 'changed'), qs(), b(verb.base, 'verb'), R(), b('?', 'mark')], caption: `The ${v.end} jumps to Do → Does. ${verb.s} → ${verb.base}.`, fly: { text: v.end } }
    ];
  };

  if (to === 'negative') return negSteps();
  if (to === 'question') return qSteps();
  // 'all': + then the final − and the final ?
  const n = negSteps();
  const q = qSteps();
  return [n[0], { ...n[n.length - 1], caption: `Negative: ${stepText(n[n.length - 1])}` }, { ...q[q.length - 1], caption: `Question: ${stepText(q[q.length - 1])}` }];
}

/** Formula frame shown under the machine, e.g. ["He / She / It", "doesn't", "play", "…"] */
export function formula(subject, to) {
  const single = subject.person === 'single';
  const who = single ? 'He / She / It' : 'I / You / We / They';
  if (to === 'negative') return [{ t: who, role: 'subject' }, { t: single ? "doesn't" : "don't", role: 'helper' }, { t: 'verb', role: 'verb' }, { t: '…', role: 'rest' }];
  if (to === 'question') return [{ t: single ? 'Does' : 'Do', role: 'helper' }, { t: who.toLowerCase().replace('i /', 'I /'), role: 'subject' }, { t: 'verb', role: 'verb' }, { t: '…?', role: 'rest' }];
  return [{ t: who, role: 'subject' }, { t: single ? 'verb + s' : 'verb', role: single ? 'end' : 'verb' }, { t: '…', role: 'rest' }];
}
