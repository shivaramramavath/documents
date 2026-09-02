/**
 * ============================================================
 * Node.js Path Module - path.extname()
 * ============================================================
 *
 * File: extname.js
 *
 * Built-in module:
 *
 *     node:path
 *
 * ============================================================
 *
 * In this file we learn:
 *
 *     1. path.extname()
 *     2. File extensions
 *     3. Files without extensions
 *     4. Multiple dots
 *     5. Hidden files
 *     6. File type checking
 *     7. basename() + extname()
 *     8. Practical backend examples
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
 * 2. What is an extension?
 * ============================================================
 *
 * An extension is the suffix that identifies the type of a
 * file.
 *
 *
 * Examples:
 *
 *
 *     app.js
 *         -> .js
 *
 *     data.json
 *         -> .json
 *
 *     image.png
 *         -> .png
 *
 *     document.pdf
 *         -> .pdf
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Basic example
 * ============================================================
 */

const javascriptFile = "app.js";

const extension = path.extname(javascriptFile);

console.log("Extension:", extension);

/*
 * ============================================================
 * 4. JSON file
 * ============================================================
 */

console.log("JSON Extension:", path.extname("users.json"));

/*
 * ============================================================
 * 5. Image file
 * ============================================================
 */

console.log("Image Extension:", path.extname("profile.png"));

/*
 * ============================================================
 * 6. PDF file
 * ============================================================
 */

console.log("PDF Extension:", path.extname("resume.pdf"));

/*
 * ============================================================
 * 7. Full path
 * ============================================================
 *
 * extname() works with complete paths too.
 *
 * ============================================================
 */

const filePath = "/project/src/controllers/user.controller.js";

console.log("\nFull Path:", filePath);

console.log("Extension:", path.extname(filePath));

/*
 * ============================================================
 * 8. Filename with multiple dots
 * ============================================================
 *
 * Example:
 *
 *
 *     user.controller.js
 *
 *
 * Extension:
 *
 *
 *     .js
 *
 *
 * It does NOT return:
 *
 *
 *     .controller.js
 *
 * ============================================================
 */

const controllerFile = "user.controller.js";

console.log("\nController Extension:", path.extname(controllerFile));

/*
 * ============================================================
 * 9. Multiple extensions
 * ============================================================
 *
 * Example:
 *
 *
 *     backup.tar.gz
 *
 *
 * extname() returns only the final extension:
 *
 *
 *     .gz
 *
 * ============================================================
 */

const archive = "backup.tar.gz";

console.log("\nArchive:", archive);

console.log("Extension:", path.extname(archive));

/*
 * ============================================================
 * 10. Another multiple-dot example
 * ============================================================
 */

const environmentFile = "config.production.json";

console.log("\nEnvironment File:", environmentFile);

console.log("Extension:", path.extname(environmentFile));

/*
 * ============================================================
 * 11. File without extension
 * ============================================================
 */

const readme = "README";

console.log("\nREADME Extension:", path.extname(readme));

/*
 * ============================================================
 * Result:
 *
 *
 *     ""
 *
 *
 * Empty string means there is no extension.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Empty string
 * ============================================================
 */

console.log("Empty Path:", path.extname(""));

/*
 * ============================================================
 * 13. Dot file
 * ============================================================
 *
 * Example:
 *
 *
 *     .env
 *
 *
 * This is commonly used as a hidden/configuration file.
 *
 * ============================================================
 */

const envFile = ".env";

console.log("\n.env Extension:", path.extname(envFile));

/*
 * ============================================================
 * IMPORTANT:
 *
 * `.env` is treated differently from:
 *
 *     config.env
 *
 * ============================================================
 */

console.log("config.env:", path.extname("config.env"));

/*
 * ============================================================
 * 14. Dot files with an extension
 * ============================================================
 */

const hiddenConfig = ".config.json";

console.log("\n.config.json:", path.extname(hiddenConfig));

/*
 * ============================================================
 * 15. File ending with a dot
 * ============================================================
 */

const trailingDot = "file.";

console.log("\nfile. Extension:", path.extname(trailingDot));

/*
 * ============================================================
 * 16. File starting and ending with dots
 * ============================================================
 */

const strangeFile = "..";

console.log("\n.. Extension:", path.extname(strangeFile));

