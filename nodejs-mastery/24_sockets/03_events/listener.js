/**
 * ============================================================
 * 03_events/listener.js
 * ============================================================
 *
 * SOCKET.IO EVENT LISTENERS
 *
 * Topics:
 *
 * 1. socket.on()
 * 2. socket.once()
 * 3. socket.off()
 * 4. socket.removeListener()
 * 5. socket.removeAllListeners()
 * 6. Event names
 * 7. Event arguments
 * 8. Multiple arguments
 * 9. Object payloads
 * 10. Multiple listeners
 * 11. Listener execution order
 * 12. Named handlers
 * 13. Anonymous handlers
 * 14. Removing listeners
 * 15. once() lifecycle
 * 16. Acknowledgements
 * 17. Async listeners
 * 18. Listener errors
 * 19. Listener cleanup
 * 20. Avoiding listener leaks
 * 21. Server listeners
 * 22. Client listeners
 *
 * ============================================================
 */

import http from "node:http";

import express from "express";

import { Server } from "socket.io";

/*
 * ============================================================
 * APPLICATION
 * ============================================================
 */

const app = express();

/*
 * ============================================================
 * HTTP SERVER
 * ============================================================
 */

const httpServer = http.createServer(app);

/*
 * ============================================================
 * SOCKET.IO
 * ============================================================
 */

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

/*
 * ============================================================
 * EVENT CONSTANTS
 * ============================================================
 *
 * Centralizing event names prevents spelling mistakes.
 * ============================================================
 */

const EVENTS = {
  MESSAGE: "message",

  USER_CREATED: "user:created",

  USER_UPDATED: "user:updated",

  NOTIFICATION: "notification",

  PING: "ping",

  TEST: "test",
};

