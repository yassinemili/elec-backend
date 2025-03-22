const express = require('express');
const router = express.Router();
const {
    login,
    resetPassword
} = require('../controllers/authController');

const authenticateUser = require('../middlewares/authMiddleware');

router.post('/login', login);
router.post('/reset-password', authenticateUser, resetPassword);

module.exports = router;