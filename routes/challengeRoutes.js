const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");

const {
  getAllChallenges,
  createChallenge,
  getChallengeById,
} = require("../controllers/challengeController");

const authenticateUser = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');

router.get("/", authenticateUser, authorizeRoles('admin', 'participant'), getAllChallenges);
router.post("/", authenticateUser, authorizeRoles('admin'), upload.single('attachmentFile'), createChallenge);
router.get("/:id", authenticateUser, authorizeRoles('admin', 'participant'), getChallengeById);

module.exports = router;
