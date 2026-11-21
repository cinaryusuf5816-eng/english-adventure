// Week 4 (should / shouldn't + How often …?): everything in week.json except the tables in week4-data.mjs.
// Book topics and target words only; every sentence here is our own.

export const META = {
  id: 'week-04',
  schemaVersion: 1,
  contentVersion: '1.0.0',
  grammar: 'should-advice',
  wordsTitle: 'Health problems',
  title: 'Should and How Often',
  subtitle: "You should rest. You shouldn't share. How often …?",
  published: true,
  cover: 'cover',
  questionsFile: 'questions.json',
  goals: [
    'I can name health problems: a cold, a fever, a cough, a sore throat …',
    'I can give advice with should and shouldn’t.',
    'I can ask Should I …? and answer Yes, you should. / No, you shouldn’t.',
    'I can name hygiene habits: brush my teeth, wash my hands …',
    'I can ask How often …? and answer with always, usually, sometimes and never.',
    'I can talk to a doctor and show I care: What’s the matter? I’m sorry.'
  ],
  teacherGoals: [
    'Health problems: have a sore throat / a stomachache / a fever / a toothache / an earache / a headache / a cold; cough; sneeze; my (leg) hurts.',
    'Advice: should + base verb (a good idea), shouldn’t + base verb (a bad idea). No -s after should: He should rest (not rests).',
    'Questions: Should I / he …? → Yes, you / he should. / No, you / he shouldn’t.',
    'Hygiene habits: brush my teeth, comb my hair, wash my face, use hand gel, cut my nails, take a shower, wipe my mouth, wash my hands.',
    'Adverbs of frequency before the main verb: always, usually, sometimes, never. How often do / does …? Also every day, once a week.',
    'Talking about problems: What’s the matter? What’s wrong? How are you feeling? Sympathy: I’m sorry. That’s too bad. That’s terrible!',
    'Reading words: germs, clean water, village, well, river, bottle, tap, carry, heavy. Values: honesty, kindness, gratefulness, responsibility.'
  ],
  teacherNote: 'This week follows Compass Unit 3, pages 44–61: Why do we get sick? Health Problems (46), should / shouldn’t (47), a story about a cold (48–49), the doctor’s advice (50), Talking about Problems (51), writing about a picture (52), a get-well letter and end punctuation (53), Hygiene Habits (54), Adverbs of Frequency (55), clean water (56–57), germs (58), staying on topic (59), values (60) and the unit reflection (61). All sentences and the four short readings are written for this site; only the topics and target words come from the book.',
  characters: [
    { id: 'mia', name: 'Mia', pronoun: 'she', image: 'h-cold' },
    { id: 'sam', name: 'Sam', pronoun: 'he', image: 'y-hair' },
    { id: 'leo', name: 'Leo', pronoun: 'he', image: 'a-dentist' },
    { id: 'ana', name: 'Ana', pronoun: 'she', image: 'y-hands' },
    { id: 'nurse', name: 'The school nurse', pronoun: 'she', note: 'She helps sick children at school.', image: 'a-nurse' },
    { id: 'pepper', name: 'Pepper', pronoun: 'it', note: 'Pepper is a cat.', image: 'v-sleep' }
  ],
  dashboard: {
    tagline: "Let's stay healthy and give good advice!",
    bubbleLeft: ['I have', 'a cold!'],
    bubbleRight: ['You should', 'rest!']
  },
  missions: [
    { id: 'm-learn', text: 'Learn should and shouldn’t', check: { section: 'learn', min: 3 } },
    { id: 'm-words', text: 'Learn the new words', check: { section: 'words', min: 1 } },
    { id: 'm-practice', text: 'Complete at least 3 activities', check: { section: 'practise', min: 3 } },
    { id: 'm-challenge', text: 'Try the challenge', check: { section: 'challenge', min: 1 } },
    { id: 'm-proud', text: 'Be proud of yourself!', check: { all: true } }
  ]
};

const w = (id, phrase, image, example) => ({ id, word: phrase, phrase, image, example });

export const WORDS = [
  w('sore-throat', 'a sore throat', 'h-sore-throat', 'Mia has a sore throat. It hurts when she talks.'),
  w('cough', 'cough', 'h-cough', 'Sam is coughing into his elbow.'),
  w('stomachache', 'a stomachache', 'h-stomachache', 'Leo has a stomachache. His tummy hurts.'),
  w('fever', 'a fever', 'h-fever', 'Ana has a fever. She feels very hot.'),
  w('leg-hurts', 'my leg hurts', 'h-leg', '“Ouch! My leg hurts,” says Sam.'),
  w('sneeze', 'sneeze', 'h-sneeze', 'Ana is sneezing into a tissue.'),
  w('toothache', 'a toothache', 'h-toothache', 'Leo has a toothache. Too much candy!'),
  w('earache', 'an earache', 'h-earache', 'Mia has an earache.'),
  w('headache', 'a headache', 'h-headache', 'Sam has a headache. His head hurts.'),
  w('cold', 'a cold', 'h-cold', 'Mia has a cold. Her nose is red.'),
  w('runny-nose', 'a runny nose', 'a-tissue', 'Mia has a runny nose. She needs a tissue.'),
  w('feel-sick', 'feel sick', 'v-honest', 'Sam feels sick. He tells his mom.')
];

