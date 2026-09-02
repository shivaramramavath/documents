/**
 * ============================================================
 * JavaScript for Node.js
 * ============================================================
 *
 * File: functions.js
 *
 * Topic:
 * Functions in JavaScript
 *
 * ============================================================
 *
 * Functions are reusable blocks of code.
 *
 * They are one of the most important concepts in JavaScript
 * and are used everywhere in Node.js:
 *
 *     - Controllers
 *     - Services
 *     - Middleware
 *     - Utility functions
 *     - Callbacks
 *     - Event handlers
 *     - Route handlers
 *     - Database functions
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Function declaration
 * ============================================================
 */

function greet() {
  console.log("Hello Node.js");
}

greet();

/*
 * Function structure:
 *
 *
 *     function greet() {
 *       // code
 *     }
 *
 *
 *     greet();
 *
 *
 * `greet` is the function name.
 *
 * `()` contains parameters.
 *
 * `{}` contains the function body.
 *
 * `greet()` calls the function.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Function with parameters
 * ============================================================
 */

function greetUser(name) {
  console.log(`Hello ${name}`);
}

greetUser("Shiva");

/*
 * `name` is a parameter.
 *
 * "Shiva" is an argument.
 *
 *
 * Parameter:
 *
 *     function greetUser(name)
 *
 *
 * Argument:
 *
 *     greetUser("Shiva")
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Multiple parameters
 * ============================================================
 */

function add(a, b) {
  console.log(a + b);
}

add(10, 20);

/*
 * ============================================================
 * 4. Return value
 * ============================================================
 *
 * A function can return a value to its caller.
 * ============================================================
 */

function sum(a, b) {
  return a + b;
}

const result = sum(10, 20);

console.log(result);

/*
 * `return` sends the value back to the caller.
 *
 *
 *     sum()
 *       ↓
 *     30
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Return stops function execution
 * ============================================================
 */

function testReturn() {
  console.log("Before return");

  return;

  // This code will never execute.
  console.log("After return");
}

testReturn();

/*
 * ============================================================
 * 6. Returning objects
 * ============================================================
 */

function createUser(name, age) {
  return {
    name,
    age,
  };
}

const user = createUser("Shiva", 21);

console.log(user);

/*
 * ============================================================
 * 7. Returning arrays
 * ============================================================
 */

function getNumbers() {
  return [10, 20, 30];
}

const numbers = getNumbers();

console.log(numbers);

/*
 * ============================================================
 * 8. Default parameters
 * ============================================================
 */

function welcome(name = "Guest") {
  console.log(`Welcome ${name}`);
}

welcome("Shiva");

welcome();

/*
 * If no argument is provided:
 *
 *     name = "Guest"
 *
 * is used.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Multiple default parameters
 * ============================================================
 */

function createAccount(name = "Guest", role = "user") {
  return {
    name,
    role,
  };
}

console.log(createAccount());

console.log(createAccount("Shiva", "admin"));

/*
 * ============================================================
 * 10. Function expression
 * ============================================================
 *
 * A function can be stored inside a variable.
 * ============================================================
 */

const multiply = function (a, b) {
  return a * b;
};

console.log(multiply(5, 4));

/*
 * ============================================================
 * 11. Anonymous function
 * ============================================================
 *
 * A function without a name is called an anonymous function.
 *
 * Example:
 *
 *     function (a, b) {
 *       return a + b;
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Arrow function
 * ============================================================
 */

const subtract = (a, b) => {
  return a - b;
};

console.log(subtract(20, 5));

/*
 * ============================================================
 * 13. Arrow function shorthand
 * ============================================================
 */

const square = (number) => number * number;

console.log(square(5));

/*
 * If the arrow function contains only one expression:
 *
 *
 *     const square = (number) => number * number;
 *
 *
 * `return` is implicit.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Arrow function with one parameter
 * ============================================================
 */

const double = (number) => number * 2;

console.log(double(10));

