import { describe, expect, it } from 'vitest';
import {
  activeLineIndex,
  activeWordIndex,
  applyTranslation,
  detectFormat,
  lineEnd,
  parseLyrics,
  parseTimestamp,
  reconcileLines,
  timingKind,
  toLrc,
} from './lyrics';
import { parseStartParam, parseYouTubeUrl, playerErrorKind } from './youtube';

describe('YouTube links', () => {
  const id = 'dQw4w9WgXcQ';
  it.each([
    [`https://www.youtube.com/watch?v=${id}`],
    [`https://youtube.com/watch?v=${id}&list=PL123&index=2`],
    [`https://m.youtube.com/watch?v=${id}`],
    [`https://music.youtube.com/watch?v=${id}&feature=share`],
    [`https://youtu.be/${id}`],
    [`youtu.be/${id}?si=abc`],
    [`https://www.youtube.com/shorts/${id}`],
    [`https://www.youtube.com/embed/${id}?rel=0`],
    [`https://www.youtube-nocookie.com/embed/${id}`],
    [`https://www.youtube.com/live/${id}`],
    [`www.youtube.com/watch?v=${id}`],
    [id],
    [`  ${id}  `],
  ])('reads the video id from %s', (url) => {
    expect(parseYouTubeUrl(url)).toMatchObject({ ok: true, videoId: id });
  });

  it('reads the start time', () => {
    expect(parseYouTubeUrl(`https://youtu.be/${id}?t=90`)).toEqual({ ok: true, videoId: id, start: 90 });
    expect(parseYouTubeUrl(`https://www.youtube.com/watch?v=${id}&t=1m30s`)).toEqual({ ok: true, videoId: id, start: 90 });
    expect(parseStartParam('1h2m3s')).toBe(3723);
    expect(parseStartParam('abc')).toBeUndefined();
  });

  it('explains links it cannot use', () => {
    expect(parseYouTubeUrl('')).toEqual({ ok: false, reason: 'empty' });
    expect(parseYouTubeUrl('https://vimeo.com/12345')).toEqual({ ok: false, reason: 'notYoutube' });
    expect(parseYouTubeUrl('https://www.youtube.com/playlist?list=PL0123')).toEqual({ ok: false, reason: 'playlist' });
    expect(parseYouTubeUrl('https://www.youtube.com/@someone')).toEqual({ ok: false, reason: 'channel' });
    expect(parseYouTubeUrl('https://www.youtube.com/watch?v=short')).toEqual({ ok: false, reason: 'noVideo' });
    expect(parseYouTubeUrl('https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ')).toEqual({ ok: false, reason: 'notYoutube' });
    expect(parseYouTubeUrl('not a link at all')).toEqual({ ok: false, reason: 'notYoutube' });
  });

  it('maps IFrame API error codes', () => {
    expect(playerErrorKind(2)).toBe('badRequest');
    expect(playerErrorKind(100)).toBe('notFound');
    expect(playerErrorKind(101)).toBe('notEmbeddable');
    expect(playerErrorKind(150)).toBe('notEmbeddable');
    expect(playerErrorKind(153)).toBe('noReferrer');
    expect(playerErrorKind(999)).toBe('unknown');
  });
});

