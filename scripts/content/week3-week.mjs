// Week 3 (Wh- questions + prepositions of movement): everything in week.json except the tables in week3-data.mjs.
// Book topics and target words only; every sentence here is our own.

export const META = {
  id: 'week-03',
  schemaVersion: 1,
  contentVersion: '1.0.0',
  grammar: 'wh-questions',
  wordsTitle: 'Moving: over, under, around …',
  title: 'Wh- Questions',
  subtitle: 'Who? What? Where? When? How? Why?',
  published: true,
  cover: 'cover',
  questionsFile: 'questions.json',
  goals: [
    'I can ask with Who, What, Where, When, How and Why.',
    'I can answer: a person, a thing, a place, a time, a way, a reason.',
    'I can say how people move: over, under, around, through, up, down, across, past, into, out of, between.',
    'I can name parts of my body: heart, lungs, brain, bones, muscles.',
    'I can name sports and activities and say how they help my body.',
    'I can bounce back when something is difficult.'
  ],
  teacherGoals: [
    'Question words ask for information: Who = person, What = thing, Where = place, When = time, How = way, Why = reason.',
    'Word order: Wh- + am / is / are + subject + verb-ing. Who + is + verb-ing (no new order). Also Wh- + do / does + subject + verb.',
    'Why … ? → Because …',
    'Prepositions of movement with a verb: run around, climb through, jump over, go up / down, walk across, crawl under, jump into, step out of, run past, run between.',
    'Reading words: heart, lungs, brain, bones, muscles, energy, relaxed, tired, strong, stretch, breathe, push, pull, exercise plan, short break.',
    'Resilience: keep trying, learn from mistakes, stay positive, ask for help.'
  ],
  teacherNote: 'This week follows Compass Unit 2, pages 36–43: Sports and Activities (36), Wh- Questions (37), the reading about keeping the body strong (38–39), Prepositions of Movement (40), everyday ways to move (41), bouncing back (42) and the unit reflection (43). All sentences and the four short readings are written for this site; only the topic and target words come from the book.',
  characters: [
    { id: 'mia', name: 'Mia', pronoun: 'she', image: 'prep-across' },
    { id: 'sam', name: 'Sam', pronoun: 'he', image: 'prep-down' },
    { id: 'leo', name: 'Leo', pronoun: 'he', image: 'prep-over' },
    { id: 'ana', name: 'Ana', pronoun: 'she', image: 'prep-up' },
    { id: 'pepper', name: 'Pepper', pronoun: 'it', note: 'Pepper is a cat.', image: 'v-sleep' },
    { id: 'rosa', name: 'Ms. Rosa', pronoun: 'she', note: 'Ms. Rosa is a teacher.', image: 'teacher-class' }
  ],
  dashboard: {
    tagline: "Let's ask questions and move our bodies!",
    bubbleLeft: ['Who is', 'running?', 'Sam is!'],
    bubbleRight: ['Where?', 'Over the', 'hurdles!']
  },
  missions: [
    { id: 'm-learn', text: 'Learn the six question words', check: { section: 'learn', min: 3 } },
    { id: 'm-words', text: 'Learn the new words', check: { section: 'words', min: 1 } },
    { id: 'm-practice', text: 'Complete at least 3 activities', check: { section: 'practise', min: 3 } },
    { id: 'm-challenge', text: 'Try the challenge', check: { section: 'challenge', min: 1 } },
    { id: 'm-proud', text: 'Be proud of yourself!', check: { all: true } }
  ]
};

const w = (id, phrase, image, example) => ({ id, word: phrase, phrase, image, example });

export const WORDS = [
  w('around', 'around', 'prep-around', 'Sam is running around the cone.'),
  w('through', 'through', 'prep-through', 'Mia is climbing through the hoop.'),
  w('over', 'over', 'prep-over', 'Leo is jumping over the hurdles.'),
  w('up', 'up', 'prep-up', 'Ana is climbing up the ladder.'),
  w('down', 'down', 'prep-down', 'Sam is sliding down the slide.'),
  w('across', 'across', 'prep-across', 'Mia is walking across the bridge.'),
  w('under', 'under', 'prep-under', 'Leo is crawling under the bench.'),
  w('into', 'into', 'prep-into', 'Ana is jumping into the sandbox.'),
  w('out-of', 'out of', 'prep-out', 'Sam is stepping out of the sandbox.'),
  w('past', 'past', 'prep-past', 'Leo is running past the goal.'),
  w('between', 'between', 'prep-between', 'Mia is running between the trees.'),
  w('obstacle-course', 'an obstacle course', 'cover', 'The children are moving along an obstacle course.')
];

