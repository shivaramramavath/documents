/**
 * ============================================================
 * JavaScript for Node.js
 * ============================================================
 *
 * File: spread_rest.js
 *
 * Topic:
 * Spread Operator (...) and Rest Parameters (...)
 *
 * ============================================================
 *
 * The same `...` syntax is used for two different purposes:
 *
 *     1. SPREAD -> expands/unpacks values
 *     2. REST   -> collects/combines values
 *
 * Remember:
 *
 *     SPREAD -> "take apart"
 *     REST   -> "collect together"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Spread with arrays
 * ============================================================
 *
 * The spread operator expands an array into individual values.
 * ============================================================
 */

const numbers = [10, 20, 30];

console.log(...numbers);

/*
 * This:
 *
 *     console.log(...numbers);
 *
 * is approximately:
 *
 *     console.log(10, 20, 30);
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Copy an array
 * ============================================================
 */

const original = [1, 2, 3];

const copy = [...original];

console.log("Original:", original);

console.log("Copy:", copy);

/*
 * `copy` is a new array.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Why this is different from assignment
 * ============================================================
 */

const arrayA = [1, 2, 3];

const arrayB = arrayA;

arrayB.push(4);

console.log(arrayA);

console.log(arrayB);

/*
 * Output:
 *
 *     [1, 2, 3, 4]
 *     [1, 2, 3, 4]
 *
 *
 * Both variables reference the same array.
 *
 * ============================================================
 */

/*
 * With spread:
 */

const arrayC = [1, 2, 3];

const arrayD = [...arrayC];

arrayD.push(4);

console.log("arrayC:", arrayC);

console.log("arrayD:", arrayD);

/*
 * Output:
 *
 *     arrayC: [1, 2, 3]
 *     arrayD: [1, 2, 3, 4]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Merge arrays
 * ============================================================
 */

const frontend = ["HTML", "CSS", "JavaScript"];

const backend = ["Node.js", "MongoDB"];

const fullStack = [...frontend, ...backend];

console.log(fullStack);

/*
 * Output:
 *
 *     [
 *       "HTML",
 *       "CSS",
 *       "JavaScript",
 *       "Node.js",
 *       "MongoDB"
 *     ]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Add values while spreading
 * ============================================================
 */

const oldNumbers = [2, 3, 4];

const newNumbers = [1, ...oldNumbers, 5];

console.log(newNumbers);

/*
 * Output:
 *
 *     [1, 2, 3, 4, 5]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Spread strings
 * ============================================================
 *
 * Strings are iterable.
 * ============================================================
 */

const name = "Shiva";

const characters = [...name];

console.log(characters);

/*
 * Output:
 *
 *     ["S", "h", "i", "v", "a"]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Spread with function arguments
 * ============================================================
 */

const values = [10, 20, 30];

console.log(Math.max(...values));

console.log(Math.min(...values));

/*
 * Without spread:
 *
 *     Math.max(values)
 *
 * would pass the ARRAY as one argument.
 *
 * With spread:
 *
 *     Math.max(...values)
 *
 * passes:
 *
 *     Math.max(10, 20, 30)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Spread with objects
 * ============================================================
 */

const user = {
  name: "Shiva",
  age: 21,
};

const userCopy = {
  ...user,
};

console.log(userCopy);

/*
 * ============================================================
 * 9. Merge objects
 * ============================================================
 */

const basicInfo = {
  name: "Shiva",
  age: 21,
};

const accountInfo = {
  email: "shiva@example.com",
  role: "user",
};

const completeUser = {
  ...basicInfo,
  ...accountInfo,
};

console.log(completeUser);

/*
 * Output:
 *
 *     {
 *       name: "Shiva",
 *       age: 21,
 *       email: "shiva@example.com",
 *       role: "user"
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Object property overriding
 * ============================================================
 *
 * When the same property exists multiple times,
 * the LAST value wins.
 * ============================================================
 */

const defaultConfig = {
  host: "localhost",
  port: 3000,
  debug: false,
};

const productionConfig = {
  port: 8080,
  debug: false,
};

const config = {
  ...defaultConfig,
  ...productionConfig,
};

console.log(config);

