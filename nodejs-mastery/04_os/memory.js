/**
 * ============================================================
 * Node.js OS Module - Memory
 * ============================================================
 *
 * File: memory.js
 *
 * Built-in modules:
 *
 *     node:os
 *     node:process
 *
 * ============================================================
 *
 * In this file we learn:
 *
 *     1. Total system memory
 *     2. Free system memory
 *     3. Used system memory
 *     4. Memory percentage
 *     5. Converting bytes to MB / GB
 *     6. Node.js process memory
 *     7. heapUsed
 *     8. heapTotal
 *     9. external memory
 *    10. rss
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Import the OS module
 * ============================================================
 */

const os = require("node:os");

/*
 * ============================================================
 * 2. Total system memory
 * ============================================================
 *
 * `os.totalmem()` returns the total amount of system memory
 * available to the operating system.
 *
 * IMPORTANT:
 *
 * The value is returned in BYTES.
 *
 * Example:
 *
 *     17179869184
 *
 * could represent approximately 16 GB.
 *
 * ============================================================
 */

const totalMemory = os.totalmem();

console.log("Total Memory:", totalMemory, "bytes");

/*
 * ============================================================
 * 3. Free system memory
 * ============================================================
 *
 * `os.freemem()` returns the amount of free system memory.
 *
 * Again, the value is returned in bytes.
 *
 * ============================================================
 */

const freeMemory = os.freemem();

console.log("Free Memory:", freeMemory, "bytes");

/*
 * ============================================================
 * 4. Used system memory
 * ============================================================
 *
 * A simple calculation:
 *
 *
 *     used = total - free
 *
 * ============================================================
 */

const usedMemory = totalMemory - freeMemory;

console.log("Used Memory:", usedMemory, "bytes");

/*
 * ============================================================
 * 5. Convert bytes to MB
 * ============================================================
 *
 * Memory units:
 *
 *
 *     1 KB = 1024 bytes
 *     1 MB = 1024 KB
 *     1 GB = 1024 MB
 *
 * Therefore:
 *
 *
 *     bytes / 1024 / 1024
 *
 *     = MB
 *
 * ============================================================
 */

function bytesToMB(bytes) {
  return bytes / 1024 / 1024;
}

console.log("Total Memory:", bytesToMB(totalMemory).toFixed(2), "MB");

/*
 * ============================================================
 * 6. Convert bytes to GB
 * ============================================================
 */

function bytesToGB(bytes) {
  return bytes / 1024 / 1024 / 1024;
}

console.log("Total Memory:", bytesToGB(totalMemory).toFixed(2), "GB");

/*
 * ============================================================
 * 7. Free memory in GB
 * ============================================================
 */

console.log("Free Memory:", bytesToGB(freeMemory).toFixed(2), "GB");

/*
 * ============================================================
 * 8. Used memory in GB
 * ============================================================
 */

console.log("Used Memory:", bytesToGB(usedMemory).toFixed(2), "GB");

/*
 * ============================================================
 * 9. Memory usage percentage
 * ============================================================
 *
 * Formula:
 *
 *
 *             used memory
 *     -------------------------- × 100
 *             total memory
 *
 * ============================================================
 */

const memoryUsagePercentage = (usedMemory / totalMemory) * 100;

console.log("System Memory Usage:", memoryUsagePercentage.toFixed(2), "%");

/*
 * ============================================================
 * 10. Create a memory information object
 * ============================================================
 */

const systemMemory = {
  totalBytes: totalMemory,

  freeBytes: freeMemory,

  usedBytes: usedMemory,

  totalGB: bytesToGB(totalMemory),

  freeGB: bytesToGB(freeMemory),

  usedGB: bytesToGB(usedMemory),

  usagePercentage: memoryUsagePercentage,
};

console.log("\nSystem Memory:");

console.log(systemMemory);

/*
 * ============================================================
 * 11. JSON output
 * ============================================================
 */

console.log("\nSystem Memory JSON:");

console.log(JSON.stringify(systemMemory, null, 2));

/*
 * ============================================================
 * 12. IMPORTANT:
 *
 * System memory != Node.js process memory
 * ============================================================
 *
 * This is one of the most important concepts in this file.
 *
 *
 * `os.totalmem()`
 * `os.freemem()`
 *
 *
 * describe SYSTEM memory.
 *
 *
 * But:
 *
 *
 * `process.memoryUsage()`
 *
 *
 * describes memory used by the CURRENT NODE.JS PROCESS.
 *
 *
 * These are different measurements.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Node.js process memory
 * ============================================================
 *
 * Node.js provides:
 *
 *
 *     process.memoryUsage()
 *
 *
 * It returns an object containing several memory measurements.
 *
 * ============================================================
 */

