/**
 * ============================================================
 * Node.js File System - Directories
 * ============================================================
 *
 * File:
 *
 *     06_fs/directories.js
 *
 * Built-in module:
 *
 *     node:fs
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. mkdir()
 *     2. mkdirSync()
 *     3. recursive directories
 *     4. readdir()
 *     5. readdirSync()
 *     6. directory entries
 *     7. checking files vs directories
 *     8. rmdir()
 *     9. rm()
 *    10. recursive deletion
 *    11. directory traversal
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
 * 2. Current directory
 * ============================================================
 *
 * __dirname contains the directory of the current JavaScript
 * file when using CommonJS.
 *
 * ============================================================
 */

console.log("Current directory:", __dirname);

/*
 * ============================================================
 * 3. Create a directory
 * ============================================================
 *
 * Method:
 *
 *     fs.mkdir()
 *
 *
 * Syntax:
 *
 *     fs.mkdir(
 *       directoryPath,
 *       options,
 *       callback
 *     );
 *
 * ============================================================
 */

const basicDirectory = path.join(__dirname, "example-directory");

fs.mkdir(basicDirectory, (error) => {
  /*
   * If directory already exists, mkdir() can produce
   * an EEXIST error.
   */

  if (error) {
    if (error.code === "EEXIST") {
      console.log("\nDirectory already exists.");

      return;
    }

    console.error("mkdir() failed:", error.message);

    return;
  }

  console.log("\nDirectory created:", basicDirectory);
});

/*
 * ============================================================
 * 4. mkdirSync()
 * ============================================================
 *
 * Synchronous version.
 *
 * It blocks execution until the operation completes.
 *
 * ============================================================
 */

const syncDirectory = path.join(__dirname, "sync-directory");

try {
  fs.mkdirSync(syncDirectory);

  console.log("Synchronous directory created.");
} catch (error) {
  if (error.code === "EEXIST") {
    console.log("Sync directory already exists.");
  } else {
    console.error("mkdirSync() failed:", error.message);
  }
}

/*
 * ============================================================
 * 5. recursive: true
 * ============================================================
 *
 * Suppose we want:
 *
 *
 *     project/
 *       src/
 *         controllers/
 *           users/
 *
 *
 * If the parent directories don't exist, normal mkdir() may
 * fail.
 *
 *
 * Use:
 *
 *
 *     recursive: true
 *
 * ============================================================
 */

const nestedDirectory = path.join(
  __dirname,
  "project",
  "src",
  "controllers",
  "users",
);

fs.mkdir(
  nestedDirectory,
  {
    recursive: true,
  },
  (error) => {
    if (error) {
      console.error("\nNested directory creation failed:", error.message);

      return;
    }

    console.log("Nested directories created.");
  },
);

/*
 * ============================================================
 * 6. mkdirSync() with recursive
 * ============================================================
 */

const nestedSyncDirectory = path.join(__dirname, "backend", "src", "services");

try {
  fs.mkdirSync(nestedSyncDirectory, {
    recursive: true,
  });

  console.log("Nested sync directories created.");
} catch (error) {
  console.error("Nested sync directory creation failed:", error.message);
}

/*
 * ============================================================
 * 7. readdir()
 * ============================================================
 *
 * `readdir()` reads the contents of a directory.
 *
 *
 * Example:
 *
 *
 *     folder/
 *     ├── app.js
 *     ├── package.json
 *     └── src/
 *
 *
 * readdir() returns:
 *
 *
 *     [
 *       "app.js",
 *       "package.json",
 *       "src"
 *     ]
 *
 * ============================================================
 */

fs.readdir(__dirname, (error, files) => {
  if (error) {
    console.error("\nreaddir() failed:", error.message);

    return;
  }

  console.log("\nDirectory contents:");

  console.log(files);
});

/*
 * ============================================================
 * 8. readdirSync()
 * ============================================================
 */

try {
  const files = fs.readdirSync(__dirname);

  console.log("\nSync directory contents:");

  console.log(files);
} catch (error) {
  console.error("readdirSync() failed:", error.message);
}

/*
 * ============================================================
 * 9. readdir() with file types
 * ============================================================
 *
 * Normally readdir() gives us names only.
 *
 *
 * We can request directory entry objects:
 *
 *
 *     withFileTypes: true
 *
 * ============================================================
 */

fs.readdir(
  __dirname,
  {
    withFileTypes: true,
  },
  (error, entries) => {
    if (error) {
      console.error("\nReading directory entries failed:", error.message);

      return;
    }

    console.log("\nDirectory entries:");

    for (const entry of entries) {
      if (entry.isDirectory()) {
        console.log("DIRECTORY:", entry.name);
      } else if (entry.isFile()) {
        console.log("FILE:", entry.name);
      } else {
        console.log("OTHER:", entry.name);
      }
    }
  },
);

