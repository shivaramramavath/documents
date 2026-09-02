/**
 * ============================================================
 * NODE.JS STREAMS - READABLE
 * ============================================================
 *
 * File:
 *     10_streams/readable.js
 *
 * A Readable stream represents a source from which data can be
 * consumed piece by piece.
 *
 * Examples:
 *
 *     Files
 *     HTTP requests
 *     HTTP responses
 *     TCP sockets
 *     Process stdin
 *     Custom data sources
 *
 * ============================================================
 *
 * Why streams?
 *
 * Without streams:
 *
 *     Entire data
 *          ↓
 *       Memory
 *          ↓
 *       Process
 *
 *
 * With streams:
 *
 *     Chunk → Process
 *     Chunk → Process
 *     Chunk → Process
 *
 *
 * This is important when working with large data.
 *
 * ============================================================
 */

const { Readable } = require("node:stream");

/*
 * ============================================================
 * 1. Create a basic readable stream
 * ============================================================
 */

const readable = Readable.from(["Hello", " ", "Node.js", " ", "Streams"]);

/*
 * ============================================================
 * 2. Read using for await...of
 * ============================================================
 *
 * Readable streams are async iterables.
 *
 * ============================================================
 */

async function readStream() {
  for await (const chunk of readable) {
    console.log("Chunk:", chunk);
  }
}

/*
 * Execute
 */

readStream().catch((error) => {
  console.error("Stream error:", error);
});

/*
 * ============================================================
 * 3. Readable.from() with an array
 * ============================================================
 */

const numbers = Readable.from([10, 20, 30, 40, 50]);

async function readNumbers() {
  for await (const number of numbers) {
    console.log("Number:", number);
  }
}

/*
 * ============================================================
 * 4. Readable.from() with a string
 * ============================================================
 */

const text = Readable.from("Node.js");

async function readText() {
  for await (const chunk of text) {
    console.log("Text chunk:", chunk);
  }
}

/*
 * ============================================================
 * 5. Custom Readable stream
 * ============================================================
 *
 * The _read() method controls when data is pushed.
 *
 * ============================================================
 */

const customReadable = new Readable({
  read() {
    this.push("First chunk\n");

    this.push("Second chunk\n");

    this.push("Third chunk\n");

    /*
     * null means:
     *
     *     No more data.
     */

    this.push(null);
  },
});

/*
 * ============================================================
 * 6. data event
 * ============================================================
 *
 * The "data" event is emitted whenever a chunk is available.
 *
 * ============================================================
 */

const dataStream = Readable.from(["A", "B", "C", "D"]);

dataStream.on("data", (chunk) => {
  console.log("Data:", chunk);
});

/*
 * ============================================================
 * 7. end event
 * ============================================================
 *
 * "end" means there is no more data.
 *
 * ============================================================
 */

const endStream = Readable.from(["Hello", "World"]);

endStream.on("data", (chunk) => {
  console.log("Chunk:", chunk);
});

endStream.on("end", () => {
  console.log("Readable stream ended.");
});

/*
 * ============================================================
 * 8. error event
 * ============================================================
 */

const errorStream = new Readable({
  read() {
    this.push("Data");

    this.destroy(new Error("Something went wrong"));
  },
});

errorStream.on("data", (chunk) => {
  console.log("Received:", chunk.toString());
});

errorStream.on("error", (error) => {
  console.error("Stream error:", error.message);
});

/*
 * ============================================================
 * 9. pause()
 * ============================================================
 */

const pauseStream = Readable.from(["one", "two", "three", "four"]);

pauseStream.on("data", (chunk) => {
  console.log("Received:", chunk);

  pauseStream.pause();

  console.log("Stream paused.");

  setTimeout(() => {
    console.log("Stream resumed.");

    pauseStream.resume();
  }, 1000);
});

/*
 * ============================================================
 * 10. resume()
 * ============================================================
 *
 * resume() switches the stream into flowing mode.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. readable event
 * ============================================================
 *
 * "readable" means data is available to be read.
 *
 * ============================================================
 */

const readableEventStream = Readable.from(["Hello", "Readable", "Event"]);

readableEventStream.on("readable", () => {
  let chunk;

  while ((chunk = readableEventStream.read()) !== null) {
    console.log("Read:", chunk);
  }
});

/*
 * ============================================================
 * 12. read()
 * ============================================================
 *
 * Manually consume data from the internal buffer.
 *
 * ============================================================
 */

const manualStream = Readable.from(["A", "B", "C"]);

console.log("Manual read:", manualStream.read());

/*
 * ============================================================
 * 13. objectMode
 * ============================================================
 *
 * Normally streams deal with Buffers or strings.
 *
 * objectMode allows JavaScript objects.
 *
 * ============================================================
 */

const objectStream = new Readable({
  objectMode: true,

  read() {
    this.push({
      id: 1,

      name: "Shiva",
    });

    this.push({
      id: 2,

      name: "Node.js",
    });

    this.push(null);
  },
});

objectStream.on("data", (object) => {
  console.log("Object:", object);
});

/*
 * ============================================================
 * 14. Async generator + Readable.from()
 * ============================================================
 */

async function* generateData() {
  yield "First";

  await new Promise((resolve) => setTimeout(resolve, 500));

  yield "Second";

  await new Promise((resolve) => setTimeout(resolve, 500));

  yield "Third";
}

const asyncStream = Readable.from(generateData());

async function consumeAsyncStream() {
  for await (const chunk of asyncStream) {
    console.log("Async chunk:", chunk);
  }
}

