import Redis from "ioredis";

/*
 * ============================================================
 * Redis connection
 * ============================================================
 */

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

/*
 * ============================================================
 * Basic SET / GET
 * ============================================================
 */

async function basicString() {
  await redis.set("user:name", "Shiva Ram");

  const name = await redis.get("user:name");

  console.log("Name:", name);
}

/*
 * ============================================================
 * SET with options
 * ============================================================
 *
 * SET key value NX
 *     → only if key does NOT exist
 *
 * SET key value XX
 *     → only if key already exists
 *
 * EX
 *     → expiration in seconds
 *
 * PX
 *     → expiration in milliseconds
 * ============================================================
 */

async function setOptions() {
  /*
   * Create only if it doesn't exist.
   */

  const created = await redis.set("user:100", "Shiva", "NX");

  console.log("Created:", created);

  /*
   * Update only if it exists.
   */

  const updated = await redis.set("user:100", "Shiva Ram", "XX");

  console.log("Updated:", updated);

  /*
   * Store for 60 seconds.
   */

  await redis.set("temporary:data", "hello", "EX", 60);

  /*
   * Store for 5 seconds.
   */

  await redis.set("temporary:millis", "hello", "PX", 5000);
}

/*
 * ============================================================
 * SET + NX + EX
 * ============================================================
 *
 * Very important production pattern.
 *
 * Atomically:
 *
 *     create key
 *     only if absent
 *     with expiration
 * ============================================================
 */

async function atomicSet() {
  const result = await redis.set("verification:123", "active", "NX", "EX", 300);

  console.log("Atomic SET:", result);
}

/*
 * ============================================================
 * MGET
 * ============================================================
 *
 * Read multiple keys in one Redis command.
 * ============================================================
 */

async function multipleGet() {
  await redis.set("user:firstName", "Shiva");

  await redis.set("user:lastName", "Ram");

  await redis.set("user:role", "student");

  const values = await redis.mget(
    "user:firstName",
    "user:lastName",
    "user:role",
  );

  console.log("MGET:", values);
}

/*
 * ============================================================
 * MSET
 * ============================================================
 *
 * Set multiple keys.
 * ============================================================
 */

async function multipleSet() {
  await redis.mset(
    "app:name",
    "Timetable Generator",

    "app:version",
    "1.0.0",

    "app:environment",
    "development",
  );

  console.log(await redis.mget("app:name", "app:version", "app:environment"));
}

/*
 * ============================================================
 * Numeric strings
 * ============================================================
 *
 * Redis can treat strings as integers.
 * ============================================================
 */

async function counters() {
  await redis.set("counter", "10");

  const incremented = await redis.incr("counter");

  console.log("After INCR:", incremented);

  const incrementedBy = await redis.incrby("counter", 5);

  console.log("After INCRBY:", incrementedBy);

  const decremented = await redis.decr("counter");

  console.log("After DECR:", decremented);

  const decrementedBy = await redis.decrby("counter", 3);

  console.log("After DECRBY:", decrementedBy);
}

/*
 * ============================================================
 * Floating point counters
 * ============================================================
 */

async function floatingPointCounter() {
  await redis.set("price", "100");

  const result = await redis.incrbyfloat("price", 12.5);

  console.log("Price:", result);
}

/*
 * ============================================================
 * APPEND
 * ============================================================
 */

async function appendString() {
  await redis.set("message", "Hello");

  await redis.append("message", " Redis");

  console.log(await redis.get("message"));
}

/*
 * ============================================================
 * STRLEN
 * ============================================================
 */

async function stringLength() {
  await redis.set("username", "shivaram");

  const length = await redis.strlen("username");

  console.log("Length:", length);
}

/*
 * ============================================================
 * GETSET
 * ============================================================
 *
 * Get old value and replace it
 * atomically.
 * ============================================================
 */

async function getSet() {
  await redis.set("status", "offline");

  const oldValue = await redis.getset("status", "online");

  console.log("Old status:", oldValue);

  console.log("New status:", await redis.get("status"));
}

/*
 * ============================================================
 * GETDEL
 * ============================================================
 *
 * Get value and delete key.
 * ============================================================
 */

async function getDelete() {
  await redis.set("otp:123", "984321");

  const otp = await redis.getdel("otp:123");

  console.log("OTP:", otp);

  console.log("After GETDEL:", await redis.get("otp:123"));
}

/*
 * ============================================================
 * JSON as a String
 * ============================================================
 *
 * Redis itself stores this as a string.
 * ============================================================
 */

async function jsonString() {
  const user = {
    id: "100",
    name: "Shiva Ram",
    role: "student",
  };

  await redis.set("user:100", JSON.stringify(user));

  const raw = await redis.get("user:100");

  const parsed = JSON.parse(raw);

  console.log("User:", parsed);
}

/*
 * ============================================================
 * EXISTS
 * ============================================================
 */

async function exists() {
  await redis.set("user:exists", "yes");

  const result = await redis.exists("user:exists");

  console.log("Exists:", result);
}

/*
 * ============================================================
 * DEL
 * ============================================================
 */

async function deleteKeys() {
  await redis.set("delete:one", "1");

  await redis.set("delete:two", "2");

  const deleted = await redis.del("delete:one", "delete:two");

  console.log("Deleted keys:", deleted);
}

/*
 * ============================================================
 * TTL
 * ============================================================
 */

async function checkTTL() {
  await redis.set("session:100", "active", "EX", 300);

  const ttl = await redis.ttl("session:100");

  console.log("TTL:", ttl, "seconds");
}

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  try {
    console.log("\n--- BASIC STRING ---");

    await basicString();

    console.log("\n--- SET OPTIONS ---");

    await setOptions();

    console.log("\n--- ATOMIC SET ---");

    await atomicSet();

    console.log("\n--- MGET ---");

    await multipleGet();

    console.log("\n--- MSET ---");

    await multipleSet();

    console.log("\n--- COUNTERS ---");

    await counters();

    console.log("\n--- FLOAT ---");

    await floatingPointCounter();

    console.log("\n--- APPEND ---");

    await appendString();

    console.log("\n--- STRLEN ---");

    await stringLength();

    console.log("\n--- GETSET ---");

    await getSet();

    console.log("\n--- GETDEL ---");

    await getDelete();

    console.log("\n--- JSON ---");

    await jsonString();

    console.log("\n--- EXISTS ---");

    await exists();

    console.log("\n--- DELETE ---");

    await deleteKeys();

    console.log("\n--- TTL ---");

    await checkTTL();
  } finally {
    await redis.quit();
  }
}

await main();
