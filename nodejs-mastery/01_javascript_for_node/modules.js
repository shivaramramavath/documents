/**
 * ============================================================
 * JavaScript for Node.js
 * ============================================================
 *
 * File: modules.js
 *
 * Topic:
 * JavaScript Modules in Node.js
 *
 * ============================================================
 *
 * A module is a reusable unit of code.
 *
 * In Node.js, modules allow us to:
 *
 *     - split large applications into multiple files
 *     - reuse functions
 *     - hide implementation details
 *     - organize backend code
 *     - control what a file exposes
 *
 * Node.js supports two major module systems:
 *
 *     1. CommonJS
 *     2. ECMAScript Modules (ESM)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Why do we need modules?
 * ============================================================
 *
 * Imagine a backend containing:
 *
 *     server.js
 *     user.js
 *     auth.js
 *     database.js
 *     logger.js
 *     utils.js
 *
 *
 * We don't want every function inside one huge file.
 *
 * Instead:
 *
 *
 *     server.js
 *          │
 *          ├── user.service.js
 *          ├── auth.service.js
 *          ├── database.js
 *          └── logger.js
 *
 *
 * Each file becomes a module.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Node.js module scope
 * ============================================================
 *
 * Every Node.js module has its own scope.
 *
 * Example:
 */

const secret = "module-private-value";

console.log(secret);

/*
 * `secret` belongs to this module.
 *
 * Another module cannot automatically access it.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. CommonJS
 * ============================================================
 *
 * CommonJS is the traditional Node.js module system.
 *
 * Main syntax:
 *
 *     require()
 *     module.exports
 *     exports
 *
 * ============================================================
 *
 * Example:
 *
 *     user.js
 *
 *     function createUser(name) {
 *       return {
 *         name
 *       };
 *     }
 *
 *     module.exports = {
 *       createUser
 *     };
 *
 *
 * Then:
 *
 *     server.js
 *
 *     const {
 *       createUser
 *     } = require("./user");
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. require()
 * ============================================================
 *
 * `require()` imports a CommonJS module.
 *
 * Example:
 */

const path = require("node:path");

console.log(path.join("users", "shiva"));

/*
 * `node:path` is a built-in Node.js module.
 *
 * The `node:` prefix explicitly indicates a built-in module.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Importing a custom module
 * ============================================================
 *
 * Suppose we have:
 *
 *
 *     math.js
 *
 *     function add(a, b) {
 *       return a + b;
 *     }
 *
 *     module.exports = {
 *       add
 *     };
 *
 *
 * Then:
 *
 *
 *     const {
 *       add
 *     } = require("./math");
 *
 *
 * ============================================================
 *
 * We cannot demonstrate the actual import from a nonexistent
 * file here, so we'll create the equivalent concept below.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. module.exports
 * ============================================================
 *
 * `module.exports` defines what another module receives when
 * it uses `require()`.
 *
 * ============================================================
 */

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = {
  add,
  subtract,
};

/*
 * IMPORTANT:
 *
 * This line changes what this file exports.
 *
 * If another CommonJS file does:
 *
 *     const math = require("./modules");
 *
 *
 * it receives:
 *
 *     {
 *       add,
 *       subtract
 *     }
 *
 * ============================================================
 *
 * Because this file itself now exports those functions,
 * don't expect the examples after this point to run normally
 * if this file is executed directly.
 *
 * The remaining examples are intentionally comments/examples
 * so this file can serve as a reference.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Export one function
 * ============================================================
 *
 * You can export a single value:
 *
 *
 *     module.exports = add;
 *
 *
 * Then another file can do:
 *
 *
 *     const add = require("./math");
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Export an object
 * ============================================================
 */

const mathExample = {
  add,
  subtract,
};

