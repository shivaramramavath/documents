/**
 * Client code is normally executed separately.
 *
 * Example:
 */

import { io as createClient } from "socket.io-client";

const socket = createClient("http://localhost:3001");

socket.on("connect", () => {
  console.log("Client connected");

  console.log("Client socket ID:", socket.id);
});
