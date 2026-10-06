// Learn: teacher-led short steps. See → notice → watch → do together → try.
import { h, picture, button, rich, plain, clock, calendar, icon, announce, openDialog, preloadImage } from '../ui.js';
import { buildHash, go } from '../router.js';
import { screen, weekBar, listenButton, progressText, progressBar } from './common.js';
import { machineView } from './machine.js';
import { markDone } from '../progress.js';

function stepsOf(topic) {
  const steps = [{ kind: 'intro' }];
  topic.examples.forEach((ex, i) => steps.push({ kind: 'example', ex, n: i + 1, of: topic.examples.length }));
  if (topic.groups) steps.push({ kind: 'groups' });
  topic.practice.forEach((p, i) => steps.push({ kind: 'practice', p, n: i + 1 }));
  return steps;
}

export function renderLearn(ctx) {
  const { week } = ctx.week;
  const topics = week.learn;
  if (!ctx.route.topic) return topicList(ctx, topics);

  const tIndex = topics.findIndex((t) => t.id === ctx.route.topic);
  if (tIndex < 0) return topicList(ctx, topics, 'We could not find that lesson. Choose one here.');
  const topic = topics[tIndex];
  const steps = stepsOf(topic);
  const sIndex = Math.min(Math.max(parseInt(ctx.route.step || '1', 10) || 1, 1), steps.length) - 1;
  const step = steps[sIndex];
  const goStep = (i) => go(['week', week.id, 'learn', topic.id, String(i + 1)]);
  const nextTopic = topics[tIndex + 1];

  const body = h('div', { class: 'learn-body' });
  if (step.kind === 'intro') body.append(introStep(ctx, topic, tIndex));
  else if (step.kind === 'example') body.append(exampleStep(ctx, step.ex, step));
  else if (step.kind === 'groups') body.append(groupsStep(topic));
  else body.append(practiceStep(ctx, step.p, step.n));

  const isLast = sIndex === steps.length - 1;
  if (isLast) markDone(week.id, 'learn', topic.id);
  const nav = h('div', { class: 'step-nav' },
    button('Back', { icon: 'prev', onClick: () => goStep(sIndex - 1), attrs: { disabled: sIndex === 0 } }),
    progressText(sIndex + 1, steps.length),
    isLast
      ? (nextTopic
        ? button('Next lesson', { icon: 'next', kind: 'primary', onClick: () => go(['week', week.id, 'learn', nextTopic.id, '1']) })
        : button('Practise now', { icon: 'practise', kind: 'gold', onClick: () => go(['week', week.id, 'practise']) }))
      : button('Next', { icon: 'next', kind: 'primary', onClick: () => goStep(sIndex + 1) }));

  // Arrow keys for the teacher (not while typing).
  ctx.listen(document, 'keydown', (e) => {
    if (e.target.closest && e.target.closest('input, textarea, select, dialog')) return;
    if (e.key === 'ArrowRight' && !isLast) goStep(sIndex + 1);
    if (e.key === 'ArrowLeft' && sIndex > 0) goStep(sIndex - 1);
  });

  const next = steps[sIndex + 1];
  if (next && next.ex && next.ex.image) preloadImage(ctx.week.image(next.ex.image));

  const notesBtn = button('Teacher notes', { icon: 'note', kind: 'ghost', onClick: () => openDialog({
    title: `Teacher note — ${topic.title}`,
    body: [h('p', {}, topic.teacherNote), h('p', { class: 'muted small' }, 'Lesson flow: See → notice the meaning → watch the teacher → do it together → try it alone.')],
    actions: [{ label: 'Close', value: true, kind: 'primary' }]
  }) });

  return screen(topic.title,
    weekBar(ctx, 'learn'),
    h('header', { class: 'section-head learn-head' },
      h('p', { class: 'eyebrow' }, `Learn ${tIndex + 1} of ${topics.length}`),
      h('h1', {}, topic.title),
      h('div', { class: 'head-tools' },
        h('a', { class: 'btn btn-ghost', href: buildHash(['week', week.id, 'learn']) }, icon('grid'), h('span', { class: 'btn-label' }, 'All lessons')),
        notesBtn)),
    progressBar(sIndex + 1, steps.length),
    body, nav);
}

