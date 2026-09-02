/**
 * ============================================================
 * Node.js Path Module - path.basename()
 * ============================================================
 *
 * File: basename.js
 *
 * Built-in module:
 *
 *     node:path
 *
 * ============================================================
 *
 * In this file we learn:
 *
 *     1. path.basename()
 *     2. Extracting filenames
 *     3. Removing file extensions
 *     4. Windows and Linux paths
 *     5. Dynamic filenames
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
 * 2. What is basename?
 * ============================================================
 *
 * The "basename" is the final part of a path.
 *
 *
 * Example:
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
 * ============================================================
 */

/*
 * ============================================================
 * 3. Basic example
 * ============================================================
 */

const filePath = "/project/src/app.js";

const fileName = path.basename(filePath);

console.log("File Name:", fileName);

/*
 * ============================================================
 * 4. Another example
 * ============================================================
 */

const imagePath = "/uploads/images/profile.jpg";

console.log("Image Name:", path.basename(imagePath));

/*
 * ============================================================
 * 5. Nested directories
 * ============================================================
 */

const nestedPath = "/project/src/controllers/user.controller.js";

console.log("Nested File Name:", path.basename(nestedPath));

/*
 * ============================================================
 * 6. Filename with multiple dots
 * ============================================================
 */

const configPath = "/project/config/database.prod.json";

console.log("Config File:", path.basename(configPath));

/*
 * ============================================================
 * 7. Remove the extension
 * ============================================================
 *
 * `path.basename()` accepts an optional second argument.
 *
 *
 * Syntax:
 *
 *
 *     path.basename(
 *       path,
 *       suffix,
 *     );
 *
 *
 * If the suffix matches the end of the filename,
 * it is removed.
 *
 * ============================================================
 */

const javascriptFile = "/project/src/app.js";

const javascriptName = path.basename(javascriptFile, ".js");

console.log("Without Extension:", javascriptName);

/*
 * ============================================================
 * 8. JSON file
 * ============================================================
 */

const jsonFile = "/data/users.json";

console.log("JSON Name:", path.basename(jsonFile, ".json"));

/*
 * ============================================================
 * 9. Image file
 * ============================================================
 */

const imageFile = "/uploads/profile.png";

console.log("Image Name Without Extension:", path.basename(imageFile, ".png"));

/*
 * ============================================================
 * 10. Important:
 *
 * basename() does NOT extract the extension.
 * ============================================================
 *
 * Example:
 *
 *
 *     path.basename(
 *       "/project/app.js",
 *     );
 *
 *
 * Result:
 *
 *
 *     app.js
 *
 *
 * To get:
 *
 *
 *     js
 *
 *
 * use:
 *
 *
 *     path.extname()
 *
 *
 * We will learn that in:
 *
 *
 *     extname.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Windows path
 * ============================================================
 *
 * On Windows, paths commonly look like:
 *
 *
 *     C:\Users\Shiva\project\app.js
 *
 *
 * Important:
 *
 * `path.basename()` follows the path rules of the current
 * operating system.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Current platform example
 * ============================================================
 */

const currentFile = path.join(__dirname, "example.js");

console.log("Current Platform File:", currentFile);

console.log("Basename:", path.basename(currentFile));

/*
 * ============================================================
 * 13. Dynamic filename
 * ============================================================
 */

const uploadDirectory = path.join("uploads", "images");

const uploadedFile = path.join(uploadDirectory, "avatar.jpg");

const uploadedFileName = path.basename(uploadedFile);

console.log("Uploaded File Name:", uploadedFileName);

/*
 * ============================================================
 * 14. Practical backend example
 * ============================================================
 *
 * Imagine an HTTP request contains:
 *
 *
 *     /uploads/2026/09/profile.jpg
 *
 *
 * We only want:
 *
 *
 *     profile.jpg
 *
 * ============================================================
 */

const requestFilePath = "/uploads/2026/09/profile.jpg";

const requestedFileName = path.basename(requestFilePath);

console.log("Requested File:", requestedFileName);

/*
 * ============================================================
 * 15. Get filename from URL-like path
 * ============================================================
 */

const urlPath = "/images/products/phone.png";

const urlFileName = path.basename(urlPath);

console.log("URL File Name:", urlFileName);

/*
 * ============================================================
 * 16. Dynamic extension removal
 * ============================================================
 *
 * If you already know the extension:
 *
 * ============================================================
 */

const file = "document.pdf";

const withoutPdf = path.basename(file, ".pdf");

console.log("PDF Without Extension:", withoutPdf);

/*
 * ============================================================
 * 17. What happens if suffix does not match?
 * ============================================================
 */

const filename = "document.pdf";

const result = path.basename(filename, ".txt");

console.log("Wrong Suffix Result:", result);

/*
 * ============================================================
 * IMPORTANT:
 *
 * Since `.txt` is not the ending of `document.pdf`,
 * nothing is removed.
 *
 * Result:
 *
 *     document.pdf
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Filename with multiple dots
 * ============================================================
 */

const environmentFile = "config.production.json";

