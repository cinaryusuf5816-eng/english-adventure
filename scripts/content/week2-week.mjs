// Week 2 (Present Continuous): everything in week.json except the tables in week2-data.mjs.

export const META = {
  id: 'week-02',
  schemaVersion: 1,
  contentVersion: '1.0.0',
  grammar: 'present-continuous',
  title: 'Present Continuous',
  subtitle: 'What are they doing now?',
  published: true,
  cover: 'cover',
  questionsFile: 'questions.json',
  goals: [
    'I can say what people are doing now.',
    'I can use am, is and are + -ing: I am playing, she is playing, they are playing.',
    "I can say I'm not, isn't and aren't.",
    'I can ask Is …? and Are …? and answer Yes / No.',
    'I can name sports things and places: ball, bat, hoop, goal, racket, net, gym, field, court, pool.'
  ],
  teacherGoals: [
    'Present Continuous for actions happening now (now, at the moment, Look!, Listen!).',
    'am / is / are + verb-ing; -ing spelling: + ing, e goes, double the last letter.',
    "Negatives: I'm not / am not, isn't, aren't + verb-ing.",
    'Am / Is / Are questions, short answers (Yes, she is. / No, they aren\'t.), What are you doing?',
    'Every day (plays) or now (is playing)?'
  ],
  teacherNote: 'This week follows Compass Unit 2 (“Why do we play sports?”): Sports Things and Places (p. 28) + Present Continuous (p. 29). Book words: balls, bat, hoop, goal, racket, net, gym, field, court, pool. All -ing forms come from a checked list. Learn 12 compares Week 1 (every day) and Week 2 (now).',
  characters: [
    { id: 'mia', name: 'Mia', pronoun: 'she', image: 'sp-racket' },
    { id: 'sam', name: 'Sam', pronoun: 'he', image: 'sp-goal' },
    { id: 'pepper', name: 'Pepper', pronoun: 'it', note: 'Pepper is a cat.', image: 'v-sleep' },
    { id: 'rosa', name: 'Ms. Rosa', pronoun: 'she', note: 'Ms. Rosa is a teacher.', image: 'teacher-class' },
    { id: 'leo', name: 'Leo', pronoun: 'he', image: 'sp-bat' },
    { id: 'ana', name: 'Ana', pronoun: 'she', image: 'sp-hoop' }
  ],
  dashboard: {
    tagline: "Let's talk about what is happening now!",
    bubbleLeft: ['Look!', "I'm playing", 'tennis!'],
    bubbleRight: ['She is', 'swimming.', 'We are fast!']
  },
  missions: [
    { id: 'm-learn', text: 'Learn the rules of Present Continuous', check: { section: 'learn', min: 3 } },
    { id: 'm-words', text: 'Learn the new words', check: { section: 'words', min: 1 } },
    { id: 'm-practice', text: 'Complete at least 3 activities', check: { section: 'practise', min: 3 } },
    { id: 'm-challenge', text: 'Try the challenge', check: { section: 'challenge', min: 1 } },
    { id: 'm-proud', text: 'Be proud of yourself!', check: { all: true } }
  ]
};

export const WORDS = [
  { id: 'playing-football', phrase: 'playing football', image: 'play-football', example: 'Sam is playing football now.' },
  { id: 'reading-a-book', phrase: 'reading a book', image: 'read-a-book', example: 'Mia is reading a book.' },
  { id: 'watching-tv', phrase: 'watching TV', image: 'watch-tv', example: 'Sam is watching TV.' },
  { id: 'eating-an-apple', phrase: 'eating an apple', image: 'eat-apples', example: 'Mia is eating an apple.' },
  { id: 'drinking-water', phrase: 'drinking water', image: 'drink-water', example: 'Sam is drinking water.' },
  { id: 'having-breakfast', phrase: 'having breakfast', image: 'have-breakfast', example: 'Mia is having breakfast.' },
  { id: 'doing-homework', phrase: 'doing homework', image: 'do-homework', example: 'Sam is doing his homework.' },
  { id: 'brushing-teeth', phrase: 'brushing teeth', image: 'brush-teeth', example: 'Mia is brushing her teeth.' },
  { id: 'riding-a-bike', phrase: 'riding a bike', image: 'ride-a-bike', example: 'Ana is riding a bike.' },
  { id: 'dancing', phrase: 'dancing', image: 'dance', example: 'Mia and Ana are dancing.' },
  { id: 'playing-chess', phrase: 'playing chess', image: 'play-chess', example: 'Sam and Leo are playing chess.' },
  { id: 'walking-to-school', phrase: 'walking to school', image: 'walk-to-school', example: 'Leo is walking to school.' }
];

