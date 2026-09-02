/**
 * ============================================================
 * JavaScript for Node.js
 * ============================================================
 *
 * File: async_await.js
 *
 * Topic:
 * Async / Await
 *
 * ============================================================
 *
 * async/await is built on top of Promises.
 *
 * It makes asynchronous code easier to read and maintain.
 *
 * Remember:
 *
 *     async -> a function returns a Promise
 *
 *     await -> wait for a Promise to settle before continuing
 *              this async function
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Basic async function
 * ============================================================
 */

async function sayHello() {
  return "Hello Node.js";
}

const result = sayHello();

console.log(result);

/*
 * IMPORTANT:
 *
 * An async function ALWAYS returns a Promise.
 *
 * Even though we return:
 *
 *     "Hello Node.js"
 *
 * the actual return value is:
 *
 *     Promise<string>
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Getting the result with .then()
 * ============================================================
 */

sayHello().then((message) => {
  console.log(message);
});

/*
 * ============================================================
 * 3. await
 * ============================================================
 *
 * `await` gets the fulfilled value of a Promise.
 *
 * `await` can be used inside an async function.
 * ============================================================
 */

async function main() {
  const message = await sayHello();

  console.log(message);
}

main();

/*
 * Instead of:
 *
 *     sayHello().then(...)
 *
 *
 * we can write:
 *
 *     const message = await sayHello();
 *
 * ============================================================
 */

/*
 * ============================================================
 * 4. Simulating asynchronous work
 * ============================================================
 */

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function run() {
  console.log("Start");

  await delay(1000);

  console.log("After 1 second");
}

run();

/*
 * Flow:
 *
 *     Start
 *       ↓
 *     wait
 *       ↓
 *     After 1 second
 *
 *
 * IMPORTANT:
 *
 * `await` does NOT block the entire Node.js process.
 *
 * It pauses the current async function while Node.js can
 * continue handling other work.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 5. async function with parameters
 * ============================================================
 */

async function getUserName(userId) {
  await delay(500);

  return `User-${userId}`;
}

async function execute() {
  const name = await getUserName(101);

  console.log(name);
}

execute();

/*
 * ============================================================
 * 6. Error handling with try/catch
 * ============================================================
 *
 * Promise rejection becomes an exception when awaited.
 * ============================================================
 */

async function failingOperation() {
  throw new Error("Something went wrong");
}

async function handleError() {
  try {
    await failingOperation();
  } catch (error) {
    console.error("Caught:", error.message);
  }
}

handleError();

/*
 * ============================================================
 * 7. try/catch/finally
 * ============================================================
 */

async function operation() {
  try {
    console.log("Starting operation");

    await delay(500);

    console.log("Operation successful");
  } catch (error) {
    console.error("Operation failed:", error.message);
  } finally {
    console.log("Cleanup completed");
  }
}

operation();

/*
 * ============================================================
 * 8. Async function returning an object
 * ============================================================
 */

async function createUser() {
  return {
    id: 1,
    name: "Shiva",
    role: "user",
  };
}

async function showUser() {
  const user = await createUser();

  console.log(user);
}

showUser();

/*
 * ============================================================
 * 9. Async function returning another Promise
 * ============================================================
 */

async function getData() {
  return Promise.resolve("Data received");
}

getData().then((data) => {
  console.log(data);
});

/*
 * An async function automatically adopts the state of the
 * Promise it returns.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Sequential execution
 * ============================================================
 *
 * When operation B depends on operation A, await sequentially.
 * ============================================================
 */

async function sequentialExample() {
  const user = await getUserName(101);

  console.log("User:", user);

  const secondUser = await getUserName(102);

  console.log("Second user:", secondUser);
}

sequentialExample();

/*
 * Flow:
 *
 *     getUserName(101)
 *            ↓
 *          wait
 *            ↓
 *     getUserName(102)
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Independent operations
 * ============================================================
 *
 * Don't unnecessarily execute independent operations one by
 * one.
 * ============================================================
 */

async function getUser() {
  await delay(500);

  return {
    id: 1,
    name: "Shiva",
  };
}

async function getPosts() {
  await delay(500);

  return ["Post 1", "Post 2"];
}

/*
 * Less efficient when operations are independent:
 */

async function sequentialRequests() {
  const user = await getUser();

  const posts = await getPosts();

  return {
    user,
    posts,
  };
}