export const EXTRA_WORD_SETS = [
  {
    id: 'better', title: 'Get better: what to do',
    words: [
      w('go-to-the-doctor', 'go to the doctor', 'a-doctor', 'Leo is at the doctor. She is listening to his chest.'),
      w('use-a-tissue', 'use a tissue', 'a-tissue', 'Mia is using a tissue.'),
      w('take-medicine', 'take medicine', 'a-medicine', 'Ana is taking some medicine.'),
      w('take-your-temperature', 'take your temperature', 'a-temperature', 'Dad is taking Sam’s temperature.'),
      w('put-on-a-bandage', 'put on a bandage', 'a-bandage', 'The nurse is putting a bandage on Leo’s knee.'),
      w('cover-your-mouth', 'cover your mouth', 'a-cover', 'Ana covers her mouth when she coughs.'),
      w('drink-water', 'drink water', 'a-water', 'Sam is drinking a big glass of water.'),
      w('go-to-the-dentist', 'go to the dentist', 'a-dentist', 'Leo is at the dentist.'),
      w('school-nurse', 'the school nurse', 'a-nurse', 'Mia is talking to the school nurse.'),
      w('rest', 'rest / stay in bed', 'a-rest', 'Ana is resting in bed.')
    ]
  },
  {
    id: 'hygiene', title: 'Hygiene habits',
    words: [
      w('brush-my-teeth', 'brush my teeth', 'y-teeth', 'I brush my teeth in the morning and at night.'),
      w('comb-my-hair', 'comb my hair', 'y-hair', 'Sam is combing his hair.'),
      w('wash-my-face', 'wash my face', 'y-face', 'Leo is washing his face.'),
      w('use-hand-gel', 'use hand gel', 'y-gel', 'Ana is using hand gel before lunch.'),
      w('cut-my-nails', 'cut my nails', 'y-nails', 'Leo is cutting his nails.'),
      w('take-a-shower', 'take a shower', 'y-shower', 'Sam is taking a shower.'),
      w('wipe-my-mouth', 'wipe my mouth', 'y-wipe', 'Mia is wiping her mouth with a napkin.'),
      w('wash-my-hands', 'wash my hands', 'y-hands', 'Ana is washing her hands with soap.')
    ]
  },
  {
    id: 'often', title: 'How often? always … never',
    words: [
      w('always', 'always', 'y-teeth', 'Mia always brushes her teeth before bed. (every time)'),
      w('usually', 'usually', 'y-shower', 'Sam usually takes a shower in the evening. (most times)'),
      w('sometimes', 'sometimes', 'y-gel', 'Ana sometimes uses hand gel. (some times)'),
      w('never', 'never', 'g-dirty', 'We never eat with dirty hands! (not one time)'),
      w('every-day', 'every day', 'y-hands', 'Ana washes her hands every day.'),
      w('once-a-week', 'once a week', 'y-nails', 'Leo cuts his nails once a week.'),
      w('how-often', 'How often …?', 'y-face', 'How often do you wash your face?')
    ]
  },
  {
    id: 'story', title: 'Story words: Mia’s cold',
    words: [
      w('hug', 'a hug', 's-hug', 'Grandma gives Mia a big hug.'),
      w('remote', 'a remote', 's-remote', 'Sam has the TV remote.'),
      w('share', 'share', 's-share', 'Leo shares his crayons with Ana.'),
      w('get-well-card', 'a get-well card', 's-card', 'Leo and Ana are making a get-well card.'),
      w('feel-better', 'feel better', 's-better', 'Mia feels better today!'),
      w('stay-at-home', 'stay at home', 'h-cold', 'Mia has a cold. She is staying at home.')
    ]
  },
  {
    id: 'water', title: 'Reading words: clean water',
    words: [
      w('village', 'a village', 'c-village', 'This is a small village with round houses.'),
      w('well', 'a well', 'c-well', 'A well takes water from deep under the ground.'),
      w('river', 'a river', 'c-river', 'The children are filling bottles at the river.'),
      w('bottle', 'a bottle', 'c-carry', 'The bottle is big and full of water.'),
      w('carry', 'carry', 'c-carry', 'She is carrying a heavy bottle.'),
      w('heavy', 'heavy', 'c-carry', 'A bottle of water is heavy.'),
      w('tap', 'a tap', 'c-tap', 'Clean water comes out of the tap.'),
      w('solar-panel', 'a solar panel', 'c-tap', 'The solar panel uses the sun to make power.'),
      w('clean-water', 'clean water', 'c-tap', 'Clean water keeps us healthy.')
    ]
  },
  {
    id: 'germs', title: 'Germs',
    words: [
      w('germs', 'germs', 'g-germs', 'Germs are very small. We can’t see them.'),
      w('everywhere', 'everywhere', 'g-everywhere', 'Germs are everywhere: on desks, doors and pencils.'),
      w('dirty-hands', 'dirty hands', 'g-dirty', 'Sam has dirty hands. He should wash them!'),
      w('throw-away', 'throw away', 'g-bin', 'Ana throws her tissue away.'),
      w('spread', 'spread', 'h-sneeze', 'Germs spread when we sneeze. Use a tissue!'),
      w('healthy', 'healthy', 's-better', 'Mia is healthy again.')
    ]
  },
  {
    id: 'doctor', title: 'At the doctor’s: kind words',
    words: [
      w('whats-the-matter', 'What’s the matter?', 'd-talk', '“What’s the matter, Mia?” asks the doctor.'),
      w('whats-wrong', 'What’s wrong?', 'a-doctor', '“What’s wrong, Leo?” “My chest hurts.”'),
      w('how-are-you-feeling', 'How are you feeling?', 'a-nurse', '“How are you feeling?” “Not very good.”'),
      w('im-sorry', 'I’m sorry.', 'd-sorry', '“I’m sorry, Leo.”'),
      w('too-bad', 'That’s too bad.', 'h-leg', '“Your leg hurts? That’s too bad.”'),
      w('terrible', 'That’s terrible!', 'h-toothache', '“A big toothache? That’s terrible!”'),
      w('patient', 'a patient', 'a-doctor', 'Leo is the patient. The doctor helps him.'),
      w('get-well-soon', 'Get well soon!', 'v-kind', '“Get well soon, Sam!” says Mia.')
    ]
  },
  {
    id: 'values', title: 'Values: what is important',
    words: [
      w('honesty', 'honesty', 'v-honest', 'Sam tells his mom the truth. That is honesty.'),
      w('kindness', 'kindness', 'v-kind', 'Mia makes a card for her sick friend. That is kindness.'),
      w('gratefulness', 'gratefulness', 'v-grateful', 'Leo says “Thank you!” That is gratefulness.'),
      w('responsibility', 'responsibility', 'v-responsible', 'Ana washes the dishes. That is responsibility.')
    ]
  }
];

const ex = (text, image, extra = {}) => ({ text, image, ...extra });
const qa = (q, a, image, extra = {}) => ({ q, a, image, ...extra });
const pr = (mode, prompt, image, options, answer, explain) => ({ mode, prompt, image, options, answer, explain });

