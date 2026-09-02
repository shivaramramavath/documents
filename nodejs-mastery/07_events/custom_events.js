/**
 * ============================================================
 * Node.js Events - Custom Events
 * ============================================================
 *
 * File:
 *
 *     07_events/custom_events.js
 *
 * ============================================================
 *
 * In event_emitter.js, we learned:
 *
 *     EventEmitter
 *     on()
 *     once()
 *     emit()
 *     off()
 *
 *
 * Now we will create our own CUSTOM EVENTS.
 *
 *
 * Real-world examples:
 *
 *     user.created
 *     user.deleted
 *     order.created
 *     order.paid
 *     message.sent
 *     payment.completed
 *     file.uploaded
 *     server.started
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
 * 2. Create a custom event-driven class
 * ============================================================
 *
 * We can extend EventEmitter.
 *
 *
 *     EventEmitter
 *          ↑
 *          │
 *     UserService
 *
 *
 * UserService automatically gets:
 *
 *     on()
 *     once()
 *     emit()
 *     off()
 *     removeAllListeners()
 *     listenerCount()
 *
 * ============================================================
 */

class UserService extends EventEmitter {
  /*
   * ----------------------------------------------------------
   * Constructor
   * ----------------------------------------------------------
   */

  constructor() {
    super();

    /*
     * `super()` calls the EventEmitter constructor.
     *
     * It must be called before using `this`.
     */

    this.users = [];
  }

  /*
   * ----------------------------------------------------------
   * Create user
   * ----------------------------------------------------------
   */

  createUser(name, email) {
    const user = {
      id: this.users.length + 1,

      name,

      email,

      createdAt: new Date(),
    };

    /*
     * Store user.
     */

    this.users.push(user);

    /*
     * Emit custom event.
     *
     * Event name:
     *
     *     user.created
     *
     *
     * Event payload:
     *
     *     user
     */

    this.emit("user.created", user);

    /*
     * Return the created user.
     */

    return user;
  }

  /*
   * ----------------------------------------------------------
   * Delete user
   * ----------------------------------------------------------
   */

  deleteUser(userId) {
    const index = this.users.findIndex((user) => user.id === userId);

    /*
     * User not found.
     */

    if (index === -1) {
      this.emit("user.delete.failed", {
        userId,
        reason: "User not found",
      });

      return null;
    }

    /*
     * Remove user.
     */

    const [deletedUser] = this.users.splice(index, 1);

    /*
     * Emit custom event.
     */

    this.emit("user.deleted", deletedUser);

    return deletedUser;
  }

  /*
   * ----------------------------------------------------------
   * Get all users
   * ----------------------------------------------------------
   */

  getUsers() {
    return [...this.users];
  }
}

/*
 * ============================================================
 * 3. Create service instance
 * ============================================================
 */

const userService = new UserService();

/*
 * ============================================================
 * 4. Listen for user.created
 * ============================================================
 *
 * This listener could represent:
 *
 *     email service
 *     notification service
 *     audit logger
 *     analytics service
 *
 * ============================================================
 */

userService.on("user.created", (user) => {
  console.log("\n[EVENT] user.created");

  console.log("User:", user);
});

/*
 * ============================================================
 * 5. Another listener for the SAME event
 * ============================================================
 *
 * Multiple parts of your application can listen to the same
 * event.
 * ============================================================
 */

userService.on("user.created", (user) => {
  console.log("[EMAIL] Sending welcome email to:", user.email);
});

/*
 * ============================================================
 * 6. Analytics listener
 * ============================================================
 */

userService.on("user.created", (user) => {
  console.log("[ANALYTICS] New user:", user.id);
});

/*
 * ============================================================
 * 7. Create a user
 * ============================================================
 */

const user = userService.createUser("Shiva", "shiva@example.com");

console.log("\nCreated user:", user);

/*
 * ============================================================
 * 8. Event payload
 * ============================================================
 *
 * The second argument of emit() becomes the first argument of
 * the listener.
 *
 *
 *     emit(
 *       "user.created",
 *       user
 *     );
 *
 *
 * becomes:
 *
 *
 *     on(
 *       "user.created",
 *       (user) => {}
 *     );
 *
 * ============================================================
 */

/*
 * ============================================================
 * 9. Multiple event payload values
 * ============================================================
 *
 * You can pass multiple values.
 *
 * ============================================================
 */

userService.on("user.audit", (user, action, timestamp) => {
  console.log("\n[AUDIT]");

  console.log("User:", user.name);

  console.log("Action:", action);

  console.log("Time:", timestamp);
});

