export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function countCharacters(text: string): number {
  return text.length;
}

export function countCharactersNoSpaces(text: string): number {
  return text.replace(/\s+/g, '').length;
}

export function countSentences(text: string): number {
  return text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
}

export function countParagraphs(text: string): number {
  return text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
}
