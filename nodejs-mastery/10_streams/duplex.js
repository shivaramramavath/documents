/**
 * ============================================================
 * NODE.JS STREAMS - DUPLEX
 * ============================================================
 *
 * File:
 *     10_streams/duplex.js
 *
 * A Duplex stream is BOTH:
 *
 *     Readable + Writable
 *
 *
 * It can:
 *
 *     receive data
 *         AND
 *     produce data
 *
 * independently.
 *
 * ============================================================
 *
 * Examples:
 *
 *     TCP sockets
 *     Network connections
 *     WebSocket-like communication
 *     Custom bidirectional streams
 *
 * ============================================================
 *
 * Architecture:
 *
 *
 *             Duplex Stream
 *          ┌─────────────────┐
 *          │                 │
 *     IN → │    Writable     │
 *          │                 │
 *     OUT ←│    Readable     │
 *          │                 │
 *          └─────────────────┘
 *
 * ============================================================
 */

const { Duplex } = require("node:stream");

/*
 * ============================================================
 * 1. Basic Duplex stream
 * ============================================================
 */

const duplex = new Duplex({
  /*
   * ========================================================
   * Writable side
   * ========================================================
   *
   * Data written INTO the stream arrives here.
   */

  write(chunk, encoding, callback) {
    console.log("Writable received:", chunk.toString());

    callback();
  },

  /*
   * ========================================================
   * Readable side
   * ========================================================
   *
   * Data produced BY the stream is pushed here.
   */

  read(size) {
    this.push("Data from readable side\n");

    this.push(null);
  },
});

/*
 * ============================================================
 * 2. Write into Duplex
 * ============================================================
 */

duplex.write("Hello Duplex");

/*
 * ============================================================
 * 3. Read from Duplex
 * ============================================================
 */

duplex.on("data", (chunk) => {
  console.log("Readable produced:", chunk.toString());
});

/*
 * ============================================================
 * 4. Writable finish
 * ============================================================
 */

duplex.on("finish", () => {
  console.log("Writable side finished.");
});

/*
 * ============================================================
 * 5. Readable end
 * ============================================================
 */

duplex.on("end", () => {
  console.log("Readable side ended.");
});

/*
 * ============================================================
 * 6. close
 * ============================================================
 */

duplex.on("close", () => {
  console.log("Duplex stream closed.");
});

/*
 * Finish writable side.
 */

duplex.end();

/*
 * ============================================================
 * IMPORTANT
 * ============================================================
 *
 * "finish" and "end" are different.
 *
 *
 * finish:
 *
 *     Writable side is finished.
 *
 *
 * end:
 *
 *     Readable side has no more data.
 *
 *
 * Duplex has TWO independent sides.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Duplex with independent input/output
 * ============================================================
 */

const communicationStream = new Duplex({
  read(size) {
    this.push("Server message 1\n");

    this.push("Server message 2\n");

    this.push(null);
  },

  write(chunk, encoding, callback) {
    console.log("Client sent:", chunk.toString());

    callback();
  },
});

communicationStream.on("data", (chunk) => {
  console.log("Client received:", chunk.toString());
});

communicationStream.write("Hello server");

communicationStream.write("How are you?");

communicationStream.end();

/*
 * ============================================================
 * 8. Duplex does NOT automatically connect read and write
 * ============================================================
 *
 * This is an important concept.
 *
 *
 * Writing:
 *
 *     duplex.write("hello")
 *
 *
 * does NOT automatically cause:
 *
 *     duplex.on("data", ...)
 *
 * to receive "hello".
 *
 *
 * The Writable and Readable sides are independent unless you
 * explicitly connect them.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Echo Duplex
 * ============================================================
 *
 * Here we intentionally connect the Writable side to the
 * Readable side.
 * ============================================================
 */