/*
 * ============================================================
 * 10. Dirent
 * ============================================================
 *
 * When:
 *
 *
 *     withFileTypes: true
 *
 *
 * Node.js returns `Dirent` objects.
 *
 *
 * Useful methods include:
 *
 *
 *     entry.isFile()
 *
 *     entry.isDirectory()
 *
 *     entry.isSymbolicLink()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Create a demo directory structure
 * ============================================================
 */

const demoDirectory = path.join(__dirname, "directory-demo");

const filesDirectory = path.join(demoDirectory, "files");

const nestedDemoDirectory = path.join(demoDirectory, "nested");

fs.mkdirSync(filesDirectory, {
  recursive: true,
});

fs.mkdirSync(nestedDemoDirectory, {
  recursive: true,
});

/*
 * Create sample files.
 */

fs.writeFileSync(path.join(filesDirectory, "one.txt"), "File one");

fs.writeFileSync(path.join(filesDirectory, "two.txt"), "File two");

fs.writeFileSync(path.join(nestedDemoDirectory, "three.txt"), "File three");

/*
 * ============================================================
 * 12. Read demo directory
 * ============================================================
 */

const demoEntries = fs.readdirSync(demoDirectory, {
  withFileTypes: true,
});

console.log("\nDemo directory:");

for (const entry of demoEntries) {
  console.log(entry.name, entry.isDirectory() ? "-> DIRECTORY" : "-> FILE");
}

/*
 * ============================================================
 * 13. Build full paths
 * ============================================================
 *
 * readdir() gives names:
 *
 *
 *     "one.txt"
 *
 *
 * But applications usually need:
 *
 *
 *     "C:\\...\\directory-demo\\files\\one.txt"
 *
 *
 * Use:
 *
 *
 *     path.join()
 *
 * ============================================================
 */

const names = fs.readdirSync(filesDirectory);

for (const name of names) {
  const fullPath = path.join(filesDirectory, name);

  console.log("Full path:", fullPath);
}

/*
 * ============================================================
 * 14. Recursive directory creation helper
 * ============================================================
 */

function createDirectory(directoryPath, callback) {
  fs.mkdir(
    directoryPath,
    {
      recursive: true,
    },
    callback,
  );
}

/*
 * ============================================================
 * 15. Use the helper
 * ============================================================
 */

const helperDirectory = path.join(__dirname, "helper", "nested", "directory");

createDirectory(helperDirectory, (error) => {
  if (error) {
    console.error("\nHelper directory creation failed:", error.message);

    return;
  }

  console.log("Helper directory created.");
});

/*
 * ============================================================
 * 16. rmdir()
 * ============================================================
 *
 * Historically Node.js provided:
 *
 *
 *     fs.rmdir()
 *
 *
 * for removing directories.
 *
 *
 * For modern code, prefer:
 *
 *
 *     fs.rm()
 *
 *
 * especially for recursive directory removal.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Remove an empty directory
 * ============================================================
 */

const removableDirectory = path.join(__dirname, "removable-directory");

fs.mkdirSync(removableDirectory, {
  recursive: true,
});

fs.rmdir(removableDirectory, (error) => {
  if (error) {
    console.error("\nrmdir() failed:", error.message);

    return;
  }

  console.log("Empty directory removed with rmdir().");
});

/*
 * ============================================================
 * 18. rm() for directories
 * ============================================================
 *
 * Modern approach:
 *
 *
 *     fs.rm()
 *
 *
 * ============================================================
 */

const rmDirectory = path.join(__dirname, "rm-directory");

fs.mkdirSync(path.join(rmDirectory, "nested"), {
  recursive: true,
});

fs.writeFileSync(
  path.join(rmDirectory, "nested", "file.txt"),
  "Temporary file",
);

fs.rm(
  rmDirectory,
  {
    recursive: true,
    force: true,
  },
  (error) => {
    if (error) {
      console.error("\nrm() directory deletion failed:", error.message);

      return;
    }

    console.log("Directory removed recursively with rm().");
  },
);

/*
 * ============================================================
 * 19. Recursive directory traversal
 * ============================================================
 *
 * A very important backend concept.
 *
 * We can recursively visit:
 *
 *
 *     directory
 *       ↓
 *     files
 *       ↓
 *     subdirectories
 *       ↓
 *     more files
 *
 * ============================================================
 */

