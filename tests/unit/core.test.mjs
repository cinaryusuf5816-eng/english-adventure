// Unit tests for the pure modules. Run: npm run test:unit
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkText, checkJumbled, canonical } from '../../site/js/core/answer-check.js';
import { createSession, getState, recordCheck, recordShowAnswer, recordHint, clearCurrent, summarize, retrySession, mistakesOf, pruneSession, pickQuestions } from '../../site/js/core/session.js';
import { buildSentence } from '../../site/js/core/grammar.js';
import { makeRng, shuffledNotSame } from '../../site/js/core/rng.js';
import { parseHash, matchRoute, buildHash } from '../../site/js/router.js';

// ---------- answer checking ----------
test('spaces, case and curly apostrophes are normalised', () => {
  assert.equal(checkText("  she   doesn’t  play football ", ["She doesn't play football."]).correct, true);
  assert.equal(checkText('SHE DOESN`T PLAY FOOTBALL', ["She doesn't play football."]).correct, true);
});

test('do not = don\'t and does not = doesn\'t', () => {
  assert.equal(checkText('He does not play football.', ["He doesn't play football."]).correct, true);
  assert.equal(checkText("I don't watch TV", ['I do not watch TV.']).correct, true);
});

test('don\'t and doesn\'t stay different', () => {
  assert.equal(checkText("He don't play football.", ["He doesn't play football."]).correct, false);
  assert.equal(checkText("They doesn't play.", ["They don't play."]).correct, false);
  assert.notEqual(canonical("doesn't play"), canonical("don't play"));
});

