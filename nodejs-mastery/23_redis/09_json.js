import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

/*
 * ============================================================
 * Sample data
 * ============================================================
 */

const user = {
  id: "user:100",

  name: "Shiva Ram",

  email: "shiva@example.com",

  age: 22,

  role: "student",

  active: true,

  skills: ["JavaScript", "Node.js", "MongoDB", "Redis"],

  profile: {
    city: "Hyderabad",

    country: "India",

    education: {
      degree: "B.Tech",

      branch: "CSE",
    },
  },
};

/*
 * ============================================================
 * Cleanup
 * ============================================================
 */

async function cleanup() {
  await redis.del(
    "user:100",
    "user:101",
    "user:102",
    "users",
    "large:user",
    "json:counter",
  );
}

/*
 * ============================================================
 * 01. JSON.stringify()
 * ============================================================
 *
 * Convert JavaScript object → JSON string.
 * ============================================================
 */

async function stringifyExample() {
  const json = JSON.stringify(user);

  console.log("JSON string:", json);
}

/*
 * ============================================================
 * 02. SET JSON
 * ============================================================
 *
 * Redis stores the JSON as a String.
 * ============================================================
 */

async function setJsonExample() {
  const json = JSON.stringify(user);

  await redis.set("user:100", json);

  console.log("User stored");
}

/*
 * ============================================================
 * 03. GET JSON
 * ============================================================
 */

async function getJsonExample() {
  const json = await redis.get("user:100");

  console.log("Raw Redis value:", json);
}

/*
 * ============================================================
 * 04. JSON.parse()
 * ============================================================
 *
 * Redis String → JavaScript object.
 * ============================================================
 */

async function parseJsonExample() {
  const json = await redis.get("user:100");

  if (json === null) {
    console.log("User not found");

    return;
  }

  const parsedUser = JSON.parse(json);

  console.log("Parsed user:", parsedUser);

  console.log("Name:", parsedUser.name);

  console.log("City:", parsedUser.profile.city);
}

/*
 * ============================================================
 * 05. Helper: setJSON
 * ============================================================
 */

async function setJSON(key, value, ttlSeconds) {
  const json = JSON.stringify(value);

  if (ttlSeconds !== undefined) {
    await redis.set(key, json, "EX", ttlSeconds);

    return;
  }

  await redis.set(key, json);
}

/*
 * ============================================================
 * 06. Helper: getJSON
 * ============================================================
 */

async function getJSON(key) {
  const json = await redis.get(key);

  if (json === null) {
    return null;
  }

  return JSON.parse(json);
}

/*
 * ============================================================
 * 07. JSON helper usage
 * ============================================================
 */

async function helperExample() {
  await setJSON(
    "user:101",

    {
      id: "user:101",

      name: "Ravi",

      role: "student",
    },

    300,
  );

  const user = await getJSON("user:101");

  console.log("User:", user);
}

/*
 * ============================================================
 * 08. Update JSON object
 * ============================================================
 *
 * IMPORTANT:
 *
 * Redis doesn't know about the individual
 * properties inside this JSON string.
 *
 * Therefore:
 *
 * GET
 * ↓
 * JSON.parse
 * ↓
 * modify
 * ↓
 * JSON.stringify
 * ↓
 * SET
 * ============================================================
 */

async function updateJsonExample() {
  const user = await getJSON("user:100");

  if (user === null) {
    return;
  }

  user.name = "Shiva Ram Updated";

  user.age = 23;

  await setJSON("user:100", user);

  console.log("Updated user:", await getJSON("user:100"));
}

/*
 * ============================================================
 * 09. Nested object update
 * ============================================================
 */

async function nestedUpdateExample() {
  const user = await getJSON("user:100");

  if (user === null) {
    return;
  }

  user.profile.city = "Bengaluru";

  user.profile.education.branch = "AI & ML";

  await setJSON("user:100", user);

  console.log("Updated profile:", user.profile);
}

/*
 * ============================================================
 * 10. Array update
 * ============================================================
 */

async function arrayUpdateExample() {
  const user = await getJSON("user:100");

  if (user === null) {
    return;
  }

  user.skills.push("LangGraph");

  await setJSON("user:100", user);

  console.log("Skills:", user.skills);
}

/*
 * ============================================================
 * 11. JSON data type handling
 * ============================================================
 */

async function dataTypesExample() {
  const data = {
    string: "hello",

    number: 123,

    float: 12.5,

    boolean: true,

    nullValue: null,

    array: [1, 2, 3],

    object: {
      name: "Shiva",
    },
  };

  await setJSON("user:102", data);

  const result = await getJSON("user:102");

  console.log(result);

  console.log("string:", typeof result.string);

  console.log("number:", typeof result.number);

  console.log("boolean:", typeof result.boolean);

  console.log("array:", Array.isArray(result.array));
}

/*
 * ============================================================
 * 12. JSON TTL
 * ============================================================
 */

async function ttlExample() {
  await setJSON(
    "json:counter",
    {
      count: 100,
    },
    60,
  );

  const ttl = await redis.ttl("json:counter");

  console.log("TTL:", ttl);
}

/*
 * ============================================================
 * 13. Conditional JSON creation
 * ============================================================
 *
 * NX means:
 *
 * Set only if the key doesn't exist.
 * ============================================================
 */

