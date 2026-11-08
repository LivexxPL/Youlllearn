import { beforeAll, describe, expect, it } from 'vitest';
import type { JapaneseTokenizer } from './dictionary';
import { testTokenizer } from '../../test/kuromoji';
import {
  baseReading,
  chunkTokens,
  formLabel,
  fromIpadic,
  hepburn,
  isContentToken,
  readingLine,
  romajiLine,
  rubySegments,
  withReadings,
  fixKey,
  type JaToken,
} from './tokens';
import { japaneseNotes, patternNotes, sortForLevel, levelRank } from '../grammar';

let tk: JapaneseTokenizer;
beforeAll(async () => {
  tk = await testTokenizer();
}, 60_000);

const analyse = (text: string): JaToken[] => tk.tokenize(text).map(fromIpadic);

describe('Japanese analysis (kuromoji + IPADIC)', () => {
  it('reads lyrics into kana and modified Hepburn romaji', () => {
    const t = analyse('お池にはまって さあ大変');
    expect(readingLine(t)).toBe('おいけにはまって さあたいへん');
    expect(romajiLine(t)).toBe('oike ni hamatte sā taihen');
  });

  it('writes long vowels with macrons, keeps "ei" and reads particles as pronounced', () => {
    expect(romajiLine(analyse('東京は先生の大きい学校'))).toBe('Tōkyō wa sensei no ōkii gakkō'.toLowerCase());
    expect(romajiLine(analyse('君のことを見てる'))).toBe('kimi no koto o miteru');
    expect(romajiLine(analyse('学校へ行く'))).toBe('gakkō e iku');
    expect(romajiLine(analyse('思う'))).toBe('omou');
  });

  it('joins endings to their word', () => {
    expect(romajiLine(analyse('坊ちゃん一緒に 遊びましょう'))).toBe('botchan issho ni asobimashō');
    expect(romajiLine(analyse('泣いてはどじょうを 困らせた'))).toBe('naite wa dojō o komaraseta');
    expect(romajiLine(analyse('行かなきゃいけないんだ'))).toBe('ikanakya ikenai n da');
    expect(romajiLine(analyse('忘れちゃうなんて'))).toBe('wasurechau nante');
  });

  it('converts kana with long-vowel marks', () => {
    expect(hepburn('トーキョー')).toBe('tōkyō');
    expect(hepburn('コーヒー')).toBe('kōhī');
    expect(hepburn('センセイ')).toBe('sensei');
    expect(hepburn('ゲンイン')).toBe("gen'in");
    expect(hepburn('マッチャ')).toBe('matcha');
  });

  it('puts furigana over kanji only, aligning okurigana', () => {
    const [tabe] = analyse('食べる');
    expect(rubySegments(tabe)).toEqual([{ base: '食', ruby: 'た' }, { base: 'べる' }]);
    const ike = analyse('お池').find((t) => t.s === '池')!;
    expect(rubySegments(ike)).toEqual([{ base: '池', ruby: 'いけ' }]);
    const [toriatsukai] = analyse('取り扱い');
    expect(rubySegments(toriatsukai)).toEqual([{ base: '取', ruby: 'と' }, { base: 'り' }, { base: '扱', ruby: 'あつか' }, { base: 'い' }]);
    expect(rubySegments(analyse('どんぐり')[0])).toEqual([{ base: 'どんぐり' }]);
  });

  it('gives the reading of the dictionary form', () => {
    const find = (text: string, s: string) => analyse(text).find((t) => t.s === s)!;
    expect(baseReading(find('遊びましょう', '遊び'))).toBe('あそぶ');
    expect(baseReading(find('泣いて', '泣い'))).toBe('なく');
    expect(baseReading(find('出て来て', '出'))).toBe('でる');
    expect(baseReading(find('出て来て', '来'))).toBe('くる');
    expect(baseReading(find('行かない', '行か'))).toBe('いく');
  });

  it('groups words with their endings for tapping', () => {
    const t = analyse('坊ちゃん一緒に 遊びましょう');
    const chunks = chunkTokens(t).map((c) => t.slice(c.from, c.to).map((x) => x.s).join(''));
    expect(chunks).toEqual(['坊ちゃん', '一緒', 'に', ' ', '遊びましょう']);
    const play = chunkTokens(t).find((c) => t[c.head].s === '遊び')!;
    expect(formLabel(t, play)).toContain('forma grzeczna');
    expect(isContentToken(t[play.head])).toBe(true);
    expect(isContentToken(t.find((x) => x.s === 'に')!)).toBe(false);
  });

  it('applies reading corrections only to the same word', () => {
    const t = analyse('今日は');
    expect(romajiLine(t)).toBe('kyō wa');
    const idx = t.findIndex((x) => x.s === '今日');
    const fixed = withReadings(t, { [fixKey(idx, t[idx])]: 'こんにち' });
    expect(readingLine(fixed)).toBe('こんにちは');
    expect(rubySegments(fixed[idx])).toEqual([{ base: '今日', ruby: 'こんにち' }]);
    expect(withReadings(t, { '0:明日': 'あした' })).toEqual(t);
  });

  it('finds grammar in Japanese lines', () => {
    const ids = (text: string) => japaneseNotes(analyse(text)).map((n) => n.note.id);
    expect(ids('お池にはまって さあ大変')).toEqual(expect.arrayContaining(['ja.ni', 'ja.te']));
    expect(ids('坊ちゃん一緒に 遊びましょう')).toContain('ja.mashou');
    expect(ids('君のことを見てる')).toEqual(expect.arrayContaining(['ja.no', 'ja.wo', 'ja.teru', 'ja.pronoun']));
    expect(ids('忘れちゃうなんて')).toEqual(expect.arrayContaining(['ja.shimau', 'ja.nante']));
    expect(ids('行かなきゃいけないんだ')).toEqual(expect.arrayContaining(['ja.nakya', 'ja.nda']));
    expect(ids('泣いてはどじょうを 困らせた')).toEqual(expect.arrayContaining(['ja.causative', 'ja.ta', 'ja.wo']));
    expect(ids('会いたい')).toContain('ja.tai');
    const found = japaneseNotes(analyse('君が好き'));
    expect(found.find((n) => n.note.id === 'ja.ga')?.tokens).toEqual([1]);
  });
});

