/**
 * ============================================================
 * JavaScript for Node.js
 * ============================================================
 *
 * File: scope.js
 *
 * Topic:
 * Scope, Lexical Scope, Block Scope, Function Scope,
 * Module Scope, Shadowing, Hoisting, and TDZ
 *
 * ============================================================
 *
 * Scope answers one important question:
 *
 *     "Where can this variable be accessed?"
 *
 * JavaScript has several important scopes:
 *
 *     1. Global scope
 *     2. Module scope
 *     3. Function scope
 *     4. Block scope
 *     5. Lexical scope
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Global scope
 * ============================================================
 *
 * A variable declared outside functions/blocks may be
 * accessible throughout the relevant program/module.
 *
 * In Node.js CommonJS modules, top-level variables are NOT
 * properties of the global object.
 *
 * ============================================================
 */

const applicationName = "Node.js Mastery";

function showApplicationName() {
  console.log(applicationName);
}

showApplicationName();

/*
 * The function can access `applicationName` because JavaScript
 * looks outward through its lexical scope.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Node.js module scope
 * ============================================================
 *
 * Important Node.js concept:
 *
 * Each CommonJS file is treated as its own module scope.
 *
 * Example:
 *
 *     const secret = "hello";
 *
 *
 * `secret` belongs to this module.
 *
 * It is not automatically available in another .js file.
 *
 * ============================================================
 */

const moduleSecret = "This belongs to this module";

console.log(moduleSecret);

/*
 * Another file cannot directly do:
 *
 *     console.log(moduleSecret);
 *
 *
 * To share values between Node.js modules, use:
 *
 *     module.exports
 *     require()
 *
 *
 * We will study this in:
 *
 *     02_modules/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Function scope
 * ============================================================
 *
 * Variables declared using `var` are function-scoped.
 *
 * ============================================================
 */

function functionScopeExample() {
  var message = "Inside function";

  console.log(message);
}

functionScopeExample();

/*
 * `message` cannot be accessed outside the function:
 *
 *
 *     console.log(message);
 *
 *
 * That would cause:
 *
 *     ReferenceError
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. `var` is function-scoped
 * ============================================================
 *
 * This is an important difference between `var` and
 * `let`/`const`.
 * ============================================================
 */

function varExample() {
  if (true) {
    var value = 100;
  }

  /*
   * `var` ignores the block boundary.
   */

  console.log(value);
}

varExample();

/*
 * Output:
 *
 *     100
 *
 *
 * Because `var` is function-scoped.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. `let` is block-scoped
 * ============================================================
 */

function letExample() {
  if (true) {
    let value = 100;

    console.log("Inside block:", value);
  }

  /*
   * This would fail:
   *
   *     console.log(value);
   *
   * because `value` only exists inside the block.
   */
}

letExample();

/*
 * ============================================================
 * 6. `const` is block-scoped
 * ============================================================
 */

if (true) {
  const message = "Block scoped";

  console.log(message);
}

/*
 * This would fail:
 *
 *     console.log(message);
 *
 *
 * because `message` only exists inside the block.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. What is a block?
 * ============================================================
 *
 * A block is code surrounded by `{}`.
 *
 * Examples:
 *
 *     if (...) {
 *     }
 *
 *     for (...) {
 *     }
 *
 *     while (...) {
 *     }
 *
 *     {
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Standalone block
 * ============================================================
 */

{
  const privateValue = "Only available here";

  console.log(privateValue);
}

/*
 * `privateValue` cannot be accessed outside this block.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Lexical scope
 * ============================================================
 *
 * Lexical scope means that variable accessibility is
 * determined by where code is written.
 *
 * Example:
 */

const outerValue = "Outer";

function outerFunction() {
  const innerValue = "Inner";

  function innerFunction() {
    console.log(outerValue);

    console.log(innerValue);
  }

  innerFunction();
}

outerFunction();

