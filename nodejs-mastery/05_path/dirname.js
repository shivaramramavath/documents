/**
 * ============================================================
 * Node.js Path Module - path.dirname()
 * ============================================================
 *
 * File: dirname.js
 *
 * Built-in module:
 *
 *     node:path
 *
 * ============================================================
 *
 * In this file we learn:
 *
 *     1. path.dirname()
 *     2. Parent directories
 *     3. dirname() vs basename()
 *     4. Nested directories
 *     5. __dirname
 *     6. Practical backend examples
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
 * 2. What is dirname?
 * ============================================================
 *
 * `dirname` means:
 *
 *     Directory Name
 *
 *
 * Given:
 *
 *
 *     /project/src/app.js
 *
 *
 * basename:
 *
 *
 *     app.js
 *
 *
 * dirname:
 *
 *
 *     /project/src
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Basic example
 * ============================================================
 */

const filePath = "/project/src/app.js";

const directory = path.dirname(filePath);

console.log("Directory:", directory);

/*
 * ============================================================
 * 4. basename() vs dirname()
 * ============================================================
 */

const examplePath = "/project/src/controllers/user.controller.js";

console.log("\nFull Path:", examplePath);

console.log("Basename:", path.basename(examplePath));

console.log("Dirname:", path.dirname(examplePath));

/*
 * ============================================================
 * Result:
 *
 *
 * Full Path:
 *
 *     /project/src/controllers/user.controller.js
 *
 *
 * Basename:
 *
 *     user.controller.js
 *
 *
 * Dirname:
 *
 *     /project/src/controllers
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Nested path
 * ============================================================
 */

const nestedPath = "/project/src/modules/users/services/user.service.js";

console.log("\nNested Directory:", path.dirname(nestedPath));

/*
 * ============================================================
 * 6. Go one directory higher
 * ============================================================
 *
 * We can combine dirname() with another dirname().
 *
 *
 * Example:
 *
 *
 *     /project/src/controllers/user.js
 *
 *
 * First dirname:
 *
 *
 *     /project/src/controllers
 *
 *
 * Second dirname:
 *
 *
 *     /project/src
 *
 * ============================================================
 */

const controllerPath = "/project/src/controllers/user.js";

const controllersDirectory = path.dirname(controllerPath);

const srcDirectory = path.dirname(controllersDirectory);

console.log("\nControllers Directory:", controllersDirectory);

console.log("Src Directory:", srcDirectory);

/*
 * ============================================================
 * 7. Go multiple levels upward
 * ============================================================
 */

const deepPath = "/project/src/modules/users/controllers/user.js";

let currentDirectory = path.dirname(deepPath);

console.log("\nStarting Directory:", currentDirectory);

currentDirectory = path.dirname(currentDirectory);

console.log("One Level Up:", currentDirectory);

currentDirectory = path.dirname(currentDirectory);

console.log("Two Levels Up:", currentDirectory);

/*
 * ============================================================
 * 8. Using __filename
 * ============================================================
 *
 * `__filename` contains the absolute path of the current
 * CommonJS JavaScript file.
 *
 *
 * Therefore:
 *
 *
 *     path.dirname(__filename)
 *
 *
 * gives the directory containing this file.
 *
 * ============================================================
 */

console.log("\nCurrent File:", __filename);

console.log("Current Directory:", path.dirname(__filename));

/*
 * ============================================================
 * 9. __dirname
 * ============================================================
 *
 * In CommonJS, Node.js already provides:
 *
 *
 *     __dirname
 *
 *
 * which represents the directory containing the current file.
 *
 *
 * Therefore these are effectively equivalent:
 *
 *
 *     __dirname
 *
 *
 * and:
 *
 *
 *     path.dirname(
 *       __filename,
 *     );
 *
 * ============================================================
 */

console.log("\n__dirname:", __dirname);

console.log("dirname(__filename):", path.dirname(__filename));

/*
 * ============================================================
 * 10. Check that they match
 * ============================================================
 */

const sameDirectory = __dirname === path.dirname(__filename);

console.log("Same Directory:", sameDirectory);

/*
 * ============================================================
 * 11. Relative path
 * ============================================================
 */

const relativePath = "src/controllers/user.js";

