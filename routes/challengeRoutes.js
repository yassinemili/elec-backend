const express = require("express");
const router = express.Router();
const { getAllChallenges, createChallenge, getChallengeById } = require("../controllers/challengeController");

router.get("/", getAllChallenges);
router.post("/", createChallenge);
router.get("/:id", getChallengeById);

module.exports = router;