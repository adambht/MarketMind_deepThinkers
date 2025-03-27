import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

function AudioGeneration() {
  const [selectedModel, setSelectedModel] = useState("Bark");
  const [voiceEmotion, setVoiceEmotion] = useState(50);
  const [speechRate, setSpeechRate] = useState(50);
  const [volume, setVolume] = useState(75);
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sample audio data
  const sampleAudios = [
    {
      id: 1,
      name: "Sample Voice 1",
      url: "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav"
    },
    {
      id: 2,
      name: "Sample Voice 2",
      url: "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav"
    }
  ];

  const handleGenerateAudio = async () => {
    setIsLoading(true);
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Use one of the sample audio URLs
      const generatedUrl = sampleAudios[Math.floor(Math.random() * sampleAudios.length)].url;
      setGeneratedAudio(generatedUrl);
    } catch (error) {
      console.error("Error generating audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-300">
      <Sidebar />
      <div className="flex-1 ml-64"> {/* Add ml-64 to offset the fixed sidebar */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">Audio Generation</h1>
            <p className="text-white text-lg">
              Create high-quality audio with AI models
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Models Section */}
            <div className="p-8 border-b border-gray-200">
              <label className="block text-gray-700 font-bold mb-6 text-center text-2xl">
                Select Audio Model
              </label>
              <div className="grid grid-cols-3 gap-6 w-full max-w-3xl mx-auto">
                {["Music only", "Speech only", "Music and speech"].map((model) => (
                  <button
                    key={model}
                    className={`w-full px-6 py-4 rounded-xl transition-all transform hover:scale-105 ${
                      selectedModel === model
                        ? "bg-purple-600 text-white shadow-lg scale-105"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                    onClick={() => setSelectedModel(model)}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            {/* Parameters Section */}
            <div className="p-8 border-b border-gray-200 bg-gray-50">
              <label className="block text-gray-700 font-bold mb-8 text-center text-2xl">
                Audio Parameters
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto px-4">
                <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
                  <label className="flex justify-between text-gray-600 font-medium">
                    <span>Voice Emotion</span>
                    <span className="text-purple-600 font-semibold">{voiceEmotion}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={voiceEmotion}
                    onChange={(e) => setVoiceEmotion(e.target.value)}
                    className="w-full h-2 accent-purple-600"
                  />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
                  <label className="flex justify-between text-gray-600 font-medium">
                    <span>Speech Rate</span>
                    <span className="text-purple-600 font-semibold">{speechRate}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(e.target.value)}
                    className="w-full h-2 accent-purple-600"
                  />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
                  <label className="flex justify-between text-gray-600 font-medium">
                    <span>Volume</span>
                    <span className="text-purple-600 font-semibold">{volume}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full h-2 accent-purple-600"
                  />
                </div>
              </div>
            </div>

            {/* Audio Result Section */}
            <div className="p-8">
              <label className="block text-gray-700 font-bold mb-6 text-center text-2xl">
                Generated Audio
              </label>
              <div className="bg-gray-50 p-8 rounded-xl shadow-inner w-full max-w-4xl mx-auto">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg">Generating audio...</p>
                  </div>
                ) : generatedAudio ? (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <audio controls className="w-full">
                        <source src={generatedAudio} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                    <div className="text-center text-gray-500">
                      Generated using <span className="text-purple-600 font-semibold">{selectedModel}</span> model
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-6">
                      No audio generated yet
                    </p>
                    <button
                      className="px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all transform hover:scale-105 shadow-md"
                      onClick={handleGenerateAudio}
                      disabled={isLoading}
                    >
                      Generate Audio
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
              <button
                className={`w-full max-w-md mx-auto px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all transform hover:scale-105 shadow-md flex items-center justify-center space-x-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleGenerateAudio}
                disabled={isLoading}
              >
                <span>{isLoading ? 'Generating...' : 'Generate Audio'}</span>
                {!isLoading && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AudioGeneration;