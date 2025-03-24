const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const {
  getAllSubmissions,
  createSubmission,
  getSubmissionById,
  getSubmissionScoresByTeam,
} = require("../controllers/submissionController");

const authenticateUser = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');


router.get("/", authenticateUser, authorizeRoles('admin'), getAllSubmissions);
router.post("/", authenticateUser, authorizeRoles('admin', 'participant'), upload.single("submissionFile"), createSubmission);
router.get("/:id", authenticateUser, authorizeRoles('admin'), getSubmissionById);
router.get("/team/:teamId/scores", authenticateUser, authorizeRoles('admin', 'participant'), getSubmissionScoresByTeam);

module.exports = router;
