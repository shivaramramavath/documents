/*
 * ============================================================
 * 20_queue.js
 * ============================================================
 *
 * Redis Queue using ioredis
 *
 * Features:
 *
 * 1. Producer
 * 2. Consumer
 * 3. FIFO queue
 * 4. Blocking worker
 * 5. Job IDs
 * 6. Job status
 * 7. Retry
 * 8. Dead-letter queue
 * 9. Delayed jobs
 * 10. Priority queues
 * 11. Batch processing
 * 12. Graceful shutdown
 *
 * ============================================================
 */

import Redis from "ioredis";
import crypto from "node:crypto";

/*
 * ============================================================
 * Redis
 * ============================================================
 */

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

const redis = new Redis(REDIS_URL);

/*
 * Separate connection for blocking commands.
 *
 * IMPORTANT:
 *
 * BLPOP / BRPOP blocks the Redis connection.
 *
 * Therefore don't use your normal Redis connection
 * for a worker's blocking operation.
 */

const workerRedis = new Redis(REDIS_URL);

/*
 * ============================================================
 * Queue names
 * ============================================================
 */

const QUEUE_PREFIX = "queue:";

const JOB_PREFIX = "job:";

const PROCESSING_PREFIX = "processing:";

const DLQ_PREFIX = "dlq:";

const DELAYED_PREFIX = "delayed:";

/*
 * Main queue.
 */

const QUEUE_NAME = `${QUEUE_PREFIX}timetable`;

/*
 * Dead-letter queue.
 */

const DLQ_NAME = `${DLQ_PREFIX}timetable`;

/*
 * Processing queue.
 */

const PROCESSING_NAME = `${PROCESSING_PREFIX}timetable`;

/*
 * Delayed queue.
 */

const DELAYED_NAME = `${DELAYED_PREFIX}timetable`;

/*
 * ============================================================
 * Configuration
 * ============================================================
 */

const MAX_RETRIES = 3;

const JOB_TTL = 60 * 60;

/*
 * ============================================================
 * Redis events
 * ============================================================
 */

redis.on("connect", () => {
  console.log("[redis] connected");
});

redis.on("ready", () => {
  console.log("[redis] ready");
});

redis.on("error", (error) => {
  console.error("[redis] error:", error);
});

/*
 * ============================================================
 * Worker Redis events
 * ============================================================
 */

workerRedis.on("error", (error) => {
  console.error("[worker redis] error:", error);
});

/*
 * ============================================================
 * Generate job ID
 * ============================================================
 */

function generateJobId() {
  return crypto.randomBytes(16).toString("hex");
}

/*
 * ============================================================
 * Job key
 * ============================================================
 */

function jobKey(jobId) {
  return `${JOB_PREFIX}${jobId}`;
}

/*
 * ============================================================
 * Serialize
 * ============================================================
 */

function serialize(value) {
  return JSON.stringify(value);
}

/*
 * ============================================================
 * Deserialize
 * ============================================================
 */

