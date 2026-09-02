/**
 * ============================================================
 * Node.js Modules - CommonJS
 * ============================================================
 *
 * File: require.js
 *
 * Topic:
 * require()
 *
 * ============================================================
 *
 * CommonJS is one of the module systems supported by Node.js.
 *
 * The main CommonJS keywords/objects are:
 *
 *     require()
 *     module
 *     module.exports
 *     exports
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. What is require()?
 * ============================================================
 *
 * `require()` loads another module into the current module.
 *
 *
 * Example:
 *
 *     const path = require("node:path");
 *
 *
 * Here:
 *
 *     node:path
 *
 * is a Node.js built-in module.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Loading a built-in Node.js module
 * ============================================================
 */

const os = require("node:os");

console.log(os.platform());

/*
 * `require()` loads the `os` module.
 *
 * We can then use:
 *
 *     os.platform()
 *     os.arch()
 *     os.cpus()
 *     os.totalmem()
 *     os.freemem()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Loading another local module
 * ============================================================
 *
 * Suppose we have:
 *
 *
 *     commonjs/
 *     ├── require.js
 *     └── math.js
 *
 *
 * math.js:
 *
 *
 *     module.exports = {
 *       add(a, b) {
 *         return a + b;
 *       },
 *     };
 *
 *
 * require.js:
 *
 *
 *     const math = require("./math");
 *
 *
 * ============================================================
 *
 * IMPORTANT:
 *
 * `./` means the local/current directory.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. require() returns the exported value
 * ============================================================
 *
 * If another module contains:
 *
 *
 *     module.exports = "Hello";
 *
 *
 * then:
 *
 *
 *     const value = require("./module");
 *
 *
 * gives:
 *
 *
 *     value === "Hello"
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. require() can return a function
 * ============================================================
 *
 * Example module:
 *
 *
 *     module.exports = function greet(name) {
 *       return `Hello ${name}`;
 *     };
 *
 *
 * Importing it:
 *
 *
 *     const greet = require("./greet");
 *
 *
 * Then:
 *
 *
 *     greet("Shiva");
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. require() can return an object
 * ============================================================
 *
 * Example:
 *
 *
 *     module.exports = {
 *       add,
 *       subtract,
 *     };
 *
 *
 * Then:
 *
 *
 *     const math = require("./math");
 *
 *
 *     math.add(10, 20);
 *     math.subtract(20, 10);
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Destructuring a required module
 * ============================================================
 *
 * If a module exports:
 *
 *
 *     module.exports = {
 *       add,
 *       subtract,
 *     };
 *
 *
 * You can write:
 *
 *
 *     const {
 *       add,
 *       subtract,
 *     } = require("./math");
 *
 *
 * Instead of:
 *
 *
 *     const math = require("./math");
 *
 *     math.add();
 *     math.subtract();
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Requiring npm packages
 * ============================================================
 *
 * If a package is installed:
 *
 *
 *     npm install bcryptjs
 *
 *
 * you can load it using:
 *
 *
 *     const bcrypt = require("bcryptjs");
 *
 *
 * The package name does NOT start with "./".
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Local vs package vs built-in
 * ============================================================
 *
 *
 * BUILT-IN MODULE:
 *
 *     require("node:fs")
 *
 *
 * LOCAL MODULE:
 *
 *     require("./utils")
 *
 *
 * PARENT DIRECTORY MODULE:
 *
 *     require("../config")
 *
 *
 * NPM PACKAGE:
 *
 *     require("bcryptjs")
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. require() is synchronous
 * ============================================================
 *
 * CommonJS `require()` loads modules synchronously.
 *
 *
 * Example:
 *
 *
 *     const config = require("./config");
 *
 *
 * The current module waits for the required module to be
 * loaded and initialized.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Module execution
 * ============================================================
 *
 * When a module is required for the first time, Node.js:
 *
 *
 *     1. Finds the module.
 *
 *     2. Loads the module.
 *
 *     3. Wraps/initializes the module.
 *
 *     4. Executes the module code.
 *
 *     5. Gets module.exports.
 *
 *     6. Caches the module.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Module caching
 * ============================================================
 *
 * CommonJS modules are cached after their first load.
 *
 *
 * Concept:
 *
 *
 *     require("./config")
 *             ↓
 *        Execute once
 *             ↓
 *          Cache
 *             ↓
 *     require("./config")
 *             ↓
 *        Cached value
 *
 *
 * This means the module's initialization code normally runs
 * only once per process/module cache.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Practical example of caching
 * ============================================================
 *
 * Imagine:
 *
 *
 * counter.js
 *
 *
 *     let count = 0;
 *
 *     count++;
 *
 *     module.exports = count;
 *
 *
 * If required multiple times, the same cached module result
 * can be reused.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. require cache
 * ============================================================
 *
 * CommonJS exposes its module cache through:
 *
 *
 *     require.cache
 *
 *
 * You can inspect it:
 */

console.log(Object.keys(require.cache));

/*
 * This is mainly useful for debugging and advanced tooling.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Removing a module from cache
 * ============================================================
 *
 * You can technically remove a module:
 *
 *
 *     delete require.cache[
 *       require.resolve("./some-module")
 *     ];
 *
 *
 * The next require() can then load the module again.
 *
 *
 * This is an advanced technique and should not be used
 * casually in application code.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. require.resolve()
 * ============================================================
 *
 * `require.resolve()` tells Node.js how a module would be
 * resolved.
 *
 *
 * Example:
 *
 *
 *     console.log(
 *       require.resolve("node:fs")
 *     );
 *
 *
 * For local/npm modules, it can be useful when debugging
 * module resolution.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Important CommonJS mental model
 * ============================================================
 *
 *
 * File A
 *   │
 *   │ require()
 *   ▼
 * File B
 *   │
 *   │ module.exports
 *   ▼
 * File A
 *
 *
 * `require()` gets whatever File B assigned to
 * `module.exports`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Backend example
 * ============================================================
 *
 * Imagine:
 *
 *
 *     controllers/
 *     └── user.controller.js
 *
 *     services/
 *     └── user.service.js
 *
 *
 * Controller:
 *
 *
 *     const userService =
 *       require("../services/user.service");
 *
 *
 * Service:
 *
 *
 *     module.exports = {
 *       getUser,
 *       createUser,
 *     };
 *
 *
 * This is how modules form application layers.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. CommonJS vs ESM
 * ============================================================
 *
 *
 * COMMONJS:
 *
 *     const fs = require("node:fs");
 *
 *
 * ESM:
 *
 *     import fs from "node:fs";
 *
 *
 * CommonJS:
 *
 *     module.exports = value;
 *
 *
 * ESM:
 *
 *     export default value;
 *
 *
 * We will study ESM in the next directory.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Important points
 * ============================================================
 *
 * ✓ require() loads modules.
 *
 * ✓ require() returns module.exports.
 *
 * ✓ CommonJS modules are normally cached.
 *
 * ✓ `./` means a local relative module.
 *
 * ✓ `node:` identifies Node.js built-in modules.
 *
 * ✓ npm packages are loaded using their package name.
 *
 * ✓ CommonJS require() is synchronous.
 *
 * ✓ module.exports controls what another module receives.
 *
 * ============================================================
 */
