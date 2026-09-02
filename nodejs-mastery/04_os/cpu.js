/**
 * ============================================================
 * Node.js OS Module - CPU
 * ============================================================
 *
 * File: cpu.js
 *
 * Built-in module:
 *
 *     node:os
 *
 * ============================================================
 *
 * In this file we learn how Node.js can inspect CPU information.
 *
 * Topics:
 *
 *     os.cpus()
 *     CPU model
 *     CPU speed
 *     CPU cores
 *     logical processors
 *     CPU architecture
 *     load balancing concepts
 *
 * ============================================================
 */

// Import Node.js built-in OS module.
const os = require("node:os");

/*
 * ============================================================
 * 1. Get CPU information
 * ============================================================
 *
 * `os.cpus()` returns information about each logical CPU.
 *
 * The result is an array.
 *
 * Example conceptually:
 *
 * [
 *   {
 *     model: "Intel...",
 *     speed: 2400,
 *     times: {
 *       user: 100,
 *       nice: 0,
 *       sys: 50,
 *       idle: 1000,
 *       irq: 0
 *     }
 *   }
 * ]
 *
 * ============================================================
 */

const cpus = os.cpus();

console.log("CPU Information:", cpus);

/*
 * ============================================================
 * 2. Number of logical CPUs
 * ============================================================
 *
 * Since os.cpus() returns an array, its length tells us the
 * number of logical processors reported by Node.js.
 *
 * ============================================================
 */

console.log("Logical CPU Count:", cpus.length);

/*
 * Example:
 *
 *     Logical CPU Count: 8
 *
 *
 * This does NOT necessarily mean the computer has 8 physical
 * CPU cores.
 *
 * Modern CPUs can expose multiple logical processors per
 * physical core through technologies such as SMT/Hyper-Threading.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. CPU model
 * ============================================================
 *
 * Every CPU entry contains a `model` property.
 *
 * Usually all logical CPUs on the same machine report the same
 * model.
 *
 * ============================================================
 */

if (cpus.length > 0) {
  console.log("CPU Model:", cpus[0].model);
}

/*
 * ============================================================
 * 4. CPU speed
 * ============================================================
 *
 * Each CPU entry also contains:
 *
 *     speed
 *
 * The value is generally represented in MHz.
 *
 * ============================================================
 */

if (cpus.length > 0) {
  console.log("CPU Speed:", cpus[0].speed, "MHz");
}

/*
 * ============================================================
 * 5. Convert MHz to GHz
 * ============================================================
 */

if (cpus.length > 0) {
  const speedGHz = cpus[0].speed / 1000;

  console.log("CPU Speed:", speedGHz.toFixed(2), "GHz");
}

/*
 * ============================================================
 * 6. Print every logical CPU
 * ============================================================
 */

cpus.forEach((cpu, index) => {
  console.log(`CPU ${index + 1}:`);

  console.log("  Model:", cpu.model);

  console.log("  Speed:", cpu.speed, "MHz");
});

/*
 * ============================================================
 * 7. CPU times
 * ============================================================
 *
 * Each CPU object has a `times` property.
 *
 *
 * Example:
 *
 *     {
 *       user: 12345,
 *       nice: 0,
 *       sys: 2345,
 *       idle: 56789,
 *       irq: 0
 *     }
 *
 *
 * These values represent CPU time spent in different states.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. CPU times
 * ============================================================
 */

if (cpus.length > 0) {
  console.log("CPU Times:", cpus[0].times);
}

/*
 * ============================================================
 * 9. Understanding CPU times
 * ============================================================
 *
 * user
 *
 *     Time spent executing user-level code.
 *
 *
 * nice
 *
 *     Time spent executing processes with adjusted priority.
 *
 *
 * sys
 *
 *     Time spent executing operating-system/kernel code.
 *
 *
 * idle
 *
 *     Time when the CPU was idle.
 *
 *
 * irq
 *
 *     Time spent handling hardware interrupts.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Calculate CPU usage
 * ============================================================
 *
 * We can estimate CPU usage by comparing CPU times at two
 * different moments.
 *
 * CPU usage:
 *
 *
 *     total - idle
 *     ───────────── × 100
 *        total
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Get total CPU time
 * ============================================================
 */

function getCpuTimes() {
  const currentCpus = os.cpus();

  return currentCpus.map((cpu) => {
    const times = cpu.times;

    const total = times.user + times.nice + times.sys + times.idle + times.irq;

    return {
      user: times.user,

      nice: times.nice,

      sys: times.sys,

      idle: times.idle,

      irq: times.irq,

      total,
    };
  });
}

console.log("CPU Times Snapshot:");

console.log(getCpuTimes());

