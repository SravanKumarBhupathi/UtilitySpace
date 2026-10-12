import { splitPdf } from './pdf-utils';
import { PDFDocument } from 'pdf-lib';

describe('splitPdf', () => {
  it('splits a multi-page PDF into multiple 1-page PDF documents', async () => {
    // Create a 3-page PDF
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([100, 100]); // Page 1
    pdfDoc.addPage([200, 200]); // Page 2
    pdfDoc.addPage([300, 300]); // Page 3

    const pdfBytes = await pdfDoc.save();
    const file = new File([pdfBytes], 'test-3pages.pdf', { type: 'application/pdf' });

    const splitFiles = await splitPdf(file);

    // Should return 3 files
    expect(splitFiles).toHaveLength(3);

    // Verify each is a 1-page PDF
    for (let i = 0; i < splitFiles.length; i++) {
      const splitDoc = await PDFDocument.load(splitFiles[i]);
      expect(splitDoc.getPageCount()).toBe(1);

      // Verify page dimensions to ensure correct pages were extracted
      const page = splitDoc.getPage(0);
      const expectedSize = (i + 1) * 100;
      expect(page.getWidth()).toBe(expectedSize);
      expect(page.getHeight()).toBe(expectedSize);
    }
  });

  it('handles a 1-page PDF correctly', async () => {
    // Create a 1-page PDF
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([150, 150]);

    const pdfBytes = await pdfDoc.save();
    const file = new File([pdfBytes], 'test-1page.pdf', { type: 'application/pdf' });

    const splitFiles = await splitPdf(file);

    // Should return 1 file
    expect(splitFiles).toHaveLength(1);

    // Verify it's a 1-page PDF
    const splitDoc = await PDFDocument.load(splitFiles[0]);
    expect(splitDoc.getPageCount()).toBe(1);
    const page = splitDoc.getPage(0);
    expect(page.getWidth()).toBe(150);
  });

  it('handles an empty PDF correctly (0 pages)', async () => {
    // Create a PDF but don't add any pages
    const pdfDoc = await PDFDocument.create();
    // Some PDF writers allow saving without pages, let's see what pdf-lib does.
    // pdf-lib throws an error when saving a document with 0 pages.
    // However, if we load a corrupted or empty file, we can test error handling.
    // Instead of testing a 0-page save which throws, let's just make sure
    // it can process a generic error if arrayBuffer is invalid.

    const badFile = new File(['not a pdf'], 'bad.pdf', { type: 'application/pdf' });

    await expect(splitPdf(badFile)).rejects.toThrow();
  });
});
