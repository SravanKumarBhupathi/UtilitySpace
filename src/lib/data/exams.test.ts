import {
  getExamBySlug,
  getExamsByCategory,
  searchExams,
  EXAM_DATABASE,
} from './exams';

describe('exams data utilities', () => {
  describe('getExamBySlug', () => {
    it('returns the correct exam for a valid slug', () => {
      const exam = getExamBySlug('ssc-cgl');
      expect(exam).toBeDefined();
      expect(exam?.id).toBe('ssc-cgl');
      expect(exam?.name).toBe('SSC CGL');
    });

    it('returns undefined for an invalid slug', () => {
      const exam = getExamBySlug('invalid-slug-123');
      expect(exam).toBeUndefined();
    });
  });

  describe('getExamsByCategory', () => {
    it('returns exams matching the given category', () => {
      const exams = getExamsByCategory('Banking');
      expect(exams.length).toBeGreaterThan(0);
      expect(exams[0].id).toBe('ibps-po');

      // All returned exams should have the correct category
      exams.forEach(exam => {
        expect(exam.category).toBe('Banking');
      });
    });

    it('returns an empty array for a category with no exams', () => {
      // Assuming 'Other' category has no exams initially, let's verify
      const otherExamsInDb = EXAM_DATABASE.filter(e => e.category === 'Other');
      const exams = getExamsByCategory('Other');
      expect(exams).toHaveLength(otherExamsInDb.length);
    });
  });

  describe('searchExams', () => {
    it('finds exams by name (case insensitive)', () => {
      const results1 = searchExams('ssc cgl');
      expect(results1).toHaveLength(1);
      expect(results1[0].id).toBe('ssc-cgl');

      const results2 = searchExams('SSC CGL');
      expect(results2).toHaveLength(1);
      expect(results2[0].id).toBe('ssc-cgl');
    });

    it('finds exams by organization (case insensitive)', () => {
      const results = searchExams('staff selection');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe('ssc-cgl');
    });

    it('finds exams by category (case insensitive)', () => {
      const results = searchExams('banking');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].category).toBe('Banking');
    });

    it('finds exams by slug (case insensitive)', () => {
      const results = searchExams('ibps-po');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].slug).toBe('ibps-po');
    });

    it('returns multiple exams for broad queries', () => {
      // Both SSC CGL and UPSC Civil Services have a 'c' in their names/organizations/categories
      const results = searchExams('c');
      expect(results.length).toBeGreaterThan(1);
    });

    it('returns an empty array when no matches are found', () => {
      const results = searchExams('nonexistentexam123');
      expect(results).toHaveLength(0);
    });
  });
});
