/**
 * Speech recognition (optional, off by default in settings).
 *
 * - Web: Web Speech API SpeechRecognition (Chrome/Edge implement it by
 *   sending audio to the vendor's cloud service — it needs internet and is
 *   not private). Firefox does not implement it.
 * - Android: @capacitor-community/speech-recognition (Android
 *   SpeechRecognizer; may work offline when the language pack is installed).
 *
 * The result is only "what the recogniser understood". It is shown as such
 * and never presented as a pronunciation score.
 */
import { SpeechRecognition as NativeSR } from '@capacitor-community/speech-recognition';
import { isNative } from '../platform';
import { canonicalKana, kataToHira, stripRuby } from '../../engine/kana';
import { normalize } from '../../engine/answer';

export interface RecognitionResult {
  transcript: string;
  alternatives: string[];
}

interface WebSpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

function webCtor(): (new () => WebSpeechRecognition) | null {
  const w = window as unknown as { SpeechRecognition?: new () => WebSpeechRecognition; webkitSpeechRecognition?: new () => WebSpeechRecognition };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export async function recognitionAvailable(): Promise<boolean> {
  if (isNative()) {
    try {
      return (await NativeSR.available()).available;
    } catch {
      return false;
    }
  }
  return webCtor() !== null;
}

let activeWeb: WebSpeechRecognition | null = null;

export async function recognizeOnce(lang: string, timeoutMs = 8000): Promise<RecognitionResult> {
  if (isNative()) {
    const perm = await NativeSR.checkPermissions();
    if (perm.speechRecognition !== 'granted') {
      const req = await NativeSR.requestPermissions();
      if (req.speechRecognition !== 'granted') throw new Error('permission-denied');
    }
    const { matches = [] } = await NativeSR.start({ language: lang, maxResults: 3, partialResults: false, popup: false });
    return { transcript: matches[0] ?? '', alternatives: matches };
  }
  const Ctor = webCtor();
  if (!Ctor) throw new Error('unsupported');
  return new Promise<RecognitionResult>((resolve, reject) => {
    const rec = new Ctor();
    activeWeb = rec;
    rec.lang = lang;
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    rec.continuous = false;
    let settled = false;
    const timer = setTimeout(() => rec.stop(), timeoutMs);
    rec.onresult = (e) => {
      const alts = Array.from(e.results[0] ?? []).map((r) => r.transcript);
      settled = true;
      clearTimeout(timer);
      resolve({ transcript: alts[0] ?? '', alternatives: alts });
    };
    rec.onerror = (e) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new Error(e.error));
    };
    rec.onend = () => {
      activeWeb = null;
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve({ transcript: '', alternatives: [] });
      }
    };
    rec.start();
  });
}

export function stopRecognition() {
  if (isNative()) NativeSR.stop().catch(() => {});
  activeWeb?.stop();
}

export interface MatchReport {
  /** Words of the model found in the transcript (for space-separated languages). */
  matched: number;
  total: number;
  /** Japanese: transcript equals the model after normalisation. */
  exact: boolean;
  /** Per-word flags for highlighting. */
  words: { word: string; ok: boolean }[];
}

/**
 * Compares a transcript with the model sentence. For Japanese, recognisers
 * may return kanji where the model is in kana (or vice versa), so we compare
 * against both the written form and the reading when available.
 */
export function compareTranscript(model: string, transcripts: string[], lang: 'es' | 'de' | 'ja', reading?: string): MatchReport {
  if (lang === 'ja') {
    const targets = [stripRuby(model), reading ?? ''].filter(Boolean).map((t) => canonicalKana(normalize(t, 'ja')));
    const exact = transcripts.some((tr) => targets.includes(canonicalKana(kataToHira(normalize(tr, 'ja')))));
    return { matched: exact ? 1 : 0, total: 1, exact, words: [{ word: stripRuby(model), ok: exact }] };
  }
  const modelWords = normalize(model, lang).split(' ').filter(Boolean);
  let best: { word: string; ok: boolean }[] = modelWords.map((w) => ({ word: w, ok: false }));
  for (const tr of transcripts) {
    const heard = new Set(normalize(tr, lang).split(' '));
    const words = modelWords.map((w) => ({ word: w, ok: heard.has(w) }));
    if (words.filter((w) => w.ok).length > best.filter((w) => w.ok).length) best = words;
  }
  const matched = best.filter((w) => w.ok).length;
  return { matched, total: modelWords.length, exact: matched === modelWords.length, words: best };
}