/*
 * Result:
 *
 *     {
 *       host: "localhost",
 *       port: 8080,
 *       debug: false
 *     }
 *
 *
 * `productionConfig.port` overrides `defaultConfig.port`.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Order matters
 * ============================================================
 */

const firstConfig = {
  port: 3000,
};

const secondConfig = {
  port: 5000,
};

const configA = {
  ...firstConfig,
  ...secondConfig,
};

const configB = {
  ...secondConfig,
  ...firstConfig,
};

console.log("configA:", configA);

console.log("configB:", configB);

/*
 * configA.port -> 5000
 *
 * configB.port -> 3000
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Add or override object properties
 * ============================================================
 */

const userData = {
  name: "Shiva",
  role: "user",
};

const adminUser = {
  ...userData,
  role: "admin",
};

console.log(adminUser);

/*
 * ============================================================
 * 13. Add new properties
 * ============================================================
 */

const userWithEmail = {
  ...userData,
  email: "shiva@example.com",
};

console.log(userWithEmail);

/*
 * ============================================================
 * 14. Spread and immutability
 * ============================================================
 *
 * Spread is frequently used to create a new object rather than
 * modifying the original object.
 * ============================================================
 */

const originalUser = {
  name: "Shiva",
  role: "user",
};

const updatedUser = {
  ...originalUser,
  role: "admin",
};

console.log("Original:", originalUser);

console.log("Updated:", updatedUser);

/*
 * Original remains unchanged.
 *
 * This pattern is common in:
 *
 *     - state management
 *     - request data transformation
 *     - API responses
 *     - service logic
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. REST parameters
 * ============================================================
 *
 * Rest parameters collect multiple arguments into an array.
 *
 * ============================================================
 */

function sum(...numbers) {
  console.log("Numbers:", numbers);

  let total = 0;

  for (const number of numbers) {
    total += number;
  }

  return total;
}

console.log(sum(10, 20, 30));

console.log(sum(1, 2, 3, 4, 5));

/*
 * `...numbers` is REST here.
 *
 * It collects:
 *
 *     10, 20, 30
 *
 * into:
 *
 *     [10, 20, 30]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Rest must be the last parameter
 * ============================================================
 */

function processValues(first, second, ...remaining) {
  console.log("First:", first);

  console.log("Second:", second);

  console.log("Remaining:", remaining);
}

processValues(10, 20, 30, 40, 50);

/*
 * Output:
 *
 *     First: 10
 *     Second: 20
 *     Remaining: [30, 40, 50]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Rest with no remaining values
 * ============================================================
 */

function collect(first, ...rest) {
  console.log(first);
  console.log(rest);
}

collect(10);

/*
 * Output:
 *
 *     10
 *     []
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Rest with object destructuring
 * ============================================================
 *
 * Object rest collects the remaining properties.
 * ============================================================
 */

const account = {
  id: 123,
  name: "Shiva",
  email: "shiva@example.com",
  role: "user",
};

const { id, ...accountWithoutId } = account;

console.log("ID:", id);

console.log("Remaining:", accountWithoutId);

/*
 * `accountWithoutId` contains:
 *
 *     name
 *     email
 *     role
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Rest with arrays
 * ============================================================
 */

const numbersList = [10, 20, 30, 40];

const [firstValue, ...restValues] = numbersList;

console.log("First:", firstValue);

console.log("Rest:", restValues);

/*
 * Output:
 *
 *     First: 10
 *     Rest: [20, 30, 40]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. Spread vs Rest
 * ============================================================
 *
 *
 * SPREAD
 * ──────
 *
 * Expands an existing collection.
 *
 *     const values = [1, 2, 3];
 *
 *     console.log(...values);
 *
 *
 *
 * REST
 * ────
 *
 * Collects multiple values.
 *
 *     function test(...values) {
 *     }
 *
 *
 * Same syntax:
 *
 *     ...
 *
 * Different meaning depending on where it appears.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Spread in function arguments
 * ============================================================
 */

function addThree(a, b, c) {
  return a + b + c;
}

const addValues = [10, 20, 30];

console.log(addThree(...addValues));

/*
 * Equivalent to:
 *
 *     addThree(10, 20, 30)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Rest + spread together
 * ============================================================
 */

function multiplyAll(multiplier, ...numbers) {
  return numbers.map((number) => number * multiplier);
}

