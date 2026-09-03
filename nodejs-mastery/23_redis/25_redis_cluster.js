/*
 * ============================================================
 * 25_redis_cluster.js
 * ============================================================
 *
 * Redis Cluster + ioredis
 *
 * Topics:
 *
 * 1. Redis Cluster architecture
 * 2. Cluster connection
 * 3. Hash slots
 * 4. Automatic node discovery
 * 5. Read scaling
 * 6. Failover
 * 7. Retry strategy
 * 8. Error handling
 * 9. Hash tags
 * 10. Multi-key operations
 * 11. Pipelines
 * 12. Transactions
 * 13. Cluster limitations
 * 14. Health checking
 * 15. Graceful shutdown
 *
 * ============================================================
 */

import Redis from "ioredis";

/*
 * ============================================================
 * Cluster nodes
 * ============================================================
 *
 * You don't need to list every Redis node.
 *
 * ioredis can discover the rest of the cluster
 * from the startup nodes.
 *
 * ============================================================
 */

const startupNodes = [
  {
    host: process.env.REDIS_CLUSTER_HOST_1 ?? "127.0.0.1",

    port: Number(process.env.REDIS_CLUSTER_PORT_1 ?? 7000),
  },

  {
    host: process.env.REDIS_CLUSTER_HOST_2 ?? "127.0.0.1",

    port: Number(process.env.REDIS_CLUSTER_PORT_2 ?? 7001),
  },

  {
    host: process.env.REDIS_CLUSTER_HOST_3 ?? "127.0.0.1",

    port: Number(process.env.REDIS_CLUSTER_PORT_3 ?? 7002),
  },
];

/*
 * ============================================================
 * Redis Cluster
 * ============================================================
 */

const cluster = new Redis.Cluster(startupNodes, {
  /*
   * Authentication.
   */

  redisOptions: {
    username: process.env.REDIS_USERNAME,

    password: process.env.REDIS_PASSWORD,

    connectTimeout: 10000,

    commandTimeout: 5000,

    /*
     * TLS example:
     *
     * tls: {
     *   rejectUnauthorized: true,
     * }
     */
  },

  /*
   * Retry connection to cluster.
   */

  clusterRetryStrategy(times) {
    const delay = Math.min(times * 200, 5000);

    console.warn(`[redis-cluster] retrying in ${delay}ms`);

    return delay;
  },

  /*
   * Maximum command retries.
   */

  maxRetriesPerRequest: 3,

  /*
   * Redis Cluster has MOVED
   * and ASK redirections.
   *
   * ioredis handles these
   * automatically.
   */
});

/*
 * ============================================================
 * Cluster events
 * ============================================================
 */

cluster.on("connect", () => {
  console.log("[redis-cluster] connected");
});

cluster.on("ready", () => {
  console.log("[redis-cluster] ready");
});

cluster.on("error", (error) => {
  console.error("[redis-cluster] error", {
    message: error.message,

    code: error.code,
  });
});

cluster.on("close", () => {
  console.warn("[redis-cluster] connection closed");
});

/*
 * ============================================================
 * 1. Basic SET
 * ============================================================
 */

async function setValue(key, value) {
  return cluster.set(key, value);
}

/*
 * ============================================================
 * 2. Basic GET
 * ============================================================
 */

async function getValue(key) {
  return cluster.get(key);
}

/*
 * ============================================================
 * 3. SET with TTL
 * ============================================================
 */

async function setCache(key, value, ttlSeconds = 300) {
  return cluster.set(key, value, "EX", ttlSeconds);
}

/*
 * ============================================================
 * 4. Delete
 * ============================================================
 */

async function deleteValue(key) {
  return cluster.del(key);
}

/*
 * ============================================================
 * 5. Hash tags
 * ============================================================
 *
 * IMPORTANT Redis Cluster concept.
 *
 * Example:
 *
 * user:{100}:profile
 * user:{100}:settings
 * user:{100}:permissions
 *
 * Everything inside { }
 * becomes the hash tag.
 *
 * Therefore all these keys
 * go to the same hash slot.
 *
 * ============================================================
 */

function userKey(userId, resource) {
  return `user:{${userId}}:${resource}`;
}

/*
 * ============================================================
 * 6. Multi-key operation
 * ============================================================
 */

async function getUserData(userId) {
  const profileKey = userKey(userId, "profile");

  const settingsKey = userKey(userId, "settings");

  /*
   * Because both keys have:
   *
   * {userId}
   *
   * they belong to the same
   * Redis Cluster hash slot.
   */

  return cluster.mget(profileKey, settingsKey);
}

/*
 * ============================================================
 * 7. Multi-key transaction
 * ============================================================
 */

