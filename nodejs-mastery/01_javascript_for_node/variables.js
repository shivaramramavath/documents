/**
 * ============================================================
 * JavaScript for Node.js
 * ============================================================
 *
 * File: variables.js
 *
 * Topic:
 * JavaScript Variables
 *
 * ============================================================
 *
 * Variables are used to store data in memory.
 *
 * In modern JavaScript, we mainly use:
 *
 *     let
 *     const
 *
 * `var` exists but should generally be avoided in modern code.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. `let`
 * ============================================================
 *
 * `let` creates a variable whose value can be changed.
 */

let age = 20;

console.log("Age:", age);

/*
 * Change the value.
 */

age = 21;

console.log("Updated age:", age);

/*
 * Example:
 */

let username = "Shiva";

username = "Ram";

console.log("Username:", username);

/*
 * ============================================================
 * 2. `const`
 * ============================================================
 *
 * `const` creates a variable that cannot be reassigned.
 */

const country = "India";

console.log("Country:", country);

/*
 * This is NOT allowed:
 *
 *     country = "USA";
 *
 *
 * It causes:
 *
 *     TypeError: Assignment to constant variable.
 *
 */

/*
 * ============================================================
 * 3. `let` vs `const`
 * ============================================================
 *
 *
 * let
 * ───
 *
 * Use when the variable needs to be reassigned.
 *
 *
 * const
 * ─────
 *
 * Use when the variable should not be reassigned.
 *
 *
 * Modern Node.js code generally prefers:
 *
 *     const
 *
 * and uses:
 *
 *     let
 *
 * only when reassignment is actually required.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. `var`
 * ============================================================
 *
 * `var` is the older way of declaring variables.
 *
 * It has different scoping behavior from `let` and `const`.
 *
 * Example:
 */

var oldVariable = "old";

console.log("var:", oldVariable);

/*
 * `var` is usually avoided in modern Node.js applications
 * because its function-scoping behavior can cause confusing
 * bugs.
 *
 * Prefer:
 *
 *     const
 *     let
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Variable naming
 * ============================================================
 *
 * JavaScript variable names can contain:
 *
 *     letters
 *     numbers
 *     _
 *     $
 *
 *
 * But they cannot start with a number.
 *
 * Valid:
 */

const firstName = "Shiva";
const user1 = "Ram";
const _privateValue = 100;
const $element = "value";

/*
 * Invalid:
 *
 *     const 1user = "Shiva";
 *
 */

/*
 * ============================================================
 * 6. camelCase
 * ============================================================
 *
 * JavaScript convention:
 *
 *     camelCase
 *
 * Examples:
 */

const firstNameOfUser = "Shiva";
const userEmailAddress = "shiva@example.com";
const accountCreatedAt = new Date();

console.log(firstNameOfUser, userEmailAddress, accountCreatedAt);

/*
 * ============================================================
 * 7. Primitive values
 * ============================================================
 *
 * Variables can store different types of values.
 *
 * Common JavaScript primitive types:
 *
 *     string
 *     number
 *     bigint
 *     boolean
 *     undefined
 *     null
 *     symbol
 *
 * ============================================================
 */

/*
 * String
 */

const name = "Shiva";

/*
 * Number
 */

const marks = 95;

/*
 * Boolean
 */

const isStudent = true;

/*
 * Undefined
 */

let result;

console.log("result:", result);

/*
 * Null
 */

const middleName = null;

/*
 * BigInt
 */

const largeNumber = 12345678901234567890n;

/*
 * Symbol
 */

const id = Symbol("id");

console.log(name);
console.log(marks);
console.log(isStudent);
console.log(result);
console.log(middleName);
console.log(largeNumber);
console.log(id);

/*
 * ============================================================
 * 8. Objects
 * ============================================================
 *
 * Objects store related data together.
 */

const user = {
  name: "Shiva",
  age: 21,
  role: "student",
};

console.log(user);

/*
 * Access object properties:
 */

console.log(user.name);
console.log(user.age);
console.log(user.role);

