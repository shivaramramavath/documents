/**
 * ============================================================
 * HTTP vs WebSocket
 * ============================================================
 *
 * HTTP:
 *   Client -> Request -> Server
 *   Client <- Response <- Server
 *
 * WebSocket:
 *   Client <==========> Server
 *             persistent connection
 *
 * Socket.IO:
 *   A higher-level real-time communication library that uses
 *   Engine.IO underneath and provides events, reconnection,
 *   rooms, acknowledgements, namespaces, etc.
 * ============================================================
 */

/*
 * ============================================================
 * 1. HTTP REQUEST / RESPONSE
 * ============================================================
 *
 * HTTP is primarily request/response based.
 *
 * Client asks:
 *
 *   GET /users
 *
 * Server responds:
 *
 *   200 OK
 *   [...]
 *
 * If the server later has new information, the client normally
 * needs another mechanism/request to receive it.
 */

async function httpExample() {
  const response = await fetch("http://localhost:3000/users");

  const users = await response.json();

  console.log("HTTP response:", users);
}

/*
 * ============================================================
 * 2. WEBSOCKET
 * ============================================================
 *
 * WebSocket establishes a persistent connection.
 *
 * After the connection is established:
 *
 * Client <=================> Server
 *
 * Either side can send data.
 *
 * Example:
 *
 * Client -> "Hello"
 * Server -> "Hi"
 * Server -> "New notification"
 * Client -> "Message received"
 *
 * The server doesn't need to wait for a new HTTP request
 * for every message.
 */

/*
 * Browser example:
 *
 * const ws = new WebSocket(
 *   "ws://localhost:8080",
 * );
 *
 * ws.onopen = () => {
 *   ws.send("Hello server");
 * };
 *
 * ws.onmessage = (event) => {
 *   console.log(event.data);
 * };
 */

/*
 * ============================================================
 * 3. SOCKET.IO
 * ============================================================
 *
 * Socket.IO gives us a higher-level API.
 *
 * Instead of manually dealing with raw WebSocket messages:
 *
 *   "message"
 *
 * we can define application events:
 *
 *   "message:send"
 *   "message:created"
 *   "user:online"
 *   "typing:start"
 *
 * Example:
 *
 * socket.emit(
 *   "message:send",
 *   {
 *     content: "Hello",
 *   },
 * );
 *
 *
 * socket.on(
 *   "message:created",
 *   (message) => {
 *     console.log(message);
 *   },
 * );
 */

/*
 * ============================================================
 * IMPORTANT
 * ============================================================
 *
 * Socket.IO is NOT simply WebSocket.
 *
 * Socket.IO provides:
 *
 *   - event-based communication
 *   - automatic reconnection
 *   - acknowledgements
 *   - rooms
 *   - namespaces
 *   - middleware
 *   - broadcasting
 *   - adapters
 *   - fallbacks/transports
 *
 * WebSocket is a lower-level communication protocol.
 */

/*
 * Run this file:
 *
 *   node http-vs-websocket.js
 *
 * This file is mainly educational.
 */

console.log("HTTP  = request / response");

console.log("WebSocket = persistent bidirectional connection");

console.log("Socket.IO = higher-level real-time communication framework");
