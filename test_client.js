// This is a simple WebSocket client that connects to the server and sends a test alert message.

const WebSocket = require("ws");

// Connect to the WebSocket server
const socket = new WebSocket("ws://localhost:3000");

// Define the message to send (this is a sample alert message)
const alertMessage = {
  message: "Service failure!",
  type: "error",
  details: "Database connection lost on Server B.",
};

// When the WebSocket connection is open, send the message
socket.on("open", () => {
  console.log("Connected to WebSocket server");

  // Send the alert message to the server
  socket.send(JSON.stringify(alertMessage), (err) => {
    if (err) {
      console.error("Error sending message:", err);
      return;
    }
    console.log("Alert message sent:", alertMessage);
    socket.close(); // Close the connection after sending the message
  });
});

// When the WebSocket receives a message (response from the server)
socket.on("message", (data) => {
  console.log("Server response:", data.toString());
});

// Handle WebSocket errors
socket.on("error", (error) => {
  console.error("WebSocket error:", error);
});

// Handle WebSocket close event
socket.on("close", () => {
  console.log("Disconnected from WebSocket server");
});
