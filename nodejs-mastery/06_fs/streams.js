/**
 * ============================================================
 * Node.js File System - Streams
 * ============================================================
 *
 * File:
 *
 *     06_fs/streams.js
 *
 * ============================================================
 *
 * Streams allow Node.js to process data piece by piece instead
 * of loading the entire data into memory.
 *
 * Example:
 *
 *     1 GB file
 *
 * Normal read:
 *
 *     1 GB -> RAM
 *
 *
 * Stream:
 *
 *     64 KB -> process
 *     64 KB -> process
 *     64 KB -> process
 *     ...
 *
 *
 * This is extremely important for:
 *
 *     large files
 *     video
 *     audio
 *     HTTP requests
 *     HTTP responses
 *     file uploads
 *     file downloads
 *     compression
 *     encryption
 *     data processing
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. What is a stream?
 *     2. Readable streams
 *     3. Writable streams
 *     4. pipe()
 *     5. events
 *     6. chunks
 *     7. highWaterMark
 *     8. backpressure
 *     9. pipeline()
 *    10. Transform streams
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Import modules
 * ============================================================
 */

const fs = require("node:fs");

const path = require("node:path");

const { pipeline } = require("node:stream");

/*
 * ============================================================
 * 2. What is a stream?
 * ============================================================
 *
 * A stream is a way of processing data incrementally.
 *
 *
 * Instead of:
 *
 *
 *     complete data
 *          ↓
 *        memory
 *          ↓
 *       process
 *
 *
 * we use:
 *
 *
 *     chunk
 *       ↓
 *     process
 *       ↓
 *     chunk
 *       ↓
 *     process
 *       ↓
 *       ...
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. What is a chunk?
 * ============================================================
 *
 * A chunk is a small piece of data.
 *
 *
 * Example:
 *
 *
 *     Large file
 *
 *     ┌─────────────┐
 *     │             │
 *     │   FILE      │
 *     │             │
 *     └─────────────┘
 *
 *          ↓
 *
 *     ┌──────┐
 *     │chunk1│
 *     └──────┘
 *
 *     ┌──────┐
 *     │chunk2│
 *     └──────┘
 *
 *     ┌──────┐
 *     │chunk3│
 *     └──────┘
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Types of streams
 * ============================================================
 *
 *
 * READABLE
 *
 *     Data comes FROM the stream.
 *
 *
 * WRITABLE
 *
 *     Data goes INTO the stream.
 *
 *
 * DUPLEX
 *
 *     Both readable and writable.
 *
 *
 * TRANSFORM
 *
 *     Reads data and transforms it before outputting it.
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Create a large-ish example file
 * ============================================================
 */

const inputFile = path.join(__dirname, "stream-input.txt");

const outputFile = path.join(__dirname, "stream-output.txt");

/*
 * Create repeated content.
 *
 * This is only for demonstration.
 */

const content = "Node.js streams process data chunk by chunk.\n";

fs.writeFileSync(inputFile, content.repeat(10000), "utf8");

/*
 * ============================================================
 * 6. Readable stream
 * ============================================================
 *
 * fs.createReadStream()
 *
 * creates a Readable stream for a file.
 *
 * ============================================================
 */

const readable = fs.createReadStream(inputFile, {
  encoding: "utf8",
});

/*
 * ============================================================
 * 7. readable 'data' event
 * ============================================================
 *
 * The "data" event fires whenever a chunk is available.
 *
 * ============================================================
 */

readable.on("data", (chunk) => {
  console.log("\nReceived chunk:", chunk.length, "characters");
});

/*
 * ============================================================
 * 8. 'end' event
 * ============================================================
 *
 * Fires when there is no more data.
 *
 * ============================================================
 */

readable.on("end", () => {
  console.log("\nReadable stream finished.");
});

/*
 * ============================================================
 * 9. 'error' event
 * ============================================================
 */

readable.on("error", (error) => {
  console.error("Readable stream error:", error.message);
});

/*
 * ============================================================
 * 10. Writable stream
 * ============================================================
 *
 * fs.createWriteStream()
 *
 * creates a Writable stream.
 *
 * ============================================================
 */

const writable = fs.createWriteStream(outputFile, {
  encoding: "utf8",
});

/*
 * ============================================================
 * 11. Write data
 * ============================================================
 */

writable.write("First chunk.\n");

writable.write("Second chunk.\n");

/*
 * ============================================================
 * 12. end()
 * ============================================================
 *
 * Calling end() tells the writable stream that no more data
 * will be written.
 *
 * ============================================================
 */

writable.end("Final chunk.\n");

/*
 * ============================================================
 * 13. Writable events
 * ============================================================
 */

