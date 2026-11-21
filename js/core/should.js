// Advice with should / shouldn't, and How often …? with always / usually / sometimes / never.
// A verb in the week file has base + s (Present Simple, checked by hand) + rest, and says if the action is a good idea:
//   { base: 'rest', s: 'rests', rest: 'in bed', good: true }
//   { base: 'share', s: 'shares', rest: 'a drink', bad: true }
//   often = the adverb for How often …?  { base: 'brush', s: 'brushes', rest: '{poss} teeth', good: true, often: 'always' }
// Pure (no DOM) and unit-tested. Same block roles as the other grammars, plus "often".

import { stepText } from './machine.js';

const PRONOUNS = ['He', 'She', 'It', 'We', 'They', 'You'];
const b = (t, role, state = '') => ({ t, role, state });
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const restOf = (verb, subject) => verb.rest.replace('{poss}', subject.poss);
const single = (subject) => subject.person === 'single';

function inQuestion(subject) {
  if (subject.text === 'I') return 'I';
  return PRONOUNS.includes(subject.text) ? subject.text.toLowerCase() : subject.text;
}
/** washes → wash + es · cuts → cut + s · has / does are special (no ending block). */
function splitS(verb) {
  if (verb.s.startsWith(verb.base)) return { stem: verb.base, end: verb.s.slice(verb.base.length) };
  return { stem: verb.s, end: '' };
}
/** Should I …? → Yes, you should.  Should you …? → Yes, I should. */
export function shortAnswers(subject) {
  const who = subject.text === 'I' ? 'you' : subject.text === 'You' ? 'I' : subject.short || subject.text.toLowerCase();
  return { yes: `Yes, ${who} should.`, no: `No, ${who} shouldn't.` };
}

/** Same shape as the other grammars; form = positive | negative | question. */
export function buildSentence(subject, verb, form) {
  const rest = restOf(verb, subject);
  let parts;
  if (form === 'positive') parts = [{ text: subject.text, role: 'subject' }, { text: 'should', role: 'helper' }, { text: verb.base, role: 'verb' }, { text: rest, role: 'rest' }];
  else if (form === 'negative') parts = [{ text: subject.text, role: 'subject' }, { text: "shouldn't", role: 'helper' }, { text: verb.base, role: 'verb' }, { text: rest, role: 'rest' }];
  else parts = [{ text: 'Should', role: 'helper' }, { text: inQuestion(subject), role: 'subject' }, { text: verb.base, role: 'verb' }, { text: rest, role: 'rest' }];
  parts = parts.filter((p) => p.text);
  const out = { parts, text: parts.map((p) => p.text).join(' ') + (form === 'question' ? '?' : '.') };
  if (form === 'question') {
    const a = shortAnswers(subject);
    out.answers = verb.bad ? { yes: a.no, no: '' } : { yes: a.yes, no: '' };
  }
  return out;
}

/** How often does he wash …? + the answer with the adverb. */
export function askOften(subject, verb) {
  const s = single(subject);
  const rest = restOf(verb, subject);
  const parts = [{ text: 'How often', role: 'often' }, { text: s ? 'does' : 'do', role: 'helper' }, { text: inQuestion(subject), role: 'subject' }, { text: verb.base, role: 'verb' }, { text: rest, role: 'rest' }].filter((p) => p.text);
  const answer = [subject.text, verb.often, s ? verb.s : verb.base, rest].filter(Boolean).join(' ') + '.';
  return { parts, text: `${parts.map((p) => p.text).join(' ')}?`, answer };
}

/**
 * Change Machine steps.
 * @param to 'should' (good idea) | 'shouldnt' (bad idea) | 'question' (Should …? + answer) | 'often' (How often …? + answer)
 */
