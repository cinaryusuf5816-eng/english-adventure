// Short teacher help. Opened only on purpose (pupils do not see it by default).
import { h, link } from '../ui.js';
import { screen } from './common.js';

export function renderTeacher() {
  const li = (t) => h('li', {}, t);
  return screen('Teacher help',
    h('section', { class: 'panel prose' },
      h('h1', {}, 'Teacher help'),
      h('p', { class: 'lead' }, 'This page is for the teacher.'),
      h('h2', {}, 'A short lesson (40 minutes)'),
      h('ol', {},
        li('Words (8 min): show the picture, let pupils guess, then “Show the word”.'),
        li('Learn (15 min): one or two lessons. Use Back / Next or the ← → keys. “Teacher notes” opens a note only when you click it.'),
        li('Practise (10 min): one activity, 5 or 10 questions.'),
        li('Play or Speak (7 min): Question Door or the speaking cards.')),
      h('h2', {}, 'Classroom mode'),
      h('p', {}, 'The “Classroom” button at the top makes text and pictures bigger for the board. Classroom and Practice keep separate progress: an answer opened in one mode is not open in the other.'),
      h('h2', {}, 'Buttons'),
      h('ul', {},
        li('Check: checks the answer. The first-try result never changes later. Double clicks do not add points.'),
        li('Hint: a short tip. Show answer: shows the right answer; this question is not counted as correct.'),
        li('Clear: removes the answer on the screen (the record stays).'),
        li('Restart activity: a new set of questions in the same activity (asks first).'),
        li('Practise mistakes again: a new round with only the questions that were not right on the first try.'),
        li('New lesson (new class): removes saved practice for this week in this mode (asks first).'),
        li('Resume: goes back to an unfinished activity.')),
      h('h2', {}, 'Saving'),
      h('p', {}, 'Progress is saved only in this browser on this device. The site does not collect names, emails or any personal data. In a private window, or when saving is blocked, the site still works but does not keep progress.'),
      h('h2', {}, 'Sound'),
      h('p', {}, 'The “Listen” button appears only when the device has an English voice. It never plays by itself.'),
      h('div', { class: 'actions' }, link('Home', '#/', { kind: 'primary', icon: 'home' }))));
}
