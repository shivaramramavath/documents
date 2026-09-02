/**
 * ============================================================
 * Node.js File System Module - Rename & Move
 * ============================================================
 *
 * File: rename.js
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
 *     1. fs.rename()
 *     2. fs.renameSync()
 *     3. Renaming files
 *     4. Moving files
 *     5. Renaming directories
 *     6. Error handling
 *     7. Reusable helper functions
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
 * 2. Create paths
 * ============================================================
 */

const oldFilePath = path.join(__dirname, "old-name.txt");

const newFilePath = path.join(__dirname, "new-name.txt");

/*
 * ============================================================
 * 3. Create a file for the examples
 * ============================================================
 *
 * This makes the example runnable immediately.
 *
 * In a real application, the source file would already exist.
 *
 * ============================================================
 */

if (!fs.existsSync(oldFilePath)) {
  fs.writeFileSync(oldFilePath, "This file will be renamed.", "utf8");
}

/*
 * ============================================================
 * 4. What is fs.rename()?
 * ============================================================
 *
 * `fs.rename()` changes the name or location of a filesystem
 * entry.
 *
 *
 * Example:
 *
 *
 *     old-name.txt
 *
 *
 * becomes:
 *
 *
 *     new-name.txt
 *
 *
 * Syntax:
 *
 *
 *     fs.rename(
 *
 *       oldPath,
 *
 *       newPath,
 *
 *       callback
 *
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Basic rename
 * ============================================================
 */

fs.rename(oldFilePath, newFilePath, (error) => {
  if (error) {
    console.error("Rename failed:", error.message);

    return;
  }

  console.log("\nFile renamed successfully.");

  console.log("Old:", oldFilePath);

  console.log("New:", newFilePath);
});

/*
 * ============================================================
 * 6. Important concept
 * ============================================================
 *
 * `rename()` does NOT mean only "rename".
 *
 * It can also MOVE a file.
 *
 *
 * Example:
 *
 *
 *     old location:
 *
 *         06_fs/file.txt
 *
 *
 *     new location:
 *
 *         06_fs/data/file.txt
 *
 *
 * If the destination path points to another directory,
 * the operation becomes a move.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Move a file
 * ============================================================
 *
 * First create a destination directory.
 *
 * ============================================================
 */

const sourcePath = path.join(__dirname, "move-source.txt");

const dataDirectory = path.join(__dirname, "move-data");

const destinationPath = path.join(dataDirectory, "move-source.txt");

/*
 * Create source file.
 */

if (!fs.existsSync(sourcePath)) {
  fs.writeFileSync(sourcePath, "This file will be moved.", "utf8");
}

/*
 * Create destination directory.
 */

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, {
    recursive: true,
  });
}

/*
 * Move file.
 */

fs.rename(sourcePath, destinationPath, (error) => {
  if (error) {
    console.error("\nMove failed:", error.message);

    return;
  }

  console.log("File moved successfully.");

  console.log("Destination:", destinationPath);
});

/*
 * ============================================================
 * 8. Rename a directory
 * ============================================================
 */

const oldDirectory = path.join(__dirname, "old-folder");

const newDirectory = path.join(__dirname, "new-folder");

/*
 * Create old directory if necessary.
 */

if (!fs.existsSync(oldDirectory)) {
  fs.mkdirSync(oldDirectory, {
    recursive: true,
  });
}

fs.rename(oldDirectory, newDirectory, (error) => {
  if (error) {
    console.error("\nDirectory rename failed:", error.message);

    return;
  }

  console.log("Directory renamed successfully.");
});

/*
 * ============================================================
 * 9. Synchronous rename
 * ============================================================
 *
 * Method:
 *
 *     fs.renameSync()
 *
 *
 * This blocks execution until the rename completes.
 *
 * ============================================================
 */

const syncOldPath = path.join(__dirname, "sync-old.txt");

const syncNewPath = path.join(__dirname, "sync-new.txt");

try {
  /*
   * Create source file.
   */

  fs.writeFileSync(syncOldPath, "Synchronous rename example.", "utf8");

  /*
   * Rename it.
   */

  fs.renameSync(syncOldPath, syncNewPath);

  console.log("\nSynchronous rename successful.");
} catch (error) {
  console.error("Synchronous rename failed:", error.message);
}

