/**
 * ============================================================
 * Node.js Process
 * ============================================================
 *
 * File: process.js
 *
 * Topic:
 * The global `process` object
 *
 * ============================================================
 *
 * `process` is a Node.js global object that provides
 * information and control over the current Node.js process.
 *
 * A "process" means the currently running instance of your
 * Node.js application.
 *
 * Example:
 *
 *     node app.js
 *
 * Node starts a process to execute app.js.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. process is a global object
 * ============================================================
 *
 * You do NOT need to import process.
 *
 * You can directly use:
 *
 *     process
 *
 * Example:
 */

console.log(process);

/*
 * You normally should NOT print the entire process object
 * in a real application because it contains a lot of data.
 *
 * Instead, access specific properties and methods.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Process ID
 * ============================================================
 *
 * `process.pid` gives the operating-system process ID.
 *
 * PID = Process ID
 *
 * Every running process gets a process ID from the OS.
 * ============================================================
 */

console.log("Process ID:", process.pid);

/*
 * Example output:
 *
 *     Process ID: 12345
 *
 *
 * The exact number will be different on every system.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Parent Process ID
 * ============================================================
 *
 * `process.ppid` gives the parent process ID.
 *
 * PPID = Parent Process ID
 *
 * A Node.js process can be started by another process.
 *
 * ============================================================
 */

console.log("Parent Process ID:", process.ppid);

/*
 * ============================================================
 * 4. Current working directory
 * ============================================================
 *
 * `process.cwd()` returns the current working directory.
 *
 * CWD = Current Working Directory
 * ============================================================
 */

console.log("Current working directory:", process.cwd());

/*
 * Example:
 *
 *     C:\Projects\nodejs-mastery
 *
 *
 * IMPORTANT:
 *
 * `process.cwd()` is the directory from which Node was
 * launched, not necessarily the directory containing this file.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Change current working directory
 * ============================================================
 *
 * Node.js allows you to change the current working directory:
 *
 *
 *     process.chdir(path)
 *
 *
 * Example:
 *
 *
 *     process.chdir("some-directory");
 *
 *
 * After changing:
 *
 *
 *     process.cwd()
 *
 * returns the new directory.
 *
 *
 * We won't change the directory in this learning file because
 * it could affect other examples.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Node.js version
 * ============================================================
 *
 * `process.version` gives the current Node.js version.
 * ============================================================
 */

console.log("Node.js version:", process.version);

/*
 * Example:
 *
 *     v24.x.x
 *
 * Your version may be different.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Node.js and dependency versions
 * ============================================================
 *
 * `process.versions` contains versions of Node.js and
 * components used by the runtime.
 * ============================================================
 */

console.log("Node.js versions:", process.versions);

/*
 * You can access a specific version:
 *
 *
 *     process.versions.node
 *
 *     process.versions.v8
 *
 *     process.versions.openssl
 *
 * ============================================================
 */

console.log("Node:", process.versions.node);

console.log("V8:", process.versions.v8);

/*
 * ============================================================
 * 8. Operating system platform
 * ============================================================
 *
 * `process.platform` identifies the operating system platform.
 * ============================================================
 */

console.log("Platform:", process.platform);

/*
 * Common values:
 *
 *     win32  -> Windows
 *     linux  -> Linux
 *     darwin -> macOS
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. CPU architecture
 * ============================================================
 *
 * `process.arch` tells you the CPU architecture Node.js is
 * running on.
 * ============================================================
 */

console.log("Architecture:", process.arch);

/*
 * Common values:
 *
 *     x64
 *     arm64
 *     arm
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Environment variables
 * ============================================================
 *
 * `process.env` contains environment variables.
 *
 * Example:
 *
 *
 *     process.env.NODE_ENV
 *
 *
 * Environment variables are heavily used in backend
 * applications.
 *
 * ============================================================
 */

console.log("Environment:", process.env.NODE_ENV);

/*
 * If NODE_ENV is not defined, this may print:
 *
 *     undefined
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Reading a custom environment variable
 * ============================================================
 *
 * Suppose your operating system has:
 *
 *
 *     APP_NAME=nodejs-mastery
 *
 *
 * Then:
 *
 *
 *     process.env.APP_NAME
 *
 *
 * gives:
 *
 *
 *     nodejs-mastery
 *
 * ============================================================
 */