/*
 * Equivalent CommonJS:
 *
 *     module.exports = {
 *       add,
 *       subtract
 *     };
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Export multiple functions
 * ============================================================
 *
 * Example:
 *
 *
 *     function createUser() {}
 *
 *     function deleteUser() {}
 *
 *     function findUser() {}
 *
 *
 *     module.exports = {
 *       createUser,
 *       deleteUser,
 *       findUser
 *     };
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. `exports`
 * ============================================================
 *
 * Node.js provides:
 *
 *     exports
 *
 * as a reference to `module.exports`.
 *
 *
 * Example:
 *
 *
 *     exports.add = add;
 *     exports.subtract = subtract;
 *
 *
 * This is equivalent to:
 *
 *
 *     module.exports.add = add;
 *     module.exports.subtract = subtract;
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Important difference:
 *
 *     exports
 *     vs
 *     module.exports
 * ============================================================
 *
 * Initially:
 *
 *
 *     exports === module.exports
 *
 *
 * They refer to the same object.
 *
 *
 * Therefore:
 *
 *
 *     exports.add = add;
 *
 *
 * works.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Dangerous `exports =`
 * ============================================================
 *
 * This is WRONG:
 *
 *
 *     exports = {
 *       add
 *     };
 *
 *
 * Why?
 *
 * Because now `exports` points to a different object.
 *
 * `module.exports` is still pointing to the original object.
 *
 *
 * Correct:
 *
 *
 *     module.exports = {
 *       add
 *     };
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Prefer module.exports
 * ============================================================
 *
 * In professional Node.js applications, many developers
 * prefer:
 *
 *
 *     module.exports = {
 *       createUser,
 *       deleteUser
 *     };
 *
 *
 * because it makes the export relationship explicit.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Destructuring imported modules
 * ============================================================
 *
 * If a module exports:
 *
 *
 *     module.exports = {
 *       createUser,
 *       deleteUser
 *     };
 *
 *
 * We can import:
 *
 *
 *     const {
 *       createUser,
 *       deleteUser
 *     } = require("./user");
 *
 *
 * This combines:
 *
 *     CommonJS
 *
 * with:
 *
 *     object destructuring
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Import entire module
 * ============================================================
 *
 * Instead of destructuring:
 *
 *
 *     const {
 *       createUser
 *     } = require("./user");
 *
 *
 * you can do:
 *
 *
 *     const userService =
 *       require("./user");
 *
 *
 * Then:
 *
 *
 *     userService.createUser();
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Built-in Node.js modules
 * ============================================================
 *
 * Node.js includes many modules without installing packages.
 *
 * Examples:
 *
 *     node:fs
 *     node:path
 *     node:os
 *     node:crypto
 *     node:http
 *     node:events
 *     node:stream
 *     node:url
 *
 * ============================================================
 */

/*
 * Example:
 */

const os = require("node:os");

console.log(os.platform());

/*
 * ============================================================
 */

