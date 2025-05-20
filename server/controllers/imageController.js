// controllers/imageController.js
const axios = require("axios");

const generateImage = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ message: "Prompt is required" });

  try {
    // Send POST request to the external image generation API
    const response = await axios.post("https://ff8c-34-122-208-73.ngrok-free.app/generate", { prompt });

    // Assume the API returns { image_url: 'url-to-image' }
    const imageUrl = response.data.image_url;

    res.json({ image_url: imageUrl });
  } catch (err) {
    console.error("Image generation failed:", err.message);
    res.status(500).json({ message: "Image generation failed" });
  }
};

module.exports = { generateImage };
