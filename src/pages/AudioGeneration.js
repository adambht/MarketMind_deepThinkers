import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import SpeakerSelector from '../components/SpeakerSelector';
import axios from 'axios';

function AudioGeneration() {
  const staticText = "Buy now! A powerful & stylish laptop for your needs.  Get yours today!  #laptop #techlover #computer #stylish #powerful #needs #discounted #nowavailable #getit #buynow #lifetimeassurance #limitedtimeoffer ";
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const [error, setError] = useState(null);
  const [requestData, setRequestData] = useState(null);
  const [responseInfo, setResponseInfo] = useState(null);

  // Clean up audio URLs when component unmounts or audio changes
  useEffect(() => {
    return () => {
      if (generatedAudio) {
        URL.revokeObjectURL(generatedAudio);
      }
    };
  }, [generatedAudio]);

  const handleGenerateAudio = async () => {
    if (!selectedSpeaker) {
      setError("Please select a speaker first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedAudio(null);    
    setResponseInfo(null);
    
    try {
      const requestPayload = {
        text: staticText,
        speaker: selectedSpeaker
      };
      
      console.log("Sending to TTS service:", requestPayload);
      setRequestData(requestPayload);

      // UPDATED: Now calling your Express server's TTS endpoint
      const response = await axios.post('http://localhost:5000/api/tts', requestPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Debug information about the response
      const responseDebugInfo = {
        status: response.status,
        headers: response.headers,
        data: response.data
      };
      
      console.log("Received response:", responseDebugInfo);
      setResponseInfo({
        status: response.status,
        type: 'application/json',
        size: JSON.stringify(response.data).length
      });

      if (response.data.success) {
        // UPDATED: Use the audioUrl from the JSON response to create an audio element
        const audioUrl = `http://localhost:5000${response.data.audioUrl}`;
        setGeneratedAudio(audioUrl);
      } else {
        throw new Error(response.data.message || 'Failed to generate audio');
      }
      
    } catch (error) {
      let errorDetails = {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : null
      };
      
      console.error("Audio generation failed:", errorDetails);
      setError(errorDetails);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakerSelect = (speaker) => {
    console.log("Speaker selected:", speaker);
    setSelectedSpeaker(speaker);
    setError(null);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-300">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">Audio Generation</h1>
            <p className="text-white text-lg">Create audio with AI models</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

            {/* Text Conversion Section */}
<div className="p-8 border-b border-purple-200 bg-gradient-to-r from-purple-50 via-white to-purple-50">
  <div className="max-w-4xl mx-auto">
    <div className="flex items-center justify-center mb-6">
      <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
      <h2 className="text-2xl font-bold text-gray-800">Text to Convert</h2>
    </div>
    
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-40 transition duration-1000"></div>
      <div className="relative bg-white p-6 rounded-xl shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-lg text-gray-700 font-medium leading-relaxed">
                {staticText}
              </p>
            </div>
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{staticText.length} characters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

            {/* Speaker Selection */}
            <div className="p-8 border-b border-purple-200 bg-purple-50">
              <label className="block text-gray-700 font-bold mb-6 text-center text-2xl">
                Select Speaker
              </label>
              <div className="w-full max-w-6xl mx-auto">
                <SpeakerSelector 
                  onSpeakerSelect={handleSpeakerSelect}
                  selectedSpeaker={selectedSpeaker}
                />
                {selectedSpeaker && (
                  <div className="mt-4 text-center text-purple-600 font-medium text-xl">
                    Selected: <span className="font-bold">{selectedSpeaker}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Audio Result Section */}
            <div className="p-8">
              <label className="block text-gray-700 font-bold mb-6 text-center text-2xl">
                Generated Audio
              </label>
              <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg w-full max-w-4xl mx-auto">
                {error ? (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    <div className="flex items-center space-x-3">
                      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="font-medium">{error.message}</p>
                    </div>
                  </div>
                ) : isLoading ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-100 border-t-purple-600 mx-auto"></div>
                    <p className="mt-6 text-gray-600 text-lg font-medium">Creating your audio...</p>
                  </div>
                ) : generatedAudio ? (
                  <div className="space-y-8">
                    {/* Waveform-style player */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-purple-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M15.2 3.8c-0.4-0.4-1-0.4-1.4 0L10 7.6 6.2 3.8c-0.4-0.4-1-0.4-1.4 0s-0.4 1 0 1.4L8.6 9 4.8 12.8c-0.4 0.4-0.4 1 0 1.4 0.2 0.2 0.5 0.3 0.7 0.3s0.5-0.1 0.7-0.3L10 10.4l3.8 3.8c0.2 0.2 0.5 0.3 0.7 0.3s0.5-0.1 0.7-0.3c0.4-0.4 0.4-1 0-1.4L11.4 9l3.8-3.8c0.4-0.4 0.4-1 0-1.4z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Voice Generated</p>
                            <p className="text-sm text-gray-500">Speaker: {selectedSpeaker}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date().toLocaleDateString()}
                        </div>
                      </div>
                      
                      <audio 
                        controls 
                        className="w-full h-12 accent-purple-600" 
                        key={generatedAudio}
                        autoPlay
                        onError={(e) => console.error("Audio playback error:", e.target.error)}
                      >
                        <source src={generatedAudio} type="audio/wav" />
                      </audio>
                      
                      {/* Action Buttons */}
                      <div className="flex justify-end items-center space-x-4 mt-6">
                        <button
                          onClick={() => setGeneratedAudio(null)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Clear</span>
                        </button>
                        <a
                          href={generatedAudio}
                          download={`${selectedSpeaker}-audio.wav`}
                          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="mb-6">
                      <svg className="w-16 h-16 text-purple-200 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg mb-8">
                      Ready to generate your audio
                    </p>
                    <button
                      className="px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
                      onClick={handleGenerateAudio}
                      disabled={isLoading || !selectedSpeaker}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{isLoading ? 'Generating...' : 'Generate Audio'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudioGeneration;