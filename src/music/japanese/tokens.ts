/**
 * Japanese lyrics from morphological analysis (kuromoji with the IPADIC dictionary) to what
 * the learner sees: furigana over kanji, a kana reading line, modified Hepburn romaji, and
 * chunks (a word with its endings) that can be tapped. Pure functions; the analysis itself
 * runs in a worker (./analyzer.ts).
 *
 * Romaji: modified Hepburn as in dictionaries and textbooks — long vowels with a macron
 * (東京 Tōkyō, 学校 gakkō), "ei" kept (先生 sensei), particles as pronounced (は wa, へ e,
 * を o), ん before a vowel or y as n' (原因 gen'in), っ doubles the next consonant (っち → tch).
 * Long vowels come from the dictionary's pronunciation field, so 思う stays omou.
 */
import { hasKanji, isKanji, kataToHira, toKatakana, toRomaji } from '../../engine/kana';

/** One token of the analysis, in a compact form that is cached per song. */
export interface JaToken {
  /** Text as written in the lyrics. */
  s: string;
  /** Dictionary form (基本形); the surface when the dictionary has none. */
  base: string;
  /** Reading of the surface in katakana; '' when unknown. */
  r: string;
  /** Pronunciation in katakana (long vowels as ー); '' when unknown. */
  pr: string;
  /** Part of speech (品詞) and its first two subdivisions. */
  pos: string;
  pos1: string;
  pos2: string;
  /** Conjugation type and form (活用型, 活用形); '' when not conjugating. */
  ct: string;
  cf: string;
  /** The word was not in the dictionary. */
  unk?: boolean;
}

/** The IPADIC token shape produced by kuromoji. */
export interface IpadicToken {
  surface_form: string;
  pos: string;
  pos_detail_1: string;
  pos_detail_2: string;
  conjugated_type: string;
  conjugated_form: string;
  basic_form: string;
  reading?: string;
  pronunciation?: string;
  word_type: string;
}

const star = (s: string | undefined) => (!s || s === '*' ? '' : s);

export function fromIpadic(t: IpadicToken): JaToken {
  const tok: JaToken = {
    s: t.surface_form,
    base: star(t.basic_form) || t.surface_form,
    r: star(t.reading),
    pr: star(t.pronunciation),
    pos: star(t.pos),
    pos1: star(t.pos_detail_1),
    pos2: star(t.pos_detail_2),
    ct: star(t.conjugated_type),
    cf: star(t.conjugated_form),
  };
  if (t.word_type === 'UNKNOWN') tok.unk = true;
  return tok;
}

export const isSpace = (t: JaToken) => t.pos === '記号' && (t.pos1 === '空白' || !t.s.trim());
export const isPunct = (t: JaToken) => t.pos === '記号' && !isSpace(t);

/**
 * Applies the learner's reading corrections (e.g. 今日 read こんにち in 今日は "hello"). The
 * key is `${tokenIndex}:${surface}`, so a correction never lands on a different word after
 * the line is edited.
 */
export function withReadings(tokens: readonly JaToken[], fixes: Record<string, string> | undefined): JaToken[] {
  if (!fixes) return [...tokens];
  return tokens.map((t, i) => {
    const fix = fixes[`${i}:${t.s}`];
    if (!fix) return t;
    const kata = toKatakana(fix);
    return { ...t, r: kata, pr: kata };
  });
}

export function fixKey(index: number, token: JaToken): string {
  return `${index}:${token.s}`;
}

// ---------------------------------------------------------------------------
// Readings

/** Reading of the surface in hiragana; kana-only tokens keep their own spelling. */
export function tokenReading(t: JaToken): string {
  if (!hasKanji(t.s)) return t.s;
  return t.r ? kataToHira(t.r) : '';
}

/**
 * Reading of the dictionary form: the reading of the surface with the conjugated ending
 * replaced (遊び アソビ → 遊ぶ あそぶ, 泣い ナイ → 泣く なく). '' when it cannot be told.
 */
export function baseReading(t: JaToken): string {
  if (!hasKanji(t.base)) return t.base;
  if (t.base === '来る') return 'くる';
  const reading = tokenReading(t);
  if (!reading) return '';
  if (t.base === t.s) return reading;
  let common = 0;
  while (common < t.s.length && common < t.base.length && t.s[common] === t.base[common]) common++;
  const surfaceTail = kataToHira(t.s.slice(common));
  if (hasKanji(surfaceTail) || hasKanji(t.base.slice(common))) return '';
  if (!reading.endsWith(surfaceTail)) return '';
  return reading.slice(0, reading.length - surfaceTail.length) + kataToHira(t.base.slice(common));
}

export interface RubySegment {
  base: string;
  ruby?: string;
}

/**
 * Furigana for one token: readings go over kanji only, with the kana around them (okurigana)
 * left as written: 食べる → 食(た)べる, お池 → お池(いけ), 取り扱い → 取(と)り扱(あつか)い.
 */
