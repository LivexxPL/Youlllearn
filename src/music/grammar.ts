/**
 * Grammar notes for lyric lines, found by rules (no AI, works offline).
 *
 * Japanese rules read the morphological analysis (part of speech, conjugation, dictionary
 * form); Spanish and German rules match word patterns. The explanations are written for this
 * app in Polish. A rule only says that a construction appears in the line — the learner sees
 * it labelled as an automatic hint, which can miss or misread unusual lyrics.
 *
 * Levels are orientation only: JLPT-style labels for Japanese (N5 easiest) and CEFR labels for
 * Spanish and German, matching where the course teaches the construction.
 */
import type { CourseId } from '../content/types';
import type { JaToken } from './japanese/tokens';

export type NoteLevel = 'N5' | 'N4' | 'N3' | 'A1' | 'A2' | 'B1';

export interface GrammarNote {
  id: string;
  level: NoteLevel;
  title: string;
  body: string;
}

export interface FoundNote {
  note: GrammarNote;
  /** Japanese: indices of the tokens the note is about. */
  tokens?: number[];
  /** Spanish/German: the words that triggered the note. */
  match?: string;
}

/** 1 = beginner (N5/A1), 2 = N4/A2, 3 = N3/B1. */
export function levelRank(level: NoteLevel | string): number {
  if (/N5|A1/.test(level)) return 1;
  if (/N4|A2/.test(level)) return 2;
  return 3;
}

const note = (id: string, level: NoteLevel, title: string, body: string): GrammarNote => ({ id, level, title, body });

// ---------------------------------------------------------------------------
// Japanese

