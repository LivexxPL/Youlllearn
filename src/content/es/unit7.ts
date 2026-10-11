import type { Unit } from '../types';
import { contentHelpers } from '../helpers';

const { word, noun, verb, phrase, sentence: s } = contentHelpers('es');

export const unit7: Unit = {
  id: 'es.u7',
  title: 'Plany, prośby i polecenia',
  description: 'Domykamy poziom A2: czas przyszły i tryb warunkowy, polecenia, zaimki „komu?” (se lo), estar + gerundio oraz por i para.',
  level: 'A2+',
  lessons: [
    {
      id: 'es.l24',
      title: 'Co będzie jutro?',
      subtitle: 'Mañana lloverá',
      objective: 'Powiesz, co zrobisz w przyszłości, przewidzisz pogodę i złożysz obietnicę — czas przyszły prosty (futuro simple) i różnica między „iré” a „voy a ir”.',
      level: 'A2+',
      minutes: 12,
      intro: [
        'Witaj w dziale A2+! W pięciu lekcjach domkniesz poziom A2: czas przyszły, tryb warunkowy, polecenia, zaimki „komu?” i różnicę między por a para.',
        'Zaczynamy od czasu przyszłego. Dobra wiadomość: jego końcówki są takie same dla wszystkich czasowników.',
      ],
      items: [
        noun('el-futuro', 'el futuro', 'przyszłość', 'm', {
          note: 'En el futuro — w przyszłości. Czas przyszły też nazywa się po hiszpańsku futuro.',
        }),
        phrase('pasado-manana', 'pasado mañana', 'pojutrze', {
          note: 'Dosłownie „po jutrze”. Para do anteayer — przedwczoraj.',
        }),
        phrase('la-semana-que-viene', 'la semana que viene', 'w przyszłym tygodniu', {
          plAlts: ['w następnym tygodniu', 'przyszły tydzień'],
          note: 'Tak samo jak el año que viene. Można też powiedzieć la próxima semana.',
        }),
        phrase('dentro-de-dos-anos', 'dentro de dos años', 'za dwa lata', {
          note: 'Dentro de + okres = za…: dentro de una semana — za tydzień. Nie myl z hace dos años — dwa lata temu.',
        }),
        word('pronto', 'pronto', 'wkrótce; niedługo', {
          pos: 'adv',
          plAlts: ['zaraz', 'niebawem'],
          note: '¡Hasta pronto! — Do zobaczenia wkrótce! W Hiszpanii pronto znaczy też „wcześnie”: mañana me levanto pronto.',
        }),
        word('seguramente', 'seguramente', 'pewnie; prawdopodobnie', {
          pos: 'adv',
          plAlts: ['przypuszczalnie', 'chyba', 'najpewniej'],
          note: 'Pułapka: seguramente to raczej „prawdopodobnie”, a nie „na pewno”. Pewność wyraża seguro que…: seguro que viene — na pewno przyjdzie.',
        }),
        verb('prometer', 'prometer', 'obiecywać', {
          plAlts: ['obiecać'],
          note: 'Obietnice zwykle brzmią w czasie przyszłym: Te prometo que te llamaré. — Obiecuję, że do ciebie zadzwonię.',
        }),
        word('tendre', 'tendré', 'będę miał / będę miała', {
          pos: 'verb',
          plAlts: ['będę miał', 'będę miała', 'będę mieć'],
          note: 'Od tener. Zamiast e z bezokolicznika pojawia się d: tener → tendr-. Tak samo poner → pondré.',
        }),
        word('hare', 'haré', 'zrobię; będę robić', {
          pos: 'verb',
          plAlts: ['będę robił', 'będę robiła'],
          note: 'Od hacer: haré, harás, hará… O pogodzie: mañana hará calor — jutro będzie gorąco.',
        }),
        word('podre', 'podré', 'będę mógł / będę mogła', {
          pos: 'verb',
          plAlts: ['będę mógł', 'będę mogła', 'dam radę'],
          note: 'Od poder — z bezokolicznika znika e: poder → podr-. Tak samo saber → sabré, querer → querré.',
        }),
        word('saldre', 'saldré', 'wyjdę; wyjadę', {
          pos: 'verb',
          plAlts: ['będę wychodzić', 'wyruszę'],
          note: 'Od salir: saldré, saldrás, saldrá… Mañana saldré temprano — jutro wcześnie wyjdę.',
        }),
        word('vendre', 'vendré', 'przyjdę; przyjadę', {
          pos: 'verb',
          plAlts: ['będę przychodzić'],
          note: 'Od venir. Uwaga: venderé (z e w środku) to „sprzedam” — od vender.',
        }),
        word('dire', 'diré', 'powiem', {
          pos: 'verb',
          plAlts: ['będę mówić', 'będę mówił', 'będę mówiła'],
          note: 'Od decir (mówić, powiedzieć) — bardzo krótki temat: dir-. Dalej: dirás, dirá, diremos…',
        }),
      ],
      sentences: [
        s('24-1', 'Mañana lloverá en Madrid.', 'Jutro w Madrycie będzie padać.', {
          plAlts: ['Jutro będzie padać w Madrycie.', 'Jutro w Madrycie będzie padał deszcz.', 'Jutro w Madrycie spadnie deszcz.'],
        }),
        s('24-2', 'El año que viene viviré en Valencia.', 'W przyszłym roku będę mieszkać w Walencji.', {
          plAlts: ['W przyszłym roku będę mieszkał w Walencji.', 'W przyszłym roku będę mieszkała w Walencji.', 'W przyszłym roku zamieszkam w Walencji.'],
        }),
        s('24-3', 'Pasado mañana tendré más tiempo.', 'Pojutrze będę mieć więcej czasu.', {
          plAlts: ['Pojutrze będę miał więcej czasu.', 'Pojutrze będę miała więcej czasu.'],
          accent: 'es-MX',
        }),
        s('24-4', '¿Qué harás el fin de semana?', 'Co będziesz robić w weekend?', {
          plAlts: ['Co będziesz robił w weekend?', 'Co będziesz robiła w weekend?', 'Co zrobisz w weekend?'],
        }),
        s('24-5', 'Te prometo que mañana te llamaré.', 'Obiecuję ci, że jutro do ciebie zadzwonię.', {
          plAlts: ['Obiecuję, że jutro do ciebie zadzwonię.', 'Obiecuję ci, że zadzwonię do ciebie jutro.', 'Obiecuję, że jutro zadzwonię.'],
        }),
        s('24-6', 'Seguramente vendrán a la fiesta.', 'Pewnie przyjdą na imprezę.', {
          plAlts: ['Prawdopodobnie przyjdą na imprezę.', 'Pewnie przyjdą na przyjęcie.', 'Pewnie przyjadą na imprezę.'],
          accent: 'es-MX',
        }),
        s('24-7', 'Dentro de dos años terminaré la universidad.', 'Za dwa lata skończę studia.', {
          plAlts: ['Za dwa lata skończę uniwersytet.', 'Za dwa lata skończę uczelnię.'],
        }),
        s('24-8', 'Hoy no puedo, pero mañana podré.', 'Dziś nie mogę, ale jutro będę mógł / będę mogła.', {
          plAlts: [
            'Dziś nie mogę, ale jutro będę mógł.',
            'Dziś nie mogę, ale jutro będę mogła.',
            'Dzisiaj nie mogę, ale jutro będę mógł.',
            'Dzisiaj nie mogę, ale jutro będę mogła.',
            'Dziś nie mogę, ale jutro dam radę.',
          ],
          accent: 'es-MX',
        }),
        s('24-9', 'Ya son las nueve: vamos a llegar tarde.', 'Już dziewiąta: spóźnimy się.', {
          plAlts: ['Jest już dziewiąta: spóźnimy się.', 'Już dziewiąta, zaraz się spóźnimy.', 'Już jest dziewiąta: spóźnimy się.'],
          note: 'Gdy już teraz widać, co się stanie, mówimy ir a + bezokolicznik, a nie futuro.',
        }),
      ],
      grammar: [
        {
          id: 'es.g.futuro',
          title: 'Futuro simple: hablaré, comeré, viviré',
          body: [
            'Czas przyszły prosty (futuro simple) tworzy się wyjątkowo łatwo: do **całego bezokolicznika** dodajemy końcówki **-é, -ás, -á, -emos, -éis, -án**. Są wspólne dla -ar, -er i -ir: [[hablaré]], [[comeré]], [[viviré]].',
            'Kreskę mają wszystkie formy oprócz „my”: [[viajaré]], [[viajarás]], [[viajará]], ale [[viajaremos]]. Akcent pada zawsze na końcówkę.',
            'Kilka częstych czasowników ma skrócony temat, ale końcówki zostają te same. Samogłoskę przed -r zastępuje d: tener → [[tendré]], poner → [[pondré]], salir → [[saldré]], venir → [[vendré]]. Znika e: poder → [[podré]], saber → [[sabré]], querer → [[querré]]. Zupełnie krótkie: hacer → [[haré]], decir → [[diré]].',
            'Od hay tworzymy [[habrá]]: [[Mañana habrá mucha gente.]] — Jutro będzie dużo ludzi.',
          ],
          table: {
            head: ['Osoba', 'hablar', 'vivir', 'tener', 'hacer'],
            rows: [
              ['yo', 'hablaré', 'viviré', 'tendré', 'haré'],
              ['tú', 'hablarás', 'vivirás', 'tendrás', 'harás'],
              ['él / ella / usted', 'hablará', 'vivirá', 'tendrá', 'hará'],
              ['nosotros / nosotras', 'hablaremos', 'viviremos', 'tendremos', 'haremos'],
              ['vosotros / vosotras', 'hablaréis', 'viviréis', 'tendréis', 'haréis'],
              ['ellos / ellas / ustedes', 'hablarán', 'vivirán', 'tendrán', 'harán'],
            ],
          },
          contrast:
            'Polski czas przyszły ma dwie postacie: „zrobię” (dokonany) i „będę robić” (niedokonany). Hiszpańskie haré obejmuje obie — o wyborze decyduje kontekst. Forma nie zmienia się też według rodzaju: tendré to i „będę miał”, i „będę miała”.',
        },
        {
          id: 'es.g.futuro-ir-a',
          title: 'Iré czy voy a ir? Plany, prognozy, przypuszczenia',
          body: [
            'Znasz już [[ir a]] + bezokolicznik. To najczęstszy sposób mówienia o planach i zamiarach, zwłaszcza bliskich: [[Esta noche voy a cenar en casa.]] Wybieramy go też, gdy już teraz widać, co się stanie: [[Ya son las nueve: vamos a llegar tarde.]]',
            'Futuro simple brzmi bardziej neutralnie i „z dystansu”. Pasuje do prognoz ([[Mañana lloverá.]]), obietnic ([[Te llamaré mañana.]]) i planów dalszych albo mniej pewnych ([[Dentro de dos años terminaré la universidad.]]).',
            'Futuro wyraża też **przypuszczenie o teraźniejszości**: [[¿Qué hora será?]] — Która może być godzina? [[Pablo no ha llegado. ¿Dónde estará?]] — Pabla jeszcze nie ma. Gdzie on może być?',
            'W codziennej rozmowie, zwłaszcza w Meksyku, o planach mówi się prawie zawsze przez ir a, a futuro słychać częściej w prognozach, obietnicach i przypuszczeniach.',
          ],
          table: {
            head: ['Sytuacja', 'Zwykle', 'Przykład'],
            rows: [
              ['bliski plan, zamiar', 'ir a + bezokolicznik', 'Esta noche voy a cenar en casa.'],
              ['widać, że zaraz się stanie', 'ir a + bezokolicznik', 'Vamos a llegar tarde.'],
              ['prognoza', 'futuro', 'Mañana lloverá.'],
              ['obietnica', 'futuro', 'Te llamaré mañana.'],
              ['przypuszczenie o „teraz”', 'futuro', '¿Qué hora será?'],
            ],
          },
          contrast:
            'Po polsku o przyszłości często mówimy czasem teraźniejszym: „jutro jadę do Krakowa”. Po hiszpańsku to też działa: mañana voy a Cracovia. Natomiast przypuszczenie, które po polsku wyrażamy słowami „chyba”, „może”, „ciekawe” (ciekawe, gdzie on jest), hiszpański oddaje samym czasem przyszłym: ¿dónde estará?',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'es.x.24-1',
          concept: 'es.g.futuro',
          sentence: 'Mañana ___ con mis abuelos.',
          pl: 'Jutro zjem obiad z dziadkami.',
          options: ['comí', 'comeré', 'comerá'],
          answer: 'comeré',
          explanation: 'Mañana + ja → comeré: cały bezokolicznik + -é. Comí to przeszłość (zjadłem / zjadłam), a comerá — forma dla on / ona.',
        },
        {
          type: 'gap',
          id: 'es.x.24-2',
          concept: 'es.g.futuro',
          sentence: '¿___ tiempo el sábado?',
          pl: 'Będziesz mieć czas w sobotę?',
          options: ['Tenerás', 'Tendrás', 'Tendré'],
          answer: 'Tendrás',
          explanation: 'Tener ma w czasie przyszłym temat tendr-: tendrás. Formy „tenerás” nie ma, a tendré to „będę miał / będę miała”.',
        },
        {
          type: 'gap',
          id: 'es.x.24-3',
          concept: 'es.g.futuro',
          sentence: 'Mañana te ___ todo.',
          pl: 'Jutro powiem ci wszystko.',
          options: ['deciré', 'diré', 'dije'],
          answer: 'diré',
          explanation: 'Decir ma w futuro bardzo krótki temat: diré. „Deciré” to częsty błąd, a dije to czas przeszły (powiedziałem / powiedziałam).',
        },
        {
          type: 'gap',
          id: 'es.x.24-4',
          concept: 'es.g.futuro',
          sentence: '¿A qué hora ___ de casa mañana?',
          pl: 'O której jutro wyjdziesz z domu?',
          options: ['salirás', 'saldrás', 'saldré'],
          answer: 'saldrás',
          explanation: 'Salir → saldr- + -ás: saldrás. „Salirás” nie istnieje, a saldré to forma dla „ja”.',
        },
        {
          type: 'gap',
          id: 'es.x.24-5',
          concept: 'es.g.futuro-ir-a',
          sentence: 'Son las nueve menos cinco y la clase es a las nueve: ___ a llegar tarde.',
          pl: 'Jest za pięć dziewiąta, a zajęcia są o dziewiątej: spóźnimy się.',
          options: ['vamos', 'iremos', 'llegaremos'],
          answer: 'vamos',
          explanation: 'Już teraz widać, co się stanie, więc ir a + bezokolicznik: vamos a llegar tarde. Po iremos i llegaremos nie stawiamy „a + bezokolicznik”.',
        },
        {
          type: 'choice',
          id: 'es.x.24-6',
          concept: 'es.g.futuro-ir-a',
          optionsLang: 'pl',
          prompt: 'Jest dziesiąta, a Pabla wciąż nie ma. Ktoś mówi: „¿Dónde estará?”. Co to znaczy?',
          options: ['Gdzie on będzie jutro?', 'Gdzie on może być?', 'Gdzie on był wczoraj?'],
          answer: 1,
          explanation: 'Futuro wyraża tu przypuszczenie o teraźniejszości: „gdzie on może teraz być?”. Nie chodzi o przyszłość.',
        },
        {
          type: 'choice',
          id: 'es.x.24-7',
          concept: 'es.g.futuro',
          prompt: 'Jak powiesz: „W przyszłym tygodniu będziemy mieć egzamin”?',
          options: ['La semana que viene tenderemos un examen.', 'La semana que viene tendremos un examen.', 'La semana que viene tendrémos un examen.'],
          answer: 1,
          explanation: 'Tener → tendr- + -emos: tendremos. Forma „my” jako jedyna nie ma kreski.',
        },
      ],
      dialogue: {
        id: 'es.d.24',
        title: 'Plany na przyszłość',
        context: 'Ania kończy semestr wymiany w Salamance. Na pożegnalnej kolacji Javier pyta ją o plany.',
        speakers: {
          J: { name: 'Javier', voice: 'b', accent: 'es-ES' },
          A: { name: 'Ania', voice: 'a', accent: 'es-ES' },
        },
        lines: [
          { speaker: 'J', text: 'Ania, ¿qué harás en verano?', pl: 'Ania, co będziesz robić latem?' },
          { speaker: 'A', text: 'Primero volveré a Polonia. Tendré un mes de vacaciones con mi familia.', pl: 'Najpierw wrócę do Polski. Będę mieć miesiąc wakacji z rodziną.' },
          { speaker: 'J', text: '¿Y después? ¿Vendrás otra vez a España?', pl: 'A potem? Przyjedziesz znowu do Hiszpanii?' },
          { speaker: 'A', text: 'Seguramente. En octubre viviré en Madrid con mi hermana.', pl: 'Pewnie tak. W październiku zamieszkam z siostrą w Madrycie.' },
          { speaker: 'J', text: '¡Qué bien! Entonces podremos vernos los fines de semana.', pl: 'Super! To będziemy mogli widywać się w weekendy.' },
          { speaker: 'A', text: 'Claro. ¿Y tú? ¿Qué vas a hacer este verano?', pl: 'Jasne. A ty? Co będziesz robić tego lata?' },
          { speaker: 'J', text: 'Voy a trabajar en un hotel en Cádiz. Ya tengo el trabajo.', pl: 'Będę pracować w hotelu w Kadyksie. Pracę już mam.' },
          { speaker: 'A', text: '¿En Cádiz? ¡Te prometo que iré a verte!', pl: 'W Kadyksie? Obiecuję, że cię odwiedzę!' },
        ],
        questions: [
          {
            id: 'es.d.24-q1',
            prompt: 'Co Ania zrobi najpierw po semestrze?',
            options: ['Zamieszka z siostrą w Madrycie', 'Wróci na miesiąc do Polski', 'Pojedzie do Kadyksu'],
            answer: 1,
            explanation: '„Primero volveré a Polonia. Tendré un mes de vacaciones con mi familia.”',
          },
          {
            id: 'es.d.24-q2',
            prompt: 'Gdzie Javier będzie pracować latem?',
            options: ['W hotelu w Kadyksie', 'W Madrycie', 'W Salamance'],
            answer: 0,
            explanation: '„Voy a trabajar en un hotel en Cádiz.” Plan jest już pewny, dlatego Javier mówi ir a.',
          },
          {
            id: 'es.d.24-q3',
            prompt: 'Co obiecuje Ania?',
            options: ['Że zadzwoni w weekend', 'Że odwiedzi Javiera w Kadyksie', 'Że zostanie w Salamance'],
            answer: 1,
            explanation: '„¡Te prometo que iré a verte!” — obiecuje, że go odwiedzi.',
          },
        ],
      },
      summary: [
        'Futuro simple: bezokolicznik + -é, -ás, -á, -emos, -éis, -án — hablaré, comeré, viviré.',
        'Skrócony temat: tendré, pondré, saldré, vendré; podré, sabré, querré; haré, diré.',
        'Futuro — prognozy, obietnice, dalsze plany i przypuszczenia (¿dónde estará?); ir a — bliskie plany i to, co zaraz się stanie.',
        'Określenia przyszłości: pasado mañana, la semana que viene, dentro de dos años, pronto.',
      ],
      followUp: 'Za kilka minut powtórz formy nieregularne: tendré, haré, diré, saldré. W następnej lekcji te same tematy posłużą do trybu warunkowego: tendría, haría, diría.',
    },
  ],
};
