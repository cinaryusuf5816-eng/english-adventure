// The regular A–H activities and four Unit 4 topic banks.
import { SUBJECTS, SCENES, WORDS, EXTRA_WORD_SETS } from './week5-data.mjs';
import { buildSentence } from '../../site/js/core/school.js';

const questions = [];
const counters = new Map();
function add(bank, question) {
  const next = (counters.get(bank) || 0) + 1;
  counters.set(bank, next);
  questions.push({ id: `w5-${bank}-${String(next).padStart(3, '0')}`, v: 1, level: 1, ...(bank === question.type ? {} : { bank }), ...question });
}
const letters = 'abcd';
const options = ([right, ...others]) => {
  const index = questions.length % (others.length + 1);
  others.splice(index, 0, right);
  return { options: others, answer: letters[index] };
};
const mc = (bank, [image, prompt, choices, hint, explain = choices[0], target = 'vocabulary']) =>
  add(bank, { type: 'mcq', image, target, prompt, ...options(choices), hint, explain });

const subject = (id) => SUBJECTS.find((item) => item.id === id);
const scene = (id) => SCENES.find(({ verb }) => verb.id === id);
const sentence = (who, action, form) => buildSentence(subject(who), scene(action).verb, form).text;
const targetOf = (form) => form.endsWith('question') ? 'question' : form.endsWith('negative') ? 'negative' : 'affirmative';

const CAN = [
  ['run', 'Leo practises running and is very fast.', ['Leo can run fast.', 'Leo cans run fast.', 'Leo can runs fast.'], 'Use can + run.', 'affirmative'],
  ['swim', 'Leo has never learned to swim.', ['Leo can’t swim yet.', 'Leo don’t can swim yet.', 'Leo can’t swims yet.'], 'Can’t + swim.', 'negative'],
  ['read', 'Mia knows all the words in this story.', ['Mia can read it.', 'Mia can reads it.', 'Mia can to read it.'], 'Can + base verb.', 'affirmative'],
  ['encourage', 'Ana has practised this dance. She knows every step.', ['Ana can dance.', 'Ana cans dance.', 'Ana can dancing.'], 'Can does not change with she.', 'affirmative'],
  ['auditorium', 'Ask if Mia is able to give a speech.', ['Can Mia give a speech?', 'Can Mia gives a speech?', 'Does Mia can give a speech?'], 'Start with Can.', 'question'],
  ['sing', 'Ask your friends if they can sing.', ['Can you sing?', 'Do you can sing?', 'Can you sings?'], 'Can + you + sing.', 'question'],
  ['share', 'Ask if Leo is able to read this story.', ['Can Leo read this story?', 'Can Leo reads this story?', 'Leo can reads this story?'], 'Can goes before Leo.', 'question'],
  ['plan', 'Mia knows how to make her own study plan.', ['Mia can make a study plan.', 'Mia can makes a study plan.', 'Mia is can make a study plan.'], 'Use can + make.', 'affirmative'],
  ['wait-line', 'Sam is in a seat on a moving bus. The rule says “Stay seated.”', ['Sam can’t stand up now.', 'Sam can’t stands up now.', 'Sam doesn’t can stand up now.'], 'Can’t here means the rule says no.', 'negative'],
  ['hall', 'The sign says “Walk in the hall.”', ['We can’t run in the hall.', 'We can’t to run in the hall.', 'We don’t can run in the hall.'], 'Use can’t + run.', 'negative'],
  ['school-day', 'Ms. Rosa gives the class permission to talk in pairs.', ['The children can talk in pairs.', 'The children cans talk in pairs.', 'The children can talks in pairs.'], 'Use can + talk.', 'affirmative'],
  ['field-trip', 'The teacher says everyone must stay together.', ['You can’t leave the group.', 'You can’t leaves the group.', 'You can’t leaving the group.'], 'Can’t + leave.', 'negative']
];
const HAVE = [
  ['uniform', 'The school rule says Leo must wear a uniform.', ['Leo has to wear a uniform.', 'Leo have to wear a uniform.', 'Leo has to wears a uniform.'], 'Leo = he. Say has to.', 'affirmative'],
  ['wait-line', 'The bus driver says the children must wait in line.', ['They have to wait in line.', 'They has to wait in line.', 'They have to waits in line.'], 'They + have to.', 'affirmative'],
  ['quiz', 'Ana needs a pencil for the quiz.', ['Ana has to bring a pencil.', 'Ana have to bring a pencil.', 'Ana has to brings a pencil.'], 'Ana = she.', 'affirmative'],
  ['check-out', 'Taking a book home? The rule says pupils must show a library card.', ['We have to show our cards.', 'We has to show our cards.', 'We have to shows our cards.'], 'Use have to with we.', 'affirmative'],
  ['clothes-tie', 'Sam can choose whether to wear a tie.', ['Sam doesn’t have to wear a tie.', 'Sam doesn’t has to wear a tie.', 'Sam don’t have to wear a tie.'], 'After doesn’t, use have to.', 'negative'],
  ['forest-school', 'Gloves are optional at the forest school.', ['We don’t have to bring gloves.', 'We doesn’t have to bring gloves.', 'We don’t has to bring gloves.'], 'Optional means you can choose.', 'negative'],
  ['read', 'Mia can read at home or at school. Reading at home is optional.', ['Mia doesn’t have to read at home.', 'Mia doesn’t have to reads at home.', 'Mia don’t have to read at home.'], 'Mia = she. Say doesn’t have to.', 'negative'],
  ['form', 'Ask if a signed form is required for your group.', ['Do we have to bring a signed form?', 'Do we has to bring a signed form?', 'Does we have to bring a signed form?'], 'Do + we + have to.', 'question'],
  ['clothes-shoes', 'Ask if the school requires Leo to wear black shoes.', ['Does Leo have to wear black shoes?', 'Does Leo has to wear black shoes?', 'Do Leo have to wear black shoes?'], 'Does + Leo + have to.', 'question'],
  ['boat-school', 'Ask the students if they need to come by boat.', ['Do you have to come by boat?', 'Do you has to come by boat?', 'Does you have to come by boat?'], 'Do goes before you.', 'question'],
  ['field-trip', 'Ask if Ana needs to bring a notebook.', ['Does Ana have to bring a notebook?', 'Does Ana have to brings a notebook?', 'Do Ana have to bring a notebook?'], 'Use the base form after have to.', 'question'],
  ['clean-up', 'The rule says Ana must leave her desk clean.', ['Ana has to clean up her desk.', 'Ana have to clean up her desk.', 'Ana has to cleans up her desk.'], 'Ana = she. Use has to + clean up.', 'affirmative']
];
for (const [image, prompt, choices, hint, target] of [...CAN, ...HAVE]) {
  mc('mcq', [image, `${prompt} Choose the correct sentence.`, choices, hint, choices[0], target]);
}

