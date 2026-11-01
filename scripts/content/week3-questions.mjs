// Week 3 question bank: the same activities as Weeks 1 and 2, for Wh- questions, moving words and the body.
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SUBJECTS, VERBS, SCENES } from './week3-data.mjs';

const REPO = fileURLToPath(new URL('../..', import.meta.url)).replace(/[\/]$/, '');
const W = await import(pathToFileURL(`${REPO}/site/js/core/wh.js`).href);

const subj = (id) => SUBJECTS.find((s) => s.id === id);
const verb = (id) => { const v = VERBS.find((x) => x.id === id); if (!v) throw new Error(`verb ${id}`); return v; };
const L = 'abcdefgh';
const noEnd = (t) => t.replace(/[.?!]$/, '');

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
  out.push({ id: `w3-${prefix}-${String(counters[prefix]).padStart(3, '0')}`, v: 1, ...q });
}
const MEANING = { Who: 'a person', What: 'a thing', Where: 'a place', When: 'a time', How: 'a way', Why: 'a reason' };
const WORDS6 = Object.keys(MEANING);
const otherWords = (word, i) => { const o = WORDS6.filter((x) => x !== word); return [o[i % 5], o[(i + 2) % 5]]; };

// Questions with their answers (all our own). [picture, question, answer]
const QA = [
  ['prep-around', 'Who is running around the cone?', 'Sam is.'],
  ['prep-through', 'Who is climbing through the hoop?', 'Mia is.'],
  ['prep-over', 'Who is jumping over the hurdles?', 'Leo is.'],
  ['a-yoga', 'Who is doing yoga?', 'Ana is.'],
  ['a-bowling', 'Who is going bowling?', 'Sam is.'],
  ['r-relay', 'Who is passing the baton?', 'Mia is.'],
  ['w-push', 'Who is pushing the big ball?', 'Leo is.'],
  ['r-relay', 'What is Mia passing?', 'The baton.'],
  ['w-pull', 'What is Ana pulling?', 'A wagon.'],
  ['w-push', 'What is Leo pushing?', 'A big ball.'],
  ['w-plan', 'What is Mia writing?', 'An exercise plan.'],
  ['a-games', 'What is Sam playing?', 'Video games.'],
  ['sp-racket', 'What is Mia playing?', 'Tennis.'],
  ['act-karate', 'What is Leo doing?', 'He is doing karate.'],
  ['r-track', 'Where is Leo running?', 'On the track.'],
  ['a-yoga', 'Where is Ana doing yoga?', 'In the garden.'],
  ['r-swim', 'Where are the swimmers racing?', 'In the pool.'],
  ['prep-across', 'Where is Mia walking?', 'Across the bridge.'],
  ['prep-up', 'Where is Ana climbing?', 'Up the ladder.'],
  ['a-stairs', 'Where is Leo taking the stairs?', 'At school.'],
  ['a-games', 'Where is Sam sitting?', 'On the sofa.'],
  ['w-plan', 'When do you exercise?', 'After school.'],
  ['walk-to-school', 'When does Leo walk to school?', 'In the morning.'],
  ['act-tag', 'When do you play tag?', 'At break time.'],
  ['w-stretch', 'When do you stretch?', 'Before and after sport.'],
  ['w-break', 'When do they have a break?', 'After the game.'],
  ['r-relay', 'When does Sam start?', 'When he has the baton.'],
  ['r-three', 'How are Sam and Leo running?', 'Together!'],
  ['w-pull', 'How is Ana pulling the wagon?', 'With a rope.'],
  ['r-track', 'How do runners win races?', 'They run fast!'],
  ['prep-under', 'How is Leo crawling?', 'On hands and knees.'],
  ['r-tie', 'How are Mia and Ana tying their legs?', 'With a scarf.'],
  ['prep-up', 'How is Ana climbing?', 'Slowly.'],
  ['r-three', 'Why are their legs tied together?', 'Because it is a three-legged race.'],
  ['a-yoga', 'Why is Ana doing yoga?', 'Because it is relaxing.'],
  ['st-cheer', 'Why are you cheering?', 'Because I want my team to win!'],
  ['w-tired', 'Why is Leo tired?', 'Because running is hard work.'],
  ['w-stretch', 'Why is Sam stretching?', 'Because it is good for the body.'],
  ['w-break', 'Why are they having a break?', 'Because everyone is tired.']
];
const wordOf = (q) => q.split(' ')[0];

// A sentence with a moving word. [picture, sentence start, preposition, end, who, wrong words]
const MOVE = [
  ['prep-around', 'Sam is running', 'around', 'the cone', ['under', 'into']],
  ['prep-through', 'Mia is climbing', 'through', 'the hoop', ['over', 'past']],
  ['prep-over', 'Leo is jumping', 'over', 'the hurdles', ['under', 'between']],
  ['prep-up', 'Ana is climbing', 'up', 'the ladder', ['down', 'around']],
  ['prep-down', 'Sam is sliding', 'down', 'the slide', ['up', 'across']],
  ['prep-across', 'Mia is walking', 'across', 'the bridge', ['under', 'into']],
  ['prep-under', 'Leo is crawling', 'under', 'the bench', ['over', 'past']],
  ['prep-into', 'Ana is jumping', 'into', 'the sandbox', ['out of', 'past']],
  ['prep-out', 'Sam is stepping', 'out of', 'the sandbox', ['into', 'between']],
  ['prep-past', 'Leo is running', 'past', 'the goal', ['into', 'under']],
  ['prep-between', 'Mia is running', 'between', 'the trees', ['over', 'through']]
];
const PREPS = ['around', 'through', 'over', 'up', 'down', 'across', 'under', 'into', 'out of', 'past', 'between'];

