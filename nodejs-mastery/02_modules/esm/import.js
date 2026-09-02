/**
 * ============================================================
 * Node.js Modules - ES Modules (ESM)
 * ============================================================
 *
 * File: import.js
 *
 * Topic:
 * import
 *
 * ============================================================
 *
 * ES Modules (ESM) are JavaScript's standard module system.
 *
 * ESM uses:
 *
 *     import
 *     export
 *
 *
 * CommonJS uses:
 *
 *     require()
 *     module.exports
 *
 *
 * In this file we learn how `import` works.
 *
 * ============================================================
 */

/*
 * ============================================================
 * IMPORTANT
 * ============================================================
 *
 * This file uses ESM syntax.
 *
 * Therefore Node.js must know that this project uses ES
 * Modules.
 *
 * We will configure that in:
 *
 *
 *     package_json_type_module.js
 *
 *
 * For now, the examples below are the syntax you need to learn.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Importing a Node.js built-in module
 * ============================================================
 *
 * ESM can import Node.js built-in modules.
 *
 *
 * Example:
 *
 *
 *     import os from "node:os";
 *
 *
 * Then:
 *
 *
 *     os.platform();
 *
 *
 * ============================================================
 */

import os from "node:os";

console.log("Platform:", os.platform());

console.log("Architecture:", os.arch());

/*
 * ============================================================
 * 2. Importing named exports
 * ============================================================
 *
 * Suppose another module contains:
 *
 *
 *     export function add(a, b) {
 *       return a + b;
 *     }
 *
 *
 * You can import it using:
 *
 *
 *     import { add } from "./math.js";
 *
 *
 * The `{}` means we are importing a named export.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Multiple named imports
 * ============================================================
 *
 * Example:
 *
 *
 *     import {
 *       add,
 *       subtract,
 *       multiply,
 *     } from "./math.js";
 *
 *
 * You can import multiple named exports from the same module.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Import with an alias
 * ============================================================
 *
 * You can rename an imported value using `as`.
 *
 *
 * Example:
 *
 *
 *     import {
 *       add as sum,
 *     } from "./math.js";
 *
 *
 * Then:
 *
 *
 *     sum(10, 20);
 *
 *
 * The original exported name is `add`.
 *
 * The local name is `sum`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Importing a default export
 * ============================================================
 *
 * Suppose:
 *
 *
 *     export default function greet() {
 *       // ...
 *     }
 *
 *
 * You import it without `{}`:
 *
 *
 *     import greet from "./greet.js";
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Default and named imports together
 * ============================================================
 *
 * A module can provide both:
 *
 *
 *     export default ...
 *
 *
 * and:
 *
 *
 *     export ...
 *
 *
 * Example:
 *
 *
 *     import logger, {
 *       createLogger,
 *       formatMessage,
 *     } from "./logger.js";
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Import everything
 * ============================================================
 *
 * You can import all named exports as one namespace object.
 *
 *
 * Example:
 *
 *
 *     import * as math from "./math.js";
 *
 *
 * Then:
 *
 *
 *     math.add(10, 20);
 *     math.subtract(20, 10);
 *
 *
 * `math` becomes a module namespace object.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Namespace imports
 * ============================================================
 *
 * Example:
 */

import * as path from "node:path";

console.log(path.basename("/users/shiva/file.txt"));

/*
 * Instead of importing individual members:
 *
 *
 *     import {
 *       basename,
 *       dirname,
 *     } from "node:path";
 *
 *
 * you can use:
 *
 *
 *     import * as path from "node:path";
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Importing a local module
 * ============================================================
 *
 * ESM local imports normally use a relative path.
 *
 *
 * Example:
 *
 *
 *     import {
 *       add,
 *     } from "./math.js";
 *
 *
 * Notice the `.js`.
 *
 *
 * With Node.js ESM, explicitly specifying the file extension
 * is the normal practice for relative imports.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Directory structure
 * ============================================================
 *
 * Suppose:
 *
 *
 *     esm/
 *     │
 *     ├── import.js
 *     └── math.js
 *
 *
 * math.js:
 *
 *
 *     export function add(a, b) {
 *       return a + b;
 *     }
 *
 *
 * import.js:
 *
 *
 *     import { add } from "./math.js";
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Importing npm packages
 * ============================================================
 *
 * If a package is installed:
 *
 *
 *     npm install bcryptjs
 *
 *
 * ESM can use:
 *
 *
 *     import bcrypt from "bcryptjs";
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Importing Node.js crypto
 * ============================================================
 */

