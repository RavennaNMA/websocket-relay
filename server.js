const WebSocket = require("ws");

// 用 process.env.PORT 讓 Railway 指定 port，不可寫死 8080！
const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

let esp32Socket = null;

wss.on("connection", function connection(ws) {
  console.log("🔌 有新連線");

  ws.on("message", function incoming(message) {
    const msg = message.toString();
    console.log("📩 收到訊息:", msg);

    if (msg === "esp32") {
      esp32Socket = ws;
      console.log("✅ ESP32 已註冊");
    }

    if (msg === "move") {
      console.log("🎮 Controller 傳來 move 指令");

      if (esp32Socket && esp32Socket.readyState === WebSocket.OPEN) {
        esp32Socket.send("move");
        console.log("➡️ move 指令已轉給 ESP32");
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
