/**
 * ============================================================
 * Node.js Path Module - path.join()
 * ============================================================
 *
 * File: join.js
 *
 * Built-in module:
 *
 *     node:path
 *
 * ============================================================
 *
 * In this file we learn:
 *
 *     1. What the path module is
 *     2. path.join()
 *     3. Path separators
 *     4. Relative paths
 *     5. Absolute paths
 *     6. Why manual path concatenation is bad
 *     7. Normalizing paths
 *     8. Practical backend examples
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Import the path module
 * ============================================================
 *
 * `node:path` is a built-in Node.js module.
 *
 * No npm installation is required.
 *
 * ============================================================
 */

const path = require("node:path");

/*
 * ============================================================
 * 2. What is a path?
 * ============================================================
 *
 * A path describes the location of a file or directory.
 *
 *
 * Example Windows:
 *
 *     C:\Users\Shiva\project\data\users.json
 *
 *
 * Example Linux/macOS:
 *
 *     /home/shiva/project/data/users.json
 *
 *
 * Node.js provides the `path` module to work with these paths
 * in a platform-independent way.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. path.sep
 * ============================================================
 *
 * `path.sep` gives the platform-specific path separator.
 *
 *
 * Windows:
 *
 *     \
 *
 *
 * Linux/macOS:
 *
 *     /
 *
 * ============================================================
 */

console.log("Path Separator:", path.sep);

/*
 * ============================================================
 * 4. Manual path concatenation - BAD
 * ============================================================
 *
 * You might be tempted to write:
 *
 *
 *     const file =
 *       "data" + "/" + "users.json";
 *
 *
 * This is not ideal because path separators differ between
 * operating systems.
 *
 * ============================================================
 */

const badPath = "data" + "/" + "users.json";

console.log("Manually Created Path:", badPath);

/*
 * ============================================================
 * 5. path.join()
 * ============================================================
 *
 * `path.join()` combines multiple path segments.
 *
 *
 * Example:
 *
 *
 *     path.join(
 *       "data",
 *       "users",
 *       "users.json",
 *     );
 *
 *
 * Result:
 *
 *
 *     data/users/users.json
 *
 *
 * on Unix-like systems.
 *
 *
 * On Windows Node.js uses the appropriate separator.
 *
 * ============================================================
 */

const filePath = path.join("data", "users", "users.json");

console.log("Joined Path:", filePath);

/*
 * ============================================================
 * 6. Multiple segments
 * ============================================================
 */

const projectPath = path.join(
  "project",
  "src",
  "controllers",
  "user.controller.js",
);

console.log("Project Path:", projectPath);

/*
 * ============================================================
 * 7. path.join() normalizes the path
 * ============================================================
 *
 * `path.join()` also cleans up unnecessary path segments.
 *
 *
 * Example:
 *
 *
 *     path.join(
 *       "users",
 *       ".",
 *       "data",
 *     );
 *
 *
 * becomes:
 *
 *
 *     users/data
 *
 * ============================================================
 */

const normalizedPath = path.join("users", ".", "data");

console.log("Normalized Path:", normalizedPath);

/*
 * ============================================================
 * 8. Parent directory `..`
 * ============================================================
 *
 * `..` means:
 *
 *
 *     parent directory
 *
 *
 * Example:
 *
 *
 *     path.join(
 *       "users",
 *       "admin",
 *       "..",
 *       "data",
 *     );
 *
 *
 * The `admin/..` part cancels out.
 *
 * Result:
 *
 *
 *     users/data
 *
 * ============================================================
 */

const parentPath = path.join("users", "admin", "..", "data");

console.log("Parent Path:", parentPath);

/*
 * ============================================================
 * 9. Current directory `.`
 * ============================================================
 *
 * `.` means:
 *
 *
 *     current directory
 *
 *
 * Example:
 *
 *
 *     path.join(
 *       ".",
 *       "config",
 *       "app.json",
 *     );
 *
 * ============================================================
 */

const currentDirectoryPath = path.join(".", "config", "app.json");

console.log("Current Directory Path:", currentDirectoryPath);

/*
 * ============================================================
 * 10. Empty path segments
 * ============================================================
 *
 * `path.join()` can also handle empty segments.
 *
 * ============================================================
 */

const emptySegmentPath = path.join("src", "", "index.js");

console.log("Empty Segment Path:", emptySegmentPath);

/*
 * ============================================================
 * 11. Joining user-provided segments
 * ============================================================
 *
 * In applications, paths can be constructed from variables.
 *
 * ============================================================
 */

const folder = "uploads";

