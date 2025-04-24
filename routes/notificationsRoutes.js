const express = require("express");
const { getIO } = require("../config/socket");

const router = express.Router();

router.post("/send", async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "A non-empty message is required." });
  }

  try {
    // Forward to your Render socket server’s internal endpoint:
    /*     const renderRes = await fetch(
          "https://socket-p0.onrender.com/internal/emit",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
          }
        );
    
        const data = await renderRes.json();
    
        if (!renderRes.ok) {
          console.error("Render emit error:", data);
          return res
            .status(renderRes.status)
            .json({ error: data.error || "Emit failed on Render" });
        } */

    // Success: return whatever the Render endpoint returned
    /*  return res.status(200).json({
       success: true,
       detail: data,
     }); */
    const io = getIO(); // Get io instance

    if (!io) {
      return res.status(500).json({ error: "Socket.io is not initialized" });
    }

    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }); // HH:MM AM/PM format

    io.emit("notification", { message, timestamp });

    res.json({
      success: true,
      message: "Notification sent to all users",
      timestamp,
    });

  } catch (err) {
    console.error("Error forwarding to Render:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
