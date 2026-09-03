/**
 * ============================================================
 * Socket ID
 * ============================================================
 */

import { Server } from "socket.io";

const io = new Server(3001, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected");

  console.log("Socket ID:", socket.id);
});
