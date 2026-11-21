// Present Continuous: sentences and the Change Machine for "am / is / are + verb-ing".
// Verb forms come from the week file (base + ing, checked by hand), never made by rules here.
// Pure (no DOM) and unit-tested. Same block roles as Present Simple:
//   subject · helper (am / is / are / isn't / aren't / not) · verb · end (-ing) · rest · mark (?)

import { stepText } from './machine.js';

const PRONOUNS = ['He', 'She', 'It', 'We', 'They', 'You'];
const b = (t, role, state = '') => ({ t, role, state });
const restOf = (verb, subject) => verb.rest.replace('{poss}', subject.poss);

/** am / is / are for a subject. I → am; one person or thing → is; you, we, they → are. */
export function beOf(subject) {
  if (subject.text === 'I') return 'am';
  return subject.person === 'single' ? 'is' : 'are';
}
const negOf = (be) => (be === 'am' ? 'am not' : `${be}n't`);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function questionSubject(subject) {
  if (subject.text === 'I') return 'I';
  if (PRONOUNS.includes(subject.text)) return subject.text.toLowerCase();
  return subject.text; // names keep their capital letter
}

/** play → play + ing · make → mak + ing (e goes) · run → runn + ing (double) · lie → lying (special) */
export function splitIng(verb) {
  const { base, ing } = verb;
  if (ing === `${base}ing`) return { stem: base, end: 'ing', kind: 'add' };
  if (base.endsWith('e') && ing === `${base.slice(0, -1)}ing`) return { stem: base.slice(0, -1), end: 'ing', kind: 'drop-e' };
  if (ing === `${base}${base.slice(-1)}ing`) return { stem: base + base.slice(-1), end: 'ing', kind: 'double' };
  return { stem: ing, end: '', kind: 'special' };
}
const spellNote = (verb, v) => ({
  add: `${verb.base} + ing = ${verb.ing}.`,
  'drop-e': `${verb.base}: the e goes. ${v.stem} + ing = ${verb.ing}.`,
  double: `${verb.base}: double the last letter. ${v.stem} + ing = ${verb.ing}.`,
  special: `${verb.base} → ${verb.ing}.`
}[v.kind]);

/** Same shape as Present Simple buildSentence (Sentence Switch, Spin and Say, Examples). */
export function buildSentence(subject, verb, form) {
  const be = beOf(subject);
  const rest = restOf(verb, subject);
  let parts;
  if (form === 'positive') {
    parts = [{ text: subject.text, role: 'subject' }, { text: be, role: 'helper' }, { text: verb.ing, role: 'verb-s' }, { text: rest, role: 'rest' }];
  } else if (form === 'negative') {
    parts = [{ text: subject.text, role: 'subject' }, { text: negOf(be), role: 'helper' }, { text: verb.ing, role: 'verb-s' }, { text: rest, role: 'rest' }];
  } else {
    parts = [{ text: cap(be), role: 'helper' }, { text: questionSubject(subject), role: 'subject' }, { text: verb.ing, role: 'verb-s' }, { text: rest, role: 'rest' }];
  }
  parts = parts.filter((p) => p.text);
  const text = parts.map((p) => p.text).join(' ') + (form === 'question' ? '?' : '.');
  const out = { parts, text };
  if (form === 'question') out.answers = shortAnswers(subject);
  return out;
}

/** Is he …? → Yes, he is. / No, he isn't.  Are you …? → Yes, I am. / No, I'm not. */
export function shortAnswers(subject) {
  if (subject.text === 'You') return { yes: 'Yes, I am.', no: "No, I'm not." };
  if (subject.text === 'I') return { yes: 'Yes, you are.', no: "No, you aren't." };
  if (subject.text === 'We') return { yes: 'Yes, we are.', no: "No, we aren't." };
  const who = subject.short || subject.text.toLowerCase();
  const be = beOf(subject);
  return { yes: `Yes, ${who} ${be}.`, no: `No, ${who} ${be}n't.` };
}

/**
 * Change Machine steps.
 * @param to 'negative' | 'question' | 'positive-ing' (play → is playing) | 'all'
 */
export function machineSteps(subject, verb, to) {
  const be = beOf(subject);
  const rest = restOf(verb, subject);
  const v = splitIng(verb);
  const S = (state = '') => b(subject.text, 'subject', state);
  const R = () => b(rest, 'rest');
  const V = (state = '') => (v.end ? [b(v.stem, 'verb', state), b(v.end, 'end', state)] : [b(verb.ing, 'verb', state)]);
  const positive = () => [S(), b(be, 'helper'), ...V(), R()];
  const positiveCaption = `${subject.text} → ${be}. Now: ${verb.ing}.`;

  if (to === 'positive-ing') {
    return [
      { label: '+', blocks: [S(), b(verb.base, 'verb'), R()], caption: `The action: ${verb.base}.` },
      { label: '+', blocks: [S(), b(be, 'helper', 'new'), b(verb.base, 'verb'), R()], caption: `It is happening now! ${subject.text} → ${be}.` },
      { label: '+', blocks: [S(), b(be, 'helper'), ...(v.end ? [b(v.stem, 'verb', v.kind === 'add' ? '' : 'changed'), b(v.end, 'end', 'new')] : [b(verb.ing, 'verb', 'changed')]), R()], caption: spellNote(verb, v) }
    ];
  }

  const negSteps = () => {
    const steps = [
      { label: '+', blocks: positive(), caption: positiveCaption },
      { label: '−', blocks: [S(), b(be, 'helper'), b('not', 'helper', 'new'), ...V(), R()], caption: `Add not after ${be}. ${verb.ing} does not change.` }
    ];
    if (be !== 'am') steps.push({ label: '−', blocks: [S(), b(negOf(be), 'helper', 'changed'), ...V(), R()], caption: `${be} + not = ${negOf(be)}.` });
    else steps[1].caption = "Add not after am. I am not … (there is no short amn't).";
    return steps;
  };

  const qSteps = () => {
    const qs = b(questionSubject(subject), 'subject');
    return [
      { label: '+', blocks: positive(), caption: positiveCaption },
      { label: '?', blocks: [b(cap(be), 'helper', 'changed'), qs, ...V(), R(), b('?', 'mark', 'new')], caption: `${cap(be)} jumps to the front. Add ?. ${verb.ing} stays.` }
    ];
  };

  if (to === 'negative') return negSteps();
  if (to === 'question') return qSteps();
  const n = negSteps();
  const q = qSteps();
  return [n[0], { ...n[n.length - 1], caption: `Negative: ${stepText(n[n.length - 1])}` }, { ...q[q.length - 1], caption: `Question: ${stepText(q[q.length - 1])}` }];
}

/** Formula frame under the machine. */
export function formula(subject, to) {
  const be = beOf(subject);
  const who = be === 'am' ? 'I' : be === 'is' ? 'He / She / It' : 'You / We / They';
  if (to === 'negative') return [{ t: who, role: 'subject' }, { t: negOf(be), role: 'helper' }, { t: 'verb + ing', role: 'end' }, { t: '…', role: 'rest' }];
  if (to === 'question') return [{ t: cap(be), role: 'helper' }, { t: be === 'is' ? 'he / she / it' : be === 'are' ? 'you / we / they' : 'I', role: 'subject' }, { t: 'verb + ing', role: 'end' }, { t: '…?', role: 'rest' }];
  return [{ t: who, role: 'subject' }, { t: be, role: 'helper' }, { t: 'verb + ing', role: 'end' }, { t: '…', role: 'rest' }];
}

export { stepText };
