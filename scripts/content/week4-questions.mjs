// Week 4 question bank: the same activities as Weeks 1–3, for should / shouldn't, How often …? and health words.
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SUBJECTS, VERBS, SCENES } from './week4-data.mjs';

const REPO = fileURLToPath(new URL('../..', import.meta.url)).replace(/[\/]$/, '');
const S = await import(pathToFileURL(`${REPO}/site/js/core/should.js`).href);

const subj = (id) => SUBJECTS.find((s) => s.id === id);
const verb = (id) => { const v = VERBS.find((x) => x.id === id); if (!v) throw new Error(`verb ${id}`); return v; };
const L = 'abcdefgh';
const noEnd = (t) => t.replace(/[.?!]$/, '');
const imageOf = (vid) => SCENES.find((s) => s.verb === vid).image;
const whoOf = (vid) => SCENES.find((s) => s.verb === vid).who;
const rest = (v, s) => v.rest.replace('{poss}', s.poss);

let rot = 0;
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
  out.push({ id: `w4-${prefix}-${String(counters[prefix]).padStart(3, '0')}`, v: 1, ...q });
}

// =================== A. Choose (mcq) 60 ===================
// should or shouldn't? One for every scene (28).
SCENES.forEach(({ who, verb: vid, image }) => {
  const s = subj(who); const v = verb(vid);
  const word = v.bad ? "shouldn't" : 'should';
  add('mc', { type: 'mcq', target: v.bad ? 'negative' : 'affirmative', level: 1, prompt: `${s.text} ___ ${v.base} ${rest(v, s)}.`, image, ...place(word, [v.bad ? 'should' : "shouldn't"]), hint: v.bad ? 'Is it a good idea? No!' : 'Is it a good idea? Yes!', explain: S.buildSentence(s, v, v.bad ? 'negative' : 'positive').text });
});
// The best advice for a problem (14).
[
  ['h-toothache', 'Leo has a toothache.', 'He should go to the dentist.', ['He should eat lots of candy.', 'He should comb his hair.']],
  ['h-fever', 'Ana has a fever.', 'She should stay in bed.', ['She should go to school.', 'She should play football.']],
  ['h-sneeze', 'Ana is sneezing.', 'She should use a tissue.', ['She should share her drink.', 'She should sneeze on people.']],
  ['h-cough', 'Sam is coughing.', 'He should cover his mouth.', ['He should cough on his friends.', 'He should eat candy.']],
  ['h-leg', "Sam's knee hurts.", 'He should put on a bandage.', ['He should run a race.', 'He should brush his teeth.']],
  ['h-cold', 'Mia has a cold.', 'She should rest and drink water.', ['She should go swimming.', 'She should share her cup.']],
  ['h-sore-throat', 'Mia has a sore throat.', 'She should drink warm water.', ['She should shout and sing.', 'She should eat ice cream.']],
  ['h-headache', 'Sam has a headache at school.', 'He should go to the school nurse.', ['He should play video games.', 'He should run fast.']],
  ['h-stomachache', 'Leo has a stomachache.', 'He should go to the doctor.', ['He should eat more candy.', 'He should cut his nails.']],
  ['h-earache', 'Mia has an earache.', 'She should go to the doctor.', ['She should listen to loud music.', 'She should wash her face.']],
  ['g-dirty', 'Sam has dirty hands.', 'He should wash his hands.', ['He should eat his sandwich now.', 'He should comb his hair.']],
  ['a-water', 'Sam is very thirsty.', 'He should drink water.', ['He should take a shower.', 'He should go to the dentist.']],
  ['h-fever', 'Ana feels very hot.', 'She should take her temperature.', ['She should take a shower.', 'She should cut her nails.']],
  ['g-bin', 'Ana has a used tissue.', 'She should throw it away.', ['She should give it to Mia.', 'She should put it on the desk.']]
].forEach(([image, prompt, right, wrong]) => add('mc', { type: 'mcq', target: 'affirmative', level: 2, prompt: `${prompt} What is the best advice?`, image, ...place(right, wrong), hint: 'Which one helps?', explain: `${prompt} ${right}` }));
// Which sentence is right? (8)
[
  ['a-doctor', ['He should go to the doctor.', 'He should goes to the doctor.', 'He shoulds go to the doctor.'], 'should + go. No -es.', 'He should go to the doctor.', 'affirmative'],
  ['a-medicine', ['She should take some medicine.', 'She should takes some medicine.', 'She should to take some medicine.'], 'should + take.', 'She should take some medicine.', 'affirmative'],
  ['s-share', ["You shouldn't share a drink.", "You don't should share a drink.", "You shouldn't shares a drink."], "shouldn't + share.", "You shouldn't share a drink.", 'negative'],
  ['a-dentist', ['Should I go to the dentist?', 'Do I should go to the dentist?', 'I should go to the dentist?'], 'Should comes first.', 'Should I go to the dentist?', 'question'],
  ['h-fever', ['Should Ana go to school?', 'Should Ana goes to school?', 'Does Ana should go to school?'], 'Should + Ana + go.', 'Should Ana go to school?', 'question'],
  ['y-teeth', ['Mia always brushes her teeth.', 'Mia brushes always her teeth.', 'Always Mia brush her teeth.'], 'always goes before the verb.', 'Mia always brushes her teeth.', 'affirmative'],
  ['y-shower', ['How often does Sam take a shower?', 'How often do Sam take a shower?', 'How often Sam takes a shower?'], 'Sam = he → does + take.', 'How often does Sam take a shower?', 'question'],
  ['h-earache', ['Mia has an earache.', 'Mia has a earache.', 'Mia have an earache.'], 'an + earache. Mia has.', 'Mia has an earache.', 'affirmative']
].forEach(([image, [r, ...wr], hint, explain, target]) => add('mc', { type: 'mcq', target, level: 2, prompt: 'Which sentence is right?', image, ...place(r, wr), hint, explain }));
// Mixed (10)
[
  ['y-teeth', 'Every time = ___', ['always', 'sometimes', 'never'], 'always = 100%.', 'Every time = always.'],
  ['g-dirty', 'Not one time = ___', ['never', 'usually', 'always'], 'never = 0%.', 'Not one time = never.'],
  ['y-shower', 'Most times = ___', ['usually', 'never', 'sometimes'], 'usually = 80%.', 'Most times = usually.'],
  ['y-gel', 'Some times, not always = ___', ['sometimes', 'always', 'never'], 'sometimes = 50%.', 'Some times = sometimes.'],
  ['d-talk', 'The doctor asks: “What’s the ___?”', ['matter', 'name', 'weather'], 'What is the problem?', 'What’s the matter?'],
  ['d-sorry', 'Leo is hurt. Ana says: “I’m ___.”', ['sorry', 'happy', 'hungry'], 'Show you care.', 'I’m sorry.'],
  ['h-headache', 'head + ache = ___', ['headache', 'earache', 'toothache'], 'Put the two words together.', 'head + ache = headache.'],
  ['y-nails', 'Leo cuts his nails ___ a week.', ['once', 'always', 'never'], 'One time.', 'Leo cuts his nails once a week.'],
  ['g-germs', 'Germs are very ___.', ['small', 'big', 'heavy'], 'We can’t see them.', 'Germs are very small.'],
  ['c-carry', 'The water bottle is ___.', ['heavy', 'tiny', 'dirty'], 'It is full of water.', 'The water bottle is heavy.']
].forEach(([image, prompt, [r, ...wr], hint, explain]) => add('mc', { type: 'mcq', target: 'mixed', level: 1, prompt, image, ...place(r, wr), hint, explain }));