/*
 * ============================================================
 * 12. CPU usage requires two snapshots
 * ============================================================
 *
 * One snapshot only tells us accumulated CPU time.
 *
 * To calculate CPU utilization over a period:
 *
 *
 *     Snapshot 1
 *          │
 *          │ wait
 *          ▼
 *     Snapshot 2
 *
 *
 * Then compare the difference.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Calculate CPU usage between snapshots
 * ============================================================
 */

function calculateCpuUsage(previous, current) {
  const totalDelta = current.total - previous.total;

  const idleDelta = current.idle - previous.idle;

  if (totalDelta <= 0) {
    return 0;
  }

  const usage = ((totalDelta - idleDelta) / totalDelta) * 100;

  return usage;
}

/*
 * ============================================================
 * 14. Monitor CPU usage
 * ============================================================
 *
 * The following example takes two CPU snapshots one second
 * apart.
 *
 * ============================================================
 */

function getCombinedCpuTimes() {
  const currentCpus = os.cpus();

  return currentCpus.reduce(
    (total, cpu) => {
      const times = cpu.times;

      total.user += times.user;

      total.nice += times.nice;

      total.sys += times.sys;

      total.idle += times.idle;

      total.irq += times.irq;

      return total;
    },
    {
      user: 0,
      nice: 0,
      sys: 0,
      idle: 0,
      irq: 0,
    },
  );
}

const firstSnapshot = getCombinedCpuTimes();

setTimeout(() => {
  const secondSnapshot = getCombinedCpuTimes();

  const previous = {
    ...firstSnapshot,

    total:
      firstSnapshot.user +
      firstSnapshot.nice +
      firstSnapshot.sys +
      firstSnapshot.idle +
      firstSnapshot.irq,
  };

  const current = {
    ...secondSnapshot,

    total:
      secondSnapshot.user +
      secondSnapshot.nice +
      secondSnapshot.sys +
      secondSnapshot.idle +
      secondSnapshot.irq,
  };

  const usage = calculateCpuUsage(previous, current);

  console.log("\nApproximate CPU Usage:", usage.toFixed(2), "%");
}, 1000);

/*
 * ============================================================
 * 15. Why CPU monitoring matters
 * ============================================================
 *
 * CPU information is useful for:
 *
 *     - Server monitoring
 *     - Performance debugging
 *     - Load balancing
 *     - Worker processes
 *     - Worker threads
 *     - Cluster architecture
 *     - Capacity planning
 *     - Health monitoring
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Node.js and CPU
 * ============================================================
 *
 * Node.js uses an event-driven architecture.
 *
 * JavaScript execution normally happens on the main thread.
 *
 *
 * Conceptually:
 *
 *
 *                  Node.js
 *                     │
 *                     ▼
 *                Event Loop
 *                     │
 *             ┌───────┴───────┐
 *             ▼               ▼
 *        JavaScript       Async I/O
 *          work
 *
 *
 * CPU-heavy JavaScript can block the event loop.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. CPU-heavy work
 * ============================================================
 *
 * Examples:
 *
 *     - Large mathematical calculations
 *     - Image processing
 *     - Video processing
 *     - Machine learning calculations
 *     - Large JSON transformations
 *     - Compression
 *
 *
 * If heavy CPU work runs on the main JavaScript thread for too
 * long, HTTP requests and other event-loop work can become slow.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. What can we use for CPU-heavy work?
 * ============================================================
 *
 * Node.js provides several approaches:
 *
 *
 *     worker_threads
 *     child_process
 *     cluster
 *
 *
 * These will be studied later in:
 *
 *
 *     29_performance/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Logical CPU count and workers
 * ============================================================
 *
 * A common starting point for CPU-bound workloads is to inspect:
 *
 *
 *     os.cpus().length
 *
 *
 * Example:
 *
 *
 *     const cpuCount =
 *       os.cpus().length;
 *
 *
 * This can help inform worker-process/thread sizing.
 *
 *
 * IMPORTANT:
 *
 * Do not blindly create one worker per CPU for every workload.
 * Actual worker counts should account for:
 *
 *     - I/O
 *     - memory
 *     - workload characteristics
 *     - container CPU limits
 *     - operating-system scheduling
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. CPU architecture
 * ============================================================
 *
 * We can also check the architecture:
 *
 */

console.log("CPU Architecture:", os.arch());

/*
 * Examples:
 *
 *     x64
 *     arm64
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. CPU information function
 * ============================================================
 */

function getCpuInfo() {
  const processors = os.cpus();

  return {
    count: processors.length,

    model: processors[0]?.model,

    speedMHz: processors[0]?.speed,

    speedGHz: processors[0] ? processors[0].speed / 1000 : undefined,

    architecture: os.arch(),
  };
}