export const EXTRA_WORD_SETS = [
  {
    id: 'sports', title: 'Book words: Sports things and places',
    words: [
      { id: 'balls', word: 'balls', phrase: 'balls', image: 'sp-balls', example: 'Mia and Sam are putting the balls in the basket.' },
      { id: 'bat', word: 'bat', phrase: 'a bat', image: 'sp-bat', example: 'Leo is hitting the ball with a bat.' },
      { id: 'hoop', word: 'hoop', phrase: 'a hoop', image: 'sp-hoop', example: 'Ana is throwing the ball into the hoop.' },
      { id: 'goal', word: 'goal', phrase: 'a goal', image: 'sp-goal', example: 'Sam is kicking the ball into the goal.' },
      { id: 'racket', word: 'racket', phrase: 'a racket', image: 'sp-racket', example: 'Mia is playing tennis with a racket.' },
      { id: 'net', word: 'net', phrase: 'a net', image: 'sp-net', example: 'Leo and Ana are playing volleyball over the net.' },
      { id: 'gym', word: 'gym', phrase: 'a gym', image: 'sp-gym', example: 'Mia and Ana are doing exercises in the gym.' },
      { id: 'field', word: 'field', phrase: 'a field', image: 'sp-field', example: 'Mia and Sam are running on the field.' },
      { id: 'court', word: 'court', phrase: 'a court', image: 'sp-court', example: 'Sam and Leo are playing basketball on the court.' },
      { id: 'pool', word: 'pool', phrase: 'a pool', image: 'sp-pool', example: 'Ana is swimming in the pool.' }
    ]
  },
  {
    id: 'a1-verbs', title: 'A1 action verbs + -ing',
    words: [
      ['run', 'running', 'v-run', 'Leo is running in the park.'], ['jump', 'jumping', 'v-jump', 'Ana is jumping.'],
      ['swim', 'swimming', 'v-swim', 'Sam is swimming.'], ['sing', 'singing a song', 'v-sing', 'Mia is singing a song.'],
      ['draw', 'drawing a picture', 'v-draw', 'Ana is drawing a picture.'], ['sleep', 'sleeping', 'v-sleep', 'Pepper is sleeping.'],
      ['write', 'writing a letter', 'v-write', 'Leo is writing a letter.'], ['cook', 'cooking pancakes', 'v-cook', 'Sam is cooking pancakes.'],
      ['clean', 'cleaning my room', 'v-clean', 'Mia is cleaning her room.'], ['wash', 'washing my hands', 'v-wash', 'Leo is washing his hands.'],
      ['climb', 'climbing a tree', 'v-climb', 'Ana is climbing a tree.'], ['fly', 'flying a kite', 'v-fly', 'Sam is flying a kite.'],
      ['catch', 'catching a ball', 'v-catch', 'Leo is catching a ball.'], ['open', 'opening the window', 'v-open', 'Mia is opening the window.'],
      ['listen', 'listening to music', 'v-listen', 'Ana is listening to music.'], ['feed', 'feeding the cat', 'v-feed', 'Sam is feeding the cat.']
    ].map(([w, phrase, image, example]) => ({ id: `a1-${w}`, word: phrase.split(' ')[0], phrase, image, example }))
  }
];

const ex = (text, image, extra = {}) => ({ text, image, ...extra });
const pr = (mode, prompt, image, options, answer, explain) => ({ mode, prompt, image, options, answer, explain });

