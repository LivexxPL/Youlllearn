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
    {
      id: 'de.l31',
      title: 'Za i przeciw',
      subtitle: 'Stadt oder Land?',
      objective: 'Podasz argumenty za i przeciw — z weil i denn, deshalb, außerdem, obwohl i trotzdem — i postawisz czasownik na właściwym miejscu po każdym z tych słów.',
      level: 'B1',
      minutes: 12,
      items: [
        word('obwohl', 'obwohl', 'chociaż; mimo że', {
          pos: 'conj',
          plAlts: ['chociaż', 'mimo że', 'pomimo że', 'choć'],
          note: 'Spójnik — czasownik na końcu: Obwohl es regnet, gehe ich spazieren. — Chociaż pada, idę na spacer.',
        }),
        word('trotzdem', 'trotzdem', 'mimo to', {
          pos: 'adv',
          plAlts: ['pomimo to', 'a jednak', 'jednak', 'i tak'],
          note: 'Przysłówek — czasownik zaraz po nim: Es regnet. Trotzdem gehe ich spazieren. Nie myl z obwohl (mimo że).',
        }),
        word('deshalb', 'deshalb', 'dlatego', {
          pos: 'adv',
          plAlts: ['więc', 'z tego powodu', 'zatem'],
          note: 'Wprowadza skutek; czasownik zaraz po nim: Ich bin müde, deshalb bleibe ich zu Hause.',
        }),
        word('deswegen', 'deswegen', 'dlatego (potocznie)', {
          pos: 'adv',
          plAlts: ['dlatego', 'więc', 'z tego powodu'],
          note: 'To samo co deshalb, częstsze w mowie. Szyk ten sam: Deswegen bleibe ich zu Hause.',
        }),
        word('denn', 'denn', 'bo; ponieważ', {
          pos: 'conj',
          plAlts: ['bo', 'ponieważ', 'gdyż'],
          note: 'Jak weil, ale bez zmiany szyku: …, denn ich bin müde. W pytaniach denn to częsty ozdobnik: Was machst du denn? — No co ty robisz?',
        }),
        word('ausserdem', 'außerdem', 'poza tym; oprócz tego', {
          pos: 'adv',
          plAlts: ['poza tym', 'oprócz tego', 'ponadto', 'w dodatku'],
          note: 'Dodaje kolejny argument; czasownik zaraz po nim: Außerdem ist die Miete teuer.',
        }),
        phrase('einerseits-andererseits', 'einerseits … andererseits', 'z jednej strony…, z drugiej strony…', {
          tts: 'einerseits, andererseits',
          plAlts: ['z jednej strony, z drugiej strony'],
          note: 'Oba słowa zajmują 1. miejsce, więc czasownik stoi zaraz po nich: Einerseits ist es ruhig, andererseits ist es langweilig.',
        }),
        phrase('zwar-aber', 'zwar … aber', 'wprawdzie…, ale', {
          tts: 'zwar klein, aber gemütlich',
          plAlts: ['co prawda…, ale', 'wprawdzie, ale', 'co prawda, ale'],
          note: 'Najpierw przyznajemy coś, potem dodajemy kontrast: Die Wohnung ist zwar klein, aber gemütlich. — Mieszkanie jest wprawdzie małe, ale przytulne.',
        }),
        noun('der-vorteil', 'der Vorteil', 'zaleta; korzyść', 'm', {
          plural: 'die Vorteile',
          plAlts: ['zaleta', 'korzyść', 'plus'],
          note: 'Der Vorteil ist, dass … — Zaletą jest to, że…',
        }),
        noun('der-nachteil', 'der Nachteil', 'wada; minus', 'm', {
          plural: 'die Nachteile',
          plAlts: ['wada', 'minus', 'słaba strona'],
          note: 'Przeciwieństwo: der Vorteil. Ein Nachteil ist, dass … — Wadą jest to, że…',
        }),
        noun('das-land', 'das Land', 'wieś; kraj', 'n', {
          plural: 'die Länder',
          plAlts: ['wieś', 'kraj', 'państwo'],
          note: 'auf dem Land wohnen — mieszkać na wsi; aufs Land ziehen — przeprowadzić się na wieś. Drugie znaczenie: kraj — Österreich ist ein schönes Land. L. mn. tylko w znaczeniu „kraje”.',
        }),
        noun('die-miete', 'die Miete', 'czynsz', 'f', {
          plural: 'die Mieten',
          plAlts: ['komorne', 'opłata za wynajem'],
          note: 'Die Miete ist hoch. — Czynsz jest wysoki. Od mieten — wynajmować (mieszkanie).',
        }),
        word('laut', 'laut', 'głośny; głośno', {
          pos: 'adj',
          plAlts: ['głośno', 'głośna', 'głośne', 'hałaśliwy'],
          note: 'Przeciwieństwo: leise (cichy) albo ruhig (spokojny). Die Straße ist sehr laut. — Ulica jest bardzo głośna.',
        }),
        noun('die-natur', 'die Natur', 'przyroda; natura', 'f', {
          plAlts: ['przyroda', 'natura'],
          note: 'In der Natur — na łonie przyrody. Bez liczby mnogiej.',
        }),
      ],
      sentences: [
        s('31-1', 'Ich bleibe heute zu Hause, denn ich bin müde.', 'Zostaję dziś w domu, bo jestem zmęczony.', {
          alts: ['Ich bleibe heute zu Hause, weil ich müde bin.'],
          plAlts: [
            'Zostaję dziś w domu, bo jestem zmęczona.',
            'Zostaję dzisiaj w domu, bo jestem zmęczony.',
            'Zostaję dzisiaj w domu, bo jestem zmęczona.',
            'Zostaję dziś w domu, ponieważ jestem zmęczony.',
            'Zostaję dziś w domu, ponieważ jestem zmęczona.',
          ],
          note: 'Po denn szyk się nie zmienia: ich bin müde. Po weil czasownik idzie na koniec: weil ich müde bin.',
        }),
        s('31-2', 'Obwohl es kalt ist, gehen wir schwimmen.', 'Chociaż jest zimno, idziemy popływać.', {
          alts: ['Wir gehen schwimmen, obwohl es kalt ist.'],
          plAlts: [
            'Chociaż jest zimno, idziemy pływać.',
            'Mimo że jest zimno, idziemy popływać.',
            'Mimo że jest zimno, idziemy pływać.',
            'Pomimo że jest zimno, idziemy pływać.',
            'Idziemy popływać, chociaż jest zimno.',
          ],
          note: 'Zdanie z obwohl zajmuje 1. miejsce, dlatego dalej najpierw czasownik: gehen wir.',
        }),
        s('31-3', 'Die Wohnung ist teuer. Trotzdem nehmen wir sie.', 'Mieszkanie jest drogie. Mimo to je bierzemy.', {
          alts: ['Die Wohnung ist teuer, aber wir nehmen sie trotzdem.'],
          plAlts: [
            'Mieszkanie jest drogie. Mimo to bierzemy je.',
            'To mieszkanie jest drogie. Mimo to je bierzemy.',
            'Mieszkanie jest drogie, ale i tak je bierzemy.',
            'Mieszkanie jest drogie. A jednak je bierzemy.',
          ],
        }),
        s('31-4', 'Die Natur ist uns wichtig, deshalb ziehen wir aufs Land.', 'Przyroda jest dla nas ważna, dlatego przeprowadzamy się na wieś.', {
          alts: ['Die Natur ist uns wichtig, deswegen ziehen wir aufs Land.'],
          plAlts: [
            'Przyroda jest dla nas ważna, więc przeprowadzamy się na wieś.',
            'Natura jest dla nas ważna, dlatego przeprowadzamy się na wieś.',
            'Przyroda jest dla nas ważna, dlatego przenosimy się na wieś.',
          ],
          note: 'aufs Land ziehen — przeprowadzić się na wieś. Po deshalb od razu czasownik: deshalb ziehen wir.',
        }),
        s('31-5', 'Ich habe heuer viel gespart, deswegen fahre ich im Sommer nach Italien.', 'W tym roku dużo zaoszczędziłem, dlatego latem jadę do Włoch.', {
          alts: [
            'Ich habe heuer viel gespart, deshalb fahre ich im Sommer nach Italien.',
            'Ich habe dieses Jahr viel gespart, deswegen fahre ich im Sommer nach Italien.',
          ],
          plAlts: [
            'W tym roku dużo zaoszczędziłam, dlatego latem jadę do Włoch.',
            'W tym roku sporo zaoszczędziłem, dlatego latem jadę do Włoch.',
            'W tym roku sporo zaoszczędziłam, dlatego latem jadę do Włoch.',
            'W tym roku dużo zaoszczędziłem, więc latem pojadę do Włoch.',
            'W tym roku dużo zaoszczędziłam, więc latem pojadę do Włoch.',
          ],
          note: 'heuer — austriackie „w tym roku”.',
          accent: 'de-AT',
        }),
        s('31-6', 'In der Stadt ist es laut. Außerdem ist die Miete sehr teuer.', 'W mieście jest głośno. Poza tym czynsz jest bardzo drogi.', {
          plAlts: [
            'W mieście jest głośno. Oprócz tego czynsz jest bardzo drogi.',
            'W mieście jest głośno, a poza tym czynsz jest bardzo drogi.',
            'W mieście jest głośno. Poza tym czynsze są bardzo wysokie.',
          ],
        }),
        s('31-7', 'Ein Nachteil ist, dass ich mit dem Bus zur Arbeit fahren muss.', 'Wadą jest to, że do pracy muszę jeździć autobusem.', {
          plAlts: [
            'Jedną z wad jest to, że do pracy muszę jeździć autobusem.',
            'Minusem jest to, że do pracy muszę jeździć autobusem.',
            'Wadą jest to, że muszę jeździć do pracy autobusem.',
          ],
        }),
        s(
          '31-8',
          'Einerseits ist das Leben auf dem Land ruhig, andererseits ist es dort ein bisschen langweilig.',
          'Z jednej strony życie na wsi jest spokojne, z drugiej strony jest tam trochę nudno.',
          {
            plAlts: [
              'Z jednej strony życie na wsi jest spokojne, z drugiej jest tam trochę nudno.',
              'Z jednej strony życie na wsi jest spokojne, a z drugiej strony jest tam trochę nudno.',
              'Z jednej strony na wsi żyje się spokojnie, z drugiej strony jest tam trochę nudno.',
            ],
          },
        ),
        s('31-9', 'Die Wohnung in Wien ist zwar klein, aber die Öffis sind super.', 'Mieszkanie w Wiedniu jest wprawdzie małe, ale komunikacja miejska jest super.', {
          plAlts: [
            'Mieszkanie w Wiedniu jest co prawda małe, ale komunikacja miejska jest super.',
            'Mieszkanie w Wiedniu jest co prawda małe, ale komunikacja miejska jest świetna.',
            'Mieszkanie w Wiedniu jest wprawdzie małe, ale komunikacja jest super.',
          ],
          note: 'die Öffis — w Austrii potocznie: komunikacja miejska (od öffentliche Verkehrsmittel).',
          accent: 'de-AT',
        }),
      ],
      grammar: [
        {
          id: 'de.g.konnektoren-grund',
          title: 'Weil czy denn? Deshalb, deswegen, außerdem',
          body: [
            'Przyczynę podajemy na dwa sposoby. Po [[weil]] odmieniony czasownik idzie **na koniec**: [[Ich bleibe zu Hause, weil ich müde bin.]] Po [[denn]] szyk się **nie zmienia** — denn stoi przed zdaniem, na „pozycji zero”, jak und i aber: [[Ich bleibe zu Hause, denn ich bin müde.]]',
            'Zdanie z denn zawsze stoi **po** zdaniu głównym. Zdanie z weil może też stać na początku ([[Weil ich müde bin, bleibe ich zu Hause.]]) albo samo odpowiadać na pytanie: [[Warum bleibst du zu Hause? — Weil ich müde bin.]]',
            'Skutek wprowadzają [[deshalb]] i [[deswegen]] (dlatego; deswegen częściej w mowie). To przysłówki: zajmują 1. miejsce, więc odmieniony czasownik stoi **zaraz po nich**, a podmiot dopiero za nim: [[Ich bin müde, deshalb bleibe ich zu Hause.]] Tak samo działają [[außerdem]] (poza tym) i para [[einerseits … andererseits]]: [[Einerseits ist es ruhig, andererseits ist es langweilig.]]',
          ],
          table: {
            head: ['Słowo', 'Szyk', 'Przykład'],
            rows: [
              ['weil', 'czasownik na końcu', '…, weil ich müde bin.'],
              ['denn', 'szyk bez zmian', '…, denn ich bin müde.'],
              ['deshalb / deswegen', 'czasownik zaraz po nim', '…, deshalb bleibe ich zu Hause.'],
              ['außerdem', 'czasownik zaraz po nim', 'Außerdem ist die Miete teuer.'],
            ],
          },
          contrast:
            'Po polsku „bo”, „ponieważ” i „dlatego” nie zmieniają szyku zdania. Po niemiecku każde z tych słów ma własną regułę: weil wysyła czasownik na koniec, denn niczego nie rusza, a deshalb zajmuje 1. miejsce, więc czasownik stoi zaraz po nim: deshalb bleibe ich — nie „deshalb ich bleibe”.',
        },
        {
          id: 'de.g.obwohl-trotzdem',
          title: 'Obwohl czy trotzdem?',
          body: [
            'Oba słowa wyrażają **kontrast**: coś dzieje się mimo przeszkody. [[obwohl]] (chociaż, mimo że) to spójnik — odmieniony czasownik idzie **na koniec**: [[Obwohl es kalt ist, gehen wir schwimmen.]] Zdanie z obwohl na początku zajmuje 1. miejsce, więc dalej od razu czasownik: [[…, gehen wir schwimmen.]]',
            '[[trotzdem]] (mimo to) to przysłówek w zdaniu głównym. Stoi na 1. miejscu (czasownik zaraz po nim) albo w środku zdania: [[Es ist kalt. Trotzdem gehen wir schwimmen.]] [[Es ist kalt, aber wir gehen trotzdem schwimmen.]]',
            'Zapamiętaj: obwohl wprowadza **przeszkodę** (chociaż jest zimno), a trotzdem — **to, co i tak się dzieje** (mimo to idziemy). Nie myl ich z przyimkiem [[trotz]] + dopełniacz: [[trotz des Regens]]. Gdy najpierw coś przyznajesz, przyda się para [[zwar … aber]]: [[Die Wohnung ist zwar klein, aber gemütlich.]]',
          ],
          table: {
            head: ['', 'Przeszkoda', 'Co i tak się dzieje'],
            rows: [
              ['obwohl', 'Obwohl es regnet,', 'gehen wir spazieren.'],
              ['trotzdem', 'Es regnet.', 'Trotzdem gehen wir spazieren.'],
              ['trotz', 'Trotz des Regens', 'gehen wir spazieren.'],
              ['zwar … aber', 'Es regnet zwar,', 'aber wir gehen spazieren.'],
            ],
          },
          contrast:
            'Po polsku „chociaż” i „mimo to” nie wpływają na szyk. Po niemiecku obwohl wysyła czasownik na koniec swojego zdania, a trotzdem — jak deshalb — ściąga czasownik zaraz za siebie. Uwaga na pułapkę: trotzdem to „mimo to”, a nie „mimo że” — „mimo że” to obwohl.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'de.x.31-1',
          concept: 'de.g.konnektoren-grund',
          sentence: 'Wir fahren nicht in den Urlaub, ___ wir haben kein Geld.',
          pl: 'Nie jedziemy na urlop, bo nie mamy pieniędzy.',
          options: ['weil', 'denn', 'deshalb'],
          answer: 'denn',
          explanation: 'Po luce szyk się nie zmienia (wir haben…), więc pasuje denn. Z weil byłoby: weil wir kein Geld haben.',
        },
        {
          type: 'gap',
          id: 'de.x.31-2',
          concept: 'de.g.konnektoren-grund',
          sentence: 'Ich bin krank, ___ bleibe ich heute im Bett.',
          pl: 'Jestem chory / chora, dlatego zostaję dziś w łóżku.',
          options: ['weil', 'denn', 'deshalb'],
          answer: 'deshalb',
          explanation: 'Zaraz po luce stoi czasownik (bleibe ich), więc potrzebny jest przysłówek deshalb (dlatego) — wprowadza skutek.',
        },
        {
          type: 'choice',
          id: 'de.x.31-3',
          concept: 'de.g.konnektoren-grund',
          prompt: 'Które zdanie jest poprawne?',
          options: [
            'Das Wetter ist schön, deswegen wir gehen schwimmen.',
            'Das Wetter ist schön, deswegen gehen wir schwimmen.',
            'Das Wetter ist schön, deswegen wir schwimmen gehen.',
          ],
          answer: 1,
          explanation: 'Deswegen zajmuje 1. miejsce, więc odmieniony czasownik (gehen) stoi zaraz po nim, a podmiot (wir) — za czasownikiem.',
        },
        {
          type: 'gap',
          id: 'de.x.31-4',
          concept: 'de.g.obwohl-trotzdem',
          sentence: '___ es regnet, gehen wir spazieren.',
          pl: 'Chociaż pada, idziemy na spacer.',
          options: ['Obwohl', 'Trotzdem', 'Deshalb'],
          answer: 'Obwohl',
          explanation: 'Czasownik regnet stoi na końcu, a potem zaczyna się zdanie główne (gehen wir) — to szyk po spójniku obwohl (chociaż).',
        },
        {
          type: 'gap',
          id: 'de.x.31-5',
          concept: 'de.g.obwohl-trotzdem',
          sentence: 'Ich bin müde. ___ gehe ich heute ins Kino.',
          pl: 'Jestem zmęczony / zmęczona. Mimo to idę dziś do kina.',
          options: ['Obwohl', 'Trotzdem', 'Weil'],
          answer: 'Trotzdem',
          explanation: 'Zaraz po luce stoi czasownik (gehe ich), więc potrzebny jest przysłówek trotzdem (mimo to). Obwohl i weil wysłałyby czasownik na koniec.',
        },
        {
          type: 'choice',
          id: 'de.x.31-6',
          concept: 'de.g.obwohl-trotzdem',
          prompt: 'Jak powiesz: „Chociaż mieszkanie jest drogie, kupujemy je”?',
          options: [
            'Obwohl die Wohnung teuer ist, kaufen wir sie.',
            'Obwohl die Wohnung ist teuer, kaufen wir sie.',
            'Trotzdem die Wohnung teuer ist, kaufen wir sie.',
          ],
          answer: 0,
          explanation: 'Po obwohl czasownik idzie na koniec (teuer ist), a zdanie główne zaczyna się od czasownika (kaufen wir). Trotzdem nie jest spójnikiem i nie wprowadza takiego zdania.',
        },
        {
          type: 'gap',
          id: 'de.x.31-7',
          concept: 'de.g.obwohl-trotzdem',
          sentence: 'Das Zimmer ist ___ klein, aber sehr hell.',
          pl: 'Pokój jest wprawdzie mały, ale bardzo jasny.',
          options: ['zwar', 'trotzdem', 'obwohl'],
          answer: 'zwar',
          explanation: 'Para zwar … aber: najpierw przyznajemy coś (wprawdzie mały), potem dodajemy kontrast (ale jasny).',
        },
      ],
      dialogue: {
        id: 'de.d.31',
        title: 'Miasto czy wieś?',
        context: 'Nina i Paweł mieszkają w małym mieszkaniu w centrum Hamburga. Nina znalazła ogłoszenie i chce porozmawiać o przeprowadzce.',
        speakers: {
          N: { name: 'Nina', voice: 'a', accent: 'de-DE' },
          P: { name: 'Paweł', voice: 'b', accent: 'de-DE' },
        },
        lines: [
          { speaker: 'N', text: 'Paweł, schau mal! Hier ist ein Haus auf dem Land, mit Garten.', pl: 'Paweł, zobacz! Tu jest dom na wsi, z ogrodem.' },
          { speaker: 'P', text: 'Auf dem Land? Aber wir arbeiten doch in der Stadt!', pl: 'Na wsi? Ale przecież pracujemy w mieście!' },
          {
            speaker: 'N',
            text: 'Ich weiß. Aber hier ist es so laut, und außerdem ist die Miete sehr teuer.',
            pl: 'Wiem. Ale tu jest tak głośno, a poza tym czynsz jest bardzo drogi.',
          },
          {
            speaker: 'P',
            text: 'Das stimmt. Trotzdem möchte ich nicht jeden Tag so lange mit dem Bus fahren.',
            pl: 'To prawda. Mimo to nie chciałbym codziennie tak długo jeździć autobusem.',
          },
          {
            speaker: 'N',
            text: 'Einerseits hast du recht. Andererseits hätten wir dort einen großen Garten!',
            pl: 'Z jednej strony masz rację. Z drugiej strony mielibyśmy tam duży ogród!',
          },
          {
            speaker: 'P',
            text: 'Obwohl ich gern im Garten arbeite, finde ich das Land ein bisschen langweilig.',
            pl: 'Chociaż lubię pracować w ogrodzie, wieś wydaje mi się trochę nudna.',
          },
          { speaker: 'N', text: 'Langweilig? Dort ist es ruhig, und die Natur ist so schön!', pl: 'Nudna? Tam jest spokojnie, a przyroda jest taka piękna!' },
          {
            speaker: 'P',
            text: 'Also gut, am Samstag fahren wir aufs Land. Vielleicht gefällt es mir ja doch.',
            pl: 'No dobrze, w sobotę jedziemy na wieś. Może jednak mi się spodoba.',
          },
        ],
        questions: [
          {
            id: 'de.d.31-q1',
            prompt: 'Co Nina pokazuje Pawłowi?',
            options: ['Mieszkanie w centrum', 'Dom z ogrodem na wsi', 'Ogłoszenie o pracy'],
            answer: 1,
            explanation: '„Hier ist ein Haus auf dem Land, mit Garten.”',
          },
          {
            id: 'de.d.31-q2',
            prompt: 'Jakie wady mieszkania w mieście wymienia Nina?',
            options: ['Hałas i drogi czynsz', 'Brak autobusów', 'Nudę i brak przyrody'],
            answer: 0,
            explanation: '„Hier ist es so laut, und außerdem ist die Miete sehr teuer.”',
          },
          {
            id: 'de.d.31-q3',
            prompt: 'Co nie podoba się Pawłowi w życiu na wsi?',
            options: ['Praca w ogrodzie', 'Długie dojazdy autobusem i nuda', 'Wysoki czynsz'],
            answer: 1,
            explanation: '„Trotzdem möchte ich nicht jeden Tag so lange mit dem Bus fahren.” i „…finde ich das Land ein bisschen langweilig.” Ogród akurat lubi.',
          },
        ],
      },
      summary: [
        'Weil → czasownik na końcu, denn → szyk bez zmian: …, weil ich müde bin / …, denn ich bin müde.',
        'Deshalb, deswegen, außerdem, trotzdem na 1. miejscu → czasownik zaraz po nich: Deshalb bleibe ich zu Hause.',
        'Obwohl (chociaż) → czasownik na końcu: Obwohl es kalt ist, gehen wir schwimmen.',
        'Pary: zwar … aber (wprawdzie…, ale), einerseits … andererseits (z jednej strony…, z drugiej strony…).',
      ],
      followUp:
        'Wybierz temat — miasto czy wieś, samochód czy autobus — i podaj na głos dwa argumenty za (weil, außerdem) i jeden przeciw (obwohl albo trotzdem). Za około 10 minut zrób krótką powtórkę.',
    },
  ],
};
