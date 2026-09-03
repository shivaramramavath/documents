import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

/*
 * ============================================================
 * Cleanup
 * ============================================================
 */

async function cleanup() {
  await redis.del("tasks", "notifications", "stack", "queue", "recent:users");
}

/*
 * ============================================================
 * 01. LPUSH
 * ============================================================
 *
 * Insert elements at the LEFT/head.
 * ============================================================
 */

async function lpushExample() {
  await redis.lpush("tasks", "task-1");

  await redis.lpush("tasks", "task-2");

  await redis.lpush("tasks", "task-3");

  console.log(await redis.lrange("tasks", 0, -1));
}

/*
 * ============================================================
 * 02. RPUSH
 * ============================================================
 *
 * Insert elements at the RIGHT/tail.
 * ============================================================
 */

async function rpushExample() {
  await redis.rpush("tasks", "task-4", "task-5", "task-6");

  console.log(await redis.lrange("tasks", 0, -1));
}

/*
 * ============================================================
 * 03. LRANGE
 * ============================================================
 *
 * Read a range.
 *
 * 0  → first element
 * -1 → last element
 * ============================================================
 */

async function lrangeExample() {
  const all = await redis.lrange("tasks", 0, -1);

  console.log("All:", all);

  const firstThree = await redis.lrange("tasks", 0, 2);

  console.log("First three:", firstThree);
}

/*
 * ============================================================
 * 04. LLEN
 * ============================================================
 */

async function llenExample() {
  const length = await redis.llen("tasks");

  console.log("Length:", length);
}

/*
 * ============================================================
 * 05. LPOP
 * ============================================================
 *
 * Remove from LEFT.
 * ============================================================
 */

async function lpopExample() {
  const task = await redis.lpop("tasks");

  console.log("Popped:", task);

  console.log("Remaining:", await redis.lrange("tasks", 0, -1));
}

/*
 * ============================================================
 * 06. RPOP
 * ============================================================
 *
 * Remove from RIGHT.
 * ============================================================
 */

async function rpopExample() {
  const task = await redis.rpop("tasks");

  console.log("Popped:", task);

  console.log("Remaining:", await redis.lrange("tasks", 0, -1));
}

/*
 * ============================================================
 * 07. FIFO QUEUE
 * ============================================================
 *
 * Producer:
 *
 *     RPUSH
 *
 * Consumer:
 *
 *     LPOP
 *
 * Result:
 *
 * First In → First Out
 * ============================================================
 */

async function fifoQueue() {
  await redis.rpush("queue", "job-1", "job-2", "job-3");

  console.log("Queue:", await redis.lrange("queue", 0, -1));

  const job = await redis.lpop("queue");

  console.log("Processing:", job);

  console.log("Remaining:", await redis.lrange("queue", 0, -1));
}

/*
 * ============================================================
 * 08. LIFO STACK
 * ============================================================
 *
 * PUSH + POP on same side.
 *
 * LPUSH + LPOP
 *
 * Result:
 *
 * Last In → First Out
 * ============================================================
 */

async function lifoStack() {
  await redis.lpush("stack", "A");

  await redis.lpush("stack", "B");

  await redis.lpush("stack", "C");

  console.log("Stack:", await redis.lrange("stack", 0, -1));

  console.log("POP:", await redis.lpop("stack"));
}

/*
 * ============================================================
 * 09. LINDEX
 * ============================================================
 *
 * Get an element by index.
 * ============================================================
 */

async function lindexExample() {
  const value = await redis.lindex("tasks", 0);

  console.log("First element:", value);

  const last = await redis.lindex("tasks", -1);

  console.log("Last element:", last);
}

/*
 * ============================================================
 * 10. LSET
 * ============================================================
 *
 * Replace an element at an index.
 * ============================================================
 */

async function lsetExample() {
  await redis.lset("tasks", 0, "updated-task");

  console.log(await redis.lrange("tasks", 0, -1));
}

/*
 * ============================================================
 * 11. LINSERT
 * ============================================================
 */

async function linsertExample() {
  await redis.linsert("tasks", "BEFORE", "updated-task", "priority-task");

  console.log(await redis.lrange("tasks", 0, -1));
}

/*
 * ============================================================
 * 12. LREM
 * ============================================================
 *
 * Remove matching elements.
 * ============================================================
 */

async function lremExample() {
  await redis.rpush("notifications", "hello", "hello", "world");

  const removed = await redis.lrem("notifications", 1, "hello");

  console.log("Removed:", removed);

  console.log(await redis.lrange("notifications", 0, -1));
}

/*
 * ============================================================
 * 13. LTRIM
 * ============================================================
 *
 * Keep only a specific range.
 *
 * Very useful for recent items.
 * ============================================================
 */

async function ltrimExample() {
  await redis.rpush(
    "recent:users",
    "user-1",
    "user-2",
    "user-3",
    "user-4",
    "user-5",
  );

  /*
   * Keep only the last three.
   */

  await redis.ltrim("recent:users", -3, -1);

  console.log("Recent users:", await redis.lrange("recent:users", 0, -1));
}

/*
 * ============================================================
 * 14. Blocking pop
 * ============================================================
 *
 * BLPOP waits until an element is available.
 *
 * Useful for simple workers.
 * ============================================================
 */

async function blockingPop() {
  /*
   * Add an item after a short delay.
   */

  setTimeout(async () => {
    await redis.rpush("queue", "delayed-job");
  }, 1000);

  console.log("Waiting for job...");

  /*
   * BLPOP:
   *
   * queue
   * timeout = 5 seconds
   */

  const result = await redis.blpop("queue", 5);

  console.log("BLPOP:", result);
}

/*
 * ============================================================
 * 15. BRPOP
 * ============================================================
 */

async function blockingRightPop() {
  await redis.rpush("queue", "job-A");

  const result = await redis.brpop("queue", 5);

  console.log("BRPOP:", result);
}

/*
 * ============================================================
 * 16. LPOS
 * ============================================================
 *
 * Find the position of an element.
 * ============================================================
 */

async function lposExample() {
  await redis.rpush("tasks", "A", "B", "C", "D");

  const position = await redis.lpos("tasks", "C");

  console.log("Position of C:", position);
}

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  try {
    await cleanup();

    console.log("\n--- LPUSH ---");

    await lpushExample();

    console.log("\n--- RPUSH ---");

    await rpushExample();

    console.log("\n--- LRANGE ---");

    await lrangeExample();

    console.log("\n--- LLEN ---");

    await llenExample();

    console.log("\n--- LPOP ---");

    await lpopExample();

    console.log("\n--- RPOP ---");

    await rpopExample();

    console.log("\n--- FIFO QUEUE ---");

    await fifoQueue();

    console.log("\n--- LIFO STACK ---");

    await lifoStack();

    console.log("\n--- LINDEX ---");

    await lindexExample();

    console.log("\n--- LSET ---");

    await lsetExample();

    console.log("\n--- LINSERT ---");

    await linsertExample();

    console.log("\n--- LREM ---");

    await lremExample();

    console.log("\n--- LTRIM ---");

    await ltrimExample();

    console.log("\n--- BLOCKING POP ---");

    await blockingPop();

    console.log("\n--- BRPOP ---");

    await blockingRightPop();

    console.log("\n--- LPOS ---");

    await lposExample();
  } catch (error) {
    console.error("Redis List error:", error);
  } finally {
    await redis.quit();
  }
}

await main();
