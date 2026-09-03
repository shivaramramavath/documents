/*
 * ============================================================
 * 21_bullmq.js
 * ============================================================
 *
 * BullMQ + ioredis
 *
 * Features:
 *
 * 1. Queue
 * 2. Producer
 * 3. Worker
 * 4. Concurrency
 * 5. Retry
 * 6. Exponential backoff
 * 7. Delayed jobs
 * 8. Job priority
 * 9. Job progress
 * 10. Job lifecycle
 * 11. QueueEvents
 * 12. Flow / parent-child jobs
 * 13. Rate limiting
 * 14. Job removal
 * 15. Graceful shutdown
 *
 * ============================================================
 */

import { Queue, Worker, QueueEvents, FlowProducer, Job } from "bullmq";

import IORedis from "ioredis";

/*
 * ============================================================
 * Redis connection
 * ============================================================
 */

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

/*
 * BullMQ uses Redis heavily.
 *
 * maxRetriesPerRequest:
 *
 * BullMQ workers should normally use
 * null so commands can wait/retry
 * without ioredis failing them early.
 */

const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,

  enableReadyCheck: true,

  lazyConnect: false,
});

/*
 * ============================================================
 * Redis events
 * ============================================================
 */

connection.on("connect", () => {
  console.log("[redis] connected");
});

connection.on("ready", () => {
  console.log("[redis] ready");
});

connection.on("error", (error) => {
  console.error("[redis] error:", error);
});

/*
 * ============================================================
 * Queue name
 * ============================================================
 */

const QUEUE_NAME = "timetable";

/*
 * ============================================================
 * Queue
 * ============================================================
 */

const timetableQueue = new Queue(
  QUEUE_NAME,

  {
    connection,

    /*
     * Default job options.
     */

    defaultJobOptions: {
      /*
       * Keep completed jobs for
       * debugging / monitoring.
       */

      removeOnComplete: {
        age: 60 * 60,

        count: 1000,
      },

      /*
       * Keep failed jobs longer.
       */

      removeOnFail: {
        age: 24 * 60 * 60,

        count: 5000,
      },

      /*
       * Retry failed jobs.
       */

      attempts: 3,

      /*
       * Wait:
       *
       * 2s
       * 4s
       * 8s
       *
       * etc.
       */

      backoff: {
        type: "exponential",

        delay: 2000,
      },
    },
  },
);

/*
 * ============================================================
 * Producer
 * ============================================================
 */

async function addTimetableJob({ organizationId, departmentId, semesterId }) {
  const job = await timetableQueue.add(
    "generate-timetable",

    {
      organizationId,

      departmentId,

      semesterId,
    },

    {
      /*
       * Higher priority = processed earlier.
       */

      priority: 1,
    },
  );

  console.log("[producer] job added:", job.id);

  return job;
}

/*
 * ============================================================
 * Add job with delay
 * ============================================================
 */

async function addDelayedJob({
  organizationId,
  departmentId,
  semesterId,
  delayMs,
}) {
  const job = await timetableQueue.add(
    "generate-timetable",

    {
      organizationId,

      departmentId,

      semesterId,
    },

    {
      delay: delayMs,
    },
  );

  console.log("[producer] delayed job:", job.id);

  return job;
}

/*
 * ============================================================
 * Add job with custom retry
 * ============================================================
 */

async function addRetryableJob(data) {
  const job = await timetableQueue.add(
    "generate-timetable",

    data,

    {
      attempts: 5,

      backoff: {
        type: "exponential",

        delay: 1000,
      },
    },
  );

  return job;
}

/*
 * ============================================================
 * Idempotent / deduplicated job
 * ============================================================
 *
 * jobId prevents accidentally creating
 * duplicate jobs with the same ID.
 * ============================================================
 */

async function addUniqueJob({ organizationId, departmentId, semesterId }) {
  const jobId =
    `timetable:${organizationId}:` + `${departmentId}:${semesterId}`;

  const job = await timetableQueue.add(
    "generate-timetable",

    {
      organizationId,

      departmentId,

      semesterId,
    },

    {
      jobId,
    },
  );

  return job;
}

/*
 * ============================================================
 * Batch jobs
 * ============================================================
 */

