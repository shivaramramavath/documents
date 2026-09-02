/**
 * ============================================================
 * Node.js OS Module - Platform
 * ============================================================
 *
 * File: platform.js
 *
 * Built-in module:
 *
 *     node:os
 *
 * ============================================================
 *
 * In this file we learn:
 *
 *     os.platform()
 *     os.type()
 *     os.release()
 *     os.version()
 *     os.arch()
 *     os.machine()
 *     os.hostname()
 *     os.homedir()
 *     os.tmpdir()
 *     os.endianness()
 *     os.EOL
 *
 * We will also learn how to write cross-platform Node.js code.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Import node:os
 * ============================================================
 */

const os = require("node:os");

/*
 * ============================================================
 * 2. Operating system platform
 * ============================================================
 *
 * `os.platform()` returns the operating-system platform.
 *
 * Common values:
 *
 *     win32  -> Windows
 *     linux  -> Linux
 *     darwin -> macOS
 *
 * ============================================================
 */

const platform = os.platform();

console.log("Platform:", platform);

/*
 * ============================================================
 * 3. Operating system type
 * ============================================================
 *
 * `os.type()` gives a more descriptive operating-system name.
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
 * 4. Operating system release
 * ============================================================
 *
 * `os.release()` returns the operating-system release/version
 * information.
 *
 * The exact format depends on the operating system.
 *
 * ============================================================
 */

console.log("OS Release:", os.release());

/*
 * ============================================================
 * 5. Operating system version
 * ============================================================
 *
 * `os.version()` returns a more detailed OS version string.
 *
 * ============================================================
 */

console.log("OS Version:", os.version());

/*
 * ============================================================
 * 6. CPU architecture
 * ============================================================
 *
 * `os.arch()` returns the architecture Node.js is running on.
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
 * 7. Machine architecture
 * ============================================================
 *
 * Modern Node.js versions provide:
 *
 *
 *     os.machine()
 *
 *
 * This returns the machine architecture.
 *
 * ============================================================
 */

if (typeof os.machine === "function") {
  console.log("Machine:", os.machine());
}

/*
 * ============================================================
 * 8. Hostname
 * ============================================================
 *
 * `os.hostname()` returns the hostname of the machine.
 *
 * Example:
 *
 *     DESKTOP-ABC123
 *
 * ============================================================
 */

const hostname = os.hostname();

console.log("Hostname:", hostname);

/*
 * ============================================================
 * 9. Home directory
 * ============================================================
 *
 * `os.homedir()` returns the current user's home directory.
 *
 * Windows example:
 *
 *     C:\Users\Shiva
 *
 * Linux example:
 *
 *     /home/shiva
 *
 * macOS example:
 *
 *     /Users/shiva
 *
 * ============================================================
 */

console.log("Home Directory:", os.homedir());

/*
 * ============================================================
 * 10. Temporary directory
 * ============================================================
 *
 * `os.tmpdir()` returns the operating system's temporary
 * directory.
 *
 * Windows:
 *
 *     C:\Users\...\AppData\Local\Temp
 *
 * Linux:
 *
 *     /tmp
 *
 * macOS:
 *
 *     /var/folders/...
 *
 * ============================================================
 */

console.log("Temporary Directory:", os.tmpdir());

/*
 * ============================================================
 * 11. Endianness
 * ============================================================
 *
 * `os.endianness()` tells us the byte order used by the CPU.
 *
 * Common values:
 *
 *     LE -> Little Endian
 *     BE -> Big Endian
 *
 * Most modern consumer systems are little-endian.
 *
 * ============================================================
 */

console.log("CPU Endianness:", os.endianness());

/*
 * ============================================================
 * 12. End-of-line character
 * ============================================================
 *
 * `os.EOL` gives the operating system's default line ending.
 *
 *
 * Windows:
 *
 *     \r\n
 *
 *
 * Linux/macOS:
 *
 *     \n
 *
 * ============================================================
 */

console.log("EOL:", JSON.stringify(os.EOL));

