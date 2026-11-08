/**
 * Interactive lyrics: tappable words, furigana, kana reading, romaji and translation lines,
 * the line being sung highlighted, and a karaoke view. Word or syllable highlighting is shown
 * only when the imported file had word timing.
 */
import { memo, useEffect, useRef } from 'react';
import { AlertTriangle, MoreHorizontal, Sparkles } from 'lucide-react';
import type { CourseId } from '../../content/types';
import { chunkTokens, isContentToken, isSpace, readingLine, romajiLine, rubySegments, type JaToken } from '../../music/japanese/tokens';
import { formatTime } from '../../music/lyrics';
import { splitWords, wordKey } from '../../music/vocab';
import type { LyricLine, Song, WordStatus } from '../../music/types';
import { t } from '../../i18n';
import { prefersReducedMotion } from '../../services/platform';

export interface LyricsDisplay {
  furigana: boolean;
  reading: boolean;
  romaji: boolean;
  translation: boolean;
}

export interface WordTap {
  lineId: string;
  /** Japanese: index of the chunk's first token; other languages: character offset. */
  at: number;
}

interface LineProps {
  line: LyricLine;
  index: number;
  lang: CourseId;
  tokens?: readonly JaToken[];
  display: LyricsDisplay;
  active: boolean;
  timed: boolean;
  statusOf: (key: string) => WordStatus | undefined;
  onWord: (tap: WordTap) => void;
  onLine: (lineId: string) => void;
  onSeek: (index: number) => void;
}

function Ruby({ token, furigana }: { token: JaToken; furigana: boolean }) {
  if (!furigana) return <>{token.s}</>;
  return (
    <>
      {rubySegments(token).map((seg, i) =>
        seg.ruby ? (
          <ruby key={i}>
            {seg.base}
            <rt>{seg.ruby}</rt>
          </ruby>
        ) : (
          <span key={i}>{seg.base}</span>
        ),
      )}
    </>
  );
}

function statusClass(s: WordStatus | undefined) {
  return s === 'known' ? ' lw--known' : s === 'learning' ? ' lw--learning' : '';
}

function JapaneseText({ line, tokens, display, statusOf, onWord }: Pick<LineProps, 'line' | 'display' | 'statusOf' | 'onWord'> & { tokens: readonly JaToken[] }) {
  return (
    <>
      {chunkTokens(tokens).map((c) => {
        const head = tokens[c.head];
        const parts = tokens.slice(c.from, c.to);
        if (isSpace(tokens[c.from])) return <span key={c.from}> </span>;
        if (!isContentToken(head)) {
          return (
            <span key={c.from} className="lt">
              {parts.map((tok, i) => (
                <Ruby key={i} token={tok} furigana={display.furigana} />
              ))}
            </span>
          );
        }
        return (
          <button key={c.from} type="button" className={`lw${statusClass(statusOf(head.base))}`} onClick={() => onWord({ lineId: line.id, at: c.from })}>
            {parts.map((tok, i) => (
              <Ruby key={i} token={tok} furigana={display.furigana} />
            ))}
          </button>
        );
      })}
    </>
  );
}

function WordText({ line, lang, statusOf, onWord }: Pick<LineProps, 'line' | 'lang' | 'statusOf' | 'onWord'>) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const { word, at } of splitWords(line.text)) {
    if (at > last) out.push(line.text.slice(last, at));
    out.push(
      <button key={at} type="button" className={`lw${statusClass(statusOf(wordKey(lang, word)))}`} onClick={() => onWord({ lineId: line.id, at })}>
        {word}
      </button>,
    );
    last = at + word.length;
  }
  if (last < line.text.length) out.push(line.text.slice(last));
  return <>{out}</>;
}

