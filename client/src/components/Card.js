import React from "react";

function Card({ title, description }) {
  return React.createElement(
    "div",
    { className: "p-6 bg-white rounded-lg shadow-lg text-black hover:scale-105 transition" },
    React.createElement("h3", { className: "font-semibold text-lg" }, title),
    React.createElement("p", { className: "text-gray-600 mt-2" }, description)
  );
}

export default Card;
