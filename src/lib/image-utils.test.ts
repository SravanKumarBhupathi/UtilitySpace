import { overlayTextOnImage } from './image-utils';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    blob: () => Promise.resolve(new Blob(['fake-image-data'], { type: 'image/jpeg' })),
  })
) as jest.Mock;

// Mock URL methods
global.URL.createObjectURL = jest.fn(() => 'blob:fake-url');
global.URL.revokeObjectURL = jest.fn();

// Mock Image so that it acts like a real HTMLImageElement for canvas
const originalImage = global.Image;
global.Image = class extends originalImage {
  constructor() {
    super();
    // In JSDOM this doesn't automatically trigger onload when src is set
    // so we need to manually intercept it
    setTimeout(() => {
      if (this.onload) this.onload(new Event('load'));
    }, 0);
  }
} as any;

// Helper to define properties on the class prototype without type issues
Object.defineProperty(global.Image.prototype, 'width', { get: () => 100 });
Object.defineProperty(global.Image.prototype, 'height', { get: () => 100 });

describe('overlayTextOnImage', () => {
  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    jest.clearAllMocks();
    originalCreateElement = document.createElement.bind(document);
  });

  afterAll(() => {
    global.Image = originalImage;
  });

  it('should return the original URL if no text is provided', async () => {
    const sourceUrl = 'https://example.com/image.jpg';
    const result = await overlayTextOnImage(sourceUrl);

    expect(result).toBe(sourceUrl);
  });

  it('should overlay both name and date texts', async () => {
    const sourceUrl = 'https://example.com/image.jpg';
    const result = await overlayTextOnImage(sourceUrl, 'John Doe', '2023-10-25');

    expect(result).toBe('blob:fake-url');
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it('should overlay only name text', async () => {
    const sourceUrl = 'https://example.com/image.jpg';
    const result = await overlayTextOnImage(sourceUrl, 'John Doe');

    expect(result).toBe('blob:fake-url');
  });

  it('should overlay only date text', async () => {
    const sourceUrl = 'https://example.com/image.jpg';
    const result = await overlayTextOnImage(sourceUrl, undefined, '2023-10-25');

    expect(result).toBe('blob:fake-url');
  });

  it('should return the original URL if canvas context is null', async () => {
    // Mock createElement to return a canvas with null context
    document.createElement = jest.fn().mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        const canvas = originalCreateElement('canvas');
        canvas.getContext = jest.fn().mockReturnValue(null);
        return canvas;
      }
      return originalCreateElement(tagName);
    });

    const sourceUrl = 'https://example.com/image.jpg';
    const result = await overlayTextOnImage(sourceUrl, 'John Doe');

    expect(result).toBe(sourceUrl);

    // Restore
    document.createElement = originalCreateElement;
  });
});
