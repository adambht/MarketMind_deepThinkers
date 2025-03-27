import React from "react";

function Header() {
  return React.createElement(
    "div",
    { className: "text-center" },
    React.createElement(
      "h1",
      { className: "text-3xl font-bold text-white" },
      "How can we ",
      React.createElement("span", { className: "text-purple-400" }, "assist"),
      " you today?"
    ),
    React.createElement(
      "p",
      { className: "text-gray-300 mt-2" },
      "Get expert guidance powered by AI agents specializing in Sales, Marketing, and Negotiation."
    )
  );
}

export default Header;