describe('lyrics formats', () => {
  it('detects the format', () => {
    expect(detectFormat('WEBVTT\n\n00:01.000 --> 00:02.000\nhi')).toBe('vtt');
    expect(detectFormat('1\n00:00:01,000 --> 00:00:02,000\nhi')).toBe('srt');
    expect(detectFormat('[00:01.00]hi\n[00:02.00]there')).toBe('lrc');
    expect(detectFormat('just\nwords')).toBe('plain');
  });

  it('reads plain text with stanzas and drops section labels', () => {
    const r = parseLyrics('[Verse 1]\nLos pollitos dicen\npío, pío, pío\n\n[Chorus]\ncuando tienen hambre\n');
    expect(r.format).toBe('plain');
    expect(r.lines.map((l) => l.text)).toEqual(['Los pollitos dicen', 'pío, pío, pío', 'cuando tienen hambre']);
    expect(r.lines.map((l) => l.id)).toEqual(['l1', 'l2', 'l3']);
    expect(r.lines[2].stanza).toBe(true);
    expect(r.lines[0].start).toBeUndefined();
    expect(timingKind(r.lines)).toBe('none');
    expect(r.warnings).toHaveLength(1);
  });

  it('normalises the ideographic space in Japanese lyrics', () => {
    expect(parseLyrics('どんぐりころころ　どんぶりこ').lines[0].text).toBe('どんぐりころころ どんぶりこ');
  });

  it('reads LRC with metadata, offset, repeated lines and instrumental breaks', () => {
    const lrc = ['[ti:Kuckuck]', '[ar:Tradycyjna]', '[offset:+500]', '[00:10.50]Kuckuck, Kuckuck', '[00:14.00][00:30.00]ruft\'s aus dem Wald', '[00:18.00]', '', '[00:22.25]Lasset uns singen'].join('\n');
    const r = parseLyrics(lrc);
    expect(r.format).toBe('lrc');
    expect(r.meta).toEqual({ title: 'Kuckuck', artist: 'Tradycyjna' });
    expect(r.lines.map((l) => [l.text, l.start, l.end])).toEqual([
      ['Kuckuck, Kuckuck', 10, 13.5],
      ["ruft's aus dem Wald", 13.5, 17.5], // ends at the empty (instrumental) line
      ['Lasset uns singen', 21.75, 29.5],
      ["ruft's aus dem Wald", 29.5, undefined],
    ]);
    expect(r.lines[2].stanza).toBe(true);
    expect(timingKind(r.lines)).toBe('line');
  });

  it('keeps word times of enhanced LRC exactly as given', () => {
    const r = parseLyrics('[00:01.00]<00:01.00>Alle <00:01.60>meine <00:02.20>Entchen\n[00:04.00]schwimmen');
    expect(r.lines[0].text).toBe('Alle meine Entchen');
    expect(r.lines[0].words).toEqual([
      { text: 'Alle', start: 1 },
      { text: 'meine', start: 1.6 },
      { text: 'Entchen', start: 2.2 },
    ]);
    expect(r.lines[1].words).toBeUndefined();
    expect(timingKind(r.lines)).toBe('word');
    expect(activeWordIndex(r.lines[0], 1.7)).toBe(1);
    expect(activeWordIndex(r.lines[0], 0.5)).toBe(-1);
  });

  it('does not invent word times for text before the first tag', () => {
    const r = parseLyrics('[00:01.00]Alle <00:01.60>meine\n[00:03.00]x');
    expect(r.lines[0].text).toBe('Alle meine');
    expect(r.lines[0].words).toBeUndefined();
  });

  it('falls back to plain text when an LRC-looking file has no times', () => {
    const r = parseLyrics('[ti:x]\n[ar:y]\nline one\nline two', 'lrc');
    expect(r.lines.map((l) => l.text)).toEqual(['line one', 'line two']);
    expect(r.lines[0].start).toBeUndefined();
  });

  it('reads SRT with markup and multi-line cues', () => {
    const srt = '1\n00:00:01,000 --> 00:00:03,500\n<i>Arroz con leche</i>\n\n2\n00:00:03,500 --> 00:00:06,000\nme quiero casar\ncon una señorita\n';
    const r = parseLyrics(srt);
    expect(r.format).toBe('srt');
    expect(r.lines.map((l) => [l.text, l.start, l.end])).toEqual([
      ['Arroz con leche', 1, 3.5],
      ['me quiero casar', 3.5, 6],
      ['con una señorita', 3.5, 6],
    ]);
  });

  it('reads WebVTT with cue settings, voices and karaoke timestamps', () => {
    const vtt = [
      'WEBVTT Kind: captions',
      '',
      'NOTE this is a comment',
      '',
      'cue-1',
      '00:01.000 --> 00:03.000 align:start position:10%',
      '<v Singer>Los <00:01.500>pollitos <00:02.200>dicen</v>',
      '',
      '00:00:03.000 --> 00:00:05.000',
      'pío, pío, pío &amp; más',
    ].join('\n');
    const r = parseLyrics(vtt);
    expect(r.format).toBe('vtt');
    expect(r.lines[0].text).toBe('Los pollitos dicen');
    expect(r.lines[0].words).toEqual([
      { text: 'Los', start: 1 },
      { text: 'pollitos', start: 1.5 },
      { text: 'dicen', start: 2.2 },
    ]);
    expect(r.lines[1]).toMatchObject({ text: 'pío, pío, pío & más', start: 3, end: 5 });
  });

  it('merges rolling captions that repeat the previous line', () => {
    const vtt = 'WEBVTT\n\n00:01.000 --> 00:02.000\nfirst line\n\n00:02.000 --> 00:04.000\nfirst line\nsecond line\n';
    const r = parseLyrics(vtt);
    expect(r.lines.map((l) => [l.text, l.start, l.end])).toEqual([
      ['first line', 1, 4],
      ['second line', 2, 4],
    ]);
  });

  it('parses timestamps', () => {
    expect(parseTimestamp('01:02.5')).toBe(62.5);
    expect(parseTimestamp('1:00:00,250')).toBe(3600.25);
    expect(parseTimestamp('nope')).toBeNull();
  });
});