// =================== A. Choose (mcq) 60 ===================
QA.slice(0, 30).forEach(([image, q, a], i) => {
  const word = wordOf(q);
  add('mc', { type: 'mcq', target: 'question', level: 1, prompt: `___ ${q.split(' ').slice(1).join(' ')} — ${a}`, image, ...place(word, otherWords(word, i)), hint: `The answer is ${MEANING[word]}.`, explain: `${q} ${a}` });
});
QA.slice(9).filter((_, i) => i % 2 === 0).slice(0, 15).forEach(([image, q, a], i) => {
  const wrong = QA.filter((x) => wordOf(x[1]) !== wordOf(q)).map((x) => x[2]);
  add('mc', { type: 'mcq', target: 'question', level: 2, prompt: q, image, ...place(a, [wrong[(i * 3 + 1) % wrong.length], wrong[(i * 5 + 11) % wrong.length]]), hint: `${wordOf(q)} = ${MEANING[wordOf(q)]}.`, explain: `${q} ${a}` });
});
[
  ['prep-over', 'Which question is right?', ['Where is Leo jumping?', 'Where Leo is jumping?', 'Where does Leo jumping?'], 'is comes before Leo.', 'Where is Leo jumping?'],
  ['r-relay', 'Which question is right?', ['What is Mia passing?', 'What Mia is passing?', 'What are Mia passing?'], 'What + is + Mia.', 'What is Mia passing?'],
  ['r-three', 'Which question is right?', ['Why are they tied together?', 'Why is they tied together?', 'Why they are tied together?'], 'they → are.', 'Why are they tied together?'],
  ['act-tag', 'Which question is right?', ['Where do you play tag?', 'Where does you play tag?', 'Where you play tag?'], 'you → do.', 'Where do you play tag?'],
  ['act-karate', 'Which question is right?', ['When does Leo do karate?', 'When do Leo do karate?', 'When does Leo does karate?'], 'Leo = he → does + do.', 'When does Leo do karate?'],
  ['a-bowling', 'Which question is right?', ['Who is going bowling?', 'Who going bowling?', 'Who are is going bowling?'], 'Who + is + going.', 'Who is going bowling?']
].forEach(([image, prompt, [r, ...wr], hint, explain]) => add('mc', { type: 'mcq', target: 'question', level: 2, prompt, image, ...place(r, wr), hint, explain }));
[
  ['b-lungs', 'I breathe with my ___.', ['lungs', 'brain', 'bones'], 'Look at the picture.', 'I breathe with my lungs.'],
  ['b-brain', 'I think with my ___.', ['brain', 'heart', 'muscles'], 'Look at the picture.', 'I think with my brain.'],
  ['b-bones', 'My ___ hold up my body.', ['bones', 'lungs', 'brain'], 'Look at the skeleton.', 'My bones hold up my body.'],
  ['w-tired', 'Leo is ___. He needs a break.', ['tired', 'relaxed', 'strong'], 'He needs a break.', 'Leo is tired. He needs a break.'],
  ['act-gymnastics', 'Mia is ___ gymnastics.', ['doing', 'playing', 'going'], 'do gymnastics.', 'Mia is doing gymnastics.'],
  ['a-bowling', 'Sam is ___ bowling.', ['going', 'doing', 'playing'], 'go bowling.', 'Sam is going bowling.'],
  ['act-tag', 'The children are ___ tag.', ['playing', 'doing', 'going'], 'play tag.', 'The children are playing tag.'],
  ['s-coach', 'Leo is ___ his coach for help.', ['asking', 'pushing', 'passing'], 'ask for help.', 'Leo is asking his coach for help.'],
  ['s-try', 'Sam falls, but he keeps ___.', ['trying', 'sleeping', 'quitting'], 'He does not stop.', 'Sam falls, but he keeps trying.']
].forEach(([image, prompt, [r, ...wr], hint, explain]) => add('mc', { type: 'mcq', target: 'mixed', level: 1, prompt, image, ...place(r, wr), hint, explain }));

// =================== B. Make a sentence (jumbled) 36 ===================
MOVE.forEach(([image, start, prep, end]) => {
  const t = `${start} ${prep} ${end}`;
  add('jb', { type: 'jumbled', target: 'affirmative', level: 1, image, tokens: t.split(' '), end: '.', answers: [t], hint: `Start with ${start.split(' ')[0]}.`, explain: `${t}.` });
});
add('jb', { type: 'jumbled', target: 'affirmative', level: 2, image: 'r-three', tokens: 'Sam and Leo are running a three-legged race'.split(' '), end: '.', answers: ['Sam and Leo are running a three-legged race'], hint: 'Start with Sam.', explain: 'Sam and Leo are running a three-legged race.' });
QA.filter((x) => !x[2].includes('good') || true).slice(0, 24).forEach(([image, q, a]) => {
  const t = noEnd(q);
  add('jb', { type: 'jumbled', target: 'question', subtarget: 'wh', level: wordOf(q) === 'Who' ? 1 : 2, image, tokens: t.split(' '), end: '?', answers: [t], hint: `Start with ${wordOf(q)}.`, explain: `${q} ${a}` });
});