export function rubySegments(t: JaToken): RubySegment[] {
  if (!hasKanji(t.s)) return [{ base: t.s }];
  const reading = tokenReading(t);
  if (!reading) return [{ base: t.s }];
  const runs: { text: string; kanji: boolean }[] = [];
  for (const ch of t.s) {
    const kanji = isKanji(ch);
    const last = runs.at(-1);
    if (last && last.kanji === kanji) last.text += ch;
    else runs.push({ text: ch, kanji });
  }
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`^${runs.map((r) => (r.kanji ? '(.+?)' : escape(kataToHira(r.text)))).join('')}$`);
  const m = pattern.exec(reading);
  if (!m) return [{ base: t.s, ruby: reading }];
  let g = 1;
  return runs.map((r) => (r.kanji ? { base: r.text, ruby: m[g++] } : { base: r.text }));
}

/** The line in kana: kanji replaced by their reading (hiragana), kana kept as written. */
export function readingLine(tokens: readonly JaToken[]): string {
  return tokens
    .map((t) => (hasKanji(t.s) ? tokenReading(t) || t.s : t.s))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Romaji

const MACRON: Record<string, string> = { a: 'ā', i: 'ī', u: 'ū', e: 'ē', o: 'ō' };
const PUNCT: Record<string, string> = { '、': ',', '。': '.', '！': '!', '？': '?', '「': '"', '」': '"', '『': '"', '』': '"', '・': ' ', '…': '…', '〜': '~', '～': '~' };

/** Kana with ー for long vowels → modified Hepburn (トーキョー → tōkyō, センセイ → sensei). */
export function hepburn(kana: string): string {
  const parts = kana.split('ー');
  let out = '';
  parts.forEach((part, i) => {
    out += toRomaji(part);
    if (i < parts.length - 1) out = out.replace(/[aiueo]$/, (v) => MACRON[v]);
  });
  return out;
}

/** Kana to romanise for a token (particles as pronounced), or null for non-kana text. */
function tokenKana(t: JaToken): string | null {
  if (t.pos === '助詞') {
    if (t.s === 'は') return 'ワ';
    if (t.s === 'へ') return 'エ';
    if (t.s === 'を') return 'オ';
  }
  const kana = t.pr || (hasKanji(t.s) ? t.r : t.s);
  return kana && /^[\p{Script=Hiragana}\p{Script=Katakana}ー]+$/u.test(kana) ? kana : null;
}

/**
 * Whether the token is written together with the one before it in romaji (and belongs to the
 * same tappable chunk): endings, auxiliaries and contracted forms join the word they follow.
 */
export function attachesToPrevious(t: JaToken, prev: JaToken | undefined): boolean {
  if (!prev || isSpace(prev) || isSpace(t)) return false;
  if (isPunct(t)) return true;
  if (prev.pos === '接頭詞') return true;
  // 遊び+ましょ+う, 困ら+せ+た; after a noun the copula stays apart (大変 だ → taihen da).
  if (t.pos === '助動詞') return ['動詞', '形容詞', '助動詞'].includes(prev.pos);
  if (t.pos === '助詞' && t.pos1 === '接続助詞' && ['て', 'で', 'ば', 'ちゃ', 'じゃ'].includes(t.s)) return ['動詞', '形容詞', '助動詞'].includes(prev.pos);
  if (t.pos === '動詞' && t.pos1 === '接尾') return true;
  if (t.pos === '動詞' && t.pos1 === '非自立' && ['てる', 'でる', 'ちゃう', 'じゃう', 'とく', 'どく', 'ちまう'].includes(t.base)) return true;
  if (t.pos === '形容詞' && t.pos1 === '接尾') return true;
  if (t.pos === '名詞' && t.pos1 === '接尾' && prev.pos === '名詞') return true;
  return false;
}

/**
 * Romaji of a line. A word and its endings are romanised together, so sounds that cross the
 * token boundary come out right (はまっ+て → hamatte, ましょ+う → mashō).
 */
export function romajiLine(tokens: readonly JaToken[]): string {
  let out = '';
  let kana = '';
  const flush = () => {
    if (kana) out += hepburn(kana);
    kana = '';
  };
  const space = () => {
    if (out && !out.endsWith(' ')) out += ' ';
  };
  tokens.forEach((t, i) => {
    if (isSpace(t)) {
      flush();
      space();
      return;
    }
    if (!attachesToPrevious(t, tokens[i - 1])) {
      flush();
      space();
    }
    if (isPunct(t)) {
      flush();
      out += [...t.s].map((ch) => PUNCT[ch] ?? ch).join('');
      return;
    }
    let k = tokenKana(t);
    if (k === null) {
      flush();
      out += t.s;
      return;
    }
    // Volitional う after an o-sound is a long vowel: 遊びましょう → asobimashō, だろう → darō.
    if (t.pos === '助動詞' && t.base === 'う' && /o$/.test(toRomaji(kana.slice(-2)))) k = 'ー';
    kana += k;
  });
  flush();
  return out.replace(/\s+([,.!?])/g, '$1').replace(/\s+/g, ' ').trim();
}

// ---------------------------------------------------------------------------
// Chunks: a content word with its endings, the unit the learner taps

export interface Chunk {
  /** Index of the first token. */
  from: number;
  /** Index after the last token. */
  to: number;
  /** Index of the token that carries the meaning (the word looked up in dictionaries). */
  head: number;
}

/** Whether a token is a word worth learning (not a particle, ending, symbol or space). */
export function isContentToken(t: JaToken): boolean {
  if (isSpace(t) || t.pos === '記号' || t.pos === '助詞' || t.pos === '助動詞' || t.pos === '接頭詞' || t.pos === 'フィラー') return false;
  if (t.pos === '名詞' && (t.pos1 === '非自立' || t.pos1 === '接尾' || t.pos1 === '数')) return false;
  if (t.pos === '動詞' && (t.pos1 === '非自立' || t.pos1 === '接尾')) return false;
  if (/^[\p{P}\p{S}\d\s]+$/u.test(t.s)) return false;
  return true;
}

export function chunkTokens(tokens: readonly JaToken[]): Chunk[] {
  const chunks: Chunk[] = [];
  tokens.forEach((t, i) => {
    const last = chunks.at(-1);
    if (last && last.to === i && attachesToPrevious(t, tokens[i - 1]) && !isPunct(t)) {
      last.to = i + 1;
      if (!isContentToken(tokens[last.head]) && isContentToken(t)) last.head = i;
      return;
    }
    chunks.push({ from: i, to: i + 1, head: i });
  });
  return chunks;
}

/** Polish label of a part of speech. */
export function posLabel(t: JaToken): string {
  switch (t.pos) {
    case '名詞':
      if (t.pos1 === '代名詞') return 'zaimek';
      if (t.pos1 === '固有名詞') return 'nazwa własna';
      if (t.pos1 === '形容動詞語幹') return 'przymiotnik -na';
      if (t.pos1 === '副詞可能') return 'rzeczownik / przysłówek';
      if (t.pos1 === 'サ変接続') return 'rzeczownik (też z する)';
      return 'rzeczownik';
    case '動詞':
      return 'czasownik';
    case '形容詞':
      return 'przymiotnik -i';
    case '副詞':
      return 'przysłówek';
    case '連体詞':
      return 'określnik';
    case '接続詞':
      return 'spójnik';
    case '感動詞':
      return 'wykrzyknik';
    case '助詞':
      return 'partykuła';
    case '助動詞':
      return 'końcówka / czasownik posiłkowy';
    case '接頭詞':
      return 'przedrostek';
    default:
      return '';
  }
}

/** Short Polish name of a conjugated form (for the word sheet), or ''. */
export function formLabel(tokens: readonly JaToken[], chunk: Chunk): string {
  const tail = tokens.slice(chunk.head + 1, chunk.to);
  const head = tokens[chunk.head];
  const parts: string[] = [];
  const has = (pred: (t: JaToken) => boolean) => tail.some(pred);
  if (has((t) => t.base === 'ます')) parts.push('forma grzeczna (-masu)');
  if (has((t) => t.pos === '助動詞' && (t.base === 'ない' || t.base === 'ぬ' || (t.base === 'ん' && t.ct.includes('ヌ'))))) parts.push('przeczenie');
  if (has((t) => t.pos === '助動詞' && t.base === 'た')) parts.push(tail.some((t) => t.cf === '仮定形') ? 'warunek (-tara)' : 'czas przeszły (-ta)');
  if (has((t) => t.pos === '助動詞' && t.base === 'う') || has((t) => t.pos === '助動詞' && t.base === 'よう')) parts.push('forma wolicjonalna („zróbmy”)');
  if (has((t) => t.pos === '助動詞' && t.base === 'たい')) parts.push('chęć (-tai)');
  if (has((t) => t.pos === '助詞' && (t.s === 'て' || t.s === 'で'))) parts.push('forma -te');
  if (has((t) => t.s === 'ば' && t.pos === '助詞')) parts.push('warunek (-ba)');
  if (has((t) => t.base === 'てる' || t.base === 'でる')) parts.push('trwanie (-teru, skrót -te iru)');
  if (has((t) => t.base === 'ちゃう' || t.base === 'じゃう')) parts.push('zakończenie / żal (-chau)');
  if (has((t) => t.pos1 === '接尾' && (t.base === 'せる' || t.base === 'させる'))) parts.push('kauzatyw (sprawić, że…)');
  if (has((t) => t.pos1 === '接尾' && (t.base === 'れる' || t.base === 'られる'))) parts.push('strona bierna / możliwość');
  if (head?.pos === '形容詞' && head.cf.startsWith('連用')) parts.push('forma przysłówkowa (-ku)');
  return parts.join(', ');
}

/** Furigana markup ({漢字|かんじ}, as in course content) for a word and its hiragana reading. */
export function rubyMarkup(text: string, reading: string | undefined): string {
  if (!reading || !hasKanji(text)) return text;
  const token: JaToken = { s: text, base: text, r: toKatakana(reading), pr: '', pos: '', pos1: '', pos2: '', ct: '', cf: '' };
  return rubySegments(token)
    .map((seg) => (seg.ruby ? `{${seg.base}|${seg.ruby}}` : seg.base))
    .join('');
}