/*
 * Parentheses around a single parameter are optional:
 *
 *
 *     number => number * 2
 *
 *
 * But many teams prefer:
 *
 *
 *     (number) => number * 2
 *
 *
 * for consistency.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Arrow function returning object
 * ============================================================
 *
 * Be careful!
 *
 * This:
 *
 *     () => {
 *       name: "Shiva"
 *     }
 *
 * does NOT return an object.
 *
 *
 * Correct:
 *
 *     () => ({
 *       name: "Shiva"
 *     })
 *
 * ============================================================
 */

const getUser = () => ({
  id: 1,
  name: "Shiva",
});

console.log(getUser());

/*
 * ============================================================
 * 16. Rest parameters
 * ============================================================
 *
 * Rest parameters collect multiple arguments into an array.
 * ============================================================
 */

function addAll(...numbers) {
  let total = 0;

  for (const number of numbers) {
    total += number;
  }

  return total;
}

console.log(addAll(1, 2, 3, 4, 5));

/*
 * numbers becomes:
 *
 *     [1, 2, 3, 4, 5]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Rest parameter must be last
 * ============================================================
 *
 * Correct:
 *
 *     function test(first, ...rest) {}
 *
 *
 * Incorrect:
 *
 *     function test(...rest, last) {}
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. arguments object
 * ============================================================
 *
 * Normal functions have access to `arguments`.
 * ============================================================
 */

function showArguments(a, b) {
  console.log(arguments);

  console.log(arguments[0]);

  console.log(arguments[1]);
}

showArguments("A", "B");

/*
 * Modern JavaScript usually prefers rest parameters:
 *
 *
 *     function test(...args) {}
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Arrow functions don't have their own arguments
 * ============================================================
 *
 * Do not expect:
 *
 *     arguments
 *
 * to behave like a normal function inside an arrow function.
 *
 * Prefer rest parameters.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Function scope
 * ============================================================
 */

function scopeExample() {
  const message = "Inside function";

  console.log(message);
}

scopeExample();

/*
 * `message` cannot be accessed outside the function.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Nested functions
 * ============================================================
 */

function outer() {
  console.log("Outer");

  function inner() {
    console.log("Inner");
  }

  inner();
}

outer();

/*
 * ============================================================
 * 22. Function calling another function
 * ============================================================
 */

function calculateTax(amount) {
  return amount * 0.18;
}

function calculateTotal(amount) {
  const tax = calculateTax(amount);

  return amount + tax;
}

console.log(calculateTotal(1000));

/*
 * This pattern is extremely common in backend applications.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Functions as values
 * ============================================================
 *
 * JavaScript functions are first-class values.
 *
 * This means functions can be:
 *
 *     - Stored in variables
 *     - Passed as arguments
 *     - Returned from functions
 *     - Stored in objects
 *     - Stored in arrays
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Passing function as an argument
 * ============================================================
 */

function execute(operation) {
  operation();
}

function sayHello() {
  console.log("Hello");
}

execute(sayHello);

/*
 * This concept is called a callback.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Callback function
 * ============================================================
 */

function processUser(name, callback) {
  console.log(`Processing ${name}`);

  callback();
}

processUser("Shiva", () => {
  console.log("User processed");
});

/*
 * Node.js uses callbacks heavily in APIs such as:
 *
 *     fs.readFile(...)
 *     EventEmitter
 *     HTTP servers
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Callback with parameters
 * ============================================================
 */

function calculate(a, b, callback) {
  const result = a + b;

  callback(result);
}

calculate(10, 20, (result) => {
  console.log("Result:", result);
});

/*
 * ============================================================
 * 27. Higher-order function
 * ============================================================
 *
 * A higher-order function:
 *
 *     - accepts a function
 *     OR
 *     - returns a function
 *
 * ============================================================
 */

function calculateOperation(operation, a, b) {
  return operation(a, b);
}

const addition = (a, b) => a + b;

const multiplication = (a, b) => a * b;

console.log(calculateOperation(addition, 10, 20));

console.log(calculateOperation(multiplication, 10, 20));

/*
 * ============================================================
 * 28. Function returning a function
 * ============================================================
 */

function createMultiplier(multiplier) {
  return (number) => {
    return number * multiplier;
  };
}