export const LEARN = [
  {
    id: 'now', title: 'Now! Look! Listen!', rule: 'We use am / is / are + -ing for things that are happening now.', image: 'cover',
    examples: [
      ex('Look! Sam **is playing** football **now**.', 'play-football'),
      ex('Mia **is reading** a book **at the moment**.', 'read-a-book', { label: 'at the moment = now' }),
      ex('Shh! Pepper **is sleeping**.', 'v-sleep', { label: 'Shh! = Be quiet!' }),
      ex('Listen! Mia **is singing**.', 'v-sing'),
      ex('Ana **is riding** a bike **right now**.', 'ride-a-bike'),
      ex('Look! Leo **is running** in the park.', 'v-run'),
      ex('Sam and Leo **are playing** chess **now**.', 'play-chess')
    ],
    practice: [
      pr('together', 'Look! Sam ___ football now.', 'play-football', ['plays', 'is playing'], 'b', 'Now → is playing.'),
      pr('try', 'Shh! Pepper ___.', 'v-sleep', ['is sleeping', 'sleeps'], 'a', 'Shh! It is happening now: is sleeping.')
    ],
    teacherNote: 'Signal words: now, at the moment, right now, Look!, Listen!, Shh! Ask “Is it happening now?” before every sentence.'
  },
  {
    id: 'be-forms', title: 'I am, you are, he is …', rule: 'I → am. He / she / it → is. You / we / they → are.', image: 'teacher-class',
    examples: [
      ex('I **am** reading.', 'read-a-book', { speaker: 'Mia', label: 'I → am' }),
      ex('You **are** dancing!', 'dance', { speaker: 'Sam', label: 'Sam is talking to Mia. you → are' }),
      ex('He **is** playing football.', 'play-football', { label: 'Sam → he → is' }),
      ex('She **is** drawing.', 'v-draw', { label: 'Ana → she → is' }),
      ex('It **is** drinking water.', 'pepper-drinks-water', { label: 'Pepper the cat → it → is' }),
      ex('We **are** reading books.', 'we-read', { speaker: 'Mia', label: 'Mia and Sam → we → are' }),
      ex('They **are** watching TV.', 'they-watch-tv', { label: 'Mia and Sam → they → are' })
    ],
    groups: [{ label: 'am', words: ['I'] }, { label: 'is', words: ['he', 'she', 'it', 'Sam', 'Mia', 'Pepper'] }, { label: 'are', words: ['you', 'we', 'they', 'Mia and Sam'] }],
    practice: [
      pr('together', 'Mia ___ singing.', 'v-sing', ['is', 'are'], 'a', 'Mia = she → is.'),
      pr('try', 'They ___ watching TV.', 'they-watch-tv', ['is', 'are'], 'b', 'they → are.')
    ],
    teacherNote: 'This is the same am / is / are pupils know from “I am happy.” Now it is a helper: am / is / are + -ing.'
  },
  {
    id: 'positive-he-she-it', title: 'He / she / it + is + -ing', rule: 'He, she, it (one person or thing) + is + verb-ing.', image: 'v-swim',
    examples: [
      { machine: { subject: 'he', verb: 'a1-swim', to: 'positive-ing' } },
      { machine: { subject: 'she', verb: 'ride-bike', to: 'positive-ing' } },
      ex('Sam **is swimming**.', 'v-swim'),
      ex('Mia **is opening** the window.', 'v-open'),
      ex('Leo **is writing** a letter.', 'v-write'),
      ex('Ana **is climbing** a tree.', 'v-climb'),
      ex('Pepper **is playing** with a ball.', 'pepper-plays', { label: 'Pepper → it → is' })
    ],
    practice: [
      pr('together', 'Leo ___ a ball.', 'v-catch', ['is catching', 'are catching'], 'a', 'Leo = he → is catching.'),
      pr('try', 'Ana ___ to music.', 'v-listen', ['is listen', 'is listening'], 'b', 'is + listening.')
    ],
    teacherNote: 'Two parts every time: is + verb-ing. Pupils often forget one part (“He swimming.” / “He is swim.”). Point to both blocks in the machine.'
  },
  {
    id: 'positive-i-you-we-they', title: 'I am / you, we, they are + -ing', rule: 'I + am + verb-ing. You / we / they + are + verb-ing.', image: 'they-play-football',
    examples: [
      { machine: { subject: 'I', verb: 'read-a-book', to: 'positive-ing' } },
      { machine: { subject: 'they', verb: 'play-chess', to: 'positive-ing' } },
      ex('I **am cooking** pancakes.', 'v-cook', { speaker: 'Sam' }),
      ex('You **are drawing** a picture!', 'v-draw', { speaker: 'Mia', label: 'Mia is talking to Ana.' }),
      ex('We **are dancing**.', 'dance', { speaker: 'Ana' }),
      ex('They **are playing** football.', 'they-play-football'),
      ex('Mia and Sam **are watching** TV.', 'they-watch-tv', { label: 'Mia and Sam = they' })
    ],
    practice: [
      pr('together', 'I ___ water.', 'drink-water', ['am drinking', 'is drinking'], 'a', 'I → am drinking.'),
      pr('try', 'Sam and Leo ___ chess.', 'play-chess', ['is playing', 'are playing'], 'b', 'Sam and Leo = they → are playing.')
    ],
    teacherNote: 'Short forms are fine and common in speaking: I\'m, you\'re, we\'re, they\'re. The site accepts both “I am” and “I\'m”.'
  },
  {
    id: 'spelling', title: 'playing, riding, swimming', rule: 'Look at the end of the verb before you add -ing.', image: 'v-run',
    examples: [
      ex('He is play**ing**.', 'play-football', { from: 'play', label: 'play → playing (+ ing)' }),
      ex('She is read**ing**.', 'read-a-book', { from: 'read', label: 'read → reading (+ ing)' }),
      ex('Ana is rid**ing** a bike.', 'ride-a-bike', { from: 'ride', label: 'ride → riding (the e goes)' }),
      ex('Leo is writ**ing** a letter.', 'v-write', { from: 'write', label: 'write → writing (the e goes)' }),
      ex('Sam is swim**ming**.', 'v-swim', { from: 'swim', label: 'swim → swimming (double m)' }),
      ex('Leo is run**ning** in the park.', 'v-run', { from: 'run', label: 'run → running (double n)' }),
      ex('Mia is hav**ing** breakfast.', 'have-breakfast', { from: 'have', label: 'have → having (the e goes)' })
    ],
    groups: [
      { label: '+ ing', words: ['playing', 'reading', 'eating', 'watching', 'singing', 'flying'] },
      { label: 'the e goes', words: ['riding', 'writing', 'dancing', 'having'] },
      { label: 'double', words: ['running', 'swimming', 'getting', 'putting', 'hitting'] }
    ],
    practice: [
      pr('together', 'Leo is ___ in the park.', 'v-run', ['runing', 'running'], 'b', 'run → running (double n).'),
      pr('try', 'Ana is ___ a bike.', 'ride-a-bike', ['riding', 'rideing'], 'a', 'ride → riding (the e goes).')
    ],
    teacherNote: 'All forms come from a checked list. Short verbs with one vowel + one consonant double the last letter (run, swim, get, put, hit, sit). Verbs ending in -e drop the e (ride, write, dance, have). play, fly: just + ing.'
  },
  {
    id: 'isnt', title: "He / she / it + isn't + -ing", rule: "He, she, it + isn't (is not) + verb-ing.", image: 'watch-tv',
    examples: [
      { machine: { subject: 'he', verb: 'watch-tv', to: 'negative' } },
      { machine: { subject: 'mia', verb: 'a1-sing', to: 'negative' } },
      ex("Sam **isn't** sleeping. He is playing football.", 'play-football'),
      ex("Mia **isn't** watching TV. She is reading.", 'read-a-book'),
      ex("Pepper **isn't** playing. It is sleeping.", 'v-sleep', { label: 'Pepper → it' }),
      ex("Ana **isn't** walking. She is riding a bike.", 'ride-a-bike'),
      ex('Leo **is not** swimming. He is running.', 'v-run', { label: "is not = isn't" })
    ],
    practice: [
      pr('together', 'Sam ___ watching TV.', 'play-football', ["isn't", "aren't"], 'a', "Sam = he → isn't."),
      pr('try', "Mia isn't ___ .", 'read-a-book', ['sing', 'singing'], 'b', "isn't + singing.")
    ],
    teacherNote: "The -ing stays after isn't. Compare Week 1: “He doesn't play” (no -ing) and Week 2: “He isn't playing” (with -ing)."
  },
  {
    id: 'arent', title: "I'm not / you, we, they aren't", rule: "I + am not ('m not). You / we / they + aren't (are not) + verb-ing.", image: 'they-watch-tv',
    examples: [
      { machine: { subject: 'I', verb: 'watch-tv', to: 'negative' } },
      { machine: { subject: 'they', verb: 'play-football', to: 'negative' } },
      ex("I**'m not** sleeping! I am reading.", 'sam-reads', { speaker: 'Sam', label: "I'm not = I am not" }),
      ex("We **aren't** watching TV. We are reading.", 'we-read', { speaker: 'Mia' }),
      ex("They **aren't** swimming. They are dancing.", 'dance', { label: 'Mia and Ana → they' }),
      ex("You **aren't** listening!", 'teacher-class', { speaker: 'Ms. Rosa' }),
      ex("Sam and Leo **aren't** playing football. They are playing chess.", 'play-chess')
    ],
    practice: [
      pr('together', 'I ___ sleeping!', 'sam-reads', ['am not', "isn't"], 'a', 'I → am not.'),
      pr('try', 'Mia and Ana ___ swimming.', 'dance', ["isn't", "aren't"], 'b', "Mia and Ana = they → aren't.")
    ],
    teacherNote: "There is no short form “amn't”. Pupils can say “I'm not” or “I am not”."
  },
  {
    id: 'questions', title: 'Is he …? Are they …?', rule: 'Put am / is / are first. The -ing verb stays.', image: 'sp-court',
    examples: [
      { machine: { subject: 'he', verb: 'play-football', to: 'question' } },
      { machine: { subject: 'they', verb: 'sp-basketball', to: 'question' } },
      ex('**Is** Mia reading?', 'read-a-book', { label: 'Mia is reading. → Is Mia reading?' }),
      ex('**Is** Pepper sleeping?', 'v-sleep'),
      ex('**Are** you listening?', 'teacher-class', { speaker: 'Ms. Rosa' }),
      ex('**Are** Sam and Leo playing basketball?', 'sp-court'),
      ex('**Am** I dancing well?', 'dance', { speaker: 'Mia' })
    ],
    practice: [
      pr('together', '___ Ana swimming?', 'sp-pool', ['Is', 'Are'], 'a', 'Ana = she → Is.'),
      pr('try', '___ they playing volleyball?', 'sp-net', ['Is', 'Are'], 'b', 'they → Are.')
    ],
    teacherNote: 'No do / does in these questions! “Does she playing?” is a common mix-up after Week 1.'
  },
  {
    id: 'short-answers', title: "Yes, she is. / No, they aren't.", rule: "Is she playing? Yes, she is. No, she isn't.", image: 'teacher-class',
    examples: [
      { q: 'Are you reading?', a: 'Yes, I **am**.', qSpeaker: 'Ms. Rosa', aSpeaker: 'Mia', image: 'read-a-book', label: 'you → I' },
      { q: 'Are you sleeping?', a: "No, I**'m not**.", qSpeaker: 'Mia', aSpeaker: 'Sam', image: 'sam-reads' },
      { q: 'Is Sam swimming?', a: 'Yes, he **is**.', image: 'v-swim' },
      { q: 'Is Mia watching TV?', a: "No, she **isn't**.", image: 'v-sing' },
      { q: 'Are they dancing?', a: 'Yes, they **are**.', image: 'dance' },
      { q: 'Is Pepper eating?', a: "No, it **isn't**.", image: 'v-sleep' },
      { q: 'Are you and Sam reading?', a: 'Yes, we **are**.', qSpeaker: 'Ms. Rosa', aSpeaker: 'Mia', image: 'we-read', label: 'you and Sam → we' }
    ],
    practice: [
      pr('together', 'Is Leo catching a ball?', 'v-catch', ['Yes, he is.', 'Yes, he does.', 'Yes, he catching.'], 'a', 'Yes, he is.'),
      pr('try', 'Ms. Rosa asks Ana: “Are you drawing?” Ana is drawing. Ana says:', 'v-draw', ['Yes, I am.', 'Yes, you are.'], 'a', 'Ana talks about Ana: Yes, I am.')
    ],
    teacherNote: 'Short answers use only am / is / are — no -ing: “Yes, she is.” not “Yes, she is playing.” (that is a full answer, also fine in speaking).'
  },
  {
    id: 'wh-questions', title: 'What are you doing?', rule: 'What / Where / Who + is / are + … + -ing?', image: 'sp-field',
    examples: [
      { q: 'What are you doing?', a: 'I am **cooking** pancakes.', qSpeaker: 'Mia', aSpeaker: 'Sam', image: 'v-cook' },
      { q: 'What is Leo doing?', a: 'He is **writing** a letter.', image: 'v-write' },
      { q: 'What is Ana playing?', a: 'She is playing **basketball**.', image: 'sp-hoop' },
      { q: 'Where are Mia and Sam running?', a: 'They are running **on the field**.', image: 'sp-field' },
      { q: 'Where is Ana swimming?', a: '**In the pool.**', image: 'sp-pool' },
      { q: 'Who is singing?', a: '**Mia** is singing.', image: 'v-sing' },
      { q: 'What are they doing?', a: 'They are **playing chess**.', image: 'play-chess' }
    ],
    practice: [
      pr('together', 'What ___ Sam doing?', 'v-fly', ['is', 'are', 'does'], 'a', 'Sam = he → What is Sam doing?'),
      pr('try', 'What are they doing?', 'dance', ['They are dancing.', 'They dance.', 'Yes, they are.'], 'a', 'They are dancing.')
    ],
    teacherNote: 'A very useful classroom question: “What are you doing?” Use it all week with real actions in class.'
  },
  {
    id: 'sports-words', title: 'Book words: ball, bat, hoop, goal …', rule: 'Sports things and places from the book (Unit 2, p. 28).', image: 'cover',
    examples: [
      ex('Leo is hitting the ball with a **bat**.', 'sp-bat'),
      ex('Ana is throwing the ball into the **hoop**.', 'sp-hoop'),
      ex('Sam is kicking the ball into the **goal**.', 'sp-goal'),
      ex('Mia is playing tennis with a **racket**.', 'sp-racket'),
      ex('Leo and Ana are playing volleyball over the **net**.', 'sp-net'),
      ex('Mia and Ana are doing exercises in the **gym**.', 'sp-gym'),
      ex('Sam and Leo are playing basketball on the **court**.', 'sp-court'),
      ex('Mia and Sam are running on the **field**.', 'sp-field'),
      ex('Ana is swimming in the **pool**.', 'sp-pool'),
      ex('Mia and Sam are putting the **balls** in the basket.', 'sp-balls')
    ],
    groups: [{ label: 'things', words: ['balls', 'bat', 'hoop', 'goal', 'racket', 'net'] }, { label: 'places', words: ['gym', 'field', 'court', 'pool'] }],
    practice: [
      pr('together', 'Mia is playing tennis with a ___.', 'sp-racket', ['racket', 'bat'], 'a', 'Tennis → racket.'),
      pr('try', 'Ana is swimming in the ___.', 'sp-pool', ['court', 'pool'], 'b', 'We swim in a pool.')
    ],
    teacherNote: 'Things: balls, bat, hoop, goal, racket, net. Places: gym, field, court, pool. Ask “Where …?” for places and “What is he using?” for things.'
  },
  {
    id: 'every-day-or-now', title: 'Every day or now?', rule: 'Every day → plays (Week 1). Now → is playing (Week 2).', image: 'play-football',
    examples: [
      ex('Sam **plays** football every Saturday.', 'play-football', { calendar: [0, 0, 0, 0, 0, 1, 0], label: 'every Saturday → plays' }),
      ex('Look! Sam **is playing** football **now**.', 'play-football', { label: 'now → is playing' }),
      ex('Mia **reads** every evening.', 'read-a-book', { label: 'every evening → reads' }),
      ex('Shh! Mia **is reading** now.', 'read-a-book', { label: 'now → is reading' }),
      ex('Ana **swims** on Mondays.', 'sp-pool', { calendar: [1, 0, 0, 0, 0, 0, 0] }),
      ex('Ana **is swimming** at the moment.', 'sp-pool'),
      ex("Pepper **doesn't** go to school. Now it **is sleeping**.", 'v-sleep')
    ],
    practice: [
      pr('together', 'Leo ___ football every Sunday.', 'they-play-football', ['plays', 'is playing'], 'a', 'every Sunday → plays.'),
      pr('try', 'Look! Leo ___ a ball now.', 'v-catch', ['catches', 'is catching'], 'b', 'Look! … now → is catching.')
    ],
    teacherNote: 'Every day, every Saturday, on Mondays → Present Simple. Now, at the moment, Look!, Listen! → Present Continuous.'
  },
  {
    id: 'compare', title: '+  −  ?', rule: 'One idea, three sentences.', image: 'cover',
    examples: [
      { machine: { subject: 'sam', verb: 'sp-goal', to: 'all' } },
      { rows: ['He is playing football.', "He **isn't** playing football.", '**Is** he playing football?'], image: 'play-football' },
      { rows: ['They are watching TV.', "They **aren't** watching TV.", '**Are** they watching TV?'], image: 'they-watch-tv' },
      { rows: ['She is riding a bike.', "She **isn't** riding a bike.", '**Is** she riding a bike?'], image: 'ride-a-bike' },
      { rows: ["I'm swimming.", "I'**m not** swimming.", '**Am** I swimming?'], image: 'v-swim' },
      { rows: ['Leo is hitting the ball.', "Leo **isn't** hitting the ball.", '**Is** Leo hitting the ball?'], image: 'sp-bat' },
      { rows: ['We are doing exercises.', "We **aren't** doing exercises.", '**Are** we doing exercises?'], image: 'sp-gym' }
    ],
    practice: [
      pr('together', 'She is singing. Which is the question?', 'v-sing', ['Is she singing?', 'Does she singing?', 'She is singing?'], 'a', 'Is she singing?'),
      pr('try', 'They are running. Which is the negative?', 'sp-field', ["They aren't running.", "They don't running.", "They isn't running."], 'a', "They aren't running.")
    ],
    teacherNote: 'Same three moves every time: + (am / is / are + -ing) · − (add not) · ? (am / is / are goes first).'
  }
];

