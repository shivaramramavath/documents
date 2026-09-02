/**
 * ============================================================
 * Node.js Events - EventEmitter
 * ============================================================
 *
 * File:
 *
 *     07_events/event_emitter.js
 *
 * Built-in module:
 *
 *     node:events
 *
 * ============================================================
 *
 * Node.js is heavily event-driven.
 *
 * Many things happen as events:
 *
 *     request received
 *     file data received
 *     connection established
 *     user logged in
 *     message received
 *     stream finished
 *     error occurred
 *
 *
 * EventEmitter provides a standard way to:
 *
 *     1. Create events
 *     2. Register listeners
 *     3. Emit events
 *     4. Pass data with events
 *     5. Remove listeners
 *     6. Handle errors
 *
 * ============================================================
 */

/*
 * ============================================================
 * 1. Import EventEmitter
 * ============================================================
 */

const { EventEmitter } = require("node:events");

/*
 * ============================================================
 * 2. What is EventEmitter?
 * ============================================================
 *
 * EventEmitter is a Node.js class used to implement the
 * event-driven pattern.
 *
 *
 * Mental model:
 *
 *
 *     EVENT
 *       ↓
 *     EVENT EMITTER
 *       ↓
 *     LISTENER
 *       ↓
 *     FUNCTION
 *
 *
 * Example:
 *
 *
 *     "login"
 *
 *       ↓
 *
 *     listener
 *
 *       ↓
 *
 *     handleLogin()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 3. Create an EventEmitter instance
 * ============================================================
 */

const emitter = new EventEmitter();

/*
 * ============================================================
 * 4. Register a listener with on()
 * ============================================================
 *
 * `on()` registers a function that runs every time the event
 * is emitted.
 *
 *
 * Syntax:
 *
 *
 *     emitter.on(
 *       "eventName",
 *       listener
 *     );
 *
 * ============================================================
 */

emitter.on("hello", () => {
  console.log("Hello event received.");
});

/*
 * ============================================================
 * 5. Emit an event
 * ============================================================
 *
 * `emit()` triggers an event.
 *
 *
 * Syntax:
 *
 *
 *     emitter.emit(
 *       "eventName"
 *     );
 *
 * ============================================================
 */

emitter.emit("hello");

/*
 * ============================================================
 * 6. Event name
 * ============================================================
 *
 * Event names are strings.
 *
 *
 * Examples:
 *
 *
 *     "login"
 *     "logout"
 *     "message"
 *     "connected"
 *     "error"
 *
 *
 * You can also use Symbols as event keys, but strings are
 * common for application-level events.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 7. Listener receives event data
 * ============================================================
 *
 * `emit()` can pass additional arguments.
 *
 *
 * Example:
 *
 *
 *     emitter.emit(
 *       "user",
 *       user
 *     );
 *
 *
 * The listener receives them.
 *
 * ============================================================
 */

emitter.on("user", (user) => {
  console.log("\nUser event:", user);
});

emitter.emit("user", {
  id: 1,
  name: "Shiva",
});

/*
 * ============================================================
 * 8. Multiple arguments
 * ============================================================
 */

emitter.on("message", (sender, message, timestamp) => {
  console.log("\nSender:", sender);

  console.log("Message:", message);

  console.log("Timestamp:", timestamp);
});

emitter.emit("message", "Shiva", "Hello Node.js", Date.now());

/*
 * ============================================================
 * 9. Multiple listeners
 * ============================================================
 *
 * One event can have multiple listeners.
 *
 * ============================================================
 */

emitter.on("notification", () => {
  console.log("\nListener 1: Send email.");
});

emitter.on("notification", () => {
  console.log("Listener 2: Send push notification.");
});

emitter.on("notification", () => {
  console.log("Listener 3: Write audit log.");
});

emitter.emit("notification");

/*
 * ============================================================
 * 10. Listener execution order
 * ============================================================
 *
 * EventEmitter listeners are normally called synchronously
 * in the order they were registered.
 *
 *
 * Example:
 *
 *
 *     listener 1
 *     listener 2
 *     listener 3
 *
 *
 * They execute in that registration order.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. once()
 * ============================================================
 *
 * `once()` registers a listener that executes only one time.
 *
 * ============================================================
 */

