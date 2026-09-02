/**
 * ============================================================
 * NODE.JS STREAMS - PIPELINE
 * ============================================================
 *
 * File:
 *     10_streams/pipeline.js
 *
 * pipeline() is used to connect multiple streams together
 * while handling:
 *
 *     - Data flow
 *     - Backpressure
 *     - Errors
 *     - Cleanup
 *     - Completion
 *
 * ============================================================
 *
 * Basic stream chain:
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
 *
 * Using pipe():
 *
 *     readable
 *       .pipe(transform)
 *       .pipe(writable);
 *
 *
 * Using pipeline():
 *
 *     pipeline(
 *       readable,
 *       transform,
 *       writable,
 *       callback
 *     );
 *
 * ============================================================
 */

const { Readable, Writable, Transform, pipeline } = require("node:stream");

/*
 * ============================================================
 * 1. Basic pipeline
 * ============================================================
 */

const readable = Readable.from(["hello\n", "node\n", "streams\n"]);

const uppercase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

const writable = new Writable({
  write(chunk, encoding, callback) {
    console.log("Output:", chunk.toString());

    callback();
  },
});

pipeline(readable, uppercase, writable, (error) => {
  if (error) {
    console.error("Pipeline failed:", error.message);

    return;
  }

  console.log("Pipeline completed.");
});

/*
 * ============================================================
 * 2. pipeline() structure
 * ============================================================
 *
 *
 * pipeline(
 *
 *     source,
 *
 *     transform1,
 *
 *     transform2,
 *
 *     destination,
 *
 *     callback
 *
 * );
 *
 *
 * The streams execute in sequence:
 *
 *
 * Source
 *   ↓
 * Transform 1
 *   ↓
 * Transform 2
 *   ↓
 * Destination
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Multiple transforms
 * ============================================================
 */

const source = Readable.from(["hello ", "node ", "world"]);

const upper = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

const addPrefix = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, `[NODE] ${chunk.toString()}`);
  },
});

const output = new Writable({
  write(chunk, encoding, callback) {
    console.log(chunk.toString());

    callback();
  },
});

pipeline(source, upper, addPrefix, output, (error) => {
  if (error) {
    console.error("Error:", error.message);

    return;
  }

  console.log("Multiple-transform pipeline complete.");
});

/*
 * ============================================================
 * 4. pipeline() error handling
 * ============================================================
 *
 * One of the biggest advantages of pipeline() is centralized
 * error handling.
 *
 * ============================================================
 */

const errorSource = Readable.from(["good", "good", "bad", "good"]);

const errorTransform = new Transform({
  transform(chunk, encoding, callback) {
    const value = chunk.toString();

    if (value === "bad") {
      callback(new Error("Bad data encountered"));

      return;
    }

    callback(null, value.toUpperCase());
  },
});

const errorDestination = new Writable({
  write(chunk, encoding, callback) {
    console.log("Writing:", chunk.toString());

    callback();
  },
});

pipeline(errorSource, errorTransform, errorDestination, (error) => {
  if (error) {
    console.error("Pipeline error:", error.message);

    return;
  }

  console.log("Success");
});

/*
 * ============================================================
 * 5. pipeline() automatically destroys streams on error
 * ============================================================
 *
 * Consider:
 *
 *
 * Readable
 *     ↓
 * Transform
 *     ↓
 * Transform
 *     ↓
 * Writable
 *
 *
 * If a stream fails:
 *
 *     Transform ERROR
 *            ↓
 *       pipeline()
 *            ↓
 *     cleanup connected streams
 *
 *
 * This makes pipeline() safer than manually chaining pipe().
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. pipeline() with Promises
 * ============================================================
 *
 * Node.js also provides a Promise-based pipeline API.
 *
 * ============================================================
 */

const { pipeline: pipelinePromise } = require("node:stream/promises");

