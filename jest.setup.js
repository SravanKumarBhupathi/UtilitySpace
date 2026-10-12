// Polyfill File in JSDOM if needed
class MockFile {
  name;
  type;
  size;
  lastModified;
  _buffer;

  constructor(parts, name, options = {}) {
    this.name = name;
    this.type = options.type || '';
    this.size = parts.reduce((acc, part) => acc + (part.byteLength || part.length || 0), 0);
    this.lastModified = options.lastModified || Date.now();
    this._buffer = parts[0];
  }

  async arrayBuffer() {
    return this._buffer;
  }
}

if (typeof File === 'undefined') {
  global.File = MockFile;
} else if (!File.prototype.arrayBuffer) {
  File.prototype.arrayBuffer = function() {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(this);
    });
  };
}
