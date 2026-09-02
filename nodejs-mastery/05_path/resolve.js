/**
 * ============================================================
 * Node.js Path Module - path.resolve()
 * ============================================================
 *
 * File: resolve.js
 *
 * Built-in modules:
 *
 *     node:path
 *     node:process
 *
 * ============================================================
 *
 * In this file we learn:
 *
 *     1. path.resolve()
 *     2. Absolute paths
 *     3. Relative paths
 *     4. process.cwd()
 *     5. __dirname
 *     6. path.join() vs path.resolve()
 *     7. `.` and `..`
 *     8. Practical backend examples
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Import path
 * ============================================================
 */

const path = require("node:path");

/*
 * ============================================================
 * 2. What does path.resolve() do?
 * ============================================================
 *
 * `path.resolve()` converts path segments into an ABSOLUTE path.
 *
 *
 * Example:
 *
 *
 *     path.resolve(
 *       "src",
 *       "users",
 *       "index.js",
 *     );
 *
 *
 * If the current working directory is:
 *
 *
 *     C:\project
 *
 *
 * the result will be something similar to:
 *
 *
 *     C:\project\src\users\index.js
 *
 * ============================================================
 */

const resolvedPath = path.resolve("src", "users", "index.js");

console.log("Resolved Path:", resolvedPath);

/*
 * ============================================================
 * 3. Relative path
 * ============================================================
 *
 * A relative path does not start from the filesystem root.
 *
 *
 * Example:
 *
 *
 *     src/users/index.js
 *
 *
 * Its meaning depends on the current working directory.
 *
 * ============================================================
 */

const relativePath = "src/users/index.js";

console.log("Relative Path:", relativePath);

/*
 * ============================================================
 * 4. Absolute path
 * ============================================================
 *
 * An absolute path identifies a location starting from the
 * filesystem root.
 *
 *
 * Windows:
 *
 *
 *     C:\project\src\users\index.js
 *
 *
 * Linux/macOS:
 *
 *
 *     /home/user/project/src/users/index.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Check whether a path is absolute
 * ============================================================
 *
 * Node.js provides:
 *
 *
 *     path.isAbsolute()
 *
 * ============================================================
 */

console.log("Is Relative Path Absolute?", path.isAbsolute(relativePath));

console.log("Is Resolved Path Absolute?", path.isAbsolute(resolvedPath));

/*
 * ============================================================
 * 6. process.cwd()
 * ============================================================
 *
 * `process.cwd()` means:
 *
 *
 *     Current Working Directory
 *
 *
 * It tells you the directory from which the Node.js process
 * was started.
 *
 * ============================================================
 */

const currentWorkingDirectory = process.cwd();

console.log("Current Working Directory:", currentWorkingDirectory);

/*
 * ============================================================
 * 7. path.resolve() and process.cwd()
 * ============================================================
 *
 * When resolving relative paths, path.resolve() starts from
 * the current working directory unless an absolute segment
 * changes the resolution.
 *
 *
 * Example:
 *
 *
 *     path.resolve(
 *       "data",
 *       "users.json",
 *     );
 *
 *
 * Conceptually:
 *
 *
 *     process.cwd()
 *          +
 *     data/users.json
 *
 * ============================================================
 */

const dataPath = path.resolve("data", "users.json");

console.log("Data Path:", dataPath);

/*
 * ============================================================
 * 8. `.` means current directory
 * ============================================================
 */

const currentPath = path.resolve(".");

console.log("Resolved Current Directory:", currentPath);

/*
 * ============================================================
 * 9. `..` means parent directory
 * ============================================================
 */

const parentPath = path.resolve("..");

console.log("Resolved Parent Directory:", parentPath);

/*
 * ============================================================
 * 10. Multiple `..`
 * ============================================================
 */

const twoLevelsUp = path.resolve("..", "..");

console.log("Two Levels Up:", twoLevelsUp);

/*
 * ============================================================
 * 11. Nested path
 * ============================================================
 */

const nestedPath = path.resolve(
  "src",
  "modules",
  "users",
  "controllers",
  "user.controller.js",
);

console.log("Nested Absolute Path:", nestedPath);

/*
 * ============================================================
 * 12. path.resolve() normalizes the path
 * ============================================================
 *
 * It removes unnecessary:
 *
 *
 *     .
 *     ..
 *     duplicate separators
 *
 *
 * where appropriate.
 *
 * ============================================================
 */

const messyPath = path.resolve(
  "src",
  ".",
  "users",
  "..",
  "controllers",
  "user.js",
);

console.log("Normalized Resolved Path:", messyPath);

/*
 * ============================================================
 * 13. The most important difference:
 *
 * path.join() vs path.resolve()
 * ============================================================
 *
 *
 * path.join()
 *
 *     Combines path segments.
 *
 *
 * path.resolve()
 *
 *     Resolves a path into an absolute path.
 *
 *
 * Example:
 *
 *
 *     path.join(
 *       "src",
 *       "users",
 *     );
 *
 *
 * might produce:
 *
 *
 *     src/users
 *
 *
 * While:
 *
 *
 *     path.resolve(
 *       "src",
 *       "users",
 *     );
 *
 *
 * produces:
 *
 *
 *     C:\current\directory\src\users
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Compare join and resolve
 * ============================================================
 */