console.log("\nRelative Path:", relativePath);

console.log("Relative Dirname:", path.dirname(relativePath));

/*
 * ============================================================
 * 12. Filename only
 * ============================================================
 */

const onlyFilename = "user.js";

console.log("\nFilename:", onlyFilename);

console.log("Dirname:", path.dirname(onlyFilename));

/*
 * ============================================================
 * 13. Current directory `.`
 * ============================================================
 *
 * If a path has no explicit directory, dirname() returns
 * the current directory representation for that path style.
 *
 * Example:
 *
 *
 *     path.dirname("app.js")
 *
 *
 * gives:
 *
 *
 *     .
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Parent directory concept
 * ============================================================
 *
 * Consider:
 *
 *
 *     project/
 *         src/
 *             controllers/
 *                 user.js
 *
 *
 * For:
 *
 *
 *     user.js
 *
 *
 * dirname:
 *
 *
 *     controllers/
 *
 *
 * Parent of controllers:
 *
 *
 *     src/
 *
 *
 * Parent of src:
 *
 *
 *     project/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Practical backend example
 * ============================================================
 *
 * Suppose:
 *
 *
 *     __filename
 *
 *
 * points to:
 *
 *
 *     project/src/controllers/user.controller.js
 *
 *
 * We can get:
 *
 *
 *     project/src/controllers
 *
 * using:
 *
 *
 *     path.dirname(__filename)
 *
 * ============================================================
 */

const controllerDirectory = path.dirname(__filename);

console.log("\nController Directory:", controllerDirectory);

/*
 * ============================================================
 * 16. Build another path from dirname()
 * ============================================================
 *
 * We can use the directory as a base for path.join().
 *
 * ============================================================
 */

const configFile = path.join(controllerDirectory, "config.json");

console.log("Config File:", configFile);

/*
 * ============================================================
 * 17. Move to parent directory
 * ============================================================
 *
 * Combine:
 *
 *
 *     path.dirname()
 *
 *
 * with:
 *
 *
 *     path.join()
 *
 * ============================================================
 */

const srcPath = path.join(path.dirname(controllerDirectory), "index.js");

console.log("Parent Index:", srcPath);

/*
 * ============================================================
 * 18. Project root example
 * ============================================================
 *
 * Suppose:
 *
 *
 *     project/
 *         src/
 *             controllers/
 *                 user.js
 *
 *
 * Starting from:
 *
 *
 *     user.js
 *
 *
 * We can move upward using dirname().
 *
 * ============================================================
 */

const userController = "/project/src/controllers/user.js";

const controllers = path.dirname(userController);

const src = path.dirname(controllers);

const project = path.dirname(src);

console.log("\nControllers:", controllers);

console.log("Src:", src);

console.log("Project:", project);

/*
 * ============================================================
 * 19. Reusable parent helper
 * ============================================================
 */

function parentDirectory(filePath) {
  return path.dirname(filePath);
}

console.log("\nParent Directory:", parentDirectory("/project/src/app.js"));

/*
 * ============================================================
 * 20. Get multiple parent directories
 * ============================================================
 */

function getParent(filePath, levels = 1) {
  let result = filePath;

  for (let i = 0; i < levels; i++) {
    result = path.dirname(result);
  }

  return result;
}

console.log("\nOne Level:", getParent("/project/src/modules/users/app.js", 1));

console.log("Two Levels:", getParent("/project/src/modules/users/app.js", 2));

console.log("Three Levels:", getParent("/project/src/modules/users/app.js", 3));

/*
 * ============================================================
 * 21. Dynamic file processing
 * ============================================================
 */

const files = [
  "/uploads/images/profile.jpg",

  "/uploads/documents/resume.pdf",

  "/logs/application/app.log",

  "/data/users/users.json",
];

console.log("\nFile Directories:");

for (const file of files) {
  console.log({
    file,

    directory: path.dirname(file),

    name: path.basename(file),
  });
}

/*
 * ============================================================
 * 22. dirname() + basename()
 * ============================================================
 *
 * These two functions are often used together.
 *
 *
 *     path.dirname(filePath)
 *
 *         -> directory
 *
 *
 *     path.basename(filePath)
 *
 *         -> filename
 *
 * ============================================================
 */

