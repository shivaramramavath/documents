/**
 * ============================================================
 * NODE.JS MASTERY
 * ============================================================
 *
 * File:
 *     18_express/static_files.js
 *
 * Topic:
 *     Serving Static Files with Express
 *
 * ============================================================
 *
 * STATIC FILES
 * ============================================================
 *
 * Static files are files that the server sends directly to the
 * client without dynamically generating their contents.
 *
 * Examples:
 *
 *     HTML
 *     CSS
 *     JavaScript
 *     Images
 *     Fonts
 *     Videos
 *     PDFs
 *
 *
 * Example project:
 *
 *     public/
 *     ├── index.html
 *     ├── css/
 *     │   └── style.css
 *     ├── js/
 *     │   └── app.js
 *     └── images/
 *         └── logo.png
 *
 *
 * Browser:
 *
 *     GET /index.html
 *
 *
 * Express:
 *
 *     public/index.html
 *
 * ============================================================
 */

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();

const PORT = process.env.PORT || 3000;

/*
 * ============================================================
 * 1. __dirname IN ESM
 * ============================================================
 *
 * In CommonJS:
 *
 *     __dirname
 *
 * is available automatically.
 *
 *
 * In ESM:
 *
 *     __dirname
 *
 * is not automatically available.
 *
 *
 * We can construct it using:
 *
 *     import.meta.url
 *
 * ============================================================
 */

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

/*
 * ============================================================
 * 2. STATIC DIRECTORY
 * ============================================================
 *
 * Assume:
 *
 *     18_express/
 *     ├── static_files.js
 *     └── public/
 *         ├── index.html
 *         ├── css/
 *         │   └── style.css
 *         └── images/
 *             └── logo.png
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. express.static()
 * ============================================================
 *
 * The simplest way to serve static files:
 *
 *     app.use(
 *       express.static("public")
 *     );
 *
 * ============================================================
 */

app.use(express.static(path.join(__dirname, "public")));

/*
 * Now:
 *
 *     public/index.html
 *
 * can be requested as:
 *
 *     GET /index.html
 *
 *
 * And:
 *
 *     public/css/style.css
 *
 * becomes:
 *
 *     GET /css/style.css
 *
 *
 * The physical directory name `public` is not part of the URL.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. STATIC FILE URL MAPPING
 * ============================================================
 *
 *
 * FILE:
 *
 *     public/images/logo.png
 *
 *
 * URL:
 *
 *     /images/logo.png
 *
 *
 * FILE:
 *
 *     public/css/style.css
 *
 *
 * URL:
 *
 *     /css/style.css
 *
 *
 * FILE:
 *
 *     public/js/app.js
 *
 *
 * URL:
 *
 *     /js/app.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. CUSTOM URL PREFIX
 * ============================================================
 *
 * Sometimes you want:
 *
 *     /static/...
 *
 * instead of:
 *
 *     /...
 *
 *
 * Example:
 */

const staticDirectory = path.join(__dirname, "public");

app.use("/static", express.static(staticDirectory));

/*
 * Now:
 *
 *     public/css/style.css
 *
 * is available at:
 *
 *     /static/css/style.css
 *
 *
 * Notice:
 *
 *     /static
 *
 * is the mount path.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. STATIC FILES WITH AN ABSOLUTE PATH
 * ============================================================
 *
 * Prefer an absolute path when your application's working
 * directory may vary.
 *
 *
 * Good:
 *
 *     path.join(__dirname, "public")
 *
 *
 * Less explicit:
 *
 *     express.static("public")
 *
 *
 * Relative paths depend on the process's current working
 * directory.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. HTML FILE
 * ============================================================
 *
 * Suppose:
 *
 *     public/index.html
 *
 * contains:
 *
 *
 *     <!DOCTYPE html>
 *     <html>
 *       <head>
 *         <title>Node Mastery</title>
 *       </head>
 *       <body>
 *         <h1>Hello Express</h1>
 *       </body>
 *     </html>
 *
 *
 * Browser:
 *
 *     GET /
 *
 *
 * Express static middleware can serve index.html automatically.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. DEFAULT INDEX FILE
 * ============================================================
 *
 * express.static() looks for an index file by default.
 *
 *
 * Request:
 *
 *     GET /
 *
 *
 * can resolve to:
 *
 *     public/index.html
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. DISABLE INDEX FILE
 * ============================================================
 *
 * You can disable automatic index serving.
 *
 */

