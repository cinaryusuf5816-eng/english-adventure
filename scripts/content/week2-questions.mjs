// Week 2 question bank: same activities and counts as Week 1, for Present Continuous.
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { SUBJECTS, GROUPS, VERBS, SCENES } from './week2-data.mjs';

const REPO = fileURLToPath(new URL('../..', import.meta.url)).replace(/[\/]$/, '');
const C = await import(pathToFileURL(`${REPO}/site/js/core/continuous.js`).href);

const subj = (id) => SUBJECTS.find((s) => s.id === id) || GROUPS[id];
const verb = (id) => { const v = VERBS.find((x) => x.id === id); if (!v) throw new Error(`verb ${id}`); return v; };
const rest = (who, vid) => verb(vid).rest.replace('{poss}', subj(who).poss);
const be = (who) => C.beOf(subj(who));
const nt = (b) => (b === 'am' ? 'am not' : `${b}n't`);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const pron = (who) => { const s = subj(who); return s.short === 'I' ? 'I' : cap(s.short); };
const S = (who, vid, form) => C.buildSentence(subj(who), verb(vid), form).text;
const noEnd = (t) => t.replace(/[.?]$/, '');
const sceneOf = (vid) => SCENES.find((s) => s.verb === vid);
const L = 'abcdefgh';

let rot = 0;
/** options with the right one at a rotating place → { options, answer } */
function place(correct, wrongs) {
  const n = wrongs.length + 1;
  const at = rot++ % n;
  const options = [...wrongs];
  options.splice(at, 0, correct);
  return { options, answer: L[at] };
}
const out = [];
const counters = {};
function add(prefix, q) {
  counters[prefix] = (counters[prefix] || 0) + 1;
  out.push({ id: `w2-${prefix}-${String(counters[prefix]).padStart(3, '0')}`, v: 1, ...q });
}
const otherBe = (b) => (b === 'is' ? 'are' : 'is');
const wrongIng = (v) => {
  const k = C.splitIng(v).kind;
  if (k === 'double') return `${v.base}ing`; // runing
  if (k === 'drop-e') return `${v.base}ing`; // rideing
  return null;
};

// ---------- scenes in a fixed order, alternating name / pronoun ----------
const SINGLE = SCENES.filter((s) => subj(s.who).person === 'single');
const PLURAL = SCENES.filter((s) => subj(s.who).person === 'plural');
const pick = (list, i) => list[i % list.length];
// Who to write: the name, or "he / she / it / they", or I / you / we for variety.
function who(scene, i) {
  const s = subj(scene.who);
  if (i % 3 === 1) return { id: scene.who, text: s.text };
  if (s.person === 'plural' && i % 5 === 0) return { id: 'we', text: 'We' };
  if (s.person === 'plural' && i % 5 === 2) return { id: 'you', text: 'You' };
  if (s.person === 'single' && i % 7 === 3 && scene.who !== 'pepper') return { id: 'I', text: 'I' };
  return { id: s.short === 'I' ? 'I' : s.short === 'it' ? 'it' : s.short, text: cap(s.short) };
}
// a subject id we can feed to the engine for any "who" text
const W = (w, scene) => (w.text === subj(scene.who).text ? scene.who : w.id);

// A negative must not deny the picture: use an action the picture does NOT show.
const ALT = ['a1-swim', 'watch-tv', 'a1-sleep', 'a1-sing', 'a1-cook', 'play-chess', 'a1-climb', 'eat-pizza', 'a1-draw', 'ride-bike', 'a1-write', 'dance', 'sp-tennis', 'a1-fly'];
const PET = ['drink-water', 'pepper-play', 'a1-sleep', 'a1-run', 'a1-jump'];
function alt(sc, i) {
  const pool = (sc.who === 'pepper' ? PET : ALT).filter((v) => v !== sc.verb && verb(v).base !== verb(sc.verb).base);
  return pool[i % pool.length];
}
// "Look at the picture: Leo is eating pizza." (what the picture really shows)
const seeHint = (sc) => `Look at the picture: ${S(sc.who, sc.verb, 'positive')}`;

