import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

/*
 * ============================================================
 * Connection events
 * ============================================================
 */

redis.on("connect", () => {
  console.log("[redis] connected");
});

redis.on("ready", () => {
  console.log("[redis] ready");
});

redis.on("error", (error) => {
  console.error("[redis] error:", error);
});

redis.on("close", () => {
  console.log("[redis] connection closed");
});

/*
 * ============================================================
 * Cleanup
 * ============================================================
 */

async function cleanup() {
  await redis.del(
    "tx:user:100",
    "tx:balance",
    "tx:counter",
    "tx:profile",
    "tx:stock",
    "tx:account:a",
    "tx:account:b",
    "tx:watched",
  );
}

/*
 * ============================================================
 * 01. Basic MULTI / EXEC
 * ============================================================
 */

async function basicTransaction() {
  const result = await redis
    .multi()
    .set("tx:user:100", "Shiva")
    .set("tx:balance", "5000")
    .set("tx:profile", "student")
    .exec();

  console.log("Transaction result:", result);
}

/*
 * ============================================================
 * 02. Reading transaction results
 * ============================================================
 */

async function transactionResult() {
  const result = await redis
    .multi()
    .set("tx:counter", "10")
    .incrby("tx:counter", 5)
    .get("tx:counter")
    .exec();

  console.log("Raw result:", result);

  /*
   * ioredis returns:
   *
   * [
   *   [null, "OK"],
   *   [null, 15],
   *   [null, "15"]
   * ]
   */

  if (result) {
    const finalValue = result[2]?.[1];

    console.log("Final value:", finalValue);
  }
}

/*
 * ============================================================
 * 03. MULTI can be stored in a variable
 * ============================================================
 */

async function multiVariableExample() {
  const transaction = redis.multi();

  transaction.set("tx:user:100", "Shiva");

  transaction.set("tx:balance", "1000");

  transaction.incrby("tx:balance", 500);

  const result = await transaction.exec();

  console.log("Result:", result);
}

/*
 * ============================================================
 * 04. DISCARD
 * ============================================================
 *
 * DISCARD removes queued commands.
 * Nothing is executed.
 * ============================================================
 */

async function discardExample() {
  const transaction = redis.multi();

  transaction.set("tx:user:100", "This will NOT be stored");

  transaction.set("tx:balance", "999999");

  await transaction.discard();

  const user = await redis.get("tx:user:100");

  const balance = await redis.get("tx:balance");

  console.log("User:", user);

  console.log("Balance:", balance);
}

/*
 * ============================================================
 * 05. Multiple operations atomically
 * ============================================================
 */

async function atomicOperations() {
  await redis.set("tx:counter", 0);

  const result = await redis
    .multi()
    .incr("tx:counter")
    .incr("tx:counter")
    .incrby("tx:counter", 10)
    .get("tx:counter")
    .exec();

  console.log("Atomic transaction:", result);
}

/*
 * ============================================================
 * 06. WATCH
 * ============================================================
 *
 * WATCH implements optimistic locking.
 *
 * If another client changes the watched key
 * before EXEC, the transaction is aborted.
 * ============================================================
 */

async function watchExample() {
  await redis.set("tx:watched", "100");

  /*
   * WATCH the key.
   */

  await redis.watch("tx:watched");

  /*
   * Read current value.
   */

  const current = await redis.get("tx:watched");

  console.log("Current value:", current);

  const newValue = Number(current) + 50;

  /*
   * Start transaction.
   */

  const result = await redis.multi().set("tx:watched", newValue).exec();

  console.log("WATCH transaction:", result);

  /*
   * If the watched key was changed by
   * another client after WATCH,
   *
   * EXEC returns null.
   */
}

/*
 * ============================================================
 * 07. WATCH with optimistic concurrency
 * ============================================================
 */

async function optimisticUpdate(key, update, maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      /*
       * WATCH the key.
       */

      await redis.watch(key);

      /*
       * Read current value.
       */

      const current = await redis.get(key);

      const currentValue = Number(current ?? 0);

      /*
       * Calculate new value.
       */

      const nextValue = update(currentValue);

      /*
       * Transaction.
       */

      const result = await redis.multi().set(key, nextValue).exec();

      /*
       * null means WATCH failed.
       */

      if (result === null) {
        console.log(`Conflict on attempt ${attempt}`);

        continue;
      }

      return nextValue;
    } finally {
      /*
       * Remove WATCH state.
       */

      await redis.unwatch();
    }
  }

  throw new Error("Transaction failed after maximum retries");
}

/*
 * ============================================================
 * 08. Optimistic update example
 * ============================================================
 */

async function optimisticUpdateExample() {
  await redis.set("tx:counter", 100);

  const value = await optimisticUpdate(
    "tx:counter",

    (current) => current + 25,
  );

  console.log("Updated value:", value);
}

/*
 * ============================================================
 * 09. Atomic balance transfer
 * ============================================================
 */

async function transferBalance(from, to, amount) {
  await redis.watch(from, to);

  try {
    const fromBalance = Number((await redis.get(from)) ?? 0);

    const toBalance = Number((await redis.get(to)) ?? 0);

    /*
     * Validation happens BEFORE MULTI.
     */

    if (fromBalance < amount) {
      throw new Error("Insufficient balance");
    }

    const result = await redis
      .multi()
      .decrby(from, amount)
      .incrby(to, amount)
      .exec();

    /*
     * Another client changed
     * from/to between WATCH and EXEC.
     */

    if (result === null) {
      throw new Error("Concurrent modification detected");
    }

    return result;
  } finally {
    await redis.unwatch();
  }
}