const CLASSIFY = [
  ['swim', 'Leo can swim two lengths without help.', 'Ability'], ['read', 'Mia can read difficult books.', 'Ability'],
  ['run', 'Leo can run very fast.', 'Ability'], ['auditorium', 'Can Mia speak in front of the whole class? She has practised.', 'Ability'],
  ['check-out', 'Can I take this book home, please?', 'Permission'], ['sit-down', 'Can we sit here, please?', 'Permission'],
  ['raise-hand', 'Can I ask a question now?', 'Permission'], ['cafeteria', 'Can I have some more rice, please?', 'Permission'],
  ['lend', 'Can you lend me a ruler, please?', 'Request'], ['clean-up', 'Can you help me clean my desk?', 'Request'],
  ['help-books', 'Can you carry this book for me, please?', 'Request'], ['hall', 'Can you please show me where the gym is?', 'Request']
];
const uses = { Ability: 'Ability means what you are able to do.', Permission: 'Permission means asking if you may do something.', Request: 'A request asks someone else to do something.' };
for (const [image, text, right] of CLASSIFY) {
  mc('mcq', [image, `What is the use of can? “${text}”`, [right, ...Object.keys(uses).filter((x) => x !== right)], 'Who does the action? Is it about skill, permission or help?', uses[right], 'mixed']);
}

const RULES = [
  ['uniform', 'Leo must wear a uniform each morning.', 'Required'], ['form', 'The teacher needs everyone’s signed form.', 'Required'],
  ['wait-line', 'Everyone must sit while the bus is moving.', 'Required'], ['field-trip', 'Everyone must stay with the group at the zoo.', 'Required'],
  ['casual-clothes', 'Wear jeans if you want to.', 'Optional'], ['quiz', 'You can bring a spare pencil, but we have extras.', 'Optional'],
  ['clothes-jacket', 'You can bring a jacket, but you don’t have to.', 'Optional'], ['auditorium', 'Mia can sing, read a poem or just watch.', 'Optional'],
  ['hall', 'You can’t run in the hall.', 'Not allowed'], ['check-out', 'You can’t take a library book home without checking it out.', 'Not allowed'],
  ['wait-line', 'You can’t stand up on the moving bus.', 'Not allowed'], ['cafeteria', 'This rule says you can’t take food out of the cafeteria.', 'Not allowed']
];
const rules = { Required: 'You have to do it.', Optional: 'You don’t have to do it. You can choose.', 'Not allowed': 'You can’t do it.' };
for (const [image, text, right] of RULES) {
  mc('mcq', [image, `What kind of rule is this? “${text}”`, [right, ...Object.keys(rules).filter((x) => x !== right)], 'Do you need to do it, can you choose, or does the rule say no?', rules[right], 'mixed']);
}

const ORDERS = [
  ['positive', ['mia', 'lend'], ['sam', 'stand-up'], ['ana', 'raise-hand'], ['they', 'share'], ['mia', 'read'], ['leo', 'run']],
  ['negative', ['leo', 'swim'], ['sam', 'stand-up'], ['ana', 'quiz'], ['they', 'cafeteria'], ['mia', 'check-out'], ['leo', 'auditorium']],
  ['question', ['I', 'check-out'], ['we', 'sit-down'], ['you', 'help-books'], ['ana', 'encourage'], ['mia', 'auditorium'], ['you', 'swim']],
  ['have-positive', ['leo', 'uniform'], ['they', 'wait-line'], ['ana', 'quiz'], ['we', 'field-trip'], ['mia', 'plan'], ['you', 'clean-up']],
  ['have-negative', ['sam', 'uniform'], ['we', 'read'], ['ana', 'quiz'], ['they', 'boat-school'], ['mia', 'auditorium'], ['leo', 'cafeteria']],
  ['have-question', ['leo', 'uniform'], ['we', 'wait-line'], ['ana', 'raise-hand'], ['you', 'check-out'], ['mia', 'read'], ['they', 'field-trip']]
];
for (const [form, ...pairs] of ORDERS) {
  for (const [who, image] of pairs) {
    const text = sentence(who, image, form);
    const plain = text.slice(0, -1);
    add('jumbled', { type: 'jumbled', target: targetOf(form), image, tokens: plain.split(' '), end: text.at(-1), answers: [plain], hint: `Start with ${plain.split(' ')[0]}.`, explain: text });
  }
}