export const EXTRA_WORD_SETS = [
  {
    id: 'course', title: 'Obstacle course: things',
    words: [
      w('cone', 'a cone', 'prep-around', 'The cone is orange. Sam is running around it.'),
      w('hoop', 'a hoop', 'prep-through', 'The hoop is big. Mia is climbing through it.'),
      w('hurdles', 'hurdles', 'prep-over', 'The hurdles are red and white. Leo is jumping over them.'),
      w('ladder', 'a ladder', 'prep-up', 'The ladder is tall. Ana is climbing up it.'),
      w('slide', 'a slide', 'prep-down', 'The slide is red. Sam is sliding down it.'),
      w('bridge', 'a bridge', 'prep-across', 'The bridge is small. Mia is walking across it.'),
      w('bench', 'a bench', 'prep-under', 'The bench is low. Leo is crawling under it.'),
      w('sandbox', 'a sandbox', 'prep-into', 'The sandbox is full of sand. Ana is jumping into it.'),
      w('goal', 'a goal', 'prep-past', 'The goal has a white net. Leo is running past it.'),
      w('trees', 'trees', 'prep-between', 'The trees are very big. Mia is running between them.')
    ]
  },
  {
    id: 'sports', title: 'Book words: Sports and activities',
    words: [
      w('do-gymnastics', 'do gymnastics', 'act-gymnastics', 'Mia is doing gymnastics.'),
      w('play-baseball', 'play baseball', 'sp-bat', 'Leo is playing baseball.'),
      w('bounce-a-ball', 'bounce a ball', 'act-bounce', 'Ana is bouncing a ball.'),
      w('do-karate', 'do karate', 'act-karate', 'Leo is doing karate.'),
      w('jump-rope', 'jump rope', 'v-jump', 'Ana is jumping rope.'),
      w('go-skating', 'go skating', 'act-skating', 'Sam is going skating.'),
      w('ride-a-bike', 'ride a bike', 'ride-a-bike', 'Ana is riding a bike.'),
      w('go-swimming', 'go swimming', 'sp-pool', 'Ana is going swimming.'),
      w('play-tag', 'play tag', 'act-tag', 'The children are playing tag.'),
      w('run-a-race', 'run a race', 'sp-field', 'Mia and Sam are running a race.'),
      w('go-bowling', 'go bowling', 'a-bowling', 'Sam is going bowling with his friends.'),
      w('play-tennis', 'play tennis', 'sp-racket', 'Mia is playing tennis.'),
      w('do-yoga', 'do yoga', 'a-yoga', 'Ana is doing yoga in the garden.')
    ]
  },
  {
    id: 'races', title: 'Fun races',
    words: [
      w('three-legged-race', 'a three-legged race', 'r-three', 'Sam and Leo are running a three-legged race.'),
      w('tie', 'tie', 'r-tie', 'Mia and Ana are tying their legs together.'),
      w('relay-race', 'a relay race', 'r-relay', 'Mia and Sam are running a relay race.'),
      w('baton', 'a baton', 'r-relay', 'Mia is passing the baton to Sam.'),
      w('track', 'a track', 'r-track', 'Leo is running on the track.'),
      w('swimmers', 'swimmers', 'r-swim', 'The swimmers are racing in the pool.'),
      w('cheer', 'cheer', 'st-cheer', 'Mia and Ana are cheering for their team.')
    ]
  },
  {
    id: 'body', title: 'My body',
    words: [
      w('heart', 'heart', 'b-heart', 'My heart beats faster when I run.'),
      w('lungs', 'lungs', 'b-lungs', 'I breathe with my lungs.'),
      w('brain', 'brain', 'b-brain', 'I think with my brain.'),
      w('bones', 'bones', 'b-bones', 'My bones hold up my body.'),
      w('muscles', 'muscles', 'b-muscles', 'My muscles help me jump and move.')
    ]
  },
  {
    id: 'strong', title: 'Reading words: a strong body',
    words: [
      w('energy', 'energy', 'w-energy', 'Mia is full of energy today.'),
      w('relaxed', 'relaxed', 'w-relaxed', 'Ana is relaxed under the tree.'),
      w('tired', 'tired', 'w-tired', 'Leo is tired after the race.'),
      w('strong', 'strong', 'w-strong', 'Exercise makes my body strong.'),
      w('stretch', 'stretch', 'w-stretch', 'Sam is stretching his muscles.'),
      w('breathe-hard', 'breathe hard', 'w-breathe', 'Mia is breathing hard after her run.'),
      w('push', 'push', 'w-push', 'Leo is pushing a big ball.'),
      w('pull', 'pull', 'w-pull', 'Ana is pulling a wagon.'),
      w('exercise-plan', 'an exercise plan', 'w-plan', 'Mia is writing an exercise plan.'),
      w('short-break', 'a short break', 'w-break', 'The children are having a short break.')
    ]
  },
  {
    id: 'everyday', title: 'Move more every day',
    words: [
      w('take-the-stairs', 'take the stairs', 'a-stairs', 'Leo is taking the stairs at school.'),
      w('exercise-video', 'follow an exercise video', 'a-video', 'Mia is following an exercise video.'),
      w('walk-to-school', 'walk to school', 'walk-to-school', 'Leo is walking to school.'),
      w('dance', 'dance', 'dance', 'Mia and Ana are dancing.'),
      w('play-video-games', 'play video games', 'a-games', 'Sam is playing video games. His body is not moving much!'),
      w('eat-an-apple', 'eat an apple', 'eat-apples', 'Mia is eating an apple. Good food gives us energy.'),
      w('sleep', 'sleep', 'v-sleep', 'Sleep helps the body too. Pepper is sleeping!')
    ]
  },
  {
    id: 'bounce', title: 'Bounce back!',
    words: [
      w('disappointed', 'disappointed', 's-sad', 'Ana is disappointed. Her serve is not very good.'),
      w('help-a-friend', 'help a friend', 's-help', 'Mia is helping her friend.'),
      w('miss-the-ball', 'miss the ball', 's-miss', 'Leo is missing the ball. It is OK!'),
      w('keep-trying', 'keep trying', 's-try', 'Sam is falling, but he keeps trying.'),
      w('ask-for-help', 'ask for help', 's-coach', 'Leo is asking his coach for help.'),
      w('coach', 'a coach', 's-coach', 'The coach helps the team.'),
      w('stay-positive', 'stay positive', 'w-strong', 'Ana is staying positive. She can do it!'),
      w('win', 'win or lose', 'st-highfive', 'Sometimes we win and sometimes we lose. That is OK.')
    ]
  }
];

const ex = (text, image, extra = {}) => ({ text, image, ...extra });
const qa = (q, a, image, extra = {}) => ({ q, a, image, ...extra });
const pr = (mode, prompt, image, options, answer, explain) => ({ mode, prompt, image, options, answer, explain });