const result = multiplyAll(2, 10, 20, 30);

console.log(result);

/*
 * Rest:
 *
 *     ...numbers
 *
 * collects arguments.
 *
 *
 * Spread:
 *
 *     ...result
 *
 * could later expand the array.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Practical Node.js configuration example
 * ============================================================
 */

const defaultServerConfig = {
  host: "localhost",
  port: 3000,
  timeout: 5000,
};

function createServerConfig(customConfig = {}) {
  return {
    ...defaultServerConfig,
    ...customConfig,
  };
}

const serverConfig = createServerConfig({
  port: 8080,
});

console.log(serverConfig);

/*
 * Output:
 *
 *     {
 *       host: "localhost",
 *       port: 8080,
 *       timeout: 5000,
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Practical Node.js service example
 * ============================================================
 */

function createUser(userData) {
  return {
    id: Date.now(),
    ...userData,
    createdAt: new Date(),
  };
}

const newUser = createUser({
  name: "Shiva",
  email: "shiva@example.com",
  role: "user",
});

console.log(newUser);

/*
 * This pattern is common when transforming incoming data
 * before storing it.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Remove properties using rest
 * ============================================================
 */

const userDocument = {
  id: 1,
  name: "Shiva",
  email: "shiva@example.com",
  password: "secret",
};

const { password, ...safeUser } = userDocument;

console.log("Safe user:", safeUser);

/*
 * This is useful when constructing API response objects.
 *
 * However, for security-sensitive data, explicitly selecting
 * allowed fields is often safer than relying only on omission.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Nested spread
 * ============================================================
 */

const profile = {
  name: "Shiva",

  address: {
    city: "Vijayawada",
    state: "Andhra Pradesh",
  },
};

const updatedProfile = {
  ...profile,

  address: {
    ...profile.address,

    city: "Hyderabad",
  },
};

console.log("Original:", profile);

console.log("Updated:", updatedProfile);

/*
 * Important:
 *
 * Object spread is SHALLOW.
 *
 * Nested objects are NOT automatically deep-cloned.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Shallow copy
 * ============================================================
 */

const originalObject = {
  name: "Shiva",

  address: {
    city: "Vijayawada",
  },
};

const copiedObject = {
  ...originalObject,
};

/*
 * The top-level object is different:
 */

console.log(originalObject === copiedObject);

/*
 * But the nested object is still shared:
 */

console.log(originalObject.address === copiedObject.address);

/*
 * Output:
 *
 *     false
 *     true
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Spread is NOT deep cloning
 * ============================================================
 *
 * Don't assume:
 *
 *     const copy = { ...original };
 *
 * creates a completely independent nested object.
 *
 * For structured cloning, modern Node.js provides:
 *
 *     structuredClone()
 *
 * Example:
 */

const originalData = {
  user: {
    name: "Shiva",
  },
};

const deepCopy = structuredClone(originalData);

deepCopy.user.name = "Ram";

console.log(originalData.user.name);

console.log(deepCopy.user.name);

/*
 * Output:
 *
 *     Shiva
 *     Ram
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Spread with Set
 * ============================================================
 *
 * Set is iterable.
 * ============================================================
 */

const uniqueValues = new Set([1, 2, 3, 3, 4]);

const uniqueArray = [...uniqueValues];

console.log(uniqueArray);

/*
 * Output:
 *
 *     [1, 2, 3, 4]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Remove duplicate array values
 * ============================================================
 */

const duplicateNumbers = [1, 2, 2, 3, 3, 4];

const uniqueNumbers = [...new Set(duplicateNumbers)];

console.log(uniqueNumbers);

/*
 * ============================================================
 * 31. Spread with Map
 * ============================================================
 */

const usersMap = new Map([
  ["u1", "Shiva"],
  ["u2", "Ram"],
]);

const mapEntries = [...usersMap];

console.log(mapEntries);

/*
 * ============================================================
 * 32. Spread in function composition
 * ============================================================
 */

function createLog(prefix, ...messages) {
  console.log(`[${prefix}]`, ...messages);
}

createLog("INFO", "Server", "started", "successfully");