import crypto from "node:crypto";

const id = crypto.randomUUID();

console.log("UUID:", id);

/*
 * This is useful for:
 *
 *     - IDs
 *     - Tokens
 *     - Cryptography
 *     - Security utilities
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Importing specific members
 * ============================================================
 *
 * Instead of:
 *
 *
 *     import crypto from "node:crypto";
 *
 *
 * you can import specific named members when supported.
 *
 *
 * Example:
 *
 *
 *     import {
 *       randomUUID,
 *     } from "node:crypto";
 *
 *
 * Then:
 *
 *
 *     randomUUID();
 *
 * ============================================================
 */

import { randomUUID } from "node:crypto";

console.log("Another UUID:", randomUUID());

/*
 * ============================================================
 * 14. Default import vs named import
 * ============================================================
 *
 *
 * DEFAULT:
 *
 *     import crypto from "node:crypto";
 *
 *
 * NAMED:
 *
 *     import {
 *       randomUUID,
 *     } from "node:crypto";
 *
 *
 * NAMESPACE:
 *
 *     import * as crypto from "node:crypto";
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Import aliases
 * ============================================================
 */

import { randomBytes as generateRandomBytes } from "node:crypto";

const randomValue = generateRandomBytes(16);

console.log("Random bytes:", randomValue.toString("hex"));

/*
 * `randomBytes` is the exported name.
 *
 * `generateRandomBytes` is our local name.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Import is not a function
 * ============================================================
 *
 * CommonJS:
 *
 *
 *     const fs = require("node:fs");
 *
 *
 * Here `require()` is a function.
 *
 *
 * ESM:
 *
 *
 *     import fs from "node:fs";
 *
 *
 * `import` is module syntax, not a normal JavaScript function.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Static imports
 * ============================================================
 *
 * Normal import statements are static.
 *
 *
 * Example:
 *
 *
 *     import {
 *       add,
 *     } from "./math.js";
 *
 *
 * The module dependency is known when the module is loaded.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Dynamic import()
 * ============================================================
 *
 * JavaScript also supports dynamic imports.
 *
 *
 * Dynamic import uses:
 *
 *
 *     import()
 *
 *
 * and returns a Promise.
 *
 *
 * Example:
 */

async function loadPathModule() {
  const pathModule = await import("node:path");

  console.log(pathModule.basename("/users/shiva/test.js"));
}

loadPathModule();

/*
 * Notice the difference:
 *
 *
 * Static:
 *
 *     import path from "node:path";
 *
 *
 * Dynamic:
 *
 *     await import("node:path");
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Why use dynamic import?
 * ============================================================
 *
 * Dynamic imports can be useful when a module should only be
 * loaded when needed.
 *
 *
 * Common use cases:
 *
 *     - Optional features
 *     - Lazy loading
 *     - Large dependencies
 *     - Conditional functionality
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Conditional dynamic import
 * ============================================================
 */

async function loadCrypto(shouldLoad) {
  if (!shouldLoad) {
    return null;
  }

  return import("node:crypto");
}

loadCrypto(true).then((cryptoModule) => {
  console.log("Crypto loaded:", Boolean(cryptoModule));
});

/*
 * ============================================================
 * 21. Importing JSON
 * ============================================================
 *
 * Node.js ESM has specific rules for importing JSON.
 *
 * Modern Node.js uses import attributes.
 *
 *
 * Example:
 *
 *
 *     import config from "./config.json"
 *       with { type: "json" };
 *
 *
 * The exact syntax and runtime support can depend on the
 * Node.js version you are using.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. ESM is strict mode
 * ============================================================
 *
 * ES Modules automatically run in strict mode.
 *
 *
 * You don't need:
 *
 *
 *     "use strict";
 *
 *
 * at the top of every ESM file.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. No __dirname in normal ESM
 * ============================================================
 *
 * In CommonJS you commonly see:
 *
 *
 *     __dirname
 *     __filename
 *
 *
 * These are not provided as ordinary globals in ESM.
 *
 *
 * ESM provides:
 *
 *
 *     import.meta.url
 *
 *
 * Example:
 */