export const LEARN = [
  {
    id: 'six-words', title: 'Six question words', rule: 'Question words ask for information: **Who, What, Where, When, How, Why**.', image: 'cover',
    examples: [
      qa('**Who** is running?', 'Sam is. (a person)', 'prep-around', { label: 'Who = a person' }),
      qa('**What** is Mia passing?', 'The baton. (a thing)', 'r-relay', { label: 'What = a thing' }),
      qa('**Where** is Leo running?', 'On the track. (a place)', 'r-track', { label: 'Where = a place' }),
      qa('**When** do you play tag?', 'After school. (a time)', 'act-tag', { label: 'When = a time' }),
      qa('**How** do runners win races?', 'They run fast! (a way)', 'r-track', { label: 'How = a way' }),
      qa('**Why** is Ana doing yoga?', 'Because it is relaxing. (a reason)', 'a-yoga', { label: 'Why = a reason' })
    ],
    groups: [
      { label: 'a person', words: ['Who'] }, { label: 'a thing', words: ['What'] }, { label: 'a place', words: ['Where'] },
      { label: 'a time', words: ['When'] }, { label: 'a way', words: ['How'] }, { label: 'a reason', words: ['Why'] }
    ],
    practice: [
      pr('together', '___ is running? — Sam is.', 'prep-around', ['Who', 'Where'], 'a', 'Sam is a person → Who.'),
      pr('try', '___ is Leo running? — On the track.', 'r-track', ['When', 'Where'], 'b', 'On the track is a place → Where.')
    ],
    teacherNote: 'Pupils can already answer yes / no questions. Question words ask for new information, so the answer is not Yes or No. Ask pupils to underline the question word first.'
  },
  {
    id: 'who', title: 'Who? A person', rule: '**Who** asks about a person. Who + is + verb-ing …?', image: 'r-three',
    examples: [
      { machine: { subject: 'sam', verb: 'run-around', to: 'who' } },
      qa('**Who** is climbing through the hoop?', 'Mia is.', 'prep-through'),
      qa('**Who** is jumping over the hurdles?', 'Leo is.', 'prep-over'),
      qa('**Who** is cheering?', 'Mia is.', 'r-swim'),
      qa('**Who** is pushing the big ball?', 'Leo is.', 'w-push'),
      qa('**Who** has the baton now?', 'Sam does.', 'r-relay', { label: 'Who + has …? → Sam does.' })
    ],
    practice: [
      pr('together', '___ is sliding down the slide?', 'prep-down', ['Who', 'What'], 'a', 'The answer is a person: Sam is.'),
      pr('try', 'Who is doing yoga?', 'a-yoga', ['Ana is.', 'In the garden.', 'Because it is relaxing.'], 'a', 'Who → a person: Ana is.')
    ],
    teacherNote: 'Who + is keeps the normal word order: Sam is running → Who is running? Even with two people we usually ask Who is …? The short answer changes: Sam is. / Sam and Leo are.'
  },
  {
    id: 'what', title: 'What? A thing or an action', rule: '**What** asks about a thing. **What … doing?** asks about an action.', image: 'r-relay',
    examples: [
      { machine: { subject: 'mia', verb: 'pass-baton', to: 'what' } },
      { machine: { subject: 'leo', verb: 'run-past', to: 'what' } },
      qa('**What** is Ana pulling?', 'A wagon.', 'w-pull'),
      qa('**What** is Mia writing?', 'An exercise plan.', 'w-plan'),
      qa('**What** is Sam doing?', 'He is bowling.', 'a-bowling'),
      qa('**What** are they doing?', 'They are having a short break.', 'w-break')
    ],
    practice: [
      pr('together', '___ is Leo pushing? — A big ball.', 'w-push', ['What', 'Who'], 'a', 'A big ball is a thing → What.'),
      pr('try', 'What is Ana doing?', 'a-yoga', ['She is doing yoga.', 'Ana is.', 'In the garden.'], 'a', 'What … doing? → an action.')
    ],
    teacherNote: 'Two common patterns: What is she passing? (a thing) and What is she doing? (an action; answer with the full verb).'
  },
  {
    id: 'where', title: 'Where? A place', rule: '**Where** asks about a place. Where + is / are + who + verb-ing?', image: 'r-track',
    examples: [
      { machine: { subject: 'leo', verb: 'run-track', to: 'where' } },
      { machine: { subject: 'they', verb: 'play-tag', to: 'where' } },
      qa('**Where** are the swimmers racing?', 'In the pool.', 'r-swim'),
      qa('**Where** is the relay race?', 'On the track.', 'r-relay', { label: 'A track is a path for running.' }),
      qa('**Where** is Ana doing yoga?', 'In the garden.', 'a-yoga'),
      qa('**Where** is Mia walking?', 'Across the bridge.', 'prep-across')
    ],
    practice: [
      pr('together', '___ is Ana doing yoga? — In the garden.', 'a-yoga', ['Where', 'Why'], 'a', 'In the garden is a place → Where.'),
      pr('try', 'Where is Sam sliding?', 'prep-down', ['Down the slide.', 'Sam is.', 'He is happy.'], 'a', 'Where → a place: down the slide.')
    ],
    teacherNote: 'Is / are jumps before the subject: Leo is running → Where is Leo running? Short answers are fine and natural: On the track.'
  },
  {
    id: 'when', title: 'When? A time', rule: '**When** asks about a time or a moment. When + do / does + who + verb?', image: 'w-plan',
    examples: [
      qa('**When** do you exercise?', 'After school.', 'w-plan'),
      qa('**When** does Sam start?', 'When he has the baton.', 'r-relay'),
      qa('**When** do you play tag?', 'At break time.', 'act-tag'),
      qa('**When** does Leo walk to school?', 'In the morning.', 'walk-to-school'),
      qa('**When** do you stretch?', 'Before and after sport.', 'w-stretch'),
      qa('**When** do they have a break?', 'After the game.', 'w-break')
    ],
    practice: [
      pr('together', '___ do you exercise? — After school.', 'w-plan', ['When', 'Where'], 'a', 'After school is a time → When.'),
      pr('try', 'When does Leo walk to school?', 'walk-to-school', ['In the morning.', 'To school.', 'Leo does.'], 'a', 'When → a time.')
    ],
    teacherNote: 'When usually goes with habits, so we use do / does from Week 1. Link to the exercise plan: when can pupils move more?'
  },
  {
    id: 'how', title: 'How? A way', rule: '**How** asks about a way or a manner.', image: 'r-three',
    examples: [
      { machine: { subject: 'leo', verb: 'jump-over', to: 'how' } },
      qa('**How** do you play this game?', 'Tie your legs together. Then run!', 'r-three'),
      qa('**How** do runners win?', 'They run fast!', 'r-track'),
      qa('**How** are Sam and Leo running?', 'Together!', 'r-three'),
      qa('**How** is Ana pulling the wagon?', 'With a rope.', 'w-pull'),
      qa('**How** is Leo crawling?', 'On hands and knees.', 'prep-under')
    ],
    practice: [
      pr('together', '___ is Ana pulling the wagon? — With a rope.', 'w-pull', ['How', 'Who'], 'a', 'With a rope is a way → How.'),
      pr('try', 'How do runners win races?', 'r-track', ['They run fast!', 'On the track.', 'My brother.'], 'a', 'How → a way.')
    ],
    teacherNote: 'Good answers can be very short: Fast! Slowly. Together! With a rope.'
  },
  {
    id: 'why', title: 'Why? Because …', rule: '**Why** asks for a reason. We answer with **Because …**', image: 'r-swim',
    examples: [
      { machine: { subject: 'they', verb: 'short-break', to: 'why' } },
      qa('**Why** are Sam and Leo tied together?', 'Because they are in a three-legged race.', 'r-three'),
      qa('**Why** are you cheering?', 'Because I want my team to win!', 'st-cheer'),
      qa('**Why** is Sam stretching?', 'Because it is good for the body.', 'w-stretch'),
      qa('**Why** is Leo tired?', 'Because running is hard work.', 'w-tired'),
      qa('**Why** is Mia breathing hard?', 'Because she is running fast.', 'w-breathe')
    ],
    practice: [
      pr('together', 'Why is Ana doing yoga?', 'a-yoga', ['Because it is relaxing.', 'In the garden.'], 'a', 'Why → Because …'),
      pr('try', '___ is Leo tired? — Because running is hard work.', 'w-tired', ['Why', 'When'], 'a', 'Because → the question is Why.')
    ],
    teacherNote: 'Why and Because go together. Do not expect long sentences: Because it is fun. is a very good answer.'
  },
  {
    id: 'word-order', title: 'Build a question', rule: 'Question word + **am / is / are** + who + **verb-ing**?', image: 'teacher-class',
    examples: [
      { machine: { subject: 'mia', verb: 'walk-across', to: 'where' } },
      { machine: { subject: 'they', verb: 'three-legged', to: 'what' } },
      ex('Where **is** Mia running?', 'prep-between', { from: 'Mia is running between the trees.', label: 'is jumps before Mia' }),
      ex('What **are** they doing?', 'act-tag', { from: 'They are playing tag.', label: 'are jumps before they' }),
      ex('Why **are** you cheering?', 'st-cheer', { from: 'You are cheering.', label: 'are jumps before you' }),
      ex('Who **is** bowling?', 'a-bowling', { from: 'Sam is bowling.', label: 'Who takes the place of Sam.' })
    ],
    practice: [
      pr('together', 'Which question is right?', 'prep-over', ['Where is Leo jumping?', 'Where Leo is jumping?'], 'a', 'is comes before Leo.'),
      pr('try', 'Which question is right?', 'r-relay', ['What Mia is passing?', 'What is Mia passing?'], 'b', 'What + is + Mia + passing?')
    ],
    teacherNote: 'The most common mistake is keeping statement order: “Where Leo is jumping?” Use the Change Machine and let pupils move the helper with their hands.'
  },
  {
    id: 'do-does', title: 'Question words with do and does', rule: 'For every day: question word + **do / does** + who + verb?', image: 'act-tag',
    examples: [
      qa('Where **do** you play?', 'In the park.', 'act-tag', { label: 'you → do' }),
      qa('How **do** you win?', 'I run fast!', 'r-track'),
      qa('When **does** she practice?', 'After school.', 'act-gymnastics', { label: 'she → does' }),
      qa('What **do** you need for tennis?', 'A racket and a ball.', 'sp-racket'),
      qa('Where **does** Leo do karate?', 'In the hall.', 'act-karate'),
      qa('Why **do** we play sports?', 'Because they are fun and good for us!', 'st-highfive')
    ],
    groups: [{ label: 'Now', words: ['Where is she running?', 'What are you doing?'] }, { label: 'Every day', words: ['Where does she run?', 'What do you do?'] }],
    practice: [
      pr('together', 'Where ___ you play?', 'act-tag', ['do', 'does'], 'a', 'you → do.'),
      pr('try', 'When ___ Sam start?', 'r-relay', ['do', 'does'], 'b', 'Sam = he → does.')
    ],
    teacherNote: 'This connects Week 1 and Week 2: is / are + -ing for now, do / does for every day. The verb after do / does has no -s.'
  },
  {
    id: 'sports', title: 'Sports and activities', rule: 'Verb partners: **do** gymnastics, **play** tag, **go** swimming.', image: 'act-gymnastics',
    examples: [
      ex('Mia is **doing gymnastics**.', 'act-gymnastics', { label: 'do gymnastics' }),
      ex('Leo is **doing karate**.', 'act-karate', { label: 'do karate' }),
      ex('Ana is **doing yoga**.', 'a-yoga', { label: 'do yoga' }),
      ex('Leo is **playing baseball**.', 'sp-bat', { label: 'play baseball' }),
      ex('The children are **playing tag**.', 'act-tag', { label: 'play tag' }),
      ex('Sam is **going skating**.', 'act-skating', { label: 'go skating' }),
      ex('Sam is **going bowling**.', 'a-bowling', { label: 'go bowling' }),
      ex('Ana is **bouncing a ball**.', 'act-bounce', { label: 'bounce a ball' })
    ],
    groups: [
      { label: 'do', words: ['do gymnastics', 'do karate', 'do yoga'] },
      { label: 'play', words: ['play baseball', 'play tennis', 'play tag'] },
      { label: 'go', words: ['go skating', 'go swimming', 'go bowling'] },
      { label: 'other', words: ['bounce a ball', 'jump rope', 'ride a bike', 'run a race'] }
    ],
    practice: [
      pr('together', 'Ana is ___ yoga.', 'a-yoga', ['doing', 'playing', 'going'], 'a', 'do yoga → doing yoga.'),
      pr('try', 'Sam is ___ bowling.', 'a-bowling', ['doing', 'going'], 'b', 'go bowling → going bowling.')
    ],
    teacherNote: 'Sing and act out the verbs. Ask pupils for more activities and sort them into do, play and go.'
  },
  {
    id: 'moving-1', title: 'Moving: around, through, over, under', rule: 'A verb + a preposition shows **where someone is moving**.', image: 'prep-around',
    examples: [
      ex('Sam is running **around** the cone.', 'prep-around', { label: 'around = in a circle' }),
      ex('Mia is climbing **through** the hoop.', 'prep-through', { label: 'through = in one side, out the other' }),
      ex('Leo is jumping **over** the hurdles.', 'prep-over', { label: 'over = high, above it' }),
      ex('Leo is crawling **under** the bench.', 'prep-under', { label: 'under = low, below it' }),
      { machine: { subject: 'sam', verb: 'run-around', to: 'where' } },
      { machine: { subject: 'leo', verb: 'crawl-under', to: 'where' } }
    ],
    practice: [
      pr('together', 'Leo is jumping ___ the hurdles.', 'prep-over', ['over', 'under'], 'a', 'He is above the hurdles → over.'),
      pr('try', 'Mia is climbing ___ the hoop.', 'prep-through', ['around', 'through'], 'b', 'In one side, out the other → through.')
    ],
    teacherNote: 'Act them out: walk around a chair, crawl under a table, step over a book. Pupils say the sentence as a friend moves.'
  },
  {
    id: 'moving-2', title: 'Moving: up, down, across, past', rule: '**up** ↑ **down** ↓ **across** = to the other side. **past** = next to it and on.', image: 'prep-up',
    examples: [
      ex('Ana is climbing **up** the ladder.', 'prep-up', { label: 'up ↑' }),
      ex('Sam is sliding **down** the slide.', 'prep-down', { label: 'down ↓' }),
      ex('Mia is walking **across** the bridge.', 'prep-across', { label: 'across = to the other side' }),
      ex('Leo is running **past** the goal.', 'prep-past', { label: 'past = next to it and on' }),
      { machine: { subject: 'ana', verb: 'climb-up', to: 'where' } },
      { machine: { subject: 'mia', verb: 'walk-across', to: 'who' } }
    ],
    groups: [{ label: 'opposites', words: ['up ↔ down', 'over ↔ under', 'into ↔ out of'] }],
    practice: [
      pr('together', 'Sam is sliding ___ the slide.', 'prep-down', ['down', 'up'], 'a', 'A slide goes down ↓.'),
      pr('try', 'Leo is running ___ the goal.', 'prep-past', ['into', 'past'], 'b', 'He is not going in. He is going next to it and on → past.')
    ],
    teacherNote: 'Past is the hardest one. Walk past the teacher’s desk without stopping. Do not confuse it with “past” for time.'
  },
  {
    id: 'moving-3', title: 'Moving: into, out of, between', rule: '**into** = going in. **out of** = coming out. **between** = with one thing on each side.', image: 'prep-into',
    examples: [
      ex('Ana is jumping **into** the sandbox.', 'prep-into', { label: 'into → going in' }),
      ex('Sam is stepping **out of** the sandbox.', 'prep-out', { label: 'out of → coming out' }),
      ex('Mia is running **between** the trees.', 'prep-between', { label: 'between = a tree on each side' }),
      { machine: { subject: 'ana', verb: 'jump-into', to: 'where' } },
      { machine: { subject: 'sam', verb: 'step-out', to: 'where' } },
      { machine: { subject: 'mia', verb: 'run-between', to: 'who' } }
    ],
    practice: [
      pr('together', 'Ana is jumping ___ the sandbox.', 'prep-into', ['into', 'out of'], 'a', 'She is going in → into.'),
      pr('try', 'Mia is running ___ the trees.', 'prep-between', ['past', 'between'], 'b', 'A tree on each side → between.')
    ],
    teacherNote: 'Out of is two words. Between needs two things: between the trees, between the cones.'
  },
  {
    id: 'directions', title: 'Follow the path', rule: 'Give directions: **Start at … Go over … Run around … Finish at …**', image: 'cover',
    examples: [
      ex('**Start at** the gate.', 'cover', { label: 'The beginning of the path.' }),
      ex('**Run around** the cone.', 'prep-around'),
      ex('**Climb through** the hoop.', 'prep-through'),
      ex('**Go up** the ladder and **walk across** the bridge.', 'prep-across'),
      ex('**Slide down** the slide.', 'prep-down'),
      ex('**Jump over** the hurdles.', 'prep-over'),
      ex('**Run between** the trees and **finish** at the gate!', 'prep-between')
    ],
    practice: [
      pr('together', '___ the ladder.', 'prep-up', ['Go up', 'Go under'], 'a', 'A ladder goes up.'),
      pr('try', '___ the hurdles.', 'prep-over', ['Crawl under', 'Jump over'], 'b', 'We jump over hurdles.')
    ],
    teacherNote: 'To give directions we use the base verb with no subject: Run around … Make a path in the classroom. One pupil gives directions, a friend follows.'
  },
  {
    id: 'body', title: 'Parts of my body', rule: 'My **heart, lungs, brain, bones** and **muscles** work for me every day.', image: 'b-heart',
    examples: [
      ex('This is my **heart**. It beats faster when I run.', 'b-heart'),
      ex('These are my **lungs**. I breathe with them.', 'b-lungs'),
      ex('This is my **brain**. I think with it.', 'b-brain'),
      ex('These are my **bones**. They hold up my body.', 'b-bones'),
      ex('These are my **muscles**. They help me move.', 'b-muscles'),
      qa('**What** helps you breathe?', 'My lungs.', 'b-lungs'),
      qa('**What** holds up your body?', 'My bones.', 'b-bones')
    ],
    practice: [
      pr('together', 'I think with my ___.', 'b-brain', ['brain', 'lungs'], 'a', 'I think with my brain.'),
      pr('try', 'My ___ help me jump and move.', 'b-muscles', ['bones', 'muscles'], 'b', 'Muscles help us move.')
    ],
    teacherNote: 'Pupils point to each part on their own body while they say the word.'
  },
  {
    id: 'strong-body', title: 'A strong body', rule: 'Moving your body gives you **energy** and makes you **strong**.', image: 'w-strong',
    examples: [
      ex('Mia is full of **energy**.', 'w-energy'),
      ex('After sport, Ana is **relaxed** and happy.', 'w-relaxed'),
      ex('Mia is **breathing hard**. Her lungs are growing strong.', 'w-breathe'),
      ex('Sam is **stretching** his muscles.', 'w-stretch', { label: 'Stretch before and after sport.' }),
      ex('Leo is **pushing** a big ball.', 'w-push'),
      ex('Ana is **pulling** a wagon.', 'w-pull'),
      ex('Leo is **tired**. He needs a **short break**.', 'w-tired'),
      ex('Mia is writing an **exercise plan**. Move your body for one hour every day!', 'w-plan')
    ],
    practice: [
      pr('together', 'Sport gives me ___.', 'w-energy', ['energy', 'a bench'], 'a', 'Sport gives me energy.'),
      pr('try', 'Leo is ___. He needs a short break.', 'w-tired', ['strong', 'tired'], 'b', 'He needs a break → tired.')
    ],
    teacherNote: 'Link the new words to the reading in the book. Ask: How do you feel after sport? What gives you energy?'
  },
  {
    id: 'move-more', title: 'Move more every day', rule: 'Small changes help: **take the stairs, walk to school, dance!**', image: 'a-stairs',
    examples: [
      ex('Leo is **taking the stairs**.', 'a-stairs'),
      ex('Leo is **walking to school**.', 'walk-to-school'),
      ex('Ana is **riding a bike**.', 'ride-a-bike'),
      ex('Mia and Ana are **dancing**.', 'dance'),
      ex('Mia is **following an exercise video**.', 'a-video'),
      ex('Sam is **playing video games**. His body is not moving much!', 'a-games'),
      qa('**How** can you move more?', 'I can take the stairs and walk to school.', 'a-stairs')
    ],
    practice: [
      pr('together', 'Which one moves your body more?', 'a-stairs', ['take the stairs', 'play video games'], 'a', 'The stairs make your body work.'),
      pr('try', 'Mia is ___ an exercise video.', 'a-video', ['following', 'sleeping'], 'a', 'follow an exercise video.')
    ],
    teacherNote: 'When you listen, look at the speaker and nod. Practise polite listening words in pairs: Uh-huh. Yeah. Right. I understand.'
  },
  {
    id: 'bounce-back', title: 'Bounce back!', rule: 'Something is difficult? **Keep trying. Learn. Stay positive. Ask for help.**', image: 's-try',
    examples: [
      ex('Ana is **disappointed**. Her serve is not very good.', 's-sad'),
      ex('Mia is **helping** her friend.', 's-help'),
      ex('Now Ana **feels better**!', 's-help'),
      ex('Leo is **missing** the ball. The other team is winning.', 's-miss'),
      ex('“I can **ask my coach for help**.”', 's-coach', { speaker: 'Leo' }),
      ex('“I can **keep trying**!”', 's-try', { speaker: 'Sam' }),
      ex('“Sometimes we win and sometimes we lose. That’s OK.”', 'st-highfive', { speaker: 'Sam and Leo' })
    ],
    groups: [
      { label: 'This helps', words: ['I can try again.', 'That’s OK.', 'I can ask for help.'] },
      { label: 'This does not help', words: ['I want to quit.', 'I am not good at this.'] }
    ],
    practice: [
      pr('together', 'Sam falls. What can he say?', 's-try', ['I can try again!', 'I want to quit.'], 'a', 'Keep trying!'),
      pr('try', 'The game is difficult. What can you do?', 's-coach', ['Stop playing.', 'Ask the coach for help.'], 'b', 'Ask for help when you need it.')
    ],
    teacherNote: 'Talk about a time when something was difficult. Pupils role-play: one wants to quit, the other gives an idea to bounce back.'
  }
];

