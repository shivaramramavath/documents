/**
 * ============================================================
 * Socket Lifecycle
 * ============================================================
 *
 * CONNECT
 *   ↓
 * AUTHENTICATION
 *   ↓
 * CONNECTION ESTABLISHED
 *   ↓
 * EVENTS
 *   ↓
 * DISCONNECT
 */

import { Server } from "socket.io";

const io = new Server(3001, {
  cors: {
    origin: "*",
  },
});

/*
 * ============================================================
 * CONNECTION
 * ============================================================
 */

io.on("connection", (socket) => {
  console.log("CONNECTED:", socket.id);

  /*
   * ========================================================
   * SOCKET INFORMATION
   * ========================================================
   */

  console.log("Socket ID:", socket.id);

  console.log("Transport:", socket.conn.transport.name);

  /*
   * ========================================================
   * DISCONNECT
   * ========================================================
   */

  socket.on("disconnect", (reason) => {
    console.log("DISCONNECTED:", socket.id);

    console.log("Reason:", reason);
  });
});