/*
 * ============================================================
 * 10. Transfer example
 * ============================================================
 */

async function transferExample() {
  await redis.set("tx:account:a", 1000);

  await redis.set("tx:account:b", 500);

  const result = await transferBalance("tx:account:a", "tx:account:b", 200);

  console.log("Transfer result:", result);

  console.log("Account A:", await redis.get("tx:account:a"));

  console.log("Account B:", await redis.get("tx:account:b"));
}

/*
 * ============================================================
 * 11. UNWATCH
 * ============================================================
 */

async function unwatchExample() {
  await redis.watch("tx:watched");

  console.log("Key watched");

  await redis.unwatch();

  console.log("Watch removed");
}

/*
 * ============================================================
 * 12. Transaction command errors
 * ============================================================
 *
 * ioredis returns command-level errors
 * inside the EXEC result.
 * ============================================================
 */

async function commandErrorExample() {
  const result = await redis
    .multi()
    .set("tx:counter", "hello")
    .incr("tx:counter")
    .get("tx:counter")
    .exec();

  console.log("Transaction with command error:", result);
}

/*
 * ============================================================
 * 13. Transaction vs pipeline
 * ============================================================
 */

async function transactionVsPipeline() {
  /*
   * Pipeline:
   *
   * Sends multiple commands efficiently.
   *
   * NOT the same as a transaction.
   */

  const pipelineResult = await redis
    .pipeline()
    .set("tx:user:100", "Shiva")
    .set("tx:balance", "1000")
    .get("tx:user:100")
    .exec();

  console.log("Pipeline:", pipelineResult);

  /*
   * Transaction:
   *
   * MULTI + EXEC
   */

  const transactionResult = await redis
    .multi()
    .set("tx:user:100", "Ram")
    .set("tx:balance", "2000")
    .get("tx:user:100")
    .exec();

  console.log("Transaction:", transactionResult);
}

/*
 * ============================================================
 * 14. Transaction with expiration
 * ============================================================
 */

async function transactionWithTTL() {
  const result = await redis
    .multi()
    .set(
      "tx:session",
      JSON.stringify({
        userId: "user:100",

        role: "student",
      }),
    )
    .expire("tx:session", 300)
    .exec();

  console.log("Transaction + TTL:", result);
}

/*
 * ============================================================
 * 15. Transaction for cache initialization
 * ============================================================
 */

async function cacheInitialization() {
  const user = {
    id: "user:100",

    name: "Shiva Ram",

    role: "student",
  };

  const result = await redis
    .multi()
    .set("tx:user:100", JSON.stringify(user))
    .expire("tx:user:100", 3600)
    .set("tx:user:100:status", "active")
    .exec();

  console.log("Cache initialization:", result);
}

/*
 * ============================================================
 * 16. Error handling
 * ============================================================
 */

async function safeTransaction(commands) {
  const transaction = redis.multi();

  try {
    for (const command of commands) {
      command(transaction);
    }

    const result = await transaction.exec();

    if (result === null) {
      throw new Error("Transaction aborted because watched key changed");
    }

    return result;
  } catch (error) {
    try {
      await transaction.discard();
    } catch {
      // Transaction may already be executed.
    }

    throw error;
  }
}

/*
 * ============================================================
 * 17. Transaction with commands
 * ============================================================
 */

async function safeTransactionExample() {
  const result = await safeTransaction([
    (tx) => tx.set("tx:user:100", "Shiva"),

    (tx) => tx.set("tx:balance", "5000"),

    (tx) => tx.incrby("tx:balance", 500),
  ]);

  console.log("Safe transaction:", result);
}

/*
 * ============================================================
 * Main
 * ============================================================
 */

async function main() {
  try {
    await cleanup();

    console.log("\n--- BASIC TRANSACTION ---");

    await basicTransaction();

    console.log("\n--- TRANSACTION RESULT ---");

    await transactionResult();

    console.log("\n--- MULTI VARIABLE ---");

    await multiVariableExample();

    console.log("\n--- DISCARD ---");

    await discardExample();

    console.log("\n--- ATOMIC OPERATIONS ---");

    await atomicOperations();

    console.log("\n--- WATCH ---");

    await watchExample();

    console.log("\n--- OPTIMISTIC UPDATE ---");

    await optimisticUpdateExample();

    console.log("\n--- BALANCE TRANSFER ---");

    await transferExample();

    console.log("\n--- UNWATCH ---");

    await unwatchExample();

    console.log("\n--- COMMAND ERROR ---");

    await commandErrorExample();

    console.log("\n--- PIPELINE VS TRANSACTION ---");

    await transactionVsPipeline();

    console.log("\n--- TRANSACTION + TTL ---");

    await transactionWithTTL();

    console.log("\n--- CACHE INITIALIZATION ---");

    await cacheInitialization();

    console.log("\n--- SAFE TRANSACTION ---");

    await safeTransactionExample();
  } catch (error) {
    console.error("\nTransaction error:", error);
  } finally {
    await redis.quit();
  }
}

await main();
