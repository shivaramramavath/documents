/**
 * ============================================================
 * Node.js Mastery
 * ============================================================
 *
 * File: 01_what_is_node.js
 *
 * Topic:
 * What is Node.js?
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. What is Node.js?
 * ============================================================
 *
 * Node.js is a JavaScript runtime environment that allows us
 * to execute JavaScript outside of a web browser.
 *
 * JavaScript is the programming language.
 * Node.js is the runtime environment that executes JavaScript.
 *
 * Example:
 *
 * Browser:
 *     JavaScript → Browser → JavaScript Engine
 *
 * Node.js:
 *     JavaScript → Node.js → V8 JavaScript Engine
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. JavaScript vs Node.js
 * ============================================================
 *
 * JavaScript:
 *     - Programming language
 *
 * Node.js:
 *     - Runtime environment
 *     - Executes JavaScript outside the browser
 *     - Provides APIs for backend/system programming
 *
 * Node.js provides APIs for things like:
 *
 *     - File System
 *     - Operating System
 *     - HTTP
 *     - Networking
 *     - Cryptography
 *     - Streams
 *     - Processes
 *     - Environment Variables
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. V8 JavaScript Engine
 * ============================================================
 *
 * Node.js uses Google's V8 JavaScript engine.
 *
 * V8 is the JavaScript engine used by Google Chrome.
 *
 * V8 is responsible for executing JavaScript code.
 *
 * Simplified architecture:
 *
 *     Your JavaScript
 *           ↓
 *        Node.js
 *           ↓
 *          V8
 *           ↓
 *    Machine Instructions
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Why Node.js?
 * ============================================================
 *
 * Node.js allows JavaScript to be used for backend development.
 *
 * We can build:
 *
 *     - Web servers
 *     - REST APIs
 *     - Backend applications
 *     - CLI applications
 *     - Real-time applications
 *     - WebSocket servers
 *     - Microservices
 *     - Automation tools
 *     - File processing applications
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Browser JavaScript vs Node.js
 * ============================================================
 *
 * Browser JavaScript provides APIs such as:
 *
 *     window
 *     document
 *     localStorage
 *     DOM
 *
 * Example:
 *
 *     document.querySelector("#app");
 *
 * These APIs are provided by the browser.
 *
 *
 * Node.js provides different APIs:
 *
 *     process
 *     fs
 *     os
 *     path
 *     http
 *     crypto
 *
 * Example:
 *
 *     process.version
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Node.js can interact with the Operating System
 * ============================================================
 *
 * Node.js provides built-in modules that allow us to interact
 * with the operating system.
 *
 * Example modules:
 *
 *     os
 *     fs
 *     path
 *     process
 *
 * We will learn each of these modules in detail later.
 *
 * ============================================================
 */

const os = require("os");

console.log("Operating System:", os.platform());
console.log("CPU Architecture:", os.arch());

/*
 * ============================================================
 * 7. Node.js process
 * ============================================================
 *
 * Node.js provides a global object called `process`.
 *
 * It gives information about and control over the
 * current Node.js process.
 *
 * Some useful properties:
 *
 *     process.version
 *     process.platform
 *     process.arch
 *     process.pid
 *
 * ============================================================
 */

console.log("Node.js Version:", process.version);
console.log("Platform:", process.platform);
console.log("Architecture:", process.arch);
console.log("Process ID:", process.pid);

/*
 * ============================================================
 * 8. Node.js and Asynchronous I/O
 * ============================================================
 *
 * One of Node.js's important characteristics is its
 * asynchronous, non-blocking I/O model.
 *
 * I/O means Input/Output operations such as:
 *
 *     - Reading files
 *     - Database queries
 *     - HTTP requests
 *     - Network communication
 *     - Redis operations
 *     - Kafka operations
 *
 * Node.js uses an Event Loop to coordinate asynchronous work.
 *
 * We will study this deeply later.
 *
 * Simplified:
 *
 *     JavaScript
 *         ↓
 *     Event Loop
 *         ↓
 *     Asynchronous I/O
 *         ↓
 *     Callback / Promise
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Node.js can create HTTP servers
 * ============================================================
 *
 * Node.js has a built-in `http` module.
 *
 * Example:
 *
 *     const http = require("http");
 *
 *     const server = http.createServer((req, res) => {
 *         res.end("Hello from Node.js");
 *     });
 *
 *     server.listen(3000);
 *
 * This allows Node.js to act as a web server.
 *
 * We will learn HTTP servers in:
 *
 *     08_http/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. What can we build with Node.js?
 * ============================================================
 *
 * Example backend architecture:
 *
 *     Client
 *        ↓
 *     Node.js
 *        ↓
 *     Express
 *        ↓
 *     MongoDB
 *
 *
 * Authentication:
 *
 *     Client
 *        ↓
 *     Node.js
 *        ↓
 *     bcrypt
 *        ↓
 *     JWT
 *        ↓
 *     MongoDB
 *
 *
 * Real-time application:
 *
 *     Client
 *        ↕
 *     WebSocket
 *        ↕
 *     Node.js
 *        ↕
 *     Redis
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Important distinction
 * ============================================================
 *
 * ❌ Node.js is NOT a programming language.
 *
 * ❌ Node.js is NOT JavaScript.
 *
 * ✅ JavaScript is the programming language.
 *
 * ✅ Node.js is a runtime environment for JavaScript.
 *
 * Remember:
 *
 *     JavaScript
 *          ↓
 *     Programming Language
 *
 *     Node.js
 *          ↓
 *     Runtime Environment
 *
 *     V8
 *          ↓
 *     JavaScript Engine
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Simple Definition
 * ============================================================
 *
 * Node.js is an open-source, cross-platform JavaScript runtime
 * environment built around the V8 JavaScript engine.
 *
 * It allows JavaScript to run outside the browser and provides
 * APIs for backend and system-level operations such as files,
 * networking, HTTP, operating-system interaction, streams,
 * processes, and cryptography.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Run this file
 * ============================================================
 *
 * From the project root:
 *
 *     node 00_node_basics/01_what_is_node.js
 *
 * Windows PowerShell:
 *
 *     node .\00_node_basics\01_what_is_node.js
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
 * 2. Node.js is a JavaScript runtime environment.
 *
 * 3. Node.js uses the V8 JavaScript engine.
 *
 * 4. Node.js allows JavaScript to run outside the browser.
 *
 * 5. Node.js provides APIs for system and backend operations.
 *
 * 6. Node.js is heavily used for I/O-oriented applications.
 *
 * 7. Node.js uses an Event Loop and asynchronous I/O model.
 *
 * 8. Node.js can be used to build APIs, servers, CLIs,
 *    real-time applications, and microservices.
 *
 * ============================================================
 */
