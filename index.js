/*
A node.js implementation of a ring buffer for binary data (using the builtin Buffer)
Not thread safe/asynchronous
*/
class BinaryRingBuffer {
  constructor(capacity) {
    this.capacity = capacity;
    this.buffer = Buffer.alloc(capacity);
    this.buffer.fill(0);
    this.numItems = 0;

    // Points to the index where the next index will be read/removed
    this.head = 0;
    // Points to the index where the next item will be entered
    this.tail = 0;
  }

  get length() {
    return this.buffer.length;
  }

  // returns the next index in the ring
  // handles wrapping
  incrementPtr(ptr) {
    return (ptr + 1) % this.capacity;
  }

  // For debugging
  toString() {
    return this.buffer.toString();
  }

  // Reads the first n bytes of the buffer starting at the head
  // If n goes past the tail, only return data up to the tail
  // O(n) on the given number n
  read(n) {
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

    let readBuffSize = Math.min(n, headTailDist);

    // Allocate less if we hit tail before n 
    let readBuff = Buffer.alloc(readBuffSize);

    // loop until we hit data length
    for (let i = 0; i < n; ++i) {
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

  // Writes the data to the buffer. Will override old data if capacity is hit
  // O(n) on the length of the data
  write(data) {
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
}

module.exports = BinaryRingBuffer;
