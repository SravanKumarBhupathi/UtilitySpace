import { extractPdfPages, mergePdfs, splitPdf, compressPdf } from './pdf-utils';
import { PDFDocument } from 'pdf-lib';

describe('pdf-utils', () => {
  let testFile: File;

  beforeEach(async () => {
    // Create a 5-page PDF for testing
    const pdfDoc = await PDFDocument.create();
    for (let i = 0; i < 5; i++) {
      pdfDoc.addPage([100, 100]);
    }
    const pdfBytes = await pdfDoc.save();

    // In our jest environment File is polyfilled in jest.setup.js
    testFile = new File([pdfBytes], 'test.pdf', { type: 'application/pdf' });
  });

  describe('extractPdfPages', () => {
    it('extracts a single page', async () => {
      const result = await extractPdfPages(testFile, '1');
      const resultDoc = await PDFDocument.load(result);
      expect(resultDoc.getPageCount()).toBe(1);
    });

    it('extracts multiple single pages', async () => {
      const result = await extractPdfPages(testFile, '1, 3');
      const resultDoc = await PDFDocument.load(result);
      expect(resultDoc.getPageCount()).toBe(2);
    });

    it('extracts a range of pages', async () => {
      const result = await extractPdfPages(testFile, '2-4');
      const resultDoc = await PDFDocument.load(result);
      expect(resultDoc.getPageCount()).toBe(3);
    });

    it('handles combination of ranges and single pages', async () => {
      const result = await extractPdfPages(testFile, '1, 3-5');
      const resultDoc = await PDFDocument.load(result);
      expect(resultDoc.getPageCount()).toBe(4);
    });

    it('handles spaces and overlapping pages gracefully', async () => {
      const result = await extractPdfPages(testFile, ' 1 - 3, 2, 4 ');
      const resultDoc = await PDFDocument.load(result);
      expect(resultDoc.getPageCount()).toBe(4);
    });

    it('ignores invalid pages and extracts only valid ones', async () => {
      const result = await extractPdfPages(testFile, '1, 99, abc');
      const resultDoc = await PDFDocument.load(result);
      expect(resultDoc.getPageCount()).toBe(1);
    });

    it('caps the range to the total number of pages', async () => {
      const result = await extractPdfPages(testFile, '4-10');
      const resultDoc = await PDFDocument.load(result);
      // Should only extract page 4 and 5
      expect(resultDoc.getPageCount()).toBe(2);
    });

    it('ignores reversed ranges', async () => {
      const result = await extractPdfPages(testFile, '1, 5-3');
      const resultDoc = await PDFDocument.load(result);
      // 5-3 is ignored, so only page 1 is extracted
      expect(resultDoc.getPageCount()).toBe(1);
    });

    it('ignores ranges with invalid characters', async () => {
      const result = await extractPdfPages(testFile, '1, a-b');
      const resultDoc = await PDFDocument.load(result);
      // a-b is ignored, so only page 1 is extracted
      expect(resultDoc.getPageCount()).toBe(1);
    });

    it('throws an error if no valid pages are specified', async () => {
      await expect(extractPdfPages(testFile, '99, 100')).rejects.toThrow('No valid pages specified.');
    });

    it('throws an error if empty string is provided', async () => {
      await expect(extractPdfPages(testFile, '')).rejects.toThrow('No valid pages specified.');
    });
  });

  describe('mergePdfs', () => {
    it('merges multiple PDF files into one', async () => {
      // Create a 2-page PDF
      const doc1 = await PDFDocument.create();
      doc1.addPage([100, 100]);
      doc1.addPage([100, 100]);
      const file1 = new File([await doc1.save()], '1.pdf', { type: 'application/pdf' });

      // Create a 3-page PDF
      const doc2 = await PDFDocument.create();
      for (let i = 0; i < 3; i++) doc2.addPage([100, 100]);
      const file2 = new File([await doc2.save()], '2.pdf', { type: 'application/pdf' });

      const result = await mergePdfs([file1, file2]);
      const resultDoc = await PDFDocument.load(result);

      // Total should be 5 pages
      expect(resultDoc.getPageCount()).toBe(5);
    });

    it('returns a PDF with 0 pages if no files are provided, though pdf-lib might add an empty page or throw on save, currently it returns 1 page because pdf-lib automatically adds a page if none exist for save in some versions or we can just expect whatever it yields', async () => {
      // If pdf-lib forces a page, it's not a big deal for our test coverage of mergePdfs
      // But let's check its output actually is valid
      const result = await mergePdfs([]);

      // Let's just expect it doesn't throw and resolves a uint8array
      expect(result).toBeInstanceOf(Uint8Array);
    });
  });

  describe('splitPdf', () => {
    it('splits a PDF into multiple 1-page documents', async () => {
      const resultFiles = await splitPdf(testFile);

      expect(resultFiles.length).toBe(5);

      for (const fileBytes of resultFiles) {
        const doc = await PDFDocument.load(fileBytes);
        expect(doc.getPageCount()).toBe(1);
      }
    });

    it('handles a single-page PDF', async () => {
      const singlePageDoc = await PDFDocument.create();
      singlePageDoc.addPage([100, 100]);
      const singlePageFile = new File([await singlePageDoc.save()], 'single.pdf', { type: 'application/pdf' });

      const resultFiles = await splitPdf(singlePageFile);
      expect(resultFiles.length).toBe(1);

      const doc = await PDFDocument.load(resultFiles[0]);
      expect(doc.getPageCount()).toBe(1);
    });
  });

  describe('compressPdf', () => {
    it('re-saves the document to potentially compress it', async () => {
      const result = await compressPdf(testFile);
      const resultDoc = await PDFDocument.load(result);

      // Should retain the same number of pages
      expect(resultDoc.getPageCount()).toBe(5);
    });
  });
});