const staticWithoutIndex = express.static(staticDirectory, {
  index: false,
});

app.use("/assets", staticWithoutIndex);

/*
 * Now:
 *
 *     /assets/
 *
 * will not automatically serve:
 *
 *     index.html
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. FALLBACK ROUTE
 * ============================================================
 *
 * Static middleware only handles files that actually exist.
 *
 * If the file does not exist, Express continues to the next
 * middleware.
 *
 *
 * Example:
 *
 *     GET /missing.css
 *
 *
 * If:
 *
 *     public/missing.css
 *
 * does not exist:
 *
 *     express.static()
 *
 * calls next().
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. CUSTOM 404 FOR STATIC FILES
 * ============================================================
 */

app.get("/assets-required", (req, res) => {
  res.json({
    message: "Application route",
  });
});

/*
 * ============================================================
 * 12. CACHE CONTROL
 * ============================================================
 *
 * Static assets are often cached by browsers/CDNs.
 *
 * Examples:
 *
 *     CSS
 *     JavaScript
 *     Images
 *     Fonts
 *
 *
 * Cache configuration can improve performance.
 *
 * ============================================================
 */

app.use(
  "/cached",
  express.static(staticDirectory, {
    maxAge: "1d",
  }),
);

/*
 * `maxAge` controls cache-related response headers.
 *
 * For production applications, cache duration should be chosen
 * according to the asset versioning strategy.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. IMMUTABLE ASSETS
 * ============================================================
 *
 * If your assets use content hashes:
 *
 *
 *     app.8f4a21.js
 *     styles.a92c10.css
 *
 *
 * they can often be cached for a very long time.
 *
 *
 * Example:
 */

app.use(
  "/immutable",
  express.static(staticDirectory, {
    maxAge: "1y",

    immutable: true,
  }),
);

/*
 * IMPORTANT:
 *
 * `immutable` should only be used when the URL identifies a
 * resource that will not change.
 *
 * Content-hashed filenames are a common solution.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. DOTFILES
 * ============================================================
 *
 * Dotfiles:
 *
 *     .env
 *     .gitignore
 *     .htaccess
 *
 *
 * You generally do NOT want sensitive dotfiles publicly served.
 *
 *
 * express.static() has dotfile handling options.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. NEVER SERVE YOUR PROJECT ROOT
 * ============================================================
 *
 * BAD:
 *
 *     app.use(
 *       express.static(__dirname)
 *     );
 *
 *
 * This may expose files that were never intended to be public.
 *
 *
 * Better:
 *
 *     app.use(
 *       express.static(
 *         path.join(__dirname, "public")
 *       )
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. PUBLIC DIRECTORY DESIGN
 * ============================================================
 *
 * Recommended:
 *
 *
 *     project/
 *     │
 *     ├── src/
 *     │   ├── routes/
 *     │   ├── controllers/
 *     │   └── services/
 *     │
 *     ├── public/
 *     │   ├── index.html
 *     │   ├── css/
 *     │   ├── js/
 *     │   ├── images/
 *     │   └── fonts/
 *     │
 *     └── package.json
 *
 *
 * Only `public/` is exposed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. STATIC IMAGES
 * ============================================================
 *
 * Suppose:
 *
 *     public/images/logo.png
 *
 *
 * HTML:
 *
 *
 *     <img
 *       src="/images/logo.png"
 *       alt="Logo"
 *     >
 *
 *
 * Express maps:
 *
 *     /images/logo.png
 *
 * to:
 *
 *     public/images/logo.png
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. STATIC CSS
 * ============================================================
 *
 * File:
 *
 *     public/css/style.css
 *
 *
 * HTML:
 *
 *
 *     <link
 *       rel="stylesheet"
 *       href="/css/style.css"
 *     >
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. STATIC JAVASCRIPT
 * ============================================================
 *
 * File:
 *
 *     public/js/app.js
 *
 *
 * HTML:
 *
 *
 *     <script
 *       src="/js/app.js"
 *     ></script>
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. SPA SUPPORT
 * ============================================================
 *
 * Single Page Applications often use client-side routing.
 *
 * Example:
 *
 *     React
 *     Vue
 *     Angular
 *
 *
 * Browser URL:
 *
 *     /dashboard
 *
 *
 * The browser expects the server to return the application's
 * index.html, and the frontend router then handles:
 *
 *     /dashboard
 *
 *
 *     /users
 *
 *     /settings
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. SPA FALLBACK
 * ============================================================
 *
 * A common architecture is:
 *
 *
 *     public/
 *       ├── index.html
 *       ├── assets/
 *       └── ...
 *
 *
 *     app.use(
 *       express.static(publicDirectory)
 *     );
 *
 *
 *     app.get(
 *       "*",
 *       (req, res) => {
 *         res.sendFile(
 *           path.join(
 *             publicDirectory,
 *             "index.html"
 *           )
 *         );
 *       }
 *     );
 *
 *
 * The exact wildcard syntax can vary with the Express/router
 * version, so verify it against the version used by your project.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. res.sendFile()
 * ============================================================
 *
 * Express can explicitly send a file:
 *
 */

