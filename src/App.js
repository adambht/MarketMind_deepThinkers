import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Dashboard2 from "./pages/Dashboard-2";
import AudioGeneration from "./pages/AudioGeneration";
import About from "./pages/About";
import Register from "./pages/Register";
import TunisianAdGeneration from "./pages/TunisianAdGeneration";
import Recommendations from "./pages/Recommendations";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-300">
          <Sidebar />
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard-2" element={<Dashboard2 />} />
              <Route path="/audioGeneration" element={<AudioGeneration />} />
              <Route path="/about" element={<About />} />
              <Route path="/tunisian-ad" element={<TunisianAdGeneration />} />
              <Route path="/recommendations" element={<Recommendations />} />
            </Routes>
          </div>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;