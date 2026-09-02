/**
 * ============================================================
 * Node.js File System - fs/promises
 * ============================================================
 *
 * File:
 *
 *     06_fs/promises.js
 *
 * ============================================================
 *
 * Instead of callback-based APIs:
 *
 *     fs.readFile(path, callback)
 *
 * Node.js provides Promise-based APIs:
 *
 *     fsPromises.readFile(path)
 *
 *
 * This allows us to write:
 *
 *     const data = await fs.readFile(path);
 *
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. node:fs/promises
 *     2. Promises
 *     3. async/await
 *     4. readFile()
 *     5. writeFile()
 *     6. appendFile()
 *     7. mkdir()
 *     8. readdir()
 *     9. rename()
 *    10. rm()
 *    11. stat()
 *    12. access()
 *    13. copyFile()
 *    14. error handling
 *    15. sequential operations
 *    16. Promise.all()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Import fs/promises
 * ============================================================
 *
 * `node:fs/promises` provides Promise-based filesystem APIs.
 *
 * ============================================================
 */

const fs = require("node:fs/promises");

const path = require("node:path");

/*
 * ============================================================
 * 2. Why fs/promises?
 * ============================================================
 *
 * Traditional callback style:
 *
 *
 *     fs.readFile(
 *
 *       file,
 *
 *       "utf8",
 *
 *       (error, data) => {
 *
 *         ...
 *
 *       }
 *
 *     );
 *
 *
 * Promise style:
 *
 *
 *     const data =
 *       await fs.readFile(
 *         file,
 *         "utf8"
 *       );
 *
 *
 * Promise-based code works naturally with:
 *
 *
 *     async
 *     await
 *     try
 *     catch
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Create a working directory
 * ============================================================
 */

const demoDirectory = path.join(__dirname, "promises-demo");

async function createDemoDirectory() {
  await fs.mkdir(demoDirectory, {
    recursive: true,
  });

  console.log("Demo directory ready:", demoDirectory);
}

/*
 * ============================================================
 * 4. async function
 * ============================================================
 *
 * Any function containing `await` must normally be declared
 * with:
 *
 *
 *     async
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. writeFile()
 * ============================================================
 */

async function writeExample() {
  const filePath = path.join(demoDirectory, "example.txt");

  await fs.writeFile(filePath, "Hello from fs/promises!\n", "utf8");

  console.log("File written:", filePath);
}

/*
 * ============================================================
 * 6. appendFile()
 * ============================================================
 */

async function appendExample() {
  const filePath = path.join(demoDirectory, "example.txt");

  await fs.appendFile(filePath, "This line was appended.\n", "utf8");

  console.log("Content appended.");
}

/*
 * ============================================================
 * 7. readFile()
 * ============================================================
 */

async function readExample() {
  const filePath = path.join(demoDirectory, "example.txt");

  const content = await fs.readFile(filePath, "utf8");

  console.log("\nFile contents:");

  console.log(content);
}

/*
 * ============================================================
 * 8. Important: encoding
 * ============================================================
 *
 * Without:
 *
 *
 *     "utf8"
 *
 *
 * readFile() returns a Buffer.
 *
 *
 * Example:
 *
 *
 *     const data =
 *       await fs.readFile(
 *         filePath
 *       );
 *
 *
 * `data` is a Buffer.
 *
 *
 * With:
 *
 *
 *     await fs.readFile(
 *       filePath,
 *       "utf8"
 *     );
 *
 *
 * `data` is a string.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. mkdir()
 * ============================================================
 */

async function directoryExample() {
  const nestedDirectory = path.join(
    demoDirectory,
    "src",
    "controllers",
    "users",
  );

  await fs.mkdir(nestedDirectory, {
    recursive: true,
  });

  console.log("\nNested directories created.");
}

/*
 * ============================================================
 * 10. readdir()
 * ============================================================
 */

async function readDirectoryExample() {
  const entries = await fs.readdir(demoDirectory);

  console.log("\nDirectory contents:");

  console.log(entries);
}

/*
 * ============================================================
 * 11. readdir() with Dirent
 * ============================================================
 */

async function directoryEntriesExample() {
  const entries = await fs.readdir(demoDirectory, {
    withFileTypes: true,
  });

  console.log("\nDirectory entries:");

  for (const entry of entries) {
    if (entry.isDirectory()) {
      console.log("DIRECTORY:", entry.name);
    } else if (entry.isFile()) {
      console.log("FILE:", entry.name);
    }
  }
}

/*
 * ============================================================
 * 12. rename()
 * ============================================================
 */