userService.emit("user.audit", user, "PROFILE_VIEWED", new Date());

/*
 * ============================================================
 * 10. Recommended event payload style
 * ============================================================
 *
 * Instead of:
 *
 *
 *     emit(
 *       "user.created",
 *       user,
 *       database,
 *       timestamp,
 *       request
 *     );
 *
 *
 * Prefer one object:
 *
 *
 *     emit(
 *       "user.created",
 *       {
 *         user,
 *         timestamp,
 *       }
 *     );
 *
 *
 * This makes the event easier to evolve.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 11. Object-based event payload
 * ============================================================
 */

userService.on("user.updated", (event) => {
  console.log("\n[USER UPDATED]");

  console.log("User:", event.user.name);

  console.log("Changed field:", event.field);

  console.log("Old value:", event.oldValue);

  console.log("New value:", event.newValue);
});

userService.emit("user.updated", {
  user,

  field: "name",

  oldValue: "Shiva",

  newValue: "Shiva Ram",

  timestamp: new Date(),
});

/*
 * ============================================================
 * 12. once() with custom events
 * ============================================================
 *
 * Useful for events that should only be handled once.
 *
 * Example:
 *
 *     application.initialized
 *
 * ============================================================
 */

userService.once("database.connected", (database) => {
  console.log("\nDatabase connected:", database);
});

userService.emit("database.connected", {
  host: "localhost",
  database: "node_mastery",
});

/*
 * This second emit will NOT call the listener.
 */

userService.emit("database.connected", {
  host: "localhost",
  database: "node_mastery",
});

/*
 * ============================================================
 * 13. Custom error event
 * ============================================================
 */

userService.on("user.delete.failed", (event) => {
  console.error("\n[DELETE FAILED]");

  console.error("User ID:", event.userId);

  console.error("Reason:", event.reason);
});

/*
 * Try deleting a user that doesn't exist.
 */

userService.deleteUser(999);

/*
 * ============================================================
 * 14. Delete an existing user
 * ============================================================
 */

const deleted = userService.deleteUser(user.id);

console.log("\nDeleted user:", deleted);

/*
 * ============================================================
 * 15. Event-driven architecture
 * ============================================================
 *
 *
 *              UserService
 *                   │
 *                   │
 *                   │ emit()
 *                   ↓
 *             EventEmitter
 *                   │
 *          ┌────────┼────────┐
 *          ↓        ↓        ↓
 *
 *       Email    Logger   Analytics
 *
 *
 * The UserService does not need to directly call:
 *
 *
 *     emailService.send()
 *     logger.log()
 *     analytics.track()
 *
 *
 * It only emits:
 *
 *
 *     user.created
 *
 *
 * Other components decide what to do.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 16. This creates loose coupling
 * ============================================================
 *
 * WITHOUT EVENTS:
 *
 *
 *     UserService
 *         │
 *         ├──> EmailService
 *         ├──> NotificationService
 *         ├──> AnalyticsService
 *         └──> Logger
 *
 *
 * UserService knows everything.
 *
 *
 * WITH EVENTS:
 *
 *
 *     UserService
 *          │
 *          ↓
 *     "user.created"
 *          │
 *     ┌────┼─────┐
 *     ↓    ↓     ↓
 *   Email Logger Analytics
 *
 *
 * UserService only knows that an event occurred.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 17. Event names as constants
 * ============================================================
 *
 * For larger applications, avoid repeating string literals
 * everywhere.
 *
 * ============================================================
 */

const EVENTS = {
  USER_CREATED: "user.created",

  USER_DELETED: "user.deleted",

  USER_UPDATED: "user.updated",

  USER_DELETE_FAILED: "user.delete.failed",
};

/*
 * ============================================================
 * 18. Using event constants
 * ============================================================
 */

const orderEmitter = new EventEmitter();

orderEmitter.on("order.created", (order) => {
  console.log("\nOrder created:", order);
});

orderEmitter.emit("order.created", {
  id: 101,

  amount: 500,

  status: "pending",
});

/*
 * ============================================================
 * 19. Practical OrderService example
 * ============================================================
 */

class OrderService extends EventEmitter {
  createOrder(userId, amount) {
    const order = {
      id: Date.now(),

      userId,

      amount,

      status: "created",
    };

    this.emit("order.created", {
      order,
      timestamp: new Date(),
    });

    return order;
  }

  payOrder(order) {
    order.status = "paid";

    this.emit("order.paid", {
      order,
      timestamp: new Date(),
    });

    return order;
  }
}

/*
 * ============================================================
 * 20. Create OrderService
 * ============================================================
 */

const orderService = new OrderService();

