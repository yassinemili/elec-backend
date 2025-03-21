const Competition = require("../models/competitionModel");

const createCompetition = async (req, res) => {
    try {
        const { name, description, startDate, endDate } = req.body;

        if (!name || !description || !startDate || !endDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const competition = new Competition({ name: name, description: description, startDate: startDate, endDate: endDate });
        await competition.save();

        res.status(201).json(competition);
    } catch (error) {
        res.status(400).json({ message: "Error creating competition", error: error.message });
    }
};

// Retrieve all competitions
const getAllCompetitions = async (req, res) => {
    try {
        const competitions = await Competition.find();
        res.json(competitions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getCompetitionById = async (req, res) => {
    try {
        const competition = await Competition.findById(req.params.id);
        if (!competition) {
            return res.status(404).json({ message: "Competition not found" });
        }
        res.json(competition);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateCompetition = async (req, res) => {
    try {
        const competition = await Competition.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!competition) {
            return res.status(404).json({ message: "Competition not found" });
        }
        res.json(competition);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteCompetition = async (req, res) => {
    try {
        const competition = await Competition.findByIdAndDelete(req.params.id);
        if (!competition) {
            return res.status(404).json({ message: "Competition not found" });
        }
        res.json({ message: "Competition deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const updateCompetitionRankings = async (competitionId) => {
    try {
        const competition = await Competition.findById(competitionId).populate("teams");

        if (!competition) {
            throw new Error("Competition not found");
        }

        let rankings = [];

        for (let team of competition.teams) {
            const totalScore = team.competitions
                .find(comp => comp.competitionId.toString() === competitionId.toString())
                ?.scores.reduce((acc, scoreObj) => acc + scoreObj.score, 0) || 0;

            rankings.push({ teamId: team._id, totalScore });
        }

        rankings.sort((a, b) => b.totalScore - a.totalScore);

        competition.rankings = rankings;
        await competition.save();
    } catch (error) {
        console.error("Error updating rankings:", error.message);
    }
};



module.exports = {
    createCompetition,
    getAllCompetitions,
    getCompetitionById,
    updateCompetition,
    deleteCompetition,
    updateCompetitionRankings,
};
