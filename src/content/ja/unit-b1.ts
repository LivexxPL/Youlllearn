import type { Item, Unit } from '../types';
import { contentHelpers } from '../helpers';
import { kanji } from './kanji';

const { sentence: s } = contentHelpers('ja');

/** Word or phrase. Items written with kanji pass their kana `reading` explicitly. */
const p = (id: string, text: string, pl: string, extra: Partial<Item> = {}): Item => ({
  id: `ja.${id}`,
  kind: 'phrase',
  text,
  reading: text.replace(/[〜~]/g, ''),
  pl,
  ...extra,
});

export const unitB1: Unit = {
  id: 'ja.u8',
  title: 'Pierwsze kroki na B1',
  description:
    'Zdania warunkowe (〜たら, 〜ば, 〜と), przysługi (〜て あげる / もらう / くれる), 〜て しまう i 〜て おく, przypuszczenia (〜そう, 〜よう, 〜らしい), strona bierna i wstęp do keigo — z kolejnymi kanji.',
  level: 'B1',
  lessons: [
    {
      id: 'ja.l32',
      title: 'Jeśli…, kiedy…',
      subtitle: 'あめが ふったら',
      objective:
        'Zbudujesz zdania warunkowe: 〜たら (jeśli / kiedy już), 〜ば (o ile; 〜なければ — jeśli nie) i 〜と (zawsze, gdy — naturalny skutek) — i dobierzesz właściwą formę do planów, rad, wskazówek i opisu pór roku.',
      level: 'B1 (JF) / N3',
      minutes: 13,
      intro: [
        'Witaj na pierwszych stopniach poziomu B1! W tym dziale poznasz konstrukcje, dzięki którym opowiesz o warunkach, przysługach, przypuszczeniach i o tym, co cię spotkało — a na koniec zrobisz pierwsze kroki w keigo, japońskim języku grzeczności.',
        'Zaczynamy od zdań warunkowych. Japoński ma ich kilka i każde ma swój charakter: たら, ば i と. Dobra wiadomość: たら pasuje prawie zawsze — jeśli nie wiesz, co wybrać, wybierz たら.',
      ],
      items: [
        kanji('haru', '春', 'wiosna', 'はる・しゅん', ['シュン'], ['はる'], [
          { text: '{春|はる}', pl: 'wiosna' },
          { text: '{春休|はるやす}み', pl: 'ferie wiosenne' },
          { text: '{春分|しゅんぶん}の {日|ひ}', pl: 'równonoc wiosenna (święto)' },
        ], {
          plAlts: ['wiosenny'],
          note: 'Rok szkolny i rok podatkowy zaczynają się w Japonii wiosną — w kwietniu, gdy kwitną wiśnie.',
        }),
        kanji('natsu', '夏', 'lato', 'なつ・か', ['カ', 'ゲ'], ['なつ'], [
          { text: '{夏|なつ}', pl: 'lato' },
          { text: '{夏休|なつやす}み', pl: 'wakacje letnie' },
          { text: '{今年|ことし}の {夏|なつ}', pl: 'tegoroczne lato; tego lata' },
        ], {
          plAlts: ['letni'],
          note: 'Japońskie lato jest gorące i wilgotne, a zaczyna się od pory deszczowej — つゆ.',
        }),
        kanji('aki', '秋', 'jesień', 'あき・しゅう', ['シュウ'], ['あき'], [
          { text: '{秋|あき}', pl: 'jesień' },
          { text: '{秋分|しゅうぶん}の {日|ひ}', pl: 'równonoc jesienna (święto)' },
        ], {
          plAlts: ['jesienny'],
          note: 'Od teraz あき (jesień) piszemy 秋. Jesień to w Japonii czas czerwonych liści klonu — もみじ.',
        }),
        kanji('fuyu', '冬', 'zima', 'ふゆ・とう', ['トウ'], ['ふゆ'], [
          { text: '{冬|ふゆ}', pl: 'zima' },
          { text: '{冬休|ふゆやす}み', pl: 'ferie zimowe' },
          { text: '{春夏秋冬|しゅんかしゅうとう}', pl: 'cztery pory roku' },
        ], {
          plAlts: ['zimowy'],
          note: 'Dwie kreski na dole znaku to lód. 春夏秋冬 — cztery pory roku w jednym słowie.',
        }),
        p('tara', '〜たら', 'jeśli …; kiedy … (już)', {
          romaji: '~tara',
          tts: 'あめが ふったら',
          alts: ['たら', 'あめが ふったら'],
          plAlts: ['jeżeli', 'gdy', 'jak już'],
          note: 'Forma た + ら: 行ったら, 食べたら, 安かったら, 雨だったら. Najbardziej uniwersalne „jeśli / kiedy” — pasuje też do próśb i planów.',
        }),
        p('eba', '〜ば', 'jeśli …; o ile …', {
          romaji: '~ba',
          tts: 'じかんが あれば',
          alts: ['ば', 'じかんが あれば'],
          plAlts: ['jeżeli', 'wystarczy, że'],
          note: 'Czasowniki: -u → -eba (行けば, 食べれば, あれば); przymiotniki: い → ければ (安ければ); przeczenie: なければ. Akcent pada na sam warunek.',
        }),
        p('to-cond', '〜と', 'gdy …, to (zawsze); jak …, to', {
          romaji: '~to',
          tts: 'はるに なると',
          alts: ['はるに なると'],
          plAlts: ['zawsze gdy', 'kiedy tylko', 'jak'],
          note: 'Forma słownikowa + と: stały, naturalny skutek — 春に なると、さくらが さきます. Także we wskazówkach: まっすぐ 行くと、えきが あります.',
        }),
        p('moshi', 'もし', 'jeśli; gdyby (na początku zdania)', {
          plAlts: ['jeżeli', 'gdyby', 'a jeśli'],
          note: 'Zapowiada warunek i wzmacnia たら albo ば: もし 雨が ふったら… — jeśli (przypadkiem) będzie padać…',
        }),
        p('naru', 'なる', 'stawać się; robić się', {
          alts: ['なります'],
          plAlts: ['stać się', 'zrobić się', 'zostać'],
          note: 'Gr. 1: なります, なって, なった. Rzeczownik i przymiotnik な + に: 春に なる — nadchodzi wiosna; -い → く: さむく なる — robi się zimno.',
        }),
        p('atatakai', 'あたたかい', 'ciepły (przyjemnie)', {
          plAlts: ['ciepło', 'przyjemnie ciepło'],
          note: 'Przyjemne ciepło — wiosną albo w ciepłym pokoju: 春は あたたかいです. Upał to あつい.',
        }),
        p('atsui', 'あつい', 'gorący; upalny', {
          plAlts: ['gorąco', 'upalnie', 'upał'],
          note: 'O pogodzie: 夏は あついです. O gorącej herbacie też mówi się あつい, ale pisze innym znakiem.',
        }),
        p('samui', 'さむい', 'zimny (o pogodzie)', {
          plAlts: ['zimno', 'chłodno', 'mroźnie'],
          note: 'O pogodzie i o tym, że nam zimno: 冬は さむいです. Zimny napój to つめたい.',
        }),
        p('saku', 'さく', 'kwitnąć', {
          alts: ['さきます'],
          plAlts: ['zakwitnąć', 'rozkwitać'],
          note: 'Gr. 1: さきます, さいて, さいた. 花が さく — kwiaty kwitną; さくらが さきました — zakwitły wiśnie.',
        }),
        p('massugu', 'まっすぐ', 'prosto', {
          plAlts: ['na wprost', 'prosto przed siebie'],
          note: 'We wskazówkach: まっすぐ 行くと、えきが あります — jak pójdziesz prosto, będzie stacja.',
        }),
        p('magaru', 'まがる', 'skręcać', {
          alts: ['まがります'],
          plAlts: ['skręcić'],
          note: 'Gr. 1: まがります, まがって, まがった. W którą stronę? — に: みぎに まがる — skręcić w prawo.',
        }),
        p('migi', 'みぎ', 'prawo; prawa strona', {
          plAlts: ['w prawo', 'po prawej', 'prawa strona'],
          note: 'みぎに まがる — skręcić w prawo; みぎに あります — jest po prawej. Lewo to ひだり.',
        }),
      ],
      sentences: [
        s('32-1', 'もし {雨|あめ}が ふったら、うちで {映画|えいが}を {見|み}ます。', 'Jeśli będzie padać, obejrzę w domu film.', {
          romaji: 'moshi ame ga futtara, uchi de eiga o mimasu.',
          plAlts: ['Jeżeli będzie padać, obejrzę film w domu.', 'Jak będzie padać, obejrzę w domu film.', 'Jeśli spadnie deszcz, obejrzę w domu film.'],
          tokens: ['もし', '{雨|あめ}', 'が', 'ふったら', 'うち', 'で', '{映画|えいが}', 'を', '{見|み}ます'],
        }),
        s('32-2', 'うちに かえったら、{電話|でんわ}を ください。', 'Jak wrócisz do domu, zadzwoń do mnie.', {
          romaji: 'uchi ni kaettara, denwa o kudasai.',
          plAlts: ['Kiedy wrócisz do domu, zadzwoń.', 'Jak wrócisz do domu, zadzwoń.', 'Proszę zadzwonić, kiedy pan wróci do domu.', 'Proszę zadzwonić, kiedy pani wróci do domu.'],
          tokens: ['うち', 'に', 'かえったら', '{電話|でんわ}', 'を', 'ください'],
        }),
        s('32-3', '{夏休|なつやす}みに なったら、うみで およぎたいです。', 'Kiedy zaczną się wakacje, chcę popływać w morzu.', {
          romaji: 'natsuyasumi ni nattara, umi de oyogitai desu.',
          plAlts: ['W wakacje chcę pływać w morzu.', 'Jak będą wakacje, chcę popływać w morzu.', 'Kiedy przyjdą wakacje, chcę pływać w morzu.'],
          tokens: ['{夏休|なつやす}み', 'に', 'なったら', 'うみ', 'で', 'およぎたい', 'です'],
        }),
        s('32-4', '{時間|じかん}が あれば、いっしょに {行|い}きましょう。', 'Jeśli będzie czas, chodźmy razem.', {
          romaji: 'jikan ga areba, issho ni ikimashou.',
          plAlts: ['Jeśli znajdziesz czas, chodźmy razem.', 'Jeżeli będzie czas, pójdźmy razem.', 'Jeśli będziesz mieć czas, chodźmy razem.'],
          tokens: ['{時間|じかん}', 'が', 'あれば', 'いっしょに', '{行|い}きましょう'],
        }),
        s('32-5', 'その くつが {安|やす}ければ、{買|か}いたいです。', 'Jeśli te buty są tanie, chcę je kupić.', {
          romaji: 'sono kutsu ga yasukereba, kaitai desu.',
          plAlts: ['Jeżeli te buty są tanie, chcę je kupić.', 'Jeśli te buty będą tanie, chciałbym je kupić.', 'Jeśli te buty będą tanie, chciałabym je kupić.'],
          tokens: ['その', 'くつ', 'が', '{安|やす}ければ', '{買|か}いたい', 'です'],
        }),
        s('32-6', '{早|はや}く {行|い}かなければ、{電車|でんしゃ}に おくれます。', 'Jeśli szybko nie pójdziemy, spóźnimy się na pociąg.', {
          romaji: 'hayaku ikanakereba, densha ni okuremasu.',
          plAlts: ['Jeżeli szybko nie pójdziemy, spóźnimy się na pociąg.', 'Jak się nie pospieszymy, spóźnimy się na pociąg.', 'Jeśli szybko nie wyjdę, spóźnię się na pociąg.'],
          tokens: ['{早|はや}く', '{行|い}かなければ', '{電車|でんしゃ}', 'に', 'おくれます'],
        }),
        s('32-7', '{春|はる}に なると、さくらが さきます。', 'Gdy przychodzi wiosna, kwitną wiśnie.', {
          romaji: 'haru ni naru to, sakura ga sakimasu.',
          plAlts: ['Kiedy nadchodzi wiosna, kwitną wiśnie.', 'Wiosną kwitną wiśnie.', 'Jak przychodzi wiosna, zakwitają wiśnie.'],
          tokens: ['{春|はる}', 'に', 'なる', 'と', 'さくら', 'が', 'さきます'],
        }),
        s('32-8', '{冬|ふゆ}に なると、さむく なります。', 'Gdy przychodzi zima, robi się zimno.', {
          romaji: 'fuyu ni naru to, samuku narimasu.',
          plAlts: ['Kiedy nadchodzi zima, robi się zimno.', 'Zimą robi się zimno.', 'Jak przychodzi zima, robi się zimno.'],
          tokens: ['{冬|ふゆ}', 'に', 'なる', 'と', 'さむく', 'なります'],
        }),
        s('32-9', 'まっすぐ {行|い}って、みぎに まがると、えきが あります。', 'Jak pójdziesz prosto i skręcisz w prawo, będzie stacja.', {
          romaji: 'massugu itte, migi ni magaru to, eki ga arimasu.',
          plAlts: [
            'Proszę iść prosto i skręcić w prawo — tam jest stacja.',
            'Jak pójdzie pan prosto i skręci w prawo, będzie stacja.',
            'Jak pójdzie pani prosto i skręci w prawo, będzie stacja.',
            'Idź prosto, skręć w prawo i będzie stacja.',
          ],
          tokens: ['まっすぐ', '{行|い}って', 'みぎ', 'に', 'まがる', 'と', 'えき', 'が', 'あります'],
        }),
      ],
      grammar: [
        {
          id: 'ja.g.tara-ba',
          title: 'Jeśli…: 〜たら i 〜ば',
          body: [
            '[[〜たら]] tworzymy z formy た + ら: [[ふった]] → [[ふったら]], [[{行|い}った]] → [[{行|い}ったら]], [[{安|やす}かった]] → [[{安|やす}かったら]], [[{雨|あめ}だった]] → [[{雨|あめ}だったら]]. To najbardziej uniwersalne „jeśli” i „kiedy (już)”: [[もし {雨|あめ}が ふったら、うちで {映画|えいが}を {見|み}ます。]]',
            'たら ma też znaczenie czasowe — „kiedy już coś się stanie, wtedy…”: [[うちに かえったら、{電話|でんわ}を ください。]] — Jak wrócisz do domu, zadzwoń. W drugiej części zdania mogą stać prośby, plany i zaproszenia — dlatego たら to najbezpieczniejszy wybór.',
            '[[〜ば]] kładzie nacisk na sam warunek: „o ile…”, „wystarczy, że…”. Czasowniki: -u → **-eba**: [[{行|い}く]] → [[{行|い}けば]], [[{食|た}べる]] → [[{食|た}べれば]], [[ある]] → [[あれば]], [[する]] → [[すれば]], [[{来|く}る]] → [[{来|く}れば]]. Przymiotniki -い: い → **ければ**: [[{安|やす}ければ]], a [[いい]] → [[よければ]].',
            'Przeczenie ない odmienia się jak przymiotnik: [[なければ]] — „jeśli nie”: [[{早|はや}く {行|い}かなければ、{電車|でんしゃ}に おくれます。]] Rzeczowniki i przymiotniki na な mają w tej roli formę [[なら]]: [[ひまなら]] — jeśli masz czas.',
          ],
          table: {
            head: ['', '〜たら', '〜ば'],
            rows: [
              ['いく', 'いったら', 'いけば'],
              ['たべる', 'たべたら', 'たべれば'],
              ['ある', 'あったら', 'あれば'],
              ['する / くる', 'したら / きたら', 'すれば / くれば'],
              ['やすい', 'やすかったら', 'やすければ'],
              ['いかない', 'いかなかったら', 'いかなければ'],
              ['ひまだ / あめだ', 'ひまだったら / あめだったら', 'ひまなら / あめなら'],
            ],
          },
          contrast:
            'Polskie „jeśli” i „kiedy” to dwa różne słowa: „Jeśli będzie padać…” (nie wiadomo), „Kiedy wrócisz…” (na pewno). Japońskie たら obejmuje oba znaczenia — o tym, czy to warunek, czy tylko kolejność, decyduje sens: 雨が ふったら (jeśli), うちに かえったら (kiedy już). Dla jasności „jeśli” można na początku dodać もし.',
        },
        {
          id: 'ja.g.to-cond',
          title: '〜と — zawsze, gdy…; który warunek wybrać?',
          body: [
            'Forma słownikowa (albo ない) + [[と]] opisuje **stały, naturalny skutek**: za każdym razem, gdy A, dzieje się B. Tak mówimy o przyrodzie, urządzeniach i nawykach: [[{春|はる}に なると、さくらが さきます。]], [[{冬|ふゆ}に なると、さむく なります。]]',
            'と to też typowa konstrukcja we wskazówkach: [[まっすぐ {行|い}って、みぎに まがると、えきが あります。]] — Jak pójdziesz prosto i skręcisz w prawo, będzie stacja (ona po prostu tam jest).',
            'Ograniczenie: po と **nie** stawiamy próśb, zaproszeń ani chęci (✗ うちに かえると、電話を ください) — wtedy wybieramy たら. Podobnie po ば: prośba zwykle pasuje tylko wtedy, gdy pierwsza część opisuje stan, np. [[{時間|じかん}が あれば]].',
            'W skrócie: **たら** — najbezpieczniejszy wybór na co dzień; **ば** — „o ile, wystarczy, że”, częste w radach; **と** — „zawsze, gdy”, skutek, na który nie mamy wpływu.',
          ],
          table: {
            head: ['forma', 'kiedy?', 'przykład'],
            rows: [
              ['〜たら', 'jednorazowo, plany, prośby; „kiedy już”', 'うちに かえったら、でんわを ください'],
              ['〜ば', 'nacisk na warunek; „o ile”', 'じかんが あれば、いきます'],
              ['〜なければ', '„jeśli nie”', 'いかなければ、おくれます'],
              ['〜と', 'zawsze, naturalny skutek; wskazówki', 'はるに なると、さくらが さきます'],
            ],
          },
          contrast:
            'Po polsku zdanie z „jak” może opisywać i stałą zależność („Jak przychodzi zima, robi się zimno”), i jednorazowy plan („Jak przyjdziesz, zadzwoń”). Po japońsku to dwie różne konstrukcje: stały skutek — と, jednorazowy plan albo prośba — たら.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'ja.x.32-1',
          concept: 'ja.g.tara-ba',
          sentence: 'もし あした {雨|あめ}が ___、うちに います。',
          pl: 'Jeśli jutro będzie padać, zostanę w domu.',
          options: ['ふったら', 'ふるたら', 'ふりたら'],
          answer: 'ふったら',
          explanation: 'たら tworzymy z formy た: ふった → ふったら.',
        },
        {
          type: 'gap',
          id: 'ja.x.32-2',
          concept: 'ja.g.tara-ba',
          sentence: '{時間|じかん}が ___、いっしょに {行|い}きましょう。',
          pl: 'Jeśli będzie czas, chodźmy razem.',
          options: ['あれば', 'あるば', 'ありば'],
          answer: 'あれば',
          explanation: 'ある (gr. 1): końcowe -u → -eba — あれば.',
        },
        {
          type: 'gap',
          id: 'ja.x.32-3',
          concept: 'ja.g.tara-ba',
          sentence: '{早|はや}く {行|い}か___、{電車|でんしゃ}に おくれます。',
          pl: 'Jeśli szybko nie pójdziemy, spóźnimy się na pociąg.',
          options: ['なければ', 'ないば', 'なかれば'],
          answer: 'なければ',
          explanation: 'ない odmienia się jak przymiotnik -い: い → ければ — なければ (jeśli nie).',
        },
        {
          type: 'gap',
          id: 'ja.x.32-4',
          concept: 'ja.g.to-cond',
          sentence: '{春|はる}に ___、さくらが さきます。',
          pl: 'Gdy przychodzi wiosna, kwitną wiśnie.',
          options: ['なると', 'なったと', 'なれと'],
          answer: 'なると',
          explanation: 'と łączy się z formą słownikową: なる + と — なると. Forma た przed と tu nie pasuje.',
        },
        {
          type: 'choice',
          id: 'ja.x.32-5',
          concept: 'ja.g.to-cond',
          prompt: 'Które zdanie jest niepoprawne?',
          options: ['うちに かえると、{電話|でんわ}を ください。', 'うちに かえったら、{電話|でんわ}を ください。', '{冬|ふゆ}に なると、さむく なります。'],
          answer: 0,
          explanation: 'Po と nie stawiamy próśb (ください). W takim zdaniu potrzebne たら: うちに かえったら、電話を ください.',
        },
        {
          type: 'choice',
          id: 'ja.x.32-6',
          concept: 'ja.g.tara-ba',
          prompt: 'Jak powiesz „Jeśli te buty są tanie, kupię je”?',
          options: ['その くつが {安|やす}ければ、{買|か}います。', 'その くつが {安|やす}いば、{買|か}います。', 'その くつが {安|やす}かれば、{買|か}います。'],
          answer: 0,
          explanation: 'Przymiotnik -い: い → ければ — 安ければ. Form ✗ 安いば i ✗ 安かれば nie ma.',
        },
        {
          type: 'choice',
          id: 'ja.x.32-7',
          concept: 'ja.g.to-cond',
          prompt: 'Turysta pyta o drogę. Jak powiesz „Jak pójdzie pan prosto, stacja będzie po prawej”?',
          options: ['まっすぐ {行|い}くと、みぎに えきが あります。', 'まっすぐ {行|い}ったと、みぎに えきが あります。', 'まっすぐ {行|い}けると、みぎに えきが あります。'],
          answer: 0,
          explanation: 'We wskazówkach: forma słownikowa + と — まっすぐ 行くと… ✗ 行ったと nie istnieje, a 行ける to forma potencjalna.',
        },
      ],
      dialogue: {
        id: 'ja.d.32',
        title: 'Kiedy jechać do Japonii?',
        context: 'Marta planuje podróż do Japonii. Pyta znajomego Japończyka, Daikiego, o najlepszą porę roku.',
        speakers: {
          M: { name: 'Marta', voice: 'a', accent: 'ja-JP' },
          D: { name: 'Daiki', voice: 'b', accent: 'ja-JP' },
        },
        lines: [
          {
            speaker: 'M',
            text: 'ダイキさん、{日本|にほん}へ {行|い}きたいんですが、いつが いいですか。',
            pl: 'Daiki, chcę pojechać do Japonii. Kiedy najlepiej?',
            romaji: 'daiki-san, nihon e ikitai n desu ga, itsu ga ii desu ka.',
          },
          {
            speaker: 'D',
            text: '{春|はる}が いいですよ。{四月|しがつ}に なると、さくらが さきますから。',
            pl: 'Wiosną. W kwietniu kwitną wiśnie.',
            romaji: 'haru ga ii desu yo. shigatsu ni naru to, sakura ga sakimasu kara.',
          },
          {
            speaker: 'M',
            text: '{夏|なつ}は どうですか。{夏休|なつやす}みに なったら、{時間|じかん}が ありますから。',
            pl: 'A lato? W wakacje będę mieć czas.',
            romaji: 'natsu wa dou desu ka. natsuyasumi ni nattara, jikan ga arimasu kara.',
          },
          {
            speaker: 'D',
            text: '{夏|なつ}は とても あついですよ。でも、うみで およげば、{楽|たの}しいです。',
            pl: 'Latem jest strasznie gorąco. Ale jeśli popływasz w morzu, będzie fajnie.',
            romaji: 'natsu wa totemo atsui desu yo. demo, umi de oyogeba, tanoshii desu.',
          },
          { speaker: 'M', text: '{秋|あき}と {冬|ふゆ}は?', pl: 'A jesień i zima?', romaji: 'aki to fuyu wa?' },
          { speaker: 'D', text: '{秋|あき}も きれいですよ。{冬|ふゆ}は さむいです。', pl: 'Jesień też jest piękna. Zimą jest zimno.', romaji: 'aki mo kirei desu yo. fuyu wa samui desu.' },
          {
            speaker: 'D',
            text: 'でも、ほっかいどうへ {行|い}けば、スキーが できますよ。',
            pl: 'Ale jak pojedziesz na Hokkaido, możesz pojeździć na nartach.',
            romaji: 'demo, hokkaidou e ikeba, sukii ga dekimasu yo.',
          },
          {
            speaker: 'M',
            text: 'じゃあ、お{金|かね}が あったら、{春|はる}と {冬|ふゆ}、{二|に}かい {行|い}きます!',
            pl: 'To jeśli będę mieć pieniądze, pojadę dwa razy — wiosną i zimą!',
            romaji: 'jaa, okane ga attara, haru to fuyu, nikai ikimasu!',
          },
          {
            speaker: 'D',
            text: 'いいですね! {日本|にほん}に {来|き}たら、{電話|でんわ}して ください。',
            pl: 'Świetnie! Jak przyjedziesz do Japonii, zadzwoń.',
            romaji: 'ii desu ne! nihon ni kitara, denwa shite kudasai.',
          },
        ],
        questions: [
          {
            id: 'ja.d.32-q1',
            prompt: 'Dlaczego Daiki poleca wiosnę?',
            options: ['Bo jest wtedy tanio', 'Bo w kwietniu kwitną wiśnie', 'Bo jest mało turystów'],
            answer: 1,
            explanation: '四月に なると、さくらが さきますから — w kwietniu kwitną wiśnie.',
          },
          {
            id: 'ja.d.32-q2',
            prompt: 'Co można robić zimą na Hokkaido?',
            options: ['Pływać w morzu', 'Jeździć na nartach', 'Oglądać kwitnące wiśnie'],
            answer: 1,
            explanation: 'ほっかいどうへ 行けば、スキーが できますよ — na Hokkaido można jeździć na nartach.',
          },
          {
            id: 'ja.d.32-q3',
            prompt: 'O co Daiki prosi Martę?',
            options: ['Żeby zadzwoniła, gdy przyjedzie do Japonii', 'Żeby przywiozła mu pamiątkę', 'Żeby przyjechała latem'],
            answer: 0,
            explanation: '日本に 来たら、電話して ください — jak przyjedziesz do Japonii, zadzwoń. Prośba — więc たら, nie と.',
          },
        ],
      },
      summary: [
        '〜たら (forma た + ら): jeśli / kiedy już — 雨が ふったら, うちに かえったら; pasuje też do próśb i planów.',
        '〜ば: 行けば, 食べれば, あれば, 安ければ; jeśli nie: 〜なければ; rzeczownik i な: なら.',
        '〜と (forma słownikowa + と): zawsze, gdy — 春に なると、さくらが さきます; także we wskazówkach. Po と bez próśb!',
        'Kanji: 春 夏 秋 冬 — 春, 夏休み, 秋, 冬, 春夏秋冬.',
      ],
      followUp:
        'Opisz po japońsku cztery pory roku w swoim mieście z 〜と (春に なると…), a potem zaplanuj z 〜たら jedną rzecz na najbliższe wakacje i jedną na deszczowy dzień.',
    },
    {
      id: 'ja.l33',
      title: 'Przysługi',
      subtitle: 'てつだって くれませんか',
      objective:
        'Opowiesz, kto co dla kogo zrobił (〜て あげる / くれる / もらう), poprosisz o pomoc, powiesz, co niestety ci się przydarzyło (〜て しまう), i co przygotujesz zawczasu (〜て おく).',
      level: 'B1 (JF) / N3',
      minutes: 13,
      items: [
        kanji('oshieru', '教', 'uczyć; nauczać', 'おし・きょう', ['キョウ'], ['おし(える)', 'おそ(わる)'], [
          { text: '{教|おし}える', pl: 'uczyć (kogoś); powiedzieć, wskazać' },
          { text: '{教会|きょうかい}', pl: 'kościół' },
        ], {
          plAlts: ['uczyć', 'nauczać', 'nauka'],
          note: 'Od teraz おしえます piszemy 教えます. 教える to nie tylko „uczyć”: 名前を 教えて ください — proszę mi powiedzieć, jak się pan / pani nazywa.',
        }),
        kanji('okuru', '送', 'wysyłać; odprowadzać', 'おく・そう', ['ソウ'], ['おく(る)'], [
          { text: '{送|おく}る', pl: 'wysyłać; odprowadzać; podwozić' },
          { text: '{見送|みおく}る', pl: 'odprowadzać (np. na lotnisko)' },
          { text: '{送料|そうりょう}', pl: 'koszt wysyłki' },
        ], {
          plAlts: ['wysyłać', 'posyłać', 'odprowadzać'],
          note: 'おくる (gr. 1) — wysłać list czy paczkę albo odprowadzić / podwieźć kogoś: えきまで 送ります — odprowadzę cię na stację.',
        }),
        kanji('akeru', '開', 'otwierać', 'あ・かい', ['カイ'], ['あ(ける)', 'あ(く)', 'ひら(く)'], [
          { text: '{開|あ}ける', pl: 'otwierać (coś)' },
          { text: '{開|あ}く', pl: 'otwierać się; być otwartym' },
          { text: '{開会|かいかい}', pl: 'otwarcie (zebrania, uroczystości)' },
        ], {
          plAlts: ['otworzyć', 'otwarty', 'otwarcie'],
          note: 'Od teraz あけます piszemy 開けます. 開ける — ktoś otwiera coś (まどを 開ける), 開く — coś się otwiera (ドアが 開く).',
        }),
        kanji('shimeru', '閉', 'zamykać', 'し・へい', ['ヘイ'], ['し(める)', 'し(まる)', 'と(じる)'], [
          { text: '{閉|し}める', pl: 'zamykać (coś)' },
          { text: '{閉|し}まる', pl: 'zamykać się; być zamkniętym' },
          { text: '{開閉|かいへい}', pl: 'otwieranie i zamykanie' },
        ], {
          plAlts: ['zamknąć', 'zamknięty', 'zamknięcie'],
          note: '閉める — ktoś zamyka coś (まどを 閉める), 閉まる — coś się zamyka (みせが 閉まる). Oba znaki mają tę samą „bramę” — 開 i 閉 rozróżnisz po środku.',
        }),
        p('teageru', '〜て あげる', 'zrobić coś dla kogoś', {
          romaji: '~te ageru',
          tts: 'よんで あげる',
          alts: ['てあげる', 'て あげます', 'よんで あげる'],
          plAlts: ['zrobić komuś przysługę', 'zrobić coś za kogoś'],
          note: 'Robię coś dla kogoś: いもうとに 本を 読んで あげました. Wobec starszych i przełożonych brzmi protekcjonalnie — wtedy lepiej zapytać: 〜ましょうか.',
        }),
        p('tekureru', '〜て くれる', 'ktoś robi coś dla mnie', {
          romaji: '~te kureru',
          tts: 'つくって くれる',
          alts: ['てくれる', 'て くれます', 'つくって くれました'],
          plAlts: ['ktoś coś dla mnie robi', 'zrobić coś dla mnie'],
          note: 'Ktoś (z życzliwości) robi coś dla mnie albo „moich”: 母が 料理を 作って くれました. Prośba: 〜て くれませんか — czy mógłbyś…?',
        }),
        p('temorau', '〜て もらう', 'dostać od kogoś przysługę', {
          romaji: '~te morau',
          tts: 'おしえて もらう',
          alts: ['てもらう', 'て もらいます', 'おしえて もらいました'],
          plAlts: ['poprosić kogoś o zrobienie czegoś', 'ktoś coś dla mnie zrobił'],
          note: 'Ja dostaję przysługę, często na własną prośbę; wykonawca + に: 友だちに 教えて もらいました — kolega mi wytłumaczył. Grzeczna prośba: 〜て もらえませんか.',
        }),
        p('teshimau', '〜て しまう', 'zrobić do końca; niestety (coś się stało)', {
          romaji: '~te shimau',
          tts: 'わすれて しまいました',
          alts: ['てしまう', 'て しまいました', 'わすれて しまいました'],
          plAlts: ['niestety', 'zrobić do końca', 'skończyć'],
          note: 'Dwa znaczenia: do końca (ぜんぶ 食べて しまいました) albo żal — stało się, niestety (かさを わすれて しまいました). Swobodnie: 〜ちゃう / 〜じゃう.',
        }),
        p('teoku', '〜て おく', 'zrobić coś zawczasu', {
          romaji: '~te oku',
          tts: 'かって おきます',
          alts: ['ておく', 'て おきます', 'かって おきます'],
          plAlts: ['zrobić wcześniej', 'przygotować', 'zostawić (w jakimś stanie)'],
          note: 'Przygotowanie z wyprzedzeniem: 飲み物を 買って おきます — kupię wcześniej napoje. Też „zostawić”: まどを 開けて おく — zostawić okno otwarte. Swobodnie: 〜とく.',
        }),
        p('tetsudau', 'てつだう', 'pomagać', {
          alts: ['てつだいます'],
          plAlts: ['pomóc'],
          note: 'Gr. 1: てつだいます, てつだって, てつだった. Komu albo przy czym — を: 母を てつだう, そうじを てつだう. Propozycja: てつだいましょうか — pomóc?',
        }),
        p('heya', 'へや', 'pokój', { plAlts: ['pomieszczenie'], note: 'わたしの へや — mój pokój. へやを そうじする — sprzątać pokój.' }),
        p('soujisuru', 'そうじする', 'sprzątać', {
          alts: ['そうじします', 'そうじ'],
          plAlts: ['posprzątać', 'robić porządki'],
          note: 'Czasownik z する: そうじします, そうじして. Samo そうじ to „sprzątanie”: へやの そうじ — sprzątanie pokoju.',
        }),
        p('shukudai', 'しゅくだい', 'zadanie domowe', {
          plAlts: ['praca domowa', 'lekcje'],
          note: 'しゅくだいを する — odrabiać lekcje; しゅくだいを わすれる — zapomnieć zadania.',
        }),
        p('paatii', 'パーティー', 'przyjęcie; impreza', {
          plAlts: ['impreza', 'przyjęcie', 'party'],
          note: 'たんじょうびの パーティー — przyjęcie urodzinowe. パーティーを する — urządzić imprezę.',
        }),
        p('zenbu', 'ぜんぶ', 'wszystko; całość', {
          plAlts: ['wszystko', 'całość', 'całkiem'],
          note: 'ぜんぶ 食べて しまいました — zjadłem / zjadłam wszystko. Przy płaceniu: ぜんぶで — razem.',
        }),
        p('yoyakusuru', 'よやくする', 'rezerwować', {
          alts: ['よやくします', 'よやく'],
          plAlts: ['zarezerwować', 'robić rezerwację'],
          note: 'レストランを よやくする — zarezerwować stolik w restauracji. Samo よやく to „rezerwacja”.',
        }),
      ],
      sentences: [
        s('33-1', '{友|とも}だちに しゅくだいを {教|おし}えて もらいました。', 'Kolega wytłumaczył mi zadanie domowe.', {
          romaji: 'tomodachi ni shukudai o oshiete moraimashita.',
          plAlts: ['Koleżanka wytłumaczyła mi zadanie domowe.', 'Przyjaciel wytłumaczył mi pracę domową.', 'Kolega pomógł mi zrozumieć zadanie domowe.'],
          tokens: ['{友|とも}だち', 'に', 'しゅくだい', 'を', '{教|おし}えて', 'もらいました'],
        }),
        s('33-2', '{母|はは}が {料理|りょうり}を {作|つく}って くれました。', 'Mama ugotowała dla mnie obiad.', {
          romaji: 'haha ga ryouri o tsukutte kuremashita.',
          plAlts: ['Mama ugotowała mi obiad.', 'Mama przygotowała dla mnie jedzenie.', 'Mama mi ugotowała.'],
          tokens: ['{母|はは}', 'が', '{料理|りょうり}', 'を', '{作|つく}って', 'くれました'],
        }),
        s('33-3', 'いもうとに {本|ほん}を {読|よ}んで あげました。', 'Przeczytałem / przeczytałam młodszej siostrze książkę.', {
          romaji: 'imouto ni hon o yonde agemashita.',
          plAlts: ['Przeczytałem młodszej siostrze książkę.', 'Przeczytałam młodszej siostrze książkę.', 'Czytałem siostrze książkę.', 'Czytałam siostrze książkę.'],
          tokens: ['いもうと', 'に', '{本|ほん}', 'を', '{読|よ}んで', 'あげました'],
        }),
        s('33-4', '{父|ちち}が えきまで {車|くるま}で {送|おく}って くれました。', 'Tata podwiózł mnie samochodem na stację.', {
          romaji: 'chichi ga eki made kuruma de okutte kuremashita.',
          plAlts: ['Tata zawiózł mnie samochodem na stację.', 'Tata podrzucił mnie autem na stację.', 'Ojciec podwiózł mnie samochodem na stację.'],
          tokens: ['{父|ちち}', 'が', 'えき', 'まで', '{車|くるま}', 'で', '{送|おく}って', 'くれました'],
        }),
        s('33-5', 'かさを {電車|でんしゃ}の {中|なか}に わすれて しまいました。', 'Niestety zostawiłem / zostawiłam parasol w pociągu.', {
          romaji: 'kasa o densha no naka ni wasurete shimaimashita.',
          plAlts: ['Niestety zostawiłem parasol w pociągu.', 'Niestety zostawiłam parasol w pociągu.', 'Zapomniałem parasola z pociągu.', 'Zapomniałam parasola z pociągu.'],
          tokens: ['かさ', 'を', '{電車|でんしゃ}', 'の', '{中|なか}', 'に', 'わすれて', 'しまいました'],
        }),
        s('33-6', 'ケーキを ぜんぶ {食|た}べちゃった。', 'Zjadłem / zjadłam całe ciasto.', {
          romaji: 'keeki o zenbu tabechatta.',
          plAlts: ['Zjadłem całe ciasto.', 'Zjadłam całe ciasto.', 'Zjadłem cały tort.', 'Zjadłam cały tort.'],
          note: '食べちゃった — swobodnie zamiast 食べて しまった.',
          tokens: ['ケーキ', 'を', 'ぜんぶ', '{食|た}べちゃった'],
        }),
        s('33-7', 'パーティーの {前|まえ}に {飲|の}み{物|もの}を {買|か}って おきます。', 'Przed imprezą kupię zawczasu napoje.', {
          romaji: 'paatii no mae ni nomimono o katte okimasu.',
          plAlts: ['Przed przyjęciem kupię napoje.', 'Kupię wcześniej napoje na imprezę.', 'Przed imprezą kupię wcześniej coś do picia.'],
          tokens: ['パーティー', 'の', '{前|まえ}', 'に', '{飲|の}み{物|もの}', 'を', '{買|か}って', 'おきます'],
        }),
        s('33-8', 'あついので、まどを {開|あ}けて おいて ください。', 'Jest gorąco, więc proszę zostawić otwarte okno.', {
          romaji: 'atsui node, mado o akete oite kudasai.',
          plAlts: ['Jest gorąco, więc zostaw otwarte okno.', 'Jest gorąco, więc proszę nie zamykać okna.', 'Ponieważ jest gorąco, proszę zostawić okno otwarte.'],
          tokens: ['あつい', 'ので', 'まど', 'を', '{開|あ}けて', 'おいて', 'ください'],
        }),
        s('33-9', 'すみません、へやの そうじを てつだって くれませんか。', 'Przepraszam, możesz mi pomóc posprzątać pokój?', {
          romaji: 'sumimasen, heya no souji o tetsudatte kuremasen ka.',
          plAlts: ['Przepraszam, pomożesz mi posprzątać pokój?', 'Przepraszam, czy mógłbyś pomóc mi posprzątać pokój?', 'Przepraszam, czy mogłabyś pomóc mi posprzątać pokój?'],
          tokens: ['すみません', 'へや', 'の', 'そうじ', 'を', 'てつだって', 'くれませんか'],
        }),
      ],
      grammar: [
        {
          id: 'ja.g.te-ageru',
          title: 'Przysługi: 〜て あげる, 〜て くれる, 〜て もらう',
          body: [
            'Czasowniki dawania łączą się z formą て i wtedy „dają” **czynność** — przysługę. Kierunek jest taki sam jak przy przedmiotach: [[〜て あげる]] — robię coś dla kogoś, [[〜て くれる]] — ktoś robi coś dla mnie, [[〜て もらう]] — dostaję od kogoś przysługę.',
            '[[いもうとに {本|ほん}を {読|よ}んで あげました。]] — Przeczytałem siostrze książkę. [[{母|はは}が {料理|りょうり}を {作|つく}って くれました。]] — Mama ugotowała dla mnie obiad. [[{友|とも}だちに しゅくだいを {教|おし}えて もらいました。]] — Kolega wytłumaczył mi zadanie (bo go poprosiłem).',
            'くれる i もらう opisują tę samą przysługę z dwóch stron: くれる podkreśla życzliwość wykonawcy (podmiot z が), もらう — że to my skorzystaliśmy, często na własną prośbę (wykonawca z に). Bez nich zdanie brzmi chłodno: 母が 料理を 作りました — mama ugotowała (i tyle).',
            'Prośby: [[〜て くれませんか]] (do bliskich) i grzeczniej [[〜て もらえませんか]] — czy mógłbyś…? Uwaga: 〜て あげる wobec starszych i przełożonych brzmi protekcjonalnie. Zamiast ✗ 先生、てつだって あげます zaproponuj: [[てつだいましょうか。]]',
          ],
          table: {
            head: ['', 'kto dla kogo', 'przykład'],
            rows: [
              ['〜て あげる', 'ja / ktoś → dla kogoś', 'いもうとに ほんを よんで あげました'],
              ['〜て くれる', 'ktoś → dla mnie / „moich”', 'ははが りょうりを つくって くれました'],
              ['〜て もらう', 'ja ← od kogoś (に)', 'ともだちに おしえて もらいました'],
              ['prośba', 'czy mógłbyś…?', 'てつだって くれませんか / もらえませんか'],
            ],
          },
          contrast:
            'Po polsku przysługę wyrażamy słowami „dla mnie”, „mi”, „za mnie”: „Mama ugotowała mi obiad”. Po japońsku tę rolę pełnią czasowniki dawania po formie て. Japończycy używają ich bardzo często — opis czyjejś pomocy bez くれる brzmi tak, jakbyś jej nie docenił.',
        },
        {
          id: 'ja.g.shimau-oku',
          title: '〜て しまう i 〜て おく',
          body: [
            '[[〜て しまう]] ma dwa znaczenia. Pierwsze — **do końca, całkowicie**: [[ぜんぶ {食|た}べて しまいました。]] — Zjadłem wszystko. Drugie — **niestety, stało się** (żal, coś niechcianego): [[かさを {電車|でんしゃ}の {中|なか}に わすれて しまいました。]] — Niestety zostawiłem parasol w pociągu.',
            'W mowie potocznej 〜て しまう skraca się do [[〜ちゃう]], a 〜で しまう — do [[〜じゃう]]: [[{食|た}べちゃった]], [[{飲|の}んじゃった]]. Te formy usłyszysz w każdym anime i w każdej rozmowie przyjaciół.',
            '[[〜て おく]] — zrobić coś **zawczasu, na przyszłość**: [[パーティーの {前|まえ}に {飲|の}み{物|もの}を {買|か}って おきます。]] — Przed imprezą kupię napoje. Drugie znaczenie: **zostawić** w danym stanie: [[まどを {開|あ}けて おいて ください。]] — Proszę zostawić okno otwarte.',
            'Swobodnie 〜て おく brzmi [[〜とく]]: [[{買|か}っとく]] — kupię (zawczasu). おく odmienia się jak czasownik gr. 1: [[おきます]], [[おいて]], [[おいた]].',
          ],
          table: {
            head: ['forma', 'znaczenie', 'swobodnie'],
            rows: [
              ['たべて しまう', 'zjeść wszystko / niestety zjeść', 'たべちゃう'],
              ['のんで しまった', 'wypiłem (do końca / niestety)', 'のんじゃった'],
              ['わすれて しまった', 'niestety zapomniałem', 'わすれちゃった'],
              ['かって おく', 'kupić zawczasu', 'かっとく'],
              ['あけて おく', 'zostawić otwarte', 'あけとく'],
            ],
          },
          contrast:
            'Polski wyraża „do końca” przedrostkiem: „jeść” → „zjeść”, „pić” → „wypić” — 〜て しまう bywa podobne. Japońskie しまう często dodaje jednak odcień żalu, który po polsku oddajemy słowami „niestety” albo „no i…”: わすれて しまった — no i zapomniałem. A 〜て おく to nasze „zawczasu”, „na wszelki wypadek”.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'ja.x.33-1',
          concept: 'ja.g.te-ageru',
          sentence: '{母|はは}が {料理|りょうり}を {作|つく}って ___。',
          pl: 'Mama ugotowała dla mnie obiad.',
          options: ['くれました', 'あげました', 'もらいました'],
          answer: 'くれました',
          explanation: 'Ktoś (mama) robi coś dla mnie — 〜て くれる. あげる to przysługa od mówiącego, a もらう wymaga に przy wykonawcy: 母に 作って もらいました.',
        },
        {
          type: 'gap',
          id: 'ja.x.33-2',
          concept: 'ja.g.te-ageru',
          sentence: '{友|とも}だち___ しゅくだいを {教|おし}えて もらいました。',
          pl: 'Kolega wytłumaczył mi zadanie domowe.',
          options: ['に', 'が', 'を'],
          answer: 'に',
          explanation: 'W 〜て もらう wykonawca przysługi dostaje に: 友だちに 教えて もらいました.',
        },
        {
          type: 'gap',
          id: 'ja.x.33-3',
          concept: 'ja.g.shimau-oku',
          sentence: 'かさを わすれて ___。',
          pl: 'Niestety zapomniałem / zapomniałam parasola.',
          options: ['しまいました', 'おきました', 'あげました'],
          answer: 'しまいました',
          explanation: 'Żal, coś niechcianego: 〜て しまう — わすれて しまいました. 〜て おく to przygotowanie zawczasu.',
        },
        {
          type: 'gap',
          id: 'ja.x.33-4',
          concept: 'ja.g.shimau-oku',
          sentence: 'パーティーの {前|まえ}に、ケーキを {買|か}って ___。',
          pl: 'Przed imprezą kupię wcześniej ciasto.',
          options: ['おきます', 'しまいます', 'くれます'],
          answer: 'おきます',
          explanation: 'Przygotowanie z wyprzedzeniem: 〜て おく — 買って おきます.',
        },
        {
          type: 'choice',
          id: 'ja.x.33-5',
          concept: 'ja.g.shimau-oku',
          prompt: 'Jak swobodnie powiesz „Zjadłem / zjadłam całe ciasto”?',
          options: ['ケーキ、ぜんぶ {食|た}べちゃった。', 'ケーキ、ぜんぶ {食|た}べとく。', 'ケーキ、ぜんぶ {食|た}べて あげた。'],
          answer: 0,
          explanation: '〜て しまった → swobodnie 〜ちゃった: 食べちゃった. 食べとく to „zjem zawczasu”, a 食べて あげた — „zjadłem za kogoś”.',
        },
        {
          type: 'choice',
          id: 'ja.x.33-6',
          concept: 'ja.g.te-ageru',
          prompt: 'Twój szef niesie ciężkie pudła. Jak grzecznie zaproponujesz pomoc?',
          options: ['てつだいましょうか。', 'てつだって あげます。', 'てつだって くれませんか。'],
          answer: 0,
          explanation: 'Wobec przełożonych 〜て あげる brzmi protekcjonalnie — pomoc proponujemy formą 〜ましょうか. てつだって くれませんか to prośba o pomoc dla siebie.',
        },
        {
          type: 'choice',
          id: 'ja.x.33-7',
          concept: 'ja.g.te-ageru',
          prompt: 'Chcesz poprosić kolegę, żeby zamknął okno. Co powiesz?',
          options: ['まどを {閉|し}めて くれませんか。', 'まどを {閉|し}めて あげませんか。', 'まどを {閉|し}めて しまいませんか。'],
          answer: 0,
          explanation: 'Prośba o przysługę dla siebie: 〜て くれませんか — czy mógłbyś…? Grzeczniej: 閉めて もらえませんか.',
        },
      ],
      dialogue: {
        id: 'ja.d.33',
        title: 'Przed imprezą',
        context: 'Weronika i Haruto przygotowują przyjęcie pożegnalne dla kolegi z kursu. Rozmawiają po zajęciach w sali.',
        speakers: {
          W: { name: 'Weronika', voice: 'a', accent: 'ja-JP' },
          H: { name: 'Haruto', voice: 'b', accent: 'ja-JP' },
        },
        lines: [
          { speaker: 'W', text: 'ハルトさん、あしたの パーティー、だいじょうぶですか。', pl: 'Haruto, czy z jutrzejszą imprezą wszystko w porządku?', romaji: 'haruto-san, ashita no paatii, daijoubu desu ka.' },
          { speaker: 'H', text: 'はい。レストランは もう よやくして おきました。', pl: 'Tak. Restaurację już zarezerwowałem.', romaji: 'hai. resutoran wa mou yoyaku shite okimashita.' },
          { speaker: 'W', text: 'ありがとう ございます。ケーキは わたしが {作|つく}って おきます。', pl: 'Dzięki. Ciasto upiekę wcześniej ja.', romaji: 'arigatou gozaimasu. keeki wa watashi ga tsukutte okimasu.' },
          { speaker: 'H', text: 'えっ、ウェロニカさんが {作|つく}って くれるんですか。', pl: 'O, upieczesz je dla nas?', romaji: 'e, weronika-san ga tsukutte kureru n desu ka.' },
          {
            speaker: 'W',
            text: 'はい。{料理|りょうり}は {母|はは}に {教|おし}えて もらいましたから、だいじょうぶです。',
            pl: 'Tak. Gotowania nauczyła mnie mama, więc dam radę.',
            romaji: 'hai. ryouri wa haha ni oshiete moraimashita kara, daijoubu desu.',
          },
          { speaker: 'H', text: 'じゃあ、わたしは {飲|の}み{物|もの}を {買|か}って おきますね。', pl: 'To ja kupię wcześniej napoje.', romaji: 'jaa, watashi wa nomimono o katte okimasu ne.' },
          {
            speaker: 'W',
            text: 'あ、そうだ。きのう、カメラを {学校|がっこう}に わすれて しまったんです。',
            pl: 'A, właśnie. Wczoraj niestety zostawiłam aparat w szkole.',
            romaji: 'a, sou da. kinou, kamera o gakkou ni wasurete shimatta n desu.',
          },
          { speaker: 'H', text: 'だいじょうぶですよ。わたしが しゃしんを とって あげます。', pl: 'Nic nie szkodzi. Ja zrobię zdjęcia.', romaji: 'daijoubu desu yo. watashi ga shashin o totte agemasu.' },
          { speaker: 'H', text: 'じゃあ、かえりましょう。あ、まどを {閉|し}めて くれませんか。', pl: 'To wracajmy. Aha, możesz zamknąć okno?', romaji: 'jaa, kaerimashou. a, mado o shimete kuremasen ka.' },
          { speaker: 'W', text: 'はい、{閉|し}めて おきます。', pl: 'Jasne, zamknę.', romaji: 'hai, shimete okimasu.' },
        ],
        questions: [
          {
            id: 'ja.d.33-q1',
            prompt: 'Co Haruto już zrobił?',
            options: ['Zarezerwował restaurację', 'Upiekł ciasto', 'Kupił napoje'],
            answer: 0,
            explanation: 'レストランは もう よやくして おきました — restaurację już zarezerwowałem.',
          },
          {
            id: 'ja.d.33-q2',
            prompt: 'Kto nauczył Weronikę gotować?',
            options: ['Haruto', 'Jej mama', 'Nauczyciel z kursu'],
            answer: 1,
            explanation: '料理は 母に 教えて もらいました — gotowania nauczyła mnie mama.',
          },
          {
            id: 'ja.d.33-q3',
            prompt: 'Co się stało z aparatem Weroniki?',
            options: ['Zepsuł się', 'Zostawiła go w szkole', 'Pożyczyła go Haruto'],
            answer: 1,
            explanation: 'カメラを 学校に わすれて しまったんです — niestety zostawiłam aparat w szkole.',
          },
        ],
      },
      summary: [
        'Przysługi: 〜て あげる (ja dla kogoś), 〜て くれる (ktoś dla mnie), 〜て もらう (dostaję przysługę; wykonawca + に).',
        'Prośby: 〜て くれませんか, grzeczniej 〜て もらえませんか; wobec przełożonych zamiast 〜て あげる — 〜ましょうか.',
        '〜て しまう: do końca albo „niestety” (swobodnie 〜ちゃう / 〜じゃう); 〜て おく: zawczasu albo „zostawić” (swobodnie 〜とく).',
        'Kanji: 教 送 開 閉 — 教える, 送る, 開ける, 閉める.',
      ],
      followUp:
        'Pomyśl o ostatnim tygodniu: kto coś dla ciebie zrobił (〜て くれました), co ty zrobiłeś / zrobiłaś dla kogoś (〜て あげました), co niestety ci się przydarzyło (〜て しまいました) i co przygotujesz zawczasu na jutro (〜て おきます).',
    },
  ],
};