const doubleNumber = createMultiplier(2);

const tripleNumber = createMultiplier(3);

console.log(doubleNumber(10));

console.log(tripleNumber(10));

/*
 * This introduces the concept of closures.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Closure
 * ============================================================
 */

function createCounter() {
  let count = 0;

  return () => {
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
 * The returned function remembers `count`.
 *
 * This is called a closure.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. IIFE
 * ============================================================
 *
 * IIFE = Immediately Invoked Function Expression.
 *
 * ============================================================
 */

(function () {
  console.log("IIFE executed");
})();

/*
 * The function is created and immediately executed.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Arrow IIFE
 * ============================================================
 */

(() => {
  console.log("Arrow IIFE");
})();

/*
 * ============================================================
 * 32. Recursive function
 * ============================================================
 *
 * A recursive function calls itself.
 * ============================================================
 */

function countdown(number) {
  if (number <= 0) {
    return;
  }

  console.log(number);

  countdown(number - 1);
}

countdown(5);

/*
 * Flow:
 *
 *     countdown(5)
 *         ↓
 *     countdown(4)
 *         ↓
 *     countdown(3)
 *         ↓
 *     countdown(2)
 *         ↓
 *     countdown(1)
 *         ↓
 *     countdown(0)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Function hoisting
 * ============================================================
 *
 * Function declarations are hoisted.
 * ============================================================
 */

hoistedFunction();

function hoistedFunction() {
  console.log("Function was hoisted");
}

/*
 * This works because function declarations are hoisted.
 *
 ============================================================
 */

/*
 * ============================================================
 * 34. Function expression hoisting
 * ============================================================
 *
 * This does NOT work:
 *
 *
 *     test();
 *
 *     const test = function () {};
 *
 *
 * because the variable is not initialized before the call.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. this in normal functions
 * ============================================================
 */

const userObject = {
  name: "Shiva",

  greet: function () {
    console.log(`Hello ${this.name}`);
  },
};

userObject.greet();

/*
 * In a method call:
 *
 *     userObject.greet()
 *
 *
 * `this` refers to userObject.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Arrow functions and this
 * ============================================================
 *
 * Arrow functions do NOT have their own `this`.
 *
 * They capture `this` from the surrounding lexical scope.
 *
 * This difference is very important in Node.js.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Function method shorthand
 * ============================================================
 */

const account = {
  name: "Shiva",

  login() {
    console.log(`${this.name} logged in`);
  },
};

account.login();

/*
 * Instead of:
 *
 *     login: function () {}
 *
 *
 * we can write:
 *
 *     login() {}
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Pure function
 * ============================================================
 *
 * A pure function:
 *
 *     - Same input → same output
 *     - Doesn't modify external state
 *
 * ============================================================
 */

function pureAdd(a, b) {
  return a + b;
}

console.log(pureAdd(2, 3));

/*
 * Pure functions are easier to test.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Impure function
 * ============================================================
 */

let total = 0;

function addToTotal(value) {
  total += value;
}

addToTotal(10);

console.log(total);

/*
 * This function modifies external state.
 *
 Therefore it is not pure.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. Function with validation
 * ============================================================
 */

function divideNumbers(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("Arguments must be numbers");
  }

  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }

  return a / b;
}

try {
  console.log(divideNumbers(10, 2));
} catch (error) {
  console.error(error.message);
}

/*
 * Functions should validate their inputs when appropriate.
 *
 ============================================================
 */

/*
 * ============================================================
 * 41. Function with object parameter
 * ============================================================
 */

function displayUser({ name, age, role }) {
  console.log(name, age, role);
}

displayUser({
  name: "Shiva",
  age: 21,
  role: "student",
});

/*
 * This combines functions with destructuring.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 42. Function with options object
 * ============================================================
 *
 * This pattern is very common in Node.js libraries.
 * ============================================================
 */

function createServer({ port = 3000, host = "localhost" } = {}) {
  console.log(`Server: ${host}:${port}`);
}

createServer();

createServer({
  port: 8080,
});