test('missing apostrophe is not accepted but explained', () => {
  const r = checkText('I dont watch TV', ["I don't watch TV."]);
  assert.equal(r.correct, false);
  assert.match(r.notes.join(' '), /don't/);
});

test('other spelling mistakes are wrong (no fuzzy matching)', () => {
  assert.equal(checkText('He plaies football', ['He plays football.']).correct, false);
  assert.equal(checkText('watchs', ['watches']).correct, false);
});

test('small i is accepted with a gentle note', () => {
  const r = checkText("i don't watch TV.", ["I don't watch TV."]);
  assert.equal(r.correct, true);
  assert.ok(r.notes.some((n) => /big letter/.test(n)));
});

test('empty answer is reported as empty', () => {
  assert.equal(checkText('   ', ['x']).empty, true);
});

test('jumbled accepts every listed order and rejects others', () => {
  const answers = ['I read a book every day', 'Every day I read a book'];
  assert.equal(checkJumbled(['I', 'read', 'a', 'book', 'every', 'day'], answers).correct, true);
  assert.equal(checkJumbled(['every', 'day', 'I', 'read', 'a', 'book'], answers).correct, true);
  assert.equal(checkJumbled(['I', 'a', 'book', 'read', 'every', 'day'], answers).correct, false);
  assert.equal(checkJumbled([], answers).empty, true);
});

// ---------- session / scoring ----------
const Q = (id, target = 'affirmative', v = 1) => ({ id, target, v, type: 'mcq', level: 1 });
const qs = [Q('a'), Q('b', 'negative'), Q('c', 'question'), Q('d', 'question')];
const byId = new Map(qs.map((q) => [q.id, q]));

test('first try is recorded once; repeated checks are ignored after success', () => {
  const s = createSession({ weekId: 'w', bank: 'mcq', questionIds: ['a'], mode: 'practice', settings: {} });
  const st = getState(s, qs[0]);
  recordCheck(st, 'b', true);
  const again = recordCheck(st, 'b', true);
  assert.equal(again.ignored, true);
  assert.equal(st.attempts, 1);
  assert.equal(st.status, 'correct-first');
  assert.equal(summarize(s, byId).firstTry, 1);
});

test('a later correct answer does not change the first-try result', () => {
  const s = createSession({ weekId: 'w', bank: 'mcq', questionIds: ['a'], mode: 'practice', settings: {} });
  const st = getState(s, qs[0]);
  recordCheck(st, 'x', false);
  recordCheck(st, 'b', true);
  assert.equal(st.firstCorrect, false);
  assert.equal(st.firstResponse, 'x');
  assert.equal(st.status, 'correct-retry');
  const sum = summarize(s, byId);
  assert.equal(sum.firstTry, 0);
  assert.equal(sum.withHelp, 1);
});

test('show answer never gives a point and locks the question', () => {
  const s = createSession({ weekId: 'w', bank: 'mcq', questionIds: ['a'], mode: 'practice', settings: {} });
  const st = getState(s, qs[0]);
  recordHint(st);
  recordShowAnswer(st);
  assert.equal(recordCheck(st, 'b', true).ignored, true);
  const sum = summarize(s, byId);
  assert.equal(sum.firstTry, 0);
  assert.equal(sum.shown, 1);
  assert.equal(st.hintUsed, true);
});

test('clear removes only the draft', () => {
  const s = createSession({ weekId: 'w', bank: 'mcq', questionIds: ['a'], mode: 'practice', settings: {} });
  const st = getState(s, qs[0]);
  recordCheck(st, 'x', false);
  clearCurrent(st);
  assert.equal(st.current, null);
  assert.equal(st.attempts, 1);
  assert.equal(st.firstResponse, 'x');
});

test('retry mistakes makes a new round and keeps the old one unchanged', () => {
  const s = createSession({ weekId: 'w', bank: 'mcq', questionIds: ['a', 'b', 'c', 'd'], mode: 'practice', settings: { n: '5' } });
  recordCheck(getState(s, qs[0]), 'ok', true);
  recordCheck(getState(s, qs[1]), 'no', false);
  recordShowAnswer(getState(s, qs[2]));
  const before = JSON.stringify(s);
  const r = retrySession(s, byId);
  assert.deepEqual(r.questionIds, ['b', 'c', 'd']);
  assert.equal(r.round, 2);
  assert.equal(r.parentId, s.id);
  assert.deepEqual(r.states, {});
  assert.equal(JSON.stringify(s), before);
  assert.deepEqual(mistakesOf(s, byId), ['b', 'c', 'd']);
});

test('a changed question version starts fresh; removed questions do not crash', () => {
  const s = createSession({ weekId: 'w', bank: 'mcq', questionIds: ['a', 'zzz'], mode: 'practice', settings: {} });
  recordCheck(getState(s, qs[0]), 'ok', true);
  const changed = { ...qs[0], v: 2 };
  assert.equal(getState(s, changed).status, 'unanswered');
  s.states.zzz = { v: 1, status: 'correct-first' };
  pruneSession(s, byId);
  assert.deepEqual(s.questionIds, ['a']);
  assert.equal(s.states.zzz, undefined);
});

test('pickQuestions respects bank, topic and count', () => {
  const rng = makeRng(1);
  const all = [...qs, { id: 'e', type: 'fill', target: 'negative', level: 1 }];
  assert.equal(pickQuestions(all, { bank: 'mcq', target: 'question', count: '10', rng }).length, 2);
  assert.equal(pickQuestions(all, { bank: 'mcq', target: 'all', count: '5', rng }).length, 4);
  assert.equal(pickQuestions(all, { bank: 'fill', target: 'all', count: 'all', rng }).length, 1);
});

test('shuffle is repeatable with the same seed and never returns the same order', () => {
  const list = ['a', 'b', 'c'];
  assert.deepEqual(shuffledNotSame(list, makeRng(42)), shuffledNotSame(list, makeRng(42)));
  for (let seed = 0; seed < 50; seed++) assert.notDeepEqual(shuffledNotSame(list, makeRng(seed)), list);
});

// ---------- grammar (Sentence Switch) ----------
const week = JSON.parse(readFileSync(new URL('../../site/data/weeks/week-01/week.json', import.meta.url)));
const sw = week.games.sentenceSwitch;
const subj = (id) => sw.subjects.find((s) => s.id === id);
const verb = (id) => sw.verbs.find((v) => v.id === id);

test('sentence switch: he / she / it and names use the verified s-forms', () => {
  assert.equal(buildSentence(subj('he'), verb('watch-tv'), 'positive').text, 'He watches TV.');
  assert.equal(buildSentence(subj('mia'), verb('study-english'), 'positive').text, 'Mia studies English.');
  assert.equal(buildSentence(subj('she'), verb('have-breakfast'), 'positive').text, 'She has breakfast.');
  assert.equal(buildSentence(subj('they'), verb('play-football'), 'positive').text, 'They play football.');
});

test('sentence switch: negatives and questions go back to the base verb', () => {
  assert.equal(buildSentence(subj('she'), verb('have-breakfast'), 'negative').text, "She doesn't have breakfast.");
  assert.equal(buildSentence(subj('sam'), verb('study-english'), 'question').text, 'Does Sam study English?');
  assert.equal(buildSentence(subj('you'), verb('play-football'), 'question').text, 'Do you play football?');
  assert.equal(buildSentence(subj('I'), verb('drink-water'), 'negative').text, "I don't drink water.");
});

test('sentence switch: possessives follow the subject', () => {
  assert.equal(buildSentence(subj('she'), verb('brush-teeth'), 'positive').text, 'She brushes her teeth.');
  assert.equal(buildSentence(subj('I'), verb('brush-teeth'), 'positive').text, 'I brush my teeth.');
  assert.equal(buildSentence(subj('he'), verb('do-homework'), 'negative').text, "He doesn't do his homework.");
  assert.equal(buildSentence(subj('you'), verb('brush-teeth'), 'question').text, 'Do you brush your teeth?');
});

test('sentence switch: short answers keep the speaker', () => {
  assert.deepEqual(buildSentence(subj('you'), verb('like-cats'), 'question').answers, { yes: 'Yes, I do.', no: "No, I don't." });
  assert.deepEqual(buildSentence(subj('sam'), verb('like-cats'), 'question').answers, { yes: 'Yes, he does.', no: "No, he doesn't." });
  assert.deepEqual(buildSentence(subj('they'), verb('like-cats'), 'question').answers, { yes: 'Yes, they do.', no: "No, they don't." });
});

// ---------- router ----------
test('router parses safe hashes and rejects strange ones', () => {
  assert.deepEqual(matchRoute(parseHash('#/week/week-01/learn/habits/3')), { name: 'learn', weekId: 'week-01', topic: 'habits', step: '3' });
  assert.equal(matchRoute(parseHash('#/week/week-01/practise/mcq/play')).name, 'practise-play');
  assert.equal(matchRoute(parseHash('#/<img src=x>')).name, 'bad');
  assert.equal(matchRoute(parseHash('#/nothing/here')).name, 'not-found');
  assert.equal(matchRoute(parseHash('')).name, 'home');
  assert.equal(matchRoute(parseHash('#/%E0%A4%A')).name, 'bad');
  assert.equal(buildHash(['week', 'week-01', 'practise', 'mcq'], { n: '10', target: 'negative' }), '#/week/week-01/practise/mcq?n=10&target=negative');
});

// ---------- speech: present-tense "read" must sound like "reed" ----------
import { forSpeech } from '../../site/js/speech.js';
test('Listen: "read" is spoken as present tense, text marks removed, other words unchanged', () => {
  assert.equal(forSpeech('I **read** every day.'), 'I reed every day.');
  assert.equal(forSpeech('Do you read books?'), 'Do you reed books?');
  assert.equal(forSpeech('Read. Answer.'), 'reed. Answer.');
  assert.equal(forSpeech('She reads a book.'), 'She reads a book.');
  assert.equal(forSpeech('He likes bread.'), 'He likes bread.');
});

// ---------- Change Machine ----------
import { machineSteps, stepText } from '../../site/js/core/machine.js';
const last = (steps) => stepText(steps[steps.length - 1]);
test('Change Machine: negative steps end in the right sentence (incl. has / studies / does)', () => {
  assert.equal(last(machineSteps(subj('he'), verb('play-football'), 'negative')), "He doesn't play football.");
  assert.equal(last(machineSteps(subj('she'), verb('have-breakfast'), 'negative')), "She doesn't have breakfast.");
  assert.equal(last(machineSteps(subj('mia'), verb('study-english'), 'negative')), "Mia doesn't study English.");
  assert.equal(last(machineSteps(subj('he'), verb('do-homework'), 'negative')), "He doesn't do his homework.");
  assert.equal(last(machineSteps(subj('they'), verb('watch-tv'), 'negative')), "They don't watch TV.");
});
test('Change Machine: question steps and the -s that jumps to Does', () => {
  const s = machineSteps(subj('he'), verb('watch-tv'), 'question');
  assert.equal(stepText(s[0]), 'He watches TV.');
  assert.equal(last(s), 'Does he watch TV?');
  assert.ok(s[s.length - 1].fly && s[s.length - 1].fly.text === 'es');
  assert.equal(last(machineSteps(subj('mia'), verb('study-english'), 'question')), 'Does Mia study English?');
  assert.equal(last(machineSteps(subj('you'), verb('play-football'), 'question')), 'Do you play football?');
  assert.equal(last(machineSteps(subj('I'), verb('brush-teeth'), 'question')), 'Do I brush my teeth?');
});
test('Change Machine: I play → He plays, and the + − ? overview', () => {
  const p = machineSteps(subj('he'), verb('play-football'), 'positive-s');
  assert.equal(stepText(p[0]), 'I play football.');
  assert.equal(last(p), 'He plays football.');
  const all = machineSteps(subj('sam'), verb('watch-tv'), 'all').map(stepText);
  assert.deepEqual(all, ['Sam watches TV.', "Sam doesn't watch TV.", 'Does Sam watch TV?']);
});
