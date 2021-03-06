/*
A node.js implementation of a ring buffer for binary data using the builtin Buffer class as opposed
to the common use of Array. A ring buffer is a data structure that wraps on itself such that if you
write data past the "end" of the structure, it will start writing to the start of it.
*/
class BinaryRingBuffer {
  capacity: number;
  buffer: Buffer;
  numItems: number;
  head: number;
  tail: number;

  /**
   * Create a new BinaryRingBuffer
   * @param {number} capacity Capacity of the memory the buffer can hold in bytes
   */
  constructor(capacity: number) {
    this.capacity = capacity;
    this.buffer = Buffer.alloc(capacity);
    this.buffer.fill(0);
    this.numItems = 0;

    // Points to the index where the next index will be read/removed
    this.head = 0;
    // Points to the index where the next item will be entered
    this.tail = 0;
  }

  /**
   * Get the length of the underlying buffer structure.
   * @return {number} Length of the buffer
   */
  get length(): number {
    return this.buffer.length;
  }

  /**
   * Given a pointer value, increment it, wrap it in the buffer if necessary and
   * return it
   * @param {number} ptr A pointer value in the buffer
   * @return {number} New pointer position
   */
  incrementPtr(ptr: number): number {
    return (ptr + 1) % this.capacity;
  }

  /**
   * Get the string representation of the underlying buffer. Useful for debugging.
   * @return {string} The underlying buffer as a string
   */
  toString(): string {
    return this.buffer.toString();
  }

  /**
   * Reads the first n bytes of the buffer starting at the head. If n goes past
   * the tail, only return the data up to the tail.
   * @param {number} num Number of bytes to read from buffer
   * @return {Buffer} Buffer of the read num bytes
   */
  read(num: number): Buffer {
    // check for empty buffer
    if (this.numItems === 0) {
      return Buffer.alloc(0);
    }

    // find the distance from head to tail
    let headTailDist = 0;
    if (this.tail < this.head) {
      headTailDist = this.capacity - this.head + this.tail;
    }
    else if (this.tail === this.head) {
      headTailDist = this.capacity;
    }
    else {
      headTailDist = this.tail - this.head;
    }

    const readBuffSize = Math.min(num, headTailDist);

    // Allocate less if we hit tail before n
    const readBuff = Buffer.alloc(readBuffSize);

    // loop until we hit data length
    for (let i = 0; i < num; ++i) {
      readBuff[i] = this.buffer[this.head];
      --this.numItems;
      this.head = this.incrementPtr(this.head);

      // check if we've reached the tail
      if (this.head === this.tail) {
        return readBuff;
      }
    }

    return readBuff;
  }

  /**
   * Writes data to the buffer starting at the tail. It will override old data
   * if it is at capacity.
   * @param {Buffer} data Data to write to the buffer
   */
  write(data: Buffer): void {
    for (let i = 0; i < data.length; ++i) {
      // write the data to the tail
      this.buffer[this.tail] = data[i];

      this.tail = this.incrementPtr(this.tail);

      // if the buffer is at capacity, move foward the head
      if (this.numItems === this.capacity) {
        this.head = this.incrementPtr(this.head);
      }
      else {
        ++this.numItems;
      }
    }
  }

  /**
   * Grab specific slice of the circular buffer
   * @param start where to start slice
   * @param end where to end slice
   */
  slice(start: number, end: number): Buffer {
    start %= this.capacity;
    end %= this.capacity;
    if (end > start) {
      return this.buffer.slice(start, end);
    }
    else {
      const buf1 = this.buffer.slice(start);
      const buf2 = this.buffer.slice(0, end);
      return Buffer.concat([buf1, buf2], buf1.length + buf2.length);
    }
  }
}

export = BinaryRingBuffer;
