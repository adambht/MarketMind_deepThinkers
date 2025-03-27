import React from "react";
import { FaMicrophone, FaPaperclip } from "react-icons/fa";

function ChatInput() {
  return React.createElement(
    "div",
    { className: "fixed bottom-4 w-2/3 mx-auto flex items-center bg-gray-800 p-4 rounded-full shadow-lg" },
    React.createElement(FaPaperclip, { className: "text-gray-400 mx-2" }),
    React.createElement("input", {
      type: "text",
      placeholder: "Type your prompt here",
      className: "flex-1 bg-transparent outline-none text-white px-4",
    }),
    React.createElement(
      "button",
      { className: "bg-purple-500 px-4 py-2 rounded-full text-white" },
      "➜"
    ),
    React.createElement(FaMicrophone, { className: "text-gray-400 mx-2" })
  );
}

export default ChatInput;
