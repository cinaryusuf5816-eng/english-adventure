// End-to-end tests on the REAL delivery package.
// 1. Unzips release/READY_TO_UPLOAD.zip into tests/.tmp/ready
// 2. Serves it at http://127.0.0.1:<port>/test-repo/ (GitHub project-page style) and at /
// 3. Drives Microsoft Edge (or Chrome) with playwright-core and records every result.
// Output: tests/e2e/results.json, tests/e2e/E2E_RESULTS.md, screenshots in tests/e2e/screenshots/
// Run: npm run test:e2e   (needs Edge or Chrome installed; no browser download)
import { chromium } from 'playwright-core';
import extract from 'extract-zip';
import { rmSync, mkdirSync, readFileSync, writeFileSync, cpSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { startServer } from '../../scripts/serve.mjs';

const ROOT = resolve('.');
const TMP = join(ROOT, 'tests/.tmp');
const READY = join(TMP, 'ready');
const WEEK2 = join(TMP, 'ready-week2');
const SHOTS = join(ROOT, 'tests/e2e/screenshots');
const BASE_PATH = '/test-repo/';
const PORT_SUB = 8211;
const PORT_ROOT = 8212;
const PORT_W2 = 8213;
const SUB = `http://127.0.0.1:${PORT_SUB}${BASE_PATH}`;
const ROOTURL = `http://127.0.0.1:${PORT_ROOT}/`;
const W2URL = `http://127.0.0.1:${PORT_W2}${BASE_PATH}`;

const results = [];
const consoleProblems = [];
const failedRequests = [];

function record(name, expected, actual, status, area = '') {
  results.push({ area, name, expected, actual, status });
  const mark = status === 'pass' ? 'PASS' : status === 'fail' ? 'FAIL' : 'SKIP';
  console.log(`${mark}  ${area ? `[${area}] ` : ''}${name}${status === 'pass' ? '' : `\n      expected: ${expected}\n      actual:   ${actual}`}`);
}

async function check(area, name, expected, fn) {
  try {
    const actual = await fn();
    if (actual === true || (typeof actual === 'object' && actual && actual.ok)) record(name, expected, typeof actual === 'object' ? actual.detail || 'ok' : 'as expected', 'pass', area);
    else record(name, expected, typeof actual === 'object' && actual ? actual.detail : String(actual), 'fail', area);
  } catch (e) {
    record(name, expected, `error: ${e.message.split('\n')[0]}`, 'fail', area);
  }
}

// ---------- setup ----------
rmSync(TMP, { recursive: true, force: true });
mkdirSync(READY, { recursive: true });
mkdirSync(SHOTS, { recursive: true });
await extract(join(ROOT, 'release/READY_TO_UPLOAD.zip'), { dir: READY });
if (!existsSync(join(READY, 'index.html'))) throw new Error('index.html is not at the top of the zip');

// Week 2 test copy (template-based, NOT published content): proves a new week can be added
cpSync(READY, WEEK2, { recursive: true });
const template = JSON.parse(readFileSync(join(ROOT, 'site/data/templates/week-template.json'), 'utf8'));
template.id = 'week-02';
template.title = 'TEST WEEK (not real content)';
// a teacher can add one ready picture file (no tools): images.<key>.file
mkdirSync(join(WEEK2, 'assets/images/week-02'), { recursive: true });
cpSync(join(ROOT, 'raw-images/week-01/play-football.jpg'), join(WEEK2, 'assets/images/week-02/example.jpg'));
template.images['example-picture'] = { file: 'assets/images/week-02/example.jpg', w: 1600, h: 1200, alt: 'A boy kicks a football.' };
mkdirSync(join(WEEK2, 'data/weeks/week-02'), { recursive: true });
writeFileSync(join(WEEK2, 'data/weeks/week-02/week.json'), JSON.stringify(template, null, 2));
const tq = JSON.parse(readFileSync(join(ROOT, 'site/data/templates/questions-template.json'), 'utf8'));
writeFileSync(join(WEEK2, 'data/weeks/week-02/questions.json'), JSON.stringify(tq, null, 2));
const cur = JSON.parse(readFileSync(join(WEEK2, 'data/curriculum.json'), 'utf8'));
Object.assign(cur.weeks[1], { title: 'TEST WEEK', subtitle: 'Template test', published: true, file: 'data/weeks/week-02/week.json', cover: 'assets/images/week-01/week-01-cover', coverAlt: '' });
writeFileSync(join(WEEK2, 'data/curriculum.json'), JSON.stringify(cur, null, 2));

const servers = [
  await startServer({ dir: READY, portNo: PORT_SUB, basePath: BASE_PATH }),
  await startServer({ dir: READY, portNo: PORT_ROOT, basePath: '/' }),
  await startServer({ dir: WEEK2, portNo: PORT_W2, basePath: BASE_PATH })
];

const Q = JSON.parse(readFileSync(join(READY, 'data/weeks/week-01/questions.json'), 'utf8'));
const WEEK = JSON.parse(readFileSync(join(READY, 'data/weeks/week-01/week.json'), 'utf8'));
const byId = new Map(Q.questions.map((q) => [q.id, q]));
const idsOf = (type) => Q.questions.filter((q) => q.type === type).map((q) => q.id);

let browser;
for (const channel of ['msedge', 'chrome']) {
  try { browser = await chromium.launch({ channel, headless: true }); console.log(`Browser: ${channel} ${browser.version()}`); break; } catch { /* try next */ }
}
if (!browser) throw new Error('No Edge or Chrome found');
const BROWSER_NAME = `${browser.version()}`;

function watch(page, label) {
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') consoleProblems.push(`${label}: ${m.type()}: ${m.text()}`);
  });
  page.on('pageerror', (e) => consoleProblems.push(`${label}: pageerror: ${e.message}`));
  page.on('requestfailed', (r) => failedRequests.push(`${label}: ${r.url()} (${r.failure()?.errorText})`));
  page.on('response', (r) => { if (r.status() >= 400 && !page.__expect404) failedRequests.push(`${label}: HTTP ${r.status()} ${r.url()}`); });
}

async function newPage(opts = {}, label = 'main') {
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, ...opts });
  const page = await context.newPage();
  watch(page, label);
  return page;
}