/*
 * `innerFunction()` can access:
 *
 *     innerValue
 *
 * and:
 *
 *     outerValue
 *
 *
 * because it is nested inside `outerFunction()`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Scope chain
 * ============================================================
 *
 * When JavaScript encounters a variable:
 *
 *     console.log(value);
 *
 *
 * it searches the scope chain.
 *
 *
 * Example:
 *
 *
 *     Global Scope
 *          │
 *          ▼
 *     outerFunction
 *          │
 *          ▼
 *     innerFunction
 *
 *
 * If `innerFunction` cannot find a variable,
 * JavaScript searches its parent scope.
 *
 * Then the parent's parent.
 *
 * Eventually it reaches the outermost scope.
 *
 * ============================================================
 */

const globalValue = "GLOBAL";

function outer() {
  const outerValue = "OUTER";

  function inner() {
    const innerValue = "INNER";

    console.log(innerValue);

    console.log(outerValue);

    console.log(globalValue);
  }

  inner();
}

outer();

/*
 * Search order:
 *
 *     inner scope
 *         ↓
 *     outer scope
 *         ↓
 *     global/module scope
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Variable shadowing
 * ============================================================
 *
 * A nested scope can declare a variable with the same name
 * as an outer variable.
 *
 * The inner variable "shadows" the outer variable.
 *
 * ============================================================
 */

const name = "Outer Shiva";

function shadowExample() {
  const name = "Inner Shiva";

  console.log(name);
}

shadowExample();

console.log(name);

/*
 * Output:
 *
 *     Inner Shiva
 *     Outer Shiva
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Shadowing with blocks
 * ============================================================
 */

const role = "user";

{
  const role = "admin";

  console.log("Inside:", role);
}

console.log("Outside:", role);

/*
 * Output:
 *
 *     Inside: admin
 *     Outside: user
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Illegal shadowing
 * ============================================================
 *
 * Some combinations of `let` and `var` inside nested scopes
 * can produce syntax errors.
 *
 * Example:
 *
 *
 *     let value = 10;
 *
 *     {
 *       var value = 20;
 *     }
 *
 *
 * This is not allowed because `var` is function-scoped and
 * conflicts with the existing lexical declaration.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Hoisting
 * ============================================================
 *
 * JavaScript processes declarations before executing code.
 *
 * Function declarations are available before their written
 * position.
 *
 * ============================================================
 */

sayHello();

function sayHello() {
  console.log("Hello from hoisted function");
}

/*
 * This works because function declarations are hoisted.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. `var` hoisting
 * ============================================================
 *
 * `var` declarations are hoisted.
 *
 * ============================================================
 */

function varHoisting() {
  console.log(value);

  var value = 100;
}

varHoisting();

/*
 * Conceptually, JavaScript behaves approximately like:
 *
 *
 *     var value;
 *
 *     console.log(value);
 *
 *     value = 100;
 *
 *
 * Therefore the first console.log prints:
 *
 *     undefined
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Temporal Dead Zone (TDZ)
 * ============================================================
 *
 * `let` and `const` are also hoisted internally, but they
 * cannot be accessed before their declaration is initialized.
 *
 * The period between entering the scope and initialization
 * is called the Temporal Dead Zone.
 *
 * ============================================================
 */

/*
 * This would throw ReferenceError:
 *
 *
 *     console.log(username);
 *
 *     const username = "Shiva";
 *
 *
 * The variable exists in the scope, but cannot be accessed
 * before initialization.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. TDZ example
 * ============================================================
 */

{
  /*
   * Don't execute the following code:
   *
   * console.log(userName);
   *
   * const userName = "Shiva";
   *
   *
   * It produces:
   *
   * ReferenceError
   */
}