const logPath = "/project/logs/server/app.log";

const logInfo = {
  fullPath: logPath,

  directory: path.dirname(logPath),

  filename: path.basename(logPath),
};

console.log("\nLog Information:");

console.log(logInfo);

/*
 * ============================================================
 * 23. Directory-only path
 * ============================================================
 *
 * `dirname()` works with directory paths too.
 *
 * ============================================================
 */

const directoryPath = "/project/src/controllers";

console.log("\nDirectory Path:", directoryPath);

console.log("Parent:", path.dirname(directoryPath));

/*
 * ============================================================
 * 24. Root directory
 * ============================================================
 *
 * Eventually, repeatedly calling dirname() reaches the root.
 *
 *
 * Linux/macOS:
 *
 *     /
 *
 *
 * Windows:
 *
 *     C:\
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Find root using dirname()
 * ============================================================
 */

function findRoot(filePath) {
  let current = path.resolve(filePath);

  while (true) {
    const parent = path.dirname(current);

    if (parent === current) {
      return current;
    }

    current = parent;
  }
}

console.log("\nFilesystem Root:", findRoot(__filename));

/*
 * ============================================================
 * 26. Important distinction
 * ============================================================
 *
 *
 * dirname()
 *
 *     Extracts the directory portion.
 *
 *
 * basename()
 *
 *     Extracts the final portion.
 *
 *
 * extname()
 *
 *     Extracts the extension.
 *
 *
 * resolve()
 *
 *     Converts a path to an absolute path.
 *
 *
 * join()
 *
 *     Combines path segments.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Visual example
 * ============================================================
 *
 *
 *     /project/src/controllers/user.controller.js
 *      └──────────────────────────────────────────┘
 *                       full path
 *
 *
 *     dirname:
 *
 *     /project/src/controllers
 *
 *
 *     basename:
 *
 *     user.controller.js
 *
 *
 *     extname:
 *
 *     .js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Practical API example
 * ============================================================
 *
 * Imagine your API receives a file path.
 *
 * We can extract useful metadata.
 *
 * ============================================================
 */

function getFileMetadata(filePath) {
  return {
    fullPath: filePath,

    directory: path.dirname(filePath),

    filename: path.basename(filePath),

    extension: path.extname(filePath),
  };
}

console.log("\nFile Metadata:");

console.log(getFileMetadata("/uploads/profile/avatar.jpg"));

/*
 * ============================================================
 * 29. Security note
 * ============================================================
 *
 * `dirname()` is a path manipulation utility.
 *
 * It does NOT provide authorization or security.
 *
 *
 * If a user controls a path:
 *
 *
 *     "../../secret"
 *
 *
 * dirname() will simply process it.
 *
 *
 * Never treat dirname(), basename(), join(), or resolve()
 * as a replacement for filesystem security validation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Common mistake
 * ============================================================
 *
 * Don't manually extract directories using:
 *
 *
 *     filePath.split("/")
 *
 *
 * because that assumes `/` is the separator.
 *
 *
 * Use:
 *
 *
 *     path.dirname(filePath)
 *
 *
 * instead.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. CommonJS relationship
 * ============================================================
 *
 *
 * __filename
 *
 *     Full current file path.
 *
 *
 * __dirname
 *
 *     Directory containing current file.
 *
 *
 * Therefore:
 *
 *
 *     path.dirname(__filename)
 *
 *
 * is equivalent to:
 *
 *
 *     __dirname
 *
 * in CommonJS.
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
 *     const path = require("node:path");
 *
 *
 * Get parent directory:
 *
 *     path.dirname(
 *       "/project/src/app.js",
 *     );
 *
 *
 * Result:
 *
 *     /project/src
 *
 *
 * Get filename:
 *
 *     path.basename(
 *       "/project/src/app.js",
 *     );
 *
 *
 * Result:
 *
 *     app.js
 *
 *
 * Current file directory:
 *
 *     __dirname
 *
 *
 * Equivalent:
 *
 *     path.dirname(
 *       __filename,
 *     );
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     dirname()
 *         -> where the file/directory is located
 *
 *     basename()
 *         -> final name
 *
 * ============================================================
 */
