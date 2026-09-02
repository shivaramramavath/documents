/**
 * ============================================================
 * Node.js File System Module - Append Files
 * ============================================================
 *
 * File: append.js
 *
 * Built-in module:
 *
 *     node:fs
 *
 * ============================================================
 *
 * In this file we learn:
 *
 *     1. fs.appendFile()
 *     2. fs.appendFileSync()
 *     3. Append vs write
 *     4. File flags
 *     5. Appending text
 *     6. Appending JSON carefully
 *     7. Building a simple log file
 *     8. Error handling
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
 * 2. Create a file path
 * ============================================================
 */

const filePath = path.join(__dirname, "append-example.txt");

/*
 * ============================================================
 * 3. What is append?
 * ============================================================
 *
 * Append means:
 *
 *     Add new data to the END of existing data.
 *
 *
 * Example:
 *
 * Existing file:
 *
 *     Hello
 *
 *
 * Append:
 *
 *     World
 *
 *
 * Result:
 *
 *     Hello
 *     World
 *
 *
 * Unlike writeFile(), appendFile() does not replace the
 * existing contents.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Basic appendFile()
 * ============================================================
 */

fs.appendFile(filePath, "First line\n", "utf8", (error) => {
  if (error) {
    console.error("Append failed:", error.message);

    return;
  }

  console.log("First line appended.");
});

/*
 * ============================================================
 * 5. Append another line
 * ============================================================
 */

fs.appendFile(filePath, "Second line\n", "utf8", (error) => {
  if (error) {
    console.error("Append failed:", error.message);

    return;
  }

  console.log("Second line appended.");
});

/*
 * ============================================================
 * 6. Append a third line
 * ============================================================
 */

fs.appendFile(filePath, "Third line\n", "utf8", (error) => {
  if (error) {
    console.error("Append failed:", error.message);

    return;
  }

  console.log("Third line appended.");
});

/*
 * ============================================================
 * 7. Important behavior
 * ============================================================
 *
 * If the file does NOT exist:
 *
 *
 *     appendFile()
 *
 *
 * normally creates it.
 *
 *
 * If the file already exists:
 *
 *
 *     appendFile()
 *
 *
 * adds data to the end.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Append synchronously
 * ============================================================
 *
 * Method:
 *
 *     fs.appendFileSync()
 *
 * ============================================================
 */

const syncPath = path.join(__dirname, "append-sync.txt");

try {
  fs.appendFileSync(syncPath, "Sync line 1\n", "utf8");

  fs.appendFileSync(syncPath, "Sync line 2\n", "utf8");

  console.log("\nSynchronous append completed.");
} catch (error) {
  console.error("Sync append failed:", error.message);
}

/*
 * ============================================================
 * 9. appendFile() vs writeFile()
 * ============================================================
 *
 *
 * writeFile():
 *
 *
 *     Existing:
 *
 *         Hello
 *
 *
 *     writeFile("World")
 *
 *
 *     Result:
 *
 *         World
 *
 *
 * ------------------------------------------------------------
 *
 *
 * appendFile():
 *
 *
 *     Existing:
 *
 *         Hello
 *
 *
 *     appendFile("World")
 *
 *
 *     Result:
 *
 *         HelloWorld
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Use a newline
 * ============================================================
 *
 * When appending logs or lines of text, add:
 *
 *
 *     \n
 *
 *
 * Example:
 *
 *
 *     "New log entry\n"
 *
 *
 * Otherwise multiple entries may appear on one line.
 *
 * ============================================================
 */

const notesPath = path.join(__dirname, "notes.txt");

fs.appendFile(
  notesPath,
  "Learning Node.js filesystem module.\n",
  "utf8",
  (error) => {
    if (error) {
      console.error("Notes append failed:", error.message);

      return;
    }

    console.log("Note added.");
  },
);

/*
 * ============================================================
 * 11. Append multiple lines at once
 * ============================================================
 */

const multipleLines = `
Line A
Line B
Line C
`;

fs.appendFile(filePath, multipleLines, "utf8", (error) => {
  if (error) {
    console.error("Multiple line append failed:", error.message);

    return;
  }

  console.log("Multiple lines appended.");
});

/*
 * ============================================================
 * 12. Append Buffer
 * ============================================================
 *
 * appendFile() can also accept a Buffer.
 *
 * ============================================================
 */

