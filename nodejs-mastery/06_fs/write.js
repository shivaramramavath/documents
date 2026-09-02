/**
 * ============================================================
 * Node.js File System Module - Writing Files
 * ============================================================
 *
 * File: write.js
 *
 * Built-in modules:
 *
 *     node:fs
 *     node:path
 *
 * ============================================================
 *
 * In this file we learn:
 *
 *     1. fs.writeFile()
 *     2. fs.writeFileSync()
 *     3. Creating a new file
 *     4. Overwriting an existing file
 *     5. Writing strings
 *     6. Writing JSON
 *     7. Encoding
 *     8. Error handling
 *     9. Async vs Sync
 *    10. Practical examples
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Import modules
 * ============================================================
 */

const fs = require("node:fs");

const path = require("node:path");

/*
 * ============================================================
 * 2. Create file paths
 * ============================================================
 *
 * `__dirname` gives the directory of this JavaScript file.
 *
 * `path.join()` safely creates the complete path.
 * ============================================================
 */

const outputPath = path.join(__dirname, "output.txt");

console.log("Output Path:", outputPath);

/*
 * ============================================================
 * 3. What does writeFile() do?
 * ============================================================
 *
 * `fs.writeFile()`:
 *
 *     - Creates the file if it does not exist.
 *     - Replaces the existing file contents by default.
 *     - Works asynchronously.
 *
 *
 * Example:
 *
 *
 *     fs.writeFile(
 *       filePath,
 *       data,
 *       callback,
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Basic asynchronous write
 * ============================================================
 */

fs.writeFile(outputPath, "Hello from Node.js!", (error) => {
  if (error) {
    console.error("Write failed:", error.message);

    return;
  }

  console.log("\nFile written successfully!");
});

/*
 * ============================================================
 * 5. Writing multiple lines
 * ============================================================
 */

const notesPath = path.join(__dirname, "notes.txt");

const notes = `
Node.js File System

Learning writeFile()

Learning asynchronous I/O

Building backend applications
`;

fs.writeFile(notesPath, notes, "utf8", (error) => {
  if (error) {
    console.error("\nNotes Error:", error.message);

    return;
  }

  console.log("Notes written successfully!");
});

/*
 * ============================================================
 * 6. UTF-8 encoding
 * ============================================================
 *
 * For text files, explicitly using:
 *
 *
 *     "utf8"
 *
 *
 * makes the intention clear.
 *
 * ============================================================
 */

fs.writeFile(
  path.join(__dirname, "utf8.txt"),
  "This file uses UTF-8 encoding.",
  {
    encoding: "utf8",
  },
  (error) => {
    if (error) {
      console.error("UTF-8 write failed:", error.message);

      return;
    }

    console.log("UTF-8 file written.");
  },
);

/*
 * ============================================================
 * 7. Overwriting a file
 * ============================================================
 *
 * IMPORTANT:
 *
 * By default:
 *
 *
 *     writeFile()
 *
 *
 * overwrites the existing contents.
 *
 *
 * Suppose output.txt contains:
 *
 *
 *     Old content
 *
 *
 * After:
 *
 *
 *     fs.writeFile(
 *       outputPath,
 *       "New content",
 *       callback,
 *     );
 *
 *
 * it becomes:
 *
 *
 *     New content
 *
 * ============================================================
 */

const overwritePath = path.join(__dirname, "overwrite.txt");

fs.writeFile(overwritePath, "First version", "utf8", (error) => {
  if (error) {
    console.error("First write failed:", error.message);

    return;
  }

  /*
   * Write again.
   */

  fs.writeFile(overwritePath, "Second version", "utf8", (error) => {
    if (error) {
      console.error("Second write failed:", error.message);

      return;
    }

    console.log("\nFile was overwritten.");
  });
});

/*
 * ============================================================
 * 8. Synchronous write
 * ============================================================
 *
 * Method:
 *
 *     fs.writeFileSync()
 *
 *
 * This blocks execution until the operation completes.
 *
 * ============================================================
 */

