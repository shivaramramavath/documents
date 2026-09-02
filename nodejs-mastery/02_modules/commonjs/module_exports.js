/**
 * ============================================================
 * Node.js Modules - CommonJS
 * ============================================================
 *
 * File: module_exports.js
 *
 * Topic:
 * module.exports
 *
 * ============================================================
 *
 * In CommonJS, `module.exports` defines the value that another
 * file receives when it uses:
 *
 *     require("./some-module")
 *
 *
 * Mental model:
 *
 *
 *     module.js
 *         │
 *         │ module.exports
 *         ▼
 *     require()
 *         │
 *         ▼
 *     another-file.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. What is module?
 * ============================================================
 *
 * Every CommonJS file is treated as a module by Node.js.
 *
 * Node.js provides a `module` object for that file.
 *
 *
 * Example:
 */

console.log(module);

/*
 * You will see information such as:
 *
 *     id
 *     path
 *     exports
 *     filename
 *     loaded
 *     children
 *
 *
 * The most important property for us here is:
 *
 *     module.exports
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. module.exports
 * ============================================================
 *
 * By default:
 *
 *
 *     module.exports
 *
 *
 * starts as an empty object.
 *
 *
 * Conceptually:
 *
 *
 *     module.exports = {};
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Exporting a value
 * ============================================================
 *
 * You can replace module.exports with any JavaScript value.
 *
 *
 * Example:
 *
 *
 *     module.exports = "Hello";
 *
 *
 * Then another file can do:
 *
 *
 *     const message =
 *       require("./module_exports");
 *
 *
 *     console.log(message);
 *
 *
 * Result:
 *
 *
 *     Hello
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Exporting a number
 * ============================================================
 */

module.exports = 100;

/*
 * If another file does:
 *
 *
 *     const value =
 *       require("./module_exports");
 *
 *
 * `value` will be:
 *
 *
 *     100
 *
 *
 * IMPORTANT:
 *
 * We should not keep changing module.exports throughout
 * this learning file because the last assignment determines
 * what is exported.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Exporting a string
 * ============================================================
 *
 * Example:
 *
 *
 *     module.exports = "Node.js";
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Exporting a boolean
 * ============================================================
 *
 * Example:
 *
 *
 *     module.exports = true;
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Exporting an array
 * ============================================================
 *
 * Example:
 *
 *
 *     module.exports = [
 *       "Node.js",
 *       "Express",
 *       "MongoDB",
 *     ];
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Exporting an object
 * ============================================================
 *
 * This is one of the most common patterns.
 *
 *
 * Example:
 *
 *
 *     module.exports = {
 *       name: "Shiva",
 *       role: "student",
 *     };
 *
 *
 * Another file:
 *
 *
 *     const user =
 *       require("./user");
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Exporting multiple functions
 * ============================================================
 *
 * Suppose we have:
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
 * We can export both:
 *
 *
 *     module.exports = {
 *       add,
 *       subtract,
 *     };
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Practical math module
 * ============================================================
 *
 * This is how you would normally structure a module:
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
 *     function multiply(a, b) {
 *       return a * b;
 *     }
 *
 *
 *     function divide(a, b) {
 *       return a / b;
 *     }
 *
 *
 *     module.exports = {
 *       add,
 *       subtract,
 *       multiply,
 *       divide,
 *     };
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Export only what is needed
 * ============================================================
 *
 * You don't have to export every function.
 *
 *
 * Example:
 *
 *
 *     function internalCalculation() {
 *       return 100;
 *     }
 *
 *
 *     function publicCalculation() {
 *       return internalCalculation() * 2;
 *     }
 *
 *
 *     module.exports = {
 *       publicCalculation,
 *     };
 *
 *
 * `internalCalculation()` remains internal to this module.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Private implementation
 * ============================================================
 *
 * Example:
 */

function calculateTax(amount) {
  return amount * 0.18;
}

function calculateTotal(amount) {
  return amount + calculateTax(amount);
}

/*
 * Only export the public function.
 */

module.exports = {
  calculateTotal,
};