const sKey = (bank, mode = 'practice') => `eemc:v1:week-01:practise:${bank}:${mode}`;
async function getSession(page, bank, mode = 'practice') {
  return page.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), sKey(bank, mode));
}
async function injectSession(page, bank, ids, { mode = 'practice', support = 'help', seed = 777 } = {}) {
  await page.evaluate(([k, s]) => localStorage.setItem(k, JSON.stringify(s)), [sKey(bank, mode), {
    id: `s-test-${Date.now()}-${Math.random()}`, weekId: 'week-01', bank, mode, settings: { target: 'all', n: 'all', support },
    round: 1, parentId: null, seed, createdAt: Date.now(), index: 0, questionIds: ids, states: {}, finished: false
  }]);
}
async function open(page, base, hash) {
  await page.goto(base + hash, { waitUntil: 'networkidle' });
  await page.waitForSelector('#main .screen', { timeout: 8000 });
  await dismissCelebration(page);
}
async function dismissCelebration(page) {
  if (await page.locator('.celebrate').count()) await page.click('.celebrate button:has-text("Great!")');
}
async function openPlay(page, base, bank) {
  await page.goto(`${base}#/week/week-01/practise/${bank}/play`, { waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('.question-card', { timeout: 8000 });
  await dismissCelebration(page);
}
const words = (s) => s.replace(/[.?!]$/, '').split(' ');

async function clickToken(page, scope, text) {
  const idx = await page.evaluate(([sc, t]) => [...document.querySelectorAll(`${sc} .token-bank .token`)].findIndex((b) => !b.disabled && b.textContent === t), [scope, text]);
  if (idx < 0) throw new Error(`token "${text}" not found`);
  await page.locator(`${scope} .token-bank .token`).nth(idx).click();
}

async function answer(page, q, correct = true) {
  const card = '.question-card';
  switch (q.type) {
    case 'mcq': case 'dialogue': case 'reading': {
      const ids = q.options.map((_, i) => String.fromCharCode(97 + i));
      const id = correct ? q.answer : ids.find((x) => x !== q.answer);
      await page.click(`${card} [data-option="${id}"]`);
      return id;
    }
    case 'decide': {
      const id = String(correct ? q.answer : !q.answer);
      await page.click(`${card} [data-option="${id}"]`);
      return id;
    }
    case 'jumbled': {
      const w = q.answers[0].split(' ');
      const order = correct ? w : w.slice().reverse();
      for (const t of order) await clickToken(page, card, t);
      return order.join(' ');
    }
    case 'fill': {
      const word = correct ? q.answers[0] : q.pool.find((p) => !q.answers.includes(p));
      await page.locator(`${card} .pool .btn-option`).filter({ hasText: new RegExp(`^${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }).first().click();
      return word;
    }
    case 'change': {
      const w = words(q.answers[0]);
      const order = correct ? w : w.slice().reverse();
      for (const t of order) await clickToken(page, card, t);
      return order.join(' ');
    }
    case 'fix': {
      const wrongIdx = correct ? q.wrong : (q.wrong === 0 ? 1 : 0);
      await page.locator(`${card} .fix-word`).nth(wrongIdx).click();
      await page.click(`${card} .fix-options [data-option="${q.fix}"]`);
      return wrongIdx;
    }
    default: throw new Error(q.type);
  }
}
const feedbackText = (page) => page.locator('.question-card .feedback').innerText().catch(() => '');

// =====================================================================
// 1–2. Navigation, deep links, reload, back/forward (sub path)
// =====================================================================
{
  const page = await newPage({}, 'nav');
  await check('Navigation', 'Home → Week 1 → Words → Learn → Practise → Home', 'each screen opens with its heading', async () => {
    await open(page, SUB, '#/');
    const seen = [await page.locator('h1').first().innerText()];
    await page.click('a.week-card');
    await page.waitForSelector('.path-grid'); seen.push(await page.locator('h1').innerText());
    await page.click('.side-nav a[data-nav=words]'); await page.waitForSelector('.word-stage'); seen.push(await page.locator('h1').innerText());
    await page.click('.section-tabs a:has-text("Learn")'); await page.waitForSelector('.topic-list'); seen.push(await page.locator('h1').innerText());
    await page.click('.section-tabs a:has-text("Practice")'); await page.waitForSelector('.bank-grid'); seen.push(await page.locator('h1').innerText());
    await page.click('.side-nav a[data-nav=home]'); await page.waitForSelector('.dash-hero'); seen.push(await page.locator('h1').first().innerText());
    const ok = seen[1].includes('Present Simple') && seen[2] === 'Words' && seen[3] === 'Learn' && seen[4] === 'Practise' && /Present Simple/.test(seen[5]);
    return { ok, detail: seen.join(' | ') };
  });
  await check('Navigation', 'Direct link to a Learn step + reload keeps the step', 'Step 4 of 12 after reload', async () => {
    await open(page, SUB, '#/week/week-01/learn/doesnt/4');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.lesson-stage');
    const t = await page.locator('.step-nav .progress-text').innerText();
    return { ok: t === 'Step 4 of 12', detail: t };
  });
  await check('Navigation', 'Back and forward buttons', 'back returns to step 4, forward to step 5', async () => {
    await page.click('.step-nav button:has-text("Next")');
    await page.waitForFunction(() => location.hash.endsWith('/5'));
    await page.goBack(); await page.waitForFunction(() => location.hash.endsWith('/4'));
    const a = await page.locator('.step-nav .progress-text').innerText();
    await page.goForward(); await page.waitForFunction(() => location.hash.endsWith('/5'));
    const b = await page.locator('.step-nav .progress-text').innerText();
    return { ok: a === 'Step 4 of 12' && b === 'Step 5 of 12', detail: `${a} / ${b}` };
  });
  await check('Navigation', 'Arrow keys move exactly one step (no stacked listeners after many screens)', 'ArrowRight from step 1 → step 2', async () => {
    for (let i = 1; i <= 6; i++) await open(page, SUB, `#/week/week-01/learn/habits/${i}`);
    await open(page, SUB, '#/week/week-01/learn/habits/1');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(400);
    const h = await page.evaluate(() => location.hash);
    return { ok: h.endsWith('/habits/2'), detail: h };
  });
  await check('Navigation', 'All 12 Learn lessons open with ≥ 9 steps each', '12 lessons, each “Step 1 of N” with N ≥ 9', async () => {
    const out = [];
    for (const t of WEEK.learn) {
      await open(page, SUB, `#/week/week-01/learn/${t.id}/1`);
      out.push(await page.locator('.step-nav .progress-text').innerText());
    }
    const ok = out.length === 13 && out.every((x) => Number(x.split(' of ')[1]) >= 9);
    return { ok, detail: out.join(', ') };
  });
  await check('Navigation', 'Learn: Reveal shows the change; answer is hidden again on the next step', 'hidden → shown → next step hidden', async () => {
    await open(page, SUB, '#/week/week-01/learn/doesnt/4');
    const before = await page.locator('.ex-change').isHidden();
    await page.click('button:has-text("Show the change")');
    const shown = await page.locator('.ex-change').isVisible();
    await page.click('.step-nav button:has-text("Next")');
    await page.waitForFunction(() => location.hash.endsWith('/5'));
    const after = await page.locator('.ex-change').isHidden();
    return { ok: before && shown && after, detail: `${before}/${shown}/${after}` };
  });
  await check('Navigation', 'Teacher notes open in a dialog, Escape closes it and focus returns', 'dialog open → closed, focus on button', async () => {
    await page.click('button:has-text("Teacher notes")');
    const open1 = await page.locator('dialog.dlg').isVisible();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
    const gone = (await page.locator('dialog.dlg').count()) === 0;
    const focus = await page.evaluate(() => document.activeElement?.textContent || '');
    return { ok: open1 && gone && /Teacher notes/.test(focus), detail: `${open1}/${gone}/${focus}` };
  });
  await check('Words', 'Word card: picture first, Show the word, Hide again; All cards view', 'phrase hidden → visible → hidden; 12 tiles', async () => {
    await open(page, SUB, '#/week/week-01/words/3');
    const h1 = await page.locator('#word-answer').isHidden();
    await page.click('button:has-text("Show the word")');
    const phrase = await page.locator('.word-phrase').innerText();
    await page.click('button:has-text("Hide the word")');
    const h2 = await page.locator('#word-answer').isHidden();
    await page.click('a:has-text("All cards")');
    await page.waitForSelector('.word-grid');
    const tiles = await page.locator('.word-tile').count();
    await page.click('button:has-text("Open all")');
    const openCount = await page.locator('.tile-answer:visible').count();
    return { ok: h1 && phrase === 'watch TV' && h2 && tiles === 12 && openCount === 12, detail: `${h1} ${phrase} ${h2} tiles=${tiles} open=${openCount}` };
  });
  await page.context().close();
}

// =====================================================================
// 3. Errors: unknown week, bad hash, missing / broken content
// =====================================================================
{
  const page = await newPage({}, 'errors');
  page.__expect404 = true;
  await check('Errors', 'Unknown week', 'friendly message + Home link', async () => {
    await open(page, SUB, '#/week/week-99');
    const t = await page.locator('h1').innerText();
    return { ok: /does not exist/.test(t) && (await page.locator('a:has-text("Home")').count()) > 0, detail: t };
  });
  await check('Errors', 'Unpublished week (Coming soon) cannot open', 'message “coming soon”', async () => {
    await open(page, SUB, '#/week/week-02');
    const t = await page.locator('h1').innerText();
    return { ok: /coming soon/i.test(t), detail: t };
  });
  await check('Errors', 'Broken hash with HTML in it', 'not-right message, nothing injected', async () => {
    await page.goto(`${SUB}#/<img src=x onerror=alert(1)>`, { waitUntil: 'networkidle' });
    await page.waitForSelector('h1');
    const t = await page.locator('h1').innerText();
    const injected = await page.locator('main img[src="x"]').count();
    return { ok: /not right/.test(t) && injected === 0, detail: t };
  });
  await check('Errors', 'Unknown page', 'Page not found', async () => {
    await open(page, SUB, '#/nothing-here');
    return { ok: /not found/i.test(await page.locator('h1').innerText()), detail: await page.locator('h1').innerText() };
  });
  await check('Errors', 'Missing week file (HTTP 404)', '“file was not found” message, app still usable', async () => {
    await page.route('**/data/weeks/week-01/week.json', (r) => r.fulfill({ status: 404, body: 'nope' }));
    await open(page, SUB, '#/week/week-01');
    const t = await page.locator('h1').innerText();
    await page.unroute('**/data/weeks/week-01/week.json');
    return { ok: /not found/i.test(t), detail: t };
  });
  await check('Errors', 'Broken JSON in the question file', '“file is broken” message', async () => {
    const ctx2 = await browser.newContext();
    const p2 = await ctx2.newPage();
    await p2.route('**/questions.json', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{ broken' }));
    await p2.goto(`${SUB}#/week/week-01/practise`, { waitUntil: 'networkidle' });
    await p2.waitForSelector('h1');
    const t = await p2.locator('h1').innerText();
    await ctx2.close();
    return { ok: /broken/i.test(t), detail: t };
  });
  await check('Errors', 'Missing picture shows a clear “Picture not available” box', 'no broken image icon; text shown', async () => {
    const ctx2 = await browser.newContext();
    const p2 = await ctx2.newPage();
    await p2.route('**/play-football-*.webp', (r) => r.fulfill({ status: 404, body: '' }));
    await p2.goto(`${SUB}#/week/week-01/words/1`, { waitUntil: 'networkidle' });
    await p2.waitForSelector('.pic-missing');
    const t = await p2.locator('.pic-missing').first().innerText();
    await ctx2.close();
    return { ok: /Picture not available/.test(t), detail: t };
  });
  await page.context().close();
}

// =====================================================================
// 4–5, 10. Every question type: empty, wrong + hint, second try, show answer, double click
// =====================================================================
const TYPES = ['mcq', 'jumbled', 'fill', 'change', 'fix', 'decide', 'dialogue', 'reading'];
{
  const page = await newPage({}, 'types');
  await open(page, SUB, '#/');
  for (const type of TYPES) {
    const ids = idsOf(type);
    const pick = [ids[0], ids[1], ids[2]];
    await injectSession(page, type, pick);
    await openPlay(page, SUB, type);
    const q1 = byId.get(pick[0]);
    const q2 = byId.get(pick[1]);
    const q3 = byId.get(pick[2]);

    await check(type, 'Empty answer: Check gives a message and no attempt', 'message; attempts 0', async () => {
      await page.click('.btn-check');
      const fb = await feedbackText(page);
      const s = await getSession(page, type);
      return { ok: fb.length > 0 && (!s.states[q1.id] || s.states[q1.id].attempts === 0), detail: fb.replace(/\s+/g, ' ') };
    });
    await check(type, 'Wrong answer: specific hint, can try again; then correct', 'status correct-retry, firstCorrect false', async () => {
      await answer(page, q1, false);
      await page.click('.btn-check');
      await page.waitForTimeout(450);
      const fb = await feedbackText(page);
      const hintOk = fb.includes(q1.hint) || /Look again/.test(fb);
      await page.click('.q-controls button:has-text("Clear")');
      await answer(page, q1, true);
      await page.click('.btn-check');
      const s = await getSession(page, type);
      const st = s.states[q1.id];
      const fb2 = await feedbackText(page);
      return { ok: hintOk && st.status === 'correct-retry' && st.firstCorrect === false && st.attempts === 2 && fb2.includes(q1.explain), detail: `${st.status} attempts=${st.attempts} hint=${hintOk}` };
    });
    await check(type, 'Hint button opens the hint and is recorded', 'hint visible; hintUsed true', async () => {
      await page.click('.step-nav button:has-text("Next")');
      await page.waitForSelector('.question-card');
      await page.click('.q-controls button:has-text("Hint")');
      const visible = await page.locator('.hint-box').isVisible();
      const s = await getSession(page, type);
      return { ok: visible && s.states[q2.id]?.hintUsed === true, detail: `${visible}` };
    });
    await check(type, 'Double click on Check with the right answer adds only one point', 'attempts 1, status correct-first', async () => {
      await answer(page, q2, true);
      await page.dblclick('.btn-check');
      await page.click('.btn-check', { force: true }).catch(() => {});
      const s = await getSession(page, type);
      const st = s.states[q2.id];
      return { ok: st.status === 'correct-first' && st.attempts === 1, detail: `${st.status} attempts=${st.attempts}` };
    });
    await check(type, 'Show answer: answer appears, no point, buttons locked', 'status shown; Check disabled', async () => {
      await page.click('.step-nav button:has-text("Finish"), .step-nav button:has-text("Next")');
      await page.waitForSelector('.question-card');
      await page.click('.q-controls button:has-text("Show answer")');
      const s = await getSession(page, type);
      const dis = await page.locator('.btn-check').isDisabled();
      const fb = await feedbackText(page);
      return { ok: s.states[q3.id].status === 'shown' && dis && fb.includes(q3.explain), detail: `${s.states[q3.id].status} ${dis}` };
    });
    await check(type, 'Going back to a finished question keeps its result (no second point)', 'question 1 still correct-retry and locked', async () => {
      await page.click('.step-nav button:has-text("Previous")');
      await page.click('.step-nav button:has-text("Previous")');
      await page.waitForSelector('.question-card');
      const dis = await page.locator('.btn-check').isDisabled();
      const s = await getSession(page, type);
      const t = await page.locator('.score').innerText();
      return { ok: dis && s.states[q1.id].status === 'correct-retry' && /First try: 1 · Done: 3 of 3/.test(t), detail: t };
    });
    await page.screenshot({ path: join(SHOTS, `type-${type}-1366.png`) });
  }

  await check('mcq', 'Options are shuffled for display but checked by option id', 'shown order differs for some questions; right id is right', async () => {
    const ids = idsOf('mcq').slice(0, 12);
    await injectSession(page, 'mcq', ids, { seed: 99 });
    await openPlay(page, SUB, 'mcq');
    let differs = 0;
    for (let i = 0; i < ids.length; i++) {
      const q = byId.get(ids[i]);
      const shown = await page.locator('.question-card .options .btn-option').evaluateAll((bs) => bs.map((b) => b.dataset.option));
      if (shown.join() !== q.options.map((_, k) => String.fromCharCode(97 + k)).join()) differs++;
      const text = await page.locator(`.question-card [data-option="${q.answer}"]`).innerText();
      if (text.trim() !== q.options[q.answer.charCodeAt(0) - 97]) return { ok: false, detail: `${q.id}: ${text}` };
      if (i < ids.length - 1) { await page.click('.step-nav button:has-text("Next")'); await page.waitForSelector('.question-card'); }
    }
    return { ok: differs === ids.length, detail: `${differs}/${ids.length} shuffled` };
  });
  await check('mcq', 'Re-drawing the same question keeps the same option order', 'same order after reload', async () => {
    const a = await page.locator('.question-card .options .btn-option').evaluateAll((bs) => bs.map((b) => b.dataset.option).join());
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.question-card');
    const b = await page.locator('.question-card .options .btn-option').evaluateAll((bs) => bs.map((b) => b.dataset.option).join());
    return { ok: a === b, detail: `${a} / ${b}` };
  });
  await page.context().close();
}

// =====================================================================
// 6–9. Navigation limits, jumbled details, typed answers
// =====================================================================
{
  const page = await newPage({}, 'details');
  await open(page, SUB, '#/');
  await check('Practise', 'First/last limits and skipping', 'Previous disabled on Q1; last shows Finish; skipped stays unanswered', async () => {
    const ids = idsOf('mcq').slice(0, 3);
    await injectSession(page, 'mcq', ids);
    await openPlay(page, SUB, 'mcq');
    const prevDis = await page.locator('.step-nav button:has-text("Previous")').isDisabled();
    await page.click('.step-nav button:has-text("Next")');
    await page.click('.step-nav button:has-text("Next")');
    await page.waitForSelector('.step-nav button:has-text("Finish")');
    await page.click('.step-nav button:has-text("Previous")');
    await page.click('.step-nav button:has-text("Previous")');
    const s = await getSession(page, 'mcq');
    const st = s.states[ids[0]];
    return { ok: prevDis && (!st || st.status === 'unanswered'), detail: `prevDisabled=${prevDis}` };
  });
  await check('Practise', 'Finish with unanswered questions asks first; results count them as not answered', 'confirm dialog; results: 3 not answered', async () => {
    await page.click('.step-nav button:has-text("Next")');
    await page.click('.step-nav button:has-text("Next")');
    await page.click('.step-nav button:has-text("Finish")');
    const asked = await page.locator('dialog.dlg').isVisible();
    await page.click('dialog.dlg button:has-text("See results")');
    await page.waitForSelector('.results');
    const t = await page.locator('.res-skip .res-num').innerText();
    await page.screenshot({ path: join(SHOTS, 'results-1366.png') });
    return { ok: asked && t === '3', detail: `asked=${asked} notAnswered=${t}` };
  });

  await check('jumbled', 'Two cards with the same word (“Do … do”) work as two separate cards', 'both placed; answer correct', async () => {
    await injectSession(page, 'jumbled', ['w1-jb-030']);
    await openPlay(page, SUB, 'jumbled');
    for (const t of ['Do', 'you', 'do', 'your', 'homework']) await clickToken(page, '.question-card', t);
    const placed = await page.locator('.token-line .token').count();
    await page.click('.btn-check');
    const s = await getSession(page, 'jumbled');
    return { ok: placed === 5 && s.states['w1-jb-030'].status === 'correct-first', detail: `placed=${placed} ${s.states['w1-jb-030'].status}` };
  });
  await check('jumbled', 'Keyboard only: Tab to a card, Enter places it; Undo and tapping a placed card remove it', 'line count 2 → 1 → 0', async () => {
    await injectSession(page, 'jumbled', ['w1-jb-001']);
    await openPlay(page, SUB, 'jumbled');
    await page.locator('.token-bank .token').first().focus();
    await page.keyboard.press('Enter');
    await page.locator('.token-bank .token:not([disabled])').first().focus();
    await page.keyboard.press('Enter');
    const a = await page.locator('.token-line .token').count();
    await page.click('button:has-text("Undo")');
    const b = await page.locator('.token-line .token').count();
    await page.locator('.token-line .token').first().click();
    const c = await page.locator('.token-line .token').count();
    return { ok: a === 2 && b === 1 && c === 0, detail: `${a} → ${b} → ${c}` };
  });
  await check('jumbled', 'Clear empties the sentence; records stay', 'line empty after Clear', async () => {
    await clickToken(page, '.question-card', 'I');
    await page.click('.q-controls button:has-text("Clear")');
    return { ok: (await page.locator('.token-line .token').count()) === 0, detail: 'cleared' };
  });
  await check('jumbled', 'Both correct orders are accepted (“Every day I read a book.”)', 'correct-first', async () => {
    await injectSession(page, 'jumbled', ['w1-jb-010']);
    await openPlay(page, SUB, 'jumbled');
    for (const t of ['every', 'day', 'I', 'read', 'a', 'book']) await clickToken(page, '.question-card', t);
    await page.click('.btn-check');
    const s = await getSession(page, 'jumbled');
    return { ok: s.states['w1-jb-010'].status === 'correct-first', detail: s.states['w1-jb-010'].status };
  });
  await check('jumbled', 'A really wrong order is not accepted', 'status trying', async () => {
    await injectSession(page, 'jumbled', ['w1-jb-010']);
    await openPlay(page, SUB, 'jumbled');
    for (const t of ['I', 'a', 'book', 'read', 'every', 'day']) await clickToken(page, '.question-card', t);
    await page.click('.btn-check');
    const s = await getSession(page, 'jumbled');
    return { ok: s.states['w1-jb-010'].status === 'trying', detail: s.states['w1-jb-010'].status };
  });

  const typed = async (bank, id, text) => {
    await injectSession(page, bank, [id], { support: 'less' });
    await openPlay(page, SUB, bank);
    await page.fill('.question-card .answer-input', text);
    await page.click('.btn-check');
    const s = await getSession(page, bank);
    return s.states[id].status;
  };
  await check('Typed answers', 'Curly apostrophe, extra spaces and capitals are accepted', '“  he DOESN’T   play football ” → correct', async () => {
    const st = await typed('change', 'w1-cs-001', '  he DOESN’T   play football ');
    return { ok: st === 'correct-first', detail: st };
  });
  await check('Typed answers', '“does not” is accepted for doesn\'t', 'correct', async () => {
    const st = await typed('change', 'w1-cs-001', 'He does not play football.');
    return { ok: st === 'correct-first', detail: st };
  });
  await check('Typed answers', 'don\'t vs doesn\'t is still graded', '“He don\'t play football.” → not correct', async () => {
    const st = await typed('change', 'w1-cs-001', "He don't play football.");
    return { ok: st === 'trying', detail: st };
  });
  await check('Typed answers', '“dont” without apostrophe is not accepted but the learner is told', 'trying + note about don\'t', async () => {
    const st = await typed('fill', 'w1-fb-011', 'dont');
    const fb = await feedbackText(page);
    return { ok: st === 'trying' && /don't/.test(fb), detail: `${st} | ${fb.replace(/\s+/g, ' ')}` };
  });
  await check('Typed answers', 'Fill: “do not” accepted for don\'t; Enter key checks', 'correct-first', async () => {
    await injectSession(page, 'fill', ['w1-fb-011'], { support: 'less' });
    await openPlay(page, SUB, 'fill');
    await page.fill('.question-card .answer-input', 'do not');
    await page.press('.question-card .answer-input', 'Enter');
    const s = await getSession(page, 'fill');
    return { ok: s.states['w1-fb-011'].status === 'correct-first', detail: s.states['w1-fb-011'].status };
  });
  await check('Typed answers', 'Question with small i shows a gentle tip', 'correct + tip', async () => {
    await injectSession(page, 'change', ['w1-cs-002'], { support: 'less' });
    await openPlay(page, SUB, 'change');
    await page.fill('.question-card .answer-input', "i don't watch TV");
    await page.click('.btn-check');
    const fb = await feedbackText(page);
    const s = await getSession(page, 'change');
    return { ok: s.states['w1-cs-002'].status === 'correct-first' && /big letter/.test(fb), detail: fb.replace(/\s+/g, ' ') };
  });
  await page.context().close();
}

// =====================================================================
// 11–12. New lesson, Resume, Restart, Retry mistakes; Classroom vs Practice
// =====================================================================
{
  const page = await newPage({}, 'sessions');
  await open(page, SUB, '#/week/week-01/practise/mcq?n=5&target=negative');
  await check('Sessions', 'Settings from the link: 5 negative questions', '5 questions, all negative', async () => {
    await page.click('button[type=submit]');
    await page.waitForSelector('.question-card');
    const s = await getSession(page, 'mcq');
    const allNeg = s.questionIds.every((id) => byId.get(id).target === 'negative');
    return { ok: s.questionIds.length === 5 && allNeg, detail: `${s.questionIds.length} ${allNeg}` };
  });
  await check('Sessions', 'Resume after leaving', 'Resume button shows question 2 and opens it', async () => {
    const s = await getSession(page, 'mcq');
    await answer(page, byId.get(s.questionIds[0]), true);
    await page.click('.btn-check');
    await page.click('.step-nav button:has-text("Next")');
    await open(page, SUB, '#/week/week-01/practise/mcq');
    const label = await page.locator('button:has-text("Resume")').innerText();
    await page.click('button:has-text("Resume")');
    await page.waitForSelector('.question-card');
    const t = await page.locator('.step-nav .progress-text').innerText();
    return { ok: /question 2 of 5/.test(label) && t === 'Question 2 of 5', detail: `${label} → ${t}` };
  });
  await check('Sessions', 'Retry mistakes makes a new round; first round results unchanged', 'round 2 with 4 questions; parent kept first-try 1', async () => {
    const s1 = await getSession(page, 'mcq');
    await page.evaluate((k) => { const s = JSON.parse(localStorage.getItem(k)); s.finished = true; localStorage.setItem(k, JSON.stringify(s)); }, sKey('mcq'));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.results');
    const first = await page.locator('.res-first .res-num').innerText();
    await page.click('button:has-text("Practise mistakes again")');
    await page.waitForSelector('.question-card');
    const s2 = await getSession(page, 'mcq');
    return { ok: first === '1' && s2.round === 2 && s2.parentId === s1.id && s2.questionIds.length === 4 && Object.keys(s2.states).length === 0, detail: `first=${first} round=${s2.round} n=${s2.questionIds.length}` };
  });
  await check('Sessions', 'Restart activity asks first and starts a new set', 'confirm → setup screen → new session id', async () => {
    const before = await getSession(page, 'mcq');
    await page.click('button:has-text("Restart activity")');
    await page.click('dialog.dlg button:has-text("Restart")');
    await page.waitForSelector('.setup-form');
    await page.click('button[type=submit]');
    await page.waitForSelector('.question-card');
    const after = await getSession(page, 'mcq');
    return { ok: after.id !== before.id && after.round === 1, detail: `${before.id} → ${after.id}` };
  });
  await check('Sessions', 'Cancel in a confirm dialog changes nothing', 'same session after Cancel', async () => {
    const before = await getSession(page, 'mcq');
    await page.click('button:has-text("Restart activity")');
    await page.click('dialog.dlg button:has-text("Cancel")');
    const after = await getSession(page, 'mcq');
    return { ok: before.id === after.id, detail: 'unchanged' };
  });
  await check('Sessions', 'New lesson (new class) removes only this week + mode, after a yes', 'mcq session gone; other app keys kept', async () => {
    await page.evaluate(() => { localStorage.setItem('other-project-key', 'keep me'); });
    await open(page, SUB, '#/week/week-01/practise');
    await page.click('button:has-text("New lesson")');
    await page.click('dialog.dlg button:has-text("Yes, start new")');
    await page.waitForTimeout(300);
    const s = await getSession(page, 'mcq');
    const other = await page.evaluate(() => localStorage.getItem('other-project-key'));
    return { ok: s === null && other === 'keep me', detail: `session=${s} other=${other}` };
  });
  await check('Modes', 'Classroom and Practice keep separate answers', 'answer shown in Practice is not shown in Classroom', async () => {
    await injectSession(page, 'mcq', idsOf('mcq').slice(0, 2));
    await openPlay(page, SUB, 'mcq');
    await page.click('.q-controls button:has-text("Show answer")');
    await page.click('#mode-btn');
    await page.waitForSelector('.screen');
    const classroomOn = await page.evaluate(() => document.body.classList.contains('classroom'));
    const hasCard = await page.locator('.question-card').count();
    await page.click('#mode-btn');
    await page.waitForSelector('.question-card');
    const stillShown = await page.locator('.feedback.is-shown').count();
    return { ok: classroomOn && hasCard === 0 && stillShown === 1, detail: `classroom=${classroomOn} cardInClassroom=${hasCard} shownBack=${stillShown}` };
  });
  await page.context().close();
}

// =====================================================================
// 13. Storage blocked / full / broken
// =====================================================================
{
  const blocked = await newPage({}, 'storage-blocked');
  await blocked.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } });
  });
  await check('Storage', 'localStorage blocked: lessons still work, note is shown', 'note visible; practice question can be answered', async () => {
    await open(blocked, SUB, '#/week/week-01/practise/mcq');
    const note = await blocked.locator('#storage-note').innerText();
    await blocked.click('button[type=submit]');
    await blocked.waitForSelector('.question-card');
    await blocked.click('.question-card .options .btn-option >> nth=0');
    await blocked.click('.btn-check');
    const fb = await blocked.locator('.question-card .feedback').innerText();
    return { ok: /Saving is off/.test(note) && fb.length > 0, detail: note };
  });
  await blocked.context().close();

  const full = await newPage({}, 'storage-full');
  await full.addInitScript(() => {
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) { if (String(k).includes('practise')) throw new DOMException('full', 'QuotaExceededError'); return orig.call(this, k, v); };
  });
  await check('Storage', 'Storage full: app keeps working and says so', '“device is full” note; question still checks', async () => {
    await open(full, SUB, '#/week/week-01/practise/fill');
    await full.click('button[type=submit]');
    await full.waitForSelector('.question-card');
    const note = await full.locator('#storage-note').innerText();
    await full.click('.question-card .pool .btn-option >> nth=0');
    await full.click('.btn-check');
    const fb = await full.locator('.question-card .feedback').innerText();
    return { ok: /full/.test(note) && fb.length > 0, detail: note };
  });
  await full.context().close();

  const broken = await newPage({}, 'storage-broken');
  await check('Storage', 'Broken saved data is removed, page still opens', 'setup screen opens; note about broken data', async () => {
    await open(broken, SUB, '#/');
    await broken.evaluate((k) => localStorage.setItem(k, '{not json'), sKey('mcq'));
    await open(broken, SUB, '#/week/week-01/practise/mcq/play');
    await broken.waitForSelector('.setup-form', { timeout: 6000 });
    const note = await broken.locator('#storage-note').innerText();
    return { ok: /broken/.test(note), detail: note };
  });
  await check('Storage', 'Saved session pointing to removed questions does not crash', 'unknown ids dropped; known question shown', async () => {
    await broken.evaluate(([k, id]) => localStorage.setItem(k, JSON.stringify({ id: 'x', weekId: 'week-01', bank: 'mcq', mode: 'practice', settings: {}, round: 1, seed: 1, index: 1, questionIds: ['gone-1', id, 'gone-2'], states: { 'gone-1': { v: 1, status: 'correct-first' } }, finished: false })), [sKey('mcq'), idsOf('mcq')[0]]);
    await openPlay(broken, SUB, 'mcq');
    const t = await broken.locator('.step-nav .progress-text').innerText();
    return { ok: t === 'Question 1 of 1', detail: t };
  });
  await broken.context().close();
}

// =====================================================================
// 14. Adding Week 2 from the template keeps Week 1 + its progress
// =====================================================================
{
  const page = await newPage({}, 'week2');
  await check('Week 2', 'A template week can be added without code changes; Week 1 progress stays', 'Week 2 opens; Week 1 saved session still there', async () => {
    await open(page, W2URL, '#/');
    await injectSession(page, 'mcq', idsOf('mcq').slice(0, 3));
    await openPlay(page, W2URL, 'mcq');
    await answer(page, byId.get(idsOf('mcq')[0]), true);
    await page.click('.btn-check');
    await open(page, W2URL, '#/weeks');
    const cards = await page.locator('a.week-card').count();
    await open(page, W2URL, '#/week/week-02');
    const t2 = await page.locator('h1').innerText();
    await open(page, W2URL, '#/week/week-02/words/1');
    const w2img = await page.locator('.word-stage img').evaluate((i) => i.complete && i.naturalWidth > 0 && i.src.endsWith('example.jpg'));
    await open(page, W2URL, '#/week/week-02/practise');
    const banks2 = await page.locator('.bank-card').count();
    await open(page, W2URL, '#/week/week-01/practise/mcq');
    const resume = await page.locator('button:has-text("Resume")').count();
    const s = await getSession(page, 'mcq');
    return { ok: w2img && cards === 2 && /TEST WEEK|Template/i.test(t2) && banks2 >= 1 && resume === 1 && s.states[idsOf('mcq')[0]].status === 'correct-first', detail: `cards=${cards} title=${t2} banks=${banks2} resume=${resume}` };
  });
  await page.context().close();
}

// =====================================================================
// 15–16. Pictures, full screen, copy link, listen
// =====================================================================
{
  const page = await newPage({}, 'media');
  await check('Pictures', 'Every picture used by Week 1 loads (all 21 week images + covers)', 'naturalWidth > 0 for each', async () => {
    const keys = Object.keys(WEEK.images);
    await open(page, SUB, '#/');
    const bad = await page.evaluate(async ([base, list]) => {
      const out = [];
      for (const src of list) {
        for (const s of ['-sm.webp', '-lg.webp']) {
          const ok = await new Promise((r) => { const i = new Image(); i.onload = () => r(i.naturalWidth > 0); i.onerror = () => r(false); i.src = new URL(src + s, base).href; });
          if (!ok) out.push(src + s);
        }
      }
      return out;
    }, [SUB, keys.map((k) => WEEK.images[k].src).concat(['assets/images/site/cover', 'assets/images/site/characters'])]);
    return { ok: bad.length === 0, detail: bad.length ? bad.join(', ') : `${(keys.length + 2) * 2} files loaded` };
  });
  await check('Pictures', 'Images have alt text that does not give answers', 'all <img> on word grid have alt; none mention “answer”', async () => {
    await open(page, SUB, '#/week/week-01/words?view=grid');
    const alts = await page.locator('main img').evaluateAll((is) => is.map((i) => i.getAttribute('alt')));
    return { ok: alts.length === 12 && alts.every((a) => a && !/answer|correct/i.test(a)), detail: `${alts.length} images` };
  });
  await check('Tools', 'Full screen button does not break the page (allowed or refused)', 'page still works after click', async () => {
    await open(page, SUB, '#/');
    const fs = page.locator('#fs-btn');
    if (!(await fs.isDisabled())) await fs.click();
    await page.waitForTimeout(400);
    if (await page.evaluate(() => !!document.fullscreenElement)) await page.evaluate(() => document.exitFullscreen());
    return { ok: (await page.locator('.dash-hero').count()) === 1, detail: (await fs.isDisabled()) ? 'disabled (not supported)' : 'clicked' };
  });
  await check('Tools', 'Copy link without clipboard permission shows the link to select', 'dialog with the current URL', async () => {
    await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true }); });
    await page.click('button:has-text("Copy link")');
    await page.waitForSelector('dialog.dlg .copy-input');
    const v = await page.locator('dialog.dlg .copy-input').inputValue();
    await page.keyboard.press('Escape');
    return { ok: v.startsWith(SUB), detail: v };
  });
  await check('Tools', 'Listen buttons are hidden when there is no English voice, or work when there is', 'no visible broken speaker button', async () => {
    await open(page, SUB, '#/week/week-01/words/1');
    await page.click('button:has-text("Show the word")');
    const hasVoice = await page.evaluate(() => (window.speechSynthesis?.getVoices() || []).some((v) => /^en/i.test(v.lang)));
    const visible = await page.locator('.listen-btn:visible').count();
    if (visible) await page.click('.listen-btn:visible');
    return { ok: hasVoice ? visible >= 1 : visible === 0, detail: `voices=${hasVoice} visibleButtons=${visible}` };
  });
  await page.context().close();
}

