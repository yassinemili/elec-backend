const Competition = require("../models/competitionModel");

const getAllCompetitions = async (req, res) => {
    try {
        const competitions = await Competition.find()
            .populate("teams", "name")
            .populate("challenges", "title");
        res.json(competitions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createCompetition = async (req, res) => {
    try {
        const { name, description, startDate, endDate, teams, challenges } = req.body;
        const competition = new Competition({ name, description, startDate, endDate, teams, challenges });
        await competition.save();
        res.status(201).json(competition);
    } catch (error) {
        res.status(400).json({ message: "Error creating competition", error: error.message });
    }
};

const getCompetitionById = async (req, res) => {
    try {
        const competition = await Competition.findById(req.params.id)
            .populate("teams", "name")
            .populate("challenges", "title");
        if (!competition) return res.status(404).json({ message: "Competition not found" });
        res.json(competition);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getAllCompetitions, createCompetition, getCompetitionById };
