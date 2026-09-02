/**
 * ============================================================
 * JavaScript for Node.js
 * ============================================================
 *
 * File: promises.js
 *
 * Topic:
 * Promises
 *
 * ============================================================
 *
 * Node.js performs a lot of asynchronous work:
 *
 *     - Reading files
 *     - Database queries
 *     - HTTP requests
 *     - API calls
 *     - Redis operations
 *     - Network operations
 *     - Timers
 *
 * A Promise represents the eventual result of an asynchronous
 * operation.
 *
 * ============================================================
 *
 * Promise has 3 states:
 *
 *     1. pending
 *     2. fulfilled
 *     3. rejected
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Basic Promise
 * ============================================================
 */

const promise = new Promise((resolve, reject) => {
  // Simulate successful asynchronous work
  resolve("Operation successful");
});

promise.then((result) => {
  console.log(result);
});

/*
 * Output:
 *
 *     Operation successful
 *
 * ============================================================
 */

/*
 * ============================================================
 * 2. Promise states
 * ============================================================
 *
 *
 *             Promise
 *                │
 *          ┌─────┴─────┐
 *          ▼           ▼
 *       resolve       reject
 *          │           │
 *          ▼           ▼
 *     fulfilled     rejected
 *
 *
 * Initially:
 *
 *     pending
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. resolve()
 * ============================================================
 */

const successfulPromise = new Promise((resolve) => {
  resolve("Success");
});

successfulPromise.then((value) => {
  console.log("Result:", value);
});

/*
 * ============================================================
 * 4. reject()
 * ============================================================
 */

const failedPromise = new Promise((resolve, reject) => {
  reject(new Error("Something went wrong"));
});

failedPromise.catch((error) => {
  console.log("Error:", error.message);
});

/*
 * ============================================================
 * 5. Promise with setTimeout
 * ============================================================
 *
 * This better represents real asynchronous work.
 * ============================================================
 */

const delayedPromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Data received");
  }, 1000);
});

delayedPromise.then((data) => {
  console.log(data);
});

/*
 * The Promise is initially:
 *
 *     pending
 *
 * After 1 second:
 *
 *     fulfilled
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. Promise rejection
 * ============================================================
 */

const delayedFailure = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error("Request failed"));
  }, 1000);
});

delayedFailure.catch((error) => {
  console.error(error.message);
});

/*
 * ============================================================
 * 7. then()
 * ============================================================
 *
 * `.then()` runs when the Promise is fulfilled.
 * ============================================================
 */

Promise.resolve(100).then((value) => {
  console.log("Value:", value);
});

/*
 * ============================================================
 * 8. catch()
 * ============================================================
 *
 * `.catch()` handles rejection.
 * ============================================================
 */

Promise.reject(new Error("Database connection failed")).catch((error) => {
  console.error(error.message);
});

/*
 * ============================================================
 * 9. finally()
 * ============================================================
 *
 * `finally()` runs whether the Promise succeeds or fails.
 * ============================================================
 */

Promise.resolve("Success")
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Operation finished");
  });

/*
 * Common use:
 *
 *     database connection
 *     loading state
 *     cleanup
 *     closing resources
 *
 * ============================================================
 */

/*
 * ============================================================
 * 10. Promise chaining
 * ============================================================
 *
 * One Promise can return another value.
 * ============================================================
 */

Promise.resolve(10)
  .then((value) => {
    return value * 2;
  })
  .then((value) => {
    return value + 5;
  })
  .then((value) => {
    console.log(value);
  });

/*
 * Flow:
 *
 *     10
 *      ↓
 *     20
 *      ↓
 *     25
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Returning a Promise from .then()
 * ============================================================
 */

function getUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: "Shiva",
      });
    }, 500);
  });
}

getUser()
  .then((user) => {
    console.log("User:", user);

    return user.id;
  })
  .then((userId) => {
    console.log("User ID:", userId);
  });

/*
 * ============================================================
 * 12. Error propagation
 * ============================================================
 *
 * Errors can travel through a Promise chain until a catch()
 * handles them.
 * ============================================================
 */

Promise.resolve()
  .then(() => {
    throw new Error("Something failed");
  })
  .then(() => {
    console.log("This will not execute");
  })
  .catch((error) => {
    console.error("Caught:", error.message);
  });

/*
 * ============================================================
 * 13. Promise.resolve()
 * ============================================================
 *
 * Converts a value into a resolved Promise.
 * ============================================================
 */

