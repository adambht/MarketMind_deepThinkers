const express = require('express');
const router = express.Router();
const tunisianAdController = require('../controllers/tunisianAdController');

router.post('/generate', tunisianAdController.generateAd);

module.exports = router;