// =====================================================================
// 17–18. Screen sizes, keyboard, reduced motion, games
// =====================================================================
const SIZES = [[1920, 1080], [1366, 768], [1024, 768], [768, 1024], [390, 844]];
const SIZE_ROUTES = ['#/', '#/week/week-01/examples', '#/week/week-01/examples/ex-04/question', '#/week/week-01/challenge', '#/week/week-01/progress', '#/week/week-01/words?set=book', '#/week/week-01', '#/week/week-01/words/2', '#/week/week-01/learn/compare/2', '#/week/week-01/practise', '#/week/week-01/play', '#/week/week-01/play/sentence-switch', '#/week/week-01/play/question-door', '#/week/week-01/play/memory', '#/week/week-01/play/yes-or-no', '#/week/week-01/play/spin-and-say', '#/week/week-01/play/listen', '#/week/week-01/worksheet', '#/week/week-01/certificate', '#/week/week-01/speak/3'];
for (const [w, hgt] of SIZES) {
  const page = await newPage({ viewport: { width: w, height: hgt } }, `size-${w}`);
  await check('Screens', `${w}×${hgt}: no sideways scrolling on ${SIZE_ROUTES.length} screens + every question type`, 'scrollWidth ≤ width everywhere; Check button inside the screen width', async () => {
    const bad = [];
    for (const r of SIZE_ROUTES) {
      await open(page, SUB, r);
      if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) bad.push(r);
    }
    for (const type of TYPES) {
      await injectSession(page, type, idsOf(type).slice(0, 2));
      await openPlay(page, SUB, type);
      if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) bad.push(type);
      const box = await page.locator('.btn-check').boundingBox();
      if (!box || box.x < 0 || box.x + box.width > w + 1) bad.push(`${type}: Check outside`);
      if (w === 390 || w === 1920) await page.screenshot({ path: join(SHOTS, `type-${type}-${w}.png`), fullPage: true });
    }
    for (const r of ['#/', '#/week/week-01/learn/subjects/2', '#/week/week-01/words/1']) {
      await open(page, SUB, r);
      await page.screenshot({ path: join(SHOTS, `screen-${r.replace(/[^a-z0-9]+/gi, '_')}-${w}.png`), fullPage: w === 390 });
    }
    return { ok: bad.length === 0, detail: bad.length ? bad.join(', ') : 'ok' };
  });
  await check('Screens', `${w}×${hgt}: small buttons are at least 44×44 px`, 'no button smaller than 44 px', async () => {
    await injectSession(page, 'jumbled', idsOf('jumbled').slice(0, 1));
    await openPlay(page, SUB, 'jumbled');
    const small = await page.evaluate(() => [...document.querySelectorAll('button, a.btn, .tab')].filter((b) => b.offsetParent).map((b) => b.getBoundingClientRect()).filter((r) => r.width < 44 || r.height < 44).length);
    return { ok: small === 0, detail: `${small} small` };
  });
  await page.context().close();
}
{
  const page = await newPage({ viewport: { width: 1920, height: 1080 } }, 'classroom');
  await check('Modes', 'Classroom mode: example sentences 32–44 px on a 1920×1080 board', 'font-size between 32 and 44', async () => {
    await open(page, SUB, '#/week/week-01/learn/positive-he-she-it/5');
    await page.click('#mode-btn');
    await page.waitForSelector('.ex-sentence, .bubble');
    const size = await page.locator('.ex-sentence, .bubble').first().evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
    await page.screenshot({ path: join(SHOTS, 'classroom-learn-1920.png') });
    await page.click('#mode-btn');
    return { ok: size >= 32 && size <= 44, detail: `${size}px` };
  });
  await page.context().close();
}
{
  const page = await newPage({ reducedMotion: 'reduce' }, 'reduced-motion');
  await check('Games', 'Reduced motion: Question Door opens with the right question; wrong gives a hint', 'hint on wrong; door open + answer on right', async () => {
    await open(page, SUB, '#/week/week-01/play/question-door');
    const d = WEEK.games.questionDoor[0];
    const wrong = d.options.find((_, i) => String.fromCharCode(97 + i) !== d.answer);
    await page.locator('.options .btn-option', { hasText: wrong }).first().click();
    const hint = await page.locator('.door-wrap .feedback').innerText();
    const right = d.options[d.answer.charCodeAt(0) - 97];
    await page.locator('.options .btn-option').filter({ hasText: new RegExp(`^✓? ?${right.replace(/[?]/g, '\\?')}$`) }).first().click();
    const open1 = await page.locator('.door.is-open').count();
    const fb = await page.locator('.door-wrap .feedback').innerText();
    return { ok: /Try again/.test(hint) && open1 === 1 && fb.includes(d.reveal), detail: fb };
  });
  await check('Games', 'Sentence Switch builds correct + / − / ? with he and has', 'She has breakfast. / She doesn\'t have breakfast. / Does she have breakfast?', async () => {
    await open(page, SUB, '#/week/week-01/play/sentence-switch');
    await page.selectOption('#sw-subject', 'she');
    await page.selectOption('#sw-verb', 'have-breakfast');
    const get = () => page.locator('.switch-sentence').innerText();
    const a = (await get()).replace(/\s+/g, ' ').replace(' .', '.');
    await page.click('button:has-text("Negative")');
    const b = (await get()).replace(/\s+/g, ' ').replace(' .', '.');
    await page.click('button:has-text("Question")');
    const c = (await get()).replace(/\s+/g, ' ').replace(' ?', '?');
    const ans = await page.locator('.switch-answers').innerText();
    const ok = a === 'She has breakfast.' && b === "She doesn't have breakfast." && c === 'Does she have breakfast?' && /Yes, she does/.test(ans);
    return { ok, detail: `${a} | ${b} | ${c} | ${ans.replace(/\s+/g, ' ')}` };
  });
  await check('Games', 'Memory Match: a right pair stays open, a wrong pair closes again', 'pair matched; wrong pair closed; 12 cards', async () => {
    await open(page, SUB, '#/week/week-01/play/memory');
    const cards = await page.locator('.memory-card').count();
    const pairs = await page.locator('.memory-card').evaluateAll((bs) => bs.map((b) => b.dataset.pair + '|' + (b.classList.contains('kind-pic') ? 'pic' : 'word')));
    const first = pairs[0].split('|');
    const mate = pairs.findIndex((p, i) => i > 0 && p.split('|')[0] === first[0]);
    const other = pairs.findIndex((p, i) => i > 0 && p.split('|')[0] !== first[0]);
    await page.locator('.memory-card').nth(0).click();
    await page.locator('.memory-card').nth(mate).click();
    const done = await page.locator('.memory-card.is-done').count();
    const idx2 = pairs.findIndex((p, i) => i !== 0 && i !== mate && i !== other && p.split('|')[0] !== pairs[other].split('|')[0]);
    await page.locator('.memory-card').nth(other).click();
    await page.locator('.memory-card').nth(idx2).click();
    await page.waitForTimeout(1300);
    const openNow = await page.locator('.memory-card.is-open:not(.is-done)').count();
    const status = await page.locator('.memory-status').innerText();
    return { ok: cards === 12 && done === 2 && openNow === 0 && /Pairs: 1 of 6 · Turns: 2/.test(status), detail: `cards=${cards} done=${done} open=${openNow} ${status}` };
  });
  await check('Games', 'Yes or No?: wrong gives the hint, right short answer is scored once', 'hint; First try 0 · Done 1 after a wrong first try', async () => {
    await open(page, SUB, '#/week/week-01/play/yes-or-no');
    const it = WEEK.games.yesNo[0];
    const wrong = String.fromCharCode(97 + it.options.findIndex((_, k) => String.fromCharCode(97 + k) !== it.answer));
    await page.click(`.yesno-wrap [data-option="${wrong}"]`);
    const hint = await page.locator('.yesno-wrap .feedback').innerText();
    await page.click(`.yesno-wrap [data-option="${it.answer}"]`);
    await page.click(`.yesno-wrap [data-option="${it.answer}"]`, { force: true, timeout: 1500 }).catch(() => {});
    const score = await page.locator('.score').innerText();
    return { ok: hint.includes(it.hint) && /First try: 0 · Done: 1 of 20/.test(score), detail: score };
  });
  await check('Games', 'Spin and Say: spin gives a sentence that matches the slots (verified forms)', 'answer hidden → shown, ends with . or ?', async () => {
    await open(page, SUB, '#/week/week-01/play/spin-and-say');
    await page.click('.btn-spin');
    await page.waitForTimeout(200);
    const hidden = await page.locator('.spin-answer').isHidden();
    await page.click('button:has-text("Show the answer")');
    const s = await page.locator('.spin-answer .switch-sentence').innerText();
    const who = await page.locator('.slot .slot-value').first().innerText();
    const form = await page.locator('.slot-form').innerText();
    const okEnd = form.includes('question') ? s.endsWith('?') : s.endsWith('.');
    const okWho = s.toLowerCase().includes(who.toLowerCase());
    return { ok: hidden && okEnd && okWho, detail: `${who} / ${form} → ${s}` };
  });
  await check('Games', 'Picture Reveal: open pieces, reveal word and sentence separately, next picture', 'tiles open; word then sentence; picture 2', async () => {
    await open(page, SUB, '#/week/week-01/play/picture-reveal');
    await page.click('button:has-text("Open a piece")');
    const opened = await page.locator('.reveal-tile.is-open').count();
    await page.click('button:has-text("Reveal word")');
    const word = await page.locator('.reveal-word').isVisible();
    const sent = await page.locator('.reveal-sentence').isVisible();
    await page.click('button:has-text("Reveal sentence")');
    const sent2 = await page.locator('.reveal-sentence').innerText();
    await page.click('button:has-text("Next picture")');
    const t = await page.locator('.step-nav .progress-text').innerText();
    const closedAgain = await page.locator('.reveal-tile.is-open').count();
    return { ok: opened === 1 && word && !sent && sent2 === 'He plays football.' && t.startsWith('Picture 2') && closedAgain === 0, detail: `${opened} ${word} ${sent} ${sent2} ${t}` };
  });
  await check('Speak', 'Speaking card: help and example are optional; Done / Try again need no microphone', 'help hidden → shown; marks work', async () => {
    await open(page, SUB, '#/week/week-01/speak/1');
    const hidden = await page.locator('.speak-help').isHidden();
    await page.click('button:has-text("Word help")');
    await page.click('button:has-text("Example answer")');
    const sample = await page.locator('.speak-sample').innerText();
    await page.click('.teacher-marks button:has-text("Done")');
    const mark = await page.locator('.speak-mark').innerText();
    const cards = WEEK.speaking.length;
    return { ok: hidden && /Yes, I do/.test(sample) && /Well spoken/.test(mark) && cards === 18, detail: `${sample} | ${mark}` };
  });
  await check('Learn', '“Now you try” step: wrong → Try again, right → explanation', 'try-again then Yes!', async () => {
    await open(page, SUB, '#/week/week-01/learn/habits/10');
    const p = WEEK.learn[0].practice[1];
    const wrongIdx = p.answer === 'a' ? 1 : 0;
    await page.locator('.options .btn-option').nth(wrongIdx).click();
    const f1 = await page.locator('.lesson-stage .feedback').innerText();
    await page.locator(`.options .btn-option[data-option="${p.answer}"]`).click();
    const f2 = await page.locator('.lesson-stage .feedback').innerText();
    return { ok: /Try again/.test(f1) && /Yes!/.test(f2), detail: `${f1} | ${f2}` };
  });
  await page.context().close();
}

