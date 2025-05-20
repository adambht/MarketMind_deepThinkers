// server/routes/tts.js
const express = require('express');
const router = express.Router();
const ttsController = require('../controllers/ttsController');

// POST endpoint for text-to-speech
router.post('/', ttsController.generateAudio);

module.exports = router;