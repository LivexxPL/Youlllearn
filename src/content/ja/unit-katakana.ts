import type { Item, Unit } from '../types';
import { contentHelpers } from '../helpers';
import { kanaItems } from './kana-items';

const { sentence: s } = contentHelpers('ja');

const w = (id: string, kana: string, pl: string, extra: Partial<Item> = {}): Item => ({
  id: `ja.w.${id}`,
  kind: 'word',
  text: kana,
  reading: kana,
  pl,
  ...extra,
});

const KATA_1 = ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ'];
const KATA_2 = ['タ', 'チ', 'ツ', 'テ', 'ト', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ'];
const KATA_3 = ['マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン'];

export const unitKatakana: Unit = {
  id: 'ja.u2',
  title: 'Katakana',
  description: 'Drugie pismo sylabiczne — do słów zapożyczonych i nazw obcych.',
  lessons: [
    {
      id: 'ja.l08',
      title: 'Katakana: ア–ソ',
      subtitle: 'アイウエオ・カキクケコ・サシスセソ',
      objective: 'Rozpoznasz pierwsze 15 znaków katakany i przeczytasz proste zapożyczenia z kreską wydłużenia ー.',
      level: 'Kana',
      minutes: 12,
      intro: [
        'Katakana zapisuje te same dźwięki co hiragana, ale innymi, bardziej kanciastymi znakami. Używa się jej do słów obcego pochodzenia, nazw zagranicznych i dla wyróżnienia.',
        'Skoro znasz hiraganę, uczysz się tylko nowych kształtów — dźwięki są te same.',
        'Kreska **ー** wydłuża poprzednią samogłoskę: ケーキ (kēki — ciasto).',
      ],
      items: [
        ...kanaItems('k', KATA_1),
        w('aisu', 'アイス', 'lody', { note: 'Z angielskiego „ice (cream)”.' }),
        w('keeki', 'ケーキ', 'ciasto; tort', { plAlts: ['ciasto', 'tort', 'ciastko'] }),
        w('sukii', 'スキー', 'narty; narciarstwo', { plAlts: ['narty', 'narciarstwo'] }),
        w('kokoa', 'ココア', 'kakao (napój)', { plAlts: ['kakao'] }),
        w('sakkaa', 'サッカー', 'piłka nożna', { plAlts: ['futbol'] }),
      ],
      sentences: [],
      grammar: [
        {
          id: 'ja.g.katakana-use',
          title: 'Kiedy katakana?',
          body: [
            'Katakaną zapisujemy: zapożyczenia ([[ケーキ]] — ciasto, z ang. cake), nazwy zagraniczne (ポーランド — Polska), imiona obcokrajowców, onomatopeje i słowa wyróżnione (jak kursywa).',
            'Japońska wymowa dopasowuje obce słowa do sylab kana: „cake” → ke-e-ki, „soccer” → sa-k-ka-a.',
            'Kreska [[ー]] (chōonpu) wydłuża samogłoskę — w hiraganie zamiast niej dopisuje się samogłoskę.',
          ],
          examples: [
            s('08-p1', 'ケーキ', 'ciasto', { romaji: 'keeki' }),
            s('08-p2', 'スキー', 'narty', { romaji: 'sukii' }),
            s('08-p3', 'サッカー', 'piłka nożna', { romaji: 'sakkaa' }),
          ],
        },
      ],
      exercises: [
        {
          type: 'choice',
          id: 'ja.x.08-1',
          prompt: 'Który znak to „shi”?',
          options: ['シ', 'ツ', 'ソ'],
          answer: 0,
          explanation: 'シ (shi): kreski leżą, długa idzie od dołu w górę. ツ (tsu): kreski stoją, długa idzie z góry w dół.',
        },
        {
          type: 'choice',
          id: 'ja.x.08-2',
          concept: 'ja.g.katakana-use',
          prompt: 'Co oznacza kreska ー w ケーキ?',
          options: ['Wydłużenie samogłoski', 'Pauzę', 'Koniec słowa'],
          answer: 0,
          explanation: 'ー wydłuża poprzednią samogłoskę: ke-e-ki.',
        },
        {
          type: 'choice',
          id: 'ja.x.08-3',
          concept: 'ja.g.katakana-use',
          prompt: 'Które słowo zapiszesz katakaną?',
          options: ['ciasto (z ang. cake)', 'góra', 'kwiat'],
          answer: 0,
          explanation: 'Zapożyczenia zapisujemy katakaną: ケーキ. Rodzime słowa — hiraganą lub kanji.',
        },
      ],
      writing: KATA_1,
      summary: [
        'ア イ ウ エ オ, カ キ ク ケ コ, サ シ ス セ ソ — te same dźwięki co w hiraganie.',
        'Katakana: zapożyczenia, nazwy obce, wyróżnienia.',
        'ー wydłuża samogłoskę: ケーキ, スキー.',
        'Uwaga na シ (shi) i ソ (so) — kierunek kresek ma znaczenie.',
      ],
    },
    {
      id: 'ja.l09',
      title: 'Katakana: タ–ホ',
      subtitle: 'タチツテト・ナニヌネノ・ハヒフヘホ',
      objective: 'Rozpoznasz kolejne 15 znaków katakany i przeczytasz codzienne zapożyczenia.',
      level: 'Kana',
      minutes: 12,
      items: [
        ...kanaItems('k', KATA_2),
        w('takushii', 'タクシー', 'taksówka'),
        w('tenisu', 'テニス', 'tenis'),
        w('nooto', 'ノート', 'zeszyt', { note: 'Z angielskiego „notebook”.' }),
        w('koohii', 'コーヒー', 'kawa'),
        w('nekutai', 'ネクタイ', 'krawat'),
      ],
      sentences: [
        s('09-1', 'コーヒーと ケーキ', 'kawa i ciasto', { romaji: 'koohii to keeki' }),
        s('09-2', 'テニスと サッカー', 'tenis i piłka nożna', { romaji: 'tenisu to sakkaa' }),
      ],
      grammar: [
        {
          id: 'ja.g.loan-sounds',
          title: 'Obce dźwięki w katakanie',
          body: [
            'Japoński nie ma osobnych spółgłosek na końcu sylaby (poza ん), więc obce słowa dostają dodatkowe samogłoski: „tennis” → [[テニス]] (te-ni-su), „taxi” → [[タクシー]] (ta-ku-shi-i).',
            'Słysząc zapożyczenie, spróbuj odgadnąć słowo angielskie — często to działa!',
          ],
          examples: [
            s('09-p1', 'タクシー', 'taksówka', { romaji: 'takushii' }),
            s('09-p2', 'テニス', 'tenis', { romaji: 'tenisu' }),
            s('09-p3', 'コーヒー', 'kawa', { romaji: 'koohii' }),
          ],
        },
      ],
      exercises: [
        {
          type: 'choice',
          id: 'ja.x.09-1',
          prompt: 'Który znak to „te”?',
          options: ['テ', 'チ', 'ナ'],
          answer: 0,
          explanation: 'テ (te) ma u góry dwie poziome kreski, チ (chi) — jedną ukośną.',
        },
        {
          type: 'choice',
          id: 'ja.x.09-2',
          concept: 'ja.g.loan-sounds',
          prompt: 'Co znaczy タクシー?',
          options: ['taksówka', 'tenis', 'zeszyt'],
          answer: 0,
          explanation: 'タクシー (takushii) — z angielskiego „taxi”.',
        },
        {
          type: 'choice',
          id: 'ja.x.09-3',
          prompt: 'Który znak to „tsu”?',
          options: ['ツ', 'シ', 'ソ'],
          answer: 0,
          explanation: 'ツ (tsu): dwie kreski stoją pionowo, długa kreska idzie z góry w dół.',
        },
      ],
      writing: KATA_2,
      summary: [
        'タ チ ツ テ ト, ナ ニ ヌ ネ ノ, ハ ヒ フ ヘ ホ.',
        'Zapożyczenia dostają dodatkowe samogłoski: テニス, タクシー.',
        'Słowa: タクシー, テニス, ノート, コーヒー, ネクタイ.',
      ],
    },
    {
      id: 'ja.l10',
      title: 'Katakana: マ–ン i dakuten',
      subtitle: 'マミムメモ・ヤユヨ・ラリルレロ・ワヲン',
      objective: 'Dokończysz katakanę i przeczytasz zapożyczenia z ゛ i ゜ — także nazwę Polski.',
      level: 'Kana',
      minutes: 12,
      intro: [
        'Dakuten ゛ i handakuten ゜ działają w katakanie tak samo jak w hiraganie: カ → ガ, ハ → バ, ハ → パ.',
        'Mały ッ podwaja spółgłoskę, a małe ャ ュ ョ tworzą połączenia — zupełnie jak w hiraganie.',
      ],
      items: [
        ...kanaItems('k', KATA_3),
        w('hoteru', 'ホテル', 'hotel'),
        w('kamera', 'カメラ', 'aparat fotograficzny', { plAlts: ['aparat', 'kamera'] }),
        w('raamen', 'ラーメン', 'ramen (zupa z makaronem)', { plAlts: ['ramen'] }),
        w('pan', 'パン', 'chleb; pieczywo', { plAlts: ['chleb', 'pieczywo', 'bułka'], note: 'Z portugalskiego „pão”.' }),
        w('poorando', 'ポーランド', 'Polska'),
        w('terebi', 'テレビ', 'telewizja; telewizor', { plAlts: ['telewizja', 'telewizor'] }),
        w('resutoran', 'レストラン', 'restauracja'),
      ],
      sentences: [
        s('10-1', 'ポーランドの パン', 'polski chleb', { romaji: 'poorando no pan', plAlts: ['chleb z Polski'] }),
        s('10-2', 'ホテルの レストラン', 'restauracja hotelowa', { romaji: 'hoteru no resutoran', plAlts: ['restauracja w hotelu'] }),
      ],
      grammar: [
        {
          id: 'ja.g.katakana-marks',
          title: 'Znaki dodatkowe w katakanie',
          body: [
            '゛ i ゜: [[テレビ]] (terebi), [[パン]] (pan), [[ポーランド]] (poorando).',
            'Mały ッ: [[サッカー]]. Kreska ー: [[ラーメン]].',
            'W zapożyczeniach pojawiają się też nowe połączenia, np. ファ (fa), ティ (ti) — poznasz je z czasem.',
          ],
          examples: [
            s('10-p1', 'ポーランド', 'Polska', { romaji: 'poorando' }),
            s('10-p2', 'レストラン', 'restauracja', { romaji: 'resutoran' }),
          ],
        },
      ],
      exercises: [
        {
          type: 'choice',
          id: 'ja.x.10-1',
          prompt: 'Który znak to „n”?',
          options: ['ン', 'ソ', 'シ'],
          answer: 0,
          explanation: 'ン (n): krótka kreska prawie pozioma, długa idzie od dołu w górę. ソ (so) — długa idzie z góry w dół.',
        },
        {
          type: 'choice',
          id: 'ja.x.10-2',
          concept: 'ja.g.katakana-marks',
          prompt: 'Jak zapiszesz „Polska”?',
          options: ['ポーランド', 'ボーランド', 'ホーランド'],
          answer: 0,
          explanation: 'Po-o-ra-n-do: ポ ma kółeczko ゜ (p), a ド — dakuten ゛ (d).',
        },
        {
          type: 'choice',
          id: 'ja.x.10-3',
          prompt: 'Który znak to „ru”?',
          options: ['ル', 'レ', 'ロ'],
          answer: 0,
          explanation: 'ル (ru) ma dwie kreski; レ (re) to tylko jej prawa część.',
        },
      ],
      writing: KATA_3,
      summary: [
        'マ ミ ム メ モ, ヤ ユ ヨ, ラ リ ル レ ロ, ワ ヲ ン.',
        '゛ ゜ ッ ャ ュ ョ ー działają jak w hiraganie.',
        'Słowa: ホテル, カメラ, ラーメン, パン, ポーランド, テレビ, レストラン.',
      ],
      followUp: 'Znasz już oba alfabety sylabiczne! W kolejnych lekcjach zaczynamy rozmawiać.',
    },
  ],
};
