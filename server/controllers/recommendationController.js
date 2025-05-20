// controllers/recommendationController.js
import axios from 'axios';

export const getRecommendations = async (req, res) => {
  try {
    const { text } = req.body;
    
    // Validate input
    if (!text) {
      return res.status(400).json({ 
        error: 'Text is required',
        example: 'iPhone 15 Pro Max 256GB'
      });
    }

    // Call the recommendation service
    const response = await axios.post(
      'http://localhost:8006/',
      new URLSearchParams({ product: text }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 60000 // 10 second timeout
      }
    );

    // Return the recommendations
    res.json(response.data);

  } catch (error) {
    console.error('Recommendation service error:', error.message);
    
    // Handle different error cases
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Recommendation service error',
        details: error.response.data
      });
    }
    
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: 'Recommendation service timeout',
        suggestion: 'Please try again later'
      });
    }

    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

// controllers/recommendationController.js
export const getChatResponse = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await axios.post(
      'http://localhost:8006/chat',
      new URLSearchParams({ message }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: 'Failed to get chat response' });
  }
};

