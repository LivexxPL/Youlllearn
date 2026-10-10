/**
 * Checking typed answers.
 *
 * Design goals (see docs/LEARNING_METHODOLOGY.md):
 *  - be strict about things that change meaning or grammar (articles, short
 *    function words, Japanese mora such as っ and long vowels),
 *  - be forgiving about things that are mostly typing mechanics (missing
 *    accents on a phone keyboard, one-letter typos in long words),
 *  - always say *what* was off, so "almost" answers still teach something.
 */
import { canonicalKana, looksLikeRomaji, rubyToKana, stripRuby, toHiragana, kataToHira, isKatakana } from './kana';

export type AnswerLang = 'es' | 'de' | 'ja' | 'pl';
export type Verdict = 'correct' | 'almost' | 'wrong';
export type AnswerIssue = 'accent' | 'typo' | 'variant' | 'romaji' | 'script' | 'other-word' | 'empty';

export interface CheckOptions {
  lang: AnswerLang;
  /** Disable accent and typo tolerance (used for grammar forms like articles). */
  strict?: boolean;
  /**
   * Normalised words/phrases known in the course. Typing one of them when it is
   * not an accepted answer is a real mistake, never a "typo" (pero ≠ perro).
   */
  lexicon?: ReadonlySet<string>;
  /** Japanese: authored romaji of the expected answer, accepted as typed (e.g. "watashi wa gakusei desu"). */
  romaji?: readonly string[];
}

export interface CheckResult {
  verdict: Verdict;
  /** The accepted answer closest to the input (for feedback). */
  expected: string;
  issues: AnswerIssue[];
}

