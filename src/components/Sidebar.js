import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaBullseye, FaUsers, FaRocket, FaUserCircle } from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  // Navigation Items
  const menuItems = [
    { name: "Trend Analysis", icon: FaChartLine, route: "/dashboard" },
    { name: "Ad Performance", icon: FaBullseye, route: "/ad-performance" },
    { name: "Audience Insights", icon: FaUsers, route: "/audience-insights" },
    { name: "Campaign Management", icon: FaRocket, route: "/campaigns" },
  ];

  return React.createElement(
    "div",
    {
      className: "w-64 h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col p-4 shadow-lg",
    },

    // Logo
    React.createElement(
      "div",
      { className: "text-2xl font-bold text-purple-400 text-center mb-6" },
      "Nexai"
    ),

    // Buttons Container
    React.createElement(
      "div",
      { className: "flex flex-col space-y-3 flex-grow" },

      // "New Chat" Button
      React.createElement(
        "button",
        {
          className:
            "w-full flex items-center justify-center space-x-2 p-3 bg-gray-800 rounded-lg hover:bg-purple-600 transition-all duration-200",
          onClick: () => navigate("/new-chat"),
        },
        React.createElement(FaRocket, { className: "text-white" }),
        "Begin a New Chat"
      ),

      // Section Title
      React.createElement(
        "h2",
        { className: "text-gray-400 text-sm mt-4 mb-2 uppercase" },
        "Dashboard"
      ),

      // Navigation Buttons (Looping through menuItems)
      ...menuItems.map((item) =>
        React.createElement(
          "button",
          {
            key: item.name,
            className:
              "flex items-center space-x-2 p-3 bg-gray-800 rounded-lg hover:bg-purple-600 transition-all duration-200",
            onClick: () => navigate(item.route),
          },
          React.createElement(item.icon, { className: "text-white" }),
          item.name
        )
      )
    ),

    // User Profile Button (Moved up slightly)
    React.createElement(
      "button",
      {
        className:
          "flex items-center justify-center space-x-2 p-3 bg-gray-800 rounded-lg hover:bg-purple-600 transition-all duration-200 mt-4",
        onClick: () => navigate("/profile"),
      },
      React.createElement(FaUserCircle, { className: "text-white text-xl" }),
      "User Profile"
    )
  );
}

export default Sidebar;
