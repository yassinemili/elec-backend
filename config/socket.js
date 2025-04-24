// config/socket.js
/* const { Server } = require("socket.io");

let io;

module.exports = {

  init: (server) => {
    io = new Server(server, {
      cors: {
        origin: [
          "http://localhost:5173",
          "https://elec-frontend.vercel.app",
          "https://socket-p0.onrender.com"
        ],
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);
      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized");
    }
    return io;
  }
};
 */
const { Server } = require("socket.io");

let io = null;

function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["*", "https://elec-frontend.vercel.app"],
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  io.on("connection", (socket) => {
    socket.on("sendMessage", (data) => {
      io.emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
      // handle disconnect if needed
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized. Call setupSocket(server) first.");
  }
  return io;
}

module.exports = { setupSocket, getIO };
