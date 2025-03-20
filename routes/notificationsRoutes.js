const express = require("express");
const { getIO } = require("../config/socket");

const router = express.Router();

router.post("/send", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const io = getIO(); // Get io instance

  if (!io) {
    return res.status(500).json({ error: "Socket.io is not initialized" });
  }

  io.emit("notification", message);
  console.log("Notification sent:", message);

  res.json({ success: true, message: "Notification sent to all users" });
});

module.exports = router;
