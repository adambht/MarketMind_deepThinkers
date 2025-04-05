/* import React from "react";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";

function App() {
  return React.createElement(
    "div",
    { className: "flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-300" },
    React.createElement(Sidebar),
    React.createElement(Home)
  );
}

export default App;
 */


import React,{useEffect,useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Dashboard2 from "./pages/Dashboard-2" 
import AudioGeneration from "./pages/AudioGeneration"
import About from "./pages/About"; // Importer la nouvelle page
import Register from "./pages/Register"; // Importer Register



function App() {
  const[backendData,setBackendData]=useState([{}]);

  useEffect(()=>{
    fetch("http://localhost:3000/api")
    .then((response)=>response.json())
    .then((data)=>setBackendData(data))
  },[])
  return (
    <Router>
      <Routes>
        {/* Redirect "/" to "/login" */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-2" element={<Dashboard2 />} />
        <Route path="/audioGeneration" element={<AudioGeneration />} />
        <Route path="/about" element={<About />} /> {/* Ajout de la route */}

      </Routes>
    </Router>
  );
}

export default App;
