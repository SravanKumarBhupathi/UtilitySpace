import {
  getExamBySlug,
  getExamsByCategory,
  searchExams,
  EXAM_DATABASE
} from './exams';

describe('Exams Data Utilities', () => {
  describe('getExamBySlug', () => {
    it('should return the correct exam for an existing slug', () => {
      const exam = getExamBySlug('ssc-cgl');
      expect(exam).toBeDefined();
      expect(exam?.slug).toBe('ssc-cgl');
      expect(exam?.name).toBe('SSC CGL');
    });

    it('should return undefined for a non-existent slug', () => {
      const exam = getExamBySlug('non-existent-slug');
      expect(exam).toBeUndefined();
    });
  });

  describe('getExamsByCategory', () => {
    it('should return exams for an existing category', () => {
      const exams = getExamsByCategory('SSC');
      expect(exams.length).toBeGreaterThan(0);
      expect(exams.every((e) => e.category === 'SSC')).toBe(true);
    });

    it('should return an empty array for a category with no exams', () => {
      // Assuming 'Defence' has no exams currently in EXAM_DATABASE
      const exams = getExamsByCategory('Defence');
      expect(exams).toEqual([]);
    });
  });

  describe('searchExams', () => {
    it('should find exams by name', () => {
      const exams = searchExams('SSC CGL');
      expect(exams.length).toBeGreaterThan(0);
      expect(exams[0].name).toBe('SSC CGL');
    });

    it('should find exams by organization', () => {
      const exams = searchExams('Staff Selection Commission');
      expect(exams.length).toBeGreaterThan(0);
      expect(exams[0].organization).toBe('Staff Selection Commission');
    });

    it('should find exams by category', () => {
      const exams = searchExams('Railway');
      expect(exams.length).toBeGreaterThan(0);
      expect(exams[0].category).toBe('Railway');
    });

    it('should find exams by slug', () => {
      const exams = searchExams('ibps-po');
      expect(exams.length).toBeGreaterThan(0);
      expect(exams[0].slug).toBe('ibps-po');
    });

    it('should perform case-insensitive search', () => {
      const examsLower = searchExams('ssc cgl');
      const examsUpper = searchExams('SSC CGL');
      expect(examsLower.length).toBeGreaterThan(0);
      expect(examsLower).toEqual(examsUpper);
    });

    it('should return all exams when query is empty', () => {
      const exams = searchExams('');
      expect(exams.length).toBe(EXAM_DATABASE.length);
    });

    it('should return an empty array when no match is found', () => {
      const exams = searchExams('something-that-does-not-exist');
      expect(exams).toEqual([]);
    });
  });
});
