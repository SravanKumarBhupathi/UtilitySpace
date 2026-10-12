import { getExamBySlug, getExamsByCategory, searchExams, EXAM_DATABASE } from './exams';

describe('Exams Data Utilities', () => {

  describe('getExamBySlug', () => {
    it('should return the correct exam when given a valid slug', () => {
      const exam = getExamBySlug('ssc-cgl');
      expect(exam).toBeDefined();
      expect(exam?.id).toBe('ssc-cgl');
      expect(exam?.name).toBe('SSC CGL');
    });

    it('should return undefined when given an invalid slug', () => {
      const exam = getExamBySlug('invalid-slug-123');
      expect(exam).toBeUndefined();
    });

    it('should return undefined when given an empty string', () => {
      const exam = getExamBySlug('');
      expect(exam).toBeUndefined();
    });
  });

  describe('getExamsByCategory', () => {
    it('should return exams matching the given category', () => {
      const exams = getExamsByCategory('SSC');
      expect(exams.length).toBeGreaterThan(0);
      exams.forEach(exam => {
        expect(exam.category).toBe('SSC');
      });
    });

    it('should return an empty array for a category with no exams', () => {
      // Assuming 'Other' currently has no exams based on the mocked data, or we could just use a type assertion for a fake one.
      const exams = getExamsByCategory('Teaching');
      expect(exams).toEqual([]);
    });
  });

  describe('searchExams', () => {
    it('should return exams matching a partial name search (case-insensitive)', () => {
      const exams = searchExams('cgl');
      expect(exams.length).toBe(1);
      expect(exams[0].name).toBe('SSC CGL');

      const exams2 = searchExams('CGL');
      expect(exams2.length).toBe(1);
      expect(exams2[0].name).toBe('SSC CGL');
    });

    it('should return exams matching a partial organization search', () => {
      const exams = searchExams('staff selection');
      expect(exams.length).toBe(1);
      expect(exams[0].organization).toBe('Staff Selection Commission');
    });

    it('should return exams matching a category search', () => {
      const exams = searchExams('ssc');
      expect(exams.length).toBeGreaterThan(0);
      exams.forEach(exam => {
        expect(exam.category.toLowerCase()).toContain('ssc');
      });
    });

    it('should return exams matching a slug search', () => {
      const exams = searchExams('ssc-cgl');
      expect(exams.length).toBe(1);
      expect(exams[0].slug).toBe('ssc-cgl');
    });

    it('should return an empty array when no matches are found', () => {
      const exams = searchExams('nonexistent-exam-query');
      expect(exams).toEqual([]);
    });

    it('should return all exams when search query is empty string', () => {
       const exams = searchExams('');
       expect(exams.length).toBe(EXAM_DATABASE.length);
    });
  });
});
