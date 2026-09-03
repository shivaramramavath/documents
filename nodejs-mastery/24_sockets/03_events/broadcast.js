/**
 * ============================================================
 * 03_events/broadcast.js
 * ============================================================
 *
 * SOCKET.IO BROADCASTING & TARGETING
 *
 * Topics:
 *
 * 1. socket.emit()
 * 2. io.emit()
 * 3. socket.broadcast.emit()
 * 4. io.to(room).emit()
 * 5. socket.to(room).emit()
 * 6. socket.broadcast.to(room).emit()
 * 7. io.except(room).emit()
 * 8. Targeting a socket ID
 * 9. Targeting multiple socket IDs
 * 10. Targeting multiple rooms
 * 11. Room union behavior
 * 12. Sender exclusion
 * 13. Namespace + room targeting
 * 14. Broadcast acknowledgement
 * 15. Practical chat example
 * 16. Common mistakes
 *
 * ============================================================
 */

import http from "node:http";

import express from "express";

import { Server } from "socket.io";

/*
 * ============================================================
 * EXPRESS
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
 * SOCKET.IO SERVER
 * ============================================================
 */

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

/*
 * ============================================================
 * EVENT NAMES
 * ============================================================
 */

const EVENTS = {
  PRIVATE: "private:message",

  BROADCAST: "broadcast:message",

  ROOM: "room:message",

  USER_JOINED: "user:joined",

  CHAT: "chat:message",
};

/*
 * ============================================================
 * CONNECTION
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  /*
   * ========================================================
   * 1. socket.emit()
   * ========================================================
   *
   * ONLY the current socket receives the event.
   *
   * Current socket = A
   *
   * A -> receives
   * B -> no
   * C -> no
   *
   * ========================================================
   */

  socket.emit("private:welcome", {
    message: "Only you receive this",
  });

  /*
   * ========================================================
   * 2. io.emit()
   * ========================================================
   *
   * EVERY socket in the namespace receives the event.
   *
   * A -> receives
   * B -> receives
   * C -> receives
   *
   * ========================================================
   */

  io.emit(EVENTS.BROADCAST, {
    message: "Everyone receives this",
  });

  /*
   * ========================================================
   * 3. socket.broadcast.emit()
   * ========================================================
   *
   * EVERY socket EXCEPT the current socket.
   *
   * A -> NO
   * B -> YES
   * C -> YES
   *
   * ========================================================
   */

  socket.broadcast.emit(EVENTS.USER_JOINED, {
    socketId: socket.id,
  });

  /*
   * ========================================================
   * 4. JOIN ROOMS
   * ========================================================
   */

  socket.join("room:general");

  socket.join("room:developers");

  /*
   * ========================================================
   * 5. io.to(room).emit()
   * ========================================================
   *
   * EVERYONE in the room receives the event.
   *
   * The sender DOES receive it if the sender is in the room.
   *
   * ========================================================
   */

  io.to("room:general").emit(EVENTS.ROOM, {
    room: "room:general",

    message: "Everyone in general receives this",
  });

  /*
   * ========================================================
   * 6. socket.to(room).emit()
   * ========================================================
   *
   * Everyone in the room EXCEPT the current socket.
   *
   * ========================================================
   */

  socket.to("room:general").emit(EVENTS.ROOM, {
    room: "room:general",

    message: "Everyone except sender",
  });

  /*
   * ========================================================
   * 7. socket.broadcast.to(room).emit()
   * ========================================================
   *
   * Also targets the room while excluding current socket.
   *
   * ========================================================
   */

  socket.broadcast.to("room:general").emit("room:broadcast", {
    message: "Room members except sender",
  });

  /*
   * ========================================================
   * 8. io.except(room).emit()
   * ========================================================
   *
   * Sends to everyone EXCEPT sockets in the room.
   *
   * ========================================================
   */

  io.except("room:general").emit("outside:room", {
    message: "Users outside general room",
  });

  /*
   * ========================================================
   * 9. TARGET A SPECIFIC SOCKET ID
   * ========================================================
   *
   * Every socket automatically has a room whose name is
   * its own socket.id.
   *
   * Therefore:
   *
   *     io.to(socketId).emit(...)
   *
   * can target one socket.
   * ========================================================
   */

  function sendToSocket(socketId, data) {
    io.to(socketId).emit(EVENTS.PRIVATE, data);
  }

  /*
   * ========================================================
   * Example:
   * ========================================================
   */

  sendToSocket(socket.id, {
    message: "Private message",
  });

  /*
   * ========================================================
   * 10. TARGET MULTIPLE SOCKETS
   * ========================================================
   */

  function sendToSockets(socketIds, data) {
    io.to(socketIds).emit(EVENTS.PRIVATE, data);
  }

  sendToSockets([socket.id, "another-socket-id"], {
    message: "Message to selected sockets",
  });

  /*
   * ========================================================
   * 11. MULTIPLE ROOMS
   * ========================================================
   *
   * io.to(roomA).to(roomB)
   *
   * Targets sockets in room A OR room B.
   *
   * It does NOT require a socket to be in both.
   * ========================================================
   */

  io.to("room:general").to("room:developers").emit("multiple:rooms", {
    message: "Users in either room",
  });

  /*
   * ========================================================
   * 12. MULTIPLE ROOM ARRAY
   * ========================================================
   */

  io.to(["room:general", "room:developers"]).emit("multiple:rooms:array", {
    message: "Users in selected rooms",
  });

  /*
   * ========================================================
   * 13. ROOM + EXCLUSION
   * ========================================================
   *
   * Send to a room while excluding another room.
   * ========================================================
   */

  io.to("room:developers").except("room:banned").emit("developers:message", {
    message: "Developers except banned users",
  });

  /*
   * ========================================================
   * 14. CHAT EXAMPLE
   * ========================================================
   */

  socket.on(EVENTS.CHAT, (data) => {
    const { room, message } = data;

    /*
     * Broadcast to everyone in the room EXCEPT sender.
     */

    socket.to(room).emit(EVENTS.CHAT, {
      sender: socket.id,

      message,

      room,

      timestamp: Date.now(),
    });

    /*
     * If the sender also needs confirmation,
     * send separately.
     */

    socket.emit("chat:sent", {
      success: true,

      room,

      message,
    });
  });

  /*
   * ========================================================
   * 15. BROADCAST ACKNOWLEDGEMENT
   * ========================================================
   *
   * Modern Socket.IO supports acknowledgements for
   * broadcast-style emissions.
   *
   * The callback receives responses from matching clients.
   * ========================================================
   */

  socket.on("request:clients", async (data, acknowledge) => {
    try {
      const responses = await io
        .timeout(5_000)
        .emitWithAck("request:status", data);

      acknowledge?.({
        success: true,

        responses,
      });
    } catch (error) {
      acknowledge?.({
        success: false,

        error: {
          code: "ACK_TIMEOUT",

          message: "One or more clients did not acknowledge",
        },
      });
    }
  });

  /*
   * ========================================================
   * 16. DISCONNECT
   * ========================================================
   */

  socket.on("disconnect", (reason) => {
    console.log("Disconnected:", socket.id, reason);
  });
});

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

httpServer.listen(3000, () => {
  console.log("Socket.IO server running on port 3000");
});