const filename = "profile.jpg";

const uploadPath = path.join(folder, filename);

console.log("Upload Path:", uploadPath);

/*
 * ============================================================
 * 12. Backend example
 * ============================================================
 *
 * Imagine your backend stores uploaded files:
 *
 *
 *     uploads/
 *         images/
 *             profile.jpg
 *
 *
 * We can build the path using:
 *
 *
 *     path.join()
 *
 * ============================================================
 */

const uploadDirectory = path.join("uploads", "images");

const uploadedFile = path.join(uploadDirectory, "profile.jpg");

console.log("Upload Directory:", uploadDirectory);

console.log("Uploaded File:", uploadedFile);

/*
 * ============================================================
 * 13. Joining absolute paths
 * ============================================================
 *
 * If you provide an absolute path segment, behavior can be
 * different from what beginners expect.
 *
 * The safest approach is to understand `path.join()` as a
 * path-segment combiner and use `path.resolve()` when your goal
 * is specifically to produce an absolute path.
 *
 * We will study `path.resolve()` in the next file.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Path with nested directories
 * ============================================================
 */

const apiController = path.join(
  "src",
  "modules",
  "users",
  "controllers",
  "user.controller.js",
);

console.log("API Controller:", apiController);

/*
 * ============================================================
 * 15. Dynamic path creation
 * ============================================================
 */

const version = "v1";

const resource = "users";

const dynamicApiPath = path.join("api", version, resource);

console.log("Dynamic API Path:", dynamicApiPath);

/*
 * ============================================================
 * 16. Build a database file path
 * ============================================================
 */

const databasePath = path.join("data", "database", "app.db");

console.log("Database Path:", databasePath);

/*
 * ============================================================
 * 17. Build a log file path
 * ============================================================
 */

const logPath = path.join("logs", "application", "app.log");

console.log("Log Path:", logPath);

/*
 * ============================================================
 * 18. Why path.join() matters
 * ============================================================
 *
 * Consider:
 *
 *
 *     "src" + "/" + "controllers"
 *
 *
 * This assumes `/`.
 *
 *
 * Better:
 *
 *
 *     path.join(
 *       "src",
 *       "controllers",
 *     );
 *
 *
 * Node.js handles the platform-specific separator.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Cross-platform example
 * ============================================================
 */

const crossPlatformPath = path.join("project", "src", "index.js");

console.log("Cross Platform Path:", crossPlatformPath);

/*
 * ============================================================
 * 20. Check the current platform
 * ============================================================
 *
 * We normally DON'T need to check the OS ourselves when using
 * path.join().
 *
 * Node.js handles the separator.
 *
 *
 * Bad:
 *
 *
 *     if (process.platform === "win32") {
 *       use "\\";
 *     } else {
 *       use "/";
 *     }
 *
 *
 * Better:
 *
 *
 *     path.join(
 *       "src",
 *       "index.js",
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Path segments stored in arrays
 * ============================================================
 */

const segments = ["src", "modules", "users", "services", "user.service.js"];

const servicePath = path.join(...segments);

console.log("Service Path:", servicePath);

/*
 * ============================================================
 * 22. Spread operator with path.join()
 * ============================================================
 *
 * The `...segments` syntax spreads the array values into
 * individual arguments.
 *
 *
 * This:
 *
 *
 *     path.join(
 *       ...segments,
 *     );
 *
 *
 * is equivalent to:
 *
 *
 *     path.join(
 *       "src",
 *       "modules",
 *       "users",
 *       "services",
 *       "user.service.js",
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Normalize an existing path
 * ============================================================
 *
 * Node.js also provides:
 *
 *
 *     path.normalize()
 *
 *
 * This specifically normalizes a path string.
 *
 * ============================================================
 */

const messyPath = "src//users/../controllers/./user.js";

const cleanPath = path.normalize(messyPath);

console.log("Messy Path:", messyPath);

console.log("Clean Path:", cleanPath);

/*
 * ============================================================
 * 24. path.join() vs path.normalize()
 * ============================================================
 *
 *
 * path.join()
 *
 *     Combines path segments and normalizes the result.
 *
 *
 * path.normalize()
 *
 *     Normalizes an existing path string.
 *
 *
 * Example:
 *
 *
 *     path.join(
 *       "src",
 *       "users",
 *       "..",
 *       "controllers",
 *     );
 *
 *
 * vs
 *
 *
 *     path.normalize(
 *       "src/users/../controllers",
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Create a reusable helper
 * ============================================================
 */

function createPath(...segments) {
  return path.join(...segments);
}

