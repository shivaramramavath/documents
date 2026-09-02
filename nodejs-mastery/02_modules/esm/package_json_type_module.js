/**
 * ============================================================
 * Node.js Modules - ESM Configuration
 * ============================================================
 *
 * File: package_json_type_module.js
 *
 * Topic:
 * package.json -> "type": "module"
 *
 * ============================================================
 *
 * Node.js supports two major module systems:
 *
 *     1. CommonJS
 *     2. ES Modules
 *
 *
 * CommonJS:
 *
 *     const fs = require("node:fs");
 *
 *     module.exports = {};
 *
 *
 * ES Modules:
 *
 *     import fs from "node:fs";
 *
 *     export {};
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. What does "type": "module" mean?
 * ============================================================
 *
 * In package.json you can write:
 *
 *
 *     {
 *       "type": "module"
 *     }
 *
 *
 * This tells Node.js:
 *
 *
 *     `.js` files in this package should be interpreted
 *     as ES Modules.
 *
 *
 * Therefore:
 *
 *
 *     example.js
 *
 *
 * is treated as:
 *
 *
 *     ESM
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. package.json example
 * ============================================================
 *
 * Your package.json might look like:
 *
 *
 *     {
 *       "name": "nodejs-mastery",
 *       "version": "1.0.0",
 *       "type": "module",
 *       "scripts": {
 *         "start": "node index.js"
 *       }
 *     }
 *
 *
 * The important part for this lesson:
 *
 *
 *     "type": "module"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Without "type": "module"
 * ============================================================
 *
 * If your package.json does NOT contain:
 *
 *
 *     "type": "module"
 *
 *
 * then `.js` files are generally treated as CommonJS.
 *
 *
 * Example:
 *
 *
 *     // app.js
 *
 *     const fs = require("node:fs");
 *
 *
 * This is CommonJS.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. With "type": "module"
 * ============================================================
 *
 * If package.json contains:
 *
 *
 *     "type": "module"
 *
 *
 * then:
 *
 *
 *     app.js
 *
 *
 * is interpreted as ESM.
 *
 *
 * Therefore you can write:
 *
 *
 *     import fs from "node:fs";
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. .mjs extension
 * ============================================================
 *
 * Node.js also supports:
 *
 *
 *     .mjs
 *
 *
 * A `.mjs` file is always treated as an ES Module.
 *
 *
 * Example:
 *
 *
 *     app.mjs
 *
 *
 * is ESM even if package.json doesn't contain:
 *
 *
 *     "type": "module"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. .cjs extension
 * ============================================================
 *
 * Node.js also supports:
 *
 *
 *     .cjs
 *
 *
 * A `.cjs` file is always treated as CommonJS.
 *
 *
 * Example:
 *
 *
 *     app.cjs
 *
 *
 * is CommonJS even if:
 *
 *
 *     "type": "module"
 *
 *
 * is present in package.json.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. The three important cases
 * ============================================================
 *
 *
 * package.json:
 *
 *     "type": "module"
 *
 *
 * Then:
 *
 *
 *     .js  -> ESM
 *     .mjs -> ESM
 *     .cjs -> CommonJS
 *
 *
 * ============================================================
 *
 *
 * Without:
 *
 *     "type": "module"
 *
 *
 * Then:
 *
 *
 *     .js  -> CommonJS
 *     .mjs -> ESM
 *     .cjs -> CommonJS
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Why does this matter?
 * ============================================================
 *
 * Because the syntax changes.
 *
 *
 * CommonJS:
 *
 *
 *     const express =
 *       require("express");
 *
 *
 * ESM:
 *
 *
 *     import express
 *       from "express";
 *
 *
 * If Node interprets the file as the wrong module type,
 * you can get errors.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Example: CommonJS
 * ============================================================
 *
 * app.cjs:
 *
 *
 *     const os =
 *       require("node:os");
 *
 *
 *     console.log(
 *       os.platform(),
 *     );
 *
 *
 * Because `.cjs` means CommonJS, Node knows to use require().
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Example: ESM
 * ============================================================
 *
 * app.mjs:
 *
 *
 *     import os
 *       from "node:os";
 *
 *
 *     console.log(
 *       os.platform(),
 *     );
 *
 *
 * Because `.mjs` means ESM, Node knows to use import.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Using .js with ESM
 * ============================================================
 *
 * package.json:
 *
 *
 *     {
 *       "type": "module"
 *     }
 *
 *
 * app.js:
 *
 *
 *     import os
 *       from "node:os";
 *
 *
 * This is a very common modern Node.js setup.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Using .js with CommonJS
 * ============================================================
 *
 * If package.json does not specify:
 *
 *
 *     "type": "module"
 *
 *
 * app.js can use:
 *
 *
 *     const os =
 *       require("node:os");
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. package.json applies by package scope
 * ============================================================
 *
 * Node determines module type based on the nearest relevant
 * package.json.
 *
 *
 * For example:
 *
 *
 *     project/
 *     │
 *     ├── package.json
 *     │      "type": "module"
 *     │
 *     └── src/
 *            └── app.js
 *
 *
 * `src/app.js` is treated as ESM.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Nested package.json
 * ============================================================
 *
 * A nested package can have its own package.json.
 *
 *
 * Example:
 *
 *
 *     project/
 *     │
 *     ├── package.json
 *     │      "type": "module"
 *     │
 *     └── legacy/
 *            ├── package.json
 *            │      "type": "commonjs"
 *            │
 *            └── old.js
 *
 *
 * The nested package configuration can change how files in
 * that package scope are interpreted.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. CommonJS inside an ESM project
 * ============================================================
 *
 * Suppose:
 *
 *
 *     package.json
 *
 *     {
 *       "type": "module"
 *     }
 *
 *
 * Then:
 *
 *
 *     app.js
 *
 *
 * is ESM.
 *
 *
 * If you need a CommonJS file:
 *
 *
 *     legacy.cjs
 *
 *
 * Use `.cjs`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. ESM inside a CommonJS project
 * ============================================================
 *
 * If your project normally uses CommonJS:
 *
 *
 *     package.json
 *
 *     {
 *       "type": "commonjs"
 *     }
 *
 *
 * or doesn't specify `"type": "module"`,
 *
 * then `.js` is generally CommonJS.
 *
 *
 * To explicitly create an ESM file:
 *
 *
 *     something.mjs
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Explicit module type
 * ============================================================
 *
 * You can make your intent obvious:
 *
 *
 *     .cjs
 *
 *         CommonJS
 *
 *
 *     .mjs
 *
 *         ESM
 *
 *
 * This is useful when a project needs to contain both systems.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Modern Node.js project recommendation
 * ============================================================
 *
 * For a modern backend project, a common choice is:
 *
 *
 *     {
 *       "type": "module"
 *     }
 *
 *
 * Then use:
 *
 *
 *     .js
 *
 *
 * for ESM files.
 *
 *
 * This allows:
 *
 *
 *     import express from "express";
 *
 *     import {
 *       connectDatabase,
 *     } from "./database.js";
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Why many projects use ESM
 * ============================================================
 *
 * ESM is the standardized JavaScript module system.
 *
 *
 * Benefits include:
 *
 *     - Standard JavaScript syntax
 *     - Static module structure
 *     - Named exports
 *     - Default exports
 *     - Dynamic import()
 *     - Strong tooling support
 *     - Works in browsers and Node.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. CommonJS vs ESM
 * ============================================================
 *
 *
 *                 CommonJS       ESM
 *
 * Import          require()      import
 *
 * Export          module.exports export
 *
 * Extension       .cjs           .mjs
 *
 * .js default     CJS*           ESM**
 *
 *
 * * when package type is CommonJS/default behavior
 *
 * ** when package.json has "type": "module"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. package.json example for this repository
 * ============================================================
 *
 * Your nodejs-mastery/package.json can eventually contain:
 *
 *
 *     {
 *       "name": "nodejs-mastery",
 *       "version": "1.0.0",
 *       "private": true,
 *       "type": "module",
 *       "scripts": {
 *         "start": "node index.js"
 *       }
 *     }
 *
 *
 * NOTE:
 *
 * If you set `"type": "module"` at the root, ALL `.js` files
 * under that package scope will normally be interpreted as ESM.
 *
 * That means the earlier CommonJS learning files using
 * `require()` should be renamed to `.cjs`, or placed in a
 * CommonJS package scope.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Recommended structure for this repository
 * ============================================================
 *
 *
 *     02_modules/
 *     │
 *     ├── commonjs/
 *     │   ├── require.cjs
 *     │   ├── module_exports.cjs
 *     │   └── exports.cjs
 *     │
 *     └── esm/
 *         ├── import.js
 *         ├── export.js
 *         └── package_json_type_module.js
 *
 *
 * Root package.json:
 *
 *
 *     "type": "module"
 *
 *
 * This makes `.js` files ESM while `.cjs` files remain
 * explicitly CommonJS.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. How to run an ESM file
 * ============================================================
 *
 * If the project uses:
 *
 *
 *     "type": "module"
 *
 *
 * run:
 *
 *
 *     node file.js
 *
 *
 * Example:
 *
 *
 *     node 02_modules/esm/export.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. How to run a .mjs file
 * ============================================================
 *
 * You can simply run:
 *
 *
 *     node file.mjs
 *
 *
 * Node automatically treats it as ESM.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. How to run a .cjs file
 * ============================================================
 *
 * Run:
 *
 *
 *     node file.cjs
 *
 *
 * Node automatically treats it as CommonJS.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Check your Node.js version
 * ============================================================
 *
 * Run:
 *
 *
 *     node --version
 *
 *
 * or:
 *
 *
 *     node -v
 *
 *
 * Modern Node.js versions have mature ESM support.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Important mistake
 * ============================================================
 *
 * If package.json says:
 *
 *
 *     "type": "module"
 *
 *
 * and you write:
 *
 *
 *     const fs =
 *       require("node:fs");
 *
 *
 * inside a `.js` file,
 *
 * you are mixing CommonJS syntax into an ESM file.
 *
 *
 * Use:
 *
 *
 *     import fs from "node:fs";
 *
 *
 * or use a `.cjs` file if CommonJS is required.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Another important mistake
 * ============================================================
 *
 * In ESM:
 *
 *
 *     import {
 *       something,
 *     } from "./module";
 *
 *
 * For relative Node.js ESM imports, normally specify the
 * extension:
 *
 *
 *     import {
 *       something,
 *     } from "./module.js";
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. ESM does not use __dirname directly
 * ============================================================
 *
 * In CommonJS:
 *
 *
 *     console.log(__dirname);
 *
 *
 * In ESM, use module metadata such as:
 *
 *
 *     import.meta.url
 *
 *
 * and convert it to a filesystem path when needed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Final mental model
 * ============================================================
 *
 *
 *             package.json
 *                   │
 *                   ▼
 *            "type": "module"
 *                   │
 *                   ▼
 *              file.js
 *                   │
 *                   ▼
 *                  ESM
 *
 *
 *
 *             file.mjs
 *                   │
 *                   ▼
 *                  ESM
 *
 *
 *
 *             file.cjs
 *                   │
 *                   ▼
 *              CommonJS
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * package.json:
 *
 *     "type": "module"
 *
 *         .js  -> ESM
 *         .mjs -> ESM
 *         .cjs -> CommonJS
 *
 *
 * Without "type": "module":
 *
 *         .js  -> CommonJS by default
 *         .mjs -> ESM
 *         .cjs -> CommonJS
 *
 *
 * ============================================================
 *
 * CommonJS:
 *
 *     const fs = require("node:fs");
 *
 *     module.exports = {};
 *
 *
 * ESM:
 *
 *     import fs from "node:fs";
 *
 *     export {};
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     package.json controls the meaning of `.js`
 *     within its package scope.
 *
 *     `.mjs` explicitly means ESM.
 *
 *     `.cjs` explicitly means CommonJS.
 *
 * ============================================================
 */
