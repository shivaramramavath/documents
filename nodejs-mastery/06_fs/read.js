/**
 * ============================================================
 * Node.js File System Module - Reading Files
 * ============================================================
 *
 * File: read.js
 *
 * Built-in module:
 *
 *     node:fs
 *
 * ============================================================
 *
 * In this file we learn:
 *
 *     1. What is fs?
 *     2. fs.readFileSync()
 *     3. fs.readFile()
 *     4. Reading text files
 *     5. Reading JSON files
 *     6. Error handling
 *     7. __dirname + path.join()
 *     8. Encoding
 *     9. Synchronous vs asynchronous I/O
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Import fs
 * ============================================================
 */

const fs = require("node:fs");

/*
 * ============================================================
 * 2. Import path
 * ============================================================
 *
 * We use path to create reliable file paths.
 *
 * ============================================================
 */

const path = require("node:path");

/*
 * ============================================================
 * 3. What is the fs module?
 * ============================================================
 *
 * `fs` means:
 *
 *     File System
 *
 *
 * Node.js provides the `fs` module for interacting with the
 * operating system's filesystem.
 *
 *
 * Common operations:
 *
 *
 *     read files
 *     write files
 *     append files
 *     rename files
 *     delete files
 *     create directories
 *     remove directories
 *     work with streams
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Create a file path
 * ============================================================
 *
 * Avoid manually writing:
 *
 *
 *     "./data/example.txt"
 *
 *
 * Prefer:
 *
 *
 *     path.join()
 *
 *
 * because path separators differ between operating systems.
 *
 * ============================================================
 */

const filePath = path.join(__dirname, "example.txt");

console.log("File Path:", filePath);

/*
 * ============================================================
 * IMPORTANT
 * ============================================================
 *
 * Before running the examples below, create:
 *
 *
 *     06_fs/example.txt
 *
 *
 * with something like:
 *
 *
 *     Hello from Node.js!
 *
 *     Learning the File System module.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Read file synchronously
 * ============================================================
 *
 * Method:
 *
 *     fs.readFileSync()
 *
 *
 * "Sync" means synchronous.
 *
 *
 * Node.js waits until the filesystem operation completes.
 *
 * ============================================================
 */

try {
  const data = fs.readFileSync(filePath, "utf8");

  console.log("\n--- Synchronous Read ---");

  console.log(data);
} catch (error) {
  console.error("Failed to read file:", error.message);
}

/*
 * ============================================================
 * 6. Why specify "utf8"?
 * ============================================================
 *
 * Without an encoding:
 *
 *
 *     fs.readFileSync(filePath)
 *
 *
 * Node.js returns a Buffer.
 *
 *
 * With:
 *
 *
 *     "utf8"
 *
 *
 * Node.js returns a string.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Read as Buffer
 * ============================================================
 */

try {
  const buffer = fs.readFileSync(filePath);

  console.log("\n--- Buffer Read ---");

  console.log(buffer);

  console.log("Is Buffer:", Buffer.isBuffer(buffer));
} catch (error) {
  console.error("Failed:", error.message);
}

/*
 * ============================================================
 * 8. Convert Buffer to string
 * ============================================================
 */

try {
  const buffer = fs.readFileSync(filePath);

  const text = buffer.toString("utf8");

  console.log("\n--- Buffer to String ---");

  console.log(text);
} catch (error) {
  console.error("Failed:", error.message);
}

/*
 * ============================================================
 * 9. Asynchronous file reading
 * ============================================================
 *
 * Method:
 *
 *     fs.readFile()
 *
 *
 * This does NOT block the Node.js event loop while the
 * filesystem operation is being performed.
 *
 * ============================================================
 */

fs.readFile(filePath, "utf8", (error, data) => {
  console.log("\n--- Asynchronous Read ---");

  if (error) {
    console.error("Failed to read file:", error.message);

    return;
  }

  console.log(data);
});

/*
 * ============================================================
 * 10. Understanding the callback
 * ============================================================
 *
 * The callback receives:
 *
 *
 *     error
 *     data
 *
 *
 * Typical pattern:
 *
 *
 *     fs.readFile(
 *
 *       filePath,
 *
 *       "utf8",
 *
 *       (error, data) => {
 *
 *         if (error) {
 *
 *           // handle error
 *
 *           return;
 *
 *         }
 *
 *         // use data
 *
 *       }
 *
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Error handling
 * ============================================================
 *
 * Common errors:
 *
 *
 *     file does not exist
 *
 *     permission denied
 *
 *     invalid path
 *
 *     filesystem failure
 *
 * ============================================================
 */

const missingFile = path.join(__dirname, "does-not-exist.txt");

fs.readFile(missingFile, "utf8", (error, data) => {
  if (error) {
    console.error("\nExpected Error:", error.code, error.message);

    return;
  }

  console.log(data);
});

