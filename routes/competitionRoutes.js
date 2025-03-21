const express = require("express");
const router = express.Router();
const {
    createCompetition,
    getAllCompetitions,
    getCompetitionById,
    updateCompetition,
    deleteCompetition
} = require("../controllers/competitionController");

router.route("/")
    .get(getAllCompetitions)
    .post(createCompetition);

router.route("/:id")
    .get(getCompetitionById)
    .put(updateCompetition)
    .delete(deleteCompetition);


module.exports = router;