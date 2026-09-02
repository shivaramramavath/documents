/**
 * ============================================================
 * Node.js Path Module - parse() and format()
 * ============================================================
 *
 * File: parse_format.js
 *
 * Built-in module:
 *
 *     node:path
 *
 * ============================================================
 *
 * In this file we learn:
 *
 *     1. path.parse()
 *     2. root
 *     3. dir
 *     4. base
 *     5. name
 *     6. ext
 *     7. path.format()
 *     8. parse() + modify + format()
 *     9. Practical backend examples
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
 * 2. What is path.parse()?
 * ============================================================
 *
 * `path.parse()` breaks a path into an object.
 *
 *
 * Example:
 *
 *
 *     /project/src/app.js
 *
 *
 * becomes approximately:
 *
 *
 * {
 *
 *     root: "/",
 *
 *     dir: "/project/src",
 *
 *     base: "app.js",
 *
 *     ext: ".js",
 *
 *     name: "app"
 *
 * }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Basic example
 * ============================================================
 */

const filePath = "/project/src/app.js";

const parsedPath = path.parse(filePath);

console.log("Parsed Path:");

console.log(parsedPath);

/*
 * ============================================================
 * 4. root
 * ============================================================
 *
 * `root` is the filesystem root.
 *
 *
 * Linux/macOS:
 *
 *
 *     /
 *
 *
 * Windows:
 *
 *
 *     C:\
 *
 * ============================================================
 */

console.log("\nRoot:", parsedPath.root);

/*
 * ============================================================
 * 5. dir
 * ============================================================
 *
 * `dir` is the directory containing the file.
 *
 *
 * Example:
 *
 *
 *     /project/src
 *
 * ============================================================
 */

console.log("Directory:", parsedPath.dir);

/*
 * ============================================================
 * 6. base
 * ============================================================
 *
 * `base` is the complete final filename.
 *
 *
 * Example:
 *
 *
 *     app.js
 *
 * ============================================================
 */

console.log("Base:", parsedPath.base);

/*
 * ============================================================
 * 7. ext
 * ============================================================
 *
 * `ext` is the final file extension.
 *
 *
 * Example:
 *
 *
 *     .js
 *
 * ============================================================
 */

console.log("Extension:", parsedPath.ext);

/*
 * ============================================================
 * 8. name
 * ============================================================
 *
 * `name` is the filename without the extension.
 *
 *
 * Example:
 *
 *
 *     app
 *
 * ============================================================
 */

console.log("Name:", parsedPath.name);

/*
 * ============================================================
 * 9. Complete structure
 * ============================================================
 *
 *
 * Path:
 *
 *
 *     /project/src/app.js
 *
 *
 * Result:
 *
 *
 *     root
 *         /
 *
 *     dir
 *         /project/src
 *
 *     base
 *         app.js
 *
 *     name
 *         app
 *
 *     ext
 *         .js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Destructuring the result
 * ============================================================
 */

const { root, dir, base, name, ext } = path.parse(filePath);

console.log("\nDestructured Values:");

console.log("root:", root);

console.log("dir:", dir);

console.log("base:", base);

console.log("name:", name);

console.log("ext:", ext);

/*
 * ============================================================
 * 11. Multiple dots
 * ============================================================
 */

const configPath = "/project/config/database.production.json";

const configParsed = path.parse(configPath);

console.log("\nConfig Path:");

console.log(configParsed);

/*
 * ============================================================
 * 12. Important:
 *
 * ext only contains the LAST extension.
 * ============================================================
 *
 * Example:
 *
 *
 *     backup.tar.gz
 *
 *
 * parse() returns:
 *
 *
 *     name: backup.tar
 *
 *     ext: .gz
 *
 *
 * It does NOT return:
 *
 *
 *     ext: .tar.gz
 *
 * ============================================================
 */

const archivePath = "/backups/database.tar.gz";

console.log("\nArchive Parsed:");

console.log(path.parse(archivePath));

/*
 * ============================================================
 * 13. File without extension
 * ============================================================
 */

const readmePath = "/project/README";

console.log("\nREADME Parsed:");

console.log(path.parse(readmePath));

/*
 * ============================================================
 * 14. Hidden file
 * ============================================================
 */

const envPath = "/project/.env";

console.log("\n.env Parsed:");

console.log(path.parse(envPath));

/*
 * ============================================================
 * 15. path.format()
 * ============================================================
 *
 * `path.format()` does the opposite of parse().
 *
 *
 * parse():
 *
 *
 *     path
 *       ↓
 *     object
 *
 *
 * format():
 *
 *
 *     object
 *       ↓
 *     path
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Basic format example
 * ============================================================
 */

const formattedPath = path.format({
  dir: "/project/src",

  name: "app",

  ext: ".js",
});

console.log("\nFormatted Path:", formattedPath);

/*
 * ============================================================
 * 17. Format using base
 * ============================================================
 *
 * Instead of:
 *
 *
 *     name + ext
 *
 *
 * we can directly provide:
 *
 *
 *     base
 *
 * ============================================================
 */

const formattedWithBase = path.format({
  dir: "/project/src",

  base: "server.js",
});

