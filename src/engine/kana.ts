/**
 * Japanese script helpers: kana tables, romaji <-> kana conversion and
 * furigana markup ({漢字|かんじ}).
 *
 * Romaji convention used in the UI: Hepburn spelling that maps 1:1 to kana
 * typing (し = shi, つ = tsu, おう = ou, ー doubles the vowel: コーヒー = koohii).
 * This keeps displayed romaji identical to what a learner types on a
 * Japanese keyboard, which eases the later switch to an IME.
 */

const HIRA_START = 0x3041;
const HIRA_END = 0x3096;
const KATA_START = 0x30a1;
const KATA_END = 0x30f6;

export interface KanaCell {
  romaji: string;
  hira: string;
  kata: string;
}

/** Basic kana chart (gojūon) — rows in textbook order; `null` marks empty cells. */
export const GOJUON: (KanaCell | null)[][] = [
  row(['a', 'あ', 'ア'], ['i', 'い', 'イ'], ['u', 'う', 'ウ'], ['e', 'え', 'エ'], ['o', 'お', 'オ']),
  row(['ka', 'か', 'カ'], ['ki', 'き', 'キ'], ['ku', 'く', 'ク'], ['ke', 'け', 'ケ'], ['ko', 'こ', 'コ']),
  row(['sa', 'さ', 'サ'], ['shi', 'し', 'シ'], ['su', 'す', 'ス'], ['se', 'せ', 'セ'], ['so', 'そ', 'ソ']),
  row(['ta', 'た', 'タ'], ['chi', 'ち', 'チ'], ['tsu', 'つ', 'ツ'], ['te', 'て', 'テ'], ['to', 'と', 'ト']),
  row(['na', 'な', 'ナ'], ['ni', 'に', 'ニ'], ['nu', 'ぬ', 'ヌ'], ['ne', 'ね', 'ネ'], ['no', 'の', 'ノ']),
  row(['ha', 'は', 'ハ'], ['hi', 'ひ', 'ヒ'], ['fu', 'ふ', 'フ'], ['he', 'へ', 'ヘ'], ['ho', 'ほ', 'ホ']),
  row(['ma', 'ま', 'マ'], ['mi', 'み', 'ミ'], ['mu', 'む', 'ム'], ['me', 'め', 'メ'], ['mo', 'も', 'モ']),
  row(['ya', 'や', 'ヤ'], null, ['yu', 'ゆ', 'ユ'], null, ['yo', 'よ', 'ヨ']),
  row(['ra', 'ら', 'ラ'], ['ri', 'り', 'リ'], ['ru', 'る', 'ル'], ['re', 'れ', 'レ'], ['ro', 'ろ', 'ロ']),
  row(['wa', 'わ', 'ワ'], null, null, null, ['wo', 'を', 'ヲ']),
  row(['n', 'ん', 'ン'], null, null, null, null),
];

export const DAKUTEN: (KanaCell | null)[][] = [
  row(['ga', 'が', 'ガ'], ['gi', 'ぎ', 'ギ'], ['gu', 'ぐ', 'グ'], ['ge', 'げ', 'ゲ'], ['go', 'ご', 'ゴ']),
  row(['za', 'ざ', 'ザ'], ['ji', 'じ', 'ジ'], ['zu', 'ず', 'ズ'], ['ze', 'ぜ', 'ゼ'], ['zo', 'ぞ', 'ゾ']),
  row(['da', 'だ', 'ダ'], ['ji', 'ぢ', 'ヂ'], ['zu', 'づ', 'ヅ'], ['de', 'で', 'デ'], ['do', 'ど', 'ド']),
  row(['ba', 'ば', 'バ'], ['bi', 'び', 'ビ'], ['bu', 'ぶ', 'ブ'], ['be', 'べ', 'ベ'], ['bo', 'ぼ', 'ボ']),
  row(['pa', 'ぱ', 'パ'], ['pi', 'ぴ', 'ピ'], ['pu', 'ぷ', 'プ'], ['pe', 'ぺ', 'ペ'], ['po', 'ぽ', 'ポ']),
];

