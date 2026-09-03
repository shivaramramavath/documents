/*
 * ============================================================
 * 27_redis_monitoring.js
 * ============================================================
 *
 * Redis Monitoring with ioredis
 *
 * Topics:
 *
 * 1. Health check
 * 2. Latency monitoring
 * 3. Redis INFO
 * 4. Memory monitoring
 * 5. Connection monitoring
 * 6. Command statistics
 * 7. Cache hit/miss
 * 8. Keyspace monitoring
 * 9. Replication monitoring
 * 10. Slowlog
 * 11. Error monitoring
 * 12. Application metrics
 * 13. Prometheus-style metrics
 * 14. Continuous monitoring
 *
 * ============================================================
 */

import Redis from "ioredis";

/*
 * ============================================================
 * Redis
 * ============================================================
 */

const redis = new Redis({
  host: process.env.REDIS_HOST ?? "127.0.0.1",

  port: Number(process.env.REDIS_PORT ?? 6379),

  username: process.env.REDIS_USERNAME,

  password: process.env.REDIS_PASSWORD,

  connectTimeout: 10000,

  commandTimeout: 5000,

  maxRetriesPerRequest: 3,
});

/*
 * ============================================================
 * Application metrics
 * ============================================================
 */

const metrics = {
  redisErrors: 0,

  cacheHits: 0,

  cacheMisses: 0,

  commands: 0,

  commandErrors: 0,
};

/*
 * ============================================================
 * Redis events
 * ============================================================
 */

redis.on("ready", () => {
  console.log("[redis] READY");
});

redis.on("error", (error) => {
  metrics.redisErrors++;

  console.error("[redis] ERROR", {
    message: error.message,

    code: error.code,
  });
});

redis.on("reconnecting", (delay) => {
  console.warn("[redis] RECONNECTING", {
    delay,
  });
});

redis.on("close", () => {
  console.warn("[redis] CLOSED");
});

/*
 * ============================================================
 * 1. Basic health check
 * ============================================================
 */

async function healthCheck() {
  const startedAt = process.hrtime.bigint();

  try {
    const result = await redis.ping();

    const finishedAt = process.hrtime.bigint();

    const latencyMs = Number(finishedAt - startedAt) / 1_000_000;

    return {
      healthy: result === "PONG",

      latencyMs: Number(latencyMs.toFixed(2)),

      status: redis.status,
    };
  } catch (error) {
    return {
      healthy: false,

      latencyMs: null,

      status: redis.status,

      error: error.message,
    };
  }
}

/*
 * ============================================================
 * 2. Redis INFO
 * ============================================================
 */

async function getInfo(section) {
  return redis.info(section);
}

/*
 * ============================================================
 * 3. Parse INFO
 * ============================================================
 */

function parseInfo(info) {
  const result = {};

  for (const line of info.split("\r\n")) {
    if (!line || line.startsWith("#")) {
      continue;
    }

    const index = line.indexOf(":");

    if (index === -1) {
      continue;
    }

    const key = line.slice(0, index);

    const value = line.slice(index + 1);

    result[key] = value;
  }

  return result;
}

/*
 * ============================================================
 * 4. Memory monitoring
 * ============================================================
 */

async function memoryMetrics() {
  const info = parseInfo(await getInfo("memory"));

  return {
    usedMemoryBytes: Number(info.used_memory ?? 0),

    peakMemoryBytes: Number(info.used_memory_peak ?? 0),

    fragmentationRatio: Number(info.mem_fragmentation_ratio ?? 0),

    maxmemoryBytes: Number(info.maxmemory ?? 0),
  };
}

/*
 * ============================================================
 * 5. Connection monitoring
 * ============================================================
 */

async function connectionMetrics() {
  const info = parseInfo(await getInfo("clients"));

  return {
    connectedClients: Number(info.connected_clients ?? 0),

    blockedClients: Number(info.blocked_clients ?? 0),

    trackingClients: Number(info.tracking_clients ?? 0),
  };
}

/*
 * ============================================================
 * 6. Command statistics
 * ============================================================
 */

async function commandMetrics() {
  const info = parseInfo(await getInfo("stats"));

  return {
    totalCommands: Number(info.total_commands_processed ?? 0),

    instantaneousOps: Number(info.instantaneous_ops_per_sec ?? 0),

    rejectedConnections: Number(info.rejected_connections ?? 0),

    evictedKeys: Number(info.evicted_keys ?? 0),

    expiredKeys: Number(info.expired_keys ?? 0),

    keyspaceHits: Number(info.keyspace_hits ?? 0),

    keyspaceMisses: Number(info.keyspace_misses ?? 0),
  };
}