console.log("Formatted With Base:", formattedWithBase);

/*
 * ============================================================
 * 18. parse() -> format()
 * ============================================================
 *
 * We can parse a path and immediately format it again.
 *
 * ============================================================
 */

const original = "/project/src/app.js";

const parsed = path.parse(original);

const rebuilt = path.format(parsed);

console.log("\nOriginal:", original);

console.log("Rebuilt:", rebuilt);

/*
 * ============================================================
 * 19. Modify parsed path
 * ============================================================
 *
 * This is where parse() + format() becomes very useful.
 *
 *
 * Example:
 *
 *
 *     app.js
 *
 *
 * Change it to:
 *
 *
 *     app.ts
 *
 * ============================================================
 */

const javascriptPath = "/project/src/app.js";

const parsedJavascript = path.parse(javascriptPath);

parsedJavascript.ext = ".ts";

const typescriptPath = path.format(parsedJavascript);

console.log("\nOriginal:", javascriptPath);

console.log("Changed Extension:", typescriptPath);

/*
 * ============================================================
 * 20. Rename a file
 * ============================================================
 */

const oldPath = "/project/src/old-name.js";

const parsedOldPath = path.parse(oldPath);

parsedOldPath.name = "new-name";

const newPath = path.format(parsedOldPath);

console.log("\nOld Path:", oldPath);

console.log("New Path:", newPath);

/*
 * ============================================================
 * 21. Change filename
 * ============================================================
 */

const controllerPath = "/project/src/controllers/user.controller.js";

const parsedController = path.parse(controllerPath);

parsedController.name = "auth.controller";

const authControllerPath = path.format(parsedController);

console.log("\nChanged Controller:", authControllerPath);

/*
 * ============================================================
 * 22. Change extension
 * ============================================================
 */

const jsonPath = "/project/data/users.json";

const parsedJson = path.parse(jsonPath);

parsedJson.ext = ".backup";

const backupPath = path.format(parsedJson);

console.log("\nBackup Path:", backupPath);

/*
 * ============================================================
 * 23. Change directory
 * ============================================================
 */

const sourceFile = "/project/src/app.js";

const parsedSource = path.parse(sourceFile);

parsedSource.dir = "/project/dist";

const distFile = path.format(parsedSource);

console.log("\nSource:", sourceFile);

console.log("Dist:", distFile);

/*
 * ============================================================
 * 24. Generate a backup filename
 * ============================================================
 */

function getBackupPath(filePath) {
  const parsed = path.parse(filePath);

  parsed.name = `${parsed.name}.backup`;

  return path.format(parsed);
}

console.log("\nBackup File:", getBackupPath("/data/users.json"));

/*
 * ============================================================
 * 25. Generate a copy filename
 * ============================================================
 */

function getCopyPath(filePath) {
  const parsed = path.parse(filePath);

  parsed.name = `${parsed.name}.copy`;

  return path.format(parsed);
}

console.log("Copy File:", getCopyPath("/data/report.pdf"));

/*
 * ============================================================
 * 26. File metadata helper
 * ============================================================
 */

function getFileMetadata(filePath) {
  const parsed = path.parse(filePath);

  return {
    fullPath: filePath,

    root: parsed.root,

    directory: parsed.dir,

    filename: parsed.base,

    name: parsed.name,

    extension: parsed.ext,
  };
}

console.log("\nFile Metadata:");

console.log(getFileMetadata("/uploads/images/profile.jpg"));

/*
 * ============================================================
 * 27. Change extension helper
 * ============================================================
 */

function changeExtension(filePath, newExtension) {
  const parsed = path.parse(filePath);

  /*
   * Make sure the extension begins with ".".
   */

  if (!newExtension.startsWith(".")) {
    newExtension = `.${newExtension}`;
  }

  parsed.ext = newExtension;

  return path.format(parsed);
}

console.log("\nChange Extension:");

console.log(changeExtension("/data/users.json", "csv"));

console.log(changeExtension("/images/profile.jpg", ".webp"));

/*
 * ============================================================
 * 28. Rename helper
 * ============================================================
 */

function renameFile(filePath, newName) {
  const parsed = path.parse(filePath);

  parsed.name = newName;

  return path.format(parsed);
}

console.log("\nRename File:");

console.log(renameFile("/uploads/profile.jpg", "avatar"));

/*
 * ============================================================
 * 29. Generate thumbnail path
 * ============================================================
 */

function thumbnailPath(filePath) {
  const parsed = path.parse(filePath);

  parsed.name = `${parsed.name}-thumbnail`;

  return path.format(parsed);
}

console.log("\nThumbnail:");

console.log(thumbnailPath("/uploads/images/profile.jpg"));

/*
 * ============================================================
 * 30. Generate optimized image path
 * ============================================================
 */

function optimizedImagePath(filePath) {
  const parsed = path.parse(filePath);

  parsed.name = `${parsed.name}-optimized`;

  return path.format(parsed);
}

console.log("\nOptimized Image:");

console.log(optimizedImagePath("/uploads/images/product.png"));

/*
 * ============================================================
 * 31. Multiple files
 * ============================================================
 */

