// Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from '@react-oauth/google'; // Changed this import



const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isTraditionalLogin, setIsTraditionalLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) navigate("/home");
  }, [navigate]); // ← Added navigate here
  
  

  const handleTraditionalLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });
  
      if (data.success) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 
        "Login failed. Please try again."
      );
    }
  };



  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        console.log('Google response:', response); // Debug log

        const res = await axios.post(
            'http://localhost:5000/api/auth/google',
            { access_token: response.access_token },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
        );

        console.log('Backend response:', res.data); // Debug log

        if (res.data.success) {
          localStorage.setItem('authToken', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          navigate('/home', { replace: true }); // Force navigation
          window.location.reload(); // Ensure page updates
        }
      } catch (error) {
        console.error('Full error:', error.response?.data || error.message);
        setErrorMessage('Google login failed. Please try again.');
      }
    },
    onError: () => {
      setErrorMessage('Google login failed');
    },
    flow: 'implicit'
  });

// In your component's JSX


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <div className="bg-gray-900 p-8 rounded-xl shadow-xl w-96 border border-purple-600">
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">Welcome to NEXAI</h2>

        {!isTraditionalLogin ? (
          <>
            <button
                className="w-full flex items-center justify-center bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg mb-4"
                onClick={handleGoogleLogin} // Now triggers Google OAuth
            >
              <img src="https://img.icons8.com/color/24/google-logo.png" alt="Google" className="mr-2" />
              Continue with Google
            </button>

            <button
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mb-6"
              onClick={() => alert("Facebook login coming soon")}
            >
              <img src="https://img.icons8.com/ios-filled/24/ffffff/facebook.png" alt="Facebook" className="mr-2" />
              Continue with Facebook
            </button>

            <div className="flex items-center my-6">
              <div className="w-full h-px bg-gray-700"></div>
              <p className="px-3 text-gray-400">OR</p>
              <div className="w-full h-px bg-gray-700"></div>
            </div>

            <button
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg"
              onClick={() => setIsTraditionalLogin(true)}
            >
              Login with Email
            </button>

            <p className="text-center text-gray-400 mt-4">
              Don't have an account?{" "}
              <button className="text-purple-400 hover:underline" onClick={() => navigate("/register")}>
                Sign up
              </button>
            </p>
          </>
        ) : (
          <form onSubmit={handleTraditionalLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-6 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg mb-4"
            >
              Login
            </button>
            <button
              type="button"
              className="w-full text-purple-400 hover:underline mb-4"
              onClick={() => setIsTraditionalLogin(false)}
            >
              Back to social login
            </button>
            <p className="text-center text-gray-400">
              Forgot password?{" "}
              <button className="text-purple-400 hover:underline" onClick={() => alert("Reset password")}>
                Reset it
              </button>
            </p>
            {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
