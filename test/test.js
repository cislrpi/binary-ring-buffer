const assert = require('assert');
const BinaryRingBuffer = require('./../dist/index.js');

// Test 1 - normal read
describe('BinaryRingBuffer', () => {
  // First set of test cases
  describe('#read() - (Simple test) Buffer of "Buffer.from([0,1,2,3,4,5,6,7,8,9])"', () => {
    const buf = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const rb = new BinaryRingBuffer(10);
    rb.write(buf);

    const test1 = rb.read(3);
    it('read(3): should return a buffer of 00, 01, 02', () => {
      assert(test1.compare(Buffer.from([0, 1, 2])) === 0);
    });

    const test2 = rb.read(7);
    it('read(7): should return the rest of buffer of 03, 04, 05, 06, 07, 08, 09', () => {
      assert(test2.compare(Buffer.from([3, 4, 5, 6, 7, 8, 9])) === 0);
    });

    const test3 = rb.read(2);
    it('read(2): should return an empty buffer because the tail is reached', () => {
      assert(test3.length === 0);
    });
  });

  describe('#write() - Start with buffer of capacity 10', () => {
    const rb2 = new BinaryRingBuffer(10);
    const buf2 = Buffer.from([0,1,2,3]);
    rb2.write(buf2);

    const test4 = rb2.read(5);
    it('write(Buffer.from([0,1,2,3])) --> read(5): should return a buffer of 00, 01, 02, 03 because the tail is reached', function() {
      assert(test4.compare(Buffer.from([0,1,2,3])) === 0);
    });
  });

  describe('#read() and write() calls wrapping around buffer', () => {
    const rb3 = new BinaryRingBuffer(10);

    // Fill buffer except for one byte
    const buf3 = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    rb3.write(buf3);

    // read from buffer and move head forward
    rb3.read(4);

    // write starting at tail (write last byte, override 00): <Buffer 07, 01, 02, 03, 04, 05, 06, 07, 08, 07>
    const buf4 = Buffer.from([7, 7]);
    rb3.write(buf4);

    // write another 2 07 starting at tail: <Buffer 07, 07, 07, 03, 04, 05, 06, 07, 08, 07>
    rb3.write(buf4);

    // write another 2 07 starting at tail: <Buffer 07, 07, 07, 07, 07, 05, 06, 07, 08, 07>
    rb3.write(buf4);

    // write 7 00 bytes satring at tail:    <Buffer 00, 00, 07, 07, 07, 00, 00, 00, 00, 00>
    const buf5 = Buffer.from([0, 0, 0, 0, 0, 0, 0]);
    rb3.write(buf5);

    // read all the bytes starting at the new head
    const wrappedBuffer = rb3.read(20);
    // Several calls to write wrapping around buffer, and read call in between:
    // should result in a buffer of <Buffer 07, 07, 07, 00, 00, 00, 00, 00, 00, 00>
    // because the 07 bytes are the "oldest" bytes that aren't overriden'
    it('several writes with reads in the middle wrapping around buffer', () => {
      assert(wrappedBuffer.compare(Buffer.from([7, 7, 7, 0, 0, 0, 0, 0, 0, 0])) === 0);
    });
  });

  describe('#slice()', () => {
    const rb4 = new BinaryRingBuffer(10);
    rb4.write(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
    it('slice non-wrap', () => {
      const slice = rb4.slice(0,3);
      assert(slice.compare(Buffer.from([0, 1, 2])) === 0);
    });
    it('slice wraps', () => {
      const slice = rb4.slice(6, 3);
      assert(slice.compare(Buffer.from([6, 7, 8, 9, 0, 1, 2])) === 0);
    });
  });
});
