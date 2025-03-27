import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const Login = () => {
    const navigate = useNavigate();


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <div className="bg-gray-900 p-8 rounded-xl shadow-xl w-96 border border-purple-600">
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">Welcome to NEXAI</h2>

        {/* Google Button */}
        <button 
          className="w-full flex items-center justify-center bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg mb-4 transition duration-300"
          onClick={() => navigate("/home")}
        >
          <img src="https://img.icons8.com/color/24/google-logo.png" alt="Google" className="mr-2" />
          Continue with Google
        </button>

        {/* Facebook Button */}
        <button 
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-300"
          onClick={() => alert("Facebook Login Clicked")}
        >
          <img src="https://img.icons8.com/ios-filled/24/ffffff/facebook.png" alt="Facebook" className="mr-2" />
          Continue with Facebook
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="w-full h-px bg-gray-700"></div>
          <p className="px-3 text-gray-400">OR</p>
          <div className="w-full h-px bg-gray-700"></div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-400">
          Don't have an account? <button className="text-purple-400 hover:underline">Sign up</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
