/**
 * ============================================================
 * JavaScript for Node.js
 * ============================================================
 *
 * File: destructuring.js
 *
 * Topic:
 * Array Destructuring and Object Destructuring
 *
 * ============================================================
 *
 * Destructuring allows us to extract values from:
 *
 *     - Arrays
 *     - Objects
 *
 * into variables.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Array destructuring
 * ============================================================
 */

const numbers = [10, 20, 30];

/*
 * Without destructuring:
 */

const firstNumber = numbers[0];
const secondNumber = numbers[1];
const thirdNumber = numbers[2];

console.log(firstNumber, secondNumber, thirdNumber);

/*
 * With destructuring:
 */

const [first, second, third] = numbers;

console.log(first, second, third);

/*
 * Much shorter and easier to read.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Array destructuring position matters
 * ============================================================
 */

const colors = ["red", "green", "blue"];

const [color1, color2, color3] = colors;

console.log(color1);
console.log(color2);
console.log(color3);

/*
 * Output:
 *
 *     red
 *     green
 *     blue
 *
 *
 * Array destructuring works by POSITION.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Skip array elements
 * ============================================================
 *
 * We can skip values using commas.
 * ============================================================
 */

const values = ["first", "second", "third"];

const [, secondValue, ,] = values;

console.log(secondValue);

/*
 * Output:
 *
 *     second
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Array destructuring with default values
 * ============================================================
 */

const userNumbers = [10];

const [numberA, numberB = 20] = userNumbers;

console.log(numberA);
console.log(numberB);

/*
 * Since the second value doesn't exist:
 *
 *     numberB = 20
 *
 * is used.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. Default value only applies to undefined
 * ============================================================
 */

const data = [undefined];

const [valueA = 100] = data;

console.log(valueA);

/*
 * Output:
 *
 *     100
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Rest element in array destructuring
 * ============================================================
 *
 * `...rest` collects remaining values.
 * ============================================================
 */

const scores = [10, 20, 30, 40, 50];

const [firstScore, secondScore, ...remainingScores] = scores;

console.log(firstScore);

console.log(secondScore);

console.log(remainingScores);

/*
 * Output:
 *
 *     10
 *     20
 *     [30, 40, 50]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Object destructuring
 * ============================================================
 *
 * Objects are destructured using property names.
 * ============================================================
 */

const user = {
  name: "Shiva",
  age: 21,
  role: "student",
};

const { name, age, role } = user;

console.log(name);
console.log(age);
console.log(role);

/*
 * Unlike arrays, object destructuring is based on PROPERTY
 * NAME rather than position.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 8. Object destructuring with different variable names
 * ============================================================
 *
 * Syntax:
 *
 *     propertyName: newVariableName
 *
 * ============================================================
 */

const student = {
  name: "Shiva",
  age: 21,
};

const { name: studentName, age: studentAge } = student;

console.log(studentName);
console.log(studentAge);

/*
 * The original properties are:
 *
 *     name
 *     age
 *
 *
 * But our variables are:
 *
 *     studentName
 *     studentAge
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Object destructuring with default values
 * ============================================================
 */

const account = {
  username: "shiva",
};

const { username, role: accountRole = "user" } = account;

console.log(username);
console.log(accountRole);

/*
 * Since `role` doesn't exist:
 *
 *     accountRole = "user"
 *
 * is used.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Nested object destructuring
 * ============================================================
 */

const profile = {
  name: "Shiva",

  address: {
    city: "Vijayawada",
    state: "Andhra Pradesh",
  },
};

const {
  name: profileName,

  address: { city, state },
} = profile;

console.log(profileName);
console.log(city);
console.log(state);

/*
 * We extracted:
 *
 *     profile.name
 *     profile.address.city
 *     profile.address.state
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Nested array destructuring
 * ============================================================
 */

const matrix = [
  [1, 2],
  [3, 4],
];

const [[a, b], [c, d]] = matrix;

