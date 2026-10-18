// Present Continuous engine (Week 2): sentences, short answers, Change Machine, answer checking.
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSentence, shortAnswers, machineSteps, stepText, splitIng, beOf, formula } from '../../site/js/core/continuous.js';
import { grammarOf } from '../../site/js/core/tense.js';
import { checkText } from '../../site/js/core/answer-check.js';

const I = { text: 'I', person: 'plural', poss: 'my', short: 'I' };
const you = { text: 'You', person: 'plural', poss: 'your', short: 'you' };
const we = { text: 'We', person: 'plural', poss: 'our', short: 'we' };
const they = { text: 'They', person: 'plural', poss: 'their', short: 'they' };
const he = { text: 'He', person: 'single', poss: 'his', short: 'he' };
const mia = { text: 'Mia', person: 'single', poss: 'her', short: 'she' };
const play = { base: 'play', ing: 'playing', rest: 'football' };
const ride = { base: 'ride', ing: 'riding', rest: 'a bike' };
const swim = { base: 'swim', ing: 'swimming', rest: 'in the pool' };
const brush = { base: 'brush', ing: 'brushing', rest: '{poss} teeth' };

test('am / is / are', () => {
  assert.equal(beOf(I), 'am');
  assert.equal(beOf(he), 'is');
  assert.equal(beOf(mia), 'is');
  assert.equal(beOf(you), 'are');
  assert.equal(beOf(they), 'are');
});

test('sentences: + − ?', () => {
  assert.equal(buildSentence(I, play, 'positive').text, 'I am playing football.');
  assert.equal(buildSentence(mia, brush, 'positive').text, 'Mia is brushing her teeth.');
  assert.equal(buildSentence(they, swim, 'positive').text, 'They are swimming in the pool.');
  assert.equal(buildSentence(I, play, 'negative').text, 'I am not playing football.');
  assert.equal(buildSentence(he, ride, 'negative').text, "He isn't riding a bike.");
  assert.equal(buildSentence(we, play, 'negative').text, "We aren't playing football.");
  assert.equal(buildSentence(he, play, 'question').text, 'Is he playing football?');
  assert.equal(buildSentence(mia, ride, 'question').text, 'Is Mia riding a bike?');
  assert.equal(buildSentence(you, swim, 'question').text, 'Are you swimming in the pool?');
  assert.equal(buildSentence(I, play, 'question').text, 'Am I playing football?');
});

test('short answers keep the speaker', () => {
  assert.deepEqual(shortAnswers(you), { yes: 'Yes, I am.', no: "No, I'm not." });
  assert.deepEqual(shortAnswers(mia), { yes: 'Yes, she is.', no: "No, she isn't." });
  assert.deepEqual(shortAnswers(they), { yes: 'Yes, they are.', no: "No, they aren't." });
  assert.deepEqual(shortAnswers(we), { yes: 'Yes, we are.', no: "No, we aren't." });
});

test('-ing spelling comes from the word list and is explained', () => {
  assert.deepEqual(splitIng(play), { stem: 'play', end: 'ing', kind: 'add' });
  assert.deepEqual(splitIng(ride), { stem: 'rid', end: 'ing', kind: 'drop-e' });
  assert.deepEqual(splitIng(swim), { stem: 'swimm', end: 'ing', kind: 'double' });
  assert.equal(splitIng({ base: 'lie', ing: 'lying' }).kind, 'special');
});

test('Change Machine: positive-ing, negative, question, all', () => {
  const ing = machineSteps(he, ride, 'positive-ing');
  assert.deepEqual(ing.map(stepText), ['He ride a bike.', 'He is ride a bike.', 'He is riding a bike.']);
  assert.match(ing[2].caption, /e goes/);
  const neg = machineSteps(he, play, 'negative');
  assert.deepEqual(neg.map(stepText), ['He is playing football.', 'He is not playing football.', "He isn't playing football."]);
  const negI = machineSteps(I, play, 'negative');
  assert.deepEqual(negI.map(stepText), ['I am playing football.', 'I am not playing football.']);
  const q = machineSteps(they, swim, 'question');
  assert.deepEqual(q.map(stepText), ['They are swimming in the pool.', 'Are they swimming in the pool?']);
  const all = machineSteps(mia, brush, 'all');
  assert.deepEqual(all.map(stepText), ['Mia is brushing her teeth.', "Mia isn't brushing her teeth.", 'Is Mia brushing her teeth?']);
  assert.deepEqual(formula(he, 'negative').map((f) => f.t), ['He / She / It', "isn't", 'verb + ing', '…']);
});

test('the week file chooses the grammar', () => {
  assert.equal(grammarOf({ grammar: 'present-continuous' }).id, 'present-continuous');
  assert.equal(grammarOf({}).id, 'present-simple');
  assert.equal(grammarOf({ grammar: 'present-continuous' }).buildSentence(he, play, 'positive').text, 'He is playing football.');
});

test('answers: short and long forms are both right', () => {
  assert.equal(checkText("He is not playing football.", ["He isn't playing football."]).correct, true);
  assert.equal(checkText("They're swimming.", ['They are swimming.']).correct, true);
  assert.equal(checkText("I'm not reading.", ['I am not reading.']).correct, true);
  assert.equal(checkText('She is riding a bike.', ["She's riding a bike."]).correct, true);
  assert.equal(checkText("He isn't playing.", ["He aren't playing."]).correct, false);
  const r = checkText('He isnt playing.', ["He isn't playing."]);
  assert.equal(r.correct, false);
  assert.match(r.notes[0], /isn't/);
  // Week 1 unchanged
  assert.equal(checkText("Mia doesn't play.", ['Mia does not play.']).correct, true);
});