// =================== C. Fill in 30 ===================
QA.slice(15).filter((_, i) => i % 2 === 0).slice(0, 12).forEach(([image, q, a]) => {
  const word = wordOf(q);
  add('fb', { type: 'fill', target: 'question', level: 1, image, text: `___ ${q.split(' ').slice(1).join(' ')}`, answers: [word], pool: ['Who', 'What', 'Where', 'When', 'How', 'Why'], hint: `The answer: ${a}`, explain: q });
});
MOVE.forEach(([image, start, prep, end]) => {
  add('fb', { type: 'fill', target: 'affirmative', level: 1, image, text: `${start} ___ ${end}.`, answers: [prep], pool: [prep, ...PREPS.filter((p) => p !== prep).slice(0, 3)].sort(), hint: 'Look at the picture.', explain: `${start} ${prep} ${end}.` });
});
[
  ['r-swim', 'Where ___ the swimmers racing?', 'are', 'the swimmers = they → are.'],
  ['prep-up', 'Where ___ Ana climbing?', 'is', 'Ana = she → is.'],
  ['w-break', 'What ___ the children having?', 'are', 'the children = they → are.'],
  ['w-pull', 'How ___ Ana pulling the wagon?', 'is', 'Ana = she → is.'],
  ['w-plan', 'When ___ you exercise?', 'do', 'Every day: you → do.'],
  ['walk-to-school', 'When ___ Leo walk to school?', 'does', 'Every day: Leo = he → does.'],
  ['act-tag', 'Where ___ they play tag?', 'do', 'Every day: they → do.']
].forEach(([image, text, ans, hint]) => add('fb', { type: 'fill', target: 'question', level: 2, image, text, answers: [ans], pool: ['is', 'are', 'do', 'does'], hint, explain: text.replace('___', ans) }));

// =================== D. Change it 18 ===================
const CHANGE = [
  ['sam', 'run-around', 'where'], ['mia', 'climb-through', 'who'], ['leo', 'jump-over', 'where'], ['ana', 'climb-up', 'who'],
  ['sam', 'slide-down', 'where'], ['mia', 'walk-across', 'what'], ['leo', 'crawl-under', 'where'], ['ana', 'jump-into', 'what'],
  ['leo', 'run-past', 'where'], ['mia', 'run-between', 'who'], ['mia', 'pass-baton', 'what'], ['leo', 'run-track', 'where'],
  ['leo', 'push-ball', 'what'], ['ana', 'pull-wagon', 'what'], ['ana', 'do-yoga', 'where'], ['they', 'short-break', 'why'],
  ['sam', 'stretch', 'why'], ['they', 'three-legged', 'how']
];
const imageOf = (vid) => SCENES.find((s) => s.verb === vid).image;
CHANGE.forEach(([who, vid, word]) => {
  const s = W.buildSentence(subj(who), verb(vid), 'positive').text;
  const q = W.buildSentence(subj(who), verb(vid), word);
  const Word = word.charAt(0).toUpperCase() + word.slice(1);
  add('cs', { type: 'change', target: 'question', task: 'question', cue: `Make a question with ${Word}.`, level: word === 'who' ? 1 : 2, image: imageOf(vid), from: s, answers: [q.text], hint: `Start with ${Word}.`, explain: `${q.text} ${q.answers.yes}` });
});

// =================== E. Fix the mistake 18 ===================
const fx = (target, image, words, wrong, right, other, hint, explain) => add('fx', { type: 'fix', target, level: 1, image, words, wrong, ...(() => { const p = place(right, [other]); return { fixes: p.options, fix: p.answer }; })(), hint, explain });
fx('question', 'r-track', ['Who', 'is', 'Leo', 'running?'], 0, 'Where', 'When', 'The answer is a place: on the track.', 'Where is Leo running?');
fx('question', 'r-relay', ['Where', 'is', 'Mia', 'passing?'], 0, 'What', 'Who', 'The answer is a thing: the baton.', 'What is Mia passing?');
fx('question', 'a-yoga', ['Where', 'is', 'doing', 'yoga?'], 0, 'Who', 'When', 'The answer is a person: Ana is.', 'Who is doing yoga?');
fx('question', 'w-tired', ['When', 'is', 'Leo', 'tired?'], 0, 'Why', 'Who', 'Because running is hard work → Why.', 'Why is Leo tired?');
fx('question', 'w-pull', ['Why', 'is', 'Ana', 'pulling', 'the', 'wagon?'], 0, 'How', 'Who', 'With a rope → How.', 'How is Ana pulling the wagon?');
fx('question', 'prep-across', ['Where', 'are', 'Mia', 'walking?'], 1, 'is', 'do', 'Mia = she → is.', 'Where is Mia walking?');
fx('question', 'w-break', ['What', 'is', 'they', 'having?'], 1, 'are', 'does', 'they → are.', 'What are they having?');
fx('question', 'r-swim', ['Where', 'is', 'the', 'swimmers', 'racing?'], 1, 'are', 'do', 'the swimmers = they → are.', 'Where are the swimmers racing?');
fx('question', 'prep-over', ['Where', 'is', 'Leo', 'jump?'], 3, 'jumping', 'jumps', 'is + jumping.', 'Where is Leo jumping?');
fx('question', 'a-bowling', ['Who', 'is', 'go', 'bowling?'], 2, 'going', 'goes', 'is + going.', 'Who is going bowling?');
fx('question', 'w-plan', ['When', 'does', 'you', 'exercise?'], 1, 'do', 'is', 'you → do.', 'When do you exercise?');
fx('question', 'walk-to-school', ['When', 'do', 'Leo', 'walk', 'to', 'school?'], 1, 'does', 'are', 'Leo = he → does.', 'When does Leo walk to school?');
fx('affirmative', 'prep-over', ['Leo', 'is', 'jumping', 'under', 'the', 'hurdles.'], 3, 'over', 'into', 'He is above the hurdles.', 'Leo is jumping over the hurdles.');
fx('affirmative', 'prep-under', ['Leo', 'is', 'crawling', 'over', 'the', 'bench.'], 3, 'under', 'around', 'He is below the bench.', 'Leo is crawling under the bench.');
fx('affirmative', 'prep-down', ['Sam', 'is', 'sliding', 'up', 'the', 'slide.'], 3, 'down', 'between', 'A slide goes down.', 'Sam is sliding down the slide.');
fx('affirmative', 'prep-into', ['Ana', 'is', 'jumping', 'past', 'the', 'sandbox.'], 3, 'into', 'under', 'She is going in.', 'Ana is jumping into the sandbox.');
fx('affirmative', 'prep-between', ['Mia', 'is', 'running', 'around', 'the', 'trees.'], 3, 'between', 'up', 'A tree on each side.', 'Mia is running between the trees.');
fx('affirmative', 'prep-through', ['Mia', 'is', 'climbing', 'across', 'the', 'hoop.'], 3, 'through', 'under', 'In one side, out the other.', 'Mia is climbing through the hoop.');

