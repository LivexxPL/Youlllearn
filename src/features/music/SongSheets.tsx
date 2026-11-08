/**
 * Word and line details: meaning (course, own or AI, always labelled), reading and romaji,
 * form, review status, reading corrections, translation editing and grammar notes.
 */
import { useMemo, useState } from 'react';
import { BookmarkPlus, Check, CheckCircle2, Pencil, Play, Repeat, Sparkles, Volume2 } from 'lucide-react';
import type { CourseId } from '../../content/types';
import { getCourse } from '../../content/registry';
import { Sheet } from '../../components/ui';
import { SpeakIcon } from '../../components/AudioButton';
import { TargetText } from '../../components/TargetText';
import { useToast } from '../../components/Toasts';
import { t } from '../../i18n';
import { chunkTokens, fixKey, formLabel, hepburn, readingLine, romajiLine, rubyMarkup, tokenReading, type JaToken } from '../../music/japanese/tokens';
import { courseDictionary, lineWords, wordInfo, type SongWord } from '../../music/vocab';
import { shortLevel } from '../../music/difficulty';
import { lineNotes, displayLine } from '../../music/exercises';
import { sortForLevel, type FoundNote } from '../../music/grammar';
import type { LyricLine, Song, WordEntry } from '../../music/types';
import { addWordToReviews, LIMITS, setWordMeaning, setWordStatus, updateSong } from '../../services/music';
import { activity } from '../../services/activity';
import type { WordTap } from './LyricsView';
import { kataToHira, toHiragana, looksLikeRomaji } from '../../engine/kana';

export function findWord(song: Song, tap: WordTap, tokens?: Record<string, JaToken[]>): { word: SongWord; line: LyricLine } | null {
  const line = song.lines.find((l) => l.id === tap.lineId);
  if (!line) return null;
  const word = lineWords(song.lang, line.id, line.text, tokens?.[line.id]).find((w) => w.at === tap.at);
  return word ? { word, line } : null;
}

function SourceChip({ by, level }: { by: 'user' | 'ai' | 'course' | undefined; level?: string }) {
  if (by === 'course') return <span className="chip chip--success">{t('music.word.fromCourse', { level: level ? shortLevel(level) : '' })}</span>;
  if (by === 'ai')
    return (
      <span className="chip chip--ai">
        <Sparkles size={12} /> {t('music.word.fromAi')}
      </span>
    );
  return <span className="chip">{t('music.word.fromYou')}</span>;
}

export function WordSheet({
  song,
  tap,
  tokens,
  entries,
  onClose,
}: {
  song: Song;
  tap: WordTap | null;
  tokens?: Record<string, JaToken[]>;
  entries: Map<string, WordEntry>;
  onClose: () => void;
}) {
  const found = tap ? findWord(song, tap, tokens) : null;
  return (
    <Sheet open={Boolean(found)} onClose={onClose} title={found ? t('music.word.title') : undefined}>
      {found && <WordDetails key={`${found.line.id}:${found.word.at}`} song={song} word={found.word} line={found.line} tokens={tokens} entries={entries} />}
    </Sheet>
  );
}

