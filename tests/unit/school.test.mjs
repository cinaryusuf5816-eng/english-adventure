import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSentence, formula, machineSteps, stepText } from '../../site/js/core/school.js';
import { checkText } from '../../site/js/core/answer-check.js';
import { SUBJECTS, SCENES } from '../../scripts/content/week5-data.mjs';

const subject = (id) => SUBJECTS.find((s) => s.id === id);
const verb = (id) => SCENES.find((s) => s.verb.id === id).verb;
const text = (who, action, form) => buildSentence(subject(who), verb(action), form).text;

test('can takes a base verb and preserves proper names and I in questions', () => {
  assert.equal(text('mia', 'check-out', 'positive'), 'Mia can check out a book.');
  assert.equal(text('ana', 'raise-hand', 'negative'), "Ana can't raise her hand.");
  assert.equal(text('ana', 'raise-hand', 'question'), 'Can Ana raise her hand?');
  assert.equal(text('I', 'raise-hand', 'question'), 'Can I raise my hand?');
});

test('can short answers use the answering perspective', () => {
  const answers = (who) => buildSentence(subject(who), verb('sit-down'), 'question').answers;
  assert.deepEqual(answers('I'), { yes: 'Yes, you can.', no: "No, you can't." });
  assert.deepEqual(answers('you'), { yes: 'Yes, I can.', no: "No, I can't." });
  assert.deepEqual(answers('leo'), { yes: 'Yes, he can.', no: "No, he can't." });
});

test('have to agrees in statements and returns to have after do or does', () => {
  assert.equal(text('leo', 'uniform', 'have-positive'), 'Leo has to wear a school uniform.');
  assert.equal(text('they', 'wait-line', 'have-positive'), 'They have to wait in line for the bus.');
  assert.equal(text('they', 'wait-line', 'have-negative'), "They don't have to wait in line for the bus.");
  assert.equal(text('ana', 'raise-hand', 'have-question'), 'Does Ana have to raise her hand?');
  assert.equal(text('I', 'raise-hand', 'have-question'), 'Do I have to raise my hand?');
  const reply = buildSentence(subject('ana'), verb('raise-hand'), 'have-question').answers;
  assert.deepEqual(reply, { yes: 'Yes, she does.', no: "No, she doesn't." });
});

test('Change Machine shows the resulting sentence and the obligation formula', () => {
  const ana = subject('ana');
  const action = verb('raise-hand');
  assert.deepEqual(machineSteps(ana, action, 'have-positive').map(stepText), ['Ana can raise her hand.', 'Ana has to raise her hand.']);
  assert.deepEqual(machineSteps(ana, action, 'have-negative').map(stepText), ['Ana has to raise her hand.', "Ana doesn't have to raise her hand."]);
  assert.deepEqual(machineSteps(ana, action, 'have-question').map(stepText), ['Ana has to raise her hand.', 'Does Ana have to raise her hand?']);
  assert.deepEqual(formula(ana, 'have-question').map(({ t }) => t), ['Does', 'who', 'have to', 'base verb', '…?']);
});

test('typed can answers accept cannot but distinguish a ban from a choice', () => {
  const cannot = ["Ana can't run in the hall."];
  assert.equal(checkText('Ana cannot run in the hall.', cannot).correct, true);
  assert.equal(checkText('Ana can’t run in the hall.', cannot).correct, true);
  assert.match(checkText('Ana cant run in the hall.', cannot).notes.join(' '), /can't/);
  assert.equal(checkText("Ana doesn't have to run in the hall.", cannot).correct, false);
});