describe('grammar patterns (Spanish, German)', () => {
  it('detects Spanish constructions', () => {
    const ids = (text: string) => patternNotes('es', text).map((n) => n.note.id);
    expect(ids('Me gustan las flores')).toContain('es.gustar');
    expect(ids('Voy a cantar contigo')).toContain('es.ir-a');
    expect(ids('que sepa coser, que sepa bordar')).toContain('es.que-subjuntivo');
    expect(ids('duermen los pollitos')).toContain('es.diminutive');
    expect(ids('no veo nada')).toContain('es.double-negation');
    expect(patternNotes('es', 'voy al mar')[0].match).toBe('al');
  });

  it('detects German constructions', () => {
    const ids = (text: string) => patternNotes('de', text).map((n) => n.note.id);
    expect(ids('Lasset uns singen, tanzen und springen!')).toContain('de.lasst-uns');
    expect(ids('Schwänzchen in die Höh\'')).toEqual(expect.arrayContaining(['de.diminutive', 'de.elision', 'de.wechsel']));
    expect(ids('Ich habe dich gesucht')).toContain('de.perfekt');
    expect(ids('Ich kann nicht schlafen')).toEqual(expect.arrayContaining(['de.modal', 'de.negation']));
  });

  it('orders notes by the learner level', () => {
    const notes = patternNotes('es', 'que sepa coser y me gusta');
    const { now, later } = sortForLevel(notes, levelRank('A2'));
    expect(now.map((n) => n.note.id)).toContain('es.gustar');
    expect(later.map((n) => n.note.id)).toEqual(['es.que-subjuntivo']);
  });
});
