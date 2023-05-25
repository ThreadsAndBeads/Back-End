const { Server } = require("socket.io");

let io = null;

function init(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket: client connected");
    socket.on("join", (room) => {
      console.log("Socket: join event received with room:", room);
      socket.join(room);
      console.log("Socket: joined room:", room);
    });
  });
}

module.exports = {
  init,
  getSocket: () => io,
};
