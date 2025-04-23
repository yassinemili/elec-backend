const { Server } = require("socket.io");

let io; // Define io globally

module.exports = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",  // Development frontend URL
        "https://elec-frontend.vercel.app",  // Production frontend URL
        "https://socket-p0.vercel.app",  // Another frontend URL
        "https://socket-p0.onrender.com"  // Socket server hosted on Render
      ],
      methods: ["GET", "POST"],
      credentials: true,
    }
  });

  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on("sendMessage", (data) => {
      console.log(`Message: ${data.message}`);
      io.emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Export io separately to use it in routes
module.exports.getIO = () => io;