writable.on("finish", () => {
  console.log("\nWritable stream finished.");
});

writable.on("error", (error) => {
  console.error("Writable stream error:", error.message);
});

/*
 * ============================================================
 * 14. pipe()
 * ============================================================
 *
 * One of the most important stream APIs.
 *
 *
 *     readable
 *         ↓
 *       pipe()
 *         ↓
 *     writable
 *
 *
 * Example:
 *
 *
 *     file
 *       ↓
 *     read stream
 *       ↓
 *     pipe
 *       ↓
 *     write stream
 *       ↓
 *     new file
 *
 * ============================================================
 */

/*
 * We use another output file so the example does not conflict
 * with the earlier writable stream.
 */

const pipeOutput = path.join(__dirname, "pipe-output.txt");

const fileReader = fs.createReadStream(inputFile);

const fileWriter = fs.createWriteStream(pipeOutput);

fileReader.pipe(fileWriter);

/*
 * ============================================================
 * 15. Why pipe() is useful
 * ============================================================
 *
 * Without streams:
 *
 *
 *     read entire file
 *          ↓
 *       memory
 *          ↓
 *     write entire file
 *
 *
 * With pipe():
 *
 *
 *     read chunk
 *          ↓
 *       write
 *          ↓
 *     read chunk
 *          ↓
 *       write
 *          ↓
 *        ...
 *
 *
 * This keeps memory usage much lower.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. pipe() completion
 * ============================================================
 */

fileWriter.on("finish", () => {
  console.log("\nFile copied using pipe().");
});

/*
 * ============================================================
 * 17. pipe() error handling
 * ============================================================
 *
 * A basic pipe does not automatically give you the complete
 * error-management behavior you usually want in production.
 *
 * For robust pipelines, prefer:
 *
 *
 *     pipeline()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. pipeline()
 * ============================================================
 *
 * `pipeline()` connects streams and provides centralized
 * completion/error handling.
 *
 * ============================================================
 */

const pipelineOutput = path.join(__dirname, "pipeline-output.txt");

pipeline(
  fs.createReadStream(inputFile),

  fs.createWriteStream(pipelineOutput),

  (error) => {
    if (error) {
      console.error("\nPipeline failed:", error.message);

      return;
    }

    console.log("Pipeline completed successfully.");
  },
);

/*
 * ============================================================
 * 19. highWaterMark
 * ============================================================
 *
 * `highWaterMark` controls the amount of data a stream tries
 * to buffer.
 *
 *
 * Example:
 *
 *
 *     highWaterMark: 1024
 *
 *
 * means approximately 1024 bytes for a binary readable stream.
 *
 *
 * It is a buffering threshold, NOT simply "the exact chunk
 * size" in every stream scenario.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Custom highWaterMark
 * ============================================================
 */

const customReader = fs.createReadStream(inputFile, {
  highWaterMark: 1024,
});

customReader.on("data", (chunk) => {
  console.log("Custom chunk size:", chunk.length, "bytes");
});

customReader.on("end", () => {
  console.log("Custom reader finished.");
});

/*
 * ============================================================
 * 21. Backpressure
 * ============================================================
 *
 * One of the most important stream concepts.
 *
 *
 * Imagine:
 *
 *
 *     READABLE
 *
 *     produces data
 *          ↓
 *          ↓
 *          ↓
 *
 *     WRITABLE
 *
 *     consumes data slowly
 *
 *
 * If the producer is faster than the consumer, data can build
 * up in memory.
 *
 *
 * This problem is called:
 *
 *
 *     BACKPRESSURE
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. writable.write() return value
 * ============================================================
 *
 * write() returns:
 *
 *
 *     true
 *
 * or:
 *
 *     false
 *
 *
 * If false is returned, the writable stream is asking the
 * producer to slow down.
 *
 * ============================================================
 */

const manualOutput = path.join(__dirname, "manual-output.txt");

const manualWriter = fs.createWriteStream(manualOutput, {
  highWaterMark: 1024,
});

let canContinue = true;

for (let index = 0; index < 10000; index++) {
  canContinue = manualWriter.write(`Line ${index}\n`);

  if (!canContinue) {
    console.log("Writable buffer is full.");

    /*
     * Stop producing data until "drain".
     */

    break;
  }
}

/*
 * ============================================================
 * 23. drain event
 * ============================================================
 *
 * When the writable stream is ready to accept more data:
 *
 *
 *     drain
 *
 *
 * is emitted.
 *
 * ============================================================
 */

manualWriter.on("drain", () => {
  console.log("Writable stream drained; more data can be written.");
});