export const JA_NOTES = {
  wa: note('ja.wa', 'N5', 'は (wa) — temat zdania', 'は wskazuje, o czym mowa: „jeśli chodzi o…”. Piszemy は (ha), czytamy „wa”. Po polsku temat oddajemy zwykle szykiem zdania.'),
  ga: note('ja.ga', 'N5', 'が (ga) — podmiot', 'が wskazuje podmiot, często coś nowego lub ważnego. W piosenkach często z 好き: 君が好き — „kocham cię / lubię cię” (dosł. „ty jesteś lubiany”).'),
  gaBut: note('ja.ga-but', 'N4', 'が — „ale”', 'Na końcu zdania składowego が łączy dwie myśli: „…, ale…”. Brzmi trochę bardziej oficjalnie niż けど.'),
  wo: note('ja.wo', 'N5', 'を (o) — dopełnienie', 'を oznacza to, na co skierowana jest czynność (jak polski biernik: kogo? co?). Piszemy を, czytamy „o”.'),
  ni: note('ja.ni', 'N5', 'に (ni) — cel, miejsce, czas', 'に to kierunek lub cel („do”), miejsce, w którym coś jest, czas („o”, „w”) albo osoba, do której coś trafia. Dokładne znaczenie zależy od czasownika.'),
  e: note('ja.e', 'N5', 'へ (e) — kierunek', 'へ znaczy „do, w stronę”. Piszemy へ (he), czytamy „e”.'),
  de: note('ja.de', 'N5', 'で (de) — miejsce czynności, sposób', 'で mówi, gdzie coś się dzieje („w, na”), albo czym lub jak („za pomocą”).'),
  to: note('ja.to', 'N5', 'と (to) — „i”, „z”', 'と łączy rzeczowniki („A i B”) albo wskazuje, z kim coś robimy („z”).'),
  toQuote: note('ja.to-quote', 'N4', 'と — cytat, myśl', 'Przed czasownikami 言う (mówić), 思う (myśleć) i podobnymi と zamyka cytat lub myśl: „…, że”.'),
  mo: note('ja.mo', 'N5', 'も (mo) — też, nawet', 'も zastępuje は, が lub を i dodaje „też”; w przeczeniu „ani”.'),
  no: note('ja.no', 'N5', 'の (no) — łączenie rzeczowników', 'A の B to „B należące do A” albo „B opisane przez A”. 君のこと — dosł. „sprawy dotyczące ciebie”, czyli po prostu „ty”.'),
  ka: note('ja.ka', 'N5', 'か (ka) — pytanie, „czy”, „albo”', 'Na końcu zdania か robi z niego pytanie; między słowami znaczy „albo”.'),
  final: note('ja.final', 'N5', 'Partykuły końcowe: よ, ね, な, ぜ, ぞ, わ', 'Dodają emocję lub ton: よ — informuję, podkreślam; ね — „prawda?”, szukam zgody; な — zamyślenie; ぜ, ぞ — mocne, potoczne; わ — miękkie (w Kansai neutralne). W piosenkach pojawiają się bardzo często.'),
  kara: note('ja.kara', 'N5', 'から (kara) — „od”', 'Po rzeczowniku から znaczy „od, z” (miejsce lub czas, od którego coś się zaczyna).'),
  karaBecause: note('ja.kara-because', 'N5', 'から — „bo, ponieważ”', 'Po zdaniu から podaje powód: „…, bo…”.'),
  made: note('ja.made', 'N5', 'まで (made) — „do”', 'まで wyznacza granicę: „aż do” (miejsca lub czasu).'),
  kedo: note('ja.kedo', 'N4', 'けど — „ale”, „choć”', 'けど (けれど) łączy zdania przeciwstawnie. Na końcu wypowiedzi zostawia niedopowiedzenie — częste w tekstach piosenek.'),
  noni: note('ja.noni', 'N4', 'のに — „mimo że”, „a przecież”', 'のに wyraża zawód lub żal: coś stało się wbrew oczekiwaniom.'),
  nagara: note('ja.nagara', 'N4', 'ながら — „robiąc jednocześnie”', 'Czasownik w formie -masu bez ます + ながら: dwie czynności naraz (歌いながら — „śpiewając”).'),
  te: note('ja.te', 'N5', 'Forma -te', 'Forma -te łączy czynności po kolei („…i…”) i tworzy dalsze konstrukcje: 〜ている (trwanie), 〜てください (prośba), 〜てもいい (pozwolenie).'),
  ba: note('ja.ba', 'N4', 'Forma -ba — „jeśli”', 'Końcówka -ba tworzy warunek: 行けば — „jeśli pójdziesz”.'),
  temo: note('ja.temo', 'N4', '〜ても — „nawet jeśli”', 'Forma -te + も: „nawet jeśli…, to…”.'),
  teiru: note('ja.teiru', 'N5', '〜ている — trwanie lub stan', '〜ている opisuje czynność w toku („teraz robię”) albo stan po zmianie („jestem żonaty”, „wiem”).'),
  teru: note('ja.teru', 'N4', '〜てる — skrót od 〜ている', 'W mowie i piosenkach い wypada: 見ている → 見てる („patrzę”). Znaczenie to samo.'),
  shimau: note('ja.shimau', 'N4', '〜てしまう / 〜ちゃう', 'Czynność zakończona całkowicie albo niechcący, często z żalem. Potocznie skrócone do 〜ちゃう / 〜じゃう (忘れちゃう — „zapomnę/zapomniałem, niestety”).'),
  masu: note('ja.masu', 'N5', 'Forma grzeczna -masu', '〜ます to uprzejma forma czasownika; 〜ました — przeszła, 〜ません — przeczenie.'),
  mashou: note('ja.mashou', 'N5', '〜ましょう — „zróbmy”', '〜ましょう to uprzejma propozycja lub zachęta: 遊びましょう — „pobawmy się”.'),
  ta: note('ja.ta', 'N5', 'Forma -ta — czas przeszły', 'Końcówka た (po niektórych czasownikach だ) oznacza czynność przeszłą lub zakończoną.'),
  tara: note('ja.tara', 'N4', '〜たら — „jeśli”, „kiedy”', 'Forma -ta + ら: warunek lub moment („gdy już…”).'),
  nai: note('ja.nai', 'N5', 'Przeczenie -nai', '〜ない to potoczne przeczenie czasownika lub przymiotnika („nie…”).'),
  nu: note('ja.nu', 'N3', 'Przeczenie ぬ / ん (styl książkowy)', 'Starsze przeczenie: 知らぬ, 分からん = 知らない, 分からない. W piosenkach brzmi poważniej lub poetycko.'),
  nakya: note('ja.nakya', 'N4', '〜なきゃ — „muszę”', 'Potoczny skrót od 〜なければ(ならない): 行かなきゃ — „muszę iść”.'),
  tai: note('ja.tai', 'N5', '〜たい — „chcę”', 'Czasownik + たい: chęć mówiącego (会いたい — „chcę cię zobaczyć”, częste w piosenkach).'),
  volitional: note('ja.volitional', 'N4', 'Forma wolicjonalna 〜う / 〜よう', 'Propozycja „zróbmy” albo zamiar „chcę, zamierzam”: 行こう — „chodźmy”.'),
  copula: note('ja.copula', 'N5', 'だ / です — „jest”', 'Łącznik po rzeczowniku lub przymiotniku -na: 大変だ — „to straszne”. です to wersja uprzejma.'),
  nda: note('ja.nda', 'N4', '〜んだ / 〜のだ — wyjaśnienie, emocja', 'ん(の) + だ/です dodaje wyjaśnienie lub emocję: „bo właśnie…”, „przecież…”.'),
  causative: note('ja.causative', 'N4', 'Kauzatyw: 〜せる / 〜させる', '„Sprawić, że ktoś coś robi” albo „pozwolić”: 困らせた — „sprawił kłopot”.'),
  passive: note('ja.passive', 'N4', '〜れる / 〜られる', 'Strona bierna („być …nym”), możliwość („móc”) albo forma uprzejma — znaczenie zależy od kontekstu.'),
  adjI: note('ja.adj-i', 'N5', 'Przymiotnik -i', 'Odmienia się sam: 〜い (teraz), 〜かった (przeszły), 〜くない (przeczenie), 〜くて (łączenie).'),
  adjNa: note('ja.adj-na', 'N5', 'Przymiotnik -na', 'Przed rzeczownikiem dostaje な (静かな夜), jako orzeczenie だ/です (大変だ), jako przysłówek に.'),
  pronoun: note('ja.pronoun', 'N5', 'Zaimki w piosenkach', '僕 (boku) — „ja” łagodne, chłopięce; 俺 (ore) — „ja” mocne; 私 (watashi) — neutralne; 君 (kimi) — „ty” bliskie, bardzo częste w tekstach; あなた — „ty” czułe lub uprzejme; お前 (omae) — szorstkie. W rozmowie Japończycy często pomijają zaimki.'),
  tte: note('ja.tte', 'N4', 'って — potoczne „że”, temat', 'って zastępuje と (cytat: „mówi, że”) albo は (temat). Bardzo częste w mowie i tekstach.'),
  nante: note('ja.nante', 'N4', 'なんて — „coś takiego jak”', 'Wyraża zdziwienie, lekceważenie albo wzruszenie: 忘れちゃうなんて — „że też można zapomnieć”.'),
  classical: note('ja.classical', 'N3', 'Formy klasyczne (bungo)', 'Dawna odmiana języka japońskiego, częsta w starszych pieśniach i poezji. Słownik rozpoznaje ją tylko częściowo — sprawdź znaczenie w objaśnieniu wersu.'),
} as const;

