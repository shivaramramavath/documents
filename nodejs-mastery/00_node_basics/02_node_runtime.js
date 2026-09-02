/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 02_node_runtime.js
 *
 * Topic:
 * Node.js Runtime
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. What is a Runtime?
 * ============================================================
 *
 * A runtime is the environment in which a program executes.
 *
 * JavaScript by itself is a programming language.
 * It needs a runtime environment to actually execute.
 *
 * Examples:
 *
 *     JavaScript
 *        │
 *        ├── Browser Runtime
 *        │      ├── Chrome
 *        │      ├── Firefox
 *        │      └── Edge
 *        │
 *        └── Node.js Runtime
 *
 * Node.js provides the environment and APIs required to
 * execute JavaScript outside the browser.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. What is inside the Node.js Runtime?
 * ============================================================
 *
 * A simplified Node.js architecture looks like this:
 *
 *
 *                 Your JavaScript
 *                       │
 *                       ▼
 *                  Node.js Runtime
 *                       │
 *          ┌────────────┼────────────┐
 *          ▼            ▼            ▼
 *         V8          Node APIs     Event Loop
 *          │            │            │
 *          │            │           libuv
 *          │            │            │
 *          ▼            ▼            ▼
 *      JavaScript    fs, os,      Async I/O
 *      execution     http,        operations
 *                    crypto...
 *
 *
 * Important components:
 *
 *     1. V8
 *     2. Node.js APIs
 *     3. Event Loop
 *     4. libuv
 *     5. Operating System
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. V8 JavaScript Engine
 * ============================================================
 *
 * V8 is Google's open-source JavaScript engine.
 *
 * It was originally developed for Google Chrome.
 *
 * Node.js uses V8 to execute JavaScript.
 *
 * Example:
 *
 *     console.log("Hello Node.js");
 *
 * V8 is responsible for executing this JavaScript code.
 *
 * Simplified:
 *
 *     JavaScript
 *          ↓
 *         V8
 *          ↓
 *     Machine Code
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Node.js APIs
 * ============================================================
 *
 * V8 alone only executes JavaScript.
 *
 * Node.js adds many APIs that allow JavaScript to interact
 * with the operating system and network.
 *
 * Examples:
 *
 *     fs       → File System
 *     os       → Operating System
 *     path     → File paths
 *     http     → HTTP servers
 *     crypto   → Cryptography
 *     events   → Event handling
 *     stream   → Streams
 *     process  → Current Node.js process
 *
 * Example:
 */

const os = require("os");

console.log("Platform:", os.platform());
console.log("CPU Architecture:", os.arch());

/*
 * ============================================================
 * 5. Node.js is NOT just V8
 * ============================================================
 *
 * This is an important interview concept.
 *
 * ❌ Node.js = V8
 *
 * This is incorrect.
 *
 * V8 is only the JavaScript engine.
 *
 * Node.js consists of V8 plus Node.js APIs and other
 * components such as libuv.
 *
 * Think:
 *
 *     Node.js
 *        │
 *        ├── V8
 *        │     └── Executes JavaScript
 *        │
 *        ├── Node.js APIs
 *        │     └── fs, os, http, crypto...
 *        │
 *        └── libuv
 *              └── Async I/O + Event Loop
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. What is libuv?
 * ============================================================
 *
 * libuv is a library used by Node.js to provide:
 *
 *     - Event Loop
 *     - Asynchronous I/O
 *     - Networking
 *     - Timers
 *     - Thread Pool
 *
 * It helps Node.js perform asynchronous operations.
 *
 *
 * Simplified:
 *
 *     JavaScript
 *          ↓
 *        Node.js
 *          ↓
 *        libuv
 *          ↓
 *     Operating System
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Event Loop
 * ============================================================
 *
 * The Event Loop is one of the most important concepts
 * in Node.js.
 *
 * It allows Node.js to handle asynchronous operations
 * without blocking the JavaScript execution thread.
 *
 * Example:
 */

console.log("1. Start");

setTimeout(() => {
  console.log("3. Timer finished");
}, 0);

console.log("2. End");

/*
 * Expected output:
 *
 *     1. Start
 *     2. End
 *     3. Timer finished
 *
 *
 * Why?
 *
 * The setTimeout callback does not execute immediately.
 *
 * Node.js schedules the callback and continues executing
 * the synchronous JavaScript code.
 *
 * Simplified:
 *
 *     console.log("1. Start")
 *              ↓
 *         Execute immediately
 *
 *     setTimeout(...)
 *              ↓
 *         Schedule callback
 *
 *     console.log("2. End")
 *              ↓
 *         Execute immediately
 *
 *     Event Loop
 *              ↓
 *         Execute timer callback
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Call Stack
 * ============================================================
 *
 * JavaScript execution uses a Call Stack.
 *
 * Example:
 */

function first() {
  second();
}

