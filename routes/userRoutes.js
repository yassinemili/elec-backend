const express = require("express");
const router = express.Router();
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getUserSubmissions,
    getUserParticipatedCompetitions,
    getUserParticipatedChallenges,
    getUserParticipatedTeams,
} = require("../controllers/userController");

// User routes
router.route("/")
    .get(getAllUsers)
    .post(createUser);

router.route("/:id")
    .get(getUserById)
    .patch(updateUserRole)
    .delete(deleteUser);

router.route("/:id/submissions")
    .get(getUserSubmissions);

router.route("/:id/competitions")
    .get(getUserParticipatedCompetitions);

router.route("/:id/challenges")
    .get(getUserParticipatedChallenges);

router.route("/:id/teams")
    .get(getUserParticipatedTeams);


module.exports = router;