export const SPEAKING = [
  ['What are you doing now?', 'teacher-class', ['I am …', "I'm …"], "I'm sitting in class. I'm learning English.", true],
  ['Are you sitting?', 'teacher-class', ['Yes, I am.', "No, I'm not."], 'Yes, I am.', true],
  ['Is your teacher writing?', 'teacher-class', ['Yes, she is.', "No, she isn't.", 'Yes, he is.', "No, he isn't."], 'Yes, she is. She is writing on the board.', true],
  ['What is Sam doing?', 'sp-goal', ['He is …'], 'He is kicking the ball into the goal.'],
  ['What is Mia doing?', 'sp-racket', ['She is …'], 'She is playing tennis with a racket.'],
  ['Is Leo swimming?', 'sp-bat', ["No, he isn't.", 'He is …'], "No, he isn't. He is hitting the ball with a bat."],
  ['Where is Ana swimming?', 'sp-pool', ['She is swimming in the …'], 'She is swimming in the pool.'],
  ['What are Sam and Leo playing?', 'sp-court', ['They are playing …'], 'They are playing basketball on the court.'],
  ['Are Mia and Ana dancing?', 'sp-gym', ["No, they aren't.", 'They are …'], "No, they aren't. They are doing exercises in the gym."],
  ['Is Pepper playing?', 'v-sleep', ["No, it isn't.", 'It is …'], "No, it isn't. It is sleeping."],
  ['What are you wearing today?', 'teacher-class', ["I'm wearing …"], "I'm wearing a blue T-shirt.", true],
  ['Look out of the window. What is happening?', 'v-open', ['A bird is …', 'People are …'], 'A bird is flying. Some people are walking.', true],
  ['Mime an action. Your friends ask: “Are you …ing?”', 'v-jump', ['Are you jumping?', 'Yes, I am.', "No, I'm not."], 'Are you swimming? No, I\'m not. Are you jumping? Yes, I am!', true],
  ['What is Ana doing?', 'sp-hoop', ['She is …'], 'She is throwing the ball into the hoop.'],
  ['Is Sam cooking?', 'v-cook', ['Yes, he is.', "No, he isn't."], 'Yes, he is. He is cooking pancakes.'],
  ['What are Leo and Ana playing?', 'sp-net', ['They are playing …'], 'They are playing volleyball over the net.'],
  ['What is your family doing now, do you think?', 'we-read', ['My mum is …', 'My brother is …'], 'My mum is working. My brother is playing.', true],
  ['Every day or now? Say two sentences about Sam.', 'play-football', ['Sam plays … every …', 'Now he is …'], 'Sam plays football every Saturday. Now he is playing football.']
].map(([question, image, help, sample, personal], i) => ({ id: `w2-sp-${String(i + 1).padStart(2, '0')}`, question, image, help, sample, ...(personal ? { personal: true } : {}) }));