/*
 * ============================================================
 * 9. const with objects
 * ============================================================
 *
 * IMPORTANT:
 *
 * `const` prevents reassignment of the variable.
 *
 * It does NOT make the object immutable.
 *
 */

const person = {
  name: "Shiva",
  age: 21,
};

/*
 * This is allowed:
 */

person.age = 22;

console.log(person);

/*
 * But this is NOT allowed:
 *
 *     person = {};
 *
 *
 * because `person` itself is a const variable.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. const with arrays
 * ============================================================
 *
 * Arrays are also objects.
 */

const skills = ["JavaScript", "Node.js", "MongoDB"];

/*
 * We can modify the array:
 */

skills.push("Express");

console.log(skills);

/*
 * But we cannot reassign the variable:
 *
 *     skills = [];
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Variable declaration vs initialization
 * ============================================================
 *
 * Declaration:
 */

let score;

/*
 * Initialization:
 */

score = 100;

/*
 * Declaration + initialization:
 */

let rank = 1;

console.log(score);
console.log(rank);

/*
 * ============================================================
 * 12. Multiple variables
 * ============================================================
 *
 * You can declare multiple variables, but separate
 * declarations are generally easier to read.
 */

const first = 10;
const second = 20;
const third = 30;

console.log(first, second, third);

/*
 * ============================================================
 * 13. typeof
 * ============================================================
 *
 * `typeof` tells us the type of a value.
 */

console.log(typeof "Shiva");
console.log(typeof 100);
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof 100n);
console.log(typeof Symbol("id"));
console.log(typeof {});
console.log(typeof []);

/*
 * IMPORTANT:
 *
 *     typeof null
 *
 * returns:
 *
 *     "object"
 *
 * This is a historical JavaScript behavior.
 */

console.log(typeof null);

/*
 * ============================================================
 * 14. Dynamic typing
 * ============================================================
 *
 * JavaScript is dynamically typed.
 *
 * A variable can hold different types of values during its
 * lifetime.
 */

let value = 100;

console.log(value);
console.log(typeof value);

value = "Hello";

console.log(value);
console.log(typeof value);

value = true;

console.log(value);
console.log(typeof value);

/*
 * However, in professional Node.js projects, TypeScript is
 * often used to provide static type checking.
 *
 * We'll cover TypeScript later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Constants for configuration
 * ============================================================
 *
 * In Node.js applications, `const` is frequently used for
 * configuration values.
 */

const PORT = 3000;
const API_VERSION = "v1";
const APP_NAME = "Node Mastery";

console.log(PORT);
console.log(API_VERSION);
console.log(APP_NAME);

/*
 * ============================================================
 * 16. Environment variables
 * ============================================================
 *
 * Node.js provides:
 *
 *     process.env
 *
 *
 * Example:
 *
 *     process.env.PORT
 *
 *
 * Environment variables are commonly used for configuration.
 *
 * Example:
 */

const port = process.env.PORT || 3000;

console.log("Server port:", port);

/*
 * Later we'll learn:
 *
 *     16_environment/
 *
 * including:
 *
 *     dotenv
 *     configuration
 *     development
 *     production
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Avoid magic values
 * ============================================================
 *
 * Instead of:
 */

function calculatePrice(price) {
  return price * 1.18;
}

/*
 * Better:
 */

const GST_RATE = 0.18;

function calculatePriceWithTax(price) {
  return price * (1 + GST_RATE);
}

console.log(calculatePriceWithTax(100));

/*
 * Named constants make code easier to understand.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Variable shadowing
 * ============================================================
 *
 * A variable inside a nested scope can have the same name as
 * one outside.
 *
 * We'll study this deeply in:
 *
 *     scope.js
 *
 * Example:
 */

const message = "outer";

{
  const message = "inner";

  console.log("Inside:", message);
}

console.log("Outside:", message);

