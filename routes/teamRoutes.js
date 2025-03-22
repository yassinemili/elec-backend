const express = require("express");
const router = express.Router();
const {
    createTeam,
    getAllTeams,
    getTeamById,
    updateTeamName,
    deleteTeam,
    removeUserFromTeam,
    getTeamMembers,
    getTeamSubmissions,
    updateTeamScore,
} = require("../controllers/teamController.js");

router.route("/")
    .get(getAllTeams)
    .post(createTeam);

router.route("/:id")
    .get(getTeamById)
    .patch(updateTeamName)
    .delete(deleteTeam);

router.route("/:teamId/users")
    .delete(removeUserFromTeam);

router.route("/:teamId/members")
    .get(getTeamMembers);

router.route("/:teamId/submissions")
    .get(getTeamSubmissions);

router.route("/:teamId/score")
    .patch(updateTeamScore);





module.exports = router;