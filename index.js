const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorMiddleware");

require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
/* const competitionRoutes = require("./routes/competitionRoutes"); */
const challengeRoutes = require("./routes/challengeRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const notificationRoutes = require("./routes/notificationsRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const authRoutes = require("./routes/authRoutes");
const mentorRoutes = require("./routes/mentorRouter");
const videoRoutes = require("./routes/videosRoutes");

const setupSocket = require("./config/socket");

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  "http://localhost:5173", // Dev
  "http://127.0.0.1:5173", // Dev alternative
  "https://p0-api.onrender.com", // Prod
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        // Reject request if origin is not in whitelist
        return callback(new Error("CORS policy: This origin is not allowed."));
      }
    },
    credentials: true, // Allow cookies/auth headers
    optionsSuccessStatus: 200, // Handle legacy browsers
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Error middleware
app.use(errorHandler);

// Socket.io
setupSocket(server);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
/* app.use("/api/competitions", competitionRoutes); */
app.use("/api/challenges", challengeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/videos", videoRoutes);

const PORT = process.env.PORT || 6010;
connectDB();

server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