console.log("\nCPU Summary:");

console.log(getCpuInfo());

/*
 * ============================================================
 * 22. Optional chaining
 * ============================================================
 *
 * Notice:
 *
 *
 *     processors[0]?.model
 *
 *
 * The `?.` operator prevents an error if processors[0] is
 * undefined.
 *
 *
 * This is useful when working with values that might not exist.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. CPU count vs physical cores
 * ============================================================
 *
 * Important:
 *
 *
 *     os.cpus().length
 *
 *
 * gives logical processors reported by Node.
 *
 * It does NOT directly tell you:
 *
 *
 *     physical core count
 *
 *
 * For example:
 *
 *
 *     4 physical cores
 *           +
 *     SMT / Hyper-Threading
 *           =
 *     8 logical processors
 *
 *
 * So:
 *
 *
 *     os.cpus().length === 8
 *
 *
 * does not necessarily mean 8 physical cores.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. CPU model
 * ============================================================
 *
 * You can retrieve the model:
 */

const cpuModel = cpus[0]?.model;

console.log("CPU Model:", cpuModel);

/*
 * ============================================================
 * 25. Practical backend example
 * ============================================================
 *
 * Imagine:
 *
 *
 *     GET /health
 *
 *
 * You might internally collect:
 *
 *
 *     {
 *       cpuCount: 8,
 *       architecture: "x64",
 *       cpuUsage: 23.4
 *     }
 *
 *
 * Monitoring systems can use this information to detect
 * resource pressure.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Don't confuse CPU usage with Node.js event-loop usage
 * ============================================================
 *
 * System CPU usage:
 *
 *     How busy the CPU is.
 *
 *
 * Event-loop latency:
 *
 *     How long Node's JavaScript/event-loop work is being
 *     delayed.
 *
 *
 * A server can have:
 *
 *     low overall CPU
 *
 * while still having:
 *
 *     event-loop blocking problems
 *
 *
 * Therefore production monitoring usually measures more than
 * CPU percentage.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Useful CPU APIs
 * ============================================================
 *
 *
 * os.cpus()
 *
 *     Returns logical CPU information.
 *
 *
 * os.arch()
 *
 *     Returns Node.js CPU architecture.
 *
 *
 * os.availableParallelism()
 *
 *     Returns an estimate of the amount of parallelism that
 *     should be available to the application.
 *
 *
 * `availableParallelism()` can be especially useful in modern
 * environments such as containers where the application may have
 * CPU limits that differ from the host machine.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. availableParallelism()
 * ============================================================
 *
 * Modern Node.js provides:
 *
 *
 *     os.availableParallelism()
 *
 *
 * when supported by the Node.js version.
 *
 * ============================================================
 */

if (typeof os.availableParallelism === "function") {
  console.log("Available Parallelism:", os.availableParallelism());
}

/*
 * ============================================================
 * 29. os.cpus() vs availableParallelism()
 * ============================================================
 *
 *
 * os.cpus().length
 *
 *     Number of logical CPUs reported by the OS.
 *
 *
 * os.availableParallelism()
 *
 *     An estimate of how much parallelism the application
 *     should use.
 *
 *
 * In containerized/cloud environments, availableParallelism()
 * can be a better signal for sizing workers.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Final mental model
 * ============================================================
 *
 *
 *             node:os
 *                │
 *                ▼
 *            os.cpus()
 *                │
 *       ┌────────┼────────┐
 *       ▼        ▼        ▼
 *     model    speed    times
 *                         │
 *                         ▼
 *                 CPU utilization
 *
 *
 * Also:
 *
 *
 *     os.arch()
 *          │
 *          ▼
 *     CPU architecture
 *
 *
 *     os.availableParallelism()
 *          │
 *          ▼
 *     Suggested parallelism
 *
 * ============================================================
 */

/*
 * ============================================================
 * FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * Import:
 *
 *     const os = require("node:os");
 *
 *
 * CPU information:
 *
 *     os.cpus();
 *
 *
 * Logical CPU count:
 *
 *     os.cpus().length;
 *
 *
 * CPU model:
 *
 *     os.cpus()[0].model;
 *
 *
 * CPU speed:
 *
 *     os.cpus()[0].speed;
 *
 *
 * CPU times:
 *
 *     os.cpus()[0].times;
 *
 *
 * Architecture:
 *
 *     os.arch();
 *
 *
 * Available parallelism:
 *
 *     os.availableParallelism();
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     `os.cpus()` gives CPU information, while
 *     `os.availableParallelism()` helps determine how much
 *     parallel work the application should reasonably use.
 *
 * ============================================================
 */
