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
    {
      id: 'ja.l27',
      title: 'Myślę, że…',
      subtitle: '〜と おもいます',
      objective:
        'Wyrazisz własne zdanie (〜と おもいます), przekażesz cudze słowa (〜と いいました) i powiesz, co jest prawdopodobne (〜でしょう) albo możliwe (〜かもしれません).',
      level: 'A2 (JF) / N4',
      minutes: 12,
      items: [
        kanji('omou', '思', 'myśleć; sądzić', 'おも・し', ['シ'], ['おも(う)'], [
          { text: '{思|おも}う', pl: 'myśleć; sądzić' },
          { text: '{思|おも}い{出|で}', pl: 'wspomnienie' },
        ], { plAlts: ['myśleć', 'sądzić', 'uważać'], note: 'おもう (gr. 1): おもいます, おもって, おもった.' }),
        kanji('iu', '言', 'mówić; słowo', 'い・げん', ['ゲン', 'ゴン'], ['い(う)', 'こと'], [
          { text: '{言|い}います', pl: 'mówić; powiedzieć' },
          { text: '{一言|ひとこと}', pl: 'jedno słowo; parę słów' },
        ], {
          plAlts: ['mówić', 'powiedzieć', 'słowo'],
          note: 'Od teraz いいます (mówić) piszemy 言います. Formę słownikową いう wymawia się zwykle jak „yuu”.',
        }),
        kanji('ten', '天', 'niebo', 'てん', ['テン'], ['あま', 'あめ'], [
          { text: '{天気|てんき}', pl: 'pogoda' },
          { text: '{天|てん}ぷら', pl: 'tempura (smażone w cieście owoce morza i warzywa)' },
        ], { plAlts: ['niebiosa'] }),
        kanji('ki', '気', 'duch; energia; nastrój', 'き', ['キ', 'ケ'], [], [
          { text: '{天気|てんき}', pl: 'pogoda' },
          { text: '{人気|にんき}', pl: 'popularność' },
          { text: '{気|き}を つけて', pl: 'uważaj; trzymaj się' },
        ], {
          plAlts: ['duch', 'energia', 'nastrój', 'powietrze'],
          note: 'Bardzo częsty w złożeniach: 天気 (pogoda), 人気 (popularność). Ten sam znak jest w słowie げんき (zdrowy, w formie).',
        }),
        p('toomoimasu', '〜と {思|おも}います', 'myślę, że …', {
          reading: 'と おもいます',
          romaji: '~to omoimasu',
          tts: 'あめが ふると おもいます',
          alts: ['と思います', 'あめが ふると おもいます'],
          plAlts: ['sądzę, że', 'uważam, że', 'myślę, że'],
          note: 'Przed と stoi forma zwykła: あめが ふると 思います. Rzeczownik i przymiotnik na な + だ: あめだと 思います.',
        }),
        p('toiimashita', '〜と {言|い}いました', 'powiedział(a), że …', {
          reading: 'と いいました',
          romaji: '~to iimashita',
          tts: 'いかないと いいました',
          alts: ['と言いました', 'いかないと いいました'],
          plAlts: ['powiedział, że', 'powiedziała, że', 'mówił, że', 'mówiła, że'],
          note: 'Cudze słowa: forma zwykła + と 言いました. Dokładny cytat ujmujemy w 「」: 「はい」と 言いました.',
        }),
        p('deshou', '〜でしょう', 'prawdopodobnie …; chyba …', {
          romaji: '~deshou',
          tts: 'あめでしょう',
          alts: ['でしょう', 'あめでしょう'],
          plAlts: ['pewnie', 'zapewne'],
          note: 'Dość pewne przypuszczenie — typowe w prognozach pogody: あしたは あめでしょう. Rzeczownik łączy się bez だ!',
        }),
        p('kamoshiremasen', '〜かもしれません', 'może …; możliwe, że …', {
          romaji: '~kamoshiremasen',
          tts: 'ふるかもしれません',
          alts: ['かもしれません', 'ふるかもしれません'],
          plAlts: ['być może', 'możliwe'],
          note: 'Mniejsza pewność niż でしょう — mniej więcej pół na pół. Swobodnie: かもしれない albo krótko かも.',
        }),
        p('ame', 'あめ', 'deszcz', { note: 'あめが ふる — pada deszcz. あめでしょう — prawdopodobnie będzie padać.' }),
        p('furu', 'ふる', 'padać (o deszczu, śniegu)', {
          alts: ['ふります'],
          plAlts: ['pada', 'będzie padać'],
          note: 'Gr. 1: ふります, ふって, ふった. Deszcz i śnieg łączą się z が: あめが ふる, ゆきが ふる.',
        }),
        p('tabun', 'たぶん', 'chyba; prawdopodobnie', {
          plAlts: ['pewnie', 'zapewne'],
          note: 'Często w parze z でしょう albo と 思います: たぶん 来ないと 思います — chyba nie przyjdzie.',
        }),
        p('tenkiyohou', '{天気|てんき}よほう', 'prognoza pogody', {
          reading: 'てんきよほう',
          plAlts: ['prognoza'],
          note: 'Prognozy mówią formą でしょう: あしたは あめでしょう — jutro prawdopodobnie będzie padać.',
        }),
        p('souomoimasu', 'そう {思|おも}います', 'też tak myślę; tak uważam', {
          reading: 'そう おもいます',
          romaji: 'sou omoimasu',
          plAlts: ['tak myślę', 'też tak uważam', 'zgadzam się'],
          note: 'Grzeczna niezgoda: そうは 思いません — nie sądzę.',
        }),
        p('demo', 'でも', 'ale; jednak', {
          plAlts: ['lecz', 'tylko że'],
          note: 'Na początku zdania: でも、わたしは そう 思いません — ale ja tak nie uważam.',
        }),
      ],
      sentences: [
        s('27-1', 'あしたは あめが ふると {思|おも}います。', 'Myślę, że jutro będzie padać.', {
          romaji: 'ashita wa ame ga furu to omoimasu.',
          plAlts: ['Myślę, że jutro będzie padał deszcz.', 'Sądzę, że jutro będzie padać.', 'Chyba jutro będzie padać.'],
          tokens: ['あした', 'は', 'あめ', 'が', 'ふる', 'と', '{思|おも}います'],
        }),
        s('27-2', 'この {本|ほん}は とても いいと {思|おも}います。', 'Myślę, że ta książka jest bardzo dobra.', {
          romaji: 'kono hon wa totemo ii to omoimasu.',
          plAlts: ['Uważam, że ta książka jest bardzo dobra.', 'Moim zdaniem ta książka jest bardzo dobra.'],
          tokens: ['この', '{本|ほん}', 'は', 'とても', 'いい', 'と', '{思|おも}います'],
        }),
        s('27-3', 'やまださんは あした {休|やす}むと {言|い}いました。', 'Pan Yamada powiedział, że jutro weźmie wolne.', {
          romaji: 'yamada-san wa ashita yasumu to iimashita.',
          plAlts: [
            'Pani Yamada powiedziała, że jutro weźmie wolne.',
            'Pan Yamada powiedział, że jutro go nie będzie.',
            'Pani Yamada powiedziała, że jutro jej nie będzie.',
          ],
          tokens: ['やまださん', 'は', 'あした', '{休|やす}む', 'と', '{言|い}いました'],
        }),
        s('27-4', 'ミハウさんは「{日本|にほん}が {大好|だいす}きです」と {言|い}いました。', 'Michał powiedział: „Uwielbiam Japonię”.', {
          romaji: 'mihau-san wa "nihon ga daisuki desu" to iimashita.',
          plAlts: ['Michał powiedział, że uwielbia Japonię.', 'Michał powiedział: „Bardzo lubię Japonię”.'],
          tokens: ['ミハウさん', 'は', '{日本|にほん}', 'が', '{大好|だいす}き', 'です', 'と', '{言|い}いました'],
        }),
        s('27-5', '{天気|てんき}よほうで、あしたは あめだと {言|い}っていました。', 'W prognozie pogody mówili, że jutro będzie padać.', {
          romaji: 'tenkiyohou de, ashita wa ame da to itte imashita.',
          plAlts: ['Prognoza mówiła, że jutro będzie padać.', 'W prognozie zapowiadali na jutro deszcz.'],
          tokens: ['{天気|てんき}よほう', 'で', 'あした', 'は', 'あめ', 'だ', 'と', '{言|い}っていました'],
        }),
        s('27-6', 'あしたは たぶん あめでしょう。', 'Jutro prawdopodobnie będzie padać.', {
          romaji: 'ashita wa tabun ame deshou.',
          plAlts: ['Jutro pewnie będzie padać.', 'Jutro chyba będzie padać.', 'Jutro prawdopodobnie będzie deszcz.'],
          tokens: ['あした', 'は', 'たぶん', 'あめ', 'でしょう'],
        }),
        s('27-7', 'ケンさんは もう うちに かえったでしょう。', 'Ken pewnie już wrócił do domu.', {
          romaji: 'ken-san wa mou uchi ni kaetta deshou.',
          plAlts: ['Ken chyba już wrócił do domu.', 'Ken prawdopodobnie jest już w domu.'],
          tokens: ['ケンさん', 'は', 'もう', 'うち', 'に', 'かえった', 'でしょう'],
        }),
        s('27-8', 'たなかさんは {今日|きょう} {来|こ}ないかもしれません。', 'Pan Tanaka może dziś nie przyjść.', {
          romaji: 'tanaka-san wa kyou konai kamoshiremasen.',
          plAlts: ['Pani Tanaka może dziś nie przyjść.', 'Możliwe, że pan Tanaka dziś nie przyjdzie.', 'Możliwe, że pani Tanaka dziś nie przyjdzie.'],
          tts: 'たなかさんは きょう こないかもしれません。',
          tokens: ['たなかさん', 'は', '{今日|きょう}', '{来|こ}ない', 'かもしれません'],
        }),
        s('27-9', 'わたしも そう {思|おも}います。', 'Ja też tak myślę.', {
          romaji: 'watashi mo sou omoimasu.',
          plAlts: ['Też tak uważam.', 'Ja też tak uważam.', 'Też tak myślę.'],
          tokens: ['わたし', 'も', 'そう', '{思|おも}います'],
        }),
      ],
      grammar: [
        {
          id: 'ja.g.to-omou',
          title: 'Myślę, że… i powiedział, że…: forma zwykła + と',
          body: [
            'Własne zdanie wyrażamy zdaniem w **formie zwykłej** + [[と {思|おも}います]]: [[あめが ふると {思|おも}います。]] — Myślę, że będzie padać. と pełni rolę polskiego „że”, tylko stoi na końcu zdania podrzędnego.',
            'Rzeczowniki i przymiotniki na な dostają przed と **だ**: [[あめだと {思|おも}います]], [[しずかだと {思|おも}います]]. Czasowniki i przymiotniki na -い — bez dodatków: [[いいと {思|おも}います]], [[{来|こ}ないと {思|おも}います]].',
            'Cudze słowa: [[〜と {言|い}いました]] — powiedział(a), że… Dokładny cytat ujmujemy w 「」: [[「すみません」と {言|い}いました。]] Gdy przekazujemy, co ktoś mówił — np. w telewizji albo w prognozie — często używamy [[{言|い}っていました]].',
            'Przeczenie stawiamy zwykle w zdaniu podrzędnym: [[{来|こ}ないと {思|おも}います]] — myślę, że nie przyjdzie. Grzeczna niezgoda: [[そうは {思|おも}いません]] — nie sądzę. Swobodnie wystarczy [[〜と {思|おも}う]].',
          ],
          table: {
            head: ['', 'przed と', 'przykład'],
            rows: [
              ['czasownik', 'ふる / ふらない / ふった', 'ふると おもいます'],
              ['przymiotnik -い', 'いい / よくない', 'いいと おもいます'],
              ['przymiotnik な', 'しずかだ / しずかじゃない', 'しずかだと おもいます'],
              ['rzeczownik', 'あめだ / あめじゃない', 'あめだと おもいます'],
            ],
          },
          contrast:
            'Po polsku „że” otwiera zdanie podrzędne: „Myślę, że będzie padać”. Po japońsku と je zamyka, a „myślę” stoi na samym końcu: あめが ふる と 思います — dosłownie „będzie padać, że — myślę”. Także przeczenie wędruje do środka: 来ないと 思います to „myślę, że nie przyjdzie”, a nie „nie myślę, że przyjdzie”.',
        },
        {
          id: 'ja.g.deshou-kamo',
          title: 'Przypuszczenia: 〜でしょう i 〜かもしれません',
          body: [
            '[[でしょう]] wyraża przypuszczenie, w którym mówiący jest dość pewny: [[あしたは あめでしょう。]] — Jutro prawdopodobnie będzie padać. Tak brzmią prognozy pogody. Często towarzyszy mu [[たぶん]] (chyba, pewnie).',
            '[[かもしれません]] znaczy „może”, „możliwe, że” — pewność jest mniejsza, mniej więcej pół na pół: [[あめが ふるかもしれません。]] — Może będzie padać.',
            'Obie formy stoją po formie zwykłej, ale **bez だ**: [[あめでしょう]], [[ひまかもしれません]] (✗ あめだでしょう). Czasowniki i przymiotniki na -い — bez zmian: [[{来|こ}ないでしょう]], [[{高|たか}いかもしれません]].',
            'Z rosnącą intonacją でしょう? prosi o potwierdzenie: [[おいしいでしょう?]] — Smaczne, prawda? Swobodnie mówimy [[だろう]] i [[かもしれない]] albo krótko [[かも]].',
          ],
          table: {
            head: ['forma', 'znaczenie', 'przykład'],
            rows: [
              ['〜と おもいます', 'myślę, że (opinia)', 'ふると おもいます'],
              ['〜でしょう', 'prawdopodobnie (dość pewne)', 'ふるでしょう'],
              ['〜かもしれません', 'może, możliwe, że', 'ふるかもしれません'],
              ['〜だろう / 〜かもしれない', 'to samo, swobodnie', 'ふるだろう / ふるかも'],
            ],
          },
          contrast:
            'Polskie „chyba”, „pewnie” i „może” to osobne słowa, zwykle na początku zdania. Japońskie odpowiedniki stoją na końcu i doklejają się do zdania: ふるでしょう, ふるかもしれません. Dobra wiadomość: przed nimi zawsze stoi forma zwykła, a だ po prostu znika.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'ja.x.27-1',
          concept: 'ja.g.to-omou',
          sentence: '{今日|きょう}は ゆきが ___と {思|おも}います。',
          pl: 'Myślę, że dziś będzie padać śnieg.',
          options: ['ふる', 'ふります', 'ふって'],
          answer: 'ふる',
          explanation: 'Przed と 思います stoi forma zwykła: ふる. Forma ます przed と brzmi nienaturalnie, a ふって to forma て.',
        },
        {
          type: 'gap',
          id: 'ja.x.27-2',
          concept: 'ja.g.to-omou',
          sentence: 'あの レストランは しずか___と {思|おも}います。',
          pl: 'Myślę, że tamta restauracja jest cicha.',
          options: ['だ', 'な', 'です'],
          answer: 'だ',
          explanation: 'Przymiotnik na な w formie zwykłej: しずかだ → しずかだと 思います. な stawiamy tylko przed rzeczownikiem.',
        },
        {
          type: 'gap',
          id: 'ja.x.27-3',
          concept: 'ja.g.deshou-kamo',
          sentence: 'あしたは たぶん ゆき___。',
          pl: 'Jutro prawdopodobnie będzie padać śnieg.',
          options: ['でしょう', 'だでしょう', 'と {言|い}いました'],
          answer: 'でしょう',
          explanation: 'Przed でしょう rzeczownik nie dostaje だ: ゆきでしょう. と 言いました przekazuje cudze słowa.',
        },
        {
          type: 'choice',
          id: 'ja.x.27-4',
          concept: 'ja.g.deshou-kamo',
          prompt: 'Nie wiesz, czy kolega przyjdzie — szanse oceniasz pół na pół. Co powiesz?',
          options: ['{来|く}るかもしれません。', '{来|き}ますでしょう。', '{来|こ}ないと {言|い}いました。'],
          answer: 0,
          explanation: 'Możliwość (pół na pół): 〜かもしれません — 来るかもしれません (może przyjdzie). ✗ 来ますでしょう — przed でしょう stoi forma zwykła, a 来ないと 言いました to cudze słowa.',
        },
        {
          type: 'choice',
          id: 'ja.x.27-5',
          concept: 'ja.g.to-omou',
          prompt: 'Ken powiedział ci, że jutro nie przyjdzie. Jak przekażesz to innym?',
          options: ['ケンさんは あした {来|こ}ないと {言|い}いました。', 'ケンさんは あした {来|き}ませんと {思|おも}います。', 'ケンさんは あした {来|こ}ないでしょう。'],
          answer: 0,
          explanation: 'Cudze słowa: forma zwykła + と 言いました. 来ないでしょう to tylko twoje przypuszczenie, a 来ませんと 思います łączy błędnie formę ます z と 思います.',
        },
        {
          type: 'choice',
          id: 'ja.x.27-6',
          concept: 'ja.g.to-omou',
          prompt: 'Szef mówi: この ケーキは おいしいですね. Zgadzasz się. Co odpowiesz?',
          options: ['わたしも そう {思|おも}います。', 'わたしも そう {言|い}いました。', 'わたしも そうかもしれません。'],
          answer: 0,
          explanation: 'そう 思います — też tak uważam. そう 言いました znaczy „tak powiedziałem / powiedziałam”, a そうかもしれません brzmi niepewnie i nie pasuje do zgody.',
        },
      ],
      dialogue: {
        id: 'ja.d.27',
        title: 'Prognoza pogody',
        context: 'Ania i jej kolega z pracy, pan Satō, planują wycieczkę w góry.',
        speakers: {
          S: { name: 'Pan Satō', voice: 'b', accent: 'ja-JP' },
          A: { name: 'Ania', voice: 'a', accent: 'ja-JP' },
        },
        lines: [
          {
            speaker: 'S',
            text: 'アニャさん、{土曜日|どようび}に {山|やま}へ {行|い}きませんか。',
            pl: 'Aniu, może pojedziemy w sobotę w góry?',
            romaji: 'anya-san, doyoubi ni yama e ikimasen ka.',
          },
          {
            speaker: 'A',
            text: 'いいですね。でも、{土曜日|どようび}は あめが ふるかもしれません。',
            pl: 'Chętnie. Ale w sobotę może padać.',
            romaji: 'ii desu ne. demo, doyoubi wa ame ga furu kamoshiremasen.',
          },
          {
            speaker: 'S',
            text: 'そうですか。{天気|てんき}よほうは {何|なん}と {言|い}っていましたか。',
            pl: 'Naprawdę? Co mówili w prognozie pogody?',
            romaji: 'sou desu ka. tenkiyohou wa nan to itte imashita ka.',
          },
          { speaker: 'A', text: 'ごごは あめだと {言|い}っていました。', pl: 'Mówili, że po południu będzie padać.', romaji: 'gogo wa ame da to itte imashita.' },
          { speaker: 'S', text: 'じゃあ、{日曜日|にちようび}は どうですか。', pl: 'To może w niedzielę?', romaji: 'jaa, nichiyoubi wa dou desu ka.' },
          {
            speaker: 'A',
            text: '{日曜日|にちようび}は たぶん いい {天気|てんき}でしょう。',
            pl: 'W niedzielę prawdopodobnie będzie ładna pogoda.',
            romaji: 'nichiyoubi wa tabun ii tenki deshou.',
          },
          {
            speaker: 'S',
            text: 'わたしも そう {思|おも}います。じゃあ、{日曜日|にちようび}に {行|い}きましょう!',
            pl: 'Też tak myślę. To jedźmy w niedzielę!',
            romaji: 'watashi mo sou omoimasu. jaa, nichiyoubi ni ikimashou!',
          },
          { speaker: 'A', text: 'はい、そう しましょう!', pl: 'Tak, zróbmy tak!', romaji: 'hai, sou shimashou!' },
        ],
        questions: [
          {
            id: 'ja.d.27-q1',
            prompt: 'Dlaczego nie jadą w góry w sobotę?',
            options: ['Bo Ania pracuje', 'Bo może padać', 'Bo w górach jest za zimno'],
            answer: 1,
            explanation: '土曜日は あめが ふるかもしれません — w sobotę może padać.',
          },
          {
            id: 'ja.d.27-q2',
            prompt: 'Co mówili w prognozie pogody?',
            options: ['Że po południu będzie padać', 'Że cały dzień będzie słonecznie', 'Że będzie padać śnieg'],
            answer: 0,
            explanation: 'ごごは あめだと 言っていました — mówili, że po południu będzie padać.',
          },
          {
            id: 'ja.d.27-q3',
            prompt: 'Na kiedy się w końcu umawiają?',
            options: ['Na sobotę rano', 'Na przyszły tydzień', 'Na niedzielę'],
            answer: 2,
            explanation: 'じゃあ、日曜日に 行きましょう! — to jedźmy w niedzielę!',
          },
        ],
      },
      summary: [
        'Opinia: forma zwykła + と 思います — あめが ふると 思います; rzeczownik i な + だ: あめだと 思います.',
        'Cudze słowa: 〜と 言いました / 言っていました; dokładny cytat: 「…」と 言いました.',
        'Przypuszczenie: 〜でしょう (prawdopodobnie), 〜かもしれません (może) — bez だ: あめでしょう.',
        'Kanji: 思 言 天 気 — 思います, 言います, 天気, 人気.',
      ],
      followUp:
        'Sprawdź prognozę pogody na jutro i powiedz ją po japońsku na trzy sposoby: z 〜と 思います, 〜でしょう i 〜かもしれません.',
    },
    {
      id: 'ja.l28',
      title: 'Czy kiedyś…?',
      subtitle: '〜た ことが あります',
      objective:
        'Opowiesz o swoich doświadczeniach (〜た ことが あります), zapytasz, czy ktoś coś kiedyś robił, i wymienisz przykładowe czynności (〜たり 〜たり します) — o podróżach, jedzeniu i hobby.',
      level: 'A2 (JF) / N4',
      minutes: 12,
      items: [
        kanji('ei', '映', 'odbijać się; wyświetlać', 'えい・うつ', ['エイ'], ['うつ(る)', 'うつ(す)'], [
          { text: '{映画|えいが}', pl: 'film' },
          { text: '{映|うつ}る', pl: 'odbijać się; być widocznym (np. w lustrze)' },
        ], { plAlts: ['odbicie', 'wyświetlanie'], note: 'Najczęściej w słowie 映画 (film). Od teraz えいが piszemy 映画.' }),
        kanji('ga', '画', 'obraz; rysunek', 'が・かく', ['ガ', 'カク'], [], [
          { text: '{映画|えいが}', pl: 'film' },
          { text: '{日本画|にほんが}', pl: 'malarstwo japońskie' },
        ], { plAlts: ['obraz', 'rysunek', 'grafika'] }),
        kanji('oto', '音', 'dźwięk', 'おと・おん', ['オン'], ['おと', 'ね'], [
          { text: '{音|おと}', pl: 'dźwięk; odgłos' },
          { text: '{音楽|おんがく}', pl: 'muzyka' },
        ], { plAlts: ['odgłos', 'brzmienie'], note: 'Od teraz おんがく piszemy 音楽.' }),
        kanji('raku', '楽', 'przyjemność; łatwość', 'たの・がく・らく', ['ガク', 'ラク'], ['たの(しい)'], [
          { text: '{楽|たの}しい', pl: 'przyjemny; fajny' },
          { text: '{音楽|おんがく}', pl: 'muzyka' },
          { text: '{楽|らく}', pl: 'wygodny; łatwy' },
        ], {
          plAlts: ['przyjemność', 'radość', 'wygoda'],
          note: 'Od teraz たのしい piszemy 楽しい. W 音楽 czytamy がく, a w 楽 (wygodny, łatwy) — らく.',
        }),
        p('takoto', '〜た ことが あります', 'zdarzyło mi się (kiedyś) …', {
          romaji: '~ta koto ga arimasu',
          tts: 'いった ことが あります',
          alts: ['たことがあります', 'いった ことが あります'],
          plAlts: ['kiedyś', 'mam to za sobą', 'mam doświadczenie'],
          note: 'Forma た + ことが あります — doświadczenie z życia: 日本へ 行った ことが あります — byłem / byłam (kiedyś) w Japonii.',
        }),
        p('taritari', '〜たり 〜たり します', 'robię m.in. to i to', {
          romaji: '~tari ~tari shimasu',
          tts: 'みたり よんだり します',
          alts: ['たりたりします', 'みたり よんだり します'],
          plAlts: ['między innymi', 'i tak dalej', 'i tym podobne'],
          note: 'Przykładowe czynności: 映画を 見たり、まんがを 読んだり します — oglądam filmy, czytam mangi i tym podobne.',
        }),
        p('kai', '〜かい', 'razy (licznik)', {
          tts: 'さんかい',
          alts: ['さんかい'],
          plAlts: ['raz'],
          note: 'いっかい, にかい, さんかい, よんかい, ごかい, ろっかい, ななかい, はっかい, きゅうかい, じゅっかい. Ile razy? — なんかい.',
        }),
        p('ichidomo', 'いちども', 'ani razu (z przeczeniem)', {
          plAlts: ['nigdy'],
          note: 'Zawsze z przeczeniem: いちども 行った ことが ありません — nie byłem / byłam ani razu.',
        }),
        p('ryokou', 'りょこう', 'podróż; wycieczka', {
          plAlts: ['wyjazd', 'podróżowanie'],
          note: 'りょこうに 行く albo りょこうを する — jechać w podróż.',
        }),
        p('noboru', 'のぼる', 'wchodzić (na górę); wspinać się', {
          alts: ['のぼります'],
          plAlts: ['wspiąć się', 'wejść na górę', 'wchodzić'],
          note: 'Gr. 1: のぼります, のぼって, のぼった. Cel z に: 山に のぼる — wejść na górę.',
        }),
        p('oyogu', 'およぐ', 'pływać', {
          alts: ['およぎます'],
          plAlts: ['popływać', 'pływam'],
          note: 'Gr. 1: およぎます, およいで, およいだ. Gdzie? — で: うみで およぐ.',
        }),
        p('nattou', 'なっとう', 'natto (sfermentowana soja)', {
          plAlts: ['sfermentowana soja'],
          note: 'Lepkie, sfermentowane ziarna soi o mocnym zapachu — dla wielu cudzoziemców kulinarny sprawdzian.',
        }),
        p('manga', 'まんが', 'manga; komiks', { plAlts: ['komiksy', 'mangi'], note: 'まんがを 読む — czytać mangi.' }),
        p('shumi', 'しゅみ', 'hobby; zainteresowania', {
          plAlts: ['pasja', 'zamiłowanie'],
          note: 'しゅみは 何ですか — jakie masz hobby? Odpowiedź: forma słownikowa + ことです (音楽を 聞く ことです).',
        }),
      ],
      sentences: [
        s('28-1', 'ふじさんに のぼった ことが ありますか。', 'Czy byłeś / byłaś kiedyś na Fuji?', {
          romaji: 'fujisan ni nobotta koto ga arimasu ka.',
          plAlts: [
            'Byłeś kiedyś na Fuji?',
            'Byłaś kiedyś na Fuji?',
            'Wchodziłeś kiedyś na Fuji?',
            'Wchodziłaś kiedyś na Fuji?',
            'Czy wszedł pan kiedyś na Fuji?',
            'Czy weszła pani kiedyś na Fuji?',
          ],
          note: 'ふじさん = góra Fuji',
          tokens: ['ふじさん', 'に', 'のぼった', 'こと', 'が', 'ありますか'],
        }),
        s('28-2', 'いいえ、まだ ありません。', 'Nie, jeszcze nie.', {
          romaji: 'iie, mada arimasen.',
          plAlts: ['Jeszcze nie.', 'Nie, jeszcze nigdy.'],
          tokens: ['いいえ', 'まだ', 'ありません'],
        }),
        s('28-3', 'なっとうを {食|た}べた ことが あります。', 'Zdarzyło mi się jeść natto.', {
          romaji: 'nattou o tabeta koto ga arimasu.',
          plAlts: ['Jadłem kiedyś natto.', 'Jadłam kiedyś natto.', 'Jadłem już natto.', 'Jadłam już natto.'],
          tokens: ['なっとう', 'を', '{食|た}べた', 'こと', 'が', 'あります'],
        }),
        s('28-4', '{日本|にほん}の {映画|えいが}を {見|み}た ことが ありません。', 'Nigdy nie oglądałem / nie oglądałam japońskiego filmu.', {
          romaji: 'nihon no eiga o mita koto ga arimasen.',
          plAlts: [
            'Nigdy nie oglądałem japońskiego filmu.',
            'Nigdy nie oglądałam japońskiego filmu.',
            'Nie widziałem jeszcze japońskiego filmu.',
            'Nie widziałam jeszcze japońskiego filmu.',
          ],
          tokens: ['{日本|にほん}', 'の', '{映画|えいが}', 'を', '{見|み}た', 'こと', 'が', 'ありません'],
        }),
        s('28-5', 'きょうとへ {三|さん}かい {行|い}った ことが あります。', 'Byłem / byłam w Kioto trzy razy.', {
          romaji: 'kyouto e sankai itta koto ga arimasu.',
          plAlts: ['Byłem w Kioto trzy razy.', 'Byłam w Kioto trzy razy.', 'Trzy razy byłem w Kioto.', 'Trzy razy byłam w Kioto.'],
          tts: 'きょうとへ さんかい いった ことが あります。',
          tokens: ['きょうと', 'へ', '{三|さん}かい', '{行|い}った', 'こと', 'が', 'あります'],
        }),
        s('28-6', 'ほっかいどうへは いちども {行|い}った ことが ありません。', 'Na Hokkaido nie byłem / nie byłam ani razu.', {
          romaji: 'hokkaidou e wa ichido mo itta koto ga arimasen.',
          plAlts: ['Na Hokkaido nie byłem ani razu.', 'Na Hokkaido nie byłam ani razu.', 'Nigdy nie byłem na Hokkaido.', 'Nigdy nie byłam na Hokkaido.'],
          note: 'ほっかいどう = Hokkaido, najdalej na północ wysunięta duża wyspa Japonii',
          tokens: ['ほっかいどう', 'へ', 'は', 'いちども', '{行|い}った', 'こと', 'が', 'ありません'],
        }),
        s('28-7', 'しゅうまつは {映画|えいが}を {見|み}たり、まんがを {読|よ}んだり します。', 'W weekendy oglądam filmy, czytam mangi i tak dalej.', {
          romaji: 'shuumatsu wa eiga o mitari, manga o yondari shimasu.',
          plAlts: ['W weekendy między innymi oglądam filmy i czytam mangi.', 'W weekend oglądam filmy, czytam komiksy i tym podobne.'],
          tokens: ['しゅうまつ', 'は', '{映画|えいが}', 'を', '{見|み}たり', 'まんが', 'を', '{読|よ}んだり', 'します'],
        }),
        s(
          '28-8',
          '{先週|せんしゅう}は うみで およいだり、{山|やま}に のぼったり しました。',
          'W zeszłym tygodniu pływałem / pływałam w morzu, chodziłem / chodziłam po górach i tak dalej.',
          {
            romaji: 'senshuu wa umi de oyoidari, yama ni nobottari shimashita.',
            plAlts: [
              'W zeszłym tygodniu pływałem w morzu, chodziłem po górach i tak dalej.',
              'W zeszłym tygodniu pływałam w morzu, chodziłam po górach i tak dalej.',
              'W zeszłym tygodniu między innymi pływałem w morzu i wchodziłem na góry.',
              'W zeszłym tygodniu między innymi pływałam w morzu i wchodziłam na góry.',
            ],
            tokens: ['{先週|せんしゅう}', 'は', 'うみ', 'で', 'およいだり', '{山|やま}', 'に', 'のぼったり', 'しました'],
          },
        ),
        s('28-9', 'しゅみは {音楽|おんがく}を {聞|き}く ことです。', 'Moje hobby to słuchanie muzyki.', {
          romaji: 'shumi wa ongaku o kiku koto desu.',
          plAlts: ['Moim hobby jest słuchanie muzyki.', 'Moja pasja to słuchanie muzyki.'],
          tokens: ['しゅみ', 'は', '{音楽|おんがく}', 'を', '{聞|き}く', 'こと', 'です'],
        }),
      ],
      grammar: [
        {
          id: 'ja.g.ta-koto',
          title: '〜た ことが あります — doświadczenie',
          body: [
            'O tym, co **kiedykolwiek** nam się zdarzyło, mówimy formą た + [[ことが あります]]: [[なっとうを {食|た}べた ことが あります。]] — Zdarzyło mi się jeść natto (wiem, jak smakuje). こと znaczy tu „fakt, rzecz”, więc dosłownie: „istnieje fakt, że jadłem natto”.',
            'Pytanie: [[ふじさんに のぼった ことが ありますか。]] Odpowiedzi: [[はい、あります。]] / [[いいえ、ありません。]] albo [[いいえ、まだ ありません。]] (jeszcze nie).',
            'Ile razy — licznik **〜かい**: [[いっかい]], [[{三|さん}かい]]; „ani razu” — [[いちども]] + przeczenie: [[いちども {行|い}った ことが ありません。]]',
            'Nie mówimy tak o czynnościach codziennych (✗ ごはんを 食べた ことが あります) ani o tym, co wydarzyło się niedawno — wtedy wystarczy zwykła przeszłość: [[きのう なっとうを {食|た}べました。]]',
          ],
          table: {
            head: ['', 'forma', 'znaczenie'],
            rows: [
              ['+', 'いった ことが あります', 'byłem / byłam (kiedyś)'],
              ['−', 'いった ことが ありません', 'nigdy nie byłem / byłam'],
              ['?', 'いった ことが ありますか', 'czy byłeś / byłaś kiedyś?'],
              ['ile razy', 'さんかい いった ことが あります', 'byłem / byłam trzy razy'],
              ['ani razu', 'いちども いった ことが ありません', 'nie byłem / byłam ani razu'],
            ],
          },
          contrast:
            'Po polsku doświadczenie wyrażamy słówkiem „kiedyś” albo „już”: „Jadłeś kiedyś natto?”, „Byłam już w Kioto”. Po japońsku to osobna konstrukcja: forma た + ことが あります. Zwykłe 食べましたか pyta o konkretną sytuację („Zjadłeś to natto?”), a 食べた ことが ありますか — o całe życie.',
        },
        {
          id: 'ja.g.tari',
          title: '〜たり 〜たり します — między innymi',
          body: [
            'Gdy wymieniamy **przykładowe** czynności — nie wszystkie i niekoniecznie po kolei — każda dostaje formę た + [[り]], a całość kończy [[します]]: [[{映画|えいが}を {見|み}たり、まんがを {読|よ}んだり します。]] — Oglądam filmy, czytam mangi i tym podobne.',
            'Czas i grzeczność niesie tylko końcowe します: [[しました]] (przeszłość), [[したいです]] (chcę), swobodnie [[する]] / [[した]]. Z jedną czynnością 〜たり podkreśla, że to tylko przykład: [[{音楽|おんがく}を {聞|き}いたり します。]] — Na przykład słucham muzyki.',
            'O hobby mówimy formą słownikową + [[こと]] („to, że…”, polskie „-nie”): [[しゅみは {音楽|おんがく}を {聞|き}く ことです。]] — Moje hobby to słuchanie muzyki.',
          ],
          table: {
            head: ['słownikowa', 'forma た', 'forma たり'],
            rows: [
              ['みる', 'みた', 'みたり'],
              ['よむ', 'よんだ', 'よんだり'],
              ['およぐ', 'およいだ', 'およいだり'],
              ['のぼる', 'のぼった', 'のぼったり'],
              ['する', 'した', 'したり'],
            ],
          },
          contrast:
            'Po polsku przy wyliczaniu wystarczy „i” albo „albo”: „oglądam filmy i czytam mangi”. Japońskie 〜たり 〜たり mówi więcej: „między innymi”, „takie rzeczy jak…”. Gdy czynności następują po kolei („najpierw…, potem…”), łączy się je inaczej — formą て.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'ja.x.28-1',
          concept: 'ja.g.ta-koto',
          sentence: 'ふじさんに ___ ことが ありますか。',
          pl: 'Czy byłeś / byłaś kiedyś na Fuji?',
          options: ['のぼる', 'のぼった', 'のぼって'],
          answer: 'のぼった',
          explanation: 'Doświadczenie: forma た + ことが あります — のぼった ことが あります.',
        },
        {
          type: 'gap',
          id: 'ja.x.28-2',
          concept: 'ja.g.ta-koto',
          sentence: 'なっとうは いちども {食|た}べた ことが ___。',
          pl: 'Natto nie jadłem / nie jadłam ani razu.',
          options: ['あります', 'ありません', 'ありました'],
          answer: 'ありません',
          explanation: 'いちども (ani razu) łączy się z przeczeniem: 食べた ことが ありません.',
        },
        {
          type: 'gap',
          id: 'ja.x.28-3',
          concept: 'ja.g.tari',
          sentence: 'しゅうまつは {映画|えいが}を {見|み}たり、{本|ほん}を ___ します。',
          pl: 'W weekendy oglądam filmy, czytam książki i tak dalej.',
          options: ['{読|よ}んだり', '{読|よ}みたり', '{読|よ}んで'],
          answer: '{読|よ}んだり',
          explanation: 'Forma たり powstaje jak forma た: よむ → よんだ → よんだり.',
        },
        {
          type: 'choice',
          id: 'ja.x.28-4',
          concept: 'ja.g.ta-koto',
          prompt: 'Kolega pyta: 日本の 映画を 見た ことが ありますか. Widziałeś / widziałaś już kilka. Co odpowiesz?',
          target: '{日本|にほん}の {映画|えいが}を {見|み}た ことが ありますか。',
          options: ['はい、あります。', 'はい、います。', 'はい、{見|み}たです。'],
          answer: 0,
          explanation: 'Odpowiadamy czasownikiem z pytania: あります. います mówimy o ludziach i zwierzętach, a ✗ 見たです jest niepoprawne.',
        },
        {
          type: 'choice',
          id: 'ja.x.28-5',
          concept: 'ja.g.tari',
          prompt: 'Jak powiesz „Pływałem / pływałam w morzu, chodziłem / chodziłam po górach i tak dalej”?',
          options: [
            'うみで およいだり、{山|やま}に のぼったり しました。',
            'うみで およいだり、{山|やま}に のぼりました。',
            'うみで およぐたり、{山|やま}に のぼるたり しました。',
          ],
          answer: 0,
          explanation: 'Każda czynność dostaje formę たり (およいだり, のぼったり), a całość kończy します — tu w przeszłości: しました.',
        },
        {
          type: 'choice',
          id: 'ja.x.28-6',
          concept: 'ja.g.ta-koto',
          prompt: 'Które zdanie brzmi nienaturalnie?',
          options: [
            '{今日|きょう} ごはんを {食|た}べた ことが あります。',
            'なっとうを {食|た}べた ことが あります。',
            'きょうとへ {二|に}かい {行|い}った ことが あります。',
          ],
          answer: 0,
          explanation: '〜た ことが あります mówi o doświadczeniu z życia, nie o tym, co zrobiliśmy dziś. Wystarczy: 今日 ごはんを 食べました.',
        },
      ],
      dialogue: {
        id: 'ja.d.28',
        title: 'Byłaś kiedyś w Japonii?',
        context: 'Kenta, student z Osaki, przyjechał na semestr do Krakowa. Rozmawia z Olą, koleżanką z kursu.',
        speakers: {
          K: { name: 'Kenta', voice: 'b', accent: 'ja-JP' },
          O: { name: 'Ola', voice: 'a', accent: 'ja-JP' },
        },
        lines: [
          {
            speaker: 'K',
            text: 'オラさんは {日本|にほん}へ {行|い}った ことが ありますか。',
            pl: 'Olu, byłaś kiedyś w Japonii?',
            romaji: 'ora-san wa nihon e itta koto ga arimasu ka.',
          },
          {
            speaker: 'O',
            text: 'はい、{二|に}かい あります。きょねんは とうきょうと きょうとへ {行|い}きました。',
            pl: 'Tak, dwa razy. W zeszłym roku byłam w Tokio i w Kioto.',
            romaji: 'hai, nikai arimasu. kyonen wa toukyou to kyouto e ikimashita.',
          },
          { speaker: 'K', text: 'いいですね。きょうとで {何|なに}を しましたか。', pl: 'Super. Co robiłaś w Kioto?', romaji: 'ii desu ne. kyouto de nani o shimashita ka.' },
          {
            speaker: 'O',
            text: 'おてらを {見|み}たり、{天|てん}ぷらを {食|た}べたり しました。',
            pl: 'Zwiedzałam świątynie, jadłam tempurę i tak dalej.',
            romaji: 'otera o mitari, tenpura o tabetari shimashita.',
          },
          { speaker: 'K', text: 'なっとうを {食|た}べた ことが ありますか。', pl: 'A jadłaś kiedyś natto?', romaji: 'nattou o tabeta koto ga arimasu ka.' },
          { speaker: 'O', text: 'ありますよ。でも、ちょっと…', pl: 'Jadłam. Ale… nie bardzo mi smakowało.', romaji: 'arimasu yo. demo, chotto...' },
          {
            speaker: 'K',
            text: 'わたしも なっとうは あまり {好|す}きじゃないです。',
            pl: 'Ja też nie przepadam za natto.',
            romaji: 'watashi mo nattou wa amari suki janai desu.',
          },
          {
            speaker: 'O',
            text: 'ケンタさんは ポーランドで {何|なに}を したいですか。',
            pl: 'A ty, Kenta, co chciałbyś robić w Polsce?',
            romaji: 'kenta-san wa poorando de nani o shitai desu ka.',
          },
          {
            speaker: 'K',
            text: 'ポーランドの {山|やま}に のぼったり、ピエロギを {食|た}べたり したいです!',
            pl: 'Chciałbym chodzić po polskich górach, jeść pierogi i tak dalej!',
            romaji: 'poorando no yama ni nobottari, pierogi o tabetari shitai desu!',
          },
        ],
        questions: [
          {
            id: 'ja.d.28-q1',
            prompt: 'Ile razy Ola była w Japonii?',
            options: ['Raz', 'Dwa razy', 'Trzy razy'],
            answer: 1,
            explanation: 'はい、二かい あります — tak, dwa razy.',
          },
          {
            id: 'ja.d.28-q2',
            prompt: 'Co Ola robiła w Kioto?',
            options: ['Wchodziła na Fuji', 'Pływała w morzu', 'Zwiedzała świątynie i jadła tempurę'],
            answer: 2,
            explanation: 'おてらを 見たり、天ぷらを 食べたり しました — zwiedzałam świątynie, jadłam tempurę i tak dalej.',
          },
          {
            id: 'ja.d.28-q3',
            prompt: 'Co Kenta chciałby robić w Polsce?',
            options: ['Chodzić po górach i jeść pierogi', 'Uczyć się polskiego', 'Zwiedzać muzea'],
            answer: 0,
            explanation: 'ポーランドの 山に のぼったり、ピエロギを 食べたり したいです!',
          },
        ],
      },
      summary: [
        'Doświadczenie: forma た + ことが あります / ありません — ふじさんに のぼった ことが ありますか。',
        'Ile razy: 〜かい (いっかい, にかい, さんかい); ani razu: いちども + przeczenie.',
        'Przykładowe czynności: 〜たり 〜たり します — 映画を 見たり、まんがを 読んだり します。 Hobby: しゅみは 〜 ことです.',
        'Kanji: 映 画 音 楽 — 映画, 音楽, 楽しい.',
      ],
      followUp:
        'Zapisz trzy rzeczy, których nigdy nie robiłeś / robiłaś, i trzy, które masz już za sobą — każdą z 〜た ことが あります / ありません. Potem opowiedz o swoim weekendzie z 〜たり 〜たり.',
    },
  ],
};