const FILL = [
  ['can', ['can', 'can’t'], 'Able to do it or allowed to do it.', 'affirmative', [
    ['run', 'Leo is fast. He ___ run a lap without stopping.'], ['read', 'Mia knows the words. She ___ read this story.'],
    ['share', 'The teacher says it is OK. We ___ share a book.'], ['check-out', 'Mia has her card. The librarian says she ___ check out a book.'],
    ['encourage', 'Ana knows every step. She ___ dance on stage.'], ['cafeteria', 'It is lunchtime. We ___ eat in the cafeteria now.']]],
  ['can’t', ['can', 'can’t'], 'The rule says no, or this person is unable to do it.', 'negative', [
    ['hall', 'The rule says walk. We ___ run in the hall.'], ['wait-line', 'The bus is moving. You ___ stand up.'],
    ['swim', 'Leo has never learned to swim. He ___ swim yet.'], ['quiz', 'We work alone in a quiz. We ___ share answers.'],
    ['check-out', 'The library is closed today. You ___ get a book.'], ['field-trip', 'The zoo sign says “Stay with your group.” We ___ leave it.']]],
  ['have to', ['have to', 'has to', 'don’t have to'], 'Use have to with I, you, we and they.', 'affirmative', [
    ['uniform', 'It is a school rule. We ___ wear uniforms.'], ['field-trip', 'The teacher says we must stay together. We ___ stay with her.'],
    ['form', 'I need a signed form. I ___ bring it in.'], ['wait-line', 'The bus driver says everyone must line up. You ___ wait in line.']]],
  ['has to', ['have to', 'has to', 'doesn’t have to'], 'Use has to with he, she and it.', 'affirmative', [
    ['quiz', 'Ana must take the quiz. She ___ finish it before lunch.'], ['uniform', 'A uniform is required. Leo ___ wear one.'],
    ['clean-up', 'The teacher says Ana must wipe the spill. She ___ clean her desk.'], ['check-out', 'Mia must use her card. She ___ show it to the librarian.']]],
  ['don’t have to', ['don’t have to', 'doesn’t have to', 'have to'], 'It is optional. The subject is we or they.', 'negative', [
    ['clothes-socks', 'Any color is fine. We ___ wear white socks.'], ['boat-school', 'The boat comes to the students. They ___ take a bus.'],
    ['field-trip', 'The teacher has extra pencils. We ___ bring our own.']]],
  ['doesn’t have to', ['doesn’t have to', 'don’t have to', 'has to'], 'Use doesn’t have to for one person when an action is optional.', 'negative', [
    ['casual-clothes', 'A uniform is optional. Sam ___ wear one.'], ['auditorium', 'Mia can watch the show. She ___ give a speech.'],
    ['clothes-tie', 'Ana may wear a tie if she wants. She ___ wear one.']]],
  ['Do', ['Do', 'Does', 'Can'], 'Use Do with I, we, you or they in a have to question.', 'question', [
    ['form', '___ we have to bring the form on Friday?'], ['wait-line', '___ they have to wait here?']]],
  ['Does', ['Do', 'Does', 'Can'], 'Use Does with one person in a have to question.', 'question', [
    ['uniform', '___ Leo have to wear a tie?'], ['quiz', '___ Ana have to use a pencil?']]],
  ['Can', ['Can', 'Do', 'Does'], 'Start a permission or request question with Can.', 'question', [
    ['lend', '___ you lend me an eraser? Yes, I can.'], ['check-out', '___ I check out this book? Yes, you can.']]],
  ['and', ['and', 'but', 'or'], 'Both things are needed.', 'mixed', [
    ['cover', 'Bring both things: your backpack ___ your pencil case.'], ['school-day', 'We do both things: listen ___ take notes.']]],
  ['but', ['and', 'but', 'or'], 'Use but to show a contrast.', 'mixed', [
    ['hall', 'You can walk here, ___ you can’t run here.'], ['casual-clothes', 'We can wear jeans today, ___ not on photo day.']]],
  ['or', ['and', 'but', 'or'], 'Use or for a choice or after don’t to list two things to avoid.', 'mixed', [
    ['check-out', 'Pick just one: a story ___ a comic.'], ['wait-line', 'Don’t push ___ shove while you wait.']]]
];
for (const [right, pool, hint, target, items] of FILL) {
  for (const [image, text] of items) add('fill', { type: 'fill', image, text, target, pool, answers: [right], hint, explain: text.replace('___', right) });
}

