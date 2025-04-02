// Description: A simple WebSocket server that listens for incoming messages and sends alerts to Slack using a webhook.
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { IncomingWebhook } = require("@slack/webhook");

// Load environment variables from .env file
require("dotenv").config();

// Create a set to keep track of recent alerts to avoid duplicates
const recentAlerts = new Set();

// Create an Express app
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const duplicateWaitTime = parseInt(process.env.DUPLICATE_WAIT_TIME, 10) || 3000; // Default to 30 seconds if not set
// Set up WebSocket server
const wss = new WebSocket.Server({ server });

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL; // Slack Webhook URL from .env file

// Validate Slack Webhook URL
if (!SLACK_WEBHOOK_URL) {
  console.error("ERROR: SLACK_WEBHOOK_URL is not defined in .env");
  process.exit(1);
}

// Initialize the Slack webhook
const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

// Color mappings based on alert type
let color = { success: "good", warning: "#f39c12", error: "danger" };

// Function to send alert to Slack
const sendSlackAlert = async (message) => {
  try {
    await webhook.send({
      text: message.message,
      attachments: [
        {
          color: color[message.type] || "good",
          fields: [
            {
              title: "Date",
              value: new Date().toLocaleString(),
              short: true,
            },
            {
              title: "Type",
              value: capitalizeFirstLetter(message.type) || "Success",
              short: true,
            },
            {
              title: "Details",
              value: message.details || "Empty Details",
            },
          ],
        },
      ],
    });
    console.log("Alert sent to Slack");
  } catch (err) {
    console.error("Error sending message to Slack:", err);
  }
};

const isDuplicateAlert = (message) => {
  const alertKey = `${message.type}:${message.details}`;

  if (recentAlerts.has(alertKey)) {
    return true; // Duplicate detected
  }

  recentAlerts.add(alertKey);
  setTimeout(() => recentAlerts.delete(alertKey), duplicateWaitTime); // Remove after the wait time
  return false;
};

// Set up WebSocket connections and event handling
wss.on("connection", (ws) => {
  // Listen for incoming messages from clients
  ws.on("message", async (message) => {
    try {
      // Parse the message and send it to Slack
      const parsedMessage = JSON.parse(message);

      // check if type is valid
      if (!["success", "warning", "error"].includes(parsedMessage.type)) {
        ws.send("Invalid alert type. Must be one of: success, warning, error");
        return;
      }
      // Check if the message is a duplicate
      if (isDuplicateAlert(message)) {
        ws.send("Duplicate alert detected. Not sent to Slack.");
        return;
      }
      // Check if the message has the required fields
      await sendSlackAlert(parsedMessage);
      ws.send("Alert received by server and sent to Slack");
    } catch (err) {
      console.error("Error parsing message:", err);
      ws.send("Error processing alert message");
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
