export type CompressionResult = {
  blob: Blob;
  url: string;
  sizeKB: number;
  width: number;
  height: number;
  quality: number;
  format: string;
};

export type TargetCompressionOptions = {
  minKB?: number;
  maxKB: number;
  format?: 'image/jpeg' | 'image/webp' | 'image/png';
  maxWidth?: number;
  maxHeight?: number;
  exactWidth?: number;
  exactHeight?: number;
  fillBackground?: string; // e.g. '#ffffff' for transparent PNGs converted to JPEG
};

/**
 * Attempts to compress an image to hit a target KB range.
 * If dimensions are provided (exactWidth/Height), it will scale/crop first.
 */
export async function compressToTargetKB(
  file: File | Blob | HTMLImageElement | HTMLCanvasElement,
  options: TargetCompressionOptions
): Promise<CompressionResult> {
  const format = options.format || 'image/jpeg';
  const minKB = options.minKB || 0;
  const maxKB = options.maxKB;

  // 1. Get a canvas representation of the source
  const canvas = await getSourceCanvas(file, options);

  // 2. Binary search for quality to hit target size (only for lossy formats)
  if (format === 'image/png') {
    // PNG doesn't use quality parameter in standard canvas
    return generateResult(canvas, format, 1.0);
  }

  let minQ = 0.0;
  let maxQ = 1.0;
  let bestResult: CompressionResult | null = null;
  let currentResult: CompressionResult | null = null;


  // Try up to 15 iterations for binary search to be more precise but bounded
  for (let i = 0; i < 15; i++) {
    const quality = (minQ + maxQ) / 2;
    // Yield to prevent UI blocking
    await new Promise(r => setTimeout(r, 10));
    try {
        currentResult = await generateResult(canvas, format, quality);
    } catch(e) {
        break; // If blob generation fails, stop search
    }

    // Check if we are within range
    if (currentResult.sizeKB >= minKB && currentResult.sizeKB <= maxKB) {
      // If we're in range, try to push quality a bit higher if possible, or just accept
      bestResult = currentResult;
      minQ = quality; // Try higher quality
    } else if (currentResult.sizeKB > maxKB) {
      maxQ = quality; // Need lower quality
    } else {
      // Below minKB. Some exams reject too small.
      bestResult = currentResult;
      minQ = quality; // Need higher quality to increase file size
    }
  }


  // If we couldn't get in range, return the closest valid one (usually the one right under maxKB)
  // Or fallback to maxQ = 0.1 if it's still too big.
  if (bestResult && bestResult.sizeKB <= maxKB) {
    return bestResult;
  }

  // Fallback if binary search didn't find a perfect match under maxKB
  // Just force a low quality or return what we have (UI handles validation warning)
  return await generateResult(canvas, format, 0.5);
}