export const SPEAKING = [
  ['What sport or activity are you good at?', 'act-gymnastics', ['I am good at …'], 'I am good at swimming.', true],
  ['Where do you do this sport?', 'sp-pool', ['At the …', 'In the …'], 'At the pool.', true],
  ['What things do you need for this sport?', 'sp-racket', ['I need …'], 'I need a racket and a ball.', true],
  ['What are you doing after school today?', 'walk-to-school', ['I am …'], 'I am going swimming after school.', true],
  ['When do you exercise?', 'w-plan', ['After school.', 'In the morning.', 'On Saturday.'], 'I exercise after school.', true],
  ['How do you feel after sport?', 'w-relaxed', ['I feel …'], 'I feel happy and relaxed.', true],
  ['Why do people play sports?', 'st-highfive', ['Because …'], 'Because they are fun and good for the body.'],
  ['Make a question with Who. Ask a friend.', 'teacher-class', ['Who is …?', 'Who likes …?'], 'Who likes swimming?', true],
  ['Make a question with Where. Ask a friend.', 'teacher-class', ['Where do you …?'], 'Where do you play?', true],
  ['Who is running around the cone?', 'prep-around', ['… is.'], 'Sam is.'],
  ['Where is Mia walking?', 'prep-across', ['Across …'], 'Across the bridge.'],
  ['Look. What is Leo doing?', 'prep-under', ['He is crawling …'], 'He is crawling under the bench.'],
  ['Look at the path. Tell a friend where to go.', 'cover', ['Start at …', 'Go over …', 'Run around …'], 'Start at the gate. Run around the cone. Climb through the hoop.', true],
  ['Stand up! Walk around your chair. What are you doing?', 'prep-around', ['I am walking …'], 'I am walking around my chair.', true],
  ['Point to your heart. What does it do?', 'b-heart', ['It beats.'], 'My heart beats faster when I run.'],
  ['What do your muscles do?', 'b-muscles', ['They help me …'], 'They help me jump and move.'],
  ['What gives you energy?', 'w-energy', ['… gives me energy.'], 'Playing tag gives me energy.', true],
  ['How can you move more every day?', 'a-stairs', ['I can …'], 'I can take the stairs and walk to school.', true],
  ['Your friend is sad after a game. What can you say?', 's-help', ['It’s OK.', 'I can help you.'], 'It’s OK. I can help you.', true],
  ['Something is very difficult. What can you do?', 's-try', ['I can …'], 'I can keep trying and ask for help.', true],
  ['Listen to your friend. Nod your head and say a listening word.', 'teacher-class', ['Uh-huh.', 'Yeah.', 'Right.', 'I understand.'], 'Uh-huh. I understand.', true],
  ['Why do we play sports? Give your answer.', 'cover', ['Because …'], 'Because sports are fun, and they help our body.', true]
].map(([question, image, help, sample, personal], i) => ({ id: `w3-sp-${String(i + 1).padStart(2, '0')}`, question, image, help, sample, ...(personal ? { personal: true } : {}) }));

