/**
 * ============================================================
 * Node.js Modules - CommonJS
 * ============================================================
 *
 * File: exports.js
 *
 * Topic:
 * exports vs module.exports
 *
 * ============================================================
 *
 * CommonJS provides two commonly seen names:
 *
 *     module.exports
 *     exports
 *
 * They are related, but they are NOT exactly the same thing.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. The default relationship
 * ============================================================
 *
 * When Node.js creates a CommonJS module, conceptually:
 *
 *
 *     exports = module.exports;
 *
 *
 * Both initially point to the same object.
 *
 *
 * Visual:
 *
 *
 *     exports ──────────┐
 *                       │
 *                       ▼
 *                module.exports
 *                       │
 *                       ▼
 *                     {}
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Using exports.property
 * ============================================================
 *
 * You can add properties using `exports`.
 *
 *
 * Example:
 *
 *
 *     exports.name = "Shiva";
 *
 *
 * This is effectively adding a property to the
 * `module.exports` object.
 * ============================================================
 */

exports.name = "Shiva";

exports.age = 21;

console.log(module.exports);

/*
 * Output:
 *
 *     {
 *       name: "Shiva",
 *       age: 21
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Exporting functions using exports
 * ============================================================
 */

exports.add = function add(a, b) {
  return a + b;
};

exports.subtract = function subtract(a, b) {
  return a - b;
};

console.log(module.exports.add(10, 20));

console.log(module.exports.subtract(20, 10));

/*
 * You could import these functions using:
 *
 *
 *     const {
 *       add,
 *       subtract,
 *     } = require("./exports");
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Shorter function syntax
 * ============================================================
 *
 * You can define functions first:
 */

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

/*
 * Then attach them to exports:
 */

exports.multiply = multiply;

exports.divide = divide;

/*
 * This creates:
 *
 *
 *     module.exports = {
 *       name,
 *       age,
 *       add,
 *       subtract,
 *       multiply,
 *       divide,
 *     };
 *
 *
 * conceptually.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. The important difference
 * ============================================================
 *
 * This works:
 *
 *
 *     exports.name = "Shiva";
 *
 *
 * Because you are adding a property to the existing object.
 *
 *
 * But this does NOT work as expected:
 *
 *
 *     exports = {
 *       name: "Shiva"
 *     };
 *
 *
 * Why?
 *
 * Because now `exports` points to a NEW object.
 *
 *
 * `module.exports` still points to the ORIGINAL object.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Visualizing the problem
 * ============================================================
 *
 * Initially:
 *
 *
 *     exports ──────────┐
 *                       │
 *                       ▼
 *                module.exports
 *                       │
 *                       ▼
 *                     {}
 *
 *
 * After:
 *
 *
 *     exports = {
 *       name: "Shiva"
 *     };
 *
 *
 * The references become:
 *
 *
 *     exports
 *       │
 *       ▼
 *     { name: "Shiva" }
 *
 *
 *     module.exports
 *       │
 *       ▼
 *     {}
 *
 *
 * They are no longer pointing to the same object.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Example of the mistake
 * ============================================================
 *
 * DO NOT do this when you want to replace the exported value:
 *
 *
 *     exports = {
 *       name: "Shiva",
 *     };
 *
 *
 * `require()` uses:
 *
 *
 *     module.exports
 *
 *
 * not the local `exports` variable.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Correct way to replace exports
 * ============================================================
 *
 * If you want to completely replace the exported value:
 *
 *
 *     module.exports = {
 *       name: "Shiva",
 *     };
 *
 *
 * This changes the actual value returned by require().
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. exports.property is convenient
 * ============================================================
 *
 * This:
 *
 *
 *     exports.createUser =
 *       createUser;
 *
 *
 * is convenient when you have many named exports.
 *
 *
 * Example:
 */

function createUser(name) {
  return {
    name,
  };
}

function deleteUser(id) {
  return {
    deleted: true,
    id,
  };
}

exports.createUser = createUser;

exports.deleteUser = deleteUser;

