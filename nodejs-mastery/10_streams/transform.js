/**
 * ============================================================
 * NODE.JS STREAMS - TRANSFORM
 * ============================================================
 *
 * File:
 *     10_streams/transform.js
 *
 * A Transform stream is a special type of Duplex stream.
 *
 * The important difference:
 *
 *     Data written INTO the stream
 *            ↓
 *       gets transformed
 *            ↓
 *     Data comes OUT
 *
 * ============================================================
 *
 * Architecture:
 *
 *
 *        Input
 *          │
 *          ↓
 *    ┌─────────────┐
 *    │   Writable  │
 *    │      ↓      │
 *    │  Transform  │
 *    │      ↓      │
 *    │   Readable  │
 *    └──────┬──────┘
 *           │
 *           ↓
 *         Output
 *
 * ============================================================
 */

const { Transform } = require("node:stream");

/*
 * ============================================================
 * 1. Basic Transform stream
 * ============================================================
 */

const transform = new Transform({
  transform(chunk, encoding, callback) {
    const input = chunk.toString();

    const output = input.toUpperCase();

    callback(null, output);
  },
});

transform.on("data", (chunk) => {
  console.log("Output:", chunk.toString());
});

transform.write("hello");

transform.write("node");

transform.write("streams");

transform.end();

/*
 * ============================================================
 * 2. transform() method
 * ============================================================
 *
 * The transform() method receives input data.
 *
 *
 *     transform(
 *       chunk,
 *       encoding,
 *       callback
 *     )
 *
 *
 * chunk:
 *
 *     Incoming data.
 *
 *
 * encoding:
 *
 *     Encoding of the chunk.
 *
 *
 * callback:
 *
 *     Signals completion.
 *
 *
 * callback(null, output)
 *
 *     Successful transformation.
 *
 *
 * callback(error)
 *
 *     Transformation failed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Lowercase transformation
 * ============================================================
 */

const lowercase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toLowerCase());
  },
});

lowercase.on("data", (chunk) => {
  console.log("Lowercase:", chunk.toString());
});

lowercase.end("HELLO NODE.JS");

/*
 * ============================================================
 * 4. Add prefix
 * ============================================================
 */

const prefix = new Transform({
  transform(chunk, encoding, callback) {
    const result = `[NODE] ${chunk.toString()}`;

    callback(null, result);
  },
});

prefix.on("data", (chunk) => {
  console.log(chunk.toString());
});

prefix.write("Server started");

prefix.write("Request received");

prefix.end();

/*
 * ============================================================
 * 5. Number transformation
 * ============================================================
 */

const multiply = new Transform({
  objectMode: true,

  transform(number, encoding, callback) {
    callback(null, number * 2);
  },
});

multiply.on("data", (number) => {
  console.log("Number:", number);
});

multiply.write(10);

multiply.write(20);

multiply.write(30);

multiply.end();

/*
 * ============================================================
 * 6. Object transformation
 * ============================================================
 */

const userTransformer = new Transform({
  readableObjectMode: true,

  writableObjectMode: true,

  transform(user, encoding, callback) {
    const result = {
      ...user,

      name: user.name.toUpperCase(),

      active: true,
    };

    callback(null, result);
  },
});

userTransformer.on("data", (user) => {
  console.log("Transformed user:", user);
});

userTransformer.write({
  id: 1,

  name: "Shiva",

  active: false,
});

userTransformer.write({
  id: 2,

  name: "Ram",

  active: false,
});

userTransformer.end();

/*
 * ============================================================
 * 7. Multiple outputs
 * ============================================================
 *
 * A single input chunk can produce multiple output chunks.
 *
 * ============================================================
 */

const splitWords = new Transform({
  transform(chunk, encoding, callback) {
    const words = chunk.toString().split(" ");

    for (const word of words) {
      this.push(word);
    }

    callback();
  },
});

splitWords.on("data", (chunk) => {
  console.log("Word:", chunk.toString());
});