const CHANGES = [
  ['positive', 'negative', 'Make it negative with can’t.', 'Use can’t + the same base verb.', [['leo', 'swim'], ['sam', 'stand-up'], ['they', 'hall'], ['mia', 'check-out'], ['ana', 'encourage']]],
  ['positive', 'question', 'Ask a question with Can.', 'Put Can first. Keep the base verb.', [['mia', 'lend'], ['you', 'read'], ['ana', 'raise-hand'], ['we', 'sit-down'], ['leo', 'run']]],
  ['have-positive', 'have-negative', 'Make it optional with don’t or doesn’t have to.', 'After don’t or doesn’t, use have to.', [['leo', 'uniform'], ['they', 'wait-line'], ['ana', 'quiz'], ['we', 'field-trip'], ['mia', 'plan']]],
  ['have-positive', 'have-question', 'Ask whether this is required. Start with Do or Does.', 'Do / Does + who + have to.', [['mia', 'check-out'], ['sam', 'uniform'], ['we', 'clean-up'], ['they', 'wait-line'], ['ana', 'raise-hand']]]
];
for (const [from, to, cue, hint, pairs] of CHANGES) {
  for (const [who, image] of pairs) {
    const answer = sentence(who, image, to);
    add('change', { type: 'change', task: targetOf(to), target: targetOf(to), level: 2, image, from: sentence(who, image, from), cue, answers: [answer], hint, explain: answer });
  }
}

const FIXES = [
  ['run', 'Leo can runs fast.', 2, ['run', 'running', 'ran'], 'Can + run.', 'affirmative'],
  ['read', 'Mia cans read a long story.', 1, ['can', 'canning', 'can to'], 'Can stays the same with she.', 'affirmative'],
  ['share', 'We can sharing a book.', 2, ['share', 'shares', 'shared'], 'Use the base verb after can.', 'affirmative'],
  ['wait-line', 'The children cans wait here.', 2, ['can', 'can to', 'canning'], 'Can does not change.', 'affirmative'],
  ['hall', 'You can’t running in the hall.', 2, ['run', 'runs', 'ran'], 'Can’t + run.', 'negative'],
  ['stand-up', 'Sam can’t stands up now.', 2, ['stand', 'standing', 'stood'], 'Can’t + stand up.', 'negative'],
  ['swim', 'Can Leo swims fast?', 2, ['swim', 'swam', 'swimming'], 'Can + Leo + swim.', 'question'],
  ['auditorium', 'Can Mia gives a speech?', 2, ['give', 'gave', 'giving'], 'Use the base form give.', 'question'],
  ['check-out', 'Can I checks out this book?', 2, ['check', 'checking', 'checked'], 'Can I + check out.', 'question'],
  ['lend', 'Can you lends me a pencil?', 2, ['lend', 'lending', 'lent'], 'Can you + lend.', 'question'],
  ['uniform', 'Leo have to wear a uniform.', 1, ['has', 'having', 'haves'], 'Leo = he. Use has to.', 'affirmative'],
  ['quiz', 'We has to take a quiz.', 1, ['have', 'having', 'haves'], 'We + have to.', 'affirmative'],
  ['clean-up', 'Ana has to cleans up her desk.', 3, ['clean', 'cleaning', 'cleaned'], 'Use the base verb after has to.', 'affirmative'],
  ['clothes-tie', 'Sam doesn’t has to wear a tie.', 2, ['have', 'haves', 'having'], 'After doesn’t, use have to.', 'negative'],
  ['field-trip', 'We doesn’t have to bring lunch.', 1, ['don’t', 'not', 'has'], 'We + don’t.', 'negative'],
  ['uniform', 'Does Leo has to wear a uniform?', 2, ['have', 'haves', 'having'], 'Does + Leo + have to.', 'question'],
  ['form', 'Does we have to bring a form?', 0, ['Do', 'Didn’t', 'Has'], 'Use Do with we to ask about the rule now.', 'question'],
  ['clothes-shoes', 'Does Ana have to wears black shoes?', 4, ['wear', 'wearing', 'worn'], 'Have to + wear.', 'question']
];
for (const [image, text, wrong, choices, hint, target] of FIXES) {
  const words = text.split(' ');
  const { options: fixes, answer: fix } = options(choices);
  const explain = words.map((word, i) => i === wrong ? choices[0] + (word.match(/[.?!]$/)?.[0] || '') : word).join(' ');
  add('fix', { type: 'fix', level: 2, target, image, words, wrong, fixes, fix, hint, explain });
}

