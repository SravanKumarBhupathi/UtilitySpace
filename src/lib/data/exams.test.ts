import { validateExamDatabase, ExamRecord, VerificationStatus, DocumentRequirement } from './exams';
import { EXAM_DATABASE } from './exams';

describe('Exam Database Validation', () => {
  it('should pass on existing default database without errors', () => {
    const errors = validateExamDatabase();
    expect(errors).toHaveLength(0);
  });

  describe('Validation Rules with Mock Data', () => {
    let mockDb: ExamRecord[];

    // Store original database to not pollute other tests if any
    const originalDb = [...EXAM_DATABASE];

    beforeEach(() => {
      // Create a valid base mock record
      const validRecord: ExamRecord = {
        id: 'test-1',
        name: 'Test Exam',
        organization: 'Test Org',
        category: 'Other',
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
            notes: null
          }
        }
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
      mockDb.push({...mockDb[0]});
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
      expect(errors).toHaveLength(0); // Should be valid
    });
  });
});
