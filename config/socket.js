let io;

module.exports = {
  init: (server) => {
    io = require("socket.io")(server, {
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
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized");
    }
    return io;
  }
};
