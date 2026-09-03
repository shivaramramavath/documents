/**
 * ============================================================
 * 04_async/timeout.js
 * ============================================================
 *
 * SOCKET.IO + TIMEOUTS
 *
 * Topics:
 *
 * 01. Basic setTimeout
 * 02. Promise timeout
 * 03. Promise.race()
 * 04. Socket.IO ACK timeout
 * 05. Server operation timeout
 * 06. AbortController
 * 07. AbortSignal.timeout()
 * 08. AbortSignal handling
 * 09. Fetch timeout
 * 10. Database timeout pattern
 * 11. Cleanup
 * 12. Timeout errors
 * 13. Nested timeouts
 * 14. Per-operation timeout
 * 15. Global timeout
 * 16. Client ACK timeout
 * 17. Server -> client timeout
 * 18. Production handler
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
 * CUSTOM TIMEOUT ERROR
 * ============================================================
 */

class TimeoutError extends Error {
  constructor(message = "Operation timed out") {
    super(message);

    this.name = "TimeoutError";

    this.code = "TIMEOUT";
  }
}

/*
 * ============================================================
 * ABORT ERROR
 * ============================================================
 */

class OperationAbortedError extends Error {
  constructor(message = "Operation was aborted") {
    super(message);

    this.name = "OperationAbortedError";

    this.code = "ABORTED";
  }
}

/*
 * ============================================================
 * 01. BASIC setTimeout
 * ============================================================
 */

function basicTimeout() {
  const timer = setTimeout(() => {
    console.log("Timer completed");
  }, 2_000);

  /*
   * Always clear timers when they
   * are no longer necessary.
   */

  return timer;
}

/*
 * ============================================================
 * 02. PROMISE DELAY
 * ============================================================
 */

function delay(milliseconds) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);

      resolve();
    }, milliseconds);
  });
}

/*
 * ============================================================
 * 03. SIMPLE OPERATION
 * ============================================================
 */

async function slowOperation(milliseconds = 5_000) {
  await delay(milliseconds);

  return {
    success: true,

    completedAt: new Date().toISOString(),
  };
}

/*
 * ============================================================
 * 04. PROMISE.RACE TIMEOUT
 * ============================================================
 */

function withRaceTimeout(promise, milliseconds) {
  const timeout = new Promise((_resolve, reject) => {
    setTimeout(() => {
      reject(new TimeoutError());
    }, milliseconds);
  });

  return Promise.race([promise, timeout]);
}

/*
 * ============================================================
 * 05. CLEAN PROMISE TIMEOUT
 * ============================================================
 */

function withTimeout(promise, milliseconds) {
  return new Promise((resolve, reject) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) {
        return;
      }

      settled = true;

      reject(new TimeoutError(`Operation timed out after ${milliseconds}ms`));
    }, milliseconds);

    promise
      .then((value) => {
        if (settled) {
          return;
        }

        settled = true;

        clearTimeout(timer);

        resolve(value);
      })
      .catch((error) => {
        if (settled) {
          return;
        }

        settled = true;

        clearTimeout(timer);

        reject(error);
      });
  });
}

/*
 * ============================================================
 * 06. ABORTABLE OPERATION
 * ============================================================
 */