export const LEARN = [
  {
    id: 'problems', title: 'Health problems', rule: 'Say what is wrong: **I have a …** or **My … hurts.**', image: 'h-cold',
    examples: [
      ex('I **have a cold**.', 'h-cold', { speaker: 'Mia' }),
      ex('I **have a stomachache**.', 'h-stomachache', { speaker: 'Leo' }),
      ex('I **have a fever**.', 'h-fever', { speaker: 'Ana' }),
      ex('I **have a sore throat**.', 'h-sore-throat', { speaker: 'Mia' }),
      ex('**My leg hurts**!', 'h-leg', { speaker: 'Sam' }),
      ex('Sam is **coughing**. Ana is **sneezing**.', 'h-cough', { label: 'cough · sneeze' })
    ],
    practice: [
      pr('together', 'Leo holds his tummy. He has a ___.', 'h-stomachache', ['stomachache', 'toothache'], 'a', 'Tummy → stomach → stomachache.'),
      pr('try', 'Ana is very hot. She has a ___.', 'h-fever', ['cold', 'fever'], 'b', 'Very hot → a fever.')
    ],
    teacherNote: 'Pupils act out a problem; the class guesses. Point to the body part: head → headache, tooth → toothache, ear → earache, stomach → stomachache.'
  },
  {
    id: 'have-a', title: 'a or an? -ache words', rule: '**have a** headache · **have an** earache. **head + ache = headache.**', image: 'h-earache',
    examples: [
      ex('Sam has **a headache**.', 'h-headache', { label: 'head + ache' }),
      ex('Leo has **a toothache**.', 'h-toothache', { label: 'tooth + ache' }),
      ex('Leo has **a stomachache**.', 'h-stomachache', { label: 'stomach + ache' }),
      ex('Mia has **an earache**.', 'h-earache', { label: 'an: ear starts with e' }),
      ex('Sam’s **leg hurts**.', 'h-leg', { label: 'No -ache word? Say: my leg hurts.' }),
      ex('Mia has **a sore throat**.', 'h-sore-throat', { label: 'a + sore throat' })
    ],
    groups: [
      { label: 'have a', words: ['a cold', 'a fever', 'a cough', 'a sore throat', 'a headache', 'a toothache', 'a stomachache'] },
      { label: 'have an', words: ['an earache'] },
      { label: '… hurts', words: ['my leg hurts', 'my arm hurts', 'my head hurts'] }
    ],
    practice: [
      pr('together', 'Mia has ___ earache.', 'h-earache', ['a', 'an'], 'b', 'ear starts with a vowel → an.'),
      pr('try', 'Sam has ___ headache.', 'h-headache', ['a', 'an'], 'a', 'head starts with h → a.')
    ],
    teacherNote: 'Show that the -ache words are two small words together. A or an depends on the first sound: an earache.'
  },
  {
    id: 'should', title: 'should = a good idea', rule: '**should** + verb = **a good idea**. You should rest.', image: 'a-rest',
    examples: [
      { machine: { subject: 'ana', verb: 'rest', to: 'should' } },
      ex('You have a cold. You **should** rest.', 'a-rest'),
      ex('You have a toothache. You **should** go to the dentist.', 'a-dentist'),
      ex('You have a fever. You **should** take your temperature.', 'a-temperature'),
      ex('You are thirsty. You **should** drink water.', 'a-water'),
      ex('You are sneezing. You **should** use a tissue.', 'a-tissue')
    ],
    practice: [
      pr('together', 'You have a toothache. You should ___.', 'a-dentist', ['go to the dentist', 'eat candy'], 'a', 'The dentist helps your teeth.'),
      pr('try', 'You have a cold. You should ___.', 'a-rest', ['play football', 'rest'], 'b', 'Rest and get better.')
    ],
    teacherNote: 'Should gives advice. Pupils say a problem; a friend gives advice with should. Keep the advice short: You should rest.'
  },
  {
    id: 'shouldnt', title: 'shouldn’t = a bad idea', rule: '**shouldn’t** + verb = **a bad idea**. should + not = shouldn’t.', image: 's-share',
    examples: [
      { machine: { subject: 'leo', verb: 'share-drink', to: 'shouldnt' } },
      ex('You are sick. You **shouldn’t** share a drink.', 's-share', { label: 'Germs go from cup to cup.' }),
      ex('You have a fever. You **shouldn’t** go to school.', 'h-fever'),
      ex('You have a toothache. You **shouldn’t** eat lots of candy.', 'h-toothache'),
      ex('You **shouldn’t** sneeze on people.', 'h-sneeze'),
      ex('You **shouldn’t** eat with dirty hands.', 'g-dirty')
    ],
    groups: [{ label: 'good idea ✓', words: ['should rest', 'should drink water', 'should use a tissue'] }, { label: 'bad idea ✗', words: ['shouldn’t share a drink', 'shouldn’t eat candy', 'shouldn’t sneeze on people'] }],
    practice: [
      pr('together', 'You have a fever. You ___ go to school.', 'h-fever', ['should', 'shouldn’t'], 'b', 'A fever → stay at home.'),
      pr('try', 'You have dirty hands. You ___ eat now.', 'g-dirty', ['shouldn’t', 'should'], 'a', 'Wash your hands first!')
    ],
    teacherNote: 'Thumbs up for should, thumbs down for shouldn’t. Read a piece of advice; pupils show the thumb.'
  },
  {
    id: 'no-s', title: 'After should: no -s!', rule: 'He rest**s** → He should **rest**. After should, the verb never changes.', image: 'y-hands',
    examples: [
      { machine: { subject: 'sam', verb: 'wash-hands', to: 'should' } },
      { machine: { subject: 'mia', verb: 'see-nurse', to: 'should' } },
      ex('She **should take** medicine.', 'a-medicine', { label: 'not: should takes' }),
      ex('He **should go** to the doctor.', 'a-doctor', { label: 'not: should goes' }),
      ex('They **should drink** water.', 'a-water', { label: 'should + drink' }),
      ex('Leo **should brush** his teeth.', 'y-teeth', { label: 'not: should brushes' })
    ],
    practice: [
      pr('together', 'Which one is right?', 'a-doctor', ['He should go to the doctor.', 'He should goes to the doctor.'], 'a', 'should + go (no -es).'),
      pr('try', 'Which one is right?', 'a-medicine', ['She should takes medicine.', 'She should take medicine.'], 'b', 'should + take (no -s).')
    ],
    teacherNote: 'This is the most common mistake: *He should goes*. In Week 1 he → -s. With should, the -s goes away for everybody.'
  },
  {
    id: 'should-question', title: 'Should I …?', rule: 'Ask for advice: **Should I …?** → **Yes, you should. / No, you shouldn’t.**', image: 'd-talk',
    examples: [
      { machine: { subject: 'I', verb: 'see-doctor', to: 'question' } },
      { machine: { subject: 'leo', verb: 'eat-candy', to: 'question' } },
      qa('**Should** I go to school with a fever?', 'No, you shouldn’t.', 'h-fever'),
      qa('**Should** I use a tissue?', 'Yes, you should.', 'a-tissue'),
      qa('**Should** Leo go to the dentist?', 'Yes, he should.', 'a-dentist'),
      qa('**Should** we share our drinks?', 'No, we shouldn’t.', 's-share')
    ],
    practice: [
      pr('together', 'Should I drink water?', 'a-water', ['Yes, you should.', 'Yes, you do.'], 'a', 'Should …? → Yes, you should.'),
      pr('try', 'Should Sam sneeze on people?', 'h-sneeze', ['Yes, he should.', 'No, he shouldn’t.'], 'b', 'A bad idea → No, he shouldn’t.')
    ],
    teacherNote: 'Should jumps to the front, like is / are in Week 2. The short answer repeats should: Yes, you should.'
  },
  {
    id: 'advice', title: 'Problem → advice', rule: 'Match the problem with the best advice.', image: 'a-nurse',
    examples: [
      qa('I have a toothache.', 'You should go to the dentist.', 'h-toothache'),
      qa('I’m sneezing.', 'You should use a tissue.', 'h-sneeze'),
      qa('My knee hurts.', 'You should put on a bandage.', 'a-bandage'),
      qa('I have a fever.', 'You should take your temperature and rest.', 'a-temperature'),
      qa('I have a sore throat.', 'You should drink warm water.', 'h-sore-throat'),
      qa('I feel sick at school.', 'You should go to the school nurse.', 'a-nurse')
    ],
    practice: [
      pr('together', 'My knee hurts.', 'a-bandage', ['You should put on a bandage.', 'You should comb your hair.'], 'a', 'A bandage helps a hurt knee.'),
      pr('try', 'I’m coughing.', 'a-cover', ['You should share a drink.', 'You should cover your mouth.'], 'b', 'Cover your mouth when you cough.')
    ],
    teacherNote: 'Play “Doctor, doctor!”: one pupil says a problem, another gives advice. Swap roles.'
  },
  {
    id: 'hygiene', title: 'Hygiene habits', rule: 'Clean habits keep germs away: **wash my hands, brush my teeth …**', image: 'y-hands',
    examples: [
      ex('I **brush my teeth**.', 'y-teeth', { speaker: 'Mia' }),
      ex('I **comb my hair**.', 'y-hair', { speaker: 'Sam' }),
      ex('I **wash my face**.', 'y-face', { speaker: 'Leo' }),
      ex('I **use hand gel**.', 'y-gel', { speaker: 'Ana' }),
      ex('I **cut my nails**.', 'y-nails', { speaker: 'Leo' }),
      ex('I **take a shower**.', 'y-shower', { speaker: 'Sam' }),
      ex('I **wipe my mouth**.', 'y-wipe', { speaker: 'Mia' }),
      ex('I **wash my hands**.', 'y-hands', { speaker: 'Ana' })
    ],
    practice: [
      pr('together', 'I ___ my teeth.', 'y-teeth', ['brush', 'comb'], 'a', 'brush my teeth.'),
      pr('try', 'I ___ my hair.', 'y-hair', ['wipe', 'comb'], 'b', 'comb my hair.')
    ],
    teacherNote: 'Sing the actions: This is the way I brush my teeth … Pupils mime each habit. Talk about when: in the morning, before lunch, at night.'
  },
  {
    id: 'often-words', title: 'always, usually, sometimes, never', rule: '**always** 100% · **usually** 80% · **sometimes** 50% · **never** 0%', image: 'y-teeth',
    examples: [
      ex('Mia **always** brushes her teeth before bed.', 'y-teeth', { label: 'always = every time' }),
      ex('Sam **usually** takes a shower in the evening.', 'y-shower', { label: 'usually = most times' }),
      ex('Ana **sometimes** uses hand gel.', 'y-gel', { label: 'sometimes = some times' }),
      ex('We **never** eat with dirty hands.', 'g-dirty', { label: 'never = not one time' }),
      ex('Leo **always** washes his face in the morning.', 'y-face', { label: 'always = every time' }),
      ex('Mia **usually** wipes her mouth with a napkin.', 'y-wipe', { label: 'usually = most times' })
    ],
    groups: [
      { label: '100%', words: ['always'] }, { label: '80%', words: ['usually'] },
      { label: '50%', words: ['sometimes'] }, { label: '0%', words: ['never'] }
    ],
    practice: [
      pr('together', 'Every time = ___', 'y-teeth', ['always', 'never'], 'a', 'always = 100%.'),
      pr('try', 'Not one time = ___', 'g-dirty', ['sometimes', 'never'], 'b', 'never = 0%.')
    ],
    teacherNote: 'Draw a line from 0% to 100% on the board. Pupils stand at the place that is true for them: I always / usually / sometimes / never …'
  },
  {
    id: 'often-place', title: 'Where does always go?', rule: 'Who + **always / usually / sometimes / never** + verb.', image: 'y-face',
    examples: [
      { machine: { subject: 'leo', verb: 'wash-face', to: 'often' } },
      ex('I **always** wash my hands.', 'y-hands', { label: 'before the verb' }),
      ex('He **usually** combs his hair.', 'y-hair', { label: 'he → combs (-s)' }),
      ex('She **sometimes** uses hand gel.', 'y-gel'),
      ex('They **never** bite their nails.', 'y-nails'),
      ex('We **always** throw used tissues away.', 'g-bin')
    ],
    practice: [
      pr('together', 'Which one is right?', 'y-hands', ['I always wash my hands.', 'I wash always my hands.'], 'a', 'always goes before the verb.'),
      pr('try', 'Which one is right?', 'y-hair', ['Sam combs usually his hair.', 'Sam usually combs his hair.'], 'b', 'usually + combs.')
    ],
    teacherNote: 'The adverb sits between who and the verb. The verb keeps its Week 1 form: he always washes.'
  },
  {
    id: 'how-often', title: 'How often …?', rule: '**How often do** you …? **How often does** he / she …?', image: 'y-shower',
    examples: [
      { machine: { subject: 'sam', verb: 'shower', to: 'often' } },
      { machine: { subject: 'they', verb: 'dirty-hands', to: 'often' } },
      qa('**How often do** you brush your teeth?', 'I always brush my teeth after meals.', 'y-teeth'),
      qa('**How often does** Ana use hand gel?', 'She sometimes uses hand gel.', 'y-gel'),
      qa('**How often does** Leo cut his nails?', 'Once a week.', 'y-nails'),
      qa('**How often do** they wash their hands?', 'They always wash their hands before meals.', 'y-hands')
    ],
    practice: [
      pr('together', 'How often ___ you wash your face?', 'y-face', ['do', 'does'], 'a', 'you → do.'),
      pr('try', 'How often ___ Sam take a shower?', 'y-shower', ['do', 'does'], 'b', 'Sam = he → does.')
    ],
    teacherNote: 'This uses do / does from Week 1. After does the verb has no -s: How often does he wash …?'
  },
  {
    id: 'every', title: 'every day, once a week', rule: 'At the end: **every day · every morning · once a week · twice a day**.', image: 'y-nails',
    examples: [
      ex('Ana washes her hands **every day**.', 'y-hands'),
      ex('Mia brushes her teeth **twice a day**.', 'y-teeth', { label: 'twice = two times' }),
      ex('Leo cuts his nails **once a week**.', 'y-nails', { label: 'once = one time' }),
      ex('Sam takes a shower **every evening**.', 'y-shower'),
      ex('Leo washes his face **every morning**.', 'y-face'),
      qa('**How often** do you cut your nails?', '**Once a week.**', 'y-nails')
    ],
    groups: [{ label: 'before the verb', words: ['always', 'usually', 'sometimes', 'never'] }, { label: 'at the end', words: ['every day', 'once a week', 'twice a day'] }],
    practice: [
      pr('together', 'One time a week = ___', 'y-nails', ['once a week', 'twice a week'], 'a', 'once = one time.'),
      pr('try', 'Mia brushes her teeth ___.', 'y-teeth', ['twice a day', 'never'], 'a', 'In the morning and at night = twice a day.')
    ],
    teacherNote: 'Phrases with every / once / twice usually go at the end of the sentence, not before the verb.'
  },
  {
    id: 'doctor-talk', title: 'At the doctor’s', rule: 'Ask: **What’s the matter? What’s wrong?** Be kind: **I’m sorry. That’s too bad.**', image: 'd-talk',
    examples: [
      ex('“**What’s the matter**, Mia?”', 'd-talk', { speaker: 'Doctor' }),
      ex('“I don’t feel well. My throat hurts.”', 'h-sore-throat', { speaker: 'Mia' }),
      ex('“**I’m sorry.** You have a sore throat.”', 'd-talk', { speaker: 'Doctor' }),
      ex('“**What should I do**?”', 'd-talk', { speaker: 'Mia' }),
      ex('“You should drink warm water and rest.”', 'a-rest', { speaker: 'Doctor' }),
      ex('“**That’s too bad**, Leo. **How are you feeling** now?”', 'd-sorry', { speaker: 'Ana' })
    ],
    groups: [
      { label: 'Ask', words: ['What’s the matter?', 'What’s wrong?', 'How are you feeling?'] },
      { label: 'Be kind', words: ['I’m sorry.', 'That’s too bad.', 'That’s terrible!'] }
    ],
    practice: [
      pr('together', 'Your friend says: “My leg hurts.” You say:', 'h-leg', ['That’s too bad.', 'That’s great!'], 'a', 'Show you care.'),
      pr('try', 'The doctor asks about the problem:', 'a-doctor', ['What’s the matter?', 'What’s your name?'], 'a', 'What’s the matter? = What is the problem?')
    ],
    teacherNote: 'Role-play: patient says how they feel and what hurts; doctor asks, shows sympathy, names the problem and gives advice.'
  },
  {
    id: 'germs', title: 'Germs', rule: 'Germs are **tiny**. They are **everywhere**. Some germs make us **sick**.', image: 'g-germs',
    examples: [
      ex('**Germs** are very small. We can’t see them with our eyes.', 'g-germs'),
      ex('Germs are **everywhere**: on doors, desks and pencils.', 'g-everywhere'),
      ex('Germs **spread** when we sneeze and cough.', 'h-sneeze'),
      ex('Sam has **dirty hands**. He should wash them before he eats.', 'g-dirty'),
      ex('Ana **throws** her used tissue **away**.', 'g-bin'),
      ex('Wash your hands and the germs go away!', 'y-hands')
    ],
    practice: [
      pr('together', 'Can we see germs with our eyes?', 'g-germs', ['No, we can’t.', 'Yes, we can.'], 'a', 'They are very small.'),
      pr('try', 'Where are germs?', 'g-everywhere', ['Only outside.', 'Everywhere.'], 'b', 'On doors, desks, pencils …')
    ],
    teacherNote: 'Put a little glitter on a pupil’s hand and shake hands around the class: the “germs” spread. Then wash hands.'
  },
  {
    id: 'story-order', title: 'First, next, after that, last', rule: 'A story happens in order: **First … Next … After that … Last …**', image: 's-better',
    examples: [
      ex('**First**, Mia wakes up with a cold.', 'h-cold'),
      ex('**Next**, Dad takes her temperature.', 'a-temperature', { label: 'Dad helps Mia too.' }),
      ex('**After that**, she rests in bed and drinks water.', 'a-rest'),
      ex('**Last**, Mia feels better!', 's-better'),
      ex('Grandma visits and gives Mia a big **hug**.', 's-hug', { label: 'This happens after that too.' }),
      ex('Leo and Ana make a **get-well card** for Mia.', 's-card')
    ],
    practice: [
      pr('together', 'Which word starts a story?', 'h-cold', ['First', 'Last'], 'a', 'First = number 1.'),
      pr('try', 'Which word ends a story?', 's-better', ['Next', 'Last'], 'b', 'Last = the end.')
    ],
    teacherNote: 'Cut a short story into four strips. Pupils put them in order and read them with First, Next, After that, Last.'
  },
  {
    id: 'clean-water', title: 'Clean water', rule: 'Clean water helps us stay **healthy**. Some children walk far to get water.', image: 'c-tap',
    examples: [
      ex('This is a small **village**.', 'c-village'),
      ex('Some children **carry** big, **heavy** bottles from the **river**.', 'c-carry'),
      ex('River water is not always clean.', 'c-river'),
      ex('A **well** takes water from deep under the ground.', 'c-well'),
      ex('A **solar panel** gives power to the pump. Clean water comes out of the **tap**.', 'c-tap'),
      ex('Now the children can wash their hands with clean water.', 'c-tap', { label: 'Clean water stops germs.' })
    ],
    practice: [
      pr('together', 'The bottle is full of water. It is ___.', 'c-carry', ['heavy', 'tiny'], 'a', 'Water is heavy.'),
      pr('try', 'Clean water comes out of the ___.', 'c-tap', ['tap', 'tissue'], 'a', 'The tap.')
    ],
    teacherNote: 'Talk about where our water comes from. How far do you walk to get water? (Only to the tap!)'
  },
  {
    id: 'punctuation', title: '. ? ! at the end', rule: 'A sentence ends with **.** A question ends with **?** A strong feeling ends with **!**', image: 'v-kind',
    examples: [
      ex('I have a cold**.**', 'h-cold', { label: 'statement → .' }),
      ex('How are you feeling**?**', 'a-nurse', { label: 'question → ?' }),
      ex('Get well soon**!**', 'v-kind', { label: 'strong feeling → !' }),
      ex('Dear Sam, I’m sorry you have a cold. You should rest. Get well soon! From Mia', 's-card', { label: 'A get-well note' }),
      ex('That’s terrible**!**', 'h-toothache', { label: 'strong feeling → !' }),
      ex('What should I do**?**', 'd-talk', { label: 'question → ?' })
    ],
    practice: [
      pr('together', 'Should I rest___', 'a-rest', ['?', '.'], 'a', 'It is a question.'),
      pr('try', 'Get well soon___', 'v-kind', ['?', '!'], 'b', 'A strong, happy feeling.')
    ],
    teacherNote: 'Pupils write a short get-well note to a friend: Dear …, I’m sorry …, You should …, Get well soon! From …'
  },
  {
    id: 'values', title: 'Values', rule: 'Values help us decide what to do: **honesty, kindness, gratefulness, responsibility**.', image: 'v-kind',
    examples: [
      ex('Sam feels sick. He tells his mom the truth. That is **honesty**.', 'v-honest'),
      ex('Mia makes a card for her sick friend. That is **kindness**.', 'v-kind'),
      ex('Mia helps Leo up. Leo says “Thank you!” That is **gratefulness**.', 'v-grateful'),
      ex('Ana washes the dishes after lunch. That is **responsibility**.', 'v-responsible'),
      ex('“When I share my crayons, I am being kind.”', 's-share', { speaker: 'Leo' }),
      ex('“When I say thank you, I am being grateful.”', 'v-grateful', { speaker: 'Leo' })
    ],
    practice: [
      pr('together', 'You tell the truth. That is ___.', 'v-honest', ['honesty', 'kindness'], 'a', 'The truth → honesty.'),
      pr('try', 'You say “Thank you!” That is ___.', 'v-grateful', ['responsibility', 'gratefulness'], 'b', 'Thank you → gratefulness.')
    ],
    teacherNote: 'Pupils finish the sentence: When I …, I am being kind / honest / grateful / responsible.'
  }
];

