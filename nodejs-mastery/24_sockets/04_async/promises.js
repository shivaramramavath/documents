/**
 * ============================================================
 * 04_async/promises.js
 * ============================================================
 *
 * SOCKET.IO + PROMISES
 *
 * Topics:
 *
 * 01. Promise basics
 * 02. Promise states
 * 03. Promise.resolve()
 * 04. Promise.reject()
 * 05. then()
 * 06. catch()
 * 07. finally()
 * 08. async functions
 * 09. await
 * 10. Promise.all()
 * 11. Promise.allSettled()
 * 12. Promise.race()
 * 13. Promise.any()
 * 14. Sequential execution
 * 15. Parallel execution
 * 16. Concurrency control
 * 17. Error propagation
 * 18. Promise timeout
 * 19. Promise cancellation
 * 20. Fire-and-forget
 * 21. Socket.IO request flow
 * 22. Production patterns
 *
 * ============================================================
 */

import http from "node:http";

import express from "express";

import { Server } from "socket.io";

/*
 * ============================================================
 * EXPRESS
 * ============================================================
 */

const app = express();

/*
 * ============================================================
 * HTTP SERVER
 * ============================================================
 */

const httpServer = http.createServer(app);

/*
 * ============================================================
 * SOCKET.IO
 * ============================================================
 */

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

/*
 * ============================================================
 * BASIC PROMISE
 * ============================================================
 */

function basicPromise() {
  return new Promise((resolve, reject) => {
    const success = true;

    if (success) {
      resolve("Operation successful");

      return;
    }

    reject(new Error("Operation failed"));
  });
}

/*
 * ============================================================
 * PROMISE.RESOLVE
 * ============================================================
 */

function resolvedPromise() {
  return Promise.resolve({
    success: true,
  });
}

/*
 * ============================================================
 * PROMISE.REJECT
 * ============================================================
 */

function rejectedPromise() {
  return Promise.reject(new Error("Something went wrong"));
}

/*
 * ============================================================
 * ASYNC FUNCTION
 * ============================================================
 */

async function getUser() {
  return {
    id: "user_123",

    name: "Shiva",
  };
}

/*
 * ============================================================
 * SIMULATED DATABASE OPERATION
 * ============================================================
 */

async function databaseQuery(name, delayMs = 500) {
  await delay(delayMs);

  return {
    source: "database",

    name,

    timestamp: Date.now(),
  };
}

/*
 * ============================================================
 * SIMULATED API REQUEST
 * ============================================================
 */

async function externalApiRequest(name, delayMs = 500) {
  await delay(delayMs);

  return {
    source: "external-api",

    name,

    timestamp: Date.now(),
  };
}

