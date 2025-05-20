import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaBullseye, FaUsers, FaRocket, FaUserCircle, FaVolumeUp, FaImage, FaVideo, FaStore, FaLightbulb } from "react-icons/fa";

function Sidebar({ generatedText }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Trend Analysis", icon: FaChartLine, route: "/dashboard" },
    { name: "Ad Performance", icon: FaBullseye, route: "/ad-performance" },
    { name: "Audience Insights", icon: FaUsers, route: "/audience-insights" },
    { name: "Campaign Management", icon: FaRocket, route: "/campaigns" },
    { name: "Audio Generation", icon: FaVolumeUp, route: "/audioGeneration" },
    { name: "Image Generation", icon: FaImage, route: "/imageGeneration" },
    { name: "Video Generation", icon: FaVideo, route: "/videoGeneration" },
    { name: "Tunisian Ad Generator", icon: FaStore, route: "/tunisian-ad" },
    { 
      name: "Ad Recommendations", 
      icon: FaLightbulb, 
      route: "/recommendations",
      requiresGeneratedText: true
    },
  ];

  const handleMenuItemClick = (item) => {
    if (item.requiresGeneratedText && !generatedText) {
      alert("Please generate some text first to view recommendations");
      return;
    }
    
    if (item.route === "/recommendations") {
      navigate(item.route, { state: { generatedText } });
    } else {
      navigate(item.route);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("authToken");
      navigate("/");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-72 h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col shadow-2xl overflow-hidden">
      {/* Logo Section */}
      <div className="py-6 px-4 border-b border-gray-800 bg-gradient-to-b from-gray-900 to-black sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-purple-400 text-center">Nexai</h1>
      </div>

      {/* Main Navigation Container */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
        {/* New Chat Button */}
        <button
          className="w-full flex items-center px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-200 shadow-lg group"
          onClick={() => navigate("/new-chat")}
        >
          <FaRocket className="text-white text-xl mr-4 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-lg">Begin a New Chat</span>
        </button>

        {/* Dashboard Section */}
        <div className="space-y-4">
          <h2 className="text-gray-400 text-xs font-semibold tracking-wider uppercase px-4">Dashboard</h2>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-all duration-200 group ${
                  item.requiresGeneratedText && !generatedText ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handleMenuItemClick(item)}
                disabled={item.requiresGeneratedText && !generatedText}
              >
                <item.icon className="text-gray-400 text-xl mr-4 group-hover:text-purple-400 transition-colors" />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile Button */}
      <button
        className="flex items-center px-8 py-4 bg-gray-800/50 hover:bg-purple-600/50 transition-all duration-200 border-t border-gray-800"
        onClick={handleLogout}
      >
        <FaUserCircle className="text-gray-400 text-xl mr-4" />
        <span className="font-medium">Log Out</span>
      </button>
    </div>
  );
}

export default Sidebar;