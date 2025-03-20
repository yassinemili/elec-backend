const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");

const connectDB = require("./config/db");

require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
const competitionRoutes = require("./routes/competitionRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const notificationRoutes = require("./routes/notificationsRoutes");
const setupSocket = require("./config/socket");

const app = express();
const server = http.createServer(app);
app.use(cors("*"));
app.use(express.json());
app.use(morgan("dev"));

// Socket.io
setupSocket(server);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
connectDB();

server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