/*
 * ============================================================
 * 7. Cache hit ratio
 * ============================================================
 */

async function cacheHitRatio() {
  const info = await commandMetrics();

  const total = info.keyspaceHits + info.keyspaceMisses;

  if (total === 0) {
    return 0;
  }

  return (info.keyspaceHits / total) * 100;
}

/*
 * ============================================================
 * 8. Keyspace monitoring
 * ============================================================
 */

async function keyspaceMetrics() {
  const info = parseInfo(await getInfo("keyspace"));

  return info;
}

/*
 * ============================================================
 * 9. Replication monitoring
 * ============================================================
 */

async function replicationMetrics() {
  const info = parseInfo(await getInfo("replication"));

  return {
    role: info.role,

    connectedReplicas: Number(info.connected_slaves ?? 0),

    masterReplOffset: Number(info.master_repl_offset ?? 0),
  };
}

/*
 * ============================================================
 * 10. Server metrics
 * ============================================================
 */

async function serverMetrics() {
  const info = parseInfo(await getInfo("server"));

  return {
    redisVersion: info.redis_version,

    mode: info.redis_mode,

    os: info.os,

    uptimeSeconds: Number(info.uptime_in_seconds ?? 0),
  };
}

/*
 * ============================================================
 * 11. CPU metrics
 * ============================================================
 */

async function cpuMetrics() {
  const info = parseInfo(await getInfo("cpu"));

  return {
    usedCpuSys: Number(info.used_cpu_sys ?? 0),

    usedCpuUser: Number(info.used_cpu_user ?? 0),

    usedCpuSysChildren: Number(info.used_cpu_sys_children ?? 0),

    usedCpuUserChildren: Number(info.used_cpu_user_children ?? 0),
  };
}

/*
 * ============================================================
 * 12. Slowlog
 * ============================================================
 */

async function slowLog(count = 10) {
  return redis.slowlog("GET", count);
}

/*
 * ============================================================
 * 13. Application-level cache monitoring
 * ============================================================
 */

async function monitoredGet(key) {
  metrics.commands++;

  const startedAt = process.hrtime.bigint();

  try {
    const value = await redis.get(key);

    if (value === null) {
      metrics.cacheMisses++;
    } else {
      metrics.cacheHits++;
    }

    return value;
  } catch (error) {
    metrics.commandErrors++;

    throw error;
  } finally {
    const finishedAt = process.hrtime.bigint();

    const latency = Number(finishedAt - startedAt) / 1_000_000;

    console.log(
      "[redis:command]",

      {
        command: "GET",

        key,

        latencyMs: Number(latency.toFixed(2)),
      },
    );
  }
}

/*
 * ============================================================
 * 14. Application metrics
 * ============================================================
 */

function getApplicationMetrics() {
  const totalCacheRequests = metrics.cacheHits + metrics.cacheMisses;

  const hitRatio =
    totalCacheRequests === 0
      ? 0
      : (metrics.cacheHits / totalCacheRequests) * 100;

  return {
    ...metrics,

    cacheHitRatio: Number(hitRatio.toFixed(2)),
  };
}

/*
 * ============================================================
 * 15. Complete Redis dashboard snapshot
 * ============================================================
 */

async function getDashboard() {
  const [
    health,

    memory,

    connections,

    commands,

    replication,

    server,

    cpu,

    keyspace,
  ] = await Promise.all([
    healthCheck(),

    memoryMetrics(),

    connectionMetrics(),

    commandMetrics(),

    replicationMetrics(),

    serverMetrics(),

    cpuMetrics(),

    keyspaceMetrics(),
  ]);

  return {
    timestamp: new Date().toISOString(),

    health,

    memory,

    connections,

    commands,

    replication,

    server,

    cpu,

    keyspace,

    application: getApplicationMetrics(),
  };
}

/*
 * ============================================================
 * 16. Monitoring loop
 * ============================================================
 */

async function monitor() {
  try {
    const dashboard = await getDashboard();

    console.clear();

    console.log(JSON.stringify(dashboard, null, 2));
  } catch (error) {
    console.error("[monitoring]", error);
  }
}

/*
 * ============================================================
 * 17. Start monitoring
 * ============================================================
 */

const monitoringInterval = setInterval(monitor, 5000);

/*
 * Run immediately.
 */

await monitor();

/*
 * ============================================================
 * 18. Graceful shutdown
 * ============================================================
 */

async function shutdown(signal) {
  console.log(`[shutdown] ${signal}`);

  clearInterval(monitoringInterval);

  try {
    await redis.quit();
  } catch (error) {
    redis.disconnect();
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));
