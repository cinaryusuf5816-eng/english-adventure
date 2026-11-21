// Wh- questions with Present Continuous: Who? What? Where? Why? How?
// A verb in the week file has base + ing + rest, and may say which part answers which question:
//   { base: 'run', ing: 'running', rest: 'around the cone', where: 'around the cone' }
//   { base: 'pass', ing: 'passing', rest: 'the baton on the track', thing: 'the baton', where: 'on the track' }
//   why / how hold a ready answer: why: 'Because the race is starting.'  how: 'Fast!'
// Pure (no DOM) and unit-tested. Same block roles as the other grammars, plus "wh".

import { stepText } from './machine.js';
import { beOf, splitIng, buildSentence as continuousSentence } from './continuous.js';

const PRONOUNS = ['He', 'She', 'It', 'We', 'They', 'You'];
const b = (t, role, state = '') => ({ t, role, state });
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const restOf = (verb, subject) => verb.rest.replace('{poss}', subject.poss);

function inQuestion(subject) {
  if (subject.text === 'I') return 'I';
  return PRONOUNS.includes(subject.text) ? subject.text.toLowerCase() : subject.text;
}
/** The rest of the sentence without the part the question asks about. */
function restWithout(verb, subject, part) {
  return restOf(verb, subject).replace(part, '').replace(/\s+/g, ' ').trim();
}
/** Sentence for the answer: the speaker changes, so I ↔ you. */
function answerSentence(subject, verb) {
  const who = subject.text === 'I' ? { text: 'You', person: 'plural', poss: 'your' } : subject.text === 'You' ? { text: 'I', person: 'plural', poss: 'my' } : { ...subject, text: subject.short === 'I' ? 'I' : cap(subject.short) };
  return continuousSentence(who, verb, 'positive').text;
}

export const WORD_MEANING = {
  who: 'Who = a person.',
  what: 'What = a thing or an action.',
  where: 'Where = a place.',
  why: 'Why = a reason.',
  how: 'How = a way.'
};

/** Which question words work for this verb. */
export function canAsk(verb, word) {
  if (word === 'who' || word === 'what') return true;
  return Boolean(verb[word]);
}

/** Question + its answer. @param word who | what | where | why | how */
export function askWh(subject, verb, word) {
  const be = beOf(subject);
  const s = inQuestion(subject);
  if (word === 'who') {
    const rest = restOf(verb, subject);
    const who = subject.text === 'I' ? 'You' : subject.text === 'You' ? 'I' : subject.text;
    const whoBe = who === 'I' ? 'am' : who === 'You' ? 'are' : be;
    return {
      parts: [{ text: 'Who', role: 'wh' }, { text: 'is', role: 'helper' }, { text: verb.ing, role: 'verb-s' }, { text: rest, role: 'rest' }].filter((p) => p.text),
      answer: `${who} ${whoBe}.`
    };
  }
  if (word === 'what' && verb.thing) {
    return {
      parts: [{ text: 'What', role: 'wh' }, { text: be, role: 'helper' }, { text: s, role: 'subject' }, { text: verb.ing, role: 'verb-s' }, { text: restWithout(verb, subject, verb.thing), role: 'rest' }].filter((p) => p.text),
      answer: `${cap(verb.thing)}.`
    };
  }
  if (word === 'what') {
    return {
      parts: [{ text: 'What', role: 'wh' }, { text: be, role: 'helper' }, { text: s, role: 'subject' }, { text: 'doing', role: 'verb-s' }],
      answer: answerSentence(subject, verb)
    };
  }
  if (word === 'where') {
    return {
      parts: [{ text: 'Where', role: 'wh' }, { text: be, role: 'helper' }, { text: s, role: 'subject' }, { text: verb.ing, role: 'verb-s' }, { text: restWithout(verb, subject, verb.where), role: 'rest' }].filter((p) => p.text),
      answer: `${cap(verb.where)}.`
    };
  }
  return {
    parts: [{ text: cap(word), role: 'wh' }, { text: be, role: 'helper' }, { text: s, role: 'subject' }, { text: verb.ing, role: 'verb-s' }, { text: restOf(verb, subject), role: 'rest' }].filter((p) => p.text),
    answer: verb[word]
  };
}

/** Same shape as the other grammars; form = positive | who | what | where | why | how. */
export function buildSentence(subject, verb, form) {
  if (form === 'positive' || form === 'negative') return continuousSentence(subject, verb, form);
  const word = form === 'question' ? (verb.where ? 'where' : 'what') : form;
  const q = askWh(subject, verb, word);
  return { parts: q.parts, text: `${q.parts.map((p) => p.text).join(' ')}?`, answers: { yes: q.answer, no: '' } };
}

/** Change Machine: sentence → question → answer. */
export function machineSteps(subject, verb, to) {
  const be = beOf(subject);
  const v = splitIng(verb);
  const verbBlocks = () => (v.end ? [b(v.stem, 'verb'), b(v.end, 'end')] : [b(verb.ing, 'verb')]);
  const first = { label: '+', blocks: [b(subject.text, 'subject'), b(be, 'helper'), ...verbBlocks(), b(restOf(verb, subject), 'rest')].filter((x) => x.t), caption: 'Read the sentence.' };
  const q = askWh(subject, verb, to);
  const roleOf = { wh: 'wh', helper: 'helper', subject: 'subject', 'verb-s': 'verb', rest: 'rest' };
  const qBlocks = q.parts.flatMap((p) => {
    if (p.role === 'verb-s' && p.text === verb.ing) return verbBlocks();
    return [b(p.text, roleOf[p.role], p.role === 'wh' ? 'new' : p.role === 'helper' && to !== 'who' ? 'changed' : '')];
  });
  const note = to === 'who' ? 'Who + is + verb-ing. There is no new word order.' : `${be} jumps before ${inQuestion(subject)}.`;
  return [
    first,
    { label: '?', blocks: [...qBlocks, b('?', 'mark', 'new')], caption: `${WORD_MEANING[to]} ${note}` },
    { label: 'A', blocks: [b(q.answer, 'rest', 'new')], caption: `The answer: ${q.answer}` }
  ];
}

/** Formula frame under the machine. */
export function formula(subject, to) {
  if (to === 'who') return [{ t: 'Who', role: 'wh' }, { t: 'is', role: 'helper' }, { t: 'verb + ing', role: 'end' }, { t: '…?', role: 'rest' }];
  return [{ t: cap(to), role: 'wh' }, { t: 'am / is / are', role: 'helper' }, { t: 'who', role: 'subject' }, { t: 'verb + ing', role: 'end' }, { t: '…?', role: 'rest' }];
}

export { stepText };
