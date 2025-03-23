const Challenge = require("../models/challengeModel");

const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate("competitionId", "name")
      .populate("submissions.teamId", "name");
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createChallenge = async (req, res) => {
  try {
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.points ||
      !req.body.category
    ) {
      return res.status(400).json({ message: "some information are required" });
    }

    const { title, description, points, hints, category } = req.body;
    const challenge = new Challenge({
      title,
      description,
      points,
      hints,
      category,
    });
    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating challenge", error: error.message });
  }
};

const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate("competitionId", "name")
      .populate("submissions.teamId", "name");
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllChallenges, createChallenge, getChallengeById };