console.log(a);
console.log(b);
console.log(c);
console.log(d);

/*
 * Output:
 *
 *     1
 *     2
 *     3
 *     4
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Mixed object and array destructuring
 * ============================================================
 */

const response = {
  status: 200,

  data: [
    {
      id: 1,
      name: "Shiva",
    },
  ],
};

const {
  status,

  data: [firstUser],
} = response;

console.log(status);
console.log(firstUser);

/*
 * This type of structure appears frequently when working with
 * API responses.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Destructuring function parameters
 * ============================================================
 *
 * Instead of:
 *
 *     function createUser(user) {
 *       console.log(user.name);
 *       console.log(user.email);
 *     }
 *
 *
 * We can destructure directly.
 * ============================================================
 */

function createUser({ name, email }) {
  console.log("Name:", name);

  console.log("Email:", email);
}

createUser({
  name: "Shiva",
  email: "shiva@example.com",
});

/*
 * This pattern is extremely common in Node.js services.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Function parameter destructuring with defaults
 * ============================================================
 */

function connectDatabase({
  host = "localhost",
  port = 27017,
  database = "test",
}) {
  console.log({
    host,
    port,
    database,
  });
}

connectDatabase({
  host: "localhost",
  database: "node_app",
});

/*
 * Output:
 *
 *     {
 *       host: "localhost",
 *       port: 27017,
 *       database: "node_app"
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. Destructuring Express-style request data
 * ============================================================
 *
 * Later you'll see code like:
 *
 *
 *     app.post("/users", (req, res) => {
 *
 *       const {
 *         name,
 *         email,
 *         password,
 *       } = req.body;
 *
 *     });
 *
 *
 * This is one of the most common real-world uses.
 *
 * Example without Express:
 */

const request = {
  body: {
    username: "shiva",
    password: "secret",
  },
};

const {
  body: { username, password },
} = request;

console.log(username);
console.log(password);

/*
 * ============================================================
 */

/*
 * ============================================================
 * 16. Destructuring request properties
 * ============================================================
 *
 * Express code often looks like:
 *
 *
 *     const {
 *       params,
 *       query,
 *       body,
 *       headers,
 *     } = req;
 *
 *
 * Example:
 */

const req = {
  params: {
    id: "123",
  },

  query: {
    page: "1",
  },

  body: {
    name: "Shiva",
  },

  headers: {
    authorization: "Bearer token",
  },
};

const { params, query, body, headers } = req;

console.log(params);
console.log(query);
console.log(body);
console.log(headers);

/*
 * ============================================================
 */

/*
 * ============================================================
 * 17. Destructuring MongoDB-style documents
 * ============================================================
 */

const mongoDocument = {
  _id: "abc123",
  name: "Shiva",
  email: "shiva@example.com",
  role: "user",
};

const { _id, email, ...publicUser } = mongoDocument;

console.log("_id:", _id);
console.log("email:", email);
console.log("publicUser:", publicUser);

/*
 * This is useful when removing fields from an object.
 *
 * Here:
 *
 *     publicUser
 *
 * contains the remaining properties.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Destructuring module results
 * ============================================================
 *
 * Node.js modules frequently export multiple values.
 *
 * Example:
 *
 *
 *     module.exports = {
 *       createUser,
 *       deleteUser,
 *     };
 *
 *
 * Another file can do:
 *
 *
 *     const {
 *       createUser,
 *       deleteUser,
 *     } = require("./user.service");
 *
 *
 * This will become important in:
 *
 *     02_modules/
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Destructuring return values
 * ============================================================
 */

function getCoordinates() {
  return [16.5062, 80.648];
}

const [latitude, longitude] = getCoordinates();

console.log("Latitude:", latitude);

console.log("Longitude:", longitude);

/*
 * ============================================================
 * 20. Object return value
 * ============================================================
 */

function getUser() {
  return {
    id: "user_123",
    name: "Shiva",
    role: "user",
  };
}

