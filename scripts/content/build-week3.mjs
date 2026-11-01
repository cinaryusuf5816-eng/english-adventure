// Writes site/data/weeks/week-03/{week,questions}.json and publishes Week 3 in the curriculum.
import { fileURLToPath } from 'node:url';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { SUBJECTS, VERBS, IMAGES } from './week3-data.mjs';
import { META, WORDS, EXTRA_WORD_SETS, LEARN, SPEAKING, EXAMPLES, PICTURE_REVEAL, QUESTION_DOOR, YES_NO } from './week3-week.mjs';
import { BANKS, QUESTIONS, CARDS, PASSAGES } from './week3-questions.mjs';

const REPO = fileURLToPath(new URL('../..', import.meta.url)).replace(/[\/]$/, '');
const dir = `${REPO}/site/data/weeks/week-03`;
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
writeFileSync(`${dir}/questions.json`, JSON.stringify({ weekId: 'week-03', contentVersion: '1.0.0', banks: BANKS, cards: CARDS, passages: PASSAGES, questions: QUESTIONS }, null, 2) + '\n');

const cur = JSON.parse(readFileSync(`${REPO}/site/data/curriculum.json`, 'utf8'));
const i = cur.weeks.findIndex((w) => w.id === 'week-03');
cur.weeks[i] = {
  id: 'week-03', number: 3, title: 'Wh- Questions', subtitle: 'Who? What? Where? When? How? Why?',
  published: true, file: 'data/weeks/week-03/week.json', cover: 'assets/images/week-03/week-03-cover',
  coverAlt: 'A big obstacle course: Sam, Mia, Leo and Ana are moving along the path.', unit: 'Unit 2'
};
if (!cur.weeks.some((w) => w.id === 'week-04')) cur.weeks.push({ id: 'week-04', number: 4, title: 'Coming soon', subtitle: 'New clues are on the way.', published: false, unit: 'Unit 3' });
writeFileSync(`${REPO}/site/data/curriculum.json`, JSON.stringify(cur, null, 2) + '\n');
console.log(`week-03: ${QUESTIONS.length} questions, ${LEARN.length} learn topics, ${SPEAKING.length} speaking cards, ${Object.keys(IMAGES).length} images`);
