// frontend/components/Recommendations.js
import React, { useState } from 'react';
import { getSimilarAds } from '../config/api';

function Recommendations({ generatedText }) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    if (!generatedText) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getSimilarAds(generatedText);
      setRecommendations(data);
    } catch (err) {
      setError(err.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recommendations-container">
      <button 
        onClick={fetchRecommendations}
        disabled={loading || !generatedText}
        className="fetch-button"
      >
        {loading ? 'Loading...' : 'Get Similar Ads'}
      </button>

      {error && <div className="error-message">{error}</div>}

      {recommendations && (
        <div className="recommendations-results">
          <h3>Similar Ads</h3>
          
          {/* HTML version */}
          <div 
            className="html-recommendations"
            dangerouslySetInnerHTML={{ __html: recommendations.similar_ads_html }}
          />
          
          {/* Or structured version */}
          <div className="structured-recommendations">
            {recommendations.top_ads_raw.map((ad, index) => (
              <div key={index} className="ad-item">
                <h4>{ad.product_name}</h4>
                <p>{ad.ad_title}</p>
                <div className="ad-meta">
                  <span>Source: {ad.source}</span>
                  <a href={ad.url} target="_blank" rel="noopener noreferrer">
                    View Ad
                  </a>
                </div>
              </div>
            ))}
          </div>

          {recommendations.suggested_questions && (
            <div className="suggested-questions">
              <h4>Suggested Questions</h4>
              <ul>
                {recommendations.suggested_questions.map((question, idx) => (
                  <li key={idx}>{question}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Recommendations;