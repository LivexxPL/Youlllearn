import type { Unit } from '../types';
import { contentHelpers } from '../helpers';

const { word, noun, verb, phrase, sentence: s } = contentHelpers('es');

export const unit8: Unit = {
  id: 'es.u8',
  title: 'Życzenia, opinie i opowieści',
  description:
    'Pierwsze kroki na poziomie B1: tryb łączący (subjuntivo) w życzeniach, radach, uczuciach i opiniach, czas zaprzeszły, zdania względne oraz zdania warunkowe z si — także nierealne (si tuviera…).',
  level: 'B1',
  lessons: [
    {
      id: 'es.l29',
      title: 'Życzenia i nadzieje',
      subtitle: '¡Ojalá haga sol!',
      objective:
        'Wyrazisz życzenia i nadzieje wobec innych (quiero que…, espero que…, ojalá…) i utworzysz tryb łączący w czasie teraźniejszym — regularny, z wymianą samogłoski i nieregularny (sea, vaya, haya, sepa, esté, dé).',
      level: 'B1',
      minutes: 13,
      intro: [
        'Witaj na poziomie B1! W tym dziale poznasz tryb łączący (subjuntivo), opowiesz historię w czasie zaprzeszłym i zaczniesz mówić o sytuacjach wyobrażonych: „gdybym miał czas…”.',
        'Subjuntivo brzmi groźnie, ale trochę go już znasz: no hables, no comas i formy dla pana / pani (hable, venga) to właśnie subjuntivo. Teraz użyjesz go po quiero que, espero que i ojalá.',
      ],
      items: [
        word('ojala', 'ojalá', 'oby; żeby tylko', {
          pos: 'expr',
          plAlts: ['oby tylko', 'miejmy nadzieję', 'mam nadzieję'],
          note: 'Po ojalá zawsze stoi subjuntivo: ¡Ojalá haga sol! — Oby świeciło słońce! Może też wystąpić samo: —¿Vienes mañana? —¡Ojalá! Słowo pochodzi z arabskiego i znaczyło „jeśli Bóg zechce”.',
        }),
        verb('esperar', 'esperar', 'mieć nadzieję; czekać', {
          plAlts: ['czekać', 'poczekać', 'oczekiwać', 'spodziewać się'],
          note: 'Dwa znaczenia: Espero que estés bien — mam nadzieję, że u ciebie wszystko dobrze; Espero el autobús — czekam na autobus. Uwaga: bez przyimka „na”. Te espero aquí — czekam tu na ciebie.',
        }),
        phrase('quiero-que', 'quiero que…', 'chcę, żeby…', {
          plAlts: ['chcę, aby…', 'chcę, żebyś…'],
          note: 'Gdy chcemy czegoś od innej osoby, po que stoi subjuntivo: Quiero que vengas. — Chcę, żebyś przyszedł / przyszła. Gdy chodzi o nas samych, wystarczy bezokolicznik: Quiero venir. — Chcę przyjść.',
        }),
        phrase('espero-que-si', 'espero que sí', 'mam nadzieję, że tak', {
          plAlts: ['oby tak', 'oby', 'mam taką nadzieję'],
          note: 'Krótka odpowiedź bez czasownika: —¿Hará sol mañana? —Espero que sí. Przeczenie: espero que no — mam nadzieję, że nie.',
        }),
        word('sea', 'sea', 'żeby był / była / było (od ser)', {
          pos: 'verb',
          plAlts: ['żeby był', 'żeby była', 'żeby było', 'niech będzie', 'że będzie'],
          note: 'Subjuntivo od ser: Espero que sea fácil. — Mam nadzieję, że będzie łatwe. Po polsku często tłumaczymy je zwykłym czasem — tryb wymusza hiszpańskie espero que. O sea — czyli, to znaczy.',
        }),
        word('vaya', 'vaya', 'żeby poszedł / poszła (od ir)', {
          pos: 'verb',
          plAlts: ['żeby poszedł', 'żeby poszła', 'żeby pojechał', 'żeby pojechała', 'niech idzie', 'niech jedzie'],
          note: 'Temat vay- trzeba zapamiętać: vaya, vayas, vayamos, vayan. ¡Que te vaya bien! — Powodzenia! (dosłownie: niech ci dobrze idzie). Samo ¡vaya! to okrzyk: „no proszę!”, „a niech to!”.',
        }),
        word('haya', 'haya', 'żeby było; że jest (od hay)', {
          pos: 'verb',
          plAlts: ['żeby był', 'żeby była', 'żeby były', 'że są', 'że będzie'],
          note: 'Subjuntivo od hay: Espero que haya pan. — Mam nadzieję, że jest chleb. Tak jak hay — jedna forma dla liczby pojedynczej i mnogiej: Ojalá haya billetes. — Oby były bilety.',
        }),
        word('sepa', 'sepa', 'żeby wiedział / wiedziała (od saber)', {
          pos: 'verb',
          plAlts: ['żeby wiedział', 'żeby wiedziała', 'że wie', 'niech wie'],
          note: 'Temat sep- nie wynika z sé — trzeba go zapamiętać: sepa, sepas, sepamos, sepan. No quiero que lo sepa nadie. — Nie chcę, żeby ktokolwiek o tym wiedział.',
        }),
        word('este-subj', 'esté', 'żeby był / była (od estar)', {
          pos: 'verb',
          plAlts: ['żeby był', 'żeby była', 'żeby było', 'że jest'],
          note: 'Subjuntivo od estar ma kreskę prawie wszędzie: esté, estés, estemos, estén. Kreska odróżnia esté od este (ten). Podobnie dar: dé (z kreską, żeby nie mylić z de), des, demos, den.',
        }),
        phrase('que-tengas-suerte', '¡que tengas suerte!', 'powodzenia!', {
          plAlts: ['życzę ci szczęścia!', 'życzę powodzenia!', 'obyś miał szczęście!', 'obyś miała szczęście!'],
          note: 'Que + subjuntivo to gotowa formuła życzeń — skrót od „(espero) que…”. Tener suerte — mieć szczęście (fart): ¡Qué suerte! — Ale masz szczęście! Szczęście jako radość to la felicidad.',
        }),
        phrase('que-aproveche', '¡que aproveche!', 'smacznego!', {
          plAlts: ['smacznego wam!', 'życzę smacznego!'],
          note: 'Dosłownie „niech wyjdzie na zdrowie”. W Hiszpanii mówi się tak do osób, które jedzą — nawet do nieznajomych w barze. Odpowiadamy: ¡Gracias! W Meksyku częściej słychać ¡provecho! albo ¡buen provecho!',
        }),
        phrase('que-lo-pases-bien', '¡que lo pases bien!', 'baw się dobrze!', {
          plAlts: ['miłej zabawy!', 'udanej zabawy!', 'dobrze się baw!'],
          note: 'Pasarlo bien — dobrze się bawić, miło spędzać czas. Do kilku osób w Hiszpanii: ¡que lo paséis bien! W Meksyku mówi się raczej pasarla bien: ¡que la pases bien!, ¡que la pasen bien!',
        }),
      ],
      sentences: [
        s('29-1', '¡Ojalá haga sol mañana!', 'Oby jutro świeciło słońce!', {
          plAlts: ['Oby jutro było słonecznie!', 'Żeby tylko jutro świeciło słońce!', 'Oby jutro była ładna pogoda!'],
        }),
        s('29-2', 'Quiero que vengas a mi cumpleaños.', 'Chcę, żebyś przyszedł / przyszła na moje urodziny.', {
          plAlts: ['Chcę, żebyś przyszedł na moje urodziny.', 'Chcę, żebyś przyszła na moje urodziny.', 'Chcę, abyś przyszedł na moje urodziny.', 'Chcę, abyś przyszła na moje urodziny.'],
        }),
        s('29-3', 'Espero que estés bien.', 'Mam nadzieję, że u ciebie wszystko dobrze.', {
          plAlts: ['Mam nadzieję, że wszystko u ciebie dobrze.', 'Mam nadzieję, że dobrze się czujesz.', 'Mam nadzieję, że masz się dobrze.'],
          accent: 'es-MX',
        }),
        s('29-4', 'Mis padres quieren que vuelva a Polonia.', 'Rodzice chcą, żebym wrócił / wróciła do Polski.', {
          plAlts: [
            'Rodzice chcą, żebym wrócił do Polski.',
            'Rodzice chcą, żebym wróciła do Polski.',
            'Moi rodzice chcą, żebym wrócił do Polski.',
            'Moi rodzice chcą, żebym wróciła do Polski.',
          ],
          note: 'Volver ma wymianę o → ue także w subjuntivo: vuelva, vuelvas — ale volvamos.',
        }),
        s('29-5', 'Espero que haya billetes para el tren de las ocho.', 'Mam nadzieję, że są bilety na pociąg o ósmej.', {
          plAlts: ['Mam nadzieję, że będą bilety na pociąg o ósmej.', 'Mam nadzieję, że są jeszcze bilety na pociąg o ósmej.', 'Oby były bilety na pociąg o ósmej.'],
        }),
        s('29-6', 'No quiero que mi hermano lo sepa.', 'Nie chcę, żeby mój brat o tym wiedział.', {
          plAlts: ['Nie chcę, żeby brat o tym wiedział.', 'Nie chcę, żeby mój brat się o tym dowiedział.', 'Nie chcę, żeby brat się o tym dowiedział.'],
        }),
        s('29-7', '¡Que tengan un buen viaje!', 'Udanej podróży!', {
          plAlts: ['Miłej podróży!', 'Dobrej podróży!', 'Życzę wam udanej podróży!', 'Życzę państwu udanej podróży!'],
          note: 'W Meksyku do kilku osób zawsze ustedes: que tengan. W Hiszpanii do znajomych: ¡Que tengáis un buen viaje!',
          accent: 'es-MX',
        }),
        s('29-8', 'Mi profesora quiere que hablemos solo en español.', 'Moja nauczycielka chce, żebyśmy mówili tylko po hiszpańsku.', {
          plAlts: [
            'Nauczycielka chce, żebyśmy mówili tylko po hiszpańsku.',
            'Moja nauczycielka chce, żebyśmy rozmawiali tylko po hiszpańsku.',
            'Moja nauczycielka chce, żebyśmy mówiły tylko po hiszpańsku.',
          ],
        }),
        s('29-9', 'Ojalá mis amigos puedan venir.', 'Oby moi znajomi mogli przyjść.', {
          plAlts: ['Oby moi przyjaciele mogli przyjść.', 'Oby moi znajomi mogli przyjechać.', 'Mam nadzieję, że moi znajomi będą mogli przyjść.'],
          accent: 'es-MX',
        }),
      ],
      grammar: [
        {
          id: 'es.g.subjuntivo',
          title: 'Presente de subjuntivo: hable, coma, tenga, sea',
          body: [
            'Tryb łączący (**subjuntivo**) to osobny zestaw form czasownika. Hiszpański sięga po niego, gdy mówimy nie o faktach, lecz o tym, czego **chcemy, oczekujemy albo się spodziewamy**. Kilka jego form już znasz z poleceń: [[no hables]], [[no comas]], [[venga]], [[siéntese]].',
            'Formę tworzymy od „yo” czasu teraźniejszego: odcinamy -o i dodajemy końcówki z **„zamienioną” samogłoską** — -ar → **-e**, -er / -ir → **-a**: hablo → [[hable]], como → [[coma]], vivo → [[viva]]. Dlatego nieregularne „yo” przechodzi na wszystkie osoby: tengo → [[tenga]], hago → [[haga]], vengo → [[venga]], salgo → [[salga]], digo → [[diga]].',
            'Wymiana samogłoski działa jak w czasie teraźniejszym — wszędzie poza „nosotros” i „vosotros”: [[pueda]], [[quiera]], [[vuelva]], ale [[podamos]], [[volvamos]]. Pisownia pilnuje wymowy: tocar → [[toque]], llegar → [[llegue]].',
            'Sześć czasowników ma formy, których nie da się wyprowadzić z „yo”: ser → [[sea]], ir → [[vaya]], hay → [[haya]], saber → [[sepa]], estar → [[esté]], dar → [[dé]]. Kreska w dé odróżnia je od przyimka de.',
          ],
          table: {
            head: ['Bezokolicznik', 'yo (teraz)', 'yo / él / usted', 'tú', 'nosotros', 'ellos / ustedes'],
            rows: [
              ['hablar', 'hablo', 'hable', 'hables', 'hablemos', 'hablen'],
              ['comer', 'como', 'coma', 'comas', 'comamos', 'coman'],
              ['vivir', 'vivo', 'viva', 'vivas', 'vivamos', 'vivan'],
              ['tener', 'tengo', 'tenga', 'tengas', 'tengamos', 'tengan'],
              ['hacer', 'hago', 'haga', 'hagas', 'hagamos', 'hagan'],
              ['poder', 'puedo', 'pueda', 'puedas', 'podamos', 'puedan'],
              ['ser', 'soy', 'sea', 'seas', 'seamos', 'sean'],
              ['ir', 'voy', 'vaya', 'vayas', 'vayamos', 'vayan'],
              ['estar', 'estoy', 'esté', 'estés', 'estemos', 'estén'],
              ['dar', 'doy', 'dé', 'des', 'demos', 'den'],
              ['saber', 'sé', 'sepa', 'sepas', 'sepamos', 'sepan'],
              ['haber (hay)', 'hay', 'haya', 'hayas', 'hayamos', 'hayan'],
            ],
          },
          contrast:
            'Polski nie ma osobnych form trybu łączącego. Zastępuje je „żeby” + forma przeszła (żebyś przyszedł) albo „niech” (niech przyjdzie). Hiszpańskie formy nie zmieniają się według rodzaju: que vengas to i „żebyś przyszedł”, i „żebyś przyszła”. Formy „yo” i „él / ella / usted” są takie same (hable), więc osobę pokazuje kontekst.',
        },
        {
          id: 'es.g.subjuntivo-deseos',
          title: 'Quiero que…, espero que…, ojalá',
          body: [
            'Gdy chcemy czegoś **od innej osoby**, po [[quiero que]] stoi subjuntivo: [[Quiero que vengas.]] — Chcę, żebyś przyszedł / przyszła. Jeśli chodzi o nas samych, wystarczy bezokolicznik: [[Quiero venir.]] — Chcę przyjść. Więcej o tej różnicy w następnej lekcji.',
            'Po [[espero que]] (mam nadzieję, że…) również stoi subjuntivo — także wtedy, gdy mówimy o przyszłości: [[Espero que estés bien.]], [[Espero que mañana haga sol.]]',
            '[[ojalá]] (oby) zawsze łączy się z subjuntivo, z que albo bez: [[¡Ojalá no llueva!]] = [[¡Ojalá que no llueva!]] — Oby nie padało!',
            'Krótkie życzenia zaczynamy od que: [[¡Que tengas suerte!]], [[¡Que aproveche!]], [[¡Que lo pases bien!]], [[¡Que te vaya bien!]]',
          ],
          table: {
            head: ['Wyrażenie', 'Po polsku', 'Przykład'],
            rows: [
              ['quiero que + subjuntivo', 'chcę, żeby…', 'Quiero que vengas.'],
              ['espero que + subjuntivo', 'mam nadzieję, że…', 'Espero que estés bien.'],
              ['ojalá (que) + subjuntivo', 'oby…', '¡Ojalá no llueva!'],
              ['¡que + subjuntivo!', 'życzenie', '¡Que tengas suerte!'],
              ['quiero + bezokolicznik', 'chcę (sam / sama)…', 'Quiero venir.'],
            ],
          },
          contrast:
            'Po polsku „mam nadzieję, że…” łączy się ze zwykłym czasem: mam nadzieję, że przyjdziesz. Po hiszpańsku espero que w znaczeniu „mam nadzieję” wymaga subjuntivo: espero que vengas, a nie „espero que vienes”. Polskie „żeby” i „oby” są dobrą wskazówką: tam, gdzie po polsku pojawia się „żeby” z inną osobą, po hiszpańsku zwykle stoi subjuntivo.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'es.x.29-1',
          concept: 'es.g.subjuntivo',
          sentence: 'Quiero que ___ a mi fiesta.',
          pl: 'Chcę, żebyś przyszła na moją imprezę.',
          options: ['vienes', 'vengas', 'venir'],
          answer: 'vengas',
          explanation: 'Po quiero que (chcę ja, przychodzi ktoś inny) → subjuntivo: vengas, z tematem veng- jak w vengo. Vienes to zwykły czas teraźniejszy, a bezokolicznika używamy, gdy podmiot jest ten sam: quiero venir.',
        },
        {
          type: 'gap',
          id: 'es.x.29-2',
          concept: 'es.g.subjuntivo',
          sentence: 'Espero que el examen ___ fácil.',
          pl: 'Mam nadzieję, że egzamin będzie łatwy.',
          options: ['es', 'sea', 'será'],
          answer: 'sea',
          explanation: 'Po espero que → subjuntivo, a ser ma nieregularną formę sea. Po polsku mówimy „będzie”, ale hiszpański wybiera tu subjuntivo, które obejmuje też przyszłość.',
        },
        {
          type: 'gap',
          id: 'es.x.29-3',
          concept: 'es.g.subjuntivo',
          sentence: '¡Ojalá no ___ el sábado!',
          pl: 'Oby w sobotę nie padało!',
          options: ['llueve', 'llueva', 'llover'],
          answer: 'llueva',
          explanation: 'Ojalá zawsze łączy się z subjuntivo. Llover: llueve → llueva (-er → -a, a wymiana o → ue zostaje).',
        },
        {
          type: 'gap',
          id: 'es.x.29-4',
          concept: 'es.g.subjuntivo',
          sentence: 'Mis padres quieren que ___ a casa temprano.',
          pl: 'Rodzice chcą, żebyśmy wcześnie wrócili do domu.',
          options: ['volvamos', 'vuelvamos', 'volvemos'],
          answer: 'volvamos',
          explanation: 'W formie „nosotros” nie ma wymiany o → ue: volvamos (ale vuelva, vuelvas). Volvemos to zwykły czas teraźniejszy.',
        },
        {
          type: 'gap',
          id: 'es.x.29-5',
          concept: 'es.g.subjuntivo-deseos',
          sentence: 'Espero que ___ bien, abuela.',
          pl: 'Mam nadzieję, że dobrze się czujesz, babciu.',
          options: ['estés', 'estás', 'estes'],
          answer: 'estés',
          explanation: 'Po espero que → subjuntivo od estar: estés, z kreską. Estás to zwykły czas teraźniejszy, a formy „estes” bez kreski nie ma.',
        },
        {
          type: 'choice',
          id: 'es.x.29-6',
          concept: 'es.g.subjuntivo-deseos',
          prompt: 'Koleżanka siada do obiadu. Co jej powiesz?',
          options: ['¡Que aproveche!', '¡Que tengas suerte!', '¡Que lo pases bien!'],
          answer: 0,
          explanation: '¡Que aproveche! to „smacznego”. ¡Que tengas suerte! znaczy „powodzenia”, a ¡Que lo pases bien! — „baw się dobrze”.',
        },
        {
          type: 'choice',
          id: 'es.x.29-7',
          concept: 'es.g.subjuntivo-deseos',
          optionsLang: 'pl',
          prompt: 'Co znaczy „Quiero que vayas al médico”?',
          options: ['Chcę iść do lekarza.', 'Chcę, żebyś poszedł do lekarza.', 'Idziesz do lekarza, bo tak chcę.'],
          answer: 1,
          explanation: 'Quiero que + subjuntivo (vayas, od ir) — chcę, żeby ktoś inny coś zrobił. „Chcę iść do lekarza” to quiero ir al médico.',
        },
      ],
      dialogue: {
        id: 'es.d.29',
        title: 'Dzień przed egzaminem',
        context: 'Weronika studiuje w Puebli. Jutro ma ustny egzamin z hiszpańskiego, a jej kolega Diego próbuje ją pocieszyć.',
        speakers: {
          D: { name: 'Diego', voice: 'b', accent: 'es-MX' },
          W: { name: 'Weronika', voice: 'a', accent: 'es-ES' },
        },
        lines: [
          { speaker: 'D', text: 'Vero, ¿qué te pasa?', pl: 'Vero, co ci jest?' },
          { speaker: 'W', text: 'Mañana tengo el examen de español y estoy muy cansada.', pl: 'Jutro mam egzamin z hiszpańskiego i jestem bardzo zmęczona.' },
          { speaker: 'D', text: 'Tranquila, estudiaste mucho. Espero que duermas bien esta noche.', pl: 'Spokojnie, dużo się uczyłaś. Mam nadzieję, że dziś w nocy dobrze się wyśpisz.' },
          {
            speaker: 'W',
            text: 'Ojalá. Pero la profesora quiere que hablemos diez minutos de nuestra familia.',
            pl: 'Oby. Ale nauczycielka chce, żebyśmy przez dziesięć minut mówili o swojej rodzinie.',
          },
          { speaker: 'D', text: '¡Eso es fácil para ti! Hablas muy bien.', pl: 'To dla ciebie łatwe! Świetnie mówisz.' },
          { speaker: 'W', text: 'Gracias. ¿Y tú? ¿No tienes clase mañana?', pl: 'Dzięki. A ty? Nie masz jutro zajęć?' },
          { speaker: 'D', text: 'No, mañana voy a la playa con mis hermanos. ¡Ojalá haga sol!', pl: 'Nie, jutro jadę z rodzeństwem na plażę. Oby świeciło słońce!' },
          { speaker: 'W', text: 'Entonces, ¡que lo pases bien!', pl: 'W takim razie baw się dobrze!' },
          { speaker: 'D', text: 'Y tú, ¡que tengas mucha suerte! Llámame después del examen.', pl: 'A tobie życzę powodzenia! Zadzwoń do mnie po egzaminie.' },
        ],
        questions: [
          {
            id: 'es.d.29-q1',
            prompt: 'Dlaczego Weronika się denerwuje?',
            options: ['Bo jutro ma egzamin z hiszpańskiego', 'Bo nie może jechać na plażę', 'Bo przyjeżdża jej rodzina'],
            answer: 0,
            explanation: '„Mañana tengo el examen de español y estoy muy cansada.”',
          },
          {
            id: 'es.d.29-q2',
            prompt: 'Czego chce nauczycielka?',
            options: ['Żeby studenci przyszli wcześniej', 'Żeby studenci przez dziesięć minut mówili o rodzinie', 'Żeby studenci napisali list'],
            answer: 1,
            explanation: '„La profesora quiere que hablemos diez minutos de nuestra familia.” — quiere que + subjuntivo (hablemos).',
          },
          {
            id: 'es.d.29-q3',
            prompt: 'Co Diego robi jutro?',
            options: ['Ma egzamin', 'Jedzie z rodzeństwem na plażę', 'Cały dzień pracuje'],
            answer: 1,
            explanation: '„Mañana voy a la playa con mis hermanos. ¡Ojalá haga sol!”',
          },
        ],
      },
      summary: [
        'Subjuntivo: forma „yo” bez -o + końcówki z zamienioną samogłoską — hable, coma, viva; tenga, haga, venga.',
        'Nieregularne: sea, vaya, haya, sepa, esté, dé; wymiana samogłoski poza nosotros — pueda, ale podamos.',
        'Quiero que, espero que, ojalá + subjuntivo: Quiero que vengas. Espero que estés bien. ¡Ojalá haga sol!',
        'Życzenia z que: ¡Que tengas suerte! ¡Que aproveche! ¡Que lo pases bien!',
      ],
      followUp:
        'Za kilka minut powtórz sześć nieregularnych form: sea, vaya, haya, sepa, esté, dé. W następnej lekcji użyjesz subjuntivo w radach i uczuciach: te recomiendo que…, me alegra que…',
    },
    {
      id: 'es.l30',
      title: 'Rady, konieczność i uczucia',
      subtitle: 'Te recomiendo que descanses',
      objective:
        'Doradzisz komuś (te recomiendo que…), powiesz, co jest ważne albo konieczne (es importante que…), wyrazisz radość, irytację i żal (me alegra que…, me molesta que…, siento que…) i wybierzesz między bezokolicznikiem a subjuntivo.',
      level: 'B1',
      minutes: 12,
      items: [
        verb('recomendar', 'recomendar', 'polecać; radzić', {
          plAlts: ['polecić', 'doradzać', 'doradzić', 'zalecać', 'rekomendować'],
          note: 'e → ie: recomiendo, recomiendas. Te recomiendo que vayas en tren. — Radzę ci jechać pociągiem. O rzeczach: Te recomiendo esta película. — Polecam ci ten film.',
        }),
        verb('aconsejar', 'aconsejar', 'radzić; doradzać', {
          plAlts: ['poradzić', 'doradzić'],
          note: 'Od el consejo (rada): Te aconsejo que descanses. — Radzę ci odpocząć. Brzmi nieco poważniej niż recomendar — tak mówi na przykład lekarz.',
        }),
        phrase('es-importante-que', 'es importante que…', 'ważne, żeby…', {
          plAlts: ['to ważne, żeby…', 'ważne jest, żeby…', 'ważne, aby…'],
          note: 'Ocena + que + subjuntivo: Es importante que duermas bien. — Ważne, żebyś się wysypiał / wysypiała. Ogólnie, bez konkretnej osoby — bezokolicznik: Es importante dormir bien.',
        }),
        phrase('es-necesario-que', 'es necesario que…', 'trzeba, żeby…; musisz…', {
          plAlts: ['konieczne jest, żeby…', 'konieczne, żeby…', 'potrzeba, żeby…'],
          note: 'No es necesario que vengas. — Nie musisz przychodzić. W Hiszpanii w tym samym znaczeniu często słychać hace falta que…: No hace falta que vengas.',
        }),
        phrase('es-mejor-que', 'es mejor que…', 'lepiej, żeby…', {
          plAlts: ['lepiej, żebyś…', 'będzie lepiej, jeśli…', 'lepiej będzie, żeby…'],
          note: 'Es mejor que no salgas hoy. — Lepiej, żebyś dziś nie wychodził / wychodziła. Bez konkretnej osoby: Es mejor esperar. — Lepiej poczekać.',
        }),
        phrase('me-alegra-que', 'me alegra que…', 'cieszę się, że…', {
          plAlts: ['cieszy mnie, że…', 'miło mi, że…'],
          note: 'Działa jak gustar — dosłownie „cieszy mnie, że…”. Po que stoi subjuntivo, choć mówimy o fakcie: Me alegra que estés aquí. — Cieszę się, że tu jesteś. Można też powiedzieć me alegro de que…',
        }),
        phrase('me-molesta-que', 'me molesta que…', 'denerwuje mnie, że…; przeszkadza mi, że…', {
          plAlts: ['irytuje mnie, że…', 'wkurza mnie, że…', 'nie podoba mi się, że…'],
          note: 'Pułapka: molestar to „przeszkadzać, denerwować”, a nie „molestować”. ¿Te molesta la música? — Przeszkadza ci muzyka? Odmiana jak gustar: me molesta, te molesta, le molesta…',
        }),
        phrase('siento-que', 'siento que…', 'przykro mi, że…', {
          plAlts: ['żałuję, że…', 'szkoda, że…'],
          note: 'Od sentir — ten sam czasownik co w lo siento. Z subjuntivo wyraża żal: Siento que estés enfermo. — Przykro mi, że jesteś chory. Ze zwykłym czasem znaczy „czuję, że…”: Siento que algo no va bien.',
        }),
        word('preocupado', 'preocupado / preocupada', 'zmartwiony / zmartwiona', {
          pos: 'adj',
          tts: 'preocupado, preocupada',
          alts: ['preocupado', 'preocupada'],
          plAlts: ['zmartwiony', 'zmartwiona', 'zaniepokojony', 'zaniepokojona'],
          note: 'Z estar: Estoy preocupada por ti. — Martwię się o ciebie. Me preocupa que… (martwi mnie, że…) też łączy się z subjuntivo.',
        }),
        word('contento', 'contento / contenta', 'zadowolony / zadowolona', {
          pos: 'adj',
          tts: 'contento, contenta',
          alts: ['contento', 'contenta'],
          plAlts: ['zadowolony', 'zadowolona', 'szczęśliwy', 'szczęśliwa'],
          note: 'Z estar: Estoy muy contenta con mi trabajo. — Jestem bardzo zadowolona z pracy. Estoy contento de que vengas. — Cieszę się, że przyjdziesz.',
        }),
        word('tranquilo', 'tranquilo / tranquila', 'spokojny / spokojna', {
          pos: 'adj',
          tts: 'tranquilo, tranquila',
          alts: ['tranquilo', 'tranquila'],
          plAlts: ['spokojny', 'spokojna', 'spokojnie'],
          note: 'Samo ¡Tranquilo! / ¡Tranquila! znaczy „Spokojnie!”, „Nie martw się!”. Un pueblo tranquilo — spokojne miasteczko.',
        }),
        phrase('no-te-preocupes', 'no te preocupes', 'nie martw się', {
          plAlts: ['nie przejmuj się', 'spokojnie', 'bez obaw'],
          note: 'Przeczący rozkaz od preocuparse (martwić się) — forma subjuntivo z zaimkiem przed czasownikiem. Do pana / pani: no se preocupe; do kilku osób w Meksyku: no se preocupen.',
        }),
      ],
      sentences: [
        s('30-1', 'Te recomiendo que vayas en tren.', 'Radzę ci pojechać pociągiem.', {
          plAlts: ['Radzę ci jechać pociągiem.', 'Polecam ci jechać pociągiem.', 'Radzę ci, żebyś pojechał pociągiem.', 'Radzę ci, żebyś pojechała pociągiem.'],
        }),
        s('30-2', 'Es importante que duermas ocho horas.', 'Ważne, żebyś spał / spała osiem godzin.', {
          plAlts: [
            'Ważne, żebyś spał osiem godzin.',
            'Ważne, żebyś spała osiem godzin.',
            'To ważne, żebyś spał osiem godzin.',
            'To ważne, żebyś spała osiem godzin.',
            'Ważne jest, żebyś spał osiem godzin.',
            'Ważne jest, żebyś spała osiem godzin.',
          ],
          note: 'Dormir: duermo → duerma, duermas, ale w formie „nosotros” o → u: durmamos.',
        }),
        s('30-3', 'Me alegra que estés aquí.', 'Cieszę się, że tu jesteś.', {
          plAlts: ['Cieszę się, że jesteś tutaj.', 'Cieszy mnie, że tu jesteś.', 'Miło mi, że tu jesteś.'],
          accent: 'es-MX',
        }),
        s('30-4', 'Me molesta que llegues tarde.', 'Denerwuje mnie, że się spóźniasz.', {
          plAlts: ['Przeszkadza mi, że się spóźniasz.', 'Irytuje mnie, że się spóźniasz.', 'Wkurza mnie, że się spóźniasz.', 'Denerwuje mnie, kiedy się spóźniasz.'],
          note: 'Llegar → llegue, llegues: g → gu przed e, żeby zachować wymowę „g”.',
        }),
        s('30-5', 'Siento que no puedas venir a la fiesta.', 'Przykro mi, że nie możesz przyjść na imprezę.', {
          plAlts: ['Szkoda, że nie możesz przyjść na imprezę.', 'Przykro mi, że nie możesz przyjść na przyjęcie.', 'Żałuję, że nie możesz przyjść na imprezę.'],
          accent: 'es-MX',
        }),
        s('30-6', 'Quiero ir, pero mis padres no quieren que vaya.', 'Chcę iść, ale rodzice nie chcą, żebym poszedł / poszła.', {
          plAlts: [
            'Chcę iść, ale rodzice nie chcą, żebym poszedł.',
            'Chcę iść, ale rodzice nie chcą, żebym poszła.',
            'Chcę iść, ale moi rodzice nie chcą, żebym poszedł.',
            'Chcę iść, ale moi rodzice nie chcą, żebym poszła.',
            'Chcę pojechać, ale rodzice nie chcą, żebym pojechał.',
            'Chcę pojechać, ale rodzice nie chcą, żebym pojechała.',
          ],
          note: 'Quiero ir — chcę ja i idę ja, więc bezokolicznik. No quieren que vaya — nie chcą rodzice, a iść miałbym / miałabym ja, więc subjuntivo.',
        }),
        s('30-7', 'No te preocupes, todo va a salir bien.', 'Nie martw się, wszystko się uda.', {
          plAlts: ['Nie martw się, wszystko będzie dobrze.', 'Nie przejmuj się, wszystko się uda.', 'Nie martw się, wszystko pójdzie dobrze.'],
          accent: 'es-MX',
        }),
        s('30-8', 'Les aconsejo que lleguen temprano.', 'Radzę wam przyjść wcześnie.', {
          plAlts: ['Radzę państwu przyjść wcześnie.', 'Radzę wam, żebyście przyszli wcześnie.', 'Radzę wam przyjechać wcześnie.', 'Radzę państwu przyjechać wcześnie.'],
          note: 'W Meksyku ustedes to i „wy”, i „państwo” — stąd les i lleguen.',
          accent: 'es-MX',
        }),
        s('30-9', 'Es mejor que no salgas hoy: hace mucho frío.', 'Lepiej, żebyś dziś nie wychodził / wychodziła: jest bardzo zimno.', {
          plAlts: [
            'Lepiej, żebyś dziś nie wychodził: jest bardzo zimno.',
            'Lepiej, żebyś dziś nie wychodziła: jest bardzo zimno.',
            'Lepiej dziś nie wychodź: jest bardzo zimno.',
            'Lepiej dziś nie wychodź, jest bardzo zimno.',
          ],
        }),
      ],
      grammar: [
        {
          id: 'es.g.subjuntivo-consejos',
          title: 'Rady, ocena i uczucia + subjuntivo',
          body: [
            'Subjuntivo pojawia się po czasownikach, którymi **wpływamy na innych** — radzimy, polecamy, prosimy: [[Te recomiendo que descanses.]] — Radzę ci odpocząć. [[Les aconsejo que lleguen temprano.]] Zaimek (te, le, les) mówi, komu radzimy, a forma po que — kto ma działać.',
            'Tak samo po **ocenach**: [[es importante que]], [[es necesario que]], [[es mejor que]]: [[Es importante que duermas bien.]] Gdy mówimy ogólnie, bez konkretnej osoby, wystarczy bezokolicznik: [[Es importante dormir bien.]]',
            'Subjuntivo wyraża też **uczucia wobec faktów** — nawet gdy fakt jest pewny: [[Me alegra que estés aquí.]] (cieszę się, że jesteś), [[Me molesta que llegues tarde.]] (denerwuje mnie, że się spóźniasz), [[Me preocupa que no comas.]] (martwi mnie, że nie jesz), [[Siento que estés enfermo.]] (przykro mi, że jesteś chory).',
            'Me alegra, me molesta i me preocupa odmieniają się jak gustar: [[te alegra]], [[le molesta]], [[nos preocupa]].',
          ],
          table: {
            head: ['Funkcja', 'Wyrażenie', 'Przykład'],
            rows: [
              ['rada', 'te recomiendo / te aconsejo que', 'Te recomiendo que vayas en tren.'],
              ['konieczność', 'es necesario que', 'Es necesario que estudies más.'],
              ['ocena', 'es importante / es mejor que', 'Es mejor que no salgas hoy.'],
              ['radość', 'me alegra que', 'Me alegra que estés aquí.'],
              ['irytacja', 'me molesta que', 'Me molesta que llegues tarde.'],
              ['niepokój', 'me preocupa que', 'Me preocupa que no comas.'],
              ['żal', 'siento que', 'Siento que estés enfermo.'],
            ],
          },
          contrast:
            'Po polsku po „cieszę się, że” i „przykro mi, że” stoi zwykły czas: cieszę się, że jesteś. Hiszpański wymaga w tym miejscu subjuntivo (me alegra que estés), bo liczy się nasze uczucie, a nie sama informacja. Rady po polsku często wyrażamy bezokolicznikiem — „radzę ci odpocząć” — a po hiszpańsku zwykle przez que + subjuntivo: te recomiendo que descanses.',
        },
        {
          id: 'es.g.infinitivo-subjuntivo',
          title: 'Quiero ir czy quiero que vayas?',
          body: [
            'Najważniejsza zasada: subjuntivo pojawia się, gdy w zdaniu są **dwie różne osoby** — jedna chce, radzi albo czuje, a druga działa: [[Quiero que vayas.]] — Chcę, żebyś (ty) poszedł / poszła.',
            'Gdy osoba jest **ta sama**, używamy bezokolicznika, bez que: [[Quiero ir.]] — Chcę iść. [[Espero volver pronto.]] — Mam nadzieję, że niedługo wrócę. [[Prefiero cocinar yo.]] — Wolę ugotować sam / sama.',
            'Przy ocenach bezokolicznik oznacza zasadę ogólną: [[Es necesario estudiar.]] — Trzeba się uczyć. Gdy chodzi o konkretną osobę, pojawia się que + subjuntivo: [[Es necesario que estudies.]] — Musisz się uczyć.',
            'Przy uczuciach jest tak samo: [[Me alegra verte.]] — Cieszę się, że cię widzę (cieszę się ja i widzę ja). [[Me alegra que vengas.]] — Cieszę się, że przyjdziesz (przychodzisz ty).',
          ],
          table: {
            head: ['Ta sama osoba → bezokolicznik', 'Inna osoba → que + subjuntivo'],
            rows: [
              ['Quiero ir.', 'Quiero que vayas.'],
              ['Espero volver pronto.', 'Espero que vuelvas pronto.'],
              ['Prefiero cocinar yo.', 'Prefiero que cocines tú.'],
              ['Me alegra verte.', 'Me alegra que vengas.'],
              ['Es mejor no salir.', 'Es mejor que no salgas.'],
            ],
          },
          contrast:
            'Po polsku jest podobnie: „chcę iść” (bezokolicznik), ale „chcę, żebyś poszedł” (żeby + forma osobowa). Jeśli po polsku potrzebujesz „żeby” i innej osoby, po hiszpańsku potrzebujesz que + subjuntivo. Typowy błąd: „quiero que voy” zamiast quiero ir — gdy chodzi o ciebie samego, que w ogóle nie jest potrzebne.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'es.x.30-1',
          concept: 'es.g.subjuntivo-consejos',
          sentence: 'Te recomiendo que ___ esta película.',
          pl: 'Polecam ci obejrzeć ten film.',
          options: ['ves', 'veas', 'ver'],
          answer: 'veas',
          explanation: 'Radzimy komuś innemu → que + subjuntivo. Ver: veo → vea → veas. Ves to zwykły czas teraźniejszy.',
        },
        {
          type: 'gap',
          id: 'es.x.30-2',
          concept: 'es.g.subjuntivo-consejos',
          sentence: 'Me alegra que ___ mejor.',
          pl: 'Cieszę się, że czujesz się lepiej.',
          options: ['estás', 'estés', 'estar'],
          answer: 'estés',
          explanation: 'Po me alegra que → subjuntivo, nawet gdy mówimy o fakcie: estés. Po polsku „cieszę się, że jesteś” — zwykły czas.',
        },
        {
          type: 'gap',
          id: 'es.x.30-3',
          concept: 'es.g.subjuntivo-consejos',
          sentence: 'Es importante que ___ la verdad.',
          pl: 'Ważne, żebyś powiedziała prawdę.',
          options: ['dices', 'digas', 'decir'],
          answer: 'digas',
          explanation: 'Es importante que + konkretna osoba → subjuntivo: digas (od digo). Bezokolicznik pasuje bez que: es importante decir la verdad.',
        },
        {
          type: 'gap',
          id: 'es.x.30-4',
          concept: 'es.g.infinitivo-subjuntivo',
          sentence: 'Quiero ___ al cine esta noche.',
          pl: 'Chcę iść dziś wieczorem do kina.',
          options: ['ir', 'que vaya', 'vaya'],
          answer: 'ir',
          explanation: 'Chcę ja i idę ja — ta sama osoba, więc bezokolicznik: quiero ir. „Quiero que vaya” znaczyłoby „chcę, żeby on / ona poszedł / poszła”.',
        },
        {
          type: 'gap',
          id: 'es.x.30-5',
          concept: 'es.g.infinitivo-subjuntivo',
          sentence: 'Mis padres prefieren que ___ en casa.',
          pl: 'Rodzice wolą, żebym jadł w domu.',
          options: ['como', 'coma', 'comer'],
          answer: 'coma',
          explanation: 'Wolą rodzice, a jem ja — dwie różne osoby, więc que + subjuntivo: coma.',
        },
        {
          type: 'choice',
          id: 'es.x.30-6',
          concept: 'es.g.infinitivo-subjuntivo',
          prompt: 'Jak powiesz: „Cieszę się, że cię widzę”?',
          options: ['Me alegra verte.', 'Me alegra que te veo.', 'Me alegra que te vea.'],
          answer: 0,
          explanation: 'Cieszę się ja i widzę ja — ta sama osoba, więc bezokolicznik: me alegra verte. „Que te veo” to błąd, a „que te vea” znaczyłoby, że cię widzi ktoś inny.',
        },
        {
          type: 'choice',
          id: 'es.x.30-7',
          concept: 'es.g.subjuntivo-consejos',
          optionsLang: 'pl',
          prompt: 'Co znaczy „Siento que estés enfermo”?',
          options: ['Czuję, że jesteś chory.', 'Przykro mi, że jesteś chory.', 'Myślę, że jesteś chory.'],
          answer: 1,
          explanation: 'Siento que + subjuntivo (estés) wyraża żal: „przykro mi, że…”. Ze zwykłym czasem siento que znaczy „czuję, że…”.',
        },
      ],
      dialogue: {
        id: 'es.d.30',
        title: 'U lekarki',
        context: 'Tomasz od roku pracuje w Monterrey. Od kilku tygodni źle się czuje, więc idzie do lekarki, doktor Ramírez.',
        speakers: {
          R: { name: 'Doktor Ramírez', voice: 'a', accent: 'es-MX' },
          T: { name: 'Tomasz', voice: 'b', accent: 'es-ES' },
        },
        lines: [
          { speaker: 'R', text: 'Buenos días. ¿Qué le pasa?', pl: 'Dzień dobry. Co panu dolega?' },
          {
            speaker: 'T',
            text: 'Estoy muy cansado y me duele mucho la cabeza. Trabajo doce horas todos los días.',
            pl: 'Jestem bardzo zmęczony i bardzo boli mnie głowa. Codziennie pracuję po dwanaście godzin.',
          },
          { speaker: 'R', text: 'Me preocupa que trabaje tanto. Es importante que descanse más.', pl: 'Martwi mnie, że pan tyle pracuje. Ważne, żeby pan więcej odpoczywał.' },
          { speaker: 'T', text: 'Lo sé, pero tengo mucho trabajo. ¿Qué me recomienda?', pl: 'Wiem, ale mam dużo pracy. Co mi pani radzi?' },
          { speaker: 'R', text: 'Le recomiendo que duerma ocho horas y que no tome tanto café.', pl: 'Radzę panu spać osiem godzin i nie pić tyle kawy.' },
          { speaker: 'T', text: 'Pero me encanta el café…', pl: 'Ale ja uwielbiam kawę…' },
          {
            speaker: 'R',
            text: 'Un café por la mañana está bien. Y es mejor que vaya al trabajo a pie.',
            pl: 'Jedna kawa rano jest w porządku. I lepiej, żeby pan chodził do pracy pieszo.',
          },
          { speaker: 'T', text: 'Muchas gracias, doctora. Me alegra que no sea nada malo.', pl: 'Bardzo dziękuję, pani doktor. Cieszę się, że to nic złego.' },
          { speaker: 'R', text: 'No se preocupe. Y vuelva dentro de dos semanas.', pl: 'Proszę się nie martwić. I proszę przyjść znowu za dwa tygodnie.' },
        ],
        questions: [
          {
            id: 'es.d.30-q1',
            prompt: 'Co dolega Tomaszowi?',
            options: ['Boli go brzuch', 'Jest bardzo zmęczony i boli go głowa', 'Ma gorączkę'],
            answer: 1,
            explanation: '„Estoy muy cansado y me duele mucho la cabeza.”',
          },
          {
            id: 'es.d.30-q2',
            prompt: 'Co radzi lekarka?',
            options: ['Spać osiem godzin i pić mniej kawy', 'Pracować w domu', 'Wziąć urlop'],
            answer: 0,
            explanation: '„Le recomiendo que duerma ocho horas y que no tome tanto café.” — recomendar que + subjuntivo.',
          },
          {
            id: 'es.d.30-q3',
            prompt: 'Jak Tomasz ma chodzić do pracy?',
            options: ['Jeździć autobusem', 'Chodzić pieszo', 'Jeździć pociągiem'],
            answer: 1,
            explanation: '„Es mejor que vaya al trabajo a pie.” — es mejor que + subjuntivo (vaya).',
          },
        ],
      },
      summary: [
        'Rady i konieczność + subjuntivo: te recomiendo que…, te aconsejo que…, es importante / necesario / mejor que…',
        'Uczucia + subjuntivo: me alegra que…, me molesta que…, me preocupa que…, siento que…',
        'Ta sama osoba → bezokolicznik (quiero ir, me alegra verte); inna osoba → que + subjuntivo (quiero que vayas, me alegra que vengas).',
      ],
      followUp:
        'Za kilka minut powtórz pary: quiero ir / quiero que vayas, me alegra verte / me alegra que vengas. W następnej lekcji wyrazisz opinię i nauczysz się dyskutować: creo que…, no creo que…',
    },
    {
      id: 'es.l31',
      title: 'Opinie i dyskusja',
      subtitle: 'No creo que sea tan fácil',
      objective:
        'Wyrazisz i uzasadnisz opinię, zgodzisz się albo nie zgodzisz z rozmówcą i połączysz argumenty słowami además, por eso, sin embargo, en cambio i aunque; będziesz wiedzieć, kiedy po creo que stoi zwykły czas, a kiedy subjuntivo.',
      level: 'B1',
      minutes: 13,
      items: [
        verb('creer', 'creer', 'sądzić; wierzyć', {
          plAlts: ['myśleć', 'uważać', 'uwierzyć'],
          note: 'Creo que… — myślę, że…, sądzę, że… Wierzyć komuś: Te creo. — Wierzę ci. W indefinido i zmienia się w y: creyó, creyeron.',
        }),
        verb('pensar', 'pensar', 'myśleć; sądzić', {
          plAlts: ['uważać', 'pomyśleć', 'zamierzać'],
          note: 'e → ie: pienso, piensas. Pienso que… = creo que… Pensar en algo — myśleć o czymś: Pienso en ti. Pensar + bezokolicznik — zamierzać: Pienso viajar en agosto.',
        }),
        phrase('en-mi-opinion', 'en mi opinión', 'moim zdaniem', {
          plAlts: ['według mnie', 'w mojej opinii', 'jak dla mnie'],
          note: 'Bez que: En mi opinión, es caro. Krócej: para mí… — dla mnie… Pytanie o zdanie: ¿Qué opinas? albo ¿Qué piensas? — Co o tym sądzisz?',
        }),
        phrase('estoy-de-acuerdo', 'estoy de acuerdo', 'zgadzam się', {
          plAlts: ['zgoda', 'jestem tego samego zdania'],
          note: 'Zawsze z estar: Estoy de acuerdo contigo. — Zgadzam się z tobą (contigo — z tobą, conmigo — ze mną). No estoy de acuerdo — nie zgadzam się. ¿De acuerdo? — Zgoda? Pułapka: me acuerdo znaczy „pamiętam”.',
        }),
        word('depende', 'depende', 'to zależy', {
          pos: 'verb',
          plAlts: ['zależy', 'zależy od'],
          note: 'Od depender (zależeć). Często jako cała odpowiedź: —¿Vienes a la playa? —Depende. Zależy od czegoś — depende de: Depende del tiempo. — Zależy od pogody.',
        }),
        phrase('tener-razon', 'tener razón', 'mieć rację', {
          plAlts: ['mieć słuszność'],
          note: 'Tienes razón. — Masz rację. No tienes razón. — Nie masz racji. La razón to także „powód”: por esa razón — z tego powodu.',
        }),
        word('aunque', 'aunque', 'chociaż; mimo że', {
          pos: 'conj',
          plAlts: ['choć', 'pomimo że', 'nawet jeśli'],
          note: 'Aunque es caro, me gusta. — Chociaż jest drogi, podoba mi się. Z subjuntivo znaczy „nawet jeśli”: Aunque llueva, iré. — Nawet jeśli będzie padać, pójdę.',
        }),
        phrase('sin-embargo', 'sin embargo', 'jednak; jednakże', {
          plAlts: ['mimo to', 'niemniej'],
          note: 'Łączy dwa zdania o przeciwnej wymowie, zwykle po kropce albo średniku i z przecinkiem: Es caro. Sin embargo, lo compro. W mowie potocznej częściej słychać po prostu pero.',
        }),
        phrase('por-eso', 'por eso', 'dlatego', {
          plAlts: ['z tego powodu', 'więc', 'przez to'],
          note: 'Wprowadza skutek: Estoy cansado; por eso no salgo. — Jestem zmęczony, dlatego nie wychodzę. Nie myl z ¿por qué? (dlaczego?) i porque (bo, ponieważ).',
        }),
        word('ademas', 'además', 'poza tym; ponadto', {
          pos: 'adv',
          plAlts: ['oprócz tego', 'w dodatku', 'na dodatek'],
          note: 'Dorzuca kolejny argument: Es barato y, además, está cerca. — Jest tani, a poza tym blisko. Además de — oprócz: además de español, hablo inglés.',
        }),
        phrase('en-cambio', 'en cambio', 'natomiast; za to', {
          plAlts: ['z kolei', 'zaś', 'a z kolei'],
          note: 'Przeciwstawia dwie osoby albo rzeczy: Yo trabajo mucho; mi hermano, en cambio, no. — Ja dużo pracuję, natomiast mój brat nie.',
        }),
        noun('la-gente', 'la gente', 'ludzie', 'f', {
          note: 'Pułapka: la gente to rzeczownik żeński w liczbie pojedynczej, więc czasownik też stoi w liczbie pojedynczej: La gente dice que… — Ludzie mówią, że… Mucha gente — wiele osób, dużo ludzi.',
        }),
        phrase('creo-que-si', 'creo que sí', 'chyba tak; myślę, że tak', {
          plAlts: ['sądzę, że tak', 'raczej tak', 'tak mi się wydaje'],
          note: 'Krótka odpowiedź bez czasownika: —¿Viene Ana? —Creo que sí. Przeczenie: creo que no — chyba nie.',
        }),
      ],
      sentences: [
        s('31-1', 'Mucha gente piensa que el español es fácil.', 'Wiele osób uważa, że hiszpański jest łatwy.', {
          plAlts: [
            'Wielu ludzi uważa, że hiszpański jest łatwy.',
            'Dużo ludzi myśli, że hiszpański jest łatwy.',
            'Dużo ludzi uważa, że hiszpański jest łatwy.',
            'Wiele osób myśli, że hiszpański jest łatwy.',
          ],
        }),
        s('31-2', 'No creo que sea tan difícil.', 'Nie sądzę, żeby to było takie trudne.', {
          plAlts: [
            'Nie wydaje mi się, żeby to było takie trudne.',
            'Nie sądzę, żeby to było aż tak trudne.',
            'Nie sądzę, żeby to było tak trudne.',
            'Nie myślę, żeby to było takie trudne.',
          ],
          accent: 'es-MX',
        }),
        s('31-3', 'En mi opinión, el tren es mejor y, además, es más barato.', 'Moim zdaniem pociąg jest lepszy, a poza tym tańszy.', {
          plAlts: [
            'Według mnie pociąg jest lepszy, a poza tym jest tańszy.',
            'Moim zdaniem pociąg jest lepszy i do tego tańszy.',
            'Moim zdaniem pociąg jest lepszy, a w dodatku tańszy.',
            'Moim zdaniem pociąg jest lepszy, a poza tym jest tańszy.',
          ],
        }),
        s('31-4', 'No estoy de acuerdo contigo.', 'Nie zgadzam się z tobą.', {
          plAlts: ['Ja się z tobą nie zgadzam.', 'Nie jestem tego samego zdania co ty.'],
          accent: 'es-MX',
        }),
        s('31-5', 'Tienes razón, es mejor esperar.', 'Masz rację, lepiej poczekać.', {
          plAlts: ['Masz rację: lepiej poczekać.', 'Masz rację, lepiej zaczekać.', 'Masz rację, lepiej jest poczekać.'],
          accent: 'es-MX',
        }),
        s('31-6', 'Aunque llueve, vamos a la playa.', 'Chociaż pada, idziemy na plażę.', {
          plAlts: ['Mimo że pada, idziemy na plażę.', 'Chociaż pada deszcz, idziemy na plażę.', 'Choć pada, idziemy na plażę.', 'Chociaż pada, jedziemy na plażę.'],
          note: 'Llueve w trybie oznajmującym, bo deszcz to fakt — właśnie pada. Aunque llueva znaczyłoby „nawet jeśli będzie padać”.',
        }),
        s('31-7', 'Estoy cansada; por eso no salgo esta noche.', 'Jestem zmęczona, dlatego dziś wieczorem nie wychodzę.', {
          plAlts: [
            'Jestem zmęczona; dlatego dziś wieczorem nie wychodzę.',
            'Jestem zmęczona, więc dziś wieczorem nie wychodzę.',
            'Jestem zmęczona, dlatego nie wychodzę dziś wieczorem.',
          ],
        }),
        s('31-8', 'El hotel es caro; sin embargo, está muy cerca de la estación.', 'Hotel jest drogi, jednak jest bardzo blisko dworca.', {
          plAlts: ['Hotel jest drogi; jednak jest bardzo blisko dworca.', 'Hotel jest drogi, ale za to jest bardzo blisko dworca.', 'Hotel jest drogi, jednakże jest bardzo blisko dworca.'],
        }),
        s('31-9', 'Mi hermano vive en la ciudad; yo, en cambio, prefiero el pueblo.', 'Mój brat mieszka w mieście, ja natomiast wolę wieś.', {
          plAlts: [
            'Mój brat mieszka w mieście, a ja wolę wieś.',
            'Mój brat mieszka w mieście, natomiast ja wolę wieś.',
            'Mój brat mieszka w mieście, ja za to wolę miasteczko.',
            'Mój brat mieszka w mieście, a ja wolę miasteczko.',
          ],
          accent: 'es-MX',
        }),
      ],
      grammar: [
        {
          id: 'es.g.creo-que',
          title: 'Creo que es… / No creo que sea…',
          body: [
            'Gdy **twierdzimy**, że coś jest prawdą, po [[creo que]] i [[pienso que]] stoi zwykły tryb oznajmujący: [[Creo que tienes razón.]] — Myślę, że masz rację. [[Pienso que es caro.]] — Uważam, że to drogie.',
            'Gdy **zaprzeczamy** albo wątpimy, pojawia się subjuntivo: [[No creo que tengas razón.]] — Nie sądzę, żebyś miał / miała rację. [[No pienso que sea caro.]] — Nie uważam, żeby to było drogie.',
            'Krótkie odpowiedzi nie mają czasownika: [[creo que sí]] (chyba tak), [[creo que no]] (chyba nie). Opinię bez que wprowadzają [[en mi opinión]] i [[para mí]]: [[En mi opinión, es caro.]]',
            'Zgoda i niezgoda: [[Estoy de acuerdo.]], [[No estoy de acuerdo contigo.]], [[Tienes razón.]], a gdy odpowiedź nie jest prosta — [[Depende.]]',
          ],
          table: {
            head: ['Twierdzę → oznajmujący', 'Zaprzeczam → subjuntivo'],
            rows: [
              ['Creo que es fácil.', 'No creo que sea fácil.'],
              ['Pienso que viene.', 'No pienso que venga.'],
              ['Creo que tienes razón.', 'No creo que tengas razón.'],
              ['Creo que hay tiempo.', 'No creo que haya tiempo.'],
            ],
          },
          contrast:
            'Polski robi to samo słowem „żeby”: „myślę, że przyjdzie”, ale „nie sądzę, żeby przyszedł”. Gdzie po polsku po „nie sądzę” albo „nie wydaje mi się” pasuje „żeby”, tam po hiszpańsku stoi subjuntivo. Polskie „zgadzam się” to estoy de acuerdo — z estar i bez żadnego „się”.',
        },
        {
          id: 'es.g.conectores',
          title: 'Además, por eso, sin embargo, en cambio, aunque',
          body: [
            'Łączniki porządkują wypowiedź — bez nich trudno o dobrą dyskusję. [[además]] dodaje argument: [[Es barato y, además, está cerca.]] [[por eso]] wprowadza skutek: [[Llueve; por eso no salgo.]]',
            '[[sin embargo]] (jednak) i [[en cambio]] (natomiast) przeciwstawiają. Sin embargo znaczy „mimo to”: [[Es caro; sin embargo, lo compro.]] En cambio porównuje dwie osoby albo rzeczy: [[Yo trabajo mucho; mi hermano, en cambio, no.]]',
            '[[aunque]] (chociaż) ze zwykłym czasem mówi o fakcie: [[Aunque llueve, salgo.]] — Chociaż pada, wychodzę. Z subjuntivo — o tym, co możliwe: [[Aunque llueva, saldré.]] — Nawet jeśli będzie padać, wyjdę.',
            'Sin embargo, además i en cambio zwykle oddzielamy przecinkami, a przed sin embargo i por eso często stawiamy kropkę albo średnik.',
          ],
          table: {
            head: ['Łącznik', 'Po polsku', 'Funkcja', 'Przykład'],
            rows: [
              ['además', 'poza tym', 'dodaje argument', 'Es barato y, además, está cerca.'],
              ['por eso', 'dlatego', 'skutek', 'Llueve; por eso no salgo.'],
              ['sin embargo', 'jednak', 'kontrast', 'Es caro; sin embargo, lo compro.'],
              ['en cambio', 'natomiast', 'porównanie', 'Yo trabajo; él, en cambio, no.'],
              ['aunque', 'chociaż', 'ustępstwo', 'Aunque llueve, salgo.'],
            ],
          },
          contrast:
            'Polskie „chociaż” łączy się ze zwykłym czasem, a „nawet jeśli” — często z przyszłym. Hiszpańskie aunque rozróżnia te znaczenia trybem: aunque llueve (pada — to fakt) i aunque llueva (nawet jeśli będzie padać). Por eso to dosłownie „przez to”, ale znaczy po prostu „dlatego”.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'es.x.31-1',
          concept: 'es.g.creo-que',
          sentence: 'Creo que Pablo ___ razón.',
          pl: 'Myślę, że Pablo ma rację.',
          options: ['tiene', 'tenga', 'tener'],
          answer: 'tiene',
          explanation: 'Creo que (twierdzenie) → zwykły tryb oznajmujący: tiene. Tenga pojawiłoby się po no creo que.',
        },
        {
          type: 'gap',
          id: 'es.x.31-2',
          concept: 'es.g.creo-que',
          sentence: 'No creo que ___ tan caro.',
          pl: 'Nie sądzę, żeby to było aż tak drogie.',
          options: ['es', 'sea', 'está'],
          answer: 'sea',
          explanation: 'No creo que → subjuntivo: sea. Podpowiedź: po polsku mówimy „nie sądzę, żeby…”.',
        },
        {
          type: 'gap',
          id: 'es.x.31-3',
          concept: 'es.g.creo-que',
          sentence: 'No ___ de acuerdo contigo.',
          pl: 'Nie zgadzam się z tobą.',
          options: ['soy', 'estoy', 'tengo'],
          answer: 'estoy',
          explanation: 'Zgadzać się to estar de acuerdo — zawsze z estar.',
        },
        {
          type: 'gap',
          id: 'es.x.31-4',
          concept: 'es.g.conectores',
          sentence: 'Estoy enfermo; ___ no voy a clase.',
          pl: 'Jestem chory, dlatego nie idę na zajęcia.',
          options: ['por eso', 'aunque', 'en cambio'],
          answer: 'por eso',
          explanation: 'Skutek → por eso (dlatego). Aunque znaczy „chociaż”, a en cambio — „natomiast”.',
        },
        {
          type: 'gap',
          id: 'es.x.31-5',
          concept: 'es.g.conectores',
          sentence: '___ estoy cansada, voy a ir a la fiesta.',
          pl: 'Chociaż jestem zmęczona, pójdę na imprezę.',
          options: ['Aunque', 'Por eso', 'Además'],
          answer: 'Aunque',
          explanation: 'Ustępstwo („chociaż”) → aunque. Zmęczenie to fakt, więc stoi zwykły czas: estoy.',
        },
        {
          type: 'choice',
          id: 'es.x.31-6',
          concept: 'es.g.conectores',
          prompt: 'Jak powiesz: „Ja lubię morze, moja siostra natomiast woli góry”?',
          options: [
            'A mí me gusta el mar; mi hermana, en cambio, prefiere la montaña.',
            'A mí me gusta el mar; por eso mi hermana prefiere la montaña.',
            'A mí me gusta el mar; además, mi hermana prefiere la montaña.',
          ],
          answer: 0,
          explanation: 'Porównujemy dwie osoby → en cambio (natomiast). Por eso znaczyłoby, że siostra woli góry, bo ja lubię morze, a además tylko dorzuca informację.',
        },
        {
          type: 'choice',
          id: 'es.x.31-7',
          concept: 'es.g.creo-que',
          optionsLang: 'pl',
          prompt: 'Co znaczy „No creo que venga”?',
          options: ['Nie sądzę, żeby przyszedł.', 'Wiem, że nie przyjdzie.', 'Nie wierzę, że przyszedł.'],
          answer: 0,
          explanation: 'No creo que + subjuntivo (venga) wyraża wątpliwość: „nie sądzę, żeby przyszedł / przyszła”. Venga może dotyczyć teraźniejszości albo przyszłości.',
        },
      ],
      dialogue: {
        id: 'es.d.31',
        title: 'Miasto czy wieś?',
        context: 'Sara z Madrytu postanowiła przeprowadzić się do małej miejscowości w górach. Jej kolega Óscar z Meksyku nie jest przekonany.',
        speakers: {
          O: { name: 'Óscar', voice: 'b', accent: 'es-MX' },
          S: { name: 'Sara', voice: 'a', accent: 'es-ES' },
        },
        lines: [
          { speaker: 'O', text: 'Sara, ¿es verdad que te vas a vivir a un pueblo?', pl: 'Sara, to prawda, że przeprowadzasz się na wieś?' },
          {
            speaker: 'S',
            text: 'Sí. En mi opinión, en la ciudad todo es muy caro. Además, hay mucha gente.',
            pl: 'Tak. Moim zdaniem w mieście wszystko jest bardzo drogie. Poza tym jest dużo ludzi.',
          },
          { speaker: 'O', text: 'No estoy de acuerdo. En la ciudad hay cines, restaurantes, conciertos…', pl: 'Nie zgadzam się. W mieście są kina, restauracje, koncerty…' },
          {
            speaker: 'S',
            text: 'Tienes razón, pero yo no voy mucho al cine. En cambio, me encanta la montaña.',
            pl: 'Masz rację, ale ja rzadko chodzę do kina. Za to uwielbiam góry.',
          },
          { speaker: 'O', text: '¿Y el trabajo? No creo que haya mucho trabajo en un pueblo.', pl: 'A praca? Nie sądzę, żeby na wsi było dużo pracy.' },
          { speaker: 'S', text: 'Depende. Yo trabajo en casa; por eso no necesito vivir en la ciudad.', pl: 'To zależy. Ja pracuję w domu, dlatego nie muszę mieszkać w mieście.' },
          {
            speaker: 'O',
            text: 'Bueno… Aunque no estoy de acuerdo, creo que vas a estar muy contenta.',
            pl: 'No dobrze… Chociaż się nie zgadzam, myślę, że będziesz bardzo zadowolona.',
          },
          { speaker: 'S', text: '¡Gracias! Espero que vengas a visitarme.', pl: 'Dzięki! Mam nadzieję, że przyjedziesz mnie odwiedzić.' },
          { speaker: 'O', text: 'Claro que sí. ¡Pero no pienso vivir allí!', pl: 'Jasne. Ale mieszkać tam nie zamierzam!' },
        ],
        questions: [
          {
            id: 'es.d.31-q1',
            prompt: 'Dlaczego Sara chce mieszkać na wsi?',
            options: ['Bo w mieście wszystko jest drogie i jest dużo ludzi', 'Bo dostała tam pracę', 'Bo tam mieszka jej rodzina'],
            answer: 0,
            explanation: '„En la ciudad todo es muy caro. Además, hay mucha gente.”',
          },
          {
            id: 'es.d.31-q2',
            prompt: 'Czego obawia się Óscar?',
            options: ['Że na wsi nie ma kin', 'Że na wsi nie ma dużo pracy', 'Że Sara nie będzie go odwiedzać'],
            answer: 1,
            explanation: '„No creo que haya mucho trabajo en un pueblo.” — no creo que + subjuntivo (haya).',
          },
          {
            id: 'es.d.31-q3',
            prompt: 'Dlaczego Sara nie musi mieszkać w mieście?',
            options: ['Bo pracuje w domu', 'Bo nie lubi kina', 'Bo ma samochód'],
            answer: 0,
            explanation: '„Yo trabajo en casa; por eso no necesito vivir en la ciudad.”',
          },
        ],
      },
      summary: [
        'Creo que / pienso que + tryb oznajmujący: Creo que tienes razón.',
        'No creo que / no pienso que + subjuntivo: No creo que sea fácil.',
        'Dyskusja: en mi opinión, (no) estoy de acuerdo, tienes razón, depende, creo que sí / creo que no.',
        'Łączniki: además (poza tym), por eso (dlatego), sin embargo (jednak), en cambio (natomiast), aunque (chociaż).',
      ],
      followUp:
        'Za kilka minut powtórz łączniki: además, por eso, sin embargo, en cambio, aunque. W Audio Quest czeka nowa historia: „Góry czy morze?”. W następnej lekcji opowiesz, co wydarzyło się wcześniej: el tren ya había salido.',
    },
    {
      id: 'es.l32',
      title: 'Opowiadamy historię',
      subtitle: 'El tren ya había salido',
      objective:
        'Opowiesz historię z przeszłości i zaznaczysz, co wydarzyło się wcześniej (cuando llegué, el tren ya había salido), a zdania połączysz słowami que, donde, lo que i quien.',
      level: 'B1',
      minutes: 13,
      items: [
        word('habia', 'había', 'było; był / była (od hay)', {
          pos: 'verb',
          plAlts: ['był', 'była', 'były', 'byli', 'było tam'],
          note: 'Imperfecto od hay: Había mucha gente. — Było dużo ludzi. Z imiesłowem tworzy czas zaprzeszły: había comido — zjadłem / zjadłam (już wcześniej).',
        }),
        word('hecho', 'hecho', 'zrobiony; fakt', {
          pos: 'verb',
          plAlts: ['zrobione', 'zrobiona', 'wykonany'],
          note: 'Nieregularny imiesłów od hacer: he hecho, había hecho. Jako rzeczownik el hecho — fakt. W rozmowie ¡Hecho! — Załatwione! Umowa stoi!',
        }),
        word('dicho', 'dicho', 'powiedziany; powiedzenie', {
          pos: 'verb',
          plAlts: ['powiedziane', 'przysłowie'],
          note: 'Nieregularny imiesłów od decir: Me había dicho la verdad. — Powiedział / powiedziała mi (wcześniej) prawdę. El dicho — powiedzenie, przysłowie.',
        }),
        word('escrito', 'escrito', 'napisany; pisemny', {
          pos: 'verb',
          plAlts: ['napisane', 'napisana'],
          note: 'Nieregularny imiesłów od escribir: Había escrito una carta. Por escrito — na piśmie. Un examen escrito — egzamin pisemny.',
        }),
        word('roto', 'roto / rota', 'zepsuty / zepsuta; stłuczony / stłuczona', {
          pos: 'adj',
          tts: 'roto, rota',
          alts: ['roto', 'rota'],
          plAlts: ['zepsuty', 'zepsuta', 'stłuczony', 'stłuczona', 'rozbity', 'rozbita'],
          note: 'Nieregularny imiesłów od romper (psuć, tłuc): había roto. Z estar jako przymiotnik: El teléfono está roto. — Telefon jest zepsuty.',
        }),
        word('abierto', 'abierto / abierta', 'otwarty / otwarta', {
          pos: 'adj',
          tts: 'abierto, abierta',
          alts: ['abierto', 'abierta'],
          plAlts: ['otwarty', 'otwarta', 'otwarte'],
          note: 'Nieregularny imiesłów od abrir (otwierać): había abierto. Z estar: La farmacia está abierta hasta las diez. — Apteka jest otwarta do dziesiątej.',
        }),
        verb('perder', 'perder', 'gubić; tracić; spóźnić się (na)', {
          plAlts: ['zgubić', 'stracić', 'przegrać', 'spóźnić się na'],
          note: 'e → ie: pierdo, pierdes. Perder el tren — spóźnić się na pociąg (dosłownie „stracić pociąg”). Perder las llaves — zgubić klucze. Perderse algo — przegapić coś: Me perdí la fiesta.',
        }),
        verb('olvidar', 'olvidar', 'zapominać', {
          plAlts: ['zapomnieć'],
          note: 'Olvidar algo — zapomnieć czegoś albo o czymś: Había olvidado tu número. — Zapomniałem / zapomniałam twojego numeru. Potocznie: Se me olvidó. — Zapomniało mi się.',
        }),
        noun('la-llave', 'la llave', 'klucz', 'f', {
          plAlts: ['kluczyk'],
          note: 'Las llaves de casa — klucze do domu. Cerrar con llave — zamknąć na klucz. Klucz do zagadki to la clave.',
        }),
        phrase('darse-cuenta', 'darse cuenta', 'zorientować się; zdać sobie sprawę', {
          plAlts: ['zauważyć', 'uświadomić sobie', 'połapać się'],
          note: 'Po darse cuenta stoi de que: Me di cuenta de que había perdido las llaves. — Zorientowałem / zorientowałam się, że zgubiłem / zgubiłam klucze. Odmieniamy dar: me doy cuenta, te diste cuenta.',
        }),
        phrase('lo-que', 'lo que', 'to, co; co', {
          plAlts: ['co', 'to co'],
          note: 'Odnosi się do całej rzeczy albo sytuacji: Lo que dices es verdad. — To, co mówisz, jest prawdą. No sé lo que quieres. — Nie wiem, czego chcesz.',
        }),
        phrase('con-quien', 'con quien', 'z którym; z którą', {
          plAlts: ['z którym', 'z którą', 'z którymi', 'z kim'],
          note: 'Quien (bez kreski) zastępuje osobę po przyimku: el chico con quien vivo — chłopak, z którym mieszkam. Kreskę ma tylko pytanie: ¿Con quién vives? — Z kim mieszkasz?',
        }),
        phrase('donde-naci', 'donde nací', 'gdzie się urodziłem / urodziłam', {
          plAlts: ['gdzie się urodziłem', 'gdzie się urodziłam', 'w którym się urodziłem', 'w którym się urodziłam'],
          note: 'Donde (bez kreski) łączy zdanie z miejscem: el pueblo donde nací — miasteczko, w którym się urodziłem / urodziłam. Nacer to „urodzić się” — po hiszpańsku bez „się”: nací, naciste, nació.',
        }),
      ],
      sentences: [
        s('32-1', 'Cuando llegué a la estación, el tren ya había salido.', 'Kiedy dotarłem / dotarłam na dworzec, pociąg już odjechał.', {
          plAlts: [
            'Kiedy dotarłem na dworzec, pociąg już odjechał.',
            'Kiedy dotarłam na dworzec, pociąg już odjechał.',
            'Kiedy przyszedłem na dworzec, pociąg już odjechał.',
            'Kiedy przyszłam na dworzec, pociąg już odjechał.',
            'Gdy dotarłem na dworzec, pociąg już odjechał.',
            'Gdy dotarłam na dworzec, pociąg już odjechał.',
          ],
        }),
        s('32-2', 'Nunca había visto el mar.', 'Nigdy wcześniej nie widziałem / nie widziałam morza.', {
          plAlts: ['Nigdy wcześniej nie widziałem morza.', 'Nigdy wcześniej nie widziałam morza.', 'Nigdy nie widziałem morza.', 'Nigdy nie widziałam morza.'],
          note: 'Nunca había… — nigdy wcześniej (do tamtej chwili) nie… Typowy początek opowieści o pierwszym razie.',
          accent: 'es-MX',
        }),
        s('32-3', 'Me di cuenta de que había perdido las llaves.', 'Zorientowałem / zorientowałam się, że zgubiłem / zgubiłam klucze.', {
          plAlts: [
            'Zorientowałem się, że zgubiłem klucze.',
            'Zorientowałam się, że zgubiłam klucze.',
            'Zdałem sobie sprawę, że zgubiłem klucze.',
            'Zdałam sobie sprawę, że zgubiłam klucze.',
            'Zauważyłem, że zgubiłem klucze.',
            'Zauważyłam, że zgubiłam klucze.',
          ],
        }),
        s('32-4', 'Mi madre ya había hecho la cena.', 'Mama już zrobiła kolację.', {
          plAlts: ['Moja mama już zrobiła kolację.', 'Mama zdążyła już zrobić kolację.', 'Mama już przygotowała kolację.', 'Moja mama już przygotowała kolację.'],
        }),
        s('32-5', 'Ana no me había dicho nada.', 'Ana nic mi nie powiedziała.', {
          plAlts: ['Ana nic mi wcześniej nie powiedziała.', 'Ana niczego mi nie powiedziała.', 'Ana mi nic nie powiedziała.'],
          accent: 'es-MX',
        }),
        s('32-6', 'Este es el pueblo donde nació mi abuelo.', 'To jest miasteczko, w którym urodził się mój dziadek.', {
          plAlts: [
            'To miasteczko, w którym urodził się mój dziadek.',
            'To jest wieś, w której urodził się mój dziadek.',
            'To jest miasteczko, gdzie urodził się mój dziadek.',
            'To jest miasteczko, w którym urodził się dziadek.',
          ],
        }),
        s('32-7', 'El chico con quien vivo es de México.', 'Chłopak, z którym mieszkam, jest z Meksyku.', {
          plAlts: ['Chłopak, z którym mieszkam, pochodzi z Meksyku.', 'Facet, z którym mieszkam, jest z Meksyku.'],
        }),
        s('32-8', 'No entiendo lo que dices.', 'Nie rozumiem, co mówisz.', {
          plAlts: ['Nie rozumiem tego, co mówisz.', 'Nie rozumiem, co ty mówisz.'],
          accent: 'es-MX',
        }),
        s('32-9', 'La película que vimos anoche era muy buena.', 'Film, który obejrzeliśmy wczoraj wieczorem, był bardzo dobry.', {
          plAlts: [
            'Film, który widzieliśmy wczoraj wieczorem, był bardzo dobry.',
            'Film, który oglądaliśmy wczoraj wieczorem, był bardzo dobry.',
            'Film, który obejrzałyśmy wczoraj wieczorem, był bardzo dobry.',
            'Film, który widziałyśmy wczoraj wieczorem, był bardzo dobry.',
          ],
          accent: 'es-MX',
        }),
      ],
      grammar: [
        {
          id: 'es.g.pluscuamperfecto',
          title: 'Pluscuamperfecto: había salido',
          body: [
            'Czas zaprzeszły (**pluscuamperfecto**) mówi o czymś, co wydarzyło się **wcześniej niż inne zdarzenie w przeszłości**: [[Cuando llegué a la estación, el tren ya había salido.]] Najpierw odjechał pociąg, a dopiero potem ja dotarłem / dotarłam na dworzec.',
            'Tworzymy go z imperfecto czasownika haber — [[había]], [[habías]], [[había]], [[habíamos]], [[habíais]], [[habían]] — i imiesłowu, tak jak pretérito perfecto (he comido): [[había comido]], [[habías terminado]], [[habían vivido]]. Imiesłów się nie zmienia: [[ella había salido]], [[nosotras habíamos salido]].',
            'Nieregularne imiesłowy trzeba zapamiętać: hacer → [[hecho]], decir → [[dicho]], ver → [[visto]], escribir → [[escrito]], poner → [[puesto]], volver → [[vuelto]], romper → [[roto]], abrir → [[abierto]].',
            'Często towarzyszą mu [[ya]] (już) i [[nunca]] (nigdy wcześniej): [[Ya había cenado.]] — Zjadłem / zjadłam już kolację. [[Nunca había estado en México.]] — Nigdy wcześniej nie byłem / byłam w Meksyku.',
          ],
          table: {
            head: ['Bezokolicznik', 'Imiesłów', 'Przykład'],
            rows: [
              ['hacer', 'hecho', 'Ya había hecho los deberes.'],
              ['decir', 'dicho', 'Nadie me había dicho nada.'],
              ['ver', 'visto', 'Ya había visto la película.'],
              ['escribir', 'escrito', 'Había escrito una carta.'],
              ['poner', 'puesto', 'Ya habían puesto la mesa.'],
              ['volver', 'vuelto', 'Todavía no había vuelto.'],
              ['romper', 'roto', 'Alguien había roto el teléfono.'],
              ['abrir', 'abierto', 'Ya habían abierto la farmacia.'],
            ],
          },
          contrast:
            'Polski prawie nie używa czasu zaprzeszłego (dawne „byłem poszedł”) — kolejność zdarzeń pokazujemy słowami „już”, „wcześniej” albo samym kontekstem: „kiedy przyszedłem, pociąg już odjechał”. Hiszpański w takich zdaniach wymaga había + imiesłów. Zdanie „cuando llegué, el tren salió” znaczyłoby, że pociąg odjechał dopiero wtedy, gdy przyszedłeś / przyszłaś.',
        },
        {
          id: 'es.g.relativos',
          title: 'Que, donde, lo que, quien: zdania względne',
          body: [
            '[[que]] to najczęstszy zaimek względny — odpowiada polskim „który, która, które” i odnosi się do osób i rzeczy: [[el libro que leo]] — książka, którą czytam; [[la chica que vive aquí]] — dziewczyna, która tu mieszka. Que się nie odmienia.',
            '[[donde]] zastępuje „w którym / w której” przy miejscach: [[el pueblo donde nací]] — miasteczko, w którym się urodziłem / urodziłam. Piszemy je bez kreski — kreskę ma tylko pytanie [[¿dónde?]].',
            '[[lo que]] znaczy „to, co” i odnosi się do całej sytuacji albo rzeczy bez nazwy: [[Lo que dices es verdad.]] — To, co mówisz, jest prawdą. [[No entiendo lo que pasa.]] — Nie rozumiem, co się dzieje.',
            'Po przyimku o osobach używamy [[quien]] (w liczbie mnogiej [[quienes]]): [[la amiga con quien viajo]] — przyjaciółka, z którą podróżuję. Bez przyimka wystarczy que: [[la amiga que viaja conmigo]].',
          ],
          table: {
            head: ['Zaimek', 'Po polsku', 'Przykład'],
            rows: [
              ['que', 'który, która, które', 'El libro que leo es muy bueno.'],
              ['donde', 'w którym, gdzie', 'Esta es la casa donde vivía.'],
              ['lo que', 'to, co', 'Lo que dices es verdad.'],
              ['con quien', 'z którym, z którą', 'Es la amiga con quien viajé.'],
              ['a quien', 'któremu, której', 'Es el chico a quien le di el libro.'],
            ],
          },
          contrast:
            'Polski „który” odmienia się przez rodzaje i przypadki: który, którą, któremu, z którym. Hiszpańskie que się nie zmienia: el chico que veo, la chica que me llama, los libros que leo. Pułapka: polskie „to, co” to lo que, a nie samo que — „no entiendo que dices” jest błędem.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'es.x.32-1',
          concept: 'es.g.pluscuamperfecto',
          sentence: 'Cuando llegué a casa, mis padres ya ___ cenado.',
          pl: 'Kiedy wróciłem do domu, rodzice już zjedli kolację.',
          options: ['habían', 'había', 'han'],
          answer: 'habían',
          explanation: 'Wcześniejsza czynność w przeszłości → pluscuamperfecto. Mis padres (oni) → habían cenado. Han cenado to pretérito perfecto — „zjedli” z perspektywy teraźniejszości.',
        },
        {
          type: 'gap',
          id: 'es.x.32-2',
          concept: 'es.g.pluscuamperfecto',
          sentence: 'Nunca había ___ una carta en español.',
          pl: 'Nigdy wcześniej nie pisałam listu po hiszpańsku.',
          options: ['escribido', 'escrito', 'escribiendo'],
          answer: 'escrito',
          explanation: 'Escribir ma nieregularny imiesłów: escrito. „Escribido” nie istnieje, a escribiendo to gerundio (pisząc).',
        },
        {
          type: 'gap',
          id: 'es.x.32-3',
          concept: 'es.g.pluscuamperfecto',
          sentence: 'Pablo ya me había ___ la verdad.',
          pl: 'Pablo już wcześniej powiedział mi prawdę.',
          options: ['decido', 'dicho', 'diciendo'],
          answer: 'dicho',
          explanation: 'Decir → dicho (nieregularny). Diciendo to gerundio, a decido znaczy „decyduję” (od decidir).',
        },
        {
          type: 'gap',
          id: 'es.x.32-4',
          concept: 'es.g.pluscuamperfecto',
          sentence: 'Cuando llegaron, ya habíamos ___ la mesa.',
          pl: 'Kiedy przyszli, już nakryliśmy do stołu.',
          options: ['ponido', 'puesto', 'poniendo'],
          answer: 'puesto',
          explanation: 'Poner → puesto. Poner la mesa — nakrywać do stołu. „Ponido” nie istnieje, a poniendo to gerundio.',
        },
        {
          type: 'gap',
          id: 'es.x.32-5',
          concept: 'es.g.relativos',
          sentence: 'Me gusta mucho ___ cocinas.',
          pl: 'Bardzo lubię to, co gotujesz.',
          options: ['lo que', 'que', 'qué'],
          answer: 'lo que',
          explanation: '„To, co” → lo que. Samo que potrzebuje rzeczownika przed sobą (la comida que cocinas), a qué z kreską pojawia się w pytaniach.',
        },
        {
          type: 'gap',
          id: 'es.x.32-6',
          concept: 'es.g.relativos',
          sentence: 'Esta es la ciudad ___ vivía de niño.',
          pl: 'To jest miasto, w którym mieszkałem jako dziecko.',
          options: ['donde', 'dónde', 'que'],
          answer: 'donde',
          explanation: 'Miejsce → donde, bez kreski, bo to nie pytanie. Samo que tu nie pasuje — trzeba by powiedzieć en la que.',
        },
        {
          type: 'choice',
          id: 'es.x.32-7',
          concept: 'es.g.relativos',
          prompt: 'Jak powiesz: „Dziewczyna, z którą podróżuję, jest z Meksyku”?',
          options: ['La chica con quien viajo es de México.', 'La chica quien viajo es de México.', 'La chica con qué viajo es de México.'],
          answer: 0,
          explanation: 'Po przyimku o osobie → con quien (bez kreski). Bez przyimka zdanie traci sens, a qué z kreską to zaimek pytający.',
        },
      ],
      dialogue: {
        id: 'es.d.32',
        title: 'Zgubione klucze',
        context: 'Rodrigo z Meksyku mieszka w Barcelonie. Pyta koleżankę Natalię, która dojeżdża do miasta pociągiem, dlaczego nie przyszła wczoraj na jego urodziny.',
        speakers: {
          R: { name: 'Rodrigo', voice: 'b', accent: 'es-MX' },
          N: { name: 'Natalia', voice: 'a', accent: 'es-ES' },
        },
        lines: [
          { speaker: 'R', text: 'Natalia, ¿qué te pasó ayer? No viniste a mi fiesta.', pl: 'Natalia, co ci się wczoraj stało? Nie przyszłaś na moją imprezę.' },
          { speaker: 'N', text: '¡Uf, qué día! Cuando llegué a la estación, el tren ya había salido.', pl: 'Uff, co za dzień! Kiedy dotarłam na dworzec, pociąg już odjechał.' },
          { speaker: 'R', text: '¿Y qué hiciste?', pl: 'I co zrobiłaś?' },
          { speaker: 'N', text: 'Volví a casa, pero me di cuenta de que había perdido las llaves.', pl: 'Wróciłam do domu, ale zorientowałam się, że zgubiłam klucze.' },
          { speaker: 'R', text: '¡No puede ser! ¿Y dónde estaban?', pl: 'Niemożliwe! A gdzie były?' },
          { speaker: 'N', text: 'En la cafetería donde había desayunado.', pl: 'W kawiarni, w której jadłam śniadanie.' },
          { speaker: 'R', text: 'Entonces volviste a la cafetería, ¿no?', pl: 'To wróciłaś do kawiarni, tak?' },
          { speaker: 'N', text: 'Sí, pero era muy tarde y ya no estaba abierta.', pl: 'Tak, ale było bardzo późno i nie była już otwarta.' },
          { speaker: 'R', text: '¿Y dónde dormiste?', pl: 'I gdzie spałaś?' },
          {
            speaker: 'N',
            text: 'En casa de mi hermana. Lo que más me molesta es que me perdí tu fiesta.',
            pl: 'U siostry. A najbardziej denerwuje mnie to, że ominęła mnie twoja impreza.',
          },
        ],
        questions: [
          {
            id: 'es.d.32-q1',
            prompt: 'Dlaczego Natalia nie pojechała pociągiem?',
            options: ['Bo pociąg już odjechał', 'Bo zgubiła bilet', 'Bo była chora'],
            answer: 0,
            explanation: '„Cuando llegué a la estación, el tren ya había salido.” — pociąg odjechał, zanim Natalia dotarła na dworzec.',
          },
          {
            id: 'es.d.32-q2',
            prompt: 'Gdzie były klucze Natalii?',
            options: ['W pociągu', 'W kawiarni, w której jadła śniadanie', 'U jej siostry'],
            answer: 1,
            explanation: '„En la cafetería donde había desayunado.”',
          },
          {
            id: 'es.d.32-q3',
            prompt: 'Co najbardziej denerwuje Natalię?',
            options: ['Że ominęła ją impreza Rodriga', 'Że musiała spać u siostry', 'Że kawiarnia była zamknięta'],
            answer: 0,
            explanation: '„Lo que más me molesta es que me perdí tu fiesta.”',
          },
        ],
      },
      summary: [
        'Pluscuamperfecto: había, habías, había, habíamos, habíais, habían + imiesłów — había comido, habían salido.',
        'Mówi o tym, co stało się wcześniej niż inne zdarzenie w przeszłości: Cuando llegué, el tren ya había salido.',
        'Nieregularne imiesłowy: hecho, dicho, visto, escrito, puesto, vuelto, roto, abierto.',
        'Zdania względne: que (który), donde (w którym), lo que (to, co), con quien (z którym).',
      ],
      followUp:
        'Za kilka minut powtórz osiem nieregularnych imiesłowów: hecho, dicho, visto, escrito, puesto, vuelto, roto, abierto. W ostatniej lekcji działu powiesz, co by było, gdyby…: si tuviera tiempo, viajaría.',
    },
  ],
};