app.get("/manual-index", (req, res) => {
  res.sendFile(path.join(staticDirectory, "index.html"));
});

/*
 * Difference:
 *
 *
 * express.static()
 *     ↓
 *     General static-file middleware
 *
 *
 * res.sendFile()
 *     ↓
 *     Explicitly send one file from a route
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. res.download()
 * ============================================================
 *
 * Express also supports sending a file as a download.
 *
 *
 * Example:
 *
 *
 *     res.download(
 *       filePath,
 *       "report.pdf"
 *     );
 *
 *
 * This is useful when implementing file-download endpoints.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. STATIC FILES VS DYNAMIC RESPONSES
 * ============================================================
 *
 *
 * STATIC
 *
 *     public/logo.png
 *          ↓
 *     express.static()
 *          ↓
 *     file
 *
 *
 * DYNAMIC
 *
 *     GET /api/users
 *          ↓
 *     controller
 *          ↓
 *     database
 *          ↓
 *     JSON
 *
 *
 * Static files usually do not require database access.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. STATIC FILES VS API
 * ============================================================
 *
 *
 * Browser assets:
 *
 *     /assets/app.js
 *     /assets/style.css
 *     /images/logo.png
 *
 *
 * API:
 *
 *     /api/users
 *     /api/products
 *     /api/auth/login
 *
 *
 * Keep the responsibilities conceptually separate.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. MULTIPLE STATIC DIRECTORIES
 * ============================================================
 *
 * Express can serve multiple directories.
 *
 */

const publicDirectory = path.join(__dirname, "public");

const uploadsDirectory = path.join(__dirname, "uploads");

app.use(express.static(publicDirectory));

app.use("/uploads", express.static(uploadsDirectory));

