// Compass Unit 4, pp. 62–79. Site characters and original illustrations.
import { SUBJECTS, IMAGES as WEEK3 } from './week3-data.mjs';
export { SUBJECTS };

const picture = (name, alt, h = 1050) => ({ src: `assets/images/week-05/${name}`, w: 1400, h, alt });
export const IMAGES = {
  cover: picture('week-05-cover', 'Mia offers Sam a pencil while Ana and Leo carry books to school.', 788),
  lend: picture('lend', 'Mia hands Sam a yellow pencil across their desk.'),
  'throw-away': picture('throw-away', 'Sam drops a paper ball into a classroom bin.'),
  quiz: picture('quiz', 'Ana works alone on a sheet at her desk.'),
  share: picture('share', 'Mia and Leo look at one open book together.'),
  'clean-up': picture('clean-up', 'Ana wipes a spill from her desk with a yellow cloth.'),
  'sit-down': picture('sit-down', 'Leo is seated on a blue classroom chair.'),
  'stand-up': picture('stand-up', 'Sam is on his feet beside his empty chair.'),
  'check-out': picture('check-out', 'Mia shows her card as the librarian scans a book.'),
  'raise-hand': picture('raise-hand', 'Ana sits at a desk with one arm held up.'),
  'wait-line': picture('wait-line', 'The four friends stand one behind another by the bus door.'),
  'help-books': picture('help-books', 'Mia carries a book for Leo in the hall.'),
  uniform: picture('uniform', 'Leo and Ana wear matching white shirts and navy school clothes.'),
  'casual-clothes': picture('casual-clothes', 'Mia wears a yellow jacket and shorts. Sam wears a teal T-shirt, jeans and orange sneakers.'),
  auditorium: picture('auditorium', 'Mia speaks from a small stage in front of rows of seats.'),
  hall: picture('hall', 'Sam and Ana walk between the lockers in a school corridor.'),
  'principal-office': picture('principal-office', 'Ana talks to the principal, who sits behind a desk.'),
  cafeteria: picture('cafeteria', 'A worker serves food onto Leo’s lunch tray.'),
  janitor: picture('janitor', 'A worker mops the wooden gym floor beside a yellow bucket.'),
  'boat-school': picture('boat-school', 'A boat with desks inside waits at the riverbank.'),
  'forest-school': picture('forest-school', 'Ana and Leo write in their notebooks under tall trees beside a puddle.'),
  'tree-school': picture('tree-school', 'A tree grows through an opening in a classroom roof.'),
  'field-trip': picture('field-trip', 'Mia and Sam stand with their teacher by a giraffe enclosure.'),
  encourage: picture('encourage', 'Ana practises a dance step while Leo cheers her on.'),
  'school-day': picture('school-day', 'Ms. Rosa talks to the four friends at their classroom desks.'),
  mud: picture('mud', 'A boot is beside a patch of wet soil and puddles.'),
  form: picture('form', 'A hand signs a form beside a backpack.'),
  gym: { src: 'assets/images/week-02/gym', w: 1400, h: 1050, alt: 'A school gym with a basketball hoop.' },
  run: WEEK3['r-track'],
  swim: WEEK3['r-swim'],
  'wash-hands': { src: 'assets/images/week-04/y-hands', w: 1400, h: 1050, alt: 'Ana washes her hands at the sink.' },
  plan: WEEK3['w-plan'],
  'help-friend': WEEK3['s-help'],
  'try-again': WEEK3['s-try'],
  'well-done': WEEK3['st-highfive'],
  read: { src: 'assets/images/week-01/read-a-book', w: 1400, h: 1050, alt: 'Mia reads an open book.' },
  sing: { src: 'assets/images/a1-verbs/sing', w: 1400, h: 1050, alt: 'A child sings.' }
};

const word = ([id, phrase, image, example]) => ({ id, word: phrase, phrase, image, example });
const set = (id, title, entries) => ({ id, title, words: entries.map(word) });