console.log("Current module URL:", import.meta.url);

/*
 * We will study ESM-specific file handling later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. import.meta
 * ============================================================
 *
 * `import.meta` contains metadata about the current module.
 *
 *
 * One important property:
 *
 *
 *     import.meta.url
 *
 *
 * Example:
 */

console.log("Module URL:", import.meta.url);

/*
 * ============================================================
 * 25. Importing the same module
 * ============================================================
 *
 * Modules are evaluated according to the ESM module system's
 * loading and caching semantics.
 *
 *
 * If several modules import the same module, Node.js does not
 * simply execute a completely independent copy for every
 * import statement.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. ESM dependency graph
 * ============================================================
 *
 * Example:
 *
 *
 *     server.js
 *         │
 *         ├──────────────┐
 *         ▼              ▼
 *     user.service    auth.service
 *         │              │
 *         └──────┬───────┘
 *                ▼
 *            database
 *
 *
 * Every imported module becomes part of the module graph.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Backend example
 * ============================================================
 *
 * A modern Node.js backend might use:
 *
 *
 *     import express from "express";
 *
 *     import {
 *       createUser,
 *       findUser,
 *     } from "./services/user.service.js";
 *
 *     import {
 *       connectDatabase,
 *     } from "./database.js";
 *
 *
 * This makes dependencies explicit at the top of the file.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. CommonJS vs ESM
 * ============================================================
 *
 *
 * COMMONJS
 *
 *     const fs = require("node:fs");
 *
 *     module.exports = {
 *       createUser,
 *     };
 *
 *
 * ESM
 *
 *     import fs from "node:fs";
 *
 *     export {
 *       createUser,
 *     };
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Important ESM import patterns
 * ============================================================
 *
 *
 * DEFAULT:
 *
 *     import userService from "./user.service.js";
 *
 *
 * NAMED:
 *
 *     import {
 *       createUser,
 *       findUser,
 *     } from "./user.service.js";
 *
 *
 * ALIAS:
 *
 *     import {
 *       createUser as create,
 *     } from "./user.service.js";
 *
 *
 * NAMESPACE:
 *
 *     import * as userService
 *       from "./user.service.js";
 *
 *
 * DYNAMIC:
 *
 *     const module =
 *       await import("./module.js");
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. What to remember
 * ============================================================
 *
 * ✓ ESM uses import/export.
 *
 * ✓ CommonJS uses require/module.exports.
 *
 * ✓ Use `./file.js` for local ESM imports.
 *
 * ✓ Named imports use `{}`.
 *
 * ✓ Default imports don't use `{}`.
 *
 * ✓ `as` creates an import alias.
 *
 * ✓ `* as name` creates a namespace import.
 *
 * ✓ `import()` performs a dynamic import and returns a Promise.
 *
 * ✓ ESM automatically uses strict mode.
 *
 * ✓ ESM uses `import.meta.url` instead of CommonJS's
 *   `__filename` / `__dirname` globals.
 *
 * ============================================================
 */

/*
 * ============================================================
 * FINAL MENTAL MODEL
 * ============================================================
 *
 *
 *              ES MODULE
 *
 *                 │
 *       ┌─────────┴─────────┐
 *       │                   │
 *     export              import
 *       │                   │
 *       ▼                   ▼
 *   Public API         Use the API
 *
 *
 * Example:
 *
 *
 *     // math.js
 *
 *     export function add(a, b) {
 *       return a + b;
 *     }
 *
 *
 *     // app.js
 *
 *     import {
 *       add,
 *     } from "./math.js";
 *
 *
 *     console.log(
 *       add(10, 20),
 *     );
 *
 *
 * ============================================================
 */
