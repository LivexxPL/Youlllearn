import { useEffect, useMemo, useRef, useState } from 'react';
import { Info, Mic, Play, Square, Turtle, Volume2 } from 'lucide-react';
import type { StepProps, ExerciseOf } from './types';
import { ActionBar } from './ActionBar';
import { t } from '../../i18n';
import { TargetText } from '../../components/TargetText';
import { useSpeaker } from '../../components/AudioButton';
import { useSettings } from '../../state/settings';
import { VoiceRecorder, playUrl, recorderSupported } from '../../services/audio/recorder';
import { compareTranscript, recognitionAvailable, recognizeOnce, type MatchReport } from '../../services/audio/speech';
import { getCourse } from '../../content/registry';
import { kataToHira, rubyToKana, stripRuby } from '../../engine/kana';
import { activity } from '../../services/activity';
import type { SelfRating } from '../../engine/srs';
import type { Speed } from '../../services/audio';

/** Splits kana into morae: small ゃゅょぁぃぅぇぉ attach to the previous kana; っ, ん and ー are morae of their own. */
export function splitMorae(kana: string): string[] {
  const out: string[] = [];
  for (const ch of kana.replace(/\s/g, '')) {
    if (/[ゃゅょぁぃぅぇぉャュョァィゥェォ]/.test(ch) && out.length) out[out.length - 1] += ch;
    else if (/[、。！？!?]/.test(ch)) continue;
    else out.push(ch);
  }
  return out;
}

