// Writes site/data/weeks/week-04/{week,questions}.json and publishes Week 4 in the curriculum.
import { fileURLToPath } from 'node:url';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { SUBJECTS, VERBS, IMAGES } from './week4-data.mjs';
import { META, WORDS, EXTRA_WORD_SETS, LEARN, SPEAKING, EXAMPLES, PICTURE_REVEAL, QUESTION_DOOR, YES_NO } from './week4-week.mjs';
import { BANKS, QUESTIONS, CARDS, PASSAGES } from './week4-questions.mjs';

const REPO = fileURLToPath(new URL('../..', import.meta.url)).replace(/[\/]$/, '');
const dir = `${REPO}/site/data/weeks/week-04`;
mkdirSync(dir, { recursive: true });

const week = {
  ...META,
  images: IMAGES,
  words: WORDS,
  learn: LEARN,
  speaking: SPEAKING,
  games: {
    pictureReveal: PICTURE_REVEAL,
    sentenceSwitch: { subjects: SUBJECTS, verbs: VERBS },
    questionDoor: QUESTION_DOOR,
    yesNo: YES_NO,
    memory: { pairs: 6 }
  },
  extraWordSets: EXTRA_WORD_SETS,
  examples: EXAMPLES
};
writeFileSync(`${dir}/week.json`, JSON.stringify(week, null, 2) + '\n');
writeFileSync(`${dir}/questions.json`, JSON.stringify({ weekId: 'week-04', contentVersion: '1.0.0', banks: BANKS, cards: CARDS, passages: PASSAGES, questions: QUESTIONS }, null, 2) + '\n');

const cur = JSON.parse(readFileSync(`${REPO}/site/data/curriculum.json`, 'utf8'));
const i = cur.weeks.findIndex((w) => w.id === 'week-04');
cur.weeks[i] = {
  id: 'week-04', number: 4, title: 'Should and How Often', subtitle: "You should rest. You shouldn't share. How often …?",
  published: true, file: 'data/weeks/week-04/week.json', cover: 'assets/images/week-04/week-04-cover',
  coverAlt: 'A school nurse’s room: Ana is sneezing, Sam is washing his hands, Leo has a thermometer and Mia has a get-well card.', unit: 'Unit 3'
};
if (!cur.weeks.some((w) => w.id === 'week-05')) cur.weeks.push({ id: 'week-05', number: 5, title: 'Coming soon', subtitle: 'New clues are on the way.', published: false, unit: 'Unit 4' });
writeFileSync(`${REPO}/site/data/curriculum.json`, JSON.stringify(cur, null, 2) + '\n');
console.log(`week-04: ${QUESTIONS.length} questions, ${LEARN.length} learn topics, ${SPEAKING.length} speaking cards, ${Object.keys(IMAGES).length} images`);