// =================== F. Look and decide 18 ===================
const CARDS = {
  course: { title: 'On the obstacle course', image: 'cover', lines: [{ mark: 'yes', text: 'Sam: around the cone' }, { mark: 'yes', text: 'Mia: through the hoop' }, { mark: 'no', text: 'Leo: under the bridge' }] },
  moves: { title: 'What are they doing now?', image: 'prep-over', lines: [{ mark: 'yes', text: 'Leo: jumping over the hurdles' }, { mark: 'no', text: 'Leo: crawling under the hurdles' }, { mark: 'yes', text: 'Ana: climbing up the ladder' }] },
  relay: { title: 'The relay race', image: 'r-relay', text: 'Mia and Sam are on the track. Mia is passing the baton to Sam. Now Sam is running. Leo isn\'t running. He is cheering.' },
  three: { title: 'The three-legged race', image: 'r-three', text: 'Sam and Leo are in a race. Their legs are tied together with a scarf. They are running together and laughing.' },
  body: { title: 'My body', image: 'b-heart', lines: [{ mark: 'yes', text: 'heart: it beats' }, { mark: 'yes', text: 'lungs: I breathe with them' }, { mark: 'no', text: 'bones: I think with them' }] },
  strong: { title: 'After the game', image: 'w-break', text: 'The children are tired. They are having a short break under a tree. They are drinking water. They aren\'t running now.' },
  plan: { title: 'Mia\'s exercise plan', image: 'w-plan', lines: [{ mark: 'yes', text: 'Monday: ride a bike' }, { mark: 'yes', text: 'Tuesday: go swimming' }, { mark: 'no', text: 'Wednesday: play video games' }] },
  bounce: { title: 'Bounce back', image: 's-try', lines: [{ mark: 'yes', text: 'keep trying' }, { mark: 'yes', text: 'ask for help' }, { mark: 'no', text: 'quit the team' }] }
};
[
  ['affirmative', 'course', 'Sam is running around the cone.', true, 'Look at the ✓.'],
  ['affirmative', 'course', 'Mia is climbing through the hoop.', true, 'Look at the ✓.'],
  ['affirmative', 'course', 'Leo is crawling under the bridge.', false, 'Look at the ✗.'],
  ['affirmative', 'moves', 'Leo is jumping over the hurdles.', true, 'Look at the ✓.'],
  ['affirmative', 'moves', 'Leo is crawling under the hurdles.', false, 'Look at the ✗.'],
  ['affirmative', 'moves', 'Ana is climbing down the ladder.', false, 'Read: up the ladder.'],
  ['question', 'relay', 'Who is passing the baton? Mia is.', true, 'Read the second sentence.'],
  ['question', 'relay', 'Where are Mia and Sam? In the pool.', false, 'Read the first sentence.'],
  ['negative', 'relay', "Leo isn't running.", true, 'Read the last part.'],
  ['question', 'three', 'How are Sam and Leo running? Together.', true, 'Read the last sentence.'],
  ['question', 'three', 'What are their legs tied with? A rope.', false, 'Read the second sentence.'],
  ['affirmative', 'body', 'I think with my bones.', false, 'Look at the ✗.'],
  ['affirmative', 'body', 'I breathe with my lungs.', true, 'Look at the ✓.'],
  ['question', 'strong', 'Why are they having a break? Because they are tired.', true, 'Read the first sentence.'],
  ['negative', 'strong', "The children aren't running now.", true, 'Read the last sentence.'],
  ['question', 'plan', 'When does Mia go swimming? On Monday.', false, 'Read the second line.'],
  ['affirmative', 'bounce', 'You can quit the team.', false, 'Look at the ✗.'],
  ['affirmative', 'bounce', 'You can ask for help.', true, 'Look at the ✓.']
].forEach(([target, card, statement, answer, hint]) => add('ld', { type: 'decide', target, level: answer ? 1 : 2, card, statement, answer, hint, explain: `${answer ? 'True' : 'False'}. ${statement}` }));

