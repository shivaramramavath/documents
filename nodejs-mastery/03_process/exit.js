/**
 * ============================================================
 * Node.js Process - Exit
 * ============================================================
 *
 * File: exit.js
 *
 * Topics:
 *
 *     process.exit()
 *     process.exitCode
 *     exit codes
 *     graceful termination
 *     process.on("exit")
 *
 * ============================================================
 *
 * Every Node.js application eventually terminates.
 *
 * The operating system receives an EXIT CODE that tells it
 * whether the process completed successfully or failed.
 *
 *
 * Common convention:
 *
 *     0     -> success
 *     non-0 -> error/failure
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. process.exitCode
 * ============================================================
 *
 * `process.exitCode` specifies the exit status that Node.js
 * should use when the process exits naturally.
 *
 *
 * Example:
 */

console.log("Initial exit code:", process.exitCode);

/*
 * Usually the initial value is:
 *
 *     undefined
 *
 * If no error occurs, Node normally exits with code 0.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Setting process.exitCode
 * ============================================================
 *
 * We can tell Node that the process should exit with a
 * particular status code.
 *
 *
 * Example:
 *
 *
 *     process.exitCode = 1;
 *
 *
 * IMPORTANT:
 *
 * We are NOT doing that yet because this file should normally
 * finish successfully while you are learning.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Exit code 0
 * ============================================================
 *
 * Exit code 0 conventionally means:
 *
 *
 *     SUCCESS
 *
 *
 * Example:
 *
 *
 *     process.exitCode = 0;
 *
 *
 * Node will normally finish with exit code 0.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Non-zero exit codes
 * ============================================================
 *
 * Non-zero codes conventionally indicate failure.
 *
 *
 * Examples:
 *
 *
 *     1
 *     2
 *     10
 *     100
 *
 *
 * There is no universal meaning for every custom non-zero
 * application code. Your application can define its own
 * conventions.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. process.exit()
 * ============================================================
 *
 * Syntax:
 *
 *
 *     process.exit(code);
 *
 *
 * It immediately terminates the Node.js process.
 *
 *
 * Example:
 *
 *
 *     process.exit(0);
 *
 *
 * means:
 *
 *
 *     Exit successfully.
 *
 *
 * Example:
 *
 *
 *     process.exit(1);
 *
 *
 * means:
 *
 *
 *     Exit with an error status.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. IMPORTANT WARNING about process.exit()
 * ============================================================
 *
 * `process.exit()` is forceful.
 *
 * If you call it while asynchronous operations are still
 * pending, Node can terminate before those operations finish.
 *
 *
 * Example of a dangerous pattern:
 *
 *
 *     saveImportantData();
 *
 *     process.exit(1);
 *
 *
 * The save operation may not finish.
 *
 *
 * Therefore:
 *
 *
 *     Do NOT use process.exit() as your default shutdown
 *     mechanism in a server.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. process.exitCode is usually safer
 * ============================================================
 *
 * Instead of:
 *
 *
 *     process.exit(1);
 *
 *
 * you can often use:
 *
 *
 *     process.exitCode = 1;
 *
 *
 * and allow Node to finish pending work naturally.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Example: validation failure
 * ============================================================
 */

function validateConfiguration() {
  const isValid = true;

  if (!isValid) {
    console.error("Invalid configuration.");

    process.exitCode = 1;

    return false;
  }

  return true;
}

validateConfiguration();

/*
 * Since the configuration is currently valid, the process
 * continues normally.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Exit event
 * ============================================================
 *
 * Node.js emits the "exit" event when the process is about
 * to exit.
 *
 *
 * Example:
 */

process.on("exit", (code) => {
  console.log("Process is exiting.");

  console.log("Exit code:", code);
});

/*
 * IMPORTANT:
 *
 * The exit event must only perform synchronous operations.
 *
 * Do NOT expect asynchronous operations to complete here.
 *
 *
 * BAD:
 *
 *
 *     process.on("exit", () => {
 *
 *       setTimeout(() => {
 *         console.log("This may not run");
 *       }, 1000);
 *
 *     });
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. beforeExit event
 * ============================================================
 *
 * Node also provides:
 *
 *
 *     beforeExit
 *
 *
 * It occurs when Node has no more work scheduled.
 *
 *
 * Example:
 */

process.on("beforeExit", (code) => {
  console.log("beforeExit event.");

  console.log("Current exit code:", code);
});