export const EXAMPLES = [
  ['ex-01', 'play-football', 'sam', 'play-football', 'play → playing'], ['ex-02', 'read-a-book', 'mia', 'read-a-book', 'read → reading'],
  ['ex-03', 'they-watch-tv', 'they', 'watch-tv', 'they → are'], ['ex-04', 'v-swim', 'sam', 'a1-swim', 'swim → swimming'],
  ['ex-05', 'ride-a-bike', 'ana', 'ride-bike', 'ride → riding'], ['ex-06', 'v-run', 'leo', 'a1-run', 'run → running'],
  ['ex-07', 'v-write', 'leo', 'a1-write', 'write → writing'], ['ex-08', 'v-sleep', 'pepper', 'a1-sleep', 'Pepper → it → is'],
  ['ex-09', 'dance', 'we', 'dance', 'we → are'], ['ex-10', 'v-cook', 'I', 'a1-cook', 'I → am'],
  ['ex-11', 'sp-goal', 'sam', 'sp-goal', 'goal'], ['ex-12', 'sp-hoop', 'ana', 'sp-hoop', 'hoop'],
  ['ex-13', 'sp-bat', 'leo', 'sp-bat', 'hit → hitting'], ['ex-14', 'sp-racket', 'mia', 'sp-tennis', 'racket'],
  ['ex-15', 'sp-court', 'they', 'sp-basketball', 'court'], ['ex-16', 'sp-gym', 'they', 'sp-gym', 'gym'],
  ['ex-17', 'sp-pool', 'she', 'sp-pool', 'pool'], ['ex-18', 'sp-balls', 'they', 'sp-balls', 'put → putting'],
  ['ex-19', 'have-breakfast', 'mia', 'have-breakfast', 'have → having'], ['ex-20', 'brush-teeth', 'she', 'brush-teeth', 'her teeth'],
  ['ex-21', 'v-fly', 'he', 'a1-fly', 'fly → flying'], ['ex-22', 'get-up', 'sam', 'get-up', 'get → getting']
].map(([id, image, subject, verb, note]) => ({ id, image, subject, verb, note }));