/*
 * ============================================================
 * 10. Equivalent code
 * ============================================================
 *
 * These are effectively equivalent:
 *
 *
 *     exports.createUser = createUser;
 *
 *
 * and:
 *
 *
 *     module.exports.createUser = createUser;
 *
 *
 * Both add a property to the same exports object.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. But these are NOT equivalent
 * ============================================================
 *
 *
 *     exports = createUser;
 *
 *
 * is NOT equivalent to:
 *
 *
 *     module.exports = createUser;
 *
 *
 * The second one actually changes the module's exported value.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Single function export
 * ============================================================
 *
 * Suppose you want:
 *
 *
 *     const createUser =
 *       require("./user");
 *
 *
 * to directly return a function.
 *
 *
 * Use:
 *
 *
 *     module.exports = createUser;
 *
 *
 * NOT:
 *
 *
 *     exports = createUser;
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Multiple named exports
 * ============================================================
 *
 * If you want:
 *
 *
 *     const {
 *       createUser,
 *       deleteUser,
 *     } = require("./user");
 *
 *
 * you can use:
 *
 *
 *     exports.createUser = createUser;
 *     exports.deleteUser = deleteUser;
 *
 *
 * Or:
 *
 *
 *     module.exports = {
 *       createUser,
 *       deleteUser,
 *     };
 *
 *
 * Both are valid.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Recommended style
 * ============================================================
 *
 * For beginners, this is usually clearer:
 *
 *
 *     module.exports = {
 *       createUser,
 *       deleteUser,
 *     };
 *
 *
 * It makes the public API of the module obvious.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. CommonJS module API example
 * ============================================================
 *
 * Imagine:
 *
 *
 *     user.service.js
 *
 *
 *     function createUser(data) {
 *       // ...
 *     }
 *
 *
 *     function findUser(id) {
 *       // ...
 *     }
 *
 *
 *     function updateUser(id, data) {
 *       // ...
 *     }
 *
 *
 *     function deleteUser(id) {
 *       // ...
 *     }
 *
 *
 *     module.exports = {
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
 * 16. Importing the module
 * ============================================================
 *
 * Another CommonJS file:
 *
 *
 *     const userService =
 *       require("./user.service");
 *
 *
 * Then:
 *
 *
 *     userService.createUser();
 *
 *     userService.findUser();
 *
 *     userService.updateUser();
 *
 *     userService.deleteUser();
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Destructuring imports
 * ============================================================
 *
 * You can also write:
 *
 *
 *     const {
 *       createUser,
 *       findUser,
 *     } = require("./user.service");
 *
 *
 * Then:
 *
 *
 *     createUser();
 *     findUser();
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Mixing exports and module.exports
 * ============================================================
 *
 * Technically you can write:
 *
 *
 *     exports.a = 10;
 *
 *     module.exports.b = 20;
 *
 *
 * Both work because they initially refer to the same object.
 *
 *
 * But mixing styles unnecessarily can make code harder to
 * understand.
 *
 * Prefer one clear style.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Dangerous pattern
 * ============================================================
 *
 * Avoid:
 *
 *
 *     exports.a = 10;
 *
 *     exports = {
 *       b: 20,
 *     };
 *
 *
 * The final exported object still contains `a`, not the new
 * object assigned to `exports`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Why does this happen?
 * ============================================================
 *
 * Think of variables as references.
 *
 *
 * Initially:
 *
 *
 *     exports ────────┐
 *                     ▼
 *             module.exports
 *
 *
 * Both point to the same object.
 *
 *
 * This:
 *
 *
 *     exports.a = 10;
 *
 *
 * modifies the shared object.
 *
 *
 * But this:
 *
 *
 *     exports = {};
 *
 *
 * changes where the local `exports` variable points.
 *
 *
 * It does NOT change `module.exports`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. require() only cares about module.exports
 * ============================================================
 *
 * This is the most important rule.
 *
 *
 *     require("./file")
 *
 *
 * ultimately returns:
 *
 *
 *     module.exports
 *
 *
 * Therefore:
 *
 *
 *     exports.foo = foo;
 *
 *
 * works because it modifies the same object.
 *
 *
 * But:
 *
 *
 *     exports = foo;
 *
 *
 * does not work because it only reassigns the local variable.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Real backend example
 * ============================================================
 *
 * A controller:
 *
 *
 *     async function register(req, res) {
 *       // ...
 *     }
 *
 *
 *     async function login(req, res) {
 *       // ...
 *     }
 *
 *
 *     exports.register = register;
 *     exports.login = login;
 *
 *
 * Another option:
 *
 *
 *     module.exports = {
 *       register,
 *       login,
 *     };
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Service example
 * ============================================================
 */

function hashPassword(password) {
  // Password hashing would happen here.
  return password;
}

function verifyPassword(password, hash) {
  // Password verification would happen here.
  return password === hash;
}

module.exports = {
  hashPassword,
  verifyPassword,
};

/*
 * This is a typical CommonJS service API.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. The rule to remember
 * ============================================================
 *
 *
 * SAFE:
 *
 *     exports.foo = foo;
 *
 *
 * SAFE:
 *
 *     module.exports.foo = foo;
 *
 *
 * SAFE:
 *
 *     module.exports = {
 *       foo,
 *     };
 *
 *
 * NOT equivalent:
 *
 *     exports = foo;
 *
 *
 * If replacing the complete export:
 *
 *     module.exports = foo;
 *
 * ============================================================
 */

/*
 * ============================================================
 * FINAL SUMMARY
 * ============================================================
 *
 *
 * `exports`:
 *
 *     A convenient reference to the initial
 *     `module.exports` object.
 *
 *
 * `module.exports`:
 *
 *     The actual value returned by require().
 *
 *
 * ============================================================
 *
 * Remember:
 *
 *
 *     exports.foo = foo;
 *
 *
 * means:
 *
 *
 *     Add `foo` to the exported object.
 *
 *
 * But:
 *
 *
 *     exports = foo;
 *
 *
 * means:
 *
 *
 *     Make the local `exports` variable point somewhere else.
 *
 *
 * It does NOT replace module.exports.
 *
 *
 * ============================================================
 *
 * BEST PRACTICAL RULE:
 *
 *     Use `module.exports = {...}` for clear module APIs.
 *
 *     Use `exports.foo = foo` for simple named exports if
 *     your project consistently follows that style.
 *
 * ============================================================
 */