// =================== A. Choose (mcq) 60 ===================
for (let i = 0; i < 18; i++) {
  const sc = pick(i % 2 ? PLURAL : SINGLE, i);
  const w = who(sc, i); const id = W(w, sc); const v = verb(sc.verb); const b = be(id);
  const kind = i % 3;
  if (kind === 0) {
    const p = place(b, ['am', 'is', 'are'].filter((x) => x !== b).slice(0, 2));
    add('mc', { type: 'mcq', target: 'affirmative', level: 1, prompt: `${w.text} ___ ${v.ing} ${rest(id, sc.verb)}.`.replace(' .', '.'), image: sc.image, ...p, hint: `${w.text} → ${b}.`, explain: S(id, sc.verb, 'positive') });
  } else if (kind === 1) {
    const wr = [v.base, wrongIng(v) || `${v.base}s`].filter((x) => x !== v.ing);
    const p = place(v.ing, wr);
    add('mc', { type: 'mcq', target: 'affirmative', level: 1, prompt: `${w.text} ${b} ___ ${rest(id, sc.verb)}.`, image: sc.image, ...p, hint: `${b} + verb-ing.`, explain: S(id, sc.verb, 'positive') });
  } else {
    const p = place(`${b} ${v.ing}`, [`${b} ${v.base}`, v.ing]);
    add('mc', { type: 'mcq', target: 'affirmative', level: 2, prompt: `Look! ${w.text} ___ ${rest(id, sc.verb)} now.`, image: sc.image, ...p, hint: `Two parts: ${b} + ${v.ing}.`, explain: `Look! ${noEnd(S(id, sc.verb, 'positive'))} now.` });
  }
}
for (let i = 0; i < 18; i++) {
  const sc = pick(i % 2 ? SINGLE : PLURAL, i + 5);
  const w = who(sc, i + 1); const id = W(w, sc); const v = verb(sc.verb); const b = be(id);
  const kind = i % 3;
  const av = alt(sc, i); const a = verb(av);
  if (kind === 0) {
    const p = place(nt(b), b === 'am' ? ["isn't", "don't"] : [nt(otherBe(b)), b === 'is' ? "doesn't" : "don't"]);
    add('mc', { type: 'mcq', target: 'negative', level: 1, prompt: `${w.text} ___ ${a.ing} ${rest(id, av)}.`, image: sc.image, ...p, hint: `${w.text} → ${nt(b)}. ${seeHint(sc)}`, explain: S(id, av, 'negative') });
  } else if (kind === 1) {
    const p = place(a.ing, [a.base]);
    add('mc', { type: 'mcq', target: 'negative', level: 1, prompt: `${w.text} ${nt(b)} ___ ${rest(id, av)}.`, image: sc.image, ...p, hint: `${nt(b)} + verb-ing. ${seeHint(sc)}`, explain: S(id, av, 'negative') });
  } else {
    const p = place(S(id, sc.verb, 'negative'), [`${w.text} not ${v.ing} ${rest(id, sc.verb)}.`, `${w.text} ${b === 'is' ? "doesn't" : "don't"} ${v.ing} ${rest(id, sc.verb)}.`]);
    add('mc', { type: 'mcq', target: 'negative', level: 2, prompt: `${S(id, sc.verb, 'positive')} Which is the negative?`, image: sc.image, ...p, hint: `Add not after ${b}.`, explain: S(id, sc.verb, 'negative') });
  }
}
for (let i = 0; i < 18; i++) {
  const sc = pick(i % 2 ? PLURAL : SINGLE, i + 11);
  const w = who(sc, i + 2); const id = W(w, sc === undefined ? sc : sc); const v = verb(sc.verb); const b = be(id);
  const q = S(id, sc.verb, 'question');
  const kind = i % 3;
  if (kind === 0) {
    const p = place(cap(b), b === 'am' ? ['Is', 'Do'] : [cap(otherBe(b)), b === 'is' ? 'Does' : 'Do']);
    add('mc', { type: 'mcq', target: 'question', level: 1, prompt: `___ ${q.split(' ').slice(1).join(' ')}`, image: sc.image, ...p, hint: `${w.text} → ${cap(b)}.`, explain: q });
  } else if (kind === 1) {
    const a = C.shortAnswers(subj(id));
    const helperWrong = a.yes.replace(/ (am|is|are)\.$/, b === 'is' ? ' does.' : ' do.');
    const p = place(a.yes, [helperWrong, a.no]);
    add('mc', { type: 'mcq', target: 'question', level: 1, prompt: q, image: sc.image, ...p, hint: 'Look at the picture. Short answer: Yes, … am / is / are.', explain: a.yes });
  } else {
    const p = place(b, b === 'am' ? ['are', 'do'] : [otherBe(b), b === 'is' ? 'does' : 'do']);
    const whoQ = id === 'I' ? 'I' : subj(id).text === cap(subj(id).short) ? subj(id).short : subj(id).text;
    add('mc', { type: 'mcq', target: 'question', level: 2, prompt: `What ___ ${whoQ} doing?`, image: sc.image, ...p, hint: `${w.text} → ${b}.`, explain: `What ${b} ${whoQ} doing? ${S(id, sc.verb, 'positive')}` });
  }
}
// mixed: every day (Week 1) or now (Week 2)
[
  ['Look! Sam ___ football now.', 'play-football', ['is playing', 'plays'], 'Now → is playing.', 'Look! Sam is playing football now.'],
  ['Sam ___ football every Saturday.', 'play-football', ['plays', 'is playing'], 'Every Saturday → plays.', 'Sam plays football every Saturday.'],
  ['Shh! Mia ___ a book at the moment.', 'read-a-book', ['is reading', 'reads'], 'At the moment → is reading.', 'Shh! Mia is reading a book at the moment.'],
  ['Ana ___ in the pool on Mondays.', 'sp-pool', ['swims', 'is swimming'], 'On Mondays → swims.', 'Ana swims in the pool on Mondays.'],
  ['Mia and Ana are dancing. Which is the question?', 'dance', ['Are Mia and Ana dancing?', 'Do Mia and Ana dancing?', 'Is Mia and Ana dancing?'], 'Start with Are.', 'Are Mia and Ana dancing?'],
  ['Leo is hitting the ball. Which is the negative?', 'sp-bat', ["Leo isn't hitting the ball.", "Leo doesn't hitting the ball.", "Leo aren't hitting the ball."], "Leo → isn't + hitting.", "Leo isn't hitting the ball."]
].forEach(([prompt, image, [right, ...wrong], hint, explain]) => add('mc', { type: 'mcq', target: 'mixed', level: 3, prompt, image, ...place(right, wrong), hint, explain }));

