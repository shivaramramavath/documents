/**
 * ============================================================
 * NODE.JS STREAMS - WRITABLE
 * ============================================================
 *
 * File:
 *     10_streams/writable.js
 *
 * A Writable stream represents a destination to which data
 * can be written.
 *
 * Examples:
 *
 *     Files
 *     HTTP responses
 *     TCP sockets
 *     Process stdout
 *     Custom destinations
 *
 * ============================================================
 *
 * Readable:
 *
 *     Source of data
 *
 * Writable:
 *
 *     Destination for data
 *
 *
 *     Readable
 *         │
 *         │ chunks
 *         ↓
 *     Writable
 *
 * ============================================================
 */

const { Writable } = require("node:stream");

/*
 * ============================================================
 * 1. Basic Writable stream
 * ============================================================
 */

const writable = new Writable({
  write(chunk, encoding, callback) {
    console.log("Received:", chunk.toString());

    callback();
  },
});

/*
 * ============================================================
 * 2. write()
 * ============================================================
 */

writable.write("Hello");

writable.write("Node.js");

writable.write("Streams");

/*
 * ============================================================
 * 3. end()
 * ============================================================
 *
 * end() tells the Writable stream that no more data will be
 * written.
 *
 * ============================================================
 */

writable.end("Final chunk");

/*
 * ============================================================
 * 4. finish event
 * ============================================================
 *
 * "finish" is emitted after end() has been called and all
 * written data has been processed.
 * ============================================================
 */

const finishStream = new Writable({
  write(chunk, encoding, callback) {
    console.log("Writing:", chunk.toString());

    callback();
  },
});

finishStream.on("finish", () => {
  console.log("Writable stream finished.");
});

finishStream.write("First");

finishStream.write("Second");

finishStream.end();

/*
 * ============================================================
 * 5. close event
 * ============================================================
 */

const closeStream = new Writable({
  write(chunk, encoding, callback) {
    callback();
  },
});

closeStream.on("close", () => {
  console.log("Writable stream closed.");
});

closeStream.end();

/*
 * ============================================================
 * 6. error event
 * ============================================================
 */

const errorStream = new Writable({
  write(chunk, encoding, callback) {
    callback(new Error("Write failed"));
  },
});

errorStream.on("error", (error) => {
  console.error("Writable error:", error.message);
});

errorStream.write("Test");

/*
 * ============================================================
 * 7. callback()
 * ============================================================
 *
 * The callback tells Node.js that the current write operation
 * has completed.
 *
 *
 * Success:
 *
 *     callback();
 *
 *
 * Failure:
 *
 *     callback(error);
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Writing Buffers
 * ============================================================
 */

const bufferStream = new Writable({
  write(chunk, encoding, callback) {
    console.log("Buffer:", chunk);

    console.log("Is Buffer:", Buffer.isBuffer(chunk));

    callback();
  },
});

bufferStream.write(Buffer.from("Binary data"));

bufferStream.end();

/*
 * ============================================================
 * 9. objectMode
 * ============================================================
 *
 * Normally Writable streams accept strings and Buffers.
 *
 * objectMode allows arbitrary JavaScript values.
 *
 * ============================================================
 */

const objectStream = new Writable({
  objectMode: true,

  write(object, encoding, callback) {
    console.log("Object:", object);

    callback();
  },
});

objectStream.write({
  id: 1,

  name: "Shiva",
});

objectStream.write({
  id: 2,

  name: "Node.js",
});

objectStream.end();

/*
 * ============================================================
 * 10. Writing multiple values
 * ============================================================
 */

const messageStream = new Writable({
  write(chunk, encoding, callback) {
    console.log("Message:", chunk.toString());

    callback();
  },
});

["One", "Two", "Three", "Four"].forEach((message) => {
  messageStream.write(message);
});

messageStream.end();

/*
 * ============================================================
 * 11. writable.write() return value
 * ============================================================
 *
 * write() returns:
 *
 *     true
 *     false
 *
 *
 * true:
 *
 *     Continue writing.
 *
 *
 * false:
 *
 *     Internal buffer is full.
 *     Wait for "drain".
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Backpressure
 * ============================================================
 *
 * Backpressure occurs when the producer generates data faster
 * than the consumer can process it.
 *
 *
 * Producer
 *     │
 *     │ fast
 *     ↓
 * Writable
 *     │
 *     │ slow
 *     ↓
 * Destination
 *
 *
 * If the Writable buffer becomes full:
 *
 *
 * write() → false
 *
 *
 * The producer should stop writing temporarily.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. drain event
 * ============================================================
 *
 * Once the internal buffer has been sufficiently emptied,
 * "drain" is emitted.
 *
 * ============================================================
 */