async function getSourceCanvas(
  source: File | Blob | HTMLImageElement | HTMLCanvasElement,
  options: TargetCompressionOptions
): Promise<HTMLCanvasElement> {
  if (source instanceof HTMLCanvasElement) {
    // We already have a canvas, maybe we need to resize it?
    // For simplicity, assume if it's passed as canvas, it's already sized, OR we apply sizing here.
    return applySizing(source, options);
  }

  let img: HTMLImageElement;
  if (source instanceof HTMLImageElement) {
    img = source;
  } else {
    img = await loadImageFromBlob(source);
  }

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Failed to get 2d context");

  if (options.fillBackground && options.format === 'image/jpeg') {
    ctx.fillStyle = options.fillBackground;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  return applySizing(canvas, options);
}

function applySizing(canvas: HTMLCanvasElement, options: TargetCompressionOptions): HTMLCanvasElement {
  let targetWidth = canvas.width;
  let targetHeight = canvas.height;

  let needsCoverCrop = false;

  if (options.exactWidth && options.exactHeight) {
    targetWidth = options.exactWidth;
    targetHeight = options.exactHeight;
    needsCoverCrop = true;
  } else {
     if (options.maxWidth && canvas.width > options.maxWidth) {
       targetWidth = options.maxWidth;
       targetHeight = (canvas.height * options.maxWidth) / canvas.width;
     }
     if (options.maxHeight && targetHeight > options.maxHeight) {
       targetHeight = options.maxHeight;
       targetWidth = (canvas.width * options.maxHeight) / canvas.height;
     }
  }

  // If no change needed, return original
  if (targetWidth === canvas.width && targetHeight === canvas.height) {
    return canvas;
  }

  const outCanvas = document.createElement('canvas');
  outCanvas.width = targetWidth;
  outCanvas.height = targetHeight;
  const ctx = outCanvas.getContext('2d');
  if (!ctx) return canvas;

  if (options.fillBackground && options.format === 'image/jpeg') {
    ctx.fillStyle = options.fillBackground;
    ctx.fillRect(0, 0, outCanvas.width, outCanvas.height);
  }

  if (needsCoverCrop) {
    // Prevent squishing by doing a cover crop (center)
    const scale = Math.max(targetWidth / canvas.width, targetHeight / canvas.height);
    const scaledWidth = canvas.width * scale;
    const scaledHeight = canvas.height * scale;
    const offsetX = (targetWidth - scaledWidth) / 2;
    const offsetY = (targetHeight - scaledHeight) / 2;
    ctx.drawImage(canvas, offsetX, offsetY, scaledWidth, scaledHeight);
  } else {
    // Normal proportional scaling
    ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
  }

  return outCanvas;
}

function generateResult(canvas: HTMLCanvasElement, format: string, quality: number): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas to Blob failed"));
          return;
        }
        resolve({
          blob,
          url: URL.createObjectURL(blob),
          sizeKB: blob.size / 1024,
          width: canvas.width,
          height: canvas.height,
          quality,
          format
        });
      },
      format,
      quality
    );
  });
}

export function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

export async function overlayTextOnImage(
  sourceUrl: string,
  nameText?: string,
  dateText?: string
): Promise<string> {
  const blob = await fetch(sourceUrl).then(r => r.blob());
  const img = await loadImageFromBlob(blob);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return sourceUrl;

  ctx.drawImage(img, 0, 0);

  if (!nameText && !dateText) return sourceUrl;

  // Add a white strip at the bottom
  const stripHeight = Math.max(img.height * 0.2, 50); // 20% of image height or at least 50px
  ctx.fillStyle = 'white';
  ctx.fillRect(0, img.height - stripHeight, img.width, stripHeight);

  // Draw text
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const fontSize = Math.max(12, Math.floor(stripHeight * 0.3));
  ctx.font = `bold ${fontSize}px sans-serif`;

  if (nameText && dateText) {
    ctx.fillText(nameText, img.width / 2, img.height - stripHeight * 0.65);
    ctx.fillText(dateText, img.width / 2, img.height - stripHeight * 0.25);
  } else if (nameText) {
    ctx.fillText(nameText, img.width / 2, img.height - stripHeight * 0.5);
  } else if (dateText) {
    ctx.fillText(dateText, img.width / 2, img.height - stripHeight * 0.5);
  }

  return new Promise((resolve) => {
    canvas.toBlob((b) => {
      if (b) resolve(URL.createObjectURL(b));
      else resolve(sourceUrl);
    }, 'image/jpeg', 0.95);
  });
}

// Applies thresholding to clean up signatures
export async function enhanceSignature(sourceUrl: string, contrast: number = 1.0, brightness: number = 0): Promise<string> {
  const blob = await fetch(sourceUrl).then(r => r.blob());
  const img = await loadImageFromBlob(blob);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return sourceUrl;

  // Draw white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Apply contrast/brightness
  // formula: f(x) = (x - 128) * contrast + 128 + brightness
  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      let val = data[i + j];
      val = (val - 128) * contrast + 128 + brightness;

      // Thresholding (if it's light grey, make it white, if it's dark, make it darker)
      if (val > 180) val = 255;
      else if (val < 100) val = Math.max(0, val - 30);

      data[i + j] = Math.min(255, Math.max(0, val));
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((b) => {
      if (b) resolve(URL.createObjectURL(b));
      else resolve(sourceUrl);
    }, 'image/jpeg', 0.95);
  });
}