export const SPEAKING = [
  ['What’s the matter? Act out a health problem.', 'h-cold', ['I have a …', 'My … hurts.'], 'I have a headache.', true],
  ['You have a cold. What should you do?', 'a-rest', ['I should …'], 'I should rest and drink water.'],
  ['You have a toothache. What should you do?', 'a-dentist', ['I should …', 'I shouldn’t …'], 'I should go to the dentist. I shouldn’t eat candy.'],
  ['Your friend is sneezing. Give some advice.', 'h-sneeze', ['You should …'], 'You should use a tissue.', true],
  ['What shouldn’t you do when you are sick?', 's-share', ['I shouldn’t …'], 'I shouldn’t share my drink.', true],
  ['Ask for advice. Start with Should I …?', 'd-talk', ['Should I …?'], 'Should I go to the doctor?', true],
  ['Should you go to school with a fever?', 'h-fever', ['Yes, I should.', 'No, I shouldn’t.'], 'No, I shouldn’t.'],
  ['How is your day different when you are sick?', 'a-rest', ['I stay …', 'I don’t …'], 'I stay at home. I don’t go to school.', true],
  ['Name four hygiene habits.', 'y-hands', ['I wash …', 'I brush …'], 'I wash my hands, brush my teeth, comb my hair and take a shower.', true],
  ['How often do you brush your teeth?', 'y-teeth', ['I always …', 'twice a day'], 'I always brush my teeth twice a day.', true],
  ['How often do you take a shower?', 'y-shower', ['I usually …', 'every …'], 'I usually take a shower every evening.', true],
  ['What do you never do?', 'g-dirty', ['I never …'], 'I never eat with dirty hands.', true],
  ['Which hygiene habit should you do more?', 'y-gel', ['I should … more.'], 'I should use hand gel more.', true],
  ['When do you wash your hands?', 'y-hands', ['Before …', 'After …'], 'Before lunch and after the toilet.', true],
  ['You are the doctor. Ask your patient a question.', 'a-doctor', ['What’s the matter?', 'How are you feeling?'], 'What’s the matter? How are you feeling?', true],
  ['Your friend says: “My leg hurts.” Show you care.', 'h-leg', ['I’m sorry.', 'That’s too bad.'], 'That’s too bad. You should go to the school nurse.', true],
  ['What are germs? Say two things.', 'g-germs', ['Germs are …', 'They …'], 'Germs are tiny. They are everywhere.'],
  ['Name an action that stops germs from spreading.', 'a-cover', ['We should …'], 'We should cover our mouth when we cough.', true],
  ['Why is clean water important?', 'c-tap', ['Because …'], 'Because dirty water can make people sick.'],
  ['Tell the story of Mia’s cold. Use First, Next, Last.', 's-better', ['First, …', 'Next, …', 'Last, …'], 'First, Mia has a cold. Next, she rests. Last, she feels better.'],
  ['How can you show kindness to a sick friend?', 'v-kind', ['When I …, I am being kind.'], 'When I make a get-well card, I am being kind.', true],
  ['Why do we get sick? Give your answer.', 'g-everywhere', ['Because …', 'We should …'], 'Because germs spread. We should wash our hands.', true]
].map(([question, image, help, sample, personal], i) => ({ id: `w4-sp-${String(i + 1).padStart(2, '0')}`, question, image, help, sample, ...(personal ? { personal: true } : {}) }));

