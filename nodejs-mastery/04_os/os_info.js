/**
 * ============================================================
 * Node.js OS Module - OS Information
 * ============================================================
 *
 * File: os_info.js
 *
 * Built-in module:
 *
 *     node:os
 *
 * ============================================================
 *
 * The `node:os` module provides information about the
 * operating system and the computer on which Node.js runs.
 *
 * Examples:
 *
 *     - Operating system
 *     - CPU architecture
 *     - Hostname
 *     - Home directory
 *     *     - Temporary directory
 *     - OS release
 *     - Kernel information
 *     - User information
 *     - System uptime
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Import the OS module
 * ============================================================
 *
 * Node.js provides many built-in modules.
 *
 * `node:os` is one of them.
 *
 * CommonJS:
 */

const os = require("node:os");

/*
 * With ES Modules:
 *
 *
 *     import os from "node:os";
 *
 *
 * We are using CommonJS here because this is a standalone
 * learning example.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Operating system platform
 * ============================================================
 *
 * `os.platform()` returns the operating-system platform.
 *
 * Examples:
 *
 *     win32
 *     linux
 *     darwin
 *
 * ============================================================
 */

console.log("Platform:", os.platform());

/*
 * On Windows:
 *
 *     win32
 *
 *
 * On Linux:
 *
 *     linux
 *
 *
 * On macOS:
 *
 *     darwin
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Operating system type
 * ============================================================
 *
 * `os.type()` returns the operating-system name.
 *
 * Examples:
 *
 *     Windows_NT
 *     Linux
 *     Darwin
 *
 * ============================================================
 */

console.log("OS Type:", os.type());

/*
 * ============================================================
 * 4. OS release
 * ============================================================
 *
 * `os.release()` returns the operating-system release version.
 *
 * ============================================================
 */

console.log("OS Release:", os.release());

/*
 * ============================================================
 * 5. OS architecture
 * ============================================================
 *
 * `os.arch()` returns the CPU architecture used by Node.js.
 *
 * Common values:
 *
 *     x64
 *     arm64
 *     arm
 *
 * ============================================================
 */

console.log("Architecture:", os.arch());

/*
 * ============================================================
 * 6. Hostname
 * ============================================================
 *
 * `os.hostname()` returns the machine's hostname.
 *
 * ============================================================
 */

console.log("Hostname:", os.hostname());

/*
 * ============================================================
 * 7. Home directory
 * ============================================================
 *
 * `os.homedir()` returns the current user's home directory.
 *
 * ============================================================
 */

console.log("Home Directory:", os.homedir());

/*
 * ============================================================
 * 8. Temporary directory
 * ============================================================
 *
 * `os.tmpdir()` returns the operating system's temporary
 * directory.
 *
 * ============================================================
 */

console.log("Temp Directory:", os.tmpdir());

/*
 * ============================================================
 * 9. Current user's information
 * ============================================================
 *
 * `os.userInfo()` returns information about the current user.
 *
 * ============================================================
 */

console.log("User Info:", os.userInfo());

/*
 * Example result may look conceptually like:
 *
 *
 * {
 *   uid: ...,
 *   gid: ...,
 *   username: "...",
 *   homedir: "...",
 *   shell: "..."
 * }
 *
 *
 * Some fields can vary by operating system.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. System uptime
 * ============================================================
 *
 * `os.uptime()` returns how long the operating system has been
 * running.
 *
 * The value is returned in seconds.
 *
 * ============================================================
 */

const uptimeSeconds = os.uptime();

console.log("System Uptime:", uptimeSeconds, "seconds");

/*
 * ============================================================
 * 11. Convert uptime into hours
 * ============================================================
 */

const uptimeHours = uptimeSeconds / 60 / 60;

console.log("System Uptime:", uptimeHours.toFixed(2), "hours");

/*
 * ============================================================
 * 12. Endianness
 * ============================================================
 *
 * `os.endianness()` tells you the byte order used by the
 * CPU architecture.
 *
 * Common values:
 *
 *     LE -> Little Endian
 *     BE -> Big Endian
 *
 * ============================================================
 */

console.log("CPU Endianness:", os.endianness());

/*
 * Most modern consumer computers use:
 *
 *     LE
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Machine information
 * ============================================================
 *
 * Modern Node.js versions provide:
 *
 *     os.machine()
 *
 * It returns the machine architecture information when
 * supported.
 *
 * ============================================================
 */

if (typeof os.machine === "function") {
  console.log("Machine:", os.machine());
}

/*
 * We check whether the function exists because Node.js APIs
 * can vary depending on the Node.js version.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Version information
 * ============================================================
 *
 * You can check your Node.js version through:
 *
 *
 *     process.version
 *
 *
 * Example:
 */

console.log("Node.js Version:", process.version);

/*
 * ============================================================
 * 15. OS information object
 * ============================================================
 *
 * Instead of printing values individually, you can create
 * an object.
 * ============================================================
 */

const systemInfo = {
  platform: os.platform(),

  type: os.type(),

  release: os.release(),

  architecture: os.arch(),

  hostname: os.hostname(),

  homeDirectory: os.homedir(),

  tempDirectory: os.tmpdir(),

  uptimeSeconds: os.uptime(),

  endianness: os.endianness(),
};

console.log("\nSystem Information:");

console.log(systemInfo);