consumeAsyncStream().catch(console.error);

/*
 * ============================================================
 * 15. Encoding
 * ============================================================
 *
 * setEncoding() converts Buffer chunks into strings.
 * ============================================================
 */

const encodingStream = Readable.from(["Hello ", "Node.js ", "Streams"]);

encodingStream.setEncoding("utf8");

encodingStream.on("data", (chunk) => {
  console.log("String chunk:", chunk);
});

/*
 * ============================================================
 * 16. HighWaterMark
 * ============================================================
 *
 * highWaterMark controls approximately how much data a stream
 * buffers before applying backpressure.
 *
 * It is NOT a strict maximum size of the stream.
 *
 * ============================================================
 */

const bufferedStream = new Readable({
  highWaterMark: 16,

  read() {
    this.push("Some data");

    this.push(null);
  },
});

console.log("High water mark:", bufferedStream.readableHighWaterMark);

/*
 * ============================================================
 * 17. readableLength
 * ============================================================
 *
 * Amount of data currently buffered.
 * ============================================================
 */

const bufferStream = Readable.from("Hello Node.js");

console.log("Readable length:", bufferStream.readableLength);

/*
 * ============================================================
 * 18. readableEnded
 * ============================================================
 */

const endedStream = Readable.from(["Hello"]);

console.log("Before end:", endedStream.readableEnded);

endedStream.resume();

endedStream.on("end", () => {
  console.log("After end:", endedStream.readableEnded);
});

/*
 * ============================================================
 * 19. destroy()
 * ============================================================
 *
 * Destroy a stream.
 * ============================================================
 */

const destroyStream = Readable.from(["One", "Two", "Three"]);

destroyStream.on("close", () => {
  console.log("Stream closed.");
});

destroyStream.destroy();

/*
 * ============================================================
 * 20. Readable stream from an HTTP request
 * ============================================================
 *
 * HTTP request objects are readable streams.
 *
 *
 * Example:
 *
 *     request.on("data", ...)
 *     request.on("end", ...)
 *
 *
 * Therefore:
 *
 *
 * Client
 *   │
 *   ↓
 * HTTP request
 *   │
 *   ↓
 * Readable Stream
 *   │
 *   ├── chunk
 *   ├── chunk
 *   └── chunk
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Readable stream from a file
 * ============================================================
 *
 * fs.createReadStream() creates a Readable stream.
 *
 * Example:
 *
 *     const fs = require("node:fs");
 *
 *     const stream =
 *       fs.createReadStream(
 *         "large-file.txt"
 *       );
 *
 *
 * stream.on("data", (chunk) => {
 *
 *     console.log(chunk);
 *
 * });
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Stream modes
 * ============================================================
 *
 *
 * Paused mode
 *     │
 *     ↓
 * stream.read()
 *
 *
 * Flowing mode
 *     │
 *     ↓
 * "data" event
 *
 *
 * Async iteration
 *     │
 *     ↓
 * for await...of
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Important events
 * ============================================================
 *
 *
 * data
 *     A chunk is available.
 *
 *
 * end
 *     No more data.
 *
 *
 * error
 *     An error occurred.
 *
 *
 * readable
 *     Data can be read.
 *
 *
 * close
 *     Stream/resource has been closed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Stream lifecycle
 * ============================================================
 *
 *
 * Source
 *   │
 *   ↓
 * Readable Stream
 *   │
 *   ↓
 * Internal Buffer
 *   │
 *   ↓
 * Consumer
 *
 *
 * Data:
 *
 *     ┌────────┐
 *     │ Source │
 *     └───┬────┘
 *         │
 *         ↓
 *     ┌──────────┐
 *     │ Readable │
 *     └────┬─────┘
 *          │
 *          ↓
 *       chunk
 *          │
 *          ↓
 *      Consumer
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Why streams matter
 * ============================================================
 *
 * Suppose a file is 10 GB.
 *
 * Without streams:
 *
 *     10 GB file
 *        ↓
 *     Load into memory
 *        ↓
 *     Process
 *
 *
 * This can consume huge amounts of memory.
 *
 *
 * With streams:
 *
 *     10 GB file
 *        ↓
 *     chunk
 *        ↓
 *     process
 *        ↓
 *     chunk
 *        ↓
 *     process
 *
 *
 * Only a portion needs to be buffered at a time.
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
 *       Readable
 *     } = require("node:stream");
 *
 *
 * Create:
 *
 *     new Readable({
 *       read() {}
 *     });
 *
 *
 * From array:
 *
 *     Readable.from([
 *       "A",
 *       "B"
 *     ]);
 *
 *
 * Consume:
 *
 *     stream.on(
 *       "data",
 *       chunk => {}
 *     );
 *
 *
 * End:
 *
 *     stream.on(
 *       "end",
 *       () => {}
 *     );
 *
 *
 * Error:
 *
 *     stream.on(
 *       "error",
 *       error => {}
 *     );
 *
 *
 * Async:
 *
 *     for await (
 *       const chunk
 *       of stream
 *     ) {}
 *
 *
 * Encoding:
 *
 *     stream.setEncoding(
 *       "utf8"
 *     );
 *
 *
 * Pause:
 *
 *     stream.pause();
 *
 *
 * Resume:
 *
 *     stream.resume();
 *
 *
 * Destroy:
 *
 *     stream.destroy();
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 * Readable stream = SOURCE OF DATA
 *
 *     Source
 *       ↓
 *   Readable
 *       ↓
 *     Chunks
 *       ↓
 *   Consumer
 *
 * ============================================================
 */
