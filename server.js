import WebSocket, { WebSocketServer } from "ws";

const port = process.env.PORT || 8080; // Default to 8080 if PORT is not set
const wss = new WebSocketServer({ port });

/**
 * @type { Map<string, WebSocket> } clients - Map of connected clients with device ID as key.
 */
const clients = new Map();

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    try {
      const data = JSON.parse(message);
      console.log("websocket-action", data);

      // Assuming the first message from the client contains the device ID
      if (data.deviceId) {
        clients.set(data.deviceId, ws);
        console.log(`Device ID ${data.deviceId} connected`);
      }

      // Function to send a message to a specific device by device ID
      const sendToDevice = (deviceId, message) => {
        const client = clients.get(deviceId);
        if (client && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      };

      // Example: Send a message to a specific device
      if (data.targetDeviceId && data.message) {
        sendToDevice(data.targetDeviceId, data.message);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", function close() {
    // Remove the client from the map
    for (let [deviceId, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(deviceId);
        console.log(`Device ID ${deviceId} disconnected`);
        break;
      }
    }
  });
});

console.log(`WebSocket server running on ws://localhost:${port}`);