export const YOON: KanaCell[][] = (
  [
    [['kya', 'きゃ'], ['kyu', 'きゅ'], ['kyo', 'きょ']],
    [['sha', 'しゃ'], ['shu', 'しゅ'], ['sho', 'しょ']],
    [['cha', 'ちゃ'], ['chu', 'ちゅ'], ['cho', 'ちょ']],
    [['nya', 'にゃ'], ['nyu', 'にゅ'], ['nyo', 'にょ']],
    [['hya', 'ひゃ'], ['hyu', 'ひゅ'], ['hyo', 'ひょ']],
    [['mya', 'みゃ'], ['myu', 'みゅ'], ['myo', 'みょ']],
    [['rya', 'りゃ'], ['ryu', 'りゅ'], ['ryo', 'りょ']],
    [['gya', 'ぎゃ'], ['gyu', 'ぎゅ'], ['gyo', 'ぎょ']],
    [['ja', 'じゃ'], ['ju', 'じゅ'], ['jo', 'じょ']],
    [['bya', 'びゃ'], ['byu', 'びゅ'], ['byo', 'びょ']],
    [['pya', 'ぴゃ'], ['pyu', 'ぴゅ'], ['pyo', 'ぴょ']],
  ] as [string, string][][]
).map((r) => r.map(([romaji, hira]) => ({ romaji, hira, kata: toKatakana(hira) })));

function row(...cells: ([string, string, string] | null)[]): (KanaCell | null)[] {
  return cells.map((c) => (c ? { romaji: c[0], hira: c[1], kata: c[2] } : null));
}

// ---------------------------------------------------------------------------
// Character classes


export function isHiragana(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return c >= HIRA_START && c <= HIRA_END;
}

export function isKatakana(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return (c >= KATA_START && c <= KATA_END) || ch === 'ー';
}

export function isKana(ch: string): boolean {
  return isHiragana(ch) || isKatakana(ch);
}

export function isKanji(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return (c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3400 && c <= 0x4dbf) || ch === '々';
}

export function hasKanji(text: string): boolean {
  return [...text].some(isKanji);
}

export function hasJapanese(text: string): boolean {
  return [...text].some((ch) => isKana(ch) || isKanji(ch));
}

export function kataToHira(text: string): string {
  return [...text]
    .map((ch) => {
      const c = ch.codePointAt(0) ?? 0;
      return c >= KATA_START && c <= KATA_END ? String.fromCodePoint(c - 0x60) : ch;
    })
    .join('');
}

export function toKatakana(text: string): string {
  return [...text]
    .map((ch) => {
      const c = ch.codePointAt(0) ?? 0;
      return c >= HIRA_START && c <= HIRA_END ? String.fromCodePoint(c + 0x60) : ch;
    })
    .join('');
}

// ---------------------------------------------------------------------------
// Furigana markup: {漢字|かんじ}

export interface RubySegment {
  base: string;
  ruby?: string;
}

const RUBY_RE = /\{([^|{}]+)\|([^|{}]+)\}/g;

export function parseRuby(text: string): RubySegment[] {
  const out: RubySegment[] = [];
  let last = 0;
  for (const m of text.matchAll(RUBY_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ base: text.slice(last, idx) });
    out.push({ base: m[1], ruby: m[2] });
    last = idx + m[0].length;
  }
  if (last < text.length) out.push({ base: text.slice(last) });
  return out;
}

/** Text as written (kanji kept, markup removed). */
export function stripRuby(text: string): string {
  return text.replace(RUBY_RE, '$1');
}

/** Text with every annotated kanji replaced by its kana reading. */
export function rubyToKana(text: string): string {
  return text.replace(RUBY_RE, '$2');
}

// ---------------------------------------------------------------------------
// Kana -> romaji

const BASE: Record<string, string> = {};
for (const r of [...GOJUON, ...DAKUTEN]) for (const c of r) if (c) BASE[c.hira] = c.romaji;
BASE['ぢ'] = 'ji';
BASE['づ'] = 'zu';
BASE['を'] = 'wo';
BASE['ゔ'] = 'vu';