function listDirectory(directoryPath, level = 0) {
  const entries = fs.readdirSync(directoryPath, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const indentation = "  ".repeat(level);

    const fullPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      console.log(`${indentation}[DIR] ${entry.name}`);

      listDirectory(fullPath, level + 1);
    } else {
      console.log(`${indentation}[FILE] ${entry.name}`);
    }
  }
}

/*
 * ============================================================
 * 20. Traverse demo directory
 * ============================================================
 */

console.log("\nRecursive directory tree:");

listDirectory(demoDirectory);

/*
 * ============================================================
 * 21. Example output
 * ============================================================
 *
 *
 *     Recursive directory tree:
 *
 *     [DIR] files
 *       [FILE] one.txt
 *       [FILE] two.txt
 *     [DIR] nested
 *       [FILE] three.txt
 *
 *
 * This pattern is useful for:
 *
 *
 *     file managers
 *     backup systems
 *     build tools
 *     upload processing
 *     CLI tools
 *     directory scanners
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Async recursive traversal concept
 * ============================================================
 *
 * For large directory trees, synchronous recursion can block
 * the Node.js event loop.
 *
 *
 * A production implementation can use:
 *
 *
 *     fs.promises.readdir()
 *
 *
 * together with:
 *
 *
 *     async/await
 *
 *
 * We will cover this properly in:
 *
 *
 *     06_fs/promises.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Check whether directory exists
 * ============================================================
 */

const checkDirectory = path.join(__dirname, "check-directory");

if (fs.existsSync(checkDirectory)) {
  console.log("\nDirectory exists.");
} else {
  console.log("\nDirectory does not exist.");
}

/*
 * ============================================================
 * 24. Better approach: access()
 * ============================================================
 *
 * Instead of relying on existsSync() for application logic,
 * you can perform the operation you actually need and handle
 * its error.
 *
 *
 * Filesystem state can change between a separate check and
 * the actual operation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Directory structure example
 * ============================================================
 *
 *
 *     backend/
 *
 *     ├── src/
 *     │   ├── controllers/
 *     │   ├── services/
 *     │   ├── models/
 *     │   └── routes/
 *     │
 *     ├── tests/
 *     │
 *     ├── uploads/
 *     │
 *     └── logs/
 *
 *
 * Node.js filesystem APIs allow your application to create,
 * inspect, modify, and remove these directories.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Important options
 * ============================================================
 *
 *
 * mkdir():
 *
 *
 *     {
 *       recursive: true
 *     }
 *
 *
 * readdir():
 *
 *
 *     {
 *       withFileTypes: true
 *     }
 *
 *
 * rm():
 *
 *
 *     {
 *       recursive: true,
 *       force: true
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. mkdir() vs mkdirSync()
 * ============================================================
 *
 *
 * mkdir()
 *
 *     asynchronous
 *     does not block while waiting
 *
 *
 * mkdirSync()
 *
 *     synchronous
 *     blocks execution
 *
 *
 * In Node.js servers, asynchronous APIs are generally
 * preferred for normal request processing.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. readdir() vs readdirSync()
 * ============================================================
 *
 *
 * readdir()
 *
 *     asynchronous
 *
 *
 * readdirSync()
 *
 *     synchronous
 *
 *
 * For large directories, avoid unnecessarily blocking the
 * event loop with synchronous filesystem operations.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Directory mental model
 * ============================================================
 *
 *
 * CREATE
 *
 *     mkdir()
 *
 *
 * READ
 *
 *     readdir()
 *
 *
 * REMOVE
 *
 *     rm()
 *
 *
 * INSPECT
 *
 *     Dirent
 *
 *
 * TRAVERSE
 *
 *     recursive function
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * Create:
 *
 *     fs.mkdir(
 *       directory,
 *       callback
 *     );
 *
 *
 * Create nested:
 *
 *     fs.mkdir(
 *       directory,
 *       {
 *         recursive: true
 *       },
 *       callback
 *     );
 *
 *
 * Read:
 *
 *     fs.readdir(
 *       directory,
 *       callback
 *     );
 *
 *
 * Read with types:
 *
 *     fs.readdir(
 *       directory,
 *       {
 *         withFileTypes: true
 *       },
 *       callback
 *     );
 *
 *
 * Remove:
 *
 *     fs.rm(
 *       directory,
 *       {
 *         recursive: true,
 *         force: true
 *       },
 *       callback
 *     );
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     mkdir()
 *         -> create directory
 *
 *     readdir()
 *         -> read directory contents
 *
 *     Dirent
 *         -> identify file/directory
 *
 *     rm()
 *         -> remove file/directory
 *
 *     recursive: true
 *         -> create nested directories OR remove trees
 *
 * ============================================================
 */
