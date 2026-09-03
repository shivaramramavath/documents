import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

/*
 * ============================================================
 * Cleanup
 * ============================================================
 */

async function cleanup() {
  await redis.del("user:100", "user:101", "counter:user:100", "profile:100");
}

/*
 * ============================================================
 * HSET
 * ============================================================
 *
 * Create or update fields inside a Hash.
 * ============================================================
 */

async function hsetExample() {
  await redis.hset(
    "user:100",

    "name",
    "Shiva Ram",

    "email",
    "shiva@example.com",

    "role",
    "student",

    "age",
    "22",
  );

  console.log("Hash created");
}

/*
 * ============================================================
 * HGET
 * ============================================================
 *
 * Get one field.
 * ============================================================
 */

async function hgetExample() {
  const name = await redis.hget("user:100", "name");

  console.log("Name:", name);

  const email = await redis.hget("user:100", "email");

  console.log("Email:", email);
}

/*
 * ============================================================
 * HMGET
 * ============================================================
 *
 * Get multiple fields.
 * ============================================================
 */

async function hmgetExample() {
  const values = await redis.hmget(
    "user:100",

    "name",
    "email",
    "role",
  );

  console.log("HMGET:", values);
}

/*
 * ============================================================
 * HGETALL
 * ============================================================
 *
 * Get the entire Hash.
 * ============================================================
 */

async function hgetallExample() {
  const user = await redis.hgetall("user:100");

  console.log("User:", user);
}

/*
 * ============================================================
 * HEXISTS
 * ============================================================
 *
 * Check whether a field exists.
 * ============================================================
 */

async function hexistsExample() {
  const exists = await redis.hexists("user:100", "email");

  console.log("Email exists:", exists);
}

/*
 * ============================================================
 * HLEN
 * ============================================================
 *
 * Number of fields.
 * ============================================================
 */

async function hlenExample() {
  const length = await redis.hlen("user:100");

  console.log("Number of fields:", length);
}

/*
 * ============================================================
 * HKEYS
 * ============================================================
 *
 * Get all field names.
 * ============================================================
 */

async function hkeysExample() {
  const fields = await redis.hkeys("user:100");

  console.log("Fields:", fields);
}

/*
 * ============================================================
 * HVALS
 * ============================================================
 *
 * Get all values.
 * ============================================================
 */

async function hvalsExample() {
  const values = await redis.hvals("user:100");

  console.log("Values:", values);
}

/*
 * ============================================================
 * HINCRBY
 * ============================================================
 *
 * Increment a numeric field.
 * ============================================================
 */

async function hincrbyExample() {
  await redis.hset("counter:user:100", "loginCount", "10");

  const count = await redis.hincrby("counter:user:100", "loginCount", 1);

  console.log("Login count:", count);

  await redis.hincrby("counter:user:100", "loginCount", 5);

  console.log(
    "Login count:",
    await redis.hget("counter:user:100", "loginCount"),
  );
}

/*
 * ============================================================
 * HINCRBYFLOAT
 * ============================================================
 */

async function hincrbyfloatExample() {
  await redis.hset("profile:100", "score", "10.5");

  const score = await redis.hincrbyfloat("profile:100", "score", 2.25);

  console.log("Score:", score);
}

/*
 * ============================================================
 * HSETNX
 * ============================================================
 *
 * Set field only if it doesn't exist.
 * ============================================================
 */

async function hsetnxExample() {
  const first = await redis.hsetnx("user:101", "name", "Shiva");

  const second = await redis.hsetnx("user:101", "name", "Ram");

  console.log("First HSETNX:", first);

  console.log("Second HSETNX:", second);

  console.log("Name:", await redis.hget("user:101", "name"));
}

/*
 * ============================================================
 * HDEL
 * ============================================================
 *
 * Delete one or more fields.
 * ============================================================
 */

async function hdelExample() {
  await redis.hdel("user:100", "role");

  console.log("After HDEL:", await redis.hgetall("user:100"));
}

/*
 * ============================================================
 * HSCAN
 * ============================================================
 *
 * Iterate through Hash fields.
 *
 * Useful when Hash is large.
 * ============================================================
 */

async function hscanExample() {
  const stream = redis.hscanStream("user:100", {
    count: 10,
  });

  const fields = [];

  for await (const chunk of stream) {
    /*
     * ioredis returns:
     *
     * [field, value, field, value, ...]
     */

    fields.push(...chunk);
  }

  console.log("HSCAN:", fields);
}

/*
 * ============================================================
 * Hash → JavaScript object
 * ============================================================
 */

async function objectExample() {
  await redis.hset(
    "user:100",

    "name",
    "Shiva Ram",

    "email",
    "shiva@example.com",

    "role",
    "student",
  );

  const rawUser = await redis.hgetall("user:100");

  const user = {
    id: "100",

    name: rawUser.name,

    email: rawUser.email,

    role: rawUser.role,
  };

  console.log("JavaScript object:", user);
}

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  try {
    await cleanup();

    console.log("\n--- HSET ---");

    await hsetExample();

    console.log("\n--- HGET ---");

    await hgetExample();

    console.log("\n--- HMGET ---");

    await hmgetExample();

    console.log("\n--- HGETALL ---");

    await hgetallExample();

    console.log("\n--- HEXISTS ---");

    await hexistsExample();

    console.log("\n--- HLEN ---");

    await hlenExample();

    console.log("\n--- HKEYS ---");

    await hkeysExample();

    console.log("\n--- HVALS ---");

    await hvalsExample();

    console.log("\n--- HINCRBY ---");

    await hincrbyExample();

    console.log("\n--- HINCRBYFLOAT ---");

    await hincrbyfloatExample();

    console.log("\n--- HSETNX ---");

    await hsetnxExample();

    console.log("\n--- HDEL ---");

    await hdelExample();

    console.log("\n--- HSCAN ---");

    await hscanExample();

    console.log("\n--- OBJECT ---");

    await objectExample();
  } catch (error) {
    console.error("Redis Hash error:", error);
  } finally {
    await redis.quit();
  }
}

await main();
