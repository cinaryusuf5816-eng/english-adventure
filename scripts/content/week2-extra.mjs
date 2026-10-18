// Week 2 additions: book page 2 "Sports and Activities" and words from the reading
// "A Good Sport" (our own sentences). Imported by build-week2.mjs after the main tables.
import { EXTRA_WORD_SETS, LEARN, EXAMPLES, PICTURE_REVEAL, YES_NO, SPEAKING, QUESTION_DOOR } from './week2-week.mjs';

EXTRA_WORD_SETS.splice(1, 0,
  {
    id: 'activities', title: 'Book words: Sports and activities',
    words: [
      ['do-gymnastics', 'do gymnastics', 'act-gymnastics', 'Mia is doing gymnastics.'],
      ['play-baseball', 'play baseball', 'sp-bat', 'Leo is playing baseball.'],
      ['bounce-a-ball', 'bounce a ball', 'act-bounce', 'Ana is bouncing a ball.'],
      ['do-karate', 'do karate', 'act-karate', 'Leo is doing karate.'],
      ['jump-rope', 'jump rope', 'v-jump', 'Ana is jumping rope.'],
      ['go-skating', 'go skating', 'act-skating', 'Sam is going skating.'],
      ['ride-a-bike', 'ride a bike', 'ride-a-bike', 'Ana is riding a bike.'],
      ['go-swimming', 'go swimming', 'sp-pool', 'Ana is going swimming.'],
      ['play-tag', 'play tag', 'act-tag', 'The children are playing tag.'],
      ['run-a-race', 'run a race', 'sp-field', 'Mia and Sam are running a race.']
    ].map(([id, phrase, image, example]) => ({ id, word: phrase, phrase, image, example }))
  },
  {
    id: 'story', title: 'Story words: A good game',
    words: [
      ['score-a-goal', 'score a goal', 'sp-goal', 'Sam is scoring a goal!'],
      ['kick-the-ball', 'kick the ball', 'play-football', 'Sam is kicking the ball.'],
      ['pass-the-ball', 'pass the ball', 'they-play-football', 'The children are passing the ball.'],
      ['run-across-the-field', 'run across the field', 'sp-field', 'Mia and Sam are running across the field.'],
      ['cheer', 'cheer', 'st-cheer', 'Mia and Ana are cheering for the team.'],
      ['shout', 'shout “Great job!”', 'st-cheer', 'Ana is shouting, “Great job!”'],
      ['give-high-fives', 'give high fives', 'st-highfive', 'Sam and Leo are giving high fives.'],
      ['win-the-game', 'win the game', 'st-highfive', 'Our team is winning the game!']
    ].map(([id, phrase, image, example]) => ({ id, word: phrase, phrase, image, example }))
  }
);

const at = LEARN.findIndex((t) => t.id === 'sports-words') + 1;
LEARN.splice(at, 0,
  {
    id: 'sports-activities', title: 'Book words: do gymnastics, go skating …', rule: 'Sports and activities from the book: do, play, go … + -ing.', image: 'act-gymnastics',
    examples: [
      { text: 'Mia **is doing gymnastics**.', image: 'act-gymnastics', label: 'do gymnastics → doing gymnastics' },
      { text: 'Leo **is playing baseball**.', image: 'sp-bat', label: 'play baseball' },
      { text: 'Ana **is bouncing a ball**.', image: 'act-bounce', label: 'bounce → bouncing (the e goes)' },
      { text: 'Leo **is doing karate**.', image: 'act-karate', label: 'do karate' },
      { text: 'Ana **is jumping rope**.', image: 'v-jump', label: 'jump rope' },
      { text: 'Sam **is going skating**.', image: 'act-skating', label: 'go skating → going skating' },
      { text: 'Ana **is going swimming**.', image: 'sp-pool', label: 'go swimming' },
      { text: 'The children **are playing tag**.', image: 'act-tag', label: 'play tag' },
      { text: 'Mia and Sam **are running a race**.', image: 'sp-field', label: 'run → running (double n)' },
      { text: 'Ana **is riding a bike**.', image: 'ride-a-bike', label: 'ride → riding' }
    ],
    groups: [
      { label: 'do', words: ['do gymnastics', 'do karate'] },
      { label: 'play', words: ['play baseball', 'play tag'] },
      { label: 'go', words: ['go skating', 'go swimming'] },
      { label: 'other', words: ['bounce a ball', 'jump rope', 'ride a bike', 'run a race'] }
    ],
    practice: [
      { mode: 'together', prompt: 'Leo is ___ karate.', image: 'act-karate', options: ['doing', 'playing', 'going'], answer: 'a', explain: 'do karate → Leo is doing karate.' },
      { mode: 'try', prompt: 'Sam is ___ skating.', image: 'act-skating', options: ['doing', 'going'], answer: 'b', explain: 'go skating → Sam is going skating.' }
    ],
    teacherNote: 'Compass Unit 2 vocabulary “Sports and Activities”. Point out the verb partners: do gymnastics / karate, play baseball / tag, go skating / swimming.'
  },
  {
    id: 'story-words', title: 'Story words: a good game', rule: 'Action words from the reading “A Good Sport”, in our own sentences.', image: 'st-highfive',
    examples: [
      { text: 'Look! Sam **is running across the field**.', image: 'sp-field' },
      { text: 'The children **are passing the ball**.', image: 'they-play-football' },
      { text: 'Sam **is kicking the ball** … Goal! He **is scoring a goal**!', image: 'sp-goal' },
      { text: 'Mia and Ana **are cheering** for the team.', image: 'st-cheer' },
      { text: 'Ana **is shouting**, “Great job!”', image: 'st-cheer' },
      { text: 'Our team **is winning** the game!', image: 'st-highfive', label: 'win → winning (double n)' },
      { text: 'Now Sam and Leo **are giving high fives**.', image: 'st-highfive' }
    ],
    practice: [
      { mode: 'together', prompt: 'Mia and Ana ___ for the team.', image: 'st-cheer', options: ['are cheering', 'is cheering'], answer: 'a', explain: 'Mia and Ana = they → are cheering.' },
      { mode: 'try', prompt: 'Our team is ___ the game!', image: 'st-highfive', options: ['wining', 'winning'], answer: 'b', explain: 'win → winning (double n).' }
    ],
    teacherNote: 'Read the book story first. These sentences reuse its action words (score a goal, pass, kick, cheer, shout, give high fives, win) in Present Continuous.'
  }
);