/*
 * Better:
 *
 * Start both operations and wait for both.
 */

async function parallelRequests() {
  const [user, posts] = await Promise.all([getUser(), getPosts()]);

  return {
    user,
    posts,
  };
}

parallelRequests().then((result) => {
  console.log(result);
});

/*
 * ============================================================
 * 12. Promise.all() with async/await
 * ============================================================
 */

async function loadDashboard() {
  const [user, posts, settings] = await Promise.all([
    getUser(),

    getPosts(),

    Promise.resolve({
      theme: "dark",
    }),
  ]);

  return {
    user,
    posts,
    settings,
  };
}

loadDashboard().then((dashboard) => {
  console.log(dashboard);
});

/*
 * ============================================================
 * 13. Promise.allSettled() with async/await
 * ============================================================
 */

async function loadEverything() {
  const results = await Promise.allSettled([
    getUser(),

    getPosts(),

    Promise.reject(new Error("Settings unavailable")),
  ]);

  console.log(results);
}

loadEverything();

/*
 * ============================================================
 * 14. Promise.race() with async/await
 * ============================================================
 */

async function raceExample() {
  const result = await Promise.race([
    delay(500).then(() => "Fast"),

    delay(2000).then(() => "Slow"),
  ]);

  console.log("Winner:", result);
}

raceExample();

/*
 * ============================================================
 * 15. Promise.any() with async/await
 * ============================================================
 */

async function anyExample() {
  const result = await Promise.any([
    Promise.reject(new Error("Server A failed")),

    Promise.resolve("Server B succeeded"),

    Promise.resolve("Server C succeeded"),
  ]);

  console.log(result);
}

anyExample();

/*
 * ============================================================
 * 16. Catching Promise.any() errors
 * ============================================================
 */

async function allServersFailed() {
  try {
    await Promise.any([
      Promise.reject(new Error("A failed")),

      Promise.reject(new Error("B failed")),
    ]);
  } catch (error) {
    console.error("All servers failed:", error);
  }
}

allServersFailed();

/*
 * ============================================================
 * 17. Async loops
 * ============================================================
 *
 * `for...of` works naturally with await.
 * ============================================================
 */

async function processUsers() {
  const users = [1, 2, 3];

  for (const userId of users) {
    const user = await getUserName(userId);

    console.log(user);
  }
}

processUsers();

/*
 * This runs sequentially:
 *
 *     user 1
 *       ↓
 *     user 2
 *       ↓
 *     user 3
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Don't use forEach() for await like this
 * ============================================================
 *
 * ❌ Avoid:
 *
 *
 *     users.forEach(
 *       async (user) => {
 *         await processUser(user);
 *       }
 *     );
 *
 *
 * `forEach()` does not wait for async callbacks.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Correct sequential loop
 * ============================================================
 */

async function processSequentially(users) {
  for (const user of users) {
    await delay(100);

    console.log("Processed:", user);
  }
}

processSequentially(["A", "B", "C"]);

/*
 * ============================================================
 * 20. Correct parallel loop
 * ============================================================
 *
 * If operations are independent:
 */

async function processInParallel(users) {
  await Promise.all(
    users.map(async (user) => {
      await delay(100);

      console.log("Processed:", user);
    }),
  );
}

processInParallel(["A", "B", "C"]);

/*
 * Difference:
 *
 *
 * Sequential:
 *
 *     A → B → C
 *
 *
 * Parallel:
 *
 *     A
 *     B
 *     C
 *     ↓
 *     wait for all
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Async error propagation
 * ============================================================
 */

async function service() {
  throw new Error("Database error");
}

async function controller() {
  try {
    await service();
  } catch (error) {
    console.error("Controller caught:", error.message);
  }
}

controller();

/*
 * In a real backend:
 *
 *
 *     route
 *       ↓
 *     controller
 *       ↓
 *     service
 *       ↓
 *     database
 *
 *
 * Errors can propagate upward until handled by the appropriate
 * error-handling layer.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Real Node.js service pattern
 * ============================================================
 *
 * Imagine:
 *
 *     user.service.js
 *
 *
 *     async function findUserById(id) {
 *
 *       const user =
 *         await User.findById(id);
 *
 *       return user;
 *
 *     }
 *
 *
 * Controller:
 *
 *
 *     async function getUser(req, res) {
 *
 *       const user =
 *         await findUserById(req.params.id);
 *
 *       res.json(user);
 *
 *     }
 *
 *
 * This pattern is extremely common in Node.js backends.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Async function and Promise return type
 * ============================================================
 */