const processMemory = process.memoryUsage();

console.log("\nNode.js Process Memory:");

console.log(processMemory);

/*
 * Example structure:
 *
 *
 * {
 *   rss: ...,
 *   heapTotal: ...,
 *   heapUsed: ...,
 *   external: ...,
 *   arrayBuffers: ...
 * }
 *
 *
 * Exact values depend on your application and Node.js version.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. RSS
 * ============================================================
 *
 * RSS means:
 *
 *
 *     Resident Set Size
 *
 *
 * It represents the amount of memory held in RAM for the
 * Node.js process.
 *
 * ============================================================
 */

console.log("RSS:", bytesToMB(processMemory.rss).toFixed(2), "MB");

/*
 * ============================================================
 * 15. heapTotal
 * ============================================================
 *
 * `heapTotal` is the total size of the V8 JavaScript heap
 * currently allocated.
 *
 *
 * V8 is the JavaScript engine used by Node.js.
 *
 * ============================================================
 */

console.log("Heap Total:", bytesToMB(processMemory.heapTotal).toFixed(2), "MB");

/*
 * ============================================================
 * 16. heapUsed
 * ============================================================
 *
 * `heapUsed` is the amount of V8 heap memory currently being
 * used by JavaScript objects.
 *
 * ============================================================
 */

console.log("Heap Used:", bytesToMB(processMemory.heapUsed).toFixed(2), "MB");

/*
 * ============================================================
 * 17. Heap usage percentage
 * ============================================================
 */

const heapUsagePercentage =
  (processMemory.heapUsed / processMemory.heapTotal) * 100;

console.log("Heap Usage:", heapUsagePercentage.toFixed(2), "%");

/*
 * ============================================================
 * 18. external
 * ============================================================
 *
 * `external` represents memory used by Node.js objects that
 * are associated with native resources outside the V8 heap.
 *
 * Examples can include memory associated with:
 *
 *     - Buffers
 *     - Native bindings
 *
 * ============================================================
 */

console.log(
  "External Memory:",
  bytesToMB(processMemory.external).toFixed(2),
  "MB",
);

/*
 * ============================================================
 * 19. arrayBuffers
 * ============================================================
 *
 * Modern Node.js versions may expose:
 *
 *
 *     arrayBuffers
 *
 *
 * This tracks memory allocated for ArrayBuffer and related
 * objects.
 *
 * ============================================================
 */

if (processMemory.arrayBuffers !== undefined) {
  console.log(
    "ArrayBuffer Memory:",
    bytesToMB(processMemory.arrayBuffers).toFixed(2),
    "MB",
  );
}

/*
 * ============================================================
 * 20. Helper function for process memory
 * ============================================================
 */

function getProcessMemory() {
  const memory = process.memoryUsage();

  return {
    rssMB: bytesToMB(memory.rss),

    heapTotalMB: bytesToMB(memory.heapTotal),

    heapUsedMB: bytesToMB(memory.heapUsed),

    externalMB: bytesToMB(memory.external),

    arrayBuffersMB:
      memory.arrayBuffers !== undefined
        ? bytesToMB(memory.arrayBuffers)
        : undefined,
  };
}

console.log("\nProcess Memory Summary:");

console.log(getProcessMemory());

/*
 * ============================================================
 * 21. Why memory monitoring matters
 * ============================================================
 *
 * Memory problems can cause:
 *
 *
 *     - Slow applications
 *     - Garbage collection pressure
 *     - Out-of-memory errors
 *     - Process crashes
 *     - Container restarts
 *     - Poor application performance
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Memory leak
 * ============================================================
 *
 * A memory leak happens when an application unintentionally
 * keeps references to objects that it no longer needs.
 *
 *
 * Conceptually:
 *
 *
 *     Request
 *        │
 *        ▼
 *     create object
 *        │
 *        ▼
 *     object should be released
 *        │
 *        X
 *     reference still exists
 *        │
 *        ▼
 *     memory remains used
 *
 *
 * Repeating this can continuously increase memory usage.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Simple memory leak example
 * ============================================================
 *
 * DO NOT use this pattern in a real application.
 *
 * It is only for understanding the concept.
 *
 *
 *     const data = [];
 *
 *     setInterval(() => {
 *
 *       data.push(
 *         Buffer.alloc(
 *           1024 * 1024,
 *         ),
 *       );
 *
 *     }, 1000);
 *
 *
 * The array keeps references to every Buffer.
 *
 * Therefore the memory cannot be reclaimed while those
 * references remain.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Garbage collection
 * ============================================================
 *
 * JavaScript uses automatic garbage collection.
 *
 *
 * Conceptually:
 *
 *
 *     Object created
 *          │
 *          ▼
 *     Object referenced
 *          │
 *          ▼
 *     Reference removed
 *          │
 *          ▼
 *     Object becomes unreachable
 *          │
 *          ▼
 *     Garbage Collector
 *          │
 *          ▼
 *     Memory can be reclaimed
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Heap vs RSS
 * ============================================================
 *
 *
 * HEAP
 *
 *     Mainly JavaScript/V8 managed memory.
 *
 *
 * RSS
 *
 *     Resident memory occupied by the Node.js process.
 *
 *
 * Therefore:
 *
 *
 *     heapUsed
 *
 * is NOT the same as:
 *
 *
 *     rss
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. System memory monitoring
 * ============================================================
 */

