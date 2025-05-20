import React, { useState } from 'react';
import { analyzeSentiment } from '../config/api';
import './SentimentAnalysisForm.css';

function SentimentAnalysisForm() {
  const [formData, setFormData] = useState({
    keyword: '',
    model_type: 'vader'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const modelTypes = [
    { value: 'vader', label: 'vader' },
    { value: 'advanced', label: 'Advanced Model' },
    { value: 'mlp', label: 'MLP Classifier' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
  
    try {
      const analysisResult = await analyzeSentiment(formData.keyword, formData.model_type);
  
      const transformedResult = {
        summary: analysisResult.summary,
        sentiment: analysisResult.sentiment,
        confidence: analysisResult.confidence,
        samples: analysisResult.sample_results.slice(0, 5),
        plots: analysisResult.plot_urls
      };
  
      setResult(transformedResult);
    } catch (err) {
      console.error('Analysis error:', err);
  
      let errorMessage = 'Analysis failed';
      if (err.message.includes('timeout')) {
        errorMessage = 'The analysis took too long. Please try again later.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
  
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sentiment-analysis-wrapper">
      <div className="sentiment-analysis-container">
        <h2 className="analysis-title">Sentiment Analysis</h2>

        <form onSubmit={handleSubmit} className="analysis-form">
          <div className="form-group">
            <input
              name="keyword"
              type="text"
              value={formData.keyword}
              onChange={handleChange}
              placeholder="Enter keyword..."
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <select
              name="model_type"
              value={formData.model_type}
              onChange={handleChange}
              className="form-select"
            >
              {modelTypes.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading || !formData.keyword}
            className="submit-button"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {result && (
          <div className="result-container">
            <h3>Results</h3>
            <div className="result-content">
              <p><span className="result-label">Keyword:</span> {formData.keyword}</p>
              <p><span className="result-label">Model:</span> {
                modelTypes.find(m => m.value === formData.model_type)?.label
              }</p>
              <p>
                <span className="result-label">Sentiment:</span> 
                <span className={`sentiment-${result.sentiment?.toLowerCase()}`}>
                  {result.sentiment}
                </span>
              </p>
              {result.confidence && (
                <p><span className="result-label">Confidence:</span> {Math.round(result.confidence * 100)}%</p>
              )}
            </div>

            <div className="plot-gallery">
              <h4>Generated Plots</h4>
              <div className="plot-grid">
                {result.plots && Object.entries(result.plots).map(([plotName, plotPath]) => (
                  <div key={plotName} className="plot-item">
                    <img 
                      src={`http://localhost:8005/${plotPath}`} 
                      alt={plotName} 
                      className="plot-image"
                    />
                    <p className="plot-label">{plotName.replace(/_/g, ' ')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SentimentAnalysisForm;