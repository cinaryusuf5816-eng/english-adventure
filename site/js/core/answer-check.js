// Answer checking for typed and built answers.
// Pure functions (no DOM) so they can be unit-tested with Node.
//
// Rules (from the spec):
// - trim, collapse spaces, ignore letter case, treat curly and straight apostrophes the same;
// - "do not" = "don't", "does not" = "doesn't" — but don't ≠ doesn't;
// - final . ? ! and commas are not graded;
// - "dont" / "doesnt" (missing apostrophe) is NOT accepted silently: we tell the learner;
// - no fuzzy matching: other spelling mistakes are wrong.

const APOSTROPHES = /[‘’ʼ`´′]/g;

export function normalizeApostrophes(text) {
  return String(text ?? '').replace(APOSTROPHES, "'");
}

/** Canonical form used for comparison. */
export function canonical(text) {
  return normalizeApostrophes(text)
    .toLowerCase()
    .replace(/[.!?]+/g, ' ')
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\bdo not\b/g, "don't")
    .replace(/\bdoes not\b/g, "doesn't");
}

const MISSING_APOSTROPHE = [
  { re: /\bdont\b/, fix: "don't" },
  { re: /\bdoesnt\b/, fix: "doesn't" }
];

/**
 * Check a learner answer against accepted answers.
 * @returns {{correct:boolean, matched:string|null, notes:string[]}}
 */
export function checkText(input, accepted) {
  const raw = normalizeApostrophes(input).trim();
  const notes = [];
  if (!raw) return { correct: false, empty: true, matched: null, notes };

  const given = canonical(raw);
  const match = accepted.find((a) => canonical(a) === given) ?? null;

  if (!match) {
    for (const m of MISSING_APOSTROPHE) {
      if (m.re.test(given)) {
        const repaired = given.replace(m.re, m.fix);
        if (accepted.some((a) => canonical(a) === repaired)) {
          notes.push(`Almost! Write ${m.fix} with ' .`);
        }
      }
    }
    return { correct: false, empty: false, matched: null, notes };
  }

  // Gentle notes (do not change the result).
  if (/(^|\s)i(\s|$|')/.test(raw)) notes.push('Tip: write I with a big letter.');
  else if (/^[a-z]/.test(raw) && /^[A-Z]/.test(match)) notes.push('Tip: start with a big letter.');
  return { correct: true, empty: false, matched: match, notes };
}

/** Join token texts the way the learner built them. */
export function joinTokens(tokens) {
  return tokens.join(' ');
}

/** Accept any of the accepted orders for a jumbled sentence. */
export function checkJumbled(tokenTexts, acceptedAnswers) {
  if (!tokenTexts.length) return { correct: false, empty: true, matched: null, notes: [] };
  const res = checkText(joinTokens(tokenTexts), acceptedAnswers);
  res.notes = []; // capitals come from the tokens, so no tips here
  return res;
}
