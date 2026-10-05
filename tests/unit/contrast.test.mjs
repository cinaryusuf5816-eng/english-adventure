// Measures WCAG contrast for the text / background pairs the site uses (from tokens.css).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../../site/styles/tokens.css', import.meta.url), 'utf8');
const tok = Object.fromEntries([...css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));

function lum(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function ratio(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

// [text, background, minimum, where]
const PAIRS = [
  ['ink', 'cream-50', 4.5, 'body text on cards'],
  ['ink-soft', 'cream-50', 4.5, 'muted text on cards'],
  ['ink-soft', 'cream-100', 4.5, 'muted text on light panels'],
  ['navy-900', 'cream-50', 4.5, 'headings'],
  ['teal-700', 'cream-50', 4.5, 'links, small labels'],
  ['teal-700', 'teal-100', 4.5, 'label chips'],
  ['green-700', 'green-100', 4.5, 'correct feedback'],
  ['gold-800', 'gold-100', 4.5, 'hint / try-again feedback'],
  ['coral-700', 'coral-100', 4.5, 'wrong option, highlights'],
  ['violet-700', 'violet-100', 4.5, 'shown answer'],
  ['on-dark', 'navy-900', 4.5, 'text on the dark frame'],
  ['on-dark-soft', 'navy-900', 4.5, 'soft text on the dark frame'],
  ['gold-400', 'navy-900', 4.5, 'gold text on dark (labels, clock)'],
  ['navy-950', 'gold-400', 4.5, 'text on gold buttons']
];

const lines = [];
for (const [fg, bg, min, where] of PAIRS) {
  test(`contrast ${fg} on ${bg} (${where}) ≥ ${min}`, () => {
    assert.ok(tok[fg] && tok[bg], `missing token ${fg}/${bg}`);
    const r = ratio(tok[fg], tok[bg]);
    lines.push(`${where}: ${r.toFixed(2)}:1`);
    assert.ok(r >= min, `${r.toFixed(2)} < ${min}`);
  });
}
test('white on teal-700 primary button ≥ 4.5', () => assert.ok(ratio('#ffffff', tok['teal-700']) >= 4.5));
test.after(() => console.log('\n' + lines.join('\n')));
