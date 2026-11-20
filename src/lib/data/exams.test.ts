import {
  validateExamDatabase,
  EXAM_DATABASE,
  ExamRecord,
  getExamBySlug,
  getExamsByCategory,
  searchExams,
  categoryToSlug,
  slugToCategory,
} from './exams';

describe('Exam Database Validation', () => {
  it('should pass on existing default database without errors', () => {
    const errors = validateExamDatabase();
    expect(errors).toHaveLength(0);
  });

  it('contains verified presets for core categories', () => {
    const categories = ['SSC', 'Railway', 'Banking', 'State Recruitment', 'All India'];
    categories.forEach((cat) => {
      const exams = getExamsByCategory(cat as any);
      expect(exams.length).toBeGreaterThan(0);
    });
  });

  it('correctly maps category to slug and vice-versa', () => {
    expect(categoryToSlug('State Recruitment')).toBe('state-recruitment');
    expect(slugToCategory('state-recruitment')).toBe('State Recruitment');
    expect(categoryToSlug('All India')).toBe('all-india');
    expect(slugToCategory('all-india')).toBe('All India');
    expect(categoryToSlug('Railway')).toBe('railway');
    expect(slugToCategory('railway')).toBe('Railway');
  });

  it('finds exams by slug', () => {
    const cgl = getExamBySlug('ssc-cgl');
    expect(cgl).toBeDefined();
    expect(cgl?.name).toBe('SSC CGL');
    expect(cgl?.requirements.photo.liveCaptureRequired).toBe(true);
    expect(cgl?.requirements.signature.minKB).toBe(10);
    expect(cgl?.requirements.signature.maxKB).toBe(20);
  });

  it('searches exams by query string', () => {
    const rrbResults = searchExams('ntpc');
    expect(rrbResults.length).toBeGreaterThanOrEqual(2);
    expect(rrbResults.some((e) => e.slug === 'rrb-ntpc-graduate')).toBe(true);
  });

  describe('Validation Rules with Mock Data', () => {
    let mockDb: ExamRecord[];
    const originalDb = [...EXAM_DATABASE];

    beforeEach(() => {
      const validRecord: ExamRecord = {
        id: 'test-1',
        name: 'Test Exam',
        organization: 'Test Org',
        category: 'All India',
        slug: 'test-1',
        recruitmentCycle: '2024-2025',
        notificationNumber: '123/2024',
        sourceUrl: 'https://example.com',
        applicationUrl: null,
        lastVerified: '2024-03-01',
        verificationStatus: 'Verified for current cycle',
        notes: null,
        active: true,
        requirements: {
          photo: {
            documentType: 'photo',
            format: ['jpg'],
            width: 350,
            height: 450,
            unit: 'px',
            minKB: 20,
            maxKB: 50,
            aspectRatio: null,
            nameRequired: false,
            dateRequired: false,
            backgroundRequirement: null,
            notes: null,
          },
        },
      };

      mockDb = [validRecord];
      EXAM_DATABASE.length = 0;
      EXAM_DATABASE.push(...mockDb);
    });

    afterEach(() => {
      EXAM_DATABASE.length = 0;
      EXAM_DATABASE.push(...originalDb);
    });

    it('rejects missing source link for verified presets', () => {
      mockDb[0].sourceUrl = null;
      EXAM_DATABASE.length = 0;
      EXAM_DATABASE.push(...mockDb);

      const errors = validateExamDatabase();
      expect(errors).toContain('Exam test-1 is marked as verified but has no sourceUrl.');
    });

    it('rejects missing recruitment cycle', () => {
      mockDb[0].recruitmentCycle = '';
      EXAM_DATABASE.length = 0;
      EXAM_DATABASE.push(...mockDb);

      const errors = validateExamDatabase();
      expect(errors).toContain('Exam test-1 is missing a recruitment cycle.');
    });

    it('rejects invalid file size limits (min >= max)', () => {
      mockDb[0].requirements.photo.minKB = 50;
      mockDb[0].requirements.photo.maxKB = 20;
      EXAM_DATABASE.length = 0;
      EXAM_DATABASE.push(...mockDb);

      const errors = validateExamDatabase();
      expect(errors).toContain('Exam test-1 requirement photo has minKB >= maxKB.');
    });

    it('rejects negative or zero dimensions', () => {
      mockDb[0].requirements.photo.width = 0;
      mockDb[0].requirements.photo.height = -10;
      EXAM_DATABASE.length = 0;
      EXAM_DATABASE.push(...mockDb);

      const errors = validateExamDatabase();
      expect(errors).toContain('Exam test-1 requirement photo has invalid width.');
      expect(errors).toContain('Exam test-1 requirement photo has invalid height.');
    });

    it('rejects duplicate identifiers', () => {
      mockDb.push({ ...mockDb[0] });
      EXAM_DATABASE.length = 0;
      EXAM_DATABASE.push(...mockDb);

      const errors = validateExamDatabase();
      expect(errors).toContain('Duplicate exam ID found: test-1');
    });

    it('allows valid historical or superseded presets without sourceUrls', () => {
      mockDb[0].verificationStatus = 'Historical archive';
      mockDb[0].sourceUrl = null;
      EXAM_DATABASE.length = 0;
      EXAM_DATABASE.push(...mockDb);

      const errors = validateExamDatabase();
      expect(errors).toHaveLength(0);
    });
  });
});