/*
 * ============================================================
 * 17. Case sensitivity
 * ============================================================
 *
 * extname() does not automatically convert extensions to
 * lowercase.
 *
 * ============================================================
 */

const imageJpg = "photo.JPG";

const imageJpgLower = "photo.jpg";

console.log("\nUppercase:", path.extname(imageJpg));

console.log("Lowercase:", path.extname(imageJpgLower));

/*
 * ============================================================
 * 18. Normalize extension
 * ============================================================
 *
 * For file validation, you may want lowercase extensions.
 *
 * ============================================================
 */

const extensionNormalized = path.extname(imageJpg).toLowerCase();

console.log("Normalized:", extensionNormalized);

/*
 * ============================================================
 * 19. Check file type
 * ============================================================
 */

function isJavaScriptFile(filePath) {
  return path.extname(filePath).toLowerCase() === ".js";
}

console.log("\nIs JavaScript:", isJavaScriptFile("app.js"));

console.log("Is JavaScript:", isJavaScriptFile("app.ts"));

/*
 * ============================================================
 * 20. Check JSON file
 * ============================================================
 */

function isJsonFile(filePath) {
  return path.extname(filePath).toLowerCase() === ".json";
}

console.log("\nIs JSON:", isJsonFile("data.json"));

/*
 * ============================================================
 * 21. Allowed image extensions
 * ============================================================
 */

const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function isAllowedImage(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  return allowedImageExtensions.includes(extension);
}

console.log("\nImage Allowed:", isAllowedImage("profile.jpg"));

console.log("Image Allowed:", isAllowedImage("document.pdf"));

/*
 * ============================================================
 * 22. Allowed document extensions
 * ============================================================
 */

const allowedDocumentExtensions = [".pdf", ".doc", ".docx", ".txt"];

function isAllowedDocument(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  return allowedDocumentExtensions.includes(extension);
}

console.log("\nDocument Allowed:", isAllowedDocument("resume.pdf"));

console.log("Document Allowed:", isAllowedDocument("image.png"));

/*
 * ============================================================
 * 23. Get file metadata
 * ============================================================
 */

function getFileInfo(filePath) {
  return {
    fullPath: filePath,

    filename: path.basename(filePath),

    extension: path.extname(filePath),

    directory: path.dirname(filePath),
  };
}

console.log("\nFile Information:");

console.log(getFileInfo("/uploads/images/profile.jpg"));

/*
 * ============================================================
 * 24. Remove extension
 * ============================================================
 *
 * We can combine:
 *
 *
 *     basename()
 *
 *     extname()
 *
 *
 * to remove the extension dynamically.
 *
 * ============================================================
 */

function getFileNameWithoutExtension(filePath) {
  const filename = path.basename(filePath);

  const extension = path.extname(filePath);

  return filename.slice(0, filename.length - extension.length);
}

console.log(
  "\nFilename Without Extension:",
  getFileNameWithoutExtension("/uploads/profile/user.avatar.jpg"),
);

/*
 * ============================================================
 * 25. Simpler approach
 * ============================================================
 *
 * basename() supports a known suffix:
 *
 *
 *     path.basename(
 *       filePath,
 *       ".jpg",
 *     );
 *
 *
 * But the previous approach is useful when the extension
 * is unknown beforehand.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Multiple files
 * ============================================================
 */

const files = [
  "app.js",

  "server.ts",

  "users.json",

  "profile.jpg",

  "resume.pdf",

  "README",
];

console.log("\nFile Extensions:");

for (const file of files) {
  console.log(file, "=>", path.extname(file));
}

/*
 * ============================================================
 * 27. Group files by extension
 * ============================================================
 */

const grouped = {};

for (const file of files) {
  const extension = path.extname(file).toLowerCase();

  const key = extension || "[no extension]";

  if (!grouped[key]) {
    grouped[key] = [];
  }

  grouped[key].push(file);
}

console.log("\nGrouped Files:");

console.log(grouped);

/*
 * ============================================================
 * 28. Practical upload validation
 * ============================================================
 *
 * Suppose an API accepts profile images.
 *
 * ============================================================
 */

function validateImageUpload(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  const allowed = [".jpg", ".jpeg", ".png", ".webp"];

  if (!allowed.includes(extension)) {
    return {
      valid: false,

      message: "Unsupported image extension",
    };
  }

  return {
    valid: true,

    extension,
  };
}