export const EXAMPLES = [
  ['ex-01', 'a-rest', 'ana', 'rest', 'rest'], ['ex-02', 'a-water', 'sam', 'drink-water', 'drink water'],
  ['ex-03', 'a-doctor', 'leo', 'see-doctor', 'go to the doctor'], ['ex-04', 'a-dentist', 'leo', 'see-dentist', 'go to the dentist'],
  ['ex-05', 'a-nurse', 'mia', 'see-nurse', 'the school nurse'], ['ex-06', 'a-medicine', 'ana', 'take-medicine', 'take medicine'],
  ['ex-07', 'a-tissue', 'mia', 'use-tissue', 'use a tissue'], ['ex-08', 'a-cover', 'ana', 'cover-mouth', 'cover your mouth'],
  ['ex-09', 'a-temperature', 'sam', 'temperature', 'take your temperature'], ['ex-10', 'a-bandage', 'leo', 'bandage', 'put on a bandage'],
  ['ex-11', 'h-cold', 'mia', 'stay-home', 'stay at home'], ['ex-12', 'y-hands', 'ana', 'wash-hands', 'always'],
  ['ex-13', 'y-teeth', 'mia', 'brush-teeth', 'always'], ['ex-14', 'y-hair', 'sam', 'comb-hair', 'usually'],
  ['ex-15', 'y-face', 'leo', 'wash-face', 'usually'], ['ex-16', 'y-gel', 'ana', 'hand-gel', 'sometimes'],
  ['ex-17', 'y-nails', 'leo', 'cut-nails', 'sometimes'], ['ex-18', 'y-shower', 'sam', 'shower', 'usually'],
  ['ex-19', 'y-wipe', 'mia', 'wipe-mouth', 'always'], ['ex-20', 'g-bin', 'ana', 'throw-tissues', 'throw away'],
  ['ex-21', 's-share', 'leo', 'share-drink', 'shouldn’t share'], ['ex-22', 'h-fever', 'ana', 'school-fever', 'shouldn’t go to school'],
  ['ex-23', 'h-leg', 'sam', 'play-football', 'shouldn’t play'], ['ex-24', 'h-toothache', 'leo', 'eat-candy', 'shouldn’t eat candy'],
  ['ex-25', 'h-sneeze', 'ana', 'sneeze-on', 'shouldn’t sneeze on people'], ['ex-26', 'g-dirty', 'sam', 'dirty-hands', 'never'],
  ['ex-27', 'g-everywhere', 'they', 'touch-tissues', 'never'], ['ex-28', 'y-nails', 'they', 'bite-nails', 'never']
].map(([id, image, subject, verb, note]) => ({ id, image, subject, verb, note }));