// =================== B. Make a sentence (jumbled) 36 ===================
const JB_SHOULD = ['rest', 'drink-water', 'see-dentist', 'see-nurse', 'take-medicine', 'use-tissue', 'cover-mouth', 'bandage', 'stay-home', 'wash-hands'];
JB_SHOULD.forEach((vid) => {
  const s = subj(whoOf(vid)); const t = noEnd(S.buildSentence(s, verb(vid), 'positive').text);
  add('jb', { type: 'jumbled', target: 'affirmative', level: 1, image: imageOf(vid), tokens: t.split(' '), end: '.', answers: [t], hint: `Start with ${s.text}.`, explain: `${t}.` });
});
['share-drink', 'school-fever', 'eat-candy', 'sneeze-on', 'dirty-hands', 'touch-tissues'].forEach((vid) => {
  const s = subj(whoOf(vid) === 'they' ? 'we' : whoOf(vid)); const t = noEnd(S.buildSentence(s, verb(vid), 'negative').text);
  add('jb', { type: 'jumbled', target: 'negative', level: 1, image: imageOf(vid), tokens: t.split(' '), end: '.', answers: [t], hint: `Start with ${s.text}. Use shouldn't.`, explain: `${t}.` });
});
[['I', 'see-doctor'], ['I', 'school-fever'], ['leo', 'see-dentist'], ['ana', 'take-medicine'], ['we', 'share-drink'], ['mia', 'rest'], ['sam', 'bandage']].forEach(([who, vid]) => {
  const q = S.buildSentence(subj(who), verb(vid), 'question'); const t = noEnd(q.text);
  add('jb', { type: 'jumbled', target: 'question', level: 2, image: imageOf(vid), tokens: t.split(' '), end: '?', answers: [t], hint: 'Start with Should.', explain: `${q.text} ${q.answers.yes}` });
});
[['sam', 'shower'], ['mia', 'brush-teeth'], ['you', 'wash-hands'], ['leo', 'cut-nails'], ['they', 'comb-hair']].forEach(([who, vid]) => {
  const q = S.askOften(subj(who), verb(vid)); const t = noEnd(q.text);
  add('jb', { type: 'jumbled', target: 'question', subtarget: 'wh', level: 2, image: imageOf(vid), tokens: t.split(' '), end: '?', answers: [t], hint: 'Start with How often.', explain: `${q.text} ${q.answer}` });
});
[['ana', 'wash-hands'], ['mia', 'brush-teeth'], ['sam', 'shower'], ['leo', 'wash-face'], ['ana', 'hand-gel'], ['we', 'dirty-hands'], ['they', 'bite-nails'], ['mia', 'wipe-mouth']].forEach(([who, vid]) => {
  const t = noEnd(S.askOften(subj(who), verb(vid)).answer);
  add('jb', { type: 'jumbled', target: 'affirmative', level: 2, image: imageOf(vid), tokens: t.split(' '), end: '.', answers: [t], hint: `${verb(vid).often} goes before the verb.`, explain: `${t}.` });
});