export const PICTURE_REVEAL = [
  ['sp-goal', 'He', 'kicking the ball into the goal', 'He is kicking the ball into the goal.'],
  ['sp-racket', 'She', 'playing tennis', 'She is playing tennis.'],
  ['sp-bat', 'He', 'hitting the ball', 'He is hitting the ball.'],
  ['sp-hoop', 'She', 'throwing the ball', 'She is throwing the ball into the hoop.'],
  ['sp-pool', 'She', 'swimming', 'She is swimming in the pool.'],
  ['sp-court', 'They', 'playing basketball', 'They are playing basketball.'],
  ['sp-net', 'They', 'playing volleyball', 'They are playing volleyball.'],
  ['sp-gym', 'They', 'doing exercises', 'They are doing exercises in the gym.'],
  ['play-football', 'He', 'playing football', 'He is playing football.'],
  ['read-a-book', 'She', 'reading a book', 'She is reading a book.'],
  ['v-cook', 'He', 'cooking pancakes', 'He is cooking pancakes.'],
  ['v-climb', 'She', 'climbing a tree', 'She is climbing a tree.'],
  ['v-sleep', 'It', 'sleeping', 'It is sleeping.'],
  ['dance', 'They', 'dancing', 'They are dancing.'],
  ['v-fly', 'He', 'flying a kite', 'He is flying a kite.'],
  ['brush-teeth', 'She', 'brushing her teeth', 'She is brushing her teeth.']
].map(([image, subject, word, sentence]) => ({ image, subject, word, sentence }));