function getSystemMemory() {
  const total = os.totalmem();

  const free = os.freemem();

  const used = total - free;

  return {
    totalGB: Number(bytesToGB(total).toFixed(2)),

    freeGB: Number(bytesToGB(free).toFixed(2)),

    usedGB: Number(bytesToGB(used).toFixed(2)),

    usagePercentage: Number(((used / total) * 100).toFixed(2)),
  };
}

console.log("\nSystem Memory Summary:");

console.log(getSystemMemory());

/*
 * ============================================================
 * 27. Monitoring memory periodically
 * ============================================================
 *
 * We can periodically inspect memory.
 *
 * ============================================================
 */

const memoryMonitor = setInterval(() => {
  const total = os.totalmem();

  const free = os.freemem();

  const used = total - free;

  const usage = (used / total) * 100;

  console.log(`Memory Usage: ${usage.toFixed(2)}%`);
}, 5000);

/*
 * Stop this learning example after 15 seconds.
 *
 * In a real monitoring service, the process would normally
 * continue running.
 *
 * ============================================================
 */

setTimeout(() => {
  clearInterval(memoryMonitor);

  console.log("Memory monitoring stopped.");
}, 15_000);

/*
 * ============================================================
 * 28. Memory monitoring in backend applications
 * ============================================================
 *
 * A production backend may expose internal metrics such as:
 *
 *
 *     {
 *       "rss": 120,
 *       "heapUsed": 45,
 *       "heapTotal": 80
 *     }
 *
 *
 * Monitoring systems can track these values over time.
 *
 * This helps detect:
 *
 *     - Memory leaks
 *     - Unexpected growth
 *     - Resource pressure
 *     - Application instability
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Container environments
 * ============================================================
 *
 * In Docker/Kubernetes environments, memory limits matter.
 *
 *
 * Conceptually:
 *
 *
 *     Physical Machine
 *            │
 *            ├── Container A
 *            │      └── Node.js
 *            │
 *            └── Container B
 *
 *
 * The application may have resource limits that differ from
 * the physical host.
 *
 *
 * Therefore production monitoring should understand both:
 *
 *     - process memory
 *     - container memory limits
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Practical difference
 * ============================================================
 *
 *
 * os.totalmem()
 *
 *     Total system memory.
 *
 *
 * os.freemem()
 *
 *     Free system memory.
 *
 *
 * process.memoryUsage()
 *
 *     Memory used by the Node.js process.
 *
 *
 * process.memoryUsage().heapUsed
 *
 *     JavaScript heap currently in use.
 *
 *
 * process.memoryUsage().rss
 *
 *     Resident memory used by the process.
 *
 * ============================================================
 */

/*
 * ============================================================
 * FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * System total memory:
 *
 *     os.totalmem();
 *
 *
 * System free memory:
 *
 *     os.freemem();
 *
 *
 * System used memory:
 *
 *     os.totalmem() - os.freemem();
 *
 *
 * Node.js process memory:
 *
 *     process.memoryUsage();
 *
 *
 * RSS:
 *
 *     process.memoryUsage().rss;
 *
 *
 * V8 heap total:
 *
 *     process.memoryUsage().heapTotal;
 *
 *
 * V8 heap used:
 *
 *     process.memoryUsage().heapUsed;
 *
 *
 * External memory:
 *
 *     process.memoryUsage().external;
 *
 *
 * ArrayBuffer memory:
 *
 *     process.memoryUsage().arrayBuffers;
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     `node:os` tells you about SYSTEM memory.
 *
 *     `process.memoryUsage()` tells you about the
 *     CURRENT NODE.JS PROCESS.
 *
 * ============================================================
 */
