/**
 * ============================================================
 * Node.js Events - Listeners
 * ============================================================
 *
 * File:
 *
 *     07_events/listeners.js
 *
 * Module:
 *
 *     node:events
 *
 * ============================================================
 *
 * A listener is simply a function registered to respond to
 * an event.
 *
 *
 * Example:
 *
 *     emitter.on(
 *       "message",
 *       handler
 *     );
 *
 *
 * Here:
 *
 *     "message" -> event
 *     handler   -> listener
 *
 * ============================================================
 *
 * Topics:
 *
 *     1. Register listeners
 *     2. Multiple listeners
 *     3. once()
 *     4. off()
 *     5. removeListener()
 *     6. removeAllListeners()
 *     7. listenerCount()
 *     8. listeners()
 *     9. rawListeners()
 *    10. eventNames()
 *    11. prependListener()
 *    12. prependOnceListener()
 *    13. listener order
 *    14. max listeners
 *    15. listener leaks
 *    16. practical service example
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
 * 2. Create emitter
 * ============================================================
 */

const emitter = new EventEmitter();

/*
 * ============================================================
 * 3. Basic listener
 * ============================================================
 */

function handleMessage(message) {
  console.log("Message received:", message);
}

emitter.on("message", handleMessage);

/*
 * Emit the event.
 */

emitter.emit("message", "Hello Node.js");

/*
 * ============================================================
 * 4. One event can have multiple listeners
 * ============================================================
 */

function logger(message) {
  console.log("[LOGGER]", message);
}

function analytics(message) {
  console.log("[ANALYTICS]", message);
}

function notification(message) {
  console.log("[NOTIFICATION]", message);
}

emitter.on("message", logger);

emitter.on("message", analytics);

emitter.on("message", notification);

/*
 * Emit.
 */

console.log("\n--- Multiple listeners ---");

emitter.emit("message", "New message arrived.");

/*
 * ============================================================
 * 5. Listener execution order
 * ============================================================
 *
 * Listeners normally execute in the order they were registered.
 *
 *
 *     handleMessage
 *     logger
 *     analytics
 *     notification
 *
 * ============================================================
 */

/*
 * ============================================================
 * 6. listenerCount()
 * ============================================================
 */

console.log("\nMessage listener count:", emitter.listenerCount("message"));

/*
 * ============================================================
 * 7. listeners()
 * ============================================================
 *
 * Returns the currently registered listener functions.
 * ============================================================
 */

const messageListeners = emitter.listeners("message");

console.log("\nRegistered listeners:");

for (const listener of messageListeners) {
  console.log(listener.name);
}

/*
 * ============================================================
 * 8. eventNames()
 * ============================================================
 *
 * Shows events that currently have listeners.
 * ============================================================
 */

console.log("\nRegistered event names:", emitter.eventNames());

/*
 * ============================================================
 * 9. once()
 * ============================================================
 *
 * `once()` automatically removes the listener after its first
 * execution.
 * ============================================================
 */

function handleConnection(connection) {
  console.log("\nConnection initialized:", connection);
}

emitter.once("connection", handleConnection);

/*
 * First emit:
 *
 * Listener executes.
 */

emitter.emit("connection", {
  id: 1,
});

/*
 * Second emit:
 *
 * Listener does NOT execute.
 */

emitter.emit("connection", {
  id: 2,
});

/*
 * ============================================================
 * 10. Checking once() listener count
 * ============================================================
 */

console.log("\nConnection listeners:", emitter.listenerCount("connection"));

/*
 * ============================================================
 * 11. off()
 * ============================================================
 *
 * Remove a specific listener.
 * ============================================================
 */

function temporaryHandler(value) {
  console.log("Temporary handler:", value);
}

emitter.on("temporary", temporaryHandler);

console.log("\nBefore off():", emitter.listenerCount("temporary"));

/*
 * Remove the listener.
 */

emitter.off("temporary", temporaryHandler);

console.log("After off():", emitter.listenerCount("temporary"));

/*
 * This will not call temporaryHandler().
 */

emitter.emit("temporary", "Hello");

/*
 * ============================================================
 * 12. removeListener()
 * ============================================================
 *
 * `removeListener()` is another name for removing a specific
 * listener.
 *
 *
 * `off()` is the shorter modern form.
 * ============================================================
 */

function oldStyleHandler() {
  console.log("Old style listener.");
}

emitter.on("old-style", oldStyleHandler);

emitter.removeListener("old-style", oldStyleHandler);