/*
 * ============================================================
 * 16. JSON output
 * ============================================================
 *
 * Backend applications often need structured output.
 *
 * JSON.stringify() can convert the object into JSON.
 * ============================================================
 */

console.log("\nSystem Information JSON:");

console.log(JSON.stringify(systemInfo, null, 2));

/*
 * The `2` means pretty-print the JSON with indentation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Why is node:os useful?
 * ============================================================
 *
 * The OS module can be useful for:
 *
 *     - System monitoring
 *     - Diagnostics
 *     - CLI applications
 *     - Server health information
 *     - Resource monitoring
 *     - Debugging
 *     - Environment detection
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Example: environment detection
 * ============================================================
 */

if (os.platform() === "win32") {
  console.log("Running on Windows.");
}

if (os.platform() === "linux") {
  console.log("Running on Linux.");
}

if (os.platform() === "darwin") {
  console.log("Running on macOS.");
}

/*
 * This can be useful when behavior differs between operating
 * systems.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Platform-specific paths
 * ============================================================
 *
 * Do NOT manually assume:
 *
 *
 *     C:\Users\...
 *
 *
 * or:
 *
 *
 *     /home/user/...
 *
 *
 * when writing cross-platform Node.js applications.
 *
 *
 * Instead, use Node's path APIs and OS information.
 *
 * We will study `node:path` in:
 *
 *
 *     05_path/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. System uptime example
 * ============================================================
 *
 * Convert seconds into a readable format.
 * ============================================================
 */

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86_400);

  const hours = Math.floor((seconds % 86_400) / 3_600);

  const minutes = Math.floor((seconds % 3_600) / 60);

  const remainingSeconds = Math.floor(seconds % 60);

  return `${days}d ` + `${hours}h ` + `${minutes}m ` + `${remainingSeconds}s`;
}

console.log("Formatted Uptime:", formatUptime(os.uptime()));

/*
 * Example:
 *
 *
 *     2d 5h 31m 42s
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Important OS methods
 * ============================================================
 *
 *
 * os.platform()
 *
 *     Operating-system platform.
 *
 *
 * os.type()
 *
 *     Operating-system name.
 *
 *
 * os.release()
 *
 *     OS release version.
 *
 *
 * os.arch()
 *
 *     Node.js CPU architecture.
 *
 *
 * os.hostname()
 *
 *     Machine hostname.
 *
 *
 * os.homedir()
 *
 *     User's home directory.
 *
 *
 * os.tmpdir()
 *
 *     Temporary directory.
 *
 *
 * os.userInfo()
 *
 *     Current user information.
 *
 *
 * os.uptime()
 *
 *     System uptime in seconds.
 *
 *
 * os.endianness()
 *
 *     CPU byte order.
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Important distinction
 * ============================================================
 *
 * `os.arch()`
 *
 *     Architecture of the Node.js process.
 *
 *
 * `os.machine()`
 *
 *     Machine architecture information, where supported.
 *
 *
 * They are related but conceptually different APIs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Full system information function
 * ============================================================
 */

function getSystemInfo() {
  return {
    platform: os.platform(),

    type: os.type(),

    release: os.release(),

    architecture: os.arch(),

    hostname: os.hostname(),

    username: os.userInfo().username,

    homeDirectory: os.homedir(),

    tempDirectory: os.tmpdir(),

    uptimeSeconds: os.uptime(),
  };
}

console.log("\nSystem Info Function:");

console.log(getSystemInfo());

/*
 * ============================================================
 * 24. Real-world backend example
 * ============================================================
 *
 * Imagine a health endpoint:
 *
 *
 *     GET /health
 *
 *
 * The backend could return:
 *
 *
 *     {
 *       "status": "ok",
 *       "platform": "linux",
 *       "architecture": "x64",
 *       "uptime": 12345
 *     }
 *
 *
 * This information can help with diagnostics.
 *
 * NOTE:
 *
 * Avoid exposing sensitive machine information publicly
 * without a reason.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Do not expose everything publicly
 * ============================================================
 *
 * OS information can contain environment details.
 *
 * Avoid blindly returning:
 *
 *
 *     os.userInfo()
 *     os.hostname()
 *     filesystem paths
 *
 *
 * from a public API.
 *
 *
 * Internal monitoring and diagnostics are different from
 * public API responses.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Quick experiment
 * ============================================================
 *
 * Try changing your machine and observe:
 *
 *
 *     os.platform()
 *     os.type()
 *     os.release()
 *     os.arch()
 *     os.hostname()
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * Import:
 *
 *     const os = require("node:os");
 *
 *
 * Platform:
 *
 *     os.platform();
 *
 *
 * OS type:
 *
 *     os.type();
 *
 *
 * Release:
 *
 *     os.release();
 *
 *
 * Architecture:
 *
 *     os.arch();
 *
 *
 * Hostname:
 *
 *     os.hostname();
 *
 *
 * Home directory:
 *
 *     os.homedir();
 *
 *
 * Temporary directory:
 *
 *     os.tmpdir();
 *
 *
 * User:
 *
 *     os.userInfo();
 *
 *
 * Uptime:
 *
 *     os.uptime();
 *
 *
 * Endianness:
 *
 *     os.endianness();
 *
 *
 * Machine:
 *
 *     os.machine();
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     `node:os` lets a Node.js application inspect the
 *     operating-system and machine environment it is running on.
 *
 * ============================================================
 */
