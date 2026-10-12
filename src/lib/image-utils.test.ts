import { loadImageFromBlob } from './image-utils';

describe('loadImageFromBlob', () => {
  let originalImage: typeof Image;
  let originalCreateObjectURL: typeof URL.createObjectURL;
  let originalRevokeObjectURL: typeof URL.revokeObjectURL;

  beforeEach(() => {
    originalImage = global.Image;
    originalCreateObjectURL = global.URL.createObjectURL;
    originalRevokeObjectURL = global.URL.revokeObjectURL;

    global.URL.createObjectURL = jest.fn(() => 'blob:test-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    global.Image = originalImage;
    global.URL.createObjectURL = originalCreateObjectURL;
    global.URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it('should resolve with HTMLImageElement on successful load', async () => {
    let instance: any;
    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      _src = '';

      constructor() {
        instance = this;
      }

      set src(val: string) {
        this._src = val;
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 10);
      }
      get src() {
        return this._src;
      }
    }
    global.Image = MockImage as any;

    const blob = new Blob(['fake image data'], { type: 'image/png' });
    const imgPromise = loadImageFromBlob(blob);

    const img = await imgPromise;
    expect(img).toBe(instance);
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
  });

  it('should reject with an Error on load failure', async () => {
    let instance: any;
    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      _src = '';

      constructor() {
        instance = this;
      }

      set src(val: string) {
        this._src = val;
        setTimeout(() => {
          if (this.onerror) this.onerror();
        }, 10);
      }
      get src() {
        return this._src;
      }
    }
    global.Image = MockImage as any;

    const blob = new Blob(['fake image data'], { type: 'image/png' });
    await expect(loadImageFromBlob(blob)).rejects.toThrow('Failed to load image');

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
  });
});
