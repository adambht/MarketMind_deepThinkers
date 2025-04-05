import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isTraditionalLogin, setIsTraditionalLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Pour afficher les erreurs

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté
    const token = localStorage.getItem("authToken");
    if (token) {
      // Si un token est trouvé, rediriger vers la page d'accueil
      navigate("/home");
    }
  }, [navigate]);

  const handleTraditionalLogin = (e) => {
    e.preventDefault();

    const loginData = { email, password };

    if (!email || !password) {
      setErrorMessage("Please fill in both email and password fields.");
      return;
    }

    axios
      .post("http://localhost:3000/login", loginData)
      .then((response) => {
        console.log("Login successful:", response.data);
        // Sauvegarde du token dans le localStorage
        localStorage.setItem("authToken", response.data.token);
        navigate("/home");
      })
      .catch((error) => {
        console.error("Login failed:", error.response ? error.response.data : error);
        setErrorMessage("Login failed: " + (error.response ? error.response.data.message : "Unknown error"));
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <div className="bg-gray-900 p-8 rounded-xl shadow-xl w-96 border border-purple-600">
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">Welcome to NEXAI</h2>

        {!isTraditionalLogin ? (
          <>
            {/* Social Login Buttons */}
            <button
              className="w-full flex items-center justify-center bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg mb-4 transition duration-300"
              onClick={() => navigate("/home")}
            >
              <img src="https://img.icons8.com/color/24/google-logo.png" alt="Google" className="mr-2" />
              Continue with Google
            </button>

            <button
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-300 mb-6"
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

            {/* Traditional Login Toggle */}
            <button
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg transition duration-300"
              onClick={() => setIsTraditionalLogin(true)}
            >
              Login with Email
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-gray-400 mt-4">
              Don't have an account?{" "}
              <button className="text-purple-400 hover:underline" onClick={() => navigate("/register")}>
                Sign up
              </button>
            </p>
          </>
        ) : (
          <>
            {/* Traditional Login Form */}
            <form onSubmit={handleTraditionalLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mb-6 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />

              <button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg transition duration-300 mb-4"
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
                <button className="text-purple-400 hover:underline" onClick={() => alert("Password reset")}>
                  Reset it
                </button>
              </p>

              {/* Affichage des erreurs de connexion */}
              {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