async function setNxExample() {
  const json = JSON.stringify({
    id: "user:100",
    name: "Shiva",
  });

  const first = await redis.set("users", json, "NX");

  console.log("First SET NX:", first);

  const second = await redis.set("users", json, "NX");

  console.log("Second SET NX:", second);
}

/*
 * ============================================================
 * 14. Conditional JSON update
 * ============================================================
 *
 * XX means:
 *
 * Set only if the key already exists.
 * ============================================================
 */

async function setXxExample() {
  const result = await redis.set(
    "users",

    JSON.stringify({
      id: "user:100",

      name: "Updated Shiva",
    }),

    "XX",
  );

  console.log("SET XX:", result);
}

/*
 * ============================================================
 * 15. JSON merge helper
 * ============================================================
 *
 * Shallow object merge.
 * ============================================================
 */

async function mergeJSON(key, updates) {
  const existing = await getJSON(key);

  if (existing === null) {
    return null;
  }

  const updated = {
    ...existing,
    ...updates,
  };

  await setJSON(key, updated);

  return updated;
}

/*
 * ============================================================
 * 16. Merge example
 * ============================================================
 */

async function mergeExample() {
  const result = await mergeJSON(
    "user:100",

    {
      active: false,

      role: "admin",
    },
  );

  console.log("Merged:", result);
}

/*
 * ============================================================
 * 17. Deep merge warning
 * ============================================================
 *
 * Spread syntax is shallow.
 * ============================================================
 */

async function shallowMergeWarning() {
  const original = {
    name: "Shiva",

    profile: {
      city: "Hyderabad",

      age: 22,
    },
  };

  const updates = {
    profile: {
      city: "Bengaluru",
    },
  };

  const result = {
    ...original,

    ...updates,
  };

  console.log("Result:", result);

  /*
   * Notice:
   *
   * profile.age is gone.
   *
   * Because {...updates} replaces
   * the entire profile object.
   */
}

/*
 * ============================================================
 * 18. JSON size
 * ============================================================
 */

async function sizeExample() {
  const json = JSON.stringify(user);

  const bytes = Buffer.byteLength(json, "utf8");

  console.log("JSON size:", bytes, "bytes");
}

/*
 * ============================================================
 * 19. JSON compression concept
 * ============================================================
 *
 * Don't blindly compress every Redis value.
 *
 * Compression can save memory for large values,
 * but costs CPU.
 * ============================================================
 */

async function compressionConcept() {
  const json = JSON.stringify(user);

  console.log("JSON length:", json.length);

  /*
   * In production, compression should be
   * considered only after measuring.
   */
}

/*
 * ============================================================
 * 20. Atomicity problem
 * ============================================================
 *
 * Two clients can read the same JSON.
 *
 * Client A:
 *
 * GET
 *
 * Client B:
 *
 * GET
 *
 * Client A:
 *
 * modify → SET
 *
 * Client B:
 *
 * modify → SET
 *
 * Client A's change can be overwritten.
 * ============================================================
 */

async function atomicityProblem() {
  const user = await getJSON("user:100");

  if (user === null) {
    return;
  }

  console.log("Current user:", user);

  console.log("GET → modify → SET is not automatically atomic");
}

/*
 * ============================================================
 * 21. JSON vs HASH
 * ============================================================
 */

async function jsonVsHashExample() {
  /*
   * JSON
   */

  await setJSON("user:json", {
    name: "Shiva",

    email: "shiva@example.com",

    role: "student",
  });

  /*
   * Hash
   */

  await redis.hset(
    "user:hash",

    "name",
    "Shiva",

    "email",
    "shiva@example.com",

    "role",
    "student",
  );

  console.log("JSON:", await getJSON("user:json"));

  console.log("Hash:", await redis.hgetall("user:hash"));

  await redis.del("user:json", "user:hash");
}

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  try {
    await cleanup();

    console.log("\n--- JSON.stringify ---");

    await stringifyExample();

    console.log("\n--- SET JSON ---");

    await setJsonExample();

    console.log("\n--- GET JSON ---");

    await getJsonExample();

    console.log("\n--- JSON.parse ---");

    await parseJsonExample();

    console.log("\n--- JSON HELPERS ---");

    await helperExample();

    console.log("\n--- UPDATE JSON ---");

    await updateJsonExample();

    console.log("\n--- NESTED UPDATE ---");

    await nestedUpdateExample();

    console.log("\n--- ARRAY UPDATE ---");

    await arrayUpdateExample();

    console.log("\n--- DATA TYPES ---");

    await dataTypesExample();

    console.log("\n--- TTL ---");

    await ttlExample();

    console.log("\n--- SET NX ---");

    await setNxExample();

    console.log("\n--- SET XX ---");

    await setXxExample();

    console.log("\n--- MERGE ---");

    await mergeExample();

    console.log("\n--- SHALLOW MERGE ---");

    await shallowMergeWarning();

    console.log("\n--- SIZE ---");

    await sizeExample();

    console.log("\n--- COMPRESSION ---");

    await compressionConcept();

    console.log("\n--- ATOMICITY ---");

    await atomicityProblem();

    console.log("\n--- JSON vs HASH ---");

    await jsonVsHashExample();
  } catch (error) {
    console.error("Redis JSON error:", error);
  } finally {
    await redis.quit();
  }
}

await main();