async function updateUser(userId) {
  const profileKey = userKey(userId, "profile");

  const settingsKey = userKey(userId, "settings");

  /*
   * Both keys must belong to
   * the same hash slot.
   */

  return cluster
    .multi()

    .set(profileKey, "profile-data")

    .set(settingsKey, "settings-data")

    .exec();
}

/*
 * ============================================================
 * 8. Pipeline
 * ============================================================
 */

async function pipelineExample(userId) {
  const pipeline = cluster.pipeline();

  /*
   * Same hash tag.
   */

  pipeline.set(userKey(userId, "profile"), "profile-data");

  pipeline.set(userKey(userId, "settings"), "settings-data");

  pipeline.get(userKey(userId, "profile"));

  return pipeline.exec();
}

/*
 * ============================================================
 * 9. Cluster-aware batch operation
 * ============================================================
 *
 * Different keys can belong to
 * different nodes.
 *
 * Don't assume that all keys
 * are located on one master.
 * ============================================================
 */

async function setUsers(users) {
  const pipeline = cluster.pipeline();

  for (const user of users) {
    pipeline.set(
      `user:${user.id}`,

      JSON.stringify(user),
    );
  }

  return pipeline.exec();
}

/*
 * ============================================================
 * 10. Hash-tagged batch
 * ============================================================
 */

async function setUserResources(userId, resources) {
  const pipeline = cluster.pipeline();

  for (const resource of resources) {
    pipeline.set(
      userKey(userId, resource.name),

      resource.value,
    );
  }

  return pipeline.exec();
}

/*
 * ============================================================
 * 11. INCR
 * ============================================================
 */

async function increment(key) {
  return cluster.incr(key);
}

/*
 * ============================================================
 * 12. Rate limiter key
 * ============================================================
 */

async function incrementRateLimit(userId) {
  const key = `rate-limit:{${userId}}`;

  const count = await cluster.incr(key);

  if (count === 1) {
    await cluster.expire(key, 60);
  }

  return count;
}

/*
 * ============================================================
 * 13. Get cluster nodes
 * ============================================================
 */

async function getNodes() {
  return cluster.nodes();
}

/*
 * ============================================================
 * 14. Get master nodes
 * ============================================================
 */

async function getMasters() {
  return cluster.nodes("master");
}

/*
 * ============================================================
 * 15. Get replica nodes
 * ============================================================
 */

async function getReplicas() {
  return cluster.nodes("slave");
}

/*
 * ============================================================
 * 16. Health check
 * ============================================================
 */

async function healthCheck() {
  try {
    const result = await cluster.ping();

    return {
      healthy: result === "PONG",
    };
  } catch (error) {
    console.error("[redis-cluster] health check failed", error);

    return {
      healthy: false,
    };
  }
}

/*
 * ============================================================
 * 17. Read from replicas
 * ============================================================
 *
 * WARNING:
 *
 * Replica reads can be eventually consistent.
 *
 * ============================================================
 */

const readCluster = new Redis.Cluster(startupNodes, {
  scaleReads: "slave",

  redisOptions: {
    username: process.env.REDIS_USERNAME,

    password: process.env.REDIS_PASSWORD,
  },
});

async function readFromReplica(key) {
  return readCluster.get(key);
}

/*
 * ============================================================
 * 18. Write + immediate read
 * ============================================================
 *
 * If strong read-after-write consistency
 * is required, don't blindly use replicas.
 * ============================================================
 */

async function writeThenRead(key, value) {
  await cluster.set(key, value);

  /*
   * Read from the primary cluster
   * connection.
   */

  return cluster.get(key);
}

/*
 * ============================================================
 * 19. Error handling
 * ============================================================
 */

async function safeGet(key) {
  try {
    return await cluster.get(key);
  } catch (error) {
    console.error("[redis-cluster] GET failed", {
      key,

      message: error.message,

      code: error.code,
    });

    /*
     * Cache operations normally
     * fail open.
     */

    return null;
  }
}

/*
 * ============================================================
 * 20. Cluster shutdown
 * ============================================================
 */

async function shutdown(signal) {
  console.log(`[shutdown] ${signal}`);

  try {
    await Promise.all([cluster.quit(), readCluster.quit()]);
  } catch (error) {
    console.error("[shutdown]", error.message);

    cluster.disconnect();
    readCluster.disconnect();
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  console.log("Redis Cluster");

  console.log("Health:", await healthCheck());

  await setCache("demo:key", "hello", 300);

  console.log("GET:", await getValue("demo:key"));

  console.log("Masters:", (await getMasters()).length);

  console.log("Replicas:", (await getReplicas()).length);

  console.log("User data:", await getUserData("100"));
}

await main();