createServer({
  port: 5000,
  host: "127.0.0.1",
});

/*
 * This avoids functions with many positional arguments.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 43. Function composition
 * ============================================================
 */

function doubleValue(value) {
  return value * 2;
}

function addTen(value) {
  return value + 10;
}

const composed = addTen(doubleValue(5));

console.log(composed);

/*
 * Flow:
 *
 *     5
 *     ↓
 *     double
 *     ↓
 *     10
 *     ↓
 *     add 10
 *     ↓
 *     20
 *
 * ============================================================
 */

/*
 * ============================================================
 * 44. Async function
 * ============================================================
 */

async function fetchUser() {
  return {
    id: 1,
    name: "Shiva",
  };
}

fetchUser().then((user) => {
  console.log(user);
});

/*
 * An async function always returns a Promise.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 45. Async function with await
 * ============================================================
 */

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function processData() {
  console.log("Starting");

  await delay(1000);

  console.log("Finished");
}

processData();

/*
 * This is fundamental to Node.js backend development.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 46. Generator functions
 * ============================================================
 *
 * Advanced JavaScript feature.
 *
 * Generator functions use:
 *
 *     function*
 *
 *
 * and `yield`.
 *
 * ============================================================
 */

function* numbersGenerator() {
  yield 1;

  yield 2;

  yield 3;
}

const generator = numbersGenerator();

console.log(generator.next());

console.log(generator.next());

console.log(generator.next());

console.log(generator.next());

/*
 * Generator functions are useful for producing values lazily.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 47. Function naming
 * ============================================================
 *
 * Prefer descriptive names.
 *
 *
 * ❌ Bad:
 *
 *     function x() {}
 *
 *
 * Better:
 *
 *     function createUser() {}
 *
 *
 * Better:
 *
 *     function findUserById() {}
 *
 *
 * Better:
 *
 *     function validateEmail() {}
 *
 *
 * Good function names make backend code easier to understand.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 48. Node.js backend function example
 * ============================================================
 *
 * A typical architecture might look like:
 *
 *
 *     Controller
 *         ↓
 *     Service
 *         ↓
 *     Repository
 *
 *
 * Example:
 */

async function findUserById(userId) {
  // Database query would happen here.

  return {
    id: userId,
    name: "Shiva",
  };
}

async function getUserController(userId) {
  const user = await findUserById(userId);

  return user;
}

getUserController(101).then((user) => {
  console.log("Controller result:", user);
});

/*
 * ============================================================
 * 49. Function best practices
 * ============================================================
 *
 * ✓ Give functions descriptive names.
 *
 * ✓ Keep functions focused on one responsibility.
 *
 * ✓ Avoid unnecessarily large functions.
 *
 * ✓ Validate inputs when necessary.
 *
 * ✓ Return useful values.
 *
 * ✓ Prefer pure functions where practical.
 *
 * ✓ Use async/await for asynchronous operations.
 *
 * ✓ Use rest parameters instead of arguments when appropriate.
 *
 * ✓ Use options objects when a function has many configuration
 *   parameters.
 *
 * ✓ Avoid hidden global state.
 *
 * ✓ Keep business logic out of HTTP-specific code when possible.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 50. Function concepts to remember
 * ============================================================
 *
 *
 * FUNCTION DECLARATION
 *
 *     function add(a, b) {
 *       return a + b;
 *     }
 *
 *
 * FUNCTION EXPRESSION
 *
 *     const add = function(a, b) {
 *       return a + b;
 *     };
 *
 *
 * ARROW FUNCTION
 *
 *     const add = (a, b) => a + b;
 *
 *
 * CALLBACK
 *
 *     execute(() => {});
 *
 *
 * HIGHER-ORDER FUNCTION
 *
 *     function execute(fn) {}
 *
 *
 * CLOSURE
 *
 *     function outer() {
 *       let value = 10;
 *
 *       return () => value;
 *     }
 *
 *
 * ASYNC FUNCTION
 *
 *     async function getData() {}
 *
 *
 * GENERATOR
 *
 *     function* generate() {}
 *
 * ============================================================
 */
