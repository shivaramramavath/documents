/**
 * ============================================================
 * JavaScript for Node.js
 * ============================================================
 *
 * File: event_loop.js
 *
 * Topic:
 * Node.js Event Loop
 *
 * ============================================================
 *
 * The Event Loop is what allows Node.js to handle many
 * asynchronous operations without creating a thread for every
 * request.
 *
 *
 * High-level idea:
 *
 *
 *        JavaScript Code
 *              │
 *              ▼
 *         Call Stack
 *              │
 *              ▼
 *        Node.js APIs
 *              │
 *              ▼
 *        Event Loop
 *              │
 *        ┌─────┴─────┐
 *        ▼           ▼
 *     Timers      I/O callbacks
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Synchronous execution
 * ============================================================
 *
 * JavaScript executes synchronous code on the call stack.
 * ============================================================
 */

console.log("1");

console.log("2");

console.log("3");

/*
 * Output:
 *
 *     1
 *     2
 *     3
 *
 *
 * JavaScript executes from top to bottom.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Call Stack
 * ============================================================
 *
 * The call stack keeps track of functions currently executing.
 * ============================================================
 */

function first() {
  console.log("first");
}

function second() {
  first();

  console.log("second");
}

second();

/*
 * Stack:
 *
 *
 *     second()
 *        ↓
 *     first()
 *
 *
 * first() finishes
 *        ↓
 *     second() continues
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Stack execution
 * ============================================================
 */

function one() {
  console.log("one");

  two();

  console.log("one again");
}

function two() {
  console.log("two");
}

one();

/*
 * Output:
 *
 *     one
 *     two
 *     one again
 *
 *
 * The function call stack works in LIFO order:
 *
 *     Last In
 *     First Out
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. setTimeout()
 * ============================================================
 */

console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

console.log("End");

/*
 * Output:
 *
 *     Start
 *     End
 *     Timeout
 *
 *
 * Why?
 *
 * setTimeout(..., 0) does NOT mean:
 *
 *     "run immediately"
 *
 *
 * It means approximately:
 *
 *     "run no earlier than this delay, when the event loop
 *      gets an opportunity to execute the callback."
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. setTimeout with delay
 * ============================================================
 */

console.log("A");

setTimeout(() => {
  console.log("B");
}, 1000);

console.log("C");

/*
 * Output:
 *
 *     A
 *     C
 *     B
 *
 *
 * Synchronous code executes first.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Promises and microtasks
 * ============================================================
 */

console.log("Start");

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");

/*
 * Output:
 *
 *     Start
 *     End
 *     Promise
 *
 *
 * Promise callbacks are asynchronous.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Microtask queue
 * ============================================================
 *
 * Promise callbacks are placed into the microtask queue.
 *
 *
 * Examples:
 *
 *     Promise.then()
 *     Promise.catch()
 *     Promise.finally()
 *     queueMicrotask()
 *
 *
 * Microtasks are processed after the current synchronous
 * JavaScript execution finishes.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. queueMicrotask()
 * ============================================================
 */

console.log("A");

queueMicrotask(() => {
  console.log("Microtask");
});

console.log("B");

/*
 * Output:
 *
 *     A
 *     B
 *     Microtask
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Promise vs setTimeout
 * ============================================================
 */

console.log("1");