/*
 * ============================================================
 * 18. `var` vs `let` vs `const`
 * ============================================================
 *
 *
 *                  var       let       const
 *                  ───       ───       ─────
 *
 * Scope             function  block     block
 *
 * Reassignable      yes       yes       no
 *
 * Redeclarable      yes       no        no
 *
 * TDZ               no        yes       yes
 *
 * Modern usage      avoid     use       prefer
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Nested blocks
 * ============================================================
 */

const level = "Level 1";

{
  const level = "Level 2";

  {
    const level = "Level 3";

    console.log(level);
  }

  console.log(level);
}

console.log(level);

/*
 * Output:
 *
 *     Level 3
 *     Level 2
 *     Level 1
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Closures
 * ============================================================
 *
 * A closure occurs when a function remembers variables from
 * its lexical scope even after the outer function has finished.
 *
 * ============================================================
 */

function createCounter() {
  let count = 0;

  return function () {
    count++;

    return count;
  };
}

const counter = createCounter();

console.log(counter());

console.log(counter());

console.log(counter());

/*
 * Output:
 *
 *     1
 *     2
 *     3
 *
 *
 * The returned function still has access to `count`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Multiple closures
 * ============================================================
 *
 * Each call to `createCounter()` creates a separate scope.
 * ============================================================
 */

const counterA = createCounter();

const counterB = createCounter();

console.log(counterA());

console.log(counterA());

console.log(counterB());

console.log(counterA());

/*
 * Output:
 *
 *     1
 *     2
 *     1
 *     3
 *
 *
 * `counterA` and `counterB` have independent `count`
 * variables.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Closures in Node.js
 * ============================================================
 *
 * This pattern is frequently used for:
 *
 *     - middleware factories
 *     - configuration
 *     - private state
 *     - service factories
 *     - event handlers
 *     - callbacks
 *
 * Example:
 */

function createLogger(prefix) {
  return function (message) {
    console.log(`[${prefix}] ${message}`);
  };
}

const info = createLogger("INFO");

const error = createLogger("ERROR");

info("Server started");

error("Database failed");

/*
 * Each function remembers its `prefix`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Block scope inside loops
 * ============================================================
 *
 * `let` creates a separate binding for each iteration in
 * common loop scenarios.
 * ============================================================
 */

for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log("let:", i);
  }, 100);
}

/*
 * Typical output:
 *
 *     let: 0
 *     let: 1
 *     let: 2
 *
 *
 * This is one reason `let` is preferred over `var` for
 * loop counters.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Why `var` can behave differently in loops
 * ============================================================
 *
 * Example:
 *
 *
 *     for (
 *       var i = 0;
 *       i < 3;
 *       i++
 *     ) {
 *       setTimeout(() => {
 *         console.log(i);
 *       }, 100);
 *     }
 *
 *
 * Typical output:
 *
 *     3
 *     3
 *     3
 *
 *
 * Because all callbacks share the same function-scoped `i`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Module scope in real Node.js
 * ============================================================
 *
 * Consider:
 *
 *
 *     user.js
 *
 *     const user = {
 *       name: "Shiva"
 *     };
 *
 *
 *     server.js
 *
 *     console.log(user);
 *
 *
 * `server.js` cannot automatically access `user`.
 *
 *
 * You need:
 *
 *
 *     module.exports = user;
 *
 *
 * and:
 *
 *
 *     const user = require("./user");
 *
 *
 * This is called module encapsulation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Global object in Node.js
 * ============================================================
 *
 * Node.js provides:
 *
 *     global
 *
 *
 * Modern JavaScript also provides:
 *
 *     globalThis
 *
 * ============================================================
 */

console.log(typeof global);

console.log(typeof globalThis);

/*
 * In Node.js:
 *
 *     globalThis
 *
 * provides a standard cross-platform reference to the global
 * object.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Don't abuse global variables
 * ============================================================
 *
 * Avoid putting application state into the global scope.
 *
 * Bad:
 *
 *
 *     global.currentUser = user;
 *
 *
 * This can create:
 *
 *     - hidden dependencies
 *     - difficult testing
 *     - accidental mutations
 *     - concurrency problems
 *
 *
 * Prefer:
 *
 *     function parameters
 *     module exports
 *     services
 *     request context
 *     dependency injection
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Practical Node.js example
 * ============================================================
 */