splitWords.end("Node.js streams are powerful");

/*
 * ============================================================
 * 8. No output
 * ============================================================
 *
 * A Transform stream can consume input without producing
 * output.
 * ============================================================
 */

const filter = new Transform({
  transform(chunk, encoding, callback) {
    const value = chunk.toString();

    if (value.includes("Node")) {
      callback(null, value);

      return;
    }

    callback();
  },
});

filter.on("data", (chunk) => {
  console.log("Matched:", chunk.toString());
});

filter.write("Node.js");

filter.write("Python");

filter.write("Node backend");

filter.end();

/*
 * ============================================================
 * 9. Transform with state
 * ============================================================
 */

let total = 0;

const counter = new Transform({
  transform(chunk, encoding, callback) {
    total += Number(chunk.toString());

    callback(null, chunk);
  },

  flush(callback) {
    console.log("Total:", total);

    callback();
  },
});

counter.on("data", (chunk) => {
  console.log("Value:", chunk.toString());
});

counter.write("10");

counter.write("20");

counter.write("30");

counter.end();

/*
 * ============================================================
 * 10. flush()
 * ============================================================
 *
 * _flush() / flush callback is useful when a Transform needs
 * to perform a final operation after all input has been
 * processed.
 *
 *
 * Example:
 *
 *     count records
 *     calculate final result
 *     output remaining buffered data
 *
 * ============================================================
 */

const finalTransform = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk);
  },

  flush(callback) {
    console.log("All input processed.");

    callback();
  },
});

finalTransform.on("data", (chunk) => {
  console.log("Data:", chunk.toString());
});

finalTransform.end("Final example");

/*
 * ============================================================
 * 11. Error handling
 * ============================================================
 */

const errorTransform = new Transform({
  transform(chunk, encoding, callback) {
    if (chunk.toString().includes("error")) {
      callback(new Error("Invalid input"));

      return;
    }

    callback(null, chunk);
  },
});

errorTransform.on("data", (chunk) => {
  console.log("Valid:", chunk.toString());
});

errorTransform.on("error", (error) => {
  console.error("Transform error:", error.message);
});

errorTransform.write("hello");

errorTransform.write("error input");

/*
 * ============================================================
 * 12. Encoding
 * ============================================================
 */

const encodedTransform = new Transform({
  transform(chunk, encoding, callback) {
    console.log("Encoding:", encoding);

    callback(null, chunk);
  },
});

encodedTransform.on("data", (chunk) => {
  console.log("Data:", chunk.toString());
});

encodedTransform.end("Hello");

/*
 * ============================================================
 * 13. setEncoding()
 * ============================================================
 */

const stringTransform = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

stringTransform.setEncoding("utf8");

stringTransform.on("data", (chunk) => {
  console.log("String:", chunk);
});

stringTransform.end("hello");

/*
 * ============================================================
 * 14. Transform as a filter
 * ============================================================
 *
 * Transform streams are useful for:
 *
 *     filtering
 *     mapping
 *     formatting
 *     compression
 *     encryption
 *     parsing
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. JSON line parser
 * ============================================================
 *
 * Example input:
 *
 *     {"id":1}
 *     {"id":2}
 *
 *
 * Each line can be converted into an object.
 * ============================================================
 */

const jsonParser = new Transform({
  readableObjectMode: true,

  transform(chunk, encoding, callback) {
    const lines = chunk.toString().split("\n");

    try {
      for (const line of lines) {
        if (!line.trim()) {
          continue;
        }

        this.push(JSON.parse(line));
      }

      callback();
    } catch (error) {
      callback(error);
    }
  },
});

jsonParser.on("data", (object) => {
  console.log("Parsed:", object);
});

jsonParser.on("error", (error) => {
  console.error("JSON error:", error.message);
});

jsonParser.end(
  `{"id":1}
{"id":2}`,
);