const { id, name: userName, role: userRole } = getUser();

console.log(id);
console.log(userName);
console.log(userRole);

/*
 * ============================================================
 * 21. Swap variables
 * ============================================================
 *
 * Destructuring makes swapping very simple.
 * ============================================================
 */

let x = 10;
let y = 20;

[x, y] = [y, x];

console.log(x);
console.log(y);

/*
 * Output:
 *
 *     20
 *     10
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Destructuring in loops
 * ============================================================
 */

const users = [
  {
    id: 1,
    name: "Shiva",
  },

  {
    id: 2,
    name: "Ram",
  },
];

for (const { id, name } of users) {
  console.log(id, name);
}

/*
 * This is very useful when processing database results.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Destructuring Map entries
 * ============================================================
 */

const userMap = new Map([
  ["user1", "Shiva"],
  ["user2", "Ram"],
]);

for (const [key, value] of userMap) {
  console.log(key, value);
}

/*
 * `Map.entries()` produces arrays:
 *
 *     [key, value]
 *
 * Therefore array destructuring works naturally.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Destructuring with null/undefined
 * ============================================================
 *
 * Be careful:
 *
 *     const { name } = undefined;
 *
 *
 * causes a TypeError.
 *
 *
 * You can provide a fallback object:
 */

const maybeUser = undefined;

const { name: safeName } = maybeUser || {};

console.log(safeName);

/*
 * Another modern pattern:
 */

const anotherUser = null;

const { name: anotherName } = anotherUser ?? {};

console.log(anotherName);

/*
 * `??` is useful when null/undefined should trigger the
 * fallback.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Destructuring and optional data
 * ============================================================
 */

const apiResult = {
  data: {
    user: {
      name: "Shiva",
    },
  },
};

const { data: { user: { name: apiUserName } = {} } = {} } = apiResult;

console.log(apiUserName);

/*
 * For deeply optional structures, optional chaining can often
 * be easier to read:
 *
 *
 *     apiResult?.data?.user?.name
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Destructuring configuration
 * ============================================================
 *
 * This pattern is common in Node.js applications.
 * ============================================================
 */

const config = {
  host: "localhost",
  port: 3000,
  database: "timetable",
  debug: true,
};

const { host, port, database, debug } = config;

console.log({
  host,
  port,
  database,
  debug,
});

/*
 * Later:
 *
 *     process.env
 *     dotenv
 *     configuration objects
 *
 * will commonly be destructured this way.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Destructuring environment variables
 * ============================================================
 *
 * Example:
 *
 *     const {
 *       PORT,
 *       NODE_ENV,
 *       DATABASE_URL,
 *     } = process.env;
 *
 *
 * This is very common in backend applications.
 *
 * Example:
 */

const { PORT, NODE_ENV } = process.env;

console.log("PORT:", PORT);

console.log("NODE_ENV:", NODE_ENV);

/*
 * ============================================================
 * 28. Rename environment variables
 * ============================================================
 */

const { PORT: serverPort = 3000, NODE_ENV: environment = "development" } =
  process.env;

console.log("Server port:", serverPort);

console.log("Environment:", environment);

/*
 * ============================================================
 * 29. Destructuring with rest
 * ============================================================
 *
 * Object rest collects remaining properties.
 * ============================================================
 */

const authenticatedUser = {
  id: 1,
  name: "Shiva",
  email: "shiva@example.com",
  role: "user",
};

const { password, ...safeUser } = {
  ...authenticatedUser,
  password: "secret",
};

console.log("Safe user:", safeUser);

