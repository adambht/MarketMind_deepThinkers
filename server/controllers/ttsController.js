const path = require('path');
const axios = require('axios');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

exports.generateAudio = async (req, res) => {
  // Handle OPTIONS requests (preflight) for CORS
  if (req.method === 'OPTIONS') {
    res.set({
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
    });
    return res.status(200).end();
  }

  // Log the incoming request
  console.log('TTS Request received:', {
    body: req.body,
    headers: req.headers,
  });

  try {
    const { text, speaker } = req.body;

    if (!text || !speaker) {
      console.log('Bad request: Missing text or speaker');
      return res.status(400).json({ error: 'Text and speaker are required' });
    }

    console.log(`Generating audio for text: "${text}" with speaker: ${speaker}`);

    // Create audio storage directory if it doesn't exist
    const audioDir = path.join(__dirname, '..', 'audio-storage');
    if (!fs.existsSync(audioDir)) {
      console.log('Creating audio storage directory:', audioDir);
      fs.mkdirSync(audioDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueId = uuidv4().substring(0, 8);
    const filename = `${speaker}-${uniqueId}.wav`;
    const filePath = path.join(audioDir, filename);

    // Call external TTS service
    const ttsServiceUrl = process.env.TTS_SERVICE_URL || 'http://localhost:8001/tts';
    console.log(`Calling TTS service at: ${ttsServiceUrl}`);

    try {
      const ttsResponse = await axios.post(
        ttsServiceUrl,
        {
          text: text,
          speaker: speaker,
        },
        {
          responseType: 'arraybuffer', // Expect binary audio data
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Write the received audio to file
      fs.writeFileSync(filePath, Buffer.from(ttsResponse.data));
      console.log(`Audio file created from TTS service: ${filePath}`);

      // Return a JSON response with the URL to the audio file
      const audioUrl = `/audio-files/${filename}`;

      res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
      });

      return res.status(200).json({
        success: true,
        message: 'Audio generated successfully',
        audioUrl: audioUrl,
        filename: filename,
      });
    } catch (error) {
      console.error('Failed to generate audio from TTS service:', error.message);

      // Log detailed error information
      if (error.response) {
        console.error('TTS Service Error Status:', error.response.status);
        console.error('TTS Service Error Headers:', error.response.headers);
        console.error('TTS Service Error Data:', error.response.data.toString());
      } else if (error.request) {
        console.error('No response received from TTS service:', error.request);
      } else {
        console.error('Error setting up TTS request:', error.message);
      }

      // Return error response instead of fallback audio
      res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
      });

      return res.status(500).json({
        success: false,
        error: 'Failed to generate audio from TTS service',
        details: error.message,
      });
    }
  } catch (error) {
    console.error('Controller error:', error);

    res.set({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
    });

    return res.status(500).json({
      success: false,
      error: 'Audio generation failed',
      details: error.message,
    });
  }
};