function second() {
  console.log("Inside second()");
}

first();

/*
 * Simplified Call Stack:
 *
 *     first()
 *        ↓
 *     second()
 *        ↓
 *     console.log()
 *
 * After execution:
 *
 *     console.log() removed
 *     second() removed
 *     first() removed
 *
 * The stack becomes empty.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Synchronous vs Asynchronous
 * ============================================================
 *
 * Synchronous code executes immediately in sequence.
 *
 * Example:
 */

console.log("A");
console.log("B");
console.log("C");

/*
 * Output:
 *
 *     A
 *     B
 *     C
 *
 *
 * Asynchronous operations can be scheduled to execute later.
 *
 * Example:
 */

console.log("Start");

setTimeout(() => {
  console.log("Async operation");
}, 1000);

console.log("End");

/*
 * Output:
 *
 *     Start
 *     End
 *     Async operation
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Thread Model
 * ============================================================
 *
 * Node.js JavaScript execution is primarily single-threaded.
 *
 * That means JavaScript code normally executes on one
 * main thread.
 *
 * But Node.js can still handle many concurrent operations.
 *
 * Why?
 *
 * Because Node.js uses asynchronous I/O and the Event Loop.
 *
 *
 * Simplified:
 *
 *              Node.js
 *                 │
 *          ┌──────┴──────┐
 *          │             │
 *     Main Thread     libuv
 *          │             │
 *    JavaScript      Async I/O
 *          │             │
 *          └──────┬──────┘
 *                 │
 *            Event Loop
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Node.js Thread Pool
 * ============================================================
 *
 * libuv also maintains a thread pool for certain operations.
 *
 * Examples can include:
 *
 *     - Some file system operations
 *     - DNS operations
 *     - Certain cryptographic operations
 *
 * Important:
 *
 * The JavaScript execution thread and libuv's worker threads
 * are different concepts.
 *
 *
 * Simplified:
 *
 *     Main JavaScript Thread
 *              │
 *              ▼
 *          Event Loop
 *              │
 *              ▼
 *          libuv Thread Pool
 *          ┌───┼───┬───┐
 *          ▼   ▼   ▼   ▼
 *        Worker Worker Worker Worker
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Node.js Runtime Example
 * ============================================================
 *
 * Let's combine some concepts.
 */

const fs = require("fs");

console.log("Program started");

fs.readFile(__filename, "utf8", (error, data) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log("File reading completed");
});

console.log("Program finished");

/*
 * You will usually see:
 *
 *     Program started
 *     Program finished
 *     File reading completed
 *
 *
 * The file operation is asynchronous.
 *
 * Node.js starts the operation and continues executing
 * other JavaScript code.
 *
 * When the operation completes, its callback can be
 * processed by the Node.js asynchronous execution model.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Global Objects
 * ============================================================
 *
 * Node.js provides several global objects and functions.
 *
 * Examples:
 *
 *     console
 *     process
 *     setTimeout
 *     setInterval
 *     clearTimeout
 *     Buffer
 *
 * Example:
 */

console.log("Node version:", process.version);
console.log("Process ID:", process.pid);
console.log("Platform:", process.platform);

/*
 * ============================================================
 * 14. Complete Simplified Architecture
 * ============================================================
 *
 *
 *                    Node.js Application
 *                           │
 *                           ▼
 *                    JavaScript Code
 *                           │
 *                           ▼
 *                         V8
 *                  JavaScript Engine
 *                           │
 *                           ▼
 *                    Node.js APIs
 *              ┌────────────┼────────────┐
 *              │            │            │
 *             fs           http        crypto
 *              │            │            │
 *              └────────────┼────────────┘
 *                           │
 *                           ▼
 *                         libuv
 *                  ┌────────┴────────┐
 *                  │                 │
 *             Event Loop        Thread Pool
 *                  │                 │
 *                  └────────┬────────┘
 *                           ▼
 *                    Operating System
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Key Takeaways
 * ============================================================
 *
 * 1. A runtime is an environment where code executes.
 *
 * 2. Node.js is a JavaScript runtime environment.
 *
 * 3. Node.js uses the V8 JavaScript engine.
 *
 * 4. V8 executes JavaScript.
 *
 * 5. Node.js provides APIs such as fs, os, http and crypto.
 *
 * 6. Node.js uses libuv for asynchronous I/O and the
 *    Event Loop.
 *
 * 7. JavaScript execution is primarily single-threaded.
 *
 * 8. Node.js can handle many concurrent I/O operations using
 *    asynchronous programming.
 *
 * 9. libuv also provides a thread pool for certain operations.
 *
 * 10. Understanding the Event Loop is essential for becoming
 *     a strong Node.js developer.
 *
 * ============================================================
 */

/*
 * ============================================================
 * Run this file:
 *
 *     node .\00_node_basics\02_node_runtime.js
 *
 * ============================================================
 */