const echo = new Duplex({
  read(size) {
    /*
     * Data is pushed from the writable side.
     */
  },

  write(chunk, encoding, callback) {
    console.log("Received:", chunk.toString());

    /*
     * Send the same data back through readable side.
     */

    this.push(`Echo: ${chunk.toString()}`);

    callback();
  },
});

echo.on("data", (chunk) => {
  console.log("Output:", chunk.toString());
});

echo.write("Hello");

echo.write("Node.js");

echo.end();

/*
 * ============================================================
 * 10. Duplex objectMode
 * ============================================================
 *
 * objectMode can be enabled for both sides.
 * ============================================================
 */

const objectDuplex = new Duplex({
  readableObjectMode: true,

  writableObjectMode: true,

  read(size) {
    this.push({
      type: "response",

      message: "Hello from readable side",
    });

    this.push(null);
  },

  write(object, encoding, callback) {
    console.log("Received object:", object);

    callback();
  },
});

objectDuplex.on("data", (object) => {
  console.log("Output object:", object);
});

objectDuplex.write({
  type: "request",

  message: "Hello server",
});

objectDuplex.end();

/*
 * ============================================================
 * 11. readableObjectMode and writableObjectMode
 * ============================================================
 *
 * These can be configured independently.
 *
 *
 * readableObjectMode:
 *
 *     Controls readable side.
 *
 *
 * writableObjectMode:
 *
 *     Controls writable side.
 *
 * ============================================================
 */

const mixedDuplex = new Duplex({
  readableObjectMode: true,

  writableObjectMode: true,

  read() {
    this.push({
      id: 100,

      message: "Response",
    });

    this.push(null);
  },

  write(object, encoding, callback) {
    console.log("Request:", object);

    callback();
  },
});

mixedDuplex.on("data", (object) => {
  console.log("Received response:", object);
});

mixedDuplex.write({
  id: 1,

  message: "Request",
});

mixedDuplex.end();

/*
 * ============================================================
 * 12. allowHalfOpen
 * ============================================================
 *
 * By default, when the readable side ends, the writable side
 * can remain open.
 *
 * allowHalfOpen controls this behavior.
 *
 * ============================================================
 */

const halfOpenStream = new Duplex({
  allowHalfOpen: false,

  read() {
    this.push("Response");

    this.push(null);
  },

  write(chunk, encoding, callback) {
    console.log("Received:", chunk.toString());

    callback();
  },
});

halfOpenStream.on("data", (chunk) => {
  console.log("Data:", chunk.toString());
});

halfOpenStream.on("end", () => {
  console.log("Readable side ended.");
});

halfOpenStream.write("Request");

/*
 * ============================================================
 * 13. Duplex lifecycle
 * ============================================================
 *
 *
 *                    Duplex
 *                       │
 *             ┌─────────┴─────────┐
 *             │                   │
 *             ↓                   ↓
 *         Writable            Readable
 *             │                   │
 *             ↓                   ↓
 *          write()              read()
 *             │                   │
 *             ↓                   ↓
 *          _write()              push()
 *             │                   │
 *             ↓                   ↓
 *          finish                end
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Duplex vs Readable vs Writable
 * ============================================================
 *
 *
 * Readable:
 *
 *     Output only
 *
 *     Source
 *       ↓
 *     Consumer
 *
 *
 * Writable:
 *
 *     Input only
 *
 *     Producer
 *       ↓
 *     Destination
 *
 *
 * Duplex:
 *
 *     Input + Output
 *
 *
 *     Producer
 *       ↓
 *     Writable
 *
 *
 *     Readable
 *       ↓
 *     Consumer
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Real-world example: TCP socket
 * ============================================================
 *
 * A TCP socket is a Duplex stream.
 *
 *
 *     Client
 *       │
 *       │ write()
 *       ↓
 *     Socket
 *       │
 *       │ data
 *       ↓
 *     Server
 *
 *
 * And the reverse direction happens through the same socket.
 *
 *
 *     Server
 *       │
 *       │ write()
 *       ↓
 *     Socket
 *       │
 *       │ data
 *       ↓
 *     Client
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. HTTP request/response distinction
 * ============================================================
 *
 * HTTP request:
 *
 *     Readable
 *
 *
 * HTTP response:
 *
 *     Writable
 *
 *
 * TCP socket:
 *
 *     Duplex
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Duplex as communication channel
 * ============================================================
 *
 *
 * Application A
 *       │
 *       │ write
 *       ↓
 *   ┌─────────┐
 *   │ Duplex  │
 *   └─────────┘
 *       │
 *       │ read
 *       ↓
 * Application B
 *
 *
 * And data can travel in the opposite direction as well.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. destroy()
 * ============================================================
 */