export function SpeakStep({ ex, courseId, locked, showRomaji, onResult }: StepProps<ExerciseOf<'speak'>>) {
  const { settings } = useSettings();
  const speak = useSpeaker(courseId);
  const course = getCourse(courseId);
  const recorder = useRef<VoiceRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [myUrl, setMyUrl] = useState<string | null>(null);
  const [srAvailable, setSrAvailable] = useState(false);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState<{ transcript: string; report: MatchReport } | null>(null);
  const [srError, setSrError] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const content = { text: ex.text, tts: ex.item?.tts ?? ex.sentence?.tts, reading: ex.item?.reading, kind: ex.item?.kind };
  const reading = ex.item?.reading ?? (courseId === 'ja' ? rubyToKana(ex.text) : undefined);
  const morae = useMemo(() => (courseId === 'ja' && reading ? splitMorae(kataToHira(reading)) : null), [courseId, reading]);

  useEffect(() => {
    if (settings.speechRecognition) recognitionAvailable().then(setSrAvailable);
    const id = setTimeout(() => speak(content, 'normal'), 300);
    return () => {
      clearTimeout(id);
      recorder.current?.release();
    };
  }, [ex.key]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleRecord = async () => {
    activity.ping();
    if (!recorder.current) recorder.current = new VoiceRecorder();
    if (recording) {
      const url = await recorder.current.stop().catch(() => null);
      setRecording(false);
      if (url) setMyUrl(url);
      return;
    }
    try {
      await recorder.current.start();
      setRecording(true);
    } catch {
      setSrError(t('speak.noMic'));
    }
  };

  const recognize = async () => {
    activity.ping();
    setListening(true);
    setSrError(null);
    try {
      const r = await recognizeOnce(course.speechLang);
      const lang = courseId;
      const report = compareTranscript(stripRuby(ex.text), r.alternatives.length ? r.alternatives : [r.transcript], lang, reading);
      setHeard({ transcript: r.transcript, report });
    } catch (e) {
      setSrError(e instanceof Error && e.message === 'permission-denied' ? t('speak.noMic') : t('speak.recognitionUnavailable'));
    } finally {
      setListening(false);
    }
  };

  const shadow = async () => {
    const speeds: Speed[] = ['slow', 'normal', 'natural'];
    for (let i = 0; i < speeds.length; i++) {
      setRound(i + 1);
      activity.setListening(true);
      await speak(content, speeds[i]);
      await new Promise((r) => setTimeout(r, 700));
    }
    activity.setListening(false);
    setRound(0);
  };

  const rate = (selfRating: SelfRating) => onResult({ correct: selfRating !== 'again', selfRating, silent: true });

  return (
    <div className="step">
      <p className="step__instruction">{ex.mode === 'shadow' ? t('ex.shadow') : t('ex.speak')}</p>
      <div className="prompt">
        <div className="prompt__text">
          <TargetText text={ex.text} courseId={courseId} romaji={ex.romaji} showRomaji={showRomaji} reading={reading} />
        </div>
        <p className="muted">{ex.translation}</p>
        {morae && (
          <p className="morae" aria-label={t('speak.morae')}>
            <span className="eyebrow">{t('speak.morae')}</span>{' '}
            {morae.map((m, i) => (
              <span key={i} className="mora" lang="ja">
                {m}
              </span>
            ))}
          </p>
        )}
        <div className="row row--wrap" style={{ justifyContent: 'center' }}>
          <button type="button" className="btn btn--outline" onClick={() => speak(content, 'normal')}>
            <Volume2 size={18} /> {t('speak.playModel')}
          </button>
          <button type="button" className="btn btn--outline" onClick={() => speak(content, 'slow')}>
            <Turtle size={18} /> {t('speak.repeatSlow')}
          </button>
          {ex.mode === 'shadow' && (
            <button type="button" className="btn btn--primary" onClick={shadow} disabled={round > 0}>
              <Play size={18} /> {round ? t('speak.shadowRound', { n: round, total: 3 }) : t('aq.shadowing')}
            </button>
          )}
        </div>
        {ex.mode === 'shadow' && <p className="subtle">{t('speak.shadowIntro')}</p>}
      </div>

      <div className="speak-tools">
        {recorderSupported() && (
          <div className="row row--wrap" style={{ justifyContent: 'center' }}>
            <button type="button" className={`btn ${recording ? 'btn--danger' : 'btn--outline'}`} onClick={toggleRecord} data-testid="record">
              {recording ? <Square size={18} /> : <Mic size={18} />} {recording ? t('speak.stop') : t('speak.record')}
            </button>
            {myUrl && (
              <button type="button" className="btn btn--outline" onClick={() => playUrl(myUrl)}>
                <Play size={18} /> {t('speak.playMine')}
              </button>
            )}
          </div>
        )}
        {srAvailable && (
          <div className="stack stack--s">
            <button type="button" className="btn btn--outline" onClick={recognize} disabled={listening}>
              <Mic size={18} /> {listening ? t('speak.listening') : t('speak.recognize')}
            </button>
            <p className="subtle">{t('speak.recognitionOnline')}</p>
          </div>
        )}
        {heard && (
          <div className="card card--tint stack stack--s" aria-live="polite">
            <p>{t('speak.heard', { text: heard.transcript || '—' })}</p>
            {courseId === 'ja' ? (
              <p>{heard.report.exact ? t('speak.matchJa') : t('speak.noMatch')}</p>
            ) : (
              <p>
                {t('speak.match', { matched: heard.report.matched, total: heard.report.total })}{' '}
                {heard.report.words.map((w, i) => (
                  <span key={i} className={`heard-word${w.ok ? ' is-ok' : ''}`}>
                    {w.word}
                  </span>
                ))}
              </p>
            )}
            <p className="subtle">
              <Info size={14} /> {t('speak.disclaimer')}
            </p>
          </div>
        )}
        {srError && <p className="subtle">{srError}</p>}
      </div>

      <ActionBar hidden={locked}>
        <p className="action-bar__label">{t('speak.selfAssess')}</p>
        <div className="row">
          <button type="button" className="btn btn--outline grow" onClick={() => rate('again')}>
            {t('speak.selfAgain')}
          </button>
          <button type="button" className="btn btn--outline grow" onClick={() => rate('hard')}>
            {t('speak.selfOk')}
          </button>
          <button type="button" className="btn btn--primary grow" onClick={() => rate('good')} data-testid="speak-good">
            {t('speak.selfGood')}
          </button>
        </div>
      </ActionBar>
    </div>
  );
}