// =================== G. Dialogues 12 ===================
const dl = (target, image, lines, [right, ...wrong], hint, explain) => add('cd', { type: 'dialogue', target, level: 1, image, lines, ...place(right, wrong), hint, explain });
dl('question', 'prep-around', [{ who: 'Mia', text: 'Who is running around the cone?' }, { who: 'Ana', text: '___' }], ['Sam is.', 'Yes, he is.', 'Around the cone.'], 'Who → a person.', 'Sam is.');
dl('question', 'r-relay', [{ who: 'Leo', text: '___ is Mia passing?' }, { who: 'Ana', text: 'The baton.' }], ['What', 'Who', 'When'], 'The baton is a thing.', 'What is Mia passing? The baton.');
dl('question', 'r-track', [{ who: 'Sam', text: 'Where is Leo?' }, { who: 'Mia', text: '___' }], ['He is on the track.', 'He is fast.', 'Because he is running.'], 'Where → a place.', 'He is on the track.');
dl('question', 'w-plan', [{ who: 'Ms. Rosa', text: 'When do you exercise, Mia?' }, { who: 'Mia', text: '___' }], ['After school.', 'In the garden.', 'With a ball.'], 'When → a time.', 'After school.');
dl('question', 'r-track', [{ who: 'Ana', text: '___ do runners win races?' }, { who: 'Leo', text: 'They run fast!' }], ['How', 'Where', 'Who'], 'They run fast is a way.', 'How do runners win races? They run fast!');
dl('question', 'st-cheer', [{ who: 'Sam', text: 'Why are you cheering?' }, { who: 'Mia', text: '___ I want my team to win!' }], ['Because', 'When', 'How'], 'Why → Because.', 'Because I want my team to win!');
dl('question', 'a-yoga', [{ who: 'Leo', text: 'What is Ana doing?' }, { who: 'Mia', text: '___' }], ['She is doing yoga.', 'She is in the garden.', 'Ana is.'], 'What … doing? → an action.', 'She is doing yoga.');
dl('affirmative', 'cover', [{ who: 'Ms. Rosa', text: 'Start at the gate. Run ___ the cone.' }, { who: 'Sam', text: 'OK! I am running around it.' }], ['around', 'into', 'under'], 'Sam says it.', 'Run around the cone.');
dl('affirmative', 'prep-up', [{ who: 'Ms. Rosa', text: 'Now go ___ the ladder.' }, { who: 'Ana', text: 'I am climbing up!' }], ['up', 'under', 'past'], 'Ana says it.', 'Now go up the ladder.');
dl('negative', 's-sad', [{ who: 'Mia', text: 'Are you OK, Ana?' }, { who: 'Ana', text: "No, ___. My serve isn't very good." }], ["I'm not", "I don't", "you aren't"], "Ana talks about Ana → I'm not.", "No, I'm not. My serve isn't very good.");
dl('affirmative', 's-help', [{ who: 'Ana', text: 'I want to quit.' }, { who: 'Mia', text: "Don't give up! I can ___ you." }], ['help', 'push', 'quit'], 'Mia is a good friend.', "Don't give up! I can help you.");
dl('affirmative', 's-coach', [{ who: 'Leo', text: 'I missed the ball. I am disappointed.' }, { who: 'Coach', text: "That's OK. Let's ___ more." }], ['practice', 'sleep', 'cry'], 'What makes you better?', "That's OK. Let's practice more.");

// =================== H. Mini reading 16 (our own texts, 30–45 words) ===================
const PASSAGES = {
  'rd-p1': { title: 'Move and Feel Good', image: 'w-energy', text: 'Sam is running and jumping in the park. He feels great! Moving gives him energy. After the run, he is relaxed and happy. His body is growing too. Move every day and stay active!' },
  'rd-p2': { title: 'Heart and Lungs', image: 'w-breathe', text: "Look at Mia! She is riding her bike up a hill. Her heart is beating fast and she is breathing hard. Her heart and lungs are getting stronger, so she doesn't get tired quickly." },
  'rd-p3': { title: 'Bones and Muscles', image: 'b-muscles', text: 'Leo is at karate class. First, he is stretching his muscles. Then he is jumping and kicking. With strong muscles, he can push and pull. His bones are like a frame for his body. Exercise makes them strong.' },
  'rd-p4': { title: 'Race Day', image: 'cover', text: "It's race day! Ana starts at the gate. She runs around the cone and climbs through the hoop. Next, she goes up the ladder and across the bridge. She slides down the slide. Then she jumps over the hurdles." }
};
const rd = (passage, target, prompt, [right, ...wrong], hint, explain, subtarget) => add('rd', { type: 'reading', passage, target, ...(subtarget ? { subtarget } : {}), level: 1, prompt, ...place(right, wrong), hint, explain });
rd('rd-p1', 'question', 'Where is Sam running?', ['In the park.', 'On the track.'], 'Read the first sentence.', 'Sam is running in the park.', 'wh');
rd('rd-p1', 'question', 'What gives Sam energy?', ['Moving.', 'Sleeping.'], 'Read the third sentence.', 'Moving gives him energy.', 'wh');
rd('rd-p1', 'question', 'How does Sam feel after the run?', ['Relaxed and happy.', 'Sad and tired.'], 'Read the fourth sentence.', 'He is relaxed and happy.', 'wh');
rd('rd-p1', 'negative', 'True or false? Sam feels bad.', ['False', 'True'], 'Read: He feels great!', 'False. He feels great!');
rd('rd-p2', 'question', 'What is Mia riding?', ['Her bike.', 'A horse.'], 'Read the second sentence.', 'She is riding her bike.', 'wh');
rd('rd-p2', 'question', 'Where is Mia riding?', ['Up a hill.', 'Into a pool.'], 'Read the second sentence.', 'She is riding up a hill.', 'wh');
rd('rd-p2', 'question', 'What is beating fast?', ['Her heart.', 'Her bones.'], 'Read the third sentence.', 'Her heart is beating fast.', 'wh');
rd('rd-p2', 'negative', "True or false? Mia gets tired quickly.", ['False', 'True'], "Read: she doesn't get tired quickly.", "False. She doesn't get tired quickly.");
rd('rd-p3', 'question', 'Where is Leo?', ['At karate class.', 'At the pool.'], 'Read the first sentence.', 'Leo is at karate class.', 'wh');
rd('rd-p3', 'question', 'What is Leo doing first?', ['He is stretching his muscles.', 'He is jumping.'], 'Find First.', 'First, he is stretching his muscles.', 'wh');
rd('rd-p3', 'question', 'What is like a frame for his body?', ['His bones.', 'His muscles.'], 'Read the fifth sentence.', 'His bones are like a frame for his body.', 'wh');
rd('rd-p3', 'question', 'What makes muscles and bones strong?', ['Exercise.', 'Sleep.'], 'Read the last sentence.', 'Exercise makes them strong.', 'wh');
rd('rd-p4', 'question', 'Where does Ana start?', ['At the gate.', 'At the bridge.'], 'Read the second sentence.', 'Ana starts at the gate.', 'wh');
rd('rd-p4', 'question', 'How does she pass the cone?', ['She runs around it.', 'She crawls under it.'], 'Read the third sentence.', 'She runs around the cone.', 'wh');
rd('rd-p4', 'question', 'Where does she go after the hoop?', ['Up the ladder.', 'Into the sandbox.'], 'Find Next.', 'She goes up the ladder.', 'wh');
rd('rd-p4', 'affirmative', 'True or false? Ana jumps over the hurdles.', ['True', 'False'], 'Read the last sentence.', 'True. She jumps over the hurdles.');

