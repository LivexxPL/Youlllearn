import type { Unit } from '../types';
import { contentHelpers } from '../helpers';

const { word, noun, verb, phrase, sentence: s } = contentHelpers('de');

export const unit8: Unit = {
  id: 'de.u8',
  title: 'Cele, argumenty i historie',
  description:
    'Pierwsze kroki na poziomie B1: cele z zu i um … zu, argumenty z obwohl i deshalb, strona bierna, opowiadanie w Präteritum i Plusquamperfekt oraz zdania „co by było, gdyby…”.',
  level: 'B1',
  lessons: [
    {
      id: 'de.l30',
      title: 'Cele i zamiary',
      subtitle: 'Um besser Deutsch zu sprechen',
      objective: 'Powiesz, na co masz ochotę i co próbujesz albo zaczynasz robić (Ich versuche, früher aufzustehen), i wyjaśnisz cel — z um … zu albo damit.',
      level: 'B1',
      minutes: 13,
      intro: [
        'Witaj na poziomie B1! W tym dziale nauczysz się mówić o celach, argumentować, opisywać, jak coś powstaje, opowiadać historie i zastanawiać się, co by było, gdyby… Zdania będą dłuższe, ale zbudujesz je z tego, co już znasz.',
      ],
      items: [
        phrase('lust-haben', 'Lust haben', 'mieć ochotę', {
          plAlts: ['mieć chęć', 'chcieć się'],
          note: 'Ich habe Lust, ins Kino zu gehen. — Mam ochotę pójść do kina. Ich habe keine Lust. — Nie chce mi się. Krócej: Lust auf + biernik — Lust auf Pizza?',
        }),
        verb('versuchen', 'versuchen', 'próbować; spróbować', {
          plAlts: ['próbować', 'spróbować', 'starać się'],
          note: 'Z zu + bezokolicznik: Ich versuche, früher aufzustehen. — Próbuję wstawać wcześniej.',
        }),
        verb('vergessen', 'vergessen', 'zapominać; zapomnieć', {
          plAlts: ['zapomnieć', 'zapominać'],
          note: 'Nieregularny: du vergisst, er vergisst; Perfekt: ich habe vergessen. Vergiss nicht, Oma anzurufen! — Nie zapomnij zadzwonić do babci!',
        }),
        verb('anfangen', 'anfangen', 'zaczynać; zacząć', {
          plAlts: ['zacząć', 'zaczynać', 'rozpoczynać', 'rozpocząć'],
          note: 'Rozdzielny i nieregularny: ich fange an, du fängst an, er fängt an; Perfekt: ich habe angefangen. Ich fange an, Spanisch zu lernen.',
        }),
        verb('aufhoeren', 'aufhören', 'przestawać; przestać', {
          plAlts: ['przestać', 'przestawać', 'skończyć z czymś', 'rzucić'],
          note: 'Rozdzielny: Hör auf! — Przestań! Er hat aufgehört zu rauchen. — Rzucił palenie. Także: mit dem Rauchen aufhören.',
        }),
        verb('hoffen', 'hoffen', 'mieć nadzieję', {
          plAlts: ['liczyć na coś'],
          note: 'Ich hoffe, dich bald zu sehen. — Mam nadzieję, że wkrótce cię zobaczę. Ten sam rdzeń co hoffentlich (oby).',
        }),
        phrase('um-zu', 'um … zu', 'żeby; aby (+ bezokolicznik)', {
          tts: 'um Deutsch zu lernen',
          alts: ['um zu', 'um Deutsch zu lernen'],
          plAlts: ['żeby', 'aby', 'w celu'],
          note: 'Cel, gdy podmiot jest ten sam: Ich lerne Deutsch, um in Wien zu arbeiten. — Uczę się niemieckiego, żeby pracować w Wiedniu.',
        }),
        word('damit', 'damit', 'żeby; aby (+ zdanie)', {
          pos: 'conj',
          plAlts: ['żeby', 'aby', 'by'],
          note: 'Cel, gdy podmiot jest inny; czasownik na końcu: Ich spreche langsam, damit du mich verstehst. — Mówię powoli, żebyś mnie rozumiał.',
        }),
        noun('das-ziel', 'das Ziel', 'cel', 'n', {
          plural: 'die Ziele',
          note: 'Mein Ziel ist es, … zu … — Moim celem jest… Także meta biegu i cel podróży.',
        }),
        verb('sparen', 'sparen', 'oszczędzać', {
          plAlts: ['zaoszczędzić', 'odkładać pieniądze'],
          note: 'Ich spare für ein Auto. — Oszczędzam na samochód. Zeit sparen — oszczędzać czas.',
        }),
        noun('das-geld', 'das Geld', 'pieniądze', 'n', {
          note: 'Po niemiecku liczba pojedyncza: Das Geld reicht nicht. — Pieniędzy nie wystarcza. Kein Geld haben — nie mieć pieniędzy.',
        }),
        noun('der-fuehrerschein', 'der Führerschein', 'prawo jazdy', 'm', {
          plural: 'die Führerscheine',
          note: 'Den Führerschein machen — robić prawo jazdy. Hast du einen Führerschein? — Masz prawo jazdy?',
        }),
        verb('verbessern', 'verbessern', 'poprawiać; poprawić', {
          plAlts: ['poprawić', 'poprawiać', 'ulepszyć', 'podszkolić'],
          note: 'Ich will mein Deutsch verbessern. — Chcę podszkolić niemiecki. Od besser (lepiej).',
        }),
        word('regelmaessig', 'regelmäßig', 'regularnie; regularny', {
          pos: 'adv',
          plAlts: ['regularnie', 'regularny', 'systematycznie'],
          note: 'Ich versuche, regelmäßig Sport zu machen. — Próbuję regularnie uprawiać sport. Od die Regel (reguła).',
        }),
      ],
      sentences: [
        s('30-1', 'Ich habe heute keine Lust, einkaufen zu gehen.', 'Nie chce mi się dziś iść na zakupy.', {
          alts: ['Heute habe ich keine Lust, einkaufen zu gehen.'],
          plAlts: [
            'Nie mam dziś ochoty iść na zakupy.',
            'Dzisiaj nie chce mi się iść na zakupy.',
            'Nie mam dzisiaj ochoty iść na zakupy.',
            'Nie mam dziś ochoty robić zakupów.',
          ],
        }),
        s('30-2', 'Hast du Lust, am Samstag ins Kaffeehaus zu gehen?', 'Masz ochotę pójść w sobotę do kawiarni?', {
          plAlts: ['Masz ochotę iść w sobotę do kawiarni?', 'Czy masz ochotę pójść w sobotę do kawiarni?', 'Chcesz pójść w sobotę do kawiarni?'],
          note: 'Kaffeehaus — tradycyjna austriacka kawiarnia.',
          accent: 'de-AT',
        }),
        s('30-3', 'Es ist wichtig, regelmäßig zu lernen.', 'Ważne jest, żeby regularnie się uczyć.', {
          plAlts: [
            'Ważne jest, aby regularnie się uczyć.',
            'Ważne jest, żeby uczyć się regularnie.',
            'Ważne jest regularne uczenie się.',
            'To ważne, żeby regularnie się uczyć.',
          ],
        }),
        s('30-4', 'Ich versuche, jeden Tag früher aufzustehen.', 'Próbuję codziennie wstawać wcześniej.', {
          plAlts: ['Staram się codziennie wstawać wcześniej.', 'Codziennie próbuję wstawać wcześniej.', 'Próbuję wstawać codziennie wcześniej.'],
          note: 'Przy czasownikach rozdzielnych zu wchodzi do środka: aufstehen → aufzustehen.',
        }),
        s('30-5', 'Vergiss nicht, deine Oma anzurufen!', 'Nie zapomnij zadzwonić do babci!', {
          alts: ['Vergiss nicht, Oma anzurufen!'],
          plAlts: ['Nie zapomnij zadzwonić do swojej babci!', 'Nie zapomnij zatelefonować do babci!', 'Pamiętaj, żeby zadzwonić do babci!'],
        }),
        s('30-6', 'Er hat aufgehört zu rauchen, um Geld zu sparen.', 'Rzucił palenie, żeby oszczędzać pieniądze.', {
          alts: ['Er hat mit dem Rauchen aufgehört, um Geld zu sparen.'],
          plAlts: [
            'Rzucił palenie, żeby zaoszczędzić pieniądze.',
            'Przestał palić, żeby oszczędzać pieniądze.',
            'Przestał palić, żeby zaoszczędzić pieniądze.',
            'Rzucił palenie, aby oszczędzać pieniądze.',
          ],
        }),
        s('30-7', 'Ich spreche langsam, damit du mich verstehst.', 'Mówię powoli, żebyś mnie rozumiał.', {
          plAlts: [
            'Mówię powoli, żebyś mnie rozumiała.',
            'Mówię powoli, abyś mnie rozumiał.',
            'Mówię powoli, abyś mnie rozumiała.',
            'Mówię powoli, żebyś mnie zrozumiał.',
            'Mówię powoli, żebyś mnie zrozumiała.',
          ],
          note: 'Dwa różne podmioty (ich mówię — du rozumiesz), więc damit, a nie um … zu.',
        }),
        s('30-8', 'Heuer habe ich angefangen, den Führerschein zu machen.', 'W tym roku zacząłem robić prawo jazdy.', {
          alts: ['Ich habe heuer angefangen, den Führerschein zu machen.', 'Dieses Jahr habe ich angefangen, den Führerschein zu machen.'],
          plAlts: ['W tym roku zaczęłam robić prawo jazdy.', 'W tym roku zacząłem kurs na prawo jazdy.', 'W tym roku zaczęłam kurs na prawo jazdy.'],
          note: 'heuer — austriackie „w tym roku”.',
          accent: 'de-AT',
        }),
        s('30-9', 'Mein Ziel ist es, mein Deutsch zu verbessern.', 'Moim celem jest poprawić swój niemiecki.', {
          alts: ['Mein Ziel ist, mein Deutsch zu verbessern.'],
          plAlts: [
            'Moim celem jest poprawić mój niemiecki.',
            'Moim celem jest poprawa mojego niemieckiego.',
            'Moim celem jest podszkolenie niemieckiego.',
            'Mój cel to poprawić swój niemiecki.',
          ],
        }),
      ],
      grammar: [
        {
          id: 'de.g.zu-infinitiv',
          title: 'Bezokolicznik z zu: Ich versuche, … zu …',
          body: [
            'Po wielu czasownikach i wyrażeniach drugi czasownik stoi w bezokoliczniku z **zu**, na samym końcu zdania: [[Ich versuche, früher aufzustehen.]] [[Ich habe keine Lust, einkaufen zu gehen.]] [[Es ist wichtig, regelmäßig zu lernen.]] Przed taką grupą zwykle stawiamy przecinek.',
            'Typowe zwroty: [[versuchen]] (próbować), [[vergessen]] (zapominać), [[anfangen]] (zaczynać), [[aufhören]] (przestawać), [[hoffen]] (mieć nadzieję), [[vorhaben]] (planować), [[Lust haben]] (mieć ochotę), [[Zeit haben]] (mieć czas) oraz es ist wichtig / schwer / leicht (to ważne / trudne / łatwe).',
            'Przy czasownikach **rozdzielnych** zu wchodzi do środka, między przedrostek a rdzeń, i całość piszemy razem: anrufen → [[anzurufen]], aufstehen → [[aufzustehen]], einkaufen → [[einzukaufen]].',
            '**Bez zu** zostaje bezokolicznik po czasownikach modalnych i po werden: [[Ich muss arbeiten.]] [[Ich werde lernen.]] Częsty błąd to „Ich muss zu arbeiten”.',
          ],
          table: {
            head: ['Zwrot', 'Przykład', 'Po polsku'],
            rows: [
              ['versuchen', 'Ich versuche, früher aufzustehen.', 'Próbuję wstawać wcześniej.'],
              ['vergessen', 'Vergiss nicht, Oma anzurufen!', 'Nie zapomnij zadzwonić do babci!'],
              ['Lust haben', 'Hast du Lust, ins Kino zu gehen?', 'Masz ochotę pójść do kina?'],
              ['anfangen', 'Ich fange an, Spanisch zu lernen.', 'Zaczynam uczyć się hiszpańskiego.'],
              ['es ist wichtig', 'Es ist wichtig, viel zu schlafen.', 'Ważne jest, żeby dużo spać.'],
            ],
          },
          contrast:
            'Po polsku po „próbuję”, „zapomniałem” czy „mam ochotę” stoi zwykły bezokolicznik: próbuję wstać, mam ochotę iść. Po niemiecku trzeba dodać zu i przesunąć bezokolicznik na koniec: Ich versuche aufzustehen. Za to po czasownikach modalnych zu nie ma — tak jak po polsku: Ich muss gehen (muszę iść).',
        },
        {
          id: 'de.g.um-zu-damit',
          title: 'Cel: um … zu czy damit?',
          body: [
            'Cel („żeby, aby”) wyrażamy na dwa sposoby. Gdy **podmiot jest ten sam** w obu częściach zdania, używamy [[um … zu]] z bezokolicznikiem na końcu: [[Ich lerne Deutsch, um in Wien zu arbeiten.]] (Ja się uczę — ja będę pracować.)',
            'Gdy **podmioty są różne**, potrzebne jest zdanie z [[damit]] i odmienionym czasownikiem na końcu: [[Ich spreche langsam, damit du mich verstehst.]] (Ja mówię — ty rozumiesz.)',
            'Przy tym samym podmiocie damit też jest poprawne, ale brzmi ciężej: [[Ich spare, damit ich ein Auto kaufen kann.]] Na co dzień wybierz um … zu: [[Ich spare, um ein Auto zu kaufen.]] O cel pytamy [[Wozu?]] (po co?) albo po prostu [[Warum?]] — a krótka odpowiedź może stać sama: [[Um in Wien zu arbeiten.]]',
          ],
          table: {
            head: ['', 'um … zu', 'damit'],
            rows: [
              ['podmiot', 'ten sam', 'zwykle inny'],
              ['czasownik', 'bezokolicznik z zu na końcu', 'odmieniony, na końcu'],
              ['przykład', 'Ich spare, um ein Auto zu kaufen.', 'Ich spare, damit meine Kinder studieren können.'],
            ],
          },
          contrast:
            'Po polsku jest jedno „żeby” na wszystko, a różnicę widać tylko w formie czasownika: „żeby pracować” (ten sam podmiot) i „żebyś rozumiał” (inny podmiot). Niemiecki rozdziela to na dwa spójniki: um … zu odpowiada „żeby + bezokolicznik”, a damit — „żeby + forma osobowa”: damit du verstehst = żebyś rozumiał.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'de.x.30-1',
          concept: 'de.g.zu-infinitiv',
          sentence: 'Vergiss nicht, Oma ___!',
          pl: 'Nie zapomnij zadzwonić do babci!',
          options: ['anzurufen', 'zu anrufen', 'anrufen'],
          answer: 'anzurufen',
          explanation: 'Anrufen jest rozdzielny, więc zu wchodzi między przedrostek a rdzeń i piszemy razem: anzurufen.',
        },
        {
          type: 'gap',
          id: 'de.x.30-2',
          concept: 'de.g.zu-infinitiv',
          sentence: 'Ich versuche, mehr Wasser ___.',
          pl: 'Próbuję pić więcej wody.',
          options: ['trinken', 'zu trinken', 'getrunken'],
          answer: 'zu trinken',
          explanation: 'Versuchen łączy się z zu + bezokolicznik na końcu: Ich versuche, mehr Wasser zu trinken.',
        },
        {
          type: 'gap',
          id: 'de.x.30-3',
          concept: 'de.g.zu-infinitiv',
          sentence: 'Ich muss heute lange ___.',
          pl: 'Muszę dziś długo pracować.',
          options: ['arbeiten', 'zu arbeiten', 'gearbeitet'],
          answer: 'arbeiten',
          explanation: 'Po czasownikach modalnych (müssen, können, wollen…) bezokolicznik stoi bez zu — tak jak po polsku „muszę pracować”.',
        },
        {
          type: 'choice',
          id: 'de.x.30-4',
          concept: 'de.g.zu-infinitiv',
          prompt: 'Które zdanie jest poprawne?',
          options: ['Es ist wichtig, viel Wasser zu trinken.', 'Es ist wichtig, zu trinken viel Wasser.', 'Es ist wichtig, viel Wasser trinken.'],
          answer: 0,
          explanation: 'Po „es ist wichtig” potrzebny jest bezokolicznik z zu, a cała grupa „zu trinken” stoi na samym końcu.',
        },
        {
          type: 'gap',
          id: 'de.x.30-5',
          concept: 'de.g.um-zu-damit',
          sentence: 'Ich lerne Deutsch, ___ in Wien zu arbeiten.',
          pl: 'Uczę się niemieckiego, żeby pracować w Wiedniu.',
          options: ['um', 'damit', 'dass'],
          answer: 'um',
          explanation: 'Ten sam podmiot (ja się uczę — ja będę pracować) i bezokolicznik z zu na końcu → um … zu.',
        },
        {
          type: 'gap',
          id: 'de.x.30-6',
          concept: 'de.g.um-zu-damit',
          sentence: 'Wir sprechen zu Hause Deutsch, ___ die Kinder es lernen.',
          pl: 'W domu mówimy po niemiecku, żeby dzieci się go nauczyły.',
          options: ['um', 'damit', 'dass'],
          answer: 'damit',
          explanation: 'Podmioty są różne (my mówimy — dzieci się uczą), więc damit z odmienionym czasownikiem na końcu.',
        },
        {
          type: 'choice',
          id: 'de.x.30-7',
          concept: 'de.g.um-zu-damit',
          prompt: 'Które zdanie jest poprawne?',
          options: ['Ich spare Geld, um ein Auto kaufen.', 'Ich spare Geld, um ein Auto zu kaufen.', 'Ich spare Geld, damit ein Auto zu kaufen.'],
          answer: 1,
          explanation: 'Po um potrzebny jest bezokolicznik z zu na końcu. Damit łączy się z pełnym zdaniem (podmiot + odmieniony czasownik), nigdy z zu.',
        },
      ],
      dialogue: {
        id: 'de.d.30',
        title: 'Postanowienia noworoczne',
        context: 'Sylwester w Monachium. Ania i jej kolega Felix rozmawiają o planach na nowy rok.',
        speakers: {
          F: { name: 'Felix', voice: 'b', accent: 'de-DE' },
          A: { name: 'Ania', voice: 'a', accent: 'de-DE' },
        },
        lines: [
          { speaker: 'F', text: 'Und, Ania? Was sind deine Ziele für das neue Jahr?', pl: 'No i co, Ania? Jakie masz cele na nowy rok?' },
          { speaker: 'A', text: 'Ich will mein Deutsch verbessern. Ich versuche, jeden Tag zu lernen.', pl: 'Chcę podszkolić niemiecki. Próbuję uczyć się codziennie.' },
          { speaker: 'F', text: 'Super! Und warum ist das so wichtig für dich?', pl: 'Super! A czemu to dla ciebie takie ważne?' },
          { speaker: 'A', text: 'Um in Österreich zu studieren! Und du?', pl: 'Żeby studiować w Austrii! A ty?' },
          { speaker: 'F', text: 'Ich habe vor, mit dem Rauchen aufzuhören.', pl: 'Mam zamiar rzucić palenie.' },
          { speaker: 'A', text: 'Wirklich? Das hast du letztes Jahr auch gesagt!', pl: 'Naprawdę? W zeszłym roku mówiłeś to samo!' },
          {
            speaker: 'F',
            text: 'Ich weiß. Aber jetzt spare ich für den Führerschein, und Rauchen ist so teuer.',
            pl: 'Wiem. Ale teraz oszczędzam na prawo jazdy, a palenie jest takie drogie.',
          },
          { speaker: 'A', text: 'Gut! Ich rufe dich jeden Tag an, damit du es nicht vergisst.', pl: 'Dobrze! Będę do ciebie dzwonić codziennie, żebyś nie zapomniał.' },
          { speaker: 'F', text: 'Danke! Aber bitte nicht um sieben Uhr morgens!', pl: 'Dzięki! Ale proszę, nie o siódmej rano!' },
        ],
        questions: [
          {
            id: 'de.d.30-q1',
            prompt: 'Po co Ania chce podszkolić niemiecki?',
            options: ['Żeby pracować w hotelu', 'Żeby studiować w Austrii', 'Żeby zrobić prawo jazdy'],
            answer: 1,
            explanation: '„Um in Österreich zu studieren!” — krótka odpowiedź z um … zu.',
          },
          {
            id: 'de.d.30-q2',
            prompt: 'Co postanowił Felix?',
            options: ['Rzucić palenie', 'Uczyć się codziennie', 'Przeprowadzić się do Austrii'],
            answer: 0,
            explanation: '„Ich habe vor, mit dem Rauchen aufzuhören.”',
          },
          {
            id: 'de.d.30-q3',
            prompt: 'Po co Ania będzie codziennie dzwonić do Felixa?',
            options: ['Żeby razem się uczyć', 'Żeby nie zapomniał o swoim postanowieniu', 'Żeby pożyczyć od niego pieniądze'],
            answer: 1,
            explanation: '„Ich rufe dich jeden Tag an, damit du es nicht vergisst.” — różne podmioty, więc damit.',
          },
        ],
      },
      summary: [
        'Bezokolicznik z zu na końcu po versuchen, vergessen, anfangen, aufhören, hoffen, Lust haben, es ist wichtig: Ich versuche, früher aufzustehen.',
        'Czasowniki rozdzielne: zu w środku — anzurufen, aufzustehen. Po modalnych bez zu: Ich muss arbeiten.',
        'Cel przy tym samym podmiocie: um … zu — Ich lerne Deutsch, um in Wien zu arbeiten.',
        'Cel przy innym podmiocie: damit + czasownik na końcu — Ich spreche langsam, damit du mich verstehst.',
      ],
      followUp:
        'Zapisz trzy swoje cele na ten rok: jeden z „Ich versuche, …”, jeden z „Ich habe vor, …” i jeden z „um … zu”. Za około 10 minut zrób krótką powtórkę.',
    },
  ],
};