async function promisePipeline() {
  const input = Readable.from(["one\n", "two\n", "three\n"]);

  const transform = new Transform({
    transform(chunk, encoding, callback) {
      callback(null, chunk.toString().toUpperCase());
    },
  });

  const output = new Writable({
    write(chunk, encoding, callback) {
      console.log("Promise output:", chunk.toString());

      callback();
    },
  });

  await pipelinePromise(input, transform, output);

  console.log("Promise pipeline completed.");
}

promisePipeline().catch((error) => {
  console.error("Promise pipeline failed:", error.message);
});

/*
 * ============================================================
 * 7. Async generator in pipeline
 * ============================================================
 *
 * pipeline() can work with async generators.
 * ============================================================
 */

async function* generateNumbers() {
  yield "1";

  yield "2";

  yield "3";

  yield "4";

  yield "5";
}

async function* multiplyByTwo(source) {
  for await (const chunk of source) {
    const number = Number(chunk);

    yield String(number * 2);
  }
}

async function generatorPipeline() {
  const output = new Writable({
    write(chunk, encoding, callback) {
      console.log("Generator output:", chunk.toString());

      callback();
    },
  });

  await pipelinePromise(generateNumbers(), multiplyByTwo, output);

  console.log("Generator pipeline complete.");
}

generatorPipeline().catch(console.error);

/*
 * ============================================================
 * 8. File copy with pipeline
 * ============================================================
 *
 * One of the most useful real-world patterns:
 *
 *
 *     File
 *      ↓
 * createReadStream()
 *      ↓
 * pipeline()
 *      ↓
 * createWriteStream()
 *      ↓
 * New File
 *
 * ============================================================
 */

const fs = require("node:fs");