function createUserService() {
  const serviceName = "UserService";

  function createUser(userData) {
    console.log(`${serviceName}: creating user`);

    return {
      id: Date.now(),
      ...userData,
    };
  }

  return {
    createUser,
  };
}

const userService = createUserService();

const newUser = userService.createUser({
  name: "Shiva",
  role: "user",
});

console.log(newUser);

/*
 * `createUser()` can access `serviceName` because of lexical
 * scope and closure.
 *
 * This pattern becomes useful when designing services and
 * dependency injection.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Scope and security
 * ============================================================
 *
 * Scope can help keep implementation details private.
 *
 * Example:
 */

function createBankAccount() {
  let balance = 0;

  return {
    deposit(amount) {
      balance += amount;
    },

    getBalance() {
      return balance;
    },
  };
}

const account = createBankAccount();

account.deposit(1000);

console.log(account.getBalance());

/*
 * There is no direct:
 *
 *     account.balance
 *
 * property.
 *
 * The `balance` variable is protected by the closure.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Important Node.js connection
 * ============================================================
 *
 * You will repeatedly see this pattern:
 *
 *
 *     function createSomething(dependency) {
 *
 *       return function () {
 *
 *         // dependency is remembered
 *
 *       };
 *     }
 *
 *
 * This is closure + lexical scope.
 *
 *
 * Express middleware factories, authorization middleware,
 * configuration factories, and many Node.js libraries use
 * similar patterns.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Scope chain visualization
 * ============================================================
 *
 *
 *                  Module Scope
 *                       │
 *                       ▼
 *               ┌───────────────┐
 *               │ outerFunction │
 *               └───────┬───────┘
 *                       │
 *                       ▼
 *               ┌───────────────┐
 *               │ innerFunction │
 *               └───────┬───────┘
 *                       │
 *                       ▼
 *                 Variable lookup
 *
 *
 * JavaScript searches from the current scope outward.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Best practices
 * ============================================================
 *
 * ✓ Prefer `const`.
 *
 * ✓ Use `let` when reassignment is required.
 *
 * ✓ Avoid `var` in modern Node.js.
 *
 * ✓ Keep variables in the smallest scope necessary.
 *
 * ✓ Avoid unnecessary global state.
 *
 * ✓ Understand lexical scope.
 *
 * ✓ Understand closures.
 *
 * ✓ Understand module scope.
 *
 * ✓ Don't rely on hoisting for code organization.
 *
 * ✓ Be aware of shadowing.
 *
 * ✓ Understand the Temporal Dead Zone.
 *
 * ============================================================
 */

/*
 * ============================================================
 * SUMMARY
 * ============================================================
 *
 * Scope:
 *
 *     Determines where a variable can be accessed.
 *
 *
 * Module scope:
 *
 *     Each Node.js module has its own isolated top-level scope.
 *
 *
 * Function scope:
 *
 *     `var` is function-scoped.
 *
 *
 * Block scope:
 *
 *     `let` and `const` are block-scoped.
 *
 *
 * Lexical scope:
 *
 *     Scope is determined by where code is written.
 *
 *
 * Scope chain:
 *
 *     Current scope → parent scope → outer scope.
 *
 *
 * Shadowing:
 *
 *     Inner variable hides an outer variable with the same name.
 *
 *
 * Hoisting:
 *
 *     Declarations are processed before normal execution.
 *
 *
 * TDZ:
 *
 *     `let` and `const` cannot be accessed before initialization.
 *
 *
 * Closure:
 *
 *     A function remembers variables from its lexical scope.
 *
 *
 * Node.js:
 *
 *     Module scope + closures are fundamental to backend code.
 *
 * ============================================================
 */