async function number() {
  return 42;
}

number().then((value) => {
  console.log(value);
});

/*
 * Conceptually:
 *
 *     async function number() {
 *       return 42;
 *     }
 *
 *
 * behaves like:
 *
 *     function number() {
 *       return Promise.resolve(42);
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 24. Throw inside async function
 * ============================================================
 */

async function failed() {
  throw new Error("Failed");
}

failed().catch((error) => {
  console.error(error.message);
});

/*
 * Throwing inside an async function causes the returned
 * Promise to be rejected.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 25. Awaiting a rejected Promise
 * ============================================================
 */

async function rejectedExample() {
  try {
    await Promise.reject(new Error("Rejected Promise"));
  } catch (error) {
    console.error(error.message);
  }
}

rejectedExample();

/*
 * ============================================================
 * 26. Awaiting normal values
 * ============================================================
 *
 * `await` can technically be used with non-Promise values.
 * ============================================================
 */

async function normalValue() {
  const value = await 100;

  console.log(value);
}

normalValue();

/*
 * JavaScript treats it as an already-fulfilled value.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Top-level await
 * ============================================================
 *
 * In ESM modules, top-level await can be used.
 *
 *
 * Example:
 *
 *
 *     const data =
 *       await fetchData();
 *
 *
 * This is not available in the same way inside ordinary
 * CommonJS modules.
 *
 * We'll study this more in the ESM section.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Async IIFE
 * ============================================================
 *
 * IIFE = Immediately Invoked Function Expression.
 *
 * An async IIFE can be useful when you need await in a scope
 * that isn't otherwise async.
 * ============================================================
 */

(async () => {
  const result = await Promise.resolve("Async IIFE");

  console.log(result);
})();

/*
 * ============================================================
 * 29. Real file-system example
 * ============================================================
 *
 * Node.js provides Promise-based APIs.
 *
 * Example:
 *
 *
 *     const fs =
 *       require("node:fs/promises");
 *
 *
 *     async function readFile() {
 *
 *       const data =
 *         await fs.readFile(
 *           "example.txt",
 *           "utf8"
 *         );
 *
 *       console.log(data);
 *
 *     }
 *
 *
 * This is one of the most important real-world uses of
 * async/await in Node.js.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Real database example
 * ============================================================
 *
 * Concept:
 *
 *
 *     async function getUser(id) {
 *
 *       const user =
 *         await User.findById(id);
 *
 *       return user;
 *
 *     }
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. Real API example
 * ============================================================
 *
 * Concept:
 *
 *
 *     async function getData() {
 *
 *       const response =
 *         await fetch(
 *           "https://example.com/api"
 *         );
 *
 *       const data =
 *         await response.json();
 *
 *       return data;
 *
 *     }
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Important: await doesn't block Node.js
 * ============================================================
 *
 * Consider:
 *
 *
 *     async function test() {
 *
 *       console.log("A");
 *
 *       await delay(2000);
 *
 *       console.log("B");
 *
 *     }
 *
 *
 *     test();
 *
 *     console.log("C");
 *
 *
 * Output:
 *
 *     A
 *     C
 *     B
 *
 *
 * The async function pauses at await.
 *
 * The Node.js event loop can continue doing other work.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Sequential vs parallel
 * ============================================================
 *
 *
 * SEQUENTIAL
 *
 *     const a = await taskA();
 *     const b = await taskB();
 *     const c = await taskC();
 *
 *
 * Total time is approximately:
 *
 *     A + B + C
 *
 *
 *
 * PARALLEL
 *
 *     const [a, b, c] =
 *       await Promise.all([
 *         taskA(),
 *         taskB(),
 *         taskC()
 *       ]);
 *
 *
 * Total time is approximately:
 *
 *     max(A, B, C)
 *
 *
 * when the operations are independent and can actually run
 * concurrently.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Dependency matters
 * ============================================================
 *
 * Sometimes sequential execution is REQUIRED.
 *
 *
 *     const user =
 *       await createUser();
 *
 *
 *     const account =
 *       await createAccount(
 *         user.id
 *       );
 *
 *
 * `createAccount()` needs `user.id`.
 *
 * Therefore:
 *
 *     createUser
 *          ↓
 *     createAccount
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Avoid unnecessary await
 * ============================================================
 *
 * Sometimes this:
 *
 *
 *     async function getData() {
 *       return await anotherFunction();
 *     }
 *
 *
 * is unnecessary if you don't need to catch/transform the
 * rejection at that point.
 *
 * Often:
 *
 *
 *     async function getData() {
 *       return anotherFunction();
 *     }
 *
 *
 * is sufficient.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. But await can be useful for local error handling
 * ============================================================
 */