/*
 * Output:
 *
 *     Inside: inner
 *     Outside: outer
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Temporal Dead Zone
 * ============================================================
 *
 * `let` and `const` are hoisted but cannot be accessed before
 * their declaration is evaluated.
 *
 *
 * This causes a ReferenceError:
 *
 *
 *     console.log(username);
 *     const username = "Shiva";
 *
 *
 * Don't write code like this.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Best practices for Node.js
 * ============================================================
 *
 * Prefer:
 *
 *     const
 *
 * by default.
 *
 *
 * Use:
 *
 *     let
 *
 * when reassignment is required.
 *
 *
 * Avoid:
 *
 *     var
 *
 * in modern Node.js code.
 *
 *
 * Use meaningful names:
 *
 *     const userId = "123";
 *
 *
 * instead of:
 *
 *     const x = "123";
 *
 *
 * Keep constants clear:
 *
 *     const MAX_RETRIES = 3;
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Backend example
 * ============================================================
 *
 * A typical Node.js service may have:
 */

const serverName = "API Server";
const serverPort = 3000;
const environment = "development";

const databaseName = "timetable";

console.log({
  serverName,
  serverPort,
  environment,
  databaseName,
});

/*
 * This style will become very common when we build:
 *
 *     Express
 *     MongoDB
 *     Redis
 *     Authentication
 *     REST APIs
 *     Microservices
 *
 * ============================================================
 */

/*
 * ============================================================
 * SUMMARY
 * ============================================================
 *
 * `const`
 *     Preferred default.
 *     Cannot be reassigned.
 *
 *
 * `let`
 *     Use when reassignment is required.
 *
 *
 * `var`
 *     Older syntax.
 *     Generally avoid in modern Node.js.
 *
 *
 * Primitive types:
 *
 *     string
 *     number
 *     bigint
 *     boolean
 *     undefined
 *     null
 *     symbol
 *
 *
 * Objects:
 *
 *     object
 *     array
 *     function
 *
 *
 * Node.js applications commonly use `const` heavily.
 *
 * ============================================================
 */
/**
 * ============================================================
 * JavaScript for Node.js
 * ============================================================
 *
 * File: functions.js
 *
 * Topic:
 * Functions
 *
 * ============================================================
 *
 * A function is a reusable block of code that performs a task.
 *
 * Functions are extremely important in Node.js because Node.js
 * uses functions everywhere:
 *
 *     - callbacks
 *     - middleware
 *     - route handlers
 *     - event listeners
 *     - services
 *     - controllers
 *     - utility functions
 *     - async operations
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Function declaration
 * ============================================================
 *
 * Syntax:
 *
 *     function functionName() {
 *         // code
 *     }
 *
 * ============================================================
 */

function greet() {
  console.log("Hello, Node.js!");
}

greet();

/*
 * Calling a function means executing it.
 *
 *     greet();
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Function parameters
 * ============================================================
 *
 * Parameters allow us to pass data into a function.
 * ============================================================
 */

function greetUser(name) {
  console.log(`Hello, ${name}!`);
}

greetUser("Shiva");
greetUser("Ram");

/*
 * `name` is the parameter.
 *
 * "Shiva" and "Ram" are arguments.
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
add(100, 200);

/*
 * ============================================================
 * 4. Return value
 * ============================================================
 *
 * Instead of printing the result, a function can return it.
 * ============================================================
 */

function sum(a, b) {
  return a + b;
}

const result = sum(10, 20);

console.log("Result:", result);

/*
 * The returned value can be stored in a variable.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. `return` stops function execution
 * ============================================================
 */

function checkAge(age) {
  if (age < 18) {
    return "Minor";
  }

  return "Adult";
}

console.log(checkAge(15));
console.log(checkAge(25));

/*
 * Code after `return` won't execute.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Function expression
 * ============================================================
 *
 * A function can be assigned to a variable.
 * ============================================================
 */

const multiply = function (a, b) {
  return a * b;
};

console.log(multiply(5, 4));

/*
 * ============================================================
 * 7. Arrow functions
 * ============================================================
 *
 * Modern JavaScript heavily uses arrow functions.
 *
 * ============================================================
 */

const subtract = (a, b) => {
  return a - b;
};

console.log(subtract(20, 5));

/*
 * ============================================================
 * 8. Arrow function shorthand
 * ============================================================
 *
 * If the function contains only one expression, we can omit
 * the braces and `return`.
 *
 * ============================================================
 */