// =================== C. Fill in 32 ===================
[
  ['a-rest', 'Mia has a cold. She ___ rest.', 'should'], ['h-fever', "Ana has a fever. She ___ go to school.", "shouldn't"],
  ['a-dentist', 'Leo has a toothache. He ___ go to the dentist.', 'should'], ['h-toothache', "Leo has a toothache. He ___ eat candy.", "shouldn't"],
  ['a-cover', 'You ___ cover your mouth when you cough.', 'should'], ['s-share', "You ___ share a drink when you are sick.", "shouldn't"],
  ['a-tissue', 'You ___ use a tissue when you sneeze.', 'should'], ['h-sneeze', "You ___ sneeze on your friends.", "shouldn't"],
  ['g-dirty', "We ___ eat with dirty hands.", "shouldn't"], ['a-water', 'You ___ drink lots of water.', 'should']
].forEach(([image, text, ans]) => add('fb', { type: 'fill', target: ans === 'should' ? 'affirmative' : 'negative', level: 1, image, text, answers: [ans], pool: ['should', "shouldn't"], hint: ans === 'should' ? 'A good idea.' : 'A bad idea.', explain: text.replace('___', ans) }));
[
  ['y-teeth', 'Mia brushes her teeth every morning and every night. She ___ brushes her teeth.', 'always'],
  ['g-dirty', 'We ___ eat with dirty hands. Not one time!', 'never'],
  ['y-shower', 'Sam takes a shower most evenings. He ___ takes a shower in the evening.', 'usually'],
  ['y-gel', 'Ana uses hand gel two or three days a week. She ___ uses hand gel.', 'sometimes'],
  ['y-hands', 'Ana washes her hands before every meal. She ___ washes her hands before meals.', 'always'],
  ['y-nails', 'Leo doesn’t bite his nails. Not one time! He ___ bites his nails.', 'never'],
  ['y-face', 'Leo washes his face most mornings. He ___ washes his face in the morning.', 'usually'],
  ['a-water', 'Sam drinks juice some days and water other days. He ___ drinks juice.', 'sometimes']
].forEach(([image, text, ans]) => add('fb', { type: 'fill', target: 'affirmative', level: 2, image, text, answers: [ans], pool: ['always', 'usually', 'sometimes', 'never'], hint: 'always 100% · usually 80% · sometimes 50% · never 0%', explain: text.replace('___', ans) }));
[
  ['y-teeth', 'How often ___ you brush your teeth?', 'do'], ['y-shower', 'How often ___ Sam take a shower?', 'does'],
  ['y-gel', 'How often ___ Ana use hand gel?', 'does'], ['y-hands', 'How often ___ they wash their hands?', 'do'],
  ['a-doctor', '___ I go to the doctor?', 'Should'], ['h-fever', '___ Ana go to school with a fever?', 'Should']
].forEach(([image, text, ans]) => add('fb', { type: 'fill', target: 'question', level: 2, image, text, answers: [ans], pool: ['do', 'does', 'Should'], hint: ans === 'Should' ? 'Ask for advice.' : (ans === 'do' ? 'you / they → do.' : 'he / she → does.'), explain: text.replace('___', ans) }));
[
  ['h-earache', 'Mia has ___ earache.', 'an'], ['h-headache', 'Sam has ___ headache.', 'a'],
  ['h-cold', 'Mia has ___ cold.', 'a'], ['h-toothache', 'Leo has ___ toothache.', 'a']
].forEach(([image, text, ans]) => add('fb', { type: 'fill', target: 'vocabulary', level: 1, image, text, answers: [ans], pool: ['a', 'an'], hint: 'a e i o u → an.', explain: text.replace('___', ans) }));
[
  ['a-nurse', 'How are you feeling___', '?'], ['v-kind', 'Get well soon___', '!'], ['h-cold', 'I have a cold___', '.'], ['a-rest', 'Should I rest___', '?']
].forEach(([image, text, ans]) => add('fb', { type: 'fill', target: 'mixed', level: 1, image, text, answers: [ans], pool: ['.', '?', '!'], hint: '. a sentence · ? a question · ! a strong feeling', explain: text.replace('___', ans) }));

// =================== D. Change it 18 ===================
const CH_SHOULD = [['ana', 'rest'], ['sam', 'drink-water'], ['leo', 'see-dentist'], ['mia', 'use-tissue'], ['ana', 'cover-mouth'], ['leo', 'bandage']];
CH_SHOULD.forEach(([who, vid]) => {
  const s = subj(who); const v = verb(vid);
  const from = `${s.text} ${v.s} ${rest(v, s)}.`;
  add('cs', { type: 'change', target: 'affirmative', task: 'advice', cue: 'A good idea! Give advice with should.', level: 1, image: imageOf(vid), from, answers: [S.buildSentence(s, v, 'positive').text], hint: `should + ${v.base} (no -s).`, explain: S.buildSentence(s, v, 'positive').text });
});
const CH_SHOULDNT = [['leo', 'share-drink'], ['ana', 'school-fever'], ['leo', 'eat-candy'], ['ana', 'sneeze-on'], ['sam', 'dirty-hands']];
CH_SHOULDNT.forEach(([who, vid]) => {
  const s = subj(who); const v = verb(vid);
  const from = `${s.text} ${v.s} ${rest(v, s)}.`;
  const a = S.buildSentence(s, v, 'negative').text;
  add('cs', { type: 'change', target: 'negative', task: 'negative', cue: "A bad idea! Give advice with shouldn't.", level: 1, image: imageOf(vid), from, answers: [a, a.replace("shouldn't", 'should not')], hint: `shouldn't + ${v.base}.`, explain: a });
});
[['mia', 'rest'], ['leo', 'see-doctor'], ['ana', 'take-medicine'], ['sam', 'play-football']].forEach(([who, vid]) => {
  const s = subj(who); const v = verb(vid);
  const q = S.buildSentence(s, v, 'question');
  add('cs', { type: 'change', target: 'question', task: 'question', cue: 'Ask for advice. Start with Should.', level: 2, image: imageOf(vid), from: S.buildSentence(s, v, v.bad ? 'negative' : 'positive').text, answers: [q.text], hint: 'Should + who + verb?', explain: `${q.text} ${q.answers.yes}` });
});
[['leo', 'wash-face'], ['ana', 'hand-gel'], ['mia', 'brush-teeth']].forEach(([who, vid]) => {
  const s = subj(who); const v = verb(vid);
  const q = S.askOften(s, v);
  add('cs', { type: 'change', target: 'question', task: 'question', cue: 'Ask with How often.', level: 2, image: imageOf(vid), from: `${s.text} ${v.s} ${rest(v, s)}.`, answers: [q.text], hint: 'How often + does + who + verb?', explain: `${q.text} ${q.answer}` });
});

