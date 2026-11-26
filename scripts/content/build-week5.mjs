// Writes the Unit 4 content and registers Week 5 in the existing curriculum.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { SUBJECTS, VERBS, IMAGES, WORDS, EXTRA_WORD_SETS } from './week5-data.mjs';
import { META, LEARN, SPEAKING, EXAMPLES, PICTURE_REVEAL, QUESTION_DOOR, YES_NO } from './week5-week.mjs';
import { BANKS, QUESTIONS, CARDS, PASSAGES } from './week5-questions.mjs';

const dir = new URL('../../site/data/weeks/week-05/', import.meta.url);
const curriculumFile = new URL('../../site/data/curriculum.json', import.meta.url);
const write = (file, data) => writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
mkdirSync(dir, { recursive: true });
write(new URL('week.json', dir), {
  ...META, images: IMAGES, words: WORDS, learn: LEARN, speaking: SPEAKING,
  games: { pictureReveal: PICTURE_REVEAL, sentenceSwitch: { subjects: SUBJECTS, verbs: VERBS }, questionDoor: QUESTION_DOOR, yesNo: YES_NO, memory: { pairs: 6 } },
  extraWordSets: EXTRA_WORD_SETS, examples: EXAMPLES
});
write(new URL(META.questionsFile, dir), { weekId: META.id, contentVersion: META.contentVersion, banks: BANKS, cards: CARDS, passages: PASSAGES, questions: QUESTIONS });

const curriculum = JSON.parse(readFileSync(curriculumFile, 'utf8'));
const entry = {
  id: META.id, number: 5, title: META.title, subtitle: META.subtitle, published: META.published,
  file: 'data/weeks/week-05/week.json', cover: IMAGES.cover.src, coverAlt: IMAGES.cover.alt, unit: 'Unit 4'
};
const index = curriculum.weeks.findIndex((week) => week.id === META.id);
if (index < 0) curriculum.weeks.push(entry);
else curriculum.weeks[index] = entry;
if (!curriculum.weeks.some((week) => week.id === 'week-06')) {
  curriculum.weeks.push({ id: 'week-06', number: 6, title: 'Coming soon', subtitle: 'New clues are on the way.', published: false, unit: 'Unit 5' });
}
write(curriculumFile, curriculum);
console.log(`${META.id}: ${QUESTIONS.length} questions, ${LEARN.length} lessons, ${SPEAKING.length} speaking cards.`);