export const WORDS = [
  ['lend', 'lend', 'lend', 'Mia lends Sam a pencil for the lesson.'],
  ['throw-away', 'throw away', 'throw-away', 'Sam throws away the scrap of paper.'],
  ['take-a-quiz', 'take a quiz', 'quiz', 'Ana takes a short quiz on her own.'],
  ['share', 'share', 'share', 'Mia and Leo share a picture book.'],
  ['clean-up', 'clean up', 'clean-up', 'Ana can clean up the spill with a cloth.'],
  ['sit-down', 'sit down', 'sit-down', 'Leo sits down before the lesson.'],
  ['stand-up', 'stand up', 'stand-up', 'Sam stands up beside his desk.'],
  ['check-out', 'check out', 'check-out', 'Mia can check out a book and bring it back next week.'],
  ['raise-your-hand', 'raise your hand', 'raise-hand', 'Raise your hand if you have a question.'],
  ['wait-in-line', 'wait in line', 'wait-line', 'The children wait in line for the bus.'],
  ['help', 'help', 'help-books', 'Mia helps Leo carry his books.'],
  ['carry', 'carry', 'cover', 'Leo and Ana carry books to school.']
].map(word);

const clothes = [
  ['jeans', 'jeans', 'Sam wears blue jeans on the weekend.', 'Folded blue denim trousers.'],
  ['socks', 'socks', 'Ana wears white socks with her school shoes.', 'Two white crew socks with green stripes.'],
  ['sneakers', 'sneakers', 'We wear sneakers in the gym.', 'A pair of orange running shoes with white soles.'],
  ['shirt', 'a shirt', 'Leo wears a white shirt for the school photo.', 'A white button-up top with a collar.'],
  ['tie', 'a tie', 'Leo wears a blue tie with his shirt.', 'A long blue strip of fabric with a pointed end.'],
  ['pants', 'pants', 'These navy pants are part of the uniform.', 'Long navy trousers with straight legs.'],
  ['skirt', 'a skirt', 'Ana wears a skirt in the school photo.', 'A green pleated garment.'],
  ['shoes', 'shoes', 'Her school shoes are black.', 'A pair of black lace-up school footwear.'],
  ['jacket', 'a jacket', 'Mia puts on her jacket before she goes outside.', 'A mustard yellow long-sleeved top with a zip.'],
  ['t-shirt', 'a T-shirt', 'Leo wears a red T-shirt at home.', 'A red short-sleeved top with a round neck.'],
  ['shorts', 'shorts', 'We can wear shorts when it is hot.', 'Teal short trousers.'],
  ['uniform', 'a uniform', 'At this school, children wear a uniform.', 'A school outfit with a blazer, white shirt, navy tie and matching trousers.']
];
for (const [id, , , alt] of clothes) IMAGES[`clothes-${id}`] = picture(`clothes-${id}`, alt);

