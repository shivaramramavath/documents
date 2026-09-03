import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

/*
 * ============================================================
 * Cleanup
 * ============================================================
 */

async function cleanup() {
  await redis.del(
    "leaderboard",
    "priority:jobs",
    "schedule",
    "scores",
    "timetable:priority",
  );
}

/*
 * ============================================================
 * 01. ZADD
 * ============================================================
 *
 * Add members with scores.
 * ============================================================
 */

async function zaddExample() {
  await redis.zadd(
    "leaderboard",

    90,
    "student:1",

    75,
    "student:2",

    95,
    "student:3",

    85,
    "student:4",
  );

  console.log("Leaderboard created");
}

/*
 * ============================================================
 * 02. ZRANGE
 * ============================================================
 *
 * Return members ordered by score ASC.
 * ============================================================
 */

async function zrangeExample() {
  const result = await redis.zrange("leaderboard", 0, -1);

  console.log("Ascending:", result);
}

/*
 * ============================================================
 * 03. ZRANGE WITH SCORES
 * ============================================================
 */

async function zrangeWithScoresExample() {
  const result = await redis.zrange("leaderboard", 0, -1, "WITHSCORES");

  console.log("Members + scores:", result);
}

/*
 * ============================================================
 * 04. ZREVRANGE
 * ============================================================
 *
 * Highest score first.
 * ============================================================
 */

async function zrevrangeExample() {
  const result = await redis.zrevrange("leaderboard", 0, -1);

  console.log("Descending:", result);
}

/*
 * ============================================================
 * 05. TOP N
 * ============================================================
 */

async function topNExample() {
  const top3 = await redis.zrevrange("leaderboard", 0, 2, "WITHSCORES");

  console.log("Top 3:", top3);
}

/*
 * ============================================================
 * 06. ZSCORE
 * ============================================================
 *
 * Get score of a member.
 * ============================================================
 */

async function zscoreExample() {
  const score = await redis.zscore("leaderboard", "student:3");

  console.log("Student 3 score:", score);
}

/*
 * ============================================================
 * 07. ZINCRBY
 * ============================================================
 *
 * Increment a member's score.
 * ============================================================
 */

async function zincrbyExample() {
  const newScore = await redis.zincrby("leaderboard", 5, "student:1");

  console.log("New score:", newScore);
}

/*
 * ============================================================
 * 08. ZRANK
 * ============================================================
 *
 * Rank from lowest score.
 *
 * Rank starts at 0.
 * ============================================================
 */

async function zrankExample() {
  const rank = await redis.zrank("leaderboard", "student:1");

  console.log("Ascending rank:", rank);
}

/*
 * ============================================================
 * 09. ZREVRANK
 * ============================================================
 *
 * Rank from highest score.
 * ============================================================
 */

async function zrevrankExample() {
  const rank = await redis.zrevrank("leaderboard", "student:1");

  console.log("Descending rank:", rank);
}

/*
 * ============================================================
 * 10. ZCARD
 * ============================================================
 *
 * Number of members.
 * ============================================================
 */

async function zcardExample() {
  const count = await redis.zcard("leaderboard");

  console.log("Members:", count);
}

/*
 * ============================================================
 * 11. ZCOUNT
 * ============================================================
 *
 * Count members within score range.
 * ============================================================
 */

async function zcountExample() {
  const count = await redis.zcount("leaderboard", 80, 100);

  console.log("Score 80-100:", count);
}

/*
 * ============================================================
 * 12. ZRANGEBYSCORE
 * ============================================================
 *
 * Get members by score range.
 * ============================================================
 */

async function zrangebyscoreExample() {
  const students = await redis.zrangebyscore("leaderboard", 80, 100);

  console.log("Students with score 80-100:", students);
}

/*
 * ============================================================
 * 13. ZRANGEBYSCORE WITH SCORES
 * ============================================================
 */

async function zrangebyscoreWithScoresExample() {
  const result = await redis.zrangebyscore(
    "leaderboard",
    80,
    100,
    "WITHSCORES",
  );

  console.log(result);
}