Promise.resolve("Hello").then((value) => {
  console.log(value);
});

/*
 * ============================================================
 * 14. Promise.reject()
 * ============================================================
 */

Promise.reject(new Error("Failed")).catch((error) => {
  console.error(error.message);
});

/*
 * ============================================================
 * 15. Promise.all()
 * ============================================================
 *
 * Runs multiple Promises concurrently.
 *
 * It resolves only when ALL Promises resolve.
 * ============================================================
 */

const userPromise = Promise.resolve({
  id: 1,
  name: "Shiva",
});

const postsPromise = Promise.resolve(["Post 1", "Post 2"]);

const settingsPromise = Promise.resolve({
  theme: "dark",
});

Promise.all([userPromise, postsPromise, settingsPromise])
  .then((results) => {
    console.log("Results:", results);
  })
  .catch((error) => {
    console.error(error);
  });

/*
 * Result:
 *
 *     [
 *       user,
 *       posts,
 *       settings
 *     ]
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. Promise.all() fails fast
 * ============================================================
 *
 * If one Promise rejects, Promise.all() rejects.
 * ============================================================
 */

Promise.all([
  Promise.resolve("A"),

  Promise.reject(new Error("B failed")),

  Promise.resolve("C"),
])
  .then((results) => {
    console.log(results);
  })
  .catch((error) => {
    console.error(error.message);
  });

/*
 * ============================================================
 * 17. Promise.allSettled()
 * ============================================================
 *
 * Unlike Promise.all(), allSettled waits for EVERY Promise.
 * ============================================================
 */

Promise.allSettled([
  Promise.resolve("Success"),

  Promise.reject(new Error("Failed")),

  Promise.resolve("Another success"),
]).then((results) => {
  console.log(results);
});

/*
 * Results contain:
 *
 *     {
 *       status: "fulfilled",
 *       value: ...
 *     }
 *
 * or:
 *
 *     {
 *       status: "rejected",
 *       reason: ...
 *     }
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. Promise.race()
 * ============================================================
 *
 * Settles as soon as the FIRST Promise settles.
 *
 * "Settles" means:
 *
 *     fulfilled OR rejected
 *
 * ============================================================
 */

const fast = new Promise((resolve) => {
  setTimeout(() => resolve("Fast"), 500);
});

const slow = new Promise((resolve) => {
  setTimeout(() => resolve("Slow"), 2000);
});

Promise.race([fast, slow]).then((result) => {
  console.log("Winner:", result);
});

/*
 * Output:
 *
 *     Winner: Fast
 *
 * ============================================================
 */

/*
 * ============================================================
 * 19. Promise.any()
 * ============================================================
 *
 * Resolves when the FIRST Promise fulfills.
 *
 * Rejected Promises are ignored unless ALL reject.
 * ============================================================
 */

Promise.any([
  Promise.reject(new Error("Server 1 failed")),

  Promise.resolve("Server 2 succeeded"),

  Promise.resolve("Server 3 succeeded"),
])
  .then((result) => {
    console.log("First success:", result);
  })
  .catch((error) => {
    console.error(error);
  });

/*
 * ============================================================
 * 20. Promise.any() when everything fails
 * ============================================================
 */

Promise.any([
  Promise.reject(new Error("A failed")),

  Promise.reject(new Error("B failed")),
]).catch((error) => {
  console.log("All failed:", error);
});

/*
 * The error is an AggregateError.
 *
 * It contains:
 *
 *     error.errors
 *
 * ============================================================
 */

/*
 * ============================================================
 * 21. Sequential asynchronous operations
 * ============================================================
 */

function stepOne() {
  return Promise.resolve("Step 1 complete");
}

function stepTwo() {
  return Promise.resolve("Step 2 complete");
}

stepOne()
  .then((result) => {
    console.log(result);

    return stepTwo();
  })
  .then((result) => {
    console.log(result);
  });

/*
 * Step 2 starts after Step 1 completes.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Concurrent operations
 * ============================================================
 *
 * If operations don't depend on each other, run them
 * concurrently.
 * ============================================================
 */

const operationA = Promise.resolve("A");

const operationB = Promise.resolve("B");

const operationC = Promise.resolve("C");

Promise.all([operationA, operationB, operationC]).then((results) => {
  console.log(results);
});

