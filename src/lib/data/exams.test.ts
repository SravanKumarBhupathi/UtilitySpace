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
      const exam = getExamBySlug('non-existent-exam');
      expect(exam).toBeUndefined();
    });
  });

  describe('getExamsByCategory', () => {
    it('should return all exams in the given category', () => {
      const sscExams = getExamsByCategory('SSC');
      expect(sscExams.length).toBeGreaterThan(0);
      expect(sscExams.every(e => e.category === 'SSC')).toBe(true);
    });

    it('should return an empty array if no exams exist in the category', () => {
      // Assuming 'Other' currently has no exams based on the file content.
      // Or we can mock the array, but let's test based on the actual static file data.
      // If 'Other' gets exams later, this test might need adjustment. Let's use 'Police' which is empty.
      const policeExams = getExamsByCategory('Police');
      expect(policeExams.length).toBe(0);
      expect(Array.isArray(policeExams)).toBe(true);
    });
  });

  describe('searchExams', () => {
    it('should return exams matching the query in name', () => {
      const results = searchExams('CGL');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(e => e.name === 'SSC CGL')).toBe(true);
    });

    it('should return exams matching the query in organization', () => {
      const results = searchExams('Staff Selection Commission');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(e => e.organization === 'Staff Selection Commission')).toBe(true);
    });

    it('should return exams matching the query in category', () => {
      const results = searchExams('Banking');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(e => e.category === 'Banking')).toBe(true);
    });

    it('should return exams matching the query in slug', () => {
      const results = searchExams('ibps-po');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(e => e.slug === 'ibps-po')).toBe(true);
    });

    it('should be case-insensitive', () => {
      const results1 = searchExams('upsc');
      const results2 = searchExams('UPSC');
      expect(results1.length).toBe(results2.length);
      expect(results1).toEqual(results2);
    });

    it('should return an empty array if no matches are found', () => {
      const results = searchExams('xyz123nonexistent');
      expect(results.length).toBe(0);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should return all exams when search query is empty', () => {
       const results = searchExams('');
       expect(results.length).toBe(EXAM_DATABASE.length);
    });
  });
});