/*
 * ============================================================
 * DELAY
 * ============================================================
 */

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/*
 * ============================================================
 * SOCKET CONNECTION
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  /*
   * ========================================================
   * 01. PROMISE DIRECTLY
   * ========================================================
   */

  socket.on("promise:basic", (payload, acknowledge) => {
    basicPromise()
      .then((result) => {
        acknowledge?.({
          success: true,

          data: result,
        });
      })
      .catch((error) => {
        acknowledge?.({
          success: false,

          error: {
            code: "PROMISE_FAILED",

            message: error.message,
          },
        });
      });
  });

  /*
   * ========================================================
   * 02. ASYNC/AWAIT
   * ========================================================
   */

  socket.on("promise:async", async (payload, acknowledge) => {
    try {
      const user = await getUser();

      acknowledge?.({
        success: true,

        data: user,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: {
          code: "INTERNAL_ERROR",
        },
      });
    }
  });

  /*
   * ========================================================
   * 03. THEN CHAIN
   * ========================================================
   */

  socket.on("promise:chain", (payload, acknowledge) => {
    databaseQuery(payload.name)
      .then((user) => {
        return externalApiRequest(user.name);
      })
      .then((apiResult) => {
        acknowledge?.({
          success: true,

          data: apiResult,
        });
      })
      .catch((error) => {
        acknowledge?.({
          success: false,

          error: {
            code: "CHAIN_FAILED",

            message: error.message,
          },
        });
      });
  });

  /*
   * ========================================================
   * 04. FINALLY
   * ========================================================
   */

  socket.on("promise:finally", async (payload, acknowledge) => {
    try {
      const result = await databaseQuery(payload.name);

      acknowledge?.({
        success: true,

        data: result,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: {
          code: "DATABASE_ERROR",
        },
      });
    } finally {
      /*
       * Runs whether operation succeeds or fails.
       *
       * Useful for:
       *
       * cleanup
       * metrics
       * tracing
       * releasing resources
       */

      console.log("Operation finished");
    }
  });

  /*
   * ========================================================
   * 05. PROMISE.ALL
   * ========================================================
   *
   * All operations start immediately.
   *
   * ========================================================
   */

  socket.on("promise:all", async (payload, acknowledge) => {
    try {
      const [user, profile, settings] = await Promise.all([
        databaseQuery(payload.name, 500),

        databaseQuery("profile", 500),

        databaseQuery("settings", 500),
      ]);

      acknowledge?.({
        success: true,

        data: {
          user,
          profile,
          settings,
        },
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: {
          code: "PARALLEL_FAILED",
        },
      });
    }
  });

  /*
   * ========================================================
   * 06. PROMISE.ALLSETTLED
   * ========================================================
   */

  socket.on("promise:all-settled", async (payload, acknowledge) => {
    const results = await Promise.allSettled([
      databaseQuery("user", 300),

      databaseQuery("profile", 500),

      failingOperation(),
    ]);

    acknowledge?.({
      success: true,

      data: results,
    });
  });

  /*
   * ========================================================
   * 07. PROMISE.RACE
   * ========================================================
   *
   * First settled promise wins.
   *
   * It can be either:
   *
   * fulfilled
   * rejected
   *
   * ========================================================
   */

  socket.on("promise:race", async (payload, acknowledge) => {
    try {
      const result = await Promise.race([
        databaseQuery("server-a", 300),

        databaseQuery("server-b", 100),
      ]);

      acknowledge?.({
        success: true,

        data: result,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: {
          code: "RACE_FAILED",
        },
      });
    }
  });

  /*
   * ========================================================
   * 08. PROMISE.ANY
   * ========================================================
   *
   * First fulfilled promise wins.
   *
   * Rejected promises are ignored until all reject.
   *
   * ========================================================
   */

  socket.on("promise:any", async (payload, acknowledge) => {
    try {
      const result = await Promise.any([
        failingOperation(),

        databaseQuery("backup-a", 500),

        databaseQuery("backup-b", 200),
      ]);

      acknowledge?.({
        success: true,

        data: result,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: {
          code: "ALL_SOURCES_FAILED",
        },
      });
    }
  });

  /*
   * ========================================================
   * 09. SEQUENTIAL
   * ========================================================
   */

  socket.on("promise:sequential", async (payload, acknowledge) => {
    const startedAt = Date.now();

    try {
      const first = await databaseQuery("first", 500);

      const second = await databaseQuery("second", 500);

      const third = await databaseQuery("third", 500);

      const duration = Date.now() - startedAt;

      acknowledge?.({
        success: true,

        data: {
          first,
          second,
          third,

          duration,
        },
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: {
          code: "SEQUENTIAL_FAILED",
        },
      });
    }
  });

  /*
   * ========================================================
   * 10. PARALLEL
   * ========================================================
   */

  socket.on("promise:parallel", async (payload, acknowledge) => {
    const startedAt = Date.now();

    try {
      const [first, second, third] = await Promise.all([
        databaseQuery("first", 500),

        databaseQuery("second", 500),

        databaseQuery("third", 500),
      ]);

      const duration = Date.now() - startedAt;

      acknowledge?.({
        success: true,

        data: {
          first,
          second,
          third,

          duration,
        },
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: {
          code: "PARALLEL_FAILED",
        },
      });
    }
  });

  /*
   * ========================================================
   * 11. CONCURRENCY LIMIT
   * ========================================================
   *
   * Never start thousands of expensive operations at once.
   *
   * ========================================================
   */

  socket.on("promise:concurrency", async (payload, acknowledge) => {
    try {
      const results = await mapWithConcurrency(
        payload.items,
        3,
        async (item) => {
          return databaseQuery(item, 500);
        },
      );

      acknowledge?.({
        success: true,

        data: results,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: {
          code: "CONCURRENCY_FAILED",
        },
      });
    }
  });

  /*
   * ========================================================
   * 12. TIMEOUT
   * ========================================================
   */

  socket.on("promise:timeout", async (payload, acknowledge) => {
    try {
      const result = await withTimeout(
        databaseQuery(payload.name, 5_000),

        2_000,
      );

      acknowledge?.({
        success: true,

        data: result,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: {
          code: error.code ?? "OPERATION_FAILED",
        },
      });
    }
  });

  /*
   * ========================================================
   * 13. FIRE AND FORGET
   * ========================================================
   */

  socket.on("promise:background", (payload, acknowledge) => {
    /*
     * Response immediately.
     */

    acknowledge?.({
      success: true,

      accepted: true,
    });

    /*
     * Background operation.
     *
     * IMPORTANT:
     * Handle rejection explicitly.
     */

    void backgroundJob(payload).catch((error) => {
      console.error("Background job failed:", error);
    });
  });

  /*
   * ========================================================
   * DISCONNECT
   * ========================================================
   */

  socket.on("disconnect", (reason) => {
    console.log("Disconnected:", socket.id, reason);
  });
});

/*
 * ============================================================
 * FAILING OPERATION
 * ============================================================
 */

async function failingOperation() {
  await delay(200);

  throw new Error("Operation failed");
}

/*
 * ============================================================
 * TIMEOUT WRAPPER
 * ============================================================
 */

function withTimeout(promise, milliseconds) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const error = new Error("Operation timed out");

      error.code = "TIMEOUT";

      reject(error);
    }, milliseconds);

    promise
      .then((value) => {
        clearTimeout(timer);

        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);

        reject(error);
      });
  });
}

/*
 * ============================================================
 * CONCURRENCY CONTROL
 * ============================================================
 */

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);

  let nextIndex = 0;

  async function workerLoop() {
    while (true) {
      const index = nextIndex++;

      if (index >= items.length) {
        return;
      }

      results[index] = await worker(items[index]);
    }
  }

  const workerCount = Math.min(limit, items.length);

  const workers = Array.from(
    {
      length: workerCount,
    },
    () => workerLoop(),
  );

  await Promise.all(workers);

  return results;
}

/*
 * ============================================================
 * BACKGROUND JOB
 * ============================================================
 */

async function backgroundJob(payload) {
  await delay(1_000);

  console.log("Background job completed:", payload);
}

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

httpServer.listen(3000, () => {
  console.log("Socket.IO server running on port 3000");
});
