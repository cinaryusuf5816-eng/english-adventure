// Content checks for every published week (development / CI only).
// Usage: node scripts/validate-content.mjs [siteFolder=site] [--report out.json]
// Exit code 1 when an error is found.
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';

const args = process.argv.slice(2);
const SITE = args.find((a) => !a.startsWith('--')) || 'site';
const reportIdx = args.indexOf('--report');
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

function readJSON(rel) {
  const p = join(SITE, rel);
  if (!existsSync(p)) { err(`Missing file: ${rel}`); return null; }
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch (e) { err(`Broken JSON: ${rel} (${e.message})`); return null; }
}

/** Exact-case existence check (Windows is case-insensitive, GitHub Pages is not). */
function existsExact(rel) {
  const parts = rel.split('/');
  let dir = SITE;
  for (const part of parts) {
    if (!existsSync(dir)) return false;
    const names = readdirSync(dir);
    if (!names.includes(part)) return false;
    dir = join(dir, part);
  }
  return true;
}

function checkImageBase(src, where) {
  for (const s of ['-sm.webp', '-lg.webp']) {
    if (!existsExact(src + s)) err(`${where}: image file not found (or wrong letter case): ${src}${s}`);
  }
}

const words = (t) => String(t).trim().split(/\s+/).filter(Boolean);
const lowerSorted = (arr) => arr.map((x) => x.toLowerCase()).sort().join('|');

// ---------- site + curriculum ----------
const site = readJSON('data/site.json');
const curriculum = readJSON(site?.curriculum || 'data/curriculum.json');
const report = { weeks: [] };