// =================== E. Fix the mistake 18 ===================
const fx = (target, image, words, wrong, right, other, hint, explain) => add('fx', { type: 'fix', target, level: 1, image, words, wrong, ...(() => { const p = place(right, [other]); return { fixes: p.options, fix: p.answer }; })(), hint, explain });
fx('affirmative', 'a-rest', ['Mia', 'should', 'rests', 'in', 'bed.'], 2, 'rest', 'resting', 'should + rest (no -s).', 'Mia should rest in bed.');
fx('affirmative', 'a-doctor', ['Leo', 'should', 'goes', 'to', 'the', 'doctor.'], 2, 'go', 'going', 'should + go.', 'Leo should go to the doctor.');
fx('affirmative', 'a-medicine', ['Ana', 'should', 'takes', 'some', 'medicine.'], 2, 'take', 'took', 'should + take.', 'Ana should take some medicine.');
fx('affirmative', 'a-tissue', ['You', 'shouldn’t', 'use', 'a', 'tissue.'], 1, 'should', 'does', 'Using a tissue is a good idea.', 'You should use a tissue.');
fx('negative', 's-share', ['You', 'should', 'share', 'a', 'drink.'], 1, "shouldn't", 'do', 'You are sick. It is a bad idea.', "You shouldn't share a drink.");
fx('negative', 'h-fever', ['Ana', 'should', 'go', 'to', 'school', 'with', 'a', 'fever.'], 1, "shouldn't", 'does', 'A fever → stay at home.', "Ana shouldn't go to school with a fever.");
fx('negative', 'h-toothache', ['Leo', "shouldn't", 'eats', 'candy.'], 2, 'eat', 'eating', "shouldn't + eat.", "Leo shouldn't eat candy.");
fx('negative', 'h-sneeze', ['We', "don't", 'sneeze', 'on', 'people.'], 1, "shouldn't", 'should', 'Give advice: a bad idea.', "We shouldn't sneeze on people.");
fx('question', 'a-dentist', ['Should', 'Leo', 'goes', 'to', 'the', 'dentist?'], 2, 'go', 'went', 'Should + Leo + go.', 'Should Leo go to the dentist?');
fx('question', 'a-doctor', ['Do', 'I', 'go', 'to', 'the', 'doctor?'], 0, 'Should', 'Does', 'Ask for advice.', 'Should I go to the doctor?');
fx('question', 'y-shower', ['How', 'often', 'do', 'Sam', 'take', 'a', 'shower?'], 2, 'does', 'is', 'Sam = he → does.', 'How often does Sam take a shower?');
fx('question', 'y-teeth', ['How', 'often', 'does', 'you', 'brush', 'your', 'teeth?'], 2, 'do', 'are', 'you → do.', 'How often do you brush your teeth?');
fx('question', 'y-gel', ['How', 'often', 'does', 'Ana', 'uses', 'hand', 'gel?'], 4, 'use', 'using', 'does + use (no -s).', 'How often does Ana use hand gel?');
fx('affirmative', 'y-hands', ['Ana', 'always', 'wash', 'her', 'hands.'], 2, 'washes', 'washing', 'Ana = she → washes.', 'Ana always washes her hands.');
fx('affirmative', 'y-teeth', ['Mia', 'never', 'brushes', 'her', 'teeth', 'before', 'bed.'], 1, 'always', 'sometimes', 'She does it every night!', 'Mia always brushes her teeth before bed.');
fx('negative', 'g-dirty', ['We', 'always', 'eat', 'with', 'dirty', 'hands.'], 1, 'never', 'usually', 'Not one time!', 'We never eat with dirty hands.');
fx('affirmative', 'h-earache', ['Mia', 'has', 'a', 'earache.'], 2, 'an', 'the', 'earache starts with e → an.', 'Mia has an earache.');
fx('affirmative', 'h-headache', ['Sam', 'have', 'a', 'headache.'], 1, 'has', 'is', 'Sam = he → has.', 'Sam has a headache.');

// =================== F. Look and decide 18 ===================
const CARDS = {
  advice: { title: 'The doctor’s advice for Mia', image: 'd-talk', lines: [{ mark: 'yes', text: 'rest in bed' }, { mark: 'yes', text: 'drink lots of water' }, { mark: 'no', text: 'go to school' }] },
  leo: { title: 'Leo has a toothache', image: 'h-toothache', lines: [{ mark: 'yes', text: 'go to the dentist' }, { mark: 'no', text: 'eat candy' }, { mark: 'yes', text: 'brush his teeth' }] },
  log: { title: 'Sam’s hygiene week', image: 'y-shower', lines: [{ mark: 'yes', text: 'brush teeth: Monday to Sunday' }, { mark: 'yes', text: 'take a shower: Monday to Friday' }, { mark: 'no', text: 'cut nails: not this week' }] },
  ana: { title: 'Ana’s hygiene week', image: 'y-gel', lines: [{ mark: 'yes', text: 'wash hands: every day' }, { mark: 'yes', text: 'hand gel: Tuesday and Sunday' }, { mark: 'no', text: 'bite nails: never' }] },
  germs: { title: 'Germs', image: 'g-germs', text: 'Germs are very small. We can’t see them. They are on desks, doors and pencils. Some germs make us sick, so we should wash our hands.' },
  nurse: { title: 'At the school nurse', image: 'a-bandage', text: 'Leo falls in the playground. His knee hurts. The school nurse puts a bandage on it. She says, “You shouldn’t run today.”' },
  water: { title: 'A new tap', image: 'c-tap', text: 'The village has a new well. A solar panel gives power to the pump. The children don’t carry heavy bottles now. They get clean water from the tap.' },
  kind: { title: 'A good friend', image: 'v-kind', lines: [{ mark: 'yes', text: 'Mia makes a card for Sam.' }, { mark: 'yes', text: 'Mia says, “Get well soon!”' }, { mark: 'no', text: 'Mia shares Sam’s drink.' }] }
};
[
  ['affirmative', 'advice', 'Mia should rest in bed.', true, 'Look at the ✓.'],
  ['negative', 'advice', 'Mia should go to school.', false, 'Look at the ✗.'],
  ['affirmative', 'advice', 'Mia should drink lots of water.', true, 'Look at the ✓.'],
  ['negative', 'leo', "Leo shouldn't eat candy.", true, 'Look at the ✗.'],
  ['affirmative', 'leo', "Leo shouldn't go to the dentist.", false, 'Look at the ✓.'],
  ['affirmative', 'log', 'Sam always brushes his teeth.', true, 'Every day = always.'],
  ['affirmative', 'log', 'Sam usually takes a shower.', true, 'Five days = usually.'],
  ['affirmative', 'log', 'Sam always cuts his nails.', false, 'Not this week.'],
  ['affirmative', 'ana', 'Ana sometimes uses hand gel.', true, 'Two days = sometimes.'],
  ['negative', 'ana', 'Ana never bites her nails.', true, 'Read the last line.'],
  ['affirmative', 'ana', 'Ana never washes her hands.', false, 'Every day!'],
  ['affirmative', 'germs', 'We can see germs with our eyes.', false, 'Read the second sentence.'],
  ['affirmative', 'germs', 'Germs are on desks and doors.', true, 'Read the third sentence.'],
  ['question', 'nurse', 'What should Leo do today? He should run.', false, 'Read what the nurse says.'],
  ['affirmative', 'nurse', 'The nurse puts a bandage on his knee.', true, 'Read the third sentence.'],
  ['negative', 'water', "The children don't carry heavy bottles now.", true, 'Read the third sentence.'],
  ['affirmative', 'water', 'The water from the tap is dirty.', false, 'Read the last sentence.'],
  ['affirmative', 'kind', 'Mia is a kind friend.', true, 'Look at the ✓.']
].forEach(([target, card, statement, answer, hint]) => add('ld', { type: 'decide', target, level: answer ? 1 : 2, card, statement, answer, hint, explain: `${answer ? 'True' : 'False'}. ${statement}` }));

