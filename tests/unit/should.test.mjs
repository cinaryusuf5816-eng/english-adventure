import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSentence, askOften, machineSteps, formula, stepText, shortAnswers } from '../../site/js/core/should.js';
import { grammarOf } from '../../site/js/core/tense.js';
import { checkText } from '../../site/js/core/answer-check.js';

const sam = { id: 'sam', text: 'Sam', person: 'single', poss: 'his', short: 'he' };
const mia = { id: 'mia', text: 'Mia', person: 'single', poss: 'her', short: 'she' };
const they = { id: 'they', text: 'They', person: 'plural', poss: 'their', short: 'they' };
const I = { id: 'I', text: 'I', person: 'plural', poss: 'my', short: 'I' };
const you = { id: 'you', text: 'You', person: 'plural', poss: 'your', short: 'you' };
const wash = { base: 'wash', s: 'washes', rest: '{poss} hands', good: true, often: 'always' };
const share = { base: 'share', s: 'shares', rest: 'a drink', bad: true };
const bite = { base: 'bite', s: 'bites', rest: '{poss} nails', bad: true, often: 'never' };
const go = { base: 'go', s: 'goes', rest: 'to the doctor', good: true };

const texts = (steps) => steps.map(stepText);

test('should / shouldn’t sentences keep the base verb', () => {
  assert.equal(buildSentence(sam, wash, 'positive').text, 'Sam should wash his hands.');
  assert.equal(buildSentence(they, share, 'negative').text, "They shouldn't share a drink.");
  assert.equal(buildSentence(mia, go, 'positive').text, 'Mia should go to the doctor.');
});

test('Should …? questions answer with the right advice', () => {
  const q1 = buildSentence(I, go, 'question');
  assert.equal(q1.text, 'Should I go to the doctor?');
  assert.equal(q1.answers.yes, 'Yes, you should.');
  const q2 = buildSentence(mia, share, 'question');
  assert.equal(q2.text, 'Should Mia share a drink?');
  assert.equal(q2.answers.yes, "No, she shouldn't.");
  assert.deepEqual(shortAnswers(you), { yes: 'Yes, I should.', no: "No, I shouldn't." });
});

test('Machine: he washes → he should wash, the -s goes', () => {
  const steps = machineSteps(sam, wash, 'should');
  assert.deepEqual(texts(steps), ['Sam washes his hands.', 'Sam should wash his hands.', 'Sam should wash his hands.']);
  assert.ok(steps[1].blocks.some((b) => b.role === 'end' && b.state === 'gone'));
  assert.deepEqual(texts(machineSteps(they, wash, 'should')), ['They wash their hands.', 'They should wash their hands.']);
});

test('Machine: a bad idea → should not → shouldn’t', () => {
  assert.deepEqual(texts(machineSteps(sam, share, 'shouldnt')), ['Sam shares a drink.', 'Sam should not share a drink.', "Sam shouldn't share a drink."]);
});

test('Machine: Should …? + answer', () => {
  assert.deepEqual(texts(machineSteps(sam, share, 'question')), ["Sam shouldn't share a drink.", 'Should Sam share a drink?', "No, he shouldn't."]);
  assert.deepEqual(texts(machineSteps(I, go, 'question')), ['I should go to the doctor.', 'Should I go to the doctor?', 'Yes, you should.']);
});

test('How often …? uses do / does; the adverb goes before the verb', () => {
  assert.equal(askOften(mia, wash).text, 'How often does Mia wash her hands?');
  assert.equal(askOften(mia, wash).answer, 'Mia always washes her hands.');
  assert.deepEqual(texts(machineSteps(they, bite, 'often')), ['They bite their nails.', 'How often do they bite their nails?', 'They never bite their nails.']);
  assert.equal(formula(sam, 'often').map((x) => x.t).join(' '), 'How often does who verb …?');
});

test('Week grammar and answer checking', () => {
  const g = grammarOf({ grammar: 'should-advice' });
  assert.equal(g.id, 'should-advice');
  assert.deepEqual(g.modes.map((m) => m.id), ['should', 'shouldnt', 'question', 'often']);
  assert.equal(checkText('Leo should not share a drink', ["Leo shouldn't share a drink."]).correct, true);
  assert.equal(checkText("Leo shouldn't shares a drink", ["Leo shouldn't share a drink."]).correct, false);
  assert.ok(checkText('Leo shouldnt share a drink', ["Leo shouldn't share a drink."]).notes.length > 0);
});