const PRONOUNS = new Set(['僕', '俺', '私', 'あたし', '君', 'あなた', '貴方', 'お前', 'きみ', 'ぼく', 'おれ']);
const FINAL = new Set(['よ', 'ね', 'な', 'ぜ', 'ぞ', 'わ', 'さ', 'ねえ', 'なあ']);
const QUOTE_VERBS = new Set(['言う', '思う', '聞く', '呼ぶ', '書く', '答える', '叫ぶ', 'いう', 'おもう']);

export function japaneseNotes(tokens: readonly JaToken[]): FoundNote[] {
  const found = new Map<string, FoundNote>();
  const add = (n: GrammarNote, i: number) => {
    const f = found.get(n.id);
    if (f) f.tokens!.push(i);
    else found.set(n.id, { note: n, tokens: [i] });
  };
  const nextContent = (i: number) => tokens.slice(i + 1).find((t) => t.pos !== '記号');

  tokens.forEach((t, i) => {
    const prev = tokens[i - 1];
    const next = tokens[i + 1];
    if (t.ct.includes('文語')) add(JA_NOTES.classical, i);
    if (t.pos === '助詞') {
      const p1 = t.pos1;
      if (t.s === 'は' && p1 === '係助詞') add(JA_NOTES.wa, i);
      else if (t.s === 'が' && p1 === '格助詞') add(JA_NOTES.ga, i);
      else if (t.s === 'が' && p1 === '接続助詞') add(JA_NOTES.gaBut, i);
      else if (t.s === 'を') add(JA_NOTES.wo, i);
      else if (t.s === 'に' && p1 === '格助詞') add(JA_NOTES.ni, i);
      else if (t.s === 'へ' && p1 === '格助詞') add(JA_NOTES.e, i);
      else if (t.s === 'で' && p1 === '格助詞') add(JA_NOTES.de, i);
      else if (t.s === 'と' && (p1 === '格助詞' || p1 === '並立助詞')) add(QUOTE_VERBS.has(nextContent(i)?.base ?? '') ? JA_NOTES.toQuote : JA_NOTES.to, i);
      else if (t.s === 'も' && p1 === '係助詞') add(JA_NOTES.mo, i);
      else if (t.s === 'の' && p1 === '連体化') add(JA_NOTES.no, i);
      else if (t.s === 'か' && (p1 === '副助詞／並立助詞／終助詞' || p1 === '終助詞' || p1 === '副助詞' || p1 === '並立助詞')) add(JA_NOTES.ka, i);
      else if (p1 === '終助詞' && FINAL.has(t.s)) add(JA_NOTES.final, i);
      else if (t.s === 'から') add(p1 === '接続助詞' ? JA_NOTES.karaBecause : JA_NOTES.kara, i);
      else if (t.s === 'まで') add(JA_NOTES.made, i);
      else if (['けど', 'けれど', 'けれども', 'だけど'].includes(t.s)) add(JA_NOTES.kedo, i);
      else if (t.s === 'のに' && p1 === '接続助詞') add(JA_NOTES.noni, i);
      else if (t.s === 'ながら') add(JA_NOTES.nagara, i);
      else if (t.s === 'ば' && p1 === '接続助詞') add(JA_NOTES.ba, i);
      else if ((t.s === 'て' || t.s === 'で') && p1 === '接続助詞') add(next?.s === 'も' ? JA_NOTES.temo : JA_NOTES.te, i);
      else if (t.s === 'って') add(JA_NOTES.tte, i);
      else if (t.s === 'なんて') add(JA_NOTES.nante, i);
    } else if (t.pos === '助動詞') {
      if (t.base === 'ます') add(t.cf.startsWith('未然ウ') ? JA_NOTES.mashou : JA_NOTES.masu, i);
      else if (t.base === 'た') add(t.cf === '仮定形' ? JA_NOTES.tara : JA_NOTES.ta, i);
      else if (t.base === 'ない') add(t.cf.includes('縮約') ? JA_NOTES.nakya : JA_NOTES.nai, i);
      else if (t.base === 'ぬ' || (t.base === 'ん' && t.ct.includes('ヌ'))) add(JA_NOTES.nu, i);
      else if (t.base === 'たい') add(JA_NOTES.tai, i);
      else if ((t.base === 'う' || t.base === 'よう') && prev?.base !== 'ます') add(JA_NOTES.volitional, i);
      else if (t.base === 'だ' || t.base === 'です') {
        if (prev && prev.pos === '名詞' && prev.pos1 === '非自立' && (prev.s === 'ん' || prev.s === 'の')) add(JA_NOTES.nda, i);
        else if (t.cf !== '連用タ接続' || next?.base !== 'た') add(JA_NOTES.copula, i);
      }
    } else if (t.pos === '動詞') {
      if (t.pos1 === '非自立' && t.base === 'いる' && (prev?.s === 'て' || prev?.s === 'で')) add(JA_NOTES.teiru, i);
      else if (t.base === 'てる' || t.base === 'でる') add(JA_NOTES.teru, i);
      else if (t.base === 'しまう' || t.base === 'ちゃう' || t.base === 'じゃう' || t.base === 'ちまう') add(JA_NOTES.shimau, i);
      else if (t.pos1 === '接尾' && (t.base === 'せる' || t.base === 'させる')) add(JA_NOTES.causative, i);
      else if (t.pos1 === '接尾' && (t.base === 'れる' || t.base === 'られる')) add(JA_NOTES.passive, i);
    } else if (t.pos === '形容詞' && t.pos1 === '自立') {
      add(JA_NOTES.adjI, i);
    } else if (t.pos === '名詞') {
      if (t.pos1 === '形容動詞語幹' && next && (next.s === 'な' || next.s === 'に' || next.base === 'だ' || next.base === 'です')) add(JA_NOTES.adjNa, i);
      if (t.pos1 === '代名詞' && PRONOUNS.has(t.s)) add(JA_NOTES.pronoun, i);
    }
  });
  return [...found.values()];
}

