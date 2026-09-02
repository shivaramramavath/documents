/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 03_node_vs_browser.js
 *
 * Topic:
 * Node.js vs Browser
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. JavaScript is the same language
 * ============================================================
 *
 * JavaScript is a programming language.
 *
 * It can run in different environments:
 *
 *     JavaScript
 *        │
 *        ├── Browser
 *        │
 *        └── Node.js
 *
 * The language is JavaScript in both cases.
 *
 * But the APIs provided by each environment are different.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Browser Runtime
 * ============================================================
 *
 * When JavaScript runs inside a browser such as Chrome,
 * the browser provides APIs for interacting with web pages.
 *
 * Examples:
 *
 *     window
 *     document
 *     localStorage
 *     sessionStorage
 *     fetch
 *     navigator
 *     location
 *
 * Example:
 *
 *     document.querySelector("#app");
 *
 * `document` is provided by the browser.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Node.js Runtime
 * ============================================================
 *
 * Node.js runs JavaScript outside the browser.
 *
 * Node.js provides APIs for backend and system operations.
 *
 * Examples:
 *
 *     process
 *     fs
 *     os
 *     path
 *     http
 *     crypto
 *     Buffer
 *
 * Example:
 */

console.log("Node.js version:", process.version);

/*
 * `process` is a Node.js global object.
 *
 * It provides information about the currently running
 * Node.js process.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. `window` does not normally exist in Node.js
 * ============================================================
 *
 * Browser:
 *
 *     window
 *
 * Node.js:
 *
 *     No browser `window` object.
 *
 * We can safely check whether it exists:
 */

console.log("Does window exist?");

console.log(typeof window);

/*
 * Expected output:
 *
 *     undefined
 *
 * This is because Node.js is not a browser.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. `document` does not normally exist in Node.js
 * ============================================================
 *
 * Browser:
 *
 *     document
 *
 * Node.js:
 *
 *     No browser DOM.
 *
 * Check:
 */

console.log("Does document exist?");
console.log(typeof document);

/*
 * Expected output:
 *
 *     undefined
 *
 * Node.js does not provide the browser DOM by default.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. What is the DOM?
 * ============================================================
 *
 * DOM = Document Object Model
 *
 * Browsers create a representation of an HTML document.
 *
 * Example HTML:
 *
 *     <body>
 *         <h1>Hello</h1>
 *     </body>
 *
 * Browser JavaScript can access it:
 *
 *     document.querySelector("h1");
 *
 * Node.js does not have this browser DOM by default.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Node.js `process`
 * ============================================================
 *
 * Node.js provides the global `process` object.
 *
 * It gives information about the current process.
 *
 * Example:
 */

console.log("Node.js version:", process.version);
console.log("Operating system:", process.platform);
console.log("CPU architecture:", process.arch);
console.log("Process ID:", process.pid);

/*
 * ============================================================
 * 8. Node.js `global`
 * ============================================================
 *
 * Node.js has a global object called `global`.
 *
 * Browser JavaScript historically uses:
 *
 *     window
 *
 * Node.js uses:
 *
 *     global
 *
 * Modern JavaScript provides:
 *
 *     globalThis
 *
 * `globalThis` is a standard way to access the global object.
 *
 * ============================================================
 */

console.log("Node global object exists:", typeof global);
console.log("globalThis exists:", typeof globalThis);

/*
 * ============================================================
 * 9. globalThis
 * ============================================================
 *
 * `globalThis` works across JavaScript environments.
 *
 * Browser:
 *
 *     globalThis → window
 *
 * Node.js:
 *
 *     globalThis → Node.js global object
 *
 * Example:
 */

console.log(globalThis === global);

/*
 * Expected output in Node.js:
 *
 *     true
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. File System
 * ============================================================
 *
 * Node.js can directly work with files using the `fs` module.
 *
 * Example:
 */

const fs = require("fs");

console.log("Current file:", __filename);
console.log("Current directory:", __dirname);

/*
 * `__filename`:
 *
 *     Absolute path of the current file.
 *
 * `__dirname`:
 *
 *     Absolute path of the current directory.
 *
 * These are CommonJS-specific Node.js variables.
 *
 * We will study CommonJS and ES Modules later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Operating System
 * ============================================================
 *
 * Node.js provides the `os` module.
 *
 * It allows us to get information about the operating system.
 *
 * Example:
 */

const os = require("os");

console.log("Operating system:", os.platform());
console.log("CPU architecture:", os.arch());
console.log("CPU count:", os.cpus().length);