/*
 * ============================================================
 * 13. Why function references matter
 * ============================================================
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
 * But this does NOT work:
 *
 *
 *     emitter.on(
 *       "event",
 *       () => {}
 *     );
 *
 *     emitter.off(
 *       "event",
 *       () => {}
 *     );
 *
 *
 * The two arrow functions are different objects.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 14. Demonstration
 * ============================================================
 */

const anonymousHandler = () => {
  console.log("Anonymous handler.");
};

emitter.on("demo", anonymousHandler);

/*
 * Correct:
 */

emitter.off("demo", anonymousHandler);

/*
 * ============================================================
 * 15. removeAllListeners()
 * ============================================================
 *
 * Removes all listeners for an event.
 *
 * ============================================================
 */

function listenerA() {
  console.log("Listener A");
}

function listenerB() {
  console.log("Listener B");
}

function listenerC() {
  console.log("Listener C");
}

emitter.on("cleanup", listenerA);

emitter.on("cleanup", listenerB);

emitter.on("cleanup", listenerC);

console.log("\nCleanup listeners before:", emitter.listenerCount("cleanup"));

emitter.removeAllListeners("cleanup");

console.log("Cleanup listeners after:", emitter.listenerCount("cleanup"));

/*
 * ============================================================
 * 16. Important:
 *
 * Avoid removeAllListeners() casually.
 *
 * If multiple modules share the same emitter, removing all
 * listeners can accidentally remove listeners owned by other
 * parts of the application.
 *
 * Prefer:
 *
 *
 *     emitter.off(
 *       event,
 *       specificHandler
 *     );
 *
 *
 * when possible.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. prependListener()
 * ============================================================
 *
 * Normally:
 *
 *
 *     on(A)
 *     on(B)
 *
 *
 * execution:
 *
 *
 *     A
 *     B
 *
 *
 * prependListener() inserts a listener at the beginning.
 *
 * ============================================================
 */

const orderEmitter = new EventEmitter();

orderEmitter.on("test", () => {
  console.log("Listener A");
});

orderEmitter.on("test", () => {
  console.log("Listener B");
});

orderEmitter.prependListener("test", () => {
  console.log("Prepended listener");
});

console.log("\n--- Listener order ---");

orderEmitter.emit("test");

/*
 * Expected:
 *
 *
 *     Prepended listener
 *     Listener A
 *     Listener B
 *
 * ============================================================
 */

/*
 * ============================================================
 * 18. prependOnceListener()
 * ============================================================
 *
 * Adds a one-time listener at the beginning.
 * ============================================================
 */

orderEmitter.prependOnceListener("startup", () => {
  console.log("\nStartup listener executed.");
});

orderEmitter.emit("startup");

/*
 * Second emit does nothing.
 */

orderEmitter.emit("startup");

/*
 * ============================================================
 * 19. Listener order
 * ============================================================
 *
 * EventEmitter generally uses registration order.
 *
 *
 *     prependListener()
 *         ↓
 *     earlier
 *
 *
 *     on()
 *         ↓
 *     later
 *
 *
 * This can matter when listener behavior depends on ordering.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 20. max listeners
 * ============================================================
 *
 * Node.js has a default maximum listener warning threshold.
 *
 *
 * Check it:
 * ============================================================
 */

console.log("\nDefault max listeners:", emitter.getMaxListeners());

/*
 * Change it:
 */

emitter.setMaxListeners(20);

console.log("Updated max listeners:", emitter.getMaxListeners());

/*
 * ============================================================
 * 21. IMPORTANT:
 *
 * "Max listeners" is NOT a hard maximum.
 *
 * It is primarily a warning mechanism for possible listener
 * leaks.
 *
 *
 * If you see:
 *
 *
 *     MaxListenersExceededWarning
 *
 *
 * don't immediately solve it by:
 *
 *
 *     setMaxListeners(1000)
 *
 *
 * First investigate why listeners keep accumulating.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. Listener leak
 * ============================================================
 *
 * A listener leak happens when listeners are repeatedly added
 * but never removed.
 *
 *
 * Example:
 *
 *
 *     function setup() {
 *
 *       emitter.on(
 *         "message",
 *         handler
 *       );
 *
 *     }
 *
 *
 * If setup() runs 1000 times:
 *
 *
 *     handler
 *     handler
 *     handler
 *     handler
 *     ...
 *
 *
 * The same logical operation may execute many times.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 23. Bad listener lifecycle
 * ============================================================
 */

function badSetup() {
  emitter.on("bad-event", () => {
    console.log("Bad listener");
  });
}

/*
 * Every call adds another listener.
 */

badSetup();

badSetup();

badSetup();

console.log("\nBad event listeners:", emitter.listenerCount("bad-event"));

