import { beforeAll, describe, expect, it } from 'vitest';
import { testTokenizer } from '../test/kuromoji';
import type { JapaneseTokenizer } from './japanese/dictionary';
import { fromIpadic, type JaToken } from './japanese/tokens';
import { SAMPLES, sampleLines, sampleReadings } from './samples';
import { buildSongPractice, displayLine, musicKind, type MusicExerciseKind } from './exercises';
import { practiceWords, songTokens } from './practice';
import { getCourse } from '../content/registry';
import { lineRef, type Song, type WordEntry } from './types';
import { emptyProgress } from '../services/music';
import { checkAnswer } from '../engine/answer';
import { songDifficulty, shortLevel } from './difficulty';
import { courseDictionary } from './vocab';
import { songWords } from './practice';

let tk: JapaneseTokenizer;
beforeAll(async () => {
  tk = await testTokenizer();
}, 60_000);

function sampleSong(id: string): Song {
  const s = SAMPLES.find((x) => x.id === id)!;
  const song: Song = {
    id: `sample-${id}`,
    lang: s.lang,
    title: s.title,
    artist: s.artist,
    videoId: null,
    lines: sampleLines(s),
    format: 'plain',
    delay: 0,
    favorite: false,
    progress: emptyProgress(),
    createdAt: 0,
    updatedAt: 0,
  };
  const readings = sampleReadings(s);
  if (readings) song.readings = readings;
  return song;
}

function analysed(song: Song): Record<string, JaToken[]> | undefined {
  if (song.lang !== 'ja') return undefined;
  const raw = Object.fromEntries(song.lines.map((l) => [l.id, tk.tokenize(l.text).map(fromIpadic)]));
  return songTokens(song, raw);
}

const kinds = (steps: ReturnType<typeof buildSongPractice>) => new Set(steps.map(musicKind).filter(Boolean) as MusicExerciseKind[]);

