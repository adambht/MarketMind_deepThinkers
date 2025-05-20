import React, { useState, useEffect, useRef } from "react";
import ChatInput from "../components/ChatInput";
import Sidebar from "../components/Sidebar";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Home() {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState({
    text: false,
    image: false,
    audio: false,
    video: false
  });
  const [conversationHistory, setConversationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noOptionSelected, setNoOptionSelected] = useState(false);
  const [generatedText, setGeneratedText] = useState(null); // Track generated text for recommendations
  const conversationEndRef = useRef(null);
  const containerRef = useRef(null);
  
  const API = {
    text: "http://localhost:5000/api/generate-text",
    image: "https://ff8c-34-122-208-73.ngrok-free.app/generate",
    //listImages: "https://ff8c-34-122-208-73.ngrok-free.app/list-images"
  };

  const handleOptionToggle = (option) => {
    const newOptions = {
      ...selectedOptions,
      [option]: !selectedOptions[option]
    };
    setSelectedOptions(newOptions);
    setNoOptionSelected(!Object.values(newOptions).some(opt => opt));
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(API.listImages, {
          headers: {
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "true"
          }
        });
        
        if (!response.ok) throw new Error("Failed to load images");
        
        const data = await response.json();
        const formatted = data.images.map(img => ({
          type: "ai",
          prompt: img.prompt,
          responses: [{
            type: "image",
            content: {
              image_url: img.url.startsWith('/get-image/') 
                ? `${API.image.split('/generate')[0]}${img.url}`
                : `${API.image.split('/generate')[0]}/get-image${img.url}`
            }
          }],
          timestamp: new Date().toISOString()
        }));
        
        setConversationHistory(prev => [...formatted, ...prev]);
      } catch (err) {
        console.error("Image load error:", err);
        setError("Failed to load existing images");
      }
    };
    
    fetchImages();
  }, []);

  const generateContent = async (promptData) => {
    if (!Object.values(selectedOptions).some(opt => opt)) {
      setNoOptionSelected(true);
      return;
    }
    
    setLoading(true);
    setError(null);
    setNoOptionSelected(false);
    
    const turnTimestamp = new Date().toISOString();
    
    try {
      // Combine product and description for display
      const userPromptText = `${promptData.product ? `Product: ${promptData.product}\n` : ''}${promptData.description ? `Description: ${promptData.description}` : ''}`;
      
      setConversationHistory(prev => [...prev, {
        type: "user",
        prompt: userPromptText,
        timestamp: turnTimestamp,
        originalData: promptData
      }]);
      
      const aiResponseEntry = {
        type: "ai",
        prompt: userPromptText,
        timestamp: turnTimestamp,
        responses: []
      };

      // Text Generation
      if (selectedOptions.text) {
        const textResponse = await fetch(API.text, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(promptData)
        });
        
        if (!textResponse.ok) {
          const errorData = await textResponse.json();
          throw new Error(errorData.message || "Text generation failed");
        }

        const { generatedText } = await textResponse.json();
        aiResponseEntry.responses.push({
          type: "text",
          content: generatedText
        });
        // Store the generated text for recommendations
        setGeneratedText(generatedText);
      }

      // Image Generation
      if (selectedOptions.image) {
        const imagePrompt = aiResponseEntry.responses.find(r => r.type === "text")?.content || 
                          promptData.description || 
                          promptData.product;
        
        const imgResponse = await fetch(API.image, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({ prompt: imagePrompt })
        });
        
        if (!imgResponse.ok) {
          const imgError = await imgResponse.json();
          throw new Error("Image generation failed");
        }
        
        const imgData = await imgResponse.json();
        const imageUrl = imgData.image_url.startsWith('/get-image/')
          ? `${API.image.split('/generate')[0]}${imgData.image_url}`
          : `${API.image.split('/generate')[0]}/get-image${imgData.image_url}`;
        
        aiResponseEntry.responses.push({
          type: "image",
          content: {
            image_url: imageUrl
          }
        });
      }
      
      if (aiResponseEntry.responses.length > 0) {
        setConversationHistory(prev => [...prev, aiResponseEntry]);
      } else {
        throw new Error("No content generated - please check your options");
      }
      
    } catch (err) {
      console.error("Generation error:", err);
      setError(err.message);
      setConversationHistory(prev => prev.filter(entry => 
        !(entry.type === "user" && entry.timestamp === turnTimestamp)
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-300">
      {/* Pass generatedText to Sidebar */}
      <Sidebar generatedText={generatedText} />
      
      {/* Main content area with proper scrolling */}
      <div className="flex-1 ml-72 flex flex-col h-screen">
        {/* Sticky options bar */}
        <div className="sticky top-0 z-10 bg-gray-800/90 backdrop-blur-sm p-4 border-b border-gray-700">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold">Generate Options</h3>
              {noOptionSelected && (
                <div className="text-red-300 text-sm">
                  Please select at least one option
                </div>
              )}
            </div>
            <div className="flex space-x-2 mt-2">
              {Object.entries(selectedOptions).map(([option, isSelected]) => (
                <button
                  key={option}
                  onClick={() => handleOptionToggle(option)}
                  className={`py-1 px-3 rounded-md text-sm transition-colors ${
                    isSelected
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable conversation area */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto p-20 pb-40"
        >
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {conversationHistory.map((entry, index) => (
                <div key={`${entry.timestamp}-${index}`} className="space-y-4">
                  {entry.type === "user" && (
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <div className="text-purple-300 font-medium">You:</div>
                      <div className="text-white mt-1 whitespace-pre-wrap">
                        {entry.prompt}
                      </div>
                    </div>
                  )}
                  
                  {entry.type === "ai" && (
                    <div className="bg-gray-800/70 p-4 rounded-lg">
                      <div className="text-green-300 font-medium">AI Response:</div>
                      {entry.responses.map((response, idx) => (
                        <div key={idx}>
                          {response.type === "text" && (
                            <div className="text-white mt-1 whitespace-pre-wrap">
                              {response.content}
                            </div>
                          )}
                          {response.type === "image" && (
                            <div className="mt-2">
                              <img 
                                src={response.content.image_url} 
                                alt="Generated content" 
                                className="max-w-full h-auto rounded"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={conversationEndRef} />
            </div>
          </div>
        </div>

        {/* Fixed chat input at bottom */}
        <div className="max-w-4xl mx-auto">
          <ChatInput 
            onSend={generateContent}
            disabled={loading}
            generationMode={selectedOptions}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;