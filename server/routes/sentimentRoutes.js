// server/routes/sentimentRoutes.js
const express = require('express');
const sentimentController = require('../controllers/sentimentController');
const router = express.Router();

router.post('/analyze', sentimentController.analyzeSentiment);

module.exports = router;