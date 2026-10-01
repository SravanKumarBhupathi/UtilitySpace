import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('merges simple classes', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
  });

  it('resolves Tailwind class conflicts', () => {
    // Tailwind-merge resolves conflicting classes by taking the last one
    expect(cn('p-4 text-red-500', 'p-8')).toBe('text-red-500 p-8');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('handles arrays and objects', () => {
    expect(cn(['class1', 'class2'], { class3: true, class4: false })).toBe('class1 class2 class3');
  });

  it('handles undefined and null', () => {
    expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
  });

  it('handles empty strings', () => {
    expect(cn('class1', '', 'class2')).toBe('class1 class2');
  });
});
