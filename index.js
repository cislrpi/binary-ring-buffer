/*
A node.js implementation of a ring buffer for binary data (using the builtin Buffer)
*/

class BinaryRingBuffer {
  constructor(capacity) {
    this.capacity = capacity;
    this.buffer = Buffer.alloc(capacity);
    this.buffer.fill(0);
    this.head = 0;
    this.tail = 0;
  }

  get length() {
    return this.buffer.length;
  }

  // Reads the first n bytes of the buffer starting at the head
  read(n) {
    // TODO FINISH IMPLEMENTATION
  }

  write(data) {
    if ((data.length + this.tail) > this.capacity) {
      let endDataLength = this.capacity - this.tail;
      let beginDataLength = data.length - endDataLength;

      data.slice(0, endDataLength).copy(this.buffer, this.tail);
      data.slice(endDataLength, data.length).copy(this.buffer, this.head);

      this.head += beginDataLength;
      this.head %= this.capacity;
      this.tail += endDataLength;
      this.tail %= this.capacity;
    }
    else {
      data.copy(this.buffer, this.tail);
      this.tail += data.length;
    }
  }

  slice(start, end) {
    start %= this.capacity;
    end %= this.capacity;
    return this.buffer.slice(start, end);
  }
}

module.exports = BinaryRingBuffer;
