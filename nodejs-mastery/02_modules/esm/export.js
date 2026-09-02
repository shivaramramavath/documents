/**
 * ============================================================
 * Node.js Modules - ES Modules (ESM)
 * ============================================================
 *
 * File: export.js
 *
 * Topic:
 * export
 *
 * ============================================================
 *
 * ESM provides two main types of exports:
 *
 *     1. Named exports
 *     2. Default export
 *
 * You can then use `import` in another module to consume them.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. What is export?
 * ============================================================
 *
 * `export` makes a value available outside the current module.
 *
 *
 * Without export:
 *
 *     const name = "Shiva";
 *
 *
 * Another module cannot directly import `name`.
 *
 *
 * With export:
 *
 *     export const name = "Shiva";
 *
 *
 * Another module can import it.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Named export
 * ============================================================
 *
 * You can export a variable directly.
 * ============================================================
 */

export const name = "Shiva";

export const age = 21;

export const role = "student";

/*
 * Another module can import:
 *
 *
 *     import {
 *       name,
 *       age,
 *       role,
 *     } from "./export.js";
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Named function export
 * ============================================================
 */

export function greet(userName) {
  return `Hello ${userName}`;
}

console.log(greet("Shiva"));

/*
 * ============================================================
 * 4. Named class export
 * ============================================================
 */