// ---------------------------------------------------------------------------
// Spanish and German: word patterns

interface PatternRule {
  note: GrammarNote;
  re: RegExp;
}

const ES_RULES: PatternRule[] = [
  { note: note('es.gustar', 'A1', 'Gustar — „podobać się”', 'Me gusta X = „podoba mi się X”, czyli „lubię X”. To, co się podoba, jest podmiotem: me gustan las flores (liczba mnoga).'), re: /\b(me|te|le|nos|os|les)\s+(gusta|gustan|gustaba|gustaban|gustaría|encanta|encantan)\b/iu },
  { note: note('es.ir-a', 'A1', 'Ir a + bezokolicznik — „zamierzam”', 'Voy a cantar — „zaśpiewam, zamierzam śpiewać”. Najprostszy sposób mówienia o przyszłości.'), re: /\b(voy|vas|va|vamos|vais|van)\s+a\s+\p{L}+(ar|er|ir)\b/iu },
  { note: note('es.estar-gerundio', 'A2', 'Estar + gerundio — czynność w toku', 'Estoy cantando — „właśnie śpiewam”. Gerundio kończy się na -ando lub -iendo.'), re: /\b(estoy|estás|está|estamos|estáis|están|estaba|estabas|estaban)\s+\p{L}+(ando|iendo|yendo)\b/iu },
  { note: note('es.tener-que', 'A2', 'Tener que — „musieć”', 'Tengo que irme — „muszę iść”. Po que zawsze bezokolicznik.'), re: /\b(tengo|tienes|tiene|tenemos|tenéis|tienen|tenía)\s+que\b/iu },
  { note: note('es.hay', 'A1', 'Hay — „jest, są (istnieje)”', 'Hay mówi, że coś istnieje lub się znajduje, bez względu na liczbę: hay un río, hay estrellas.'), re: /\bhay\b/iu },
  { note: note('es.ser-estar', 'A1', 'Ser czy estar? Dwa „być”', 'Ser — kim lub czym ktoś jest (cechy stałe, pochodzenie). Estar — gdzie jest i w jakim stanie (nastrój, położenie).'), re: /\b(soy|eres|es|somos|sois|son|estoy|estás|está|estamos|estáis|están)\b/iu },
  { note: note('es.diminutive', 'A2', 'Zdrobnienia -ito, -ita', 'Końcówki -ito/-ita (-itos/-itas) zdrabniają lub ocieplają: pollo → pollito („kurczaczek”), abrigo → abriguito.'), re: /\b\p{L}{3,}(ito|ita|itos|itas|cito|cita)\b/iu },
  { note: note('es.double-negation', 'A2', 'Podwójne przeczenie', 'Jak po polsku: no veo nada — „nic nie widzę”. Nada, nadie, nunca po czasowniku wymagają no przed nim.'), re: /\bno\b.*\b(nada|nadie|nunca|ningún|ninguno|ninguna|tampoco)\b/iu },
  { note: note('es.contraction', 'A1', 'Al i del', 'a + el = al, de + el = del: voy al mar, el sol del verano.'), re: /\b(al|del)\b/iu },
  { note: note('es.que-subjuntivo', 'B1', 'Que + subjuntivo — życzenie, wymaganie', 'Po wyrażeniu życzenia lub wymagania czasownik przechodzi w tryb łączący: (una chica) que sepa coser — „która umiałaby szyć”.'), re: /\bque\s+(sepa|sepas|tenga|tengas|haga|hagas|pueda|puedas|quiera|quieras|venga|vengas|diga|digas|sea|seas|esté|estés|vaya|vayas)\b/iu },
];

