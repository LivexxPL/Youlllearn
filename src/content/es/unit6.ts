import type { Unit } from '../types';
import { contentHelpers } from '../helpers';

const { word, noun, verb, phrase, sentence: s } = contentHelpers('es');

export const unit6: Unit = {
  id: 'es.u6',
  title: 'Opowiadamy o przeszłości',
  description: 'Czasy przeszłe indefinido i imperfecto: wczoraj, weekend, wakacje i dzieciństwo, a do tego porównania.',
  level: 'A2',
  lessons: [
    {
      id: 'es.l19',
      title: 'Wczoraj',
      subtitle: 'Ayer trabajé mucho',
      objective: 'Opowiesz, co wydarzyło się wczoraj i w zeszłym tygodniu — pierwszy czas przeszły prosty (czasowniki na -ar).',
      level: 'A2',
      minutes: 11,
      items: [
        word('anoche', 'anoche', 'wczoraj wieczorem', { pos: 'adv', plAlts: ['zeszłej nocy', 'wczoraj w nocy'] }),
        phrase('el-lunes-pasado', 'el lunes pasado', 'w zeszły poniedziałek', {
          plAlts: ['w ubiegły poniedziałek', 'zeszły poniedziałek'],
          note: 'Tak samo z innymi dniami: el viernes pasado, el sábado pasado.',
        }),
        phrase('la-semana-pasada', 'la semana pasada', 'w zeszłym tygodniu', { plAlts: ['w ubiegłym tygodniu', 'zeszły tydzień'] }),
        phrase('el-ano-pasado', 'el año pasado', 'w zeszłym roku', { plAlts: ['w ubiegłym roku', 'zeszły rok'] }),
        phrase('hace-dos-dias', 'hace dos días', 'dwa dni temu', {
          note: 'hace + okres czasu = … temu: hace una semana, hace un año. To inne hace niż w „hace calor”.',
        }),
        phrase('trabaje', 'trabajé', 'pracowałem / pracowałam', {
          plAlts: ['pracowałem', 'pracowałam'],
          note: 'Kreska jest obowiązkowa: trabajo = pracuję, trabajé = pracowałem / pracowałam.',
        }),
        phrase('trabajo-pret', 'trabajó', 'pracował / pracowała', {
          plAlts: ['pracował', 'pracowała'],
          note: 'Forma dla on / ona / pan / pani — też z kreską na końcu.',
        }),
        verb('llegar', 'llegar', 'przyjeżdżać; przychodzić', {
          plAlts: ['przyjechać', 'przyjść', 'dotrzeć', 'docierać'],
          note: 'W formie „ja”: llegué — u zachowuje twarde „g”.',
        }),
        verb('llamar', 'llamar', 'dzwonić; wołać', {
          plAlts: ['zadzwonić', 'zawołać'],
          note: 'llamar a alguien — zadzwonić do kogoś. To ten sam czasownik co w „me llamo” (dosłownie „nazywam się”).',
        }),
        verb('visitar', 'visitar', 'odwiedzać; zwiedzać', {
          plAlts: ['odwiedzić', 'zwiedzić'],
          note: 'Przed osobą stawiamy a: visité a mi abuela. Przed miejscem — nie: visité Toledo.',
        }),
        verb('terminar', 'terminar', 'kończyć', { plAlts: ['skończyć', 'zakończyć'] }),
        verb('tomar', 'tomar', 'brać; pić (coś)', {
          plAlts: ['wziąć', 'wypić'],
          note: 'tomar un café — wypić kawę, tomar el autobús — pojechać autobusem. W Ameryce Łacińskiej samo „tomar” często znaczy „pić alkohol”.',
        }),
      ],
      sentences: [
        s('19-1', 'Ayer trabajé hasta las seis.', 'Wczoraj pracowałem / pracowałam do szóstej.', {
          plAlts: ['Wczoraj pracowałem do szóstej.', 'Wczoraj pracowałam do szóstej.'],
        }),
        s('19-2', 'Anoche cené con mis padres.', 'Wczoraj wieczorem jadłem / jadłam kolację z rodzicami.', {
          plAlts: [
            'Wczoraj wieczorem jadłem kolację z rodzicami.',
            'Wczoraj wieczorem jadłam kolację z rodzicami.',
            'Wczoraj wieczorem zjadłem kolację z rodzicami.',
            'Wczoraj wieczorem zjadłam kolację z rodzicami.',
          ],
        }),
        s('19-3', '¿Cuándo llegaste a Madrid?', 'Kiedy przyjechałeś / przyjechałaś do Madrytu?', {
          plAlts: ['Kiedy przyjechałeś do Madrytu?', 'Kiedy przyjechałaś do Madrytu?'],
        }),
        s('19-4', 'La semana pasada visitamos Toledo.', 'W zeszłym tygodniu zwiedziliśmy Toledo.', {
          plAlts: ['W zeszłym tygodniu zwiedzaliśmy Toledo.', 'W zeszłym tygodniu zwiedziłyśmy Toledo.', 'W zeszłym tygodniu byliśmy w Toledo.'],
        }),
        s('19-5', 'Mi hermana terminó la universidad el año pasado.', 'Moja siostra skończyła studia w zeszłym roku.', {
          plAlts: ['W zeszłym roku moja siostra skończyła studia.', 'Moja siostra skończyła uniwersytet w zeszłym roku.'],
        }),
        s('19-6', 'Hace dos días llamé a mi abuela.', 'Dwa dni temu zadzwoniłem / zadzwoniłam do babci.', {
          plAlts: [
            'Dwa dni temu zadzwoniłem do babci.',
            'Dwa dni temu zadzwoniłam do babci.',
            'Dwa dni temu dzwoniłem do babci.',
            'Dwa dni temu dzwoniłam do babci.',
          ],
          accent: 'es-MX',
        }),
        s('19-7', 'Hoy he tomado un café, pero ayer tomé tres.', 'Dziś wypiłem / wypiłam jedną kawę, ale wczoraj trzy.', {
          plAlts: [
            'Dziś wypiłem jedną kawę, a wczoraj trzy.',
            'Dziś wypiłam jedną kawę, a wczoraj trzy.',
            'Dzisiaj wypiłem jedną kawę, ale wczoraj trzy.',
            'Dzisiaj wypiłam jedną kawę, ale wczoraj trzy.',
          ],
        }),
        s('19-8', 'Anoche me acosté muy tarde.', 'Wczoraj położyłem / położyłam się bardzo późno.', {
          plAlts: [
            'Wczoraj położyłem się bardzo późno.',
            'Wczoraj położyłam się bardzo późno.',
            'Wczoraj w nocy położyłem się bardzo późno.',
            'Wczoraj w nocy położyłam się bardzo późno.',
          ],
          accent: 'es-MX',
        }),
      ],
      grammar: [
        {
          id: 'es.g.indefinido-ar',
          title: 'Pretérito indefinido: czasowniki na -ar',
          body: [
            'Pretérito indefinido opowiada o zdarzeniach zakończonych w zamkniętym czasie: [[ayer]], [[anoche]], [[el lunes pasado]], [[la semana pasada]], [[el año pasado]], [[hace dos días]].',
            'Końcówki czasowników na -ar: **-é, -aste, -ó, -amos, -asteis, -aron**. Kreska w formach „ja” i „on / ona” jest obowiązkowa: [[trabajé]] — pracowałem / pracowałam, [[trabajó]] — pracował / pracowała, ale [[trabajo]] — pracuję!',
            'Forma „my” jest taka sama jak w czasie teraźniejszym: [[hablamos]] to „rozmawiamy” albo „rozmawialiśmy”. Wyjaśnia to kontekst: [[Ayer hablamos con Ana.]]',
            'W formie „ja” czasowniki na -gar dostają u, żeby g brzmiało twardo: llegar → [[llegué]]. Czasowniki zwrotne zachowują zaimek: [[me levanté]], [[te acostaste]].',
          ],
          table: {
            head: ['Osoba', 'trabajar', 'levantarse'],
            rows: [
              ['yo', 'trabajé', 'me levanté'],
              ['tú', 'trabajaste', 'te levantaste'],
              ['él / ella / usted', 'trabajó', 'se levantó'],
              ['nosotros / nosotras', 'trabajamos', 'nos levantamos'],
              ['vosotros / vosotras', 'trabajasteis', 'os levantasteis'],
              ['ellos / ellas / ustedes', 'trabajaron', 'se levantaron'],
            ],
          },
          contrast:
            'Polski czas przeszły zmienia się według rodzaju (pracowałem / pracowałam), a hiszpański nie: trabajé mówi każdy. Indefinido opisuje zamknięte zdarzenie, ale po polsku tłumaczymy je i czasownikiem dokonanym („wczoraj skończyłem książkę”), i niedokonanym („wczoraj pracowałem osiem godzin”).',
        },
        {
          id: 'es.g.perfecto-indefinido',
          title: 'He trabajado czy trabajé?',
          body: [
            'Znasz już pretérito perfecto: [[he trabajado]]. W Hiszpanii używa się go, gdy okres jeszcze trwa: [[hoy]], [[esta semana]], [[este año]] — [[Hoy he trabajado mucho.]]',
            'Gdy okres jest zamknięty — [[ayer]], [[anoche]], [[el lunes pasado]], [[el año pasado]] — wybieramy indefinido: [[Ayer trabajé mucho.]]',
            'W Ameryce Łacińskiej, np. w Meksyku, indefinido słychać znacznie częściej, także z „hoy”: [[Hoy trabajé mucho.]] Podobnie mówi się w części Hiszpanii, np. w Galicji i na Wyspach Kanaryjskich. Obie formy zrozumie każdy.',
          ],
          table: {
            head: ['Kiedy?', 'Hiszpania', 'Meksyk'],
            rows: [
              ['hoy', 'hoy he trabajado', 'hoy trabajé'],
              ['esta semana', 'esta semana he viajado', 'esta semana viajé'],
              ['ayer', 'ayer trabajé', 'ayer trabajé'],
              ['el año pasado', 'el año pasado viajé', 'el año pasado viajé'],
            ],
          },
          contrast:
            'Polski ma jeden czas przeszły, więc ten wybór jest dla nas nowy. Pomaga pytanie: czy okres, o którym mówię, już się skończył (wczoraj, w zeszłym roku)? Jeśli tak — indefinido. Jeśli trwa (dziś, w tym tygodniu) — w Hiszpanii perfecto.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'es.x.19-1',
          concept: 'es.g.indefinido-ar',
          sentence: 'Ayer ___ ocho horas.',
          pl: 'Wczoraj pracowałem osiem godzin.',
          options: ['trabajo', 'trabajé', 'trabajó'],
          answer: 'trabajé',
          explanation: 'Ja + zamknięty czas (ayer) → trabajé, z kreską. Trabajo to „pracuję”, a trabajó — „pracował / pracowała”.',
        },
        {
          type: 'gap',
          id: 'es.x.19-2',
          concept: 'es.g.indefinido-ar',
          sentence: 'Mis padres ___ a Madrid el lunes pasado.',
          pl: 'Moi rodzice przyjechali do Madrytu w zeszły poniedziałek.',
          options: ['llegaron', 'llegamos', 'llegó'],
          answer: 'llegaron',
          explanation: 'Ellos (oni — moi rodzice) → końcówka -aron: llegaron.',
        },
        {
          type: 'gap',
          id: 'es.x.19-3',
          concept: 'es.g.perfecto-indefinido',
          sentence: 'El año pasado ___ a México.',
          pl: 'W zeszłym roku pojechałem do Meksyku.',
          options: ['he viajado', 'viajo', 'viajé'],
          answer: 'viajé',
          explanation: 'El año pasado to zamknięty okres, więc indefinido: viajé. Perfecto (he viajado) pasuje do okresu, który trwa, np. este año.',
        },
        {
          type: 'choice',
          id: 'es.x.19-4',
          concept: 'es.g.perfecto-indefinido',
          prompt: 'Z którym określeniem czasu w Hiszpanii NIE użyjesz formy „he trabajado”?',
          options: ['hoy', 'el año pasado', 'esta semana'],
          answer: 1,
          explanation: 'El año pasado to okres zamknięty → el año pasado trabajé. Hoy i esta semana jeszcze trwają → he trabajado.',
        },
      ],
      dialogue: {
        id: 'es.d.19',
        title: 'Wczorajszy wieczór',
        context: 'Inés dzwoniła wczoraj do Bartka, ale nie odebrał. Dziś po południu spotykają się w kawiarni w Madrycie.',
        speakers: {
          I: { name: 'Inés', voice: 'a', accent: 'es-ES' },
          B: { name: 'Bartek', voice: 'b', accent: 'es-ES' },
        },
        lines: [
          { speaker: 'I', text: 'Bartek, ayer te llamé por la tarde. ¿Qué pasó?', pl: 'Bartek, wczoraj po południu do ciebie dzwoniłam. Co się stało?' },
          { speaker: 'B', text: 'Perdón. Trabajé hasta las nueve y luego cené con unos compañeros.', pl: 'Przepraszam. Pracowałem do dziewiątej, a potem jadłem kolację z kolegami z pracy.' },
          { speaker: 'I', text: '¿Y a qué hora llegaste a casa?', pl: 'A o której wróciłeś do domu?' },
          { speaker: 'B', text: 'Muy tarde, a la una. Y me acosté a las dos.', pl: 'Bardzo późno, o pierwszej. A położyłem się o drugiej.' },
          { speaker: 'I', text: '¡Qué noche! Hoy tienes que descansar.', pl: 'Co za noc! Dziś musisz odpocząć.' },
          { speaker: 'B', text: 'Imposible: hoy ya he trabajado seis horas.', pl: 'Niemożliwe: dziś przepracowałem już sześć godzin.' },
        ],
        questions: [
          {
            id: 'es.d.19-q1',
            prompt: 'Co Bartek robił wczoraj wieczorem?',
            options: ['Uczył się w bibliotece', 'Był w kinie z Inés', 'Jadł kolację z kolegami z pracy'],
            answer: 2,
            explanation: '„Trabajé hasta las nueve y luego cené con unos compañeros.” — pracował do dziewiątej, potem jadł kolację z kolegami.',
          },
          {
            id: 'es.d.19-q2',
            prompt: 'O której Bartek się położył?',
            options: ['O drugiej', 'O pierwszej', 'O dziewiątej'],
            answer: 0,
            explanation: '„Muy tarde, a la una. Y me acosté a las dos.” — o pierwszej wrócił do domu, a o drugiej się położył.',
          },
        ],
      },
      summary: [
        'Pretérito indefinido czasowników na -ar: -é, -aste, -ó, -amos, -asteis, -aron.',
        'Kreska zmienia znaczenie: trabajo (pracuję), trabajé (pracowałem / pracowałam), trabajó (pracował / pracowała).',
        'Określenia czasu: ayer, anoche, el lunes pasado, la semana pasada, el año pasado, hace dos días.',
        'W Hiszpanii: hoy he trabajado (okres trwa), ayer trabajé (okres zamknięty); w Meksyku indefinido także z hoy.',
      ],
    },
    {
      id: 'es.l20',
      title: 'Weekend',
      subtitle: 'Fui al cine',
      objective: 'Opowiesz, jak minął weekend: wyjścia, posiłki i nowe znajomości — z czasownikami na -er/-ir oraz ir i ser w czasie przeszłym.',
      level: 'A2',
      minutes: 11,
      items: [
        verb('salir', 'salir', 'wychodzić', {
          plAlts: ['wyjść', 'wyjeżdżać'],
          note: 'salgo (wychodzę), sales, sale… W przeszłości: salí, saliste, salió.',
        }),
        verb('volver', 'volver', 'wracać', { plAlts: ['wrócić'], note: 'Teraz: vuelvo (o → ue). W indefinido bez wymiany: volví, volvió.' }),
        verb('conocer', 'conocer', 'poznawać; znać', {
          plAlts: ['poznać', 'znać'],
          note: 'conozco — znam. Conocí a Marta — poznałem / poznałam Martę (przed osobą: a).',
        }),
        verb('ver', 'ver', 'widzieć; oglądać', { plAlts: ['zobaczyć', 'obejrzeć'], note: 'veo, ves, ve… W indefinido bez kresek: vi, viste, vio.' }),
        word('fui', 'fui', 'poszedłem / poszłam; byłem / byłam', {
          pos: 'verb',
          plAlts: ['poszedłem', 'poszłam', 'pojechałem', 'pojechałam'],
          note: 'Ir i ser mają w indefinido te same formy: fui al cine — poszedłem / poszłam do kina; fui profesor — byłem nauczycielem.',
        }),
        word('fue', 'fue', 'poszedł / poszła; był / była', {
          pos: 'verb',
          plAlts: ['poszedł', 'poszła', 'pojechał', 'pojechała', 'było'],
          note: 'Fue al cine — poszedł / poszła do kina. Fue genial — było świetnie.',
        }),
        noun('el-cine', 'el cine', 'kino', 'm'),
        noun('la-pelicula', 'la película', 'film', 'f'),
        noun('la-fiesta', 'la fiesta', 'impreza; przyjęcie', 'f', { plAlts: ['impreza', 'przyjęcie', 'święto'] }),
        noun('el-restaurante', 'el restaurante', 'restauracja', 'm'),
        noun('el-concierto', 'el concierto', 'koncert', 'm'),
        word('anteayer', 'anteayer', 'przedwczoraj', { pos: 'adv', tip: 'Ante znaczy „przed”: ante-ayer to dosłownie „przed wczoraj”.' }),
      ],
      sentences: [
        s('20-1', 'El sábado fui al cine con Marta.', 'W sobotę poszedłem / poszłam do kina z Martą.', {
          plAlts: ['W sobotę poszedłem do kina z Martą.', 'W sobotę poszłam do kina z Martą.', 'W sobotę byłem w kinie z Martą.', 'W sobotę byłam w kinie z Martą.'],
        }),
        s('20-2', 'Vimos una película española.', 'Obejrzeliśmy hiszpański film.', {
          plAlts: ['Oglądaliśmy hiszpański film.', 'Obejrzałyśmy hiszpański film.', 'Widzieliśmy hiszpański film.'],
        }),
        s('20-3', 'Después comimos en un restaurante mexicano.', 'Potem zjedliśmy w meksykańskiej restauracji.', {
          plAlts: ['Potem jedliśmy w meksykańskiej restauracji.', 'Potem zjadłyśmy w meksykańskiej restauracji.', 'Później zjedliśmy w meksykańskiej restauracji.'],
        }),
        s('20-4', '¿A qué hora volviste a casa?', 'O której wróciłeś / wróciłaś do domu?', {
          plAlts: ['O której wróciłeś do domu?', 'O której wróciłaś do domu?'],
          accent: 'es-MX',
        }),
        s('20-5', 'En la fiesta conocí a un chico de Bilbao.', 'Na imprezie poznałem / poznałam chłopaka z Bilbao.', {
          plAlts: ['Na imprezie poznałem chłopaka z Bilbao.', 'Na imprezie poznałam chłopaka z Bilbao.'],
        }),
        s('20-6', 'El domingo no salí de casa.', 'W niedzielę nie wychodziłem / nie wychodziłam z domu.', {
          plAlts: ['W niedzielę nie wychodziłem z domu.', 'W niedzielę nie wychodziłam z domu.', 'W niedzielę nie wyszedłem z domu.', 'W niedzielę nie wyszłam z domu.'],
        }),
        s('20-7', 'Anteayer mis amigos fueron a un concierto.', 'Przedwczoraj moi przyjaciele poszli na koncert.', {
          plAlts: ['Przedwczoraj moi znajomi poszli na koncert.', 'Przedwczoraj moi przyjaciele byli na koncercie.', 'Przedwczoraj moi znajomi byli na koncercie.'],
          accent: 'es-MX',
        }),
        s('20-8', 'La fiesta fue fantástica.', 'Impreza była fantastyczna.', { plAlts: ['Impreza była wspaniała.', 'Przyjęcie było fantastyczne.'] }),
      ],
      grammar: [
        {
          id: 'es.g.indefinido-er-ir',
          title: 'Indefinido: czasowniki na -er i -ir',
          body: [
            'Czasowniki na -er i -ir mają w indefinido wspólne końcówki: **-í, -iste, -ió, -imos, -isteis, -ieron**. [[comí]] — jadłem / jadłam, [[salió]] — wyszedł / wyszła.',
            'Tak jak przy -ar, kreska w formach „ja” i „on / ona” jest obowiązkowa: [[comí]], [[comió]]. Forma „my” czasowników na -ir jest taka sama jak w czasie teraźniejszym: [[salimos]] — wychodzimy albo wyszliśmy.',
            'Gdy przed końcówką stoi samogłoska, w formach „on / ona” i „oni” i zmienia się w y: leer → [[leyó]], [[leyeron]]. Krótkie ver nie ma kresek: [[vi]], [[viste]], [[vio]].',
            'W czasownikach na -er wymiana samogłoski z czasu teraźniejszego (vuelvo) w indefinido znika: [[volví]], [[volvió]]. Czasowniki na -ir z wymianą mają w formach „on / ona” i „oni” e → i albo o → u: [[dormí]], ale [[durmió]].',
          ],
          table: {
            head: ['Osoba', 'comer', 'salir', 'conocer'],
            rows: [
              ['yo', 'comí', 'salí', 'conocí'],
              ['tú', 'comiste', 'saliste', 'conociste'],
              ['él / ella / usted', 'comió', 'salió', 'conoció'],
              ['nosotros / nosotras', 'comimos', 'salimos', 'conocimos'],
              ['vosotros / vosotras', 'comisteis', 'salisteis', 'conocisteis'],
              ['ellos / ellas / ustedes', 'comieron', 'salieron', 'conocieron'],
            ],
          },
          contrast:
            'Po polsku „znać” i „poznać” to dwa czasowniki. Po hiszpańsku jest jeden — conocer — a w indefinido zwykle znaczy „poznać”: conocí a Marta en una fiesta — poznałem / poznałam Martę na imprezie. Przed osobą stawiamy a.',
        },
        {
          id: 'es.g.ir-ser-pasado',
          title: 'Fui: ir i ser w przeszłości',
          body: [
            'W indefinido czasowniki [[ir]] (iść, jechać) i [[ser]] (być) mają identyczne formy: [[fui]], [[fuiste]], [[fue]], [[fuimos]], [[fuisteis]], [[fueron]].',
            'Znaczenie podpowiada kontekst. Kierunek (a, al) → ir: [[Fui al cine.]] — Poszedłem / poszłam do kina. Ocena albo opis → ser: [[La fiesta fue genial.]] — Impreza była świetna.',
            'Te formy nie mają kresek: piszemy fui i fue.',
          ],
          table: {
            head: ['Osoba', 'ir / ser', 'przykład'],
            rows: [
              ['yo', 'fui', 'Fui al cine.'],
              ['tú', 'fuiste', '¿Fuiste a la fiesta?'],
              ['él / ella / usted', 'fue', 'Fue un día fantástico.'],
              ['nosotros / nosotras', 'fuimos', 'Fuimos al restaurante.'],
              ['vosotros / vosotras', 'fuisteis', '¿Fuisteis al concierto?'],
              ['ellos / ellas / ustedes', 'fueron', 'Fueron al cine.'],
            ],
          },
          contrast:
            'Po polsku mówimy „byłem w kinie” albo „poszedłem do kina”. Po hiszpańsku obie myśli najczęściej wyraża jedno zdanie: fui al cine. Zwróć uwagę na przyimek: po fui stoi a (dokąd?), a nie en.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'es.x.20-1',
          concept: 'es.g.indefinido-er-ir',
          sentence: 'El sábado ___ con mis amigos.',
          pl: 'W sobotę wyszedłem ze znajomymi.',
          options: ['salió', 'salí', 'sale'],
          answer: 'salí',
          explanation: 'Ja + indefinido czasownika na -ir → salí (z kreską). Salió to on / ona, a sale — czas teraźniejszy.',
        },
        {
          type: 'gap',
          id: 'es.x.20-2',
          concept: 'es.g.indefinido-er-ir',
          sentence: 'Ana ___ tres libros en verano.',
          pl: 'Ana przeczytała latem trzy książki.',
          options: ['leo', 'leió', 'leyó'],
          answer: 'leyó',
          explanation: 'W leer i między samogłoskami zmienia się w y: leyó. Formy „leió” nie ma, a leo to „czytam”.',
        },
        {
          type: 'gap',
          id: 'es.x.20-3',
          concept: 'es.g.ir-ser-pasado',
          sentence: '¿___ al concierto el viernes?',
          pl: 'Poszłaś na koncert w piątek?',
          options: ['Fuiste', 'Fue', 'Fui'],
          answer: 'Fuiste',
          explanation: 'Tú (ty) → fuiste. Kierunek (al concierto) pokazuje, że to czasownik ir.',
        },
        {
          type: 'choice',
          id: 'es.x.20-4',
          concept: 'es.g.ir-ser-pasado',
          optionsLang: 'pl',
          prompt: 'Co znaczy „fue” w zdaniu „La fiesta fue fantástica”?',
          options: ['poszła', 'była', 'będzie'],
          answer: 1,
          explanation: 'Nie ma tu kierunku (a…), tylko ocena — to forma czasownika ser: impreza była fantastyczna.',
        },
      ],
      dialogue: {
        id: 'es.d.20',
        title: 'Jak minął weekend?',
        context: 'W poniedziałek rano Diego z Meksyku pyta Zosię, co robiła w weekend.',
        speakers: {
          D: { name: 'Diego', voice: 'b', accent: 'es-MX' },
          Z: { name: 'Zosia', voice: 'a', accent: 'es-ES' },
        },
        lines: [
          { speaker: 'D', text: '¡Hola, Zosia! ¿Qué tal el fin de semana?', pl: 'Cześć, Zosia! Jak minął weekend?' },
          { speaker: 'Z', text: 'Muy bien. El sábado fui a una fiesta en casa de Nuria.', pl: 'Bardzo dobrze. W sobotę byłam na imprezie u Nurii.' },
          { speaker: 'D', text: '¿Y qué tal la fiesta?', pl: 'I jak było na imprezie?' },
          { speaker: 'Z', text: 'Fue genial. Comimos tacos y conocí a una chica de Guadalajara.', pl: 'Było świetnie. Jedliśmy tacos i poznałam dziewczynę z Guadalajary.' },
          { speaker: 'D', text: '¿De Guadalajara? ¡Yo también soy de allí! ¿Cómo se llama?', pl: 'Z Guadalajary? Ja też stamtąd jestem! Jak ma na imię?' },
          { speaker: 'Z', text: 'Paola. Y el domingo no salí de casa: ¡dormí todo el día!', pl: 'Paola. A w niedzielę nie wychodziłam z domu: spałam cały dzień!' },
        ],
        questions: [
          {
            id: 'es.d.20-q1',
            prompt: 'Gdzie była Zosia w sobotę?',
            options: ['W kinie z Diegiem', 'Na imprezie u Nurii', 'W Guadalajarze'],
            answer: 1,
            explanation: '„El sábado fui a una fiesta en casa de Nuria.” — w sobotę była na imprezie u Nurii.',
          },
          {
            id: 'es.d.20-q2',
            prompt: 'Co Zosia robiła w niedzielę?',
            options: ['Poszła na koncert', 'Gotowała tacos', 'Nie wychodziła z domu i spała'],
            answer: 2,
            explanation: '„El domingo no salí de casa: ¡dormí todo el día!”',
          },
        ],
      },
      summary: [
        'Indefinido -er/-ir: -í, -iste, -ió, -imos, -isteis, -ieron — comí, salió, conocimos.',
        'Leer → leyó, leyeron; ver → vi, vio (bez kresek); volver → volví (bez wymiany o → ue).',
        'Ir i ser: fui, fuiste, fue, fuimos, fuisteis, fueron — znaczenie wynika z kontekstu.',
        'Fui al cine (kierunek → ir), la fiesta fue genial (ocena → ser).',
        'Conocí a Marta — poznałem / poznałam Martę (przed osobą: a).',
      ],
    },
    {
      id: 'es.l21',
      title: 'Wakacje',
      subtitle: '¿Qué tal el viaje?',
      objective: 'Opowiesz o wakacyjnej podróży: dokąd i na jak długo, co udało się zrobić i jak było.',
      level: 'A2',
      minutes: 12,
      items: [
        word('hice', 'hice', 'zrobiłem / zrobiłam; robiłem / robiłam', {
          pos: 'verb',
          plAlts: ['zrobiłem', 'zrobiłam', 'robiłem', 'robiłam'],
          note: 'Od hacer. On / ona: hizo — przez z!',
        }),
        word('tuve', 'tuve', 'miałem / miałam', { pos: 'verb', plAlts: ['miałem', 'miałam'], note: 'Od tener: tuve, tuviste, tuvo…' }),
        word('estuve', 'estuve', 'byłem / byłam (gdzieś)', {
          pos: 'verb',
          plAlts: ['byłem', 'byłam', 'przebywałem', 'przebywałam'],
          note: 'Od estar — o pobycie w jakimś miejscu: estuve dos semanas en México.',
        }),
        word('pude', 'pude', 'mogłem / mogłam; udało mi się', {
          pos: 'verb',
          plAlts: ['mogłem', 'mogłam', 'udało mi się'],
          note: 'Od poder. No pude — nie mogłem / nie mogłam, nie dałem / nie dałam rady.',
        }),
        word('vine', 'vine', 'przyszedłem / przyszłam; przyjechałem / przyjechałam', {
          pos: 'verb',
          plAlts: ['przyszedłem', 'przyszłam', 'przyjechałem', 'przyjechałam'],
          note: 'Od venir (przychodzić, przyjeżdżać). On / ona: vino — brzmi tak samo jak el vino (wino)!',
        }),
        noun('las-vacaciones', 'las vacaciones', 'wakacje; urlop', 'pl', {
          plAlts: ['wakacje', 'urlop'],
          note: 'Zawsze w liczbie mnogiej. Ir de vacaciones — jechać na wakacje.',
        }),
        noun('el-viaje', 'el viaje', 'podróż; wyjazd', 'm', { plAlts: ['podróż', 'wyjazd', 'wycieczka'] }),
        noun('la-playa', 'la playa', 'plaża', 'f', { note: 'Ir a la playa — jechać na plażę, nad morze.' }),
        noun('el-mar', 'el mar', 'morze', 'm'),
        noun('la-montana', 'la montaña', 'góra; góry', 'f', { plAlts: ['góry', 'góra'], note: 'Ir a la montaña — jechać w góry (w liczbie pojedynczej!).' }),
        word('agosto', 'agosto', 'sierpień', {
          pos: 'noun',
          note: 'Miesiące piszemy małą literą i zwykle bez rodzajnika: en agosto — w sierpniu.',
        }),
        phrase('que-tal-el-viaje', '¿qué tal el viaje?', 'jak minęła podróż?', {
          plAlts: ['jak było w podróży?', 'jak podróż?'],
          note: 'W Meksyku często też: ¿cómo te fue? — jak ci poszło?',
        }),
      ],
      sentences: [
        s('21-1', '¿Qué tal el viaje a Oaxaca?', 'Jak minęła podróż do Oaxaki?', { plAlts: ['Jak było w Oaxace?', 'Jak tam podróż do Oaxaki?'], accent: 'es-MX' }),
        s('21-2', 'Estuve dos semanas en México.', 'Byłem / byłam dwa tygodnie w Meksyku.', {
          plAlts: ['Byłem dwa tygodnie w Meksyku.', 'Byłam dwa tygodnie w Meksyku.', 'Byłem w Meksyku dwa tygodnie.', 'Byłam w Meksyku dwa tygodnie.'],
        }),
        s('21-3', 'Hicimos muchas fotos en la playa.', 'Zrobiliśmy dużo zdjęć na plaży.', {
          plAlts: ['Zrobiłyśmy dużo zdjęć na plaży.', 'Na plaży zrobiliśmy dużo zdjęć.'],
          note: 'W Meksyku częściej: tomamos muchas fotos.',
        }),
        s('21-4', 'No pude ir a la montaña porque llovió.', 'Nie mogłem / nie mogłam pojechać w góry, bo padało.', {
          plAlts: [
            'Nie mogłem pojechać w góry, bo padało.',
            'Nie mogłam pojechać w góry, bo padało.',
            'Nie udało mi się pojechać w góry, bo padało.',
            'Nie mogłem pojechać w góry, bo padał deszcz.',
            'Nie mogłam pojechać w góry, bo padał deszcz.',
          ],
        }),
        s('21-5', 'Tuvimos un problema en el aeropuerto.', 'Mieliśmy problem na lotnisku.', { plAlts: ['Miałyśmy problem na lotnisku.', 'Na lotnisku mieliśmy problem.'], accent: 'es-MX' }),
        s('21-6', 'Mis amigos vinieron a Polonia en agosto.', 'Moi przyjaciele przyjechali do Polski w sierpniu.', {
          plAlts: ['Moi znajomi przyjechali do Polski w sierpniu.', 'W sierpniu moi przyjaciele przyjechali do Polski.'],
        }),
        s('21-7', 'Fue un viaje fantástico.', 'To była fantastyczna podróż.', { plAlts: ['To była wspaniała podróż.', 'Podróż była fantastyczna.'], accent: 'es-MX' }),
        s('21-8', 'Todos los días hizo mucho calor.', 'Codziennie było bardzo gorąco.', { plAlts: ['Każdego dnia było bardzo gorąco.'], accent: 'es-MX' }),
      ],
      grammar: [
        {
          id: 'es.g.indefinido-irregular',
          title: 'Nieregularne indefinido: hice, tuve, estuve',
          body: [
            'Kilka częstych czasowników ma w indefinido nieregularny temat i własne końcówki: **-e, -iste, -o, -imos, -isteis, -ieron**. Te formy **nie mają kresek**: [[hice]], [[tuve]], [[estuve]], [[pude]], [[vine]].',
            'Wystarczy zapamiętać temat: hacer → **hic-** (ale [[hizo]] przez z, żeby zachować wymowę), tener → **tuv-**, estar → **estuv-**, poder → **pud-**, venir → **vin-**.',
            '[[pude]] często znaczy „udało mi się”, a [[no pude]] — „nie dałem / nie dałam rady”: [[No pude ir a la playa.]]',
            'Hacer w przeszłości opisuje też pogodę: [[Hizo mucho calor.]] — Było bardzo gorąco.',
          ],
          table: {
            head: ['Osoba', 'hacer', 'tener', 'estar', 'poder', 'venir'],
            rows: [
              ['yo', 'hice', 'tuve', 'estuve', 'pude', 'vine'],
              ['tú', 'hiciste', 'tuviste', 'estuviste', 'pudiste', 'viniste'],
              ['él / ella / usted', 'hizo', 'tuvo', 'estuvo', 'pudo', 'vino'],
              ['nosotros / nosotras', 'hicimos', 'tuvimos', 'estuvimos', 'pudimos', 'vinimos'],
              ['vosotros / vosotras', 'hicisteis', 'tuvisteis', 'estuvisteis', 'pudisteis', 'vinisteis'],
              ['ellos / ellas / ustedes', 'hicieron', 'tuvieron', 'estuvieron', 'pudieron', 'vinieron'],
            ],
          },
          contrast:
            'Polski też ma nieregularne formy przeszłe (iść → szedłem, jeść → jadłem), więc zasada jest znajoma: trzeba je zapamiętać. Pomaga to, że wszystkie te czasowniki mają te same końcówki i żadnej kreski.',
        },
        {
          id: 'es.g.fui-estuve',
          title: 'Fui, estuve czy fue? Opowieść o podróży',
          body: [
            'Polskie „byłem / byłam” ma po hiszpańsku kilka odpowiedników. O wyjeździe — dokąd — mówi [[fui]] (od ir): [[Fui a México en agosto.]] — W sierpniu pojechałem / pojechałam do Meksyku.',
            'O pobycie — gdzie i jak długo — mówi [[estuve]] (od estar): [[Estuve dos semanas en Oaxaca.]] — Byłem / byłam dwa tygodnie w Oaxace. Długość pobytu podajemy bez przyimka.',
            'Ocenę całego wyjazdu wyraża [[fue]] (od ser): [[Fue un viaje fantástico.]] W Meksyku często słychać też estuvo: [[¡Estuvo padrísimo!]] — Było super!',
            'O wrażenia pytamy: [[¿Qué tal el viaje?]] W Meksyku także: [[¿Cómo te fue?]] — Jak było? Jak ci poszło?',
          ],
          table: {
            head: ['Po polsku', 'Po hiszpańsku', 'czasownik'],
            rows: [
              ['pojechałem do Meksyku', 'fui a México', 'ir'],
              ['byłem dwa tygodnie w Meksyku', 'estuve dos semanas en México', 'estar'],
              ['to była wspaniała podróż', 'fue un viaje fantástico', 'ser'],
            ],
          },
          contrast:
            'Po polsku „byłem w Meksyku” wystarcza na wszystko. Po hiszpańsku wybierasz: kierunek — fui a…, pobyt — estuve en…, ocena — fue… Po fui stoi a (dokąd?), a po estuve — en (gdzie?).',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'es.x.21-1',
          concept: 'es.g.indefinido-irregular',
          sentence: '¿Qué ___ en las vacaciones?',
          pl: 'Co robiłeś na wakacjach?',
          options: ['haciste', 'hiciste', 'hizo'],
          answer: 'hiciste',
          explanation: 'Hacer ma w indefinido temat hic-: hiciste. „Haciste” to częsty błąd, a hizo to forma dla on / ona.',
        },
        {
          type: 'gap',
          id: 'es.x.21-2',
          concept: 'es.g.indefinido-irregular',
          sentence: 'El verano pasado ___ dos semanas en Cancún.',
          pl: 'Zeszłego lata byłam dwa tygodnie w Cancún.',
          options: ['estuve', 'estuvo', 'estuvé'],
          answer: 'estuve',
          explanation: 'Ja → estuve. Formy nieregularne nie mają kreski (nie „estuvé”), a estuvo to on / ona.',
        },
        {
          type: 'gap',
          id: 'es.x.21-3',
          concept: 'es.g.fui-estuve',
          sentence: 'En agosto ___ a la playa con mis padres.',
          pl: 'W sierpniu pojechałem z rodzicami nad morze.',
          options: ['estuve', 'fue', 'fui'],
          answer: 'fui',
          explanation: 'Kierunek (a la playa) → ir: fui. Estuve mówi o pobycie (estuve en la playa), a fue to forma dla on / ona albo ocena.',
        },
        {
          type: 'choice',
          id: 'es.x.21-4',
          concept: 'es.g.indefinido-irregular',
          optionsLang: 'pl',
          prompt: 'Co znaczy „No pude ir a la montaña”?',
          options: ['Nie udało mi się pojechać w góry.', 'Nie chciałem jechać w góry.', 'Nie lubię jeździć w góry.'],
          answer: 0,
          explanation: 'Pude to forma poder (móc): no pude — nie mogłem / nie mogłam, nie udało mi się.',
        },
      ],
      dialogue: {
        id: 'es.d.21',
        title: 'Powrót z Oaxaki',
        context: 'Valeria wróciła do miasta Meksyk z wakacji i spotyka kolegę Andrésa. Oaxaca czyta się mniej więcej „łahaka”.',
        speakers: {
          A: { name: 'Andrés', voice: 'b', accent: 'es-MX' },
          V: { name: 'Valeria', voice: 'a', accent: 'es-MX' },
        },
        lines: [
          { speaker: 'A', text: '¡Valeria! ¿Qué tal el viaje?', pl: 'Valeria! Jak minęła podróż?' },
          { speaker: 'V', text: '¡Increíble! Estuve dos semanas en Oaxaca con mi hermana.', pl: 'Niesamowicie! Byłam dwa tygodnie w Oaxace z siostrą.' },
          { speaker: 'A', text: '¿Y qué hicieron?', pl: 'I co robiłyście?' },
          { speaker: 'V', text: 'Fuimos a la playa, visitamos museos y comimos muchísimo.', pl: 'Byłyśmy na plaży, zwiedzałyśmy muzea i bardzo dużo jadłyśmy.' },
          { speaker: 'A', text: '¿Y a la montaña? ¿Pudieron ir?', pl: 'A w góry? Udało wam się pojechać?' },
          { speaker: 'V', text: 'No, no pudimos: llovió tres días. Pero todo lo demás estuvo padrísimo.', pl: 'Nie, nie dałyśmy rady: przez trzy dni padało. Ale cała reszta była super.' },
          { speaker: 'A', text: '¡Qué padre! El año que viene voy yo.', pl: 'Ale fajnie! W przyszłym roku ja jadę.' },
        ],
        questions: [
          {
            id: 'es.d.21-q1',
            prompt: 'Z kim Valeria była w Oaxace?',
            options: ['Z Andrésem', 'Z siostrą', 'Z rodzicami'],
            answer: 1,
            explanation: '„Estuve dos semanas en Oaxaca con mi hermana.” — była tam z siostrą.',
          },
          {
            id: 'es.d.21-q2',
            prompt: 'Dlaczego nie pojechały w góry?',
            options: ['Bo padało', 'Bo nie miały czasu', 'Bo było za gorąco'],
            answer: 0,
            explanation: '„No pudimos: llovió tres días.” — przez trzy dni padało.',
          },
        ],
      },
      summary: [
        'Nieregularne indefinido bez kresek: hice, tuve, estuve, pude, vine.',
        'On / ona: hizo, tuvo, estuvo, pudo, vino; pogoda: hizo calor.',
        'Fui a… (wyjazd), estuve en… (pobyt), fue… (ocena).',
        '¿Qué tal el viaje? W Meksyku też ¿cómo te fue?, a zamiast vosotros — ustedes: ¿qué hicieron?',
      ],
    },
    {
      id: 'es.l22',
      title: 'Porównania',
      subtitle: 'Más grande que…',
      objective: 'Porównasz miasta, ludzi i rzeczy: powiesz, co jest większe, tańsze, lepsze albo najładniejsze.',
      level: 'A2',
      minutes: 10,
      items: [
        word('mas', 'más', 'więcej; bardziej', { pos: 'adv', plAlts: ['więcej', 'bardziej'], note: 'Z kreską! más grande que… — większy niż…' }),
        word('menos', 'menos', 'mniej', { pos: 'adv', note: 'menos caro que… — mniej drogi niż… Znasz je już z godzin: menos cuarto.' }),
        word('mejor', 'mejor', 'lepszy; lepiej', { pos: 'adj', plAlts: ['lepszy', 'lepsza', 'lepsze', 'lepiej'], note: 'Stopień wyższy od bueno (dobry) i bien (dobrze).' }),
        word('peor', 'peor', 'gorszy; gorzej', { pos: 'adj', plAlts: ['gorszy', 'gorsza', 'gorsze', 'gorzej'], note: 'Stopień wyższy od malo (zły) i mal (źle).' }),
        word('mayor', 'mayor', 'starszy', { pos: 'adj', plAlts: ['starsza', 'starsze', 'większy'], note: 'Zwykle o wieku: mi hermano mayor — mój starszy brat.' }),
        word('menor', 'menor', 'młodszy', { pos: 'adj', plAlts: ['młodsza', 'młodsze', 'mniejszy'], note: 'Zwykle o wieku: mi hermana menor — moja młodsza siostra.' }),
        word('grande', 'grande', 'duży', { pos: 'adj', plAlts: ['duża', 'duże', 'wielki'], note: 'Jedna forma dla obu rodzajów, w liczbie mnogiej: grandes.' }),
        word('pequeno', 'pequeño', 'mały', { pos: 'adj', plAlts: ['mała', 'małe'], note: 'pequeña, pequeños, pequeñas' }),
        word('caro', 'caro', 'drogi', { pos: 'adj', plAlts: ['droga', 'drogie'], note: 'cara, caros, caras' }),
        word('barato', 'barato', 'tani', { pos: 'adj', plAlts: ['tania', 'tanie'], note: 'barata, baratos, baratas' }),
        word('alto', 'alto', 'wysoki', { pos: 'adj', plAlts: ['wysoka', 'wysokie'], note: 'Przeciwieństwo: bajo — niski.' }),
        word('bonito', 'bonito', 'ładny', { pos: 'adj', plAlts: ['ładna', 'ładne', 'piękny'], note: 'bonita, bonitos, bonitas. Pamiętasz „¡Qué bonita!”?' }),
      ],
      sentences: [
        s('22-1', 'Madrid es más grande que Barcelona.', 'Madryt jest większy niż Barcelona.', { plAlts: ['Madryt jest większy od Barcelony.'] }),
        s('22-2', 'El autobús es más barato que el tren.', 'Autobus jest tańszy niż pociąg.', { plAlts: ['Autobus jest tańszy od pociągu.'] }),
        s('22-3', 'Mi hermana es tan alta como mi padre.', 'Moja siostra jest tak wysoka jak mój tata.', {
          plAlts: ['Moja siostra jest tak samo wysoka jak tata.', 'Moja siostra jest tak wysoka jak mój ojciec.'],
        }),
        s('22-4', 'Mi hermano mayor tiene treinta años.', 'Mój starszy brat ma trzydzieści lat.'),
        s('22-5', 'Este hotel es mejor, pero es más caro.', 'Ten hotel jest lepszy, ale droższy.', { plAlts: ['Ten hotel jest lepszy, ale jest droższy.'] }),
        s('22-6', 'Para mí, el invierno es peor que el verano.', 'Dla mnie zima jest gorsza niż lato.', { plAlts: ['Dla mnie zima jest gorsza od lata.'], accent: 'es-MX' }),
        s('22-7', 'Guanajuato es la ciudad más bonita de México.', 'Guanajuato to najpiękniejsze miasto w Meksyku.', {
          plAlts: ['Guanajuato to najładniejsze miasto w Meksyku.', 'Guanajuato jest najpiękniejszym miastem w Meksyku.'],
          accent: 'es-MX',
        }),
        s('22-8', 'Hoy hace menos frío que ayer.', 'Dziś jest mniej zimno niż wczoraj.', {
          plAlts: ['Dzisiaj jest mniej zimno niż wczoraj.', 'Dziś jest cieplej niż wczoraj.'],
        }),
      ],
      grammar: [
        {
          id: 'es.g.comparison',
          title: 'Más… que, menos… que, tan… como',
          body: [
            'Porównujemy przez [[más]] + przymiotnik + [[que]] (bardziej… niż) albo [[menos]] + przymiotnik + [[que]] (mniej… niż): [[Madrid es más grande que Toledo.]], [[El autobús es menos caro que el tren.]]',
            'Równość: [[tan]] + przymiotnik + [[como]]: [[Ana es tan alta como yo.]] — Ana jest tak wysoka jak ja. Z czasownikiem mówimy [[tanto como]]: [[Trabajo tanto como tú.]] — Pracuję tyle, co ty.',
            'Po que i como stawiamy zwykłe zaimki osobowe: [[más alto que yo]], [[tan alta como tú]].',
          ],
          table: {
            head: ['Znaczenie', 'Wzór', 'Przykład'],
            rows: [
              ['bardziej, więcej', 'más … que', 'más caro que el tren'],
              ['mniej', 'menos … que', 'menos caro que el tren'],
              ['tak samo', 'tan … como', 'tan caro como el tren'],
              ['tyle samo (czasownik)', 'tanto como', 'trabajo tanto como tú'],
            ],
          },
          contrast:
            'Polski często stopniuje końcówką: droższy, tańszy, wyższy. Hiszpański prawie zawsze dodaje słowo más: más caro, más barato, más alto. „Niż” to que, a „tak… jak” — tan… como.',
        },
        {
          id: 'es.g.superlative',
          title: 'Mejor, peor, mayor, menor i el más…',
          body: [
            'Cztery przymiotniki mają własne formy stopnia wyższego: bueno → [[mejor]], malo → [[peor]], grande → [[mayor]], pequeño → [[menor]]. Zamiast „más bueno” mówimy zwykle mejor: [[Este café es mejor que el otro.]]',
            '[[mayor]] i [[menor]] dotyczą najczęściej wieku: [[mi hermano mayor]] — mój starszy brat, [[mi hermana menor]] — moja młodsza siostra. O rozmiarze mówimy zwykle más grande, más pequeño.',
            'Stopień najwyższy: rodzajnik + rzeczownik + más + przymiotnik + de: [[Es la ciudad más bonita de España.]] — To najpiękniejsze miasto w Hiszpanii. Z formą nieregularną: [[el mejor restaurante de Madrid]].',
          ],
          table: {
            head: ['Przymiotnik', 'Stopień wyższy', 'Stopień najwyższy'],
            rows: [
              ['bueno — dobry', 'mejor', 'el mejor, la mejor'],
              ['malo — zły', 'peor', 'el peor, la peor'],
              ['grande — duży (o wieku)', 'mayor', 'el mayor, la mayor'],
              ['pequeño — mały (o wieku)', 'menor', 'el menor, la menor'],
              ['caro — drogi', 'más caro', 'el más caro, la más cara'],
            ],
          },
          contrast:
            'Po polsku po stopniu najwyższym mówimy „w”: najwyższy w klasie, najpiękniejsze miasto w Hiszpanii. Po hiszpańsku — de: el más alto de la clase, la ciudad más bonita de España.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'es.x.22-1',
          concept: 'es.g.comparison',
          sentence: 'Madrid es más grande ___ Toledo.',
          pl: 'Madryt jest większy niż Toledo.',
          options: ['que', 'como', 'de'],
          answer: 'que',
          explanation: '„Niż” w porównaniu to que: más grande que. Como pasuje do tan… como.',
        },
        {
          type: 'gap',
          id: 'es.x.22-2',
          concept: 'es.g.comparison',
          sentence: 'Mi hermano estudia ___ como yo.',
          pl: 'Mój brat uczy się tyle, co ja.',
          options: ['tan', 'tanto', 'más'],
          answer: 'tanto',
          explanation: 'Z czasownikiem (estudia) porównujemy przez tanto como. Tan stoi przed przymiotnikiem: tan alto como.',
        },
        {
          type: 'gap',
          id: 'es.x.22-3',
          concept: 'es.g.superlative',
          sentence: 'Este restaurante es ___ que el otro.',
          pl: 'Ta restauracja jest lepsza niż tamta.',
          options: ['más mejor', 'el mejor', 'mejor'],
          answer: 'mejor',
          explanation: 'Mejor samo znaczy już „lepszy”, więc nie dodajemy más. El mejor to stopień najwyższy (najlepszy).',
        },
        {
          type: 'choice',
          id: 'es.x.22-4',
          concept: 'es.g.superlative',
          prompt: 'Jak powiesz: „To najtańszy hotel w mieście”?',
          options: ['Es el hotel más barato de la ciudad.', 'Es el hotel más barato que la ciudad.', 'Es el hotel tan barato como la ciudad.'],
          answer: 0,
          explanation: 'Stopień najwyższy: el + rzeczownik + más + przymiotnik + de. Polskie „w mieście” to tutaj de la ciudad.',
        },
      ],
      dialogue: {
        id: 'es.d.22',
        title: 'Madryt czy Barcelona?',
        context: 'Kasia wybiera się na semestr do Hiszpanii i pyta Jordiego, które miasto wybrać.',
        speakers: {
          K: { name: 'Kasia', voice: 'a', accent: 'es-ES' },
          J: { name: 'Jordi', voice: 'b', accent: 'es-ES' },
        },
        lines: [
          { speaker: 'K', text: 'Jordi, ¿qué ciudad es mejor para estudiar: Madrid o Barcelona?', pl: 'Jordi, które miasto jest lepsze na studia: Madryt czy Barcelona?' },
          { speaker: 'J', text: 'Las dos son fantásticas. Madrid es más grande, pero Barcelona tiene playa.', pl: 'Oba są fantastyczne. Madryt jest większy, ale Barcelona ma plażę.' },
          { speaker: 'K', text: '¿Y es más cara Barcelona?', pl: 'A Barcelona jest droższa?' },
          { speaker: 'J', text: 'Un poco, pero Madrid tampoco es barato.', pl: 'Trochę, ale Madryt też nie jest tani.' },
          { speaker: 'K', text: '¿Y el tiempo?', pl: 'A pogoda?' },
          {
            speaker: 'J',
            text: 'En invierno hace más frío en Madrid. Para mí, Barcelona es la mejor ciudad de España… ¡pero soy de allí!',
            pl: 'Zimą w Madrycie jest zimniej. Dla mnie Barcelona to najlepsze miasto w Hiszpanii… ale ja jestem stamtąd!',
          },
        ],
        questions: [
          {
            id: 'es.d.22-q1',
            prompt: 'Co według Jordiego ma Barcelona, a Madryt nie?',
            options: ['Jest większa', 'Ma plażę', 'Jest tańsza'],
            answer: 1,
            explanation: '„Madrid es más grande, pero Barcelona tiene playa.” — Madryt jest większy, ale Barcelona ma plażę.',
          },
          {
            id: 'es.d.22-q2',
            prompt: 'Gdzie zimą jest zimniej?',
            options: ['W Barcelonie', 'Tak samo w obu miastach', 'W Madrycie'],
            answer: 2,
            explanation: '„En invierno hace más frío en Madrid.” — zimą w Madrycie jest zimniej.',
          },
        ],
      },
      summary: [
        'Más / menos + przymiotnik + que: Madrid es más grande que Toledo.',
        'Tan + przymiotnik + como (tak… jak), czasownik + tanto como (tyle, co).',
        'Formy nieregularne: mejor, peor, mayor (starszy), menor (młodszy).',
        'Stopień najwyższy: el / la más… de — la ciudad más bonita de España.',
      ],
    },
    {
      id: 'es.l23',
      title: 'Kiedy byłem dzieckiem',
      subtitle: 'Cuando era niño…',
      objective: 'Opowiesz o dzieciństwie i dawnych zwyczajach oraz odróżnisz tło opowieści (imperfecto) od pojedynczych zdarzeń (indefinido).',
      level: 'A2',
      minutes: 12,
      items: [
        noun('el-nino', 'el niño / la niña', 'chłopiec / dziewczynka; dziecko', 'm', {
          tts: 'el niño, la niña',
          alts: ['el niño', 'la niña'],
          plAlts: ['chłopiec', 'dziewczynka', 'dziecko'],
          note: 'Los niños — dzieci. Cuando era niño / niña — kiedy byłem dzieckiem / byłam dzieckiem.',
        }),
        phrase('de-pequeno', 'de pequeño / de pequeña', 'w dzieciństwie; jako dziecko', {
          tts: 'de pequeño, de pequeña',
          alts: ['de pequeño', 'de pequeña'],
          plAlts: ['w dzieciństwie', 'jako dziecko', 'kiedy byłem mały', 'kiedy byłam mała'],
          note: 'Mężczyzna mówi „de pequeño”, kobieta „de pequeña”. W Meksyku częściej: de niño / de niña.',
        }),
        word('era', 'era', 'byłem / byłam (kiedyś)', {
          pos: 'verb',
          plAlts: ['byłem', 'byłam', 'był', 'była', 'było'],
          note: 'Imperfecto od ser. Ta sama forma dla „ja” i „on / ona”: yo era, él era.',
        }),
        word('iba', 'iba', 'chodziłem / chodziłam; jeździłem / jeździłam', {
          pos: 'verb',
          plAlts: ['chodziłem', 'chodziłam', 'jeździłem', 'jeździłam', 'chodził', 'chodziła'],
          note: 'Imperfecto od ir: iba, ibas, iba, íbamos, ibais, iban.',
        }),
        word('veia', 'veía', 'widziałem / widziałam; oglądałem / oglądałam', {
          pos: 'verb',
          plAlts: ['widziałem', 'widziałam', 'oglądałem', 'oglądałam', 'widywałem', 'widywałam'],
          note: 'Imperfecto od ver: veía, veías, veía… — z kreską na í.',
        }),
        verb('jugar', 'jugar', 'grać; bawić się', { plAlts: ['grać', 'bawić się'], note: 'u → ue: juego, juegas… Imperfecto: jugaba. Jugar al fútbol — grać w piłkę nożną.' }),
        word('siempre', 'siempre', 'zawsze', { pos: 'adv' }),
        phrase('a-menudo', 'a menudo', 'często', { plAlts: ['nieraz'] }),
        word('antes', 'antes', 'dawniej; kiedyś', { pos: 'adv', plAlts: ['dawniej', 'kiedyś', 'wcześniej', 'przedtem'], note: 'Antes de — przed (czymś): antes de cenar.' }),
        noun('el-pueblo', 'el pueblo', 'wieś; miasteczko', 'm', { plAlts: ['wieś', 'miasteczko', 'wioska'] }),
        noun('el-colegio', 'el colegio', 'szkoła', 'm', { plAlts: ['szkoła podstawowa'], note: 'W Hiszpanii — szkoła dla dzieci. W Meksyku mówi się zwykle la escuela.' }),
        phrase('un-dia', 'un día', 'pewnego dnia', { plAlts: ['jednego dnia'], note: 'Typowy początek zdarzenia w opowieści — po nim zwykle pojawia się indefinido.' }),
      ],
      sentences: [
        s('23-1', 'Cuando era niña, vivía en un pueblo.', 'Kiedy byłam dzieckiem, mieszkałam na wsi.', {
          plAlts: ['Kiedy byłam mała, mieszkałam na wsi.', 'Gdy byłam dzieckiem, mieszkałam na wsi.', 'Kiedy byłam dzieckiem, mieszkałam w miasteczku.'],
        }),
        s('23-2', 'De pequeño jugaba en el parque con mis amigos.', 'W dzieciństwie bawiłem się w parku z kolegami.', {
          plAlts: ['Jako dziecko bawiłem się w parku z kolegami.', 'Kiedy byłem mały, bawiłem się w parku z przyjaciółmi.', 'W dzieciństwie bawiłem się z kolegami w parku.'],
        }),
        s('23-3', 'Mi abuela siempre cocinaba los domingos.', 'Moja babcia zawsze gotowała w niedziele.', {
          plAlts: ['Babcia zawsze gotowała w niedziele.', 'W niedziele moja babcia zawsze gotowała.'],
        }),
        s('23-4', 'Íbamos al colegio a pie.', 'Chodziliśmy do szkoły pieszo.', {
          plAlts: ['Chodziłyśmy do szkoły pieszo.', 'Do szkoły chodziliśmy pieszo.', 'Chodziliśmy do szkoły piechotą.'],
        }),
        s('23-5', 'Antes veía a mis abuelos todos los domingos.', 'Dawniej widywałem / widywałam dziadków w każdą niedzielę.', {
          plAlts: [
            'Dawniej widywałem dziadków w każdą niedzielę.',
            'Dawniej widywałam dziadków w każdą niedzielę.',
            'Kiedyś co niedzielę widywałem dziadków.',
            'Kiedyś co niedzielę widywałam dziadków.',
          ],
          accent: 'es-MX',
        }),
        s('23-6', 'A menudo íbamos a la playa en verano.', 'Latem często jeździliśmy na plażę.', {
          plAlts: ['W lecie często jeździliśmy na plażę.', 'Latem często jeździłyśmy na plażę.', 'Latem często jeździliśmy nad morze.'],
          accent: 'es-MX',
        }),
        s('23-7', 'Mi hermano era más alto que yo.', 'Mój brat był wyższy ode mnie.', { plAlts: ['Mój brat był wyższy niż ja.'] }),
        s('23-8', 'Un día, mis padres compraron un perro.', 'Pewnego dnia moi rodzice kupili psa.', { plAlts: ['Pewnego dnia rodzice kupili psa.'] }),
      ],
      grammar: [
        {
          id: 'es.g.imperfecto',
          title: 'Pretérito imperfecto: jak było kiedyś',
          body: [
            'Imperfecto opisuje przeszłość „w tle”: zwyczaje (co robiło się regularnie) i opisy (jak było, jacy byliśmy). [[De pequeño vivía en un pueblo.]] — W dzieciństwie mieszkałem na wsi.',
            'Końcówki: -ar → **-aba** ([[jugaba]]), -er i -ir → **-ía** ([[comía]], [[vivía]]). Formy „ja” i „on / ona” są takie same, więc o osobie mówi kontekst albo zaimek: [[yo jugaba]], [[ella jugaba]].',
            'Nieregularne są tylko trzy czasowniki: ser → [[era]], ir → [[iba]], ver → [[veía]].',
            'Typowe sygnały: [[siempre]], [[a menudo]], [[todos los días]], [[antes]], [[de pequeño]], [[cuando era niño]].',
          ],
          table: {
            head: ['Osoba', 'jugar', 'vivir', 'ser', 'ir'],
            rows: [
              ['yo', 'jugaba', 'vivía', 'era', 'iba'],
              ['tú', 'jugabas', 'vivías', 'eras', 'ibas'],
              ['él / ella / usted', 'jugaba', 'vivía', 'era', 'iba'],
              ['nosotros / nosotras', 'jugábamos', 'vivíamos', 'éramos', 'íbamos'],
              ['vosotros / vosotras', 'jugabais', 'vivíais', 'erais', 'ibais'],
              ['ellos / ellas / ustedes', 'jugaban', 'vivían', 'eran', 'iban'],
            ],
          },
          contrast:
            'Imperfecto przypomina polski czasownik niedokonany: mieszkałem, chodziłam, bawiliśmy się — czynność trwała albo się powtarzała. Polski nie ma osobnego czasu na tło opowieści, ale wybór „bawiłem się” zamiast „pobawiłem się” działa bardzo podobnie.',
        },
        {
          id: 'es.g.imperfecto-indefinido',
          title: 'Tło i zdarzenie: imperfecto czy indefinido?',
          body: [
            'W opowieści imperfecto maluje **tło** (jak było, co działo się zwykle), a indefinido podaje **zdarzenia**, które popychają akcję naprzód: [[Cuando era niña, vivía en Gdańsk. Un día, mis padres compraron un perro.]]',
            'Zapytaj siebie: to opis albo zwyczaj (imperfecto), czy jednorazowe, zamknięte zdarzenie (indefinido)? [[Siempre jugábamos en el parque.]] — ale [[Un día jugamos con un chico nuevo.]]',
            'Często obie formy spotykają się w jednym zdaniu: trwająca czynność i coś, co ją przerwało: [[Leía un libro cuando llamó mi abuela.]] — Czytałem / czytałam książkę, kiedy zadzwoniła babcia.',
          ],
          table: {
            head: ['', 'Imperfecto: tło, zwyczaj', 'Indefinido: zdarzenie'],
            rows: [
              ['sygnały', 'siempre, a menudo, antes', 'ayer, un día, el año pasado'],
              ['miejsce', 'Vivíamos en un pueblo.', 'Un día fuimos a Madrid.'],
              ['czynność', 'Siempre jugaba en el parque.', 'Ayer jugué en el parque.'],
              ['pogoda', 'Hacía calor.', 'Llovió tres días.'],
            ],
          },
          contrast:
            'Polak wybiera między „robiłem” a „zrobiłem” (aspekt), Hiszpan — między imperfecto a indefinido. To podobny wybór, ale nie identyczny: „ayer trabajé ocho horas” to po polsku „wczoraj pracowałem osiem godzin” (niedokonany), a po hiszpańsku indefinido, bo okres jest zamknięty.',
        },
      ],
      exercises: [
        {
          type: 'gap',
          id: 'es.x.23-1',
          concept: 'es.g.imperfecto',
          sentence: 'Cuando era niño, ___ en un pueblo.',
          pl: 'Kiedy byłem dzieckiem, mieszkałem na wsi.',
          options: ['vivaba', 'vivía', 'vivo'],
          answer: 'vivía',
          explanation: 'Opis tła w przeszłości → imperfecto. Czasowniki na -ir mają końcówkę -ía: vivía. „Vivaba” nie istnieje — -aba jest tylko dla -ar.',
        },
        {
          type: 'gap',
          id: 'es.x.23-2',
          concept: 'es.g.imperfecto',
          sentence: 'Antes mi hermana y yo ___ al colegio a pie.',
          pl: 'Dawniej chodziliśmy z siostrą do szkoły pieszo.',
          options: ['fuimos', 'vamos', 'íbamos'],
          answer: 'íbamos',
          explanation: 'Antes + zwyczaj w przeszłości → imperfecto od ir: íbamos. Fuimos to jednorazowe wyjście (indefinido), a vamos — czas teraźniejszy.',
        },
        {
          type: 'gap',
          id: 'es.x.23-3',
          concept: 'es.g.imperfecto-indefinido',
          sentence: 'Siempre jugábamos en el parque, pero un día ___ un perro muy grande.',
          pl: 'Zawsze bawiliśmy się w parku, ale pewnego dnia zobaczyliśmy bardzo dużego psa.',
          options: ['vimos', 'veíamos', 'vemos'],
          answer: 'vimos',
          explanation: 'Un día wprowadza jednorazowe zdarzenie → indefinido: vimos. Veíamos opisywałoby zwyczaj, a vemos to czas teraźniejszy.',
        },
        {
          type: 'choice',
          id: 'es.x.23-4',
          concept: 'es.g.imperfecto-indefinido',
          optionsLang: 'pl',
          prompt: 'Dlaczego w zdaniu „Cuando era niña, vivía en Cracovia” są formy imperfecto?',
          options: ['Bo to jednorazowe, zamknięte zdarzenie', 'Bo zdanie mówi o przyszłości', 'Bo to opis tła i stanu, który trwał'],
          answer: 2,
          explanation: 'Era i vivía opisują, jak było przez dłuższy czas — to tło opowieści, więc imperfecto.',
        },
      ],
      dialogue: {
        id: 'es.d.23',
        title: 'Stare zdjęcia',
        context: 'Hugo ogląda z babcią Rosą rodzinny album ze zdjęciami.',
        speakers: {
          H: { name: 'Hugo', voice: 'b', accent: 'es-ES' },
          R: { name: 'Babcia Rosa', voice: 'a', accent: 'es-ES' },
        },
        lines: [
          { speaker: 'H', text: 'Abuela, ¿quién es esta niña?', pl: 'Babciu, kim jest ta dziewczynka?' },
          { speaker: 'R', text: 'Soy yo, a los ocho años. Vivíamos en un pueblo cerca de Granada.', pl: 'To ja, kiedy miałam osiem lat. Mieszkaliśmy na wsi niedaleko Granady.' },
          { speaker: 'H', text: '¿Y qué hacías todos los días?', pl: 'A co robiłaś na co dzień?' },
          { speaker: 'R', text: 'Por la mañana iba al colegio y por la tarde jugaba con mis hermanos.', pl: 'Rano chodziłam do szkoły, a po południu bawiłam się z rodzeństwem.' },
          { speaker: 'H', text: '¿No teníais tele?', pl: 'Nie mieliście telewizora?' },
          { speaker: 'R', text: 'No. Pero un día mi padre compró una radio. ¡Fue una fiesta!', pl: 'Nie. Ale pewnego dnia tata kupił radio. To było wielkie święto!' },
        ],
        questions: [
          {
            id: 'es.d.23-q1',
            prompt: 'Gdzie mieszkała babcia jako dziecko?',
            options: ['W Granadzie', 'Na wsi niedaleko Granady', 'W Madrycie'],
            answer: 1,
            explanation: '„Vivíamos en un pueblo cerca de Granada.” — mieszkali na wsi niedaleko Granady.',
          },
          {
            id: 'es.d.23-q2',
            prompt: 'Co ważnego wydarzyło się pewnego dnia?',
            options: ['Tata kupił radio', 'Rodzina kupiła telewizor', 'Babcia poszła do nowej szkoły'],
            answer: 0,
            explanation: '„Un día mi padre compró una radio. ¡Fue una fiesta!” — to jednorazowe zdarzenie, dlatego indefinido.',
          },
        ],
      },
      summary: [
        'Imperfecto: -aba (jugaba), -ía (comía, vivía); nieregularne tylko era, iba, veía.',
        'Imperfecto — zwyczaje i opisy: siempre, a menudo, antes, de pequeño, cuando era niño.',
        'Indefinido — zdarzenia: un día, ayer, el año pasado.',
        'Cuando era niña, vivía en un pueblo. Un día, mis padres compraron un perro.',
      ],
      followUp:
        'Gratulacje — czasy przeszłe masz za sobą! Utrwalaj je w powtórkach, a w Audio Quest posłuchaj historii o wakacjach w Meksyku i o dzieciństwie w Andaluzji. Dalej czeka dział „Plany, prośby i polecenia” (A2+): czas przyszły, tryb warunkowy i tryb rozkazujący.',
    },
  ],
};
