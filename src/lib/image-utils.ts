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

  // Try up to 8 iterations for binary search
  for (let i = 0; i < 8; i++) {
    const quality = (minQ + maxQ) / 2;
    currentResult = await generateResult(canvas, format, quality);

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

  if (options.exactWidth && options.exactHeight) {
    targetWidth = options.exactWidth;
    targetHeight = options.exactHeight;
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

  // Draw image scaled (potentially squished if exactWidth/Height break aspect ratio - UI should handle cropping before this if aspect ratio matters)
  ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
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
