import React from "react";
import Header from "../components/Header";
import ChatInput from "../components/ChatInput";
import Card from "../components/Card";
import Sidebar from "../components/Sidebar"; // Import Sidebar

function Home() {
  return React.createElement(
    "div",
    { className: "flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-300" }, // Ensure the container takes full screen height
    React.createElement(Sidebar, { className: "h-full" }), // Sidebar with full height
    React.createElement(
      "div",
      { className: "flex-1 flex flex-col items-center justify-center p-8 relative" }, // Main content
      React.createElement(Header),
      React.createElement(
        "div",
        { className: "grid grid-cols-2 md:grid-cols-4 gap-6 mt-8" },
        React.createElement(Card, {
          title: "Sales Strategies",
          description: "Get tailored advice on increasing property visibility and driving sales.",
        }),
        React.createElement(Card, {
          title: "Negotiation Tactics",
          description: "Learn expert negotiation tips to close deals effectively.",
        }),
        React.createElement(Card, {
          title: "Marketing Insights",
          description: "Discover the best marketing strategies to showcase your properties.",
        }),
        React.createElement(Card, {
          title: "General Support",
          description: "Need help with something else? Ask away, and we'll guide you.",
        })
      ),
      React.createElement(ChatInput)
    )
  );
}

export default Home;