console.log("APP_NAME:", process.env.APP_NAME);

/*
 * Environment variables are strings.
 *
 * For example:
 *
 *
 *     PORT=3000
 *
 *
 * gives:
 *
 *
 *     process.env.PORT
 *
 *
 * as:
 *
 *
 *     "3000"
 *
 *
 * NOT:
 *
 *
 *     3000
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Process uptime
 * ============================================================
 *
 * `process.uptime()` returns the number of seconds the current
 * Node.js process has been running.
 * ============================================================
 */

console.log("Uptime:", process.uptime());

/*
 * Example:
 *
 *     Uptime: 0.012
 *
 * The value increases while the process is running.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Memory usage
 * ============================================================
 *
 * `process.memoryUsage()` gives information about memory
 * consumed by the Node.js process.
 * ============================================================
 */

console.log("Memory usage:", process.memoryUsage());

/*
 * Important properties include:
 *
 *
 *     rss
 *     heapTotal
 *     heapUsed
 *     external
 *     arrayBuffers
 *
 *
 * `heapUsed` is especially useful when investigating JavaScript
 * heap consumption.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Resource usage
 * ============================================================
 *
 * Node.js can expose process resource usage through:
 *
 *
 *     process.resourceUsage()
 *
 *
 * Example:
 */

console.log("Resource usage:", process.resourceUsage());

/*
 * This can provide information such as:
 *
 *     user CPU time
 *     system CPU time
 *     page faults
 *     context switches
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Process title
 * ============================================================
 *
 * `process.title` represents the process title.
 * ============================================================
 */

console.log("Process title:", process.title);

/*
 * You can change it:
 *
 *
 *     process.title = "my-node-server";
 *
 *
 * Be careful with changing process metadata in production.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Process exit code
 * ============================================================
 *
 * `process.exitCode` specifies the exit code Node should use
 * when the process exits naturally.
 *
 *
 * Successful process:
 *
 *     0
 *
 *
 * Non-zero:
 *
 *     Usually indicates an error.
 *
 * ============================================================
 */

/*
 * Example:
 *
 *
 *     process.exitCode = 1;
 *
 *
 * This tells Node to eventually exit with code 1.
 *
 *
 * We are NOT setting it here because doing so would make this
 * learning program exit as an error.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. process.exit()
 * ============================================================
 *
 * `process.exit(code)` immediately terminates the process.
 *
 *
 * Example:
 *
 *
 *     process.exit(0);
 *
 *
 * means successful termination.
 *
 *
 * Example:
 *
 *
 *     process.exit(1);
 *
 *
 * means termination with an error status.
 *
 *
 * IMPORTANT:
 *
 * Avoid using process.exit() casually in server applications.
 * Immediate termination can prevent pending asynchronous work
 * from completing.
 *
 * Prefer setting:
 *
 *
 *     process.exitCode
 *
 *
 * when appropriate, or use a controlled shutdown strategy.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Standard input
 * ============================================================
 *
 * Node exposes:
 *
 *
 *     process.stdin
 *
 *
 * It represents standard input.
 *
 * Example:
 *
 *
 *     process.stdin.on("data", (data) => {
 *       console.log(data.toString());
 *     });
 *
 *
 * We will study stdin/stdout in:
 *
 *
 *     03_process/stdin_stdout.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Standard output
 * ============================================================
 *
 * Node exposes:
 *
 *
 *     process.stdout
 *
 *
 * `console.log()` ultimately writes to standard output through
 * Node's console mechanisms.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Standard error
 * ============================================================
 *
 * Node exposes:
 *
 *
 *     process.stderr
 *
 *
 * It is used for error output.
 *
 *
 * Example:
 */

console.error("This is an example error message.");

