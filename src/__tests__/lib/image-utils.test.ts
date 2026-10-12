import { compressToTargetKB } from '../../lib/image-utils';

// Global mocks for URL methods
global.URL.createObjectURL = jest.fn(() => 'blob:test-url');
global.URL.revokeObjectURL = jest.fn();

describe('image-utils - compressToTargetKB', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should compress image to hit target KB range using binary search', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;

    canvas.toBlob = jest.fn((callback, type, quality) => {
       const q = typeof quality === 'number' ? quality : 1;
       // Simulate size: at q=1 it's 200KB, at q=0.5 it's 100KB, at q=0.25 it's 50KB
       const size = 200 * 1024 * q;
       const mockBlob = { size, type: type || 'image/jpeg' } as Blob;
       setTimeout(() => callback(mockBlob), 0);
    });

    const options = { minKB: 80, maxKB: 120, format: 'image/jpeg' as const };

    const result = await compressToTargetKB(canvas, options);

    expect(result).toBeDefined();
    // 200 * q should be between 80 and 120
    // so q should be around 0.4 to 0.6
    expect(result.sizeKB).toBeGreaterThanOrEqual(80);
    expect(result.sizeKB).toBeLessThanOrEqual(120);
    expect(result.quality).toBeGreaterThanOrEqual(0.4);
    expect(result.quality).toBeLessThanOrEqual(0.6);
  });

  it('should fallback to 0.5 quality if it cannot reach maxKB', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;

    canvas.toBlob = jest.fn((callback, type, quality) => {
       const q = typeof quality === 'number' ? quality : 1;
       // Simulate size: even at q=0, size is 500KB (e.g. incompressible data or huge canvas)
       const size = 500 * 1024 + 100 * 1024 * q;
       const mockBlob = { size, type: type || 'image/jpeg' } as Blob;
       setTimeout(() => callback(mockBlob), 0);
    });

    const options = { minKB: 80, maxKB: 120, format: 'image/jpeg' as const };

    const result = await compressToTargetKB(canvas, options);

    expect(result).toBeDefined();
    expect(result.sizeKB).toBeGreaterThan(120);
    expect(result.quality).toBe(0.5); // Fallback quality
  });

  it('should push quality higher if it is below minKB to increase size', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;

    canvas.toBlob = jest.fn((callback, type, quality) => {
       const q = typeof quality === 'number' ? quality : 1;
       // Simulate size: at q=1 it's 40KB
       const size = 40 * 1024 * q;
       const mockBlob = { size, type: type || 'image/jpeg' } as Blob;
       setTimeout(() => callback(mockBlob), 0);
    });

    const options = { minKB: 80, maxKB: 120, format: 'image/jpeg' as const };

    const result = await compressToTargetKB(canvas, options);

    expect(result).toBeDefined();
    // It will never hit 80KB, so it should push quality to the max it can within binary search limits (8 iterations)
    expect(result.quality).toBeGreaterThan(0.9);
  });

  it('should immediately return for png format without binary search', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;

    canvas.toBlob = jest.fn((callback, type, quality) => {
       const mockBlob = { size: 100 * 1024, type: type || 'image/png' } as Blob;
       setTimeout(() => callback(mockBlob), 0);
    });

    const options = { maxKB: 120, format: 'image/png' as const };

    const result = await compressToTargetKB(canvas, options);

    expect(result).toBeDefined();
    expect(result.format).toBe('image/png');
    expect(result.quality).toBe(1.0); // PNG doesn't use quality, hardcoded to 1.0
    expect(canvas.toBlob).toHaveBeenCalledTimes(1);
  });

  it('should respect exactWidth and exactHeight', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;

    // We need a real-ish canvas context for this to avoid throwing
    const mockCtx = {
      drawImage: jest.fn(),
      fillRect: jest.fn(),
    };
    HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCtx as any);

    canvas.toBlob = jest.fn((callback, type, quality) => {
       const mockBlob = { size: 100 * 1024, type: type || 'image/jpeg' } as Blob;
       setTimeout(() => callback(mockBlob), 0);
    });

    const options = { maxKB: 120, exactWidth: 500, exactHeight: 300, format: 'image/jpeg' as const };

    const result = await compressToTargetKB(canvas, options);

    expect(result).toBeDefined();
    expect(result.width).toBe(500);
    expect(result.height).toBe(300);
  });

  it('should apply fillBackground for transparent PNGs converted to JPEG', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;

    const mockCtx = {
      drawImage: jest.fn(),
      fillRect: jest.fn(),
      fillStyle: '',
    };

    // Create a mock canvas for the outCanvas
    const mockOutCanvas = document.createElement('canvas');
    mockOutCanvas.getContext = jest.fn(() => mockCtx as any);
    mockOutCanvas.toBlob = jest.fn((callback) => {
       const mockBlob = { size: 100 * 1024, type: 'image/jpeg' } as Blob;
       setTimeout(() => callback(mockBlob), 0);
    });

    // Spy on document.createElement to return our mockOutCanvas when needed
    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        // Return a fresh canvas, but we'll monkey-patch it for applySizing
        const c = originalCreateElement(tagName) as HTMLCanvasElement;
        c.getContext = jest.fn(() => mockCtx as any);
        c.toBlob = mockOutCanvas.toBlob;
        return c;
      }
      return originalCreateElement(tagName);
    });

    const options = { maxKB: 120, exactWidth: 500, exactHeight: 500, format: 'image/jpeg' as const, fillBackground: '#ffffff' };

    // Pass original canvas so getSourceCanvas calls applySizing
    await compressToTargetKB(canvas, options);

    expect(mockCtx.fillStyle).toBe('#ffffff');
    expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 500, 500);

    jest.restoreAllMocks();
  });

  it('should handle getSourceCanvas returning the canvas directly if no sizing needed', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;

    canvas.toBlob = jest.fn((callback) => {
       const mockBlob = { size: 100 * 1024, type: 'image/jpeg' } as Blob;
       setTimeout(() => callback(mockBlob), 0);
    });

    // No sizing options
    const options = { maxKB: 120, format: 'image/jpeg' as const };

    const result = await compressToTargetKB(canvas, options);

    expect(result.width).toBe(500);
    expect(result.height).toBe(500);
  });

  it('should handle maxWidth and maxHeight sizing', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 800; // Aspect ratio 5:4

    const mockCtx = {
      drawImage: jest.fn(),
      fillRect: jest.fn(),
    };

    // Create a mock canvas for the outCanvas
    const mockOutCanvas = document.createElement('canvas');
    mockOutCanvas.getContext = jest.fn(() => mockCtx as any);
    mockOutCanvas.toBlob = jest.fn((callback) => {
       const mockBlob = { size: 100 * 1024, type: 'image/jpeg' } as Blob;
       setTimeout(() => callback(mockBlob), 0);
    });

    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        const c = originalCreateElement(tagName) as HTMLCanvasElement;
        c.getContext = jest.fn(() => mockCtx as any);
        c.toBlob = mockOutCanvas.toBlob;
        return c;
      }
      return originalCreateElement(tagName);
    });

    const options = { maxKB: 120, maxWidth: 500, format: 'image/jpeg' as const };

    await compressToTargetKB(canvas, options);

    // Should scale down to 500x400
    expect(mockCtx.drawImage).toHaveBeenCalledWith(canvas, 0, 0, 500, 400);

    jest.restoreAllMocks();
  });

  it('should process File as source properly using getSourceCanvas', async () => {
    // For this, we need to mock loadImageFromBlob
    const mockFile = new File(['mock'], 'test.jpg', { type: 'image/jpeg' });

    const mockCtx = {
      drawImage: jest.fn(),
      fillRect: jest.fn(),
    };

    const mockImg = new Image();
    mockImg.width = 400;
    mockImg.height = 400;

    // Spy on global Image
    const originalImage = global.Image;
    global.Image = class {
      onload: any;
      src: any;
      width = 400;
      height = 400;
      constructor() {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
    } as any;

    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        const c = originalCreateElement(tagName) as HTMLCanvasElement;
        c.getContext = jest.fn(() => mockCtx as any);
        c.toBlob = jest.fn((callback) => {
          const mockBlob = { size: 100 * 1024, type: 'image/jpeg' } as Blob;
          setTimeout(() => callback(mockBlob), 0);
        });
        return c;
      }
      return originalCreateElement(tagName);
    });

    const options = { maxKB: 120, format: 'image/jpeg' as const };

    const result = await compressToTargetKB(mockFile, options);

    expect(result.width).toBe(400);
    expect(result.height).toBe(400);

    // Restore
    global.Image = originalImage;
    jest.restoreAllMocks();
  });

  it('should handle toBlob returning null/failing', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;

    canvas.toBlob = jest.fn((callback) => {
       // Simulate failure by calling callback with null
       setTimeout(() => callback(null), 0);
    });

    const options = { maxKB: 120, format: 'image/jpeg' as const };

    await expect(compressToTargetKB(canvas, options)).rejects.toThrow("Canvas to Blob failed");
  });
});

  describe('loadImageFromBlob error handling', () => {
    it('should reject when image loading fails', async () => {
      const mockFile = new File(['mock'], 'test.jpg', { type: 'image/jpeg' });

      const originalImage = global.Image;
      global.Image = class {
        onerror: any;
        src: any;
        constructor() {
          setTimeout(() => {
            if (this.onerror) this.onerror();
          }, 0);
        }
      } as any;

      const options = { maxKB: 120, format: 'image/jpeg' as const };

      await expect(compressToTargetKB(mockFile, options)).rejects.toThrow("Failed to load image");

      global.Image = originalImage;
    });
  });

  describe('getSourceCanvas missing context', () => {
    it('should throw error if getContext returns null', async () => {
      const mockFile = new File(['mock'], 'test.jpg', { type: 'image/jpeg' });

      const originalImage = global.Image;
      global.Image = class {
        onload: any;
        src: any;
        width = 400;
        height = 400;
        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      } as any;

      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          const c = originalCreateElement(tagName) as HTMLCanvasElement;
          c.getContext = jest.fn(() => null);
          return c;
        }
        return originalCreateElement(tagName);
      });

      const options = { maxKB: 120, format: 'image/jpeg' as const };

      await expect(compressToTargetKB(mockFile, options)).rejects.toThrow("Failed to get 2d context");

      global.Image = originalImage;
      jest.restoreAllMocks();
    });
  });

  describe('applySizing error handling', () => {
    it('should return original canvas if outCanvas context is null', async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 1000;

      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          const c = originalCreateElement(tagName) as HTMLCanvasElement;
          // Return null for getContext to simulate failure in outCanvas
          c.getContext = jest.fn(() => null);
          c.toBlob = jest.fn((callback) => {
            const mockBlob = { size: 100 * 1024, type: 'image/jpeg' } as Blob;
            setTimeout(() => callback(mockBlob), 0);
          });
          return c;
        }
        return originalCreateElement(tagName);
      });

      const options = { maxKB: 120, exactWidth: 500, exactHeight: 500, format: 'image/jpeg' as const };

      const result = await compressToTargetKB(canvas, options);

      // Since context was null, it should return original canvas (which is 1000x1000)
      // Note: the test canvas toBlob will be called with the original canvas size
      // Wait, our test canvas was created BEFORE the spy, so its getContext works,
      // but the outCanvas created inside applySizing will fail to get context.
      // So applySizing returns the original canvas.
      expect(result.width).toBe(1000);

      jest.restoreAllMocks();
    });
  });

  describe('applySizing maxHeight', () => {
    it('should handle maxHeight sizing correctly', async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;

      const mockCtx = {
        drawImage: jest.fn(),
        fillRect: jest.fn(),
      };

      const mockOutCanvas = document.createElement('canvas');
      mockOutCanvas.getContext = jest.fn(() => mockCtx as any);
      mockOutCanvas.toBlob = jest.fn((callback) => {
         const mockBlob = { size: 100 * 1024, type: 'image/jpeg' } as Blob;
         setTimeout(() => callback(mockBlob), 0);
      });

      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          const c = originalCreateElement(tagName) as HTMLCanvasElement;
          c.getContext = jest.fn(() => mockCtx as any);
          c.toBlob = mockOutCanvas.toBlob;
          return c;
        }
        return originalCreateElement(tagName);
      });

      const options = { maxKB: 120, maxHeight: 500, format: 'image/jpeg' as const };

      await compressToTargetKB(canvas, options);

      expect(mockCtx.drawImage).toHaveBeenCalledWith(canvas, 0, 0, 400, 500);

      jest.restoreAllMocks();
    });
  });

  describe('getSourceCanvas HTMLImageElement', () => {
    it('should process HTMLImageElement correctly', async () => {
      const mockImg = document.createElement('img');
      mockImg.width = 400;
      mockImg.height = 400;

      const mockCtx = {
        drawImage: jest.fn(),
        fillRect: jest.fn(),
        fillStyle: '',
      };

      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          const c = originalCreateElement(tagName) as HTMLCanvasElement;
          c.getContext = jest.fn(() => mockCtx as any);
          c.toBlob = jest.fn((callback) => {
            const mockBlob = { size: 100 * 1024, type: 'image/jpeg' } as Blob;
            setTimeout(() => callback(mockBlob), 0);
          });
          return c;
        }
        return originalCreateElement(tagName);
      });

      const options = { maxKB: 120, format: 'image/jpeg' as const, fillBackground: '#000000' };

      const result = await compressToTargetKB(mockImg, options);

      expect(result.width).toBe(400);
      expect(result.height).toBe(400);
      expect(mockCtx.fillStyle).toBe('#000000');
      expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 400, 400);
      expect(mockCtx.drawImage).toHaveBeenCalledWith(mockImg, 0, 0);

      jest.restoreAllMocks();
    });
  });


  describe('overlayTextOnImage', () => {
    it('should add text to image bottom strip', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ blob: () => Promise.resolve(new Blob(['mock'])) })) as any;

      const mockCtx = {
        drawImage: jest.fn(),
        fillRect: jest.fn(),
        fillText: jest.fn(),
        fillStyle: '',
        textAlign: '',
        textBaseline: '',
        font: '',
      };

      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          const c = originalCreateElement(tagName) as HTMLCanvasElement;
          c.getContext = jest.fn(() => mockCtx as any);
          c.toBlob = jest.fn((callback) => {
            const mockBlob = { size: 100 * 1024, type: 'image/jpeg' } as Blob;
            setTimeout(() => callback(mockBlob), 0);
          });
          return c;
        }
        return originalCreateElement(tagName);
      });

      const originalImage = global.Image;
      global.Image = class {
        onload: any;
        src: any;
        width = 400;
        height = 400;
        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      } as any;

      const { overlayTextOnImage } = await import('../../lib/image-utils');

      const result = await overlayTextOnImage('test-url', 'John Doe', '2023-10-12');

      expect(result).toBe('blob:test-url');
      expect(mockCtx.fillText).toHaveBeenCalledWith('John Doe', 200, 400 - 80 * 0.65);
      expect(mockCtx.fillText).toHaveBeenCalledWith('2023-10-12', 200, 400 - 80 * 0.25);

      global.Image = originalImage;
      jest.restoreAllMocks();
    });

    it('should return sourceUrl if no text provided', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ blob: () => Promise.resolve(new Blob(['mock'])) })) as any;

      const mockCtx = {
        drawImage: jest.fn(),
      };

      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          const c = originalCreateElement(tagName) as HTMLCanvasElement;
          c.getContext = jest.fn(() => mockCtx as any);
          return c;
        }
        return originalCreateElement(tagName);
      });

      const originalImage = global.Image;
      global.Image = class {
        onload: any;
        src: any;
        width = 400;
        height = 400;
        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      } as any;

      const { overlayTextOnImage } = await import('../../lib/image-utils');

      const result = await overlayTextOnImage('test-url');

      expect(result).toBe('test-url');

      global.Image = originalImage;
      jest.restoreAllMocks();
    });

    it('should handle just nameText or dateText', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ blob: () => Promise.resolve(new Blob(['mock'])) })) as any;

      const mockCtx = {
        drawImage: jest.fn(),
        fillRect: jest.fn(),
        fillText: jest.fn(),
        fillStyle: '',
        textAlign: '',
        textBaseline: '',
        font: '',
      };

      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          const c = originalCreateElement(tagName) as HTMLCanvasElement;
          c.getContext = jest.fn(() => mockCtx as any);
          c.toBlob = jest.fn((callback) => {
            const mockBlob = { size: 100 * 1024, type: 'image/jpeg' } as Blob;
            setTimeout(() => callback(mockBlob), 0);
          });
          return c;
        }
        return originalCreateElement(tagName);
      });

      const originalImage = global.Image;
      global.Image = class {
        onload: any;
        src: any;
        width = 400;
        height = 400;
        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      } as any;

      const { overlayTextOnImage } = await import('../../lib/image-utils');

      // Just nameText
      await overlayTextOnImage('test-url', 'John Doe');
      expect(mockCtx.fillText).toHaveBeenCalledWith('John Doe', 200, 400 - 80 * 0.5);

      mockCtx.fillText.mockClear();

      // Just dateText
      await overlayTextOnImage('test-url', undefined, '2023-10-12');
      expect(mockCtx.fillText).toHaveBeenCalledWith('2023-10-12', 200, 400 - 80 * 0.5);

      global.Image = originalImage;
      jest.restoreAllMocks();
    });
  });

  describe('enhanceSignature', () => {
    it('should apply thresholding and adjust contrast/brightness', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ blob: () => Promise.resolve(new Blob(['mock'])) })) as any;

      // Mock getImageData and putImageData
      const mockImageData = {
        data: new Uint8ClampedArray([150, 150, 150, 255, 50, 50, 50, 255, 200, 200, 200, 255]) // 3 pixels
      };

      const mockCtx = {
        drawImage: jest.fn(),
        fillRect: jest.fn(),
        getImageData: jest.fn(() => mockImageData),
        putImageData: jest.fn(),
        fillStyle: '',
      };

      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          const c = originalCreateElement(tagName) as HTMLCanvasElement;
          c.getContext = jest.fn(() => mockCtx as any);
          c.toBlob = jest.fn((callback) => {
            const mockBlob = { size: 100 * 1024, type: 'image/jpeg' } as Blob;
            setTimeout(() => callback(mockBlob), 0);
          });
          return c;
        }
        return originalCreateElement(tagName);
      });

      const originalImage = global.Image;
      global.Image = class {
        onload: any;
        src: any;
        width = 400;
        height = 400;
        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      } as any;

      const { enhanceSignature } = await import('../../lib/image-utils');

      const result = await enhanceSignature('test-url', 1.5, 10);

      expect(result).toBe('blob:test-url');
      expect(mockCtx.getImageData).toHaveBeenCalled();
      expect(mockCtx.putImageData).toHaveBeenCalled();

      global.Image = originalImage;
      jest.restoreAllMocks();
    });
  });


  describe('enhanceSignature fallback', () => {
    it('should return sourceUrl if toBlob returns null', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ blob: () => Promise.resolve(new Blob(['mock'])) })) as any;

      const mockImageData = {
        data: new Uint8ClampedArray([150, 150, 150, 255])
      };

      const mockCtx = {
        drawImage: jest.fn(),
        fillRect: jest.fn(),
        getImageData: jest.fn(() => mockImageData),
        putImageData: jest.fn(),
        fillStyle: '',
      };

      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          const c = originalCreateElement(tagName) as HTMLCanvasElement;
          c.getContext = jest.fn(() => mockCtx as any);
          c.toBlob = jest.fn((callback) => {
            setTimeout(() => callback(null), 0);
          });
          return c;
        }
        return originalCreateElement(tagName);
      });

      const originalImage = global.Image;
      global.Image = class {
        onload: any;
        src: any;
        width = 400;
        height = 400;
        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      } as any;

      const { enhanceSignature } = await import('../../lib/image-utils');

      const result = await enhanceSignature('test-url', 1.0, 0);

      expect(result).toBe('test-url');

      global.Image = originalImage;
      jest.restoreAllMocks();
    });
  });

  describe('overlayTextOnImage fallback', () => {
    it('should return sourceUrl if toBlob returns null', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ blob: () => Promise.resolve(new Blob(['mock'])) })) as any;

      const mockCtx = {
        drawImage: jest.fn(),
        fillRect: jest.fn(),
        fillText: jest.fn(),
        fillStyle: '',
        textAlign: '',
        textBaseline: '',
        font: '',
      };

      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          const c = originalCreateElement(tagName) as HTMLCanvasElement;
          c.getContext = jest.fn(() => mockCtx as any);
          c.toBlob = jest.fn((callback) => {
            setTimeout(() => callback(null), 0);
          });
          return c;
        }
        return originalCreateElement(tagName);
      });

      const originalImage = global.Image;
      global.Image = class {
        onload: any;
        src: any;
        width = 400;
        height = 400;
        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      } as any;

      const { overlayTextOnImage } = await import('../../lib/image-utils');

      const result = await overlayTextOnImage('test-url', 'John Doe');

      expect(result).toBe('test-url');

      global.Image = originalImage;
      jest.restoreAllMocks();
    });
  });


  describe('enhanceSignature and overlayTextOnImage context failure', () => {
    it('overlayTextOnImage should return sourceUrl if getContext fails', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ blob: () => Promise.resolve(new Blob(['mock'])) })) as any;

      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          const c = originalCreateElement(tagName) as HTMLCanvasElement;
          c.getContext = jest.fn(() => null);
          return c;
        }
        return originalCreateElement(tagName);
      });

      const originalImage = global.Image;
      global.Image = class {
        onload: any;
        src: any;
        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      } as any;

      const { overlayTextOnImage } = await import('../../lib/image-utils');
      const result = await overlayTextOnImage('test-url', 'John Doe');
      expect(result).toBe('test-url');

      global.Image = originalImage;
      jest.restoreAllMocks();
    });

    it('enhanceSignature should return sourceUrl if getContext fails', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ blob: () => Promise.resolve(new Blob(['mock'])) })) as any;

      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          const c = originalCreateElement(tagName) as HTMLCanvasElement;
          c.getContext = jest.fn(() => null);
          return c;
        }
        return originalCreateElement(tagName);
      });

      const originalImage = global.Image;
      global.Image = class {
        onload: any;
        src: any;
        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      } as any;

      const { enhanceSignature } = await import('../../lib/image-utils');
      const result = await enhanceSignature('test-url');
      expect(result).toBe('test-url');

      global.Image = originalImage;
      jest.restoreAllMocks();
    });
  });


  describe('compressToTargetKB undefined options', () => {
    it('should use default format and minKB when not provided', async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;

      canvas.toBlob = jest.fn((callback, type, quality) => {
         const mockBlob = { size: 100 * 1024, type: type } as Blob;
         setTimeout(() => callback(mockBlob), 0);
      });

      // No format, no minKB
      const options = { maxKB: 120 } as any;

      const result = await compressToTargetKB(canvas, options);

      expect(result.format).toBe('image/jpeg');
    });
  });


  describe('compressToTargetKB corner cases', () => {
    it('should return best possible result when maxQ falls back', async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;

      canvas.toBlob = jest.fn((callback, type, quality) => {
         const q = typeof quality === 'number' ? quality : 1;
         // Simulate size jumping drastically from 200 to 50, bypassing the maxKB limit
         // If q > 0.5, size is 200KB, else 150KB
         const size = q > 0.5 ? 200 * 1024 : 150 * 1024;
         const mockBlob = { size, type: type || 'image/jpeg' } as Blob;
         setTimeout(() => callback(mockBlob), 0);
      });

      const options = { minKB: 80, maxKB: 120, format: 'image/jpeg' as const };

      const result = await compressToTargetKB(canvas, options);

      // Since it can never get to 120KB or under, it will fall back to 0.5 quality
      expect(result.quality).toBe(0.5);
    });
  });


  describe('compressToTargetKB fallback if not bestResult', () => {
    it('should fallback to 0.5 quality if bestResult is never set but loop completes', async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;

      canvas.toBlob = jest.fn((callback, type, quality) => {
         const mockBlob = { size: 200 * 1024, type: type || 'image/jpeg' } as Blob; // always over maxKB
         setTimeout(() => callback(mockBlob), 0);
      });

      const options = { minKB: 80, maxKB: 120, format: 'image/jpeg' as const };

      const result = await compressToTargetKB(canvas, options);

      expect(result.quality).toBe(0.5); // Fallback since it never got under maxKB
    });
  });


  describe('enhanceSignature branches', () => {
    it('should handle thresholding correctly when values are < 100', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ blob: () => Promise.resolve(new Blob(['mock'])) })) as any;

      const mockImageData = {
        data: new Uint8ClampedArray([50, 50, 50, 255])
      };

      const mockCtx = {
        drawImage: jest.fn(),
        fillRect: jest.fn(),
        getImageData: jest.fn(() => mockImageData),
        putImageData: jest.fn(),
        fillStyle: '',
      };

      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          const c = originalCreateElement(tagName) as HTMLCanvasElement;
          c.getContext = jest.fn(() => mockCtx as any);
          c.toBlob = jest.fn((callback) => {
            const mockBlob = { size: 100 * 1024, type: 'image/jpeg' } as Blob;
            setTimeout(() => callback(mockBlob), 0);
          });
          return c;
        }
        return originalCreateElement(tagName);
      });

      const originalImage = global.Image;
      global.Image = class {
        onload: any;
        src: any;
        width = 400;
        height = 400;
        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      } as any;

      const { enhanceSignature } = await import('../../lib/image-utils');

      const result = await enhanceSignature('test-url', 1.0, 0);

      expect(result).toBe('blob:test-url');

      global.Image = originalImage;
      jest.restoreAllMocks();
    });
  });


  describe('overlayTextOnImage dateOnly', () => {
    it('should handle just dateText specifically (empty nameText)', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ blob: () => Promise.resolve(new Blob(['mock'])) })) as any;

      const mockCtx = {
        drawImage: jest.fn(),
        fillRect: jest.fn(),
        fillText: jest.fn(),
        fillStyle: '',
        textAlign: '',
        textBaseline: '',
        font: '',
      };

      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          const c = originalCreateElement(tagName) as HTMLCanvasElement;
          c.getContext = jest.fn(() => mockCtx as any);
          c.toBlob = jest.fn((callback) => {
            const mockBlob = { size: 100 * 1024, type: 'image/jpeg' } as Blob;
            setTimeout(() => callback(mockBlob), 0);
          });
          return c;
        }
        return originalCreateElement(tagName);
      });

      const originalImage = global.Image;
      global.Image = class {
        onload: any;
        src: any;
        width = 400;
        height = 400;
        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      } as any;

      const { overlayTextOnImage } = await import('../../lib/image-utils');

      await overlayTextOnImage('test-url', '', '2023-10-12'); // passing empty string as nameText
      expect(mockCtx.fillText).toHaveBeenCalledWith('2023-10-12', 200, 400 - 80 * 0.5);

      global.Image = originalImage;
      jest.restoreAllMocks();
    });
  });