// =================== B. Make a sentence (jumbled) 36 ===================
const toks = (t) => noEnd(t).split(' ');
for (let i = 0; i < 12; i++) {
  const sc = pick(i % 2 ? PLURAL : SINGLE, i + 3); const w = who(sc, i); const id = W(w, sc);
  const t = S(id, sc.verb, 'positive');
  add('jb', { type: 'jumbled', target: 'affirmative', level: 1, image: sc.image, tokens: toks(t), end: '.', answers: [noEnd(t)], hint: `Start with ${w.text}.`, explain: t });
}
for (let i = 0; i < 12; i++) {
  const sc = pick(i % 2 ? SINGLE : PLURAL, i + 7); const w = who(sc, i + 1); const id = W(w, sc);
  const t = S(id, alt(sc, i + 3), 'negative');
  add('jb', { type: 'jumbled', target: 'negative', level: 1, image: sc.image, tokens: toks(t), end: '.', answers: [noEnd(t)], hint: `${w.text} ${nt(be(id))} … ${seeHint(sc)}`, explain: t });
}
for (let i = 0; i < 8; i++) {
  const sc = pick(i % 2 ? PLURAL : SINGLE, i + 13); const w = who(sc, i + 2); const id = W(w, sc);
  const t = S(id, sc.verb, 'question');
  add('jb', { type: 'jumbled', target: 'question', level: 1, image: sc.image, tokens: toks(t), end: '?', answers: [noEnd(t)], hint: `Start with ${t.split(' ')[0]}.`, explain: t });
}
[
  ['What is Leo writing', 'v-write', 'Leo is writing a letter.'],
  ['What are you doing', 'v-cook', "I'm cooking pancakes."],
  ['Where are they playing basketball', 'sp-court', 'They are playing basketball on the court.'],
  ['Where is Ana swimming', 'sp-pool', 'She is swimming in the pool.']
].forEach(([t, image, ans]) => add('jb', { type: 'jumbled', target: 'question', subtarget: 'wh', level: 2, image, tokens: t.split(' '), end: '?', answers: [t], hint: `Start with ${t.split(' ')[0]}.`, explain: `${t}? — ${ans}` }));

// =================== C. Fill in 30 ===================
for (let i = 0; i < 10; i++) {
  const sc = pick(i % 2 ? SINGLE : PLURAL, i + 17); const w = who(sc, i); const id = W(w, sc); const v = verb(sc.verb); const b = be(id);
  add('fb', { type: 'fill', target: 'affirmative', level: 1, image: sc.image, text: `${w.text} ___ ${rest(id, sc.verb)}.`, base: v.base, answers: [`${b} ${v.ing}`], pool: [`${b} ${v.ing}`, `${b === 'am' ? 'is' : otherBe(b)} ${v.ing}`, `${b} ${v.base}`], hint: `${w.text} → ${b} + ${v.ing}.`, explain: S(id, sc.verb, 'positive') });
}
for (let i = 0; i < 10; i++) {
  const sc = pick(i % 2 ? PLURAL : SINGLE, i + 21); const w = who(sc, i + 1); const id = W(w, sc); const av = alt(sc, i + 6); const v = verb(av); const b = be(id);
  const answers = b === 'am' ? ['am not'] : [nt(b), `${b} not`];
  add('fb', { type: 'fill', target: 'negative', level: 1, image: sc.image, text: `${w.text} ___ ${v.ing} ${rest(id, av)}.`, answers, pool: ["isn't", "aren't", 'am not'], hint: `${w.text} → ${nt(b)}. ${seeHint(sc)}`, explain: S(id, av, 'negative') });
}
for (let i = 0; i < 10; i++) {
  const sc = pick(i % 2 ? SINGLE : PLURAL, i + 25); const w = who(sc, i + 2); const id = W(w, sc); const b = be(id);
  const q = S(id, sc.verb, 'question');
  add('fb', { type: 'fill', target: 'question', level: 1, image: sc.image, text: `___ ${q.split(' ').slice(1).join(' ')}`, answers: [cap(b)], pool: ['Am', 'Is', 'Are'], hint: `${w.text} → ${cap(b)}.`, explain: q });
}

