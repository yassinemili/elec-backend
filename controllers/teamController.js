const Team = require("../models/teamModel.js");
/* const Competition = require("../models/competitionModel"); */
const User = require("../models/userModel");

const createTeam = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Missing required field" });
        }

        const existingTeam = await Team.findOne({ name: name });
        if (existingTeam) {
            return res.status(409).json({ message: "Team with the same name already exists" });
        }

        const team = new Team({ name });

        /* const competition = await Competition.findById(competitionId);
        if (!competition) {
            return res.status(404).json({ message: "Competition not found" });
        } */

        /* // Associate team and competition
        team.competitions.push(competition._id);
        competition.teams.push(team._id); */

        // Save both the team and the updated competition
        await team.save();
        /* await competition.save(); */

        // Respond with the created team
        res.status(201).json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Retrieve all teams
const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find();
        res.json(teams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Retrieve a team by ID
const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)/* .populate("competitions") */;
        if (!team) return res.status(404).json({ message: "Team not found" });
        res.json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a team's name
const updateTeamName = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Missing required field" });
        }
        const team = await Team.findByIdAndUpdate(req.params.id, { name: name }, { new: true });
        if (!team) return res.status(404).json({ message: "Team not found" });
        res.json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a team
const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);
        if (!team) return res.status(404).json({ message: "Team not found" });
        res.json({ message: "Team deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Remove a user from a team
const removeUserFromTeam = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "Missing required field" });
        }
        const team = await Team.findByIdAndUpdate(req.params.id, { $pull: { users: userId } }, { new: true });
        if (!team) return res.status(404).json({ message: "Team not found" });

        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Retrieve a team's members
// WELL 
const getTeamMembers = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId).populate({
            path: "members._id",
            model: "User",
            select: "name"
        });
        if (!team) return res.status(404).json({ message: "Team not found" });

        const members = team.members.map(member => {
            const userName = member._id && member._id.name ? member._id.name : "Unknown";
            return { name: userName, role: member.role };
        });

        res.json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};




// Retrieve a team's submissions
const getTeamSubmissions = async (req, res) => {
    try {
        const { teamId } = req.params;
        if (!teamId) {
            return res.status(400).json({ message: "Team ID is required" });
        }
        const team = await Team.findById(teamId)
            // cause of submision chalenges id is required will be updated latter
            /* .populate({
              path: "submissions.challengeId",
              select: "title description",
            }) */
            .lean();

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        const submissions = team.submissions || [];

        res.status(200).json({ submissions });
    } catch (error) {
        console.error("Error retrieving team submissions:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const updateTeamScore = async (req, res) => {

};



module.exports = {
    createTeam,
    getAllTeams,
    getTeamById,
    updateTeamName,
    deleteTeam,
    removeUserFromTeam,
    getTeamMembers,
    getTeamSubmissions,
    updateTeamScore,
};