export const PICTURE_REVEAL = [
  ['h-sore-throat', 'She', 'a sore throat', 'She has a sore throat.'],
  ['h-cough', 'He', 'coughing', 'He is coughing into his elbow.'],
  ['h-stomachache', 'He', 'a stomachache', 'He has a stomachache.'],
  ['h-fever', 'She', 'a fever', 'She has a fever.'],
  ['h-leg', 'He', 'his leg hurts', 'His leg hurts.'],
  ['h-sneeze', 'She', 'sneezing', 'She is sneezing.'],
  ['h-toothache', 'He', 'a toothache', 'He has a toothache.'],
  ['h-earache', 'She', 'an earache', 'She has an earache.'],
  ['h-headache', 'He', 'a headache', 'He has a headache.'],
  ['h-cold', 'She', 'a cold', 'She has a cold.'],
  ['a-dentist', 'He', 'at the dentist', 'He should go to the dentist.'],
  ['a-tissue', 'She', 'a tissue', 'She is using a tissue.'],
  ['a-bandage', 'He', 'a bandage', 'The nurse is putting on a bandage.'],
  ['y-teeth', 'She', 'brushing her teeth', 'She is brushing her teeth.'],
  ['y-hair', 'He', 'combing his hair', 'He is combing his hair.'],
  ['y-face', 'He', 'washing his face', 'He is washing his face.'],
  ['y-gel', 'She', 'hand gel', 'She is using hand gel.'],
  ['y-nails', 'He', 'cutting his nails', 'He is cutting his nails.'],
  ['y-shower', 'He', 'a shower', 'He is taking a shower.'],
  ['y-wipe', 'She', 'wiping her mouth', 'She is wiping her mouth.'],
  ['y-hands', 'She', 'washing her hands', 'She is washing her hands.']
].map(([image, subject, word, sentence]) => ({ image, subject, word, sentence }));