export const QUESTION_DOOR = [
  ['Sam', 'sp-goal', 'Sam is kicking the ball.', ['Is Sam kicking the ball?', 'Are Sam kicking the ball?', 'Does Sam kicking the ball?'], 'a', 'Yes, he is.', 'Sam = he → Is. Keep kicking.'],
  ['Mia', 'sp-racket', 'Mia is playing tennis.', ['Does Mia play tennis now?', 'Is Mia playing tennis?', 'Is Mia play tennis?'], 'b', 'Yes, she is.', 'Mia = she → Is … playing?'],
  ['Mia and Sam', 'they-watch-tv', 'Mia and Sam are watching TV.', ['Is they watching TV?', 'Are they watching TV?'], 'b', 'Yes, they are.', 'Mia and Sam = they → Are.'],
  ['Pepper', 'v-sleep', 'Pepper is sleeping.', ['Is Pepper sleeping?', 'Is Pepper sleep?', 'Are Pepper sleeping?'], 'a', 'Yes, it is.', 'Pepper = it → Is … sleeping?'],
  ['you', 'teacher-class', 'Ask Sam about now: listen.', ['Are you listening, Sam?', 'Is you listening, Sam?', 'Do you listening, Sam?'], 'a', 'Yes, I am.', 'you → Are.'],
  ['Leo', 'sp-bat', 'Leo is hitting the ball.', ['Is Leo hiting the ball?', 'Is Leo hitting the ball?'], 'b', 'Yes, he is.', 'hit → hitting (double t).'],
  ['Ana', 'sp-pool', 'Ana is swimming.', ['Is Ana swimming?', 'Is Ana swiming?', 'Are Ana swimming?'], 'a', 'Yes, she is.', 'swim → swimming (double m).'],
  ['Sam and Leo', 'sp-court', 'Sam and Leo are playing basketball.', ['Are Sam and Leo playing basketball?', 'Is Sam and Leo playing basketball?', 'Do Sam and Leo playing basketball?'], 'a', 'Yes, they are.', 'Two people → Are.'],
  ['Ana', 'ride-a-bike', 'Ana is riding a bike.', ['Is Ana rideing a bike?', 'Is Ana riding a bike?'], 'b', 'Yes, she is.', 'ride → riding (the e goes).'],
  ['Sam', 'sp-goal', 'What is Sam doing?', ['What is Sam doing?', 'What are Sam doing?', 'What does Sam doing?'], 'a', 'He is kicking the ball into the goal.', 'Sam = he → What is … doing?']
].map(([who, image, clue, options, answer, reveal, hint], i) => ({ id: `door-${String(i + 1).padStart(2, '0')}`, who, image, clue, options, answer, reveal, hint }));

