import test from 'node:test';
import assert from 'node:assert/strict';
import { askWh, buildSentence, canAsk, machineSteps, formula, stepText } from '../../site/js/core/wh.js';
import { grammarOf } from '../../site/js/core/tense.js';

const sam = { id: 'sam', text: 'Sam', person: 'single', poss: 'his', short: 'he' };
const they = { id: 'they', text: 'They', person: 'plural', poss: 'their', short: 'they' };
const I = { id: 'I', text: 'I', person: 'plural', poss: 'my', short: 'I' };
const you = { id: 'you', text: 'You', person: 'plural', poss: 'your', short: 'you' };
const around = { base: 'run', ing: 'running', rest: 'around the cone', where: 'around the cone', how: 'Fast!' };
const baton = { base: 'pass', ing: 'passing', rest: 'the baton on the track', thing: 'the baton', where: 'on the track', why: 'Because the next runner is waiting.' };
const legs = { base: 'tie', ing: 'tying', rest: '{poss} legs together', how: 'With a scarf.' };

const q = (s, v, w) => {
  const r = buildSentence(s, v, w);
  return `${r.text} ${r.answers.yes}`;
};

test('Who keeps the word order; the answer names the person', () => {
  assert.equal(q(sam, around, 'who'), 'Who is running around the cone? Sam is.');
  assert.equal(q(they, around, 'who'), 'Who is running around the cone? They are.');
  assert.equal(q(I, around, 'who'), 'Who is running around the cone? You are.');
  assert.equal(q(you, around, 'who'), 'Who is running around the cone? I am.');
});

test('What asks about a thing, or about the action', () => {
  assert.equal(q(sam, baton, 'what'), 'What is Sam passing on the track? The baton.');
  assert.equal(q(sam, around, 'what'), 'What is Sam doing? He is running around the cone.');
  assert.equal(q(they, legs, 'what'), 'What are they doing? They are tying their legs together.');
  assert.equal(q(you, around, 'what'), 'What are you doing? I am running around the cone.');
  assert.equal(q(I, legs, 'what'), 'What am I doing? You are tying your legs together.');
});

test('Where moves the helper and takes the place out of the question', () => {
  assert.equal(q(sam, around, 'where'), 'Where is Sam running? Around the cone.');
  assert.equal(q(sam, baton, 'where'), 'Where is Sam passing the baton? On the track.');
  assert.equal(q(they, around, 'where'), 'Where are they running? Around the cone.');
  assert.equal(q(I, around, 'where'), 'Where am I running? Around the cone.');
});

test('Why and How use the ready answers', () => {
  assert.equal(q(sam, baton, 'why'), 'Why is Sam passing the baton on the track? Because the next runner is waiting.');
  assert.equal(q(they, legs, 'how'), 'How are they tying their legs together? With a scarf.');
  assert.equal(canAsk(around, 'why'), false);
  assert.equal(canAsk(around, 'how'), true);
  assert.equal(askWh(sam, around, 'how').answer, 'Fast!');
});

test('Positive and negative stay Present Continuous', () => {
  assert.equal(buildSentence(sam, around, 'positive').text, 'Sam is running around the cone.');
  assert.equal(buildSentence(they, around, 'negative').text, "They aren't running around the cone.");
});

test('Change Machine: sentence → question → answer', () => {
  const s = machineSteps(sam, around, 'where');
  assert.deepEqual(s.map((x) => x.label), ['+', '?', 'A']);
  assert.equal(stepText(s[0]), 'Sam is running around the cone.');
  assert.equal(stepText(s[1]), 'Where is Sam running?');
  assert.equal(stepText(s[2]), 'Around the cone.');
  assert.equal(s[1].blocks[0].role, 'wh');
  const w = machineSteps(sam, around, 'who');
  assert.equal(stepText(w[1]), 'Who is running around the cone?');
  assert.equal(formula(sam, 'who')[0].t, 'Who');
  assert.equal(formula(sam, 'where')[0].t, 'Where');
});

test('grammarOf picks the Wh- grammar and hides modes that cannot be asked', () => {
  const g = grammarOf({ grammar: 'wh-questions' });
  assert.equal(g.id, 'wh-questions');
  const modes = g.modes.filter((m) => !m.needs || around[m.needs]).map((m) => m.id);
  assert.deepEqual(modes, ['who', 'what', 'where', 'how']);
  assert.equal(grammarOf({}).id, 'present-simple');
});
