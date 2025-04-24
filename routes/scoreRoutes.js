const express = require("express");
const router = express.Router();
const { createScore, updateScore } = require("../controllers/scoreController");

const authenticateUser = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');

router.post("/", authenticateUser, authorizeRoles('admin'), createScore);
router.put("/", authenticateUser, authorizeRoles('admin'), updateScore);

module.exports = router;