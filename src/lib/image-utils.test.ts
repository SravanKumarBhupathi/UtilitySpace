import {
  convertUnitToPx,
  validateDocumentAgainstRequirements,
} from './image-utils';

describe('Image Utils - Unit and Dimension Conversion', () => {
  it('preserves exact pixel values regardless of DPI', () => {
    expect(convertUnitToPx(350, 'px', 100)).toBe(350);
    expect(convertUnitToPx(350, 'px', 200)).toBe(350);
    expect(convertUnitToPx(500, 'px', 300)).toBe(500);
  });

  it('correctly converts inches to pixels based on DPI', () => {
    expect(convertUnitToPx(1, 'inch', 100)).toBe(100);
    expect(convertUnitToPx(2, 'inch', 200)).toBe(400);
    expect(convertUnitToPx(1.5, 'inch', 300)).toBe(450);
  });

  it('correctly converts centimeters to pixels based on DPI', () => {
    // 1 inch = 2.54 cm -> (3.5 / 2.54) * 200 ≈ 275.59 -> 276
    expect(convertUnitToPx(3.5, 'cm', 200)).toBe(276);
    // (4.5 / 2.54) * 200 ≈ 354.33 -> 354
    expect(convertUnitToPx(4.5, 'cm', 200)).toBe(354);
    // at 300 DPI: (3.5 / 2.54) * 300 ≈ 413.38 -> 413
    expect(convertUnitToPx(3.5, 'cm', 300)).toBe(413);
  });

  it('correctly converts millimeters to pixels based on DPI', () => {
    // 35mm at 200 DPI: (35 / 25.4) * 200 ≈ 275.59 -> 276
    expect(convertUnitToPx(35, 'mm', 200)).toBe(276);
    // 45mm at 200 DPI: (45 / 25.4) * 200 ≈ 354.33 -> 354
    expect(convertUnitToPx(45, 'mm', 200)).toBe(354);
    // 35mm at 300 DPI: (35 / 25.4) * 300 ≈ 413.38 -> 413
    expect(convertUnitToPx(35, 'mm', 300)).toBe(413);
    // 50mm at 200 DPI: (50 / 25.4) * 200 ≈ 393.7 -> 394
    expect(convertUnitToPx(50, 'mm', 200)).toBe(394);
  });
});

describe('Document Validation Engine', () => {
  it('returns PASS when all requirements are fully satisfied', () => {
    const report = validateDocumentAgainstRequirements({
      sizeKB: 35.4,
      width: 350,
      height: 450,
      format: 'image/jpeg',
      minKB: 20,
      maxKB: 50,
      expectedWidth: 350,
      expectedHeight: 450,
      expectedFormats: ['jpg', 'jpeg'],
      nameRequired: false,
      dateRequired: false,
    });

    const sizeItem = report.items.find((i) => i.key === 'size');
    const dimItem = report.items.find((i) => i.key === 'dimensions');
    const formatItem = report.items.find((i) => i.key === 'format');

    expect(sizeItem?.status).toBe('PASS');
    expect(dimItem?.status).toBe('PASS');
    expect(formatItem?.status).toBe('PASS');
    // Manual review items exist for background/signature visual check
    expect(report.overallStatus).toBe('MANUAL_REVIEW');
  });

  it('returns FAIL when file size exceeds maximum permitted KB', () => {
    const report = validateDocumentAgainstRequirements({
      sizeKB: 75.2,
      width: 350,
      height: 450,
      format: 'image/jpeg',
      minKB: 20,
      maxKB: 50,
      expectedWidth: 350,
      expectedHeight: 450,
      expectedFormats: ['jpg', 'jpeg'],
    });

    const sizeItem = report.items.find((i) => i.key === 'size');
    expect(sizeItem?.status).toBe('FAIL');
    expect(report.overallStatus).toBe('FAIL');
  });

  it('returns FAIL when file size is below minimum permitted KB', () => {
    const report = validateDocumentAgainstRequirements({
      sizeKB: 8.5,
      width: 200,
      height: 230,
      format: 'image/jpeg',
      minKB: 10,
      maxKB: 20,
      expectedWidth: 200,
      expectedHeight: 230,
      expectedFormats: ['jpg', 'jpeg'],
    });

    const sizeItem = report.items.find((i) => i.key === 'size');
    expect(sizeItem?.status).toBe('FAIL');
    expect(report.overallStatus).toBe('FAIL');
  });

  it('allows slight dimension tolerance of up to 2px', () => {
    const report = validateDocumentAgainstRequirements({
      sizeKB: 25,
      width: 351, // +1px within tolerance
      height: 449, // -1px within tolerance
      format: 'image/jpeg',
      minKB: 20,
      maxKB: 50,
      expectedWidth: 350,
      expectedHeight: 450,
    });

    const dimItem = report.items.find((i) => i.key === 'dimensions');
    expect(dimItem?.status).toBe('PASS');
  });

  it('returns FAIL when dimensions exceed tolerance limit', () => {
    const report = validateDocumentAgainstRequirements({
      sizeKB: 25,
      width: 360, // +10px outside tolerance
      height: 450,
      format: 'image/jpeg',
      minKB: 20,
      maxKB: 50,
      expectedWidth: 350,
      expectedHeight: 450,
    });

    const dimItem = report.items.find((i) => i.key === 'dimensions');
    expect(dimItem?.status).toBe('FAIL');
    expect(report.overallStatus).toBe('FAIL');
  });

  it('returns FAIL when format does not match official accepted format', () => {
    const report = validateDocumentAgainstRequirements({
      sizeKB: 25,
      width: 350,
      height: 450,
      format: 'image/png',
      minKB: 20,
      maxKB: 50,
      expectedFormats: ['jpg', 'jpeg'],
    });

    const formatItem = report.items.find((i) => i.key === 'format');
    expect(formatItem?.status).toBe('FAIL');
    expect(report.overallStatus).toBe('FAIL');
  });

  it('flags MANUAL_REVIEW when name and date are required by notification but not applied', () => {
    const report = validateDocumentAgainstRequirements({
      sizeKB: 45,
      width: 350,
      height: 350,
      format: 'image/jpeg',
      minKB: 20,
      maxKB: 300,
      expectedWidth: 350,
      expectedHeight: 350,
      nameRequired: true,
      dateRequired: true,
      hasNameOverlay: false,
      hasDateOverlay: false,
    });

    const nameDateItem = report.items.find((i) => i.key === 'name_date');
    expect(nameDateItem?.status).toBe('MANUAL_REVIEW');
  });

  it('passes name & date check when both name and date overlays are provided', () => {
    const report = validateDocumentAgainstRequirements({
      sizeKB: 45,
      width: 350,
      height: 350,
      format: 'image/jpeg',
      minKB: 20,
      maxKB: 300,
      expectedWidth: 350,
      expectedHeight: 350,
      nameRequired: true,
      dateRequired: true,
      hasNameOverlay: true,
      hasDateOverlay: true,
    });

    const nameDateItem = report.items.find((i) => i.key === 'name_date');
    expect(nameDateItem?.status).toBe('PASS');
  });
});
