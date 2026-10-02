import { PDFDocument } from 'pdf-lib';

/**
 * Merges multiple PDF files into a single PDF Document.
 */
export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Splits a PDF file into multiple 1-page PDF documents.
 */
export async function splitPdf(file: File): Promise<Uint8Array[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pagesCount = pdfDoc.getPageCount();

  const splitFiles: Uint8Array[] = [];

  for (let i = 0; i < pagesCount; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
    newPdf.addPage(copiedPage);
    splitFiles.push(await newPdf.save());
  }

  return splitFiles;
}

/**
 * Extracts specific pages (1-indexed string e.g., '1, 3, 5-7') from a PDF.
 */
export async function extractPdfPages(file: File, pagesString: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();

  const pageIndicesToKeep = new Set<number>();

  // Parse ranges e.g. "1, 2, 4-6"
  const parts = pagesString.split(',').map(s => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
        for (let i = start; i <= Math.min(end, totalPages); i++) {
          pageIndicesToKeep.add(i - 1);
        }
      }
    } else {
      const num = parseInt(part, 10);
      if (!isNaN(num) && num > 0 && num <= totalPages) {
        pageIndicesToKeep.add(num - 1);
      }
    }
  }

  if (pageIndicesToKeep.size === 0) {
    throw new Error('No valid pages specified.');
  }

  const newPdf = await PDFDocument.create();
  const sortedIndices = Array.from(pageIndicesToKeep).sort((a, b) => a - b);
  const copiedPages = await newPdf.copyPages(pdfDoc, sortedIndices);
  copiedPages.forEach(page => newPdf.addPage(page));

  return await newPdf.save();
}

/**
 * Very basic compression utilizing pdf-lib to re-save the document without embedded metadata,
 * unused objects, or unneeded structure. (Note: true image compression inside PDFs requires
 * more complex parsing than pdf-lib provides out of the box, but re-saving often drops dead weight).
 */
export async function compressPdf(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  // Save with objects stream to compress structure
  return await pdfDoc.save({ useObjectStreams: true });
}
