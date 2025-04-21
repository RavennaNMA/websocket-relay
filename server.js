const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

let esp32Socket = null;

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    const msg = message.toString();
    console.log("收到:", msg);

    // 確認身份：esp32 or controller
    if (msg === "esp32") {
      esp32Socket = ws;
      console.log("✅ ESP32 連接成功");
    }

    // Controller 傳送 "move"
    if (msg === "move") {
      console.log("📨 來自 Controller 的 move 指令");

      if (esp32Socket && esp32Socket.readyState === WebSocket.OPEN) {
        esp32Socket.send("move");
        console.log("➡️ 已轉發給 ESP32");
      } else {
        console.log("⚠️ ESP32 尚未連線或已中斷");
      }
    }
  });

  ws.on("close", () => {
    if (ws === esp32Socket) {
      console.log("❌ ESP32 離線");
      esp32Socket = null;
    }
  });
});
