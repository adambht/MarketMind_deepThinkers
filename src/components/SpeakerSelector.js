// src/components/SpeakerSelector.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SpeakerSelector = ({ onSpeakerSelect, selectedSpeaker }) => {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Speaker details mapping
  const speakerDetails = {
    Karl: { gender: 'Male', style: 'Professional', description: 'Deep and confident voice' },
    Roger: { gender: 'Male', style: 'Casual', description: 'Warm and friendly tone' },
    Lily: { gender: 'Female', style: 'Professional', description: 'Clear and articulate voice' },
    liam: { gender: 'Male', style: 'Youthful', description: 'Energetic and engaging' },
    Maisie: { gender: 'Female', style: 'Natural', description: 'Soft and soothing voice' },
    Mason: { gender: 'Male', style: 'Dynamic', description: 'Versatile and expressive' },
    Mark: { gender: 'Male', style: 'Business', description: 'Authoritative and trustworthy' },
    james: { gender: 'Male', style: 'Casual', description: 'Relatable and conversational' },
    laura: { gender: 'Female', style: 'Professional', description: 'Polished and precise' },
    William: { gender: 'Male', style: 'Formal', description: 'Sophisticated and refined' },
    Neerja: { gender: 'Female', style: 'International', description: 'Multicultural perspective' }
  };

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/speakers');
        
        if (response.data.success) {
          setSpeakers(response.data.speakers);
        } else {
          throw new Error(response.data.error || 'Failed to load speakers');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setSpeakers(['Karl', 'Roger', 'Lily']);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  const handleSpeakerClick = (speaker) => {
    onSpeakerSelect(speaker);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8 bg-red-50 rounded-xl">
        <p className="font-semibold">Error loading speakers</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {speakers.map((speaker) => {
        const details = speakerDetails[speaker] || {
          gender: 'Unspecified',
          style: 'Standard',
          description: 'Professional voice actor'
        };
        
        return (
          <div
            key={speaker}
            onClick={() => onSpeakerSelect(speaker)}
            className={`
              relative cursor-pointer rounded-xl overflow-hidden
              transition-all duration-300 transform hover:scale-102
              ${selectedSpeaker === speaker 
                ? 'ring-4 ring-purple-600 shadow-xl bg-purple-50' 
                : 'bg-white shadow-md hover:shadow-xl'
              }
            `}
          >
            <div className="p-6 space-y-4">
              {/* Speaker Avatar & Name */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl font-bold">
                  {speaker.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{speaker}</h3>
                  <span className="text-sm text-purple-600">{details.gender}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600">{details.description}</p>

              {/* Voice Sample Button */}
              <div className="flex items-center space-x-2">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Add sample playback functionality
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-purple-700">Play Sample</span>
                </button>
              </div>

              {/* Style Badge */}
              <div className="absolute bottom-4 right-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {details.style}
                </span>
              </div>

              {/* Selection Indicator */}
              {selectedSpeaker === speaker && (
                <div className="absolute top-4 right-4">
                  <div className="bg-purple-600 text-white p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SpeakerSelector;