/*
 * `console.error()` writes to stderr.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Process arguments
 * ============================================================
 *
 * Command-line arguments are available through:
 *
 *
 *     process.argv
 *
 *
 * Example command:
 *
 *
 *     node app.js hello
 *
 *
 * You can access:
 *
 *
 *     process.argv
 *
 *
 * We will study this in detail in:
 *
 *
 *     03_process/argv.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Process events
 * ============================================================
 *
 * `process` is also an EventEmitter-like event source.
 *
 * You can listen for important process events.
 *
 *
 * Example:
 */

process.on("beforeExit", () => {
  console.log("Node.js is preparing to exit.");
});

/*
 * IMPORTANT:
 *
 * `beforeExit` is not the same as `exit`.
 *
 * `beforeExit` can occur when Node has no more work to perform
 * and, in some situations, additional asynchronous work can
 * keep the process alive.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. exit event
 * ============================================================
 *
 * You can listen for:
 *
 *
 *     process.on("exit", ...)
 *
 *
 * Example:
 */

process.on("exit", (code) => {
  console.log("Process exiting with code:", code);
});

/*
 * IMPORTANT:
 *
 * The `exit` event is for synchronous cleanup only.
 *
 * You should NOT depend on asynchronous operations completing
 * inside an `exit` listener.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. uncaughtException
 * ============================================================
 *
 * Node can emit:
 *
 *
 *     uncaughtException
 *
 *
 * when an exception reaches the event loop without being
 * handled.
 *
 *
 * Example syntax:
 *
 *
 *     process.on(
 *       "uncaughtException",
 *       (error) => {
 *         console.error(error);
 *       },
 *     );
 *
 *
 * IMPORTANT:
 *
 * This should NOT normally be treated as a way to continue
 * running a corrupted application.
 *
 * In production systems, an uncaught exception generally
 * requires logging and controlled process shutdown/restart.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. unhandledRejection
 * ============================================================
 *
 * Node can also report unhandled Promise rejections.
 *
 *
 * Example:
 *
 *
 *     process.on(
 *       "unhandledRejection",
 *       (reason) => {
 *         console.error(reason);
 *       },
 *     );
 *
 *
 * We will study Promise error handling separately.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Signals
 * ============================================================
 *
 * Operating systems can send signals to processes.
 *
 *
 * Common signals:
 *
 *
 *     SIGINT
 *     SIGTERM
 *
 *
 * Example:
 *
 *
 *     process.on(
 *       "SIGTERM",
 *       () => {
 *         console.log("SIGTERM received");
 *       },
 *     );
 *
 *
 * This becomes very important for graceful shutdown of
 * production Node.js servers.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. process.hrtime.bigint()
 * ============================================================
 *
 * Node provides high-resolution timing:
 *
 *
 *     process.hrtime.bigint()
 *
 *
 * Example:
 */

const start = process.hrtime.bigint();

/*
 * Perform some synchronous work.
 */

for (let i = 0; i < 1_000_000; i++) {
  // Intentionally empty.
}

const end = process.hrtime.bigint();

const elapsed = end - start;

console.log("Elapsed nanoseconds:", elapsed);

/*
 * This is useful for measuring execution time.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. process.nextTick()
 * ============================================================
 *
 * Node provides:
 *
 *
 *     process.nextTick()
 *
 *
 * Example:
 */

process.nextTick(() => {
  console.log("process.nextTick() executed.");
});

/*
 * `process.nextTick()` schedules a callback to run after the
 * current operation completes, before the event loop continues
 * to later phases.
 *
 *
 * It is powerful, but excessive use can starve I/O because
 * Node processes the next-tick queue before continuing.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. process.connected
 * ============================================================
 *
 * When a Node process is started with an IPC channel, this
 * property can indicate whether the IPC channel is connected.
 *
 *
 * In ordinary Node programs it may be:
 *
 *
 *     undefined
 *
 *
 * or not useful unless IPC is configured.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. process.send()
 * ============================================================
 *
 * When Node is running as a child process with an IPC channel,
 * `process.send()` can send messages to the parent process.
 *
 *
 * Example:
 *
 *
 *     if (process.send) {
 *
 *       process.send({
 *         type: "READY",
 *       });
 *
 *     }
 *
 *
 * This becomes useful with:
 *
 *     - child_process
 *     - clustering
 *     - worker/process communication
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Environment detection
 * ============================================================
 *
 * A common pattern:
 */