async function renameExample() {
  const oldPath = path.join(demoDirectory, "old-name.txt");

  const newPath = path.join(demoDirectory, "new-name.txt");

  await fs.writeFile(oldPath, "Rename example.", "utf8");

  await fs.rename(oldPath, newPath);

  console.log("\nFile renamed successfully.");
}

/*
 * ============================================================
 * 13. copyFile()
 * ============================================================
 *
 * Copies a file from one location to another.
 *
 * ============================================================
 */

async function copyExample() {
  const source = path.join(demoDirectory, "source.txt");

  const destination = path.join(demoDirectory, "copy.txt");

  await fs.writeFile(source, "This file will be copied.", "utf8");

  await fs.copyFile(source, destination);

  console.log("\nFile copied successfully.");
}

/*
 * ============================================================
 * 14. stat()
 * ============================================================
 *
 * `stat()` gives information about a filesystem entry.
 *
 * ============================================================
 */

async function statExample() {
  const filePath = path.join(demoDirectory, "example.txt");

  const stats = await fs.stat(filePath);

  console.log("\nFile information:");

  console.log("Is file:", stats.isFile());

  console.log("Is directory:", stats.isDirectory());

  console.log("Size:", stats.size, "bytes");

  console.log("Created:", stats.birthtime);

  console.log("Modified:", stats.mtime);
}

/*
 * ============================================================
 * 15. access()
 * ============================================================
 *
 * access() checks whether the current process can access a
 * filesystem path.
 *
 * ============================================================
 */

async function accessExample() {
  const filePath = path.join(demoDirectory, "example.txt");

  try {
    await fs.access(filePath);

    console.log("\nFile is accessible.");
  } catch (error) {
    console.error("File is not accessible:", error.message);
  }
}

/*
 * ============================================================
 * 16. rm()
 * ============================================================
 *
 * Remove a file or directory.
 *
 * ============================================================
 */

async function removeExample() {
  const temporaryDirectory = path.join(demoDirectory, "temporary");

  await fs.mkdir(path.join(temporaryDirectory, "nested"), {
    recursive: true,
  });

  await fs.writeFile(
    path.join(temporaryDirectory, "nested", "temp.txt"),
    "Temporary data.",
    "utf8",
  );

  await fs.rm(temporaryDirectory, {
    recursive: true,
    force: true,
  });

  console.log("\nTemporary directory removed.");
}

/*
 * ============================================================
 * 17. unlink()
 * ============================================================
 *
 * Remove a file.
 *
 * ============================================================
 */

async function unlinkExample() {
  const filePath = path.join(demoDirectory, "delete-me.txt");

  await fs.writeFile(filePath, "This file will be deleted.", "utf8");

  await fs.unlink(filePath);

  console.log("File deleted with unlink().");
}

/*
 * ============================================================
 * 18. Sequential operations
 * ============================================================
 *
 * This is one of the biggest benefits of async/await.
 *
 *
 * We can write filesystem operations in the order they
 * logically happen.
 *
 * ============================================================
 */

async function sequentialExample() {
  const filePath = path.join(demoDirectory, "sequence.txt");

  await fs.writeFile(filePath, "Step 1\n", "utf8");

  await fs.appendFile(filePath, "Step 2\n", "utf8");

  await fs.appendFile(filePath, "Step 3\n", "utf8");

  const content = await fs.readFile(filePath, "utf8");

  console.log("\nSequential result:");

  console.log(content);
}

/*
 * ============================================================
 * 19. try/catch
 * ============================================================
 *
 * Promise-based filesystem methods reject their Promise when
 * an operation fails.
 *
 *
 * `try/catch` handles the error when using await.
 *
 * ============================================================
 */

async function errorHandlingExample() {
  const missingFile = path.join(demoDirectory, "does-not-exist.txt");

  try {
    await fs.readFile(missingFile, "utf8");
  } catch (error) {
    console.log("\nExpected filesystem error:");

    console.log("Code:", error.code);

    console.log("Message:", error.message);
  }
}

/*
 * ============================================================
 * 20. ENOENT
 * ============================================================
 *
 * A missing file commonly results in:
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
 * ============================================================
 */

/*
 * ============================================================
 * 21. Reusable read helper
 * ============================================================
 */

async function readTextFile(filePath) {
  const content = await fs.readFile(filePath, "utf8");

  return content;
}

/*
 * ============================================================
 * 22. Reusable write helper
 * ============================================================
 */

async function writeTextFile(filePath, content) {
  await fs.writeFile(filePath, content, "utf8");
}

/*
 * ============================================================
 * 23. Reusable append helper
 * ============================================================
 */

