// Badges: earned when a section of the week is complete. A short celebration shows once per badge.
// Saved with the week progress (this browser only). Nothing is locked by badges.
import { h, button, picture } from './ui.js';
import { summary, getProgress } from './progress.js';
import { readJSON, writeJSON, storageKey } from './storage.js';

export const BADGES = {
  words: { name: 'Word Finder', icon: 'words', text: 'You learned all the words.' },
  learn: { name: 'Rule Reader', icon: 'learn', text: 'You finished all the lessons.' },
  examples: { name: 'Change Master', icon: 'shuffle', text: 'You watched the sentences change.' },
  practise: { name: 'Practice Pro', icon: 'practise', text: 'You finished every practice activity.' },
  play: { name: 'Game Explorer', icon: 'play', text: 'You played every game.' },
  challenge: { name: 'Challenge Champion', icon: 'star', text: 'You finished the challenge.' },
  speak: { name: 'Brave Speaker', icon: 'speak', text: 'You answered the speaking cards.' }
};

const seenKey = (weekId) => storageKey(weekId, 'badges-seen');

/** Badges of a week: [{id, name, earned, ...}] */
export function weekBadges(data) {
  const s = summary(data);
  return s.rows.filter((r) => BADGES[r.id]).map((r) => ({ id: r.id, ...BADGES[r.id], earned: r.complete }));
}

/** Medal picture: assets/images/badges/<section>. Not earned yet = grey and faded. */
export function badgeEl(b, { small = false, big = false } = {}) {
  return h('div', { class: `badge${b.earned ? ' is-earned' : ''}${small ? ' is-small' : ''}${big ? ' is-big' : ''}`, role: 'img', 'aria-label': `${b.name}: ${b.earned ? 'earned' : 'not yet'}` },
    h('span', { class: 'badge-medal', 'aria-hidden': 'true' },
      picture({ src: `assets/images/badges/${b.id}`, w: 1400, h: 1400, alt: '' }, { className: 'badge-img', decorative: true, sizes: big ? '200px' : '120px', eager: true }),
      b.earned ? null : h('span', { class: 'badge-lock' }, '?')),
    h('span', { class: 'badge-name' }, b.name));
}

/** Show a celebration for badges that were earned since the last check. */
export function celebrateNewBadges(data) {
  if (!data) return;
  const earned = weekBadges(data).filter((b) => b.earned);
  const seen = readJSON(seenKey(data.week.id), []) || [];
  const fresh = earned.filter((b) => !seen.includes(b.id));
  if (!fresh.length) return;
  writeJSON(seenKey(data.week.id), [...seen, ...fresh.map((b) => b.id)]);
  showCelebration(fresh);
}

function showCelebration(list) {
  document.querySelector('.celebrate')?.remove();
  const opener = document.activeElement;
  const box = h('div', { class: 'celebrate', role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'cel-title' },
    h('div', { class: 'celebrate-card' },
      h('div', { class: 'confetti', 'aria-hidden': 'true' }, h('div', { class: 'rays', 'aria-hidden': 'true' }), Array.from({ length: 24 }, (_, i) => h('span', { style: `--i:${i}` }))),
      h('p', { class: 'eyebrow' }, list.length > 1 ? 'New badges!' : 'New badge!'),
      h('h2', { id: 'cel-title' }, list.map((b) => b.name).join(' + ')),
      h('div', { class: 'badge-row' }, list.map((b) => badgeEl({ ...b, earned: true }, { big: list.length < 3 }))),
      h('p', {}, list[0].text, ' Well done, Explorer!')));
  const close = button('Great!', { kind: 'primary', onClick: () => { box.remove(); if (opener && document.contains(opener)) opener.focus(); } });
  box.firstChild.append(close);
  box.addEventListener('keydown', (e) => { if (e.key === 'Escape') close.click(); });
  document.body.append(box);
  close.focus();
  window.setTimeout(() => { if (document.contains(box)) box.classList.add('fade'); }, 6000);
}

export function hasAnyProgress(weekId) {
  const p = getProgress(weekId);
  return Object.values(p).some((v) => Array.isArray(v) && v.length);
}
