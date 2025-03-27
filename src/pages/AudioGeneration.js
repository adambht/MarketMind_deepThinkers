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
      <Sidebar className="h-full" />
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="max-w-full mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white mb-3">Audio Generation</h1>
            <p className="text-white text-lg">
              Create high-quality audio with AI models
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg w-full">
            {/* Models Section */}
            <div className="mb-8 w-full">
              <label className="block text-gray-700 font-bold mb-4 text-center text-xl">
                Select Audio Model
              </label>
              <div className="grid grid-cols-3 gap-4 w-full max-w-3xl mx-auto">
                {["Bark", "MusicGen", "AudioGen"].map((model) => (
                  <button
                    key={model}
                    className={`w-full px-4 py-3 rounded-lg transition-all ${
                      selectedModel === model
                        ? "bg-purple-500 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedModel(model)}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            {/* Parameters Section */}
            <div className="mb-8">
              <label className="block text-gray-700 font-bold mb-6 text-center text-xl">
                Audio Parameters
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto px-4">
                <div className="space-y-2 w-full">
                  <label className="flex justify-between text-gray-600 font-medium">
                    <span>Voice Emotion</span>
                    <span>{voiceEmotion}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={voiceEmotion}
                    onChange={(e) => setVoiceEmotion(e.target.value)}
                    className="w-full h-2 accent-purple-500"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <label className="flex justify-between text-gray-600 font-medium">
                    <span>Speech Rate</span>
                    <span>{speechRate}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(e.target.value)}
                    className="w-full h-2 accent-purple-500"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <label className="flex justify-between text-gray-600 font-medium">
                    <span>Volume</span>
                    <span>{volume}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full h-2 accent-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Audio Result Section */}
            <div className="mb-8">
              <label className="block text-gray-700 font-bold mb-4 text-center text-xl">
                Generated Audio
              </label>
              <div className="bg-gray-50 p-8 rounded-lg w-full max-w-4xl mx-auto">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg">Generating audio...</p>
                  </div>
                ) : generatedAudio ? (
                  <div className="space-y-6">
                    <audio controls className="w-full">
                      <source src={generatedAudio} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                    <div className="text-center text-gray-500">
                      Generated using {selectedModel} model
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-6">
                      No audio generated yet
                    </p>
                    <button
                      className="px-8 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
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
            <div className="flex justify-center mt-8">
              <button
                className={`w-full max-w-md px-8 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleGenerateAudio}
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate Audio'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AudioGeneration;