/*
 * ============================================================
 * 24. Important:
 *
 * Don't manually implement backpressure unless you understand
 * the stream lifecycle.
 *
 *
 * `pipe()` and `pipeline()` already manage backpressure between
 * connected streams.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Readable stream modes
 * ============================================================
 *
 * Readable streams can generally operate in:
 *
 *
 *     flowing mode
 *
 * or
 *
 *     paused mode
 *
 *
 * Adding a "data" listener causes the stream to start flowing.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. pause()
 * ============================================================
 */

const pauseReader = fs.createReadStream(inputFile, {
  highWaterMark: 1024,
});

pauseReader.on("data", (chunk) => {
  console.log("Pause example chunk:", chunk.length);

  /*
   * Pause temporarily.
   */

  pauseReader.pause();

  setTimeout(() => {
    pauseReader.resume();
  }, 100);
});

pauseReader.on("end", () => {
  console.log("Pause/resume example completed.");
});

/*
 * ============================================================
 * 27. Transform streams
 * ============================================================
 *
 * A Transform stream:
 *
 *
 *     input
 *       ↓
 *     transform
 *       ↓
 *     output
 *
 *
 * Examples:
 *
 *
 *     compression
 *     encryption
 *     data conversion
 *     parsing
 *     filtering
 *
 * ============================================================
 */

const { Transform } = require("node:stream");

/*
 * ============================================================
 * 28. Create a Transform stream
 * ============================================================
 */

const uppercaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    /*
     * Convert chunk to string.
     */

    const text = chunk.toString();

    /*
     * Transform it.
     */

    const result = text.toUpperCase();

    /*
     * Push transformed data.
     */

    callback(null, result);
  },
});

/*
 * ============================================================
 * 29. Transform file content
 * ============================================================
 */

const transformOutput = path.join(__dirname, "uppercase-output.txt");

pipeline(
  fs.createReadStream(inputFile),

  uppercaseTransform,

  fs.createWriteStream(transformOutput),

  (error) => {
    if (error) {
      console.error("Transform pipeline failed:", error.message);

      return;
    }

    console.log("\nUppercase transformation completed.");
  },
);

/*
 * ============================================================
 * 30. Transform stream mental model
 * ============================================================
 *
 *
 *     input.txt
 *
 *         ↓
 *
 *     Readable
 *
 *         ↓
 *
 *     Transform
 *
 *         ↓
 *
 *     Writable
 *
 *         ↓
 *
 *     output.txt
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Stream events
 * ============================================================
 *
 * Readable commonly uses:
 *
 *
 *     data
 *     end
 *     error
 *     close
 *
 *
 * Writable commonly uses:
 *
 *
 *     drain
 *     finish
 *     error
 *     close
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Buffer and streams
 * ============================================================
 *
 * Stream chunks are commonly represented as:
 *
 *
 *     Buffer
 *
 *
 * when working with binary data.
 *
 *
 * Example:
 *
 *
 *     <Buffer 48 65 6c 6c 6f>
 *
 *
 * This is why understanding Node.js Buffers is important.
 *
 * You will study Buffers separately in:
 *
 *
 *     11_buffers/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Streams and HTTP
 * ============================================================
 *
 * Node.js HTTP requests and responses are streams.
 *
 *
 * HTTP request:
 *
 *
 *     client
 *       ↓
 *     request stream
 *
 *
 * HTTP response:
 *
 *
 *     response stream
 *       ↓
 *     client
 *
 *
 * This means streams are fundamental to backend development.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Example HTTP file download
 * ============================================================
 *
 * Conceptually:
 *
 *
 *     server
 *
 *     fs.createReadStream(file)
 *
 *             ↓
 *
 *         response
 *
 *
 * Example:
 *
 *
 *     const stream =
 *       fs.createReadStream(
 *         filePath
 *       );
 *
 *
 *     stream.pipe(
 *       response
 *     );
 *
 *
 * We will use this pattern later in:
 *
 *
 *     08_http/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Example large file copy
 * ============================================================
 */

function copyLargeFile(source, destination) {
  return new Promise((resolve, reject) => {
    pipeline(
      fs.createReadStream(source),

      fs.createWriteStream(destination),

      (error) => {
        if (error) {
          reject(error);

          return;
        }

        resolve();
      },
    );
  });
}

/*
 * ============================================================
 * 36. Use copyLargeFile()
 * ============================================================
 */

const promiseCopy = path.join(__dirname, "promise-copy.txt");

copyLargeFile(inputFile, promiseCopy)
  .then(() => {
    console.log("\nPromise-based stream copy completed.");
  })
  .catch((error) => {
    console.error("Promise-based copy failed:", error.message);
  });