const files = [
  "/project/src/app.js",

  "/project/data/users.json",

  "/uploads/profile.jpg",

  "/documents/resume.pdf",
];

console.log("\nParsed Files:");

for (const file of files) {
  const parsed = path.parse(file);

  console.log({
    file,

    directory: parsed.dir,

    filename: parsed.base,

    name: parsed.name,

    extension: parsed.ext,
  });
}

/*
 * ============================================================
 * 32. Build paths from parsed information
 * ============================================================
 */

const input = "/project/input/data.json";

const inputParsed = path.parse(input);

const output = path.format({
  dir: "/project/output",

  name: inputParsed.name,

  ext: inputParsed.ext,
});

console.log("\nInput:", input);

console.log("Output:", output);

/*
 * ============================================================
 * 33. Real-world backend example
 * ============================================================
 *
 * Suppose a user uploads:
 *
 *
 *     profile-picture.jpg
 *
 *
 * We want to generate:
 *
 *
 *     profile-picture-original.jpg
 *
 *     profile-picture-thumbnail.jpg
 *
 *     profile-picture-optimized.jpg
 *
 * ============================================================
 */

function generateImagePaths(filePath) {
  const parsed = path.parse(filePath);

  const original = path.format({
    dir: parsed.dir,

    name: `${parsed.name}-original`,

    ext: parsed.ext,
  });

  const thumbnail = path.format({
    dir: parsed.dir,

    name: `${parsed.name}-thumbnail`,

    ext: parsed.ext,
  });

  const optimized = path.format({
    dir: parsed.dir,

    name: `${parsed.name}-optimized`,

    ext: parsed.ext,
  });

  return {
    original,

    thumbnail,

    optimized,
  };
}

console.log("\nGenerated Image Paths:");

console.log(generateImagePaths("/uploads/profile-picture.jpg"));

/*
 * ============================================================
 * 34. Parse + modify + format
 * ============================================================
 *
 * This is the main pattern to remember.
 *
 *
 *     const parsed = path.parse(filePath);
 *
 *
 *     parsed.name = "new-name";
 *
 *
 *     parsed.ext = ".png";
 *
 *
 *     const newPath = path.format(parsed);
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Difference between functions
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
 *     Creates an absolute path.
 *
 *
 * path.basename()
 *
 *     Gets final filename/path component.
 *
 *
 * path.dirname()
 *
 *     Gets parent directory.
 *
 *
 * path.extname()
 *
 *     Gets final extension.
 *
 *
 * path.parse()
 *
 *     Breaks a path into structured information.
 *
 *
 * path.format()
 *
 *     Builds a path from structured information.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Complete example
 * ============================================================
 */

const completePath = "/project/src/controllers/user.controller.js";

const complete = path.parse(completePath);

console.log("\nComplete Parse:");

console.log(complete);

/*
 * Modify it:
 */

complete.name = "auth.controller";

complete.ext = ".ts";

complete.dir = "/project/src/controllers";

const finalPath = path.format(complete);

console.log("Final Path:", finalPath);

/*
 * ============================================================
 * 37. Important path.parse() object
 * ============================================================
 *
 *
 *     {
 *
 *       root: "...",
 *
 *       dir: "...",
 *
 *       base: "...",
 *
 *       ext: "...",
 *
 *       name: "..."
 *
 *     }
 *
 *
 * Remember:
 *
 *
 *     base = name + ext
 *
 *
 * Example:
 *
 *
 *     base:
 *         user.js
 *
 *     name:
 *         user
 *
 *     ext:
 *         .js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Final cheat sheet
 * ============================================================
 *
 *
 * Parse:
 *
 *     path.parse(
 *       "/project/src/app.js",
 *     );
 *
 *
 * Result conceptually:
 *
 *
 *     {
 *       root: "/",
 *       dir: "/project/src",
 *       base: "app.js",
 *       name: "app",
 *       ext: ".js"
 *     }
 *
 *
 * Format:
 *
 *     path.format({
 *
 *       dir: "/project/src",
 *
 *       name: "app",
 *
 *       ext: ".js",
 *
 *     });
 *
 *
 * Result:
 *
 *     /project/src/app.js
 *
 *
 * ============================================================
 *
 * Most useful pattern:
 *
 *
 *     const parsed =
 *       path.parse(filePath);
 *
 *
 *     parsed.name =
 *       "new-name";
 *
 *
 *     parsed.ext =
 *       ".json";
 *
 *
 *     const newPath =
 *       path.format(parsed);
 *
 * ============================================================
 */

/*
 * ============================================================
 * PATH MODULE COMPLETE
 * ============================================================
 *
 * You have now covered:
 *
 *
 *     01_join
 *     02_resolve
 *     03_basename
 *     04_dirname
 *     05_extname
 *     06_parse_format
 *
 *
 * Next Node.js module:
 *
 *
 *     06_fs/
 *
 *
 * We will learn the File System module:
 *
 *
 *     read
 *     write
 *     append
 *     rename
 *     delete
 *     directories
 *     promises
 *     streams
 *
 * ============================================================
 */
