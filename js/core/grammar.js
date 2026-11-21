// Builds Present Simple sentences from VERIFIED verb data (base + s-form from the
// week file). Nothing is made by adding or removing letters here.
// Output parts carry roles so the screen can highlight the helper and the verb.

function fillRest(rest, poss) {
  return rest.replace('{poss}', poss);
}

/**
 * @param {object} subject  {text, person:'single'|'plural', poss, short}
 * @param {object} verb     {base, s, rest}
 * @param {'positive'|'negative'|'question'} form
 * @returns {{parts: {text:string, role:string}[], text: string, answers?: {yes:string,no:string}}}
 */
export function buildSentence(subject, verb, form) {
  const single = subject.person === 'single';
  const rest = fillRest(verb.rest, subject.poss);
  let parts;
  if (form === 'positive') {
    parts = [
      { text: subject.text, role: 'subject' },
      { text: single ? verb.s : verb.base, role: single ? 'verb-s' : 'verb' },
      { text: rest, role: 'rest' }
    ];
  } else if (form === 'negative') {
    parts = [
      { text: subject.text, role: 'subject' },
      { text: single ? "doesn't" : "don't", role: 'helper' },
      { text: verb.base, role: 'verb' },
      { text: rest, role: 'rest' }
    ];
  } else {
    const subj = subject.text === 'I' ? 'I' : subject.text.charAt(0).toLowerCase() + subject.text.slice(1);
    const keepCase = /^[A-Z][a-z]+$/.test(subject.text) && !['He', 'She', 'It', 'We', 'They', 'You'].includes(subject.text);
    parts = [
      { text: single ? 'Does' : 'Do', role: 'helper' },
      { text: keepCase ? subject.text : subj, role: 'subject' },
      { text: verb.base, role: 'verb' },
      { text: rest, role: 'rest' }
    ];
  }
  parts = parts.filter((p) => p.text);
  const text = parts.map((p) => p.text).join(' ') + (form === 'question' ? '?' : '.');
  const out = { parts, text };
  if (form === 'question') {
    // Short answer: the person answering talks about themselves when asked with "you".
    const who = subject.text === 'You' ? (single ? 'I' : 'I') : subject.text === 'I' ? 'you' : subject.short;
    const helper = subject.text === 'You' || subject.text === 'I' || subject.text === 'We' || subject.text === 'They' ? 'do' : single ? 'does' : 'do';
    const whoFixed = subject.text === 'We' ? 'we' : who;
    out.answers = {
      yes: `Yes, ${whoFixed} ${helper}.`,
      no: `No, ${whoFixed} ${helper === 'do' ? "don't" : "doesn't"}.`
    };
  }
  return out;
}