export const EXAMPLES = [
  ['ex-01', 'prep-around', 'sam', 'run-around', 'around'], ['ex-02', 'prep-through', 'mia', 'climb-through', 'through'],
  ['ex-03', 'prep-over', 'leo', 'jump-over', 'over'], ['ex-04', 'prep-up', 'ana', 'climb-up', 'up'],
  ['ex-05', 'prep-down', 'sam', 'slide-down', 'down'], ['ex-06', 'prep-across', 'mia', 'walk-across', 'across'],
  ['ex-07', 'prep-under', 'leo', 'crawl-under', 'under'], ['ex-08', 'prep-into', 'ana', 'jump-into', 'into'],
  ['ex-09', 'prep-out', 'sam', 'step-out', 'out of'], ['ex-10', 'prep-past', 'leo', 'run-past', 'past'],
  ['ex-11', 'prep-between', 'mia', 'run-between', 'between'], ['ex-12', 'r-relay', 'mia', 'pass-baton', 'What? the baton'],
  ['ex-13', 'r-three', 'they', 'three-legged', 'How? together'], ['ex-14', 'r-track', 'leo', 'run-track', 'Where? on the track'],
  ['ex-15', 'r-swim', 'sam', 'swim-race', 'Why? a race'], ['ex-16', 'r-tie', 'they', 'tie-legs', 'tie → tying'],
  ['ex-17', 'act-gymnastics', 'mia', 'do-gymnastics', 'do gymnastics'], ['ex-18', 'act-karate', 'leo', 'do-karate', 'do karate'],
  ['ex-19', 'act-bounce', 'ana', 'bounce-ball', 'bounce a ball'], ['ex-20', 'act-skating', 'sam', 'go-skating', 'go skating'],
  ['ex-21', 'act-tag', 'they', 'play-tag', 'play tag'], ['ex-22', 'a-yoga', 'ana', 'do-yoga', 'do yoga'],
  ['ex-23', 'sp-racket', 'mia', 'play-tennis', 'play tennis'], ['ex-24', 'w-stretch', 'sam', 'stretch', 'stretch'],
  ['ex-25', 'w-breathe', 'mia', 'breathe', 'breathe hard'], ['ex-26', 'w-push', 'leo', 'push-ball', 'push'],
  ['ex-27', 'w-pull', 'ana', 'pull-wagon', 'pull'], ['ex-28', 'w-plan', 'mia', 'write-plan', 'an exercise plan'],
  ['ex-29', 'w-break', 'they', 'short-break', 'a short break'], ['ex-30', 'a-stairs', 'leo', 'take-stairs', 'take the stairs'],
  ['ex-31', 'a-video', 'mia', 'follow-video', 'an exercise video'], ['ex-32', 's-try', 'sam', 'try-again', 'keep trying'],
  ['ex-33', 's-help', 'mia', 'help-friend', 'help a friend'], ['ex-34', 's-coach', 'leo', 'ask-coach', 'ask for help']
].map(([id, image, subject, verb, note]) => ({ id, image, subject, verb, note }));

