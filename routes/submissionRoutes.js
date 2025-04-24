const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const {
  getAllSubmissions,
  createSubmission,
  getSubmissionById,
  getSubmissionScoresByTeam,
  getSubmissionScoresByCategory,
  getSubmissionByTeamId,
  updateSubmission,
  getSubmissionByChallengeIdAndTeamId
} = require("../controllers/submissionController");

const authenticateUser = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.get("/", authenticateUser, authorizeRoles("admin"), getAllSubmissions);
router.get(
  "/team/:teamId",
  authenticateUser,
  authorizeRoles("admin", "participant"),
  getSubmissionByTeamId
);
router.post(
  "/",
  authenticateUser,
  authorizeRoles("admin", "participant"),
  upload.single("submissionFile"),
  createSubmission
);

router.patch(
  '/submissions/:submissionId',
  authenticateUser,
  authorizeRoles("admin", "participant"),
  upload.single('file'),
  updateSubmission
);

router.get(
  "/:id",
  authenticateUser,
  authorizeRoles("admin"),
  getSubmissionById
);

router.get(
  "/team/:teamId/scores",
  authenticateUser,
  authorizeRoles("admin", "participant"),
  getSubmissionScoresByTeam
);
router.get(
  "/team/:teamId/scores/category",
  authenticateUser,
  authorizeRoles("admin", "participant"),
  getSubmissionScoresByCategory
);

router.get(
  "/submission/challenge/team",
  authenticateUser,
  authorizeRoles("admin"),
  getSubmissionByChallengeIdAndTeamId
);

module.exports = router;