/*
 * Now:
 *
 *     public/logo.png
 *
 * becomes:
 *
 *     /logo.png
 *
 *
 * and:
 *
 *     uploads/avatar.png
 *
 * becomes:
 *
 *     /uploads/avatar.png
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. STATIC FILE ORDER
 * ============================================================
 *
 * Middleware order matters.
 *
 *
 *     app.use(
 *       express.static(publicDirectory)
 *     );
 *
 *
 *     app.use(
 *       "/uploads",
 *       express.static(uploadsDirectory)
 *     );
 *
 *
 *     app.use("/api", apiRouter);
 *
 *
 *     app.use(notFoundHandler);
 *
 *
 *     app.use(errorHandler);
 *
 *
 * Put middleware in an intentional order.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. SECURITY: UPLOADS
 * ============================================================
 *
 * User-uploaded files require additional security decisions.
 *
 * Do not assume:
 *
 *     uploaded filename = safe filename
 *
 *
 * Validate:
 *
 *     file type
 *     file size
 *     filename
 *     storage path
 *
 *
 * Consider:
 *
 *     malware scanning
 *     object storage
 *     signed URLs
 *     access control
 *     content disposition
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. SECURITY: PATH TRAVERSAL
 * ============================================================
 *
 * Dangerous user input:
 *
 *     ../../secret.txt
 *
 *
 * Never construct arbitrary file paths directly from untrusted
 * input without validation and containment checks.
 *
 *
 * Prefer controlled file identifiers and known directories.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. SECURITY: SENSITIVE FILES
 * ============================================================
 *
 * Never put these inside a publicly served directory:
 *
 *
 *     .env
 *     private keys
 *     database backups
 *     application source secrets
 *     internal configuration
 *     credentials
 *
 *
 * Public directory means:
 *
 *     "The client may request this."
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. CONTENT TYPES
 * ============================================================
 *
 * Static middleware determines appropriate Content-Type headers
 * based on the file.
 *
 *
 * Examples:
 *
 *     .html → text/html
 *     .css  → text/css
 *     .js   → JavaScript media type
 *     .json → application/json
 *     .png  → image/png
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. RANGE REQUESTS
 * ============================================================
 *
 * Static file serving can support byte-range requests.
 *
 * This matters for:
 *
 *     video
 *     audio
 *     large files
 *
 *
 * Clients can request only part of a file.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. HEAD REQUESTS
 * ============================================================
 *
 * Static resources can also be requested using HEAD.
 *
 * The client receives headers without the response body.
 *
 * Useful for checking:
 *
 *     Content-Length
 *     Content-Type
 *     Last-Modified
 *     caching information
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. ETAG
 * ============================================================
 *
 * Static file responses can use entity tags (ETags) for cache
 * validation.
 *
 *
 * Browser:
 *
 *     If-None-Match
 *
 *
 * Server:
 *
 *     ETag
 *
 *
 * If the resource has not changed, the server can respond:
 *
 *     304 Not Modified
 *
 *
 * This reduces unnecessary data transfer.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. LAST-MODIFIED
 * ============================================================
 *
 * Static file responses can also participate in
 * Last-Modified-based caching.
 *
 *
 * Browser:
 *
 *     If-Modified-Since
 *
 *
 * Server:
 *
 *     Last-Modified
 *
 *
 * Unchanged resources can result in:
 *
 *     304 Not Modified
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. PRODUCTION ARCHITECTURE
 * ============================================================
 *
 * For small applications:
 *
 *
 *     Client
 *       ↓
 *     Express
 *       ↓
 *     express.static()
 *
 *
 *
 * For larger production systems:
 *
 *
 *     Client
 *       ↓
 *     CDN
 *       ↓
 *     Reverse Proxy
 *       ↓
 *     Application
 *
 *
 * Static assets are often better served by a CDN rather than
 * consuming application-server resources.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. CDN ARCHITECTURE
 * ============================================================
 *
 *
 * Browser
 *    │
 *    ↓
 * CDN
 *    │
 *    ├── Cache HIT
 *    │      ↓
 *    │    Asset
 *    │
 *    └── Cache MISS
 *           ↓
 *        Origin
 *           ↓
 *        Asset
 *
 *
 * This reduces traffic to your Node.js application.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. STATIC ASSET VERSIONING
 * ============================================================
 *
 * Bad:
 *
 *     /app.js
 *
 *
 * Better:
 *
 *     /app.v2.js
 *
 *
 * Even better in modern build systems:
 *
 *     /assets/app.8f4a21.js
 *
 *
 * When the content changes, the filename changes.
 *
 * This makes aggressive caching safe.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. CACHE STRATEGY
 * ============================================================
 *
 *
 * HTML
 *     ↓
 *     Usually short/no-cache depending on deployment
 *
 *
 * Hashed JS/CSS
 *     ↓
 *     Long-lived cache
 *
 *
 * Images
 *     ↓
 *     Depends on whether URLs are immutable
 *
 *
 * API responses
 *     ↓
 *     Controlled separately
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. COMMON MISTAKES
 * ============================================================
 *
 * ❌ Serving the project root
 *
 * ❌ Putting .env in public/
 *
 * ❌ Trusting upload filenames
 *
 * ❌ No upload-size limits
 *
 * ❌ No MIME/type validation
 *
 * ❌ Incorrect cache configuration
 *
 * ❌ Using relative paths without understanding cwd
 *
 * ❌ Mixing SPA fallback with API routes incorrectly
 *
 * ❌ Serving private files as public assets
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. STATIC FILE REQUEST FLOW
 * ============================================================
 *
 *
 * Browser
 *    │
 *    │ GET /images/logo.png
 *    ↓
 * Express
 *    │
 *    ↓
 * express.static()
 *    │
 *    ↓
 * public/images/logo.png
 *    │
 *    ├── exists ───────→ Response 200
 *    │
 *    └── missing ──────→ next()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. STATIC + API ARCHITECTURE
 * ============================================================
 *
 *
 *                  EXPRESS
 *                     │
 *          ┌──────────┴──────────┐
 *          │                     │
 *          ↓                     ↓
 *      Static Assets           API
 *          │                     │
 *          ↓                     ↓
 *     HTML/CSS/JS             Routes
 *                                │
 *                                ↓
 *                           Controllers
 *                                │
 *                                ↓
 *                            Services
 *                                │
 *                                ↓
 *                           Database
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. MINI APPLICATION
 * ============================================================
 *
 * A common setup:
 *
 *
 *     project/
 *     ├── src/
 *     │   └── server.js
 *     └── public/
 *         ├── index.html
 *         ├── css/
 *         │   └── style.css
 *         └── js/
 *             └── app.js
 *
 *
 * server.js:
 *
 *
 *     app.use(
 *       express.static(
 *         path.join(__dirname, "../public")
 *       )
 *     );
 *
 *
 * API:
 *
 *
 *     app.get(
 *       "/api/health",
 *       ...
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. STATIC FILES AND NODE.JS
 * ============================================================
 *
 * express.static() is built on top of Node.js HTTP/file-system
 * functionality.
 *
 *
 * Conceptually:
 *
 *
 *     HTTP request
 *          ↓
 *     Express middleware
 *          ↓
 *     File-system lookup
 *          ↓
 *     File metadata
 *          ↓
 *     HTTP headers
 *          ↓
 *     File stream
 *          ↓
 *     Client
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. WHEN TO USE OBJECT STORAGE
 * ============================================================
 *
 * For large production systems, consider:
 *
 *     Amazon S3
 *     Google Cloud Storage
 *     Azure Blob Storage
 *     compatible object storage
 *
 *
 * instead of storing every uploaded file on the application
 * server's local filesystem.
 *
 *
 * Reasons:
 *
 *     scalability
 *     durability
 *     CDN integration
 *     separation of compute/storage
 *     easier horizontal scaling
 *
 * ============================================================
 */