export const QUESTION_DOOR = [
  ['Mia', 'a-rest', 'Mia has a cold. Resting is a good idea.', ['Mia should rest.', 'Mia should rests.', 'Mia shoulds rest.'], 'a', 'Mia should rest.', 'should + rest (no -s).'],
  ['Leo', 's-share', 'Leo is sick. Sharing a drink is a bad idea.', ['Leo should share a drink.', 'Leo shouldn’t share a drink.', 'Leo doesn’t should share a drink.'], 'b', 'Leo shouldn’t share a drink.', 'A bad idea → shouldn’t.'],
  ['you', 'a-doctor', 'You want advice. Ask about the doctor.', ['Should I go to the doctor?', 'I should go to the doctor?', 'Do I should go to the doctor?'], 'a', 'Yes, you should.', 'Should comes first.'],
  ['Ana', 'h-fever', 'Ana has a fever. Ask about school.', ['Should Ana go to school?', 'Should Ana goes to school?', 'Ana should go to school?'], 'a', 'No, she shouldn’t.', 'Should + Ana + go.'],
  ['Sam', 'y-shower', 'Ask about Sam’s shower.', ['How often does Sam take a shower?', 'How often do Sam take a shower?', 'How often does Sam takes a shower?'], 'a', 'He usually takes a shower in the evening.', 'Sam = he → does + take.'],
  ['you', 'y-teeth', 'Ask your friend about their teeth.', ['How often do you brush your teeth?', 'How often does you brush your teeth?', 'How often you brush your teeth?'], 'a', 'I always brush my teeth twice a day.', 'you → do.'],
  ['Mia', 'y-teeth', 'Mia brushes her teeth every time after meals.', ['Mia always brushes her teeth.', 'Mia brushes always her teeth.', 'Always Mia brush her teeth.'], 'a', 'Mia always brushes her teeth.', 'always + brushes.'],
  ['we', 'g-dirty', 'We don’t eat with dirty hands. Not one time!', ['We sometimes eat with dirty hands.', 'We never eat with dirty hands.', 'We eat never with dirty hands.'], 'b', 'We never eat with dirty hands.', 'never = 0%, before the verb.'],
  ['the doctor', 'd-talk', 'The doctor wants to know the problem.', ['What’s the matter?', 'What’s your name?', 'Where’s the matter?'], 'a', 'My throat hurts.', 'What’s the matter? = What is the problem?'],
  ['Ana', 'd-sorry', 'Leo is hurt and sad. Ana is kind.', ['That’s great!', 'That’s too bad.', 'Hooray!'], 'b', 'That’s too bad, Leo. I’m sorry.', 'Show you care.'],
  ['Leo', 'h-earache', 'Leo has an earache.', ['Leo has a earache.', 'Leo has an earache.', 'Leo have an earache.'], 'b', 'Leo has an earache.', 'an + earache · Leo has.'],
  ['Ana', 'a-cover', 'Ana is coughing. Covering her mouth is a good idea.', ['Ana should cover her mouth.', 'Ana should covers her mouth.', 'Ana shouldn’t cover her mouth.'], 'a', 'Ana should cover her mouth.', 'should + cover.']
].map(([who, image, clue, options, answer, reveal, hint], i) => ({ id: `door-${String(i + 1).padStart(2, '0')}`, who, image, clue, options, answer, reveal, hint }));

