// Safe wrapper around localStorage.
// - Keys: <appId>:v<version>:<scope...>  (never touches other sites' keys, never clear())
// - Works when storage is blocked, full or holds broken JSON: the lesson keeps running,
//   and the app can show "Saving is off on this device".

let prefix = 'eemc:v1:';
let available = null;
const memory = new Map(); // fallback so the current page still works without storage
const listeners = new Set();
let lastProblem = null;

export function configureStorage({ appId, version }) {
  prefix = `${appId}:v${version}:`;
}

export function storageKey(...parts) {
  return prefix + parts.join(':');
}

function report(problem) {
  lastProblem = problem;
  listeners.forEach((fn) => fn(problem));
}

export function onStorageProblem(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function storageStatus() {
  return { available: isAvailable(), problem: lastProblem };
}

export function isAvailable() {
  if (available !== null) return available;
  try {
    const k = prefix + '__test__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    available = true;
  } catch {
    available = false;
    report('unavailable');
  }
  return available;
}

export function readJSON(key, fallback = null) {
  // Values written in this page are kept in memory too, so a full or blocked storage
  // never stops the lesson.
  if (memory.has(key)) return structuredClone(memory.get(key));
  if (!isAvailable()) return fallback;
  let raw;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    report('unavailable');
    return fallback;
  }
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    // Broken data: remove only this key and carry on.
    try { window.localStorage.removeItem(key); } catch { /* ignore */ }
    report('corrupt');
    return fallback;
  }
}

export function writeJSON(key, value) {
  memory.set(key, structuredClone(value));
  if (!isAvailable()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    report(err && err.name === 'QuotaExceededError' ? 'full' : 'unavailable');
    return false;
  }
}

export function removeKey(key) {
  memory.delete(key);
  if (!isAvailable()) return;
  try { window.localStorage.removeItem(key); } catch { /* ignore */ }
}

/** Remove only keys under this app's prefix + the given scope. */
export function removeScope(...parts) {
  const scope = storageKey(...parts);
  for (const k of [...memory.keys()]) if (k.startsWith(scope)) memory.delete(k);
  if (!isAvailable()) return;
  try {
    const doomed = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(scope)) doomed.push(k);
    }
    doomed.forEach((k) => window.localStorage.removeItem(k));
  } catch { /* ignore */ }
}
