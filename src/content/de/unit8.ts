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
          alts: ['um Deutsch zu lernen'],
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
        word('deswegen', 'deswegen', 'dlatego (częściej w mowie)', {
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
          note: 'Dodaje kolejny argument; czasownik zaraz po nim: Außerdem ist die Miete hoch.',
        }),
        phrase('einerseits-andererseits', 'einerseits … andererseits', 'z jednej strony…, z drugiej strony…', {
          tts: 'einerseits, andererseits',
          note: 'Oba słowa zajmują 1. miejsce, więc czasownik stoi zaraz po nich: Einerseits ist es ruhig, andererseits ist es langweilig.',
        }),
        phrase('zwar-aber', 'zwar … aber', 'wprawdzie…, ale', {
          tts: 'zwar klein, aber gemütlich',
          plAlts: ['co prawda…, ale'],
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
        s('31-6', 'In der Stadt ist es laut. Außerdem ist die Miete sehr hoch.', 'W mieście jest głośno. Poza tym czynsz jest bardzo wysoki.', {
          plAlts: [
            'W mieście jest głośno. Oprócz tego czynsz jest bardzo wysoki.',
            'W mieście jest głośno, a poza tym czynsz jest bardzo wysoki.',
            'W mieście jest głośno. Poza tym czynsz jest bardzo drogi.',
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
              ['außerdem', 'czasownik zaraz po nim', 'Außerdem ist die Miete hoch.'],
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
            text: 'Ich weiß. Aber hier ist es so laut, und außerdem ist die Miete sehr hoch.',
            pl: 'Wiem. Ale tu jest tak głośno, a poza tym czynsz jest bardzo wysoki.',
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
    {
      id: 'de.l32',
      title: 'Jak to się robi?',
      subtitle: 'Wie wird das gemacht?',
      objective: 'Opiszesz, jak coś się robi i kiedy powstało — stroną bierną (Das Brot wird gebacken, Die Universität wurde 1365 gegründet, Das Handy muss repariert werden) albo krócej z man.',
      level: 'B1',
      minutes: 13,
      items: [
        verb('bauen', 'bauen', 'budować; zbudować', {
          plAlts: ['budować', 'zbudować', 'wybudować'],
          note: 'Das Haus wird gebaut. — Dom jest budowany. Das Haus wurde 1900 gebaut. — Dom zbudowano w 1900 roku.',
        }),
        verb('gruenden', 'gründen', 'zakładać; założyć', {
          plAlts: ['założyć', 'zakładać'],
          note: 'Firmę, miasto, uniwersytet: Die Firma wurde 1990 gegründet. — Firmę założono w 1990 roku.',
        }),
        verb('reparieren', 'reparieren', 'naprawiać; naprawić', {
          plAlts: ['naprawić', 'naprawiać', 'reperować'],
          note: 'Imiesłów bez ge- (jak wszystkie czasowniki na -ieren): repariert. Das muss repariert werden. — To trzeba naprawić.',
        }),
        verb('herstellen', 'herstellen', 'produkować; wytwarzać', {
          plAlts: ['wytwarzać', 'produkować', 'wyprodukować'],
          note: 'Rozdzielny: Die Firma stellt Schuhe her. Strona bierna: Hier werden Schuhe hergestellt. Synonim: produzieren.',
        }),
        verb('erfinden', 'erfinden', 'wynaleźć; wymyślić', {
          plAlts: ['wynaleźć', 'wynajdywać', 'wymyślić'],
          note: 'Nieregularny, Perfekt: hat erfunden. Das Telefon wurde im 19. Jahrhundert erfunden. — Telefon wynaleziono w XIX wieku.',
        }),
        verb('verkaufen', 'verkaufen', 'sprzedawać; sprzedać', {
          plAlts: ['sprzedać', 'sprzedawać'],
          note: 'Przeciwieństwo: kaufen (kupować). Das Haus wurde verkauft. — Dom został sprzedany.',
        }),
        verb('backen', 'backen', 'piec; upiec', {
          plAlts: ['upiec', 'piec'],
          note: 'Odmiana: du bäckst, er bäckt (coraz częściej: backst, backt); Perfekt: hat gebacken. Das Brot wird frisch gebacken.',
        }),
        verb('uebersetzen', 'übersetzen', 'tłumaczyć; przetłumaczyć', {
          plAlts: ['przetłumaczyć', 'tłumaczyć'],
          note: 'Nierozdzielny, akcent na -setz-: Ich übersetze, ich habe übersetzt. Ins Polnische übersetzen — przetłumaczyć na polski.',
        }),
        noun('die-fabrik', 'die Fabrik', 'fabryka', 'f', {
          plural: 'die Fabriken',
          note: 'Akcent na ostatnią sylabę: fa-BRIK. In der Fabrik arbeiten — pracować w fabryce.',
        }),
        noun('die-firma', 'die Firma', 'firma', 'f', {
          plural: 'die Firmen',
          plAlts: ['przedsiębiorstwo'],
          note: 'Liczba mnoga: die Firmen. Bei einer Firma arbeiten — pracować w firmie.',
        }),
        noun('das-jahrhundert', 'das Jahrhundert', 'wiek; stulecie', 'n', {
          plural: 'die Jahrhunderte',
          plAlts: ['wiek', 'stulecie'],
          note: 'im 19. Jahrhundert (czytaj: im neunzehnten Jahrhundert) — w XIX wieku. Niemcy zapisują wiek cyfrą arabską z kropką.',
        }),
        noun('die-kirche', 'die Kirche', 'kościół', 'f', {
          plural: 'die Kirchen',
          note: 'Uwaga na rodzaj: kościół jest męski, a die Kirche — żeńska. In die Kirche gehen — iść do kościoła.',
        }),
        noun('die-bruecke', 'die Brücke', 'most', 'f', {
          plural: 'die Brücken',
          note: 'Też żeńska, choć „most” jest męski: über die Brücke gehen — przejść przez most.',
        }),
        noun('das-gebaeude', 'das Gebäude', 'budynek', 'n', {
          plural: 'die Gebäude',
          note: 'Liczba mnoga bez zmian: die Gebäude. Ein altes Gebäude — stary budynek.',
        }),
      ],
      sentences: [
        s('32-1', 'Das Brot wird hier jeden Morgen frisch gebacken.', 'Chleb jest tu codziennie rano pieczony na świeżo.', {
          alts: ['Hier wird das Brot jeden Morgen frisch gebacken.', 'Das Brot wird jeden Morgen hier frisch gebacken.'],
          plAlts: [
            'Chleb jest tu pieczony codziennie rano.',
            'Chleb jest tu pieczony każdego ranka.',
            'Chleb piecze się tu codziennie rano na świeżo.',
            'Tutaj chleb jest codziennie rano pieczony na świeżo.',
            'Chleb jest tu codziennie rano świeżo pieczony.',
          ],
        }),
        s('32-2', 'In dieser Fabrik werden Autos hergestellt.', 'W tej fabryce produkuje się samochody.', {
          alts: ['In dieser Fabrik stellt man Autos her.'],
          plAlts: ['W tej fabryce produkowane są samochody.', 'W tej fabryce są produkowane samochody.', 'W tej fabryce produkuje się auta.', 'Ta fabryka produkuje samochody.'],
        }),
        s('32-3', 'Die Universität Wien wurde 1365 gegründet.', 'Uniwersytet Wiedeński został założony w 1365 roku.', {
          tts: 'Die Universität Wien wurde dreizehnhundertfünfundsechzig gegründet.',
          alts: ['Die Uni Wien wurde 1365 gegründet.'],
          plAlts: [
            'Uniwersytet Wiedeński założono w 1365 roku.',
            'Uniwersytet Wiedeński powstał w 1365 roku.',
            'Uniwersytet w Wiedniu założono w 1365 roku.',
            'Uniwersytet w Wiedniu został założony w 1365 roku.',
          ],
          note: 'Przed rokiem nie ma przyimka: 1365 — w 1365 roku (albo: im Jahr 1365). Rok czytamy w setkach: dreizehnhundertfünfundsechzig.',
          accent: 'de-AT',
        }),
        s('32-4', 'Das Riesenrad im Prater wurde 1897 gebaut.', 'Diabelski młyn na Praterze zbudowano w 1897 roku.', {
          tts: 'Das Riesenrad im Prater wurde achtzehnhundertsiebenundneunzig gebaut.',
          plAlts: [
            'Diabelski młyn w Praterze zbudowano w 1897 roku.',
            'Diabelski młyn na Praterze został zbudowany w 1897 roku.',
            'Diabelski młyn w Praterze został zbudowany w 1897 roku.',
          ],
          note: 'Das Riesenrad — diabelski młyn w wiedeńskim parku Prater, jeden z symboli Wiednia.',
          accent: 'de-AT',
        }),
        s('32-5', 'Das alte Gebäude wurde an eine Firma verkauft.', 'Ten stary budynek sprzedano firmie.', {
          plAlts: ['Stary budynek sprzedano firmie.', 'Stary budynek został sprzedany firmie.', 'Ten stary budynek został sprzedany firmie.', 'Stary budynek sprzedano pewnej firmie.'],
          note: 'verkaufen an + biernik — sprzedać komuś: an eine Firma.',
        }),
        s('32-6', 'Mein Handy muss repariert werden.', 'Moją komórkę trzeba naprawić.', {
          alts: ['Man muss mein Handy reparieren.'],
          plAlts: ['Moja komórka musi zostać naprawiona.', 'Mój telefon trzeba naprawić.', 'Mój telefon musi zostać naprawiony.', 'Trzeba naprawić moją komórkę.'],
        }),
        s('32-7', 'Das Buch wurde ins Polnische übersetzt.', 'Ta książka została przetłumaczona na polski.', {
          plAlts: [
            'Książka została przetłumaczona na polski.',
            'Książkę przetłumaczono na polski.',
            'Tę książkę przetłumaczono na język polski.',
            'Ta książka została przetłumaczona na język polski.',
          ],
          note: 'ins Polnische, ins Deutsche — na (język) polski, na niemiecki.',
        }),
        s('32-8', 'Das Haus wurde von meinem Opa gebaut.', 'Ten dom zbudował mój dziadek.', {
          plAlts: ['Dom zbudował mój dziadek.', 'Ten dom wybudował mój dziadek.', 'Dom został zbudowany przez mojego dziadka.', 'Ten dom został zbudowany przez mojego dziadka.'],
          note: 'Wykonawca: von + celownik (von meinem Opa). Po polsku zwykle lepiej brzmi strona czynna: zbudował go mój dziadek.',
        }),
        s('32-9', 'Man hat die Brücke im Sommer repariert.', 'Most naprawiono latem.', {
          alts: ['Die Brücke wurde im Sommer repariert.', 'Im Sommer hat man die Brücke repariert.'],
          plAlts: ['Latem naprawiono most.', 'Most naprawiono w lecie.', 'Most został naprawiony latem.', 'W lecie naprawiono most.'],
        }),
      ],
      grammar: [
        {
          id: 'de.g.passiv',
          title: 'Strona bierna: wird gebaut, wurde gebaut',
          body: [
            'Stroną bierną (**Passiv**) mówimy o tym, **co się dzieje** z rzeczą, a nie kto to robi: [[Das Brot wird gebacken.]] (Chleb jest pieczony.) Tworzymy ją z **werden** i imiesłowu (Partizip II) na końcu zdania.',
            'W czasie teraźniejszym werden odmieniamy normalnie: [[Das Brot wird jeden Morgen gebacken.]] [[In dieser Fabrik werden Autos hergestellt.]] O przeszłości najczęściej mówimy formą **wurde / wurden** (Präteritum od werden): [[Die Universität Wien wurde 1365 gegründet.]] [[Die Häuser wurden im 19. Jahrhundert gebaut.]]',
            'Kto to zrobił? Wykonawcę dodajemy przez **von + celownik**: [[Das Haus wurde von meinem Opa gebaut.]] Najczęściej jednak wykonawca jest nieważny albo nieznany — i właśnie dlatego wybieramy stronę bierną: [[Die Kirche wurde im 14. Jahrhundert gebaut.]]',
          ],
          table: {
            head: ['Osoba', 'teraz: werden', 'przeszłość: wurde'],
            rows: [
              ['ich', 'werde gefragt', 'wurde gefragt'],
              ['du', 'wirst gefragt', 'wurdest gefragt'],
              ['er / sie / es', 'wird gebaut', 'wurde gebaut'],
              ['wir', 'werden gefragt', 'wurden gefragt'],
              ['ihr', 'werdet gefragt', 'wurdet gefragt'],
              ['sie / Sie', 'werden gebaut', 'wurden gebaut'],
            ],
          },
          contrast:
            'Po polsku stronę bierną tworzymy z „być” albo „zostać”: dom jest budowany, dom został zbudowany. Po niemiecku służy do tego werden — nie sein! Das Haus wird gebaut (jest budowany), das Haus wurde gebaut (został zbudowany). Polskie formy na -no i -to („zbudowano”, „założono”) też zwykle oddamy stroną bierną: Die Universität wurde 1365 gegründet.',
        },
        {
          id: 'de.g.passiv-modal-man',
          title: 'Muss repariert werden; man zamiast strony biernej',
          body: [
            'Z czasownikiem modalnym strona bierna kończy się na **imiesłów + werden**, a modalny stoi na 2. miejscu: [[Mein Handy muss repariert werden.]] (Moją komórkę trzeba naprawić.) [[Das kann nicht gemacht werden.]] (Tego nie da się zrobić.)',
            'W mowie zamiast strony biernej często wybieramy **man** z czasownikiem w stronie czynnej: [[Man hat die Brücke repariert.]] = [[Die Brücke wurde repariert.]] [[Hier spricht man Deutsch.]] = [[Hier wird Deutsch gesprochen.]]',
            'Nie myl trzech ról werden: [[Es wird kalt.]] (robi się zimno — werden jako „stawać się”), [[Ich werde arbeiten.]] (czas przyszły: werden + bezokolicznik), [[Die Brücke wird repariert.]] (strona bierna: werden + imiesłów).',
          ],
          table: {
            head: ['', 'Strona bierna', 'Z man'],
            rows: [
              ['teraz', 'Hier wird Brot gebacken.', 'Hier backt man Brot.'],
              ['przeszłość', 'Die Brücke wurde repariert.', 'Man hat die Brücke repariert.'],
              ['z modalnym', 'Das Handy muss repariert werden.', 'Man muss das Handy reparieren.'],
            ],
          },
          contrast:
            'Polskie „trzeba naprawić”, „da się zrobić”, „naprawiono” to dokładnie te sytuacje, w których Niemiec powie muss repariert werden, kann gemacht werden albo użyje man: Man hat die Brücke repariert. Szyk jest inny niż po polsku: modalny na 2. miejscu, a na samym końcu imiesłów + werden.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'de.x.32-1',
          concept: 'de.g.passiv',
          sentence: 'Das Brot ___ jeden Morgen gebacken.',
          pl: 'Chleb jest pieczony codziennie rano.',
          options: ['wird', 'ist', 'hat'],
          answer: 'wird',
          explanation: 'Strona bierna to werden + imiesłów. Po polsku „jest pieczony”, ale po niemiecku nie sein, tylko werden: das Brot wird gebacken.',
        },
        {
          type: 'gap',
          id: 'de.x.32-2',
          concept: 'de.g.passiv',
          sentence: 'Die Universität ___ 1365 gegründet.',
          pl: 'Uniwersytet założono w 1365 roku.',
          options: ['wird', 'wurde', 'werden'],
          answer: 'wurde',
          explanation: 'Rok 1365 to przeszłość, więc Präteritum od werden: wurde gegründet.',
        },
        {
          type: 'gap',
          id: 'de.x.32-3',
          concept: 'de.g.passiv',
          sentence: 'In dieser Fabrik ___ Autos hergestellt.',
          pl: 'W tej fabryce produkuje się samochody.',
          options: ['wird', 'werden', 'wurde'],
          answer: 'werden',
          explanation: 'Podmiotem są Autos (liczba mnoga), a mowa o teraźniejszości — więc werden.',
        },
        {
          type: 'choice',
          id: 'de.x.32-4',
          concept: 'de.g.passiv',
          prompt: 'Jak powiesz stroną bierną: „Ten dom zbudował mój dziadek”?',
          options: ['Das Haus wurde von meinem Opa gebaut.', 'Das Haus wurde mit meinem Opa gebaut.', 'Das Haus hat von meinem Opa gebaut.'],
          answer: 0,
          explanation: 'Wykonawcę podajemy przez von + celownik: von meinem Opa. Mit znaczy „razem z”, a strony biernej nie tworzymy z haben.',
        },
        {
          type: 'gap',
          id: 'de.x.32-5',
          concept: 'de.g.passiv-modal-man',
          sentence: 'Mein Handy muss repariert ___.',
          pl: 'Moją komórkę trzeba naprawić.',
          options: ['werden', 'wird', 'wurde'],
          answer: 'werden',
          explanation: 'Z czasownikiem modalnym na końcu stoi imiesłów + werden w bezokoliczniku: muss repariert werden.',
        },
        {
          type: 'choice',
          id: 'de.x.32-6',
          concept: 'de.g.passiv-modal-man',
          prompt: 'Które zdanie znaczy to samo co „Hier wird Deutsch gesprochen”?',
          options: ['Hier spricht man Deutsch.', 'Hier spricht Deutsch.', 'Hier wird man Deutsch.'],
          answer: 0,
          explanation: 'Man + czasownik w stronie czynnej to częsta alternatywa dla strony biernej: Hier spricht man Deutsch — tu mówi się po niemiecku.',
        },
        {
          type: 'choice',
          id: 'de.x.32-7',
          concept: 'de.g.passiv-modal-man',
          prompt: 'W którym zdaniu werden tworzy stronę bierną?',
          options: ['Es wird kalt.', 'Ich werde morgen arbeiten.', 'Die Brücke wird repariert.'],
          answer: 2,
          explanation: 'Werden + imiesłów (repariert) to strona bierna. Es wird kalt znaczy „robi się zimno”, a werde + bezokolicznik to czas przyszły.',
        },
      ],
      dialogue: {
        id: 'de.d.32',
        title: 'W starej piekarni',
        context: 'Kuba pisze artykuł do gazetki studenckiej o starej piekarni w Salzburgu. Rozmawia z właścicielką, panią Moser.',
        speakers: {
          K: { name: 'Kuba', voice: 'b', accent: 'de-AT' },
          M: { name: 'Frau Moser', voice: 'a', accent: 'de-AT' },
        },
        lines: [
          { speaker: 'K', text: 'Frau Moser, wann wurde Ihre Bäckerei gegründet?', pl: 'Pani Moser, kiedy założono pani piekarnię?' },
          { speaker: 'M', text: 'Sie wurde 1920 von meinem Opa gegründet.', pl: 'Założył ją mój dziadek w 1920 roku.' },
          { speaker: 'K', text: 'Und ist das Gebäude auch so alt?', pl: 'A budynek też jest taki stary?' },
          { speaker: 'M', text: 'Noch älter! Es wurde im 18. Jahrhundert gebaut.', pl: 'Jeszcze starszy! Zbudowano go w XVIII wieku.' },
          { speaker: 'K', text: 'Und wann wird das Brot gebacken?', pl: 'A kiedy piecze się chleb?' },
          { speaker: 'M', text: 'Jeden Morgen um drei Uhr. Auch die Semmeln werden hier gebacken.', pl: 'Codziennie o trzeciej rano. Bułki też pieczemy na miejscu.' },
          { speaker: 'K', text: 'Um drei Uhr? Dann müssen Sie sehr früh aufstehen!', pl: 'O trzeciej? To musi pani bardzo wcześnie wstawać!' },
          { speaker: 'M', text: 'Ja, das stimmt. Aber deshalb ist unser Brot so frisch!', pl: 'Tak, to prawda. Ale dlatego nasz chleb jest taki świeży!' },
          { speaker: 'K', text: 'Darf ich ein Foto von Ihnen machen?', pl: 'Czy mogę zrobić pani zdjęcie?' },
          { speaker: 'M', text: 'Gern! Aber zuerst nehmen Sie eine Semmel. Sie ist noch warm!', pl: 'Chętnie! Ale najpierw niech pan weźmie bułkę. Jest jeszcze ciepła!' },
        ],
        questions: [
          {
            id: 'de.d.32-q1',
            prompt: 'Kto założył piekarnię?',
            options: ['Pani Moser', 'Dziadek pani Moser', 'Jej sąsiad'],
            answer: 1,
            explanation: '„Sie wurde 1920 von meinem Opa gegründet.” — von + celownik wskazuje wykonawcę.',
          },
          {
            id: 'de.d.32-q2',
            prompt: 'Kiedy zbudowano budynek piekarni?',
            options: ['W 1920 roku', 'W XVIII wieku', 'W XIV wieku'],
            answer: 1,
            explanation: '„Es wurde im 18. Jahrhundert gebaut.” — w 1920 roku założono samą piekarnię.',
          },
          {
            id: 'de.d.32-q3',
            prompt: 'Co pani Moser proponuje Kubie na koniec?',
            options: ['Kawę', 'Ciepłą bułkę', 'Zdjęcie piekarni'],
            answer: 1,
            explanation: '„Nehmen Sie eine Semmel. Sie ist noch warm!” Semmel to austriackie słowo na bułkę (w Niemczech: das Brötchen).',
          },
        ],
      },
      summary: [
        'Strona bierna = werden + imiesłów na końcu: Das Brot wird gebacken. (Chleb jest pieczony.)',
        'Przeszłość: wurde / wurden + imiesłów: Die Universität wurde 1365 gegründet.',
        'Wykonawca: von + celownik — Das Haus wurde von meinem Opa gebaut.',
        'Z modalnym: Das Handy muss repariert werden. W mowie często man: Man hat die Brücke repariert.',
      ],
      followUp:
        'Pomyśl o swoim mieście: kiedy zbudowano najstarszy kościół albo założono uniwersytet? Powiedz to po niemiecku z wurde … gebaut / gegründet. Za około 10 minut zrób krótką powtórkę.',
    },
    {
      id: 'de.l33',
      title: 'Opowiadamy historię',
      subtitle: 'Es war einmal…',
      objective: 'Opowiesz historię w czasie Präteritum (ging, kam, sah, fand, sagte) i pokażesz, co wydarzyło się wcześniej — z Plusquamperfekt oraz spójnikami nachdem, als i bevor.',
      level: 'B1',
      minutes: 13,
      items: [
        phrase('es-war-einmal', 'Es war einmal…', 'Był sobie…; Dawno, dawno temu…', {
          plAlts: ['Był sobie', 'Dawno, dawno temu', 'Pewnego razu', 'Dawno temu'],
          note: 'Tradycyjny początek baśni: Es war einmal ein König… — Był sobie król…',
        }),
        verb('ich-ging', 'ich ging', 'szedłem / szłam; poszedłem / poszłam', {
          plAlts: ['szedłem', 'szłam', 'poszedłem', 'poszłam'],
          note: 'Präteritum od gehen: ich ging, du gingst, er ging, wir gingen. W opowiadaniu zamiast ich bin gegangen.',
        }),
        verb('ich-kam', 'ich kam', 'przyszedłem / przyszłam; przyjechałem / przyjechałam', {
          plAlts: ['przyszedłem', 'przyszłam', 'przyjechałem', 'przyjechałam'],
          note: 'Präteritum od kommen: ich kam, du kamst, er kam, wir kamen. Er kam spät nach Hause. — Wrócił późno do domu.',
        }),
        verb('ich-sah', 'ich sah', 'widziałem / widziałam; zobaczyłem / zobaczyłam', {
          plAlts: ['widziałem', 'widziałam', 'zobaczyłem', 'zobaczyłam'],
          note: 'Präteritum od sehen: ich sah, du sahst, er sah, wir sahen.',
        }),
        verb('ich-fand', 'ich fand', 'znalazłem / znalazłam', {
          plAlts: ['znalazłem', 'znalazłam', 'uznałem', 'uznałam', 'uważałem', 'uważałam'],
          note: 'Präteritum od finden: ich fand, er fand, wir fanden. Także „uważałem”, jak w ich finde: Ich fand den Film gut. — Film mi się podobał.',
        }),
        verb('ich-sagte', 'ich sagte', 'powiedziałem / powiedziałam', {
          plAlts: ['powiedziałem', 'powiedziałam', 'mówiłem', 'mówiłam'],
          note: 'Präteritum regularne: rdzeń + -te. Sagen → sagte, machen → machte, wohnen → wohnte.',
        }),
        verb('ich-wusste', 'ich wusste', 'wiedziałem / wiedziałam', {
          plAlts: ['wiedziałem', 'wiedziałam'],
          note: 'Präteritum od wissen (wiedzieć): ich wusste, du wusstest, er wusste. Das wusste ich nicht! — Nie wiedziałem / nie wiedziałam!',
        }),
        phrase('es-gab', 'es gab', 'był; była; było (istniał)', {
          plAlts: ['było', 'był', 'była', 'były', 'istniał', 'istniało'],
          note: 'Präteritum od es gibt (jest, istnieje) + biernik: Damals gab es kein Handy. — Wtedy nie było komórek.',
        }),
        word('nachdem', 'nachdem', 'po tym, jak', {
          pos: 'conj',
          plAlts: ['kiedy już', 'gdy już'],
          note: 'Czasownik na końcu, zwykle z Plusquamperfekt: Nachdem ich gegessen hatte, ging ich ins Kino. — Kiedy już zjadłem / zjadłam, poszedłem / poszłam do kina.',
        }),
        word('bevor', 'bevor', 'zanim', {
          pos: 'conj',
          plAlts: ['nim', 'przed tym, jak'],
          note: 'Czasownik na końcu: Bevor ich ins Bett gehe, lese ich. — Zanim pójdę spać, czytam.',
        }),
        word('ploetzlich', 'plötzlich', 'nagle', {
          pos: 'adv',
          plAlts: ['naraz', 'niespodziewanie', 'znienacka'],
          note: 'Ulubione słowo opowieści: Plötzlich sah ich… — Nagle zobaczyłem…',
        }),
        verb('erzaehlen', 'erzählen', 'opowiadać; opowiedzieć', {
          plAlts: ['opowiedzieć', 'opowiadać'],
          note: 'Komu? — celownik: Erzähl mir alles! — Opowiedz mi wszystko! O czym? — von + celownik: Er erzählt von seiner Kindheit.',
        }),
        noun('die-geschichte', 'die Geschichte', 'historia; opowieść', 'f', {
          plural: 'die Geschichten',
          plAlts: ['opowieść', 'historia', 'historyjka', 'dzieje'],
          note: 'Opowieść, ale też historia jako przedmiot: Geschichte studieren — studiować historię.',
        }),
        verb('passieren', 'passieren', 'zdarzyć się; stać się', {
          plAlts: ['wydarzyć się', 'stać się', 'dziać się', 'zdarzać się'],
          note: 'Perfekt z sein, imiesłów bez ge-: Was ist passiert? — Co się stało?',
        }),
      ],
      sentences: [
        s('33-1', 'Es war einmal ein Mädchen, das in einem kleinen Dorf wohnte.', 'Była sobie dziewczynka, która mieszkała w małej wiosce.', {
          plAlts: [
            'Była sobie dziewczynka, która mieszkała w małej wsi.',
            'Dawno, dawno temu była sobie dziewczynka, która mieszkała w małej wiosce.',
            'Dawno temu żyła dziewczynka, która mieszkała w małej wiosce.',
            'Była raz dziewczynka, która mieszkała w małej wiosce.',
          ],
          note: 'Das Mädchen jest nijakie, więc zaimek względny to das. Wohnte — Präteritum regularne (wohn- + -te).',
        }),
        s('33-2', 'Gestern ging ich nach der Arbeit in ein Café.', 'Wczoraj po pracy poszedłem do kawiarni.', {
          alts: ['Nach der Arbeit ging ich gestern in ein Café.', 'Gestern bin ich nach der Arbeit in ein Café gegangen.'],
          plAlts: [
            'Wczoraj po pracy poszłam do kawiarni.',
            'Po pracy poszedłem wczoraj do kawiarni.',
            'Po pracy poszłam wczoraj do kawiarni.',
            'Wczoraj po pracy poszedłem do jakiejś kawiarni.',
            'Wczoraj po pracy poszłam do jakiejś kawiarni.',
          ],
        }),
        s('33-3', 'Plötzlich sah ich meinen alten Lehrer.', 'Nagle zobaczyłem mojego dawnego nauczyciela.', {
          plAlts: [
            'Nagle zobaczyłam mojego dawnego nauczyciela.',
            'Nagle zobaczyłem swojego dawnego nauczyciela.',
            'Nagle zobaczyłam swojego dawnego nauczyciela.',
            'Nagle zobaczyłem mojego starego nauczyciela.',
            'Nagle zobaczyłam mojego starego nauczyciela.',
          ],
        }),
        s('33-4', 'Er kam an meinen Tisch und wir sprachen lange.', 'Podszedł do mojego stolika i długo rozmawialiśmy.', {
          plAlts: [
            'Podszedł do mojego stolika i rozmawialiśmy długo.',
            'Przyszedł do mojego stolika i długo rozmawialiśmy.',
            'Podszedł do mojego stolika i długo ze sobą rozmawialiśmy.',
          ],
          note: 'Kam — od kommen, sprachen — od sprechen. Nieregularne formy Präteritum trzeba zapamiętać.',
        }),
        s('33-5', 'Als ich ein Kind war, bin ich jeden Sommer zu meiner Oma gefahren.', 'Kiedy byłem dzieckiem, co lato jeździłem do babci.', {
          alts: ['Als ich ein Kind war, fuhr ich jeden Sommer zu meiner Oma.', 'Als ich klein war, bin ich jeden Sommer zu meiner Oma gefahren.'],
          plAlts: [
            'Kiedy byłam dzieckiem, co lato jeździłam do babci.',
            'Gdy byłem dzieckiem, każdego lata jeździłem do babci.',
            'Gdy byłam dzieckiem, każdego lata jeździłam do babci.',
            'Jako dziecko co lato jeździłem do babci.',
            'Jako dziecko co lato jeździłam do babci.',
          ],
          note: 'W Austrii i na południu Niemiec w rozmowie opowiada się raczej w Perfekcie (bin gefahren); Präteritum zostaje głównie dla war, hatte i czasowników modalnych.',
          accent: 'de-AT',
        }),
        s('33-6', 'Nachdem wir gegessen hatten, gingen wir ins Kino.', 'Po tym, jak zjedliśmy, poszliśmy do kina.', {
          alts: ['Wir gingen ins Kino, nachdem wir gegessen hatten.'],
          plAlts: ['Kiedy już zjedliśmy, poszliśmy do kina.', 'Gdy już zjedliśmy, poszliśmy do kina.', 'Po jedzeniu poszliśmy do kina.', 'Zjedliśmy, a potem poszliśmy do kina.'],
          note: 'Najpierw jedzenie — Plusquamperfekt (hatten gegessen), potem kino — Präteritum (gingen).',
        }),
        s('33-7', 'Bevor ich nach Graz kam, konnte ich kein Deutsch.', 'Zanim przyjechałem do Grazu, nie znałem niemieckiego.', {
          alts: ['Ich konnte kein Deutsch, bevor ich nach Graz kam.'],
          plAlts: [
            'Zanim przyjechałam do Grazu, nie znałam niemieckiego.',
            'Zanim przyjechałem do Grazu, nie mówiłem po niemiecku.',
            'Zanim przyjechałam do Grazu, nie mówiłam po niemiecku.',
            'Zanim przyjechałem do Grazu, w ogóle nie znałem niemieckiego.',
            'Zanim przyjechałam do Grazu, w ogóle nie znałam niemieckiego.',
          ],
          note: 'Kein Deutsch können — nie znać niemieckiego (ani trochę).',
        }),
        s('33-8', 'Dann fand ich den Schlüssel unter dem Sofa.', 'Potem znalazłem klucz pod kanapą.', {
          alts: ['Dann fand ich unter dem Sofa den Schlüssel.'],
          plAlts: ['Potem znalazłam klucz pod kanapą.', 'Wtedy znalazłem klucz pod kanapą.', 'Wtedy znalazłam klucz pod kanapą.', 'Potem znalazłem klucz pod sofą.', 'Potem znalazłam klucz pod sofą.'],
        }),
        s('33-9', 'Was ist passiert? Erzähl mir die ganze Geschichte!', 'Co się stało? Opowiedz mi całą historię!', {
          plAlts: ['Co się wydarzyło? Opowiedz mi całą historię!', 'Co się stało? Opowiedz mi całą tę historię!'],
        }),
      ],
      grammar: [
        {
          id: 'de.g.praeteritum-erzaehlen',
          title: 'Präteritum w opowiadaniu: sagte, ging, kam',
          body: [
            'W opowiadaniach, baśniach, książkach i artykułach o przeszłości używamy czasu **Präteritum**: [[Es war einmal ein Mädchen…]] [[Plötzlich sah ich meinen alten Lehrer.]] W rozmowie zwykle wystarcza Perfekt — ale sein, haben i czasowniki modalne (war, hatte, konnte, wollte) mają i tam najczęściej formę Präteritum.',
            'Czasowniki **regularne**: rdzeń + **-te**: sagen → [[sagte]], wohnen → [[wohnte]], machen → [[machte]], arbeiten → [[arbeitete]] (po -t wstawiamy -e-). Końcówki: ich sagte, du sagtest, er sagte, wir sagten, ihr sagtet, sie sagten.',
            'Czasowniki **nieregularne** zmieniają samogłoskę, a w 1. i 3. osobie liczby pojedynczej nie mają końcówki: gehen → [[ging]], kommen → [[kam]], sehen → [[sah]], finden → [[fand]], sprechen → [[sprach]], nehmen → [[nahm]]. Ucz się ich trójkami: gehen — ging — gegangen.',
          ],
          table: {
            head: ['Bezokolicznik', 'Präteritum (ich / er)', 'Perfekt'],
            rows: [
              ['sagen', 'sagte', 'hat gesagt'],
              ['wohnen', 'wohnte', 'hat gewohnt'],
              ['gehen', 'ging', 'ist gegangen'],
              ['kommen', 'kam', 'ist gekommen'],
              ['sehen', 'sah', 'hat gesehen'],
              ['finden', 'fand', 'hat gefunden'],
              ['wissen', 'wusste', 'hat gewusst'],
              ['es gibt', 'es gab', 'es hat gegeben'],
            ],
          },
          contrast:
            'Po polsku mamy jeden czas przeszły, za to z aspektem: szedłem (niedokonany) i poszedłem (dokonany). Niemiecki aspektu nie ma — ich ging znaczy i „szedłem”, i „poszedłem”. Wybór między Präteritum a Perfektem zależy od stylu (opowieść czy rozmowa), a nie od tego, czy czynność się skończyła.',
        },
        {
          id: 'de.g.plusquamperfekt',
          title: 'Plusquamperfekt z nachdem; als, wenn, bevor',
          body: [
            '**Plusquamperfekt** opisuje to, co wydarzyło się **wcześniej niż** inne zdarzenie w przeszłości. Tworzymy go jak Perfekt, tylko z **hatte / war**: [[Wir hatten gegessen.]] [[Er war schon gegangen.]] (Już wyszedł — zanim przyszedłem.)',
            'Najczęściej łączy się ze spójnikiem [[nachdem]] (po tym, jak): [[Nachdem wir gegessen hatten, gingen wir ins Kino.]] Najpierw jedzenie (Plusquamperfekt), potem kino (Präteritum). Po [[bevor]] (zanim) wystarcza zwykły czas przeszły: [[Bevor ich nach Graz kam, konnte ich kein Deutsch.]]',
            '„Kiedy” w przeszłości: dla **jednego** zdarzenia albo okresu — [[als]]: [[Als ich ein Kind war, …]] [[Als er kam, war ich schon weg.]] Dla zdarzeń **powtarzanych** — [[wenn]]: [[Wenn es regnete, blieben wir zu Hause.]] (Za każdym razem, gdy padało…) Po nachdem, als, wenn i bevor czasownik stoi na końcu.',
          ],
          table: {
            head: ['Spójnik', 'Znaczenie', 'Przykład'],
            rows: [
              ['nachdem', 'po tym, jak', 'Nachdem er angerufen hatte, kam er zu uns.'],
              ['als', 'kiedy (raz, jeden okres)', 'Als ich nach Hause kam, schlief mein Bruder schon.'],
              ['wenn', 'kiedy (za każdym razem)', 'Wenn es regnete, blieben wir zu Hause.'],
              ['bevor', 'zanim', 'Bevor ich ging, sagte ich Tschüss.'],
            ],
          },
          contrast:
            'Polski nie ma osobnego czasu zaprzeszłego — kolejność wydarzeń pokazujemy słowami „już”, „wcześniej”, „po tym, jak”. W starannej niemieckiej opowieści to, co było wcześniej, stawiamy w Plusquamperfekt: Nachdem wir gegessen hatten (wcześniej), gingen wir ins Kino (później). Uwaga też na „kiedy”: o jednym zdarzeniu w przeszłości — als, o powtarzanym — wenn.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'de.x.33-1',
          concept: 'de.g.praeteritum-erzaehlen',
          sentence: 'Gestern ___ ich einen alten Freund in der Stadt.',
          pl: 'Wczoraj zobaczyłem / zobaczyłam w mieście starego przyjaciela.',
          options: ['sah', 'sehe', 'gesehen'],
          answer: 'sah',
          explanation: 'Opowieść o przeszłości (gestern) w Präteritum: sehen → sah. Gesehen to imiesłów — potrzebowałby habe.',
        },
        {
          type: 'gap',
          id: 'de.x.33-2',
          concept: 'de.g.praeteritum-erzaehlen',
          sentence: 'Er ___ zu mir und sagte Hallo.',
          pl: 'Podszedł do mnie i powiedział „cześć”.',
          options: ['kommte', 'kam', 'kommt'],
          answer: 'kam',
          explanation: 'Kommen jest nieregularny: Präteritum to kam, bez -te. Formy „kommte” nie ma.',
        },
        {
          type: 'gap',
          id: 'de.x.33-3',
          concept: 'de.g.praeteritum-erzaehlen',
          sentence: 'Als Kind ___ ich in einem kleinen Dorf.',
          pl: 'Jako dziecko mieszkałem / mieszkałam w małej wiosce.',
          options: ['wohnte', 'wohnt', 'wohnten'],
          answer: 'wohnte',
          explanation: 'Czasownik regularny: wohn- + -te. Przy ich nie ma dodatkowej końcówki: ich wohnte (wohnten to forma dla wir i sie).',
        },
        {
          type: 'choice',
          id: 'de.x.33-4',
          concept: 'de.g.praeteritum-erzaehlen',
          prompt: 'Jak powiesz w opowiadaniu: „Ona poszła do domu”?',
          options: ['Sie ging nach Hause.', 'Sie gehte nach Hause.', 'Sie gang nach Hause.'],
          answer: 0,
          explanation: 'Gehen jest nieregularny: gehen — ging — gegangen. Form „gehte” i „gang” nie ma.',
        },
        {
          type: 'gap',
          id: 'de.x.33-5',
          concept: 'de.g.plusquamperfekt',
          sentence: 'Nachdem er angerufen ___, kam er zu uns.',
          pl: 'Kiedy już zadzwonił, przyszedł do nas.',
          options: ['hat', 'hatte', 'war'],
          answer: 'hatte',
          explanation: 'Po nachdem — Plusquamperfekt: hatte / war + imiesłów. Anrufen tworzy czasy przeszłe z haben, więc er hatte angerufen.',
        },
        {
          type: 'gap',
          id: 'de.x.33-6',
          concept: 'de.g.plusquamperfekt',
          sentence: 'Als ich nach Hause kam, ___ mein Bruder schon gegangen.',
          pl: 'Kiedy wróciłem / wróciłam do domu, mojego brata już nie było.',
          options: ['hatte', 'war', 'ist'],
          answer: 'war',
          explanation: 'Gehen tworzy czasy przeszłe z sein, więc Plusquamperfekt to war gegangen — brat wyszedł wcześniej, niż ja wróciłem.',
        },
        {
          type: 'choice',
          id: 'de.x.33-7',
          concept: 'de.g.plusquamperfekt',
          prompt: 'Jak powiesz: „Kiedy byłem dzieckiem, mieszkałem w Krakowie”?',
          options: ['Als ich ein Kind war, wohnte ich in Krakau.', 'Wenn ich ein Kind war, wohnte ich in Krakau.', 'Wann ich ein Kind war, wohnte ich in Krakau.'],
          answer: 0,
          explanation: 'Jeden okres w przeszłości → als. Wenn w przeszłości znaczy „za każdym razem, gdy”, a wann to tylko pytanie: kiedy?',
        },
      ],
      dialogue: {
        id: 'de.d.33',
        title: 'Opowieść dziadka',
        context: 'Wieczór w Innsbrucku. Mała Lena prosi dziadka, żeby opowiedział jej jakąś historię.',
        speakers: {
          L: { name: 'Lena', voice: 'a', accent: 'de-AT' },
          O: { name: 'Opa', voice: 'b', accent: 'de-AT' },
        },
        lines: [
          { speaker: 'L', text: 'Opa, erzähl mir eine Geschichte!', pl: 'Dziadku, opowiedz mi jakąś historię!' },
          {
            speaker: 'O',
            text: 'Gut. Es war einmal ein kleiner Bub, der in einem Dorf in Tirol wohnte.',
            pl: 'Dobrze. Był sobie mały chłopiec, który mieszkał w pewnej wiosce w Tyrolu.',
          },
          { speaker: 'L', text: 'Warst du das, Opa?', pl: 'Czy to byłeś ty, dziadku?' },
          {
            speaker: 'O',
            text: 'Vielleicht! Im Winter, als es viel geschneit hatte, ging der Bub zu seiner Oma.',
            pl: 'Może! Zimą, kiedy spadło dużo śniegu, chłopiec poszedł do babci.',
          },
          { speaker: 'O', text: 'Plötzlich sah er im Schnee einen kleinen Hund.', pl: 'Nagle zobaczył w śniegu małego psa.' },
          { speaker: 'L', text: 'Oh nein! Was ist passiert?', pl: 'O nie! Co się stało?' },
          {
            speaker: 'O',
            text: 'Der Hund war krank und müde, deshalb nahm der Bub ihn mit nach Hause.',
            pl: 'Pies był chory i zmęczony, więc chłopiec zabrał go do domu.',
          },
          { speaker: 'L', text: 'Und dann?', pl: 'I co dalej?' },
          {
            speaker: 'O',
            text: 'Nachdem er warme Milch getrunken hatte, ging es ihm besser. Und dann blieb er zwölf Jahre bei uns!',
            pl: 'Kiedy już napił się ciepłego mleka, poczuł się lepiej. A potem został u nas dwanaście lat!',
          },
          { speaker: 'L', text: 'Bei uns? Dann warst du der Bub, Opa!', pl: 'U nas? To ty byłeś tym chłopcem, dziadku!' },
        ],
        questions: [
          {
            id: 'de.d.33-q1',
            prompt: 'Gdzie mieszkał chłopiec z opowieści?',
            options: ['W Wiedniu', 'W wiosce w Tyrolu', 'W Monachium'],
            answer: 1,
            explanation: '„…ein kleiner Bub, der in einem Dorf in Tirol wohnte.” Bub to austriackie (i bawarskie) słowo na chłopca — w Niemczech: der Junge.',
          },
          {
            id: 'de.d.33-q2',
            prompt: 'Co chłopiec zobaczył w śniegu?',
            options: ['Małego psa', 'Kota', 'Klucz'],
            answer: 0,
            explanation: '„Plötzlich sah er im Schnee einen kleinen Hund.”',
          },
          {
            id: 'de.d.33-q3',
            prompt: 'Czego Lena domyśla się na końcu?',
            options: ['Że pies był chory', 'Że chłopcem z opowieści był dziadek', 'Że babcia nie lubiła psów'],
            answer: 1,
            explanation: 'Dziadek mówi: „…blieb er zwölf Jahre bei uns!” — „bei uns” go zdradza. Lena: „Dann warst du der Bub, Opa!”',
          },
        ],
      },
      summary: [
        'Opowieść i tekst pisany: Präteritum. Regularne: sagen → sagte, wohnen → wohnte (ich i er bez końcówki).',
        'Nieregularne: ging, kam, sah, fand, nahm, sprach; wissen → wusste; es gibt → es gab.',
        'Plusquamperfekt = hatte / war + imiesłów: Nachdem wir gegessen hatten, gingen wir ins Kino.',
        '„Kiedy” w przeszłości: als (raz), wenn (za każdym razem); bevor = zanim. Po nich czasownik na końcu.',
      ],
      followUp:
        'Opowiedz na głos krótką historię z dzieciństwa w pięciu zdaniach — zacznij od „Als ich ein Kind war, …” i użyj przynajmniej raz nachdem. Za około 10 minut zrób krótką powtórkę.',
    },
    {
      id: 'de.l34',
      title: 'Co by było, gdyby…?',
      subtitle: 'Wenn ich mehr Zeit hätte…',
      objective: 'Powiesz, co by było, gdyby… (Wenn ich mehr Zeit hätte, würde ich reisen), wyrazisz życzenie z Ich wünschte… i zapytasz uprzejmie pośrednio: Weißt du, ob…? Können Sie mir sagen, wo…?',
      level: 'B1',
      minutes: 13,
      items: [
        phrase('wenn-ich-du-waere', 'Wenn ich du wäre, …', 'gdybym był tobą…; na twoim miejscu…', {
          tts: 'Wenn ich du wäre',
          plAlts: ['gdybym był tobą', 'gdybym była tobą', 'na twoim miejscu'],
          note: 'Rada, podobnie jak an deiner Stelle: Wenn ich du wäre, würde ich zum Arzt gehen. — Na twoim miejscu poszedłbym / poszłabym do lekarza.',
        }),
        phrase('was-waere-wenn', 'Was wäre, wenn…?', 'co by było, gdyby…?', {
          tts: 'Was wäre, wenn',
          note: 'Fantazja o innej rzeczywistości: Was wäre, wenn wir in Wien wohnen würden? — Co by było, gdybyśmy mieszkali w Wiedniu?',
        }),
        phrase('ich-wuenschte', 'ich wünschte, …', 'szkoda, że nie…; chciałbym, żeby…', {
          tts: 'Ich wünschte, ich hätte mehr Zeit.',
          plAlts: ['szkoda, że nie', 'chciałbym, żeby', 'chciałabym, żeby'],
          note: 'Życzenie, które się nie spełnia, + Konjunktiv II: Ich wünschte, ich hätte mehr Zeit. — Szkoda, że nie mam więcej czasu.',
        }),
        word('ob', 'ob', 'czy (w pytaniu pośrednim)', {
          pos: 'conj',
          plAlts: ['czy'],
          note: 'Pytanie tak / nie ukryte w zdaniu, czasownik na końcu: Weißt du, ob er kommt? — Wiesz, czy on przyjdzie? Nie myl z wenn (jeśli).',
        }),
        verb('wissen', 'wissen', 'wiedzieć', {
          note: 'Nieregularny: ich weiß, du weißt, er weiß, wir wissen. Wissen — fakty i informacje, kennen — osoby i miejsca: Ich weiß, wo er wohnt, aber ich kenne ihn nicht.',
        }),
        verb('fragen', 'fragen', 'pytać; zapytać', {
          plAlts: ['zapytać', 'pytać', 'spytać'],
          note: 'O coś: nach + celownik — Er fragt nach dem Weg. — Pyta o drogę. Ich frage mich, ob… — Zastanawiam się, czy…',
        }),
        phrase('koennen-sie-mir-sagen', 'Können Sie mir sagen, …?', 'czy może mi pan / pani powiedzieć…?', {
          tts: 'Können Sie mir sagen, wo der Bahnhof ist?',
          plAlts: ['może mi pan powiedzieć', 'może mi pani powiedzieć', 'czy może mi pan powiedzieć', 'czy może mi pani powiedzieć'],
          note: 'Grzeczny wstęp do pytania pośredniego — czasownik idzie na koniec: Können Sie mir sagen, wann der Zug fährt?',
        }),
        noun('die-welt', 'die Welt', 'świat', 'f', {
          plural: 'die Welten',
          note: 'eine Reise um die Welt — podróż dookoła świata; auf der ganzen Welt — na całym świecie.',
        }),
        verb('reisen', 'reisen', 'podróżować', {
          plAlts: ['jeździć po świecie', 'wyjeżdżać'],
          note: 'Perfekt z sein: Wir sind viel gereist. Rzeczownik: die Reise — podróż. Gute Reise! — Szczęśliwej podróży!',
        }),
        word('reich', 'reich', 'bogaty', {
          pos: 'adj',
          plAlts: ['bogata', 'bogate', 'zamożny'],
          note: 'Przeciwieństwo: arm (biedny). Wenn ich reich wäre… — Gdybym był bogaty / była bogata…',
        }),
        verb('gewinnen', 'gewinnen', 'wygrywać; wygrać', {
          plAlts: ['wygrać', 'wygrywać', 'zwyciężyć'],
          note: 'Nieregularny: gewann, hat gewonnen. Im Lotto gewinnen — wygrać w lotto.',
        }),
        word('allein', 'allein', 'sam; sama; samotnie', {
          pos: 'adv',
          plAlts: ['sam', 'sama', 'samotnie', 'w pojedynkę'],
          note: 'Nie odmienia się: Ich wohne allein. — Mieszkam sam / sama.',
        }),
        noun('die-insel', 'die Insel', 'wyspa', 'f', {
          plural: 'die Inseln',
          note: 'auf einer Insel — na wyspie. Mallorca ist eine Insel.',
        }),
        word('genug', 'genug', 'dość; wystarczająco', {
          pos: 'adv',
          plAlts: ['dosyć', 'wystarczająco', 'wystarczająco dużo'],
          note: 'Zwykle przed rzeczownikiem: genug Zeit, genug Geld. Genug jetzt! — Dość tego!',
        }),
      ],
      sentences: [
        s('34-1', 'Wenn ich mehr Zeit hätte, würde ich mehr reisen.', 'Gdybym miał więcej czasu, więcej bym podróżował.', {
          alts: ['Ich würde mehr reisen, wenn ich mehr Zeit hätte.'],
          plAlts: [
            'Gdybym miała więcej czasu, więcej bym podróżowała.',
            'Gdybym miał więcej czasu, podróżowałbym więcej.',
            'Gdybym miała więcej czasu, podróżowałabym więcej.',
            'Jakbym miał więcej czasu, więcej bym podróżował.',
            'Jakbym miała więcej czasu, więcej bym podróżowała.',
          ],
        }),
        s('34-2', 'Wenn ich reich wäre, würde ich ein Haus mit Garten kaufen.', 'Gdybym był bogaty, kupiłbym dom z ogrodem.', {
          alts: ['Ich würde ein Haus mit Garten kaufen, wenn ich reich wäre.'],
          plAlts: ['Gdybym była bogata, kupiłabym dom z ogrodem.', 'Gdybym był bogaty, kupiłbym sobie dom z ogrodem.', 'Gdybym była bogata, kupiłabym sobie dom z ogrodem.'],
        }),
        s('34-3', 'Wenn ich du wäre, würde ich nicht so viel arbeiten.', 'Na twoim miejscu nie pracowałbym tak dużo.', {
          alts: ['An deiner Stelle würde ich nicht so viel arbeiten.'],
          plAlts: [
            'Na twoim miejscu nie pracowałabym tak dużo.',
            'Gdybym był tobą, nie pracowałbym tak dużo.',
            'Gdybym była tobą, nie pracowałabym tak dużo.',
            'Na twoim miejscu nie pracowałbym tyle.',
            'Na twoim miejscu nie pracowałabym tyle.',
          ],
        }),
        s('34-4', 'Ich wünschte, ich hätte genug Geld für eine Reise um die Welt.', 'Szkoda, że nie mam dość pieniędzy na podróż dookoła świata.', {
          plAlts: [
            'Szkoda, że nie mam wystarczająco pieniędzy na podróż dookoła świata.',
            'Żałuję, że nie mam dość pieniędzy na podróż dookoła świata.',
            'Chciałbym mieć dość pieniędzy na podróż dookoła świata.',
            'Chciałabym mieć dość pieniędzy na podróż dookoła świata.',
            'Chciałbym mieć wystarczająco dużo pieniędzy na podróż dookoła świata.',
            'Chciałabym mieć wystarczająco dużo pieniędzy na podróż dookoła świata.',
          ],
          note: 'die Reise — podróż (od reisen). Ich wünschte + Konjunktiv II: życzenie, które się nie spełnia.',
        }),
        s('34-5', 'Was würdest du machen, wenn du im Lotto gewinnen würdest?', 'Co byś zrobił, gdybyś wygrał w lotto?', {
          alts: ['Was würdest du tun, wenn du im Lotto gewinnen würdest?'],
          plAlts: [
            'Co byś zrobiła, gdybyś wygrała w lotto?',
            'Co zrobiłbyś, gdybyś wygrał w lotto?',
            'Co zrobiłabyś, gdybyś wygrała w lotto?',
            'Co byś zrobił, jakbyś wygrał w lotto?',
            'Co byś zrobiła, jakbyś wygrała w lotto?',
          ],
          note: 'W mowie würde często stoi w obu częściach zdania — przy gewinnen to zupełnie naturalne.',
        }),
        s('34-6', 'Weißt du, ob Anna heute ins Kaffeehaus kommt?', 'Wiesz, czy Anna przyjdzie dziś do kawiarni?', {
          plAlts: ['Czy wiesz, czy Anna przyjdzie dziś do kawiarni?', 'Wiesz, czy Anna przyjdzie dzisiaj do kawiarni?', 'Wiesz, czy Anna dziś przychodzi do kawiarni?'],
          note: 'Pytanie tak / nie w zdaniu podrzędnym: ob + czasownik na końcu (kommt).',
          accent: 'de-AT',
        }),
        s('34-7', 'Können Sie mir sagen, wo der Bahnhof ist?', 'Czy może mi pan powiedzieć, gdzie jest dworzec?', {
          plAlts: [
            'Czy może mi pani powiedzieć, gdzie jest dworzec?',
            'Może mi pan powiedzieć, gdzie jest dworzec?',
            'Może mi pani powiedzieć, gdzie jest dworzec?',
            'Czy mogliby mi państwo powiedzieć, gdzie jest dworzec?',
          ],
        }),
        s('34-8', 'Ich frage mich, warum er nicht angerufen hat.', 'Zastanawiam się, dlaczego nie zadzwonił.', {
          plAlts: ['Zastanawiam się, czemu nie zadzwonił.', 'Zastanawiam się, dlaczego on nie zadzwonił.', 'Ciekawe, dlaczego nie zadzwonił.'],
        }),
        s('34-9', 'Wenn ich heuer mehr Urlaub hätte, würde ich nach Kroatien fahren.', 'Gdybym miał w tym roku więcej urlopu, pojechałbym do Chorwacji.', {
          alts: [
            'Wenn ich dieses Jahr mehr Urlaub hätte, würde ich nach Kroatien fahren.',
            'Ich würde nach Kroatien fahren, wenn ich heuer mehr Urlaub hätte.',
          ],
          plAlts: [
            'Gdybym miała w tym roku więcej urlopu, pojechałabym do Chorwacji.',
            'Gdybym w tym roku miał więcej urlopu, pojechałbym do Chorwacji.',
            'Gdybym w tym roku miała więcej urlopu, pojechałabym do Chorwacji.',
          ],
          note: 'heuer — austriackie „w tym roku”. Chorwacja to ulubiony kierunek wakacyjny Austriaków.',
          accent: 'de-AT',
        }),
      ],
      grammar: [
        {
          id: 'de.g.konjunktiv-irreal',
          title: 'Gdyby…: Wenn ich mehr Zeit hätte, würde ich…',
          body: [
            'Zdania warunkowe **nierealne** („gdybym…”) mówią o tym, czego nie ma — i co by wtedy było. W obu częściach używamy **Konjunktiv II**, który znasz już z uprzejmych próśb: [[Wenn ich mehr Zeit hätte, würde ich mehr reisen.]] (Ale czasu nie mam.)',
            'W zdaniu z [[wenn]] czasownik stoi **na końcu**. Zdanie z wenn często idzie pierwsze — wtedy zdanie główne zaczyna się od czasownika: [[Wenn ich reich wäre, würde ich ein Haus kaufen.]] Można też odwrotnie: [[Ich würde ein Haus kaufen, wenn ich reich wäre.]]',
            'Przy sein, haben, wissen i czasownikach modalnych używamy krótkich form: [[wäre]], [[hätte]], [[wüsste]], [[könnte]], [[müsste]]. Przy pozostałych — **würde + bezokolicznik**: [[würde reisen]], [[würde kaufen]]. Życzenie nierealne: [[Ich wünschte, ich hätte mehr Zeit.]] Rada: [[Wenn ich du wäre, würde ich zum Arzt gehen.]]',
          ],
          table: {
            head: ['Rzeczywistość', 'Gdyby…', 'Po polsku'],
            rows: [
              ['Ich habe keine Zeit.', 'Wenn ich Zeit hätte, …', 'Gdybym miał / miała czas…'],
              ['Ich bin nicht reich.', 'Wenn ich reich wäre, …', 'Gdybym był bogaty / była bogata…'],
              ['Ich kann nicht kommen.', 'Wenn ich kommen könnte, …', 'Gdybym mógł / mogła przyjść…'],
              ['Ich reise wenig.', '…, würde ich mehr reisen.', '…więcej bym podróżował / podróżowała.'],
            ],
          },
          contrast:
            'Po polsku „gdyby” łączy się z formą przeszłą i cząstką -by: gdybym miał, kupiłbym. Po niemiecku obie części mają Konjunktiv II, a wenn wysyła czasownik na koniec: Wenn ich Geld hätte, würde ich… Uwaga: warunek realny (Wenn es regnet, bleibe ich zu Hause — jeśli pada, zostaję) to zwykły czas teraźniejszy. Konjunktiv jest tylko dla fantazji i rzeczy nierealnych.',
        },
        {
          id: 'de.g.indirekte-frage',
          title: 'Pytania pośrednie: ob i słowa pytające',
          body: [
            '**Pytanie pośrednie** to pytanie ukryte w zdaniu: „Wiesz, czy…?”, „Nie wiem, gdzie…”. Po niemiecku jest zdaniem podrzędnym — odmieniony czasownik idzie **na koniec**: [[Wo ist der Bahnhof?]] → [[Können Sie mir sagen, wo der Bahnhof ist?]]',
            'Gdy pytanie zaczyna się od słowa pytającego (wo, wann, warum, wer, wie…), to słowo zostaje: [[Ich frage mich, warum er nicht angerufen hat.]] Gdy to pytanie typu tak / nie, wstawiamy [[ob]] (czy): [[Kommt Anna?]] → [[Weißt du, ob Anna kommt?]]',
            'Pytania pośrednie brzmią **uprzejmiej** niż bezpośrednie — dlatego tak często słychać je w sklepie, na dworcu i w urzędzie: [[Wissen Sie, wann der Zug fährt?]] [[Darf ich fragen, wie viel das kostet?]] Pamiętaj: „czy” to zawsze ob, a „jeśli” — wenn.',
          ],
          table: {
            head: ['Pytanie', 'Pytanie pośrednie'],
            rows: [
              ['Wo ist der Bahnhof?', 'Können Sie mir sagen, wo der Bahnhof ist?'],
              ['Wann kommt der Bus?', 'Wissen Sie, wann der Bus kommt?'],
              ['Warum hat er nicht angerufen?', 'Ich frage mich, warum er nicht angerufen hat.'],
              ['Kommt Anna heute?', 'Weißt du, ob Anna heute kommt?'],
            ],
          },
          contrast:
            'Po polsku „czy” stoi i w pytaniu bezpośrednim (Czy Anna przyjdzie?), i w pośrednim (Wiesz, czy Anna przyjdzie?), a szyk się nie zmienia. Po niemiecku pytanie bezpośrednie zaczyna się od czasownika (Kommt Anna?), a pośrednie — od ob, z czasownikiem na końcu (…, ob Anna kommt). Tego „czy” nigdy nie tłumacz jako wenn!',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'de.x.34-1',
          concept: 'de.g.konjunktiv-irreal',
          sentence: 'Wenn ich mehr Zeit ___, würde ich mehr lesen.',
          pl: 'Gdybym miał / miała więcej czasu, więcej bym czytał / czytała.',
          options: ['habe', 'hätte', 'hatte'],
          answer: 'hätte',
          explanation: 'Warunek nierealny (czasu nie mam) → Konjunktiv II: hätte. Hatte bez przegłosu to czas przeszły („miałem”).',
        },
        {
          type: 'gap',
          id: 'de.x.34-2',
          concept: 'de.g.konjunktiv-irreal',
          sentence: 'Wenn ich du ___, würde ich zum Arzt gehen.',
          pl: 'Na twoim miejscu poszedłbym / poszłabym do lekarza.',
          options: ['bin', 'war', 'wäre'],
          answer: 'wäre',
          explanation: 'Wenn ich du wäre — gdybym był tobą. Wäre to Konjunktiv II od sein, a war — zwykły czas przeszły.',
        },
        {
          type: 'gap',
          id: 'de.x.34-3',
          concept: 'de.g.konjunktiv-irreal',
          sentence: 'Wenn ich reich wäre, ___ ich ein Haus kaufen.',
          pl: 'Gdybym był bogaty / była bogata, kupiłbym / kupiłabym dom.',
          options: ['werde', 'würde', 'wurde'],
          answer: 'würde',
          explanation: 'W zdaniu głównym: würde + bezokolicznik na końcu. Werde tworzy czas przyszły, a wurde to Präteritum od werden.',
        },
        {
          type: 'choice',
          id: 'de.x.34-4',
          concept: 'de.g.konjunktiv-irreal',
          prompt: 'Które zdanie ma poprawny szyk?',
          options: [
            'Wenn ich hätte mehr Geld, würde ich reisen.',
            'Wenn ich mehr Geld hätte, würde ich reisen.',
            'Wenn ich mehr Geld hätte, ich würde reisen.',
          ],
          answer: 1,
          explanation: 'Po wenn czasownik idzie na koniec (Geld hätte), a zdanie główne zaczyna się od czasownika (würde ich), bo zdanie z wenn zajmuje 1. miejsce.',
        },
        {
          type: 'gap',
          id: 'de.x.34-5',
          concept: 'de.g.indirekte-frage',
          sentence: 'Weißt du, ___ Paul heute Zeit hat?',
          pl: 'Wiesz, czy Paul ma dziś czas?',
          options: ['ob', 'wenn', 'dass'],
          answer: 'ob',
          explanation: 'Pytanie tak / nie (Hat Paul Zeit?) ukryte w zdaniu wprowadza ob — „czy”. Wenn znaczy „jeśli” albo „kiedy”.',
        },
        {
          type: 'choice',
          id: 'de.x.34-6',
          concept: 'de.g.indirekte-frage',
          prompt: 'Jak uprzejmie zapytasz: „Czy wie pan, kiedy odjeżdża pociąg?”',
          options: ['Wissen Sie, wann fährt der Zug?', 'Wissen Sie, wann der Zug fährt?', 'Wissen Sie, ob wann der Zug fährt?'],
          answer: 1,
          explanation: 'W pytaniu pośrednim czasownik idzie na koniec: …, wann der Zug fährt. Ob dodajemy tylko wtedy, gdy nie ma słowa pytającego.',
        },
        {
          type: 'gap',
          id: 'de.x.34-7',
          concept: 'de.g.indirekte-frage',
          sentence: 'Kannst du mir sagen, wie spät ___?',
          pl: 'Możesz mi powiedzieć, która jest godzina?',
          options: ['es ist', 'ist es', 'es sein'],
          answer: 'es ist',
          explanation: 'Wie spät ist es? w pytaniu pośrednim zmienia szyk: …, wie spät es ist — odmieniony czasownik na koniec.',
        },
      ],
      dialogue: {
        id: 'de.d.34',
        title: 'Gdybyśmy wygrali…',
        context: 'Przerwa w pracy w Wiedniu. Tomek i jego koleżanka Julia wysłali razem kupon lotto i zaczynają marzyć.',
        speakers: {
          J: { name: 'Julia', voice: 'a', accent: 'de-AT' },
          T: { name: 'Tomek', voice: 'b', accent: 'de-AT' },
        },
        lines: [
          { speaker: 'J', text: 'Tomek, was würdest du machen, wenn wir im Lotto gewinnen würden?', pl: 'Tomek, co byś zrobił, gdybyśmy wygrali w lotto?' },
          { speaker: 'T', text: 'Ich würde nicht mehr arbeiten! Und du?', pl: 'Przestałbym pracować! A ty?' },
          {
            speaker: 'J',
            text: 'Ich würde eine Reise um die Welt machen. Wenn ich genug Geld hätte, würde ich zuerst nach Japan reisen.',
            pl: 'Wybrałabym się w podróż dookoła świata. Gdybym miała dość pieniędzy, najpierw pojechałabym do Japonii.',
          },
          { speaker: 'T', text: 'Und ich würde auf einer Insel wohnen — ganz allein!', pl: 'A ja zamieszkałbym na wyspie — zupełnie sam!' },
          { speaker: 'J', text: 'Allein? Wäre das nicht langweilig?', pl: 'Sam? Czy to nie byłoby nudne?' },
          { speaker: 'T', text: 'Vielleicht. Weißt du, ob es dort Internet gibt?', pl: 'Może. Wiesz, czy jest tam internet?' },
          { speaker: 'J', text: 'Ich weiß es nicht. Aber zuerst müssen wir gewinnen!', pl: 'Nie wiem. Ale najpierw musimy wygrać!' },
          { speaker: 'T', text: 'Stimmt. Ich frage mich, ob wir heute gewinnen.', pl: 'Racja. Ciekawe, czy dziś wygramy.' },
          { speaker: 'J', text: 'Ich wünschte, ich wüsste es!', pl: 'Chciałabym to wiedzieć!' },
        ],
        questions: [
          {
            id: 'de.d.34-q1',
            prompt: 'Co zrobiłby Tomek po wygranej?',
            options: ['Kupiłby samochód', 'Przestałby pracować i zamieszkał na wyspie', 'Pojechałby do Japonii'],
            answer: 1,
            explanation: '„Ich würde nicht mehr arbeiten!” i „Ich würde auf einer Insel wohnen — ganz allein!”',
          },
          {
            id: 'de.d.34-q2',
            prompt: 'Dokąd Julia pojechałaby najpierw?',
            options: ['Do Japonii', 'Na wyspę', 'Do Polski'],
            answer: 0,
            explanation: '„Wenn ich genug Geld hätte, würde ich zuerst nach Japan reisen.”',
          },
          {
            id: 'de.d.34-q3',
            prompt: 'O co Tomek pyta Julię?',
            options: ['Czy na wyspie jest internet', 'Kiedy jest losowanie', 'Ile kosztował los'],
            answer: 0,
            explanation: '„Weißt du, ob es dort Internet gibt?” — pytanie pośrednie z ob i czasownikiem na końcu.',
          },
        ],
      },
      summary: [
        'Gdyby…: wenn + Konjunktiv II (czasownik na końcu), potem würde + bezokolicznik: Wenn ich mehr Zeit hätte, würde ich mehr reisen.',
        'Krótkie formy: wäre, hätte, wüsste, könnte. Rada: Wenn ich du wäre, … Życzenie: Ich wünschte, ich hätte…',
        'Pytanie pośrednie: czasownik na końcu — Können Sie mir sagen, wo der Bahnhof ist?',
        'Bez słowa pytającego: ob (czy) — Weißt du, ob Anna kommt? Nie myl ob z wenn.',
      ],
      followUp:
        'Dokończ na głos trzy zdania: Wenn ich reich wäre, … Wenn ich mehr Zeit hätte, … Ich wünschte, … Potem zadaj w myślach komuś pytanie pośrednie: Weißt du, ob…? Za około 10 minut zrób krótką powtórkę.',
    },
  ],
};
