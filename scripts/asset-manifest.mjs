// Builds ASSET_MANIFEST.json from the week data + the image production log (scripts/image-log.json).
import { readFileSync, writeFileSync, statSync } from 'node:fs';
const week = JSON.parse(readFileSync('site/data/weeks/week-01/week.json', 'utf8'));
const qs = JSON.parse(readFileSync('site/data/weeks/week-01/questions.json', 'utf8'));
const log = JSON.parse(readFileSync('scripts/image-log.json', 'utf8'));
const usage = {};
const add = (key, where) => { if (!key) return; (usage[key] ||= new Set()).add(where); };
add(week.cover, 'Week page cover');
week.words.forEach((w) => add(w.image, 'Words'));
week.learn.forEach((t) => { add(t.image, `Learn: ${t.title}`); t.examples.forEach((e) => add(e.image, `Learn: ${t.title}`)); t.practice.forEach((p) => add(p.image, `Learn: ${t.title}`)); });
week.speaking.forEach((s) => add(s.image, 'Speak'));
week.games.pictureReveal.forEach((g) => add(g.image, 'Play: Picture Reveal'));
week.games.questionDoor.forEach((g) => add(g.image, 'Play: Question Door'));
qs.questions.forEach((q) => add(q.image, `Practise: ${q.type}`));
Object.values(qs.cards).forEach((c) => add(c.image, 'Practise: clue cards (decide / dialogue)'));
Object.values(qs.passages).forEach((p) => add(p.image, 'Practise: reading'));
const files = [];
for (const entry of log.images) {
  const key = entry.key;
  const def = week.images[key] || { src: entry.site, alt: entry.alt };
  const src = entry.site ? entry.site : def.src;
  const sizes = ['-lg.webp', '-sm.webp'].map((s) => ({ file: `site/${src}${s}`, bytes: statSync(`site/${src}${s}`).size }));
  files.push({
    key,
    files: sizes,
    original: `raw-images/${entry.folder}/${entry.raw}`,
    topic: entry.topic,
    altText: entry.site ? entry.alt : def.alt,
    usedOn: entry.site ? [entry.usedOn] : [...(usage[key] || [])].sort(),
    source: log.source,
    canvaMediaId: entry.mediaId,
    canvaAccountConnection: entry.account,
    generatedOn: log.date,
    prompt: entry.prompt,
    termsOfUse: log.terms,
    verification: entry.check
  });
}
writeFileSync('ASSET_MANIFEST.json', JSON.stringify({ generatedBy: 'scripts/asset-manifest.mjs', count: files.length, notes: log.notes, images: files }, null, 2) + '\n');
console.log(`ASSET_MANIFEST.json: ${files.length} images`);