async function addBatchJobs(departments) {
  const jobs = departments.map((department) => ({
    name: "generate-timetable",

    data: {
      departmentId: department.id,

      semesterId: department.semesterId,
    },

    opts: {
      attempts: 3,
    },
  }));

  const result = await timetableQueue.addBulk(jobs);

  console.log("[producer] bulk jobs:", result.length);

  return result;
}

/*
 * ============================================================
 * Worker
 * ============================================================
 */

const timetableWorker = new Worker(
  QUEUE_NAME,

  async (job) => {
    console.log(
      "[worker] processing:",
      job.id,

      job.name,
    );

    /*
     * Report progress.
     */

    await job.updateProgress(10);

    /*
     * Example:
     *
     * Load timetable resources.
     */

    await sleep(500);

    await job.updateProgress(30);

    /*
     * Example:
     *
     * Run constraint processing.
     */

    await sleep(500);

    await job.updateProgress(60);

    /*
     * Example:
     *
     * Run LangGraph.
     */

    await sleep(1000);

    await job.updateProgress(90);

    /*
     * Example:
     *
     * Save generated timetable
     * into MongoDB.
     */

    await sleep(500);

    await job.updateProgress(100);

    console.log("[worker] completed:", job.id);

    return {
      success: true,

      timetableId: `tt-${job.id}`,
    };
  },

  {
    connection,

    /*
     * Number of jobs processed
     * concurrently by this worker.
     */

    concurrency: 5,

    /*
     * Worker-level rate limit.
     */

    limiter: {
      max: 20,

      duration: 1000,
    },
  },
);

/*
 * ============================================================
 * Worker events
 * ============================================================
 */

timetableWorker.on("completed", (job, result) => {
  console.log(
    "[worker] completed event:",

    {
      id: job.id,

      result,
    },
  );
});

timetableWorker.on("failed", (job, error) => {
  console.error(
    "[worker] failed:",

    {
      id: job?.id,

      attempts: job?.attemptsMade,

      error: error.message,
    },
  );
});

timetableWorker.on("error", (error) => {
  console.error("[worker] error:", error);
});

timetableWorker.on("stalled", (jobId) => {
  console.warn("[worker] stalled:", jobId);
});

/*
 * ============================================================
 * Queue Events
 * ============================================================
 *
 * QueueEvents listens to events
 * from jobs processed by workers.
 *
 * Useful when:
 *
 * API server
 *      │
 *      │
 *      ├── Worker
 *      │
 *      └── QueueEvents
 *
 * are separate processes.
 * ============================================================
 */

const queueEvents = new QueueEvents(
  QUEUE_NAME,

  {
    connection: new IORedis(REDIS_URL, {
      maxRetriesPerRequest: null,
    }),
  },
);

await queueEvents.waitUntilReady();

queueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log("[events] completed:", {
    jobId,
    returnvalue,
  });
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.error("[events] failed:", {
    jobId,
    failedReason,
  });
});

queueEvents.on("progress", ({ jobId, data }) => {
  console.log("[events] progress:", {
    jobId,
    data,
  });
});

queueEvents.on("waiting", ({ jobId }) => {
  console.log("[events] waiting:", jobId);
});

/*
 * ============================================================
 * Get Job
 * ============================================================
 */

async function getJob(jobId) {
  const job = await Job.fromId(timetableQueue, jobId);

  return job;
}

/*
 * ============================================================
 * Get Job Status
 * ============================================================
 */

async function getJobStatus(jobId) {
  const job = await getJob(jobId);

  if (!job) {
    return {
      exists: false,

      status: "not_found",
    };
  }

  const state = await job.getState();

  return {
    exists: true,

    id: job.id,

    name: job.name,

    state,

    progress: job.progress,

    attemptsMade: job.attemptsMade,

    failedReason: job.failedReason,

    returnvalue: job.returnvalue,
  };
}

/*
 * ============================================================
 * Retry failed job manually
 * ============================================================
 */