const backpressureStream = new Writable({
  highWaterMark: 16,

  write(chunk, encoding, callback) {
    setTimeout(callback, 100);
  },
});

let canContinue = true;

for (let index = 0; index < 100; index += 1) {
  canContinue = backpressureStream.write(`Chunk ${index}\n`);

  if (!canContinue) {
    console.log("Buffer full. Waiting for drain...");

    break;
  }
}

backpressureStream.on("drain", () => {
  console.log("Drain emitted. Continue writing.");

  /*
   * Continue writing here.
   */
});

backpressureStream.end();

/*
 * ============================================================
 * 14. Correct backpressure pattern
 * ============================================================
 */

function writeLargeData(stream, data) {
  let index = 0;

  function write() {
    while (index < data.length) {
      const canContinue = stream.write(data[index]);

      index += 1;

      if (!canContinue) {
        stream.once("drain", write);

        return;
      }
    }

    stream.end();
  }

  write();
}

/*
 * ============================================================
 * 15. Test backpressure helper
 * ============================================================
 */

const slowStream = new Writable({
  highWaterMark: 32,

  write(chunk, encoding, callback) {
    setTimeout(callback, 10);
  },
});

const data = Array.from(
  {
    length: 100,
  },
  (_, index) => `Data ${index}\n`,
);

slowStream.on("finish", () => {
  console.log("Large data write completed.");
});

writeLargeData(slowStream, data);

/*
 * ============================================================
 * 16. highWaterMark
 * ============================================================
 *
 * highWaterMark controls the threshold used for buffering.
 *
 * It does NOT mean:
 *
 *     "The stream can never contain more than this amount."
 *
 *
 * When the buffered data reaches the threshold,
 * write() may return false.
 *
 * ============================================================
 */

const configuredStream = new Writable({
  highWaterMark: 1024,

  write(chunk, encoding, callback) {
    callback();
  },
});

console.log("High water mark:", configuredStream.writableHighWaterMark);

/*
 * ============================================================
 * 17. writableLength
 * ============================================================
 *
 * Amount of data currently buffered for writing.
 * ============================================================
 */

console.log("Writable length:", configuredStream.writableLength);

/*
 * ============================================================
 * 18. writableNeedDrain
 * ============================================================
 *
 * Indicates whether the stream is waiting for drain.
 * ============================================================
 */

console.log("Need drain:", configuredStream.writableNeedDrain);

/*
 * ============================================================
 * 19. writableEnded
 * ============================================================
 */

const endedWritable = new Writable({
  write(chunk, encoding, callback) {
    callback();
  },
});

console.log("Before end:", endedWritable.writableEnded);

endedWritable.end();

console.log("After end:", endedWritable.writableEnded);

/*
 * ============================================================
 * 20. writableFinished
 * ============================================================
 */

const finishedWritable = new Writable({
  write(chunk, encoding, callback) {
    callback();
  },
});

finishedWritable.on("finish", () => {
  console.log("Finished:", finishedWritable.writableFinished);
});

finishedWritable.end();

/*
 * ============================================================
 * 21. destroy()
 * ============================================================
 */

const destroyStream = new Writable({
  write(chunk, encoding, callback) {
    callback();
  },
});

destroyStream.on("close", () => {
  console.log("Writable destroyed/closed.");
});

destroyStream.destroy();

/*
 * ============================================================
 * 22. Custom destination
 * ============================================================
 *
 * A Writable stream can represent any destination.
 *
 * Example:
 *
 *     Database
 *     File
 *     Network
 *     Console
 *     Message queue
 *
 * ============================================================
 */

const databaseLikeStream = new Writable({
  objectMode: true,

  write(user, encoding, callback) {
    console.log("Saving user:", user);

    /*
     * Imagine database operation here.
     */

    setTimeout(() => {
      console.log("User saved:", user.id);

      callback();
    }, 100);
  },
});