export const CARDS = {
  library: { title: 'Library rules', image: 'check-out', text: 'Our library opens at nine. You can check out two books. You have to show your card. You can read a comic at the library, but you can’t take one home.' },
  bus: { title: 'Before and on the bus', image: 'wait-line', text: 'Wait in line to get on the bus. You can choose any free seat. You have to stay seated while the bus is moving. You can’t eat on this bus.' },
  uniforms: { title: 'Photo day', image: 'uniform', text: 'Leo and Ana have to wear white shirts and black shoes for the photo. A tie is optional. They can bring a jacket, but they don’t have to wear it in the photo.' },
  trip: { title: 'Zoo trip checklist', image: 'field-trip', text: 'The trip is on Friday. Bring a signed form and a water bottle. Lunch is provided. Stay with your group and ask the guide before you take a picture.' },
  plan: { title: 'Mia’s study plan', image: 'plan', text: 'Mia wants to read one page by Friday. Leo will listen to her for five minutes every day. On Thursday, she will practise at the library.' }
};
const DECIDE = {
  library: [['The library opens at nine.', true, 'It opens at nine.'], ['You can check out three books.', false, 'You can check out two books.'], ['You have to show your card.', true, 'Showing your card is a rule.'], ['You can take a comic home.', false, 'You can read one there.']],
  bus: [['You can get on without waiting in line.', false, 'You have to wait in line first.'], ['You can choose any free seat.', true, 'The rule lets you choose.'], ['You can stand while the bus moves.', false, 'You have to stay seated.'], ['You can’t eat on this bus.', true, 'The last rule says you can’t eat.']],
  uniforms: [['They have to wear white shirts.', true, 'White shirts are required.'], ['They have to wear a tie.', false, 'A tie is optional.'], ['They can bring a jacket.', true, 'They can choose to bring one.'], ['They have to wear the jacket in the photo.', false, 'They can leave it off.']],
  trip: [['The trip is on Thursday.', false, 'The trip is on Friday.'], ['They have to bring a water bottle.', true, 'A water bottle is on the checklist.'], ['They have to bring their lunch.', false, 'Lunch is provided.'], ['They have to ask the guide before taking pictures.', true, 'Ask the guide first.']],
  plan: [['Mia wants to finish a page by Friday.', true, 'Her goal is to read one page by Friday.'], ['Leo will read the page for Mia.', false, 'Leo will listen as Mia reads.'], ['Mia will practise with Leo every day.', true, 'They will practise for five minutes each day.'], ['Mia will practise at the gym on Thursday.', false, 'She will practise at the library.']]
};
for (const [card, entries] of Object.entries(DECIDE)) {
  for (const [statement, answer, explain] of entries) add('decide', { type: 'decide', target: 'mixed', card, statement, answer, hint: 'Find the line in the card that gives you the answer.', explain: `${answer ? 'True' : 'False'}. ${explain}` });
}

const DIALOGUES = [
  ['lend', 'Sam', '___ me a pencil, please?', 'Mia', 'Of course!', ['Can you lend', 'Can I lend', 'Does you lend'], 'Sam asks Mia to do something.', 'question'],
  ['check-out', 'Mia', '___ take this book home, please?', 'Librarian', 'Yes, you can. Show me your card.', ['Can I', 'Can you', 'They can'], 'Mia is asking for permission for herself.', 'question'],
  ['help-books', 'Mia', 'Can I help you carry those books?', 'Leo', '___ I can’t carry them all.', ['Yes, please.', 'No, thank you.', 'I don’t have one.'], 'Leo wants the help.', 'affirmative'],
  ['clean-up', 'Ana', 'Can I help you wipe the desk?', 'Sam', '___ I’ve finished.', ['No, thank you.', 'Yes, please.', 'Can I help you?'], 'Sam has finished and declines politely.', 'negative'],
  ['cafeteria', 'Leo', '___ have some rice, please?', 'Worker', 'Sure. Here you are.', ['Can I', 'Can they', 'I can'], 'Leo is asking for himself.', 'question'],
  ['janitor', 'Ana', 'Can you help us clean this spill?', 'Janitor', '___ I have a mop.', ['Of course.', 'No, I can’t.', 'Thanks, I’m fine.'], 'The janitor agrees to help.', 'affirmative'],
  ['raise-hand', 'Ana', 'Can I ask another question?', 'Ms. Rosa', '___ Go ahead.', ['Yes, you can.', 'Yes, I can.', 'No, you can’t.'], 'The teacher gives Ana permission.', 'affirmative'],
  ['uniform', 'Sam', 'Does Leo have to wear a tie?', 'Ana', '___ Ties are required at his school.', ['Yes, he does.', 'Yes, he can.', 'No, he doesn’t.'], 'A rule is required. Answer with does.', 'affirmative'],
  ['casual-clothes', 'Leo', 'Do you have to wear a uniform at your school?', 'Sam', '___ Any clean clothes are fine.', ['No, I don’t.', 'No, I can’t.', 'Yes, I do.'], 'A uniform is optional at Sam’s school.', 'negative'],
  ['form', 'Mia', '___ bring a signed form?', 'Ms. Rosa', 'Yes, you do.', ['Do I have to', 'Can I', 'Does I have to'], 'Yes, you do answers Do I …?', 'question'],
  ['encourage', 'Ana', 'I can’t do this step yet.', 'Leo', '___ Let’s do it slowly.', ['Keep trying!', 'Stop trying!', 'No, thank you.'], 'Help Ana stay positive while she tries.', 'affirmative'],
  ['auditorium', 'Mia', 'Could you hear my speech?', 'Ana', '___ Your words were very clear.', ['Great job!', 'Can I leave?', 'I can’t lend you one.'], 'Ana gives positive feedback.', 'affirmative'],
  ['hall', 'Sam', 'Can we run here?', 'Ms. Rosa', '___ Walk in the hall, please.', ['No, you can’t.', 'No, we don’t.', 'Yes, we can.'], 'Walking is the rule.', 'negative'],
  ['swim', 'Mia', 'Can you swim in the deep pool?', 'Leo', '___ I’m still learning.', ['No, I can’t.', 'Yes, you can.', 'No, I don’t.'], 'Leo is not able to swim there yet.', 'negative'],
  ['help-books', 'Mia', 'Let me ___ you carry that atlas.', 'Leo', 'Thanks, Mia!', ['help', 'helps', 'helping'], 'Let me help you is an offer.', 'affirmative'],
  ['wait-line', 'Ana', '___ wait in line for the bus?', 'Ms. Rosa', 'Yes, you do.', ['Do we have to', 'Does we have to', 'We can'], 'The teacher answers a Do we …? question.', 'question']
];
for (const [image, who1, line1, who2, line2, choices, hint, target] of DIALOGUES) {
  add('dialogue', { type: 'dialogue', image, lines: [{ who: who1, text: line1 }, { who: who2, text: line2 }], ...options(choices), hint, target, explain: [line1, line2].join(' ').replace('___', choices[0]) });
}