const LineView = memo(function LineView({ line, index, lang, tokens, display, active, timed, statusOf, onWord, onLine, onSeek }: LineProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const margin = window.innerHeight * 0.25;
    // Follow the song only when the line leaves the comfortable middle of the screen.
    if (rect.top < margin || rect.bottom > window.innerHeight - margin) {
      el.scrollIntoView({ block: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  }, [active]);
  const ja = lang === 'ja' && tokens?.length;
  return (
    <div
      ref={ref}
      className={`lyric${active ? ' is-active' : ''}${line.stanza ? ' lyric--stanza' : ''}`}
      aria-current={active ? 'true' : undefined}
      data-testid={`lyric-${line.id}`}
    >
      <div className="lyric__side">
        {timed && line.start !== undefined ? (
          <button type="button" className="lyric__time" onClick={() => onSeek(index)} aria-label={t('music.line.playFrom', { time: formatTime(line.start) })}>
            {formatTime(line.start).replace(/\.\d+$/, '')}
          </button>
        ) : (
          <span className="lyric__time lyric__time--none" aria-hidden="true" />
        )}
      </div>
      <div className="lyric__body">
        <p className="lyric__text" lang={lang}>
          {ja ? (
            <JapaneseText line={line} tokens={tokens!} display={display} statusOf={statusOf} onWord={onWord} />
          ) : lang === 'ja' ? (
            // Japanese has no spaces between words: words become tappable after the analysis.
            line.text
          ) : (
            <WordText line={line} lang={lang} statusOf={statusOf} onWord={onWord} />
          )}
        </p>
        {ja && display.reading && (
          <p className="lyric__reading" lang="ja">
            {readingLine(tokens!)}
          </p>
        )}
        {ja && display.romaji && <p className="lyric__romaji">{romajiLine(tokens!)}</p>}
        {display.translation && line.pl && (
          <p className="lyric__pl">
            {line.plBy === 'ai' && (
              <span className="chip chip--ai" title={t('music.ai.label')}>
                <Sparkles size={12} /> AI
              </span>
            )}
            {line.uncertain && <AlertTriangle size={14} className="lyric__uncertain" aria-label={t('music.ai.uncertain')} />}
            {line.pl}
          </p>
        )}
      </div>
      <button type="button" className="icon-btn lyric__more" onClick={() => onLine(line.id)} aria-label={t('music.line.more')} data-testid={`line-more-${line.id}`}>
        <MoreHorizontal size={20} />
      </button>
    </div>
  );
});

export function LyricsList(props: Omit<LineProps, 'line' | 'index' | 'active' | 'tokens'> & { song: Song; active: number; tokens?: Record<string, JaToken[]> }) {
  const { song, active, tokens, ...rest } = props;
  return (
    <div className="lyrics" data-testid="lyrics">
      {song.lines.map((line, i) => (
        <LineView key={line.id} line={line} index={i} active={i === active} tokens={tokens?.[line.id]} {...rest} />
      ))}
    </div>
  );
}

/** Big current line with its neighbours; syllables light up only with word timing from the file. */
export function KaraokeView({
  song,
  active,
  wordIndex,
  progress,
  tokens,
  display,
}: {
  song: Song;
  active: number;
  wordIndex: number;
  progress: number;
  tokens?: Record<string, JaToken[]>;
  display: LyricsDisplay;
}) {
  const line = song.lines[active];
  const prev = active > 0 ? song.lines[active - 1] : undefined;
  const next = song.lines[active + 1] ?? (active < 0 ? song.lines.find((l) => l.start !== undefined) : undefined);
  const lineTokens = line ? tokens?.[line.id] : undefined;
  return (
    <div className="karaoke" data-testid="karaoke" aria-live="off">
      <p className="karaoke__side" lang={song.lang}>
        {prev?.text ?? ' '}
      </p>
      <div className="karaoke__now" lang={song.lang}>
        {!line ? (
          <span className="subtle">♪</span>
        ) : line.words?.length ? (
          line.words.map((w, i) => (
            <span key={i} className={`karaoke__word${i <= wordIndex ? ' is-sung' : ''}`}>
              {w.text}
              {song.lang === 'ja' ? '' : ' '}
            </span>
          ))
        ) : lineTokens?.length ? (
          lineTokens.map((tok, i) => <Ruby key={i} token={tok} furigana={display.furigana} />)
        ) : (
          line.text
        )}
      </div>
      {line && <div className="karaoke__bar" style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress))})` }} aria-hidden="true" />}
      {line && song.lang === 'ja' && lineTokens && display.romaji && <p className="karaoke__romaji">{romajiLine(lineTokens)}</p>}
      {line?.pl && display.translation && <p className="karaoke__pl">{line.pl}</p>}
      <p className="karaoke__side" lang={song.lang}>
        {next?.text ?? ' '}
      </p>
    </div>
  );
}
