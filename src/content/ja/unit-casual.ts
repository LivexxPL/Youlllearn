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

export const unitCasual: Unit = {
  id: 'ja.u7',
  title: 'Swobodnie: opinie, doświadczenia, umiejętności',
  description:
    'Formy zwykłe i swobodne rozmowy z przyjaciółmi, opinie i cudze słowa, doświadczenia, wyjaśnianie powodów, forma potencjalna oraz dawanie i otrzymywanie — z kanji poziomu N4.',
  level: 'A2+',
  lessons: [
    {
      id: 'ja.l26',
      title: 'Między przyjaciółmi',
      subtitle: 'あした ひま?',
      objective:
        'Utworzysz formy zwykłe (słownikową, ない, た, なかった oraz だ / じゃない / だった) i porozmawiasz swobodnie z przyjaciółmi — z pytaniami bez か i odpowiedziami うん / ううん.',
      level: 'A2 (JF) / N4',
      minutes: 12,
      intro: [
        'Do tej pory mówiłeś / mówiłaś grzecznie — formami です i ます. Tak rozmawia się z nieznajomymi, w sklepie i w pracy. Z przyjaciółmi, rodziną i rówieśnikami Japończycy mówią jednak krócej: formami zwykłymi.',
        'Formy zwykłe przydadzą się nie tylko w luźnej rozmowie. To z nich buduje się wiele konstrukcji, które poznasz w tym dziale: „myślę, że…”, „kiedyś byłem…”, „bo…”. Od tej lekcji nowe czasowniki podajemy w formie słownikowej.',
      ],
      items: [
        kanji('gaku', '学', 'nauka; uczyć się', 'がく・まな', ['ガク'], ['まな(ぶ)'], [
          { text: '{学生|がくせい}', pl: 'student; uczeń' },
          { text: '{学校|がっこう}', pl: 'szkoła' },
          { text: '{大学|だいがく}', pl: 'uniwersytet' },
        ], {
          plAlts: ['nauka', 'uczyć się', 'studia'],
          note: 'Od teraz がくせい, がっこう i だいがく zapisujemy 学生, 学校, 大学. W 学校 がく skraca się do がっ.',
        }),
        kanji('kou', '校', 'szkoła', 'こう', ['コウ'], [], [
          { text: '{学校|がっこう}', pl: 'szkoła' },
          { text: '{高校|こうこう}', pl: 'liceum' },
          { text: '{校長|こうちょう}', pl: 'dyrektor szkoły' },
        ], { note: 'Prawie zawsze w złożeniach: 学校 (szkoła), 高校 (liceum), 校長 (dyrektor szkoły).' }),
        kanji('sei', '生', 'życie; rodzić się', 'せい・う', ['セイ', 'ショウ'], ['い(きる)', 'う(まれる)', 'なま'], [
          { text: '{先生|せんせい}', pl: 'nauczyciel' },
          { text: '{学生|がくせい}', pl: 'student' },
          { text: '{生|う}まれる', pl: 'urodzić się' },
        ], {
          plAlts: ['życie', 'żyć', 'urodzić się', 'surowy'],
          note: 'Znak o wielu czytaniach: せい w 先生 i 学生, う(まれる) — urodzić się, なま — surowy. Od teraz せんせい piszemy 先生.',
        }),
        kanji('suki', '好', 'lubić; lubiany', 'す・こう', ['コウ'], ['す(き)'], [
          { text: '{好|す}き', pl: 'lubiany; lubię' },
          { text: '{大好|だいす}き', pl: 'uwielbiany; uwielbiam' },
        ], { plAlts: ['lubić', 'lubiany', 'ulubiony'], note: 'Od teraz すき zapisujemy 好き. Znak łączy „kobietę” i „dziecko”.' }),
        p('un', 'うん', 'tak (swobodnie)', {
          plAlts: ['no', 'aha', 'mhm'],
          note: 'Swobodne „tak” — do przyjaciół i rodziny. Grzecznie: はい.',
        }),
        p('uun', 'ううん', 'nie (swobodnie)', {
          note: 'Swobodne „nie”, wymawiane z wyraźnym przedłużeniem: u-un. Nie pomyl z krótkim うん (tak)! Grzecznie: いいえ.',
        }),
        p('da', 'だ', 'jest (swobodnie)', {
          plAlts: ['to jest', 'jestem'],
          note: 'Zwykła forma です po rzeczownikach i przymiotnikach na な: 学生だ, ひまだ. W pytaniu znika: ひま? — masz czas?',
        }),
        p('isogashii', 'いそがしい', 'zajęty; zapracowany', {
          plAlts: ['zajęta', 'zapracowana', 'mam dużo pracy'],
          note: 'Przymiotnik na -い: いそがしくない — nie jestem zajęty / zajęta. Przeciwieństwo: ひま.',
        }),
        p('mou', 'もう', 'już', {
          note: 'もう 食べた? — Jadłeś już? Na „jeszcze nie” odpowiadamy まだ.',
        }),
        p('mada', 'まだ', 'jeszcze; jeszcze nie', {
          plAlts: ['wciąż', 'nadal'],
          note: 'Z przeczeniem: まだ 食べていない (swobodnie 食べてない) — jeszcze nie jadłem / jadłam. ✗ まだ 食べなかった.',
        }),
        p('hontou', 'ほんとう', 'prawda; naprawdę', {
          plAlts: ['naprawdę', 'serio', 'prawdziwy'],
          note: 'Z pytającą intonacją: ほんとう? albo krócej ほんと? — Serio? Naprawdę?',
        }),
        p('matane', 'またね', 'na razie; do zobaczenia', {
          romaji: 'mata ne',
          plAlts: ['pa', 'cześć', 'do zobaczenia'],
          note: 'Swobodne pożegnanie z przyjaciółmi. Grzeczniej: じゃあ、また albo さようなら.',
        }),
        p('asobu', 'あそぶ', 'bawić się; spotykać się (dla przyjemności)', {
          alts: ['あそびます'],
          plAlts: ['bawić się', 'spotkać się', 'spędzać razem czas'],
          note: 'Gr. 1: あそびます, あそんで, あそんだ. Dorośli też „się bawią”: 友だちと あそぶ — spotkać się ze znajomymi, wyjść razem na miasto.',
        }),
      ],
      sentences: [
        s('26-1', 'あした ひま?', 'Masz jutro czas?', {
          romaji: 'ashita hima?',
          plAlts: ['Jesteś jutro wolny?', 'Jesteś jutro wolna?', 'Masz jutro wolne?', 'Jutro masz czas?'],
          tokens: ['あした', 'ひま'],
        }),
        s('26-2', 'うん、ひまだよ。', 'Tak, mam czas.', {
          romaji: 'un, hima da yo.',
          plAlts: ['No, mam czas.', 'Tak, mam wolne.', 'Tak, jestem wolny.', 'Tak, jestem wolna.'],
          tokens: ['うん', 'ひま', 'だよ'],
        }),
        s('26-3', '{今日|きょう}は ちょっと いそがしい。', 'Dziś jestem trochę zajęty / zajęta.', {
          romaji: 'kyou wa chotto isogashii.',
          plAlts: ['Dziś jestem trochę zajęty.', 'Dziś jestem trochę zajęta.', 'Dzisiaj jestem dość zajęty.', 'Dzisiaj jestem dość zajęta.', 'Dziś mam trochę dużo pracy.'],
          tokens: ['{今日|きょう}', 'は', 'ちょっと', 'いそがしい'],
        }),
        s('26-4', 'もう ひるごはんを {食|た}べた?', 'Jadłeś / jadłaś już lunch?', {
          romaji: 'mou hirugohan o tabeta?',
          plAlts: ['Jadłeś już lunch?', 'Jadłaś już lunch?', 'Zjadłeś już obiad?', 'Zjadłaś już obiad?', 'Jadłeś już obiad?', 'Jadłaś już obiad?'],
          tokens: ['もう', 'ひるごはん', 'を', '{食|た}べた'],
        }),
        s('26-5', 'ううん、まだ {食|た}べてない。', 'Nie, jeszcze nie jadłem / nie jadłam.', {
          romaji: 'uun, mada tabete nai.',
          plAlts: ['Nie, jeszcze nie jadłem.', 'Nie, jeszcze nie jadłam.', 'Nie, jeszcze nie.'],
          note: 'まだ + 〜ていない (swobodnie 〜てない) — jeszcze nie.',
          tokens: ['ううん', 'まだ', '{食|た}べてない'],
        }),
        s('26-6', 'きのうは どこも {行|い}かなかった。', 'Wczoraj nigdzie nie byłem / nie byłam.', {
          romaji: 'kinou wa doko mo ikanakatta.',
          plAlts: ['Wczoraj nigdzie nie byłem.', 'Wczoraj nigdzie nie byłam.', 'Wczoraj nigdzie nie poszedłem.', 'Wczoraj nigdzie nie poszłam.', 'Wczoraj nigdzie nie wychodziłem.', 'Wczoraj nigdzie nie wychodziłam.'],
          tokens: ['きのう', 'は', 'どこも', '{行|い}かなかった'],
        }),
        s('26-7', 'きのうは {学校|がっこう}が {休|やす}みだった。', 'Wczoraj nie było lekcji w szkole.', {
          romaji: 'kinou wa gakkou ga yasumi datta.',
          plAlts: ['Wczoraj nie było szkoły.', 'Wczoraj nie było lekcji.', 'Wczoraj w szkole był dzień wolny.', 'Wczoraj szkoła była zamknięta.'],
          tokens: ['きのう', 'は', '{学校|がっこう}', 'が', '{休|やす}み', 'だった'],
        }),
        s('26-8', 'ねこ、{好|す}き?', 'Lubisz koty?', {
          romaji: 'neko, suki?',
          plAlts: ['Czy lubisz koty?', 'Lubisz kota?'],
          note: 'W luźnej rozmowie partykuła が często znika: ねこ(が) 好き?',
          tokens: ['ねこ', '{好|す}き'],
        }),
        s('26-9', 'しゅうまつ、{友|とも}だちと あそんだ。', 'W weekend spotkałem / spotkałam się ze znajomymi.', {
          romaji: 'shuumatsu, tomodachi to asonda.',
          plAlts: [
            'W weekend spotkałem się ze znajomymi.',
            'W weekend spotkałam się ze znajomymi.',
            'W weekend spotkałem się z przyjacielem.',
            'W weekend spotkałam się z przyjaciółką.',
            'W weekend wyszedłem ze znajomymi.',
            'W weekend wyszłam ze znajomymi.',
          ],
          tokens: ['しゅうまつ', '{友|とも}だち', 'と', 'あそんだ'],
        }),
      ],
      grammar: [
        {
          id: 'ja.g.plain-verbs',
          title: 'Formy zwykłe czasowników: る, ない, た, なかった',
          body: [
            'Każda forma ます ma swój odpowiednik zwykły — bez ます. Formę słownikową ([[{食|た}べる]]) i formę ない ([[{食|た}べない]]) już znasz. Dochodzą do nich przeszłość **た** i przeszłość przecząca **なかった**.',
            'Formę **た** tworzymy dokładnie jak formę て — wystarczy zamienić て na た, a で na だ: [[{食|た}べて]] → [[{食|た}べた]], [[{飲|の}んで]] → [[{飲|の}んだ]], [[{行|い}って]] → [[{行|い}った]], [[して]] → [[した]], [[{来|き}て]] → [[{来|き}た]].',
            'Formę **なかった** tworzymy z formy ない: końcowe い zamieniamy na かった — jak w przymiotnikach: [[{食|た}べない]] → [[{食|た}べなかった]], [[{行|い}かない]] → [[{行|い}かなかった]], [[こない]] → [[こなかった]].',
            'Swobodnie い w 〜ている często znika, także w przeczeniu: [[{見|み}てない]] — nie widziałem (jeszcze). Na pytanie z [[もう]] (już) odpowiadamy [[まだ {見|み}てない]], a nie ✗ まだ 見なかった.',
          ],
          table: {
            head: ['grupa', 'słownikowa', 'ない', 'た', 'なかった'],
            rows: [
              ['1', 'のむ', 'のまない', 'のんだ', 'のまなかった'],
              ['1', 'かう', 'かわない', 'かった', 'かわなかった'],
              ['1', 'いく', 'いかない', 'いった', 'いかなかった'],
              ['1', 'はなす', 'はなさない', 'はなした', 'はなさなかった'],
              ['2', 'たべる', 'たべない', 'たべた', 'たべなかった'],
              ['3', 'する', 'しない', 'した', 'しなかった'],
              ['3', 'くる', 'こない', 'きた', 'こなかった'],
            ],
          },
          contrast:
            'Po polsku przejście „na ty” zmienia osobę czasownika: „Czy pan jadł?” → „Jadłeś?”. Po japońsku osoba się nie zmienia — zmienia się poziom grzeczności: 食べましたか (grzecznie) → 食べた? (do przyjaciela). Za to forma zwykła ma własne końcówki, których trzeba się nauczyć.',
        },
        {
          id: 'ja.g.casual-speech',
          title: 'Rozmowa na luzie: だ, うん / ううん, pytania bez か',
          body: [
            'Rzeczowniki i przymiotniki na な w stylu zwykłym: です → [[だ]], じゃないです → [[じゃない]], でした → [[だった]], じゃなかったです → [[じゃなかった]]. Przymiotniki na -い po prostu tracą です: [[いそがしい]], [[たのしかった]].',
            'W pytaniu zamiast か wystarczy **rosnąca intonacja**: [[あした ひま?]] Przy rzeczownikach i przymiotnikach na な だ w pytaniu znika (✗ ひまだ?). Odpowiadamy [[うん]] (tak) albo [[ううん]] (nie). Na końcu zdania często słychać [[よ]] („mówię ci”, nowa informacja) i [[ね]] („prawda?”). Partykuły が, を, は bywają pomijane: [[ねこ、{好|す}き?]]',
            'Zaproszenie wśród przyjaciół to forma ない z pytającą intonacją — odpowiednik 〜ませんか: [[いっしょに {行|い}かない?]] — Może pójdziemy razem?',
            '**Kiedy który styl?** Formy zwykłe — z rodziną, przyjaciółmi, rówieśnikami i młodszymi. Formy です / ます — z nieznajomymi, w sklepie, w pracy, do starszych i przełożonych. W razie wątpliwości wybierz です / ます: to nigdy nie jest błąd, najwyżej brzmi z dystansem.',
          ],
          table: {
            head: ['', 'grzecznie', 'swobodnie'],
            rows: [
              ['rzeczownik / な', 'ひまです', 'ひまだ'],
              ['przeczenie', 'ひまじゃないです', 'ひまじゃない'],
              ['przeszłość', 'ひまでした', 'ひまだった'],
              ['przeszłość przecząca', 'ひまじゃなかったです', 'ひまじゃなかった'],
              ['przymiotnik -い', 'たのしいです', 'たのしい'],
              ['pytanie', 'ひまですか', 'ひま?'],
              ['tak / nie', 'はい / いいえ', 'うん / ううん'],
            ],
          },
          contrast:
            'Polskie „ty” i „pan / pani” mają swój odpowiednik w japońskich stylach: formy zwykłe przypominają mówienie „na ty”, a です / ます — „per pan”. I tak jak u nas, zbyt szybkie przejście na luźny styl z przełożonym albo starszą osobą może urazić.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'ja.x.26-1',
          concept: 'ja.g.plain-verbs',
          sentence: 'きのう えいがを ___。',
          pl: 'Wczoraj obejrzałem / obejrzałam film.',
          options: ['{見|み}た', '{見|み}った', '{見|み}だ'],
          answer: '{見|み}た',
          explanation: 'みる (gr. 2): る → た — みた. Forma た powstaje jak forma て: みて → みた.',
        },
        {
          type: 'gap',
          id: 'ja.x.26-2',
          concept: 'ja.g.plain-verbs',
          sentence: '{今日|きょう}は {何|なに}も ___。',
          pl: 'Dziś nic nie kupiłem / nie kupiłam.',
          options: ['{買|か}わなかった', '{買|か}いなかった', '{買|か}わないだった'],
          answer: '{買|か}わなかった',
          explanation: 'かう → かわない (う → わ), a przeszłość formy ない: ない → なかった — かわなかった. Forma ✗ ないだった nie istnieje.',
        },
        {
          type: 'gap',
          id: 'ja.x.26-3',
          concept: 'ja.g.plain-verbs',
          sentence: '{友|とも}だちと にほんごで ___。',
          pl: 'Rozmawiałem / rozmawiałam z przyjacielem po japońsku.',
          options: ['{話|はな}した', '{話|はな}しった', '{話|はな}いた'],
          answer: '{話|はな}した',
          explanation: 'はなす kończy się na す: forma て はなして, więc forma た — はなした.',
        },
        {
          type: 'gap',
          id: 'ja.x.26-4',
          concept: 'ja.g.casual-speech',
          sentence: 'きのうは {休|やす}み___。',
          pl: 'Wczoraj miałem / miałam wolne.',
          options: ['だった', 'かった', 'だ'],
          answer: 'だった',
          explanation: '休み to rzeczownik — przeszłość w stylu zwykłym: だった. かった dodajemy tylko do przymiotników na -い (たのしかった), a だ to czas teraźniejszy.',
        },
        {
          type: 'choice',
          id: 'ja.x.26-5',
          concept: 'ja.g.casual-speech',
          prompt: 'Przyjaciel pyta: あした ひま? Masz czas. Co odpowiesz?',
          target: 'あした ひま?',
          options: ['うん、ひまだよ。', 'ううん、ひまだよ。', 'うん、ひまだった。'],
          answer: 0,
          explanation: 'うん = tak. ううん znaczy „nie”, a ひまだった — „miałem / miałam czas” (przeszłość).',
        },
        {
          type: 'choice',
          id: 'ja.x.26-6',
          concept: 'ja.g.casual-speech',
          prompt: 'Komu raczej powiesz 食べた? zamiast 食べましたか?',
          optionsLang: 'pl',
          options: ['Koleżance ze studiów', 'Nowemu szefowi', 'Recepcjoniście w hotelu'],
          answer: 0,
          explanation: 'Formy zwykłe — z przyjaciółmi, rodziną i rówieśnikami. Do przełożonych i obcych mówimy です / ます.',
        },
        {
          type: 'choice',
          id: 'ja.x.26-7',
          concept: 'ja.g.plain-verbs',
          prompt: 'Jaka jest forma た czasownika くる (przychodzić)?',
          options: ['きた', 'くった', 'こた'],
          answer: 0,
          explanation: 'くる jest nieregularny: きた (jak forma て きて). Przeczenie: こない → こなかった.',
        },
      ],
      dialogue: {
        id: 'ja.d.26',
        title: 'Plany na sobotę',
        context: 'Riku dzwoni do koleżanki ze studiów, Kasi. Rozmawiają swobodnie, formami zwykłymi.',
        speakers: {
          R: { name: 'Riku', voice: 'b', accent: 'ja-JP' },
          K: { name: 'Kasia', voice: 'a', accent: 'ja-JP' },
        },
        lines: [
          { speaker: 'R', text: 'カシャ、あした ひま?', pl: 'Kasia, masz jutro czas?', romaji: 'kasha, ashita hima?' },
          { speaker: 'K', text: 'うん、ひまだよ。{何|なに}?', pl: 'Tak, mam. A co?', romaji: 'un, hima da yo. nani?' },
          {
            speaker: 'R',
            text: '{新|あたら}しい アニメの えいが、もう {見|み}た?',
            pl: 'Widziałaś już nowy film anime?',
            romaji: 'atarashii anime no eiga, mou mita?',
          },
          { speaker: 'K', text: 'ううん、まだ {見|み}てない。{見|み}たい!', pl: 'Nie, jeszcze nie widziałam. Chcę go zobaczyć!', romaji: 'uun, mada mite nai. mitai!' },
          { speaker: 'R', text: 'ほんと? じゃあ、いっしょに {行|い}かない?', pl: 'Serio? To może pójdziemy razem?', romaji: 'honto? jaa, issho ni ikanai?' },
          { speaker: 'K', text: 'いいね! {何時|なんじ}に {会|あ}う?', pl: 'Super! O której się spotkamy?', romaji: 'ii ne! nanji ni au?' },
          { speaker: 'R', text: '{十時|じゅうじ}に えきの {前|まえ}で どう?', pl: 'Może o dziesiątej przed stacją?', romaji: 'juuji ni eki no mae de dou?' },
          { speaker: 'K', text: 'うん、{分|わ}かった。じゃあ、またね!', pl: 'Dobra, pasuje. To na razie!', romaji: 'un, wakatta. jaa, mata ne!' },
        ],
        questions: [
          {
            id: 'ja.d.26-q1',
            prompt: 'Czy Kasia widziała już nowy film anime?',
            options: ['Tak, w zeszłym tygodniu', 'Nie, jeszcze nie', 'Nie i nie chce go oglądać'],
            answer: 1,
            explanation: 'ううん、まだ 見てない。見たい! — Nie, jeszcze nie widziałam. Chcę zobaczyć!',
          },
          {
            id: 'ja.d.26-q2',
            prompt: 'Gdzie i o której się umawiają?',
            options: ['O dziesiątej w kinie', 'O dziesiątej przed stacją', 'O drugiej przed stacją'],
            answer: 1,
            explanation: '十時に えきの 前で どう? — Może o dziesiątej przed stacją? Kasia się zgadza: うん、分かった.',
          },
          {
            id: 'ja.d.26-q3',
            prompt: 'Jak Riku proponuje wspólne wyjście?',
            options: ['Pyta formą przeczącą 行かない? — jak 〜ませんか', 'Mówi grzecznie 行きましょう', 'Pyta, czy Kasia chce iść sama'],
            answer: 0,
            explanation: 'Wśród przyjaciół zaproszenie to forma ない z pytającą intonacją: いっしょに 行かない? (grzecznie: 行きませんか).',
          },
        ],
      },
      summary: [
        'Formy zwykłe: 飲む / 飲まない / 飲んだ / 飲まなかった; た tworzymy jak て (飲んで → 飲んだ).',
        'Rzeczowniki i przymiotniki na な: ひまだ / ひまじゃない / ひまだった / ひまじゃなかった; -い: たのしい / たのしかった.',
        'Swobodnie: pytanie bez か (ひま?), うん / ううん, よ i ね; zaproszenie: 行かない?',
        'Kanji: 学 校 生 好 — 学生, 学校, 先生, 好き.',
      ],
      followUp:
        'Napisz w myślach (albo naprawdę — do znajomego) trzy krótkie wiadomości w stylu zwykłym: co dziś robiłeś / robiłaś, czego nie zrobiłeś / nie zrobiłaś i jedno zaproszenie z 〜ない?',
    },
  ],
};