/*
 * Another file can use:
 *
 *
 *     const {
 *       calculateTotal,
 *     } = require("./module_exports");
 *
 *
 * But it cannot directly access calculateTax through the
 * exported object.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Exporting a function directly
 * ============================================================
 *
 * Instead of:
 *
 *
 *     module.exports = {
 *       greet,
 *     };
 *
 *
 * you can export the function itself:
 *
 *
 *     module.exports = greet;
 *
 *
 * Then:
 *
 *
 *     const greet =
 *       require("./greet");
 *
 *
 *     greet();
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Example: utility module
 * ============================================================
 *
 *     function generateId() {
 *       return crypto.randomUUID();
 *     }
 *
 *
 *     module.exports = generateId;
 *
 *
 * Another file:
 *
 *
 *     const generateId =
 *       require("./generate-id");
 *
 *
 *     const id =
 *       generateId();
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Exporting a class
 * ============================================================
 *
 * `module.exports` can export a class too.
 *
 *
 * Example:
 *
 *
 *     class UserService {
 *
 *       createUser() {
 *         // ...
 *       }
 *
 *       findUser() {
 *         // ...
 *       }
 *
 *     }
 *
 *
 *     module.exports = UserService;
 *
 *
 * Another file:
 *
 *
 *     const UserService =
 *       require("./user.service");
 *
 *
 *     const service =
 *       new UserService();
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Exporting an instance
 * ============================================================
 *
 * You can also export an already-created object.
 *
 *
 * Example:
 *
 *
 *     class Logger {
 *
 *       info(message) {
 *         console.log(message);
 *       }
 *
 *     }
 *
 *
 *     module.exports =
 *       new Logger();
 *
 *
 * Then:
 *
 *
 *     const logger =
 *       require("./logger");
 *
 *
 *     logger.info("Server started");
 *
 *
 * Because CommonJS modules are cached, this pattern can
 * effectively provide a shared instance within a process.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. module.exports assignment
 * ============================================================
 *
 * These are different:
 *
 *
 *     module.exports = value;
 *
 *
 * and:
 *
 *
 *     module.exports.value = something;
 *
 *
 * First one replaces the exported value.
 *
 *
 * Second one adds a property to the existing exported object.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Example
 * ============================================================
 *
 * Start:
 *
 *
 *     module.exports = {};
 *
 *
 * Add property:
 *
 *
 *     module.exports.name = "Shiva";
 *
 *
 * Add function:
 *
 *
 *     module.exports.greet = function () {
 *       // ...
 *     };
 *
 *
 * Result:
 *
 *
 *     {
 *       name: "Shiva",
 *       greet: [Function]
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Replacing module.exports
 * ============================================================
 *
 * Example:
 *
 *
 *     module.exports.name = "Shiva";
 *
 *
 * Then:
 *
 *
 *     module.exports = function () {};
 *
 *
 * The previous object is replaced.
 *
 *
 * The final value of module.exports is what require()
 * receives.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Very important rule
 * ============================================================
 *
 * At the end of module evaluation:
 *
 *
 *     require("./module")
 *
 *
 * gives you the value of:
 *
 *
 *     module.exports
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. module.exports with destructuring
 * ============================================================
 *
 * Export:
 *
 *
 *     module.exports = {
 *       createUser,
 *       findUser,
 *       deleteUser,
 *     };
 *
 *
 * Import:
 *
 *
 *     const {
 *       createUser,
 *       findUser,
 *       deleteUser,
 *     } = require("./user.service");
 *
 *
 * This is extremely common in Node.js backend projects.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Controller example
 * ============================================================
 *
 * Imagine:
 *
 *
 *     user.controller.js
 *
 *
 *     async function createUser(req, res) {
 *       // ...
 *     }
 *
 *
 *     async function getUser(req, res) {
 *       // ...
 *     }
 *
 *
 *     module.exports = {
 *       createUser,
 *       getUser,
 *     };
 *
 *
 * Then:
 *
 *
 *     const {
 *       createUser,
 *       getUser,
 *     } = require("./user.controller");
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Service example
 * ============================================================
 *
 *     user.service.js
 *
 *
 *     async function createUser(data) {
 *       // database logic
 *     }
 *
 *
 *     async function findUserById(id) {
 *       // database logic
 *     }
 *
 *
 *     module.exports = {
 *       createUser,
 *       findUserById,
 *     };
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Repository example
 * ============================================================
 *
 *     user.repository.js
 *
 *
 *     async function insertUser(data) {
 *       // MongoDB operation
 *     }
 *
 *
 *     async function findUserById(id) {
 *       // MongoDB operation
 *     }
 *
 *
 *     module.exports = {
 *       insertUser,
 *       findUserById,
 *     };
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Layered architecture
 * ============================================================
 *
 *
 *     Route
 *       ↓
 *     Controller
 *       ↓
 *     Service
 *       ↓
 *     Repository
 *       ↓
 *     Database
 *
 *
 * Each layer can be implemented as separate CommonJS modules.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. module.exports is an object by default
 * ============================================================
 *
 * Initially:
 *
 *
 *     module.exports
 *
 *
 * is an object.
 *
 *
 * Therefore this works:
 *
 *
 *     module.exports.add = add;
 *
 *
 * and:
 *
 *
 *     module.exports.subtract = subtract;
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Common pattern
 * ============================================================
 *
 * You will frequently see:
 *
 *
 *     module.exports = {
 *       create,
 *       find,
 *       update,
 *       remove,
 *     };
 *
 *
 * This exports several functions as one module API.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Module API
 * ============================================================
 *
 * Think of module.exports as the module's public API.
 *
 *
 * Internal:
 *
 *     validateInput()
 *     normalizeData()
 *     calculateSomething()
 *
 *
 * Public:
 *
 *     createUser()
 *     findUser()
 *
 *
 * Example:
 *
 *
 *     module.exports = {
 *       createUser,
 *       findUser,
 *     };
 *
 *
 * This is a clean way to control what other modules can use.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. module.exports vs return
 * ============================================================
 *
 * `return` returns a value from a function.
 *
 *
 *     function add() {
 *       return 10;
 *     }
 *
 *
 * `module.exports` exposes a value from a module.
 *
 *
 *     module.exports = add;
 *
 *
 * They solve different problems.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Common mistake
 * ============================================================
 *
 * Don't confuse:
 *
 *
 *     module.exports
 *
 *
 * with:
 *
 *
 *     exports
 *
 *
 * They initially reference the same exports object in
 * CommonJS, but reassigning `exports` does NOT replace
 * `module.exports`.
 *
 *
 * Example:
 *
 *
 *     exports.name = "Shiva";
 *
 *
 * works.
 *
 *
 * But:
 *
 *
 *     exports = {
 *       name: "Shiva",
 *     };
 *
 *
 * does NOT change what require() receives.
 *
 *
 * We will study this in:
 *
 *
 *     exports.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Best practice
 * ============================================================
 *
 * For multiple exports:
 *
 *
 *     module.exports = {
 *       functionA,
 *       functionB,
 *     };
 *
 *
 * For a single main export:
 *
 *
 *     module.exports = functionA;
 *
 *
 * Keep the module's public API clear.
 *
 * ============================================================
 */

/*
 * ============================================================
 * SUMMARY
 * ============================================================
 *
 *
 * module
 *     ↓
 * Node.js module object
 *
 *
 * module.exports
 *     ↓
 * The value exported from the module
 *
 *
 * require()
 *     ↓
 * Receives module.exports
 *
 *
 * Example:
 *
 *
 *     // user.js
 *
 *     function createUser() {}
 *
 *     function findUser() {}
 *
 *     module.exports = {
 *       createUser,
 *       findUser,
 *     };
 *
 *
 *     // app.js
 *
 *     const {
 *       createUser,
 *       findUser,
 *     } = require("./user");
 *
 *
 * ============================================================
 *
 * KEY RULE:
 *
 *     require("./file")
 *
 *     returns:
 *
 *     file's module.exports
 *
 * ============================================================
 */