async function retryJob(jobId) {
  const job = await getJob(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  await job.retry("failed");

  console.log("[queue] job retried:", jobId);
}

/*
 * ============================================================
 * Remove job
 * ============================================================
 */

async function removeJob(jobId) {
  const job = await getJob(jobId);

  if (!job) {
    return false;
  }

  await job.remove();

  return true;
}

/*
 * ============================================================
 * Pause queue
 * ============================================================
 */

async function pauseQueue() {
  await timetableQueue.pause();

  console.log("[queue] paused");
}

/*
 * ============================================================
 * Resume queue
 * ============================================================
 */

async function resumeQueue() {
  await timetableQueue.resume();

  console.log("[queue] resumed");
}

/*
 * ============================================================
 * Queue metrics
 * ============================================================
 */

async function getQueueMetrics() {
  const counts = await timetableQueue.getJobCounts(
    "waiting",

    "active",

    "completed",

    "failed",

    "delayed",

    "paused",
  );

  return counts;
}

/*
 * ============================================================
 * Clean old jobs
 * ============================================================
 */

async function cleanQueue() {
  /*
   * Remove completed jobs older
   * than one hour.
   */

  const completed = await timetableQueue.clean(
    60 * 60 * 1000,

    1000,

    "completed",
  );

  /*
   * Remove failed jobs older
   * than one day.
   */

  const failed = await timetableQueue.clean(
    24 * 60 * 60 * 1000,

    1000,

    "failed",
  );

  return {
    completed: completed.length,

    failed: failed.length,
  };
}

/*
 * ============================================================
 * Flow Producer
 * ============================================================
 *
 * Parent-child jobs.
 *
 *
 * generate timetable
 *       │
 *       ├── load faculty
 *       ├── load rooms
 *       ├── load subjects
 *       └── generate timetable
 *
 * Parent can wait for children.
 * ============================================================
 */

const flowProducer = new FlowProducer({
  connection,
});

async function createTimetableFlow({ organizationId, departmentId }) {
  const flow = await flowProducer.add({
    name: "generate-complete-timetable",

    queueName: QUEUE_NAME,

    data: {
      organizationId,

      departmentId,
    },

    children: [
      {
        name: "load-faculty",

        queueName: QUEUE_NAME,

        data: {
          departmentId,
        },
      },

      {
        name: "load-rooms",

        queueName: QUEUE_NAME,

        data: {
          departmentId,
        },
      },

      {
        name: "load-subjects",

        queueName: QUEUE_NAME,

        data: {
          departmentId,
        },
      },
    ],
  });

  console.log("[flow] created:", flow.job.id);

  return flow;
}

/*
 * ============================================================
 * Sleep helper
 * ============================================================
 */

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/*
 * ============================================================
 * Example producer
 * ============================================================
 */

async function producerExample() {
  const job = await addTimetableJob({
    organizationId: "org-001",

    departmentId: "CSE",

    semesterId: "SEM-5",
  });

  console.log("Created:", job.id);

  /*
   * Wait a little so the
   * worker can process it.
   */

  await sleep(3000);

  console.log(
    "Status:",

    await getJobStatus(job.id),
  );
}

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  try {
    /*
     * Wait for Redis.
     */

    await connection.ping();

    console.log("\n================================================");

    console.log("BullMQ started");

    console.log("================================================\n");

    /*
     * Add normal job.
     */

    await producerExample();

    /*
     * Queue metrics.
     */

    console.log(
      "Metrics:",

      await getQueueMetrics(),
    );

    /*
     * Delayed job.
     */

    await addDelayedJob({
      organizationId: "org-001",

      departmentId: "ECE",

      semesterId: "SEM-5",

      delayMs: 5000,
    });

    /*
     * Unique job.
     */

    await addUniqueJob({
      organizationId: "org-001",

      departmentId: "CSE",

      semesterId: "SEM-6",
    });

    /*
     * Flow example.
     *
     * Uncomment when learning flows.
     */

    /*
    await createTimetableFlow({

      organizationId:
        "org-001",

      departmentId:
        "CSE",

    });
    */
  } catch (error) {
    console.error("[main] error:", error);
  }
}

/*
 * ============================================================
 * Graceful shutdown
 * ============================================================
 */

async function shutdown(signal) {
  console.log(`\nReceived ${signal}`);

  try {
    /*
     * Stop accepting new work
     * and finish current jobs.
     */

    await timetableWorker.close();

    await queueEvents.close();

    await flowProducer.close();

    await timetableQueue.close();

    await connection.quit();

    console.log("[shutdown] complete");
  } catch (error) {
    console.error("[shutdown] error:", error);
  }

  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));

/*
 * ============================================================
 * Start
 * ============================================================
 */

await main();
