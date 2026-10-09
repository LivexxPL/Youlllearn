import type { Item } from '../types';
import { toRomaji } from '../../engine/kana';

/** Alternative romanisations accepted when a learner types the sound. */
const ALT_ROMAJI: Record<string, string[]> = {
  shi: ['si'],
  chi: ['ti'],
  tsu: ['tu'],
  fu: ['hu'],
  ji: ['zi'],
  zu: ['du'],
  o: ['wo'],
  sha: ['sya'],
  shu: ['syu'],
  sho: ['syo'],
  cha: ['tya', 'cya'],
  chu: ['tyu', 'cyu'],
  cho: ['tyo', 'cyo'],
  ja: ['zya', 'jya'],
  ju: ['zyu', 'jyu'],
  jo: ['zyo', 'jyo'],
};

/** Original tips for characters learners often confuse. */
const TIPS: Record<string, string> = {
  あ: 'Porównaj z お: あ ma u góry poziomą kreskę przeciętą pionową, お ma dodatkową kropkę z prawej.',
  お: 'お ma małą kreskę-kropkę po prawej stronie — あ jej nie ma.',
  い: 'Dwie krótkie kreski obok siebie, druga krótsza. Nie myl z り (druga kreska długa).',
  き: 'き ma dwie poziome kreski, さ — jedną.',
  さ: 'Dolny łuk さ otwiera się w prawo (jak litera c), a w ち — w lewo.',
  ち: 'Dolny łuk ち otwiera się w lewo — odwrotnie niż w さ.',
  し: 'Jedna kreska jak haczyk wędki. Nie myl z つ, który leży poziomo.',
  つ: 'Jedna pozioma, wygięta kreska — „leżące” し.',
  ぬ: 'ぬ kończy się pętelką, め — nie.',
  め: 'め nie ma pętelki na końcu (w odróżnieniu od ぬ).',
  ね: 'ね kończy się pętelką; podobne れ ma ogonek wywinięty na zewnątrz, わ — zaokrąglony brzuszek.',
  れ: 'れ kończy się ogonkiem wywiniętym na zewnątrz (ね ma pętelkę, わ brzuszek).',
  わ: 'わ kończy się zaokrąglonym brzuszkiem (ね ma pętelkę, れ ogonek).',
  は: 'は ma po prawej jedną poziomą kreskę, ほ — dwie.',
  ほ: 'ほ ma po prawej dwie poziome kreski, は — jedną.',
  ろ: 'ろ nie ma pętelki na dole, る — ma.',
  る: 'る kończy się pętelką, ろ — nie.',
  り: 'Druga kreska り jest długa i schodzi w dół (w い obie są krótkie).',
  を: 'Wymawiane jak „o”. Używane prawie wyłącznie jako partykuła dopełnienia.',
  ん: 'Jedyny znak, który jest samą spółgłoską. Tworzy osobną morę.',
  シ: 'シ (shi): dwie kreski leżą poziomo, długa kreska idzie od dołu w górę.',
  ツ: 'ツ (tsu): dwie kreski stoją pionowo, długa kreska idzie z góry w dół.',
  ソ: 'ソ (so): krótka kreska prawie pionowa, długa idzie z góry w dół.',
  ン: 'ン (n): krótka kreska prawie pozioma, długa idzie od dołu w górę.',
  ク: 'ク — dwie kreski. タ wygląda jak ク z dodatkową kreską w środku.',
  タ: 'タ to jakby ク z dodatkową kreską w środku.',
  ウ: 'ウ ma krótką kreskę na górze, ワ — nie.',
  ワ: 'ワ nie ma kreski na górze (ウ ma).',
  フ: 'フ to sam „hak” — bez kresek z boku (ウ i ワ mają ich więcej).',
  ア: 'ア i マ są podobne: ア ma pionową kreskę idącą w dół w lewo, マ — kreskę kończącą się w środku.',
  マ: 'マ — druga kreska jest krótka i kończy się w środku znaku.',
  チ: 'チ ma u góry ukośną kreskę, テ — dwie poziome.',
  テ: 'テ ma u góry dwie poziome kreski (チ — jedną ukośną).',
  ル: 'ル — dwie kreski, prawa z ostrym zawinięciem w górę. レ to sama prawa część.',
  レ: 'レ to jedna kreska z zawinięciem — jak prawa połowa ル.',
  ナ: 'ナ — pozioma kreska przecięta długą kreską opadającą w lewo. メ to dwie ukośne kreski jak „x”.',
  メ: 'メ — dwie ukośne kreski przecinające się jak „x”.',
  ヲ: 'Bardzo rzadkie w katakanie — w praktyce spotkasz je głównie w hiraganie (を).',
};

export function kanaItems(script: 'h' | 'k', chars: string[]): Item[] {
  return chars.map((ch) => {
    const romaji = ch === 'を' || ch === 'ヲ' ? 'o' : toRomaji(ch);
    const alts = ALT_ROMAJI[romaji] ?? [];
    return {
      id: `ja.${script}.${romaji}${ch === 'を' || ch === 'ヲ' ? '-wo' : ''}`,
      kind: 'kana',
      text: ch,
      romaji,
      pl: romaji,
      plAlts: alts,
      tip: TIPS[ch],
      note: romaji === 'o' && (ch === 'を' || ch === 'ヲ') ? 'Czytane „o”, zapisywane w romaji także jako „wo”.' : undefined,
    } satisfies Item;
  });
}