EXAMPLES.push(...[
  ['ex-23', 'act-gymnastics', 'mia', 'act-gymnastics', 'do gymnastics'], ['ex-24', 'sp-bat', 'leo', 'act-baseball', 'play baseball'],
  ['ex-25', 'act-bounce', 'ana', 'act-bounce', 'bounce → bouncing'], ['ex-26', 'act-karate', 'he', 'act-karate', 'do karate'],
  ['ex-27', 'v-jump', 'she', 'act-jump-rope', 'jump rope'], ['ex-28', 'act-skating', 'sam', 'act-skating', 'go skating'],
  ['ex-29', 'sp-pool', 'ana', 'act-swimming', 'go swimming'], ['ex-30', 'act-tag', 'they', 'act-tag', 'play tag'],
  ['ex-31', 'sp-field', 'they', 'act-race', 'run a race'], ['ex-32', 'sp-goal', 'sam', 'st-score', 'score a goal'],
  ['ex-33', 'st-cheer', 'they', 'st-cheer', 'cheer'], ['ex-34', 'st-highfive', 'we', 'st-highfive', 'give high fives']
].map(([id, image, subject, verb, note]) => ({ id, image, subject, verb, note })));

PICTURE_REVEAL.push(...[
  ['act-gymnastics', 'She', 'doing gymnastics', 'She is doing gymnastics.'],
  ['act-karate', 'He', 'doing karate', 'He is doing karate.'],
  ['act-skating', 'He', 'going skating', 'He is going skating.'],
  ['act-bounce', 'She', 'bouncing a ball', 'She is bouncing a ball.'],
  ['act-tag', 'They', 'playing tag', 'They are playing tag.'],
  ['st-cheer', 'They', 'cheering', 'They are cheering for the team.']
].map(([image, subject, word, sentence]) => ({ image, subject, word, sentence })));

YES_NO.push(...[
  ['act-karate', 'Leo is doing karate.', 'Is Leo doing gymnastics?', ["No, he isn't.", 'Yes, he is.', "No, he doesn't."], 'a', 'Look: a white karate suit.'],
  ['act-skating', 'Sam is going skating in the park.', 'Is Sam going skating?', ['Yes, he is.', 'Yes, he does.', "No, he isn't."], 'a', 'Sam = he.'],
  ['act-tag', 'The children are playing tag.', 'Are they playing baseball?', ['Yes, they are.', "No, they aren't.", "No, they don't."], 'b', 'They are playing tag.'],
  ['st-highfive', 'Sam and Leo are giving high fives.', 'Are Sam and Leo giving high fives?', ['Yes, they are.', 'Yes, they is.', "No, they aren't."], 'a', 'Two people → they are.']
].map(([image, clue, question, options, answer, hint], i) => ({ id: `yn-${21 + i}`, image, clue, question, options, answer, hint })));

SPEAKING.push(...[
  ['What is Mia doing?', 'act-gymnastics', ['She is doing …'], 'She is doing gymnastics.'],
  ['Is Leo playing baseball or doing karate?', 'act-karate', ['He is …'], 'He is doing karate.'],
  ['Mime a sport! Your friends ask: “Are you going skating?”', 'act-skating', ['Yes, I am.', "No, I'm not."], 'Are you going skating? Yes, I am!', true],
  ['Look at the game. Who is cheering? Who is scoring a goal?', 'st-cheer', ['… is cheering.', '… is scoring a goal.'], 'Mia and Ana are cheering. Sam is scoring a goal.']
].map(([question, image, help, sample, personal], i) => ({ id: `w2-sp-${19 + i}`, question, image, help, sample, ...(personal ? { personal: true } : {}) })));

QUESTION_DOOR.push(...[
  ['Mia', 'act-gymnastics', 'Mia is doing gymnastics.', ['Is Mia doing gymnastics?', 'Does Mia doing gymnastics?', 'Is Mia do gymnastics?'], 'a', 'Yes, she is.', 'Mia = she → Is … doing?'],
  ['the children', 'act-tag', 'The children are playing tag.', ['Is the children playing tag?', 'Are the children playing tag?'], 'b', 'Yes, they are.', 'the children = they → Are.']
].map(([who, image, clue, options, answer, reveal, hint], i) => ({ id: `door-${11 + i}`, who, image, clue, options, answer, reveal, hint })));
