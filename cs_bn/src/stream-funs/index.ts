import { client as WebSocketClient } from "websocket";
import { authenticateWS } from "../config/auth.config";

export const connectStream = () => {
  var client = new WebSocketClient();

  //? Uses the following example https://www.npmjs.com/package/websocket
  client.on("connectFailed", function (error) {
    console.log("Connect Error: " + error.toString());
  });

  client.on("connect", function (connection) {
    console.log("WebSocket Client Connected");
    connection.on("error", function (error) {
      console.log("Connection Error: " + error.toString());
    });
    connection.on("close", function () {
      console.log("echo-protocol Connection Closed");
    });
    connection.on("message", function (message) {
      if (message.type === "utf8") {
        console.log("Received: '" + message.utf8Data + "'");
      }
    });
    function authenticate() {
      console.log("🔒 Authenticating");

      if (connection.connected) {
        const authConfig: authenticateWS = {
          action: "auth",
          key: process.env.APIKEY,
          secret: process.env.APISECRET,
        };
        connection.send(JSON.stringify(authConfig));
      }
    }
    authenticate();
  });

  client.connect(
    "wss://stream.data.alpaca.markets/v1beta2/crypto?exchanges=CBSE"
  );
};