export const YES_NO = [
  ['a-rest', 'Mia has a cold.', 'Should Mia rest?', ['Yes, she should.', 'No, she shouldn’t.'], 'a', 'Rest helps you get better.'],
  ['h-fever', 'Ana has a fever.', 'Should Ana go to school?', ['Yes, she should.', 'No, she shouldn’t.'], 'b', 'Stay at home with a fever.'],
  ['a-dentist', 'Leo has a toothache.', 'Should Leo go to the dentist?', ['Yes, he should.', 'Yes, he does.'], 'a', 'Should …? → Yes, he should.'],
  ['h-toothache', 'Leo has a toothache.', 'Should Leo eat lots of candy?', ['Yes, he should.', 'No, he shouldn’t.'], 'b', 'Candy is bad for teeth.'],
  ['a-tissue', 'Mia is sneezing.', 'Should Mia use a tissue?', ['Yes, she should.', 'No, she shouldn’t.'], 'a', 'A tissue stops germs.'],
  ['s-share', 'Leo has a cold.', 'Should Leo share his drink?', ['Yes, he should.', 'No, he shouldn’t.'], 'b', 'Germs go from cup to cup.'],
  ['g-dirty', 'Sam has dirty hands.', 'Should Sam eat now?', ['Yes, he should.', 'No, he shouldn’t.'], 'b', 'Wash your hands first!'],
  ['a-cover', 'Ana is coughing.', 'Should Ana cover her mouth?', ['Yes, she should.', 'No, she shouldn’t.'], 'a', 'Cover your mouth when you cough.'],
  ['a-bandage', 'Leo’s knee hurts.', 'Should Leo put on a bandage?', ['Yes, he should.', 'No, he shouldn’t.'], 'a', 'A bandage helps.'],
  ['h-sneeze', 'Ana is sneezing.', 'Should Ana sneeze on her friends?', ['Yes, she should.', 'No, she shouldn’t.'], 'b', 'Use a tissue.'],
  ['y-teeth', 'Mia brushes her teeth every morning and every night.', 'Does Mia always brush her teeth?', ['Yes, she does.', 'No, she doesn’t.'], 'a', 'Every time = always.'],
  ['g-dirty', 'We don’t eat with dirty hands. Not one time.', 'Do we sometimes eat with dirty hands?', ['Yes, we do.', 'No, we don’t.'], 'b', 'Not one time = never.'],
  ['y-shower', 'Sam takes a shower most evenings.', 'Does Sam usually take a shower in the evening?', ['Yes, he does.', 'No, he doesn’t.'], 'a', 'Most times = usually.'],
  ['y-nails', 'Leo cuts his nails once a week.', 'Does Leo cut his nails every day?', ['Yes, he does.', 'No, he doesn’t.'], 'b', 'Once a week, not every day.'],
  ['y-gel', 'Ana uses hand gel at school, but not every day.', 'Does Ana always use hand gel?', ['Yes, she does.', 'No, she doesn’t.'], 'b', 'Not every day = sometimes.'],
  ['g-germs', 'Germs are very small.', 'Can we see germs with our eyes?', ['Yes, we can.', 'No, we can’t.'], 'b', 'They are too small.'],
  ['g-everywhere', 'Germs are on doors, desks and pencils.', 'Are germs everywhere?', ['Yes, they are.', 'No, they aren’t.'], 'a', 'Read the clue.'],
  ['c-tap', 'The village has a new tap with clean water.', 'Is the water from the tap clean?', ['Yes, it is.', 'No, it isn’t.'], 'a', 'Read the clue.'],
  ['c-carry', 'The bottle is big and full of water.', 'Is the bottle heavy?', ['Yes, it is.', 'No, it isn’t.'], 'a', 'Water is heavy.'],
  ['s-better', 'Mia rested for two days. Now she is jumping out of bed.', 'Does Mia feel better?', ['Yes, she does.', 'No, she doesn’t.'], 'a', 'She is jumping and smiling.']
].map(([image, clue, question, options, answer, hint], i) => ({ id: `yn-${String(i + 1).padStart(2, '0')}`, image, clue, question, options, answer, hint }));