const joined = path.join("src", "users", "index.js");

const resolved = path.resolve("src", "users", "index.js");

console.log("\nJoined:", joined);

console.log("Resolved:", resolved);

/*
 * ============================================================
 * 15. Simple mental model
 * ============================================================
 *
 *
 * path.join()
 *
 *
 *     "Put these pieces together."
 *
 *
 * path.resolve()
 *
 *
 *     "Tell me the absolute location of this path."
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Absolute path segment
 * ============================================================
 *
 * `path.resolve()` processes segments from right to left
 * until an absolute path is reached.
 *
 *
 * Example on Windows:
 *
 *
 *     path.resolve(
 *       "src",
 *       "users",
 *       "C:\\project",
 *     );
 *
 *
 * The absolute segment becomes the base.
 *
 *
 * IMPORTANT:
 *
 * Do not rely on confusing combinations like this in normal
 * application code. Prefer clear absolute bases.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. A better pattern
 * ============================================================
 *
 * Start with a known absolute base:
 *
 *
 *     __dirname
 *
 *
 * or:
 *
 *
 *     process.cwd()
 *
 *
 * Then resolve relative components.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. __dirname
 * ============================================================
 *
 * In CommonJS modules:
 *
 *
 *     __dirname
 *
 *
 * is the absolute directory containing the current JavaScript
 * file.
 *
 * ============================================================
 */

console.log("__dirname:", __dirname);

/*
 * ============================================================
 * 19. __filename
 * ============================================================
 *
 * `__filename` is the absolute path of the current file.
 *
 * ============================================================
 */

console.log("__filename:", __filename);

/*
 * ============================================================
 * 20. Resolve relative to current file
 * ============================================================
 *
 * This is extremely common in Node.js applications.
 *
 *
 * Example:
 *
 *
 *     path.resolve(
 *       __dirname,
 *       "data",
 *       "users.json",
 *     );
 *
 *
 * This creates a path relative to the directory containing
 * this JavaScript file.
 *
 * ============================================================
 */

const fileRelativeToScript = path.resolve(__dirname, "data", "users.json");

console.log("Path Relative To Script:", fileRelativeToScript);

/*
 * ============================================================
 * 21. cwd vs __dirname
 * ============================================================
 *
 * This distinction is VERY important.
 *
 *
 * process.cwd()
 *
 *     Directory where the process was started.
 *
 *
 * __dirname
 *
 *     Directory containing the current CommonJS file.
 *
 *
 * They can be different.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Example
 * ============================================================
 *
 * Suppose your project is:
 *
 *
 *     C:\project
 *
 *         src
 *             app.js
 *
 *
 * If you run:
 *
 *
 *     node src/app.js
 *
 *
 * then:
 *
 *
 *     process.cwd()
 *
 * might be:
 *
 *
 *     C:\project
 *
 *
 * while:
 *
 *
 *     __dirname
 *
 *
 * is:
 *
 *
 *     C:\project\src
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Why this matters
 * ============================================================
 *
 * Suppose:
 *
 *
 *     data/users.json
 *
 *
 * is relative to your project root.
 *
 * You might use:
 *
 *
 *     path.resolve(
 *       process.cwd(),
 *       "data",
 *       "users.json",
 *     );
 *
 *
 * If the file is relative to the source file, use:
 *
 *
 *     path.resolve(
 *       __dirname,
 *       "data",
 *       "users.json",
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Backend project example
 * ============================================================
 *
 * Project:
 *
 *
 *     my-api/
 *
 *         src/
 *             app.js
 *
 *         public/
 *             index.html
 *
 *         uploads/
 *
 *         logs/
 *
 *
 * From src/app.js:
 *
 *
 * public:
 *
 *     path.resolve(
 *       __dirname,
 *       "..",
 *       "public",
 *     );
 *
 *
 * uploads:
 *
 *     path.resolve(
 *       __dirname,
 *       "..",
 *       "uploads",
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Build project directories
 * ============================================================
 */

const publicDirectory = path.resolve(__dirname, "..", "public");

const uploadsDirectory = path.resolve(__dirname, "..", "uploads");

const logsDirectory = path.resolve(__dirname, "..", "logs");

console.log("\nPublic Directory:", publicDirectory);

console.log("Uploads Directory:", uploadsDirectory);

console.log("Logs Directory:", logsDirectory);

/*
 * ============================================================
 * 26. Absolute file path
 * ============================================================
 */

const logFile = path.resolve(logsDirectory, "application.log");

console.log("Log File:", logFile);

/*
 * ============================================================
 * 27. path.resolve() with `..`
 * ============================================================
 *
 * Example:
 *
 *
 *     path.resolve(
 *       "/project",
 *       "src",
 *       "..",
 *       "config",
 *     );
 *
 *
 * becomes:
 *
 *
 *     /project/config
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Check absolute paths
 * ============================================================
 */