// =================== I. Moving words (30) ===================
MOVE.forEach(([image, start, prep, end, wrongs]) => {
  add('mv', { bank: 'moving', type: 'mcq', target: 'vocabulary', level: 1, image, prompt: `Look. ${start} ___ ${end}.`, ...place(prep, wrongs), hint: 'Look at the picture.', explain: `${start} ${prep} ${end}.` });
});
MOVE.forEach(([image, start, prep, end]) => {
  const name = start.split(' ')[0];
  const verbIng = start.split(' ').slice(2).join(' ');
  const pronounIs = ['Mia', 'Ana'].includes(name) ? 'She' : 'He';
  const others = MOVE.filter((m) => m[2] !== prep);
  const i = MOVE.findIndex((m) => m[2] === prep);
  const a = `${prep.charAt(0).toUpperCase()}${prep.slice(1)} ${end}.`;
  const wrong = [others[(i + 2) % 10], others[(i + 6) % 10]].map((m) => `${m[2].charAt(0).toUpperCase()}${m[2].slice(1)} ${m[3]}.`);
  add('mv', { bank: 'moving', type: 'mcq', target: 'question', level: 1, image, prompt: `Where is ${name} ${verbIng}?`, ...place(a, wrong), hint: 'Look at the picture.', explain: `${pronounIs} is ${verbIng} ${prep} ${end}.` });
});
[
  ['prep-up', 'The opposite of up is ___.', ['down', 'past'], 'up ↑ down ↓.', 'The opposite of up is down.'],
  ['prep-over', 'The opposite of over is ___.', ['under', 'around'], 'over ↔ under.', 'The opposite of over is under.'],
  ['prep-into', 'The opposite of into is ___.', ['out of', 'between'], 'into ↔ out of.', 'The opposite of into is out of.'],
  ['prep-between', 'There is a tree on each side. She is ___ the trees.', ['between', 'over'], 'One on each side.', 'She is between the trees.'],
  ['prep-across', 'He is walking to the other side of the street. He is walking ___ the street.', ['across', 'under'], 'To the other side.', 'He is walking across the street.'],
  ['prep-past', 'She doesn\'t stop at the school. She is riding ___ the school.', ['past', 'into'], 'She doesn\'t stop.', 'She is riding past the school.'],
  ['cover', 'Which one is a direction?', ['Run around the cone.', 'Sam runs around the cone.'], 'A direction has no who.', 'Run around the cone.'],
  ['cover', 'Which one is a direction?', ['Jump over the hurdles.', 'Leo is jumping over the hurdles.'], 'A direction has no who.', 'Jump over the hurdles.']
].forEach(([image, prompt, [r, ...wr], hint, explain]) => add('mv', { bank: 'moving', type: 'mcq', target: 'mixed', level: 2, image, prompt, ...place(r, wr), hint, explain }));