/*
 * ============================================================
 * 17. Local modules
 * ============================================================
 *
 * Local modules use a path:
 *
 *
 *     require("./utils");
 *
 *
 * or:
 *
 *
 *     require("../utils");
 *
 *
 * `./` means current directory.
 *
 * `../` means parent directory.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Package modules
 * ============================================================
 *
 * Installed npm packages can be imported using their package
 * name.
 *
 * Example:
 *
 *
 *     const express =
 *       require("express");
 *
 *
 * Node.js searches for the package in:
 *
 *
 *     node_modules/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. CommonJS file resolution
 * ============================================================
 *
 * When you write:
 *
 *
 *     require("./utils");
 *
 *
 * Node.js attempts to resolve the module.
 *
 * Depending on the module type and resolution rules, it may
 * resolve a corresponding file/package entry.
 *
 * Prefer explicit filenames/extensions when they improve
 * clarity, especially when working across CommonJS and ESM.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Module caching
 * ============================================================
 *
 * CommonJS modules are cached after their first load.
 *
 * Example:
 *
 *
 *     const config1 =
 *       require("./config");
 *
 *     const config2 =
 *       require("./config");
 *
 *
 * Node.js normally does not execute the module from scratch
 * for every require.
 *
 * The cached module result is reused.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Why module caching matters
 * ============================================================
 *
 * Consider:
 *
 *
 *     database.js
 *
 *     connectToDatabase();
 *
 *
 * If multiple modules require database.js, the module cache
 * prevents the module initialization code from being executed
 * repeatedly under normal CommonJS loading.
 *
 * This pattern is often used for shared initialization.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. ESM - ECMAScript Modules
 * ============================================================
 *
 * Modern JavaScript provides the standardized module system:
 *
 *     ECMAScript Modules
 *
 * Usually called:
 *
 *     ESM
 *
 *
 * Main syntax:
 *
 *     import
 *     export
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Named export
 * ============================================================
 *
 * Example:
 *
 *
 *     export function add(a, b) {
 *       return a + b;
 *     }
 *
 *
 * Another file:
 *
 *
 *     import { add }
 *       from "./math.js";
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Multiple named exports
 * ============================================================
 *
 * Example:
 *
 *
 *     export function add() {}
 *
 *     export function subtract() {}
 *
 *     export function multiply() {}
 *
 *
 * Import:
 *
 *
 *     import {
 *       add,
 *       subtract,
 *       multiply
 *     } from "./math.js";
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Export at the bottom
 * ============================================================
 *
 * ESM also allows:
 *
 *
 *     function add(a, b) {
 *       return a + b;
 *     }
 *
 *
 *     function subtract(a, b) {
 *       return a - b;
 *     }
 *
 *
 *     export {
 *       add,
 *       subtract
 *     };
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Default export
 * ============================================================
 *
 * ESM supports one default export per module.
 *
 *
 *     export default function add(a, b) {
 *       return a + b;
 *     }
 *
 *
 * Import:
 *
 *
 *     import add
 *       from "./math.js";
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Named vs default exports
 * ============================================================
 *
 *
 * Named:
 *
 *     export {
 *       add
 *     };
 *
 *
 * Import:
 *
 *     import {
 *       add
 *     } from "./math.js";
 *
 *
 *
 * Default:
 *
 *     export default add;
 *
 *
 * Import:
 *
 *     import add
 *       from "./math.js";
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. ESM configuration
 * ============================================================
 *
 * Node.js can treat `.js` files as ESM when package.json
 * contains:
 *
 *
 *     {
 *       "type": "module"
 *     }
 *
 *
 * Then:
 *
 *
 *     import ...
 *     export ...
 *
 *
 * can be used in `.js` files.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. File extension in ESM
 * ============================================================
 *
 * ESM imports commonly use explicit extensions:
 *
 *
 *     import {
 *       add
 *     } from "./math.js";
 *
 *
 * This is different from many traditional CommonJS examples.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. CommonJS vs ESM
 * ============================================================
 *
 *
 * CommonJS
 * ────────
 *
 * Import:
 *
 *     const x = require("./x");
 *
 *
 * Export:
 *
 *     module.exports = x;
 *
 *
 *
 * ESM
 * ───
 *
 * Import:
 *
 *     import x from "./x.js";
 *
 *
 * Export:
 *
 *     export default x;
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Comparison
 * ============================================================
 *
 *
 *                 CommonJS        ESM
 *
 * Import          require()       import
 *
 * Export          module.exports  export
 *
 * Extension       often omitted   commonly explicit
 *
 * Standard        Node.js legacy  JavaScript standard
 *
 * Syntax          CJS             ESM
 *
 *
 * Both are valid Node.js module systems.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Don't mix them blindly
 * ============================================================
 *
 * Avoid writing:
 *
 *
 *     const express =
 *       require("express");
 *
 *
 * together with:
 *
 *
 *     export function start() {}
 *
 *
 * in a module without understanding the module boundary and
 * Node.js configuration.
 *
 * Pick a module system for your project and use it consistently.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Real backend structure
 * ============================================================
 *
 *
 * src/
 *
 *     server.js
 *
 *     app.js
 *
 *     routes/
 *         user.routes.js
 *
 *     controllers/
 *         user.controller.js
 *
 *     services/
 *         user.service.js
 *
 *     models/
 *         user.model.js
 *
 *     middleware/
 *         auth.middleware.js
 *
 *     utils/
 *         generate-id.js
 *
 *
 * Each file is a module.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Controller example
 * ============================================================
 *
 * user.controller.js
 *
 *
 *     function createUser(req, res) {
 *
 *       // controller logic
 *
 *     }
 *
 *
 *     module.exports = {
 *       createUser
 *     };
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Service example
 * ============================================================
 *
 * user.service.js
 *
 *
 *     async function createUser(data) {
 *
 *       // business logic
 *
 *     }
 *
 *
 *     module.exports = {
 *       createUser
 *     };
 *
 *
 * Controller:
 *
 *
 *     const {
 *       createUser
 *     } = require(
 *       "../services/user.service"
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Why modules are important for architecture
 * ============================================================
 *
 * Modules give us:
 *
 *     Encapsulation
 *          ↓
 *     Reusability
 *          ↓
 *     Separation of concerns
 *          ↓
 *     Testability
 *          ↓
 *     Maintainability
 *
 * This becomes extremely important when we later build:
 *
 *     REST APIs
 *     Authentication
 *     MongoDB
 *     Redis
 *     WebSockets
 *     Kafka
 *     Microservices
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. `__dirname` and `__filename`
 * ============================================================
 *
 * In CommonJS modules, Node.js provides:
 *
 *     __dirname
 *     __filename
 *
 * Example:
 *
 *
 *     console.log(__dirname);
 *
 *     console.log(__filename);
 *
 *
 * `__dirname`:
 *
 *     Directory of the current module.
 *
 *
 * `__filename`:
 *
 *     Absolute filename of the current module.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Important ESM difference
 * ============================================================
 *
 * In ESM:
 *
 *     __dirname
 *     __filename
 *
 * are not provided in the same CommonJS way.
 *
 * Instead, ESM provides:
 *
 *     import.meta.url
 *
 *
 * Example:
 *
 *
 *     console.log(import.meta.url);
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Module encapsulation
 * ============================================================
 *
 * Consider:
 *
 *
 *     function privateFunction() {}
 *
 *     function publicFunction() {}
 *
 *     module.exports = {
 *       publicFunction
 *     };
 *
 *
 * Another module can access:
 *
 *     publicFunction
 *
 *
 * But cannot directly import:
 *
 *     privateFunction
 *
 *
 * This creates a clean public API for the module.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. A module's public API
 * ============================================================
 *
 * Think of:
 *
 *
 *     module.exports
 *
 *
 * as:
 *
 *
 *     "What does this module allow other modules to use?"
 *
 *
 * This concept becomes very important in large backend
 * applications.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. Practical example
 * ============================================================
 *
 * Imagine:
 *
 *
 *     password.service.js
 *
 *
 *     function hashPassword(password) {
 *       // hash password
 *     }
 *
 *
 *     function comparePassword(password, hash) {
 *       // compare password
 *     }
 *
 *
 *     module.exports = {
 *       hashPassword,
 *       comparePassword
 *     };
 *
 *
 * Then:
 *
 *
 *     auth.service.js
 *
 *
 *     const {
 *       hashPassword,
 *       comparePassword
 *     } = require(
 *       "./password.service"
 *     );
 *
 *
 * This is exactly how we'll structure authentication code
 * later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. Module dependency graph
 * ============================================================
 *
 *
 *             server.js
 *                 │
 *         ┌───────┴────────┐
 *         ▼                ▼
 *      routes           database
 *         │
 *         ▼
 *    controller
 *         │
 *         ▼
 *      service
 *         │
 *         ▼
 *       model
 *
 *
 * Every box can be a separate module.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. Avoid circular dependencies
 * ============================================================
 *
 * Problem:
 *
 *
 *     A imports B
 *
 *     B imports A
 *
 *
 * This creates:
 *
 *     A → B → A
 *
 *
 * Circular dependencies can cause confusing initialization
 * behavior.
 *
 *
 * Better architecture:
 *
 *
 *     A → shared module ← B
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. Built-in module naming
 * ============================================================
 *
 * Prefer:
 *
 *
 *     require("node:fs");
 *
 *
 * over:
 *
 *
 *     require("fs");
 *
 *
 * when using modern Node.js code and you want to make it
 * explicit that the dependency is built into Node.js.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. CommonJS wrapper
 * ============================================================
 *
 * Conceptually, Node.js wraps CommonJS modules in a function
 * similar to:
 *
 *
 *     (function (
 *       exports,
 *       require,
 *       module,
 *       __filename,
 *       __dirname
 *     ) {
 *
 *       // your file
 *
 *     });
 *
 *
 * This explains why:
 *
 *     require
 *     module
 *     exports
 *     __filename
 *     __dirname
 *
 * are available in CommonJS modules.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 46. Important mental model
 * ============================================================
 *
 *
 * FILE
 *   │
 *   ▼
 * MODULE
 *   │
 *   ├── private code
 *   │
 *   └── public exports
 *            │
 *            ▼
 *      another module
 *            │
 *            ▼
 *          require()
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 47. Best practices
 * ============================================================
 *
 * ✓ Keep modules focused.
 *
 * ✓ Export only what other modules need.
 *
 * ✓ Avoid huge "everything" modules.
 *
 * ✓ Prefer clear module boundaries.
 *
 * ✓ Avoid circular dependencies.
 *
 * ✓ Don't mix CommonJS and ESM casually.
 *
 * ✓ Use `node:` for built-in modules in modern code.
 *
 * ✓ Keep business logic out of route definitions where
 *   practical.
 *
 * ✓ Organize modules by responsibility.
 *
 * ============================================================
 */

/*
 * ============================================================
 * SUMMARY
 * ============================================================
 *
 *
 * MODULE
 *
 *     A reusable unit of code.
 *
 *
 * COMMONJS
 *
 *     require()
 *     module.exports
 *     exports
 *
 *
 * ESM
 *
 *     import
 *     export
 *
 *
 * COMMONJS:
 *
 *     const user =
 *       require("./user");
 *
 *
 *     module.exports = {
 *       createUser
 *     };
 *
 *
 * ESM:
 *
 *     import {
 *       createUser
 *     } from "./user.js";
 *
 *
 *     export {
 *       createUser
 *     };
 *
 *
 * Node.js applications are built by connecting modules
 * together.
 *
 * ============================================================
 */