setTimeout(() => {
  console.log("Timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("2");

/*
 * Typical output:
 *
 *     1
 *     2
 *     Promise
 *     Timeout
 *
 *
 * Why?
 *
 *     synchronous code
 *          ↓
 *     microtasks
 *          ↓
 *     event-loop phases / timers
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. process.nextTick()
 * ============================================================
 *
 * Node.js provides process.nextTick().
 *
 * It schedules a callback to run after the current operation
 * completes, before the event loop continues to other phases.
 *
 * ============================================================
 */

console.log("Start");

process.nextTick(() => {
  console.log("nextTick");
});

console.log("End");

/*
 * Output:
 *
 *     Start
 *     End
 *     nextTick
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. nextTick vs Promise
 * ============================================================
 */

console.log("Start");

process.nextTick(() => {
  console.log("nextTick");
});

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");

/*
 * In Node.js, nextTick callbacks are processed before the
 * regular Promise microtask queue.
 *
 * Typical output:
 *
 *     Start
 *     End
 *     nextTick
 *     Promise
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. setImmediate()
 * ============================================================
 *
 * setImmediate() schedules a callback for the check phase of
 * the Node.js event loop.
 *
 * ============================================================
 */

setImmediate(() => {
  console.log("Immediate");
});

/*
 * ============================================================
 * 13. setTimeout vs setImmediate
 * ============================================================
 *
 * At top level, their ordering can be timing-dependent.
 *
 * Don't rely on:
 *
 *     setTimeout(..., 0)
 *
 * always running before:
 *
 *     setImmediate(...)
 *
 * or vice versa.
 *
 * Their relative order can depend on when and where they are
 * scheduled.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. setTimeout vs setImmediate inside I/O
 * ============================================================
 *
 * In an I/O callback, setImmediate() commonly runs before a
 * zero-delay timer scheduled from that callback.
 *
 * Example:
 *
 *
 *     const fs =
 *       require("node:fs");
 *
 *
 *     fs.readFile(
 *       __filename,
 *       () => {
 *
 *         setTimeout(
 *           () => {
 *             console.log("timeout");
 *           },
 *           0
 *         );
 *
 *         setImmediate(
 *           () => {
 *             console.log("immediate");
 *           }
 *         );
 *
 *       }
 *     );
 *
 *
 * This is a common event-loop interview question.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Event loop phases
 * ============================================================
 *
 * Node.js event loop has several phases.
 *
 *
 * Simplified:
 *
 *
 *     ┌───────────────────────┐
 *     │        Timers         │
 *     └───────────┬───────────┘
 *                 ↓
 *     ┌───────────────────────┐
 *     │ Pending callbacks     │
 *     └───────────┬───────────┘
 *                 ↓
 *     ┌───────────────────────┐
 *     │      Idle / Prepare   │
 *     └───────────┬───────────┘
 *                 ↓
 *     ┌───────────────────────┐
 *     │         Poll          │
 *     └───────────┬───────────┘
 *                 ↓
 *     ┌───────────────────────┐
 *     │        Check          │
 *     │     setImmediate      │
 *     └───────────┬───────────┘
 *                 ↓
 *     ┌───────────────────────┐
 *     │       Close           │
 *     └───────────────────────┘
 *
 *
 * The exact internal behavior is more nuanced, but this model
 * is useful for understanding Node.js.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Timers phase
 * ============================================================
 *
 * Handles callbacks scheduled by:
 *
 *     setTimeout()
 *     setInterval()
 *
 * Note:
 *
 * The specified delay is a threshold, not a guaranteed
 * execution time.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Poll phase
 * ============================================================
 *
 * The poll phase handles many I/O-related callbacks.
 *
 * Examples:
 *
 *     File system operations
 *     Network operations
 *     Socket operations
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Check phase
 * ============================================================
 *
 * setImmediate() callbacks execute here.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Close callbacks
 * ============================================================
 *
 * Close-related callbacks can execute here.
 *
 * Example:
 *
 *     socket.on("close", ...)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Non-blocking I/O
 * ============================================================
 *
 * This is one of Node.js's biggest strengths.
 *
 *
 * Example:
 *
 *     Request
 *        ↓
 *     Database query
 *        ↓
 *     Node.js continues handling other work
 *        ↓
 *     Database responds
 *        ↓
 *     Callback / Promise continuation
 *
 *
 * Node.js doesn't need to sit doing nothing while waiting for
 * I/O.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Demonstrating non-blocking behavior
 * ============================================================
 */

const fs = require("node:fs");

console.log("Before read");

fs.readFile(__filename, "utf8", (error, data) => {
  if (error) {
    console.error(error.message);

    return;
  }

  console.log("File read completed");
});

console.log("After read");

/*
 * Typical output:
 *
 *     Before read
 *     After read
 *     File read completed
 *
 *
 * The file operation happens asynchronously.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Why Node.js is good for I/O
 * ============================================================
 *
 * Node.js is especially useful for:
 *
 *     - REST APIs
 *     - WebSockets
 *     - Chat applications
 *     - Real-time systems
 *     - Database-heavy applications
 *     - API gateways
 *     - Microservices
 *     - Streaming
 *
 *
 * These workloads spend a lot of time waiting for I/O.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. CPU-heavy work
 * ============================================================
 *
 * The event loop is NOT good for long CPU-heavy JavaScript
 * operations.
 *
 * Example:
 */

function heavyCalculation() {
  let total = 0;

  for (let i = 0; i < 1_000_000_000; i++) {
    total += i;
  }

  return total;
}

/*
 * DON'T call heavyCalculation() in this learning file.
 *
 * It would block the event loop for a long time.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. What does "blocking the event loop" mean?
 * ============================================================
 *
 *
 * Normal:
 *
 *     Request A
 *        ↓
 *     async I/O
 *
 *     Request B
 *        ↓
 *     async I/O
 *
 *     Request C
 *        ↓
 *     async I/O
 *
 *
 *
 * Blocking:
 *
 *     Request A
 *        ↓
 *     CPU-heavy operation
 *        ↓
 *     EVENT LOOP BLOCKED
 *        ↓
 *     Request B waits
 *     Request C waits
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Microtasks can also starve the event loop
 * ============================================================
 *
 * Be careful with endlessly scheduling microtasks.
 *
 * Example concept:
 *
 *
 *     function loop() {
 *
 *       queueMicrotask(loop);
 *
 *     }
 *
 *     loop();
 *
 *
 * This can prevent the event loop from progressing normally.
 *
 * Never create an uncontrolled microtask loop.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. async/await and event loop
 * ============================================================
 */

async function exampleAsync() {
  console.log("Async start");

  await Promise.resolve();

  console.log("Async continuation");
}

console.log("Before");

exampleAsync();

console.log("After");

/*
 * Typical output:
 *
 *     Before
 *     Async start
 *     After
 *     Async continuation
 *
 *
 * `await` causes the continuation to happen asynchronously.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. async/await does NOT block the event loop
 * ============================================================
 *
 * Example:
 *
 *
 *     async function getData() {
 *
 *       const data =
 *         await database.query();
 *
 *       return data;
 *
 *     }
 *
 *
 * While the database is working, Node.js can continue handling
 * other work.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Event loop execution order
 * ============================================================
 *
 * A simplified mental model:
 *
 *
 *     1. Execute synchronous JavaScript
 *
 *     2. Process process.nextTick() callbacks
 *
 *     3. Process Promise microtasks
 *
 *     4. Continue through event-loop phases
 *
 *     5. Process callbacks scheduled by those phases
 *
 *
 * This is simplified, but very useful.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Complex ordering example
 * ============================================================
 */

console.log("1");

setTimeout(() => {
  console.log("2 - timeout");
}, 0);

setImmediate(() => {
  console.log("3 - immediate");
});

Promise.resolve().then(() => {
  console.log("4 - promise");
});

process.nextTick(() => {
  console.log("5 - nextTick");
});

console.log("6");

/*
 * The first guaranteed ordering is:
 *
 *     1
 *     6
 *
 * Then Node.js processes nextTick / microtask work before
 * moving through later event-loop phases.
 *
 * The relative ordering of timer and immediate at top level
 * should not be treated as guaranteed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Event loop + database
 * ============================================================
 *
 * Imagine:
 *
 *
 *     GET /users
 *          ↓
 *     Controller
 *          ↓
 *     UserService
 *          ↓
 *     MongoDB query
 *          ↓
 *     await
 *          │
 *          └──────→ Event loop handles other requests
 *
 *
 * MongoDB response:
 *
 *          ↓
 *
 *     Promise resolves
 *          ↓
 *     async function continues
 *          ↓
 *     Controller
 *          ↓
 *     HTTP response
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Event loop + multiple requests
 * ============================================================
 *
 *
 * Request 1:
 *
 *     DB query ───────────────┐
 *                            │
 *
 * Request 2:                 │
 *
 *     DB query ────────┐     │
 *                      │     │
 *
 * Request 3:           │     │
 *
 *     API call ────────┼─────┘
 *                      │
 *                      ▼
 *                 Responses
 *
 *
 * Node.js can keep progressing while I/O operations are
 * pending.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Event loop + WebSocket
 * ============================================================
 *
 * For a chat application:
 *
 *
 *     Client A
 *        ↓
 *     WebSocket event
 *        ↓
 *     Node.js
 *        ↓
 *     Redis / database
 *        ↓
 *     Socket emit
 *        ↓
 *     Client B
 *
 *
 * This is why understanding the event loop matters for
 * real-time Node.js applications.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Node.js is not "single threaded" in the simple sense
 * ============================================================
 *
 * A common statement is:
 *
 *     "Node.js is single-threaded."
 *
 *
 * More accurately:
 *
 *     JavaScript execution for a Node.js process primarily runs
 *     on one main event-loop thread.
 *
 *
 * But Node.js also uses:
 *
 *     - OS facilities
 *     - libuv
 *     - thread pool
 *     - worker threads
 *     - multiple processes
 *
 *
 * We will study these later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. libuv
 * ============================================================
 *
 * Node.js uses libuv for important asynchronous infrastructure.
 *
 * It provides mechanisms for:
 *
 *     - Event loop
 *     - Asynchronous I/O
 *     - Thread pool
 *     - Timers
 *     - Cross-platform behavior
 *
 *
 * Simplified architecture:
 *
 *
 *     JavaScript
 *         ↓
 *     Node.js APIs
 *         ↓
 *       libuv
 *         ↓
 *     OS / Thread Pool
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Thread pool
 * ============================================================
 *
 * Some operations can use libuv's worker thread pool.
 *
 * Examples can include certain:
 *
 *     - File system operations
 *     - DNS operations
 *     - Crypto operations
 *
 *
 * This is different from manually creating Worker Threads.
 *
 * We'll study this in the performance section.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Event loop and crypto
 * ============================================================
 *
 * Some cryptographic operations can be CPU intensive.
 *
 * Node.js provides asynchronous versions of some crypto APIs
 * so expensive work can be performed without unnecessarily
 * blocking the JavaScript event loop.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Why blocking is dangerous in APIs
 * ============================================================
 *
 * Imagine an API receives:
 *
 *     1,000 requests
 *
 *
 * If every request performs a long synchronous CPU operation:
 *
 *
 *     Request
 *        ↓
 *     CPU-heavy code
 *        ↓
 *     Event loop blocked
 *
 *
 * Other requests have to wait.
 *
 *
 * This can cause:
 *
 *     - High latency
 *     - Timeouts
 *     - Poor throughput
 *     - CPU saturation
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. How to avoid blocking
 * ============================================================
 *
 * Use:
 *
 *     - Async APIs
 *     - Streaming
 *     - Pagination
 *     - Worker Threads
 *     - Child Processes
 *     - Clustering
 *     - Queues
 *     - Background jobs
 *
 *
 * depending on the workload.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Event loop interview question
 * ============================================================
 *
 * Question:
 *
 *     What is the Node.js event loop?
 *
 *
 * Good answer:
 *
 *     The Node.js event loop is the mechanism that coordinates
 *     asynchronous callbacks and I/O operations so JavaScript
 *     can continue executing without synchronously waiting for
 *     many I/O operations to complete.
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. Another interview question
 * ============================================================
 *
 * Question:
 *
 *     Why is Node.js good for I/O-heavy applications?
 *
 *
 * Answer:
 *
 *     Node.js uses an event-driven, non-blocking I/O model.
 *     Instead of blocking the JavaScript execution thread while
 *     waiting for I/O, it can continue processing other work
 *     and resume the operation when its result is available.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. Another important question
 * ============================================================
 *
 *     Does async/await create a new thread?
 *
 *
 * No.
 *
 * `async/await` is syntax built around Promises.
 *
 * It does not automatically create a new JavaScript thread.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. Another important question
 * ============================================================
 *
 *     Does setTimeout(fn, 0) execute immediately?
 *
 *
 * No.
 *
 * It schedules the callback for a later timers phase after the
 * timer's threshold has elapsed and the event loop is able to
 * process it.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. Another important question
 * ============================================================
 *
 *     What blocks Node.js?
 *
 *
 * Examples:
 *
 *     - Large synchronous loops
 *     - fs.readFileSync() on large files
 *     - CPU-heavy calculations
 *     - Synchronous crypto operations
 *     - Very large JSON parsing/stringifying
 *     - Infinite loops
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. The complete mental model
 * ============================================================
 *
 *
 *                 Node.js Application
 *                         │
 *                         ▼
 *                  JavaScript Code
 *                         │
 *                         ▼
 *                    Call Stack
 *                         │
 *                         ▼
 *                Node.js / libuv
 *                         │
 *             ┌───────────┴───────────┐
 *             ▼                       ▼
 *          OS I/O                 Thread Pool
 *             │                       │
 *             └───────────┬───────────┘
 *                         ▼
 *                    Event Loop
 *                         │
 *             ┌───────────┼───────────┐
 *             ▼           ▼           ▼
 *          Timers        Poll       Check
 *             │           │           │
 *             └───────────┼───────────┘
 *                         ▼
 *                    Callbacks
 *
 *
 * Along the way:
 *
 *     process.nextTick()
 *
 *     Promise microtasks
 *
 *     queueMicrotask()
 *
 * are processed according to Node.js's scheduling rules.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. MOST IMPORTANT CONCEPT
 * ============================================================
 *
 *
 * Node.js does NOT mean:
 *
 *     "JavaScript can magically do everything in parallel."
 *
 *
 * It means:
 *
 *     "Node.js can efficiently coordinate asynchronous work,
 *      especially I/O, without blocking the main JavaScript
 *      execution path."
 *
 *
 * CPU-heavy JavaScript still needs special handling.
 *
 * ============================================================
 */

/*
 * ============================================================
 * SUMMARY
 * ============================================================
 *
 *
 * CALL STACK
 *
 *     Executes synchronous JavaScript.
 *
 *
 * EVENT LOOP
 *
 *     Coordinates asynchronous callbacks and event-loop phases.
 *
 *
 * MICROTASKS
 *
 *     Promise callbacks
 *     queueMicrotask()
 *
 *
 * NODE NEXT TICK
 *
 *     process.nextTick()
 *
 *
 * TIMERS
 *
 *     setTimeout()
 *     setInterval()
 *
 *
 * CHECK
 *
 *     setImmediate()
 *
 *
 * I/O
 *
 *     File system
 *     Network
 *     Sockets
 *
 *
 * IMPORTANT:
 *
 *     Async I/O ≠ new JavaScript thread.
 *
 *     await ≠ blocking the whole process.
 *
 *     setTimeout(0) ≠ immediate execution.
 *
 *     CPU-heavy synchronous code = event-loop blocking.
 *
 * ============================================================
 */
