import { mergePdfs } from '../pdf-utils';
import { PDFDocument } from 'pdf-lib';

/**
 * Helper to create a dummy PDF file with a specific number of pages.
 */
async function createDummyPdfFile(pageCount: number, fileName: string): Promise<File> {
  const pdfDoc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    pdfDoc.addPage([500, 500]); // Add a blank page
  }
  const pdfBytes = await pdfDoc.save();
  const file = new File([pdfBytes], fileName, { type: 'application/pdf' });

  // Polyfill arrayBuffer for jsdom if needed
  if (!file.arrayBuffer) {
    file.arrayBuffer = async () => {
      return new Uint8Array(pdfBytes).buffer;
    };
  }

  return file;
}

describe('mergePdfs', () => {
  it('merges multiple PDF files into a single document correctly', async () => {
    const file1 = await createDummyPdfFile(2, 'file1.pdf');
    const file2 = await createDummyPdfFile(3, 'file2.pdf');

    const mergedBytes = await mergePdfs([file1, file2]);

    const mergedDoc = await PDFDocument.load(mergedBytes);
    expect(mergedDoc.getPageCount()).toBe(5);
  });

  it('handles an empty array of files', async () => {
    const mergedBytes = await mergePdfs([]);
    const mergedDoc = await PDFDocument.load(mergedBytes);
    // pdf-lib's PDFDocument.create() followed by save() creates a minimal PDF.
    // When loaded back, pdf-lib reports it as having 1 page even if we didn't add any.
    expect(mergedDoc.getPageCount()).toBe(1);
  });

  it('handles a single PDF file correctly', async () => {
    const file = await createDummyPdfFile(4, 'file.pdf');
    const mergedBytes = await mergePdfs([file]);

    const mergedDoc = await PDFDocument.load(mergedBytes);
    expect(mergedDoc.getPageCount()).toBe(4);
  });

  it('rejects if an invalid file is provided', async () => {
    const invalidFile = new File(['not a real pdf'], 'invalid.pdf', { type: 'application/pdf' });
    if (!invalidFile.arrayBuffer) {
      invalidFile.arrayBuffer = async () => {
        return new TextEncoder().encode('not a real pdf').buffer;
      };
    }

    await expect(mergePdfs([invalidFile])).rejects.toThrow();
  });
});