/*
 * ============================================================
 * 37. Async pipeline
 * ============================================================
 *
 * Node.js also provides a Promise-based pipeline API.
 *
 *
 * Example:
 *
 *
 *     const {
 *       pipeline
 *     } =
 *       require(
 *         "node:stream/promises"
 *       );
 *
 *
 * Then:
 *
 *
 *     await pipeline(
 *       readable,
 *       writable
 *     );
 *
 *
 * This is especially useful with async/await.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Streams vs readFile()
 * ============================================================
 *
 *
 * readFile():
 *
 *
 *     entire file
 *          ↓
 *        memory
 *
 *
 * createReadStream():
 *
 *
 *     chunk
 *       ↓
 *     process
 *       ↓
 *     chunk
 *       ↓
 *     process
 *
 *
 * For small files:
 *
 *
 *     readFile()
 *
 *
 * is usually simpler.
 *
 *
 * For large files:
 *
 *
 *     createReadStream()
 *
 *
 * is often more appropriate.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Common stream use cases
 * ============================================================
 *
 *
 * FILE UPLOAD
 *
 *     request
 *       ↓
 *     stream
 *       ↓
 *     disk
 *
 *
 * FILE DOWNLOAD
 *
 *     disk
 *       ↓
 *     stream
 *       ↓
 *     response
 *
 *
 * COMPRESSION
 *
 *     input
 *       ↓
 *     gzip transform
 *       ↓
 *     output
 *
 *
 * ENCRYPTION
 *
 *     input
 *       ↓
 *     crypto transform
 *       ↓
 *     encrypted output
 *
 *
 * LOG PROCESSING
 *
 *     log file
 *       ↓
 *     stream
 *       ↓
 *     parser
 *       ↓
 *     database
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. Common mistakes
 * ============================================================
 *
 *
 * ❌ Reading a huge file completely into memory unnecessarily.
 *
 *
 *     await fs.readFile(
 *       hugeFile
 *     );
 *
 *
 * Better:
 *
 *
 *     fs.createReadStream(
 *       hugeFile
 *     );
 *
 *
 * ------------------------------------------------------------
 *
 *
 * ❌ Ignoring stream errors.
 *
 *
 * Always handle errors appropriately.
 *
 *
 * ------------------------------------------------------------
 *
 *
 * ❌ Ignoring backpressure when manually writing data.
 *
 *
 * Prefer:
 *
 *
 *     pipe()
 *
 * or:
 *
 *
 *     pipeline()
 *
 * when appropriate.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. pipe() vs pipeline()
 * ============================================================
 *
 *
 * pipe():
 *
 *     readable.pipe(writable)
 *
 *
 * Simple stream connection.
 *
 *
 * pipeline():
 *
 *     pipeline(
 *       readable,
 *       transform,
 *       writable,
 *       callback
 *     )
 *
 *
 * Better centralized error/completion handling.
 *
 *
 * For production data-processing pipelines, `pipeline()` is
 * generally the safer abstraction.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *             STREAM
 *
 *       ┌──────────────┐
 *       │              │
 *       │    CHUNKS    │
 *       │              │
 *       └──────────────┘
 *
 *
 *            ↓
 *
 *       process gradually
 *
 *            ↓
 *
 *       avoid loading all
 *       data into memory
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * Read file as stream:
 *
 *     fs.createReadStream(
 *       file
 *     );
 *
 *
 * Write file as stream:
 *
 *     fs.createWriteStream(
 *       file
 *     );
 *
 *
 * Write:
 *
 *     writable.write(
 *       data
 *     );
 *
 *
 * Finish:
 *
 *     writable.end();
 *
 *
 * Connect:
 *
 *     readable.pipe(
 *       writable
 *     );
 *
 *
 * Robust pipeline:
 *
 *     pipeline(
 *       readable,
 *       writable,
 *       callback
 *     );
 *
 *
 * Transform:
 *
 *     new Transform({
 *
 *       transform(
 *         chunk,
 *         encoding,
 *         callback
 *       ) {
 *
 *         callback(
 *           null,
 *           transformedData
 *         );
 *
 *       }
 *
 *     });
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     Stream
 *         -> process data incrementally
 *
 *     Chunk
 *         -> piece of data
 *
 *     Readable
 *         -> produces data
 *
 *     Writable
 *         -> consumes data
 *
 *     Duplex
 *         -> readable + writable
 *
 *     Transform
 *         -> modifies data
 *
 *     pipe()
 *         -> connect streams
 *
 *     pipeline()
 *         -> safely compose streams
 *
 *     Backpressure
 *         -> prevents a fast producer from overwhelming
 *            a slow consumer
 *
 * ============================================================
 */
