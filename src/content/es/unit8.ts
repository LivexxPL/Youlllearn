import type { Unit } from '../types';
import { contentHelpers } from '../helpers';

const { word, verb, phrase, sentence: s } = contentHelpers('es');

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
  ],
};