/*
 * ============================================================
 * 13. Why EOL matters
 * ============================================================
 *
 * Different operating systems use different line endings.
 *
 *
 * Windows:
 *
 *     Line 1\r\n
 *     Line 2\r\n
 *
 *
 * Linux/macOS:
 *
 *     Line 1\n
 *     Line 2\n
 *
 *
 * When creating cross-platform files, using os.EOL can be useful.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Cross-platform OS detection
 * ============================================================
 *
 * We can detect Windows:
 * ============================================================
 */

if (os.platform() === "win32") {
  console.log("Running on Windows");
}

/*
 * ============================================================
 * 15. Detect Linux
 * ============================================================
 */

if (os.platform() === "linux") {
  console.log("Running on Linux");
}

/*
 * ============================================================
 * 16. Detect macOS
 * ============================================================
 */

if (os.platform() === "darwin") {
  console.log("Running on macOS");
}

/*
 * ============================================================
 * 17. Better platform detection
 * ============================================================
 */

function getOperatingSystem() {
  switch (os.platform()) {
    case "win32":
      return "Windows";

    case "linux":
      return "Linux";

    case "darwin":
      return "macOS";

    case "freebsd":
      return "FreeBSD";

    default:
      return "Unknown";
  }
}

console.log("Operating System:", getOperatingSystem());

/*
 * ============================================================
 * 18. Platform constants
 * ============================================================
 *
 * You can store the platform once and reuse it.
 * ============================================================
 */

const currentPlatform = os.platform();

const isWindows = currentPlatform === "win32";

const isLinux = currentPlatform === "linux";

const isMac = currentPlatform === "darwin";

console.log("\nPlatform Flags:");

console.log({
  isWindows,
  isLinux,
  isMac,
});

/*
 * ============================================================
 * 19. Conditional behavior
 * ============================================================
 *
 * Sometimes applications need different behavior depending
 * on the operating system.
 *
 * ============================================================
 */

if (isWindows) {
  console.log("Use Windows-specific behavior.");
} else if (isLinux) {
  console.log("Use Linux-specific behavior.");
} else if (isMac) {
  console.log("Use macOS-specific behavior.");
} else {
  console.log("Use generic behavior.");
}

/*
 * ============================================================
 * 20. IMPORTANT:
 *
 * Avoid unnecessary platform-specific code.
 * ============================================================
 *
 * Bad approach:
 *
 *
 *     if Windows:
 *         do everything differently
 *
 *
 *     if Linux:
 *         do everything differently
 *
 *
 * Instead, prefer Node.js APIs that already handle
 * platform differences.
 *
 * For example:
 *
 *
 *     path.join()
 *
 *
 * automatically handles platform-specific path separators.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Windows path
 * ============================================================
 *
 * Windows commonly uses:
 *
 *
 *     \
 *
 *
 * as the path separator.
 *
 *
 * Example:
 *
 *
 *     C:\Users\Shiva\project
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Linux/macOS path
 * ============================================================
 *
 * Linux/macOS commonly use:
 *
 *
 *     /
 *
 *
 * Example:
 *
 *
 *     /home/shiva/project
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Do NOT manually build paths
 * ============================================================
 *
 * Avoid:
 *
 *
 *     const file =
 *       "folder/" + "file.txt";
 *
 *
 * or:
 *
 *
 *     "folder\\file.txt"
 *
 *
 * because these assumptions may not work everywhere.
 *
 *
 * Prefer:
 *
 *
 *     path.join()
 *
 *
 * We will learn this in:
 *
 *
 *     05_path/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Platform-independent home path
 * ============================================================
 */

const homeDirectory = os.homedir();

console.log("User Home:", homeDirectory);

/*
 * ============================================================
 * 25. Platform-independent temp path
 * ============================================================
 */

const temporaryDirectory = os.tmpdir();

console.log("Temp Directory:", temporaryDirectory);

/*
 * ============================================================
 * 26. Machine information object
 * ============================================================
 */

const systemInfo = {
  platform: os.platform(),

  type: os.type(),

  release: os.release(),

  version: os.version(),

  architecture: os.arch(),

  hostname: os.hostname(),

  homeDirectory: os.homedir(),

  tempDirectory: os.tmpdir(),

  endianness: os.endianness(),

  endOfLine: JSON.stringify(os.EOL),
};

if (typeof os.machine === "function") {
  systemInfo.machine = os.machine();
}

