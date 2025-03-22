const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const {
  getAllSubmissions,
  createSubmission,
  getSubmissionById,
} = require("../controllers/submissionController");

router.get("/", getAllSubmissions);
router.post("/", upload.single("submissionFile"), createSubmission);
router.get("/:id", getSubmissionById);

module.exports = router;
