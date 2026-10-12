import {
  getExamBySlug,
  getExamsByCategory,
  searchExams,
  EXAM_DATABASE,
  ExamCategory
} from './exams';

describe('Exams Data Utilities', () => {
  describe('getExamBySlug', () => {
    it('should return the correct exam when given a valid slug', () => {
      const exam = getExamBySlug('ssc-cgl');
      expect(exam).toBeDefined();
      expect(exam?.name).toBe('SSC CGL');
      expect(exam?.slug).toBe('ssc-cgl');
    });

    it('should return undefined when given an invalid slug', () => {
      const exam = getExamBySlug('invalid-slug-123');
      expect(exam).toBeUndefined();
    });
  });

  describe('getExamsByCategory', () => {
    it('should return exams matching the provided category', () => {
      const exams = getExamsByCategory('Banking');
      expect(exams.length).toBeGreaterThan(0);
      exams.forEach(exam => {
        expect(exam.category).toBe('Banking');
      });
    });

    it('should return an empty array for a category with no exams', () => {
      // Find a category that currently has no exams in the mock data, if possible.
      // Alternatively, we cast an invalid category to ExamCategory to test this path,
      // but to be strictly type-safe we could just test a valid category that is empty.
      const exams = getExamsByCategory('Teaching' as ExamCategory);
      expect(exams).toEqual([]);
    });
  });

  describe('searchExams', () => {
    it('should return exams matching name', () => {
      const exams = searchExams('IBPS PO');
      expect(exams.length).toBeGreaterThan(0);
      expect(exams.some(e => e.name === 'IBPS PO')).toBe(true);
    });

    it('should return exams matching organization', () => {
      const exams = searchExams('Staff Selection Commission');
      expect(exams.length).toBeGreaterThan(0);
      expect(exams.some(e => e.organization === 'Staff Selection Commission')).toBe(true);
    });

    it('should return exams matching category', () => {
      const exams = searchExams('UPSC');
      expect(exams.length).toBeGreaterThan(0);
      expect(exams.some(e => e.category === 'UPSC')).toBe(true);
    });

    it('should return exams matching slug', () => {
      const exams = searchExams('rrb-ntpc');
      expect(exams.length).toBeGreaterThan(0);
      expect(exams.some(e => e.slug === 'rrb-ntpc')).toBe(true);
    });

    it('should be case-insensitive', () => {
      const exactMatch = searchExams('ssc-cgl');
      const upperMatch = searchExams('SSC-CGL');
      const mixedMatch = searchExams('sSc-CgL');

      expect(exactMatch.length).toBeGreaterThan(0);
      expect(upperMatch).toEqual(exactMatch);
      expect(mixedMatch).toEqual(exactMatch);
    });

    it('should return all exams when query is empty', () => {
      const exams = searchExams('');
      expect(exams.length).toBe(EXAM_DATABASE.length);
      expect(exams).toEqual(EXAM_DATABASE);
    });

    it('should return empty array when query does not match any field', () => {
      const exams = searchExams('random-non-existent-query-xyz123');
      expect(exams).toEqual([]);
    });
  });
});
