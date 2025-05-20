import React from 'react';

function TextDisplay({ input, output, timestamp }) {
  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
      <div className="mb-4">
        <h3 className="text-purple-400 font-semibold mb-2">Input</h3>
        <div className="bg-gray-900/30 p-3 rounded-lg">
          <p className="text-gray-300 mb-1">
            <span className="font-medium">Product:</span> {input.product || "Custom Product"}
          </p>
          <p className="text-gray-300">
            <span className="font-medium">Description:</span> {input.description}
          </p>
        </div>
      </div>
      
      <div>
        <h3 className="text-purple-400 font-semibold mb-2">Generated Text</h3>
        <div className="bg-gray-900/30 p-4 rounded-lg">
          <p className="text-white whitespace-pre-wrap">
            {output || <span className="text-red-400 italic">No response generated</span>}
          </p>
        </div>
      </div>
      
      <p className="text-gray-500 text-sm mt-3">
        Generated at: {new Date(timestamp).toLocaleString()}
      </p>
    </div>
  );
}

export default TextDisplay;