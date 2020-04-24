# binary-ring-buffer

Most of the implementations of ring/circular buffers on NPM utilized
an Array to back them. This uses a Buffer and as such is better suited
to being used for binary data.

## Installation

```bash
npm install @cisl/binary-ring-buffer
```

## Usage

```javascript
const BinaryRingBuffer = require('@cisl/binary-ring-buffer');
const buffer = new BinaryRingBuffer(20);
buffer.write(Buffer.from([0, 1, 2, 3, 4, 5]));
buffer.read(3); // Buffer.from([0, 1, 2])
```

## API

```typescript
class BinaryRingBuffer {
  /**
   * Create a new BinaryRingBuffer
   * @param {number} capacity Capacity of the memory the buffer can hold in bytes
   */
  constructor(capacity: number);

  /**
   * Get the length of the underlying buffer structure.
   * @return {number} Length of the buffer
   */
  get length(): number;

  /**
   * Given a pointer value, increment it, wrap it in the buffer if necessary and
   * return it
   * @param {number} ptr A pointer value in the buffer
   * @return {number} New pointer position
   */
  incrementPtr(ptr: number): number;

  /**
   * Get the string representation of the underlying buffer. Useful for debugging.
   * @return {string} The underlying buffer as a string
   */
  toString(): string;

  /**
   * Reads the first n bytes of the buffer starting at the head. If n goes past
   * the tail, only return the data up to the tail.
   * @param {number} num Number of bytes to read from buffer
   * @return {Buffer} Buffer of the read num bytes
   */
  read(num: number): Buffer;

  /**
   * Writes data to the buffer starting at the tail. It will override old data
   * if it is at capacity.
   * @param {Buffer} data Data to write to the buffer
   */
  write(data: Buffer): void;

  /**
   * Grab specific slice of the circular buffer
   * @param start where to start slice
   * @param end where to end slice
   */
  slice(start: number, end: number): Buffer;
}
```