export const EXTRA_WORD_SETS = [
  set('places', 'Places at school', [
    ['classroom', 'a classroom', 'school-day', 'We have lessons in the classroom.'],
    ['library', 'a library', 'check-out', 'You can borrow a book from the library.'],
    ['gym', 'a gym', 'gym', 'We can play basketball in the gym.'],
    ['hall', 'a hall', 'hall', 'Walk in the hall.'],
    ['auditorium', 'an auditorium', 'auditorium', 'The talent show is in the auditorium.'],
    ['principal-office', 'the principal’s office', 'principal-office', 'Ana visits the principal’s office.'],
    ['cafeteria', 'a cafeteria', 'cafeteria', 'We eat lunch in the cafeteria.']
  ]),
  set('workers', 'People who help at school', [
    ['librarian', 'a librarian', 'check-out', 'The librarian helps us find books.'],
    ['janitor', 'a janitor', 'janitor', 'The janitor keeps the school clean.'],
    ['cafeteria-worker', 'a cafeteria worker', 'cafeteria', 'A cafeteria worker serves lunch.'],
    ['principal', 'a principal', 'principal-office', 'The principal leads the school.'],
    ['teacher', 'a teacher', 'school-day', 'Ms. Rosa teaches our class.']
  ]),
  set('clothes', 'Clothes', clothes.map(([id, phrase, example]) => [id, phrase, `clothes-${id}`, example])),
  set('help', 'Ask for and offer help', [
    ['can-i', 'Can I …, please?', 'check-out', 'Can I take this book home, please?'],
    ['can-you', 'Can you …, please?', 'lend', 'Can you lend me a pencil, please?'],
    ['can-i-help', 'Can I help you?', 'help-friend', 'Can I help you with the ball?'],
    ['let-me-help', 'Let me help you.', 'help-books', 'Let me help you carry the books.'],
    ['yes-please', 'Yes, please.', 'share', '“Can I help you read the story?” “Yes, please.”'],
    ['of-course', 'Of course!', 'clean-up', '“Can you help me clean the desk?” “Of course!”'],
    ['no-thank-you', 'No, thank you.', 'principal-office', '“Can I help you with that notebook?” “No, thank you. I’m fine.”']
  ]),
  set('different-schools', 'Different schools', [
    ['boat', 'a boat', 'boat-school', 'The boat is a classroom on the water.'],
    ['forest', 'a forest', 'forest-school', 'Some pupils learn in a forest.'],
    ['roof', 'a roof', 'tree-school', 'The tree grows through the roof.'],
    ['mud', 'mud', 'mud', 'After it rains, there is mud on the ground.']
  ]),
  set('trip', 'On a field trip', [
    ['field-trip', 'a field trip', 'field-trip', 'We visit the zoo on a field trip.'],
    ['school-bus', 'a school bus', 'wait-line', 'The school bus is at the gate.'],
    ['permission-form', 'a permission form', 'form', 'Bring the signed permission form for the trip.'],
    ['stay-together', 'stay together', 'hall', 'Stay together when you walk with your class.'],
    ['ask-a-question', 'ask a question', 'raise-hand', 'Raise your hand to ask your teacher a question.']
  ]),
  set('goals', 'Encouragement and study goals', [
    ['great-job', 'Great job!', 'well-done', '“That was a great pass. Great job!”'],
    ['keep-trying', 'Keep trying!', 'try-again', '“Try one more time. Keep trying!”'],
    ['almost-there', 'You’re almost there!', 'encourage', '“That dance step is hard, but you’re almost there!”'],
    ['practice', 'practice', 'auditorium', 'Mia practises her speech before the show.'],
    ['goal', 'set a goal', 'plan', 'My goal is to read one page a day by Friday.'],
    ['on-time', 'finish on time', 'quiz', 'Ana finishes her work before the bell.']
  ])
];

// The pictures show these scenes; the machine can apply either grammar to the action.
export const SCENES = [
  ['mia', 'lend', 'lends', 'a pencil to Sam', 'lend'],
  ['sam', 'throw', 'throws', 'away the paper', 'throw-away'],
  ['ana', 'take', 'takes', 'a quiz', 'quiz'],
  ['they', 'share', 'shares', 'a picture book', 'share'],
  ['ana', 'clean', 'cleans', 'up the desk', 'clean-up'],
  ['leo', 'sit', 'sits', 'down', 'sit-down'],
  ['sam', 'stand', 'stands', 'up', 'stand-up'],
  ['mia', 'check', 'checks', 'out a book', 'check-out'],
  ['ana', 'raise', 'raises', '{poss} hand', 'raise-hand'],
  ['they', 'wait', 'waits', 'in line for the bus', 'wait-line'],
  ['mia', 'help', 'helps', 'Leo carry his books', 'help-books'],
  ['leo', 'wear', 'wears', 'a school uniform', 'uniform'],
  ['sam', 'wear', 'wears', 'jeans and sneakers', 'casual-clothes'],
  ['mia', 'give', 'gives', 'a speech', 'auditorium'],
  ['they', 'walk', 'walks', 'in the hall', 'hall'],
  ['ana', 'visit', 'visits', 'the principal', 'principal-office'],
  ['leo', 'eat', 'eats', 'lunch in the cafeteria', 'cafeteria'],
  ['sam', 'go', 'goes', 'to school by boat', 'boat-school'],
  ['they', 'learn', 'learns', 'in the forest', 'forest-school'],
  ['leo', 'run', 'runs', 'on the track', 'run'],
  ['they', 'swim', 'swims', 'in the pool', 'swim'],
  ['ana', 'wash', 'washes', '{poss} hands', 'wash-hands'],
  ['mia', 'make', 'makes', 'a plan', 'plan'],
  ['ana', 'dance', 'dances', 'on the stage', 'encourage'],
  ['they', 'stay', 'stays', 'with the group', 'field-trip'],
  ['mia', 'read', 'reads', 'a book', 'read']
].map(([who, base, s, rest, image]) => ({ who, image, verb: { id: image, base, s, rest } }));
export const VERBS = SCENES.map(({ verb }) => verb);