// =================== G. Dialogues 12 ===================
const dl = (target, image, lines, [right, ...wrong], hint, explain) => add('cd', { type: 'dialogue', target, level: 1, image, lines, ...place(right, wrong), hint, explain });
dl('question', 'd-talk', [{ who: 'Doctor', text: "What's the ___, Mia?" }, { who: 'Mia', text: 'My throat hurts.' }], ['matter', 'name', 'time'], 'Ask about the problem.', "What's the matter, Mia? My throat hurts.");
dl('affirmative', 'd-talk', [{ who: 'Mia', text: 'What should I do?' }, { who: 'Doctor', text: '___' }], ['You should drink warm water and rest.', 'You should go swimming.', 'Yes, you do.'], 'Give good advice.', 'You should drink warm water and rest.');
dl('question', 'a-dentist', [{ who: 'Leo', text: '___ I go to the dentist?' }, { who: 'Mom', text: 'Yes, you should.' }], ['Should', 'Do', 'Am'], 'The answer has should.', 'Should I go to the dentist? Yes, you should.');
dl('negative', 'h-fever', [{ who: 'Ana', text: 'Should I go to school today?' }, { who: 'Dad', text: "___ You have a fever." }], ["No, you shouldn't.", "No, you don't.", 'Yes, you should.'], 'A fever → stay at home.', "No, you shouldn't. You have a fever.");
dl('affirmative', 'd-sorry', [{ who: 'Leo', text: 'I fell. My arm hurts.' }, { who: 'Ana', text: "Oh no! ___" }], ["I'm sorry.", "That's great!", 'Thank you.'], 'Show you care.', "Oh no! I'm sorry.");
dl('affirmative', 'h-leg', [{ who: 'Sam', text: 'My leg hurts.' }, { who: 'Mia', text: "That's too ___. You should go to the nurse." }], ['bad', 'good', 'big'], "That's too bad.", "That's too bad. You should go to the nurse.");
dl('question', 'a-nurse', [{ who: 'Nurse', text: 'How are you ___, Mia?' }, { who: 'Mia', text: 'Not very well. I have a headache.' }], ['feeling', 'doing', 'going'], 'How are you feeling?', 'How are you feeling, Mia?');
dl('question', 'y-teeth', [{ who: 'Leo', text: 'How often do you brush your teeth?' }, { who: 'Mia', text: '___' }], ['I always brush them twice a day.', 'Yes, I do.', 'In the bathroom.'], 'How often → always, usually …', 'I always brush them twice a day.');
dl('question', 'y-shower', [{ who: 'Ana', text: 'How often ___ Sam take a shower?' }, { who: 'Leo', text: 'He usually takes a shower in the evening.' }], ['does', 'do', 'is'], 'Sam = he → does.', 'How often does Sam take a shower?');
dl('negative', 's-share', [{ who: 'Leo', text: 'Can I have some of your juice?' }, { who: 'Mia', text: "Sorry, I have a cold. We ___ share drinks." }], ["shouldn't", 'should', "don't should"], 'Germs go from cup to cup.', "Sorry, I have a cold. We shouldn't share drinks.");
dl('affirmative', 'v-grateful', [{ who: 'Mia', text: 'Here, let me help you up.' }, { who: 'Leo', text: '___' }], ['Thank you, Mia!', 'Go away!', "That's too bad."], 'Be grateful.', 'Thank you, Mia!');
dl('affirmative', 'v-kind', [{ who: 'Mia', text: 'This card is for you, Sam. Get well ___!' }, { who: 'Sam', text: 'Thanks, Mia!' }], ['soon', 'late', 'bad'], 'Get well soon!', 'Get well soon!');

