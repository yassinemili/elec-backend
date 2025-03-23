const express = require("express");
const router = express.Router();
const { getAllScores, createScore, getScoreById } = require("../controllers/scoreController");

router.get("/", getAllScores);
router.post("/", createScore);
router.get("/:scoreId", getScoreById);

module.exports = router;