const destroyDuplex = new Duplex({
  read() {
    this.push("data");
  },

  write(chunk, encoding, callback) {
    callback();
  },
});

destroyDuplex.on("close", () => {
  console.log("Duplex destroyed.");
});

destroyDuplex.destroy();

/*
 * ============================================================
 * 19. Error handling
 * ============================================================
 */

const errorDuplex = new Duplex({
  read() {
    this.push(null);
  },

  write(chunk, encoding, callback) {
    callback(new Error("Unable to process data"));
  },
});

errorDuplex.on("error", (error) => {
  console.error("Duplex error:", error.message);
});

errorDuplex.write("test");

/*
 * ============================================================
 * 20. Duplex stream with state
 * ============================================================
 */

let receivedMessages = 0;

const statefulDuplex = new Duplex({
  read() {
    this.push({
      message: "Current server state",

      received: receivedMessages,
    });

    this.push(null);
  },

  writableObjectMode: true,

  readableObjectMode: true,

  write(message, encoding, callback) {
    receivedMessages += 1;

    console.log("Message:", message);

    callback();
  },
});

statefulDuplex.on("data", (data) => {
  console.log("State:", data);
});

statefulDuplex.write({
  id: 1,

  text: "Hello",
});

statefulDuplex.write({
  id: 2,

  text: "World",
});

statefulDuplex.end();

/*
 * ============================================================
 * 21. Duplex vs Transform
 * ============================================================
 *
 *
 * Duplex:
 *
 *     Read and write logic are independent.
 *
 *
 * Transform:
 *
 *     Written data is transformed and becomes readable output.
 *
 *
 * Duplex:
 *
 *     Input ──→ Writable
 *                  │
 *                  │ independent
 *                  ↓
 *              Readable ──→ Output
 *
 *
 * Transform:
 *
 *     Input
 *       ↓
 *     Transform
 *       ↓
 *     Output
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Important methods
 * ============================================================
 *
 *
 * Writable side:
 *
 *     write()
 *     end()
 *
 *
 * Readable side:
 *
 *     read()
 *     push()
 *
 *
 * Both:
 *
 *     destroy()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Important events
 * ============================================================
 *
 *
 * Writable side:
 *
 *     finish
 *     drain
 *     error
 *
 *
 * Readable side:
 *
 *     data
 *     end
 *     readable
 *     error
 *
 *
 * Stream:
 *
 *     close
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
 *       Duplex
 *     } = require("node:stream");
 *
 *
 * Create:
 *
 *     new Duplex({
 *
 *       read() {
 *
 *         this.push(data);
 *         this.push(null);
 *
 *       },
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
 *     duplex.write(data);
 *
 *
 * Finish writing:
 *
 *     duplex.end();
 *
 *
 * Produce readable data:
 *
 *     this.push(data);
 *
 *
 * Finish readable side:
 *
 *     this.push(null);
 *
 *
 * Destroy:
 *
 *     duplex.destroy();
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 * Duplex = READABLE + WRITABLE
 *
 *
 *          ┌─────────────────┐
 * Input →  │     Writable    │
 *          │                 │
 *          │     Duplex      │
 *          │                 │
 * Output ← │     Readable    │
 *          └─────────────────┘
 *
 * ============================================================
 */
