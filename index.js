const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
const competitionRoutes = require("./routes/competitionRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const scoreRoutes = require("./routes/scoreRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/scores", scoreRoutes);

const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