/*
 * Browser JavaScript does not provide the same level of
 * operating-system access.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. HTTP
 * ============================================================
 *
 * Node.js can create HTTP servers using its built-in
 * `http` module.
 *
 * Example:
 *
 *     const http = require("http");
 *
 *     const server = http.createServer((req, res) => {
 *         res.end("Hello");
 *     });
 *
 *     server.listen(3000);
 *
 * This is one of the reasons Node.js is widely used for
 * backend development.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Browser `fetch()` vs Node.js networking
 * ============================================================
 *
 * Modern Node.js also provides `fetch()`.
 *
 * This means some APIs that were historically browser-only
 * are now available in Node.js as well.
 *
 * Example:
 *
 *     const response = await fetch("https://example.com");
 *
 * However, having `fetch()` does NOT make Node.js a browser.
 *
 * Node.js still does not provide the browser DOM.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Environment Variables
 * ============================================================
 *
 * Node.js provides environment variables through:
 *
 *     process.env
 *
 * Example:
 */

console.log("NODE_ENV:", process.env.NODE_ENV);

/*
 * Environment variables are commonly used for:
 *
 *     - Database URLs
 *     - API keys
 *     - JWT secrets
 *     - Application configuration
 *     - Port numbers
 *
 * Example:
 *
 *     process.env.PORT
 *     process.env.MONGODB_URI
 *     process.env.JWT_SECRET
 *
 * We will study this properly later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Browser vs Node.js
 * ============================================================
 *
 * ------------------------------------------------------------
 * Feature             Browser          Node.js
 * ------------------------------------------------------------
 *
 * JavaScript          Yes              Yes
 *
 * V8                  Yes*             Yes
 *
 * DOM                 Yes              No
 *
 * window              Yes              No
 *
 * document            Yes              No
 *
 * process              No              Yes
 *
 * fs                   No              Yes
 *
 * os                   No              Yes
 *
 * path                 No              Yes
 *
 * http server          No              Yes
 *
 * Buffer               No**            Yes
 *
 * localStorage         Yes              No
 *
 * navigator             Yes              No
 *
 * ============================================================
 *
 * * Chrome uses V8; other browsers use different engines.
 *
 * ** Browsers have ArrayBuffer and related binary APIs, but
 *    Node.js provides its own `Buffer` abstraction.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Browser Architecture
 * ============================================================
 *
 *             Browser
 *                │
 *        ┌───────┴────────┐
 *        │                │
 *   JavaScript Engine   Web APIs
 *        │                │
 *       V8             DOM
 *                      fetch
 *                      timers
 *                      storage
 *                      events
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Node.js Architecture
 * ============================================================
 *
 *             Node.js
 *                │
 *        ┌───────┴────────┐
 *        │                │
 *       V8           Node.js APIs
 *        │                │
 * JavaScript          fs
 * execution           os
 *                     path
 *                     http
 *                     crypto
 *                     streams
 *                        │
 *                       libuv
 *                        │
 *                   Operating System
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Same JavaScript, Different Environment
 * ============================================================
 *
 * The important concept is:
 *
 *     JavaScript ≠ Browser
 *
 *     JavaScript ≠ Node.js
 *
 * JavaScript is the language.
 *
 * Browser and Node.js are different runtime environments.
 *
 *
 *             JavaScript
 *                  │
 *        ┌─────────┴─────────┐
 *        │                   │
 *     Browser             Node.js
 *        │                   │
 *     DOM APIs           Node APIs
 *     Web APIs           System APIs
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Why this matters for backend development
 * ============================================================
 *
 * When building a Node.js backend, you should not think:
 *
 *     "Node.js is JavaScript in Chrome."
 *
 * Instead think:
 *
 *     "Node.js is a JavaScript runtime designed to run
 *      JavaScript outside the browser and interact with
 *      the operating system and network."
 *
 * This distinction becomes extremely important when working
 * with:
 *
 *     Express
 *     MongoDB
 *     Redis
 *     WebSockets
 *     Kafka
 *     File systems
 *     Authentication
 *     Microservices
 *
 * ============================================================
 */

/*
 * ============================================================
 * Key Takeaways
 * ============================================================
 *
 * 1. JavaScript is a programming language.
 *
 * 2. Browser and Node.js are different runtime environments.
 *
 * 3. Browsers provide the DOM and Web APIs.
 *
 * 4. Node.js provides APIs for backend/system operations.
 *
 * 5. `window` and `document` are browser concepts.
 *
 * 6. `process` and `global` are Node.js concepts.
 *
 * 7. Node.js can work with files, operating systems,
 *    networking, HTTP, cryptography, and streams.
 *
 * 8. Node.js does not normally have a browser DOM.
 *
 * 9. `globalThis` provides access to the global object in
 *    different JavaScript environments.
 *
 * 10. The same JavaScript language can run in many runtimes.
 *
 * ============================================================
 */

/*
 * ============================================================
 * Run:
 *
 *     node .\00_node_basics\03_node_vs_browser.js
 *
 * ============================================================
 */