emitter.once("startup", () => {
  console.log("\nStartup event executed once.");
});

emitter.emit("startup");

emitter.emit("startup");

/*
 * ============================================================
 * Expected:
 *
 *
 *     Startup event executed once.
 *
 *
 * It does NOT execute a second time.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 12. Why once() is useful
 * ============================================================
 *
 * Common examples:
 *
 *
 *     database connected
 *     server started
 *     initialization complete
 *     first connection
 *     one-time setup
 *
 * ============================================================
 */

/*
 * ============================================================
 * 13. Remove a listener
 * ============================================================
 *
 * Use:
 *
 *
 *     removeListener()
 *
 *
 * or:
 *
 *
 *     off()
 *
 *
 * ============================================================
 */

function onLogout() {
  console.log("\nUser logged out.");
}

emitter.on("logout", onLogout);

/*
 * Event works.
 */

emitter.emit("logout");

/*
 * Remove listener.
 */

emitter.off("logout", onLogout);

/*
 * This no longer executes onLogout().
 */

emitter.emit("logout");

/*
 * ============================================================
 * 14. Important:
 *
 * You must pass the same function reference when removing a
 * listener.
 *
 *
 * This works:
 *
 *
 *     function handler() {}
 *
 *     emitter.on(
 *       "event",
 *       handler
 *     );
 *
 *     emitter.off(
 *       "event",
 *       handler
 *     );
 *
 *
 * This does NOT remove the listener:
 *
 *
 *     emitter.off(
 *       "event",
 *       () => {}
 *     );
 *
 *
 * because that is a different function object.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 15. removeAllListeners()
 * ============================================================
 *
 * Removes all listeners for an event.
 *
 * ============================================================
 */

emitter.on("temporary", () => {
  console.log("Temporary listener 1");
});

emitter.on("temporary", () => {
  console.log("Temporary listener 2");
});

console.log("\nListeners before removal:", emitter.listenerCount("temporary"));

emitter.removeAllListeners("temporary");

console.log("Listeners after removal:", emitter.listenerCount("temporary"));

/*
 * ============================================================
 * 16. listenerCount()
 * ============================================================
 *
 * Returns the number of listeners registered for an event.
 * ============================================================
 */

console.log("\nNotification listeners:", emitter.listenerCount("notification"));

/*
 * ============================================================
 * 17. eventNames()
 * ============================================================
 *
 * Returns the event names that currently have listeners.
 * ============================================================
 */

console.log("\nEvent names:", emitter.eventNames());

/*
 * ============================================================
 * 18. listeners()
 * ============================================================
 *
 * Returns the listener functions for an event.
 * ============================================================
 */

const notificationListeners = emitter.listeners("notification");

console.log("\nNotification listener count:", notificationListeners.length);

/*
 * ============================================================
 * 19. prependListener()
 * ============================================================
 *
 * Normally:
 *
 *
 *     on(A)
 *     on(B)
 *
 *
 * executes:
 *
 *
 *     A
 *     B
 *
 *
 * `prependListener()` places a listener at the beginning.
 *
 * ============================================================
 */

emitter.on("order", () => {
  console.log("Normal listener.");
});

emitter.prependListener("order", () => {
  console.log("Prepended listener.");
});

console.log("\nListener order:");

emitter.emit("order");

/*
 * ============================================================
 * 20. prependOnceListener()
 * ============================================================
 *
 * Combines:
 *
 *
 *     prependListener()
 *
 * and:
 *
 *     once()
 *
 * ============================================================
 */

emitter.prependOnceListener("first", () => {
  console.log("Prepended once listener.");
});

emitter.emit("first");

/*
 * ============================================================
 * 21. EventEmitter with a class
 * ============================================================
 *
 * A common real-world pattern is to extend EventEmitter.
 *
 * ============================================================
 */

class UserService extends EventEmitter {
  login(user) {
    console.log("\nLogging in:", user.name);

    /*
     * Perform login logic here.
     */

    this.emit("login", user);
  }