// =====================================================================
// Template sections: Change Machine, book words, Challenge, Progress, shell
// =====================================================================
{
  const page = await newPage({}, 'template');
  await check('Examples', 'Change Machine: + → − step by step; the ending moves to does', '4 rows, last “Sam doesn\'t play football.”, rule frame shown', async () => {
    await open(page, SUB, '#/week/week-01/examples/ex-01/negative');
    for (let i = 0; i < 3; i++) await page.click('button:has-text("Show the next change")');
    await page.waitForTimeout(300);
    const rows = await page.locator('.m-row').count();
    const last = await page.locator('.m-row').last().locator('.sr-only').innerText();
    const frame = await page.locator('.m-formula').isVisible();
    return { ok: rows === 4 && last === "Sam doesn't play football." && frame, detail: `${rows} rows · ${last} · frame=${frame}` };
  });
  await check('Examples', 'Change Machine: has → have in a Does question', '“Does she have breakfast?”', async () => {
    await open(page, SUB, '#/week/week-01/examples/ex-04/question');
    await page.click('button:has-text("Show the next change")');
    await page.click('button:has-text("Show the next change")');
    const last = await page.locator('.m-row').last().locator('.sr-only').innerText();
    return { ok: last === 'Does she have breakfast?', detail: last };
  });
  await check('Examples', 'Change Machine inside a Learn step', 'Learn 7 step 2 ends with doesn\'t', async () => {
    await open(page, SUB, '#/week/week-01/learn/doesnt/2');
    for (let i = 0; i < 3; i++) await page.click('button:has-text("Show the next change")');
    const last = await page.locator('.m-row').last().locator('.sr-only').innerText();
    return { ok: last === "He doesn't play football.", detail: last };
  });
  await check('Words', 'Book words set: 10 cards; first card “live in a city”', 'Card 1 of 10', async () => {
    await open(page, SUB, '#/week/week-01/words?set=book');
    const t = await page.locator('.step-nav .progress-text').innerText();
    await page.click('button:has-text("Show the word")');
    const phrase = await page.locator('.word-phrase').innerText();
    return { ok: t === 'Card 1 of 10' && phrase === 'live in a city', detail: `${t} · ${phrase}` };
  });
  await check('Practise', 'Book words bank (I): 30 questions; a picture question is checked', '30 questions; correct-first', async () => {
    await open(page, SUB, '#/week/week-01/practise');
    const count = await page.locator('.bank-card', { hasText: 'Book words' }).locator('.bank-count').innerText();
    await injectSession(page, 'book', ['w1-bk-001']);
    await openPlay(page, SUB, 'book');
    await page.click('.question-card [data-option="a"]');
    await page.click('.btn-check');
    const s = await getSession(page, 'book');
    return { ok: /30 questions/.test(count) && s.states['w1-bk-001'].status === 'correct-first', detail: count };
  });
  await check('Challenge', 'Challenge: 15 mixed core questions; results show stars; My Progress ticks Challenge', '15 · stars · 1/1', async () => {
    await open(page, SUB, '#/week/week-01/challenge');
    await page.click('button:has-text("Start the challenge")');
    await page.waitForSelector('.question-card');
    const s = await page.evaluate(() => JSON.parse(localStorage.getItem('eemc:v1:week-01:practise:challenge:practice')));
    const core = s.questionIds.every((id) => !id.includes('-bk-'));
    for (let i = 0; i < 14; i++) await page.click('.step-nav button:has-text("Next")');
    await page.click('.step-nav button:has-text("Finish")');
    await page.click('dialog.dlg button:has-text("See results")');
    await page.waitForSelector('.results .stars');
    const stars = await page.locator('.results .stars').getAttribute('aria-label');
    await open(page, SUB, '#/week/week-01/progress');
    const row = await page.locator('.mp-list li', { hasText: 'Challenge' }).innerText();
    return { ok: s.questionIds.length === 15 && core && /of 3 stars/.test(stars) && /1\/1/.test(row), detail: `${s.questionIds.length} · ${stars} · ${row.replace(/\s+/g, ' ')}` };
  });
  await check('Progress', 'My Progress and Today\'s Mission update from real activity', 'Learn 3/13; first mission done', async () => {
    for (const id of ['habits', 'subjects', 'dont']) {
      const n = WEEK.learn.find((x) => x.id === id);
      const steps = 1 + n.examples.length + (n.groups ? 1 : 0) + n.practice.length;
      await open(page, SUB, `#/week/week-01/learn/${id}/${steps}`);
    }
    await open(page, SUB, '#/');
    const learnRow = await page.locator('.mp-list li', { hasText: 'Learn' }).innerText();
    const mission = await page.locator('.mission li').first().getAttribute('class');
    return { ok: /3\/13/.test(learnRow) && /is-done/.test(mission || ''), detail: `${learnRow.replace(/\s+/g, ' ')} · ${mission}` };
  });
  await check('Shell', 'Week picker: Coming soon weeks cannot be chosen; owl tip changes on click', 'week-02 disabled; tip changes', async () => {
    const dis = await page.locator('#week-select option[value="week-02"]').getAttribute('disabled');
    const a = await page.locator('.owl-bubble').innerText();
    await page.click('.owl-bubble');
    const b = await page.locator('.owl-bubble').innerText();
    return { ok: dis !== null && a !== b, detail: `${dis !== null} · ${a} → ${b}` };
  });
  await page.context().close();
}
{
  const page = await newPage({ viewport: { width: 390, height: 844 } }, 'mobile-menu');
  await check('Shell', 'Phone: menu button opens the sidebar; a link closes it and navigates', 'menu opens; Examples opens', async () => {
    await open(page, SUB, '#/');
    await page.click('#menu-btn');
    const o = await page.evaluate(() => document.body.classList.contains('menu-open'));
    await page.click('.side-nav a[data-nav=examples]');
    await page.waitForSelector('.example-grid');
    const c = await page.evaluate(() => !document.body.classList.contains('menu-open'));
    return { ok: o && c, detail: `${o}/${c}` };
  });
  await page.context().close();
}

