// routes/recommendationRoutes.js
const express = require('express');
const RecommendationController = require('../controllers/recommendationController')
const router = express.Router();

router.post('/recommendations', RecommendationController.getRecommendations);
router.post('/chat' ,RecommendationController.getChatResponse);

module.exports = router;