describe('timing', () => {
  const lines = parseLyrics('[00:01.00]a\n[00:03.00]b\n[00:05.00]c').lines;

  it('finds the line being sung', () => {
    expect(activeLineIndex(lines, 0.5)).toBe(-1);
    expect(activeLineIndex(lines, 1)).toBe(0);
    expect(activeLineIndex(lines, 2.99)).toBe(0);
    expect(activeLineIndex(lines, 3)).toBe(1);
    expect(activeLineIndex(lines, 100)).toBe(2);
  });

  it('respects explicit ends (gaps between subtitles)', () => {
    const srt = parseLyrics('1\n00:00:01,000 --> 00:00:02,000\na\n\n2\n00:00:05,000 --> 00:00:06,000\nb').lines;
    expect(activeLineIndex(srt, 1.5)).toBe(0);
    expect(activeLineIndex(srt, 3)).toBe(-1);
    expect(activeLineIndex(srt, 5.5)).toBe(1);
    expect(activeLineIndex(srt, 7)).toBe(-1);
  });

  it('handles partial timing during tap-sync', () => {
    const partial = [
      { id: 'l1', text: 'a', start: 2 },
      { id: 'l2', text: 'b' },
      { id: 'l3', text: 'c', start: 8 },
    ];
    expect(activeLineIndex(partial, 3)).toBe(0);
    expect(activeLineIndex(partial, 9)).toBe(2);
    expect(lineEnd(partial, 0)).toBe(8);
    expect(activeLineIndex([{ id: 'l1', text: 'x' }], 3)).toBe(-1);
  });

  it('round-trips through LRC', () => {
    const lrc = toLrc(lines, { title: 'T' });
    expect(lrc).toContain('[ti:T]');
    expect(lrc).toContain('[0:01.00]a');
    expect(parseLyrics(lrc).lines.map((l) => [l.text, l.start])).toEqual(lines.map((l) => [l.text, l.start]));
  });
});

describe('editing', () => {
  it('keeps ids and translations of unchanged lines', () => {
    const before = [
      { id: 'l1', text: 'uno', pl: 'jeden', plBy: 'user' as const },
      { id: 'l2', text: 'dos' },
      { id: 'l3', text: 'tres', pl: 'trzy' },
    ];
    const after = reconcileLines(before, parseLyrics('dos\nuno\ncuatro').lines);
    expect(after.map((l) => [l.id, l.text, l.pl])).toEqual([
      ['l2', 'dos', undefined],
      ['l1', 'uno', 'jeden'],
      ['l4', 'cuatro', undefined],
    ]);
  });

  it('applies a pasted translation line by line', () => {
    const lines = parseLyrics('uno\ndos\ntres').lines;
    const r = applyTranslation(lines, 'jeden\n\ndwa');
    expect(r.lines.map((l) => l.pl)).toEqual(['jeden', 'dwa', undefined]);
    expect(r.lines[0].plBy).toBe('user');
    expect(r.missing).toBe(1);
    expect(r.extra).toBe(0);
  });
});
