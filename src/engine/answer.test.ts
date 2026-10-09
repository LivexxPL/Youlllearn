import { describe, expect, it } from 'vitest';
import { buildLexicon, checkAnswer, editDistance, normalize } from './answer';

describe('normalize', () => {
  it('drops punctuation, case and extra spaces', () => {
    expect(normalize('  ¿Cómo  te llamas? ', 'es')).toBe('cómo te llamas');
    expect(normalize('Guten Tag!', 'de')).toBe('guten tag');
  });
  it('handles Japanese spacing, punctuation and long vowels', () => {
    expect(normalize('わたしは がくせいです。', 'ja')).toBe('わたしはがくせいです');
    expect(normalize('コーヒー', 'ja')).toBe('こおひい');
  });
});

describe('checkAnswer — Spanish', () => {
  it('accepts exact answers', () => {
    expect(checkAnswer('hola', ['hola'], { lang: 'es' }).verdict).toBe('correct');
    expect(checkAnswer('Me llamo Ana.', ['Me llamo Ana.'], { lang: 'es' }).verdict).toBe('correct');
  });
  it('treats missing accents as almost', () => {
    const r = checkAnswer('adios', ['adiós'], { lang: 'es' });
    expect(r.verdict).toBe('almost');
    expect(r.issues).toContain('accent');
  });
  it('tolerates a typo in a long word', () => {
    const r = checkAnswer('graicas', ['gracias'], { lang: 'es' });
    expect(r.verdict).toBe('almost');
    expect(r.issues).toContain('typo');
  });
  it('is strict about short words such as articles', () => {
    expect(checkAnswer('la libro', ['el libro'], { lang: 'es' }).verdict).toBe('wrong');
  });
  it('does not accept another known word as a typo', () => {
    const lexicon = buildLexicon(['pero', 'perro'], 'es');
    const r = checkAnswer('pero', ['perro'], { lang: 'es', lexicon });
    expect(r.verdict).toBe('wrong');
    expect(r.issues).toContain('other-word');
  });
  it('strict mode rejects accent slips', () => {
    expect(checkAnswer('esta', ['está'], { lang: 'es', strict: true }).verdict).toBe('wrong');
  });
  it('accepts alternatives', () => {
    expect(checkAnswer('chau', ['adiós', 'chau'], { lang: 'es' }).verdict).toBe('correct');
  });
  it('rejects empty input', () => {
    expect(checkAnswer('   ', ['hola'], { lang: 'es' }).issues).toContain('empty');
  });
});

describe('checkAnswer — German', () => {
  it('accepts ae/oe/ue/ss spellings as variants', () => {
    const r = checkAnswer('Strasse', ['Straße'], { lang: 'de' });
    expect(r.verdict).toBe('correct');
    expect(r.issues).toContain('variant');
    expect(checkAnswer('schoen', ['schön'], { lang: 'de' }).verdict).toBe('correct');
  });
  it('treats a missing umlaut as almost', () => {
    expect(checkAnswer('schon', ['schön'], { lang: 'de' }).verdict).toBe('almost');
  });
  it('is strict with articles', () => {
    expect(checkAnswer('der Buch', ['das Buch'], { lang: 'de' }).verdict).toBe('wrong');
    expect(checkAnswer('den', ['der'], { lang: 'de', strict: true }).verdict).toBe('wrong');
  });
});

describe('checkAnswer — Japanese', () => {
  it('accepts kana and romaji', () => {
    expect(checkAnswer('がくせい', ['がくせい'], { lang: 'ja' }).verdict).toBe('correct');
    const r = checkAnswer('gakusei', ['がくせい'], { lang: 'ja' });
    expect(r.verdict).toBe('correct');
    expect(r.issues).toContain('romaji');
  });
  it('accepts reading for kanji words when listed', () => {
    expect(checkAnswer('がくせい', ['{学生|がくせい}', 'がくせい'], { lang: 'ja' }).verdict).toBe('correct');
    expect(checkAnswer('学生', ['{学生|がくせい}', 'がくせい'], { lang: 'ja' }).verdict).toBe('correct');
  });
  it('is strict about small tsu and long vowels', () => {
    expect(checkAnswer('がこう', ['がっこう'], { lang: 'ja' }).verdict).toBe('wrong');
    expect(checkAnswer('gakko', ['がっこう'], { lang: 'ja' }).verdict).toBe('wrong');
    expect(checkAnswer('gakkou', ['がっこう'], { lang: 'ja' }).verdict).toBe('correct');
  });
  it('matches katakana words typed in romaji', () => {
    expect(checkAnswer('koohii', ['コーヒー'], { lang: 'ja' }).verdict).toBe('correct');
    expect(checkAnswer('ko-hi-', ['コーヒー'], { lang: 'ja' }).verdict).toBe('correct');
  });
  it('flags hiragana typed for a katakana word', () => {
    const r = checkAnswer('こーひー', ['コーヒー'], { lang: 'ja' });
    expect(r.verdict).toBe('almost');
    expect(r.issues).toContain('script');
  });
  it('ignores spaces and punctuation', () => {
    expect(checkAnswer('わたしはがくせいです', ['わたしは がくせいです。'], { lang: 'ja' }).verdict).toBe('correct');
  });
});

describe('checkAnswer — Polish', () => {
  it('treats missing Polish diacritics as almost', () => {
    expect(checkAnswer('dzien dobry', ['dzień dobry'], { lang: 'pl' }).verdict).toBe('almost');
    expect(checkAnswer('dziękuję', ['dziękuję'], { lang: 'pl' }).verdict).toBe('correct');
  });
});

describe('editDistance', () => {
  it('counts adjacent swaps as one edit', () => {
    expect(editDistance('gracias', 'graicas')).toBe(1);
    expect(editDistance('kitten', 'sitting')).toBe(3);
  });
});