  logout(user) {
    console.log("Logging out:", user.name);

    this.emit("logout", user);
  }
}

/*
 * ============================================================
 * 22. Create service
 * ============================================================
 */

const userService = new UserService();

/*
 * ============================================================
 * 23. Register application listeners
 * ============================================================
 */

userService.on("login", (user) => {
  console.log("Login listener:", user.name);
});

userService.on("logout", (user) => {
  console.log("Logout listener:", user.name);
});

/*
 * ============================================================
 * 24. Trigger service events
 * ============================================================
 */

const demoUser = {
  id: 100,
  name: "Shiva",
};

userService.login(demoUser);

userService.logout(demoUser);

/*
 * ============================================================
 * 25. Real-world architecture
 * ============================================================
 *
 *
 *     UserService
 *
 *          │
 *          │ emit("user.created")
 *          ↓
 *
 *     EventEmitter
 *
 *          │
 *     ┌────┼──────────┐
 *     ↓    ↓          ↓
 *
 *   Email  Logger   Analytics
 *
 *
 * The service doesn't need to know every consumer.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. EventEmitter is synchronous
 * ============================================================
 *
 * Consider:
 *
 *
 *     emitter.on(
 *       "test",
 *       () => {
 *
 *         console.log("A");
 *
 *       }
 *     );
 *
 *
 *     emitter.on(
 *       "test",
 *       () => {
 *
 *         console.log("B");
 *
 *       }
 *     );
 *
 *
 *     emitter.emit("test");
 *
 *
 * Output:
 *
 *
 *     A
 *     B
 *
 *
 * The listeners are called synchronously.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 27. Do not assume EventEmitter is a message queue
 * ============================================================
 *
 * EventEmitter is:
 *
 *
 *     in-process
 *     memory-based
 *     local to the Node.js process
 *
 *
 * It is NOT:
 *
 *
 *     Kafka
 *     Redis Pub/Sub
 *     RabbitMQ
 *
 *
 * If your application has:
 *
 *
 *     Server A
 *     Server B
 *     Server C
 *
 *
 * an EventEmitter in Server A does not automatically deliver
 * events to B and C.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. EventEmitter and microservices
 * ============================================================
 *
 *
 * Single Node.js process:
 *
 *
 *     Service
 *       ↓
 *     EventEmitter
 *
 *
 * Multiple services:
 *
 *
 *     Service A
 *       ↓
 *     Kafka / Redis / RabbitMQ
 *       ↓
 *     Service B
 *
 *
 * EventEmitter is excellent for internal process-level events.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. The special "error" event
 * ============================================================
 *
 * `error` is special in EventEmitter.
 *
 *
 * If an EventEmitter emits "error" and there is no error
 * listener, Node.js can throw the error and terminate the
 * process.
 *
 * ============================================================
 */

const errorEmitter = new EventEmitter();

errorEmitter.on("error", (error) => {
  console.error("\nHandled EventEmitter error:", error.message);
});

errorEmitter.emit("error", new Error("Something went wrong."));

/*
 * ============================================================
 * 30. Error event without listener
 * ============================================================
 *
 * Avoid doing this in production:
 *
 *
 *     emitter.emit(
 *       "error",
 *       new Error("Failed")
 *     );
 *
 *
 * without an "error" listener.
 *
 *
 * Always deliberately handle EventEmitter errors.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. maxListeners
 * ============================================================
 *
 * Node.js has a default listener warning threshold.
 *
 *
 * You can inspect:
 *
 *
 *     emitter.getMaxListeners()
 *
 *
 * ============================================================
 */

console.log("\nDefault max listeners:", emitter.getMaxListeners());

/*
 * ============================================================
 * 32. setMaxListeners()
 * ============================================================
 *
 * You can change the threshold.
 *
 *
 * IMPORTANT:
 *
 * Increasing this value should not automatically be used to
 * hide a listener leak.
 *
 * ============================================================
 */

emitter.setMaxListeners(20);

console.log("New max listeners:", emitter.getMaxListeners());

/*
 * ============================================================
 * 33. rawListeners()
 * ============================================================
 *
 * Returns the underlying listener functions.
 *
 * It is mostly useful for advanced debugging and inspection.
 *
 * ============================================================
 */

