// Optional "Listen" helper using the browser's own voices.
// - Never starts by itself.
// - Shown only when the device has an English voice.
// - A new reading stops the old one; leaving a screen stops it too.

let englishVoice = null;
let checked = false;
const waiters = new Set();

function pickVoice() {
  const synth = window.speechSynthesis;
  if (!synth) return null;
  const voices = synth.getVoices() || [];
  return voices.find((v) => /^en[-_](GB|US)/i.test(v.lang) && v.localService) ||
    voices.find((v) => /^en[-_](GB|US)/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) || null;
}

export function initSpeech() {
  if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') {
    checked = true;
    return;
  }
  const update = () => {
    englishVoice = pickVoice();
    checked = true;
    waiters.forEach((fn) => fn(!!englishVoice));
  };
  update();
  window.speechSynthesis.addEventListener?.('voiceschanged', update);
}

export function speechAvailable() {
  return !!englishVoice;
}

/** Calls fn(available) now and whenever voices change. Returns unsubscribe. */
export function onSpeechReady(fn) {
  if (checked) fn(!!englishVoice);
  waiters.add(fn);
  return () => waiters.delete(fn);
}

// Words that browser voices often say in the wrong way for this course.
// Only the SOUND changes; the text on screen stays the same.
// 'read' is always Present Simple here, so it must sound like 'reed' (not 'red').
const SAY_AS = [
  [/\bread\b/gi, 'reed']
];

export function forSpeech(text) {
  let out = String(text).replace(/\*\*|~~/g, '');
  for (const [re, say] of SAY_AS) out = out.replace(re, say);
  return out;
}

export function speak(text) {
  if (!englishVoice) return false;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(forSpeech(text));
    u.voice = englishVoice;
    u.lang = englishVoice.lang;
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeech() {
  try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
}
