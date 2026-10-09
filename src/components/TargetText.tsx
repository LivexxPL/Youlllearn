import type { CourseId } from '../content/types';
import { parseRuby, romajiFor } from '../engine/kana';
import { jaDisplay, parseRich } from '../content/text';
import { useSettings } from '../state/settings';
import { getCourse } from '../content/registry';
import { audio } from '../services/audio';
import { activity } from '../services/activity';

export function langTag(courseId: CourseId | 'pl'): string {
  return courseId === 'pl' ? 'pl' : getCourse(courseId).speechLang;
}

/** Renders target-language text: furigana, beginner spacing and optional romaji for Japanese. */
export function TargetText({
  text,
  courseId,
  romaji,
  showRomaji = false,
  reading,
  className = '',
}: {
  text: string;
  courseId: CourseId;
  romaji?: string;
  showRomaji?: boolean;
  reading?: string;
  className?: string;
}) {
  const { settings } = useSettings();
  if (courseId !== 'ja') {
    return (
      <span lang={langTag(courseId)} className={className}>
        {text}
      </span>
    );
  }
  const display = jaDisplay(text, settings.jaSpacing);
  const segments = parseRuby(display);
  const roma = showRomaji ? (romaji ?? (reading ? romajiFor(text, reading) : undefined)) : undefined;
  return (
    <span className={`tt ${className}`}>
      <span lang="ja" className="ja tt__text">
        {segments.map((s, i) =>
          s.ruby && settings.furigana ? (
            <ruby key={i}>
              {s.base}
              <rt>{s.ruby}</rt>
            </ruby>
          ) : (
            <span key={i}>{s.base}</span>
          ),
        )}
      </span>
      {roma && (
        <span className="tt__romaji" lang="ja-Latn">
          {roma}
        </span>
      )}
    </span>
  );
}

/** Explanation text with `**bold**` and tappable `[[target]]` phrases. */
export function RichText({ text, courseId }: { text: string; courseId: CourseId }) {
  return (
    <>
      {parseRich(text).map((seg, i) => {
        if (seg.kind === 'bold') return <strong key={i}>{seg.text}</strong>;
        if (seg.kind === 'target')
          return (
            <button
              key={i}
              type="button"
              className="inline-target"
              onClick={() => {
                activity.ping();
                audio.say(courseId, seg.text).catch(() => {});
              }}
            >
              <TargetText text={seg.text} courseId={courseId} />
            </button>
          );
        return <span key={i}>{seg.text}</span>;
      })}
    </>
  );
}
