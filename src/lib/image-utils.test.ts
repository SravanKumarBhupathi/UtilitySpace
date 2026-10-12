import { loadImageFromBlob } from './image-utils';

describe('loadImageFromBlob', () => {
  let mockCreateObjectURL: jest.Mock;
  let mockRevokeObjectURL: jest.Mock;
  let originalCreateObjectURL: typeof URL.createObjectURL;
  let originalRevokeObjectURL: typeof URL.revokeObjectURL;
  let originalImage: typeof Image;

  beforeEach(() => {
    originalCreateObjectURL = global.URL.createObjectURL;
    originalRevokeObjectURL = global.URL.revokeObjectURL;
    originalImage = global.Image;

    mockCreateObjectURL = jest.fn().mockReturnValue('blob:mock-url');
    mockRevokeObjectURL = jest.fn();

    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
  });

  afterEach(() => {
    global.URL.createObjectURL = originalCreateObjectURL;
    global.URL.revokeObjectURL = originalRevokeObjectURL;
    global.Image = originalImage;
    jest.clearAllMocks();
  });

  it('should load an image successfully from a blob', async () => {
    const blob = new Blob(['mock image data'], { type: 'image/png' });

    // We need to mock the Image constructor and its onload behavior
    const mockImage = {
      onload: null as any,
      onerror: null as any,
      src: '',
    };

    global.Image = jest.fn().mockImplementation(() => mockImage) as any;

    const loadPromise = loadImageFromBlob(blob);

    // Simulate image load event
    setTimeout(() => {
      if (mockImage.onload) {
        mockImage.onload(new Event('load'));
      }
    }, 0);

    const result = await loadPromise;

    expect(mockCreateObjectURL).toHaveBeenCalledWith(blob);
    expect(mockImage.src).toBe('blob:mock-url');
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    expect(result).toBe(mockImage);
  });

  it('should reject when image loading fails', async () => {
    const blob = new Blob(['mock image data'], { type: 'image/png' });

    const mockImage = {
      onload: null as any,
      onerror: null as any,
      src: '',
    };

    global.Image = jest.fn().mockImplementation(() => mockImage) as any;

    const loadPromise = loadImageFromBlob(blob);

    // Simulate image error event
    setTimeout(() => {
      if (mockImage.onerror) {
        mockImage.onerror(new Event('error'));
      }
    }, 0);

    await expect(loadPromise).rejects.toThrow('Failed to load image');

    expect(mockCreateObjectURL).toHaveBeenCalledWith(blob);
    expect(mockImage.src).toBe('blob:mock-url');
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});