/*
 * Rest:
 *
 *     ...messages
 *
 * collects messages.
 *
 *
 * Spread:
 *
 *     ...messages
 *
 * expands them into console.log().
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Practical Express-style example
 * ============================================================
 *
 * Imagine:
 *
 *     req.body
 *
 * contains:
 *
 *     {
 *       name,
 *       email,
 *       role
 *     }
 *
 * We can create a new object with additional properties.
 * ============================================================
 */

const requestBody = {
  name: "Shiva",
  email: "shiva@example.com",
};

const userToSave = {
  ...requestBody,

  role: "user",

  createdAt: new Date(),
};

console.log(userToSave);

/*
 * ============================================================
 * 34. Practical update example
 * ============================================================
 */

const existingUser = {
  id: 123,
  name: "Shiva",
  email: "old@example.com",
  role: "user",
};

const updateData = {
  email: "new@example.com",
};

const updatedUserData = {
  ...existingUser,
  ...updateData,
};

console.log(updatedUserData);

/*
 * This pattern is common when creating updated objects.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Function forwarding
 * ============================================================
 *
 * Rest can collect arguments and spread can forward them.
 * ============================================================
 */

function log(...args) {
  console.log("[APP]", ...args);
}

log("User created");

log("User ID:", 123);

/*
 * This pattern is useful for wrappers around functions.
 *
 ============================================================
 */

/*
 * ============================================================
 * 36. Common mistake: spread vs rest
 * ============================================================
 *
 * WRONG mental model:
 *
 *     "The three dots always mean spread."
 *
 *
 * Correct:
 *
 *
 *     const copy = [...array];
 *                  ↑
 *                SPREAD
 *
 *
 *     function test(...args) {}
 *                    ↑
 *                  REST
 *
 *
 *     const { id, ...rest } = user;
 *                    ↑
 *                  REST
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Common mistake: shallow copy
 * ============================================================
 *
 * This:
 *
 *     const copy = { ...object };
 *
 * only creates a shallow copy.
 *
 * Nested references can still be shared.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Common mistake: mutation
 * ============================================================
 *
 * Prefer creating new values when practical:
 */

const originalList = [1, 2, 3];

const newList = [...originalList, 4];

console.log("Original:", originalList);

console.log("New:", newList);

/*
 * Instead of:
 *
 *     originalList.push(4);
 *
 * when your design requires immutable data.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Important Node.js use cases
 * ============================================================
 *
 * Spread is heavily used for:
 *
 *     - configuration
 *     - object transformation
 *     - API response creation
 *     - copying arrays
 *     - merging data
 *     - immutable updates
 *     - function argument forwarding
 *
 *
 * Rest is heavily used for:
 *
 *     - utility functions
 *     - flexible function arguments
 *     - wrappers
 *     - middleware helpers
 *     - collecting remaining properties
 *     - variadic functions
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. Best practices
 * ============================================================
 *
 * ✓ Remember:
 *
 *       Spread = expand
 *       Rest   = collect
 *
 *
 * ✓ Use spread for readable object/array composition.
 *
 * ✓ Remember spread creates shallow copies.
 *
 * ✓ Use rest when a function accepts variable arguments.
 *
 * ✓ Keep rest parameters at the end.
 *
 * ✓ Be careful with nested objects.
 *
 * ✓ Avoid unnecessary copying of very large structures.
 *
 * ✓ Understand reference sharing.
 *
 * ============================================================
 */

/*
 * ============================================================
 * SUMMARY
 * ============================================================
 *
 * ARRAY SPREAD
 *
 *     const copy = [...array];
 *
 *
 * OBJECT SPREAD
 *
 *     const copy = {...object};
 *
 *
 * MERGE ARRAYS
 *
 *     const result = [...a, ...b];
 *
 *
 * MERGE OBJECTS
 *
 *     const result = {...a, ...b};
 *
 *
 * REST PARAMETERS
 *
 *     function test(...args) {}
 *
 *
 * OBJECT REST
 *
 *     const { id, ...rest } = user;
 *
 *
 * ARRAY REST
 *
 *     const [first, ...rest] = values;
 *
 *
 * FUNCTION SPREAD
 *
 *     function add(a, b, c) {}
 *
 *     add(...values);
 *
 *
 * IMPORTANT:
 *
 *     Spread -> expands
 *     Rest   -> collects
 *
 *
 * Object/array spread creates a SHALLOW copy.
 *
 * ============================================================
 */