/*
 * Difference:
 *
 *
 * beforeExit
 *
 *     Node has finished its current work and is preparing
 *     to exit naturally.
 *
 *
 * exit
 *
 *     Node is actually exiting.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. beforeExit can keep Node alive
 * ============================================================
 *
 * In a beforeExit handler, scheduling additional asynchronous
 * work can cause Node to continue running.
 *
 *
 * Example:
 *
 *
 *     process.on(
 *       "beforeExit",
 *       () => {
 *
 *         setTimeout(() => {
 *
 *           console.log(
 *             "Additional work",
 *           );
 *
 *         }, 1000);
 *
 *       },
 *     );
 *
 *
 * Be careful:
 *
 * If you continually schedule more work, the process may never
 * naturally exit.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. process.exit() vs process.exitCode
 * ============================================================
 *
 *
 * process.exit()
 *
 *     Immediately terminates the process.
 *
 *
 * process.exitCode
 *
 *     Sets the eventual exit status while allowing Node to
 *     continue and finish naturally.
 *
 *
 * ============================================================
 *
 *
 * Prefer:
 *
 *
 *     process.exitCode = 1;
 *
 *
 * when you can safely allow the process to finish.
 *
 *
 * Use:
 *
 *
 *     process.exit(1);
 *
 *
 * only when immediate termination is actually required.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. CLI example
 * ============================================================
 *
 * Imagine a CLI:
 *
 *
 *     node database-migrate.js
 *
 *
 * If migration succeeds:
 *
 *
 *     exit code = 0
 *
 *
 * If migration fails:
 *
 *
 *     exit code = 1
 *
 *
 * CI/CD systems can use this information to determine whether
 * the command succeeded.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Checking the exit code in PowerShell
 * ============================================================
 *
 * Run a Node program:
 *
 *
 *     node .\03_process\exit.js
 *
 *
 * PowerShell stores the previous command's exit code in:
 *
 *
 *     $LASTEXITCODE
 *
 *
 * Example:
 *
 *
 *     node .\03_process\exit.js
 *
 *     $LASTEXITCODE
 *
 *
 * Successful execution:
 *
 *
 *     0
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Example failure program
 * ============================================================
 *
 * Create a temporary file:
 *
 *
 *     exit_failure.js
 *
 *
 * with:
 *
 *
 *     console.error("Something failed.");
 *
 *     process.exitCode = 1;
 *
 *
 * Then run:
 *
 *
 *     node exit_failure.js
 *
 *
 * followed by:
 *
 *
 *     $LASTEXITCODE
 *
 *
 * You should get:
 *
 *
 *     1
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Why exit codes matter
 * ============================================================
 *
 * Exit codes are especially important in:
 *
 *
 *     - CLI tools
 *     - Shell scripts
 *     - Docker
 *     - CI/CD
 *     - Kubernetes
 *     - Cron jobs
 *     - Deployment scripts
 *     - Database migrations
 *
 *
 * Example:
 *
 *
 *     Node application
 *           │
 *           ▼
 *      exit code 0
 *           │
 *           ▼
 *       CI pipeline
 *           │
 *           ▼
 *        SUCCESS
 *
 *
 * Or:
 *
 *
 *     Node application
 *           │
 *           ▼
 *      exit code 1
 *           │
 *           ▼
 *       CI pipeline
 *           │
 *           ▼
 *        FAILURE
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Graceful shutdown
 * ============================================================
 *
 * Backend servers should normally shut down gracefully.
 *
 *
 * Graceful shutdown means:
 *
 *
 *     1. Stop accepting new work.
 *
 *     2. Finish important in-flight work.
 *
 *     3. Close database connections.
 *
 *     4. Close Redis connections.
 *
 *     5. Close HTTP server.
 *
 *     6. Exit with the appropriate status code.
 *
 *
 * This is much better than immediately calling:
 *
 *
 *     process.exit()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Example graceful shutdown
 * ============================================================
 *
 * Imagine an HTTP server:
 *
 *
 *     const server =
 *       http.createServer(...);
 *
 *
 * When shutdown is requested:
 *
 *
 *     server.close(() => {
 *
 *       console.log(
 *         "Server closed.",
 *       );
 *
 *     });
 *
 *
 * The server stops accepting new connections and allows
 * existing connections to finish according to the server's
 * shutdown behavior.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Database cleanup
 * ============================================================
 *
 * A real backend might have:
 *
 *
 *     MongoDB connection
 *     Redis connection
 *     Kafka connection
 *
 *
 * During shutdown:
 *
 *
 *     await mongoose.disconnect();
 *
 *     await redis.quit();
 *
 *     await kafka.disconnect();
 *
 *
 * The exact APIs depend on the libraries being used.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Why not process.exit() after cleanup?
 * ============================================================
 *
 * You can use process.exit() when you have completed all
 * required cleanup and immediate termination is appropriate.
 *
 * But many applications can simply let the event loop become
 * empty after cleanup.
 *
 *
 * Example:
 *
 *
 *     await database.close();
 *
 *     await redis.close();
 *
 *     server.close();
 *
 *
 * Once nothing is keeping the process alive, Node can exit.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Error handling + exit code
 * ============================================================
 *
 * A CLI application might do:
 */

function main() {
  try {
    console.log("Running application...");

    // Application work goes here.
  } catch (error) {
    console.error("Application failed:", error);

    process.exitCode = 1;
  }
}