// =================== J. My body and the reading words (24) ===================
const BODY = [['heart', 'b-heart'], ['lungs', 'b-lungs'], ['brain', 'b-brain'], ['bones', 'b-bones'], ['muscles', 'b-muscles']];
BODY.forEach(([word, image], i) => {
  const o = BODY.map((b) => b[0]).filter((x) => x !== word);
  add('bd', { bank: 'body', type: 'mcq', target: 'vocabulary', level: 1, image, prompt: 'Look. What is it?', ...place(word, [o[i % 4], o[(i + 2) % 4]]), hint: 'Look at the picture.', explain: `${word.charAt(0).toUpperCase()}${word.slice(1)}.` });
});
[
  ['w-energy', 'Mia is full of ___.', ['energy', 'bones', 'water'], 'She is jumping high.', 'Mia is full of energy.'],
  ['w-relaxed', 'Ana is ___ under the tree.', ['relaxed', 'tired', 'running'], 'She is calm and happy.', 'Ana is relaxed under the tree.'],
  ['w-tired', 'Leo is ___ after the race.', ['tired', 'strong', 'running'], 'He is sitting on a bench.', 'Leo is tired after the race.'],
  ['w-strong', 'Exercise makes my body ___.', ['strong', 'tired', 'small'], 'Look at Ana.', 'Exercise makes my body strong.'],
  ['w-stretch', 'Sam is ___ his muscles.', ['stretching', 'eating', 'passing'], 'His arms are up.', 'Sam is stretching his muscles.'],
  ['w-breathe', 'Mia is ___ hard after her run.', ['breathing', 'sleeping', 'writing'], 'Her lungs are working.', 'Mia is breathing hard after her run.'],
  ['w-push', 'Leo is ___ a big ball.', ['pushing', 'pulling', 'eating'], 'His hands are on the ball.', 'Leo is pushing a big ball.'],
  ['w-pull', 'Ana is ___ a wagon.', ['pulling', 'pushing', 'riding'], 'She has a rope.', 'Ana is pulling a wagon.'],
  ['w-plan', 'Mia is writing an ___ plan.', ['exercise', 'apple', 'evening'], 'A plan for sport.', 'Mia is writing an exercise plan.'],
  ['w-break', 'The children are having a short ___.', ['break', 'bone', 'bridge'], 'They are resting.', 'The children are having a short break.'],
  ['b-heart', 'When I run, my heart beats ___.', ['faster', 'slower'], 'Think about running.', 'When I run, my heart beats faster.'],
  ['b-bones', 'My bones ___ up my body.', ['hold', 'run'], 'They are like a frame.', 'My bones hold up my body.'],
  ['w-stretch', 'Stretch before and after ___.', ['sport', 'bones'], 'Sam is getting ready.', 'Stretch before and after sport.'],
  ['w-plan', 'Move your body for one ___ every day.', ['hour', 'bone'], 'A long time, every day.', 'Move your body for one hour every day.'],
  ['a-stairs', 'Leo is taking the ___.', ['stairs', 'bench'], 'Look at his feet.', 'Leo is taking the stairs.'],
  ['a-video', 'Mia is following an exercise ___.', ['video', 'bridge'], 'Look at the TV.', 'Mia is following an exercise video.'],
  ['a-games', 'Sam is playing video ___.', ['games', 'trees'], 'Look at his hands.', 'Sam is playing video games.'],
  ['walk-to-school', 'Leo is walking ___ school.', ['to', 'over'], 'walk to school.', 'Leo is walking to school.'],
  ['dance', 'Mia and Ana are ___.', ['dancing', 'sleeping'], 'Look at the picture.', 'Mia and Ana are dancing.']
].forEach(([image, prompt, [r, ...wr], hint, explain]) => add('bd', { bank: 'body', type: 'mcq', target: 'vocabulary', level: 1, image, prompt, ...place(r, wr), hint, explain }));

// =================== K. Book words: sports and activities (30) ===================
const ACT = [
  ['act-gymnastics', 'Mia', 'doing', 'gymnastics', ['playing', 'going']], ['sp-bat', 'Leo', 'playing', 'baseball', ['doing', 'going']],
  ['act-karate', 'Leo', 'doing', 'karate', ['playing', 'going']], ['act-skating', 'Sam', 'going', 'skating', ['doing', 'playing']],
  ['sp-pool', 'Ana', 'going', 'swimming', ['doing', 'playing']], ['act-tag', 'The children', 'playing', 'tag', ['doing', 'going']],
  ['a-bowling', 'Sam', 'going', 'bowling', ['doing', 'playing']], ['sp-racket', 'Mia', 'playing', 'tennis', ['doing', 'going']],
  ['a-yoga', 'Ana', 'doing', 'yoga', ['playing', 'going']]
];
ACT.forEach(([image, who, ing, what, wrongs]) => {
  const be = who === 'The children' ? 'are' : 'is';
  add('ac', { bank: 'activities', type: 'mcq', target: 'vocabulary', level: 1, image, prompt: `${who} ${be} ___ ${what}.`, ...place(ing, wrongs), hint: `${ing.replace('ing', '').replace('do', 'do').replace('go', 'go').replace('play', 'play')} ${what}.`, explain: `${who} ${be} ${ing} ${what}.` });
});
[
  ['act-gymnastics', 'What is Mia doing?', ['She is doing gymnastics.', 'She is playing tag.', 'She is going bowling.']],
  ['sp-bat', 'What is Leo playing?', ['He is playing baseball.', 'He is playing tennis.', 'He is playing tag.']],
  ['act-bounce', 'What is Ana bouncing?', ['A ball.', 'A baton.', 'A racket.']],
  ['act-karate', 'What is Leo doing?', ['He is doing karate.', 'He is doing yoga.', 'He is going skating.']],
  ['v-jump', 'What is Ana doing?', ['She is jumping rope.', 'She is riding a bike.', 'She is doing yoga.']],
  ['act-skating', 'What is Sam doing?', ['He is going skating.', 'He is going swimming.', 'He is going bowling.']],
  ['ride-a-bike', 'What is Ana riding?', ['A bike.', 'A wagon.', 'A slide.']],
  ['sp-pool', 'Where is Ana swimming?', ['In the pool.', 'On the track.', 'In the gym.']],
  ['act-tag', 'What are the children playing?', ['They are playing tag.', 'They are playing tennis.', 'They are doing karate.']],
  ['sp-field', 'What are Mia and Sam running?', ['A race.', 'A hoop.', 'A bridge.']],
  ['a-bowling', 'Who is going bowling?', ['Sam is.', 'Ana is.', 'Leo is.']],
  ['a-yoga', 'Where is Ana doing yoga?', ['In the garden.', 'In the pool.', 'At school.']],
  ['r-three', 'What are Sam and Leo running?', ['A three-legged race.', 'A relay race.', 'A swimming race.']],
  ['r-relay', 'What is Mia passing to Sam?', ['A baton.', 'A ball.', 'A racket.']],
  ['r-relay', 'Where is the relay race?', ['On the track.', 'In a pool.', 'In a sandbox.']],
  ['sp-racket', 'What do you need for tennis?', ['A racket and a ball.', 'A baton.', 'A rope.']],
  ['sp-bat', 'What do you need for baseball?', ['A bat and a ball.', 'A hoop.', 'A net.']],
  ['st-cheer', 'What are Mia and Ana doing?', ['They are cheering.', 'They are swimming.', 'They are sleeping.']],
  ['st-highfive', 'Why do we play sports?', ['Because they are fun and good for us.', 'Because we are tired.', 'In the park.']],
  ['r-tie', 'What are Mia and Ana tying together?', ['Their legs.', 'Their heads.', 'Their bats.']],
  ['r-swim', 'Who is cheering?', ['Mia is.', 'Sam is.', 'Leo is.']]
].forEach(([image, prompt, [r, ...wr]]) => add('ac', { bank: 'activities', type: 'mcq', target: 'question', level: 1, image, prompt, ...place(r, wr), hint: 'Look at the picture.', explain: r }));