// =================== D. Change it 18 ===================
for (let i = 0; i < 9; i++) {
  const sc = pick(i % 2 ? SINGLE : PLURAL, i + 29); const w = who(sc, i); const id = W(w, sc); const b = be(id);
  const neg = S(id, sc.verb, 'negative');
  const long = neg.replace(/\b(is|are)n't\b/, '$1 not');
  add('cs', { type: 'change', target: 'negative', task: 'negative', level: 1, image: sc.image, from: S(id, sc.verb, 'positive'), answers: [...new Set([neg, long])], hint: `Add not: ${b} not / ${nt(b)}.`, explain: neg });
}
for (let i = 0; i < 9; i++) {
  const sc = pick(i % 2 ? PLURAL : SINGLE, i + 33); const w = who(sc, i + 2); const id = W(w, sc); const b = be(id);
  const q = S(id, sc.verb, 'question');
  add('cs', { type: 'change', target: 'question', task: 'question', level: 1, image: sc.image, from: S(id, sc.verb, 'positive'), answers: [q], hint: `Start with ${cap(b)}.`, explain: q });
}

// =================== E. Fix the mistake 18 ===================
const fx = (target, image, words, wrong, right, other, hint, explain) => add('fx', { type: 'fix', target, level: 1, image, words, wrong, ...(() => { const p = place(right, [other]); return { fixes: p.options, fix: p.answer }; })(), hint, explain });
fx('affirmative', 'v-sing', ['She', 'are', 'singing', 'a', 'song.'], 1, 'is', 'am', 'She → is.', 'She is singing a song.');
fx('affirmative', 'v-run', ['Leo', 'is', 'runing', 'in', 'the', 'park.'], 2, 'running', 'runs', 'run → running (double n).', 'Leo is running in the park.');
fx('affirmative', 'they-watch-tv', ['They', 'is', 'watching', 'TV.'], 1, 'are', 'am', 'They → are.', 'They are watching TV.');
fx('affirmative', 'ride-a-bike', ['Ana', 'is', 'rideing', 'a', 'bike.'], 2, 'riding', 'rides', 'ride → riding (the e goes).', 'Ana is riding a bike.');
fx('affirmative', 'v-cook', ['I', 'is', 'cooking', 'pancakes.'], 1, 'am', 'are', 'I → am.', 'I am cooking pancakes.');
fx('affirmative', 'sp-pool', ['Ana', 'is', 'swim', 'in', 'the', 'pool.'], 2, 'swimming', 'swims', 'is + swimming.', 'Ana is swimming in the pool.');
fx('negative', 'play-football', ['He', "aren't", 'watching', 'TV.'], 1, "isn't", "don't", "He → isn't.", "He isn't watching TV.");
fx('negative', 'dance', ['They', "isn't", 'swimming.'], 1, "aren't", "doesn't", "They → aren't.", "They aren't swimming.");
fx('negative', 'sp-racket', ['Mia', "doesn't", 'playing', 'basketball.'], 1, "isn't", "aren't", "is + not = isn't. No does!", "Mia isn't playing basketball.");
fx('negative', 'sam-reads', ['I', "isn't", 'sleeping.'], 1, 'am not', "aren't", 'I → am not.', 'I am not sleeping.');
fx('negative', 'v-write', ['Leo', "isn't", 'read', 'a', 'book.'], 2, 'reading', 'reads', "isn't + reading.", "Leo isn't reading a book.");
fx('negative', 'sp-court', ['We', "isn't", 'playing', 'football.'], 1, "aren't", 'not', "We → aren't.", "We aren't playing football.");
fx('question', 'read-a-book', ['Are', 'Mia', 'reading?'], 0, 'Is', 'Does', 'Mia = she → Is.', 'Is Mia reading?');
fx('question', 'sp-court', ['Is', 'they', 'playing', 'basketball?'], 0, 'Are', 'Do', 'they → Are.', 'Are they playing basketball?');
fx('question', 'sp-pool', ['Does', 'she', 'swimming?'], 0, 'Is', 'Are', 'No does! Start with Is.', 'Is she swimming?');
fx('question', 'v-fly', ['Is', 'Sam', 'fly', 'a', 'kite?'], 2, 'flying', 'flies', 'Is … flying?', 'Is Sam flying a kite?');
fx('question', 'teacher-class', ['Is', 'you', 'listening?'], 0, 'Are', 'Am', 'you → Are.', 'Are you listening?');
fx('question', 'sp-bat', ['What', 'are', 'Leo', 'doing?'], 1, 'is', 'does', 'Leo = he → is.', 'What is Leo doing?');

// =================== F. Look and decide 18 (9 true / 9 false) ===================
const CARDS = {
  'park-now': { title: 'In the park now', image: 'sp-field', lines: [{ mark: 'yes', text: 'Mia and Sam: running' }, { mark: 'no', text: 'Mia and Sam: swimming' }, { mark: 'yes', text: 'Leo: flying a kite' }] },
  'sports-hall': { title: 'At the sports centre now', image: 'sp-gym', lines: [{ mark: 'yes', text: 'Mia and Ana: doing exercises in the gym' }, { mark: 'yes', text: 'Sam and Leo: playing basketball on the court' }, { mark: 'no', text: 'Ana: swimming' }] },
  'home-now': { title: 'At home now', image: 'they-watch-tv', text: 'Mia and Sam are watching TV. Pepper is sleeping. Mum is cooking. Dad isn\'t cooking. He is reading.' },
  ana: { title: 'Ana now', image: 'sp-hoop', lines: [{ mark: 'yes', text: 'throwing the ball into the hoop' }, { mark: 'no', text: 'swimming in the pool' }, { mark: 'no', text: 'riding a bike' }] },
  leo: { title: 'Leo now', image: 'sp-bat', lines: [{ mark: 'yes', text: 'hitting the ball with a bat' }, { mark: 'no', text: 'playing tennis' }] },
  mia: { title: 'Mia now', image: 'sp-racket', lines: [{ mark: 'yes', text: 'playing tennis' }, { mark: 'yes', text: 'using a racket' }, { mark: 'no', text: 'singing' }] },
  sam: { title: 'Sam', image: 'play-football', lines: [{ mark: 'yes', text: 'Now: kicking the ball into the goal' }, { mark: 'no', text: 'Now: watching TV' }] },
  class: { title: 'In class now', image: 'teacher-class', text: 'Ms. Rosa is asking a question. Mia and Sam are putting their hands up. They aren\'t sleeping!' },
  pepper: { title: 'Pepper the cat now', image: 'v-sleep', lines: [{ mark: 'yes', text: 'sleeping on a cushion' }, { mark: 'no', text: 'playing with a ball' }, { mark: 'no', text: 'drinking water' }] }
};
[
  ['affirmative', 'park-now', 'Mia and Sam are running.', true, 'Look at the ✓.'],
  ['affirmative', 'park-now', 'Mia and Sam are swimming.', false, "Look at the ✗: they aren't swimming."],
  ['affirmative', 'park-now', 'Leo is flying a kite.', true, 'Look at Leo.'],
  ['affirmative', 'sports-hall', 'Sam and Leo are playing basketball.', true, 'Read the second line.'],
  ['affirmative', 'sports-hall', 'Ana is swimming.', false, "Look at the ✗: Ana isn't swimming."],
  ['affirmative', 'home-now', 'Mum is cooking.', true, 'Read the text.'],
  ['affirmative', 'home-now', 'Dad is cooking.', false, "Read: Dad isn't cooking. He is reading."],
  ['affirmative', 'ana', 'Ana is riding a bike.', false, 'Look at the ✗.'],
  ['affirmative', 'leo', 'Leo is playing tennis.', false, 'Look at the ✗.'],
  ['affirmative', 'mia', 'Mia is playing tennis.', true, 'Look at the ✓.'],
  ['affirmative', 'mia', 'Mia is singing.', false, 'Look at the ✗.'],
  ['affirmative', 'class', 'Ms. Rosa is asking a question.', true, 'Read the first sentence.'],
  ['negative', 'pepper', "Pepper isn't playing with a ball.", true, 'Look at the ✗.'],
  ['negative', 'pepper', "Pepper isn't sleeping.", false, 'Look at the ✓: Pepper is sleeping.'],
  ['negative', 'sam', "Sam isn't watching TV.", true, 'Look at the ✗.'],
  ['negative', 'class', "Mia and Sam aren't sleeping.", true, "Read: They aren't sleeping!"],
  ['negative', 'ana', "Ana isn't throwing the ball.", false, 'Look at the ✓.'],
  ['negative', 'home-now', "Mia and Sam aren't watching TV.", false, 'Read: Mia and Sam are watching TV.']
].forEach(([target, card, statement, answer, hint]) => add('ld', { type: 'decide', target, level: answer ? 1 : 2, card, statement, answer, hint, explain: `${answer ? 'True' : 'False'}. ${statement}` }));

// =================== G. Dialogues 12 (q7 / neg4 / aff1) ===================
const dl = (target, image, lines, [right, ...wrong], hint, explain) => add('cd', { type: 'dialogue', target, level: 1, image, lines, ...place(right, wrong), hint, explain });
dl('question', 'v-cook', [{ who: 'Mia', text: 'Are you cooking, Sam?' }, { who: 'Sam', text: '___' }], ['Yes, I am.', 'Yes, you are.', 'Yes, I do.'], 'Sam talks about Sam → I am.', 'Yes, I am.');
dl('negative', 'sam-reads', [{ who: 'Mia', text: 'Are you sleeping, Sam?' }, { who: 'Sam', text: "No, ___. I'm reading." }], ["I'm not", "you aren't", "I don't"], "Sam talks about Sam → I'm not.", "No, I'm not. I'm reading.");
dl('question', 'v-swim', [{ who: 'Ms. Rosa', text: '___ Sam swimming?' }, { who: 'Mia', text: 'Yes, he is.' }], ['Is', 'Are', 'Does'], 'Sam = he → Is.', 'Is Sam swimming? Yes, he is.');
dl('question', 'sp-court', [{ who: 'Ana', text: 'What are Sam and Leo doing?' }, { who: 'Mia', text: '___' }], ['They are playing basketball.', 'They play basketball every day.', 'Yes, they are.'], 'What are they doing now? They are …', 'They are playing basketball.');
dl('negative', 'dance', [{ who: 'Leo', text: 'Are Mia and Ana singing?' }, { who: 'Sam', text: "No, ___. They're dancing." }], ["they aren't", "they isn't", "they don't"], "Mia and Ana = they → aren't.", "No, they aren't. They're dancing.");
dl('question', 'teacher-class', [{ who: 'Ms. Rosa', text: '___ you listening, children?' }, { who: 'Mia and Sam', text: 'Yes, we are!' }], ['Are', 'Is', 'Do'], 'you → Are.', 'Are you listening, children? Yes, we are!');
dl('affirmative', 'sp-racket', [{ who: 'Sam', text: 'What are you doing, Mia?' }, { who: 'Mia', text: 'I ___ tennis.' }], ['am playing', 'is playing', 'playing'], 'I → am playing.', "I am playing tennis.");
dl('question', 'sp-pool', [{ who: 'Leo', text: 'Where is Ana?' }, { who: 'Sam', text: 'She ___ in the pool.' }], ['is swimming', 'are swimming', 'swimming'], 'Ana = she → is swimming.', 'She is swimming in the pool.');
dl('negative', 'v-sleep', [{ who: 'Mia', text: 'Is Pepper eating?' }, { who: 'Sam', text: "No, ___. It's sleeping." }], ["it isn't", "it doesn't", "it aren't"], "Pepper = it → isn't.", "No, it isn't. It's sleeping.");
dl('question', 'sp-bat', [{ who: 'Ana', text: 'Is Leo playing tennis?' }, { who: 'Mia', text: '___ He is hitting the ball with a bat.' }], ["No, he isn't.", 'Yes, he is.', "No, he doesn't."], 'A bat is not for tennis.', "No, he isn't. He is hitting the ball with a bat.");
dl('negative', 'we-read', [{ who: 'Ms. Rosa', text: 'Are you watching TV, Mia and Sam?' }, { who: 'Mia', text: "No, ___. We're reading." }], ["we aren't", "they aren't", "we don't"], "you, Mia and Sam → we aren't.", "No, we aren't. We're reading.");
dl('question', 'sp-gym', [{ who: 'Sam', text: '___ are Mia and Ana doing?' }, { who: 'Leo', text: 'They are doing exercises in the gym.' }], ['What', 'Where', 'Who'], 'They are doing … → What?', 'What are Mia and Ana doing?');

// =================== H. Mini reading 12 ===================
const PASSAGES = {
  'rd-p1': { title: 'Saturday at the Sports Centre', image: 'sp-gym', text: "It's Saturday morning. Mia and Ana are at the sports centre. They are doing exercises in the gym. Sam isn't in the gym. He is playing basketball on the court with Leo. They are laughing." },
  'rd-p2': { title: 'In the Park', image: 'sp-field', text: "Look! The park is busy today. Mia and Sam are running on the field. Leo is flying a kite. Ana isn't running. She is sitting under a tree and she is drawing a picture." },
  'rd-p3': { title: 'Pepper at Home', image: 'v-sleep', text: "It's evening. Sam is doing his homework. Mia is listening to music. Mum is cooking pancakes in the kitchen. And Pepper? Pepper isn't playing now. It is sleeping on a cushion." }
};
const rd = (passage, target, prompt, [right, ...wrong], hint, explain, subtarget) => add('rd', { type: 'reading', passage, target, ...(subtarget ? { subtarget } : {}), level: 1, prompt, ...place(right, wrong), hint, explain });
rd('rd-p1', 'question', 'Where are Mia and Ana?', ['At the sports centre.', 'At school.'], 'Read the second sentence.', 'They are at the sports centre.', 'wh');
rd('rd-p1', 'question', 'What are Mia and Ana doing?', ['They are doing exercises.', 'They are swimming.'], 'Read the third sentence.', 'They are doing exercises in the gym.', 'wh');
rd('rd-p1', 'negative', 'True or false? Sam is in the gym.', ['False', 'True'], "Read: Sam isn't in the gym.", "False. Sam isn't in the gym.");
rd('rd-p1', 'question', 'Is Sam playing basketball?', ['Yes, he is.', "No, he isn't."], 'Read the fifth sentence.', 'Yes, he is. He is playing basketball with Leo.');
rd('rd-p2', 'question', 'Where are Mia and Sam running?', ['On the field.', 'In the gym.'], 'Read the third sentence.', 'They are running on the field.', 'wh');
rd('rd-p2', 'question', 'What is Leo doing?', ['He is flying a kite.', 'He is running.'], 'Find Leo in the text.', 'Leo is flying a kite.', 'wh');
rd('rd-p2', 'negative', 'True or false? Ana is running.', ['False', 'True'], "Read: Ana isn't running.", "False. Ana isn't running.");
rd('rd-p2', 'question', 'Is Ana drawing a picture?', ['Yes, she is.', "No, she isn't."], 'Read the last sentence.', 'Yes, she is.');
rd('rd-p3', 'question', 'What is Sam doing?', ['He is doing his homework.', 'He is cooking.'], 'Read the second sentence.', 'Sam is doing his homework.', 'wh');
rd('rd-p3', 'question', 'Who is cooking pancakes?', ['Mum.', 'Mia.'], 'Read the fourth sentence.', 'Mum is cooking pancakes.', 'wh');
rd('rd-p3', 'negative', 'True or false? Pepper is playing now.', ['False', 'True'], "Read: Pepper isn't playing now.", "False. Pepper isn't playing now.");
rd('rd-p3', 'question', 'Is Pepper sleeping?', ['Yes, it is.', "No, it isn't."], 'Read the last sentence.', 'Yes, it is. It is sleeping on a cushion.');

// =================== I. Book words: sports (30) ===================
const SPORT = [['balls', 'sp-balls'], ['bat', 'sp-bat'], ['hoop', 'sp-hoop'], ['goal', 'sp-goal'], ['racket', 'sp-racket'], ['net', 'sp-net'], ['gym', 'sp-gym'], ['field', 'sp-field'], ['court', 'sp-court'], ['pool', 'sp-pool']];
const sportFrame = { balls: 'Mia and Sam are putting the ___ in the basket.', bat: 'Leo is hitting the ball with a ___.', hoop: 'Ana is throwing the ball into the ___.', goal: 'Sam is kicking the ball into the ___.', racket: 'Mia is playing tennis with a ___.', net: 'Leo and Ana are playing volleyball over the ___.', gym: 'Mia and Ana are doing exercises in the ___.', field: 'Mia and Sam are running on the ___.', court: 'Sam and Leo are playing basketball on the ___.', pool: 'Ana is swimming in the ___.' };
SPORT.forEach(([word, image], i) => {
  const others = SPORT.map((s) => s[0]).filter((x) => x !== word);
  add('bk', { bank: 'book', type: 'mcq', target: 'vocabulary', level: 1, image, prompt: `Look. ${sportFrame[word]}`, ...place(word, [others[(i + 2) % 9], others[(i + 5) % 9]]), hint: 'Look at the picture.', explain: sportFrame[word].replace('___', word) });
});
const sportScenes = SCENES.filter((s) => s.verb.startsWith('sp-'));
sportScenes.forEach((sc, i) => {
  const id = sc.who; const v = verb(sc.verb); const b = be(id);
  const p = place(`${b} ${v.ing}`, [`${otherBe(b)} ${v.ing}`, `${b} ${v.base}`]);
  add('bk', { bank: 'book', type: 'mcq', target: 'affirmative', level: 1, image: sc.image, prompt: `${subj(id).text} ___ ${rest(id, sc.verb)}.`, ...p, hint: `${subj(id).text} → ${b}.`, explain: S(id, sc.verb, 'positive') });
});
[
  ['sp-racket', "Mia ___ playing basketball. She is playing tennis.", ["isn't", "aren't"], "Mia = she → isn't.", "Mia isn't playing basketball."],
  ['sp-court', "Sam and Leo ___ playing football. They are playing basketball.", ["aren't", "isn't"], "Sam and Leo = they → aren't.", "Sam and Leo aren't playing football."],
  ['sp-pool', "Ana isn't running on the field. She ___ in the pool.", ['is swimming', 'swimming'], 'She is + swimming.', 'She is swimming in the pool.'],
  ['sp-gym', "Mia and Ana aren't in the pool. They ___ exercises in the gym.", ['are doing', 'is doing'], 'They → are doing.', 'They are doing exercises in the gym.']
].forEach(([image, prompt, [r, ...w], hint, explain]) => add('bk', { bank: 'book', type: 'mcq', target: 'negative', level: 2, image, prompt, ...place(r, w), hint, explain }));
[
  ['sp-pool', '___ Ana swimming in the pool?', ['Is', 'Are'], 'Ana = she → Is.', 'Is Ana swimming in the pool?'],
  ['sp-court', '___ Sam and Leo playing basketball?', ['Are', 'Is'], 'Two people → Are.', 'Are Sam and Leo playing basketball?'],
  ['sp-goal', 'Is Sam kicking the ball into the goal?', ['Yes, he is.', "No, he isn't.", 'Yes, he does.'], 'Look at the picture.', 'Yes, he is.'],
  ['sp-net', 'Are Leo and Ana playing tennis?', ["No, they aren't.", 'Yes, they are.', "No, they don't."], 'Look: a ball and a big net → volleyball.', "No, they aren't. They are playing volleyball."],
  ['sp-bat', 'What is Leo using?', ['A bat.', 'A racket.', 'A hoop.'], 'Look at his hands.', 'Leo is using a bat.'],
  ['sp-field', 'Where are Mia and Sam running?', ['On the field.', 'In the pool.', 'In the gym.'], 'Look at the green grass.', 'They are running on the field.']
].forEach(([image, prompt, [r, ...w], hint, explain]) => add('bk', { bank: 'book', type: 'mcq', target: 'question', level: 1, image, prompt, ...place(r, w), hint, explain }));

// =================== J. A1 action verbs + -ing (24) ===================
const A1 = SCENES.filter((s) => s.verb.startsWith('a1-'));
A1.slice(0, 8).forEach((sc, i) => {
  const v = verb(sc.verb);
  const others = A1.filter((x) => x !== sc).map((x) => verb(x.verb).ing);
  add('vb', { bank: 'verbs', type: 'mcq', target: 'vocabulary', level: 1, image: sc.image, prompt: `Look. What is ${subj(sc.who).text} doing?`, ...place(v.ing, [others[(i + 3) % others.length], others[(i + 9) % others.length]]), hint: 'Look at the picture.', explain: S(sc.who, sc.verb, 'positive') });
});
A1.slice(8, 16).forEach((sc) => {
  const v = verb(sc.verb); const b = be(sc.who);
  const wr = [wrongIng(v) || `${v.base}s`, v.base].filter((x) => x !== v.ing);
  add('vb', { bank: 'verbs', type: 'mcq', target: 'affirmative', level: 1, image: sc.image, prompt: `${subj(sc.who).text} ${b} ___ ${rest(sc.who, sc.verb)}.`, ...place(v.ing, wr), hint: `${b} + verb-ing.`, explain: S(sc.who, sc.verb, 'positive') });
});
A1.slice(0, 4).forEach((sc, i) => {
  const alt = A1[(i + 6) % A1.length];
  const b = be(sc.who);
  add('vb', { bank: 'verbs', type: 'mcq', target: 'negative', level: 2, image: sc.image, prompt: `${subj(sc.who).text} ___ ${verb(alt.verb).ing}. ${cap(subj(sc.who).short)} is ${verb(sc.verb).ing}.`, ...place(nt(b), [nt(otherBe(b)), b === 'is' ? "doesn't" : "don't"]), hint: `${subj(sc.who).text} → ${nt(b)}.`, explain: `${subj(sc.who).text} ${nt(b)} ${verb(alt.verb).ing}.` });
});
A1.slice(4, 8).forEach((sc) => {
  const q = S(sc.who, sc.verb, 'question'); const a = C.shortAnswers(subj(sc.who));
  add('vb', { bank: 'verbs', type: 'mcq', target: 'question', level: 1, image: sc.image, prompt: q, ...place(a.yes, [a.no, a.yes.replace(/ is\.$/, ' does.')]), hint: 'Look at the picture.', explain: a.yes });
});

export const BANKS = [
  { id: 'mcq', letter: 'A', title: 'Choose', instruction: 'Choose.', description: 'Choose the right word or sentence.', expected: 60 },
  { id: 'jumbled', letter: 'B', title: 'Make a sentence', instruction: 'Make a sentence.', description: 'Put the words in order.', expected: 36 },
  { id: 'fill', letter: 'C', title: 'Fill in', instruction: 'Fill in the gap.', description: 'Write or choose the missing word.', expected: 30 },
  { id: 'change', letter: 'D', title: 'Change it', instruction: 'Change the sentence.', description: 'Make it negative or make a question.', expected: 18 },
  { id: 'fix', letter: 'E', title: 'Fix the mistake', instruction: 'Find the mistake. Fix it.', description: 'One word is wrong. Find it and fix it.', expected: 18 },
  { id: 'decide', letter: 'F', title: 'Look and decide', instruction: 'Look. Read. True or false?', description: 'Look at the clue. Is it true or false?', expected: 18 },
  { id: 'dialogue', letter: 'G', title: 'Dialogues', instruction: 'Complete the dialogue.', description: 'Read the short talk. Choose the answer.', expected: 12 },
  { id: 'reading', letter: 'H', title: 'Mini reading', instruction: 'Read. Answer.', description: 'Read a short text. Answer 4 questions.', expected: 12 },
  { id: 'book', letter: 'I', title: 'Book words: sports', instruction: 'Look and choose.', description: 'balls, bat, hoop, goal, racket, net, gym, field, court, pool.', expected: 30 },
  { id: 'verbs', letter: 'J', title: 'A1 action verbs + -ing', instruction: 'Look and choose.', description: 'running, jumping, swimming … with am / is / are.', expected: 24 }
];
export const QUESTIONS = out;
export { CARDS, PASSAGES };
