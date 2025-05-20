import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000', // Match the Express server port
  headers: {
    'Content-Type': 'application/json'
  }
});

function TunisianAdGeneration() {
  const [formData, setFormData] = useState({
    name_market: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [generatedAd, setGeneratedAd] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/tunisian-ad/generate', formData);
      if (response.data && response.data.generated_ad) {
        setGeneratedAd(response.data.generated_ad);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.message || 'Error generating ad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-300">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">Tunisian Ad Generator</h1>
            <p className="text-white text-lg">Create compelling ads for your Tunisian business</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              {/* Market Name Input */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name_market">
                  Market Name (اسم المتجر)
                </label>
                <input
                  id="name_market"
                  type="text"
                  value={formData.name_market}
                  onChange={(e) => setFormData({ ...formData, name_market: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="أدخل اسم المتجر"
                  required
                  dir="rtl"
                />
              </div>

              {/* Description Input */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description (الوصف)
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent h-32"
                  placeholder="أدخل وصف المتجر"
                  required
                  dir="rtl"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>جاري التوليد...</span>
                    </>
                  ) : (
                    <span>توليد الإعلان</span>
                  )}
                </button>
              </div>
            </form>

            {/* Error Display */}
            {error && (
              <div className="px-8 pb-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  <p className="font-medium text-center">{error}</p>
                </div>
              </div>
            )}

            {/* Generated Ad Display */}
            {generatedAd && (
              <div className="px-8 pb-8">
                <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">الإعلان المولد</h3>
                  <p className="text-lg text-gray-700 text-center leading-relaxed" dir="rtl">
                    {generatedAd}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TunisianAdGeneration;