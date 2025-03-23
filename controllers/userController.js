const User = require("../models/userModel");
const Team = require("../models/teamModel");
const Submission = require("../models/submissionModel");
const Competition = require("../models/competitionModel");
const Challenge = require("../models/challengeModel");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  try {
    const { name, password, role, teamId } = req.body;
    if (!name || !password || !role || !teamId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name,
      passwordHash: hashedPassword,
      role: role,
      teamId: teamId,
    });
    await user.save();

    // Add user to team
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });
    team.members.push(user._id);
    await team.save();

    res.status(201).json(user);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating user", error: error.message });
  }
};

// Retrieve all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("teamId", "name");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Retrieve a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("teamId", "name");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a user's role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role)
      return res.status(400).json({ message: "Missing required field" });
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: role },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Retrieve a user's submissions
const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      userId: req.params.id,
    }).populate("challengeId", "title");
    if (!submissions)
      return res.status(404).json({ message: "User not found" });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Retrieve a user's participated competitions
const getUserParticipatedCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find({
      teams: { $in: [req.params.id] },
    });
    if (!competitions)
      return res.status(404).json({ message: "User not found" });
    res.json(competitions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Retrieve a user's participated challenges
const getUserParticipatedChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({
      users: { $in: [req.params.id] },
    });
    if (!challenges) return res.status(404).json({ message: "User not found" });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Retrieve a user's participated teams
const getUserParticipatedTeams = async (req, res) => {
  try {
    const teams = await Team.find({ members: { $in: [req.params.id] } });
    if (!teams) return res.status(404).json({ message: "User not found" });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserSubmissions,
  getUserParticipatedCompetitions,
  getUserParticipatedChallenges,
  getUserParticipatedTeams,
};