export const PICTURE_REVEAL = [
  ['prep-around', 'He', 'around the cone', 'He is running around the cone.'],
  ['prep-through', 'She', 'through the hoop', 'She is climbing through the hoop.'],
  ['prep-over', 'He', 'over the hurdles', 'He is jumping over the hurdles.'],
  ['prep-up', 'She', 'up the ladder', 'She is climbing up the ladder.'],
  ['prep-down', 'He', 'down the slide', 'He is sliding down the slide.'],
  ['prep-across', 'She', 'across the bridge', 'She is walking across the bridge.'],
  ['prep-under', 'He', 'under the bench', 'He is crawling under the bench.'],
  ['prep-into', 'She', 'into the sandbox', 'She is jumping into the sandbox.'],
  ['prep-out', 'He', 'out of the sandbox', 'He is stepping out of the sandbox.'],
  ['prep-past', 'He', 'past the goal', 'He is running past the goal.'],
  ['prep-between', 'She', 'between the trees', 'She is running between the trees.'],
  ['r-three', 'They', 'a three-legged race', 'They are running a three-legged race.'],
  ['r-relay', 'She', 'passing the baton', 'She is passing the baton.'],
  ['b-heart', 'He', 'heart', 'He is pointing to his heart.'],
  ['b-bones', 'He', 'bones', 'He is pointing to the bones.'],
  ['w-stretch', 'He', 'stretching', 'He is stretching his muscles.'],
  ['w-push', 'He', 'pushing', 'He is pushing a big ball.'],
  ['w-pull', 'She', 'pulling', 'She is pulling a wagon.'],
  ['a-bowling', 'He', 'going bowling', 'He is going bowling.'],
  ['a-yoga', 'She', 'doing yoga', 'She is doing yoga.'],
  ['s-coach', 'He', 'asking for help', 'He is asking his coach for help.']
].map(([image, subject, word, sentence]) => ({ image, subject, word, sentence }));

