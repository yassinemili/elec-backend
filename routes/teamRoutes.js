const express = require("express");
const router = express.Router();
const {
    createTeam,
    getAllTeams,
    deleteTeam,
    removeUserFromTeam,
    getTeamMembers,
    getTeamsRank,
} = require("../controllers/teamController.js");

const authenticateUser = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');


router.get("/", authenticateUser, authorizeRoles('admin'), getAllTeams);
router.post("/", authenticateUser, authorizeRoles('admin'), createTeam);
router.delete("/:id", authenticateUser, authorizeRoles('admin'), deleteTeam);
router.delete("/:teamId/users/:userId", authenticateUser, authorizeRoles('admin'), removeUserFromTeam);
router.get("/:teamId/members", authenticateUser, authorizeRoles('admin'), getTeamMembers);
router.get("/rank", authenticateUser, authorizeRoles('admin', 'participant'), getTeamsRank);


module.exports = router;