// =================== H. Mini reading 16 (our own texts, 30–45 words) ===================
const PASSAGES = {
  'rd-p1': { title: 'Mia’s Cold', image: 'h-cold', text: 'On Monday, Mia wakes up with a cold. She is sneezing and her throat hurts. Dad takes her temperature. “You should stay in bed,” he says. Mia rests and drinks water. On Wednesday, she feels better!' },
  'rd-p2': { title: 'Clean Water', image: 'c-tap', text: 'In some villages, children walk to a river. They fill big bottles and carry them home. The bottles are heavy. River water is not always clean. Now the village has a well. Clean water comes out of a tap!' },
  'rd-p3': { title: 'Tiny Germs', image: 'g-germs', text: 'Germs are very small. We can’t see them, but they are everywhere. They are on doors, desks and pencils. Some germs make us sick. We should wash our hands before we eat and cover our mouth when we cough.' },
  'rd-p4': { title: 'Leo’s Week', image: 'y-face', text: 'Leo always brushes his teeth in the morning and at night. He usually takes a shower after football. He sometimes uses hand gel at school. He cuts his nails once a week. He never eats with dirty hands!' }
};
const rd = (passage, target, prompt, [right, ...wrong], hint, explain, subtarget) => add('rd', { type: 'reading', passage, target, ...(subtarget ? { subtarget } : {}), level: 1, prompt, ...place(right, wrong), hint, explain });
rd('rd-p1', 'question', 'What is the matter with Mia?', ['She has a cold.', 'She has a toothache.'], 'Read the first sentence.', 'Mia wakes up with a cold.', 'wh');
rd('rd-p1', 'question', 'Who takes her temperature?', ['Dad.', 'The dentist.'], 'Read the third sentence.', 'Dad takes her temperature.', 'wh');
rd('rd-p1', 'affirmative', 'What should Mia do?', ['Stay in bed.', 'Go to school.'], 'Read what Dad says.', '“You should stay in bed.”');
rd('rd-p1', 'question', 'When does Mia feel better?', ['On Wednesday.', 'On Monday.'], 'Read the last sentence.', 'On Wednesday, she feels better!', 'wh');
rd('rd-p2', 'question', 'Where do some children walk?', ['To a river.', 'To a shop.'], 'Read the first sentence.', 'Children walk to a river.', 'wh');
rd('rd-p2', 'affirmative', 'True or false? The bottles are heavy.', ['True', 'False'], 'Read the third sentence.', 'True. The bottles are heavy.');
rd('rd-p2', 'negative', 'True or false? River water is always clean.', ['False', 'True'], 'Read the fourth sentence.', 'False. River water is not always clean.');
rd('rd-p2', 'question', 'Where does clean water come out?', ['Out of a tap.', 'Out of a bottle.'], 'Read the last sentence.', 'Clean water comes out of a tap!', 'wh');
rd('rd-p3', 'negative', 'Can we see germs?', ["No, we can't.", 'Yes, we can.'], 'Read the second sentence.', "We can't see them.");
rd('rd-p3', 'question', 'Where are germs?', ['Everywhere.', 'Only in the park.'], 'Read the second sentence.', 'They are everywhere.', 'wh');
rd('rd-p3', 'affirmative', 'When should we wash our hands?', ['Before we eat.', 'After we sleep.'], 'Read the last sentence.', 'We should wash our hands before we eat.');
rd('rd-p3', 'affirmative', 'What should we do when we cough?', ['Cover our mouth.', 'Share a drink.'], 'Read the last sentence.', 'We should cover our mouth when we cough.');
rd('rd-p4', 'question', 'How often does Leo brush his teeth?', ['Always, in the morning and at night.', 'Never.'], 'Read the first sentence.', 'Leo always brushes his teeth.', 'wh');
rd('rd-p4', 'question', 'When does Leo usually take a shower?', ['After football.', 'Before school.'], 'Read the second sentence.', 'He usually takes a shower after football.', 'wh');
rd('rd-p4', 'question', 'How often does Leo cut his nails?', ['Once a week.', 'Every day.'], 'Read the fourth sentence.', 'He cuts his nails once a week.', 'wh');
rd('rd-p4', 'negative', 'True or false? Leo eats with dirty hands.', ['False', 'True'], 'Read the last sentence.', 'False. He never eats with dirty hands!');

// =================== I. Health problems (26) ===================
const PROBLEMS = [
  ['h-sore-throat', 'Mia', (p) => `${p} has a sore throat.`], ['h-cough', 'Sam', (p) => `${p} is coughing.`], ['h-stomachache', 'Leo', (p) => `${p} has a stomachache.`],
  ['h-fever', 'Ana', (p) => `${p} has a fever.`], ['h-leg', 'Sam', (p) => `${p === 'He' ? 'His' : 'Her'} leg hurts.`], ['h-sneeze', 'Ana', (p) => `${p} is sneezing.`],
  ['h-toothache', 'Leo', (p) => `${p} has a toothache.`], ['h-earache', 'Mia', (p) => `${p} has an earache.`], ['h-headache', 'Sam', (p) => `${p} has a headache.`],
  ['h-cold', 'Mia', (p) => `${p} has a cold.`]
];
PROBLEMS.forEach(([image, name, say], i) => {
  const p = ['Mia', 'Ana'].includes(name) ? 'She' : 'He';
  const others = PROBLEMS.filter((x) => x[0] !== image).map((x) => x[2](p));
  add('hp', { bank: 'health', type: 'mcq', target: 'vocabulary', level: 1, image, prompt: `Look at ${name}. What's the matter?`, ...place(say(p), [others[(i * 3) % 9], others[(i * 3 + 4) % 9]]), hint: 'Look at the picture.', explain: say(p) });
});
[
  ['h-headache', 'head + ache = ___', ['headache', 'earache'], 'head → headache.'],
  ['h-earache', 'ear + ache = ___', ['earache', 'stomachache'], 'ear → earache.'],
  ['h-toothache', 'tooth + ache = ___', ['toothache', 'headache'], 'tooth → toothache.'],
  ['h-stomachache', 'stomach + ache = ___', ['stomachache', 'toothache'], 'stomach → stomachache.'],
  ['h-sore-throat', 'My throat hurts. I have a sore ___.', ['throat', 'leg'], 'a sore throat.'],
  ['h-leg', 'Ouch! My ___ hurts.', ['leg', 'hair'], 'Look at Sam’s knee.'],
  ['h-cold', 'Mia’s nose is red. She has a ___.', ['cold', 'remote'], 'a cold.'],
  ['h-fever', 'Ana is very hot. She has a ___.', ['fever', 'bandage'], 'a fever.'],
  ['h-sneeze', 'Achoo! Ana is ___.', ['sneezing', 'combing'], 'She is sneezing.'],
  ['h-cough', 'Sam is ___ into his elbow.', ['coughing', 'washing'], 'He is coughing.'],
  ['h-earache', 'Mia has ___ earache.', ['an', 'a'], 'an + earache.'],
  ['h-stomachache', 'Leo ___ a stomachache.', ['has', 'have'], 'Leo = he → has.'],
  ['d-talk', 'The doctor asks: What’s ___?', ['wrong', 'right'], 'What’s wrong? = What’s the matter?'],
  ['h-headache', 'Which one is a health problem?', ['a headache', 'a hairbrush'], 'A headache hurts.'],
  ['h-toothache', 'Too much candy can give you a ___.', ['toothache', 'earache'], 'Candy is bad for teeth.'],
  ['h-cold', 'When you have a cold, you ___ a lot.', ['sneeze', 'swim'], 'Achoo!']
].forEach(([image, prompt, [r, ...wr], hint]) => add('hp', { bank: 'health', type: 'mcq', target: 'vocabulary', level: 1, image, prompt, ...place(r, wr), hint, explain: prompt.includes('___') ? prompt.replace('___', r) : r }));