function describePath(value) {
  return {
    path: value,

    absolute: path.isAbsolute(value),

    normalized: path.normalize(value),
  };
}

console.log("\nPath Description:");

console.log(describePath("src/users/index.js"));

console.log(describePath(resolvedPath));

/*
 * ============================================================
 * 29. Practical helper
 * ============================================================
 */

function resolveFromProjectRoot(...segments) {
  return path.resolve(process.cwd(), ...segments);
}

console.log(
  "\nProject Root Path:",
  resolveFromProjectRoot("src", "config", "app.json"),
);

/*
 * ============================================================
 * 30. Practical helper using __dirname
 * ============================================================
 */

function resolveFromCurrentFile(...segments) {
  return path.resolve(__dirname, ...segments);
}

console.log("Current File Path:", resolveFromCurrentFile("data", "users.json"));

/*
 * ============================================================
 * 31. Security warning
 * ============================================================
 *
 * `path.resolve()` does NOT automatically make user input safe.
 *
 *
 * Example:
 *
 *
 *     const userPath =
 *       req.params.file;
 *
 *
 * An attacker might provide:
 *
 *
 *     ../../secret.txt
 *
 *
 * `path.resolve()` will correctly resolve that path.
 *
 * But "correctly resolving" it does NOT mean it is safe.
 *
 *
 * When handling user-controlled file paths, you need additional
 * validation and containment checks.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Common mistake
 * ============================================================
 *
 * Don't assume:
 *
 *
 *     path.resolve()
 *
 *
 * means:
 *
 *
 *     "path relative to this JavaScript file"
 *
 *
 * By default, relative resolution starts from:
 *
 *
 *     process.cwd()
 *
 *
 * If you specifically want the current file's directory,
 * explicitly use:
 *
 *
 *     __dirname
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Another common mistake
 * ============================================================
 *
 * Don't confuse:
 *
 *
 *     process.cwd()
 *
 *
 * with:
 *
 *
 *     __dirname
 *
 *
 * Remember:
 *
 *
 * process.cwd()
 *     = where the Node process started
 *
 *
 * __dirname
 *     = where the current CommonJS file lives
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. ESM note
 * ============================================================
 *
 * `__dirname` and `__filename` are CommonJS globals.
 *
 *
 * In ES modules, you normally work with:
 *
 *
 *     import.meta.url
 *
 *
 * and convert it to a filesystem path when necessary.
 *
 *
 * We will cover CommonJS and ESM in:
 *
 *
 *     02_modules/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Real-world example:
 *     configuration file
 * ============================================================
 */

const configFile = path.resolve(process.cwd(), "config", "app.json");

console.log("\nConfig File:", configFile);

/*
 * ============================================================
 * 36. Real-world example:
 *     upload directory
 * ============================================================
 */

const uploadDirectory = path.resolve(process.cwd(), "uploads");

console.log("Upload Directory:", uploadDirectory);

/*
 * ============================================================
 * 37. Real-world example:
 *     static files
 * ============================================================
 */

const staticDirectory = path.resolve(process.cwd(), "public");

console.log("Static Directory:", staticDirectory);

/*
 * ============================================================
 * 38. Real-world example:
 *     database directory
 * ============================================================
 */

const databaseDirectory = path.resolve(process.cwd(), "data", "database");

console.log("Database Directory:", databaseDirectory);

/*
 * ============================================================
 * 39. Summary object
 * ============================================================
 */

const pathSummary = {
  currentWorkingDirectory: process.cwd(),

  currentFileDirectory: __dirname,

  currentFile: __filename,

  joinedPath: path.join("src", "users", "index.js"),

  resolvedPath: path.resolve("src", "users", "index.js"),
};

console.log("\nPath Summary:");

console.log(JSON.stringify(pathSummary, null, 2));

/*
 * ============================================================
 * FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * Import:
 *
 *     const path = require("node:path");
 *
 *
 * Resolve to absolute path:
 *
 *     path.resolve(
 *       "src",
 *       "index.js",
 *     );
 *
 *
 * Check absolute:
 *
 *     path.isAbsolute(
 *       "src/index.js",
 *     );
 *
 *
 * Current working directory:
 *
 *     process.cwd();
 *
 *
 * Current CommonJS file directory:
 *
 *     __dirname;
 *
 *
 * Current CommonJS file:
 *
 *     __filename;
 *
 *
 * Normalize:
 *
 *     path.normalize(
 *       "src//users/../index.js",
 *     );
 *
 *
 * Join:
 *
 *     path.join(
 *       "src",
 *       "users",
 *       "index.js",
 *     );
 *
 *
 * ============================================================
 *
 * MOST IMPORTANT DIFFERENCE:
 *
 *
 *     path.join()
 *
 *         Combines path segments.
 *
 *
 *     path.resolve()
 *
 *         Produces an absolute path.
 *
 *
 *     process.cwd()
 *
 *         Where the Node process was started.
 *
 *
 *     __dirname
 *
 *         Where the current CommonJS file is located.
 *
 * ============================================================
 */