export const PASSAGES = {
  'first-day': { title: 'Leo’s first day', image: 'help-books', text: 'On his first day, Leo carries three books. One falls in the hall. Mia picks it up and carries it for him. Then Leo asks where to eat. Mia shows him the cafeteria. Leo thanks her.' },
  'photo-day': { title: 'Two schools, two rules', image: 'uniform', text: 'Ana has to wear a white shirt and black shoes for her school photo. At Sam’s school, clothes can be any color. Sam wears a teal T-shirt and jeans. They both have to arrive before nine for the photo.' },
  'boat-school': { title: 'A classroom on the water', image: 'boat-school', text: 'A small school boat stops by the river each morning. The children have to wait for their teacher before they get on. They can read and write at little desks inside. After class, the boat takes them home.' },
  'forest-school': { title: 'A lesson under the trees', image: 'forest-school', text: 'Ana and Leo have lessons in a forest. Today they draw leaves in their notebooks. It rains and the ground gets muddy. They have to wear boots, but they don’t have to stay indoors. They sit on a dry bench.' },
  'tree-school': { title: 'A tree in the classroom', image: 'tree-school', text: 'There is a tree in the middle of this classroom. It grows through a hole in the roof. Students read under its branches. Outside, there is a big slide. Children can use it after class, if their teacher says yes.' },
  'zoo-trip': { title: 'Trip to the zoo', image: 'field-trip', text: 'The class visits the zoo on Friday. Everyone has to bring a signed form and a water bottle. The teacher has extra notebooks, so bringing one is optional. At the zoo, the children can ask the guide questions.' }
};
const READ = {
  'first-day': [
    ['How many books does Leo carry?', ['Three.', 'Two.', 'Four.'], 'Read the first sentence.'],
    ['Where does the book fall?', ['In the hall.', 'On the bus.', 'In the gym.'], 'Look for falls.'],
    ['How does Mia help Leo?', ['She carries a book for him.', 'She gives him lunch.', 'She lends him a pencil.'], 'Read what Mia does with the book.'],
    ['What is Mia like?', ['Helpful.', 'Unkind.', 'Impatient.'], 'She carries a book and shows Leo where to eat.']],
  'photo-day': [
    ['What color shirt is required at Ana’s school?', ['White.', 'Teal.', 'Black.'], 'Read the first sentence.'],
    ['What pants does Sam wear?', ['Jeans.', 'School uniform pants.', 'Shorts.'], 'Read what Sam wears.'],
    ['What is the same at both schools?', ['They have to get there before nine.', 'They have to wear white shirts.', 'They can arrive any time.'], 'Find what they both have to do.'],
    ['Can Sam wear a different color shirt at his school?', ['Yes, he can.', 'No, he can’t.'], 'What does the text say about any color?']],
  'boat-school': [
    ['Where does the boat stop?', ['By the river.', 'In the forest.', 'At the gym.'], 'Look at the first sentence.'],
    ['Who do pupils have to wait for?', ['Their teacher.', 'The principal.', 'The cafeteria worker.'], 'Find wait for.'],
    ['What can pupils do at their desks?', ['Read and write.', 'Swim and run.', 'Eat and sleep.'], 'Look at the third sentence.'],
    ['How do the children get home?', ['They go by boat.', 'They take a yellow bus.', 'They ride bikes.'], 'Read the last sentence.']],
  'forest-school': [
    ['Where do Ana and Leo have lessons?', ['In a forest.', 'On a boat.', 'In a big gym.'], 'Read the first sentence.'],
    ['What do they draw?', ['Leaves.', 'Boats.', 'Shoes.'], 'Find draw.'],
    ['What do they have to wear?', ['Boots.', 'Black shoes.', 'Sneakers.'], 'What do they wear when the ground is muddy?'],
    ['Do they have to stay indoors?', ['No, they don’t.', 'Yes, they do.'], 'Read the sentence with don’t have to.']],
  'tree-school': [
    ['Where is the tree?', ['In the middle of the classroom.', 'Far away in a park.', 'Outside next to the bus.'], 'Read the first sentence.'],
    ['Where does the tree grow through?', ['A hole in the roof.', 'A doorway.', 'A desk.'], 'Read the second sentence.'],
    ['What do students do under its branches?', ['Read.', 'Swim.', 'Eat lunch.'], 'Find the word branches.'],
    ['When can the children use the slide?', ['After class, if their teacher says yes.', 'While the teacher is talking.', 'Only before class.'], 'Read the last sentence.']],
  'zoo-trip': [
    ['When is the trip?', ['Friday.', 'Monday.', 'Tuesday.'], 'Read the first sentence.'],
    ['What does everyone have to bring?', ['A signed form and a water bottle.', 'A notebook and crayons.', 'A library book and a ball.'], 'Find have to bring.'],
    ['Do pupils have to bring a notebook?', ['No, they don’t.', 'Yes, they do.'], 'The teacher has extras.'],
    ['Who can the children ask questions at the zoo?', ['The guide.', 'The bus driver.', 'The librarian.'], 'Read the last line.']]
};
for (const [passage, entries] of Object.entries(READ)) {
  for (const [prompt, choices, hint] of entries) add('reading', { type: 'reading', target: 'mixed', passage, prompt, ...options(choices), hint, explain: choices[0] });
}