function abortableOperation(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    /*
     * Already aborted.
     */

    if (signal?.aborted) {
      reject(new OperationAbortedError());

      return;
    }

    /*
     * Main timer.
     */

    const timer = setTimeout(() => {
      cleanup();

      resolve({
        success: true,

        completed: true,
      });
    }, milliseconds);

    /*
     * Abort handler.
     */

    const onAbort = () => {
      clearTimeout(timer);

      cleanup();

      reject(new OperationAbortedError());
    };

    /*
     * Register abort listener.
     */

    signal?.addEventListener("abort", onAbort, {
      once: true,
    });

    /*
     * Cleanup.
     */

    function cleanup() {
      signal?.removeEventListener("abort", onAbort);
    }
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
   * 07. BASIC TIMEOUT
   * ========================================================
   */

  socket.on("timeout:basic", async (payload, acknowledge) => {
    try {
      const result = await withTimeout(
        slowOperation(payload?.delay ?? 1_000),
        3_000,
      );

      acknowledge?.({
        success: true,

        data: result,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: normalizeError(error),
      });
    }
  });

  /*
   * ========================================================
   * 08. PROMISE.RACE
   * ========================================================
   */

  socket.on("timeout:race", async (payload, acknowledge) => {
    try {
      const result = await withRaceTimeout(
        slowOperation(payload?.delay ?? 1_000),
        2_000,
      );

      acknowledge?.({
        success: true,

        data: result,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: normalizeError(error),
      });
    }
  });

  /*
   * ========================================================
   * 09. ABORTCONTROLLER
   * ========================================================
   *
   * Unlike Promise.race(), AbortController can signal
   * the underlying operation to stop.
   *
   * ========================================================
   */

  socket.on("timeout:abort", async (payload, acknowledge) => {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, 2_000);

    try {
      const result = await abortableOperation(
        payload?.delay ?? 5_000,
        controller.signal,
      );

      clearTimeout(timer);

      acknowledge?.({
        success: true,

        data: result,
      });
    } catch (error) {
      clearTimeout(timer);

      acknowledge?.({
        success: false,

        error: normalizeError(error),
      });
    }
  });

  /*
   * ========================================================
   * 10. AbortSignal.timeout()
   * ========================================================
   *
   * Node.js provides a signal that automatically aborts
   * after the specified number of milliseconds.
   *
   * ========================================================
   */

  socket.on("timeout:signal", async (payload, acknowledge) => {
    const signal = AbortSignal.timeout(2_000);

    try {
      const result = await abortableOperation(payload?.delay ?? 5_000, signal);

      acknowledge?.({
        success: true,

        data: result,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: normalizeError(error),
      });
    }
  });

  /*
   * ========================================================
   * 11. CLIENT ACK TIMEOUT
   * ========================================================
   *
   * This controls how long the CLIENT waits for
   * the server acknowledgement.
   *
   * ========================================================
   */

  socket.on("client:ack-timeout", () => {
    socket.timeout(5_000).emit(
      "server:operation",
      {
        requestedAt: Date.now(),
      },
      (error, response) => {
        if (error) {
          console.error("Client ACK timeout:", error);

          return;
        }

        console.log("ACK response:", response);
      },
    );
  });

  /*
   * ========================================================
   * 12. SERVER -> CLIENT ACK
   * ========================================================
   */

  socket.on("server:request-client", async () => {
    try {
      const result = await emitWithAckTimeout(
        socket,
        "client:confirm",
        {
          requestId: cryptoRandomId(),
        },
        5_000,
      );

      console.log("Client confirmed:", result);
    } catch (error) {
      console.error("Client confirmation failed:", error);
    }
  });

  /*
   * ========================================================
   * 13. DATABASE TIMEOUT PATTERN
   * ========================================================
   */

  socket.on("database:query", async (payload, acknowledge) => {
    try {
      const result = await databaseQuery(payload, 3_000);

      acknowledge?.({
        success: true,

        data: result,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: normalizeError(error),
      });
    }
  });

  /*
   * ========================================================
   * 14. EXTERNAL API TIMEOUT
   * ========================================================
   */

  socket.on("api:request", async (payload, acknowledge) => {
    try {
      const result = await externalApiRequest(payload.url, 5_000);

      acknowledge?.({
        success: true,

        data: result,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: normalizeError(error),
      });
    }
  });

  /*
   * ========================================================
   * 15. PRODUCTION COMMAND
   * ========================================================
   */

  socket.on("command:execute", async (payload, acknowledge) => {
    const startedAt = Date.now();

    try {
      /*
       * Validate timeout.
       */

      const timeoutMs = getSafeTimeout(payload?.timeout, 5_000);

      /*
       * Create cancellation controller.
       */

      const controller = new AbortController();

      /*
       * Create timeout.
       */

      const timer = setTimeout(() => {
        controller.abort();
      }, timeoutMs);

      try {
        /*
         * Execute actual operation.
         */

        const result = await abortableOperation(
          payload?.workMs ?? 1_000,
          controller.signal,
        );

        /*
         * Success.
         */

        acknowledge?.({
          success: true,

          data: result,

          meta: {
            duration: Date.now() - startedAt,
          },
        });
      } finally {
        /*
         * ALWAYS cleanup timer.
         */

        clearTimeout(timer);
      }
    } catch (error) {
      acknowledge?.({
        success: false,

        error: normalizeError(error),

        meta: {
          duration: Date.now() - startedAt,
        },
      });
    }
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
 * DATABASE QUERY SIMULATION
 * ============================================================
 */

async function databaseQuery(payload, timeoutMs) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await abortableOperation(payload?.delay ?? 1_000, controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

/*
 * ============================================================
 * EXTERNAL API REQUEST
 * ============================================================
 */

async function externalApiRequest(url, timeoutMs) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    /*
     * In real code:
     *
     * await fetch(
     *   url,
     *   {
     *     signal:
     *       controller.signal,
     *   },
     * );
     *
     */

    await abortableOperation(1_000, controller.signal);

    return {
      url,

      status: 200,

      success: true,
    };
  } finally {
    clearTimeout(timer);
  }
}

/*
 * ============================================================
 * SERVER -> CLIENT ACK WITH TIMEOUT
 * ============================================================
 */

function emitWithAckTimeout(socket, event, data, timeoutMs) {
  return new Promise((resolve, reject) => {
    socket.timeout(timeoutMs).emit(event, data, (error, response) => {
      if (error) {
        reject(
          new TimeoutError(`Client did not acknowledge within ${timeoutMs}ms`),
        );

        return;
      }

      resolve(response);
    });
  });
}

/*
 * ============================================================
 * SAFE TIMEOUT
 * ============================================================
 */

function getSafeTimeout(value, fallback) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  /*
   * Minimum:
   * 100 ms
   *
   * Maximum:
   * 30 seconds
   */

  return Math.min(Math.max(number, 100), 30_000);
}

/*
 * ============================================================
 * ERROR NORMALIZATION
 * ============================================================
 */

function normalizeError(error) {
  if (error instanceof TimeoutError) {
    return {
      code: "TIMEOUT",

      message: error.message,
    };
  }

  if (error instanceof OperationAbortedError) {
    return {
      code: "ABORTED",

      message: error.message,
    };
  }

  if (error?.name === "TimeoutError") {
    return {
      code: "TIMEOUT",

      message: "Operation timed out",
    };
  }

  if (error?.name === "AbortError") {
    return {
      code: "ABORTED",

      message: "Operation was aborted",
    };
  }

  return {
    code: "INTERNAL_ERROR",

    message: "Operation failed",
  };
}

/*
 * ============================================================
 * RANDOM REQUEST ID
 * ============================================================
 */

function cryptoRandomId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

httpServer.listen(3000, () => {
  console.log("Socket.IO server running on port 3000");
});