function topicList(ctx, topics, note) {
  const { week } = ctx.week;
  return screen('Learn', weekBar(ctx, 'learn'),
    h('header', { class: 'section-head' }, h('h1', {}, 'Learn'), h('p', { class: 'lead' }, note || 'Choose a lesson. Each lesson has short steps.')),
    h('ol', { class: 'topic-list' }, topics.map((t, i) => h('li', {},
      h('a', { class: 'topic-card', href: buildHash(['week', week.id, 'learn', t.id, '1']) },
        h('span', { class: 'topic-num', 'aria-hidden': 'true' }, String(i + 1)),
        h('span', { class: 'topic-title' }, t.title),
        h('span', { class: 'topic-rule' }, t.rule))))));
}

function introStep(ctx, topic) {
  return h('div', { class: 'lesson-stage intro' },
    picture(ctx.week.image(topic.image), { className: 'stage-pic', eager: true, sizes: '(max-width: 760px) 92vw, 55vw' }),
    h('div', { class: 'stage-side' },
      h('p', { class: 'stage-kicker' }, 'Look.'),
      h('p', { class: 'rule-box' }, rich(topic.rule)),
      listenButton(ctx, () => plain(topic.rule))));
}

function bubble(speaker, content) {
  return h('div', { class: 'bubble-wrap' },
    h('span', { class: 'bubble-who' }, speaker),
    h('p', { class: 'bubble' }, content));
}

function exampleStep(ctx, ex, step) {
  if (ex.machine) {
    const sw = ctx.week.week.games.sentenceSwitch;
    const subject = sw.subjects.find((s) => s.id === ex.machine.subject);
    const verb = sw.verbs.find((v) => v.id === ex.machine.verb);
    const titles = { negative: 'Watch it change: + → −', question: 'Watch it change: + → ?', 'positive-s': 'Watch it change: I → he', all: 'One idea: + − ?' };
    return h('div', { class: 'lesson-stage no-pic machine-stage' },
      h('div', { class: 'stage-side wide' },
        h('p', { class: 'stage-kicker' }, `Example ${step.n} of ${step.of} · ${titles[ex.machine.to] || 'Watch it change'}`),
        machineView(ctx, { subject, verb, to: ex.machine.to })));
  }
  const side = h('div', { class: 'stage-side' }, h('p', { class: 'stage-kicker' }, `Example ${step.n} of ${step.of}`));
  const pic = ex.image ? picture(ctx.week.image(ex.image), { className: 'stage-pic', eager: true, sizes: '(max-width: 760px) 92vw, 55vw' }) : null;

  if (ex.rows) {
    const labels = ex.rowLabels || ['+', '−', '?'];
    const names = ex.rowLabels ? ex.rowLabels : ['positive', 'negative', 'question'];
    side.append(h('ol', { class: 'compare-rows' }, ex.rows.map((r, i) =>
      h('li', { class: `row-${i}` }, h('span', { class: 'row-label', 'aria-label': names[i] }, labels[i]), h('span', { class: 'row-text' }, rich(r))))));
    if (ex.label) side.append(h('p', { class: 'ex-label' }, ex.label));
    side.append(listenButton(ctx, () => ex.rows.map(plain).join(' ')));
  } else if (ex.q) {
    const qLine = h('p', { class: 'ex-sentence' }, ex.qSpeaker ? h('span', { class: 'who' }, `${ex.qSpeaker}: `) : null, rich(ex.q));
    const aLine = h('p', { class: 'ex-sentence answer-line', hidden: true }, ex.aSpeaker ? h('span', { class: 'who' }, `${ex.aSpeaker}: `) : null, rich(ex.a));
    const show = revealButton('Show the answer', 'Hide the answer', aLine, () => announce(plain(ex.a)));
    side.append(qLine, ex.time ? clock(ex.time) : null, show, aLine);
    if (ex.label) side.append(h('p', { class: 'ex-label' }, ex.label));
    side.append(listenButton(ctx, () => `${plain(ex.q)} ${plain(ex.a)}`));
  } else {
    const sentence = h('p', { class: 'ex-sentence' }, rich(ex.text));
    const content = ex.speaker ? bubble(ex.speaker, rich(ex.text)) : sentence;
    if (ex.from) {
      const fromLine = h('p', { class: 'ex-from' }, ex.from);
      const changed = h('div', { class: 'ex-change', hidden: true }, h('span', { class: 'arrow', 'aria-hidden': 'true' }, '↓'), content);
      side.append(fromLine, revealButton('Show the change', 'Hide the change', changed, () => announce(plain(ex.text))), changed);
    } else {
      side.append(content);
    }
    if (ex.time) side.append(clock(ex.time));
    if (ex.calendar) side.append(calendar(ex.calendar));
    if (ex.label) side.append(h('p', { class: 'ex-label' }, ex.label));
    if (ex.note) side.append(h('p', { class: 'ex-note' }, ex.note));
    side.append(listenButton(ctx, () => (ex.from ? `${ex.from} ${plain(ex.text)}` : plain(ex.text))));
  }
  return h('div', { class: `lesson-stage${pic ? '' : ' no-pic'}` }, pic, side);
}

