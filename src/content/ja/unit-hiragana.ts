import type { Item, Unit } from '../types';
import { contentHelpers } from '../helpers';
import { kanaItems } from './kana-items';

const { sentence: s } = contentHelpers('ja');

/** Japanese word written in kana. */
const w = (id: string, kana: string, pl: string, extra: Partial<Item> = {}): Item => ({
  id: `ja.w.${id}`,
  kind: 'word',
  text: kana,
  reading: kana,
  pl,
  ...extra,
});

const ROW_A_KA = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ'];
const ROW_SA_TA = ['さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と'];
const ROW_NA_HA = ['な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ'];
const ROW_MA_YA_RA = ['ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ'];
const ROW_WA_GA_ZA = ['わ', 'を', 'ん', 'が', 'ぎ', 'ぐ', 'げ', 'ご', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ'];
const ROW_DA_BA_PA = ['だ', 'で', 'ど', 'ば', 'び', 'ぶ', 'べ', 'ぼ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'];

export const unitHiragana: Unit = {
  id: 'ja.u1',
  title: 'Hiragana',
  description: 'Podstawowe pismo japońskie, dźwięki i rytm mor.',
  lessons: [
    {
      id: 'ja.l01',
      title: 'Hiragana: あ–こ',
      subtitle: 'あいうえお・かきくけこ',
      objective: 'Rozpoznasz i przeczytasz pierwsze 10 znaków hiragany oraz poznasz rytm japońskich sylab.',
      level: 'Kana',
      minutes: 10,
      intro: [
        'Japoński zapisuje się trzema rodzajami znaków: **hiraganą** (słowa rodzime i końcówki gramatyczne), **katakaną** (słowa zapożyczone) i **kanji** (znaki pochodzenia chińskiego). Zaczynamy od hiragany.',
        'Każdy znak hiragany to jedna **mora** — jednostka rytmu. Wszystkie mory trwają mniej więcej tyle samo, więc japoński brzmi równo, „jak metronom”.',
        'Samogłoski a, i, u, e, o brzmią prawie jak polskie. Uwaga: **u** wymawia się z mniej zaokrąglonymi ustami niż polskie „u”.',
      ],
      items: [
        ...kanaItems('h', ROW_A_KA),
        w('ai', 'あい', 'miłość'),
        w('ie', 'いえ', 'dom'),
        w('kao', 'かお', 'twarz'),
        w('eki', 'えき', 'stacja'),
        w('aki', 'あき', 'jesień'),
      ],
      sentences: [],
      grammar: [
        {
          id: 'ja.g.mora',
          title: 'Mora — rytm japońskiego',
          body: [
            'Mora to jednostka rytmu. Każdy znak kana to jedna mora: か・お (kao — 2 mory), え・き (eki — 2 mory).',
            'Japoński nie ma mocnego akcentu wydechowego jak polski. Zamiast tego ma akcent tonalny (zmiana wysokości głosu). Na start wystarczy mówić równo, każdą morę tak samo długo.',
          ],
          examples: [
            s('01-m1', 'あい', 'miłość', { romaji: 'ai', note: '2 mory: a・i' }),
            s('01-m2', 'いえ', 'dom', { romaji: 'ie', note: '2 mory: i・e' }),
            s('01-m3', 'あおい', 'niebieski', { romaji: 'aoi', note: '3 mory: a・o・i' }),
          ],
          contrast: 'Po polsku akcentujemy przedostatnią sylabę mocniej. W japońskim mory są równe — „a-o-i”, bez wyróżniania jednej z nich.',
        },
        {
          id: 'ja.g.stroke-order',
          title: 'Kolejność kresek',
          body: [
            'Znaki pisze się w ustalonej kolejności kresek: zwykle **z góry na dół** i **od lewej do prawej**, poziome kreski przed pionowymi, które je przecinają.',
            'Poprawna kolejność sprawia, że pismo wygląda naturalnie i łatwiej je zapamiętać. W ćwiczeniach pisania zobaczysz animację kolejności każdego znaku.',
          ],
        },
      ],
      exercises: [
        {
          type: 'choice',
          id: 'ja.x.01-1',
          concept: 'ja.g.mora',
          prompt: 'Ile mor ma słowo かお (twarz)?',
          options: ['2', '1', '3'],
          answer: 0,
          explanation: 'Każdy znak kana to jedna mora: か・お = 2 mory.',
        },
        {
          type: 'choice',
          id: 'ja.x.01-2',
          prompt: 'Który znak to „o”?',
          options: ['お', 'あ', 'こ'],
          answer: 0,
          explanation: 'お (o) ma dodatkową kreskę po prawej stronie. あ to „a”.',
        },
        {
          type: 'choice',
          id: 'ja.x.01-3',
          concept: 'ja.g.stroke-order',
          prompt: 'Jaka jest ogólna zasada kolejności kresek?',
          options: ['Z góry na dół, od lewej do prawej', 'Z dołu do góry, od prawej do lewej', 'Dowolna'],
          answer: 0,
          explanation: 'Zasadniczo piszemy z góry na dół i od lewej do prawej.',
        },
      ],
      writing: ROW_A_KA,
      summary: [
        'あ a, い i, う u, え e, お o.',
        'か ka, き ki, く ku, け ke, こ ko.',
        'Każdy znak to jedna mora; mory mają równą długość.',
        'Pierwsze słowa: あい (miłość), いえ (dom), かお (twarz), えき (stacja), あき (jesień).',
      ],
    },
    {
      id: 'ja.l02',
      title: 'Hiragana: さ–と',
      subtitle: 'さしすせそ・たちつてと',
      objective: 'Przeczytasz kolejne 10 znaków, w tym nieregularne し (shi), ち (chi) i つ (tsu).',
      level: 'Kana',
      minutes: 10,
      intro: [
        'W tych rzędach są trzy „wyjątki” wymowy: し to „shi” (bliżej polskiego „si”), ち to „chi” (podobnie do „ći”), つ to „tsu” (jak „cu”).',
      ],
      items: [
        ...kanaItems('h', ROW_SA_TA),
        w('sushi', 'すし', 'sushi'),
        w('isu', 'いす', 'krzesło'),
        w('uta', 'うた', 'piosenka'),
        w('kutsu', 'くつ', 'buty'),
        w('chikatetsu', 'ちかてつ', 'metro'),
      ],
      sentences: [],
      grammar: [
        {
          id: 'ja.g.shi-chi-tsu',
          title: 'Shi, chi, tsu',
          body: [
            'W rzędzie s- i t- trzy znaki nie pasują do wzoru: [[し]] = shi (nie si), [[ち]] = chi (nie ti), [[つ]] = tsu (nie tu).',
            'W polskich uszach: し brzmi podobnie do „si/śi”, ち do „ći”, a つ do „cu”.',
          ],
          examples: [
            s('02-p1', 'すし', 'sushi', { romaji: 'sushi' }),
            s('02-p2', 'ちかてつ', 'metro', { romaji: 'chikatetsu' }),
            s('02-p3', 'くつ', 'buty', { romaji: 'kutsu' }),
          ],
        },
      ],
      exercises: [
        {
          type: 'choice',
          id: 'ja.x.02-1',
          concept: 'ja.g.shi-chi-tsu',
          prompt: 'Jak czyta się つ?',
          options: ['tsu', 'tu', 'shi'],
          answer: 0,
          explanation: 'つ czytamy „tsu” (podobnie do polskiego „cu”).',
        },
        {
          type: 'choice',
          id: 'ja.x.02-2',
          prompt: 'Który znak to „sa”?',
          options: ['さ', 'ち', 'き'],
          answer: 0,
          explanation: 'さ (sa) — dolny łuk otwiera się w prawo. ち (chi) ma łuk otwarty w lewo, き (ki) ma dwie poziome kreski.',
        },
        {
          type: 'choice',
          id: 'ja.x.02-3',
          concept: 'ja.g.shi-chi-tsu',
          prompt: 'Jak zapiszesz „shi”?',
          options: ['し', 'つ', 'そ'],
          answer: 0,
          explanation: 'し to „shi” — jedna kreska jak haczyk. つ to „tsu”.',
        },
      ],
      writing: ROW_SA_TA,
      summary: [
        'さ sa, し shi, す su, せ se, そ so.',
        'た ta, ち chi, つ tsu, て te, と to.',
        'Wyjątki: し = shi, ち = chi, つ = tsu.',
        'Słowa: すし, いす, うた, くつ, ちかてつ.',
      ],
    },
    {
      id: 'ja.l03',
      title: 'Hiragana: な–ほ',
      subtitle: 'なにぬねの・はひふへほ',
      objective: 'Przeczytasz znaki rzędów n- i h- oraz odróżnisz podobne do siebie ぬ i め, は i ほ.',
      level: 'Kana',
      minutes: 10,
      intro: ['ふ czytamy „fu” — to dźwięk pomiędzy „f” i „h”, wymawiany lekko, bez zagryzania wargi.'],
      items: [
        ...kanaItems('h', ROW_NA_HA),
        w('neko', 'ねこ', 'kot'),
        w('inu', 'いぬ', 'pies'),
        w('hana', 'はな', 'kwiat'),
        w('hito', 'ひと', 'człowiek; osoba', { plAlts: ['człowiek', 'osoba'] }),
        w('hoshi', 'ほし', 'gwiazda'),
      ],
      sentences: [
        s('03-1', 'ねこと いぬ', 'kot i pies', { romaji: 'neko to inu', note: 'と = i (łączy rzeczowniki)' }),
        s('03-2', 'はなと ほし', 'kwiat i gwiazda', { romaji: 'hana to hoshi' }),
      ],
      grammar: [
        {
          id: 'ja.g.fu',
          title: 'Fu i rząd h-',
          body: [
            'W rzędzie h- tylko [[ふ]] jest nieregularne: czytamy „fu”, a nie „hu”. To miękki dźwięk — usta jak do dmuchania na świeczkę.',
            '[[ひ]] (hi) brzmi bardziej miękko niż polskie „hi” — trochę jak niemieckie „ich”.',
          ],
          examples: [
            s('03-p1', 'ふね', 'statek', { romaji: 'fune' }),
            s('03-p2', 'ひと', 'człowiek', { romaji: 'hito' }),
          ],
        },
      ],
      exercises: [
        {
          type: 'choice',
          id: 'ja.x.03-1',
          prompt: 'Który znak to „nu”?',
          options: ['ぬ', 'め', 'ね'],
          answer: 0,
          explanation: 'ぬ (nu) kończy się pętelką. め (me) — bez pętelki.',
        },
        {
          type: 'choice',
          id: 'ja.x.03-2',
          prompt: 'Który znak to „ho”?',
          options: ['ほ', 'は', 'け'],
          answer: 0,
          explanation: 'ほ (ho) ma po prawej dwie poziome kreski, は (ha) — jedną.',
        },
        {
          type: 'choice',
          id: 'ja.x.03-3',
          concept: 'ja.g.fu',
          prompt: 'Jak czyta się ふ?',
          options: ['fu', 'hu', 'pu'],
          answer: 0,
          explanation: 'ふ to „fu” — miękkie, bez zagryzania wargi.',
        },
      ],
      writing: ROW_NA_HA,
      summary: [
        'な na, に ni, ぬ nu, ね ne, の no.',
        'は ha, ひ hi, ふ fu, へ he, ほ ho.',
        'Uwaga na pary: ぬ / め, は / ほ.',
        'Słowa: ねこ, いぬ, はな, ひと, ほし; と = i.',
      ],
    },
    {
      id: 'ja.l04',
      title: 'Hiragana: ま–ろ',
      subtitle: 'まみむめも・やゆよ・らりるれろ',
      objective: 'Przeczytasz rzędy m-, y- i r- oraz poznasz japońskie „r”.',
      level: 'Kana',
      minutes: 11,
      intro: [
        'Japońskie „r” to jedno lekkie uderzenie języka — coś pomiędzy polskim „r”, „l” i „d”. Nie wibruje.',
        'Rząd y- ma tylko trzy znaki: や ya, ゆ yu, よ yo.',
      ],
      items: [
        ...kanaItems('h', ROW_MA_YA_RA),
        w('yama', 'やま', 'góra'),
        w('umi', 'うみ', 'morze'),
        w('kuruma', 'くるま', 'samochód'),
        w('yoru', 'よる', 'noc; wieczór', { plAlts: ['noc', 'wieczór'] }),
        w('yuki', 'ゆき', 'śnieg'),
        w('sakura', 'さくら', 'wiśnia (kwiat wiśni)', { plAlts: ['wiśnia', 'kwiat wiśni'] }),
      ],
      sentences: [
        s('04-1', 'やまと うみ', 'góry i morze', { romaji: 'yama to umi', plAlts: ['góra i morze'] }),
        s('04-2', 'よるの さくら', 'wiśnie nocą', { romaji: 'yoru no sakura', note: 'の łączy rzeczowniki (więcej w lekcji 13)' }),
      ],
      grammar: [
        {
          id: 'ja.g.r',
          title: 'Japońskie „r”',
          body: [
            'Rząd r- (ら り る れ ろ) wymawiamy jednym, lekkim uderzeniem czubka języka o dziąsła — jak polskie „r” w słowie „rok”, ale bez wibracji. Dla wielu osób brzmi podobnie do „l”.',
          ],
          examples: [
            s('04-p1', 'さくら', 'wiśnia', { romaji: 'sakura' }),
            s('04-p2', 'くるま', 'samochód', { romaji: 'kuruma' }),
            s('04-p3', 'よる', 'noc', { romaji: 'yoru' }),
          ],
          contrast: 'Polskie „r” jest często mocno wibrujące. Japońskie — zawsze krótkie i lekkie.',
        },
      ],
      exercises: [
        {
          type: 'choice',
          id: 'ja.x.04-1',
          prompt: 'Który znak to „ru”?',
          options: ['る', 'ろ', 'ら'],
          answer: 0,
          explanation: 'る (ru) kończy się pętelką, ろ (ro) — nie.',
        },
        {
          type: 'choice',
          id: 'ja.x.04-2',
          prompt: 'Który znak to „ri”?',
          options: ['り', 'い', 'こ'],
          answer: 0,
          explanation: 'W り druga kreska jest długa i schodzi w dół; w い obie są krótkie.',
        },
        {
          type: 'choice',
          id: 'ja.x.04-3',
          prompt: 'Ile znaków ma rząd y-?',
          options: ['3: や ゆ よ', '5', '2'],
          answer: 0,
          explanation: 'Rząd y- ma tylko や (ya), ゆ (yu) i よ (yo).',
        },
      ],
      writing: ROW_MA_YA_RA,
      summary: [
        'ま ma, み mi, む mu, め me, も mo.',
        'や ya, ゆ yu, よ yo.',
        'ら ra, り ri, る ru, れ re, ろ ro — lekkie, niewibrujące „r”.',
        'Słowa: やま, うみ, くるま, よる, ゆき, さくら.',
      ],
    },
    {
      id: 'ja.l05',
      title: 'Hiragana: わ, を, ん i dakuten',
      subtitle: 'わをん・がぎぐげご・ざじずぜぞ',
      objective: 'Dokończysz podstawową hiraganę i poznasz znaczek dakuten (゛), który udźwięcznia spółgłoski.',
      level: 'Kana',
      minutes: 11,
      intro: [
        'Dwie kreseczki ゛ (dakuten) zmieniają spółgłoskę na dźwięczną: か ka → が ga, さ sa → ざ za.',
        'Uwaga: じ to „ji” (jak polskie „dzi”), a ず to „zu”.',
      ],
      items: [
        ...kanaItems('h', ROW_WA_GA_ZA),
        w('watashi', 'わたし', 'ja'),
        w('hon', 'ほん', 'książka'),
        w('nihon', 'にほん', 'Japonia'),
        w('kagi', 'かぎ', 'klucz'),
        w('kaze', 'かぜ', 'wiatr'),
        w('mizu', 'みず', 'woda'),
      ],
      sentences: [
        s('05-1', 'わたしの ほん', 'moja książka', { romaji: 'watashi no hon' }),
        s('05-2', 'にほんの みず', 'japońska woda', { romaji: 'nihon no mizu', plAlts: ['woda z Japonii'] }),
      ],
      grammar: [
        {
          id: 'ja.g.dakuten',
          title: 'Dakuten ゛ — dźwięczne spółgłoski',
          body: [
            'Dakuten (゛) zamienia: k → g, s → z, t → d, h → b. Dziś: が ぎ ぐ げ ご (ga–go) i ざ じ ず ぜ ぞ (za–zo).',
            '[[ん]] (n) to jedyny znak bez samogłoski. Tworzy osobną morę: ほ・ん (hon — 2 mory), に・ほ・ん (nihon — 3 mory).',
            '[[を]] czyta się „o” i służy niemal wyłącznie jako partykuła dopełnienia (poznasz ją w lekcji 14).',
          ],
          table: {
            head: ['bez ゛', 'z ゛'],
            rows: [
              ['か き く け こ', 'が ぎ ぐ げ ご'],
              ['さ し す せ そ', 'ざ じ ず ぜ ぞ'],
            ],
          },
          examples: [
            s('05-p1', 'かぎ', 'klucz', { romaji: 'kagi' }),
            s('05-p2', 'かぜ', 'wiatr', { romaji: 'kaze' }),
            s('05-p3', 'にほん', 'Japonia', { romaji: 'nihon', note: '3 mory: ni・ho・n' }),
          ],
        },
      ],
      exercises: [
        {
          type: 'choice',
          id: 'ja.x.05-1',
          concept: 'ja.g.dakuten',
          prompt: 'Jak czyta się が?',
          options: ['ga', 'ka', 'za'],
          answer: 0,
          explanation: 'か (ka) + ゛ = が (ga).',
        },
        {
          type: 'choice',
          id: 'ja.x.05-2',
          concept: 'ja.g.dakuten',
          prompt: 'Ile mor ma にほん?',
          options: ['3', '2', '4'],
          answer: 0,
          explanation: 'に・ほ・ん — ん to osobna mora.',
        },
        {
          type: 'choice',
          id: 'ja.x.05-3',
          concept: 'ja.g.dakuten',
          prompt: 'Jak czyta się じ?',
          options: ['ji', 'shi', 'zi (jak polskie „zi”)'],
          answer: 0,
          explanation: 'じ to „ji” — podobnie do polskiego „dzi”.',
        },
      ],
      writing: ['わ', 'を', 'ん', 'が', 'じ', 'ず'],
      summary: [
        'わ wa, を o, ん n (osobna mora).',
        'Dakuten ゛: が ぎ ぐ げ ご, ざ じ ず ぜ ぞ.',
        'Słowa: わたし, ほん, にほん, かぎ, かぜ, みず.',
        'の łączy rzeczowniki: わたしの ほん — moja książka.',
      ],
    },
    {
      id: 'ja.l06',
      title: 'Hiragana: だ, ば, ぱ',
      subtitle: 'だでど・ばびぶべぼ・ぱぴぷぺぽ',
      objective: 'Poznasz pozostałe dźwięczne znaki i kółeczko handakuten (゜): ば ba, ぱ pa.',
      level: 'Kana',
      minutes: 10,
      intro: [
        'Rząd h- ma dwie wersje: z ゛ daje „b” (ば ba), a z kółeczkiem ゜ (handakuten) — „p” (ぱ pa).',
        'ぢ i づ też istnieją, ale są rzadkie i brzmią jak じ i ず.',
      ],
      items: [
        ...kanaItems('h', ROW_DA_BA_PA),
        w('denwa', 'でんわ', 'telefon'),
        w('mado', 'まど', 'okno'),
        w('kaban', 'かばん', 'torba'),
        w('daigaku', 'だいがく', 'uniwersytet', { plAlts: ['uczelnia'] }),
        w('tomodachi', 'ともだち', 'przyjaciel; kolega', { plAlts: ['przyjaciel', 'przyjaciółka', 'kolega', 'koleżanka'] }),
        w('enpitsu', 'えんぴつ', 'ołówek'),
      ],
      sentences: [
        s('06-1', 'ともだちの かばん', 'torba przyjaciela', { romaji: 'tomodachi no kaban', plAlts: ['torba kolegi', 'torba przyjaciółki'] }),
        s('06-2', 'だいがくの でんわ', 'telefon uczelni', { romaji: 'daigaku no denwa', plAlts: ['telefon uniwersytetu'] }),
      ],
      grammar: [
        {
          id: 'ja.g.handakuten',
          title: 'Handakuten ゜ — dźwięk „p”',
          body: [
            'Kółeczko ゜ dodajemy tylko do rzędu h-: は → ぱ (pa), ひ → ぴ (pi), ふ → ぷ (pu), へ → ぺ (pe), ほ → ぽ (po).',
            'Pełna tabela: t → d (だ で ど), h → b (ば び ぶ べ ぼ), h → p (ぱ ぴ ぷ ぺ ぽ).',
          ],
          table: {
            head: ['podstawa', '゛', '゜'],
            rows: [
              ['は ひ ふ へ ほ', 'ば び ぶ べ ぼ', 'ぱ ぴ ぷ ぺ ぽ'],
              ['た て と', 'だ で ど', '—'],
            ],
          },
          examples: [
            s('06-p1', 'えんぴつ', 'ołówek', { romaji: 'enpitsu' }),
            s('06-p2', 'かばん', 'torba', { romaji: 'kaban' }),
          ],
        },
      ],
      exercises: [
        {
          type: 'choice',
          id: 'ja.x.06-1',
          concept: 'ja.g.handakuten',
          prompt: 'Jak czyta się ぱ?',
          options: ['pa', 'ba', 'ha'],
          answer: 0,
          explanation: 'Kółeczko ゜ daje „p”: ぱ = pa. Dwie kreseczki ゛ dają „b”: ば = ba.',
        },
        {
          type: 'choice',
          id: 'ja.x.06-2',
          concept: 'ja.g.handakuten',
          prompt: 'Który znak to „bo”?',
          options: ['ぼ', 'ぽ', 'ほ'],
          answer: 0,
          explanation: 'ほ + ゛ = ぼ (bo); ほ + ゜ = ぽ (po).',
        },
        {
          type: 'choice',
          id: 'ja.x.06-3',
          prompt: 'Co znaczy だいがく?',
          options: ['uniwersytet', 'telefon', 'okno'],
          answer: 0,
          explanation: 'だいがく — uniwersytet. でんわ to telefon, まど — okno.',
        },
      ],
      writing: ['だ', 'で', 'ど', 'ば', 'ぱ', 'ぴ'],
      summary: [
        'だ da, で de, ど do.',
        'ば ba, び bi, ぶ bu, べ be, ぼ bo.',
        'ぱ pa, ぴ pi, ぷ pu, ぺ pe, ぽ po (kółeczko ゜).',
        'Słowa: でんわ, まど, かばん, だいがく, ともだち, えんぴつ.',
      ],
    },
    {
      id: 'ja.l07',
      title: 'Połączenia, っ i długie samogłoski',
      subtitle: 'きゃ・っ・ああ',
      objective: 'Przeczytasz połączenia typu きゃ, podwojone spółgłoski (っ) i długie samogłoski — i usłyszysz, jak zmieniają znaczenie.',
      level: 'Kana',
      minutes: 12,
      intro: [
        'Mały znak ゃ, ゅ lub ょ łączy się z poprzednim w jedną morę: き + ゃ = きゃ (kya).',
        'Mały っ to krótka pauza przed następną spółgłoską — jedna mora ciszy: きって (kitte).',
        'Długa samogłoska trwa dwie mory: おばさん (ciocia) i おばあさん (babcia) to różne słowa!',
      ],
      items: [
        ...kanaItems('h', ['きゃ', 'しゃ', 'ちゃ', 'しゅ', 'ちょ', 'りょ']),
        w('kitte', 'きって', 'znaczek pocztowy', { plAlts: ['znaczek'] }),
        w('gakkou', 'がっこう', 'szkoła'),
        w('okaasan', 'おかあさん', 'mama', { plAlts: ['matka'] }),
        w('toukyou', 'とうきょう', 'Tokio'),
        w('shashin', 'しゃしん', 'zdjęcie; fotografia', { plAlts: ['zdjęcie', 'fotografia'] }),
        w('byouin', 'びょういん', 'szpital'),
      ],
      sentences: [
        s('07-1', 'おかあさんの しゃしん', 'zdjęcie mamy', { romaji: 'okaasan no shashin' }),
        s('07-2', 'とうきょうの がっこう', 'szkoła w Tokio', { romaji: 'toukyou no gakkou', plAlts: ['tokijska szkoła'] }),
      ],
      grammar: [
        {
          id: 'ja.g.yoon',
          title: 'Małe ゃ ゅ ょ',
          body: [
            'Znak z rzędu -i + mały ゃ / ゅ / ょ tworzy jedną morę: き + ゃ = [[きゃ]] (kya), し + ゅ = [[しゅ]] (shu), ち + ょ = [[ちょ]] (cho).',
            'Porównaj: [[きや]] (ki-ya, 2 mory, duże や) i [[きゃ]] (kya, 1 mora, małe ゃ).',
          ],
          table: {
            head: ['', 'ゃ', 'ゅ', 'ょ'],
            rows: [
              ['き', 'きゃ kya', 'きゅ kyu', 'きょ kyo'],
              ['し', 'しゃ sha', 'しゅ shu', 'しょ sho'],
              ['ち', 'ちゃ cha', 'ちゅ chu', 'ちょ cho'],
              ['り', 'りゃ rya', 'りゅ ryu', 'りょ ryo'],
            ],
          },
        },
        {
          id: 'ja.g.length',
          title: 'Długość zmienia znaczenie',
          body: [
            'Mały [[っ]] oznacza zatrzymanie (jedna mora ciszy) i podwaja następną spółgłoskę: きて (kite — przyjdź) ≠ [[きって]] (kitte — znaczek).',
            'Długie samogłoski piszemy, dodając samogłoskę: ああ, いい, うう, えい (zwykle czytane jak długie e), おう (długie o): [[おかあさん]], [[とうきょう]], [[がっこう]].',
            'Dotknij przykładów i posłuchaj par — to częste źródło nieporozumień.',
          ],
          examples: [
            s('07-p1', 'おばさん', 'ciocia', { romaji: 'obasan' }),
            s('07-p2', 'おばあさん', 'babcia', { romaji: 'obaasan' }),
            s('07-p3', 'きて', 'przyjdź', { romaji: 'kite' }),
            s('07-p4', 'きって', 'znaczek', { romaji: 'kitte' }),
            s('07-p5', 'びよういん', 'salon fryzjerski', { romaji: 'biyouin' }),
            s('07-p6', 'びょういん', 'szpital', { romaji: 'byouin' }),
          ],
          contrast: 'W polskim długość samogłoski nie zmienia znaczenia. W japońskim おばさん (4 mory) i おばあさん (5 mor) to dwie różne osoby — warto przesadnie wydłużać na początku.',
        },
      ],
      exercises: [
        {
          type: 'choice',
          id: 'ja.x.07-1',
          concept: 'ja.g.length',
          prompt: 'Które słowo znaczy „babcia”?',
          target: 'おばあさん',
          options: ['おばあさん', 'おばさん'],
          answer: 0,
          explanation: 'おばあさん (o-ba-a-sa-n) z długim „aa” to babcia. おばさん to ciocia.',
        },
        {
          type: 'choice',
          id: 'ja.x.07-2',
          concept: 'ja.g.length',
          prompt: 'Ile mor ma きって?',
          options: ['3', '2', '4'],
          answer: 0,
          explanation: 'き・っ・て — mały っ to pełna mora (krótka cisza).',
        },
        {
          type: 'choice',
          id: 'ja.x.07-3',
          concept: 'ja.g.yoon',
          prompt: 'Jak czyta się しゃ?',
          options: ['sha', 'shiya', 'sa'],
          answer: 0,
          explanation: 'し + małe ゃ = しゃ (sha) — jedna mora.',
        },
        {
          type: 'choice',
          id: 'ja.x.07-4',
          concept: 'ja.g.length',
          prompt: 'Które słowo znaczy „szpital”?',
          target: 'びょういん',
          options: ['びょういん', 'びよういん'],
          answer: 0,
          explanation: 'びょういん (byouin, małe ょ) to szpital, a びよういん (biyouin) — salon fryzjerski.',
        },
      ],
      writing: ['っ', 'ゃ', 'ゅ', 'ょ'],
      summary: [
        'Małe ゃ ゅ ょ: きゃ kya, しゃ sha, ちゃ cha, りょ ryo — jedna mora.',
        'Mały っ podwaja spółgłoskę: きって, がっこう.',
        'Długie samogłoski: おかあさん, とうきょう — dwie mory.',
        'Długość zmienia znaczenie: おばさん ≠ おばあさん, びょういん ≠ びよういん.',
      ],
      followUp: 'Hiragana ukończona! Od teraz romaji w trybie „Na początku kursu” będzie ukryte — zawsze możesz je podejrzeć jako podpowiedź.',
    },
  ],
};
