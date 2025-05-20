// frontend/config/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for logging
API.interceptors.request.use(config => {
  console.log('Sending request:', config);
  return config;
});

// Add response interceptor
API.interceptors.response.use(
  response => {
    console.log('Received response:', response);
    return response;
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    
    // Transform timeout errors for better user feedback
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Request timeout',
        details: 'The server took too long to respond'
      });
    }
    
    return Promise.reject(error);
  }
);

export const analyzeSentiment = async (keyword, modelType) => {
  try {
    const response = await API.post('/analyze', {
      keyword,
      model_type: modelType
    });
    
    // Ensure response has expected format
    if (!response.data.success) {
      throw new Error(response.data.error || 'Analysis failed');
    }
    
    return response.data.data; // Return the actual analysis data
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    throw error;
  }
};

// frontend/config/api.js
// config/api.js
// In your frontend api.js


export const getSimilarAds = async (text) => {
  console.debug('[API] Requesting recommendations for:', text);
  
  try {
    const response = await axios.post(`http://localhost:5000/api/recommendations`, {
      text: text
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    console.debug('[API] Received response:', response.data);
    return response.data;

  } catch (error) {
    console.error('[API] Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    // Transform error for UI
    let userMessage = 'Failed to get recommendations';
    let details = null;

    if (error.response?.status === 422) {
      userMessage = error.response.data?.error || 'Invalid input';
      details = error.response.data?.details;
    } else if (error.code === 'ECONNABORTED') {
      userMessage = 'Request timeout';
      details = 'The service took too long to respond';
    }

    throw new Error(userMessage, { cause: details });
  }
};