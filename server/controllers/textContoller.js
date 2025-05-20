const axios = require('axios');

exports.generateText = async (req, res) => {
  try {
    const { product, description } = req.body;
    
    // Validate required fields
    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required"
      });
    }

    // Forward to Swagger API with proper structure
    const response = await axios.post('http://localhost:8002/generate', {
      product: product || "Custom Product",
      description
    });
    
    res.json({
      success: true,
      generatedText: response.data.ad
    });
  } catch (error) {
    console.error("Controller error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Text generation failed",
      apiError: error.response?.data
    });
  }
};