function wordBank(bank, words, prompt) {
  words.forEach(({ phrase, image, example }, i) => {
    const nearSynonyms = [['pants', 'jeans'], ['shoes', 'sneakers'], ['a shirt', 'a T-shirt']];
    const excluded = nearSynonyms.find((pair) => pair.includes(phrase)) || [phrase];
    const alternatives = words.filter((word) => !excluded.includes(word.phrase));
    const wrong = [alternatives[i % alternatives.length].phrase, alternatives[(i + 1) % alternatives.length].phrase];
    mc(bank, [image, image === 'cover' ? 'Look at Ana and Leo on the right. What is the action?' : prompt, [phrase, ...wrong], 'Look at the main object or action.', example]);
  });
}
const wordSet = (id) => EXTRA_WORD_SETS.find((set) => set.id === id).words;
wordBank('school-actions', WORDS, 'Look. What is the action?');
wordBank('school-places', wordSet('places'), 'Look. Where are they?');
wordBank('school-places', wordSet('workers'), 'Who helps at school in this picture?');
wordBank('clothes', wordSet('clothes'), 'Look. What is this?');
wordBank('school-life', wordSet('different-schools'), 'Look. What can you see?');

const TOPICS = {
  'school-actions': [
    ['check-out', 'Mia takes a book home and will bring it back next week. She can ___ a book.', ['check out', 'throw away', 'clean up'], 'Borrowing from a library.'],
    ['wait-line', 'Before you get on the bus, stand one behind another. What do you do?', ['Wait in line.', 'Sit down.', 'Take a quiz.'], 'One behind another.'],
    ['lend', 'Sam needs a pencil until the end of class. Mia can ___ him one.', ['lend', 'throw away', 'check out'], 'Sam will give the pencil back.'],
    ['raise-hand', 'You want to speak in class. What can you do first?', ['Raise your hand.', 'Throw away your book.', 'Share your lunch.'], 'Show your teacher that you want to speak.'],
    ['stand-up', 'Get up from your chair.', ['Stand up.', 'Sit down.', 'Clean up.'], 'Look at Sam beside the empty chair.'],
    ['quiz', 'Ana answers questions on her own as a short test. What does she do?', ['Take a quiz.', 'Wait in line.', 'Check out a book.'], 'A quiz is a short test.'],
    ['clean-up', 'There is water on the desk. Ana can ___ the spill.', ['clean up', 'sit down', 'raise her hand'], 'Look for the cloth.'],
    ['share', 'Mia and Leo use the same book. What do they do?', ['Share it.', 'Throw it away.', 'Take a quiz.'], 'Both friends use one thing.']
  ],
  'school-places': [
    ['gym', 'Where can we play indoor basketball?', ['In the gym.', 'In the library.', 'In the hall.'], 'Look at the basketball hoop.'],
    ['cafeteria', 'Where can Leo get a plate of lunch?', ['In the cafeteria.', 'In the gym.', 'In the principal’s office.'], 'Find the place where people serve meals.'],
    ['check-out', 'Who can help Mia borrow a book?', ['The librarian.', 'The janitor.', 'The cafeteria worker.'], 'This person works with books.'],
    ['janitor', 'Who can mop the wet gym floor?', ['The janitor.', 'The librarian.', 'The cafeteria worker.'], 'Look for the person who cleans the school.'],
    ['auditorium', 'Where is there a stage and rows of seats?', ['The auditorium.', 'The classroom.', 'The cafeteria.'], 'This room is for a performance.'],
    ['principal-office', 'Where does the person who leads the school work?', ['The principal’s office.', 'The playground.', 'The gym.'], 'Think of a school office.'],
    ['school-day', 'Who helps pupils learn in the classroom?', ['The teacher.', 'The cafeteria worker.', 'The bus driver.'], 'The person who gives the lesson.'],
    ['hall', 'We walk through it to get to another classroom.', ['The hall.', 'The cafeteria.', 'The playground.'], 'Look at the passage with lockers.']
  ],
  'clothes': [
    ['uniform', 'What is the blue piece of fabric around Leo’s collar?', ['A tie.', 'A sock.', 'A skirt.'], 'Look under the collar.'],
    ['clothes-shirt', 'Which top has buttons and a collar?', ['A shirt.', 'A T-shirt.', 'Shorts.'], 'Look for buttons and a collar.'],
    ['casual-clothes', 'Sam’s long pants are blue denim. What are they?', ['Jeans.', 'Shorts.', 'A jacket.'], 'Denim is the fabric.'],
    ['clothes-socks', 'What do you put on before your sneakers?', ['Socks.', 'Pants.', 'A jacket.'], 'They go inside your sneakers.'],
    ['clothes-sneakers', 'Which shoes are made for running and sports?', ['Sneakers.', 'School shoes.', 'Socks.'], 'Look at the bright rubber soles.'],
    ['clothes-shorts', 'What is like pants but has much shorter legs?', ['Shorts.', 'A jacket.', 'A tie.'], 'Look at the short legs.'],
    ['clothes-uniform', 'What do we call the whole matching school outfit?', ['A uniform.', 'A T-shirt.', 'A tie.'], 'Think about all the clothes together.'],
    ['clothes-jacket', 'What can you zip up over your shirt when it is cool?', ['A jacket.', 'A skirt.', 'A T-shirt.'], 'This has a zip.']
  ],
  'school-life': [
    ['help-books', 'Which line offers help?', ['Let me help you carry those books.', 'Can you help me carry these books?', 'Where can I put my books?'], 'Think about who will do the helping.'],
    ['lend', 'Which line asks a classmate to do something for you?', ['Can you lend me a pen?', 'Can I go outside?', 'I can use a pen.'], 'Can you …? makes a request.'],
    ['share', 'You want the help someone offers. What do you say?', ['Yes, please.', 'No, thanks.', 'I’m fine, thank you.'], 'Accept politely.'],
    ['clean-up', 'You don’t need the help someone offers. What do you say?', ['No, thank you.', 'Yes, please.', 'Of course you can.'], 'Decline help politely.'],
    ['uniform', 'At Sam’s school a tie is optional. What does optional mean?', ['He can choose.', 'He must wear it.', 'He is never allowed to wear it.'], 'He doesn’t have to wear it.'],
    ['form', 'What does the teacher ask your family to sign before the trip?', ['A permission form.', 'A library book.', 'The class timetable.'], 'It shows that you have permission to go.'],
    ['field-trip', 'The teacher says “Stay with me at the zoo.” What do pupils have to do?', ['Stay with the group.', 'Walk away alone.', 'Wait at the classroom door all day.'], 'Read what the teacher says.'],
    ['encourage', 'Ana is learning a new dance step. How can you encourage her?', ['Keep trying!', 'Please stop.', 'Take a quiz.'], 'Say something that helps her keep practising.'],
    ['auditorium', 'Mia spoke clearly in her show. What is positive feedback?', ['Great job! I heard all your words.', 'You can’t wear that here.', 'Where is the library?'], 'Say what she did well.'],
    ['plan', 'Which goal tells you what to do and by when?', ['Read one page by Friday.', 'Read better.', 'Read soon.'], 'Choose a clear action and a date.'],
    ['plan', 'Which action helps you reach a reading goal?', ['Read with a partner for five minutes each day.', 'Think about the book later.', 'Put the book away all week.'], 'Choose a small action you can actually do.'],
    ['boat-school', 'How can you compare the boat school to your school?', ['Say one thing that is the same and one thing that is different.', 'Read only the title.', 'Count the words in the text.'], 'Connect something you read to your own school.'],
    ['forest-school', 'The children listen to their teacher outside instead of indoors. What is different?', ['The place of the lesson.', 'The color of the pencils.', 'The number of books.'], 'Outside and indoors are places.'],
    ['tree-school', 'A tree grows through the top of the classroom. What do we call that part?', ['The roof.', 'The floor.', 'The door.'], 'It covers the top of the building.'],
    ['mud', 'It rains and the soil gets wet and sticky. What is it called?', ['Mud.', 'Sand.', 'A roof.'], 'Look at the wet ground.'],
    ['wait-line', 'Which sentence gives two bus rules linked with and?', ['Wait in line and stay seated.', 'Wait in line or stay seated.', 'Wait in line but stay seated.'], 'And links two things to do.']
  ]
};
for (const [bank, items] of Object.entries(TOPICS)) for (const entry of items) mc(bank, entry);

