import React from "react";
import { FaMicrophone, FaPaperclip } from "react-icons/fa";

function ChatInput() {
  return React.createElement(
    "div",
    { 
      className: "fixed bottom-8 left-1/2 transform -translate-x-1/2 w-[95%] max-w-5xl mx-auto px-4 ml-32"
    },
    React.createElement(
      "div",
      {
        className: "bg-gray-800/90 backdrop-blur-lg p-4 rounded-2xl shadow-lg flex items-center space-x-4 border border-gray-700 w-full"
      },
      React.createElement(FaPaperclip, { 
        className: "text-gray-400 hover:text-purple-400 cursor-pointer transition-colors text-xl" 
      }),
      React.createElement("input", {
        type: "text",
        placeholder: "Type your prompt here...",
        className: "flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-6 py-2 text-lg",
      }),
      React.createElement(
        "button",
        { 
          className: "bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl text-white transition-colors flex items-center justify-center text-lg font-medium"
        },
        "Send"
      ),
      React.createElement(FaMicrophone, { 
        className: "text-gray-400 hover:text-purple-400 cursor-pointer transition-colors text-xl" 
      })
    )
  );
}

export default ChatInput;