/*
 * ============================================================
 * 10. Rename based on filename
 * ============================================================
 *
 * We can combine:
 *
 *
 *     path.parse()
 *
 *
 * with:
 *
 *
 *     path.format()
 *
 *
 * to generate a new filename.
 *
 * ============================================================
 */

const originalPath = path.join(__dirname, "report.txt");

const renamedPath = path.join(__dirname, "report-final.txt");

if (!fs.existsSync(originalPath)) {
  fs.writeFileSync(originalPath, "Final report.", "utf8");
}

fs.rename(originalPath, renamedPath, (error) => {
  if (error) {
    console.error("\nReport rename failed:", error.message);

    return;
  }

  console.log("Report renamed.");
});

/*
 * ============================================================
 * 11. Rename extension
 * ============================================================
 *
 * Example:
 *
 *
 *     data.txt
 *
 *
 * becomes:
 *
 *
 *     data.json
 *
 *
 * WARNING:
 *
 * Renaming a file extension does NOT convert the contents.
 *
 *
 * If data.txt contains plain text:
 *
 *
 *     Hello
 *
 *
 * renaming it to:
 *
 *
 *     data.json
 *
 *
 * does NOT magically turn it into valid JSON.
 *
 * ============================================================
 */

const textFile = path.join(__dirname, "data.txt");

const jsonFile = path.join(__dirname, "data.json");

if (!fs.existsSync(textFile)) {
  fs.writeFileSync(textFile, "This is plain text.", "utf8");
}

/*
 * We will rename it.
 */

fs.rename(textFile, jsonFile, (error) => {
  if (error) {
    console.error("\nExtension rename failed:", error.message);

    return;
  }

  console.log("File extension changed.");
});

/*
 * ============================================================
 * 12. Generate a new filename with path.parse()
 * ============================================================
 */

const inputPath = path.join(__dirname, "image.jpg");

const parsed = path.parse(inputPath);

parsed.name = `${parsed.name}-backup`;

const backupPath = path.format(parsed);

console.log("\nGenerated backup path:", backupPath);

/*
 * ============================================================
 * 13. Practical rename helper
 * ============================================================
 */

function renameFile(oldPath, newPath, callback) {
  fs.rename(oldPath, newPath, callback);
}

/*
 * Example:
 *
 *
 * renameFile(
 *
 *   "old.txt",
 *
 *   "new.txt",
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
 *     console.log("Renamed!");
 *
 *   }
 *
 * );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Rename helper using a new filename
 * ============================================================
 */

function renameWithNewName(filePath, newName, callback) {
  const parsed = path.parse(filePath);

  const newPath = path.join(parsed.dir, newName);

  fs.rename(filePath, newPath, (error) => {
    if (error) {
      callback(error);

      return;
    }

    callback(null, newPath);
  });
}

/*
 * ============================================================
 * 15. Rename helper example
 * ============================================================
 */

const helperOldPath = path.join(__dirname, "helper-old.txt");

if (!fs.existsSync(helperOldPath)) {
  fs.writeFileSync(helperOldPath, "Helper example.", "utf8");
}

renameWithNewName(helperOldPath, "helper-new.txt", (error, newPath) => {
  if (error) {
    console.error("\nHelper rename failed:", error.message);

    return;
  }

  console.log("Helper renamed file to:", newPath);
});

/*
 * ============================================================
 * 16. Error: source does not exist
 * ============================================================
 */

const missingSource = path.join(__dirname, "does-not-exist.txt");

const destination = path.join(__dirname, "destination.txt");

fs.rename(missingSource, destination, (error) => {
  if (error) {
    console.error("\nExpected rename error:");

    console.error("Code:", error.code);

    console.error("Message:", error.message);

    return;
  }
});

/*
 * ============================================================
 * 17. ENOENT
 * ============================================================
 *
 * If the source does not exist, you will commonly get:
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
 * Always handle filesystem errors.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Check before rename
 * ============================================================
 *
 * We can check whether the source exists:
 *
 *
 *     fs.existsSync()
 *
 *
 * However, in production code, don't rely on a separate
 * existence check as your only protection.
 *
 *
 * Why?
 *
 *
 * Between:
 *
 *
 *     existsSync()
 *
 *
 * and:
 *
 *
 *     rename()
 *
 *
 * another process could modify the filesystem.
 *
 *
 * This is a classic TOCTOU issue:
 *
 *
 *     Time Of Check
 *            ↓
 *     Time Of Use
 *
 *
 * Prefer handling the actual operation's error.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Move into another directory
 * ============================================================
 */