main();

/*
 * This is preferable to blindly doing:
 *
 *
 *     process.exit(1);
 *
 *
 * immediately after catching an error.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Async main pattern
 * ============================================================
 *
 * A common Node.js backend pattern is:
 *
 *
 *     async function main() {
 *
 *       try {
 *
 *         await startApplication();
 *
 *       } catch (error) {
 *
 *         console.error(error);
 *
 *         process.exitCode = 1;
 *
 *       }
 *
 *     }
 *
 *
 *     main();
 *
 *
 * This provides a central place for application startup errors.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Signals
 * ============================================================
 *
 * Operating systems can request that a process terminate.
 *
 *
 * Important signals include:
 *
 *
 *     SIGINT
 *     SIGTERM
 *
 *
 * A Node.js application can listen for them.
 *
 *
 * Example:
 *
 *
 *     process.on(
 *       "SIGTERM",
 *       () => {
 *         // graceful shutdown
 *       },
 *     );
 *
 *
 * We will study this in detail in:
 *
 *
 *     03_process/signals.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Ctrl + C
 * ============================================================
 *
 * When you press:
 *
 *
 *     Ctrl + C
 *
 *
 * in a terminal, the operating system commonly sends:
 *
 *
 *     SIGINT
 *
 *
 * to the running process.
 *
 *
 * We can listen for it:
 *
 *
 *     process.on(
 *       "SIGINT",
 *       () => {
 *         console.log(
 *           "Ctrl+C received",
 *         );
 *       },
 *     );
 *
 *
 * This will be covered in signals.js.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Server shutdown architecture
 * ============================================================
 *
 *
 *                 SIGTERM / SIGINT
 *                         │
 *                         ▼
 *                 Shutdown handler
 *                         │
 *              ┌──────────┼──────────┐
 *              ▼          ▼          ▼
 *           HTTP       Database     Redis
 *           close       close       close
 *              │          │          │
 *              └──────────┼──────────┘
 *                         ▼
 *                   Process exits
 *
 *
 * This pattern is extremely important for production
 * Node.js applications.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Do not use exit for normal application logic
 * ============================================================
 *
 * Avoid code such as:
 *
 *
 *     if (!user) {
 *
 *       process.exit(1);
 *
 *     }
 *
 *
 * in an HTTP server.
 *
 *
 * An HTTP request should normally receive an error response,
 * not terminate the entire Node.js process.
 *
 *
 * Better:
 *
 *
 *     return response.status(404).json({
 *       message: "User not found",
 *     });
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. When process.exit() makes sense
 * ============================================================
 *
 * It can be appropriate in situations such as:
 *
 *
 *     - Fatal startup failure
 *     - CLI command failure
 *     - Invalid unrecoverable configuration
 *     - Explicit command termination
 *
 *
 * Even then, consider whether cleanup is required first.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Exit status example
 * ============================================================
 *
 *
 * SUCCESS:
 *
 *     process.exitCode = 0;
 *
 *
 * FAILURE:
 *
 *     process.exitCode = 1;
 *
 *
 * IMMEDIATE SUCCESS:
 *
 *     process.exit(0);
 *
 *
 * IMMEDIATE FAILURE:
 *
 *     process.exit(1);
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Important difference
 * ============================================================
 *
 *
 * process.exitCode = 1;
 *
 *     "When you eventually exit, report failure."
 *
 *
 *
 * process.exit(1);
 *
 *     "Stop the process NOW and report failure."
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Final mental model
 * ============================================================
 *
 *
 *                    Node.js Process
 *                          │
 *                          ▼
 *                    Application work
 *                          │
 *             ┌────────────┴────────────┐
 *             ▼                         ▼
 *         Success                    Failure
 *             │                         │
 *             ▼                         ▼
 *        exit code 0              exit code != 0
 *             │                         │
 *             └────────────┬────────────┘
 *                          ▼
 *                   Operating System
 *
 * ============================================================
 */

/*
 * ============================================================
 * FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * Set eventual exit code:
 *
 *     process.exitCode = 1;
 *
 *
 * Immediately exit:
 *
 *     process.exit(1);
 *
 *
 * Success:
 *
 *     process.exitCode = 0;
 *
 *
 * Listen before natural exit:
 *
 *     process.on("beforeExit", callback);
 *
 *
 * Listen when exiting:
 *
 *     process.on("exit", callback);
 *
 *
 * Ctrl+C / SIGINT:
 *
 *     process.on("SIGINT", callback);
 *
 *
 * Server termination:
 *
 *     process.on("SIGTERM", callback);
 *
 *
 * ============================================================
 *
 * KEY RULE:
 *
 *     Prefer graceful shutdown and process.exitCode over
 *     forcefully calling process.exit() unless immediate
 *     termination is genuinely required.
 *
 * ============================================================
 */
