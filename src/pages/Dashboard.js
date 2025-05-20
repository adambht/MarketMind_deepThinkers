// frontend/pages/AnalysisPage.js
import React from 'react';
import SentimentAnalysisForm from '../components/sentimentAnalysisForm';
import './sentimentAnalysis.css'; // Import the CSS

function AnalysisPage() {
  return (
    <div className="page-container">
      <h1>Text Sentiment Analysis</h1>
      <p>Enter a keyword and select a model to analyze its sentiment</p>
      <SentimentAnalysisForm />
    </div>
  );
}

export default AnalysisPage;