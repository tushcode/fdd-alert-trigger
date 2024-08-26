import WebSocket, { WebSocketServer } from "ws";

const port = process.env.PORT || 8080; // Default to 8080 if PORT is not set
const wss = new WebSocketServer({ port });

/**
 * @type { Set<WebSocket> } clients - Set of connected clients.
 */
const clients = new Set();

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    try {
      const data = JSON.parse(message);
      console.log("websocket-action", data);

      // Add client to set if not already present
      clients.add(ws);

      // Broadcast the message to all connected clients (including the sender)
      const broadcastMessage = (message) => {
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
      };

      broadcastMessage(data);
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", function close() {
    clients.delete(ws); // Remove the client from the set
    console.log("Client disconnected");
  });
});

console.log(`WebSocket server running on ws://localhost:${port}`);
