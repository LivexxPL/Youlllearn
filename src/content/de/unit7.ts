import type { Unit } from '../types';
import { contentHelpers } from '../helpers';

const { word, noun, verb, phrase, sentence: s } = contentHelpers('de');

export const unit7: Unit = {
  id: 'de.u7',
  title: 'Plany, prośby i opisy',
  description:
    'Domknięcie poziomu A2: czas przyszły z werden, uprzejme prośby i rady (würde, hätte, könnte, sollte), końcówki przymiotników, dopełniacz i zdania względne.',
  level: 'A2+',
  lessons: [
    {
      id: 'de.l25',
      title: 'Plany i prognozy',
      subtitle: 'Was hast du vor?',
      objective: 'Opowiesz o planach i przewidywaniach — z werden albo w czasie teraźniejszym — i wyrazisz przypuszczenie: Er wird wohl krank sein.',
      level: 'A2+',
      minutes: 12,
      intro: [
        'Witaj w dziale, który domyka poziom A2! Poznasz czas przyszły, uprzejme prośby, końcówki przymiotników, dopełniacz i zdania względne — to, czego jeszcze brakuje do swobodnej rozmowy na co dzień.',
      ],
      items: [
        verb('werden', 'werden', 'stawać się; zostać', {
          plAlts: ['stać się', 'zostawać', 'zostać kimś'],
          note: 'Odmiana: ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden. Z bezokolicznikiem tworzy czas przyszły: Ich werde arbeiten. — Będę pracować.',
          tip: 'Ich werde Ärztin. — Zostanę lekarką (bez rodzajnika, jak przy zawodach).',
        }),
        phrase('naechste-woche', 'nächste Woche', 'w przyszłym tygodniu', {
          plAlts: ['w następnym tygodniu'],
          note: 'Bez przyimka, tak jak letzte Woche. Podobnie: nächstes Jahr — w przyszłym roku.',
        }),
        word('bald', 'bald', 'wkrótce; niedługo', { pos: 'adv', plAlts: ['niebawem'], note: 'Bis bald! — Do zobaczenia wkrótce!' }),
        word('wohl', 'wohl', 'pewnie; chyba', {
          pos: 'adv',
          plAlts: ['prawdopodobnie', 'zapewne'],
          note: 'Wyraża przypuszczenie: Er wird wohl krank sein. — Pewnie jest chory.',
        }),
        word('sicher', 'sicher', 'na pewno; pewny', {
          pos: 'adj',
          plAlts: ['pewnie', 'pewna', 'pewne', 'bezpieczny'],
          note: 'Das schaffst du sicher! — Na pewno dasz radę! Drugie znaczenie: bezpieczny.',
        }),
        word('hoffentlich', 'hoffentlich', 'oby; mam nadzieję, że…', {
          pos: 'adv',
          plAlts: ['mam nadzieję', 'miejmy nadzieję', 'mam nadzieję, że'],
          note: 'Jedno słowo zamiast całego zdania: Hoffentlich regnet es nicht. — Oby nie padało.',
        }),
        verb('vorhaben', 'vorhaben', 'planować; mieć w planach', {
          plAlts: ['zamierzać', 'mieć zamiar', 'mieć plany', 'zaplanować'],
          note: 'Rozdzielny: Was hast du heute vor? — Co dziś planujesz?',
        }),
        noun('die-zukunft', 'die Zukunft', 'przyszłość', 'f', { note: 'in Zukunft — w przyszłości. Zwykle bez liczby mnogiej.' }),
        noun('der-urlaub', 'der Urlaub', 'urlop; wakacje', 'm', {
          plural: 'die Urlaube',
          plAlts: ['urlop', 'wakacje'],
          note: 'im Urlaub — na urlopie; Urlaub machen — spędzać urlop. Wakacje szkolne i studenckie to die Ferien.',
        }),
        verb('besuchen', 'besuchen', 'odwiedzać; odwiedzić', {
          plAlts: ['zwiedzać', 'zwiedzić'],
          note: 'Bez przyimka, z biernikiem: Ich besuche meine Oma. — Odwiedzam babcię. Także: einen Kurs besuchen — chodzić na kurs.',
        }),
        verb('umziehen', 'umziehen', 'przeprowadzać się', {
          plAlts: ['przeprowadzić się'],
          note: 'Rozdzielny i bez „sich”: Wir ziehen nach Graz um. Perfekt z sein: Ich bin umgezogen. (Sich umziehen znaczy „przebierać się”.)',
        }),
        verb('heiraten', 'heiraten', 'brać ślub; pobierać się', {
          plAlts: ['wziąć ślub', 'pobrać się', 'ożenić się', 'wyjść za mąż', 'żenić się'],
          note: 'Bez „się” i bez przyimka: Er heiratet Anna. — Żeni się z Anną. Sie heiraten im Mai. — Pobierają się w maju.',
        }),
        verb('schaffen', 'schaffen', 'dać radę; zdążyć', {
          plAlts: ['zdołać', 'poradzić sobie', 'podołać'],
          note: 'Das schaffst du! — Dasz radę! Die Prüfung schaffen — zdać egzamin. Den Zug schaffen — zdążyć na pociąg.',
        }),
      ],
      sentences: [
        s('25-1', 'Morgen wird es regnen.', 'Jutro będzie padać.', {
          alts: ['Es wird morgen regnen.'],
          plAlts: ['Jutro będzie padał deszcz.', 'Jutro spadnie deszcz.', 'Jutro będzie deszcz.'],
        }),
        s('25-2', 'Nächste Woche werde ich meine Eltern besuchen.', 'W przyszłym tygodniu odwiedzę rodziców.', {
          alts: ['Ich werde nächste Woche meine Eltern besuchen.', 'Nächste Woche besuche ich meine Eltern.'],
          plAlts: ['W przyszłym tygodniu odwiedzę moich rodziców.', 'W przyszłym tygodniu odwiedzę swoich rodziców.', 'Odwiedzę rodziców w przyszłym tygodniu.'],
        }),
        s('25-3', 'Was hast du im Sommer vor?', 'Co planujesz na lato?', {
          plAlts: ['Jakie masz plany na lato?', 'Co zamierzasz robić latem?', 'Co planujesz latem?'],
        }),
        s('25-4', 'Im Urlaub werden wir viel schwimmen und lange schlafen.', 'Na urlopie będziemy dużo pływać i długo spać.', {
          alts: ['Wir werden im Urlaub viel schwimmen und lange schlafen.'],
          plAlts: ['Na wakacjach będziemy dużo pływać i długo spać.', 'W czasie urlopu będziemy dużo pływać i długo spać.'],
        }),
        s('25-5', 'Er wird wohl krank sein.', 'On pewnie jest chory.', {
          alts: ['Er ist wohl krank.'],
          plAlts: ['Pewnie jest chory.', 'Chyba jest chory.', 'On chyba jest chory.', 'Pewnie zachorował.'],
          note: 'Werden + wohl to przypuszczenie o tym, co jest teraz — nie czas przyszły.',
        }),
        s('25-6', 'Hoffentlich schaffe ich die Prüfung.', 'Mam nadzieję, że zdam egzamin.', {
          alts: ['Hoffentlich werde ich die Prüfung schaffen.'],
          plAlts: ['Oby udało mi się zdać egzamin.', 'Mam nadzieję, że zdam ten egzamin.', 'Oby mi się udało zdać egzamin.'],
          note: 'Die Prüfung schaffen — zdać egzamin. Czas teraźniejszy wystarcza, bo z kontekstu wiadomo, że chodzi o przyszłość.',
        }),
        s('25-7', 'Heuer im Sommer ziehen wir nach Graz um.', 'Tego lata przeprowadzamy się do Grazu.', {
          alts: ['Wir ziehen heuer im Sommer nach Graz um.', 'Diesen Sommer ziehen wir nach Graz um.'],
          plAlts: ['Tego lata przeprowadzimy się do Grazu.', 'W tym roku latem przeprowadzamy się do Grazu.', 'Latem tego roku przeprowadzamy się do Grazu.'],
          note: 'heuer — austriackie (i bawarskie) „w tym roku”; w Niemczech: dieses Jahr.',
          accent: 'de-AT',
        }),
        s('25-8', 'In Zukunft werde ich mehr Zeit für meine Familie haben.', 'W przyszłości będę mieć więcej czasu dla rodziny.', {
          alts: ['Ich werde in Zukunft mehr Zeit für meine Familie haben.'],
          plAlts: [
            'W przyszłości będę miał więcej czasu dla rodziny.',
            'W przyszłości będę miała więcej czasu dla rodziny.',
            'W przyszłości będę mieć więcej czasu dla mojej rodziny.',
            'W przyszłości będę miał więcej czasu dla mojej rodziny.',
            'W przyszłości będę miała więcej czasu dla mojej rodziny.',
          ],
        }),
        s('25-9', 'Anna und Ben werden bald heiraten.', 'Anna i Ben wkrótce się pobiorą.', {
          alts: ['Anna und Ben heiraten bald.'],
          plAlts: ['Anna i Ben niedługo się pobiorą.', 'Anna i Ben wkrótce wezmą ślub.', 'Anna i Ben niedługo wezmą ślub.'],
        }),
      ],
      grammar: [
        {
          id: 'de.g.futur1',
          title: 'Futur I: werden + bezokolicznik',
          body: [
            'Czas przyszły **Futur I** tworzymy z czasownikiem **werden** i bezokolicznikiem. Werden odmieniamy i stawiamy **na 2. miejscu**, a bezokolicznik idzie **na koniec** zdania — dokładnie tak jak przy czasownikach modalnych: [[Ich werde mehr lernen.]] [[Nächste Woche werde ich meine Eltern besuchen.]]',
            'Werden jest nieregularny: du **wirst**, er **wird**. W pytaniu werden przechodzi na początek: [[Wirst du mich anrufen?]] W zdaniu podrzędnym stoi na samym końcu, za bezokolicznikiem: [[Ich glaube, dass es morgen regnen wird.]]',
            'Bez bezokolicznika werden znaczy **stawać się, zostać (kimś)**: [[Ich werde Ärztin.]] (Zostanę lekarką.) [[Es wird kalt.]] (Robi się zimno.)',
          ],
          table: {
            head: ['Osoba', 'werden', 'Przykład'],
            rows: [
              ['ich', 'werde', 'Ich werde arbeiten.'],
              ['du', 'wirst', 'Du wirst es schaffen.'],
              ['er / sie / es', 'wird', 'Es wird regnen.'],
              ['wir', 'werden', 'Wir werden umziehen.'],
              ['ihr', 'werdet', 'Ihr werdet sehen.'],
              ['sie / Sie', 'werden', 'Sie werden heiraten.'],
            ],
          },
          contrast:
            'Po polsku czas przyszły ma dwie formy: „będę robić” (niedokonana) i „zrobię” (dokonana). Niemiecki ma jedną konstrukcję: Ich werde es machen = zrobię to / będę to robić. Uwaga: „będę” w znaczeniu „będę gdzieś” to po niemiecku zwykle czas teraźniejszy: Jutro będę w Wiedniu — Morgen bin ich in Wien.',
        },
        {
          id: 'de.g.futur-praesens',
          title: 'Plan, prognoza czy przypuszczenie?',
          body: [
            'O planach Niemcy mówią najczęściej w **czasie teraźniejszym** z określeniem czasu: [[Morgen fahre ich nach Wien.]] [[Wir ziehen bald um.]] Słowa [[morgen]], [[bald]] czy [[nächste Woche]] wystarczą, żeby było jasne, że chodzi o przyszłość.',
            '**Werden** wybieramy przy **prognozach** ([[Es wird regnen.]]), **obietnicach** i stanowczych zapowiedziach ([[Ich werde dich jeden Tag anrufen.]]) oraz wtedy, gdy bez niego zdanie brzmiałoby jak teraźniejszość.',
            'Werden + [[wohl]] (pewnie) albo [[sicher]] (na pewno) wyraża **przypuszczenie o teraźniejszości**: [[Er wird wohl krank sein.]] (Pewnie jest chory.) [[Sie wird sicher zu Hause sein.]] (Na pewno jest w domu.) Nadzieję wyrazisz jednym słowem: [[Hoffentlich regnet es nicht.]]',
          ],
          table: {
            head: ['Co chcesz powiedzieć?', 'Przykład'],
            rows: [
              ['plan z określeniem czasu', 'Morgen besuche ich Oma.'],
              ['prognoza', 'Morgen wird es schneien.'],
              ['obietnica', 'Ich werde dich anrufen.'],
              ['przypuszczenie o tym, co jest teraz', 'Er wird wohl müde sein.'],
            ],
          },
          contrast:
            'Po polsku przypuszczenie wyrażamy słowami „pewnie”, „chyba” i czasem teraźniejszym: „Pewnie jest chory”. Po niemiecku też można (Er ist wohl krank), ale bardzo typowa jest forma z werden: Er wird wohl krank sein. Wygląda jak czas przyszły, a mówi o tym, co jest teraz.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'de.x.25-1',
          concept: 'de.g.futur1',
          sentence: 'Morgen ___ es regnen.',
          pl: 'Jutro będzie padać.',
          options: ['wird', 'wirst', 'werdet'],
          answer: 'wird',
          explanation: 'Es (tak jak er i sie) → wird. Wirst to forma dla du, a werdet — dla ihr.',
        },
        {
          type: 'gap',
          id: 'de.x.25-2',
          concept: 'de.g.futur1',
          sentence: 'Du ___ die Prüfung sicher schaffen.',
          pl: 'Na pewno zdasz ten egzamin.',
          options: ['werde', 'wirst', 'wird'],
          answer: 'wirst',
          explanation: 'Du → wirst (nieregularnie, bez d). Werde pasuje do ich, a wird — do er, sie, es.',
        },
        {
          type: 'choice',
          id: 'de.x.25-3',
          concept: 'de.g.futur1',
          prompt: 'Które zdanie ma poprawny szyk?',
          options: ['Nächste Woche ich werde Oma besuchen.', 'Nächste Woche werde ich Oma besuchen.', 'Nächste Woche werde ich besuchen Oma.'],
          answer: 1,
          explanation: '„Nächste Woche” zajmuje 1. miejsce, więc werde stoi na 2., podmiot zaraz za nim, a bezokolicznik besuchen — na końcu.',
        },
        {
          type: 'gap',
          id: 'de.x.25-4',
          concept: 'de.g.futur1',
          sentence: 'Ich glaube, dass Anna bald ___.',
          pl: 'Myślę, że Anna wkrótce wyjdzie za mąż.',
          options: ['wird heiraten', 'heiraten wird', 'heiratet werden'],
          answer: 'heiraten wird',
          explanation: 'Po dass odmieniony czasownik idzie na sam koniec. Tu jest nim wird, więc stoi za bezokolicznikiem: …, dass Anna bald heiraten wird.',
        },
        {
          type: 'choice',
          id: 'de.x.25-5',
          concept: 'de.g.futur-praesens',
          prompt: 'Co znaczy to zdanie?',
          target: 'Sie wird wohl noch schlafen.',
          optionsLang: 'pl',
          options: ['Ona pewnie jeszcze śpi.', 'Ona jutro będzie długo spać.', 'Ona wczoraj długo spała.'],
          answer: 0,
          explanation: 'Werden + wohl to przypuszczenie o tym, co dzieje się teraz: pewnie jeszcze śpi.',
        },
        {
          type: 'choice',
          id: 'de.x.25-6',
          concept: 'de.g.futur-praesens',
          prompt: 'Jak najprościej powiesz: „Jutro jadę do Grazu”?',
          options: ['Morgen fahre ich nach Graz.', 'Morgen werde ich nach Graz gefahren.', 'Morgen ich fahre nach Graz.'],
          answer: 0,
          explanation: 'Plan z określeniem czasu (morgen) — wystarczy czas teraźniejszy z czasownikiem na 2. miejscu. „Werde … gefahren” to błędne połączenie werden z imiesłowem.',
        },
      ],
      dialogue: {
        id: 'de.d.25',
        title: 'Plany na lato',
        context: 'Koniec semestru w Grazu. Paula, studentka z Austrii, pyta kolegę z roku, Kubę, o plany na wakacje.',
        speakers: {
          P: { name: 'Paula', voice: 'a', accent: 'de-AT' },
          K: { name: 'Kuba', voice: 'b', accent: 'de-AT' },
        },
        lines: [
          { speaker: 'P', text: 'Und, Kuba, was hast du im Juli vor?', pl: 'No i co, Kuba, jakie masz plany na lipiec?' },
          {
            speaker: 'K',
            text: 'Zuerst fahre ich nach Hause, nach Danzig. Ich werde meine Eltern besuchen.',
            pl: 'Najpierw jadę do domu, do Gdańska. Odwiedzę rodziców.',
          },
          { speaker: 'P', text: 'Schön! Und danach?', pl: 'Fajnie! A potem?' },
          { speaker: 'K', text: 'Danach werde ich in Wien in einem Hotel arbeiten. Und du?', pl: 'Potem będę pracować w hotelu w Wiedniu. A ty?' },
          { speaker: 'P', text: 'Ich habe im August eine Prüfung. Hoffentlich schaffe ich sie!', pl: 'W sierpniu mam egzamin. Mam nadzieję, że go zdam!' },
          { speaker: 'K', text: 'Das schaffst du sicher! Du lernst doch jeden Tag.', pl: 'Na pewno dasz radę! Przecież uczysz się codziennie.' },
          { speaker: 'P', text: 'Danke! Und im September ziehe ich nach Wien um.', pl: 'Dzięki! A we wrześniu przeprowadzam się do Wiednia.' },
          { speaker: 'K', text: 'Super! Dann werden wir uns bald in Wien sehen!', pl: 'Super! To wkrótce zobaczymy się w Wiedniu!' },
        ],
        questions: [
          {
            id: 'de.d.25-q1',
            prompt: 'Co Kuba zrobi najpierw?',
            options: ['Zacznie pracę w hotelu', 'Odwiedzi rodziców w Gdańsku', 'Przeprowadzi się do Wiednia'],
            answer: 1,
            explanation: '„Zuerst fahre ich nach Hause, nach Danzig. Ich werde meine Eltern besuchen.” Danzig to niemiecka nazwa Gdańska.',
          },
          {
            id: 'de.d.25-q2',
            prompt: 'Co czeka Paulę w sierpniu?',
            options: ['Przeprowadzka', 'Urlop nad jeziorem', 'Egzamin'],
            answer: 2,
            explanation: '„Ich habe im August eine Prüfung.” Przeprowadzka będzie dopiero we wrześniu.',
          },
          {
            id: 'de.d.25-q3',
            prompt: 'Dlaczego Kuba i Paula wkrótce się zobaczą?',
            options: ['Bo oboje będą w Wiedniu', 'Bo razem pojadą do Gdańska', 'Bo razem uczą się do egzaminu'],
            answer: 0,
            explanation: 'Kuba będzie pracować w Wiedniu, a Paula we wrześniu przeprowadza się do Wiednia: „Dann werden wir uns bald in Wien sehen!”',
          },
        ],
      },
      summary: [
        'Futur I: werden na 2. miejscu + bezokolicznik na końcu: Ich werde meine Eltern besuchen.',
        'Werden: ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden.',
        'Plany z określeniem czasu zwykle w czasie teraźniejszym: Morgen fahre ich nach Wien.',
        'Prognoza i przypuszczenie: Es wird regnen. Er wird wohl krank sein. Nadzieja: Hoffentlich…',
      ],
      followUp:
        'Opowiedz na głos o swoich planach na przyszły tydzień: dwa zdania z werden i dwa w czasie teraźniejszym. Za około 10 minut zrób krótką powtórkę.',
    },
    {
      id: 'de.l26',
      title: 'Uprzejme prośby i rady',
      subtitle: 'Könnten Sie mir helfen?',
      objective: 'Grzecznie poprosisz o pomoc i o pozwolenie, wyrazisz życzenie i doradzisz komuś — z formami würde, hätte, wäre, könnte i sollte.',
      level: 'A2+',
      minutes: 12,
      items: [
        phrase('ich-wuerde-gern', 'ich würde gern', 'chętnie bym…', {
          plAlts: ['chciałbym', 'chciałabym', 'chętnie bym'],
          note: 'Würde + bezokolicznik na końcu: Ich würde gern ins Kino gehen. — Chętnie poszedłbym / poszłabym do kina.',
        }),
        phrase('ich-haette-gern', 'ich hätte gern', 'poproszę… (bardzo grzecznie)', {
          plAlts: ['poproszę', 'chętnie bym wziął', 'chętnie bym wzięła'],
          note: 'Jeszcze uprzejmiej niż ich möchte: Ich hätte gern einen Tee. — Poproszę herbatę. Hätte = miałbym / miałabym (od haben).',
        }),
        phrase('koennten-sie', 'Könnten Sie…?', 'czy mógłby pan…? / czy mogłaby pani…?', {
          tts: 'Könnten Sie mir helfen?',
          alts: ['Könnten Sie', 'Könnten Sie mir helfen?'],
          plAlts: ['mógłby pan', 'mogłaby pani', 'czy mogliby państwo'],
          note: 'Najgrzeczniejsza forma prośby: Könnten Sie mir bitte helfen? Do kolegi lub koleżanki: Könntest du…?',
        }),
        phrase('duerfte-ich', 'Dürfte ich…?', 'czy mógłbym…? / czy mogłabym…?', {
          tts: 'Dürfte ich das Fenster aufmachen?',
          alts: ['Dürfte ich', 'Dürfte ich das Fenster aufmachen?'],
          plAlts: ['czy wolno mi', 'czy mogę', 'mógłbym', 'mogłabym'],
          note: 'Bardzo grzeczne pytanie o pozwolenie (od dürfen). Na co dzień wystarczy: Darf ich…? albo Kann ich…?',
        }),
        phrase('du-solltest', 'du solltest', 'powinieneś / powinnaś', {
          plAlts: ['powinieneś', 'powinnaś'],
          note: 'Rada: Du solltest mehr schlafen. Od sollen: ich sollte, du solltest, er sollte, wir sollten, ihr solltet, sie sollten.',
        }),
        phrase('das-waere-super', 'Das wäre super!', 'to byłoby super!', {
          plAlts: ['byłoby super!', 'byłoby świetnie!', 'to byłoby świetne!', 'byłoby wspaniale!'],
          note: 'Wäre = byłby / byłoby (od sein). Także: Das wäre nett. — To byłoby miłe.',
        }),
        phrase('an-deiner-stelle', 'an deiner Stelle', 'na twoim miejscu', {
          note: 'Rada z würde: An deiner Stelle würde ich zum Arzt gehen. Grzecznie: an Ihrer Stelle — na pana / pani miejscu.',
        }),
        verb('helfen', 'helfen', 'pomagać; pomóc', {
          plAlts: ['pomagać', 'pomóc'],
          note: 'Z celownikiem, jak po polsku: Ich helfe dir. — Pomagam ci. Odmiana: du hilfst, er hilft (e → i).',
        }),
        word('nett', 'nett', 'miły; uprzejmy', {
          pos: 'adj',
          plAlts: ['miła', 'miłe', 'sympatyczny'],
          note: 'Das ist sehr nett von Ihnen! — To bardzo miło z pana / pani strony!',
        }),
        noun('das-fenster', 'das Fenster', 'okno', 'n', { plural: 'die Fenster' }),
        noun('die-tuer', 'die Tür', 'drzwi', 'f', { plural: 'die Türen', note: 'Po niemiecku liczba pojedyncza: die Tür = jedne drzwi.' }),
        verb('aufmachen', 'aufmachen', 'otwierać; otworzyć', {
          plAlts: ['otwierać', 'otworzyć'],
          note: 'Rozdzielny: Mach bitte das Fenster auf! W języku bardziej oficjalnym: öffnen.',
        }),
        verb('zumachen', 'zumachen', 'zamykać; zamknąć', {
          plAlts: ['zamykać', 'zamknąć'],
          note: 'Rozdzielny: Könnten Sie bitte die Tür zumachen? W języku bardziej oficjalnym: schließen.',
        }),
        noun('der-sport', 'der Sport', 'sport', 'm', { note: 'Sport machen — uprawiać sport, ćwiczyć: Du solltest mehr Sport machen.' }),
      ],
      sentences: [
        s('26-1', 'Könnten Sie mir bitte helfen?', 'Czy mógłby mi pan pomóc?', {
          alts: ['Könnten Sie mir helfen?'],
          plAlts: [
            'Czy mogłaby mi pani pomóc?',
            'Mógłby mi pan pomóc?',
            'Mogłaby mi pani pomóc?',
            'Czy mógłby pan mi pomóc?',
            'Czy mogłaby pani mi pomóc?',
            'Czy mogliby mi państwo pomóc?',
          ],
        }),
        s('26-2', 'Ich hätte gern eine Melange, bitte.', 'Poproszę kawę melange.', {
          alts: ['Ich hätte gern eine Melange.'],
          plAlts: ['Poproszę melange.', 'Poproszę jedną melange.', 'Chciałbym kawę melange.', 'Chciałabym kawę melange.'],
          note: 'Melange — wiedeńska kawa z mlekiem i mleczną pianką.',
          accent: 'de-AT',
        }),
        s('26-3', 'Ich würde gern nächstes Jahr in Wien studieren.', 'Chciałbym w przyszłym roku studiować w Wiedniu.', {
          alts: ['Nächstes Jahr würde ich gern in Wien studieren.'],
          plAlts: [
            'Chciałabym w przyszłym roku studiować w Wiedniu.',
            'W przyszłym roku chciałbym studiować w Wiedniu.',
            'W przyszłym roku chciałabym studiować w Wiedniu.',
            'Chętnie studiowałbym w przyszłym roku w Wiedniu.',
            'Chętnie studiowałabym w przyszłym roku w Wiedniu.',
          ],
        }),
        s('26-4', 'Dürfte ich das Fenster aufmachen?', 'Czy mógłbym otworzyć okno?', {
          plAlts: ['Czy mogłabym otworzyć okno?', 'Mógłbym otworzyć okno?', 'Mogłabym otworzyć okno?', 'Czy mogę otworzyć okno?'],
        }),
        s('26-5', 'Du solltest mehr Sport machen.', 'Powinieneś więcej ćwiczyć.', {
          plAlts: [
            'Powinnaś więcej ćwiczyć.',
            'Powinieneś uprawiać więcej sportu.',
            'Powinnaś uprawiać więcej sportu.',
            'Powinieneś więcej się ruszać.',
            'Powinnaś więcej się ruszać.',
          ],
        }),
        s('26-6', 'Das wäre sehr nett von Ihnen.', 'To byłoby bardzo miłe z pana strony.', {
          plAlts: [
            'To byłoby bardzo miłe z pani strony.',
            'To bardzo miło z pana strony.',
            'To bardzo miło z pani strony.',
            'Byłoby bardzo miło z pana strony.',
            'Byłoby bardzo miło z pani strony.',
          ],
        }),
        s('26-7', 'Könntest du bitte die Tür zumachen?', 'Mógłbyś zamknąć drzwi?', {
          alts: ['Könntest du die Tür zumachen?'],
          plAlts: ['Mogłabyś zamknąć drzwi?', 'Czy mógłbyś zamknąć drzwi?', 'Czy mogłabyś zamknąć drzwi?', 'Możesz zamknąć drzwi?', 'Zamkniesz drzwi?'],
        }),
        s('26-8', 'An deiner Stelle würde ich zum Arzt gehen.', 'Na twoim miejscu poszedłbym do lekarza.', {
          alts: ['Ich würde an deiner Stelle zum Arzt gehen.'],
          plAlts: ['Na twoim miejscu poszłabym do lekarza.', 'Na twoim miejscu poszedłbym do lekarki.', 'Na twoim miejscu poszłabym do lekarki.'],
        }),
      ],
      grammar: [
        {
          id: 'de.g.konjunktiv-hoeflich',
          title: 'Uprzejmie: würde, hätte, wäre, könnte',
          body: [
            'Tryb przypuszczający (**Konjunktiv II**) to niemiecki odpowiednik polskiego „-bym, -byś, -by”. Najczęściej tworzymy go z **würde** i bezokolicznikiem na końcu zdania: [[Ich würde gern nach Wien fahren.]] (Chętnie pojechałbym / pojechałabym do Wiednia.)',
            'Kilka częstych czasowników ma własne, krótkie formy: haben → [[hätte]], sein → [[wäre]], können → [[könnte]], dürfen → [[dürfte]]. Zamiast „würde haben” mówimy więc [[Ich hätte gern einen Tee.]], a zamiast „würde sein” — [[Das wäre super!]]',
            'W prośbach Konjunktiv brzmi dużo grzeczniej niż zwykłe pytanie: [[Kannst du mir helfen?]] → [[Könntest du mir helfen?]] → [[Könnten Sie mir bitte helfen?]] O pozwolenie najuprzejmiej zapytasz tak: [[Dürfte ich das Fenster aufmachen?]]',
          ],
          table: {
            head: ['Osoba', 'würde', 'hätte', 'wäre', 'könnte'],
            rows: [
              ['ich', 'würde', 'hätte', 'wäre', 'könnte'],
              ['du', 'würdest', 'hättest', 'wärst', 'könntest'],
              ['er / sie / es', 'würde', 'hätte', 'wäre', 'könnte'],
              ['wir', 'würden', 'hätten', 'wären', 'könnten'],
              ['ihr', 'würdet', 'hättet', 'wärt', 'könntet'],
              ['sie / Sie', 'würden', 'hätten', 'wären', 'könnten'],
            ],
          },
          contrast:
            'Po polsku tryb przypuszczający tworzymy cząstką „-by” doklejaną do czasownika: zrobiłbym, byłoby, mógłbyś. Po niemiecku to osobna forma: würde + bezokolicznik albo krótkie hätte, wäre, könnte. Wszystkie mają przegłos — bez niego mamy czas przeszły: hatte (miałem) ≠ hätte (miałbym), konnte (mogłem) ≠ könnte (mógłbym).',
        },
        {
          id: 'de.g.sollte',
          title: 'Rady: du solltest, an deiner Stelle',
          body: [
            'Radę dajemy z **sollte** (od sollen) i bezokolicznikiem na końcu: [[Du solltest mehr schlafen.]] (Powinieneś / powinnaś więcej spać.) [[Wir sollten jetzt gehen.]] (Powinniśmy już iść.)',
            'Druga możliwość to [[an deiner Stelle]] + würde: [[An deiner Stelle würde ich zum Arzt gehen.]] (Na twoim miejscu poszedłbym / poszłabym do lekarza.) W formie grzecznościowej: [[an Ihrer Stelle]].',
            'Tryb rozkazujący brzmi ostrzej ([[Geh zum Arzt!]]), a sollte i würde — łagodniej i życzliwiej. Bardzo delikatną radą jest pytanie: [[Warum gehst du nicht zum Arzt?]]',
          ],
          table: {
            head: ['Osoba', 'sollte', 'Przykład'],
            rows: [
              ['ich', 'sollte', 'Ich sollte mehr lernen.'],
              ['du', 'solltest', 'Du solltest mehr Sport machen.'],
              ['er / sie / es', 'sollte', 'Er sollte zum Arzt gehen.'],
              ['wir', 'sollten', 'Wir sollten jetzt gehen.'],
              ['ihr', 'solltet', 'Ihr solltet früher ins Bett gehen.'],
              ['sie / Sie', 'sollten', 'Sie sollten viel Wasser trinken.'],
            ],
          },
          contrast:
            'Po polsku „powinieneś / powinnaś” zmienia się według rodzaju, a po niemiecku du solltest powie każdy. Uwaga na pułapkę: sollte nie ma przegłosu i wygląda dokładnie jak czas przeszły od sollen — o znaczeniu („powinien” czy „miał”) decyduje kontekst.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'de.x.26-1',
          concept: 'de.g.konjunktiv-hoeflich',
          sentence: '___ Sie mir bitte helfen?',
          pl: 'Czy mógłby mi pan / mogłaby mi pani pomóc?',
          options: ['Könnten', 'Konnten', 'Kann'],
          answer: 'Könnten',
          explanation: 'Najgrzeczniejsza prośba: Könnten Sie…? (z przegłosem). Konnten bez przegłosu to czas przeszły („mogli”), a kann nie pasuje do Sie.',
        },
        {
          type: 'gap',
          id: 'de.x.26-2',
          concept: 'de.g.konjunktiv-hoeflich',
          sentence: 'Ich ___ gern einen Kaffee mit Milch.',
          pl: 'Poproszę kawę z mlekiem.',
          options: ['hätte', 'hatte', 'würde'],
          answer: 'hätte',
          explanation: 'Ich hätte gern… = poproszę… Hatte bez przegłosu to czas przeszły („miałem”), a po würde potrzebny byłby bezokolicznik na końcu.',
        },
        {
          type: 'gap',
          id: 'de.x.26-3',
          concept: 'de.g.konjunktiv-hoeflich',
          sentence: 'Das ___ super!',
          pl: 'To byłoby super!',
          options: ['war', 'wäre', 'würde'],
          answer: 'wäre',
          explanation: 'Wäre = byłoby (od sein). Das war super! znaczy „było super” — to czas przeszły.',
        },
        {
          type: 'gap',
          id: 'de.x.26-4',
          concept: 'de.g.konjunktiv-hoeflich',
          sentence: '___ ich das Fenster aufmachen?',
          pl: 'Czy mógłbym / mogłabym otworzyć okno?',
          options: ['Dürfte', 'Durfte', 'Würde'],
          answer: 'Dürfte',
          explanation: 'Uprzejme pytanie o pozwolenie: Dürfte ich…? Durfte bez przegłosu to czas przeszły („wolno mi było”).',
        },
        {
          type: 'choice',
          id: 'de.x.26-5',
          concept: 'de.g.konjunktiv-hoeflich',
          prompt: 'Jak powiesz: „Chętnie poszedłbym do kina”?',
          options: ['Ich würde gern ins Kino gehen.', 'Ich würde gern gehen ins Kino.', 'Ich werde gern ins Kino gehen.'],
          answer: 0,
          explanation: 'Würde + bezokolicznik na końcu zdania. Werde to czas przyszły („pójdę”), a nie tryb przypuszczający.',
        },
        {
          type: 'gap',
          id: 'de.x.26-6',
          concept: 'de.g.sollte',
          sentence: 'Du ___ mehr schlafen.',
          pl: 'Powinieneś / powinnaś więcej spać.',
          options: ['solltest', 'sollte', 'solltet'],
          answer: 'solltest',
          explanation: 'Rada dla du: du solltest. Sollte pasuje do ich i er/sie/es, a solltet — do ihr.',
        },
        {
          type: 'choice',
          id: 'de.x.26-7',
          concept: 'de.g.sollte',
          prompt: 'Jak powiesz: „Na twoim miejscu zostałbym w domu”?',
          options: ['An deiner Stelle bleibe ich zu Hause.', 'An deiner Stelle würde ich zu Hause bleiben.', 'An deiner Stelle würde ich bleiben zu Hause.'],
          answer: 1,
          explanation: 'Rada: an deiner Stelle + würde + bezokolicznik na końcu. Pierwsze zdanie znaczy „na twoim miejscu zostaję w domu”, a w trzecim bezokolicznik nie stoi na końcu.',
        },
      ],
      dialogue: {
        id: 'de.d.26',
        title: 'Przed egzaminem',
        context: 'Jonas od tygodnia uczy się do egzaminu i jest wykończony. Jego koleżanka z Polski, Marta, próbuje mu pomóc.',
        speakers: {
          J: { name: 'Jonas', voice: 'b', accent: 'de-DE' },
          M: { name: 'Marta', voice: 'a', accent: 'de-DE' },
        },
        lines: [
          { speaker: 'J', text: 'Ich bin so müde! Ich habe die ganze Nacht gelernt.', pl: 'Jestem taki zmęczony! Uczyłem się całą noc.' },
          { speaker: 'M', text: 'Du solltest mehr schlafen, Jonas. Und du solltest auch etwas essen.', pl: 'Powinieneś więcej spać, Jonas. I powinieneś też coś zjeść.' },
          { speaker: 'J', text: 'Ich weiß. Aber die Prüfung ist schon am Freitag.', pl: 'Wiem. Ale egzamin jest już w piątek.' },
          { speaker: 'M', text: 'An deiner Stelle würde ich heute früh ins Bett gehen.', pl: 'Na twoim miejscu poszłabym dziś wcześnie spać.' },
          { speaker: 'J', text: 'Vielleicht hast du recht. Könntest du morgen mit mir lernen?', pl: 'Może masz rację. Mogłabyś jutro pouczyć się ze mną?' },
          { speaker: 'M', text: 'Gern! Morgen um zehn hätte ich Zeit.', pl: 'Chętnie! Jutro o dziesiątej miałabym czas.' },
          { speaker: 'J', text: 'Das wäre super! Danke, Marta.', pl: 'Byłoby super! Dzięki, Marta.' },
          { speaker: 'M', text: 'Kein Problem. Aber jetzt: ab ins Bett!', pl: 'Nie ma sprawy. Ale teraz: marsz do łóżka!' },
        ],
        questions: [
          {
            id: 'de.d.26-q1',
            prompt: 'Dlaczego Jonas jest taki zmęczony?',
            options: ['Bo długo pracował w hotelu', 'Bo uczył się całą noc', 'Bo jest chory'],
            answer: 1,
            explanation: '„Ich habe die ganze Nacht gelernt.” — uczył się całą noc.',
          },
          {
            id: 'de.d.26-q2',
            prompt: 'Co radzi mu Marta?',
            options: ['Żeby więcej spał i coś zjadł', 'Żeby poszedł do lekarza', 'Żeby uczył się dłużej'],
            answer: 0,
            explanation: '„Du solltest mehr schlafen… Und du solltest auch etwas essen.”',
          },
          {
            id: 'de.d.26-q3',
            prompt: 'Kiedy Marta ma czas, żeby się z nim pouczyć?',
            options: ['Dziś wieczorem', 'W piątek rano', 'Jutro o dziesiątej'],
            answer: 2,
            explanation: '„Morgen um zehn hätte ich Zeit.” — hätte (miałabym) brzmi grzeczniej niż zwykłe habe.',
          },
        ],
      },
      summary: [
        'Konjunktiv II = polskie „-bym”: würde + bezokolicznik — Ich würde gern nach Wien fahren.',
        'Krótkie formy: hätte (miałbym), wäre (byłbym), könnte (mógłbym), dürfte (czy mógłbym…?).',
        'Grzeczne prośby: Könnten Sie mir bitte helfen? Dürfte ich das Fenster aufmachen? Ich hätte gern einen Tee.',
        'Rady: Du solltest mehr schlafen. An deiner Stelle würde ich zum Arzt gehen.',
      ],
      followUp:
        'Przy najbliższej okazji — w kawiarni, w sklepie, w mailu — zamień w myślach „Ich will…” na „Ich hätte gern…”, a „Kannst du…?” na „Könntest du…?”. Za około 10 minut zrób krótką powtórkę.',
    },
  ],
};
