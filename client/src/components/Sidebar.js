import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaBullseye, FaUsers, FaRocket, FaUserCircle, FaVolumeUp, FaImage, FaVideo } from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Trend Analysis", icon: FaChartLine, route: "/dashboard" },
    { name: "Ad Performance", icon: FaBullseye, route: "/ad-performance" },
    { name: "Audience Insights", icon: FaUsers, route: "/audience-insights" },
    { name: "Campaign Management", icon: FaRocket, route: "/campaigns" },
    { name: "Audio Generation", icon: FaVolumeUp, route: "/audioGeneration" },
    { name: "Image Generation", icon: FaImage, route: "/imageGeneration" },
    { name: "Video Generation", icon: FaVideo, route: "/videoGeneration" },
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("authToken"); // Suppression du token
      navigate("/"); // Redirection vers la page de connexion
    }
  };
  

  return React.createElement(
    "div",
    {
      className: "fixed top-0 left-0 w-72 h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col shadow-2xl overflow-hidden",
    },
    // Logo Section
    React.createElement(
      "div",
      { 
        className: "py-6 px-4 border-b border-gray-800 bg-gradient-to-b from-gray-900 to-black sticky top-0 z-10"
      },
      React.createElement(
        "h1",
        { className: "text-3xl font-bold text-purple-400 text-center" },
        "Nexai"
      )
    ),

    // Main Navigation Container
    React.createElement(
      "div",
      { className: "flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800" },
      // New Chat Button
      React.createElement(
        "button",
        {
          className: "w-full flex items-center px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-200 shadow-lg group",
          onClick: () => navigate("/new-chat"),
        },
        React.createElement(FaRocket, { 
          className: "text-white text-xl mr-4 group-hover:scale-110 transition-transform" 
        }),
        React.createElement(
          "span",
          { className: "font-semibold text-lg" },
          "Begin a New Chat"
        )
      ),

      // Dashboard Section
      React.createElement(
        "div",
        { className: "space-y-4" },
        React.createElement(
          "h2",
          { className: "text-gray-400 text-xs font-semibold tracking-wider uppercase px-4" },
          "Dashboard"
        ),
        // Navigation Items
        React.createElement(
          "div",
          { className: "space-y-2" },
          menuItems.map((item) =>
            React.createElement(
              "button",
              {
                key: item.name,
                className: "w-full flex items-center px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-all duration-200 group",
                onClick: () => navigate(item.route),
              },
              React.createElement(item.icon, { 
                className: "text-gray-400 text-xl mr-4 group-hover:text-purple-400 transition-colors" 
              }),
              React.createElement(
                "span",
                { className: "text-gray-300 group-hover:text-white transition-colors" },
                item.name
              )
            )
          )
        )
      )
    ),

    // User Profile Button
    React.createElement(
      "button",
      {
        className: "flex items-center px-8 py-4 bg-gray-800/50 hover:bg-purple-600/50 transition-all duration-200 border-t border-gray-800",
        onClick: handleLogout, // Appelle la fonction handleLogout au clic
      },
      React.createElement(FaUserCircle, { 
        className: "text-gray-400 text-xl mr-4" 
      }),
      React.createElement(
        "span",
        { className: "font-medium" },
        "Log Out"
      )
    )
    
  );
}

export default Sidebar;