const buffer = Buffer.from("Buffer data\n", "utf8");

fs.appendFile(filePath, buffer, (error) => {
  if (error) {
    console.error("Buffer append failed:", error.message);

    return;
  }

  console.log("Buffer appended.");
});

/*
 * ============================================================
 * 13. File flags
 * ============================================================
 *
 * `appendFile()` essentially uses append behavior.
 *
 * We can also explicitly use:
 *
 *
 *     flag: "a"
 *
 *
 * Example:
 *
 *
 *     fs.writeFile(
 *
 *       filePath,
 *
 *       data,
 *
 *       {
 *         flag: "a"
 *       },
 *
 *       callback
 *
 *     );
 *
 *
 * This means:
 *
 *
 *     Open for appending.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Using writeFile() with flag "a"
 * ============================================================
 */

const flagPath = path.join(__dirname, "flag-append.txt");

fs.writeFile(
  flagPath,
  "Appended using flag a\n",
  {
    encoding: "utf8",
    flag: "a",
  },
  (error) => {
    if (error) {
      console.error("Flag append failed:", error.message);

      return;
    }

    console.log("Appended using flag: a");
  },
);

/*
 * ============================================================
 * 15. Why is "a" useful?
 * ============================================================
 *
 * It allows us to use writeFile() with append semantics.
 *
 *
 *     flag: "a"
 *
 *
 * means:
 *
 *
 *     append to the file.
 *
 *
 * If the file does not exist, it can be created.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Practical example: application log
 * ============================================================
 */

const logPath = path.join(__dirname, "application.log");

function writeLog(message) {
  const timestamp = new Date().toISOString();

  const logLine = `[${timestamp}] ${message}\n`;

  fs.appendFile(logPath, logLine, "utf8", (error) => {
    if (error) {
      console.error("Could not write log:", error.message);

      return;
    }

    console.log("Log written:", message);
  });
}

/*
 * Write some logs.
 */

writeLog("Application started");

writeLog("Database connection requested");

writeLog("Server is running");

/*
 * ============================================================
 * 17. Example log output
 * ============================================================
 *
 *
 *     [2026-09-02T12:00:00.000Z] Application started
 *
 *     [2026-09-02T12:00:01.000Z] Database connection requested
 *
 *     [2026-09-02T12:00:02.000Z] Server is running
 *
 *
 * Each call adds a new line.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Practical example: audit trail
 * ============================================================
 *
 * An audit trail records events such as:
 *
 *
 *     user registered
 *     user logged in
 *     user updated profile
 *     user deleted resource
 *
 * ============================================================
 */

const auditPath = path.join(__dirname, "audit.log");

function audit(userId, action) {
  const entry = {
    timestamp: new Date().toISOString(),

    userId,

    action,
  };

  const line = JSON.stringify(entry) + "\n";

  fs.appendFile(auditPath, line, "utf8", (error) => {
    if (error) {
      console.error("Audit write failed:", error.message);

      return;
    }

    console.log("Audit event recorded.");
  });
}

audit("user-101", "LOGIN");

audit("user-101", "UPDATE_PROFILE");

audit("user-101", "LOGOUT");

/*
 * ============================================================
 * 19. Why newline matters for JSON logs
 * ============================================================
 *
 * We are NOT creating one normal JSON array here.
 *
 * Instead, every line is a separate JSON object:
 *
 *
 *     {"userId":"user-101","action":"LOGIN"}
 *
 *     {"userId":"user-101","action":"UPDATE_PROFILE"}
 *
 *
 * This style is commonly called:
 *
 *
 *     JSON Lines
 *
 * or:
 *
 *     NDJSON
 *
 *
 * It is useful for logs and event streams.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. IMPORTANT: Don't append random JSON to a JSON object
 * ============================================================
 *
 * Suppose a file contains:
 *
 *
 *     {
 *       "name": "Shiva"
 *     }
 *
 *
 * Doing:
 *
 *
 *     appendFile(
 *       file,
 *       '{"age": 21}'
 *     );
 *
 *
 * produces invalid JSON:
 *
 *
 *     {"name":"Shiva"}{"age":21}
 *
 *
 * Instead, read the JSON, modify the JavaScript object,
 * and write the complete JSON again.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Correct approach for JSON data
 * ============================================================
 */

const jsonPath = path.join(__dirname, "data.json");

const initialData = {
  users: [],
};