/*
 * This is generally better than unnecessarily doing:
 *
 *
 *     operationA
 *         ↓
 *     operationB
 *         ↓
 *     operationC
 *
 *
 * when the operations are independent.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Promise timeout
 * ============================================================
 *
 * A useful backend pattern.
 * ============================================================
 */

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

delay(1000).then(() => {
  console.log("1 second completed");
});

/*
 * ============================================================
 * 24. Simulating an API call
 * ============================================================
 */

function fetchUser() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;

      if (success) {
        resolve({
          id: 101,
          name: "Shiva",
        });
      } else {
        reject(new Error("Unable to fetch user"));
      }
    }, 1000);
  });
}

fetchUser()
  .then((user) => {
    console.log("Fetched user:", user);
  })
  .catch((error) => {
    console.error("API error:", error.message);
  });

/*
 * ============================================================
 * 25. Callback vs Promise
 * ============================================================
 *
 *
 * CALLBACK STYLE
 *
 *     getUser(
 *       (error, user) => {
 *
 *         if (error) {
 *           // handle error
 *         }
 *
 *         // use user
 *       }
 *     );
 *
 *
 *
 * PROMISE STYLE
 *
 *     getUser()
 *       .then(user => {
 *         // use user
 *       })
 *       .catch(error => {
 *         // handle error
 *       });
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Promise executor runs immediately
 * ============================================================
 */

console.log("Before");

const testPromise = new Promise((resolve) => {
  console.log("Executor");

  resolve();
});

console.log("After");

/*
 * Output:
 *
 *     Before
 *     Executor
 *     After
 *
 *
 * Important:
 *
 * Creating the Promise does NOT automatically make the executor
 * asynchronous.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. `.then()` callbacks are asynchronous
 * ============================================================
 */

console.log("A");

Promise.resolve().then(() => {
  console.log("B");
});

console.log("C");

/*
 * Output:
 *
 *     A
 *     C
 *     B
 *
 *
 * Promise callbacks run through the microtask queue.
 *
 * This becomes very important when we study:
 *
 *     event_loop.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. Promise chaining with transformations
 * ============================================================
 */

function getNumber() {
  return Promise.resolve(10);
}

getNumber()
  .then((number) => {
    return number * 2;
  })
  .then((number) => {
    return number + 10;
  })
  .then((number) => {
    return number / 2;
  })
  .then((result) => {
    console.log("Final:", result);
  });

/*
 * Flow:
 *
 *     10
 *     ↓
 *     20
 *     ↓
 *     30
 *     ↓
 *     15
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. Returning nothing
 * ============================================================
 */

Promise.resolve(10)
  .then((value) => {
    console.log(value);

    // No return
  })
  .then((value) => {
    console.log("Next value:", value);
  });

/*
 * The next Promise receives:
 *
 *     undefined
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Promise error handling
 * ============================================================
 */

Promise.resolve()
  .then(() => {
    throw new Error("Unexpected failure");
  })
  .catch((error) => {
    console.error("Handled:", error.message);
  })
  .finally(() => {
    console.log("Cleanup complete");
  });

/*
 * ============================================================
 * 31. Real backend pattern
 * ============================================================
 *
 * A typical service may look like:
 *
 *
 *     async function createUser(data) {
 *
 *       const user =
 *         await userModel.create(data);
 *
 *       return user;
 *
 *     }
 *
 *
 * `await` works with Promises.
 *
 * We will learn this properly in:
 *
 *     async_await.js
 *
 * ============================================================
 */

