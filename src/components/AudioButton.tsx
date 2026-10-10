import { useEffect, useRef, useState } from 'react';
import { Turtle, Volume2 } from 'lucide-react';
import type { CourseId } from '../content/types';
import { audio, type ListeningStage, type Speed, type VoiceSlot } from '../services/audio';
import { activity } from '../services/activity';
import { t } from '../i18n';
import { useAudioStatus, useListeningStage } from '../state/hooks';
import { getCourse } from '../content/registry';

export interface Speakable {
  text: string;
  tts?: string;
  reading?: string;
  kind?: string;
}

export function useSpeaker(courseId: CourseId) {
  const stage = useListeningStage(courseId);
  return (content: Speakable | string, speed: Speed = 'normal', opts: { slot?: VoiceSlot; accent?: string; stage?: ListeningStage } = {}) => {
    activity.ping();
    return audio.say(courseId, content, { speed, stage: opts.stage ?? stage, slot: opts.slot, accent: opts.accent }).catch((e) => {
      console.warn('speech failed', e);
    });
  };
}

/** Large circular play button + optional slow button. */
export function AudioButton({
  courseId,
  content,
  autoPlay = false,
  size = 'm',
  withSlow = true,
  label,
  accent,
  onPlayed,
}: {
  courseId: CourseId;
  content: Speakable | string;
  autoPlay?: boolean;
  size?: 's' | 'm' | 'l';
  withSlow?: boolean;
  label?: string;
  accent?: string;
  onPlayed?: () => void;
}) {
  const speak = useSpeaker(courseId);
  const status = useAudioStatus(accent ?? getCourse(courseId).speechLang);
  const [active, setActive] = useState<Speed | null>(null);
  const played = useRef(false);
  /** Latest playback; an older one that was replaced (e.g. normal → slow) must not reset the state. */
  const playback = useRef(0);
  const key = typeof content === 'string' ? content : content.text;

  const play = async (speed: Speed) => {
    const id = ++playback.current;
    setActive(speed);
    await speak(content, speed, { accent });
    if (playback.current !== id) return;
    setActive(null);
    onPlayed?.();
  };

  useEffect(() => {
    played.current = false;
  }, [key]);

  useEffect(() => {
    if (!autoPlay || played.current || status === 'unsupported') return;
    played.current = true;
    const id = setTimeout(() => play('normal'), 250);
    return () => {
      clearTimeout(id);
      audio.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, key]);

  const disabled = status === 'unsupported';
  const dim = size === 'l' ? 88 : size === 'm' ? 64 : 48;
  return (
    <div className="audio-btns">
      <button
        type="button"
        className={`audio-btn audio-btn--${size}${active === 'normal' ? ' is-playing' : ''}`}
        style={{ width: dim, height: dim }}
        onClick={() => play('normal')}
        disabled={disabled}
        aria-label={label ?? t('common.play')}
        title={t('common.play')}
      >
        <Volume2 size={dim * 0.45} />
      </button>
      {withSlow && (
        <button
          type="button"
          className={`audio-btn audio-btn--slow${active === 'slow' ? ' is-playing' : ''}`}
          onClick={() => play('slow')}
          disabled={disabled}
          aria-label={t('common.slow')}
          title={t('common.slow')}
        >
          <Turtle size={22} />
        </button>
      )}
    </div>
  );
}

/** Compact inline speaker icon used in lists. */
export function SpeakIcon({ courseId, content, label }: { courseId: CourseId; content: Speakable | string; label?: string }) {
  const speak = useSpeaker(courseId);
  return (
    <button type="button" className="icon-btn" onClick={() => speak(content)} aria-label={label ?? t('common.play')}>
      <Volume2 size={20} />
    </button>
  );
}