function WordDetails({ song, word, line, tokens, entries }: { song: Song; word: SongWord; line: LyricLine; tokens?: Record<string, JaToken[]>; entries: Map<string, WordEntry> }) {
  const toast = useToast();
  const lang: CourseId = song.lang;
  const dict = courseDictionary(getCourse(lang));
  const info = wordInfo(word, dict, entries, lang);
  const gloss = song.glosses?.[word.key];
  const meaning = info.meaning ?? gloss;
  const meaningBy = info.meaning ? info.meaningBy : gloss ? 'ai' : undefined;
  const status = info.entry?.status;
  const [draft, setDraft] = useState(info.entry?.pl ?? '');
  const [editing, setEditing] = useState(!meaning);
  const mark = { lang, word, songId: song.id, lineId: line.id };
  const lineTokens = tokens?.[line.id];
  const chunk = lang === 'ja' && lineTokens ? chunkTokens(lineTokens).find((c) => c.from === word.at) : undefined;
  const head = chunk && lineTokens ? lineTokens[chunk.head] : undefined;
  const form = chunk && lineTokens ? formLabel(lineTokens, chunk) : '';
  const reading = word.reading;

  const saveMeaning = async () => {
    activity.ping();
    await setWordMeaning(mark, draft, 'user');
    setEditing(false);
    toast(t('music.word.saved'), 'success');
  };
  const addToReviews = async () => {
    activity.ping();
    const typed = draft.trim();
    const courseWord = Boolean(info.course && !info.course.guess);
    if (!info.entry?.pl && !courseWord && !typed && !gloss) {
      setEditing(true);
      toast(t('music.word.needMeaning'));
      return;
    }
    // A word outside the course needs its meaning saved first: the learner's own, or the AI
    // assistant's (kept labelled as AI).
    if (!info.entry?.pl && !courseWord) await setWordMeaning(mark, typed || gloss!, typed ? 'user' : 'ai');
    const res = await addWordToReviews(mark, undefined);
    toast(res.created ? t('music.word.added') : t('music.word.alreadyInReviews'), 'success');
  };
  const toggleKnown = async () => {
    activity.ping();
    await setWordStatus(mark, status === 'known' ? 'new' : 'known');
  };

  return (
    <div className="stack word-sheet" data-testid="word-sheet">
      <div className="word-sheet__head">
        <div className="word-sheet__lemma" lang={lang}>
          {lang === 'ja' && reading ? <TargetText text={rubyMarkup(word.lemma, reading)} courseId="ja" /> : word.lemma}
        </div>
        <SpeakIcon courseId={lang} content={{ text: word.lemma, reading }} label={t('music.word.listen')} />
      </div>
      <p className="muted word-sheet__meta">
        {[reading && reading !== word.lemma ? reading : null, reading ? hepburn(reading) : null, word.pos, form || null].filter(Boolean).join(' · ')}
      </p>
      {word.surface !== word.lemma && (
        <p className="subtle">
          {t('music.word.inSong')} <span lang={lang}>{word.surface}</span>
        </p>
      )}

      <div className="word-sheet__meaning" data-testid="word-meaning">
        {meaning ? (
          <>
            <p className="word-sheet__pl">{meaning}</p>
            <SourceChip by={meaningBy} level={info.course?.level} />
            {meaningBy === 'ai' && <p className="subtle">{t('music.word.aiNote')}</p>}
          </>
        ) : (
          <p className="muted">{t('music.word.noMeaning')}</p>
        )}
        {info.course?.guess && (
          <p className="subtle">
            {t('music.word.similar')} <TargetText text={info.course.item.text} courseId={lang} /> — {info.course.item.pl}
          </p>
        )}
      </div>

      {editing ? (
        <div className="row">
          <input
            className="input grow"
            value={draft}
            maxLength={LIMITS.meaning}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('music.word.meaningPlaceholder')}
            aria-label={t('music.word.meaningLabel')}
            data-testid="word-meaning-input"
          />
          <button type="button" className="btn btn--outline" onClick={saveMeaning} disabled={!draft.trim() && !info.entry?.pl}>
            {t('common.save')}
          </button>
        </div>
      ) : (
        <button type="button" className="btn btn--sm btn--ghost" onClick={() => setEditing(true)}>
          <Pencil size={16} /> {t('music.word.editMeaning')}
        </button>
      )}

      <div className="row row--wrap">
        {status === 'learning' ? (
          <span className="chip chip--success" data-testid="word-in-reviews">
            <Check size={14} /> {t('music.word.inReviews')}
          </span>
        ) : (
          <button type="button" className="btn btn--primary" onClick={addToReviews} data-testid="word-add">
            <BookmarkPlus size={18} /> {t('music.word.add')}
          </button>
        )}
        <button type="button" className={`btn ${status === 'known' ? 'btn--accent' : 'btn--outline'}`} aria-pressed={status === 'known'} onClick={toggleKnown} data-testid="word-known">
          <CheckCircle2 size={18} /> {t('music.word.known')}
        </button>
      </div>

      {lang === 'ja' && head && chunk && <ReadingFix song={song} line={line} index={chunk.head} token={head} />}
    </div>
  );
}

function ReadingFix({ song, line, index, token }: { song: Song; line: LyricLine; index: number; token: JaToken }) {
  const current = tokenReading(token);
  const [value, setValue] = useState(current);
  const toast = useToast();
  if (!/[一-鿿々]/.test(token.s)) return null;
  const save = async () => {
    const hira = kataToHira(looksLikeRomaji(value) ? toHiragana(value) : value).trim();
    if (!/^[ぁ-ゟー]+$/.test(hira)) {
      toast(t('music.reading.invalid'));
      return;
    }
    const lineFixes = { ...(song.readings?.[line.id] ?? {}), [fixKey(index, token)]: hira };
    await updateSong(song.id, { readings: { ...(song.readings ?? {}), [line.id]: lineFixes } });
    toast(t('music.reading.saved'), 'success');
  };
  return (
    <details className="details">
      <summary>{t('music.reading.fix')}</summary>
      <p className="subtle">{t('music.reading.why')}</p>
      <div className="row">
        <input className="input grow" lang="ja" value={value} onChange={(e) => setValue(e.target.value)} aria-label={t('music.reading.label', { word: token.s })} data-testid="reading-input" />
        <button type="button" className="btn btn--outline" onClick={save}>
          {t('common.save')}
        </button>
      </div>
    </details>
  );
}

