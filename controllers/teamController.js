const Team = require("../models/teamModel");

const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find().populate("members.userId", "name role").populate("competitions", "name");
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createTeam = async (req, res) => {
    try {
        const { name, members, competitions } = req.body;
        const team = new Team({ name, members, competitions });
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        res.status(400).json({ message: "Error creating team", error: error.message });
    }
};

const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate("members.userId", "name role")
            .populate("competitions", "name");
        if (!team) return res.status(404).json({ message: "Team not found" });
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getAllTeams, createTeam, getTeamById };
