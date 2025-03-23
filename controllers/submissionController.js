const Submission = require("../models/submissionModel");
const cloudinary = require("../config/cloudinary");

const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("challengeId", "title")
      .populate("teamId", "name")
      .populate("scores");
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createSubmission = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "submissions",
      resource_type: "auto",
      use_filename: true,
      unique_filename: false,
      flags: "attachment",
    });

    const downloadUrl = result.secure_url.replace(
      "/upload/",
      "/upload/fl_attachment/"
    );

    // Create submission entry
    const { challengeId, teamId, submittedAt, status, submissionText } =
      req.body;
    const submission = new Submission({
      challengeId,
      teamId,
      submittedAt,
      status,
      submissionFile: downloadUrl, // Store Cloudinary URL in MongoDB
      submissionText: submissionText || "",
    });

    await submission.save();
    res
      .status(201)
      .json({ message: "Submission created successfully", submission });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating submission", error: error.message });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("challengeId", "title")
      .populate("teamId", "name")
      .populate("scores");
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllSubmissions, createSubmission, getSubmissionById };
