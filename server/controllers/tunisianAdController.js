const axios = require('axios');

const generateAd = async (req, res) => {
  console.log('Received request:', req.body); // Add this line for debugging

  try {
    const { name_market, description } = req.body;

    const response = await axios.post('http://localhost:8003/generate', {
      name_market,
      description
    });

    console.log('API Response:', response.data); // Add this line for debugging

    res.json({ generated_ad: response.data.generated_ad });
  } catch (error) {
    console.error('Error generating ad:', error);
    res.status(500).json({ 
      message: 'Error generating ad',
      error: error.response?.data || error.message 
    });
  }
};

module.exports = { generateAd };