const syncPath = path.join(__dirname, "sync.txt");

try {
  fs.writeFileSync(syncPath, "Written synchronously.", "utf8");

  console.log("\nSynchronous write successful.");
} catch (error) {
  console.error("Synchronous write failed:", error.message);
}

/*
 * ============================================================
 * 9. Demonstrate sync execution
 * ============================================================
 */

console.log("\nBefore synchronous write");

try {
  fs.writeFileSync(
    path.join(__dirname, "sync-order.txt"),
    "Sync operation completed.",
  );

  console.log("Synchronous write completed");
} catch (error) {
  console.error(error.message);
}

console.log("After synchronous write");

/*
 * ============================================================
 * 10. Demonstrate async execution
 * ============================================================
 */

console.log("\nBefore asynchronous write");

fs.writeFile(
  path.join(__dirname, "async-order.txt"),
  "Async operation completed.",
  (error) => {
    if (error) {
      console.error(error.message);

      return;
    }

    console.log("Asynchronous write completed");
  },
);

console.log("After asynchronous write");

/*
 * ============================================================
 * Expected order:
 *
 *
 *     Before asynchronous write
 *
 *     After asynchronous write
 *
 *     Asynchronous write completed
 *
 *
 * The callback runs after the filesystem operation completes.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Writing JSON
 * ============================================================
 *
 * JavaScript objects cannot simply be written as JSON text.
 *
 *
 * We need:
 *
 *
 *     JSON.stringify()
 *
 *
 * ============================================================
 */

const usersPath = path.join(__dirname, "users.json");

const users = [
  {
    id: 1,
    name: "Shiva",
    role: "student",
  },

  {
    id: 2,
    name: "Rahul",
    role: "developer",
  },
];

const usersJson = JSON.stringify(users, null, 2);

fs.writeFile(usersPath, usersJson, "utf8", (error) => {
  if (error) {
    console.error("\nUsers JSON write failed:", error.message);

    return;
  }

  console.log("\nusers.json written successfully.");
});

/*
 * ============================================================
 * 12. Why JSON.stringify()?
 * ============================================================
 *
 * JavaScript object:
 *
 *
 *     {
 *       name: "Shiva"
 *     }
 *
 *
 * JSON file:
 *
 *
 *     {
 *       "name": "Shiva"
 *     }
 *
 *
 * `JSON.stringify()` converts JavaScript data into JSON text.
 *
 *
 *     JavaScript Object
 *            ↓
 *     JSON.stringify()
 *            ↓
 *     JSON String
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Pretty JSON
 * ============================================================
 *
 *     JSON.stringify(
 *       data,
 *       null,
 *       2
 *     )
 *
 *
 * The `2` means indentation with two spaces.
 *
 * ============================================================
 */

const product = {
  id: 101,
  name: "Laptop",
  price: 75000,
  available: true,
};

const productJson = JSON.stringify(product, null, 2);

console.log("\nGenerated JSON:");

console.log(productJson);

/*
 * ============================================================
 * 14. Write generated JSON
 * ============================================================
 */

fs.writeFile(
  path.join(__dirname, "product.json"),
  productJson,
  "utf8",
  (error) => {
    if (error) {
      console.error("Product write failed:", error.message);

      return;
    }

    console.log("product.json created.");
  },
);

/*
 * ============================================================
 * 15. Writing an empty file
 * ============================================================
 */

const emptyPath = path.join(__dirname, "empty.txt");

fs.writeFile(emptyPath, "", (error) => {
  if (error) {
    console.error("Empty file error:", error.message);

    return;
  }

  console.log("\nEmpty file created.");
});

/*
 * ============================================================
 * 16. Writing Buffer data
 * ============================================================
 *
 * fs.writeFile() can also write Buffers.
 *
 * ============================================================
 */

const bufferPath = path.join(__dirname, "buffer.txt");

const buffer = Buffer.from("Hello from a Buffer!", "utf8");

