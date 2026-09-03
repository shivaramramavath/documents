import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

/*
 * ============================================================
 * Cleanup
 * ============================================================
 */

async function cleanup() {
  await redis.del(
    "students",
    "online:users",
    "permissions:user:100",
    "frontend:users",
    "backend:users",
    "course:python",
    "course:javascript",
  );
}

/*
 * ============================================================
 * 01. SADD
 * ============================================================
 *
 * Add one or more unique members.
 * ============================================================
 */

async function saddExample() {
  const added = await redis.sadd(
    "students",
    "student:1",
    "student:2",
    "student:3",
  );

  console.log("Members added:", added);

  /*
   * Adding an existing member.
   */

  const duplicate = await redis.sadd("students", "student:2");

  console.log("Duplicate added:", duplicate);

  console.log("Students:", await redis.smembers("students"));
}

/*
 * ============================================================
 * 02. SISMEMBER
 * ============================================================
 *
 * Check whether a member exists.
 * ============================================================
 */

async function sismemberExample() {
  const exists = await redis.sismember("students", "student:2");

  console.log("student:2 exists:", exists);

  const missing = await redis.sismember("students", "student:99");

  console.log("student:99 exists:", missing);
}

/*
 * ============================================================
 * 03. SMISMEMBER
 * ============================================================
 *
 * Check multiple members.
 * ============================================================
 */

async function smismemberExample() {
  const result = await redis.smismember(
    "students",

    "student:1",
    "student:2",
    "student:99",
  );

  console.log("Membership:", result);
}

/*
 * ============================================================
 * 04. SMEMBERS
 * ============================================================
 *
 * Get every member.
 * ============================================================
 */

async function smembersExample() {
  const students = await redis.smembers("students");

  console.log("Students:", students);
}

/*
 * ============================================================
 * 05. SCARD
 * ============================================================
 *
 * Number of members.
 * ============================================================
 */

async function scardExample() {
  const count = await redis.scard("students");

  console.log("Student count:", count);
}

/*
 * ============================================================
 * 06. SREM
 * ============================================================
 *
 * Remove members.
 * ============================================================
 */

async function sremExample() {
  const removed = await redis.srem("students", "student:3");

  console.log("Removed:", removed);

  console.log("Remaining:", await redis.smembers("students"));
}

/*
 * ============================================================
 * 07. SPOP
 * ============================================================
 *
 * Remove and return random member(s).
 * ============================================================
 */

async function spopExample() {
  await redis.sadd(
    "students",
    "student:1",
    "student:2",
    "student:3",
    "student:4",
  );

  const student = await redis.spop("students");

  console.log("Random removed student:", student);
}

/*
 * ============================================================
 * 08. SRANDMEMBER
 * ============================================================
 *
 * Return random member without removing it.
 * ============================================================
 */

async function srandmemberExample() {
  const student = await redis.srandmember("students");

  console.log("Random student:", student);

  /*
   * Multiple random members.
   */

  const students = await redis.srandmember("students", 2);

  console.log("Random students:", students);
}

/*
 * ============================================================
 * 09. SUNION
 * ============================================================
 *
 * Combine sets.
 * ============================================================
 */

async function sunionExample() {
  await redis.sadd("frontend:users", "user:1", "user:2", "user:3");

  await redis.sadd("backend:users", "user:3", "user:4", "user:5");

  const users = await redis.sunion("frontend:users", "backend:users");

  console.log("All users:", users);
}

/*
 * ============================================================
 * 10. SINTER
 * ============================================================
 *
 * Find common members.
 * ============================================================
 */

async function sinterExample() {
  const common = await redis.sinter("frontend:users", "backend:users");

  console.log("Users in both:", common);
}

/*
 * ============================================================
 * 11. SDIFF
 * ============================================================
 *
 * Members in first set but not second.
 * ============================================================
 */

async function sdiffExample() {
  const onlyFrontend = await redis.sdiff("frontend:users", "backend:users");

  console.log("Only frontend:", onlyFrontend);
}