/*
 * ============================================================
 * 24. Better listener lifecycle
 * ============================================================
 */

function goodHandler() {
  console.log("Good listener");
}

function setupGoodListener() {
  /*
   * Register exactly where the lifecycle starts.
   */

  emitter.on("good-event", goodHandler);
}

function cleanupGoodListener() {
  /*
   * Remove exactly where the lifecycle ends.
   */

  emitter.off("good-event", goodHandler);
}

setupGoodListener();

console.log("\nGood event listeners:", emitter.listenerCount("good-event"));

cleanupGoodListener();

console.log(
  "Good event listeners after cleanup:",
  emitter.listenerCount("good-event"),
);

/*
 * ============================================================
 * 25. Practical example: connection manager
 * ============================================================
 */

class ConnectionManager extends EventEmitter {
  constructor() {
    super();

    this.connections = new Map();
  }

  connect(id) {
    const connection = {
      id,

      connectedAt: new Date(),
    };

    this.connections.set(id, connection);

    this.emit("connected", connection);

    return connection;
  }

  disconnect(id) {
    const connection = this.connections.get(id);

    if (!connection) {
      return false;
    }

    this.connections.delete(id);

    this.emit("disconnected", connection);

    return true;
  }
}

/*
 * ============================================================
 * 26. Create ConnectionManager
 * ============================================================
 */

const connectionManager = new ConnectionManager();

/*
 * ============================================================
 * 27. Register listeners
 * ============================================================
 */

function handleConnected(connection) {
  console.log("\n[CONNECTED]", connection.id);
}

function handleDisconnected(connection) {
  console.log("[DISCONNECTED]", connection.id);
}

connectionManager.on("connected", handleConnected);

connectionManager.on("disconnected", handleDisconnected);

/*
 * ============================================================
 * 28. Trigger events
 * ============================================================
 */

connectionManager.connect("connection-1");

connectionManager.connect("connection-2");

connectionManager.disconnect("connection-1");

/*
 * ============================================================
 * 29. Cleanup listeners
 * ============================================================
 *
 * Imagine the ConnectionManager is being destroyed.
 *
 * We should remove listeners owned by the component.
 *
 * ============================================================
 */

connectionManager.off("connected", handleConnected);

connectionManager.off("disconnected", handleDisconnected);

/*
 * ============================================================
 * 30. EventEmitter and memory management
 * ============================================================
 *
 * EventEmitter keeps references to registered listener
 * functions.
 *
 *
 * Therefore:
 *
 *
 *     emitter
 *        ↓
 *     listener
 *        ↓
 *     captured objects
 *
 *
 * A long-lived emitter can keep objects reachable through
 * listeners for longer than expected.
 *
 *
 * This is one reason listener cleanup matters.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. EventEmitter and closures
 * ============================================================
 *
 * Example:
 * ============================================================
 */

function createListener(largeObject) {
  return () => {
    /*
     * This closure references largeObject.
     */

    console.log(largeObject.name);
  };
}

const object = {
  name: "Example object",
};

const listener = createListener(object);

emitter.on("closure-example", listener);

/*
 * As long as the listener remains registered, it may keep the
 * referenced object reachable.
 *
 * Remove it when it is no longer needed:
 */

emitter.off("closure-example", listener);

/*
 * ============================================================
 * 32. rawListeners()
 * ============================================================
 *
 * rawListeners() exposes the underlying listeners.
 *
 * It is mainly useful for debugging/inspection.
 *
 * ============================================================
 */

const rawListeners = emitter.rawListeners("message");

console.log("\nRaw message listeners:", rawListeners.length);

/*
 * ============================================================
 * 33. listeners() vs rawListeners()
 * ============================================================
 *
 *
 * listeners()
 *
 *     Gives listener functions intended for normal inspection.
 *
 *
 * rawListeners()
 *
 *     Gives the underlying listener functions used internally.
 *
 *
 * You generally use:
 *
 *
 *     listeners()
 *
 * for normal application inspection.
 *
 *
 * Use:
 *
 *
 *     rawListeners()
 *
 * when you specifically need lower-level inspection.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 34. newListener event
 * ============================================================
 *
 * EventEmitter itself emits special lifecycle events.
 *
 *
 *     newListener
 *
 *
 * fires when a listener is added.
 *
 * ============================================================
 */

const lifecycleEmitter = new EventEmitter();

lifecycleEmitter.on("newListener", (eventName, listener) => {
  console.log("\nNew listener registered:", eventName, listener.name);
});

function lifecycleHandler() {
  console.log("Lifecycle event handled.");
}

lifecycleEmitter.on("test", lifecycleHandler);