console.log("Full Filename:", path.basename(environmentFile));

console.log("Remove .json:", path.basename(environmentFile, ".json"));

/*
 * ============================================================
 * 19. Hidden files
 * ============================================================
 *
 * Unix-like systems commonly have hidden files beginning
 * with a dot.
 *
 *
 * Example:
 *
 *
 *     .env
 *
 *
 * ============================================================
 */

const envFile = ".env";

console.log("Environment File:", path.basename(envFile));

/*
 * ============================================================
 * 20. Directory path ending with separator
 * ============================================================
 *
 * If the path ends with a separator, basename() returns the
 * final non-separator portion according to the platform rules.
 *
 * For portable code, don't rely on unusual trailing-separator
 * behavior without understanding the platform.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. File processing example
 * ============================================================
 */

function getFileName(filePath) {
  return path.basename(filePath);
}

console.log("\nHelper Function:", getFileName("/data/users/users.json"));

/*
 * ============================================================
 * 22. Remove extension helper
 * ============================================================
 *
 * This version removes a known extension.
 *
 * ============================================================
 */

function removeExtension(filePath, extension) {
  return path.basename(filePath, extension);
}

console.log("Without Extension:", removeExtension("/data/users.json", ".json"));

/*
 * ============================================================
 * 23. Upload example
 * ============================================================
 */

function processUpload(filePath) {
  const name = path.basename(filePath);

  console.log("Processing:", name);

  return {
    originalPath: filePath,

    fileName: name,
  };
}

console.log("\nUpload Result:");

console.log(processUpload("/uploads/images/avatar.png"));

/*
 * ============================================================
 * 24. Logging example
 * ============================================================
 *
 * When logging errors, sometimes you only want the filename
 * instead of the entire filesystem path.
 *
 * ============================================================
 */

const errorFile = "/project/src/services/user.service.js";

console.log("\nError occurred in:", path.basename(errorFile));

/*
 * ============================================================
 * 25. Backend controller example
 * ============================================================
 */

const controllerPath = path.join(
  __dirname,
  "controllers",
  "user.controller.js",
);

const controllerName = path.basename(controllerPath);

console.log("Controller:", controllerName);

/*
 * ============================================================
 * 26. Get filename from __filename
 * ============================================================
 */

console.log("This File Name:", path.basename(__filename));

/*
 * ============================================================
 * 27. Get filename without extension
 * ============================================================
 */

console.log(
  "This File Without Extension:",
  path.basename(__filename, path.extname(__filename)),
);

/*
 * ============================================================
 * 28. Why path.basename() is useful
 * ============================================================
 *
 * Common backend use cases:
 *
 *
 *     - Uploaded files
 *     - Log processing
 *     - File management APIs
 *     - CLI applications
 *     - Static file servers
 *     - Error logging
 *     - File metadata
 *     - Image processing
 *     - Document processing
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Security warning
 * ============================================================
 *
 * `basename()` can help extract a filename, but it is NOT a
 * complete security mechanism.
 *
 *
 * Never assume that:
 *
 *
 *     path.basename(userInput)
 *
 *
 * alone makes file handling safe.
 *
 *
 * You still need to:
 *
 *
 *     - Validate file type
 *     - Validate filename
 *     - Restrict allowed directories
 *     - Prevent dangerous uploads
 *     - Enforce file size limits
 *     - Generate safe server-side filenames when appropriate
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Common mistake
 * ============================================================
 *
 * DON'T do this:
 *
 *
 *     const parts =
 *       filePath.split("/");
 *
 *
 *     const file =
 *       parts[parts.length - 1];
 *
 *
 * This assumes `/` is the path separator.
 *
 *
 * Better:
 *
 *
 *     path.basename(
 *       filePath,
 *     );
 *
 *
 * Node.js handles platform-specific path behavior.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Another example
 * ============================================================
 */

const paths = [
  "/home/user/app.js",

  "/home/user/data.json",

  "/uploads/image.png",

  "/logs/server.log",
];

const names = paths.map((item) => path.basename(item));

console.log("\nFilenames:");

console.log(names);

/*
 * ============================================================
 * 32. Filename metadata
 * ============================================================
 */

const documentPath = "/documents/report.pdf";

const documentName = path.basename(documentPath);

const documentExtension = path.extname(documentPath);

console.log("\nDocument Metadata:");

console.log({
  name: documentName,

  extension: documentExtension,
});

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
 * Get filename:
 *
 *     path.basename(
 *       "/project/app.js",
 *     );
 *
 *
 * Result:
 *
 *     app.js
 *
 *
 * Remove known extension:
 *
 *     path.basename(
 *       "/project/app.js",
 *       ".js",
 *     );
 *
 *
 * Result:
 *
 *     app
 *
 *
 * Current file name:
 *
 *     path.basename(
 *       __filename,
 *     );
 *
 *
 * File extension:
 *
 *     path.extname(
 *       __filename,
 *     );
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     path.basename(path)
 *
 *     extracts the final filename/directory component from
 *     a path.
 *
 * ============================================================
 */
