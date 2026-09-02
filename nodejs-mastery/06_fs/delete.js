/**
 * ============================================================
 * Node.js File System Module - Delete Files & Directories
 * ============================================================
 *
 * File: delete.js
 *
 * Built-in module:
 *
 *     node:fs
 *
 * ============================================================
 *
 * In this file we learn:
 *
 *     1. fs.unlink()
 *     2. fs.unlinkSync()
 *     3. fs.rm()
 *     4. fs.rmSync()
 *     5. Deleting files
 *     6. Deleting directories
 *     7. Recursive deletion
 *     8. Force deletion
 *     9. Error handling
 *    10. Safe deletion patterns
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
 * 2. What does "delete" mean in Node.js?
 * ============================================================
 *
 * Node.js provides filesystem APIs for removing filesystem
 * entries.
 *
 *
 * For files:
 *
 *
 *     fs.unlink()
 *
 *
 * For files/directories:
 *
 *
 *     fs.rm()
 *
 *
 * Modern Node.js applications should generally use `rm()`
 * when they need one API that can handle both files and
 * directories.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Create a sample file
 * ============================================================
 *
 * We create this file so the example can be run safely.
 * ============================================================
 */

const filePath = path.join(__dirname, "delete-example.txt");

fs.writeFileSync(filePath, "This file will be deleted.", "utf8");

/*
 * ============================================================
 * 4. fs.unlink()
 * ============================================================
 *
 * `unlink()` removes a file.
 *
 *
 * Syntax:
 *
 *
 *     fs.unlink(
 *       filePath,
 *       callback
 *     );
 *
 *
 * It is asynchronous.
 *
 * ============================================================
 */

fs.unlink(filePath, (error) => {
  if (error) {
    console.error("Delete failed:", error.message);

    return;
  }

  console.log("\nFile deleted successfully.");
});

/*
 * ============================================================
 * 5. Important:
 *
 * unlink() is primarily for files.
 * ============================================================
 *
 * Do not use:
 *
 *
 *     fs.unlink()
 *
 *
 * as your general-purpose directory removal API.
 *
 *
 * For directories, use:
 *
 *
 *     fs.rm()
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. fs.unlinkSync()
 * ============================================================
 *
 * Synchronous version of unlink().
 *
 *
 * It blocks execution until deletion completes.
 *
 * ============================================================
 */

const syncFilePath = path.join(__dirname, "delete-sync.txt");

fs.writeFileSync(syncFilePath, "Synchronous deletion example.", "utf8");

try {
  fs.unlinkSync(syncFilePath);

  console.log("Synchronous file deletion successful.");
} catch (error) {
  console.error("Synchronous deletion failed:", error.message);
}

/*
 * ============================================================
 * 7. fs.rm()
 * ============================================================
 *
 * `fs.rm()` is the modern removal API.
 *
 *
 * It can remove:
 *
 *
 *     files
 *     empty directories
 *     non-empty directories when recursive is enabled
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Delete a file using rm()
 * ============================================================
 */

const rmFilePath = path.join(__dirname, "rm-file.txt");

fs.writeFileSync(rmFilePath, "Deleted using fs.rm().", "utf8");

fs.rm(rmFilePath, (error) => {
  if (error) {
    console.error("\nrm() file deletion failed:", error.message);

    return;
  }

  console.log("File deleted using fs.rm().");
});

/*
 * ============================================================
 * 9. Delete an empty directory
 * ============================================================
 */

const emptyDirectory = path.join(__dirname, "empty-directory");

fs.mkdirSync(emptyDirectory, {
  recursive: true,
});

fs.rm(emptyDirectory, (error) => {
  if (error) {
    console.error("\nDirectory deletion failed:", error.message);

    return;
  }

  console.log("Empty directory deleted.");
});

/*
 * ============================================================
 * 10. Recursive deletion
 * ============================================================
 *
 * Suppose we have:
 *
 *
 *     temporary/
 *     ├── file1.txt
 *     ├── file2.txt
 *     └── nested/
 *         └── file3.txt
 *
 *
 * To remove the complete directory:
 *
 *
 *     fs.rm(
 *
 *       directory,
 *
 *       {
 *         recursive: true
 *       },
 *
 *       callback
 *
 *     );
 *
 * ============================================================
 */

const temporaryDirectory = path.join(__dirname, "temporary");

const nestedDirectory = path.join(temporaryDirectory, "nested");

fs.mkdirSync(nestedDirectory, {
  recursive: true,
});

fs.writeFileSync(path.join(temporaryDirectory, "file1.txt"), "File 1");

fs.writeFileSync(path.join(temporaryDirectory, "file2.txt"), "File 2");

fs.writeFileSync(path.join(nestedDirectory, "file3.txt"), "File 3");

/*
 * Now remove the complete directory tree.
 */