const SMALL_Y: Record<string, string> = { ゃ: 'a', ゅ: 'u', ょ: 'o' };
const SMALL_VOWEL: Record<string, string> = { ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o' };

function yoonRomaji(base: string, small: string): string {
  const r = BASE[base];
  if (!r) return '';
  const v = SMALL_Y[small];
  if (r === 'shi') return 'sh' + v;
  if (r === 'chi') return 'ch' + v;
  if (r === 'ji') return 'j' + v;
  return r.slice(0, -1) + 'y' + v;
}

function specialSmallVowel(base: string, small: string): string | null {
  // Loanword combinations written with small vowels (katakana mostly).
  const r = BASE[base];
  if (!r) return null;
  const v = SMALL_VOWEL[small];
  if (r === 'fu') return 'f' + v;
  if (r === 'vu') return 'v' + v;
  if (r === 'te' && v === 'i') return 'ti';
  if (r === 'de' && v === 'i') return 'di';
  if (r === 'to' && v === 'u') return 'tu';
  if (r === 'u' && (v === 'i' || v === 'e' || v === 'o')) return 'w' + v;
  if (r === 'shi' && v === 'e') return 'she';
  if (r === 'ji' && v === 'e') return 'je';
  if (r === 'chi' && v === 'e') return 'che';
  return null;
}

/**
 * Converts kana (hiragana or katakana) to romaji. Other characters are kept.
 * The particle readings of は/へ/を are not guessed — sentence romaji is authored.
 */
export function toRomaji(input: string): string {
  const text = kataToHira(input);
  const chars = [...text];
  let out = '';
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const next = chars[i + 1];
    if (ch === 'っ') {
      // Geminate consonant: double the first consonant of the next syllable.
      const following = next ? syllableAt(chars, i + 1).romaji : '';
      if (following.startsWith('ch')) out += 't';
      else if (following) out += following[0];
      continue;
    }
    if (ch === 'ー') {
      const lastVowel = out.match(/[aeiou](?=[^aeiou]*$)/)?.[0];
      out += lastVowel ?? '-';
      continue;
    }
    const syl = syllableAt(chars, i);
    if (syl.length === 0) {
      out += ch;
      continue;
    }
    // ん before a vowel or y gets an apostrophe to keep it unambiguous (e.g. kin'en).
    if (ch === 'ん' && next && /^[aiueoy]/.test(syllableAt(chars, i + 1).romaji)) {
      out += "n'";
      continue;
    }
    out += syl.romaji;
    i += syl.length - 1;
  }
  return out;
}

function syllableAt(chars: string[], i: number): { romaji: string; length: number } {
  const ch = chars[i];
  const next = chars[i + 1];
  if (!ch) return { romaji: '', length: 0 };
  if (next && SMALL_Y[next] && BASE[ch]) return { romaji: yoonRomaji(ch, next), length: 2 };
  if (next && SMALL_VOWEL[next]) {
    const special = specialSmallVowel(ch, next);
    if (special) return { romaji: special, length: 2 };
  }
  const r = BASE[ch];
  if (r) return { romaji: ch === 'を' ? 'o' : r, length: 1 };
  if (SMALL_VOWEL[ch]) return { romaji: SMALL_VOWEL[ch], length: 1 };
  return { romaji: '', length: 0 };
}

// ---------------------------------------------------------------------------
// Romaji -> hiragana (for typed answers)

const ROMAJI_TABLE: Record<string, string> = (() => {
  const t: Record<string, string> = {};
  for (const r of [...GOJUON, ...DAKUTEN]) for (const c of r) if (c && !(c.romaji in t)) t[c.romaji] = c.hira;
  const extra: Record<string, string> = {
    si: 'し', ti: 'ち', tu: 'つ', hu: 'ふ', zi: 'じ', di: 'ぢ', du: 'づ', wo: 'を', o: 'お',
    sya: 'しゃ', syu: 'しゅ', syo: 'しょ', tya: 'ちゃ', tyu: 'ちゅ', tyo: 'ちょ',
    cya: 'ちゃ', cyu: 'ちゅ', cyo: 'ちょ', jya: 'じゃ', jyu: 'じゅ', jyo: 'じょ',
    zya: 'じゃ', zyu: 'じゅ', zyo: 'じょ', she: 'しぇ', je: 'じぇ', che: 'ちぇ',
    fa: 'ふぁ', fi: 'ふぃ', fe: 'ふぇ', fo: 'ふぉ', va: 'ゔぁ', vi: 'ゔぃ', vu: 'ゔ', ve: 'ゔぇ', vo: 'ゔぉ',
    thi: 'てぃ', dhi: 'でぃ', wi: 'うぃ', we: 'うぇ',
    xa: 'ぁ', xi: 'ぃ', xu: 'ぅ', xe: 'ぇ', xo: 'ぉ', la: 'ぁ', li: 'ぃ', lu: 'ぅ', le: 'ぇ', lo: 'ぉ',
    xya: 'ゃ', xyu: 'ゅ', xyo: 'ょ', lya: 'ゃ', lyu: 'ゅ', lyo: 'ょ', xtu: 'っ', ltu: 'っ', xtsu: 'っ',
    '-': 'ー',
  };
  Object.assign(t, extra);
  for (const r of YOON) for (const c of r) t[c.romaji] = c.hira;
  return t;
})();