function NoteList({ notes }: { notes: FoundNote[] }) {
  return (
    <ul className="notes">
      {notes.map((n) => (
        <li key={n.note.id} className="note">
          <div className="row row--between">
            <strong>{n.note.title}</strong>
            <span className="chip">{n.note.level}</span>
          </div>
          <p>{n.note.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function GrammarNotes({ notes, learnerRank }: { notes: FoundNote[]; learnerRank: number }) {
  const { now, later } = sortForLevel(notes, learnerRank);
  if (!notes.length) return <p className="subtle">{t('music.grammar.none')}</p>;
  return (
    <div className="stack">
      {now.length > 0 && <NoteList notes={now} />}
      {later.length > 0 && (
        <details className="details">
          <summary>{t('music.grammar.later', { count: later.length })}</summary>
          <NoteList notes={later} />
        </details>
      )}
      <p className="subtle">{t('music.grammar.auto')}</p>
    </div>
  );
}

export function LineSheet({
  song,
  lineId,
  tokens,
  learnerRank,
  canPlay,
  looping,
  onPlay,
  onLoop,
  onClose,
}: {
  song: Song;
  lineId: string | null;
  tokens?: Record<string, JaToken[]>;
  learnerRank: number;
  canPlay: boolean;
  looping: boolean;
  onPlay: (lineId: string) => void;
  onLoop: (lineId: string) => void;
  onClose: () => void;
}) {
  const line = song.lines.find((l) => l.id === lineId);
  const index = line ? song.lines.indexOf(line) : -1;
  return (
    <Sheet open={Boolean(line)} onClose={onClose} title={line ? t('music.line.title', { n: index + 1 }) : undefined}>
      {line && (
        <LineDetails
          key={line.id}
          song={song}
          line={line}
          tokens={tokens?.[line.id]}
          learnerRank={learnerRank}
          canPlay={canPlay}
          looping={looping}
          onPlay={() => onPlay(line.id)}
          onLoop={() => onLoop(line.id)}
        />
      )}
    </Sheet>
  );
}

function LineDetails({
  song,
  line,
  tokens,
  learnerRank,
  canPlay,
  looping,
  onPlay,
  onLoop,
}: {
  song: Song;
  line: LyricLine;
  tokens?: JaToken[];
  learnerRank: number;
  canPlay: boolean;
  looping: boolean;
  onPlay: () => void;
  onLoop: () => void;
}) {
  const toast = useToast();
  const [draft, setDraft] = useState(line.pl ?? '');
  const [editing, setEditing] = useState(false);
  const notes = useMemo(() => lineNotes(song.lang, line, tokens), [song.lang, line, tokens]);
  const save = async () => {
    const pl = draft.trim().slice(0, LIMITS.lineLength);
    const lines = song.lines.map((l) => {
      if (l.id !== line.id) return l;
      const next: LyricLine = { ...l, plBy: 'user' };
      if (pl) next.pl = pl;
      else delete next.pl;
      delete next.literal;
      delete next.aiNote;
      delete next.uncertain;
      return next;
    });
    await updateSong(song.id, { lines });
    setEditing(false);
    toast(t('music.word.saved'), 'success');
  };
  return (
    <div className="stack" data-testid="line-sheet">
      <div className="line-sheet__text" lang={song.lang}>
        <TargetText text={displayLine(line, tokens)} courseId={song.lang} />
      </div>
      {tokens && (
        <p className="muted">
          <span lang="ja">{readingLine(tokens)}</span>
          <br />
          {romajiLine(tokens)}
        </p>
      )}
      <div className="row row--wrap">
        {canPlay ? (
          <>
            <button type="button" className="btn btn--outline btn--sm" onClick={onPlay}>
              <Play size={16} /> {t('music.line.play')}
            </button>
            <button type="button" className={`btn btn--sm ${looping ? 'btn--accent' : 'btn--outline'}`} aria-pressed={looping} onClick={onLoop}>
              <Repeat size={16} /> {t('music.line.loop')}
            </button>
          </>
        ) : (
          <SpeakIcon courseId={song.lang} content={line.text} label={t('music.line.tts')} />
        )}
      </div>

      <section className="stack">
        <h3 className="section-title">{t('music.line.translation')}</h3>
        {line.pl && !editing && (
          <>
            <p>
              {line.plBy === 'ai' && (
                <span className="chip chip--ai">
                  <Sparkles size={12} /> AI
                </span>
              )}{' '}
              {line.pl}
            </p>
            {line.literal && <p className="subtle">{t('music.line.literal', { text: line.literal })}</p>}
            {line.aiNote && <p className="subtle">{line.aiNote}</p>}
            {line.uncertain && <p className="banner banner--warn">{t('music.ai.uncertain')}</p>}
            {line.plBy === 'ai' && <p className="subtle">{t('music.ai.lineNote')}</p>}
          </>
        )}
        {!line.pl && !editing && <p className="subtle">{t('music.line.noTranslation')}</p>}
        {editing ? (
          <div className="stack">
            <textarea className="input" rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} aria-label={t('music.line.translation')} data-testid="line-translation-input" />
            <div className="row">
              <button type="button" className="btn btn--primary btn--sm" onClick={save}>
                {t('common.save')}
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEditing(false)}>
                {t('common.cancel')}
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEditing(true)}>
            <Pencil size={16} /> {line.pl ? t('music.line.editTranslation') : t('music.line.addTranslation')}
          </button>
        )}
      </section>

      <section className="stack">
        <h3 className="section-title">{t('music.grammar.title')}</h3>
        <GrammarNotes notes={notes} learnerRank={learnerRank} />
      </section>
      <p className="subtle">
        <Volume2 size={14} /> {canPlay ? t('music.line.playNote') : t('music.line.ttsNote')}
      </p>
    </div>
  );
}