/*
 * This technique is often used to avoid returning sensitive
 * fields in API responses.
 *
 * IMPORTANT:
 *
 * This alone is not a complete security strategy. Be explicit
 * about what sensitive data is selected from database results.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Array destructuring vs object destructuring
 * ============================================================
 *
 *
 * ARRAY
 * ─────
 *
 * Position based:
 *
 *     const [first, second] = array;
 *
 *
 *
 * OBJECT
 * ──────
 *
 * Property-name based:
 *
 *     const { name, age } = user;
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Common mistake
 * ============================================================
 *
 * This:
 *
 *     const { name } = user;
 *
 * means:
 *
 *     user.name
 *
 *
 * It does NOT mean the first property.
 *
 *
 * Object:
 *
 *     {
 *       age: 21,
 *       name: "Shiva"
 *     }
 *
 *
 * still gives:
 *
 *     name === "Shiva"
 *
 * because objects are destructured by property name.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Common mistake with arrays
 * ============================================================
 *
 * Arrays are position-based.
 *
 *     const [first, second] = array;
 *
 *
 * If:
 *
 *     [100, 200]
 *
 *
 * then:
 *
 *     first  = 100
 *     second = 200
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Practical Node.js controller example
 * ============================================================
 */

function registerUser(req) {
  const {
    body: { name, email, password },
  } = req;

  /*
   * In a real application:
   *
   *     validate fields
   *     hash password
   *     save user
   *
   * ============================================================
   */

  return {
    name,
    email,
    password,
  };
}

const fakeRequest = {
  body: {
    name: "Shiva",
    email: "shiva@example.com",
    password: "example",
  },
};

console.log(registerUser(fakeRequest));

/*
 * ============================================================
 * 34. Practical service example
 * ============================================================
 */

function createUserService({ name, email, role = "user" }) {
  return {
    name,
    email,
    role,
  };
}

const createdUser = createUserService({
  name: "Shiva",
  email: "shiva@example.com",
});

console.log(createdUser);

/*
 * ============================================================
 * 35. Practical API response example
 * ============================================================
 */

function handleResponse(response) {
  const { status, data, error } = response;

  if (error) {
    console.error("API error:", error);

    return;
  }

  console.log("Status:", status);

  console.log("Data:", data);
}

handleResponse({
  status: 200,
  data: {
    message: "Success",
  },
});

/*
 * ============================================================
 * 36. Destructuring + optional chaining
 * ============================================================
 *
 * Sometimes optional chaining is cleaner.
 *
 * Instead of deeply destructuring:
 *
 *     const {
 *       user: {
 *         profile: {
 *           name
 *         } = {}
 *       } = {}
 *     } = data;
 *
 *
 * You can use:
 *
 *     const name = data?.user?.profile?.name;
 *
 *
 * Choose whichever makes the code easier to understand.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Best practices
 * ============================================================
 *
 * ✓ Use destructuring when it improves readability.
 *
 * ✓ Use object destructuring for named properties.
 *
 * ✓ Use array destructuring for positional values.
 *
 * ✓ Use aliases when names would conflict.
 *
 * ✓ Use defaults for optional values.
 *
 * ✓ Use rest to collect remaining properties.
 *
 * ✓ Be careful when destructuring null/undefined.
 *
 * ✓ Don't create unnecessarily complicated nested
 *   destructuring.
 *
 * ✓ Use optional chaining when it is clearer.
 *
 * ============================================================
 */

/*
 * ============================================================
 * SUMMARY
 * ============================================================
 *
 * Array:
 *
 *     const [a, b] = array;
 *
 *
 * Object:
 *
 *     const { name, age } = user;
 *
 *
 * Rename:
 *
 *     const { name: userName } = user;
 *
 *
 * Default:
 *
 *     const { role = "user" } = user;
 *
 *
 * Rest:
 *
 *     const [first, ...rest] = array;
 *
 *     const { id, ...remaining } = object;
 *
 *
 * Function parameter:
 *
 *     function createUser({ name, email }) {}
 *
 *
 * Node.js uses destructuring constantly in:
 *
 *     req.body
 *     req.params
 *     req.query
 *     req.headers
 *     process.env
 *     module exports
 *     database documents
 *     API responses
 *     configuration
 *
 * ============================================================
 */