databaseLikeStream.write({
  id: 1,

  name: "Shiva",
});

databaseLikeStream.write({
  id: 2,

  name: "Ram",
});

databaseLikeStream.end();

/*
 * ============================================================
 * 23. Writable stream lifecycle
 * ============================================================
 *
 *
 * write()
 *   │
 *   ↓
 * internal buffer
 *   │
 *   ↓
 * _write()
 *   │
 *   ↓
 * callback()
 *   │
 *   ↓
 * finish
 *   │
 *   ↓
 * close
 *
 *
 * If buffer becomes full:
 *
 *
 * write()
 *   ↓
 * false
 *   ↓
 * stop writing
 *   ↓
 * drain
 *   ↓
 * continue writing
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Writable vs Readable
 * ============================================================
 *
 *
 * Readable:
 *
 *     Data comes OUT.
 *
 *
 * Writable:
 *
 *     Data goes IN.
 *
 *
 *
 * Readable:
 *
 *     Source
 *       ↓
 *     chunk
 *
 *
 * Writable:
 *
 *     chunk
 *       ↓
 *   Destination
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Real Node.js examples
 * ============================================================
 *
 *
 * HTTP response:
 *
 *     response.write(...)
 *     response.end(...)
 *
 *
 * File:
 *
 *     fs.createWriteStream(...)
 *
 *
 * stdout:
 *
 *     process.stdout.write(...)
 *
 *
 * These are Writable streams.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Important methods
 * ============================================================
 *
 *
 * write(chunk)
 *
 *     Write data.
 *
 *
 * end(chunk)
 *
 *     Finish writing.
 *
 *
 * cork()
 *
 *     Temporarily buffer writes.
 *
 *
 * uncork()
 *
 *     Flush buffered writes.
 *
 *
 * destroy()
 *
 *     Destroy the stream.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. cork()
 * ============================================================
 *
 * cork() buffers writes temporarily.
 *
 * ============================================================
 */

const corkStream = new Writable({
  write(chunk, encoding, callback) {
    console.log("Writing:", chunk.toString());

    callback();
  },
});

corkStream.cork();

corkStream.write("A");

corkStream.write("B");

corkStream.write("C");

console.log("Writes temporarily buffered.");

corkStream.uncork();

corkStream.end();

/*
 * ============================================================
 * 28. Important events
 * ============================================================
 *
 *
 * finish
 *
 *     All data has been flushed after end().
 *
 *
 * drain
 *
 *     Buffer has drained after write() returned false.
 *
 *
 * error
 *
 *     Write operation failed.
 *
 *
 * close
 *
 *     Stream has been closed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 * Import:
 *
 *     const {
 *       Writable
 *     } = require("node:stream");
 *
 *
 * Create:
 *
 *     new Writable({
 *
 *       write(
 *         chunk,
 *         encoding,
 *         callback
 *       ) {
 *
 *         callback();
 *
 *       }
 *
 *     });
 *
 *
 * Write:
 *
 *     stream.write("Hello");
 *
 *
 * Finish:
 *
 *     stream.end();
 *
 *
 * Finish event:
 *
 *     stream.on(
 *       "finish",
 *       () => {}
 *     );
 *
 *
 * Backpressure:
 *
 *     const ok =
 *       stream.write(data);
 *
 *
 *     if (!ok) {
 *
 *       stream.once(
 *         "drain",
 *         writeMore
 *       );
 *
 *     }
 *
 *
 * High water mark:
 *
 *     highWaterMark
 *
 *
 * Buffered amount:
 *
 *     stream.writableLength
 *
 *
 * Need drain:
 *
 *     stream.writableNeedDrain
 *
 *
 * Temporarily buffer:
 *
 *     stream.cork();
 *
 *
 * Flush:
 *
 *     stream.uncork();
 *
 *
 * Destroy:
 *
 *     stream.destroy();
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 * Writable stream = DESTINATION OF DATA
 *
 *     Producer
 *         │
 *         ↓
 *     writable.write()
 *         │
 *         ↓
 *     Internal Buffer
 *         │
 *         ↓
 *     _write()
 *         │
 *         ↓
 *     Destination
 *
 *
 * When buffer is full:
 *
 *     write() → false
 *                  ↓
 *                drain
 *                  ↓
 *              write again
 *
 * ============================================================
 */