fs.rm(
  temporaryDirectory,
  {
    recursive: true,
  },
  (error) => {
    if (error) {
      console.error("\nRecursive deletion failed:", error.message);

      return;
    }

    console.log("Directory tree deleted recursively.");
  },
);

/*
 * ============================================================
 * 11. recursive: true
 * ============================================================
 *
 * Without:
 *
 *
 *     recursive: true
 *
 *
 * deleting a non-empty directory will fail.
 *
 *
 * With:
 *
 *
 *     {
 *       recursive: true
 *     }
 *
 *
 * Node.js removes the directory contents and then the
 * directory itself.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. force: true
 * ============================================================
 *
 * `force` tells Node.js to ignore certain errors, such as
 * the target not existing.
 *
 *
 * Example:
 *
 *
 *     {
 *       force: true
 *     }
 *
 * ============================================================
 */

const forceDeletePath = path.join(__dirname, "maybe-exists.txt");

fs.rm(
  forceDeletePath,
  {
    force: true,
  },
  (error) => {
    if (error) {
      console.error("Force deletion failed:", error.message);

      return;
    }

    console.log("\nForce delete completed.");
  },
);

/*
 * ============================================================
 * 13. recursive + force
 * ============================================================
 *
 * A common cleanup configuration is:
 *
 *
 *     {
 *       recursive: true,
 *       force: true
 *     }
 *
 *
 * This is useful for temporary directories and build output.
 *
 * ============================================================
 */

const buildDirectory = path.join(__dirname, "build");

fs.mkdirSync(path.join(buildDirectory, "assets"), {
  recursive: true,
});

fs.writeFileSync(
  path.join(buildDirectory, "assets", "app.js"),
  "console.log('build');",
);

fs.rm(
  buildDirectory,
  {
    recursive: true,
    force: true,
  },
  (error) => {
    if (error) {
      console.error("\nBuild cleanup failed:", error.message);

      return;
    }

    console.log("Build directory cleaned.");
  },
);

/*
 * ============================================================
 * 14. fs.rmSync()
 * ============================================================
 *
 * Synchronous version of rm().
 *
 * ============================================================
 */

const syncDirectory = path.join(__dirname, "sync-directory");

fs.mkdirSync(path.join(syncDirectory, "nested"), {
  recursive: true,
});

fs.writeFileSync(
  path.join(syncDirectory, "nested", "file.txt"),
  "Sync deletion example.",
);

try {
  fs.rmSync(syncDirectory, {
    recursive: true,
    force: true,
  });

  console.log("Synchronous directory deletion successful.");
} catch (error) {
  console.error("Sync directory deletion failed:", error.message);
}

/*
 * ============================================================
 * 15. Error: file does not exist
 * ============================================================
 */

const missingFile = path.join(__dirname, "this-file-does-not-exist.txt");

fs.unlink(missingFile, (error) => {
  if (error) {
    console.error("\nExpected missing-file error:");

    console.error("Code:", error.code);

    console.error("Message:", error.message);

    return;
  }
});

/*
 * ============================================================
 * 16. ENOENT
 * ============================================================
 *
 * A missing file commonly produces:
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
 * Instead of crashing your application, handle the error.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Safe deletion helper
 * ============================================================
 */

function deleteFile(filePath, callback) {
  fs.unlink(filePath, (error) => {
    if (error) {
      callback(error);

      return;
    }

    callback(null);
  });
}

/*
 * ============================================================
 * 18. Use the helper
 * ============================================================
 */

const helperFile = path.join(__dirname, "helper-delete.txt");

fs.writeFileSync(helperFile, "Delete me.");

deleteFile(helperFile, (error) => {
  if (error) {
    console.error("\nHelper deletion failed:", error.message);

    return;
  }

  console.log("Helper deleted file successfully.");
});

/*
 * ============================================================
 * 19. Safe removal helper using rm()
 * ============================================================
 */

function remove(targetPath, callback) {
  fs.rm(
    targetPath,
    {
      recursive: true,
      force: true,
    },
    callback,
  );
}

/*
 * ============================================================
 * 20. Use generic remove helper
 * ============================================================
 */

const cleanupDirectory = path.join(__dirname, "cleanup");

fs.mkdirSync(path.join(cleanupDirectory, "cache"), {
  recursive: true,
});

fs.writeFileSync(
  path.join(cleanupDirectory, "cache", "data.txt"),
  "Temporary cache data.",
);

remove(cleanupDirectory, (error) => {
  if (error) {
    console.error("\nCleanup failed:", error.message);

    return;
  }

  console.log("Cleanup completed.");
});

/*
 * ============================================================
 * 21. Practical example: delete temporary upload
 * ============================================================
 *
 * Imagine a server temporarily stores:
 *
 *
 *     uploads/tmp/avatar.png
 *
 *
 * After processing it, we can remove it.
 *
 * ============================================================
 */

const temporaryUpload = path.join(__dirname, "tmp-avatar.png");

fs.writeFileSync(temporaryUpload, "Temporary upload content.");