export const YES_NO = [
  ['sp-goal', 'Sam is kicking the ball into the goal.', 'Is Sam kicking the ball?', ['Yes, he is.', 'Yes, he does.', "No, he isn't."], 'a', 'Sam = he. Look at the clue.'],
  ['sp-racket', "Mia is playing tennis. She isn't swimming.", 'Is Mia swimming?', ['Yes, she is.', "No, she isn't.", "No, she doesn't."], 'b', 'Read: She isn\'t swimming.'],
  ['they-watch-tv', 'Mia and Sam are watching TV.', 'Are Mia and Sam watching TV?', ['Yes, they are.', 'Yes, they is.', "No, they aren't."], 'a', 'Mia and Sam = they.'],
  ['v-sleep', 'Pepper is sleeping on a cushion.', 'Is Pepper eating?', ["No, it isn't.", "No, it aren't.", 'Yes, it is.'], 'a', 'Pepper = it. It is sleeping.'],
  ['sp-bat', 'Leo is hitting the ball with a bat.', 'Is Leo playing tennis?', ['Yes, he is.', "No, he isn't.", "No, he doesn't."], 'b', 'A bat is not for tennis.'],
  ['sp-pool', 'Ana is swimming in the pool.', 'Is Ana swimming?', ['Yes, she is.', 'Yes, she swimming.', "No, she isn't."], 'a', 'Short answer: Yes, she is.'],
  ['sp-court', 'Sam and Leo are playing basketball on the court.', 'Are they playing football?', ['Yes, they are.', "No, they aren't.", "No, they isn't."], 'b', 'They are playing basketball.'],
  ['sp-gym', 'Mia and Ana are doing exercises in the gym.', 'Are Mia and Ana in the gym?', ['Yes, they are.', 'Yes, they do.', "No, they aren't."], 'a', 'Read the clue.'],
  ['v-cook', 'Sam is cooking pancakes.', 'Is Sam cooking?', ['Yes, he is.', 'Yes, he cooks.', "No, he isn't."], 'a', 'Sam = he.'],
  ['dance', "Mia and Ana are dancing. They aren't singing.", 'Are they singing?', ["No, they aren't.", 'Yes, they are.', "No, they don't."], 'a', "Read: They aren't singing."],
  ['v-climb', 'Ana is climbing a tree.', 'Is Ana climbing a tree?', ['Yes, she is.', 'Yes, she climbs.', "No, she isn't."], 'a', 'Ana = she.'],
  ['v-write', 'Leo is writing a letter.', 'Is Leo reading?', ["No, he isn't.", 'Yes, he is.', "No, he aren't."], 'a', 'He is writing, not reading.'],
  ['sp-net', 'Leo and Ana are playing volleyball over the net.', 'Are Leo and Ana playing volleyball?', ['Yes, they are.', "No, they aren't.", 'Yes, they is.'], 'a', 'Two people → they are.'],
  ['sp-field', 'Mia and Sam are running on the field.', 'Are they running in the pool?', ['Yes, they are.', "No, they aren't.", "No, they isn't."], 'b', 'They are running on the field.'],
  ['v-fly', 'Sam is flying a kite on a hill.', 'Is Sam flying a kite?', ['Yes, he is.', 'Yes, he does.', "No, he isn't."], 'a', 'Sam = he.'],
  ['brush-teeth', 'Mia is brushing her teeth.', 'Is Mia having breakfast?', ['Yes, she is.', "No, she isn't.", "No, she don't."], 'b', 'She is brushing her teeth.'],
  ['teacher-class', 'Ms. Rosa asks Sam: “Are you listening?” Sam is listening.', 'Sam says:', ['Yes, I am.', 'Yes, you are.', 'Yes, he is.'], 'a', 'Sam talks about Sam → I.'],
  ['we-read', 'Ms. Rosa asks Mia: “Are you and Sam reading?” They are reading.', 'Mia says:', ['Yes, we are.', 'Yes, they are.', 'Yes, I am.'], 'a', 'you and Sam → we.'],
  ['sp-hoop', 'Ana is throwing the ball into the hoop.', 'Is Ana throwing the ball?', ['Yes, she is.', "No, she isn't.", 'Yes, she does.'], 'a', 'Ana = she.'],
  ['v-listen', 'Ana is listening to music.', 'Is Ana sleeping?', ['Yes, she is.', "No, she isn't.", "No, she doesn't."], 'b', 'She is listening to music.']
].map(([image, clue, question, options, answer, hint], i) => ({ id: `yn-${String(i + 1).padStart(2, '0')}`, image, clue, question, options, answer, hint }));