/*
 * ============================================================
 * 32. Promise.all() in backend applications
 * ============================================================
 *
 * Example:
 *
 *
 *     const [
 *       user,
 *       posts,
 *       notifications
 *     ] = await Promise.all([
 *
 *       getUser(),
 *       getPosts(),
 *       getNotifications()
 *
 *     ]);
 *
 *
 * This is useful when all three operations are independent.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 33. Promise.race() in backend applications
 * ============================================================
 *
 * Common conceptual use:
 *
 *
 *     Promise.race([
 *       databaseRequest(),
 *       timeout()
 *     ]);
 *
 *
 * Whichever settles first determines the race result.
 *
 * In production, use carefully: a timeout Promise alone does
 * not necessarily cancel the underlying operation.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. Promise.any() in distributed systems
 * ============================================================
 *
 * Example concept:
 *
 *
 *     Promise.any([
 *       serverA(),
 *       serverB(),
 *       serverC()
 *     ]);
 *
 *
 * Use the first successful response.
 *
 * Useful conceptually for redundant services.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 35. Promise.allSettled() in backend systems
 * ============================================================
 *
 * Example:
 *
 *
 *     await Promise.allSettled([
 *       sendEmail(),
 *       sendNotification(),
 *       updateAnalytics()
 *     ]);
 *
 *
 * Useful when one failure should not prevent us from observing
 * the outcome of the other independent operations.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. Important difference
 * ============================================================
 *
 *
 * Promise.all()
 * ─────────────
 *
 *     ALL must fulfill.
 *
 *     One rejection -> overall rejection.
 *
 *
 * Promise.allSettled()
 * ────────────────────
 *
 *     Wait for everything.
 *
 *
 * Promise.race()
 * ──────────────
 *
 *     First settlement wins.
 *
 *
 * Promise.any()
 * ─────────────
 *
 *     First fulfillment wins.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Promise combinators
 * ============================================================
 *
 *
 *                  Promise
 *                     │
 *       ┌─────────────┼─────────────┐
 *       │             │             │
 *       ▼             ▼             ▼
 *      all       allSettled       race
 *                                   │
 *                                   ▼
 *                                  any
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. Common mistakes
 * ============================================================
 *
 *
 * ❌ Forgetting catch():
 *
 *     somePromise();
 *
 *
 * Better:
 *
 *     somePromise()
 *       .catch(handleError);
 *
 *
 *
 * ❌ Sequentializing independent operations:
 *
 *     await getUser();
 *     await getPosts();
 *     await getSettings();
 *
 *
 * If independent, consider:
 *
 *     await Promise.all([
 *       getUser(),
 *       getPosts(),
 *       getSettings()
 *     ]);
 *
 *
 *
 * ❌ Assuming Promise.race() cancels losers.
 *
 * It doesn't automatically cancel the underlying operations.
 *
 *
 *
 * ❌ Creating unnecessary Promise wrappers.
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Promise anti-pattern
 * ============================================================
 *
 * Avoid:
 *
 *
 *     return new Promise(
 *       async (resolve, reject) => {
 *
 *         // ...
 *
 *       }
 *     );
 *
 *
 * In most cases, an async function already returns a Promise.
 *
 * We will explore this in async_await.js.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. Promise mental model
 * ============================================================
 *
 *
 *     START
 *       │
 *       ▼
 *    PENDING
 *       │
 *       ├──────────────┐
 *       │              │
 *       ▼              ▼
 *   FULFILLED       REJECTED
 *       │              │
 *       ▼              ▼
 *     then()         catch()
 *       │              │
 *       └──────┬───────┘
 *              ▼
 *          finally()
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. Key points to remember
 * ============================================================
 *
 * Promise represents future completion of an operation.
 *
 * States:
 *
 *     pending
 *     fulfilled
 *     rejected
 *
 *
 * Methods:
 *
 *     then()
 *     catch()
 *     finally()
 *
 *
 * Static methods:
 *
 *     Promise.resolve()
 *     Promise.reject()
 *     Promise.all()
 *     Promise.allSettled()
 *     Promise.race()
 *     Promise.any()
 *
 *
 * Node.js uses Promises extensively for asynchronous APIs.
 *
 * ============================================================
 */

/*
 * ============================================================
 * FINAL SUMMARY
 * ============================================================
 *
 * Promise:
 *
 *     const promise = new Promise(
 *       (resolve, reject) => {}
 *     );
 *
 *
 * Success:
 *
 *     resolve(value)
 *
 *
 * Failure:
 *
 *     reject(error)
 *
 *
 * Handle success:
 *
 *     promise.then(...)
 *
 *
 * Handle failure:
 *
 *     promise.catch(...)
 *
 *
 * Always run cleanup:
 *
 *     promise.finally(...)
 *
 *
 * Multiple operations:
 *
 *     Promise.all(...)
 *     Promise.allSettled(...)
 *     Promise.race(...)
 *     Promise.any(...)
 *
 *
 * MOST IMPORTANT:
 *
 *     Promise.all()
 *         -> all succeed
 *
 *     Promise.allSettled()
 *         -> wait for all
 *
 *     Promise.race()
 *         -> first settlement
 *
 *     Promise.any()
 *         -> first success
 *
 * ============================================================
 */
