import { compressPdf, mergePdfs, splitPdf, extractPdfPages } from '../pdf-utils';
import { PDFDocument } from 'pdf-lib';

describe('pdf-utils', () => {
  let dummyPdfBytes1: Uint8Array;
  let dummyPdfBytes2: Uint8Array;

  const createMockFile = (bytes: Uint8Array, name: string): File => {
    const file = new File([bytes], name, { type: 'application/pdf' });
    file.arrayBuffer = async () => bytes.buffer as ArrayBuffer;
    return file;
  };

  beforeAll(async () => {
    // Create first dummy PDF (1 page)
    const pdfDoc1 = await PDFDocument.create();
    const page1 = pdfDoc1.addPage([500, 500]);
    page1.drawText('Test PDF 1');
    dummyPdfBytes1 = await pdfDoc1.save();

    // Create second dummy PDF (2 pages)
    const pdfDoc2 = await PDFDocument.create();
    const page2 = pdfDoc2.addPage([500, 500]);
    page2.drawText('Test PDF 2 - Page 1');
    const page3 = pdfDoc2.addPage([500, 500]);
    page3.drawText('Test PDF 2 - Page 2');
    dummyPdfBytes2 = await pdfDoc2.save();
  });

  describe('compressPdf', () => {
    it('should take a PDF File and return a compressed Uint8Array', async () => {
      const file = createMockFile(dummyPdfBytes1, 'test.pdf');
      const result = await compressPdf(file);

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should call PDFDocument.load with ignoreEncryption: true and save with useObjectStreams: true', async () => {
      const loadSpy = jest.spyOn(PDFDocument, 'load');

      const file = createMockFile(dummyPdfBytes1, 'test2.pdf');
      await compressPdf(file);

      expect(loadSpy).toHaveBeenCalledWith(expect.any(ArrayBuffer), { ignoreEncryption: true });

      loadSpy.mockRestore();
    });

    it('should throw an error for an invalid PDF file', async () => {
      const invalidFile = createMockFile(new Uint8Array([1, 2, 3]), 'invalid.pdf');

      await expect(compressPdf(invalidFile)).rejects.toThrow();
    });
  });

  describe('mergePdfs', () => {
    it('should merge multiple PDF files into a single PDF Document', async () => {
      const file1 = createMockFile(dummyPdfBytes1, 'test1.pdf');
      const file2 = createMockFile(dummyPdfBytes2, 'test2.pdf');

      const result = await mergePdfs([file1, file2]);
      expect(result).toBeInstanceOf(Uint8Array);

      const mergedPdf = await PDFDocument.load(result);
      expect(mergedPdf.getPageCount()).toBe(3); // 1 + 2 pages
    });
  });

  describe('splitPdf', () => {
    it('should split a PDF file into multiple 1-page PDF documents', async () => {
      const file = createMockFile(dummyPdfBytes2, 'test.pdf'); // 2 page PDF

      const result = await splitPdf(file);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);

      for (const singlePagePdf of result) {
        expect(singlePagePdf).toBeInstanceOf(Uint8Array);
        const doc = await PDFDocument.load(singlePagePdf);
        expect(doc.getPageCount()).toBe(1);
      }
    });
  });

  describe('extractPdfPages', () => {
    it('should extract specific pages based on comma separated string', async () => {
      const file = createMockFile(dummyPdfBytes2, 'test.pdf'); // 2 page PDF

      const result = await extractPdfPages(file, '1');
      expect(result).toBeInstanceOf(Uint8Array);

      const doc = await PDFDocument.load(result);
      expect(doc.getPageCount()).toBe(1);
    });

    it('should handle ranges in page string', async () => {
      const file = createMockFile(dummyPdfBytes2, 'test.pdf'); // 2 page PDF

      const result = await extractPdfPages(file, '1-2');
      const doc = await PDFDocument.load(result);
      expect(doc.getPageCount()).toBe(2);
    });

    it('should filter invalid pages and throw error if none valid', async () => {
      const file = createMockFile(dummyPdfBytes2, 'test.pdf'); // 2 page PDF

      await expect(extractPdfPages(file, '3')).rejects.toThrow('No valid pages specified.');
      await expect(extractPdfPages(file, 'invalid')).rejects.toThrow('No valid pages specified.');
    });

    it('should clamp range ending beyond max pages', async () => {
      const file = createMockFile(dummyPdfBytes2, 'test.pdf'); // 2 page PDF

      const result = await extractPdfPages(file, '1-10');
      const doc = await PDFDocument.load(result);
      expect(doc.getPageCount()).toBe(2);
    });
  });
});
