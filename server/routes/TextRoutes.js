const express = require('express');
const router = express.Router();
const { generateText } = require('../controllers/textContoller');

router.post('/generate-text', generateText);

module.exports = router;