async function appendTextFile(filePath, content) {
  await fs.appendFile(filePath, content, "utf8");
}

/*
 * ============================================================
 * 24. Promise.all()
 * ============================================================
 *
 * Sometimes multiple independent filesystem operations can
 * happen concurrently.
 *
 *
 * Example:
 *
 *     write A
 *     write B
 *     write C
 *
 *
 * If B does not depend on A:
 *
 *
 *     Promise.all()
 *
 *
 * can be useful.
 *
 * ============================================================
 */

async function parallelExample() {
  const fileA = path.join(demoDirectory, "parallel-a.txt");

  const fileB = path.join(demoDirectory, "parallel-b.txt");

  const fileC = path.join(demoDirectory, "parallel-c.txt");

  await Promise.all([
    fs.writeFile(fileA, "File A", "utf8"),

    fs.writeFile(fileB, "File B", "utf8"),

    fs.writeFile(fileC, "File C", "utf8"),
  ]);

  console.log("\nParallel writes completed.");
}

/*
 * ============================================================
 * 25. Promise.all() vs sequential await
 * ============================================================
 *
 *
 * Sequential:
 *
 *
 *     await writeA();
 *
 *     await writeB();
 *
 *     await writeC();
 *
 *
 * Roughly:
 *
 *
 *     A → B → C
 *
 *
 * ------------------------------------------------------------
 *
 *
 * Concurrent:
 *
 *
 *     await Promise.all([
 *
 *       writeA(),
 *       writeB(),
 *       writeC(),
 *
 *     ]);
 *
 *
 * Roughly:
 *
 *
 *     A
 *     B
 *     C
 *       ↓
 *     wait for all
 *
 *
 * Use concurrency only when the operations are independent.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Important: Don't parallelize dependent operations
 * ============================================================
 *
 * BAD:
 *
 *
 *     Promise.all([
 *
 *       createDirectory(),
 *
 *       writeFileInsideDirectory(),
 *
 *     ]);
 *
 *
 * The file operation may run before the directory exists.
 *
 *
 * Correct:
 *
 *
 *     await createDirectory();
 *
 *     await writeFile();
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Recursive directory traversal
 * ============================================================
 */

async function listDirectoryRecursive(directoryPath, level = 0) {
  const entries = await fs.readdir(directoryPath, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const indentation = "  ".repeat(level);

    const fullPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      console.log(`${indentation}[DIR] ${entry.name}`);

      await listDirectoryRecursive(fullPath, level + 1);
    } else {
      console.log(`${indentation}[FILE] ${entry.name}`);
    }
  }
}

/*
 * ============================================================
 * 28. Run recursive traversal
 * ============================================================
 */

async function traversalExample() {
  console.log("\nRecursive directory tree:");

  await listDirectoryRecursive(demoDirectory);
}

/*
 * ============================================================
 * 29. Main function
 * ============================================================
 *
 * Instead of placing many awaits at the top level, we can
 * organize the example into a main() function.
 *
 * ============================================================
 */

async function main() {
  /*
   * Create the demo directory.
   */

  await createDemoDirectory();

  /*
   * Write file.
   */

  await writeExample();

  /*
   * Append data.
   */

  await appendExample();

  /*
   * Read file.
   */

  await readExample();

  /*
   * Create nested directories.
   */

  await directoryExample();

  /*
   * Read directory.
   */

  await readDirectoryExample();

  /*
   * Read directory entries.
   */

  await directoryEntriesExample();

  /*
   * Rename file.
   */

  await renameExample();

  /*
   * Copy file.
   */

  await copyExample();

  /*
   * Get file information.
   */

  await statExample();

  /*
   * Check access.
   */

  await accessExample();

  /*
   * Sequential operations.
   */

  await sequentialExample();

  /*
   * Error handling.
   */

  await errorHandlingExample();

  /*
   * Independent parallel operations.
   */

  await parallelExample();

  /*
   * Recursive traversal.
   */

  await traversalExample();

  /*
   * Delete temporary data.
   */

  await removeExample();

  /*
   * Delete a file.
   */

  await unlinkExample();

  console.log("\nAll fs/promises examples completed.");
}

/*
 * ============================================================
 * 30. Start main()
 * ============================================================
 *
 * `main()` returns a Promise.
 *
 * We handle unexpected errors at the top level.
 *
 * ============================================================
 */

main().catch((error) => {
  console.error("\nUnexpected error:", error);

  process.exitCode = 1;
});

