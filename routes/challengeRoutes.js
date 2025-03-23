const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");

const {
  getAllChallenges,
  createChallenge,
  getChallengeById,
} = require("../controllers/challengeController");

router.get("/", getAllChallenges);
router.post("/", upload.single("attechmentFile"), createChallenge);
router.get("/:id", getChallengeById);

module.exports = router;
