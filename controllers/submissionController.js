const Submission = require("../models/submissionModel");

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
        const { challengeId, teamId, submittedAt, status, submissionFile } = req.body;
        const submission = new Submission({ challengeId, teamId, submittedAt, status, submissionFile });
        await submission.save();
        res.status(201).json(submission);
    } catch (error) {
        res.status(400).json({ message: "Error creating submission", error: error.message });
    }
};

const getSubmissionById = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate("challengeId", "title")
            .populate("teamId", "name")
            .populate("scores");
        if (!submission) return res.status(404).json({ message: "Submission not found" });
        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getAllSubmissions, createSubmission, getSubmissionById };
