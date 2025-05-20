import React, { useState } from "react";
import { FaMicrophone, FaPaperclip, FaImage, FaFont, FaBox } from "react-icons/fa";

function ChatInput({ onSend, disabled, generationMode }) {
  const [input, setInput] = useState({
    product: "",
    description: ""
  });

  const handleSend = () => {
    if (input.description.trim() === "" || input.product.trim() === "") {
      console.error("Validation failed - both fields are required");
      return;
    }

    console.log("Sending data:", { 
      product: input.product.trim(), 
      description: input.description 
    });

    // Send data to parent component
    onSend({
      product: input.product.trim(),
      description: input.description
    });

    // Only clear fields if send was successful
    setInput({ product: "", description: "" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-[95%] max-w-5xl mx-auto px-4 ml-32">
      <div className="bg-gray-800/90 backdrop-blur-lg p-4 rounded-2xl shadow-lg flex flex-col space-y-3 border border-gray-700 w-full">
        {/* Product Input */}
        <div className="flex items-center">
          <span className="text-gray-300 mr-2 whitespace-nowrap flex items-center">
            <FaBox className="mr-1" /> Product:
          </span>
          <input
            type="text"
            placeholder="Product name (required)"
            value={input.product}
            onChange={(e) => setInput({...input, product: e.target.value})}
            className="flex-1 bg-gray-700/50 outline-none text-white placeholder-gray-400 px-4 py-2 rounded-lg"
            disabled={disabled}
            required
          />
        </div>

        {/* Description Input */}
        <div className="flex items-center space-x-3">
          <button className="text-gray-400 hover:text-purple-400 transition-colors p-2">
            <FaPaperclip className="text-xl" />
          </button>

          <div className="flex-1 relative">
            <textarea
              placeholder={
                generationMode.image && !generationMode.text
                  ? "Describe the image you want to generate..."
                  : "Enter detailed description..."
              }
              value={input.description}
              onChange={(e) => setInput({...input, description: e.target.value})}
              onKeyDown={handleKeyDown}
              className="w-full bg-gray-700/50 outline-none text-white placeholder-gray-400 px-6 py-3 rounded-xl resize-none pr-12"
              rows="1"
              disabled={disabled}
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
              <span className={`text-xs px-2 py-1 rounded ${
                generationMode.text ? "bg-purple-600 text-white" : "bg-gray-600 text-gray-300"
              }`}>
                <FaFont />
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                generationMode.image ? "bg-purple-600 text-white" : "bg-gray-600 text-gray-300"
              }`}>
                <FaImage />
              </span>
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={disabled || input.description.trim() === "" || input.product.trim() === ""}
            className={`px-6 py-3 rounded-xl text-white transition-colors flex items-center justify-center ${
              disabled || input.description.trim() === "" || input.product.trim() === ""
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {disabled ? "Generating..." : "Send"}
          </button>

          <button className="text-gray-400 hover:text-purple-400 transition-colors p-2">
            <FaMicrophone className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;