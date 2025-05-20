const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Email Auth
router.post('/register', authController.register);
router.post('/login', authController.login);

// Google Auth
router.post('/google', authController.googleAuth);

// Session
router.get('/check-session', authController.checkSession);

module.exports = router;