fs.writeFile(bufferPath, buffer, (error) => {
  if (error) {
    console.error("Buffer write failed:", error.message);

    return;
  }

  console.log("\nBuffer written successfully.");
});

/*
 * ============================================================
 * 17. Writing with options
 * ============================================================
 *
 * Instead of:
 *
 *
 *     "utf8"
 *
 *
 * we can provide an options object.
 *
 * ============================================================
 */

const optionsPath = path.join(__dirname, "options.txt");

fs.writeFile(
  optionsPath,
  "Writing with options.",
  {
    encoding: "utf8",
  },
  (error) => {
    if (error) {
      console.error("Options write failed:", error.message);

      return;
    }

    console.log("\nOptions write successful.");
  },
);

/*
 * ============================================================
 * 18. File flags
 * ============================================================
 *
 * `flag` controls how the file is opened.
 *
 *
 * Common flags:
 *
 *
 *     "w"
 *         Write.
 *         Creates or truncates the file.
 *
 *
 *     "a"
 *         Append.
 *
 *
 *     "wx"
 *         Write only if the file does not already exist.
 *
 *
 * We will study append behavior in:
 *
 *
 *     append.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Prevent overwriting using wx
 * ============================================================
 *
 * Useful when you want to create a file only if it does not
 * already exist.
 *
 * ============================================================
 */

const createOnlyPath = path.join(__dirname, "create-only.txt");

fs.writeFile(
  createOnlyPath,
  "This file should be created only once.",
  {
    encoding: "utf8",
    flag: "wx",
  },
  (error) => {
    if (error) {
      if (error.code === "EEXIST") {
        console.log("\nFile already exists. Not overwritten.");

        return;
      }

      console.error("Create-only error:", error.message);

      return;
    }

    console.log("\nCreate-only file created.");
  },
);

/*
 * ============================================================
 * 20. Reusable asynchronous helper
 * ============================================================
 */

function writeTextFile(filePath, content, callback) {
  fs.writeFile(filePath, content, "utf8", callback);
}

/*
 * Example usage:
 */

writeTextFile(
  path.join(__dirname, "helper.txt"),
  "Written using a reusable helper.",
  (error) => {
    if (error) {
      console.error("\nHelper error:", error.message);

      return;
    }

    console.log("\nHelper write successful.");
  },
);

/*
 * ============================================================
 * 21. Reusable synchronous helper
 * ============================================================
 */

function writeTextFileSync(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

try {
  writeTextFileSync(
    path.join(__dirname, "sync-helper.txt"),
    "Written using sync helper.",
  );

  console.log("Sync helper successful.");
} catch (error) {
  console.error("Sync helper error:", error.message);
}

/*
 * ============================================================
 * 22. Writing application configuration
 * ============================================================
 */

const config = {
  application: "Node.js Mastery",

  version: "1.0.0",

  environment: "development",

  port: 3000,
};

const configPath = path.join(__dirname, "config.json");

fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf8", (error) => {
  if (error) {
    console.error("\nConfig write failed:", error.message);

    return;
  }

  console.log("\nConfiguration saved.");
});

/*
 * ============================================================
 * 23. Writing an array
 * ============================================================
 */

const numbers = [1, 2, 3, 4, 5];

fs.writeFile(
  path.join(__dirname, "numbers.json"),
  JSON.stringify(numbers, null, 2),
  "utf8",
  (error) => {
    if (error) {
      console.error("Numbers write failed:", error.message);

      return;
    }

    console.log("Numbers saved.");
  },
);

/*
 * ============================================================
 * 24. Error handling
 * ============================================================
 *
 * Filesystem operations can fail because of:
 *
 *
 *     - invalid paths
 *     - permissions
 *     - missing directories
 *     - invalid filenames
 *     - disk errors
 *
 *
 * Always handle errors in asynchronous callbacks.
 *
 * ============================================================
 */

const invalidPath = path.join(__dirname, "missing-directory", "file.txt");

