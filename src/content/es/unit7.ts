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
    {
      id: 'es.l25',
      title: 'Uprzejme prośby i rady',
      subtitle: '¿Podrías ayudarme?',
      objective: 'Grzecznie poprosisz o pomoc, powiesz, co chciałbyś / chciałabyś robić, i doradzisz komuś — tryb warunkowy (condicional).',
      level: 'A2+',
      minutes: 12,
      items: [
        verb('ayudar', 'ayudar', 'pomagać', {
          plAlts: ['pomóc'],
          note: 'Ayudar a alguien — pomagać komuś. Z zaimkiem: ¿Me ayudas? — Pomożesz mi? Pomoc to la ayuda.',
        }),
        phrase('me-gustaria', 'me gustaría', 'chciałbym / chciałabym', {
          plAlts: ['chciałbym', 'chciałabym'],
          note: 'Grzeczniejsze niż quiero. Działa jak gustar: me gustaría viajar, ¿te gustaría venir?',
        }),
        phrase('me-encantaria', 'me encantaría', 'bardzo bym chciał / bardzo bym chciała', {
          plAlts: ['bardzo bym chciał', 'bardzo bym chciała', 'bardzo chciałbym', 'bardzo chciałabym'],
          note: 'Typowa odpowiedź na zaproszenie: ¿Vienes a la fiesta? — ¡Me encantaría! (z przyjemnością!).',
        }),
        word('podria', 'podría', 'mógłbym / mogłabym; mógłby / mogłaby', {
          pos: 'verb',
          plAlts: ['mógłbym', 'mogłabym', 'mógłby', 'mogłaby'],
          note: 'Ta sama forma dla „ja” i dla „on / ona / pan / pani”: ¿Podría ayudarme? — Mógłby pan / mogłaby pani mi pomóc?',
        }),
        word('podrias', 'podrías', 'mógłbyś / mogłabyś', {
          pos: 'verb',
          plAlts: ['mógłbyś', 'mogłabyś'],
          note: 'Uprzejma prośba na „ty”: ¿Podrías venir mañana? — Mógłbyś / mogłabyś przyjść jutro?',
        }),
        word('deberia', 'debería', 'powinienem / powinnam; powinien / powinna', {
          pos: 'verb',
          plAlts: ['powinienem', 'powinnam', 'powinien', 'powinna'],
          note: 'Od deber (mieć obowiązek). Deberías descansar — powinieneś / powinnaś odpocząć. Brzmi łagodniej niż tienes que.',
        }),
        phrase('yo-que-tu', 'yo que tú', 'na twoim miejscu', {
          plAlts: ['ja na twoim miejscu', 'gdybym był tobą', 'gdybym była tobą'],
          note: 'Po yo que tú stoi condicional: Yo que tú, descansaría. — Na twoim miejscu odpocząłbym / odpoczęłabym. To samo znaczy yo en tu lugar.',
        }),
        word('tendria', 'tendría', 'miałbym / miałabym', {
          pos: 'verb',
          plAlts: ['miałbym', 'miałabym', 'miałby', 'miałaby'],
          note: 'Ten sam temat co w czasie przyszłym: tendré → tendría. Tendrías que descansar — musiałbyś / musiałabyś odpocząć.',
        }),
        word('haria', 'haría', 'zrobiłbym / zrobiłabym', {
          pos: 'verb',
          plAlts: ['zrobiłbym', 'zrobiłabym', 'robiłbym', 'robiłabym', 'zrobiłby', 'zrobiłaby'],
          note: 'Od hacer, temat har- jak w haré. ¿Qué harías tú? — A ty co byś zrobił / zrobiła?',
        }),
        word('seria', 'sería', 'byłby / byłaby; byłoby', {
          pos: 'verb',
          plAlts: ['byłby', 'byłaby', 'byłoby', 'byłbym', 'byłabym'],
          note: 'Od ser, całkiem regularnie: ser + -ía. ¡Sería genial! — Byłoby świetnie!',
        }),
        noun('el-favor', 'el favor', 'przysługa', 'm', {
          plAlts: ['grzeczność'],
          note: 'Hacer un favor — wyświadczyć przysługę: ¿Me haces un favor? Stąd por favor — dosłownie „przez grzeczność”.',
        }),
        noun('el-consejo', 'el consejo', 'rada', 'm', {
          plAlts: ['porada'],
          note: 'Dar un consejo — dać radę. Po polsku „rada” jest żeńska, a el consejo — męski. El consejo to także rada jako grupa ludzi: el Consejo de Ministros.',
        }),
        phrase('con-mucho-gusto', 'con mucho gusto', 'z przyjemnością', {
          plAlts: ['chętnie', 'z chęcią', 'bardzo chętnie'],
          note: 'Uprzejma odpowiedź na prośbę. Nie myl z mucho gusto — miło mi (przy poznaniu). W Meksyku na „gracias” często odpowiada się „con gusto”.',
        }),
      ],
      sentences: [
        s('25-1', 'Me gustaría viajar a Argentina.', 'Chciałbym / chciałabym pojechać do Argentyny.', {
          plAlts: ['Chciałbym pojechać do Argentyny.', 'Chciałabym pojechać do Argentyny.', 'Chciałbym podróżować do Argentyny.', 'Chciałabym podróżować do Argentyny.'],
        }),
        s('25-2', '¿Podrías hablar más despacio?', 'Mógłbyś / mogłabyś mówić wolniej?', {
          plAlts: ['Mógłbyś mówić wolniej?', 'Mogłabyś mówić wolniej?', 'Czy mógłbyś mówić wolniej?', 'Czy mogłabyś mówić wolniej?'],
        }),
        s('25-3', '¿Me harías un favor?', 'Zrobiłbyś / zrobiłabyś mi przysługę?', {
          plAlts: [
            'Zrobiłbyś mi przysługę?',
            'Zrobiłabyś mi przysługę?',
            'Czy zrobiłbyś mi przysługę?',
            'Czy zrobiłabyś mi przysługę?',
            'Wyświadczyłbyś mi przysługę?',
            'Wyświadczyłabyś mi przysługę?',
          ],
          accent: 'es-MX',
        }),
        s('25-4', 'Deberías descansar más.', 'Powinieneś / powinnaś więcej odpoczywać.', {
          plAlts: ['Powinieneś więcej odpoczywać.', 'Powinnaś więcej odpoczywać.', 'Powinieneś odpoczywać więcej.', 'Powinnaś odpoczywać więcej.'],
        }),
        s('25-5', 'Yo que tú, iría al médico.', 'Na twoim miejscu poszedłbym / poszłabym do lekarza.', {
          plAlts: [
            'Na twoim miejscu poszedłbym do lekarza.',
            'Na twoim miejscu poszłabym do lekarza.',
            'Ja na twoim miejscu poszedłbym do lekarza.',
            'Ja na twoim miejscu poszłabym do lekarza.',
          ],
        }),
        s('25-6', '¿Podría usted ayudarme, por favor?', 'Czy mógłby pan / mogłaby pani mi pomóc?', {
          plAlts: [
            'Czy mógłby pan mi pomóc?',
            'Czy mogłaby pani mi pomóc?',
            'Czy mógłby mi pan pomóc?',
            'Czy mogłaby mi pani pomóc?',
            'Mógłby pan mi pomóc?',
            'Mogłaby pani mi pomóc?',
          ],
          accent: 'es-MX',
        }),
        s('25-7', 'Sería mejor ir en tren.', 'Lepiej byłoby pojechać pociągiem.', {
          plAlts: ['Byłoby lepiej pojechać pociągiem.', 'Lepiej byłoby jechać pociągiem.', 'Lepiej pojechać pociągiem.'],
        }),
        s('25-8', 'Me encantaría ir, pero tengo que trabajar.', 'Bardzo chciałbym / chciałabym pójść, ale muszę pracować.', {
          plAlts: [
            'Bardzo chciałbym pójść, ale muszę pracować.',
            'Bardzo chciałabym pójść, ale muszę pracować.',
            'Bardzo bym chciał pójść, ale muszę pracować.',
            'Bardzo bym chciała pójść, ale muszę pracować.',
            'Chętnie bym poszedł, ale muszę pracować.',
            'Chętnie bym poszła, ale muszę pracować.',
          ],
          accent: 'es-MX',
        }),
        s('25-9', 'Quería una mesa para dos, por favor.', 'Poproszę stolik dla dwóch osób.', {
          plAlts: ['Chciałbym stolik dla dwóch osób.', 'Chciałabym stolik dla dwóch osób.', 'Poproszę stolik dla dwojga.', 'Poproszę stolik na dwie osoby.'],
          note: 'Grzecznościowe imperfecto: przy zamawianiu i prośbach często mówi się quería („chciałem / chciałam”) zamiast quiero.',
        }),
      ],
      grammar: [
        {
          id: 'es.g.condicional',
          title: 'Condicional: hablaría, comería, viviría',
          body: [
            'Tryb warunkowy (condicional) odpowiada polskim formom z „-by”: chciałbym, mógłbyś, byłoby. Tworzymy go jak czas przyszły — do **całego bezokolicznika** dodajemy końcówki **-ía, -ías, -ía, -íamos, -íais, -ían**: [[hablaría]], [[comería]], [[viviría]].',
            'Kreska nad í jest w każdej formie. Formy „ja” i „on / ona / usted” są takie same, więc osobę pokazuje kontekst albo zaimek: [[yo podría]], [[usted podría]].',
            'Czasowniki ze skróconym tematem w futuro mają ten sam temat w condicional: tendré → [[tendría]], podré → [[podría]], haré → [[haría]], diré → [[diría]], saldré → [[saldría]], vendré → [[vendría]], sabré → [[sabría]], querré → [[querría]], pondré → [[pondría]].',
            'Uważaj na podobieństwo do imperfecto: [[comía]] (jadłem / jadłam) i [[comería]] (zjadłbym / zjadłabym). Końcówka -ía jest ta sama, ale w condicional stoi za całym bezokolicznikiem.',
          ],
          table: {
            head: ['Osoba', 'hablar', 'poder', 'hacer', 'tener'],
            rows: [
              ['yo', 'hablaría', 'podría', 'haría', 'tendría'],
              ['tú', 'hablarías', 'podrías', 'harías', 'tendrías'],
              ['él / ella / usted', 'hablaría', 'podría', 'haría', 'tendría'],
              ['nosotros / nosotras', 'hablaríamos', 'podríamos', 'haríamos', 'tendríamos'],
              ['vosotros / vosotras', 'hablaríais', 'podríais', 'haríais', 'tendríais'],
              ['ellos / ellas / ustedes', 'hablarían', 'podrían', 'harían', 'tendrían'],
            ],
          },
          contrast:
            'Polski tryb przypuszczający składa się z formy przeszłej i cząstki „by”: zrobił-by-m, mógł-by-ś. Hiszpański mieści wszystko w jednej końcówce i nie zmienia formy według rodzaju: podría to i „mógłbym”, i „mogłabym”.',
        },
        {
          id: 'es.g.cortesia',
          title: 'Uprzejme prośby, życzenia i rady',
          body: [
            'Condicional łagodzi prośby. [[¿Puedes ayudarme?]] — Pomożesz mi? — brzmi zwyczajnie, a [[¿Podrías ayudarme?]] — Mógłbyś / mogłabyś mi pomóc? — grzeczniej. Do osoby na „pan / pani”: [[¿Podría ayudarme?]]',
            'Życzenia: [[me gustaría]] (chciałbym / chciałabym) jest uprzejmiejsze niż quiero: [[Me gustaría hablar con usted.]] Na zaproszenie odpowiadamy: [[¡Me encantaría!]]',
            'Rady: [[deberías]] + bezokolicznik (powinieneś / powinnaś) i [[yo que tú]] + condicional (na twoim miejscu): [[Deberías dormir más.]], [[Yo que tú, no iría.]] Bezosobowo: [[Sería mejor ir en tren.]] — Lepiej byłoby pojechać pociągiem.',
            'Przy zamawianiu i prośbach często słychać też grzecznościowe imperfecto: [[Quería un café, por favor.]] — dosłownie „chciałem kawę”, a w praktyce „poproszę kawę”.',
          ],
          table: {
            head: ['', 'Zwyczajnie', 'Grzeczniej'],
            rows: [
              ['prośba (tú)', '¿Puedes ayudarme?', '¿Podrías ayudarme?'],
              ['prośba (usted)', '¿Puede ayudarme?', '¿Podría ayudarme?'],
              ['życzenie', 'Quiero ir.', 'Me gustaría ir.'],
              ['rada', 'Tienes que descansar.', 'Deberías descansar.'],
              ['ocena', 'Es mejor ir en tren.', 'Sería mejor ir en tren.'],
            ],
          },
          contrast:
            'Po polsku też łagodzimy prośby trybem przypuszczającym: „Pomożesz mi?” → „Mógłbyś mi pomóc?”. Hiszpański działa tak samo. Polskie „poproszę” przy zamawianiu ma kilka odpowiedników: quería…, me gustaría…, a w Hiszpanii także potoczne ¿me pone…? (dosłownie „czy postawi mi pan / pani…?”).',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'es.x.25-1',
          concept: 'es.g.condicional',
          sentence: '¿___ venir mañana a las diez?',
          pl: 'Mógłbyś przyjść jutro o dziesiątej?',
          options: ['Podrías', 'Podías', 'Puedrías'],
          answer: 'Podrías',
          explanation: 'Uprzejma prośba → condicional: podrías (temat podr- jak w podré). Podías to imperfecto (mogłeś / mogłaś), a „puedrías” nie istnieje — w condicional nie ma wymiany o → ue.',
        },
        {
          type: 'gap',
          id: 'es.x.25-2',
          concept: 'es.g.condicional',
          sentence: 'Yo que tú, no ___ eso.',
          pl: 'Na twoim miejscu nie robiłabym tego.',
          options: ['haría', 'hacería', 'hacía'],
          answer: 'haría',
          explanation: 'Hacer ma w condicional skrócony temat har-: haría. „Hacería” nie istnieje, a hacía to imperfecto (robiłem / robiłam).',
        },
        {
          type: 'gap',
          id: 'es.x.25-3',
          concept: 'es.g.condicional',
          sentence: 'Mis padres ___ venir en agosto.',
          pl: 'Moi rodzice mogliby przyjechać w sierpniu.',
          options: ['podrían', 'podríamos', 'podrán'],
          answer: 'podrían',
          explanation: 'Ellos (moi rodzice) → podrían. Podríamos to „my”, a podrán to czas przyszły (będą mogli).',
        },
        {
          type: 'gap',
          id: 'es.x.25-4',
          concept: 'es.g.cortesia',
          sentence: 'Estás muy cansado. ___ dormir más.',
          pl: 'Jesteś bardzo zmęczony. Powinieneś więcej spać.',
          options: ['Deberías', 'Debería', 'Deberíamos'],
          answer: 'Deberías',
          explanation: 'Rada dla osoby na „ty” → deberías + bezokolicznik. Debería to „ja” albo „pan / pani”, a deberíamos — „my”.',
        },
        {
          type: 'choice',
          id: 'es.x.25-5',
          concept: 'es.g.cortesia',
          prompt: 'Chcesz uprzejmie poprosić o pomoc nieznajomą starszą panią. Co powiesz?',
          options: ['Perdón, ¿podría ayudarme?', 'Perdón, ¿puedes ayudarme?', 'Oye, ¿me ayudas?'],
          answer: 0,
          explanation: 'Do nieznajomej starszej osoby zwracamy się per usted, a condicional (podría) dodaje uprzejmości. Puedes i ayudas to formy na „ty”, a oye znaczy „słuchaj”.',
        },
        {
          type: 'choice',
          id: 'es.x.25-6',
          concept: 'es.g.cortesia',
          optionsLang: 'pl',
          prompt: 'Co znaczy „Yo que tú, no iría”?',
          options: ['Na twoim miejscu nie poszedłbym.', 'Ja nie pójdę, a ty?', 'Ja nie poszedłem, w przeciwieństwie do ciebie.'],
          answer: 0,
          explanation: 'Yo que tú — na twoim miejscu, a iría to condicional od ir: poszedłbym / poszłabym.',
        },
      ],
      dialogue: {
        id: 'es.d.25',
        title: 'Przysługa przed egzaminem',
        context: 'Kamila studiuje na wymianie w Guadalajarze. W poniedziałek ma egzamin z hiszpańskiego i prosi kolegę Emilia o pomoc.',
        speakers: {
          K: { name: 'Kamila', voice: 'a', accent: 'es-MX' },
          E: { name: 'Emilio', voice: 'b', accent: 'es-MX' },
        },
        lines: [
          { speaker: 'K', text: 'Emilio, ¿me harías un favor?', pl: 'Emilio, zrobiłbyś mi przysługę?' },
          { speaker: 'E', text: 'Claro que sí. ¿Qué necesitas?', pl: 'No jasne. Czego potrzebujesz?' },
          { speaker: 'K', text: 'El lunes tengo un examen de español. ¿Podrías ayudarme a estudiar?', pl: 'W poniedziałek mam egzamin z hiszpańskiego. Mógłbyś pomóc mi się uczyć?' },
          { speaker: 'E', text: 'Con mucho gusto. ¿Te gustaría estudiar hoy en la biblioteca?', pl: 'Z przyjemnością. Chciałabyś pouczyć się dziś w bibliotece?' },
          { speaker: 'K', text: 'Me encantaría, pero hoy trabajo hasta las siete.', pl: 'Bardzo bym chciała, ale dziś pracuję do siódmej.' },
          { speaker: 'E', text: 'Entonces podríamos estudiar en mi casa a las ocho.', pl: 'To moglibyśmy uczyć się u mnie o ósmej.' },
          { speaker: 'K', text: '¡Perfecto! ¿Y qué debería estudiar primero?', pl: 'Świetnie! A czego powinnam uczyć się najpierw?' },
          { speaker: 'E', text: 'Yo que tú, estudiaría primero los verbos. ¡Son lo más difícil!', pl: 'Na twoim miejscu najpierw uczyłbym się czasowników. To jest najtrudniejsze!' },
        ],
        questions: [
          {
            id: 'es.d.25-q1',
            prompt: 'O co Kamila prosi Emilia?',
            options: ['O pomoc w nauce do egzaminu', 'O pożyczenie książki', 'O pomoc w pracy'],
            answer: 0,
            explanation: '„¿Podrías ayudarme a estudiar?” — mógłbyś pomóc mi się uczyć?',
          },
          {
            id: 'es.d.25-q2',
            prompt: 'Dlaczego nie uczą się dziś w bibliotece?',
            options: ['Bo biblioteka jest zamknięta', 'Bo Kamila pracuje do siódmej', 'Bo Emilio jest chory'],
            answer: 1,
            explanation: '„Me encantaría, pero hoy trabajo hasta las siete.” — Kamila dziś pracuje do siódmej.',
          },
          {
            id: 'es.d.25-q3',
            prompt: 'Co radzi Emilio?',
            options: ['Odpocząć przed egzaminem', 'Uczyć się w bibliotece', 'Najpierw uczyć się czasowników'],
            answer: 2,
            explanation: '„Yo que tú, estudiaría primero los verbos.” — na twoim miejscu najpierw uczyłbym się czasowników.',
          },
        ],
      },
      summary: [
        'Condicional: bezokolicznik + -ía, -ías, -ía, -íamos, -íais, -ían — hablaría, comería, viviría.',
        'Temat jak w futuro: tendría, podría, haría, diría, saldría, vendría, sabría, querría, pondría.',
        'Prośby: ¿podrías…?, ¿podría usted…?, ¿me harías un favor?; życzenia: me gustaría, me encantaría.',
        'Rady: deberías + bezokolicznik, yo que tú + condicional, sería mejor…',
      ],
      followUp: 'Za kilka minut powtórz pary futuro — condicional: tendré / tendría, haré / haría. W następnej lekcji nauczysz się wydawać polecenia: ven, haz, siéntate.',
    },
  ],
};
