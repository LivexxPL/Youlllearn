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
  ],
};