const raw = emitter.rawListeners("notification");

console.log("\nRaw notification listeners:", raw.length);

/*
 * ============================================================
 * 34. Practical example: application events
 * ============================================================
 */

class Application extends EventEmitter {
  start() {
    console.log("\nApplication starting...");

    this.emit("started", {
      startedAt: new Date(),
    });
  }

  stop() {
    console.log("Application stopping...");

    this.emit("stopped", {
      stoppedAt: new Date(),
    });
  }
}

/*
 * Create application.
 */

const application = new Application();

/*
 * Register listeners.
 */

application.on("started", (data) => {
  console.log("Application started at:", data.startedAt);
});

application.on("stopped", (data) => {
  console.log("Application stopped at:", data.stoppedAt);
});

/*
 * Trigger events.
 */

application.start();

application.stop();

/*
 * ============================================================
 * 35. Event naming convention
 * ============================================================
 *
 * Good event names should clearly describe what happened.
 *
 *
 * Examples:
 *
 *
 *     user.created
 *     user.updated
 *     user.deleted
 *
 *     order.created
 *     order.paid
 *     order.cancelled
 *
 *     server.started
 *     server.stopped
 *
 *
 * Avoid vague names like:
 *
 *
 *     "thing"
 *     "data"
 *     "event"
 *
 * ============================================================
 */

/*
 * ============================================================
 * 36. EventEmitter in Node.js
 * ============================================================
 *
 * EventEmitter is used by many Node.js APIs.
 *
 *
 * Examples include:
 *
 *
 *     streams
 *     HTTP servers
 *     sockets
 *     process
 *     child processes
 *
 *
 * This is why understanding EventEmitter is essential for
 * understanding Node.js itself.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Common methods
 * ============================================================
 *
 *
 * Register:
 *
 *     emitter.on(
 *       event,
 *       listener
 *     );
 *
 *
 * Register once:
 *
 *     emitter.once(
 *       event,
 *       listener
 *     );
 *
 *
 * Trigger:
 *
 *     emitter.emit(
 *       event,
 *       data
 *     );
 *
 *
 * Remove:
 *
 *     emitter.off(
 *       event,
 *       listener
 *     );
 *
 *
 * Remove all:
 *
 *     emitter.removeAllListeners(
 *       event
 *     );
 *
 *
 * Count:
 *
 *     emitter.listenerCount(
 *       event
 *     );
 *
 *
 * Events:
 *
 *     emitter.eventNames()
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 38. EventEmitter mental model
 * ============================================================
 *
 *
 *                 emit()
 *                   │
 *                   ↓
 *             ┌─────────────┐
 *             │ EventEmitter│
 *             └─────────────┘
 *               │    │    │
 *               ↓    ↓    ↓
 *              L1   L2   L3
 *               │    │    │
 *               ↓    ↓    ↓
 *             handler functions
 *
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * Import:
 *
 *     const {
 *       EventEmitter
 *     } =
 *       require("node:events");
 *
 *
 * Create:
 *
 *     const emitter =
 *       new EventEmitter();
 *
 *
 * Listen:
 *
 *     emitter.on(
 *       "event",
 *       () => {}
 *     );
 *
 *
 * Listen once:
 *
 *     emitter.once(
 *       "event",
 *       () => {}
 *     );
 *
 *
 * Emit:
 *
 *     emitter.emit(
 *       "event",
 *       data
 *     );
 *
 *
 * Remove:
 *
 *     emitter.off(
 *       "event",
 *       handler
 *     );
 *
 *
 * Count:
 *
 *     emitter.listenerCount(
 *       "event"
 *     );
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     EventEmitter
 *         -> event-driven communication inside a Node.js
 *            process
 *
 *     on()
 *         -> listen repeatedly
 *
 *     once()
 *         -> listen one time
 *
 *     emit()
 *         -> trigger event
 *
 *     off()
 *         -> remove listener
 *
 *     error
 *         -> special event that should be handled
 *
 *     EventEmitter
 *         !=
 *     Kafka / Redis / RabbitMQ
 *
 * ============================================================
 */