// =================== L. Bounce back (12) ===================
[
  ['s-sad', 'Ana looks sad. She is ___.', ['disappointed', 'relaxed'], 'Her serve is not very good.', 'She is disappointed.'],
  ['s-help', 'Mia is ___ her friend.', ['helping', 'pushing'], 'She is showing Ana what to do.', 'Mia is helping her friend.'],
  ['s-miss', 'Leo can\'t catch the ball. He is ___ it.', ['missing', 'winning'], 'The ball is falling.', 'He is missing it.'],
  ['s-try', 'Sam falls. He is getting up to try ___.', ['again', 'never'], 'He does not stop.', 'He is getting up to try again.'],
  ['s-coach', 'Leo is asking his ___ for help.', ['coach', 'cone'], 'She helps the team.', 'Leo is asking his coach for help.'],
  ['s-sad', 'Which words help you bounce back?', ['I can practice more.', 'I want to quit.'], 'Keep trying.', 'I can practice more.'],
  ['s-miss', 'Which words help you bounce back?', ['Sometimes we win and sometimes we lose.', "I'm not good at anything."], 'Stay positive.', 'Sometimes we win and sometimes we lose.'],
  ['s-coach', 'Which words help you bounce back?', ['I can ask my coach for help.', "I don't want to play."], 'Ask for help.', 'I can ask my coach for help.'],
  ['s-try', 'Why is Sam getting up?', ['Because he wants to try again.', 'Because he wants to quit.'], 'Look at his face.', 'Because he wants to try again.'],
  ['s-help', 'How does Ana feel now?', ['She feels better.', 'She feels worse.'], 'She is smiling.', 'She feels better.'],
  ['w-strong', 'Problems are part of life. Stay ___!', ['positive', 'tired'], 'Think good thoughts.', 'Stay positive!'],
  ['teacher-class', 'Your friend is talking. What do you do?', ['Look at your friend and listen.', 'Play a game and talk.'], 'Pay attention.', 'Look at your friend and listen.']
].forEach(([image, prompt, [r, ...wr], hint, explain]) => add('bb', { bank: 'bounce', type: 'mcq', target: 'mixed', level: 1, image, prompt, ...place(r, wr), hint, explain }));

const count = (fn) => out.filter(fn).length;
export const BANKS = [
  { id: 'mcq', letter: 'A', title: 'Choose', instruction: 'Choose.', description: 'Choose the question word or the answer.', expected: count((q) => q.type === 'mcq' && !q.bank) },
  { id: 'jumbled', letter: 'B', title: 'Make a sentence', instruction: 'Make a sentence.', description: 'Put the words in order.', expected: count((q) => q.type === 'jumbled') },
  { id: 'fill', letter: 'C', title: 'Fill in', instruction: 'Fill in the gap.', description: 'Write or choose the missing word.', expected: count((q) => q.type === 'fill') },
  { id: 'change', letter: 'D', title: 'Change it', instruction: 'Change the sentence.', description: 'Make a question with Who, What, Where …', expected: count((q) => q.type === 'change') },
  { id: 'fix', letter: 'E', title: 'Fix the mistake', instruction: 'Find the mistake. Fix it.', description: 'One word is wrong. Find it and fix it.', expected: count((q) => q.type === 'fix') },
  { id: 'decide', letter: 'F', title: 'Look and decide', instruction: 'Look. Read. True or false?', description: 'Look at the clue. Is it true or false?', expected: count((q) => q.type === 'decide') },
  { id: 'dialogue', letter: 'G', title: 'Dialogues', instruction: 'Complete the dialogue.', description: 'Read the short talk. Choose the answer.', expected: count((q) => q.type === 'dialogue') },
  { id: 'reading', letter: 'H', title: 'Mini reading', instruction: 'Read. Answer.', description: 'Read a short text. Answer 4 questions.', expected: count((q) => q.type === 'reading') },
  { id: 'moving', letter: 'I', title: 'Moving words', instruction: 'Look and choose.', description: 'around, through, over, under, up, down, across, past, into, out of, between.', expected: count((q) => q.bank === 'moving') },
  { id: 'body', letter: 'J', title: 'My body and strong words', instruction: 'Look and choose.', description: 'heart, lungs, brain, bones, muscles, energy, stretch, push, pull …', expected: count((q) => q.bank === 'body') },
  { id: 'activities', letter: 'K', title: 'Sports and activities', instruction: 'Look and choose.', description: 'do gymnastics, play tag, go bowling, a relay race …', expected: count((q) => q.bank === 'activities') },
  { id: 'bounce', letter: 'L', title: 'Bounce back!', instruction: 'Look and choose.', description: 'keep trying, ask for help, stay positive.', expected: count((q) => q.bank === 'bounce') }
];
export const QUESTIONS = out;
export { CARDS, PASSAGES };