export function machineSteps(subject, verb, to) {
  const s = single(subject);
  const rest = restOf(verb, subject);
  const v = splitS(verb);
  const S = (state = '') => b(subject.text, 'subject', state);
  const R = () => b(rest, 'rest');
  // He washes … (with the -s ending as its own block) · They wash …
  const every = (endState = '') => (s ? (v.end ? [b(v.stem, 'verb'), b(v.end, 'end', endState)] : [b(verb.s, 'verb', endState ? 'changed' : '')]) : [b(verb.base, 'verb')]);
  const firstCaption = `${stepText({ blocks: [S(), ...every(), R()] })} Is it a good idea?`;

  if (to === 'should' || to === 'shouldnt') {
    const word = to === 'should' ? 'should' : "shouldn't";
    const add = to === 'should' ? [b('should', 'helper', 'new')] : [b('should', 'helper', 'new'), b('not', 'helper', 'new')];
    const steps = [{ label: '+', blocks: [S(), ...every(), R()], caption: `${firstCaption} ${to === 'should' ? 'Yes!' : 'No!'}` }];
    if (s && v.end) {
      steps.push({ label: to === 'should' ? '+' : '−', blocks: [S(), ...add, b(v.stem, 'verb'), b(v.end, 'end', 'gone'), R()], caption: `Add ${to === 'should' ? 'should' : 'should not'}. The -${v.end} goes away.` });
    } else if (s) {
      steps.push({ label: to === 'should' ? '+' : '−', blocks: [S(), ...add, b(verb.base, 'verb', 'changed'), R()], caption: `Add ${to === 'should' ? 'should' : 'should not'}. ${verb.s} → ${verb.base}.` });
    } else if (to === 'should') {
      steps.push({ label: '+', blocks: [S(), ...add, b(verb.base, 'verb'), R()], caption: `Add should. ${verb.base} does not change.` });
      return steps;
    } else {
      steps.push({ label: '−', blocks: [S(), ...add, b(verb.base, 'verb'), R()], caption: `Add should not. ${verb.base} does not change.` });
    }
    const last = [S(), b(word, 'helper', to === 'shouldnt' ? 'changed' : ''), b(verb.base, 'verb'), R()];
    steps.push({ label: to === 'should' ? '+' : '−', blocks: last, caption: to === 'should' ? `After should: ${verb.base}, never ${verb.s}.` : `should + not = shouldn't. After it: ${verb.base}.` });
    return steps;
  }

  if (to === 'question') {
    const word = verb.bad ? "shouldn't" : 'should';
    const first = { label: verb.bad ? '−' : '+', blocks: [S(), b(word, 'helper'), b(verb.base, 'verb'), R()], caption: verb.bad ? 'A bad idea: shouldn’t.' : 'A good idea: should.' };
    const a = shortAnswers(subject);
    const answer = verb.bad ? a.no : a.yes;
    return [
      first,
      { label: '?', blocks: [b('Should', 'helper', 'changed'), b(inQuestion(subject), 'subject'), b(verb.base, 'verb'), R(), b('?', 'mark', 'new')], caption: 'Should jumps to the front. Add ?.' },
      { label: 'A', blocks: [b(answer, 'rest', 'new')], caption: `The answer: ${answer}` }
    ];
  }

  // How often …?
  const q = askOften(subject, verb);
  return [
    { label: '+', blocks: [S(), ...every(), R()], caption: `Every day? Every week? Ask: How often …?` },
    { label: '?', blocks: [b('How often', 'often', 'new'), b(s ? 'does' : 'do', 'helper', 'new'), b(inQuestion(subject), 'subject'), b(verb.base, 'verb', s ? 'changed' : ''), R(), b('?', 'mark', 'new')], caption: `How often + ${s ? 'does' : 'do'} + ${inQuestion(subject)} + ${verb.base}?` },
    { label: 'A', blocks: [S(), b(verb.often, 'often', 'new'), ...every(), R()], caption: `${verb.often} goes before the verb. ${q.answer}` }
  ];
}

/** Formula frame under the machine. */
export function formula(subject, to) {
  const who = single(subject) ? 'He / She / It' : 'I / You / We / They';
  if (to === 'shouldnt') return [{ t: who, role: 'subject' }, { t: "shouldn't", role: 'helper' }, { t: 'verb (no -s)', role: 'verb' }, { t: '…', role: 'rest' }];
  if (to === 'question') return [{ t: 'Should', role: 'helper' }, { t: 'I / you / he / she …', role: 'subject' }, { t: 'verb', role: 'verb' }, { t: '…?', role: 'rest' }];
  if (to === 'often') return [{ t: 'How often', role: 'often' }, { t: single(subject) ? 'does' : 'do', role: 'helper' }, { t: 'who', role: 'subject' }, { t: 'verb', role: 'verb' }, { t: '…?', role: 'rest' }];
  return [{ t: who, role: 'subject' }, { t: 'should', role: 'helper' }, { t: 'verb (no -s)', role: 'verb' }, { t: '…', role: 'rest' }];
}

export { stepText };
