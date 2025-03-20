const Score = require("../models/scoreModel");

const getAllScores = async (req, res) => {
    try {
        const scores = await Score.find()
            .populate("submissionId", "submissionFile")
            .populate("judgeId", "name");
        res.json(scores);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createScore = async (req, res) => {
    try {
        const { submissionId, judgeId, score, comments } = req.body;
        const newScore = new Score({ submissionId, judgeId, score, comments });
        await newScore.save();
        res.status(201).json(newScore);
    } catch (error) {
        res.status(400).json({ message: "Error creating score", error: error.message });
    }
};

const getScoreById = async (req, res) => {
    try {
        const score = await Score.findById(req.params.id)
            .populate("submissionId", "submissionFile")
            .populate("judgeId", "name");
        if (!score) return res.status(404).json({ message: "Score not found" });
        res.json(score);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getAllScores, createScore, getScoreById };