/*
 * ============================================================
 * 12. SUNIONSTORE
 * ============================================================
 *
 * Store union result in another Set.
 * ============================================================
 */

async function sunionstoreExample() {
  const count = await redis.sunionstore(
    "all:users",
    "frontend:users",
    "backend:users",
  );

  console.log("Stored members:", count);

  console.log("All users:", await redis.smembers("all:users"));

  await redis.del("all:users");
}

/*
 * ============================================================
 * 13. SINTERSTORE
 * ============================================================
 */

async function sinterstoreExample() {
  const count = await redis.sinterstore(
    "common:users",
    "frontend:users",
    "backend:users",
  );

  console.log("Common users:", count);

  console.log(await redis.smembers("common:users"));

  await redis.del("common:users");
}

/*
 * ============================================================
 * 14. SDIFFSTORE
 * ============================================================
 */

async function sdiffstoreExample() {
  const count = await redis.sdiffstore(
    "frontend:only",
    "frontend:users",
    "backend:users",
  );

  console.log("Only frontend count:", count);

  console.log(await redis.smembers("frontend:only"));

  await redis.del("frontend:only");
}

/*
 * ============================================================
 * 15. SMOVE
 * ============================================================
 *
 * Move a member from one Set to another.
 * ============================================================
 */

async function smoveExample() {
  await redis.sadd("course:python", "student:1", "student:2");

  await redis.sadd("course:javascript", "student:3");

  const result = await redis.smove(
    "course:python",
    "course:javascript",
    "student:1",
  );

  console.log("Moved:", result);

  console.log("Python:", await redis.smembers("course:python"));

  console.log("JavaScript:", await redis.smembers("course:javascript"));
}

/*
 * ============================================================
 * 16. SSCAN
 * ============================================================
 *
 * Iterate through a large Set.
 *
 * Don't use SMEMBERS blindly on enormous Sets.
 * ============================================================
 */

async function sscanExample() {
  const stream = redis.sscanStream("students", {
    count: 100,
  });

  const members = [];

  for await (const batch of stream) {
    members.push(...batch);
  }

  console.log("SSCAN:", members);
}

/*
 * ============================================================
 * 17. ONLINE USERS
 * ============================================================
 *
 * Practical example.
 * ============================================================
 */

async function onlineUsersExample() {
  await redis.sadd("online:users", "user:100", "user:101", "user:102");

  console.log(
    "Is user:101 online?",
    await redis.sismember("online:users", "user:101"),
  );

  await redis.srem("online:users", "user:101");

  console.log(
    "After logout:",
    await redis.sismember("online:users", "user:101"),
  );
}

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  try {
    await cleanup();

    console.log("\n--- SADD ---");

    await saddExample();

    console.log("\n--- SISMEMBER ---");

    await sismemberExample();

    console.log("\n--- SMISMEMBER ---");

    await smismemberExample();

    console.log("\n--- SMEMBERS ---");

    await smembersExample();

    console.log("\n--- SCARD ---");

    await scardExample();

    console.log("\n--- SREM ---");

    await sremExample();

    console.log("\n--- SPOP ---");

    await spopExample();

    console.log("\n--- SRANDMEMBER ---");

    await srandmemberExample();

    console.log("\n--- SUNION ---");

    await sunionExample();

    console.log("\n--- SINTER ---");

    await sinterExample();

    console.log("\n--- SDIFF ---");

    await sdiffExample();

    console.log("\n--- SUNIONSTORE ---");

    await sunionstoreExample();

    console.log("\n--- SINTERSTORE ---");

    await sinterstoreExample();

    console.log("\n--- SDIFFSTORE ---");

    await sdiffstoreExample();

    console.log("\n--- SMOVE ---");

    await smoveExample();

    console.log("\n--- SSCAN ---");

    await sscanExample();

    console.log("\n--- ONLINE USERS ---");

    await onlineUsersExample();
  } catch (error) {
    console.error("Redis Set error:", error);
  } finally {
    await redis.quit();
  }
}

await main();