fs.writeFile(
  jsonPath,
  JSON.stringify(initialData, null, 2),
  "utf8",
  (error) => {
    if (error) {
      console.error("Initial JSON write failed:", error.message);

      return;
    }

    /*
     * Now read it.
     */

    fs.readFile(jsonPath, "utf8", (error, content) => {
      if (error) {
        console.error("JSON read failed:", error.message);

        return;
      }

      try {
        const data = JSON.parse(content);

        data.users.push({
          id: 1,

          name: "Shiva",
        });

        fs.writeFile(
          jsonPath,
          JSON.stringify(data, null, 2),
          "utf8",
          (error) => {
            if (error) {
              console.error("Updated JSON write failed:", error.message);

              return;
            }

            console.log("JSON data updated correctly.");
          },
        );
      } catch (parseError) {
        console.error("Invalid JSON:", parseError.message);
      }
    });
  },
);

/*
 * ============================================================
 * 22. Reusable append helper
 * ============================================================
 */

function appendText(filePath, content, callback) {
  fs.appendFile(filePath, content, "utf8", callback);
}

appendText(
  path.join(__dirname, "helper.txt"),
  "Added through helper.\n",
  (error) => {
    if (error) {
      console.error("Helper failed:", error.message);

      return;
    }

    console.log("Helper append successful.");
  },
);

/*
 * ============================================================
 * 23. Synchronous helper
 * ============================================================
 */

function appendTextSync(filePath, content) {
  fs.appendFileSync(filePath, content, "utf8");
}

try {
  appendTextSync(
    path.join(__dirname, "sync-helper.txt"),
    "Sync helper line.\n",
  );

  console.log("Sync helper successful.");
} catch (error) {
  console.error("Sync helper failed:", error.message);
}

/*
 * ============================================================
 * 24. Common mistake
 * ============================================================
 *
 * Don't confuse:
 *
 *
 *     writeFile()
 *
 *
 * with:
 *
 *
 *     appendFile()
 *
 *
 * writeFile():
 *
 *     Replace existing contents.
 *
 *
 * appendFile():
 *
 *     Add to existing contents.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Common mistake: forgetting newline
 * ============================================================
 *
 * Bad:
 *
 *
 *     appendFile(
 *       file,
 *       "Login"
 *     );
 *
 *     appendFile(
 *       file,
 *       "Logout"
 *     );
 *
 *
 * Result:
 *
 *
 *     LoginLogout
 *
 *
 * Better:
 *
 *
 *     "Login\n"
 *
 *     "Logout\n"
 *
 *
 * Result:
 *
 *
 *     Login
 *     Logout
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. When append is useful
 * ============================================================
 *
 * Common use cases:
 *
 *
 *     application logs
 *     audit logs
 *     event logs
 *     CLI output
 *     simple text history
 *     NDJSON files
 *
 *
 * For very high-volume logging, production systems often use
 * dedicated logging libraries and log aggregation systems.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Performance note
 * ============================================================
 *
 * Prefer asynchronous:
 *
 *
 *     fs.appendFile()
 *
 *
 * in server applications.
 *
 *
 * Avoid repeatedly using:
 *
 *
 *     fs.appendFileSync()
 *
 *
 * in request handlers because synchronous filesystem calls
 * block JavaScript execution.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Final mental model
 * ============================================================
 *
 *
 * writeFile()
 *
 *     File
 *      ↓
 *     REPLACE
 *
 *
 * appendFile()
 *
 *     File
 *      ↓
 *     KEEP existing data
 *      ↓
 *     ADD new data
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Final cheat sheet
 * ============================================================
 *
 *
 * Async append:
 *
 *     fs.appendFile(
 *
 *       filePath,
 *
 *       "Hello\n",
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
 * Sync append:
 *
 *     fs.appendFileSync(
 *
 *       filePath,
 *
 *       "Hello\n",
 *
 *       "utf8",
 *
 *     );
 *
 *
 * Using writeFile with append:
 *
 *     fs.writeFile(
 *
 *       filePath,
 *
 *       data,
 *
 *       {
 *         flag: "a"
 *       },
 *
 *       callback,
 *
 *     );
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     writeFile()
 *         -> replace
 *
 *     appendFile()
 *         -> add to end
 *
 *     flag: "a"
 *         -> append mode
 *
 *     \n
 *         -> new line
 *
 * ============================================================
 */