function copyFile(sourcePath, destinationPath) {
  return new Promise((resolve, reject) => {
    pipeline(
      fs.createReadStream(sourcePath),

      fs.createWriteStream(destinationPath),

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
 * Example:
 *
 * copyFile(
 *   "./input.txt",
 *   "./output.txt",
 * )
 *   .then(() => {
 *
 *     console.log(
 *       "File copied."
 *     );
 *
 *   })
 *   .catch(console.error);
 *
 */

/*
 * ============================================================
 * 9. File transformation pipeline
 * ============================================================
 *
 *
 * input.txt
 *     ↓
 * Readable
 *     ↓
 * Uppercase Transform
 *     ↓
 * Writable
 *     ↓
 * output.txt
 *
 * ============================================================
 */

function uppercaseFile(sourcePath, destinationPath) {
  const readStream = fs.createReadStream(sourcePath);

  const uppercaseTransform = new Transform({
    transform(chunk, encoding, callback) {
      callback(null, chunk.toString().toUpperCase());
    },
  });

  const writeStream = fs.createWriteStream(destinationPath);

  pipeline(readStream, uppercaseTransform, writeStream, (error) => {
    if (error) {
      console.error("File transformation failed:", error.message);

      return;
    }

    console.log("File transformation completed.");
  });
}

/*
 * Example:
 *
 * uppercaseFile(
 *   "./input.txt",
 *   "./output.txt",
 * );
 *
 */

/*
 * ============================================================
 * 10. Compression pipeline
 * ============================================================
 *
 * pipeline() is commonly used with zlib.
 *
 *
 *     File
 *       ↓
 *   ReadStream
 *       ↓
 *      gzip
 *       ↓
 *   WriteStream
 *
 * ============================================================
 */

const zlib = require("node:zlib");

function gzipFile(sourcePath, destinationPath) {
  pipeline(
    fs.createReadStream(sourcePath),

    zlib.createGzip(),

    fs.createWriteStream(destinationPath),

    (error) => {
      if (error) {
        console.error("Compression failed:", error.message);

        return;
      }

      console.log("Compression completed.");
    },
  );
}

/*
 * Example:
 *
 * gzipFile(
 *   "./large.txt",
 *   "./large.txt.gz",
 * );
 *
 */

/*
 * ============================================================
 * 11. Decompression pipeline
 * ============================================================
 */

function gunzipFile(sourcePath, destinationPath) {
  pipeline(
    fs.createReadStream(sourcePath),

    zlib.createGunzip(),

    fs.createWriteStream(destinationPath),

    (error) => {
      if (error) {
        console.error("Decompression failed:", error.message);

        return;
      }

      console.log("Decompression completed.");
    },
  );
}

/*
 * Example:
 *
 * gunzipFile(
 *   "./large.txt.gz",
 *   "./restored.txt",
 * );
 *
 */

/*
 * ============================================================
 * 12. Backpressure
 * ============================================================
 *
 * pipeline() preserves backpressure across the complete
 * pipeline.
 *
 *
 *     Readable
 *         │
 *         ↓
 *     Transform
 *         │
 *         ↓
 *     Writable
 *         │
 *         ↓
 *     Slow destination
 *
 *
 * If the destination becomes slow:
 *
 *     Writable buffer
 *          ↓
 *     backpressure
 *          ↓
 *     Transform slows
 *          ↓
 *     Readable slows
 *
 *
 * This prevents uncontrolled memory growth.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. AbortController
 * ============================================================
 *
 * A pipeline can be cancelled using AbortController.
 *
 * ============================================================
 */

async function cancellablePipeline() {
  const controller = new AbortController();

  const input = Readable.from(["A\n", "B\n", "C\n", "D\n", "E\n"]);

  const transform = new Transform({
    transform(chunk, encoding, callback) {
      setTimeout(() => {
        callback(null, chunk.toString().toUpperCase());
      }, 500);
    },
  });

  const output = new Writable({
    write(chunk, encoding, callback) {
      console.log("Output:", chunk.toString());

      callback();
    },
  });

  setTimeout(() => {
    console.log("Aborting pipeline...");

    controller.abort();
  }, 1000);

  try {
    await pipelinePromise(input, transform, output, {
      signal: controller.signal,
    });
  } catch (error) {
    console.error("Pipeline stopped:", error.name);
  }
}

cancellablePipeline().catch(console.error);

/*
 * ============================================================
 * 14. pipeline() with HTTP
 * ============================================================
 *
 * HTTP requests are Readable streams.
 *
 * HTTP responses are Writable streams.
 *
 *
 * Example:
 *
 *
 *     HTTP Request
 *          ↓
 *      Transform
 *          ↓
 *     HTTP Response
 *
 *
 * This can be useful for streaming data through an API.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. pipeline() vs pipe()
 * ============================================================
 *
 *
 * pipe():
 *
 *     readable
 *       .pipe(transform)
 *       .pipe(writable);
 *
 *
 * Simple and useful.
 *
 *
 * pipeline():
 *
 *     pipeline(
 *       readable,
 *       transform,
 *       writable,
 *       callback
 *     );
 *
 *
 * Better suited for production pipelines because it provides
 * centralized completion/error handling and cleanup.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. pipeline() with many transforms
 * ============================================================
 *
 *
 *     File
 *      │
 *      ↓
 *   Readable
 *      │
 *      ↓
 *  Parser
 *      │
 *      ↓
 *  Validator
 *      │
 *      ↓
 *  Transformer
 *      │
 *      ↓
 *  Compressor
 *      │
 *      ↓
 *   Writable
 *
 *
 * pipeline() can manage the complete chain.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Production pattern
 * ============================================================
 */

async function productionPipeline(sourcePath, destinationPath) {
  const input = fs.createReadStream(sourcePath);

  const transform = new Transform({
    transform(chunk, encoding, callback) {
      try {
        const output = chunk.toString().trim().toUpperCase();

        callback(null, output);
      } catch (error) {
        callback(error);
      }
    },
  });

  const output = fs.createWriteStream(destinationPath);

  await pipelinePromise(input, transform, output);
}

/*
 * Example:
 *
 * productionPipeline(
 *   "./input.txt",
 *   "./output.txt",
 * )
 *   .then(() => {
 *
 *     console.log(
 *       "Done"
 *     );
 *
 *   })
 *   .catch((error) => {
 *
 *     console.error(
 *       error
 *     );
 *
 *   });
 *
 */

/*
 * ============================================================
 * 18. Pipeline architecture
 * ============================================================
 *
 *
 *             pipeline()
 *
 *     ┌───────────────┐
 *     │   Readable    │
 *     └───────┬───────┘
 *             │
 *             ↓
 *     ┌───────────────┐
 *     │  Transform 1  │
 *     └───────┬───────┘
 *             │
 *             ↓
 *     ┌───────────────┐
 *     │  Transform 2  │
 *     └───────┬───────┘
 *             │
 *             ↓
 *     ┌───────────────┐
 *     │   Writable    │
 *     └───────────────┘
 *
 *
 * Error anywhere:
 *
 *     ↓
 *
 * pipeline handles cleanup
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Important APIs
 * ============================================================
 *
 *
 * Callback API:
 *
 *     const {
 *       pipeline
 *     } = require("node:stream");
 *
 *
 *     pipeline(
 *       source,
 *       transform,
 *       destination,
 *       callback
 *     );
 *
 *
 * Promise API:
 *
 *     const {
 *       pipeline
 *     } =
 *       require(
 *         "node:stream/promises"
 *       );
 *
 *
 *     await pipeline(
 *       source,
 *       transform,
 *       destination
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Important options
 * ============================================================
 *
 *
 * signal:
 *
 *     AbortController signal.
 *
 *
 * Example:
 *
 *     await pipeline(
 *       source,
 *       destination,
 *       {
 *         signal:
 *           controller.signal
 *       }
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Real-world use cases
 * ============================================================
 *
 *
 * File copying
 *
 *     File → File
 *
 *
 * File compression
 *
 *     File → gzip → File
 *
 *
 * File transformation
 *
 *     File → Transform → File
 *
 *
 * CSV processing
 *
 *     File → Parser → Validator → Database
 *
 *
 * HTTP streaming
 *
 *     Request → Transform → Response
 *
 *
 * Encryption
 *
 *     File → Cipher → File
 *
 *
 * Logging
 *
 *     Data → Formatter → Log file
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Streams section complete
 * ============================================================
 *
 *
 * 10_streams/
 *
 *     readable.js
 *         │
 *         │ Source of data
 *         ↓
 *
 *     writable.js
 *         │
 *         │ Destination of data
 *         ↓
 *
 *     duplex.js
 *         │
 *         │ Read + Write
 *         ↓
 *
 *     transform.js
 *         │
 *         │ Read + Write + Transform
 *         ↓
 *
 *     pipeline.js
 *         │
 *         │ Connect streams safely
 *         ↓
 *
 * ============================================================
 */

/*
 * ============================================================
 * CHEAT SHEET
 * ============================================================
 *
 *
 * Basic:
 *
 *     pipeline(
 *       readable,
 *       writable,
 *       callback
 *     );
 *
 *
 * With Transform:
 *
 *     pipeline(
 *       readable,
 *       transform,
 *       writable,
 *       callback
 *     );
 *
 *
 * Promise:
 *
 *     const {
 *       pipeline
 *     } =
 *       require(
 *         "node:stream/promises"
 *       );
 *
 *
 *     await pipeline(
 *       readable,
 *       transform,
 *       writable
 *     );
 *
 *
 * Abort:
 *
 *     const controller =
 *       new AbortController();
 *
 *
 *     await pipeline(
 *       readable,
 *       writable,
 *       {
 *         signal:
 *           controller.signal
 *       }
 *     );
 *
 *
 * Cancel:
 *
 *     controller.abort();
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 * pipeline() = SAFE STREAM COMPOSITION
 *
 *
 *     Readable
 *        ↓
 *     Transform
 *        ↓
 *     Transform
 *        ↓
 *     Writable
 *
 *
 * pipeline() manages:
 *
 *     ✓ Data flow
 *     ✓ Backpressure
 *     ✓ Errors
 *     ✓ Cleanup
 *     ✓ Completion
 *     ✓ Cancellation
 *
 * ============================================================
 */