console.log("\nUpload Validation:");

console.log(validateImageUpload("profile.png"));

console.log(validateImageUpload("malicious.exe"));

/*
 * ============================================================
 * 29. IMPORTANT SECURITY NOTE
 * ============================================================
 *
 * Checking the extension alone is NOT sufficient for secure
 * file upload validation.
 *
 *
 * Example:
 *
 *
 *     malicious.exe
 *
 *
 * could potentially be renamed:
 *
 *
 *     malicious.jpg
 *
 *
 * Therefore production systems may additionally validate:
 *
 *
 *     - MIME type
 *     - File signature / magic bytes
 *     - Actual file contents
 *     - File size
 *     - Storage location
 *     - Generated filenames
 *     - Executable file prevention
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Practical API example
 * ============================================================
 *
 * Imagine an endpoint receives:
 *
 *
 *     /uploads/users/profile.png
 *
 * ============================================================
 */

const uploadedPath = "/uploads/users/profile.png";

const uploadedExtension = path.extname(uploadedPath).toLowerCase();

console.log("\nUploaded Extension:", uploadedExtension);

/*
 * ============================================================
 * 31. Content type decision
 * ============================================================
 */

function getFileCategory(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  if ([".jpg", ".jpeg", ".png", ".webp"].includes(extension)) {
    return "image";
  }

  if ([".mp4", ".mkv", ".mov"].includes(extension)) {
    return "video";
  }

  if ([".mp3", ".wav", ".ogg"].includes(extension)) {
    return "audio";
  }

  if ([".pdf", ".doc", ".docx", ".txt"].includes(extension)) {
    return "document";
  }

  return "unknown";
}

console.log("\nFile Category:", getFileCategory("profile.jpg"));

console.log("File Category:", getFileCategory("movie.mp4"));

console.log("File Category:", getFileCategory("resume.pdf"));

/*
 * ============================================================
 * 32. Current JavaScript file
 * ============================================================
 */

console.log("\nCurrent File:", __filename);

console.log("Current Extension:", path.extname(__filename));

/*
 * ============================================================
 * 33. Directory has no extension
 * ============================================================
 */

const directory = "/project/src/controllers";

console.log("\nDirectory Extension:", path.extname(directory));

/*
 * ============================================================
 * 34. Query strings
 * ============================================================
 *
 * Be careful when working with URL strings.
 *
 *
 * Example:
 *
 *
 *     /download/file.pdf?token=123
 *
 *
 * `extname()` works on path strings, not as a full URL parser.
 *
 * For URLs, use the URL API first.
 *
 * ============================================================
 */

const url = "/download/file.pdf?token=123";

console.log("\nURL-like String Extension:", path.extname(url));

/*
 * ============================================================
 * 35. Better URL handling
 * ============================================================
 *
 * For a real URL:
 *
 *
 *     new URL()
 *
 *
 * should be used to parse URL components.
 *
 * The Node.js URL module will be covered separately.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Summary
 * ============================================================
 */

const summary = {
  javascript: path.extname("app.js"),

  json: path.extname("data.json"),

  image: path.extname("profile.png"),

  archive: path.extname("backup.tar.gz"),

  noExtension: path.extname("README"),
};

console.log("\nSummary:");

console.log(summary);

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
 * Get extension:
 *
 *     path.extname(
 *       "app.js",
 *     );
 *
 *
 * Result:
 *
 *     ".js"
 *
 *
 * Multiple dots:
 *
 *     path.extname(
 *       "backup.tar.gz",
 *     );
 *
 *
 * Result:
 *
 *     ".gz"
 *
 *
 * No extension:
 *
 *     path.extname(
 *       "README",
 *     );
 *
 *
 * Result:
 *
 *     ""
 *
 *
 * Normalize:
 *
 *     path.extname(
 *       file,
 *     ).toLowerCase();
 *
 *
 * ============================================================
 *
 * Remember:
 *
 *     basename()
 *         -> filename
 *
 *     dirname()
 *         -> parent directory
 *
 *     extname()
 *         -> final file extension
 *
 *     join()
 *         -> combine paths
 *
 *     resolve()
 *         -> absolute path
 *
 * ============================================================
 */
