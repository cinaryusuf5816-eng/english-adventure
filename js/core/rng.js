// Small seeded random generator so shuffles are repeatable inside a session.
export function makeRng(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function newSeed() {
  return Math.floor(Math.random() * 2 ** 31);
}

export function shuffled(list, rng) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Shuffle, but never return the original order when there is another order. */
export function shuffledNotSame(list, rng) {
  if (list.length < 2) return list.slice();
  for (let tries = 0; tries < 6; tries++) {
    const s = shuffled(list, rng);
    if (s.some((v, i) => v !== list[i])) return s;
  }
  return list.slice(1).concat(list[0]);
}

/** Stable numeric hash of a string (for per-question seeds). */
export function hashString(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
