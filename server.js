import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: process.env.PORT });

/**
 * @type { WebSocket[]} clients - List of Clients, keyed by an identifier.
 */
const clients = [];

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    const data = JSON.parse(message);

    console.log("websocket-action", data);

    // Add client to list if not already present
    if (!clients.includes(ws)) {
      clients.push(ws);
    }

    // Broadcast the message to all connected clients (including the sender)
    const broadcastMessage = (message) => {
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    };

    broadcastMessage(data);
  });

  ws.on("close", function close() {
    const diconnectedClient = clients.find((client) => client === ws);
  });
});

console.log("WebSocket server running on ws://localhost:8080");
