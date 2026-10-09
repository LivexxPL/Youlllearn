import { describe, expect, it } from 'vitest';
import {
  canonicalKana,
  hasKanji,
  kataToHira,
  looksLikeRomaji,
  parseRuby,
  rubyToKana,
  stripRuby,
  toHiragana,
  toKatakana,
  toRomaji,
  YOON,
  GOJUON,
} from './kana';

describe('kana -> romaji', () => {
  it.each([
    ['あいうえお', 'aiueo'],
    ['すし', 'sushi'],
    ['ちかてつ', 'chikatetsu'],
    ['ふじさん', 'fujisan'],
    ['がっこう', 'gakkou'],
    ['きって', 'kitte'],
    ['まっちゃ', 'matcha'],
    ['とうきょう', 'toukyou'],
    ['しゃしん', 'shashin'],
    ['じゅぎょう', 'jugyou'],
    ['コーヒー', 'koohii'],
    ['パン', 'pan'],
    ['ポーランド', 'poorando'],
    ['きんえん', "kin'en"],
    ['ほんや', "hon'ya"],
    ['ファイル', 'fairu'],
    ['パーティー', 'paatii'],
  ])('%s -> %s', (kana, romaji) => {
    expect(toRomaji(kana)).toBe(romaji);
  });
});

describe('romaji -> hiragana', () => {
  it.each([
    ['sushi', 'すし'],
    ['susi', 'すし'],
    ['gakkou', 'がっこう'],
    ['matcha', 'まっちゃ'],
    ['konnichiha', 'こんにちは'],
    ['sensei', 'せんせい'],
    ['hon', 'ほん'],
    ['kin\'en', 'きんえん'],
    ['tokyo', 'ときょ'],
    ['toukyou', 'とうきょう'],
    ['wo', 'を'],
    ['ko-hi-', 'こーひー'],
    ['jugyou', 'じゅぎょう'],
    ['chotto', 'ちょっと'],
  ])('%s -> %s', (romaji, kana) => {
    expect(toHiragana(romaji)).toBe(kana);
  });

  it('round-trips every chart cell', () => {
    for (const r of GOJUON) {
      for (const c of r) {
        if (!c || c.romaji === 'wo') continue;
        expect(toHiragana(c.romaji)).toBe(c.hira);
        expect(toRomaji(c.hira)).toBe(c.romaji);
      }
    }
    for (const r of YOON) for (const c of r) expect(toRomaji(c.kata)).toBe(c.romaji);
  });
});

describe('helpers', () => {
  it('converts scripts', () => {
    expect(kataToHira('カタカナ')).toBe('かたかな');
    expect(toKatakana('ひらがな')).toBe('ヒラガナ');
  });

  it('canonicalises long vowels for comparison', () => {
    expect(canonicalKana('コーヒー')).toBe('こおひい');
    expect(canonicalKana(toHiragana('koohii'))).toBe('こおひい');
    expect(canonicalKana('ノート')).toBe('のおと');
  });

  it('parses furigana markup', () => {
    const t = '{学生|がくせい}です。';
    expect(parseRuby(t)).toEqual([{ base: '学生', ruby: 'がくせい' }, { base: 'です。' }]);
    expect(stripRuby(t)).toBe('学生です。');
    expect(rubyToKana(t)).toBe('がくせいです。');
    expect(hasKanji(stripRuby(t))).toBe(true);
    expect(hasKanji(rubyToKana(t))).toBe(false);
  });

  it('detects romaji input', () => {
    expect(looksLikeRomaji('gakusei')).toBe(true);
    expect(looksLikeRomaji('がくせい')).toBe(false);
  });
});