const square = (number) => number * number;

console.log(square(5));

/*
 * Parentheses can also be omitted for one parameter:
 */

const double = (number) => number * 2;

console.log(double(10));

/*
 * ============================================================
 * 9. Default parameters
 * ============================================================
 *
 * A parameter can have a default value.
 * ============================================================
 */

function greetWithDefault(name = "Guest") {
  console.log(`Hello, ${name}!`);
}

greetWithDefault("Shiva");

greetWithDefault();

/*
 * Output:
 *
 *     Hello, Shiva!
 *     Hello, Guest!
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Multiple default parameters
 * ============================================================
 */

function createUser(name = "Guest", role = "user") {
  return {
    name,
    role,
  };
}

console.log(createUser());

console.log(createUser("Shiva", "admin"));

/*
 * ============================================================
 * 11. Rest parameters
 * ============================================================
 *
 * Rest parameters collect multiple arguments into an array.
 *
 * Syntax:
 *
 *     ...values
 *
 * ============================================================
 */

function total(...numbers) {
  let result = 0;

  for (const number of numbers) {
    result += number;
  }

  return result;
}

console.log(total(10, 20));

console.log(total(10, 20, 30, 40));

/*
 * We'll study rest/spread deeply in:
 *
 *     spread_rest.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Functions are first-class values
 * ============================================================
 *
 * In JavaScript, functions are values.
 *
 * This means we can:
 *
 *     - store functions in variables
 *     - pass functions as arguments
 *     - return functions from functions
 *     - store functions in objects
 *     - store functions in arrays
 *
 * ============================================================
 */

function sayHello() {
  return "Hello";
}

const messageFunction = sayHello;

console.log(messageFunction());

/*
 * Both variables refer to the same function.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Function as an argument
 * ============================================================
 *
 * This is extremely important in Node.js.
 *
 * ============================================================
 */

function execute(operation, a, b) {
  return operation(a, b);
}

function addNumbers(a, b) {
  return a + b;
}

function multiplyNumbers(a, b) {
  return a * b;
}

console.log(execute(addNumbers, 10, 20));

console.log(execute(multiplyNumbers, 10, 20));

/*
 * `addNumbers` and `multiplyNumbers` are passed as values.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Callback function
 * ============================================================
 *
 * A callback is a function passed to another function so that
 * the receiving function can call it later.
 *
 * ============================================================
 */

function processUser(name, callback) {
  const message = `Processing ${name}`;

  callback(message);
}

processUser("Shiva", function (message) {
  console.log(message);
});

/*
 * This pattern is fundamental in Node.js.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Callback with arrow function
 * ============================================================
 */

processUser("Ram", (message) => {
  console.log("Callback:", message);
});

/*
 * ============================================================
 * 16. Synchronous callback
 * ============================================================
 */

function calculate(a, b, callback) {
  const result = a + b;

  callback(result);
}

calculate(10, 20, (result) => {
  console.log("Calculated:", result);
});

/*
 * ============================================================
 * 17. Higher-order function
 * ============================================================
 *
 * A higher-order function is a function that:
 *
 *     1. receives a function
 *
 * OR
 *
 *     2. returns a function
 *
 * OR both.
 *
 * ============================================================
 */

function operate(a, b, operation) {
  return operation(a, b);
}

const addition = operate(10, 20, (x, y) => x + y);

console.log(addition);

/*
 * ============================================================
 * 18. Returning a function
 * ============================================================
 */

function createMultiplier(multiplier) {
  return function (number) {
    return number * multiplier;
  };
}

const multiplyByTwo = createMultiplier(2);

const multiplyByTen = createMultiplier(10);

console.log(multiplyByTwo(5));

console.log(multiplyByTen(5));

/*
 * This leads to an important JavaScript concept:
 *
 *     Closure
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Closure
 * ============================================================
 *
 * A closure happens when a function remembers variables from
 * the scope in which it was created.
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
 * The returned function remembers `count`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Why closures matter in Node.js
 * ============================================================
 *
 * Closures appear in:
 *
 *     - middleware factories
 *     - configuration functions
 *     - callbacks
 *     - event handlers
 *     - private state
 *     - factories
 *     - async code
 *
 * Example:
 */

