const express = require("express");
const router = express.Router();
const { getAllSubmissions, createSubmission, getSubmissionById } = require("../controllers/submissionController");

router.get("/", getAllSubmissions);
router.post("/", createSubmission);
router.get("/:id", getSubmissionById);

module.exports = router;