const uploadDirectory = path.join(__dirname, "uploads");

const archiveDirectory = path.join(__dirname, "archive");

const uploadFile = path.join(uploadDirectory, "document.txt");

const archiveFile = path.join(archiveDirectory, "document.txt");

fs.mkdirSync(uploadDirectory, {
  recursive: true,
});

fs.mkdirSync(archiveDirectory, {
  recursive: true,
});

if (!fs.existsSync(uploadFile)) {
  fs.writeFileSync(uploadFile, "Document to archive.", "utf8");
}

fs.rename(uploadFile, archiveFile, (error) => {
  if (error) {
    console.error("\nArchive move failed:", error.message);

    return;
  }

  console.log("Document moved to archive.");
});

/*
 * ============================================================
 * 20. Atomic-style replacement concept
 * ============================================================
 *
 * Renaming can be useful in file replacement workflows.
 *
 *
 * A common pattern is:
 *
 *
 *     write temporary file
 *
 *          ↓
 *
 *     rename temporary file
 *
 *          ↓
 *
 *     final file
 *
 *
 * This can be safer than directly modifying a critical file
 * in certain applications.
 *
 *
 * The exact atomicity guarantees depend on the operating
 * system and filesystem, so production designs should account
 * for those details.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Example: temporary file
 * ============================================================
 */

const tempPath = path.join(__dirname, "config.tmp");

const finalConfigPath = path.join(__dirname, "config-final.json");

fs.writeFile(
  tempPath,
  JSON.stringify(
    {
      version: 1,
      environment: "development",
    },
    null,
    2,
  ),
  "utf8",
  (error) => {
    if (error) {
      console.error("Temporary file write failed:", error.message);

      return;
    }

    fs.rename(tempPath, finalConfigPath, (error) => {
      if (error) {
        console.error("Temporary file rename failed:", error.message);

        return;
      }

      console.log("Temporary file promoted to final file.");
    });
  },
);

/*
 * ============================================================
 * 22. Production recommendation
 * ============================================================
 *
 * For Node.js servers:
 *
 *
 * Prefer:
 *
 *
 *     fs.rename()
 *
 *
 * over:
 *
 *
 *     fs.renameSync()
 *
 *
 * when the operation occurs during normal request handling.
 *
 *
 * Synchronous filesystem operations block the JavaScript
 * execution thread.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Common mistakes
 * ============================================================
 *
 *
 * Mistake 1:
 *
 *     Assuming rename converts file contents.
 *
 * It doesn't.
 *
 *
 * Mistake 2:
 *
 *     Forgetting that destination directories must exist.
 *
 *
 * Mistake 3:
 *
 *     Ignoring errors.
 *
 *
 * Mistake 4:
 *
 *     Using renameSync() unnecessarily in server request
 *     handlers.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Final mental model
 * ============================================================
 *
 *
 * Rename:
 *
 *
 *     old.txt
 *        ↓
 *     rename()
 *        ↓
 *     new.txt
 *
 *
 * Move:
 *
 *
 *     folderA/file.txt
 *        ↓
 *     rename()
 *        ↓
 *     folderB/file.txt
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Final cheat sheet
 * ============================================================
 *
 *
 * Async rename:
 *
 *     fs.rename(
 *
 *       oldPath,
 *
 *       newPath,
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
 * Sync rename:
 *
 *     fs.renameSync(
 *
 *       oldPath,
 *
 *       newPath,
 *
 *     );
 *
 *
 * Move:
 *
 *     fs.rename(
 *
 *       "folderA/file.txt",
 *
 *       "folderB/file.txt",
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
 *     fs.rename()
 *         -> rename OR move
 *
 *     fs.renameSync()
 *         -> synchronous rename OR move
 *
 *     path.parse()
 *         -> inspect filename
 *
 *     path.format()
 *         -> construct new filename
 *
 * ============================================================
 */