/*
 * ============================================================
 * 46. HORIZONTAL SCALING PROBLEM
 * ============================================================
 *
 * Suppose:
 *
 *
 *       Load Balancer
 *          /     \
 *         ↓       ↓
 *      Node A   Node B
 *
 *
 * User uploads:
 *
 *     avatar.png
 *
 * to Node A.
 *
 *
 * Later request goes to Node B.
 *
 * Node B may not have:
 *
 *     avatar.png
 *
 *
 * This is why shared/object storage is commonly used in
 * distributed applications.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 47. FINAL RULES
 * ============================================================
 *
 * 1. Use express.static() for static assets.
 *
 * 2. Expose only intentional public directories.
 *
 * 3. Prefer absolute paths for predictable deployments.
 *
 * 4. Never expose secrets through static serving.
 *
 * 5. Validate uploaded files.
 *
 * 6. Configure caching intentionally.
 *
 * 7. Use hashed filenames for long-lived assets.
 *
 * 8. Consider a CDN for production static assets.
 *
 * 9. Use object storage for scalable file storage.
 *
 * 10. Keep API routes and static assets conceptually separate.
 *
 * ============================================================
 *
 * CORE IDEA:
 *
 *     express.static(directory)
 *
 * means:
 *
 *     "Serve files from this directory directly over HTTP."
 *
 * ============================================================
 *
 * NEXT:
 *
 *     19_rest_api/crud/
 *
 * ============================================================
 */
