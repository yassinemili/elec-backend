const Score = require("../models/scoreModel");
const Submission = require("../models/submissionModel");
const Team = require("../models/teamModel");


const mongoose = require("mongoose");

const createScore = async (req, res) => {
    try {
        const { submissionId, judgeId, score, comments } = req.body;

        if (!mongoose.Types.ObjectId.isValid(submissionId)) {
            return res.status(400).json({ message: "Invalid submissionId format" });
        }

        const newScore = new Score({ submissionId, judgeId, score, comments });
        await newScore.save();

        let updatedSubmission = await Submission.findById(submissionId);
        if (!updatedSubmission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        updatedSubmission.scores.push(newScore._id);
        updatedSubmission.status = "reviewed";
        await updatedSubmission.save();

        updatedSubmission = await Submission.findById(submissionId).populate("scores");

        const team = await Team.findById(updatedSubmission.teamId);
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }
        team.totalScore += score;
        await team.save();

        res.status(201).json({
            newScore,
            updatedSubmission
        });
    } catch (error) {
        res.status(400).json({ message: "Error creating score", error: error.message });
    }
};

module.exports = {
    createScore,
};