export const BANKS = [
  ['mcq', 'Choose', 'Choose.', 'Can and have to for abilities, requests and rules.'],
  ['jumbled', 'Make a sentence', 'Make a sentence.', 'Put the words in order.'],
  ['fill', 'Fill in', 'Fill in the gap.', 'can, can’t, have to, and, but, or …'],
  ['change', 'Change it', 'Change the sentence.', 'Make a question, say what isn’t allowed or make a rule optional.'],
  ['fix', 'Fix the mistake', 'Find the mistake. Fix it.', 'One word is wrong. Find it and fix it.'],
  ['decide', 'Look and decide', 'Look. Read. True or false?', 'Read a rule card. Is the sentence true or false?'],
  ['dialogue', 'Dialogues', 'Complete the dialogue.', 'Ask for permission. Offer help and reply politely.'],
  ['reading', 'Mini reading', 'Read. Answer.', 'Read a new short text and answer four questions.'],
  ['school-actions', 'Actions at school', 'Look and choose.', 'lend, clean up, take a quiz, check out …'],
  ['school-places', 'Places and people', 'Look and choose.', 'library, auditorium, janitor, cafeteria worker …'],
  ['clothes', 'Clothes and uniforms', 'Look and choose.', 'jeans, socks, sneakers, shirt, uniform …'],
  ['school-life', 'School life and field trips', 'Look and choose.', 'Offers, trip rules, different schools, encouragement and goals.']
].map(([id, title, instruction, description], i) => ({ id, letter: 'ABCDEFGHIJKL'[i], title, instruction, description, expected: counters.get(id) }));
export const QUESTIONS = questions;