/*
 * ============================================================
 * 12. Understanding error.code
 * ============================================================
 *
 * For a missing file, you will commonly see:
 *
 *
 *     ENOENT
 *
 *
 * Meaning:
 *
 *
 *     Error NO ENTry
 *
 *
 * In production code, error.code can be useful for deciding
 * what kind of filesystem failure occurred.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Reading JSON
 * ============================================================
 *
 * JSON files are text files.
 *
 *
 * Example:
 *
 *
 *     users.json
 *
 *
 * Contents:
 *
 *
 *     [
 *       {
 *         "id": 1,
 *         "name": "Shiva"
 *       }
 *     ]
 *
 * ============================================================
 */

/*
 * Create:
 *
 *     06_fs/users.json
 *
 *
 * Example contents:
 *
 *
 *     [
 *       {
 *         "id": 1,
 *         "name": "Shiva"
 *       }
 *     ]
 *
 * ============================================================
 */

const jsonPath = path.join(__dirname, "users.json");

fs.readFile(jsonPath, "utf8", (error, data) => {
  if (error) {
    console.error("\nJSON Read Error:", error.message);

    return;
  }

  try {
    const users = JSON.parse(data);

    console.log("\n--- JSON Data ---");

    console.log(users);
  } catch (parseError) {
    console.error("Invalid JSON:", parseError.message);
  }
});

/*
 * ============================================================
 * 14. Read only part of a file
 * ============================================================
 *
 * Node.js also provides lower-level filesystem APIs.
 *
 * For normal applications, readFile() is usually simpler.
 *
 * We will cover lower-level file descriptors later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Reading multiple files
 * ============================================================
 */

const file1 = path.join(__dirname, "example.txt");

const file2 = path.join(__dirname, "users.json");

fs.readFile(file1, "utf8", (error, content1) => {
  if (error) {
    console.error("File 1 Error:", error.message);

    return;
  }

  fs.readFile(file2, "utf8", (error, content2) => {
    if (error) {
      console.error("File 2 Error:", error.message);

      return;
    }

    console.log("\n--- Multiple Files ---");

    console.log("File 1:", content1);

    console.log("File 2:", content2);
  });
});

/*
 * ============================================================
 * 16. The callback nesting problem
 * ============================================================
 *
 * If we keep nesting callbacks:
 *
 *
 *     readFile()
 *       └── readFile()
 *            └── readFile()
 *                 └── readFile()
 *
 *
 * the code becomes difficult to maintain.
 *
 *
 * This is commonly called:
 *
 *
 *     Callback Hell
 *
 *
 * Modern Node.js applications often use:
 *
 *
 *     fs/promises
 *
 *
 * with:
 *
 *
 *     async/await
 *
 *
 * We will cover that later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Synchronous vs asynchronous
 * ============================================================
 *
 *
 * Synchronous:
 *
 *
 *     fs.readFileSync()
 *
 *
 * Node.js waits for the operation.
 *
 *
 * Asynchronous:
 *
 *
 *     fs.readFile()
 *
 *
 * Node.js starts the operation and can continue handling
 * other work while the filesystem operation completes.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Demonstrating synchronous blocking
 * ============================================================
 */

console.log("\nBefore Sync Read");

try {
  const content = fs.readFileSync(filePath, "utf8");

  console.log("Sync content loaded");

  console.log(content);
} catch (error) {
  console.error(error.message);
}

console.log("After Sync Read");

/*
 * ============================================================
 * 19. Demonstrating asynchronous execution
 * ============================================================
 */

console.log("\nBefore Async Read");

fs.readFile(filePath, "utf8", (error, data) => {
  if (error) {
    console.error(error.message);

    return;
  }

  console.log("Async content loaded");

  console.log(data);
});

console.log("After Async Read");

/*
 * ============================================================
 * Expected conceptual order:
 *
 *
 *     Before Async Read
 *
 *     After Async Read
 *
 *     Async content loaded
 *
 *
 * Why?
 *
 * Because readFile() is asynchronous.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Read a text file helper
 * ============================================================
 */

function readTextFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

try {
  console.log("\nHelper Result:", readTextFile(filePath));
} catch (error) {
  console.error("Helper Error:", error.message);
}

/*
 * ============================================================
 * 21. Asynchronous helper
 * ============================================================
 */

function readTextFileAsync(filePath, callback) {
  fs.readFile(filePath, "utf8", callback);
}

readTextFileAsync(filePath, (error, data) => {
  if (error) {
    console.error("\nAsync Helper Error:", error.message);

    return;
  }

  console.log("\nAsync Helper Result:");

  console.log(data);
});