const MAX_KEY = Math.max(...Object.keys(ROMAJI_TABLE).map((k) => k.length));

/**
 * IME-like conversion of romaji to hiragana. Unconvertible characters are
 * left in place so callers can detect incomplete input.
 */
export function toHiragana(input: string): string {
  const s = input.toLowerCase().replace(/[āâ]/g, 'aa').replace(/[īî]/g, 'ii').replace(/[ūû]/g, 'uu').replace(/[ēê]/g, 'ee').replace(/[ōô]/g, 'ou');
  let out = '';
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    const next = s[i + 1];
    // n' or nn -> ん
    if (ch === 'n' && (next === "'" || next === '’')) {
      out += 'ん';
      i += 2;
      continue;
    }
    if (ch === 'n' && next === 'n') {
      out += 'ん';
      // "konnichiwa": the second n starts the next syllable when a vowel or y follows.
      i += /[aiueoy]/.test(s[i + 2] ?? '') ? 1 : 2;
      continue;
    }
    // n before a consonant (not y) or at the end -> ん
    if (ch === 'n' && (next === undefined || !/[aiueoy]/.test(next))) {
      out += 'ん';
      i += 1;
      continue;
    }
    // Double consonant -> っ (tch also counts: matcha)
    if (next && ch === next && /[bcdfghjklmpqrstvwxyz]/.test(ch)) {
      out += 'っ';
      i += 1;
      continue;
    }
    if (ch === 't' && next === 'c' && s[i + 2] === 'h') {
      out += 'っ';
      i += 1;
      continue;
    }
    let matched = false;
    for (let len = MAX_KEY; len >= 1; len--) {
      const chunk = s.slice(i, i + len);
      const kana = ROMAJI_TABLE[chunk];
      if (kana) {
        out += kana;
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) {
      out += ch;
      i += 1;
    }
  }
  return out;
}

/** True when the string looks like romaji typed by the learner. */
export function looksLikeRomaji(text: string): boolean {
  return /^[a-zA-Zāīūēōâîûêô'’\-\s.,!?]+$/.test(text) && /[a-zA-Z]/.test(text);
}

/**
 * Canonical kana form for comparisons: katakana -> hiragana and the long-vowel
 * mark ー replaced by the vowel it lengthens (こーひー -> こおひい).
 */
export function canonicalKana(text: string): string {
  const hira = kataToHira(text);
  let out = '';
  for (const ch of hira) {
    if (ch === 'ー') {
      const prev = out.at(-1);
      out += prev ? vowelKana(prev) : '';
    } else {
      out += ch;
    }
  }
  return out;
}

function vowelKana(kana: string): string {
  const r = BASE[kana] ?? SMALL_VOWEL[kana] ?? SMALL_Y[kana] ?? '';
  const v = r.at(-1);
  switch (v) {
    case 'a':
      return 'あ';
    case 'i':
      return 'い';
    case 'u':
      return 'う';
    case 'e':
      return 'え';
    case 'o':
      return 'お';
    default:
      return '';
  }
}

/** Romaji for an item: explicit override, else derived from its reading/kana text. */
export function romajiFor(text: string, reading?: string, explicit?: string): string {
  if (explicit) return explicit;
  return toRomaji(reading ?? rubyToKana(text));
}