/*
 * ============================================================
 * 31. Why process.exitCode?
 * ============================================================
 *
 * Instead of:
 *
 *
 *     process.exit(1)
 *
 *
 * we can use:
 *
 *
 *     process.exitCode = 1;
 *
 *
 * This allows Node.js to finish pending work before exiting.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. fs/promises API summary
 * ============================================================
 *
 *
 * READ
 *
 *     fs.readFile()
 *
 *
 * WRITE
 *
 *     fs.writeFile()
 *
 *
 * APPEND
 *
 *     fs.appendFile()
 *
 *
 * CREATE DIRECTORY
 *
 *     fs.mkdir()
 *
 *
 * READ DIRECTORY
 *
 *     fs.readdir()
 *
 *
 * RENAME / MOVE
 *
 *     fs.rename()
 *
 *
 * COPY
 *
 *     fs.copyFile()
 *
 *
 * DELETE FILE
 *
 *     fs.unlink()
 *
 *
 * DELETE FILE/DIRECTORY
 *
 *     fs.rm()
 *
 *
 * INFORMATION
 *
 *     fs.stat()
 *
 *
 * ACCESS CHECK
 *
 *     fs.access()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Callback API vs Promise API
 * ============================================================
 *
 *
 * CALLBACK:
 *
 *
 *     fs.readFile(
 *
 *       file,
 *
 *       "utf8",
 *
 *       (
 *         error,
 *         data,
 *       ) => {
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
 * ------------------------------------------------------------
 *
 *
 * PROMISE:
 *
 *
 *     try {
 *
 *       const data =
 *         await fs.readFile(
 *           file,
 *           "utf8",
 *         );
 *
 *       console.log(data);
 *
 *     } catch (error) {
 *
 *       console.error(error);
 *
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Why modern Node.js uses async/await
 * ============================================================
 *
 * async/await makes asynchronous code easier to:
 *
 *
 *     read
 *     write
 *     debug
 *     compose
 *     handle errors
 *
 *
 * You will use this pattern constantly in backend development:
 *
 *
 *     async function controller(
 *       request,
 *       response,
 *     ) {
 *
 *       const user =
 *         await User.findById(
 *           request.params.id,
 *         );
 *
 *       ...
 *
 *     }
 *
 *
 * The same mental model applies to filesystem operations,
 * database queries, HTTP calls, Redis operations, etc.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. IMPORTANT: await does NOT block the Node.js event loop
 * ============================================================
 *
 * This is a very important concept.
 *
 *
 *     await fs.readFile(...)
 *
 *
 * does NOT mean:
 *
 *
 *     "Freeze the entire Node.js server."
 *
 *
 * Instead, the async operation is started and the async
 * function pauses until the Promise settles.
 *
 *
 * Node.js can continue handling other work while the
 * filesystem operation is pending.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. FINAL MENTAL MODEL
 * ============================================================
 *
 *
 * node:fs/promises
 *
 *          ↓
 *
 *      Promise API
 *
 *          ↓
 *
 *      async / await
 *
 *          ↓
 *
 *     try / catch
 *
 *          ↓
 *
 *    readable async code
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * Import:
 *
 *     const fs =
 *       require("node:fs/promises");
 *
 *
 * Read:
 *
 *     const data =
 *       await fs.readFile(
 *         file,
 *         "utf8",
 *       );
 *
 *
 * Write:
 *
 *     await fs.writeFile(
 *       file,
 *       data,
 *       "utf8",
 *     );
 *
 *
 * Append:
 *
 *     await fs.appendFile(
 *       file,
 *       data,
 *       "utf8",
 *     );
 *
 *
 * Create directory:
 *
 *     await fs.mkdir(
 *       directory,
 *       {
 *         recursive: true
 *       },
 *     );
 *
 *
 * Read directory:
 *
 *     const files =
 *       await fs.readdir(
 *         directory,
 *       );
 *
 *
 * Rename:
 *
 *     await fs.rename(
 *       oldPath,
 *       newPath,
 *     );
 *
 *
 * Copy:
 *
 *     await fs.copyFile(
 *       source,
 *       destination,
 *     );
 *
 *
 * Delete:
 *
 *     await fs.rm(
 *       target,
 *       {
 *         recursive: true,
 *         force: true
 *       },
 *     );
 *
 *
 * File information:
 *
 *     const stats =
 *       await fs.stat(
 *         file,
 *       );
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     node:fs
 *         -> callback + sync APIs
 *
 *     node:fs/promises
 *         -> Promise APIs
 *
 *     async/await
 *         -> clean asynchronous code
 *
 *     try/catch
 *         -> Promise error handling
 *
 *     Promise.all()
 *         -> concurrent independent operations
 *
 * ============================================================
 */