/*
 * ============================================================
 * 21. Order created listener
 * ============================================================
 */

orderService.on("order.created", (event) => {
  console.log("\n[ORDER CREATED]", event.order);
});

/*
 * ============================================================
 * 22. Order paid listener
 * ============================================================
 */

orderService.on("order.paid", (event) => {
  console.log("\n[ORDER PAID]", event.order);
});

/*
 * ============================================================
 * 23. Create an order
 * ============================================================
 */

const order = orderService.createOrder(1, 999);

/*
 * ============================================================
 * 24. Pay the order
 * ============================================================
 */

orderService.payOrder(order);

/*
 * ============================================================
 * 25. Event listener lifecycle
 * ============================================================
 *
 *
 * REGISTER
 *
 *     on()
 *
 *         ↓
 *
 *     LISTENER
 *
 *         ↓
 *
 * EMIT
 *
 *         ↓
 *
 *     LISTENER EXECUTES
 *
 *         ↓
 *
 * REMOVE
 *
 *     off()
 *
 * ============================================================
 */

/*
 * ============================================================
 * 26. Removing a custom event listener
 * ============================================================
 */

function handleOrderCreated(event) {
  console.log("Temporary order listener:", event.order.id);
}

orderService.on("order.created", handleOrderCreated);

/*
 * Listener is active.
 */

const anotherOrder = orderService.createOrder(2, 1500);

/*
 * Remove listener.
 */

orderService.off("order.created", handleOrderCreated);

/*
 * Listener no longer executes.
 */

orderService.createOrder(3, 2000);

/*
 * ============================================================
 * 27. Custom events in backend applications
 * ============================================================
 *
 * Example:
 *
 *
 * User registers
 *
 *     ↓
 *
 * UserService
 *
 *     ↓
 *
 * emit("user.created")
 *
 *     ↓
 *
 * ┌──────────────┬──────────────┬──────────────┐
 * ↓              ↓              ↓
 *
 * Email       Audit Log      Analytics
 *
 *
 * This pattern is useful for internal application events.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 28. EventEmitter is NOT distributed
 * ============================================================
 *
 * Important:
 *
 * EventEmitter works inside the current Node.js process.
 *
 *
 * If you have:
 *
 *
 *     Node Process A
 *     Node Process B
 *
 *
 * an EventEmitter event from A does not automatically reach B.
 *
 *
 * For distributed communication, use technologies such as:
 *
 *
 *     Redis Pub/Sub
 *     Kafka
 *     RabbitMQ
 *
 *
 * These will be covered later in this Node.js mastery path.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 29. EventEmitter vs direct function call
 * ============================================================
 *
 *
 * Direct:
 *
 *
 *     userService.createUser();
 *
 *          ↓
 *
 *     emailService.send();
 *
 *
 * Tight coupling.
 *
 *
 * Event-driven:
 *
 *
 *     userService.createUser();
 *
 *          ↓
 *
 *     emit("user.created")
 *
 *          ↓
 *
 *     listeners
 *
 *
 * Loose coupling.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 30. Important design rule
 * ============================================================
 *
 * Events should describe something that HAS HAPPENED.
 *
 *
 * Good:
 *
 *
 *     user.created
 *     order.paid
 *     payment.completed
 *     file.uploaded
 *
 *
 * These describe facts.
 *
 *
 * Be careful with command-like names:
 *
 *
 *     send.email
 *     create.user
 *
 *
 * Those sound more like instructions than events.
 *
 * ============================================================
 */

/*
 * ============================================================
 * 31. FINAL CHEAT SHEET
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
 * Extend:
 *
 *     class Service
 *       extends EventEmitter {
 *
 *     }
 *
 *
 * Constructor:
 *
 *     constructor() {
 *
 *       super();
 *
 *     }
 *
 *
 * Register:
 *
 *     service.on(
 *       "user.created",
 *       handler
 *     );
 *
 *
 * Emit:
 *
 *     this.emit(
 *       "user.created",
 *       {
 *         user
 *       }
 *     );
 *
 *
 * Once:
 *
 *     service.once(
 *       "event",
 *       handler
 *     );
 *
 *
 * Remove:
 *
 *     service.off(
 *       "event",
 *       handler
 *     );
 *
 *
 * ============================================================
 *
 * KEY IDEA:
 *
 *     Custom Event
 *         ↓
 *     EventEmitter
 *         ↓
 *     emit()
 *         ↓
 *     registered listeners
 *
 *
 * EventEmitter is excellent for communication between
 * components INSIDE the same Node.js process.
 *
 * ============================================================
 */
