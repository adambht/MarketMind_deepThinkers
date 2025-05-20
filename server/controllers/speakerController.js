// server/controllers/speakerController.js
const axios = require('axios');

exports.getSpeakers = async (req, res, next) => {
  try {
    const response = await axios.get('http://localhost:8001/speakers');
    
    if (!response.data?.speakers) {
      throw new Error('Invalid response format from TTS service');
    }
    
    res.json({
      success: true,
      speakers: response.data.speakers
    });
  } catch (error) {
    console.error('Speaker fetch error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      fallbackSpeakers: ['Default', 'Backup', 'Speaker']
    });
  }
};