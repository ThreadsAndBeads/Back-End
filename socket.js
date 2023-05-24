// const socketIO = require("socket.io");

// let socket = null;

// function init(server) {
//   socket = socketIO(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//     },
//   });

//   socket.on("connection", (clientSocket) => {
//     console.log("Socket: client connected");
//   });
// }

// module.exports = {
//   init,
//   getSocket: () => socket,
// };
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