export class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello ${this.name}`;
  }
}

/*
 * Another module:
 *
 *
 *     import {
 *       User,
 *     } from "./export.js";
 *
 *
 *     const user =
 *       new User("Shiva");
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Exporting after declaration
 * ============================================================
 *
 * You don't have to write `export` during declaration.
 *
 * You can declare first:
 */

const country = "India";

function getCountry() {
  return country;
}

class Account {
  constructor(owner) {
    this.owner = owner;
  }
}

/*
 * Then export them together:
 */

export { country, getCountry, Account };

/*
 * This is called an export list.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Export aliases
 * ============================================================
 *
 * You can export a value under a different name.
 * ============================================================
 */

const internalName = "Node.js";

export { internalName as runtimeName };

/*
 * Another module can import:
 *
 *
 *     import {
 *       runtimeName,
 *     } from "./export.js";
 *
 *
 * The original local variable is:
 *
 *
 *     internalName
 *
 *
 * The exported name is:
 *
 *
 *     runtimeName
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Named export aliases
 * ============================================================
 */

function addNumbers(a, b) {
  return a + b;
}

export { addNumbers as add };

/*
 * The consumer sees:
 *
 *
 *     import {
 *       add,
 *     } from "./export.js";
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Default export
 * ============================================================
 *
 * A module can have ONE default export.
 *
 *
 * Example:
 *
 *
 *     export default function greet() {}
 *
 *
 * ============================================================
 *
 * IMPORTANT:
 *
 * This file already demonstrates many named exports.
 *
 * For a clean learning example, imagine another module:
 *
 *
 *     export default function calculate() {
 *       return 100;
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Default-exporting a function
 * ============================================================
 *
 * Example syntax:
 *
 *
 *     export default function createUser() {
 *       // ...
 *     }
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Default-exporting a class
 * ============================================================
 *
 * Example syntax:
 *
 *
 *     export default class UserService {
 *
 *       createUser() {
 *         // ...
 *       }
 *
 *     }
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Default export value
 * ============================================================
 *
 * You can also default-export a value.
 *
 *
 * Example:
 *
 *
 *     const config = {
 *       port: 3000,
 *       host: "localhost",
 *     };
 *
 *
 *     export default config;
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Named vs default export
 * ============================================================
 *
 *
 * NAMED EXPORT
 *
 *     export const port = 3000;
 *
 *
 * Import:
 *
 *     import {
 *       port,
 *     } from "./config.js";
 *
 *
 * DEFAULT EXPORT
 *
 *     export default config;
 *
 *
 * Import:
 *
 *     import config from "./config.js";
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Default export does not need the original name
 * ============================================================
 *
 * Suppose:
 *
 *
 *     export default function calculate() {
 *       return 10;
 *     }
 *
 *
 * You can import it as:
 *
 *
 *     import calculate from "./math.js";
 *
 *
 * Or:
 *
 *
 *     import myCalculator from "./math.js";
 *
 *
 * The importing module chooses the local name.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. One default export only
 * ============================================================
 *
 * This is invalid:
 *
 *
 *     export default function one() {}
 *
 *     export default function two() {}
 *
 *
 * A module can have only one default export.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Multiple named exports
 * ============================================================
 *
 * A module can have many named exports.
 *
 *
 * Example:
 *
 *
 *     export const PORT = 3000;
 *
 *     export const HOST = "localhost";
 *
 *     export function startServer() {}
 *
 *     export function stopServer() {}
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Named + default export
 * ============================================================
 *
 * A module can have:
 *
 *     - One default export
 *     - Many named exports
 *
 *
 * Example:
 *
 *
 *     const config = {};
 *
 *
 *     function validateConfig() {}
 *
 *
 *     export default config;
 *
 *
 *     export {
 *       validateConfig,
 *     };
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Re-exporting
 * ============================================================
 *
 * A module can import something and export it again.
 *
 *
 * Example:
 *
 *
 *     export {
 *       add,
 *     } from "./math.js";
 *
 *
 * This is called a re-export.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Re-export multiple values
 * ============================================================
 *
 * Example:
 *
 *
 *     export {
 *       add,
 *       subtract,
 *       multiply,
 *     } from "./math.js";
 *
 *
 * Another module can then import them from this module instead
 * of importing directly from math.js.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Re-export with alias
 * ============================================================
 *
 * Example:
 *
 *
 *     export {
 *       add as sum,
 *     } from "./math.js";
 *
 *
 * Now consumers can use:
 *
 *
 *     import {
 *       sum,
 *     } from "./index.js";
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Re-export everything
 * ============================================================
 *
 * ESM supports:
 *
 *
 *     export * from "./math.js";
 *
 *
 * This re-exports the module's named exports.
 *
 *
 * IMPORTANT:
 *
 * `export *` does not simply mean "copy absolutely everything".
 * In particular, default exports are not re-exported this way.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Module barrel
 * ============================================================
 *
 * Re-exporting is commonly used to create an index/barrel file.
 *
 *
 * Example:
 *
 *
 *     services/
 *     │
 *     ├── user.service.js
 *     ├── auth.service.js
 *     └── index.js
 *
 *
 * index.js:
 *
 *
 *     export * from "./user.service.js";
 *     export * from "./auth.service.js";
 *
 *
 * Another module:
 *
 *
 *     import {
 *       createUser,
 *       login,
 *     } from "./services/index.js";
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Exporting an object
 * ============================================================
 *
 * You can export an object as a named export.
 * ============================================================
 */

export const config = {
  port: 3000,

  host: "localhost",

  environment: "development",
};

/*
 * Import:
 *
 *
 *     import {
 *       config,
 *     } from "./export.js";
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Exporting constants
 * ============================================================
 */

export const API_VERSION = "v1";

export const MAX_USERS = 100;

export const DEFAULT_ROLE = "user";

/*
 * Constants are frequently exported from configuration or
 * utility modules.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Exporting utility functions
 * ============================================================
 */

export function isString(value) {
  return typeof value === "string";
}

export function isNumber(value) {
  return typeof value === "number";
}

export function isObject(value) {
  return value !== null && typeof value === "object";
}

/*
 * Another module:
 *
 *
 *     import {
 *       isString,
 *       isNumber,
 *     } from "./export.js";
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Exporting a service API
 * ============================================================
 */

async function createUser(data) {
  return {
    id: 1,
    ...data,
  };
}

async function findUserById(id) {
  return {
    id,
    name: "Shiva",
  };
}

async function deleteUser(id) {
  return {
    deleted: true,
    id,
  };
}

export { createUser, findUserById, deleteUser };

/*
 * This is a realistic Node.js service module.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Importing the service
 * ============================================================
 *
 * Another file could write:
 *
 *
 *     import {
 *       createUser,
 *       findUserById,
 *       deleteUser,
 *     } from "./export.js";
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Exporting a default service
 * ============================================================
 *
 * A common pattern can look like:
 *
 *
 *     class UserService {
 *
 *       async createUser() {}
 *
 *       async findUser() {}
 *
 *     }
 *
 *
 *     export default UserService;
 *
 *
 * Then:
 *
 *
 *     import UserService
 *       from "./user.service.js";
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Named export best practice
 * ============================================================
 *
 * Named exports are useful when a module provides several
 * related functions.
 *
 *
 * Example:
 *
 *
 *     export {
 *       createUser,
 *       findUser,
 *       updateUser,
 *       deleteUser,
 *     };
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Default export best practice
 * ============================================================
 *
 * Default exports can be useful when the module has one primary
 * thing it represents.
 *
 *
 * Example:
 *
 *
 *     export default UserService;
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Avoid unnecessary default exports
 * ============================================================
 *
 * In larger applications, teams often prefer named exports
 * because:
 *
 *     - Import names are explicit.
 *     - Refactoring can be easier.
 *     - The module API is visible.
 *
 *
 * But both named and default exports are valid ESM features.
 *
 * Follow the convention of the project you are working on.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Export is not the same as return
 * ============================================================
 *
 * `return`:
 *
 *
 *     function add() {
 *       return 10;
 *     }
 *
 *
 * returns a value from a function.
 *
 *
 * `export`:
 *
 *
 *     export function add() {}
 *
 *
 * makes the function available to another module.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Exporting does not execute the function
 * ============================================================
 *
 * This:
 *
 *
 *     export function greet() {}
 *
 *
 * exports the function.
 *
 *
 * It does NOT call:
 *
 *
 *     greet();
 *
 *
 * The importing module decides when to call it.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Live bindings
 * ============================================================
 *
 * ESM exports are live bindings.
 *
 *
 * Conceptually:
 *
 *
 *     let count = 0;
 *
 *     export {
 *       count,
 *     };
 *
 *
 * If the module changes `count`, importers observe the current
 * exported binding rather than receiving an unrelated copy.
 *
 *
 * This is an important difference in how ESM bindings work.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Export syntax cheat sheet
 * ============================================================
 *
 *
 * Named variable:
 *
 *     export const value = 10;
 *
 *
 * Named function:
 *
 *     export function add() {}
 *
 *
 * Named class:
 *
 *     export class User {}
 *
 *
 * Export later:
 *
 *     export {
 *       value,
 *       add,
 *       User,
 *     };
 *
 *
 * Alias:
 *
 *     export {
 *       value as number,
 *     };
 *
 *
 * Default:
 *
 *     export default value;
 *
 *
 * Re-export:
 *
 *     export {
 *       add,
 *     } from "./math.js";
 *
 *
 * Re-export everything:
 *
 *     export * from "./math.js";
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Node.js backend example
 * ============================================================
 *
 *
 * user.service.js
 *
 *
 *     export async function createUser(data) {
 *       // ...
 *     }
 *
 *
 *     export async function findUserById(id) {
 *       // ...
 *     }
 *
 *
 * user.controller.js
 *
 *
 *     import {
 *       createUser,
 *       findUserById,
 *     } from "./user.service.js";
 *
 *
 * This creates a clear dependency:
 *
 *
 *     Controller
 *         │
 *         ▼
 *     User Service
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Final mental model
 * ============================================================
 *
 *
 *                 ESM MODULE
 *                     │
 *          ┌──────────┴──────────┐
 *          │                     │
 *       NAMED                 DEFAULT
 *       EXPORT                EXPORT
 *          │                     │
 *          ▼                     ▼
 *
 *     export { add }       export default User
 *
 *          │                     │
 *          ▼                     ▼
 *
 *     import { add }       import User
 *
 *
 * ============================================================
 *
 * IMPORTANT:
 *
 *     `export` = expose something from this module.
 *
 *     `import` = consume something from another module.
 *
 * ============================================================
 */