export const QUESTION_DOOR = [
  ['Sam', 'prep-around', 'Sam is running around the cone.', ['Where is Sam running?', 'Where Sam is running?', 'Where does Sam running?'], 'a', 'Around the cone.', 'Where + is + Sam + running?'],
  ['Mia', 'prep-through', 'Mia is climbing through the hoop.', ['What Mia is doing?', 'What is Mia doing?', 'What does Mia doing?'], 'b', 'She is climbing through the hoop.', 'What + is + Mia + doing?'],
  ['the person', 'prep-over', 'Leo is jumping over the hurdles.', ['Who is jumping over the hurdles?', 'What is jumping over the hurdles?', 'Where is jumping over the hurdles?'], 'a', 'Leo is.', 'A person → Who.'],
  ['Mia', 'r-relay', 'Mia is passing the baton.', ['What is Mia passing?', 'Who is Mia passing?', 'Where is Mia passing?'], 'a', 'The baton.', 'A thing → What.'],
  ['Leo', 'r-track', 'Leo is running on the track.', ['When is Leo running?', 'Where is Leo running?'], 'b', 'On the track.', 'A place → Where.'],
  ['Sam and Leo', 'r-three', 'Sam and Leo are running together.', ['How are Sam and Leo running?', 'How is Sam and Leo running?', 'How do Sam and Leo running?'], 'a', 'Together!', 'Two people → are.'],
  ['Ana', 'a-yoga', 'Ana is doing yoga because it is relaxing.', ['Where is Ana doing yoga?', 'Why is Ana doing yoga?'], 'b', 'Because it is relaxing.', 'Because → Why.'],
  ['you', 'w-plan', 'I exercise after school.', ['When do you exercise?', 'When does you exercise?', 'Where do you exercise?'], 'a', 'After school.', 'A time → When. you → do.'],
  ['Ana', 'w-pull', 'Ana is pulling the wagon with a rope.', ['How is Ana pulling the wagon?', 'Who is Ana pulling the wagon?'], 'a', 'With a rope.', 'A way → How.'],
  ['Sam', 'prep-down', 'Sam is sliding down the slide.', ['Where is Sam sliding?', 'Where are Sam sliding?'], 'a', 'Down the slide.', 'Sam = he → is.'],
  ['the children', 'w-break', 'The children are having a short break.', ['What is the children doing?', 'What are the children doing?'], 'b', 'They are having a short break.', 'the children = they → are.'],
  ['Leo', 'w-tired', 'Leo is tired because running is hard work.', ['Why is Leo tired?', 'Why Leo is tired?'], 'a', 'Because running is hard work.', 'Why + is + Leo.']
].map(([who, image, clue, options, answer, reveal, hint], i) => ({ id: `door-${String(i + 1).padStart(2, '0')}`, who, image, clue, options, answer, reveal, hint }));