/*
 * ============================================================
 * 22. File size
 * ============================================================
 *
 * Reading a file gives us its contents.
 *
 * If we need metadata such as:
 *
 *
 *     size
 *     permissions
 *     timestamps
 *
 *
 * we can use:
 *
 *
 *     fs.stat()
 *
 *
 * This will be covered in more detail later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Encoding options
 * ============================================================
 *
 * Common text encoding:
 *
 *
 *     "utf8"
 *
 *
 * Example:
 *
 *
 *     fs.readFile(
 *
 *       filePath,
 *
 *       {
 *         encoding: "utf8"
 *       },
 *
 *       callback
 *
 *     );
 *
 * ============================================================
 */

fs.readFile(
  filePath,
  {
    encoding: "utf8",
  },
  (error, data) => {
    if (error) {
      console.error("\nEncoding Example Error:", error.message);

      return;
    }

    console.log("\nEncoding Example:");

    console.log(data);
  },
);

/*
 * ============================================================
 * 24. File reading with URL
 * ============================================================
 *
 * Node.js also supports file URLs in many filesystem APIs.
 *
 * Example:
 *
 *
 *     pathToFileURL()
 *
 *
 * We will cover this concept later when working with modern
 * Node.js modules.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Production recommendation
 * ============================================================
 *
 * For server-side applications:
 *
 *
 * Prefer:
 *
 *
 *     asynchronous APIs
 *
 *
 * especially when filesystem operations may take noticeable
 * time or happen frequently.
 *
 *
 * Avoid unnecessary:
 *
 *
 *     readFileSync()
 *
 *
 * inside request handlers.
 *
 *
 * Why?
 *
 *
 * A synchronous filesystem operation blocks the JavaScript
 * execution thread.
 *
 *
 * Example:
 *
 *
 *     HTTP request
 *          ↓
 *     readFileSync()
 *          ↓
 *     wait
 *          ↓
 *     response
 *
 *
 * During the blocking operation, that execution thread cannot
 * continue normal JavaScript work.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. When sync APIs are acceptable
 * ============================================================
 *
 * Synchronous filesystem operations are not always bad.
 *
 * They can be reasonable during:
 *
 *
 *     application startup
 *     configuration loading
 *     simple CLI tools
 *     scripts
 *     build scripts
 *
 *
 * But be careful inside high-throughput server request paths.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Common mistake
 * ============================================================
 *
 * DON'T do this if you expect text:
 *
 *
 *     const data =
 *       fs.readFileSync(
 *         filePath,
 *       );
 *
 *
 * and immediately assume:
 *
 *
 *     data === "hello"
 *
 *
 * Without encoding, `data` is a Buffer.
 *
 *
 * Use:
 *
 *
 *     fs.readFileSync(
 *       filePath,
 *       "utf8",
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Common mistake: ignoring errors
 * ============================================================
 *
 * Don't assume the file always exists.
 *
 *
 * Bad:
 *
 *
 *     fs.readFile(
 *       filePath,
 *       "utf8",
 *       (error, data) => {
 *
 *         console.log(data);
 *
 *       }
 *     );
 *
 *
 * Better:
 *
 *
 *     if (error) {
 *
 *       // handle error
 *
 *       return;
 *
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Complete practical example
 * ============================================================
 */

function loadConfig(configPath) {
  try {
    const content = fs.readFileSync(configPath, "utf8");

    return JSON.parse(content);
  } catch (error) {
    console.error("Could not load config:", error.message);

    return null;
  }
}

/*
 * Example:
 *
 *     const config =
 *       loadConfig(
 *         "./config.json"
 *       );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Summary
 * ============================================================
 */

console.log("\n============================================================");

console.log("FS READ SUMMARY");

console.log("============================================================");

console.log(
  `
fs.readFileSync()
    -> synchronous file reading

fs.readFile()
    -> asynchronous callback-based reading

"utf8"
    -> return text instead of Buffer

Buffer
    -> raw binary data

JSON.parse()
    -> convert JSON string into JavaScript data

error.code
    -> identifies many filesystem errors

path.join()
    -> construct reliable filesystem paths

__dirname
    -> current CommonJS module directory
`,
);

/*
 * ============================================================
 * FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * Synchronous:
 *
 *     const data =
 *       fs.readFileSync(
 *         filePath,
 *         "utf8",
 *       );
 *
 *
 * Asynchronous:
 *
 *     fs.readFile(
 *
 *       filePath,
 *
 *       "utf8",
 *
 *       (error, data) => {
 *
 *         if (error) {
 *
 *           console.error(error);
 *
 *           return;
 *
 *         }
 *
 *         console.log(data);
 *
 *       }
 *
 *     );
 *
 *
 * Buffer:
 *
 *     const buffer =
 *       fs.readFileSync(
 *         filePath,
 *       );
 *
 *
 * Convert Buffer:
 *
 *     buffer.toString(
 *       "utf8",
 *     );
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     fs
 *       ↓
 *     File System
 *
 *
 *     readFileSync()
 *       ↓
 *     blocking
 *
 *
 *     readFile()
 *       ↓
 *     asynchronous
 *
 *
 *     fs/promises
 *       ↓
 *     modern async/await API
 *
 * ============================================================
 */
