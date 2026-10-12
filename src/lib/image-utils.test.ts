import { enhanceSignature } from './image-utils';

describe('enhanceSignature', () => {
  let originalSrcDescriptor: PropertyDescriptor | undefined;
  let originalGetImageData: any;
  let originalPutImageData: any;

  beforeAll(() => {
    // Mock fetch
    global.fetch = jest.fn(async () => ({
      blob: async () => new Blob(['fake'], { type: 'image/png' })
    })) as any;

    global.URL.createObjectURL = jest.fn(() => 'blob:fake-url');
    global.URL.revokeObjectURL = jest.fn();

    // Mock Image loading
    originalSrcDescriptor = Object.getOwnPropertyDescriptor(Image.prototype, 'src');
    Object.defineProperty(Image.prototype, 'src', {
      get() { return originalSrcDescriptor?.get?.call(this) || ''; },
      set(val) {
        this.width = 100;
        this.height = 100;
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 10);
      }
    });

    originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
    originalPutImageData = CanvasRenderingContext2D.prototype.putImageData;
  });

  afterAll(() => {
    if (originalSrcDescriptor) {
      Object.defineProperty(Image.prototype, 'src', originalSrcDescriptor);
    }
    CanvasRenderingContext2D.prototype.getImageData = originalGetImageData;
    CanvasRenderingContext2D.prototype.putImageData = originalPutImageData;
  });

  afterEach(() => {
    jest.clearAllMocks();
    CanvasRenderingContext2D.prototype.getImageData = originalGetImageData;
    CanvasRenderingContext2D.prototype.putImageData = originalPutImageData;
  });

  it('should enhance signature with default contrast and brightness', async () => {
    const result = await enhanceSignature('fake-source-url');
    expect(result).toBe('blob:fake-url');
    expect(global.fetch).toHaveBeenCalledWith('fake-source-url');
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it('should enhance signature with custom contrast and brightness', async () => {
    const result = await enhanceSignature('fake-source-url', 1.5, 20);
    expect(result).toBe('blob:fake-url');
  });

  it('correctly applies pixel manipulation math (thresholding)', async () => {
    const pixelData = new Uint8ClampedArray([
      128, 128, 128, 255, // mid grey
      200, 200, 200, 255, // light grey
      50, 50, 50, 255     // dark grey
    ]);
    let resultData: Uint8ClampedArray | null = null;

    CanvasRenderingContext2D.prototype.getImageData = jest.fn().mockReturnValue({ data: pixelData });
    CanvasRenderingContext2D.prototype.putImageData = jest.fn((imgData: any) => {
      resultData = imgData.data as any;
    });

    await enhanceSignature('fake-source-url', 1.0, 0); // No contrast/brightness change

    expect(CanvasRenderingContext2D.prototype.getImageData).toHaveBeenCalled();
    expect(CanvasRenderingContext2D.prototype.putImageData).toHaveBeenCalled();

    expect(resultData).not.toBeNull();
    // mid grey (128) -> remains 128
    expect(resultData![0]).toBe(128);
    // light grey (200) -> > 180 -> 255
    expect(resultData![4]).toBe(255);
    // dark grey (50) -> < 100 -> max(0, 50 - 30) = 20
    expect(resultData![8]).toBe(20);
  });

  it('should handle toBlob failure and return sourceUrl', async () => {
    // Override HTMLCanvasElement.prototype.toBlob to fail
    const originalToBlob = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function(callback: any) {
      callback(null);
    };

    const result = await enhanceSignature('fake-source-url');
    expect(result).toBe('fake-source-url');

    // Restore
    HTMLCanvasElement.prototype.toBlob = originalToBlob;
  });

  it('should return sourceUrl if context is null', async () => {
    // Override getContext to return null
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function() {
      return null;
    } as any;

    const result = await enhanceSignature('fake-source-url');
    expect(result).toBe('fake-source-url');

    // Restore
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });
});