function revealButton(showLabel, hideLabel, target, onShow) {
  const b = button(showLabel, { icon: 'eye', kind: 'primary', attrs: { 'aria-expanded': 'false' } });
  b.addEventListener('click', () => {
    const open = target.hidden;
    target.hidden = !open;
    b.setAttribute('aria-expanded', String(open));
    b.querySelector('.btn-label').textContent = open ? hideLabel : showLabel;
    if (open && onShow) onShow();
  });
  return b;
}

function groupsStep(topic) {
  return h('div', { class: 'lesson-stage no-pic' },
    h('div', { class: 'stage-side wide' },
      h('p', { class: 'stage-kicker' }, 'Sort the words.'),
      h('div', { class: 'spell-groups' }, topic.groups.map((g) =>
        h('section', { class: 'spell-group' }, h('h2', {}, g.label), h('ul', {}, g.words.map((w) => h('li', {}, w))))))));
}

function practiceStep(ctx, p, n) {
  const together = p.mode === 'together';
  const side = h('div', { class: 'stage-side' },
    h('p', { class: 'stage-kicker' }, together ? 'Let’s do it together.' : 'Now you try.'),
    h('p', { class: 'ex-sentence' }, p.prompt));
  if (p.time) side.append(clock(p.time));
  if (p.calendar) side.append(calendar(p.calendar));
  const feedback = h('p', { class: 'feedback', role: 'status' });
  const opts = h('div', { class: 'options', role: 'group', 'aria-label': 'Answers' });
  const correctId = p.answer;
  const optionIds = p.options.map((_, i) => String.fromCharCode(97 + i));
  optionIds.forEach((id, i) => {
    const b = button(p.options[i], { kind: 'option' });
    b.dataset.option = id;
    if (!together) {
      b.addEventListener('click', () => {
        opts.querySelectorAll('.btn').forEach((x) => x.classList.remove('is-wrong'));
        if (id === correctId) {
          b.classList.add('is-right');
          opts.querySelectorAll('.btn').forEach((x) => { x.disabled = true; });
          feedback.replaceChildren(icon('check'), h('span', {}, `Yes! ${p.explain}`));
          feedback.className = 'feedback is-right';
        } else {
          b.classList.add('is-wrong');
          feedback.replaceChildren(icon('bulb'), h('span', {}, 'Try again.'));
          feedback.className = 'feedback is-try';
        }
      });
    } else {
      b.disabled = true;
      b.classList.add('is-static');
    }
    opts.append(b);
  });
  side.append(opts);
  if (together) {
    const show = button('Show the answer', { icon: 'eye', kind: 'primary', attrs: { 'aria-expanded': 'false' } });
    show.addEventListener('click', () => {
      const btn = opts.querySelector(`[data-option="${correctId}"]`);
      const open = show.getAttribute('aria-expanded') !== 'true';
      btn.classList.toggle('is-right', open);
      show.setAttribute('aria-expanded', String(open));
      show.querySelector('.btn-label').textContent = open ? 'Hide the answer' : 'Show the answer';
      if (open) { feedback.replaceChildren(icon('check'), h('span', {}, p.explain)); feedback.className = 'feedback is-right'; }
      else { feedback.replaceChildren(); feedback.className = 'feedback'; }
    });
    side.append(show);
  }
  side.append(feedback);
  return h('div', { class: 'lesson-stage' },
    picture(ctx.week.image(p.image), { className: 'stage-pic', eager: true, sizes: '(max-width: 760px) 92vw, 55vw' }),
    side, h('span', { class: 'sr-only' }, `Practice ${n}`));
}