// =================== J. Hygiene and How often? (26) ===================
const HABITS = [['y-teeth', 'brush my teeth'], ['y-hair', 'comb my hair'], ['y-face', 'wash my face'], ['y-gel', 'use hand gel'], ['y-nails', 'cut my nails'], ['y-shower', 'take a shower'], ['y-wipe', 'wipe my mouth'], ['y-hands', 'wash my hands']];
HABITS.forEach(([image, right], i) => {
  const o = HABITS.map((h) => h[1]).filter((x) => x !== right);
  add('hy', { bank: 'hygiene', type: 'mcq', target: 'vocabulary', level: 1, image, prompt: 'Look. What is the habit?', ...place(right, [o[i % 7], o[(i + 3) % 7]]), hint: 'Look at the picture.', explain: `I ${right}.` });
});
[
  ['y-teeth', 'I ___ my teeth.', ['brush', 'cut', 'take']], ['y-hair', 'I ___ my hair.', ['comb', 'wipe', 'cut']],
  ['y-nails', 'I ___ my nails.', ['cut', 'brush', 'take']], ['y-shower', 'I take a ___.', ['shower', 'gel', 'nail']],
  ['y-wipe', 'I ___ my mouth with a napkin.', ['wipe', 'comb', 'cut']], ['y-gel', 'I use hand ___.', ['gel', 'shower', 'face']]
].forEach(([image, prompt, [r, ...wr]]) => add('hy', { bank: 'hygiene', type: 'mcq', target: 'vocabulary', level: 1, image, prompt, ...place(r, wr), hint: 'Look at the picture.', explain: prompt.replace('___', r) }));
[
  ['y-teeth', 'Mia brushes her teeth every morning and every night. How often?', ['always', 'never', 'sometimes']],
  ['g-dirty', 'We don’t eat with dirty hands. Not one time. How often?', ['never', 'always', 'usually']],
  ['y-shower', 'Sam takes a shower five evenings a week. How often?', ['usually', 'never', 'always']],
  ['y-gel', 'Ana uses hand gel two days a week. How often?', ['sometimes', 'always', 'never']],
  ['y-nails', 'Leo cuts his nails one time every week. How often?', ['once a week', 'twice a day', 'never']],
  ['y-teeth', 'Mia brushes her teeth in the morning and at night. How often?', ['twice a day', 'once a week', 'never']]
].forEach(([image, prompt, [r, ...wr]]) => add('hy', { bank: 'hygiene', type: 'mcq', target: 'vocabulary', level: 2, image, prompt, ...place(r, wr), hint: 'always 100% · usually 80% · sometimes 50% · never 0%', explain: r }));
[
  ['y-hands', ['I always wash my hands.', 'I wash always my hands.', 'Always I wash my hands.'], 'always + verb.'],
  ['y-hair', ['He usually combs his hair.', 'He combs usually his hair.', 'He usually comb his hair.'], 'usually + combs.'],
  ['y-gel', ['She sometimes uses hand gel.', 'She uses sometimes hand gel.', 'She sometimes use hand gel.'], 'sometimes + uses.'],
  ['y-nails', ['They never bite their nails.', 'They bite never their nails.', 'Never they bite their nails.'], 'never + verb.'],
  ['y-face', ['How often do you wash your face?', 'How often you wash your face?', 'How often does you wash your face?'], 'How often + do + you.'],
  ['y-shower', ['How often does he take a shower?', 'How often does he takes a shower?', 'How often he takes a shower?'], 'does + take.']
].forEach(([image, [r, ...wr], hint]) => add('hy', { bank: 'hygiene', type: 'mcq', target: r.endsWith('?') ? 'question' : 'affirmative', level: 2, image, prompt: 'Which sentence is right?', ...place(r, wr), hint, explain: r }));

// =================== K. Get better and talk to the doctor (24) ===================
const ACTIONS = [['a-doctor', 'go to the doctor'], ['a-tissue', 'use a tissue'], ['a-medicine', 'take medicine'], ['a-temperature', 'take your temperature'], ['a-bandage', 'put on a bandage'], ['a-cover', 'cover your mouth'], ['a-water', 'drink water'], ['a-dentist', 'go to the dentist'], ['a-nurse', 'go to the school nurse'], ['a-rest', 'rest in bed']];
ACTIONS.forEach(([image, right], i) => {
  const o = ACTIONS.map((a) => a[1]).filter((x) => x !== right);
  add('dr', { bank: 'doctor', type: 'mcq', target: 'vocabulary', level: 1, image, prompt: 'Look. What is it?', ...place(right, [o[i % 9], o[(i + 4) % 9]]), hint: 'Look at the picture.', explain: right });
});
[
  ['d-talk', 'You want to know the problem. You ask:', ["What's the matter?", "What's your name?", 'Where do you live?']],
  ['a-nurse', 'You want to know how a sick friend is. You ask:', ['How are you feeling?', 'How old are you?', 'What time is it?']],
  ['a-doctor', 'Another way to say “What’s the matter?”:', ["What's wrong?", "What's right?", "What's this?"]],
  ['d-sorry', 'Your friend is sad and hurt. You say:', ["I'm sorry.", 'Hooray!', "That's great!"]],
  ['h-leg', 'Sam’s leg hurts. You say:', ["That's too bad.", "That's fun.", 'Well done!']],
  ['h-toothache', 'Leo has a very big toothache. You say:', ["That's terrible!", "That's lovely!", 'Good job!']],
  ['v-kind', 'You give a card to a sick friend. You write:', ['Get well soon!', 'Happy birthday!', 'Good night!']],
  ['d-talk', 'The patient asks for advice:', ['What should I do?', 'What do you do?', 'Where should I go now?']],
  ['a-doctor', 'Leo is with the doctor. Leo is the ___.', ['patient', 'nurse', 'dentist']],
  ['a-nurse', 'At school, sick children go to the ___.', ['school nurse', 'dentist', 'river']],
  ['h-cold', 'Mia has a cold. She shouldn’t go to school. She should stay ___.', ['at home', 'at the pool', 'in the park']],
  ['a-temperature', 'Dad uses a thermometer to take Sam’s ___.', ['temperature', 'medicine', 'bandage']],
  ['a-bandage', 'The nurse puts a ___ on Leo’s knee.', ['bandage', 'tissue', 'remote']],
  ['a-medicine', 'Ana takes a spoon of ___.', ['medicine', 'hand gel', 'shampoo']]
].forEach(([image, prompt, [r, ...wr]]) => add('dr', { bank: 'doctor', type: 'mcq', target: 'mixed', level: 1, image, prompt, ...place(r, wr), hint: 'Which one fits?', explain: prompt.includes('___') ? prompt.replace('___', r) : r }));

