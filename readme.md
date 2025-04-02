# Simple Centralized Slack Alert System

A lightweight, centralized alerting system that uses WebSockets to send alerts to Slack in real time.

## Features 🚀

- WebSocket-based alert system
- Centralized alert handling
- Slack Integration via Webhooks
- Customizable Alert Types (success, warning, error)

## How It Works ⚙️

- Clients send alerts via WebSocket.
- The server processes the alert and forwards it to Slack.
- Alerts are color-coded based on type.
- WebSocket connection is closed after sending the aler

## Installation 🛠️

### 1: Clone the repository

### 2: Install dependencies:

```sh
npm install
```

### 3: Set up environment variables:

Create a .env file in the project root and add:

```sh
SLACK_WEBHOOK_URL="slack_webhook_url_here"
PORT=3000
DUPLICATE_WAIT_TIME=30000 # Wait 30 sec to send next duplicate alert
```

## Usage 🚦

### Start the WebSocket Server

```sh
node slack_alert_server.js
```

Server runs on `ws://localhost:3000` by default.

### Send an Alert (Client-side Example)

```js
const WebSocket = require("ws");
const socket = new WebSocket("ws://localhost:3000");

const alertMessage = {
  message: "System warning detected!",
  type: "warning", // success, warning, error
  details: "High CPU usage on Server A",
};

socket.on("open", () => {
  console.log("Connected to WebSocket server");
  socket.send(JSON.stringify(alertMessage));
  socket.close();
});
```

### API Payload Example 📩

```json
{
  "message": "Server is down!",
  "type": "error",
  "details": "Database connection lost"
}
```

### Test Client 🧪

To test the server, you can run the provided `test_client.js` script:

```sh
node test_client.js
```

This script connects to the WebSocket server, sends a test alert, and then disconnects automatically.

---

## Images
### Success
![Success](https://github.com/febeeh/simple-centralized-slack-alert-system/blob/main/images/success.jpg)
### Warning
![Warning](https://github.com/febeeh/simple-centralized-slack-alert-system/blob/main/images/warning.jpg)
### Error
![Error](https://github.com/febeeh/simple-centralized-slack-alert-system/blob/main/images/error.jpg)

---
Done