const DE_RULES: PatternRule[] = [
  { note: note('de.modal', 'A1', 'Czasowniki modalne', 'können, müssen, wollen, dürfen, sollen, möchten — bezokolicznik idzie na koniec zdania: Ich will dich sehen — „chcę cię zobaczyć”.'), re: /\b(kann|kannst|können|könnt|muss|musst|müssen|müsst|will|willst|wollen|wollt|darf|darfst|dürfen|soll|sollst|sollen|möchte|möchtest|möchten)\b/iu },
  { note: note('de.perfekt', 'A2', 'Perfekt — czas przeszły w mowie', 'haben lub sein + imiesłów (ge-…-t / ge-…-en) na końcu: Ich habe gesungen — „śpiewałem/śpiewałam”.'), re: /\b(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)\b.*\bge\p{L}{2,}(t|en)\b/iu },
  { note: note('de.negation', 'A1', 'nicht czy kein?', 'kein przecza rzeczownik bez rodzajnika określonego (kein Problem), nicht — całą resztę (ich weiß nicht).'), re: /\b(nicht|kein|keine|keinen|keinem|keiner|keines)\b/iu },
  { note: note('de.diminutive', 'A1', 'Zdrobnienia -chen, -lein', 'Zdrobnienia są zawsze rodzaju nijakiego (das): die Ente → das Entchen, der Kopf → das Köpfchen.'), re: /\b\p{L}{3,}(chen|lein)\b/iu },
  { note: note('de.contraction', 'A1', 'Przyimek + rodzajnik w jednym', 'im = in dem, ins = in das, am = an dem, zum = zu dem, zur = zu der, vom = von dem, beim = bei dem.'), re: /\b(im|ins|am|ans|zum|zur|vom|beim|aufs|fürs|übers)\b/iu },
  { note: note('de.elision', 'A2', 'Apostrof — opuszczona litera', 'W piosenkach i mowie potocznej wypadają głoski: Höh\' = Höhe, ruft\'s = ruft es, hab\' = habe.'), re: /\p{L}'(s\b)?|\p{L}’/u },
  { note: note('de.dativ-prep', 'A2', 'Przyimki z celownikiem (Dativ)', 'mit, von, zu, aus, bei, nach, seit zawsze łączą się z celownikiem: mit dem Freund, aus der Stadt.'), re: /\b(mit|von|zu|aus|bei|nach|seit)\b/iu },
  { note: note('de.wechsel', 'A2', 'Gdzie? (Dativ) czy dokąd? (Akkusativ)', 'in, an, auf, über, unter, vor, hinter, neben, zwischen: miejsce — celownik (auf dem See), kierunek — biernik (in das Wasser).'), re: /\b(in|an|auf|über|unter|vor|hinter|neben|zwischen)\s+(dem|der|den|das|die|einem|einer|einen|ein|eine)\b/iu },
  { note: note('de.lasst-uns', 'A2', 'Lasst uns… — „zróbmy”', 'Lasst uns singen — „śpiewajmy”. Lasset to dawniejsza, uroczysta forma (stare pieśni).'), re: /\b(lasst|lasset|lass|laß)\s+uns\b/iu },
];

export function patternNotes(lang: Exclude<CourseId, 'ja'>, text: string): FoundNote[] {
  const rules = lang === 'es' ? ES_RULES : DE_RULES;
  const out: FoundNote[] = [];
  for (const r of rules) {
    const m = r.re.exec(text);
    if (m) out.push({ note: r.note, match: m[0] });
  }
  return out;
}

/** Every note of a language (for the grammar identification exercise's wrong answers). */
export function allNotes(lang: CourseId): GrammarNote[] {
  if (lang === 'ja') return Object.values(JA_NOTES);
  return (lang === 'es' ? ES_RULES : DE_RULES).map((r) => r.note);
}

/**
 * Orders notes for a learner: constructions at or below their level first (the ones to
 * understand now), harder ones after them, marked as "for later".
 */
export function sortForLevel(notes: FoundNote[], learnerRank: number): { now: FoundNote[]; later: FoundNote[] } {
  const now = notes.filter((n) => levelRank(n.note.level) <= learnerRank);
  const later = notes.filter((n) => levelRank(n.note.level) > learnerRank);
  return { now, later };
}
