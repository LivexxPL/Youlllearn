import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Download, Gauge, Info, Minus, Plus, Sparkles, Timer, Trash2 } from 'lucide-react';
import { db } from '../../services/db';
import { updateSong } from '../../services/music';
import { getCourse } from '../../content/registry';
import { navigate } from '../../app/router';
import { t, formatPercent } from '../../i18n';
import { ProgressBar, Segmented } from '../../components/ui';
import { TargetText } from '../../components/TargetText';
import { courseDictionary, wordEntryId } from '../../music/vocab';
import { songDifficulty, shortLevel, COVERAGE_TARGET } from '../../music/difficulty';
import { lineNotes } from '../../music/exercises';
import { levelRank, type FoundNote } from '../../music/grammar';
import { timingKind, toLrc } from '../../music/lyrics';
import { rubyMarkup, type JaToken } from '../../music/japanese/tokens';
import type { PracticeWord } from '../../music/exercises';
import type { Song, WordEntry } from '../../music/types';
import type { WordTap } from './LyricsView';
import { AiCard } from './AiPanel';

type WordFilter = 'all' | 'new' | 'learning' | 'known';

export function WordsTab({
  song,
  words,
  entries,
  analysis,
  onOpen,
}: {
  song: Song;
  words: PracticeWord[];
  entries: Map<string, WordEntry>;
  analysis: string;
  onOpen: (tap: WordTap) => void;
}) {
  const [filter, setFilter] = useState<WordFilter>('all');
  const unique = useMemo(() => {
    const map = new Map<string, PracticeWord & { count: number }>();
    for (const w of words) {
      const cur = map.get(w.word.key);
      if (cur) cur.count += 1;
      else map.set(w.word.key, { ...w, count: 1 });
    }
    return [...map.values()];
  }, [words]);
  if (song.lang === 'ja' && analysis !== 'ready') return <p className="subtle">{t('music.words.waiting')}</p>;
  const statusOf = (key: string) => entries.get(wordEntryId(song.lang, key))?.status;
  const shown = unique.filter((w) => {
    const s = statusOf(w.word.key);
    if (filter === 'known') return s === 'known';
    if (filter === 'learning') return s === 'learning';
    if (filter === 'new') return s !== 'known' && s !== 'learning';
    return true;
  });
  const counts = {
    known: unique.filter((w) => statusOf(w.word.key) === 'known').length,
    learning: unique.filter((w) => statusOf(w.word.key) === 'learning').length,
  };
  return (
    <div className="stack" data-testid="words-tab">
      <p className="muted">{t('music.words.summary', { total: unique.length, learning: counts.learning, known: counts.known })}</p>
      <Segmented<WordFilter>
        label={t('music.words.filter')}
        value={filter}
        onChange={setFilter}
        options={(['all', 'new', 'learning', 'known'] as WordFilter[]).map((f) => ({ value: f, label: t(`music.words.f.${f}`) }))}
      />
      <ul className="list music-words">
        {shown.map((w) => {
          const s = statusOf(w.word.key);
          return (
            <li key={w.word.key}>
              <button type="button" className="list-row music-word" onClick={() => onOpen({ lineId: w.word.lineId, at: w.word.at })}>
                <div className="list-row__body">
                  <div className="list-row__title" lang={song.lang}>
                    {song.lang === 'ja' ? <TargetText text={rubyMarkup(w.word.lemma, w.word.reading)} courseId="ja" /> : w.word.lemma}
                    {w.count > 1 && <span className="subtle"> ×{w.count}</span>}
                  </div>
                  <div className="list-row__desc">{w.meaning ?? t('music.words.noMeaning')}</div>
                </div>
                {s === 'learning' && <span className="chip chip--success">{t('music.words.f.learning')}</span>}
                {s === 'known' && <span className="chip">{t('music.words.f.known')}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {!shown.length && <p className="subtle">{t('music.words.empty')}</p>}
    </div>
  );
}

export function GrammarTab({ song, tokens, learnerRank, onLine }: { song: Song; tokens?: Record<string, JaToken[]>; learnerRank: number; onLine: (lineId: string) => void }) {
  const notes = useMemo(() => {
    const map = new Map<string, { found: FoundNote; lines: string[] }>();
    for (const line of song.lines) {
      if (song.lang === 'ja' && !tokens) continue;
      for (const f of lineNotes(song.lang, line, tokens?.[line.id])) {
        const cur = map.get(f.note.id);
        if (cur) cur.lines.push(line.id);
        else map.set(f.note.id, { found: f, lines: [line.id] });
      }
    }
    return [...map.values()].sort((a, b) => levelRank(a.found.note.level) - levelRank(b.found.note.level) || b.lines.length - a.lines.length);
  }, [song, tokens]);
  if (song.lang === 'ja' && !tokens) return <p className="subtle">{t('music.words.waiting')}</p>;
  const now = notes.filter((n) => levelRank(n.found.note.level) <= learnerRank);
  const later = notes.filter((n) => levelRank(n.found.note.level) > learnerRank);
  const render = (list: typeof notes) => (
    <ul className="notes">
      {list.map(({ found, lines }) => (
        <li key={found.note.id} className="note">
          <div className="row row--between">
            <strong>{found.note.title}</strong>
            <span className="chip">{found.note.level}</span>
          </div>
          <p>{found.note.body}</p>
          <div className="row row--wrap note__lines">
            <span className="subtle">{t('music.grammar.inLines')}</span>
            {lines.slice(0, 8).map((id) => (
              <button key={id} type="button" className="chip chip--active" onClick={() => onLine(id)}>
                {song.lines.findIndex((l) => l.id === id) + 1}
              </button>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="stack" data-testid="grammar-tab">
      <p className="muted">{t('music.grammar.intro')}</p>
      {now.length > 0 && (
        <>
          <h3 className="section-title">{t('music.grammar.now')}</h3>
          {render(now)}
        </>
      )}
      {later.length > 0 && (
        <>
          <h3 className="section-title">{t('music.grammar.forLater')}</h3>
          {render(later)}
        </>
      )}
      {!notes.length && <p className="subtle">{t('music.grammar.none')}</p>}
      <p className="subtle">{t('music.grammar.auto')}</p>
    </div>
  );
}

export function AboutTab({
  song,
  words,
  tokens,
  entries,
  ttsOk,
  onDelete,
}: {
  song: Song;
  words: PracticeWord[];
  tokens?: Record<string, JaToken[]>;
  entries: Map<string, WordEntry>;
  ttsOk: boolean;
  onDelete: () => void;
}) {
  const cards = useLiveQuery(() => db.cards.where('courseId').equals(song.lang).toArray(), [song.lang]);
  const course = getCourse(song.lang);
  const difficulty = useMemo(() => {
    if (song.lang === 'ja' && !tokens) return null;
    return songDifficulty({
      lang: song.lang,
      course,
      dict: courseDictionary(course),
      words: words.map((w) => w.word),
      lineTexts: song.lines.map((l) => l.text),
      entries,
      cards: new Map((cards ?? []).map((c) => [c.id, c])),
    });
  }, [song, tokens, course, words, entries, cards]);
  const timing = timingKind(song.lines);
  const translated = song.lines.filter((l) => l.pl).length;
  const aiLines = song.lines.filter((l) => l.plBy === 'ai').length;

  const download = () => {
    const blob = new Blob([toLrc(song.lines, { title: song.title, artist: song.artist })], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${song.title.replace(/[\\/:*?"<>|]+/g, '_') || 'tekst'}.lrc`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return (
    <div className="stack" data-testid="about-tab">
      <section className="card stack">
        <h3 className="section-title">
          <Gauge size={18} /> {t('music.level.title')}
        </h3>
        {!difficulty ? (
          <p className="subtle">{t('music.words.waiting')}</p>
        ) : difficulty.estimate === null ? (
          <p className="muted">{t('music.level.tooShort')}</p>
        ) : (
          <>
            <p className="music-level" data-testid="song-level">
              {difficulty.estimate === 'beyond' ? t('music.level.beyond') : t('music.level.estimate', { level: song.lang === 'ja' ? `${shortLevel(difficulty.estimate)} (${difficulty.estimate})` : difficulty.estimate })}
            </p>
            <ul className="music-coverage">
              {difficulty.levels.map((l) => (
                <li key={l.level}>
                  <span>{t('music.level.upTo', { level: shortLevel(l.level) })}</span>
                  <ProgressBar value={l.cumulative} max={1} thin label={l.level} />
                  <span className="subtle">{formatPercent(l.cumulative)}</span>
                </li>
              ))}
            </ul>
            <p className="subtle">{t('music.level.outside', { share: formatPercent(difficulty.outside) })}</p>
          </>
        )}
        {difficulty && (
          <ul className="music-facts">
            <li>{t('music.level.lines', { count: difficulty.lines })}</li>
            <li>{t('music.level.words', { count: difficulty.words, unique: difficulty.unique })}</li>
            <li>{t('music.level.known', { share: formatPercent(difficulty.known) })}</li>
            {difficulty.kanji !== undefined && <li>{t('music.level.kanji', { count: difficulty.kanji })}</li>}
          </ul>
        )}
        <p className="subtle">
          <Info size={14} /> {t('music.level.method', { target: formatPercent(COVERAGE_TARGET) })}
        </p>
      </section>

      <AiCard song={song} words={words} tokens={tokens} />

      <section className="card stack">
        <h3 className="section-title">
          <Timer size={18} /> {t('music.about.timing')}
        </h3>
        <p className="muted">{t(`music.about.timing.${timing}`)}</p>
        {song.videoId && timing !== 'none' && (
          <div className="row row--wrap">
            <span>{t('music.about.delay', { value: (song.delay >= 0 ? '+' : '') + song.delay.toFixed(2) })}</span>
            <button type="button" className="icon-btn" aria-label={t('music.about.earlier')} onClick={() => updateSong(song.id, { delay: Math.round((song.delay - 0.25) * 100) / 100 })}>
              <Minus size={18} />
            </button>
            <button type="button" className="icon-btn" aria-label={t('music.about.later')} onClick={() => updateSong(song.id, { delay: Math.round((song.delay + 0.25) * 100) / 100 })}>
              <Plus size={18} />
            </button>
          </div>
        )}
        {song.videoId && (
          <button type="button" className="btn btn--outline btn--sm" onClick={() => navigate(`/music/song/${song.id}/sync`)}>
            <Timer size={16} /> {t('music.controls.sync')}
          </button>
        )}
        <p className="subtle">{t('music.about.translation', { done: translated, total: song.lines.length })}</p>
        {aiLines > 0 && (
          <p className="subtle">
            <Sparkles size={14} /> {t('music.about.aiLines', { count: aiLines })}
          </p>
        )}
        {!ttsOk && <p className="subtle">{t('music.about.noTts')}</p>}
      </section>

      <section className="card stack">
        <h3 className="section-title">{t('music.about.yourText')}</h3>
        <p className="subtle">{song.sample ? song.sample.source : t('music.about.rights')}</p>
        <div className="row row--wrap">
          <button type="button" className="btn btn--outline btn--sm" onClick={download}>
            <Download size={16} /> {t('music.about.download')}
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onDelete} data-testid="song-delete">
            <Trash2 size={16} /> {t('music.song.delete')}
          </button>
        </div>
      </section>
    </div>
  );
}