/*
 * ============================================================
 * 16. Compression example
 * ============================================================
 *
 * Node.js compression streams such as gzip are Transform
 * streams.
 *
 *
 *     Input
 *       ↓
 *     gzip
 *       ↓
 *   compressed data
 *
 *
 * Example:
 *
 *     const zlib =
 *       require("node:zlib");
 *
 *
 *     const gzip =
 *       zlib.createGzip();
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Encryption example
 * ============================================================
 *
 * Crypto cipher streams are also Transform-like streams.
 *
 *
 *     Plain text
 *         ↓
 *       Cipher
 *         ↓
 *     Encrypted data
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Transform and pipe()
 * ============================================================
 *
 * Transform streams become especially useful with pipe().
 *
 *
 *     Readable
 *        │
 *        ↓
 *     Transform
 *        │
 *        ↓
 *     Writable
 *
 * ============================================================
 *
 * Example:
 *
 *     readable
 *       .pipe(transform)
 *       .pipe(writable);
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Transform vs Duplex
 * ============================================================
 *
 *
 * Duplex:
 *
 *     Input ──→ Writable
 *                   │
 *                   │ independent
 *                   ↓
 *               Readable ──→ Output
 *
 *
 * Transform:
 *
 *     Input
 *       │
 *       ↓
 *     Transform
 *       │
 *       ↓
 *     Output
 *
 *
 * Transform is therefore a specialized Duplex stream.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Transform vs map/filter
 * ============================================================
 *
 *
 * JavaScript array:
 *
 *     array
 *       ↓
 *     map()
 *       ↓
 *     new array
 *
 *
 * Stream:
 *
 *     chunk
 *       ↓
 *     transform()
 *       ↓
 *     output chunk
 *
 *
 * The major advantage is that streams can process data
 * incrementally instead of requiring the entire dataset in
 * memory.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Large file transformation
 * ============================================================
 *
 *
 * Large file
 *     │
 *     ↓
 * createReadStream()
 *     │
 *     ↓
 * Transform
 *     │
 *     ↓
 * createWriteStream()
 *
 *
 * Data is processed chunk-by-chunk.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Backpressure
 * ============================================================
 *
 * Transform streams participate in backpressure.
 *
 *
 *     Readable
 *         │
 *         ↓
 *     Transform
 *         │
 *         ↓
 *     Writable
 *
 *
 * If Writable becomes slow:
 *
 *     Writable buffer full
 *            ↓
 *     backpressure
 *            ↓
 *     Transform slows
 *            ↓
 *     Readable slows
 *
 *
 * This prevents unlimited buffering.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Important methods
 * ============================================================
 *
 *
 * transform.write(data)
 *
 *     Send data into Transform.
 *
 *
 * transform.end()
 *
 *     Finish input.
 *
 *
 * this.push(data)
 *
 *     Produce output manually.
 *
 *
 * transform.destroy()
 *
 *     Destroy stream.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Important events
 * ============================================================
 *
 *
 * data
 *
 *     Output chunk available.
 *
 *
 * end
 *
 *     No more output.
 *
 *
 * finish
 *
 *     Writable side finished.
 *
 *
 * error
 *
 *     Transformation failed.
 *
 *
 * close
 *
 *     Stream closed.
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
 *       Transform
 *     } = require("node:stream");
 *
 *
 * Create:
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
 * Transform:
 *
 *     callback(null, output);
 *
 *
 * Error:
 *
 *     callback(error);
 *
 *
 * Manual output:
 *
 *     this.push(output);
 *
 *
 * Final processing:
 *
 *     flush(callback) {}
 *
 *
 * Pipe:
 *
 *     readable
 *       .pipe(transform)
 *       .pipe(writable);
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 * Transform = READ + WRITE + TRANSFORM
 *
 *
 *     Input
 *       │
 *       ↓
 *   ┌───────────┐
 *   │ Transform │
 *   └─────┬─────┘
 *         │
 *         ↓
 *       Output
 *
 *
 *     input chunk
 *          ↓
 *      transform()
 *          ↓
 *      output chunk
 *
 * ============================================================
 */
