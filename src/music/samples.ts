/**
 * Public-domain sample songs, to try Music Lab without pasting anything. Only traditional
 * songs (or lyricists who died long ago) are included; the Polish translations were written
 * for this app. The samples have no video: a learner can attach any YouTube recording.
 *
 * - どんぐりころころ — lyrics by Aoki Nagayoshi (1879–1935), published 1921.
 * - Los pollitos dicen — traditional (Spanish-speaking America, 19th century).
 * - Alle meine Entchen — traditional German children's song (19th century).
 */
import type { CourseId } from '../content/types';
import type { LyricLine } from './types';

export interface SampleSong {
  id: string;
  lang: CourseId;
  title: string;
  artist: string;
  source: string;
  lines: { text: string; pl: string; stanza?: boolean }[];
  /** Japanese: reading corrections (`${lineIndex}:${tokenIndex}:${surface}` → hiragana). */
  readings?: Record<string, string>;
}

export const SAMPLES: SampleSong[] = [
  {
    id: 'donguri',
    lang: 'ja',
    title: 'どんぐりころころ',
    artist: 'Tradycyjna (sł. Aoki Nagayoshi, 1921)',
    source: 'Tekst z 1921 r., autor zmarł w 1935 r. — domena publiczna.',
    lines: [
      { text: 'どんぐりころころ どんぶりこ', pl: 'Żołądź turla się, turlu-turlu, i plum!' },
      { text: 'お池にはまって さあ大変', pl: 'Wpadł do stawu — ale kłopot!' },
      { text: 'どじょうが出て来て 今日は', pl: 'Wypłynął piskorz: „Dzień dobry!”' },
      { text: '坊ちゃん一緒に 遊びましょう', pl: '„Paniczu, pobawmy się razem!”' },
      { text: 'どんぐりころころ よろこんで', pl: 'Żołądź turlu-turlu, uradowany,', stanza: true },
      { text: 'しばらく一緒に 遊んだが', pl: 'przez chwilę bawił się razem z nim, ale' },
      { text: 'やっぱりお山が 恋しいと', pl: 'jednak tęsknił za swoją górą' },
      { text: '泣いてはどじょうを 困らせた', pl: 'i płakał, aż piskorz nie wiedział, co robić.' },
    ],
    // 今日は is the greeting こんにちは here, not "today" (きょう) + は.
    readings: { '2:7:今日': 'こんにち' },
  },
  {
    id: 'pollitos',
    lang: 'es',
    title: 'Los pollitos dicen',
    artist: 'Tradycyjna',
    source: 'Pieśń tradycyjna (XIX w.) — domena publiczna.',
    lines: [
      { text: 'Los pollitos dicen', pl: 'Kurczaczki mówią' },
      { text: 'pío, pío, pío,', pl: 'pi, pi, pi,' },
      { text: 'cuando tienen hambre,', pl: 'kiedy są głodne,' },
      { text: 'cuando tienen frío.', pl: 'kiedy jest im zimno.' },
      { text: 'La gallina busca', pl: 'Kura szuka', stanza: true },
      { text: 'el maíz y el trigo,', pl: 'kukurydzy i pszenicy,' },
      { text: 'les da la comida', pl: 'daje im jedzenie' },
      { text: 'y les presta abrigo.', pl: 'i ogrzewa je (dosł. użycza im okrycia).' },
      { text: 'Bajo sus dos alas,', pl: 'Pod jej dwoma skrzydłami,', stanza: true },
      { text: 'acurrucaditos,', pl: 'przytulone,' },
      { text: 'duermen los pollitos', pl: 'śpią kurczaczki' },
      { text: 'hasta el otro día.', pl: 'aż do następnego dnia.' },
    ],
  },
  {
    id: 'entchen',
    lang: 'de',
    title: 'Alle meine Entchen',
    artist: 'Tradycyjna',
    source: 'Niemiecka piosenka tradycyjna (XIX w.) — domena publiczna.',
    lines: [
      { text: 'Alle meine Entchen', pl: 'Wszystkie moje kaczuszki' },
      { text: 'schwimmen auf dem See,', pl: 'pływają po jeziorze,' },
      { text: 'schwimmen auf dem See,', pl: 'pływają po jeziorze,' },
      { text: 'Köpfchen in das Wasser,', pl: 'główki do wody,' },
      { text: "Schwänzchen in die Höh'.", pl: 'ogonki w górę.' },
      { text: 'Alle meine Täubchen', pl: 'Wszystkie moje gołąbki', stanza: true },
      { text: 'gurren auf dem Dach,', pl: 'gruchają na dachu,' },
      { text: 'gurren auf dem Dach,', pl: 'gruchają na dachu,' },
      { text: 'fliegt eins in die Lüfte,', pl: 'gdy jeden wzleci w powietrze,' },
      { text: 'fliegen alle nach.', pl: 'wszystkie lecą za nim.' },
    ],
  },
];

export function sampleLines(sample: SampleSong): LyricLine[] {
  return sample.lines.map((l, i) => ({ id: `l${i + 1}`, text: l.text, pl: l.pl, ...(l.stanza ? { stanza: true } : {}) }));
}

/** Reading corrections of a sample keyed by line id, as stored on the song. */
export function sampleReadings(sample: SampleSong): Record<string, Record<string, string>> | undefined {
  if (!sample.readings) return undefined;
  const out: Record<string, Record<string, string>> = {};
  for (const [key, reading] of Object.entries(sample.readings)) {
    const [line, ...rest] = key.split(':');
    const lineId = `l${Number(line) + 1}`;
    out[lineId] = { ...out[lineId], [rest.join(':')]: reading };
  }
  return out;
}