const PUNCT_RE = /[.,!?¿¡;:"'“”„«»‚‘’…()[\]{}–—\-/\\。、！？「」『』（）・〜~*]/g;

export function normalize(text: string, lang: AnswerLang): string {
  let s = text.normalize('NFC').trim();
  if (lang === 'ja') {
    // \s also matches the ideographic space (U+3000).
    s = stripRuby(s).replace(/\s+/g, '');
    s = s.replace(PUNCT_RE, '');
    return canonicalKana(s.toLowerCase());
  }
  s = s.toLocaleLowerCase(lang === 'pl' ? 'pl' : lang);
  s = s.replace(/[’‘`´]/g, "'");
  s = s.replace(PUNCT_RE, ' ');
  return s.replace(/\s+/g, ' ').trim();
}

/** Removes accents/diacritics (á→a, ü→u, ł→l, ß→ss). */
export function foldDiacritics(text: string): string {
  return text
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'L')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .normalize('NFC');
}

/** German typewriter spellings that are acceptable alternatives (ä→ae, ß→ss). */
export function germanTransliteration(text: string): string {
  return text.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
}

/** Optimal string alignment distance (Damerau–Levenshtein with adjacent swaps). */
export function editDistance(a: string, b: string): number {
  const A = [...a];
  const B = [...b];
  const d: number[][] = Array.from({ length: A.length + 1 }, () => new Array<number>(B.length + 1).fill(0));
  for (let i = 0; i <= A.length; i++) d[i][0] = i;
  for (let j = 0; j <= B.length; j++) d[0][j] = j;
  for (let i = 1; i <= A.length; i++) {
    for (let j = 1; j <= B.length; j++) {
      const cost = A[i - 1] === B[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && A[i - 1] === B[j - 2] && A[i - 2] === B[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[A.length][B.length];
}

function typoBudget(word: string): number {
  const n = [...word].length;
  if (n <= 3) return 0;
  if (n <= 7) return 1;
  return 2;
}

type WordVerdict = 'exact' | 'accent' | 'typo' | 'wrong';

function compareWords(inp: string, exp: string, strict: boolean): WordVerdict {
  if (inp === exp) return 'exact';
  if (strict) return 'wrong';
  const fi = foldDiacritics(inp);
  const fe = foldDiacritics(exp);
  if (fi === fe) return 'accent';
  if (editDistance(fi, fe) <= typoBudget(fe)) return 'typo';
  return 'wrong';
}

function rank(v: Verdict): number {
  return v === 'correct' ? 2 : v === 'almost' ? 1 : 0;
}

export function checkAnswer(input: string, accepted: readonly string[], opts: CheckOptions): CheckResult {
  const lang = opts.lang;
  const first = accepted[0] ?? '';
  const inp = normalize(input, lang);
  if (!inp) return { verdict: 'wrong', expected: first, issues: ['empty'] };

  if (lang === 'ja') return checkJapanese(input, inp, accepted, opts.romaji ?? []);

  let best: CheckResult = { verdict: 'wrong', expected: first, issues: [] };
  for (const candidate of accepted) {
    const exp = normalize(candidate, lang);
    if (!exp) continue;
    if (inp === exp) return { verdict: 'correct', expected: candidate, issues: [] };

    if (lang === 'de' && germanTransliteration(inp) === germanTransliteration(exp)) {
      return { verdict: 'correct', expected: candidate, issues: ['variant'] };
    }

    const r = compareSequence(inp, exp, opts);
    if (rank(r.verdict) > rank(best.verdict)) best = { ...r, expected: candidate };
  }

  // Typing a different known word is a genuine mistake, not a typo.
  if (best.verdict === 'almost' && best.issues.includes('typo') && opts.lexicon?.has(inp)) {
    return { verdict: 'wrong', expected: best.expected, issues: ['other-word'] };
  }
  return best;
}

function compareSequence(inp: string, exp: string, opts: CheckOptions): Omit<CheckResult, 'expected'> {
  const iw = inp.split(' ');
  const ew = exp.split(' ');
  const strict = Boolean(opts.strict);
  if (iw.length !== ew.length) {
    // Allow a missing/extra space inside an otherwise identical answer ("buenos dias" vs "buenosdias").
    if (!strict && foldDiacritics(iw.join('')) === foldDiacritics(ew.join(''))) {
      return { verdict: 'almost', issues: ['typo'] };
    }
    return { verdict: 'wrong', issues: [] };
  }
  const issues = new Set<AnswerIssue>();
  for (let i = 0; i < ew.length; i++) {
    const v = compareWords(iw[i], ew[i], strict);
    if (v === 'wrong') return { verdict: 'wrong', issues: [] };
    if (v === 'accent') issues.add('accent');
    if (v === 'typo') issues.add('typo');
  }
  return issues.size === 0 ? { verdict: 'correct', issues: [] } : { verdict: 'almost', issues: [...issues] };
}

/** Romaji compared loosely: case, spaces, punctuation, hyphens and apostrophes do not matter. */
function normalizeRomaji(text: string): string {
  return text.normalize('NFC').toLowerCase().replace(/[\s.,!?;:'’"\-…]+/g, '');
}

/**
 * Kana as pronounced: the particles は, を and へ at the end of a chunk are said "wa", "o" and
 * "e", which is how learners type them in romaji (watashi wa, konnichiwa, gakkou e).
 */
export function particlesAsSpoken(kana: string): string {
  const spoken: Record<string, string> = { は: 'わ', を: 'お', へ: 'え' };
  return kana.replace(/[はをへ](?=[\s、。！？!?.,]|$)/g, (p) => spoken[p]);
}

function checkJapanese(raw: string, inp: string, accepted: readonly string[], romajiAnswers: readonly string[]): CheckResult {
  const first = accepted[0] ?? '';
  const romaji = looksLikeRomaji(raw);
  // Apostrophes are kept: n' separates ん from a following vowel or y (hon'ya = ほんや).
  const inputKana = romaji ? canonicalKana(toHiragana(raw.replace(/’/g, "'").replace(/[\s.,!?-]+/g, (m) => (m.includes('-') ? '-' : '')))) : inp;
  const rawHasKatakana = [...raw].some((ch) => isKatakana(ch) && ch !== 'ー');

  if (romaji) {
    const typed = normalizeRomaji(raw);
    if (typed && romajiAnswers.some((r) => normalizeRomaji(r) === typed)) {
      return { verdict: 'correct', expected: first, issues: ['romaji'] };
    }
  }

  for (const candidate of accepted) {
    const exp = normalize(candidate, 'ja');
    if (!exp) continue;
    const spoken = romaji ? normalize(particlesAsSpoken(rubyToKana(candidate)), 'ja') : exp;
    if (inputKana === exp || inputKana === spoken) {
      const issues: AnswerIssue[] = romaji ? ['romaji'] : [];
      // Hiragana typed for a katakana word: understandable, but the script matters.
      const expectedKatakana = [...stripRuby(candidate)].some((ch) => isKatakana(ch) && ch !== 'ー');
      if (!romaji && expectedKatakana && !rawHasKatakana && kataToHira(stripRuby(candidate)) !== stripRuby(candidate)) {
        return { verdict: 'almost', expected: candidate, issues: ['script'] };
      }
      return { verdict: 'correct', expected: candidate, issues };
    }
  }
  return { verdict: 'wrong', expected: first, issues: [] };
}

/** Lexicon helper: normalised forms of the given strings. */
export function buildLexicon(words: Iterable<string>, lang: AnswerLang): Set<string> {
  const set = new Set<string>();
  for (const w of words) {
    const n = normalize(w, lang);
    if (n) set.add(n);
  }
  return set;
}