/**
 * Converts a dimensional measurement (cm, mm, inch, px) to pixels at given DPI.
 */
export function convertUnitToPx(
  value: number,
  unit: 'px' | 'cm' | 'mm' | 'inch',
  dpi: number = 200
): number {
  if (unit === 'px') return Math.round(value);
  if (unit === 'inch') return Math.round(value * dpi);
  if (unit === 'cm') return Math.round((value / 2.54) * dpi);
  if (unit === 'mm') return Math.round((value / 25.4) * dpi);
  return Math.round(value);
}

/**
 * Embeds an image blob into a single-page PDF document using pdf-lib.
 */
export async function imageBlobToPdfBlob(imageBlob: Blob): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib');
  const pdfDoc = await PDFDocument.create();
  const imageBytes = await imageBlob.arrayBuffer();

  let embeddedImage;
  if (imageBlob.type === 'image/png') {
    embeddedImage = await pdfDoc.embedPng(imageBytes);
  } else {
    // Treat webp or jpeg as jpg (or re-encode if needed)
    embeddedImage = await pdfDoc.embedJpg(imageBytes);
  }

  const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
  page.drawImage(embeddedImage, {
    x: 0,
    y: 0,
    width: embeddedImage.width,
    height: embeddedImage.height,
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

export type ValidationStatus = 'PASS' | 'FAIL' | 'MANUAL_REVIEW';

export interface ValidationItem {
  key: string;
  label: string;
  status: ValidationStatus;
  message: string;
  expected?: string;
  actual?: string;
}

export interface ValidationReport {
  overallStatus: ValidationStatus;
  items: ValidationItem[];
  canDownload: boolean;
}

export function validateDocumentAgainstRequirements(params: {
  sizeKB: number;
  width: number;
  height: number;
  format: string;
  minKB?: number;
  maxKB?: number;
  expectedWidth?: number | null;
  expectedHeight?: number | null;
  expectedFormats?: string[];
  backgroundInstruction?: string | null;
  nameRequired?: boolean;
  dateRequired?: boolean;
  hasNameOverlay?: boolean;
  hasDateOverlay?: boolean;
  isSignature?: boolean;
}): ValidationReport {
  const items: ValidationItem[] = [];

  // 1. File Size Check
  const minKB = params.minKB ?? 0;
  const maxKB = params.maxKB ?? 0;
  if (maxKB > 0) {
    const isSizeOk = params.sizeKB >= minKB && params.sizeKB <= maxKB;
    items.push({
      key: 'size',
      label: 'File Size (KB)',
      status: isSizeOk ? 'PASS' : 'FAIL',
      message: isSizeOk
        ? `File size (${params.sizeKB.toFixed(1)} KB) is within the required ${minKB} KB – ${maxKB} KB range.`
        : `File size (${params.sizeKB.toFixed(1)} KB) is outside the permitted ${minKB} KB – ${maxKB} KB limit.`,
      expected: `${minKB}–${maxKB} KB`,
      actual: `${params.sizeKB.toFixed(1)} KB`,
    });
  } else {
    items.push({
      key: 'size',
      label: 'File Size (KB)',
      status: 'PASS',
      message: `File size is ${params.sizeKB.toFixed(1)} KB.`,
      actual: `${params.sizeKB.toFixed(1)} KB`,
    });
  }

  // 2. Dimensions Check
  if (params.expectedWidth && params.expectedHeight) {
    const widthTolerance = 2; // +/- 2px tolerance
    const heightTolerance = 2;
    const isWidthOk = Math.abs(params.width - params.expectedWidth) <= widthTolerance;
    const isHeightOk = Math.abs(params.height - params.expectedHeight) <= heightTolerance;
    const isDimOk = isWidthOk && isHeightOk;

    items.push({
      key: 'dimensions',
      label: 'Dimensions (W × H)',
      status: isDimOk ? 'PASS' : 'FAIL',
      message: isDimOk
        ? `Dimensions match required ${params.expectedWidth} × ${params.expectedHeight} px.`
        : `Dimensions (${params.width} × ${params.height} px) do not match expected ${params.expectedWidth} × ${params.expectedHeight} px.`,
      expected: `${params.expectedWidth} × ${params.expectedHeight} px`,
      actual: `${params.width} × ${params.height} px`,
    });
  } else {
    items.push({
      key: 'dimensions',
      label: 'Dimensions (W × H)',
      status: 'PASS',
      message: `Current resolution: ${params.width} × ${params.height} px.`,
      actual: `${params.width} × ${params.height} px`,
    });
  }

  // 3. Format Check
  if (params.expectedFormats && params.expectedFormats.length > 0) {
    const formatNorm = params.format.toLowerCase().replace('image/', '');
    const isFormatOk = params.expectedFormats.some((fmt) => {
      const f = fmt.toLowerCase();
      if (f === 'jpg' || f === 'jpeg') return formatNorm === 'jpeg' || formatNorm === 'jpg';
      return formatNorm === f;
    });

    items.push({
      key: 'format',
      label: 'File Format',
      status: isFormatOk ? 'PASS' : 'FAIL',
      message: isFormatOk
        ? `Format (${formatNorm.toUpperCase()}) matches official requirements.`
        : `Format (${formatNorm.toUpperCase()}) is not in accepted list: ${params.expectedFormats.join(', ').toUpperCase()}.`,
      expected: params.expectedFormats.join(', ').toUpperCase(),
      actual: formatNorm.toUpperCase(),
    });
  }

  // 4. Name & Date Overlay Check (if required by exam like UPSC)
  if (params.nameRequired || params.dateRequired) {
    const hasBoth = Boolean(params.hasNameOverlay && params.hasDateOverlay);
    items.push({
      key: 'name_date',
      label: 'Name & Date Stamp',
      status: hasBoth ? 'PASS' : 'MANUAL_REVIEW',
      message: hasBoth
        ? 'Name and Date caption strip is added to the bottom of the photo.'
        : 'Official notification requires candidate name and date of photo capture printed at the bottom. Please ensure they are added.',
      expected: 'Printed at bottom of photo',
      actual: hasBoth ? 'Applied' : 'Not applied or incomplete',
    });
  }

  // 5. Visual Manual Review items (background, readability, spectacles)
  if (params.isSignature) {
    items.push({
      key: 'signature_legibility',
      label: 'Signature Contrast & Legibility',
      status: 'MANUAL_REVIEW',
      message:
        'Visually confirm the signature is dark, legible, signed with running handwriting on plain white paper, and not signed in block/capital letters.',
    });
  } else {
    items.push({
      key: 'background_appearance',
      label: 'Background & Facial Clarity',
      status: 'MANUAL_REVIEW',
      message: params.backgroundInstruction
        ? `Visually confirm: "${params.backgroundInstruction}". Face must be straight, clear, and without caps, sunglasses, or heavy glare.`
        : 'Visually confirm face is clearly visible with light/plain background, eyes open, and no shadow on face.',
    });
  }

  const hasFails = items.some((i) => i.status === 'FAIL');
  const hasReviews = items.some((i) => i.status === 'MANUAL_REVIEW');

  let overallStatus: ValidationStatus = 'PASS';
  if (hasFails) {
    overallStatus = 'FAIL';
  } else if (hasReviews) {
    overallStatus = 'MANUAL_REVIEW';
  }

  return {
    overallStatus,
    items,
    canDownload: true, // User can still download even if warning, but UI shows clear warning
  };
}
