// routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const { generateImage } = require('../controllers/imageController');

router.post('/generate', generateImage);

module.exports = router;