fs.rm(
  temporaryUpload,
  {
    force: true,
  },
  (error) => {
    if (error) {
      console.error("Temporary upload cleanup failed:", error.message);

      return;
    }

    console.log("Temporary upload removed.");
  },
);

/*
 * ============================================================
 * 22. Practical example: cleanup build folder
 * ============================================================
 *
 * Build systems commonly generate:
 *
 *
 *     dist/
 *     build/
 *     .cache/
 *
 *
 * These folders can be removed before creating a fresh build.
 *
 * ============================================================
 */

function cleanBuild(directory, callback) {
  fs.rm(
    directory,
    {
      recursive: true,
      force: true,
    },
    callback,
  );
}

/*
 * Example:
 *
 *
 * cleanBuild(
 *
 *   path.join(__dirname, "dist"),
 *
 *   (error) => {
 *
 *     if (error) {
 *
 *       console.error(error);
 *
 *       return;
 *
 *     }
 *
 *     console.log("Build cleaned.");
 *
 *   }
 *
 * );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Why force can be useful
 * ============================================================
 *
 * Suppose cleanup runs repeatedly.
 *
 *
 * First run:
 *
 *
 *     cache/
 *
 *     ↓
 *
 *     deleted
 *
 *
 * Second run:
 *
 *
 *     cache/
 *
 *     does not exist
 *
 *
 * With:
 *
 *
 *     force: true
 *
 *
 * the second cleanup can still succeed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Dangerous recursive deletion
 * ============================================================
 *
 * BE VERY CAREFUL with:
 *
 *
 *     recursive: true
 *
 *
 * especially when the path comes from user input.
 *
 *
 * Never blindly allow a user to provide an arbitrary filesystem
 * path and then pass it to:
 *
 *
 *     fs.rm(
 *
 *       userProvidedPath,
 *
 *       {
 *         recursive: true
 *       }
 *
 *     );
 *
 *
 * This could destroy important files.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Safer application pattern
 * ============================================================
 *
 * Instead of allowing arbitrary paths:
 *
 *
 *     user input
 *          ↓
 *     validate identifier
 *          ↓
 *     resolve inside allowed directory
 *          ↓
 *     delete
 *
 *
 * Example concept:
 *
 *
 *     uploads/
 *         ↓
 *     userId/
 *         ↓
 *     validated filename
 *
 *
 * Never treat raw user input as a trusted filesystem path.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. unlink() vs rm()
 * ============================================================
 *
 *
 * fs.unlink()
 *
 *     Primarily removes files.
 *
 *
 * fs.unlinkSync()
 *
 *     Synchronous file removal.
 *
 *
 * fs.rm()
 *
 *     Modern general removal API.
 *
 *     Can remove files and directories.
 *
 *
 * fs.rmSync()
 *
 *     Synchronous version of rm().
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. rmdir()
 * ============================================================
 *
 * Node.js also historically provided:
 *
 *
 *     fs.rmdir()
 *
 *
 * for removing directories.
 *
 *
 * For modern Node.js code, prefer:
 *
 *
 *     fs.rm()
 *
 *
 * especially when you need recursive directory removal.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Production recommendation
 * ============================================================
 *
 * Prefer asynchronous:
 *
 *
 *     fs.unlink()
 *
 *     fs.rm()
 *
 *
 * in normal server request handling.
 *
 *
 * Use synchronous versions only when their blocking behavior
 * is appropriate.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Final mental model
 * ============================================================
 *
 *
 * Delete file:
 *
 *     file.txt
 *        ↓
 *     unlink()
 *        ↓
 *     removed
 *
 *
 * Delete directory:
 *
 *     folder/
 *        ↓
 *     rm()
 *        ↓
 *     removed
 *
 *
 * Delete directory tree:
 *
 *     rm(
 *
 *       folder,
 *
 *       {
 *         recursive: true
 *       }
 *
 *     )
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * Delete file:
 *
 *     fs.unlink(
 *
 *       filePath,
 *
 *       callback,
 *
 *     );
 *
 *
 * Delete file synchronously:
 *
 *     fs.unlinkSync(
 *
 *       filePath,
 *
 *     );
 *
 *
 * Delete file/directory:
 *
 *     fs.rm(
 *
 *       targetPath,
 *
 *       callback,
 *
 *     );
 *
 *
 * Recursive deletion:
 *
 *     fs.rm(
 *
 *       directory,
 *
 *       {
 *         recursive: true
 *       },
 *
 *       callback,
 *
 *     );
 *
 *
 * Force deletion:
 *
 *     fs.rm(
 *
 *       target,
 *
 *       {
 *         recursive: true,
 *         force: true
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
 *     unlink()
 *         -> remove file
 *
 *     rm()
 *         -> remove file or directory
 *
 *     recursive: true
 *         -> remove directory tree
 *
 *     force: true
 *         -> tolerate missing targets
 *
 *     Sync APIs
 *         -> block execution
 *
 * ============================================================
 */