if (site) {
  checkImageBase(site.heroImage, 'site.heroImage');
  checkImageBase(site.charactersImage, 'site.charactersImage');
  for (const k of ['landscapeImage', 'owlImage', 'avatarImage']) if (site[k]) checkImageBase(site[k], `site.${k}`);
  for (const [k, src] of Object.entries(site.pathIcons || {})) checkImageBase(src, `site.pathIcons.${k}`);
}
const indexHtml = existsSync(join(SITE, 'index.html')) ? readFileSync(join(SITE, 'index.html'), 'utf8') : (err('index.html missing'), '');
for (const m of indexHtml.matchAll(/(?:href|src)="([^"#:]+)"/g)) {
  const ref = m[1];
  if (ref.startsWith('/')) err(`index.html uses a root path (breaks on GitHub project pages): ${ref}`);
  else if (!existsExact(ref)) err(`index.html points to a missing file: ${ref}`);
}
if (!existsSync(join(SITE, '.nojekyll'))) err('.nojekyll missing');

// JS / CSS must not use root-absolute asset paths
function walk(dir, out = []) {
  for (const n of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, n.name);
    if (n.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
for (const f of walk(join(SITE, 'js')).concat(walk(join(SITE, 'styles')))) {
  const text = readFileSync(f, 'utf8');
  if (/['"(]\/(assets|data|js|styles)\//.test(text)) err(`${f}: root-absolute path found`);
  if (/localhost|127\.0\.0\.1/.test(text)) err(`${f}: refers to localhost`);
  for (const m of text.matchAll(/from '(\.[^']+)'/g)) {
    const target = join(dirname(f), m[1]).replace(/\\/g, '/');
    const rel = target.slice(SITE.length + 1);
    if (!existsExact(rel)) err(`${f}: import not found (or wrong letter case): ${m[1]}`);
  }
}

if (curriculum) {
  const ids = new Set();
  for (const w of curriculum.weeks) {
    if (ids.has(w.id)) err(`Duplicate week id ${w.id}`);
    ids.add(w.id);
    if (!w.published) continue;
    if (w.coverFile) { if (!existsExact(w.coverFile)) err(`${w.id}: coverFile not found: ${w.coverFile}`); }
    else if (w.cover) checkImageBase(w.cover, `${w.id} cover`);
    if (!w.file || !existsExact(w.file)) { err(`${w.id}: week file missing: ${w.file}`); continue; }
    report.weeks.push(checkWeek(w));
  }
}

function checkWeek(entry) {
  const week = readJSON(entry.file);
  const out = { id: entry.id, counts: {}, targets: {}, images: 0 };
  if (!week) return out;
  if (week.id !== entry.id) err(`${entry.id}: id in file is ${week.id}`);
  for (const k of ['contentVersion', 'title', 'goals', 'images', 'words', 'learn', 'speaking', 'games']) if (!(k in week)) err(`${entry.id}: missing "${k}"`);

  const images = week.images || {};
  out.images = Object.keys(images).length;
  for (const [key, img] of Object.entries(images)) {
    if (key !== key.toLowerCase()) err(`${entry.id}: image key must be lower case: ${key}`);
    if (!img.alt) err(`${entry.id}: image ${key} has no alt text`);
    if (/correct|answer/i.test(img.alt || '')) warn(`${entry.id}: alt text of ${key} may give away an answer`);
    if (img.file) { if (!existsExact(img.file)) err(`${entry.id} images.${key}: file not found (or wrong letter case): ${img.file}`); }
    else checkImageBase(img.src, `${entry.id} images.${key}`);
  }
  const used = new Set();
  const needImage = (key, where) => {
    if (!key) return;
    used.add(key);
    if (!images[key]) err(`${entry.id} ${where}: unknown image "${key}"`);
  };

  needImage(week.cover, 'cover');
  (week.words || []).forEach((w, i) => { needImage(w.image, `words[${i}]`); if (!w.phrase || !w.example) err(`${entry.id} words[${i}] needs phrase + example`); });
  if ((week.words || []).length < 12) warn(`${entry.id}: fewer than 12 words`);
  (week.extraWordSets || []).forEach((s) => {
    if (!s.id || !s.title || !Array.isArray(s.words)) err(`${entry.id}: word set needs id, title, words`);
    (s.words || []).forEach((w, i) => { needImage(w.image, `wordSet ${s.id}[${i}]`); if (!w.phrase || !w.example) err(`${entry.id} wordSet ${s.id}[${i}] needs phrase + example`); });
  });
  out.wordSets = 1 + (week.extraWordSets || []).length;
  out.words = (week.words || []).length + (week.extraWordSets || []).reduce((n, s) => n + s.words.length, 0);
  const sw = week.games?.sentenceSwitch || { subjects: [], verbs: [] };
  const hasS = (id) => sw.subjects.some((s) => s.id === id);
  const hasV = (id) => sw.verbs.some((x) => x.id === id);
  (week.examples || []).forEach((x) => {
    needImage(x.image, `examples ${x.id}`);
    if (!hasS(x.subject) || !hasV(x.verb)) err(`${entry.id} examples ${x.id}: unknown subject/verb ${x.subject}/${x.verb}`);
  });
  out.examples = (week.examples || []).length;
  (week.missions || []).forEach((m) => { if (!m.text || !m.check) err(`${entry.id} mission ${m.id}: needs text + check`); });

  (week.learn || []).forEach((t, ti) => {
    needImage(t.image, `learn ${t.id}`);
    if (!t.rule || !t.teacherNote) err(`${entry.id} learn ${t.id}: needs rule + teacherNote`);
    if ((t.examples || []).length < 6) err(`${entry.id} learn ${t.id}: needs at least 6 examples (has ${(t.examples || []).length})`);
    if ((t.practice || []).length !== 2) err(`${entry.id} learn ${t.id}: needs exactly 2 practice steps`);
    (t.examples || []).forEach((ex, i) => {
      needImage(ex.image, `learn ${t.id} example ${i + 1}`);
      if (ex.machine) { if (!hasS(ex.machine.subject) || !hasV(ex.machine.verb)) err(`${entry.id} learn ${t.id} machine: unknown subject/verb`); }
      else if (!ex.text && !ex.q && !ex.rows) err(`${entry.id} learn ${t.id} example ${i + 1}: empty`);
      if (ex.calendar && ex.calendar.length !== 7) err(`${entry.id} learn ${t.id} example ${i + 1}: calendar needs 7 days`);
    });
    (t.practice || []).forEach((p, i) => {
      needImage(p.image, `learn ${t.id} practice ${i + 1}`);
      const idx = (p.answer || '').charCodeAt(0) - 97;
      if (!(idx >= 0 && idx < (p.options || []).length)) err(`${entry.id} learn ${t.id} practice ${i + 1}: answer not in options`);
    });
  });
  out.learnTopics = (week.learn || []).length;
  out.learnExamples = (week.learn || []).reduce((n, t) => n + (t.examples || []).length, 0);

  (week.speaking || []).forEach((c, i) => { needImage(c.image, `speaking[${i}]`); if (!c.question || !c.sample) err(`${entry.id} speaking[${i}] incomplete`); });
  out.speaking = (week.speaking || []).length;

  const g = week.games || {};
  (g.pictureReveal || []).forEach((x, i) => needImage(x.image, `pictureReveal[${i}]`));
  (g.questionDoor || []).forEach((x, i) => {
    needImage(x.image, `questionDoor[${i}]`);
    const idx = (x.answer || '').charCodeAt(0) - 97;
    if (!(idx >= 0 && idx < x.options.length)) err(`${entry.id} questionDoor[${i}]: answer not in options`);
  });
  (g.yesNo || []).forEach((x, i) => {
    needImage(x.image, `yesNo[${i}]`);
    const idx = (x.answer || '').charCodeAt(0) - 97;
    if (!(idx >= 0 && idx < x.options.length)) err(`${entry.id} yesNo[${i}]: answer not in options`);
    if (!x.clue || !x.question || !x.hint) err(`${entry.id} yesNo[${i}]: needs clue, question, hint`);
  });
  if (g.sentenceSwitch) {
    for (const v of g.sentenceSwitch.verbs) if (!v.base || !v.s) err(`${entry.id} sentenceSwitch verb ${v.id}: needs base + s form`);
  }

  // ---------- questions ----------
  if (!week.questionsFile) return out;
  const qfile = dirname(entry.file).replace(/\\/g, '/') + '/' + week.questionsFile;
  const bank = readJSON(qfile);
  if (!bank) return out;
  const qs = bank.questions || [];
  const seen = new Set();
  const byType = {};
  for (const q of qs) {
    if (!q.id || seen.has(q.id)) err(`${entry.id}: duplicate or missing question id ${q.id}`);
    seen.add(q.id);
    const bk = q.bank || q.type;
    byType[bk] = (byType[bk] || 0) + 1;
    out.targets[bk] = out.targets[bk] || {};
    const tKey = q.target + (q.subtarget ? `/${q.subtarget}` : '');
    out.targets[bk][tKey] = (out.targets[bk][tKey] || 0) + 1;
    for (const k of ['type', 'target', 'level', 'hint', 'explain']) if (q[k] === undefined || q[k] === '') err(`${q.id}: missing ${k}`);
    if (!['affirmative', 'negative', 'question', 'mixed', 'vocabulary'].includes(q.target)) err(`${q.id}: unknown target ${q.target}`);
    if (q.image) needImage(q.image, q.id);
    checkQuestion(q, bank, needImage);
  }
  for (const b of bank.banks || []) {
    const n = byType[b.id] || 0;
    out.counts[b.id] = n;
    if (b.expected !== undefined && n !== b.expected) err(`${entry.id} bank ${b.id}: ${n} questions, expected ${b.expected}`);
  }
  out.total = qs.length;
  out.core = qs.filter((q) => !q.bank).length;
  out.extra = qs.length - out.core;
  for (const [k, c] of Object.entries(bank.cards || {})) if (c.image) needImage(c.image, `card ${k}`);
  for (const [k, p] of Object.entries(bank.passages || {})) {
    needImage(p.image, `passage ${k}`);
    const n = words(p.text).length;
    out[`passage_${k}_words`] = n;
    if (n < 30 || n > 45) err(`passage ${k}: ${n} words (needs 30–45)`);
    const count = qs.filter((q) => q.passage === k).length;
    if (count !== 4) err(`passage ${k}: ${count} questions (needs 4)`);
  }
  out.unusedImages = Object.keys(images).filter((k) => !used.has(k));
  return out;
}

function checkQuestion(q, bank, needImage) {
  const optIndex = (id, list) => (typeof id === 'string' ? id.charCodeAt(0) - 97 : -1);
  switch (q.type) {
    case 'mcq':
    case 'dialogue':
    case 'reading': {
      const i = optIndex(q.answer, q.options);
      if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4) err(`${q.id}: needs 2–4 options`);
      else {
        if (!(i >= 0 && i < q.options.length)) err(`${q.id}: answer "${q.answer}" not in options`);
        if (new Set(q.options.map((o) => o.toLowerCase())).size !== q.options.length) err(`${q.id}: options repeat`);
      }
      if (q.type === 'dialogue') {
        const blanks = q.lines.filter((l) => l.text.includes('___')).length;
        if (blanks !== 1) err(`${q.id}: dialogue needs exactly one ___ line`);
        if (q.lines.length < 2 || q.lines.length > 4) err(`${q.id}: dialogue needs 2–4 lines`);
        if (q.card && !bank.cards[q.card]) err(`${q.id}: unknown card ${q.card}`);
      }
      if (q.type === 'mcq' && !q.prompt) err(`${q.id}: prompt missing`);
      if (q.type === 'reading' && !bank.passages[q.passage]) err(`${q.id}: unknown passage ${q.passage}`);
      break;
    }
    case 'jumbled': {
      if (!q.tokens?.length) { err(`${q.id}: no tokens`); break; }
      if (!q.answers?.length) err(`${q.id}: no accepted answers`);
      for (const a of q.answers || []) {
        if (lowerSorted(words(a)) !== lowerSorted(q.tokens)) err(`${q.id}: answer "${a}" does not use exactly the tokens`);
      }
      break;
    }
    case 'fill': {
      if ((q.text.match(/___/g) || []).length !== 1) err(`${q.id}: needs exactly one ___`);
      if (!q.answers?.length) err(`${q.id}: no answers`);
      if (q.pool && !q.pool.includes(q.answers[0])) err(`${q.id}: word box does not contain the answer`);
      if (q.pool && new Set(q.pool).size !== q.pool.length) err(`${q.id}: word box repeats`);
      const filled = q.text.replace('___', q.answers[0]);
      if (!q.explain.includes(filled.replace(/^.*?: /, '').split('? ').pop().replace(/^(Ms\. Rosa|Sam): /, '')) && !q.explain.startsWith(filled)) {
        // explanation should show the full sentence; tolerate dialogue prefixes
        if (!filled.includes(q.explain.replace(/[.?]$/, ''))) warn(`${q.id}: explain "${q.explain}" vs filled "${filled}"`);
      }
      break;
    }
    case 'change': {
      if (!['negative', 'question'].includes(q.task)) err(`${q.id}: task must be negative or question`);
      if (!q.from || !q.answers?.length) err(`${q.id}: needs from + answers`);
      if (q.task === 'question' && !q.answers[0].endsWith('?')) err(`${q.id}: question answer must end with ?`);
      break;
    }
    case 'fix': {
      if (!(q.wrong >= 0 && q.wrong < q.words.length)) err(`${q.id}: wrong index out of range`);
      const i = optIndex(q.fix);
      if (!(i >= 0 && i < q.fixes.length)) { err(`${q.id}: fix not in options`); break; }
      const fixed = q.words.map((w, k) => (k === q.wrong ? q.fixes[i] + (w.match(/[.?!]$/)?.[0] || '') : w)).join(' ');
      if (fixed !== q.explain) err(`${q.id}: fixed sentence "${fixed}" ≠ explain "${q.explain}"`);
      break;
    }
    case 'decide': {
      if (typeof q.answer !== 'boolean') err(`${q.id}: answer must be true/false`);
      if (!bank.cards[q.card]) err(`${q.id}: unknown card ${q.card}`);
      break;
    }
    default:
      err(`${q.id}: unknown type ${q.type}`);
  }
}

// ---------- spec distribution checks for Week 1 ----------
const w1 = report.weeks.find((w) => w.id === 'week-01');
if (w1) {
  const t = w1.targets;
  const expect = (type, target, n) => { const got = (t[type] || {})[target] || 0; if (got !== n) err(`week-01 ${type}/${target}: ${got} (spec ${n})`); };
  expect('mcq', 'affirmative', 18); expect('mcq', 'negative', 18); expect('mcq', 'question', 18); expect('mcq', 'mixed', 6);
  expect('jumbled', 'affirmative', 12); expect('jumbled', 'negative', 12);
  const jq = Object.entries(t.jumbled || {}).filter(([k]) => k.startsWith('question')).reduce((n, [, v]) => n + v, 0);
  if (jq !== 12) err(`week-01 jumbled questions: ${jq} (spec 12)`);
  if (((t.jumbled || {})['question/wh'] || 0) < 4) err('week-01 jumbled: needs at least 4 WH questions');
  expect('fill', 'affirmative', 10); expect('fill', 'negative', 10);
  const fq = Object.entries(t.fill || {}).filter(([k]) => k.startsWith('question')).reduce((n, [, v]) => n + v, 0);
  if (fq !== 10) err(`week-01 fill questions: ${fq} (spec 10)`);
  expect('change', 'negative', 9); expect('change', 'question', 9);
  expect('fix', 'affirmative', 6); expect('fix', 'negative', 6); expect('fix', 'question', 6);
  if (w1.core !== 204) err(`week-01 core scored questions: ${w1.core} (spec 204)`);
  if (w1.speaking < 12) err(`week-01 speaking cards: ${w1.speaking} (spec ≥ 12)`);
  if (w1.learnTopics < 12) err(`week-01 learn topics: ${w1.learnTopics} (spec ≥ 12)`);
  const bank = readJSON('data/weeks/week-01/questions.json');
  const dec = bank.questions.filter((q) => q.type === 'decide' && !q.bank);
  const trues = dec.filter((q) => q.answer === true).length;
  if (trues !== 9 || dec.length - trues !== 9) err(`week-01 decide: ${trues} true / ${dec.length - trues} false (spec 9/9)`);
  w1.decide = { true: trues, false: dec.length - trues };
}

for (const w of report.weeks) {
  console.log(`\n${w.id}: ${w.total ?? 0} scored questions, ${w.speaking ?? 0} speaking cards, ${w.learnTopics ?? 0} learn topics (${w.learnExamples ?? 0} examples), ${w.images} images`);
  for (const [type, n] of Object.entries(w.counts)) console.log(`  ${type.padEnd(9)} ${String(n).padStart(3)}  ${JSON.stringify(w.targets[type] || {})}`);
  if (w.unusedImages?.length) console.log(`  unused images: ${w.unusedImages.join(', ')}`);
}
if (warnings.length) console.log(`\nWarnings (${warnings.length}):\n  ` + warnings.join('\n  '));
if (reportIdx >= 0) writeFileSync(args[reportIdx + 1], JSON.stringify({ ...report, errors, warnings }, null, 2));
if (errors.length) {
  console.error(`\nErrors (${errors.length}):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log('\nContent check passed.');