/*
 * ============================================================
 * 35. removeListener event
 * ============================================================
 *
 * EventEmitter also emits:
 *
 *
 *     removeListener
 *
 *
 * when a listener is removed.
 *
 * ============================================================
 */

lifecycleEmitter.on("removeListener", (eventName, listener) => {
  console.log("Listener removed:", eventName, listener.name);
});

lifecycleEmitter.off("test", lifecycleHandler);

/*
 * ============================================================
 * 36. Special events
 * ============================================================
 *
 *
 *     newListener
 *
 *         -> listener added
 *
 *
 *     removeListener
 *
 *         -> listener removed
 *
 *
 *     error
 *
 *         -> special error event
 *
 * ============================================================
 */

/*
 * ============================================================
 * 37. Error listener
 * ============================================================
 */

const safeEmitter = new EventEmitter();

safeEmitter.on("error", (error) => {
  console.error("\nHandled error:", error.message);
});

safeEmitter.emit("error", new Error("Example EventEmitter error."));

/*
 * ============================================================
 * 38. EventEmitter listener lifecycle
 * ============================================================
 *
 *
 *              CREATE
 *                │
 *                ↓
 *             emitter
 *                │
 *                ↓
 *              on()
 *                │
 *                ↓
 *            LISTENER
 *                │
 *                ↓
 *             emit()
 *                │
 *                ↓
 *          listener executes
 *                │
 *                ↓
 *              off()
 *                │
 *                ↓
 *            CLEANUP
 *
 * ============================================================
 */

/*
 * ============================================================
 * 39. Production rules
 * ============================================================
 *
 *
 * RULE 1:
 *
 * Give events clear names.
 *
 *
 *     user.created
 *     order.paid
 *
 *
 * ------------------------------------------------------------
 *
 *
 * RULE 2:
 *
 * Keep listener functions manageable.
 *
 *
 * ------------------------------------------------------------
 *
 *
 * RULE 3:
 *
 * Remove listeners when their owner is destroyed.
 *
 *
 * ------------------------------------------------------------
 *
 *
 * RULE 4:
 *
 * Don't blindly increase maxListeners.
 *
 *
 * ------------------------------------------------------------
 *
 *
 * RULE 5:
 *
 * Handle the "error" event.
 *
 *
 * ------------------------------------------------------------
 *
 *
 * RULE 6:
 *
 * Use once() when an event should only be processed once.
 *
 *
 * ------------------------------------------------------------
 *
 *
 * RULE 7:
 *
 * Prefer off() for removing a specific listener instead of
 * removeAllListeners().
 *
 * ============================================================
 */

/*
 * ============================================================
 * 40. EventEmitter vs EventTarget
 * ============================================================
 *
 * Node.js also supports Web-style EventTarget APIs.
 *
 *
 * EventEmitter:
 *
 *
 *     emitter.on()
 *     emitter.emit()
 *     emitter.off()
 *
 *
 * EventTarget:
 *
 *
 *     addEventListener()
 *     dispatchEvent()
 *     removeEventListener()
 *
 *
 * Node.js APIs heavily use EventEmitter, so understanding it
 * remains important for Node.js backend development.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 41. FINAL CHEAT SHEET
 * ============================================================
 *
 *
 * Register:
 *
 *     emitter.on(
 *       "event",
 *       handler
 *     );
 *
 *
 * One time:
 *
 *     emitter.once(
 *       "event",
 *       handler
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
 * Remove all:
 *
 *     emitter.removeAllListeners(
 *       "event"
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
 * Inspect:
 *
 *     emitter.listeners(
 *       "event"
 *     );
 *
 *
 * Raw inspection:
 *
 *     emitter.rawListeners(
 *       "event"
 *     );
 *
 *
 * Event names:
 *
 *     emitter.eventNames()
 *
 *
 * Prepend:
 *
 *     emitter.prependListener(
 *       "event",
 *       handler
 *     );
 *
 *
 * Prepend once:
 *
 *     emitter.prependOnceListener(
 *       "event",
 *       handler
 *     );
 *
 *
 * Max listeners:
 *
 *     emitter.getMaxListeners()
 *
 *
 * Set max listeners:
 *
 *     emitter.setMaxListeners(
 *       20
 *     );
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     Event
 *       ↓
 *     Listener registration
 *       ↓
 *     Event emitted
 *       ↓
 *     Listeners execute
 *       ↓
 *     Listener cleanup
 *
 *
 * Good listener lifecycle is essential for avoiding:
 *
 *     memory leaks
 *     duplicate handlers
 *     unexpected execution
 *     difficult-to-debug behavior
 *
 * ============================================================
 */
