// server/routes/speakers.js
const express = require('express');
const router = express.Router();
const speakerController = require('../controllers/speakerController');

router.get('/', speakerController.getSpeakers);

module.exports = router;