export const YES_NO = [
  ['prep-around', 'Sam is running around the cone.', 'Is Sam running around the cone?', ['Yes, he is.', 'Yes, he does.', "No, he isn't."], 'a', 'Read the clue.'],
  ['prep-through', 'Mia is climbing through the hoop.', 'Is Mia climbing over the hoop?', ['Yes, she is.', "No, she isn't.", "No, she doesn't."], 'b', 'through, not over.'],
  ['prep-over', 'Leo is jumping over the hurdles.', 'Is Leo crawling under the hurdles?', ["No, he isn't.", 'Yes, he is.'], 'a', 'over, not under.'],
  ['prep-up', 'Ana is climbing up the ladder.', 'Is Ana going up?', ['Yes, she is.', "No, she isn't."], 'a', 'up ↑.'],
  ['prep-down', 'Sam is sliding down the slide.', 'Is Sam going up?', ['Yes, he is.', "No, he isn't."], 'b', 'He is going down.'],
  ['prep-across', 'Mia is walking across the bridge.', 'Is Mia walking under the bridge?', ['Yes, she is.', "No, she isn't."], 'b', 'across, not under.'],
  ['prep-under', 'Leo is crawling under the bench.', 'Is Leo crawling under the bench?', ['Yes, he is.', "No, he isn't."], 'a', 'Read the clue.'],
  ['prep-into', 'Ana is jumping into the sandbox.', 'Is Ana jumping out of the sandbox?', ['Yes, she is.', "No, she isn't."], 'b', 'into, not out of.'],
  ['prep-out', 'Sam is stepping out of the sandbox.', 'Is Sam stepping out of the sandbox?', ['Yes, he is.', "No, he isn't."], 'a', 'Read the clue.'],
  ['prep-past', 'Leo is running past the goal.', 'Is Leo running into the goal?', ['Yes, he is.', "No, he isn't."], 'b', 'past, not into.'],
  ['prep-between', 'Mia is running between the trees.', 'Is Mia running between the trees?', ['Yes, she is.', 'Yes, she does.'], 'a', 'Is … ? → Yes, she is.'],
  ['r-three', 'Sam and Leo are running together.', 'Are their legs tied together?', ['Yes, they are.', "No, they aren't."], 'a', 'It is a three-legged race.'],
  ['r-relay', 'Mia is passing the baton to Sam.', 'Is Sam passing the baton?', ['Yes, he is.', "No, he isn't."], 'b', 'Mia is passing it.'],
  ['r-swim', 'The swimmers are racing. Mia is cheering.', 'Is Mia swimming?', ['Yes, she is.', "No, she isn't."], 'b', 'Mia is cheering.'],
  ['w-tired', 'Leo is tired. He is sitting on a bench.', 'Is Leo full of energy?', ['Yes, he is.', "No, he isn't."], 'b', 'He is tired.'],
  ['w-energy', 'Mia is jumping high. She is full of energy.', 'Is Mia tired?', ['Yes, she is.', "No, she isn't."], 'b', 'She is full of energy.'],
  ['w-pull', 'Ana is pulling a wagon.', 'Is Ana pushing the wagon?', ['Yes, she is.', "No, she isn't."], 'b', 'pull, not push.'],
  ['w-push', 'Leo is pushing a big ball.', 'Is Leo pushing a big ball?', ['Yes, he is.', "No, he isn't."], 'a', 'Read the clue.'],
  ['s-coach', 'Leo is asking his coach for help.', 'Is Leo asking for help?', ['Yes, he is.', "No, he isn't."], 'a', 'Read the clue.'],
  ['s-try', 'Sam falls, but he is getting up to try again.', 'Is Sam quitting?', ['Yes, he is.', "No, he isn't."], 'b', 'He keeps trying.']
].map(([image, clue, question, options, answer, hint], i) => ({ id: `yn-${String(i + 1).padStart(2, '0')}`, image, clue, question, options, answer, hint }));
