import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function RecommendationsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState({
    recommendations: null,
    loading: true,
    error: null,
    chatMessage: '',
    chatResponse: null,
    isChatLoading: false
  });
  const generatedText = location.state?.generatedText;

  useEffect(() => {
    if (!generatedText) {
      navigate('/');
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await fetch('http://localhost:5000/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: generatedText })
        });

        if (!response.ok) throw new Error('Failed to get recommendations');

        const data = await response.json();
        setState(prev => ({ ...prev, recommendations: data, loading: false }));
      } catch (err) {
        setState(prev => ({ ...prev, error: err.message, loading: false }));
      }
    };

    fetchRecommendations();
  }, [generatedText, navigate]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!state.chatMessage.trim()) return;
    
    try {
      setState(prev => ({ ...prev, isChatLoading: true, error: null }));
      
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: state.chatMessage })
      });

      if (!response.ok) throw new Error('Failed to get chat response');

      const data = await response.json();
      // Handle both object and string responses
      const responseText = data.assistant_reply || data;
      
      setState(prev => ({
        ...prev,
        chatResponse: responseText,
        chatMessage: '',
        isChatLoading: false
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message, isChatLoading: false }));
    }
  };

  const handleInputChange = (e) => {
    setState(prev => ({ ...prev, chatMessage: e.target.value }));
  };

  const { 
    recommendations, 
    loading, 
    error, 
    chatMessage, 
    chatResponse, 
    isChatLoading 
  } = state;

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 ml-72 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Recommended Ads</h1>
          
          {!generatedText ? (
            <div className="bg-gray-800 p-6 rounded-lg text-white">
              No generated text found
            </div>
          ) : (
            <>
              <div className="bg-gray-800 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-2 text-purple-300">
                  Your Original Ad
                </h2>
                <p className="text-white">{generatedText}</p>
              </div>

              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500" />
                  <p className="mt-2 text-white">Loading recommendations...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-900/50 p-4 rounded-lg mb-6 text-white">
                  <h3 className="text-lg font-semibold mb-1">Error</h3>
                  <p>{error}</p>
                </div>
              )}

              {recommendations && (
                <div className="space-y-6">
                  {recommendations.generated_ad && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                      <h2 className="text-xl font-semibold mb-4 text-purple-300">
                        Your Enhanced Ad
                      </h2>
                      <div className="text-white whitespace-pre-line">
                        {recommendations.generated_ad}
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-purple-300">
                      Top Related Ads
                    </h2>
                    <div className="grid gap-4">
                      {recommendations.top_ads_raw?.map((ad, index) => (
                        <div key={index} className="bg-gray-700 p-4 rounded-lg">
                          <h3 className="font-bold text-white">{ad.product_name}</h3>
                          <p className="text-gray-300 italic my-2">{ad.ad_title}</p>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">{ad.source}</span>
                            <a 
                              href={ad.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-purple-300 hover:underline"
                            >
                              View Ad
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {recommendations.suggested_questions && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                      <h2 className="text-xl font-semibold mb-4 text-purple-300">
                        Optimization Questions
                      </h2>
                      <ul className="space-y-3">
                        {recommendations.suggested_questions.map((question, idx) => (
                          <li key={idx} className="text-white">
                            <span className="text-purple-300 mr-2">•</span>
                            {question}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-purple-300">
                      Ask About Your Ad
                    </h2>
                    <form onSubmit={handleChatSubmit} className="mb-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={handleInputChange}
                          placeholder="Ask a question about your ad..."
                          className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button 
                          type="submit"
                          disabled={isChatLoading}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                          {isChatLoading ? 'Sending...' : 'Ask'}
                        </button>
                      </div>
                    </form>

                    {chatResponse && (
                      <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                        <h3 className="font-semibold text-purple-300 mb-2">Response:</h3>
                        <p className="text-white">
                          {typeof chatResponse === 'object' 
                            ? JSON.stringify(chatResponse, null, 2)
                            : chatResponse}
                        </p>
                      </div>
                    )}
                  </div>

                  
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecommendationsPage;