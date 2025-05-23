import React from "react";
import Header from "../components/Header"; // Importer un composant existant
import Sidebar from "../components/Sidebar";
import ChatInput from "../components/ChatInput";

import Card from "../components/Card";

function About() {
    return React.createElement(
      "div",
      { className: "flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-300" },
      // Fixed Sidebar
      React.createElement(Sidebar),
      
      // Contenu principal
      React.createElement(
        "div",
        { className: "w-full max-w-7xl" }, 
        React.createElement(Header) // Ajout du Header
      ),
       // Cards Grid
       React.createElement(
        "div",
        { 
          className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 w-full max-w-7xl"
        },
        React.createElement(Card, {
          title: "Sales Strategies",
          description: "Get tailored advice on increasing property visibility and driving sales.",
          className: "text-center" // Added text-center to cards
        }),
        React.createElement(Card, {
          title: "Negotiation Tactics",
          description: "Learn expert negotiation tips to close deals effectively.",
          className: "text-center"
        }),
        React.createElement(Card, {
          title: "Marketing Insights",
          description: "Discover the best marketing strategies to showcase your properties.",
          className: "text-center"
        }),
        React.createElement(Card, {
          title: "General Support",
          description: "Need help with something else? Ask away, and we'll guide you.",
          className: "text-center"
        })
      ),
        // Chat Input at the bottom
        React.createElement(
            "div",
            { className: "mt-auto w-full max-w-4xl" },
            React.createElement(ChatInput)
          )
      
    );
}

export default About; // Correction de l'export