function requireRole(role) {
  return function (user) {
    return user.role === role;
  };
}

const requireAdmin = requireRole("admin");

console.log(
  requireAdmin({
    role: "admin",
  }),
);

console.log(
  requireAdmin({
    role: "user",
  }),
);

/*
 * This pattern will become useful when we learn Express
 * authorization middleware.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Anonymous function
 * ============================================================
 *
 * A function without a name is an anonymous function.
 *
 * ============================================================
 */

const greetAnonymous = function () {
  console.log("Hello");
};

greetAnonymous();

/*
 * Anonymous functions are commonly used as callbacks.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Immediately Invoked Function Expression
 * ============================================================
 *
 * An IIFE is a function that executes immediately.
 *
 * ============================================================
 */

(function () {
  console.log("IIFE executed");
})();

/*
 * Modern Node.js code rarely needs IIFEs because modules
 * already provide scope.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Function scope
 * ============================================================
 *
 * Variables declared with `var` are function-scoped.
 *
 * `let` and `const` are block-scoped.
 *
 * We'll study this properly in:
 *
 *     scope.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. `this` and arrow functions
 * ============================================================
 *
 * Regular functions have their own `this` depending on how
 * they are called.
 *
 * Arrow functions do NOT create their own `this`.
 *
 * Example:
 */

const userObject = {
  name: "Shiva",

  regularFunction: function () {
    console.log("Regular:", this.name);
  },

  arrowFunction: () => {
    console.log("Arrow:", this.name);
  },
};

userObject.regularFunction();

userObject.arrowFunction();

/*
 * This difference is extremely important.
 *
 * Don't blindly replace every regular function with an arrow
 * function.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Method
 * ============================================================
 *
 * A function stored as an object property is commonly called
 * a method.
 * ============================================================
 */

const calculator = {
  add(a, b) {
    return a + b;
  },

  subtract(a, b) {
    return a - b;
  },
};

console.log(calculator.add(10, 20));

console.log(calculator.subtract(20, 5));

/*
 * ============================================================
 * 26. Pure function
 * ============================================================
 *
 * A pure function:
 *
 *     - produces the same output for the same input
 *     - doesn't modify external state
 *
 * ============================================================
 */

function addPure(a, b) {
  return a + b;
}

/*
 * Same input:
 *
 *     addPure(10, 20)
 *
 * always produces:
 *
 *     30
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Side effects
 * ============================================================
 *
 * A side effect changes something outside the function.
 *
 * Example:
 */

let counterValue = 0;

function incrementCounter() {
  counterValue++;
}

incrementCounter();

console.log(counterValue);

/*
 * This function changes external state.
 *
 * Node.js applications contain many legitimate side effects:
 *
 *     - database writes
 *     - file writes
 *     - network requests
 *     - logging
 *     - cache updates
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Function composition
 * ============================================================
 *
 * We can pass the result of one function into another.
 * ============================================================
 */

function doubleNumber(number) {
  return number * 2;
}

function addFive(number) {
  return number + 5;
}

const value = addFive(doubleNumber(10));

console.log(value);

/*
 * ============================================================
 * 29. Array methods use functions
 * ============================================================
 *
 * Node.js development uses these constantly.
 *
 * ============================================================
 */

const numbers = [1, 2, 3, 4, 5];

/*
 * map()
 */

const doubled = numbers.map((number) => number * 2);

console.log("Doubled:", doubled);

/*
 * filter()
 */

const evenNumbers = numbers.filter((number) => number % 2 === 0);

console.log("Even:", evenNumbers);

/*
 * reduce()
 */

const totalSum = numbers.reduce((total, number) => total + number, 0);

console.log("Total:", totalSum);

/*
 * These are higher-order functions because they receive
 * callback functions.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Async callback example
 * ============================================================
 *
 * Node.js frequently performs asynchronous operations.
 *
 * Example:
 */

