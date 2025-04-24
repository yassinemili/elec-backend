const Score = require("../models/scoreModel");
const Submission = require("../models/submissionModel");
const User = require("../models/userModel");
const Challenge = require("../models/challengeModel");
const Team = require("../models/teamModel");
const { getIO } = require("../config/socket");
const mongoose = require("mongoose");

const createScore = async (req, res) => {
  try {
    const { submissionId, judgeId, score, comments } = req.body;

    // Validate submissionId
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({ message: "Invalid submissionId format" });
    }

    // Validate judgeId and score
    if (!mongoose.Types.ObjectId.isValid(judgeId)) {
      return res.status(400).json({ message: "Invalid judgeId format" });
    }

    if (typeof score !== "number" || isNaN(score)) {
      return res.status(400).json({ message: "Score must be a valid number" });
    }

    // Create the new score
    const newScore = new Score({ submissionId, judgeId, score, comments });
    await newScore.save();

    // Get the submission and check if it exists
    let updatedSubmission = await Submission.findById(submissionId);
    if (!updatedSubmission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Update the submission with the new score
    updatedSubmission.scores.push(newScore._id);
    updatedSubmission.status = "reviewed";
    updatedSubmission.isSolved = true;
    await updatedSubmission.save();

    // Populate the updated submission to include score details
    updatedSubmission = await Submission.findById(submissionId).populate(
      "scores"
    );

    // Find the team related to the submission
    const team = await Team.findById(updatedSubmission.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Update the team's total score
    team.totalScore += score;
    await team.save();

    const submition = await Submission.findById(submissionId);
    const challengeId = submition.challengeId;
    const selctedChallenge = await Challenge.findById(challengeId);
    const selctedCategory = selctedChallenge.category;
    const userId = submition.userId;
    const selectedUser = await User.findById(userId);

    selectedUser.statistics.challengeSolved[selctedCategory] += score;

    const { AI, CS, GD, PS } = selectedUser.statistics.challengeSolved;
    selectedUser.statistics.score = AI + CS + GD + PS;
    await selectedUser.save();

    // Emit the updated team data to clients using Socket.io
    const io = getIO();
    io.emit("teams:update", team);

    // Send the response back with the newly created score and updated submission
    res.status(201).json({
      newScore,
      updatedSubmission,
    });
  } catch (error) {
    console.error("Error creating score:", error); // Log error for debugging
    res
      .status(400)
      .json({ message: "Error creating score", error: error.message });
  }
};

const updateScore = async (req, res) => {
  try {
    const { scoreId, score, comments } = req.body;

    // Validate scoreId and score value
    if (!mongoose.Types.ObjectId.isValid(scoreId)) {
      return res.status(400).json({ message: "Invalid scoreId format" });
    }
    if (typeof score !== "number" || isNaN(score)) {
      return res.status(400).json({ message: "Score must be a valid number" });
    }

    // Find the existing score
    const existingScore = await Score.findById(scoreId);
    if (!existingScore) {
      return res.status(404).json({ message: "Score not found" });
    }

    const oldScore = existingScore.score;
    existingScore.score = score;
    existingScore.comments = comments || existingScore.comments;
    await existingScore.save();

    // Get related submission
    const submission = await Submission.findById(existingScore.submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Update submission status if not already done
    submission.status = "reviewed";
    submission.isSolved = true;
    await submission.save();

    // Update team score
    const team = await Team.findById(submission.teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    team.totalScore += score - oldScore;
    await team.save();

    // Update user stats
    const challenge = await Challenge.findById(submission.challengeId);
    const category = challenge.category;

    const user = await User.findById(submission.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.statistics.challengeSolved[category] += score - oldScore;

    const { AI, CS, GD, PS } = user.statistics.challengeSolved;
    user.statistics.score = AI + CS + GD + PS;

    await user.save();

    // Emit updated team
    const io = getIO();
    io.emit("teams:update", team);

    res.status(200).json({
      message: "Score updated successfully",
      score: existingScore,
    });
  } catch (error) {
    console.error("Error updating score:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  createScore,
  updateScore,
};
