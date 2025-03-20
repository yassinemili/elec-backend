const express = require("express");
const router = express.Router();
const { getAllCompetitions, createCompetition, getCompetitionById } = require("../controllers/competitionController");

router.get("/", getAllCompetitions);
router.post("/", createCompetition);
router.get("/:id", getCompetitionById);

module.exports = router;