setTimeout(() => {
  console.log("Executed later");
}, 1000);

/*
 * The callback runs approximately after 1 second.
 *
 * This is one of the foundations of the Node.js event-driven
 * programming model.
 *
 * We'll study the event loop later.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Node.js-style callback
 * ============================================================
 *
 * Traditional Node.js APIs often use the error-first
 * callback pattern:
 *
 *
 *     callback(error, result)
 *
 *
 * Example:
 */

function divide(a, b, callback) {
  if (b === 0) {
    return callback(new Error("Cannot divide by zero"), null);
  }

  const result = a / b;

  callback(null, result);
}

divide(10, 2, (error, result) => {
  if (error) {
    console.error(error.message);

    return;
  }

  console.log("Division:", result);
});

/*
 * We'll learn asynchronous callbacks and why Promises became
 * important in:
 *
 *     promises.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Function arguments
 * ============================================================
 *
 * JavaScript functions can receive fewer or more arguments
 * than declared parameters.
 * ============================================================
 */

function showArguments(a, b) {
  console.log("a:", a);
  console.log("b:", b);
}

showArguments(10);

/*
 * `b` becomes undefined.
 *
 * ============================================================
 */

/*
 * Modern JavaScript generally uses rest parameters when we
 * explicitly want to collect arbitrary arguments.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Function hoisting
 * ============================================================
 *
 * Function declarations are hoisted.
 *
 * This works:
 */

saySomething();

function saySomething() {
  console.log("Function declaration works before its definition.");
}

/*
 * Be careful:
 *
 * Function expressions and arrow functions assigned to `let`
 * or `const` cannot be used before their initialization.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Practical Node.js service function
 * ============================================================
 *
 * This resembles code you'll write later.
 * ============================================================
 */

function createUserService(userData) {
  return {
    id: "user_123",
    name: userData.name,
    email: userData.email,
  };
}

const newUser = createUserService({
  name: "Shiva",
  email: "shiva@example.com",
});

console.log("Created user:", newUser);

/*
 * Later this could become:
 *
 *
 *     user.service.js
 *
 *
 * and could perform:
 *
 *     database operations
 *     validation
 *     business logic
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Function naming
 * ============================================================
 *
 * Prefer names that describe actions:
 *
 *     createUser()
 *     deleteUser()
 *     findUser()
 *     validateEmail()
 *     generateToken()
 *     hashPassword()
 *     sendMessage()
 *
 *
 * Avoid vague names:
 *
 *     doStuff()
 *     process()
 *     handleEverything()
 *
 * unless the context makes them meaningful.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Best practices
 * ============================================================
 *
 * ✓ Keep functions focused on one responsibility.
 *
 * ✓ Use meaningful function names.
 *
 * ✓ Prefer small reusable functions.
 *
 * ✓ Prefer `const` for function expressions.
 *
 * ✓ Understand callbacks.
 *
 * ✓ Understand higher-order functions.
 *
 * ✓ Understand closures.
 *
 * ✓ Understand the difference between regular and arrow
 *   functions.
 *
 * ✓ Handle errors explicitly.
 *
 * ✓ Avoid deeply nested callbacks.
 *
 * ✓ Use async/await for modern asynchronous workflows where
 *   appropriate.
 *
 * ============================================================
 */

/*
 * ============================================================
 * SUMMARY
 * ============================================================
 *
 * Function declaration:
 *
 *     function add(a, b) {}
 *
 *
 * Function expression:
 *
 *     const add = function (a, b) {};
 *
 *
 * Arrow function:
 *
 *     const add = (a, b) => {};
 *
 *
 * Callback:
 *
 *     function process(callback) {}
 *
 *
 * Higher-order function:
 *
 *     function process(callback) {}
 *
 *
 * Closure:
 *
 *     function outer() {
 *       const value = 10;
 *
 *       return function () {
 *         return value;
 *       };
 *     }
 *
 *
 * Node.js heavily relies on functions for:
 *
 *     callbacks
 *     middleware
 *     controllers
 *     services
 *     event handlers
 *     asynchronous operations
 *
 * ============================================================
 */