console.log("\nSystem Information:");

console.log(systemInfo);

/*
 * ============================================================
 * 27. JSON system information
 * ============================================================
 */

console.log("\nSystem Information JSON:");

console.log(JSON.stringify(systemInfo, null, 2));

/*
 * ============================================================
 * 28. OS detection function
 * ============================================================
 */

function getSystemInfo() {
  return {
    name: getOperatingSystem(),

    platform: os.platform(),

    type: os.type(),

    release: os.release(),

    architecture: os.arch(),

    hostname: os.hostname(),
  };
}

console.log("\nSystem Summary:");

console.log(getSystemInfo());

/*
 * ============================================================
 * 29. Why this matters in backend development
 * ============================================================
 *
 * Node.js applications frequently run in different environments:
 *
 *
 *     Developer Laptop
 *           │
 *           ├── Windows
 *           ├── macOS
 *           └── Linux
 *
 *
 *     Production
 *           │
 *           ├── Linux VM
 *           ├── Docker
 *           └── Kubernetes
 *
 *
 * Your application should ideally behave consistently
 * regardless of the underlying operating system.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Environment detection
 * ============================================================
 *
 * OS detection can be useful for:
 *
 *
 *     - CLI applications
 *     - Development tooling
 *     - Build systems
 *     - File operations
 *     - Native integrations
 *     - System diagnostics
 *     - Deployment scripts
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Example: CLI message
 * ============================================================
 */

function showPlatformMessage() {
  const system = getOperatingSystem();

  console.log(`\nHello from ${system}!`);
}

showPlatformMessage();

/*
 * ============================================================
 * 32. Example: OS-specific command
 * ============================================================
 *
 * Sometimes a CLI application may need to execute different
 * commands depending on the OS.
 *
 *
 * Example concept:
 *
 *
 *     Windows:
 *         dir
 *
 *
 *     Linux/macOS:
 *         ls
 *
 *
 * This type of work is normally handled with child_process.
 *
 * We will study child processes later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Important security consideration
 * ============================================================
 *
 * OS information can expose infrastructure details.
 *
 * Avoid unnecessarily exposing detailed system information
 * through public APIs.
 *
 * For example, do not blindly return:
 *
 *
 *     hostname
 *     OS version
 *     kernel release
 *     architecture
 *
 *
 * to unauthenticated users.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Node.js abstraction
 * ============================================================
 *
 * One of Node.js's biggest advantages is abstraction.
 *
 *
 * Instead of writing completely different code for:
 *
 *
 *     Windows
 *     Linux
 *     macOS
 *
 *
 * Node.js provides APIs such as:
 *
 *
 *     fs
 *     path
 *     os
 *     http
 *     crypto
 *
 *
 * that allow us to write mostly portable JavaScript.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Important APIs from this file
 * ============================================================
 *
 *
 * os.platform()
 *
 *     Platform identifier.
 *
 *
 * os.type()
 *
 *     OS type.
 *
 *
 * os.release()
 *
 *     OS release.
 *
 *
 * os.version()
 *
 *     Detailed OS version.
 *
 *
 * os.arch()
 *
 *     Node.js architecture.
 *
 *
 * os.machine()
 *
 *     Machine architecture.
 *
 *
 * os.hostname()
 *
 *     Machine hostname.
 *
 *
 * os.homedir()
 *
 *     User home directory.
 *
 *
 * os.tmpdir()
 *
 *     Temporary directory.
 *
 *
 * os.endianness()
 *
 *     CPU byte order.
 *
 *
 * os.EOL
 *
 *     Platform-specific line ending.
 *
 * ============================================================
 */

/*
 * ============================================================
 * FINAL CHEAT SHEET
 * ============================================================
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
 * OS release:
 *
 *     os.release();
 *
 *
 * OS version:
 *
 *     os.version();
 *
 *
 * Architecture:
 *
 *     os.arch();
 *
 *
 * Machine:
 *
 *     os.machine();
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
 * Endianness:
 *
 *     os.endianness();
 *
 *
 * Line ending:
 *
 *     os.EOL;
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     Use Node.js abstractions whenever possible instead of
 *     hard-coding Windows/Linux/macOS behavior.
 *
 * ============================================================
 */
