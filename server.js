const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

let esp32Socket = null;

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    if (message.toString() === 'esp32') {
      esp32Socket = ws;
    } else if (message.toString() === 'move' && esp32Socket) {
      esp32Socket.send("move");
    }
  });
});