// =====================================================================
// v2.1: badges + celebration, certificate, worksheet, Listen and Choose
// =====================================================================
{
  const page = await newPage({}, 'extras');
  await check('Badges', 'Finishing a section shows one celebration with the badge; it does not repeat', 'Word Finder celebration once', async () => {
    await page.goto(`${SUB}#/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('eemc:v1:week-01:progress', JSON.stringify({ words: ['everyday', 'book', 'a1-verbs'] })); });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.celebrate');
    const title = await page.locator('.celebrate h2').innerText();
    await page.click('.celebrate button:has-text("Great!")');
    const gone = (await page.locator('.celebrate').count()) === 0;
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.dash-hero');
    await page.waitForTimeout(300);
    const again = await page.locator('.celebrate').count();
    const earned = await page.locator('.mp-badges .badge.is-earned').count();
    return { ok: title === 'Word Finder' && gone && again === 0 && earned === 1, detail: `${title} · again=${again} · earned=${earned}` };
  });
  await check('Certificate', 'Certificate shows the typed name and badges; the name is not saved', 'name on certificate; not in storage', async () => {
    await open(page, SUB, '#/week/week-01/certificate');
    await page.fill('.cert-name-input', 'Test Explorer');
    const shown = await page.locator('.cert-name').innerText();
    const stored = await page.evaluate(() => Object.keys(localStorage).some((k) => (localStorage.getItem(k) || '').includes('Test Explorer')));
    const badges = await page.locator('.cert-badges .badge').count();
    await page.screenshot({ path: join(SHOTS, 'certificate-1366.png'), fullPage: true });
    return { ok: shown === 'Test Explorer' && !stored && badges === 7, detail: `${shown} · stored=${stored} · badges=${badges}` };
  });
  await check('Worksheet', 'Worksheet: chosen activities → numbered questions + matching answer key', '20 questions and 20 answers by default', async () => {
    await open(page, SUB, '#/week/week-01/worksheet');
    const items = await page.locator('.ws-sheet .ws-item').count();
    const answers = await page.locator('.ws-key-list li').count();
    await page.screenshot({ path: join(SHOTS, 'worksheet-1366.png'), fullPage: true });
    await page.locator('.ws-controls .chip', { hasText: 'H Mini reading' }).click();
    const items2 = await page.locator('.ws-sheet .ws-item').count();
    const answers2 = await page.locator('.ws-key-list li').count();
    const passages = await page.locator('.ws-passage').count();
    return { ok: items === 20 && answers === 20 && items2 === answers2 && items2 > 20 && passages >= 1, detail: `${items}/${answers} → ${items2}/${answers2}, passages=${passages}` };
  });
  await check('Worksheet', 'Print view hides the menu and the settings', 'sidebar + settings hidden in print media', async () => {
    await page.emulateMedia({ media: 'print' });
    const side = await page.locator('#sidebar').isVisible();
    const form = await page.locator('.ws-controls').isVisible();
    const sheet = await page.locator('.ws-sheet').isVisible();
    await page.emulateMedia({ media: 'screen' });
    return { ok: !side && !form && sheet, detail: `side=${side} form=${form} sheet=${sheet}` };
  });
  await check('Games', 'Listen and Choose: without a voice the teacher can show the sentence; wrong → try again; right → scored', 'teacher text; First try 0 · Done 1', async () => {
    await open(page, SUB, '#/week/week-01/play/listen');
    await page.click('button:has-text("Show the sentence")');
    const text = await page.locator('.listen-text').innerText();
    const target = WEEK.words.find((w) => w.example === text);
    const wrongBtn = page.locator(`.listen-card:not([data-word="${target.id}"])`).first();
    await wrongBtn.click();
    const fb = await page.locator('.listen-wrap .feedback').innerText();
    await page.click(`.listen-card[data-word="${target.id}"]`);
    const score = await page.locator('.score').innerText();
    return { ok: !!target && /Try again/.test(fb) && /First try: 0 · Done: 1 of 10/.test(score), detail: `${text} · ${score}` };
  });
  await page.context().close();
}

// =====================================================================
// 19. Root address too
// =====================================================================
{
  const page = await newPage({}, 'root');
  await check('Paths', 'Same package works at the domain root (/) as well as /test-repo/', 'home + week + practice question load at /', async () => {
    await open(page, ROOTURL, '#/');
    await open(page, ROOTURL, '#/week/week-01/learn/habits/2');
    await injectSession(page, 'reading', idsOf('reading').slice(0, 1));
    await openPlay(page, ROOTURL, 'reading');
    const imgs = await page.evaluate(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
    return { ok: imgs, detail: 'ok' };
  });
  await page.context().close();
}

// =====================================================================
// 20. Console errors and failed requests across the whole run
// =====================================================================
const external = (s) => /fonts\.(googleapis|gstatic)\.com/.test(s);
const problems = consoleProblems.filter((m) => !external(m) && !/Failed to load resource: the server responded with a status of 404/.test(m));
// ERR_ABORTED = the browser cancelled a picture because the test moved to the next screen.
const aborted = failedRequests.filter((m) => /ERR_ABORTED/.test(m));
const reqProblems = failedRequests.filter((m) => !external(m) && !/ERR_ABORTED/.test(m));
record('No console errors or warnings from the app during all tests', '0', problems.length ? problems.slice(0, 8).join(' || ') : '0', problems.length ? 'fail' : 'pass', 'Console');
record('No failed or 4xx/5xx requests (except tests that force a 404)', '0', reqProblems.length ? reqProblems.slice(0, 8).join(' || ') : '0', reqProblems.length ? 'fail' : 'pass', 'Network');
record('Requests cancelled by quick screen changes (not errors)', 'info', String(aborted.length), 'pass', 'Network');
const fontIssues = failedRequests.filter(external).length + consoleProblems.filter(external).length;
record('Google Fonts reachable (optional; the site falls back to system fonts)', 'reachable', fontIssues ? `${fontIssues} font request problems (offline?)` : 'reachable', fontIssues ? 'skip' : 'pass', 'Network');

await browser.close();
servers.forEach((s) => s.close());

const pass = results.filter((r) => r.status === 'pass').length;
const fail = results.filter((r) => r.status === 'fail').length;
const env = `Windows ${process.platform === 'win32' ? '' : process.platform}· Node ${process.version} · ${BROWSER_NAME} (headless, playwright-core) · package: release/READY_TO_UPLOAD.zip unzipped to tests/.tmp/ready · served at ${SUB} and ${ROOTURL} by scripts/serve.mjs`;
writeFileSync('tests/e2e/results.json', JSON.stringify({ date: new Date().toISOString(), env, pass, fail, results }, null, 2));
const md = ['# E2E results (generated)', '', `Date: ${new Date().toISOString()}`, '', `Environment: ${env}`, '', `**${pass} passed, ${fail} failed, ${results.length - pass - fail} skipped**`, '',
  '| Area | Test | Expected | Actual | Result |', '|---|---|---|---|---|',
  ...results.map((r) => `| ${r.area} | ${r.name} | ${String(r.expected).replace(/\|/g, '/')} | ${String(r.actual).replace(/\|/g, '/').slice(0, 160)} | ${r.status.toUpperCase()} |`)].join('\n');
writeFileSync('tests/e2e/E2E_RESULTS.md', md + '\n');
console.log(`\n${pass} passed, ${fail} failed, ${results.length - pass - fail} skipped`);
process.exit(fail ? 1 : 0);
