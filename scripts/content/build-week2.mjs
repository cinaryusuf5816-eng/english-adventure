// Writes site/data/weeks/week-02/{week,questions}.json and publishes Week 2 in the curriculum.
import { fileURLToPath } from 'node:url';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { SUBJECTS, VERBS, IMAGES } from './week2-data.mjs';
import { META, WORDS, EXTRA_WORD_SETS, LEARN, SPEAKING, EXAMPLES, PICTURE_REVEAL, QUESTION_DOOR, YES_NO } from './week2-week.mjs';
import './week2-extra.mjs';
import { BANKS, QUESTIONS, CARDS, PASSAGES } from './week2-questions.mjs';

const REPO = fileURLToPath(new URL('../..', import.meta.url)).replace(/[\/]$/, '');
const dir = `${REPO}/site/data/weeks/week-02`;
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
writeFileSync(`${dir}/questions.json`, JSON.stringify({ weekId: 'week-02', contentVersion: '1.0.0', banks: BANKS, cards: CARDS, passages: PASSAGES, questions: QUESTIONS }, null, 2) + '\n');

const cur = JSON.parse(readFileSync(`${REPO}/site/data/curriculum.json`, 'utf8'));
const i = cur.weeks.findIndex((w) => w.id === 'week-02');
cur.weeks[i] = {
  id: 'week-02', number: 2, title: 'Present Continuous', subtitle: 'Now: I am playing, she is playing, are they …?',
  published: true, file: 'data/weeks/week-02/week.json', cover: 'assets/images/week-02/week-02-cover',
  coverAlt: 'A busy sports park: Mia, Sam, Leo and Ana are playing sports.', unit: 'Unit 2'
};
if (!cur.weeks.some((w) => w.id === 'week-03')) cur.weeks.push({ id: 'week-03', number: 3, title: 'Coming soon', subtitle: 'New clues are on the way.', published: false, unit: 'Unit 2' });
writeFileSync(`${REPO}/site/data/curriculum.json`, JSON.stringify(cur, null, 2) + '\n');
console.log(`week-02: ${QUESTIONS.length} questions, ${LEARN.length} learn topics, ${SPEAKING.length} speaking cards, ${Object.keys(IMAGES).length} images`);