if (process.env.NODE_ENV === "production") {
  console.log("Running in production.");
} else {
  console.log("Running outside production.");
}

/*
 * This is commonly used to choose configuration.
 *
 * However, don't rely on NODE_ENV alone for security decisions.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Node.js process architecture
 * ============================================================
 *
 *
 *             Operating System
 *                    │
 *                    ▼
 *             Node.js Process
 *                    │
 *          ┌─────────┼─────────┐
 *          ▼         ▼         ▼
 *       process    event      env
 *        info      events   variables
 *          │
 *     ┌────┼───────────────┐
 *     ▼    ▼       ▼       ▼
 *    pid  argv    stdin   stdout
 *
 *
 * `process` is the interface between your Node.js application
 * and the running operating-system process.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Important properties and methods
 * ============================================================
 *
 *
 * INFORMATION:
 *
 *     process.pid
 *     process.ppid
 *     process.version
 *     process.versions
 *     process.platform
 *     process.arch
 *     process.cwd()
 *     process.uptime()
 *     process.memoryUsage()
 *     process.resourceUsage()
 *
 *
 * ENVIRONMENT:
 *
 *     process.env
 *
 *
 * COMMAND LINE:
 *
 *     process.argv
 *
 *
 * I/O:
 *
 *     process.stdin
 *     process.stdout
 *     process.stderr
 *
 *
 * CONTROL:
 *
 *     process.exit()
 *     process.exitCode
 *     process.chdir()
 *
 *
 * EVENTS:
 *
 *     process.on()
 *
 *
 * TIMING:
 *
 *     process.nextTick()
 *     process.hrtime.bigint()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Real backend usage
 * ============================================================
 *
 * In a production Node.js API, you might use:
 *
 *
 *     process.env.PORT
 *
 * to configure the server port.
 *
 *
 * Example:
 */

const port = Number(process.env.PORT || 3000);

console.log("Server port:", port);

/*
 * Later, Express might use:
 *
 *
 *     app.listen(
 *       port,
 *       () => {
 *         console.log(
 *           `Server running on ${port}`,
 *         );
 *       },
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Security warning
 * ============================================================
 *
 * Never blindly expose:
 *
 *
 *     process.env
 *
 *
 * in API responses or logs.
 *
 *
 * Environment variables can contain:
 *
 *     - Database passwords
 *     - JWT secrets
 *     - API keys
 *     - Encryption keys
 *     - Cloud credentials
 *
 *
 * Example of something you should NOT do:
 *
 *
 *     console.log(process.env);
 *
 *
 * in production logs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Process vs OS module
 * ============================================================
 *
 *
 * `process`
 *
 *     Information/control over the CURRENT Node.js process.
 *
 *
 * `node:os`
 *
 *     Information about the OPERATING SYSTEM.
 *
 *
 * Example:
 *
 *
 *     process.pid
 *
 *     -> Current process ID
 *
 *
 *     os.cpus()
 *
 *     -> CPU information about the operating system
 *
 *
 * We will study `node:os` next in:
 *
 *
 *     04_os/os_info.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * FINAL SUMMARY
 * ============================================================
 *
 * `process` is one of the most important Node.js globals.
 *
 *
 * It allows your application to:
 *
 *     ✓ Read process information
 *     ✓ Read environment variables
 *     ✓ Read command-line arguments
 *     ✓ Access stdin/stdout/stderr
 *     ✓ Handle process events
 *     ✓ Handle operating-system signals
 *     ✓ Measure process uptime
 *     ✓ Inspect memory usage
 *     ✓ Control process exit behavior
 *     ✓ Schedule next-tick callbacks
 *
 *
 * ============================================================
 *
 * KEY EXAMPLES:
 *
 *
 *     process.pid
 *
 *     process.cwd()
 *
 *     process.env
 *
 *     process.argv
 *
 *     process.version
 *
 *     process.platform
 *
 *     process.arch
 *
 *     process.memoryUsage()
 *
 *     process.uptime()
 *
 *     process.exitCode
 *
 *     process.on(...)
 *
 *     process.nextTick(...)
 *
 * ============================================================
 */