/*
 * ============================================================
 * SERVER CONNECTION
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  /*
   * ========================================================
   * 1. BASIC `on()`
   * ========================================================
   *
   * socket.on(event, listener)
   *
   * Parameters:
   *
   * event:
   *     Event name.
   *
   * listener:
   *     Function called when event is received.
   *
   * ========================================================
   */

  socket.on(EVENTS.MESSAGE, (data) => {
    console.log("Message received:", data);
  });

  /*
   * ========================================================
   * 2. EVENT WITH MULTIPLE PARAMETERS
   * ========================================================
   */

  socket.on("user:data", (userId, name, age, active) => {
    console.log("User ID:", userId);

    console.log("Name:", name);

    console.log("Age:", age);

    console.log("Active:", active);
  });

  /*
   * ========================================================
   * 3. OBJECT PAYLOAD
   * ========================================================
   *
   * Recommended for most application events.
   * ========================================================
   */

  socket.on(EVENTS.USER_CREATED, (user) => {
    console.log("User created:", user);
  });

  /*
   * ========================================================
   * 4. NESTED PAYLOAD
   * ========================================================
   */

  socket.on("order:created", (payload) => {
    console.log("Order ID:", payload.order.id);

    console.log("Customer:", payload.order.customer.name);

    console.log("Items:", payload.order.items);
  });

  /*
   * ========================================================
   * 5. NAMED LISTENER
   * ========================================================
   *
   * Named functions are important when you need to remove
   * the listener later.
   * ========================================================
   */

  function handleNotification(notification) {
    console.log("Notification:", notification);
  }

  socket.on(EVENTS.NOTIFICATION, handleNotification);

  /*
   * ========================================================
   * 6. REMOVE A SPECIFIC LISTENER
   * ========================================================
   *
   * off(event, listener)
   *
   * The exact same function reference must be supplied.
   * ========================================================
   */

  function removeNotificationListener() {
    socket.off(EVENTS.NOTIFICATION, handleNotification);
  }

  /*
   * ========================================================
   * 7. `removeListener()`
   * ========================================================
   *
   * Alias-style API for removing a specific listener.
   * ========================================================
   */

  function removeNotificationListenerAlternative() {
    socket.removeListener(EVENTS.NOTIFICATION, handleNotification);
  }

  /*
   * ========================================================
   * 8. `once()`
   * ========================================================
   *
   * The listener runs only ONE time.
   *
   * ========================================================
   */

  socket.once(EVENTS.PING, (data) => {
    console.log("PING received once:", data);
  });

  /*
   * ========================================================
   * 9. ON vs ONCE
   * ========================================================
   *
   * on():
   *
   *     Runs every time.
   *
   * once():
   *
   *     Runs only once.
   *
   * ========================================================
   */

  socket.on("repeated", (data) => {
    console.log("This can run many times:", data);
  });

  socket.once("one-time", (data) => {
    console.log("This runs once:", data);
  });

  /*
   * ========================================================
   * 10. MULTIPLE LISTENERS FOR SAME EVENT
   * ========================================================
   */

  function firstMessageHandler(data) {
    console.log("First listener:", data);
  }

  function secondMessageHandler(data) {
    console.log("Second listener:", data);
  }

  socket.on(EVENTS.TEST, firstMessageHandler);

  socket.on(EVENTS.TEST, secondMessageHandler);

  /*
   * Both listeners execute when TEST occurs.
   *
   * Generally they execute in registration order.
   */

  /*
   * ========================================================
   * 11. ASYNC LISTENER
   * ========================================================
   */

  socket.on("database:request", async (data) => {
    try {
      console.log("Received database request:", data);

      /*
       * Simulate asynchronous work.
       */

      const result = await fakeDatabaseOperation(data);

      console.log("Database result:", result);
    } catch (error) {
      console.error("Async listener error:", error);
    }
  });

  /*
   * ========================================================
   * 12. ASYNC LISTENER WITH ACKNOWLEDGEMENT
   * ========================================================
   */

  socket.on("user:create", async (data, acknowledge) => {
    try {
      /*
       * Validate.
       */

      if (!data?.name) {
        acknowledge?.({
          success: false,

          error: {
            code: "VALIDATION_ERROR",

            message: "name is required",
          },
        });

        return;
      }

      /*
       * Perform asynchronous operation.
       */

      const user = await fakeCreateUser(data);

      /*
       * Return result to sender.
       */

      acknowledge?.({
        success: true,

        data: user,
      });
    } catch (error) {
      console.error("User creation failed:", error);

      acknowledge?.({
        success: false,

        error: {
          code: "INTERNAL_ERROR",

          message: "Failed to create user",
        },
      });
    }
  });

  /*
   * ========================================================
   * 13. LISTENER WITH REST PARAMETERS
   * ========================================================
   *
   * Useful when an event can contain multiple values.
   * ========================================================
   */

  socket.on("values", (...values) => {
    console.log("Received values:", values);
  });

  /*
   * ========================================================
   * 14. EVENT LISTENER INSPECTION
   * ========================================================
   *
   * Useful for debugging listener registration.
   * ========================================================
   */

  console.log("Message listeners:", socket.listeners(EVENTS.MESSAGE));

  console.log("Message listener count:", socket.listenerCount(EVENTS.MESSAGE));

  /*
   * ========================================================
   * 15. REMOVE SPECIFIC LISTENER
   * ========================================================
   *
   * Do NOT do this:
   *
   *     socket.off(
   *       "test",
   *       () => {}
   *     );
   *
   * because this is a different function reference.
   *
   * ========================================================
   */

  socket.off(EVENTS.TEST, firstMessageHandler);

  /*
   * secondMessageHandler still exists.
   */

  /*
   * ========================================================
   * 16. REMOVE ALL LISTENERS FOR ONE EVENT
   * ========================================================
   */

  function removeAllTestListeners() {
    socket.removeAllListeners(EVENTS.TEST);
  }

  /*
   * ========================================================
   * 17. REMOVE ALL SOCKET LISTENERS
   * ========================================================
   *
   * Dangerous in shared application code.
   *
   * Only use this when you own all listeners.
   * ========================================================
   */

  function removeAllSocketListeners() {
    socket.removeAllListeners();
  }

  /*
   * ========================================================
   * 18. DISCONNECT CLEANUP
   * ========================================================
   */

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", socket.id, reason);

    /*
     * Remove application-specific listeners if necessary.
     */

    socket.off(EVENTS.NOTIFICATION, handleNotification);
  });

  /*
   * ========================================================
   * 19. DEMONSTRATION FUNCTIONS
   * ========================================================
   */

  // removeNotificationListener();

  // removeNotificationListenerAlternative();

  // removeAllTestListeners();

  // removeAllSocketListeners();
});

/*
 * ============================================================
 * FAKE DATABASE OPERATION
 * ============================================================
 */

async function fakeDatabaseOperation(data) {
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });

  return {
    received: data,

    processed: true,
  };
}

/*
 * ============================================================
 * FAKE USER CREATION
 * ============================================================
 */

async function fakeCreateUser(data) {
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });

  return {
    id: crypto.randomUUID(),

    name: data.name,

    createdAt: new Date().toISOString(),
  };
}

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

httpServer.listen(3000, () => {
  console.log("Socket.IO server running on port 3000");
});