/*
 * ============================================================
 * 14. ZREM
 * ============================================================
 *
 * Remove members.
 * ============================================================
 */

async function zremExample() {
  const removed = await redis.zrem("leaderboard", "student:4");

  console.log("Removed:", removed);
}

/*
 * ============================================================
 * 15. ZPOPMAX
 * ============================================================
 *
 * Remove highest scoring member.
 * ============================================================
 */

async function zpopmaxExample() {
  await redis.zadd(
    "priority:jobs",

    10,
    "job:low",

    50,
    "job:medium",

    100,
    "job:high",
  );

  const job = await redis.zpopmax("priority:jobs");

  console.log("Highest priority:", job);
}

/*
 * ============================================================
 * 16. ZPOPMIN
 * ============================================================
 *
 * Remove lowest scoring member.
 * ============================================================
 */

async function zpopminExample() {
  const job = await redis.zpopmin("priority:jobs");

  console.log("Lowest score:", job);
}

/*
 * ============================================================
 * 17. DELAYED JOB PATTERN
 * ============================================================
 *
 * Store execution time as score.
 *
 * score = Unix timestamp in milliseconds
 * ============================================================
 */

async function delayedJobExample() {
  const now = Date.now();

  const executeAt = now + 5000;

  await redis.zadd("schedule", executeAt, "job:100");

  console.log("Job scheduled at:", executeAt);

  /*
   * Find jobs whose execution
   * time has arrived.
   */

  const readyJobs = await redis.zrangebyscore("schedule", 0, Date.now());

  console.log("Ready jobs:", readyJobs);
}

/*
 * ============================================================
 * 18. TIMETABLE PRIORITY
 * ============================================================
 */

async function timetablePriorityExample() {
  await redis.zadd(
    "timetable:priority",

    100,
    "timetable:001",

    500,
    "timetable:002",

    250,
    "timetable:003",
  );

  const highest = await redis.zrevrange(
    "timetable:priority",
    0,
    0,
    "WITHSCORES",
  );

  console.log("Highest priority timetable:", highest);
}

/*
 * ============================================================
 * 19. ZSCAN
 * ============================================================
 *
 * Incrementally iterate over a large
 * Sorted Set.
 * ============================================================
 */

async function zscanExample() {
  const stream = redis.zscanStream("leaderboard", {
    count: 100,
  });

  const result = [];

  for await (const batch of stream) {
    result.push(...batch);
  }

  console.log("ZSCAN:", result);
}

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  try {
    await cleanup();

    console.log("\n--- ZADD ---");

    await zaddExample();

    console.log("\n--- ZRANGE ---");

    await zrangeExample();

    console.log("\n--- ZRANGE WITH SCORES ---");

    await zrangeWithScoresExample();

    console.log("\n--- ZREVRANGE ---");

    await zrevrangeExample();

    console.log("\n--- TOP N ---");

    await topNExample();

    console.log("\n--- ZSCORE ---");

    await zscoreExample();

    console.log("\n--- ZINCRBY ---");

    await zincrbyExample();

    console.log("\n--- ZRANK ---");

    await zrankExample();

    console.log("\n--- ZREVRANK ---");

    await zrevrankExample();

    console.log("\n--- ZCARD ---");

    await zcardExample();

    console.log("\n--- ZCOUNT ---");

    await zcountExample();

    console.log("\n--- ZRANGEBYSCORE ---");

    await zrangebyscoreExample();

    console.log("\n--- ZRANGEBYSCORE + SCORES ---");

    await zrangebyscoreWithScoresExample();

    console.log("\n--- ZREM ---");

    await zremExample();

    console.log("\n--- ZPOPMAX ---");

    await zpopmaxExample();

    console.log("\n--- ZPOPMIN ---");

    await zpopminExample();

    console.log("\n--- DELAYED JOB ---");

    await delayedJobExample();

    console.log("\n--- TIMETABLE PRIORITY ---");

    await timetablePriorityExample();

    console.log("\n--- ZSCAN ---");

    await zscanExample();
  } catch (error) {
    console.error("Redis Sorted Set error:", error);
  } finally {
    await redis.quit();
  }
}

await main();