console.log("Helper Path:", createPath("src", "config", "database.js"));

/*
 * ============================================================
 * 26. File extension doesn't matter to path.join()
 * ============================================================
 *
 * path.join() does not care whether the last segment is:
 *
 *
 *     index.js
 *     users.json
 *     image.png
 *     app.log
 *
 *
 * It simply constructs a path.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Path joining with variables
 * ============================================================
 */

const moduleName = "users";

const fileName = "controller.js";

const moduleFile = path.join("src", "modules", moduleName, fileName);

console.log("Module File:", moduleFile);

/*
 * ============================================================
 * 28. Common backend folder structure
 * ============================================================
 *
 *
 * project/
 *
 *     src/
 *         controllers/
 *         services/
 *         models/
 *         routes/
 *         middleware/
 *
 *
 * We can construct these paths safely with path.join().
 *
 * ============================================================
 */

const controllersPath = path.join("src", "controllers");

const servicesPath = path.join("src", "services");

const modelsPath = path.join("src", "models");

console.log("Controllers:", controllersPath);

console.log("Services:", servicesPath);

console.log("Models:", modelsPath);

/*
 * ============================================================
 * 29. Important security warning
 * ============================================================
 *
 * `path.join()` does NOT automatically make user input safe.
 *
 * Example:
 *
 *
 *     const file =
 *       req.params.file;
 *
 *
 * Never blindly trust user-controlled path segments when
 * accessing sensitive files.
 *
 *
 * Attackers may attempt path traversal such as:
 *
 *
 *     ../../secret.txt
 *
 *
 * Secure file access requires additional validation and
 * containment checks.
 *
 * We will revisit this in the security section.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Common mistake
 * ============================================================
 *
 * DON'T write:
 *
 *
 *     const file =
 *       __dirname +
 *       "/data/file.txt";
 *
 *
 * Prefer:
 *
 *
 *     const file =
 *       path.join(
 *         __dirname,
 *         "data",
 *         "file.txt",
 *       );
 *
 *
 * This makes the path construction platform-aware.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. __dirname
 * ============================================================
 *
 * In CommonJS modules, Node.js provides:
 *
 *
 *     __dirname
 *
 *
 * which represents the directory containing the current
 * module.
 *
 *
 * Example:
 *
 *
 *     const dataPath =
 *       path.join(
 *         __dirname,
 *         "data",
 *         "users.json",
 *       );
 *
 *
 * This pattern is extremely common in Node.js applications.
 *
 * ============================================================
 */

const localDataPath = path.join(__dirname, "data", "users.json");

console.log("Local Data Path:", localDataPath);

/*
 * ============================================================
 * 32. __filename
 * ============================================================
 *
 * CommonJS also provides:
 *
 *
 *     __filename
 *
 *
 * It represents the absolute path of the current file.
 *
 * ============================================================
 */

console.log("Current File:", __filename);

/*
 * ============================================================
 * 33. __dirname vs __filename
 * ============================================================
 *
 *
 * __filename
 *
 *     Full path to the current file.
 *
 *
 * __dirname
 *
 *     Directory containing the current file.
 *
 *
 * Example:
 *
 *
 *     __filename
 *
 *     C:\project\05_path\join.js
 *
 *
 *     __dirname
 *
 *     C:\project\05_path
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Practical example
 * ============================================================
 */

const configPath = path.join(__dirname, "config", "app.json");

console.log("Config Path:", configPath);

/*
 * ============================================================
 * 35. Why absolute paths are useful
 * ============================================================
 *
 * Relative path:
 *
 *
 *     data/users.json
 *
 *
 * Absolute path:
 *
 *
 *     C:\project\data\users.json
 *
 *
 * or:
 *
 *
 *     /home/user/project/data/users.json
 *
 *
 * Absolute paths are useful when you need an unambiguous
 * location on the filesystem.
 *
 * `path.resolve()` is commonly used to create them.
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
 * Path separator:
 *
 *     path.sep;
 *
 *
 * Join paths:
 *
 *     path.join(
 *       "src",
 *       "users",
 *       "index.js",
 *     );
 *
 *
 * Normalize:
 *
 *     path.normalize(
 *       "src//users/../index.js",
 *     );
 *
 *
 * Current directory:
 *
 *     __dirname;
 *
 *
 * Current file:
 *
 *     __filename;
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     NEVER manually concatenate filesystem paths when
 *     `node:path` can do it for you.
 *
 *     Use:
 *
 *         path.join(...)
 *
 *     for combining path segments.
 *
 * ============================================================
 */
