import { describe, it, expect } from 'vitest';
import { countWords, countCharacters, countCharactersNoSpaces, countSentences, countParagraphs } from './counter';

describe('countWords', () => {
  it('counts words in a normal string', () => {
    expect(countWords("Hello world this is a test")).toBe(6);
  });

  it('handles empty strings', () => {
    expect(countWords("")).toBe(0);
  });

  it('handles only spaces', () => {
    expect(countWords("   ")).toBe(0);
  });

  it('handles extra spaces between words', () => {
    expect(countWords("Hello   world  ")).toBe(2);
  });

  it('handles newlines and tabs as word boundaries', () => {
    expect(countWords("Hello\nworld\tthis")).toBe(3);
  });
});

describe('countCharacters', () => {
  it('counts all characters including spaces', () => {
    expect(countCharacters("Hello world")).toBe(11);
  });

  it('handles empty strings', () => {
    expect(countCharacters("")).toBe(0);
  });
});

describe('countCharactersNoSpaces', () => {
  it('counts characters excluding spaces', () => {
    expect(countCharactersNoSpaces("Hello world")).toBe(10);
  });

  it('counts characters excluding tabs and newlines', () => {
    expect(countCharactersNoSpaces("Hello\nworld\t!")).toBe(11);
  });

  it('handles empty strings', () => {
    expect(countCharactersNoSpaces("")).toBe(0);
  });
});

describe('countSentences', () => {
  it('counts sentences ending with periods', () => {
    expect(countSentences("Hello world. This is a test.")).toBe(2);
  });

  it('counts sentences ending with exclamation or question marks', () => {
    expect(countSentences("Hello! How are you? I am fine.")).toBe(3);
  });

  it('handles multiple punctuations', () => {
    expect(countSentences("Wait... What?! Yes!!")).toBe(3);
  });

  it('returns 0 for text without sentence-ending punctuation if empty string', () => {
    expect(countSentences("")).toBe(0);
  });

  it('returns 1 for string without punctuation', () => {
    // Actually the current logic counts by splitting on [.!?]
    // "Hello world" -> length 1
    expect(countSentences("Hello world")).toBe(1);
  });

  it('handles empty strings', () => {
    expect(countSentences("")).toBe(0);
  });
});

describe('countParagraphs', () => {
  it('counts paragraphs separated by newlines', () => {
    expect(countParagraphs("First paragraph\nSecond paragraph")).toBe(2);
  });

  it('handles multiple newlines', () => {
    expect(countParagraphs("First\n\n\nSecond")).toBe(2);
  });

  it('handles empty strings', () => {
    expect(countParagraphs("")).toBe(0);
  });

  it('handles single paragraph without newlines', () => {
    expect(countParagraphs("Just one paragraph")).toBe(1);
  });
});
