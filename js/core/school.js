// Unit 4: can for ability, permission and requests; have to for obligation.
import { buildSentence as simpleSentence } from './grammar.js';
import { stepText } from './machine.js';

const part = (text, role) => ({ text, role });
const action = (subject, verb) => [part(verb.base, 'verb'), part(verb.rest.replace('{poss}', subject.poss), 'rest')].filter((p) => p.text);
const questionWho = (subject) => ['You', 'We', 'They', 'He', 'She', 'It'].includes(subject.text) ? subject.text.toLowerCase() : subject.text;

function canSentence(subject, verb, form) {
  const question = form === 'question';
  const helper = part(form === 'negative' ? "can't" : question ? 'Can' : 'can', 'helper');
  const who = part(question ? questionWho(subject) : subject.text, 'subject');
  const parts = [...(question ? [helper, who] : [who, helper]), ...action(subject, verb)];
  const text = parts.map((p) => p.text).join(' ') + (question ? '?' : '.');
  if (!question) return { parts, text };
  const reply = subject.text === 'I' ? 'you' : subject.text === 'You' ? 'I' : subject.short;
  return { parts, text, answers: { yes: `Yes, ${reply} can.`, no: `No, ${reply} can't.` } };
}

function haveSentence(subject, verb, form) {
  const phrase = `${verb.base} ${verb.rest}`.trim();
  const sentence = simpleSentence(subject, { base: 'have to', s: 'has to', rest: phrase }, form);
  const parts = sentence.parts.filter((p) => p.role !== 'rest').map((p) => p.text.endsWith(' to') ? part(p.text, 'helper') : p);
  return { ...sentence, parts: [...parts, ...action(subject, verb)] };
}

export function buildSentence(subject, verb, form) {
  return form.startsWith('have-') ? haveSentence(subject, verb, form.slice(5)) : canSentence(subject, verb, form);
}

const labels = { positive: '+', negative: '−', question: '?', 'have-positive': '+', 'have-negative': '−', 'have-question': '?' };

function caption(subject, form) {
  const single = subject.person === 'single';
  return {
    positive: 'Use can + the base verb for an ability or permission.',
    negative: 'Use can’t + the base verb. Can’t can mean unable or not allowed.',
    question: 'Start with Can. Put the subject next, then the base verb.',
    'have-positive': single ? 'Use has to with he, she or it.' : 'Use have to with I, you, we or they.',
    'have-negative': `Use ${single ? 'doesn’t' : 'don’t'} have to when something is optional.`,
    'have-question': `Start with ${single ? 'Does' : 'Do'}. Use have to after the subject.`
  }[form];
}

export function machineSteps(subject, verb, to) {
  const start = to.startsWith('have-') ? 'have-positive' : 'positive';
  const forms = to === 'have-positive' ? ['positive', to] : [start, to];
  return forms.map((form, index) => {
    const sentence = buildSentence(subject, verb, form);
    const label = labels[form];
    const blocks = sentence.parts.map(({ text, role }) => ({ t: text, role, state: index && role === 'helper' ? 'changed' : '' }));
    if (label === '?') blocks.push({ t: '?', role: 'mark', state: 'new' });
    return { label, blocks, caption: caption(subject, form) };
  });
}

export function formula(subject, to) {
  const single = subject.person === 'single';
  const who = ['who', 'subject'];
  const verb = ['base verb', 'verb'];
  const have = ['have to', 'helper'];
  const parts = {
    positive: [who, ['can', 'helper'], verb],
    negative: [who, ["can't", 'helper'], verb],
    question: [['Can', 'helper'], who, verb, ['…?', 'rest']],
    'have-positive': [who, [single ? 'has to' : 'have to', 'helper'], verb],
    'have-negative': [who, [single ? "doesn't" : "don't", 'helper'], have, verb],
    'have-question': [[single ? 'Does' : 'Do', 'helper'], who, have, verb, ['…?', 'rest']]
  }[to];
  return parts.map(([t, role]) => ({ t, role }));
}

export { stepText };
