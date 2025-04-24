// config/socket.js
const { Server } = require("socket.io");

let io;

module.exports = {
  /**
   * Initialize Socket.IO on an existing HTTP server.
   * @param {import("http").Server} server
   * @returns {import("socket.io").Server}
   */
  init: (server) => {
    io = new Server(server, {
      cors: {
        origin: [
          "http://localhost:5173",
          "https://elec-frontend.vercel.app",
          "https://socket-p0.vercel.app",
          "https://socket-p0.onrender.com"
        ],
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    // optional: connection logging
    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);
      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });

    return io;
  },

  /**
   * @throws if init() has not been called yet
   * @returns {import("socket.io").Server}
   */
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized");
    }
    return io;
  }
};