// =================== L. Germs, clean water and values (16) ===================
[
  ['g-germs', 'Germs are very small. We ___ see them.', ['can’t', 'can'], 'They are too small.'],
  ['g-everywhere', 'Germs are ___.', ['everywhere', 'only at home'], 'On doors, desks, pencils …'],
  ['h-sneeze', 'Germs ___ when we sneeze.', ['spread', 'sleep'], 'They go from person to person.'],
  ['g-bin', 'Ana throws her used tissue ___.', ['away', 'on the desk'], 'Into the bin.'],
  ['g-dirty', 'Sam has dirty hands. He should ___ them.', ['wash', 'eat'], 'Wash your hands before you eat.'],
  ['c-village', 'A small town in the country is a ___.', ['village', 'river'], 'Look at the round houses.'],
  ['c-river', 'The children fill bottles at the ___.', ['river', 'school'], 'Water from the river.'],
  ['c-carry', 'She is ___ a heavy bottle.', ['carrying', 'eating'], 'carry = take in your arms.'],
  ['c-well', 'A ___ takes water from deep under the ground.', ['well', 'tap'], 'Look at the old well.'],
  ['c-tap', 'A solar panel uses the ___ to make power.', ['sun', 'river'], 'solar = the sun.'],
  ['c-tap', 'Clean water keeps us ___.', ['healthy', 'sick'], 'Clean water is good for us.'],
  ['v-honest', 'Sam tells his mom the truth. That is ___.', ['honesty', 'kindness'], 'The truth.'],
  ['v-kind', 'Mia makes a card for her sick friend. That is ___.', ['kindness', 'responsibility'], 'Being nice.'],
  ['v-grateful', 'Leo says “Thank you!” That is ___.', ['gratefulness', 'honesty'], 'Thank you.'],
  ['v-responsible', 'Ana washes the dishes after lunch. That is ___.', ['responsibility', 'gratefulness'], 'Doing your job.'],
  ['s-share', 'Leo shares his crayons. He is being ___.', ['kind', 'sick'], 'Sharing toys is kind.']
].forEach(([image, prompt, [r, ...wr], hint]) => add('wv', { bank: 'world', type: 'mcq', target: 'vocabulary', level: 1, image, prompt, ...place(r, wr), hint, explain: prompt.replace('___', r) }));

const count = (fn) => out.filter(fn).length;
export const BANKS = [
  { id: 'mcq', letter: 'A', title: 'Choose', instruction: 'Choose.', description: 'should or shouldn’t? Choose the best advice.', expected: count((q) => q.type === 'mcq' && !q.bank) },
  { id: 'jumbled', letter: 'B', title: 'Make a sentence', instruction: 'Make a sentence.', description: 'Put the words in order.', expected: count((q) => q.type === 'jumbled') },
  { id: 'fill', letter: 'C', title: 'Fill in', instruction: 'Fill in the gap.', description: 'should, shouldn’t, always, never, do, does …', expected: count((q) => q.type === 'fill') },
  { id: 'change', letter: 'D', title: 'Change it', instruction: 'Change the sentence.', description: 'Give advice. Ask with Should or How often.', expected: count((q) => q.type === 'change') },
  { id: 'fix', letter: 'E', title: 'Fix the mistake', instruction: 'Find the mistake. Fix it.', description: 'One word is wrong. Find it and fix it.', expected: count((q) => q.type === 'fix') },
  { id: 'decide', letter: 'F', title: 'Look and decide', instruction: 'Look. Read. True or false?', description: 'Look at the clue. Is it true or false?', expected: count((q) => q.type === 'decide') },
  { id: 'dialogue', letter: 'G', title: 'Dialogues', instruction: 'Complete the dialogue.', description: 'At the doctor’s and with friends.', expected: count((q) => q.type === 'dialogue') },
  { id: 'reading', letter: 'H', title: 'Mini reading', instruction: 'Read. Answer.', description: 'Read a short text. Answer 4 questions.', expected: count((q) => q.type === 'reading') },
  { id: 'health', letter: 'I', title: 'Health problems', instruction: 'Look and choose.', description: 'a cold, a fever, a sore throat, a headache …', expected: count((q) => q.bank === 'health') },
  { id: 'hygiene', letter: 'J', title: 'Hygiene and How often?', instruction: 'Look and choose.', description: 'brush my teeth, wash my hands · always, usually, sometimes, never.', expected: count((q) => q.bank === 'hygiene') },
  { id: 'doctor', letter: 'K', title: 'Get better!', instruction: 'Look and choose.', description: 'go to the doctor, take medicine · What’s the matter? I’m sorry.', expected: count((q) => q.bank === 'doctor') },
  { id: 'world', letter: 'L', title: 'Germs, clean water and values', instruction: 'Look and choose.', description: 'germs, a well, a tap · honesty, kindness …', expected: count((q) => q.bank === 'world') }
];
export const QUESTIONS = out;
export { CARDS, PASSAGES };