function deserialize(value) {
  if (value === null) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/*
 * ============================================================
 * Create Job
 * ============================================================
 */

function createJob({ type, data, priority = "normal" }) {
  const now = Date.now();

  return {
    id: generateJobId(),

    type,

    data,

    priority,

    status: "waiting",

    attempts: 0,

    maxAttempts: MAX_RETRIES,

    createdAt: now,

    updatedAt: now,
  };
}

/*
 * ============================================================
 * Add Job
 * ============================================================
 */

async function addJob({ type, data, priority = "normal" }) {
  const job = createJob({
    type,

    data,

    priority,
  });

  /*
   * Store complete job.
   */

  await redis.set(
    jobKey(job.id),

    serialize(job),

    "EX",

    JOB_TTL,
  );

  /*
   * Add job ID to queue.
   *
   * RPUSH:
   *
   * Producer → right
   *
   * Worker:
   *
   * LPOP from left
   *
   * Therefore:
   *
   * FIFO.
   */

  await redis.rpush(
    QUEUE_NAME,

    job.id,
  );

  console.log("[queue] job added:", job.id);

  return job;
}

/*
 * ============================================================
 * Get Job
 * ============================================================
 */

async function getJob(jobId) {
  const value = await redis.get(jobKey(jobId));

  return deserialize(value);
}

/*
 * ============================================================
 * Update Job
 * ============================================================
 */

async function updateJob(jobId, updates) {
  const job = await getJob(jobId);

  if (!job) {
    return null;
  }

  const updatedJob = {
    ...job,

    ...updates,

    id: job.id,

    updatedAt: Date.now(),
  };

  await redis.set(
    jobKey(jobId),

    serialize(updatedJob),

    "EX",

    JOB_TTL,
  );

  return updatedJob;
}

/*
 * ============================================================
 * Queue size
 * ============================================================
 */

async function getQueueSize() {
  return redis.llen(QUEUE_NAME);
}

/*
 * ============================================================
 * Basic Worker
 * ============================================================
 */

async function processJob(job) {
  console.log("[worker] processing:", job.id);

  /*
   * Simulate work.
   */

  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("[worker] completed:", job.id);

  return {
    success: true,

    result: `Processed ${job.id}`,
  };
}

/*
 * ============================================================
 * Handle job
 * ============================================================
 */

async function handleJob(jobId) {
  const job = await getJob(jobId);

  if (!job) {
    console.warn("[worker] job not found:", jobId);

    return;
  }

  /*
   * Mark processing.
   */

  await updateJob(
    jobId,

    {
      status: "processing",

      attempts: job.attempts + 1,

      startedAt: Date.now(),
    },
  );

  const updatedJob = await getJob(jobId);

  try {
    const result = await processJob(updatedJob);

    /*
     * Mark completed.
     */

    await updateJob(
      jobId,

      {
        status: "completed",

        result,

        completedAt: Date.now(),
      },
    );
  } catch (error) {
    await handleJobFailure(updatedJob, error);
  }
}

/*
 * ============================================================
 * Job failure
 * ============================================================
 */

async function handleJobFailure(job, error) {
  console.error("[worker] failed:", {
    jobId: job.id,

    error: error.message,
  });

  const attempts = job.attempts;

  /*
   * Retry.
   */

  if (attempts < job.maxAttempts) {
    const retryJob = await updateJob(
      job.id,

      {
        status: "retrying",

        lastError: error.message,

        retryAt: Date.now(),
      },
    );

    console.log("[worker] retrying:", retryJob.id);

    /*
     * Requeue.
     */

    await redis.rpush(
      QUEUE_NAME,

      job.id,
    );

    return;
  }

  /*
   * Maximum retries reached.
   */

  await updateJob(
    job.id,

    {
      status: "failed",

      lastError: error.message,

      failedAt: Date.now(),
    },
  );

  /*
   * Dead-letter queue.
   */

  await redis.rpush(
    DLQ_NAME,

    job.id,
  );

  console.log("[worker] moved to DLQ:", job.id);
}

/*
 * ============================================================
 * Blocking worker
 * ============================================================
 *
 * BLPOP:
 *
 * Wait until a job exists.
 *
 * This avoids polling:
 *
 * BAD:
 *
 * while(true) {
 *   check queue
 *   wait
 *   check queue
 * }
 *
 *
 * GOOD:
 *
 * BLPOP
 *
 * Redis wakes worker when a job arrives.
 * ============================================================
 */

let workerRunning = true;

async function worker() {
  console.log("[worker] started");

  while (workerRunning) {
    try {
      /*
       * Wait indefinitely.
       *
       * Return:
       *
       * [
       *   queueName,
       *   jobId
       * ]
       */

      const result = await workerRedis.blpop(QUEUE_NAME, 0);

      if (!result) {
        continue;
      }

      const [queue, jobId] = result;

      console.log("[worker] received:", {
        queue,
        jobId,
      });

      await handleJob(jobId);
    } catch (error) {
      console.error("[worker] error:", error);

      /*
       * Prevent tight error loop.
       */

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log("[worker] stopped");
}

/*
 * ============================================================
 * Reliable queue using processing list
 * ============================================================
 *
 * Problem with BLPOP:
 *
 * Worker receives job
 *       ↓
 * Worker crashes
 *       ↓
 * Job is LOST
 *
 *
 * Solution:
 *
 * BRPOPLPUSH
 *
 * Main queue
 *      ↓
 * Processing queue
 *
 * Job remains in processing queue
 * until explicitly acknowledged.
 * ============================================================
 */

async function reliableWorker() {
  console.log("[reliable-worker] started");

  while (workerRunning) {
    try {
      /*
       * Move job atomically:
       *
       * QUEUE → PROCESSING
       *
       * and wait for a job.
       */

      const jobId = await workerRedis.brpoplpush(
        QUEUE_NAME,

        PROCESSING_NAME,

        0,
      );

      if (!jobId) {
        continue;
      }

      console.log("[reliable-worker] received:", jobId);

      try {
        await handleJob(jobId);

        /*
         * ACK.
         *
         * Remove from processing.
         */

        await redis.lrem(
          PROCESSING_NAME,

          1,

          jobId,
        );
      } catch (error) {
        console.error("[reliable-worker] failed:", error);
      }
    } catch (error) {
      console.error("[reliable-worker] Redis error:", error);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

/*
 * ============================================================
 * Recover abandoned jobs
 * ============================================================
 *
 * If worker crashes:
 *
 * processing:timetable
 *
 * still contains jobs.
 *
 * On startup:
 *
 * inspect processing queue
 *       ↓
 * recover jobs
 *       ↓
 * push back to main queue
 * ============================================================
 */

async function recoverProcessingJobs() {
  const jobIds = await redis.lrange(
    PROCESSING_NAME,

    0,

    -1,
  );

  if (jobIds.length === 0) {
    return 0;
  }

  console.log("[recovery] jobs found:", jobIds.length);

  for (const jobId of jobIds) {
    const job = await getJob(jobId);

    if (!job) {
      await redis.lrem(
        PROCESSING_NAME,

        1,

        jobId,
      );

      continue;
    }

    /*
     * Put back into queue.
     */

    await redis.rpush(
      QUEUE_NAME,

      jobId,
    );

    /*
     * Remove processing marker.
     */

    await redis.lrem(
      PROCESSING_NAME,

      1,

      jobId,
    );
  }

  return jobIds.length;
}

/*
 * ============================================================
 * Delayed jobs
 * ============================================================
 *
 * Redis Sorted Set:
 *
 * score = timestamp
 *
 *
 * delayed:timetable
 *
 * job1 → 100000
 * job2 → 100500
 * job3 → 101000
 *
 * When score <= current timestamp:
 *
 * move job → main queue
 * ============================================================
 */

async function addDelayedJob({ type, data, delayMs }) {
  const job = createJob({
    type,

    data,
  });

  await redis.set(
    jobKey(job.id),

    serialize(job),

    "EX",

    JOB_TTL,
  );

  const executeAt = Date.now() + delayMs;

  await redis.zadd(
    DELAYED_NAME,

    executeAt,

    job.id,
  );

  return job;
}

/*
 * ============================================================
 * Process delayed jobs
 * ============================================================
 */

async function processDelayedJobs() {
  const now = Date.now();

  const jobIds = await redis.zrangebyscore(
    DELAYED_NAME,

    "-inf",

    now,

    "LIMIT",

    0,

    100,
  );

  if (jobIds.length === 0) {
    return 0;
  }

  for (const jobId of jobIds) {
    /*
     * Remove from delayed set.
     */

    const removed = await redis.zrem(
      DELAYED_NAME,

      jobId,
    );

    /*
     * Another worker may have
     * already claimed it.
     */

    if (removed !== 1) {
      continue;
    }

    /*
     * Put into main queue.
     */

    await redis.rpush(
      QUEUE_NAME,

      jobId,
    );
  }

  return jobIds.length;
}

/*
 * ============================================================
 * Priority queues
 * ============================================================
 *
 * Instead of:
 *
 * queue:timetable
 *
 * use:
 *
 * queue:timetable:high
 * queue:timetable:normal
 * queue:timetable:low
 *
 *
 * Worker checks:
 *
 * HIGH
 * ↓
 * NORMAL
 * ↓
 * LOW
 * ============================================================
 */

const HIGH_QUEUE = `${QUEUE_PREFIX}timetable:high`;

const NORMAL_QUEUE = `${QUEUE_PREFIX}timetable:normal`;

const LOW_QUEUE = `${QUEUE_PREFIX}timetable:low`;

/*
 * ============================================================
 * Add priority job
 * ============================================================
 */

async function addPriorityJob({ type, data, priority = "normal" }) {
  const job = createJob({
    type,

    data,

    priority,
  });

  await redis.set(
    jobKey(job.id),

    serialize(job),

    "EX",

    JOB_TTL,
  );

  const queue =
    priority === "high"
      ? HIGH_QUEUE
      : priority === "low"
        ? LOW_QUEUE
        : NORMAL_QUEUE;

  await redis.rpush(queue, job.id);

  return job;
}

/*
 * ============================================================
 * Priority worker
 * ============================================================
 */

async function priorityWorker() {
  console.log("[priority-worker] started");

  while (workerRunning) {
    try {
      /*
       * BRPOP checks queues in order.
       *
       * HIGH first.
       */

      const result = await workerRedis.brpop(
        HIGH_QUEUE,

        NORMAL_QUEUE,

        LOW_QUEUE,

        0,
      );

      if (!result) {
        continue;
      }

      const [queue, jobId] = result;

      console.log("[priority-worker]", {
        queue,
        jobId,
      });

      await handleJob(jobId);
    } catch (error) {
      console.error("[priority-worker]", error);
    }
  }
}

/*
 * ============================================================
 * Batch producer
 * ============================================================
 */

async function addJobsBatch(jobs) {
  if (jobs.length === 0) {
    return [];
  }

  const pipeline = redis.pipeline();

  const createdJobs = [];

  for (const input of jobs) {
    const job = createJob(input);

    createdJobs.push(job);

    pipeline.set(
      jobKey(job.id),

      serialize(job),

      "EX",

      JOB_TTL,
    );

    pipeline.rpush(
      QUEUE_NAME,

      job.id,
    );
  }

  await pipeline.exec();

  return createdJobs;
}

/*
 * ============================================================
 * Job status
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

  return {
    exists: true,

    status: job.status,

    attempts: job.attempts,

    createdAt: job.createdAt,

    updatedAt: job.updatedAt,

    completedAt: job.completedAt,

    failedAt: job.failedAt,
  };
}

/*
 * ============================================================
 * DLQ inspection
 * ============================================================
 */

async function getFailedJobs(start = 0, stop = 99) {
  const jobIds = await redis.lrange(
    DLQ_NAME,

    start,

    stop,
  );

  if (jobIds.length === 0) {
    return [];
  }

  const keys = jobIds.map(jobKey);

  const values = await redis.mget(...keys);

  return values.map(deserialize).filter(Boolean);
}

/*
 * ============================================================
 * Retry failed DLQ job
 * ============================================================
 */

async function retryFailedJob(jobId) {
  const removed = await redis.lrem(
    DLQ_NAME,

    1,

    jobId,
  );

  if (removed !== 1) {
    return false;
  }

  await updateJob(
    jobId,

    {
      status: "waiting",

      attempts: 0,

      lastError: null,
    },
  );

  await redis.rpush(
    QUEUE_NAME,

    jobId,
  );

  return true;
}

/*
 * ============================================================
 * Queue metrics
 * ============================================================
 */

async function getQueueMetrics() {
  const [waiting, processing, failed, delayed] = await Promise.all([
    redis.llen(QUEUE_NAME),

    redis.llen(PROCESSING_NAME),

    redis.llen(DLQ_NAME),

    redis.zcard(DELAYED_NAME),
  ]);

  return {
    waiting,

    processing,

    failed,

    delayed,
  };
}

/*
 * ============================================================
 * Producer example
 * ============================================================
 */

async function producerExample() {
  const job = await addJob({
    type: "GENERATE_TIMETABLE",

    data: {
      departmentId: "CSE",

      semester: 5,

      academicYear: "2026-27",
    },
  });

  console.log("Job:", job);

  return job;
}

/*
 * ============================================================
 * Delayed job example
 * ============================================================
 */

async function delayedExample() {
  const job = await addDelayedJob({
    type: "SEND_NOTIFICATION",

    data: {
      userId: "user-100",

      message: "Timetable generated",
    },

    delayMs: 5000,
  });

  console.log("Delayed job:", job);

  return job;
}

/*
 * ============================================================
 * Priority example
 * ============================================================
 */

async function priorityExample() {
  await addPriorityJob({
    type: "LOW_PRIORITY_JOB",

    data: {},

    priority: "low",
  });

  await addPriorityJob({
    type: "NORMAL_PRIORITY_JOB",

    data: {},

    priority: "normal",
  });

  await addPriorityJob({
    type: "URGENT_TIMETABLE",

    data: {},

    priority: "high",
  });
}

/*
 * ============================================================
 * Batch example
 * ============================================================
 */

async function batchExample() {
  const jobs = await addJobsBatch([
    {
      type: "GENERATE_TIMETABLE",

      data: {
        department: "CSE",
      },
    },

    {
      type: "GENERATE_TIMETABLE",

      data: {
        department: "ECE",
      },
    },

    {
      type: "GENERATE_TIMETABLE",

      data: {
        department: "EEE",
      },
    },
  ]);

  console.log("Batch jobs:", jobs.length);

  return jobs;
}

/*
 * ============================================================
 * Graceful shutdown
 * ============================================================
 */

async function shutdown(signal) {
  console.log(`\nReceived ${signal}`);

  /*
   * Stop accepting new jobs.
   */

  workerRunning = false;

  /*
   * Disconnect blocking connection.
   *
   * This wakes BLPOP / BRPOP.
   */

  workerRedis.disconnect();

  try {
    await redis.quit();
  } catch {
    redis.disconnect();
  }

  console.log("Queue connections closed");

  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  try {
    await redis.ping();

    console.log("\nRedis Queue");

    /*
     * Producer.
     */

    const job = await producerExample();

    /*
     * Status.
     */

    console.log("Initial status:", await getJobStatus(job.id));

    /*
     * Delayed.
     */

    await delayedExample();

    /*
     * Priority.
     */

    await priorityExample();

    /*
     * Batch.
     */

    await batchExample();

    /*
     * Metrics.
     */

    console.log("Queue metrics:", await getQueueMetrics());

    /*
     * Recovery.
     */

    console.log("Recovered:", await recoverProcessingJobs());

    console.log(
      `
============================================================
QUEUE COMPLETE
============================================================
`,
    );

    /*
     * Start worker only when you
     * actually want this process to
     * consume jobs.
     *
     * Uncomment:
     *
     * await reliableWorker();
     */
  } catch (error) {
    console.error("[queue]", error);
  } finally {
    /*
     * Don't quit here if running
     * a long-lived worker.
     */
    // await redis.quit();
  }
}

await main();