describe('song practice', () => {
  it('builds every kind of exercise from a Japanese song', () => {
    const song = sampleSong('donguri');
    const tokens = analysed(song);
    const course = getCourse('ja');
    const words = practiceWords(song, course, tokens, new Map());
    const all = new Set<MusicExerciseKind>();
    for (let seed = 1; seed <= 12; seed++) {
      for (const k of kinds(buildSongPractice({ song, course, words, tokens, audio: 'video', seed, learnerRank: 2 }))) all.add(k);
    }
    expect([...all].sort()).toEqual(['dictation', 'gap', 'grammar', 'listening', 'order', 'reading', 'translation'].sort());
    const steps = buildSongPractice({ song, course, words, tokens, audio: 'video', seed: 3, learnerRank: 2 });
    expect(steps.at(-1)?.kind).toBe('summary');
    expect(steps.length).toBeGreaterThanOrEqual(8);
    // Every graded exercise is about a line of this song or one of its words.
    for (const ex of steps.filter((s) => s.kind !== 'summary')) expect(ex.refs.length).toBeGreaterThan(0);
  });

  it('adds matching once words have meanings and leaves known words out', () => {
    const song = sampleSong('pollitos');
    const course = getCourse('es');
    const entries = new Map<string, WordEntry>(
      ['pollitos', 'gallina', 'trigo', 'alas', 'hambre'].map((k, i) => [`es:${k}`, { id: `es:${k}`, lang: 'es', lemma: k, pl: `znaczenie ${i}`, plBy: 'user', status: 'new', contexts: [], createdAt: 0, updatedAt: 0 }]),
    );
    entries.set('es:frío', { id: 'es:frío', lang: 'es', lemma: 'frío', status: 'known', contexts: [], createdAt: 0, updatedAt: 0 });
    const words = practiceWords(song, course, undefined, entries);
    expect(words.find((w) => w.word.key === 'frío')?.known).toBe(true);
    expect(words.find((w) => w.word.key === 'pollitos')?.ref).toBe('w:es:pollitos');
    expect(words.find((w) => w.word.key === 'dos')?.ref).toBe('es.dos');
    let matched = false;
    for (let seed = 1; seed <= 5; seed++) {
      const steps = buildSongPractice({ song, course, words, audio: 'none', seed, learnerRank: 1 });
      const match = steps.find((s) => s.kind === 'match');
      if (match && match.kind === 'match') {
        matched = true;
        expect(match.pairs.length).toBeGreaterThanOrEqual(3);
        expect(match.pairs.map((p) => p.right)).not.toContain(undefined);
      }
      // Gaps never blank a word marked as known.
      for (const s of steps) if (s.kind === 'authored' && s.exercise.type === 'gap') expect(s.exercise.answer.toLowerCase()).not.toBe('frío');
      // Without audio there is no listening or dictation.
      expect(kinds(steps).has('listening')).toBe(false);
      expect(kinds(steps).has('dictation')).toBe(false);
    }
    expect(matched).toBe(true);
  });

  it('accepts the kana reading in Japanese dictation and the line with any punctuation', () => {
    const song = sampleSong('donguri');
    const tokens = analysed(song);
    const steps = buildSongPractice({ song, course: getCourse('ja'), words: [], tokens, audio: 'video', seed: 7, learnerRank: 1, size: 40 });
    const dict = steps.find((s) => s.kind === 'type');
    expect(dict && dict.kind === 'type').toBe(true);
    if (dict?.kind !== 'type') return;
    const line = song.lines.find((l) => lineRef(song.id, l.id) === dict.refs[0])!;
    expect(checkAnswer(line.text, dict.accepted, { lang: 'ja' }).verdict).toBe('correct');
    expect(checkAnswer(dict.accepted[1], dict.accepted, { lang: 'ja' }).verdict).toBe('correct');
  });

  it('shows Japanese lines with furigana markup, using reading corrections', () => {
    const song = sampleSong('donguri');
    const tokens = analysed(song)!;
    expect(displayLine(song.lines[2], tokens.l3)).toBe('どじょうが{出|で}て{来|き}て {今日|こんにち}は');
    expect(displayLine(song.lines[1], tokens.l2)).toBe('お{池|いけ}にはまって さあ{大変|たいへん}');
  });

  it('only practises the chosen lines', () => {
    const song = sampleSong('entchen');
    const words = practiceWords(song, getCourse('de'), undefined, new Map());
    const steps = buildSongPractice({ song, course: getCourse('de'), words, audio: 'tts', seed: 2, learnerRank: 1, lineIds: ['l1', 'l2'] });
    const lineRefs = steps.flatMap((s) => s.refs).filter((r) => r.startsWith('line:'));
    expect(new Set(lineRefs)).toEqual(new Set(lineRefs.filter((r) => r.endsWith(':l1') || r.endsWith(':l2'))));
  });
});

describe('difficulty', () => {
  it('measures course coverage and gives an orientation level', () => {
    const song = sampleSong('pollitos');
    const course = getCourse('es');
    const d = songDifficulty({
      lang: 'es',
      course,
      dict: courseDictionary(course),
      words: songWords(song, undefined),
      lineTexts: song.lines.map((l) => l.text),
      entries: new Map(),
      cards: new Map(),
    });
    expect(d.words).toBeGreaterThan(30);
    expect(d.levels.at(-1)!.cumulative + d.outside).toBeCloseTo(1, 5);
    expect(d.estimate).not.toBeNull();
    expect(d.known).toBe(0);
  });

  it('counts kanji and uses JLPT-style short labels for Japanese', () => {
    const song = sampleSong('donguri');
    const tokens = analysed(song);
    const course = getCourse('ja');
    const d = songDifficulty({ lang: 'ja', course, dict: courseDictionary(course), words: songWords(song, tokens), lineTexts: song.lines.map((l) => l.text), entries: new Map(), cards: new Map() });
    expect(d.kanji).toBeGreaterThanOrEqual(8);
    expect(shortLevel('A2 (JF) / N4')).toBe('N4');
    expect(shortLevel('A2+')).toBe('A2+');
  });
});
