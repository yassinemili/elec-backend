const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

require("dotenv").config();


const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
const competitionRoutes = require("./routes/competitionRoutes");

const app = express();


app.use(express.json());
app.use(cors());
app.use(morgan("dev"));


app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/competitions", competitionRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