async function example() {
  try {
    return await Promise.reject(new Error("Failed"));
  } catch (error) {
    console.error("Handled locally:", error.message);

    return null;
  }
}

example();

/*
 * ============================================================
 * 37. Async/await mental model
 * ============================================================
 *
 *
 *             async function
 *                    │
 *                    ▼
 *               Promise
 *                    │
 *                    ▼
 *                 await
 *                    │
 *             ┌──────┴──────┐
 *             ▼             ▼
 *          success        failure
 *             │             │
 *             ▼             ▼
 *          continue      catch()
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Common mistakes
 * ============================================================
 *
 * ❌ Forgetting await:
 *
 *
 *     const user = getUser();
 *
 *
 * `user` is a Promise, not the actual user.
 *
 *
 * Correct:
 *
 *
 *     const user = await getUser();
 *
 *
 *
 * ❌ Using await inside non-async function:
 *
 *
 *     function test() {
 *       await getData();
 *     }
 *
 *
 * This is invalid in normal function scope.
 *
 *
 *
 * ❌ Using forEach() with await:
 *
 *
 *     users.forEach(async user => {
 *       await processUser(user);
 *     });
 *
 *
 * Prefer:
 *
 *
 *     for (const user of users) {
 *       await processUser(user);
 *     }
 *
 *
 * or:
 *
 *
 *     await Promise.all(
 *       users.map(user =>
 *         processUser(user)
 *       )
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Production backend pattern
 * ============================================================
 *
 *
 * Route
 *   ↓
 * Controller
 *   ↓
 * Service
 *   ↓
 * Repository / Model
 *   ↓
 * Database
 *
 *
 * Example:
 *
 *
 * async function controller(req, res, next) {
 *
 *   try {
 *
 *     const user =
 *       await userService.findById(
 *         req.params.id
 *       );
 *
 *     res.json(user);
 *
 *   } catch (error) {
 *
 *     next(error);
 *
 *   }
 *
 * }
 *
 *
 * Later, Express error middleware can handle the error.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. Best practices
 * ============================================================
 *
 * ✓ Use async/await for readable asynchronous code.
 *
 * ✓ Handle expected errors appropriately.
 *
 * ✓ Use Promise.all() for independent operations.
 *
 * ✓ Use sequential await when operations depend on each other.
 *
 * ✓ Don't use forEach() when you need to await each callback.
 *
 * ✓ Keep async business logic inside appropriate services.
 *
 * ✓ Don't block the Node.js event loop with synchronous,
 *   CPU-heavy operations.
 *
 * ✓ Understand that await pauses the async function, not the
 *   entire Node.js process.
 *
 * ============================================================
 */

/*
 * ============================================================
 * SUMMARY
 * ============================================================
 *
 *
 * ASYNC
 *
 *     async function test() {
 *     }
 *
 *
 * An async function always returns a Promise.
 *
 *
 * AWAIT
 *
 *     const result = await promise;
 *
 *
 * Waits for the Promise result inside the async function.
 *
 *
 * ERROR HANDLING
 *
 *     try {
 *       await operation();
 *     } catch (error) {
 *       // handle error
 *     }
 *
 *
 * PARALLEL
 *
 *     await Promise.all([
 *       taskA(),
 *       taskB()
 *     ]);
 *
 *
 * SEQUENTIAL
 *
 *     const a = await taskA();
 *     const b = await taskB();
 *
 *
 * LOOP
 *
 *     for (const item of items) {
 *       await process(item);
 *     }
 *
 *
 * PARALLEL LOOP
 *
 *     await Promise.all(
 *       items.map(item =>
 *         process(item)
 *       )
 *     );
 *
 *
 * ============================================================
 *
 * MOST IMPORTANT:
 *
 *     async  -> Promise
 *
 *     await  -> Promise result
 *
 *     try/catch -> async error handling
 *
 *     Promise.all -> concurrent independent operations
 *
 * ============================================================
 */