fs.writeFile(
  invalidPath,
  "This will fail because the directory does not exist.",
  (error) => {
    if (error) {
      console.error("\nExpected write error:", error.code, error.message);

      return;
    }

    console.log("Unexpected success.");
  },
);

/*
 * ============================================================
 * 25. Important:
 * ============================================================
 *
 * writeFile() does NOT automatically create missing parent
 * directories.
 *
 *
 * This:
 *
 *
 *     /project/data/users.json
 *
 *
 * requires:
 *
 *
 *     /project/data
 *
 *
 * to already exist.
 *
 *
 * Creating directories is covered in:
 *
 *
 *     directories.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Write a log message
 * ============================================================
 *
 * For simple examples, writeFile() works.
 *
 * For real logging systems, dedicated logging libraries and
 * append/stream APIs are usually more appropriate.
 *
 * ============================================================
 */

const logPath = path.join(__dirname, "application.log");

const logMessage = `[${new Date().toISOString()}] Application started\n`;

fs.writeFile(
  logPath,
  logMessage,
  {
    encoding: "utf8",
    flag: "a",
  },
  (error) => {
    if (error) {
      console.error("Log write failed:", error.message);

      return;
    }

    console.log("\nLog message written.");
  },
);

/*
 * ============================================================
 * 27. Important difference:
 *
 * writeFile()
 *
 *     replaces existing content by default.
 *
 *
 * flag: "a"
 *
 *     appends content.
 *
 *
 * We will study this properly in:
 *
 *
 *     06_fs/append.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Synchronous JSON writing
 * ============================================================
 */

const syncDataPath = path.join(__dirname, "sync-data.json");

const syncData = {
  framework: "Node.js",

  type: "backend",

  language: "JavaScript",
};

try {
  fs.writeFileSync(syncDataPath, JSON.stringify(syncData, null, 2), "utf8");

  console.log("\nSynchronous JSON saved.");
} catch (error) {
  console.error("Sync JSON error:", error.message);
}

/*
 * ============================================================
 * 29. Production recommendation
 * ============================================================
 *
 * In backend request handlers, prefer asynchronous APIs:
 *
 *
 *     fs.writeFile()
 *
 *
 * or:
 *
 *
 *     fs/promises
 *
 *
 * instead of:
 *
 *
 *     fs.writeFileSync()
 *
 *
 * unless synchronous behavior is specifically appropriate.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Mental model
 * ============================================================
 *
 *
 * JavaScript data
 *       ↓
 * JSON.stringify()
 *       ↓
 * String
 *       ↓
 * fs.writeFile()
 *       ↓
 * Filesystem
 *
 *
 * Reading reverses the process:
 *
 *
 * Filesystem
 *       ↓
 * fs.readFile()
 *       ↓
 * String
 *       ↓
 * JSON.parse()
 *       ↓
 * JavaScript data
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
 *     const fs = require("node:fs");
 *
 *
 * Write asynchronously:
 *
 *     fs.writeFile(
 *
 *       filePath,
 *
 *       data,
 *
 *       "utf8",
 *
 *       (error) => {
 *
 *         if (error) {
 *
 *           console.error(error);
 *
 *           return;
 *
 *         }
 *
 *       }
 *
 *     );
 *
 *
 * Write synchronously:
 *
 *     fs.writeFileSync(
 *
 *       filePath,
 *
 *       data,
 *
 *       "utf8",
 *
 *     );
 *
 *
 * Convert object to JSON:
 *
 *     JSON.stringify(
 *       object,
 *       null,
 *       2,
 *     );
 *
 *
 * Create without overwriting:
 *
 *     {
 *       flag: "wx"
 *     }
 *
 *
 * Append:
 *
 *     {
 *       flag: "a"
 *     }
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     writeFile()
 *         -> create / overwrite
 *
 *     writeFileSync()
 *         -> synchronous create / overwrite
 *
 *     JSON.stringify()
 *         -> JavaScript data → JSON text
 *
 *     flag: "a"
 *         -> append
 *
 *     flag: "wx"
 *         -> create only if missing
 *
 * ============================================================
 */
