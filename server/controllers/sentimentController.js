// server/controllers/sentimentController.js
const axios = require('axios');

// Increase timeout to 60 seconds for complex analysis
const ANALYSIS_SERVICE_TIMEOUT = 60000;
const ANALYSIS_SERVICE_URL = process.env.ANALYSIS_SERVICE_URL || 'http://localhost:8005/analyze';

exports.analyzeSentiment = async (req, res) => {
  try {
    const { keyword, model_type } = req.body;
    
    // Validate inputs
    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({ error: 'Valid keyword is required' });
    }

    console.log(`Sending to analysis service: ${ANALYSIS_SERVICE_URL}`);
    
    const response = await axios.post(ANALYSIS_SERVICE_URL, {
      keyword: keyword.trim(),
      model_type
    }, {
      timeout: ANALYSIS_SERVICE_TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Received response from analysis service');
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Analysis service error:', {
      message: error.message,
      code: error.code,
      config: error.config?.url,
      stack: error.stack
    });

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ 
        error: 'Analysis service timeout',
        suggestion: 'The analysis is taking longer than expected. Please try again later or use a simpler model.'
      });
    }

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'Analysis service unavailable',
        suggestion: 'Please ensure the sentiment analysis service is running on port 8005'
      });
    }

    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'Analysis failed',
      details: error.message
    });
  }
};