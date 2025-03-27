import React from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ScatterChart, Scatter, ResponsiveContainer
} from "recharts";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

// Data
const data = [
  { name: "Jan", Facebook: 4000, Instagram: 2400, Twitter: 2400, LinkedIn: 2400 },
  { name: "Feb", Facebook: 3000, Instagram: 1398, Twitter: 2210, LinkedIn: 2500 },
  { name: "Mar", Facebook: 2000, Instagram: 9800, Twitter: 2290, LinkedIn: 2100 },
  { name: "Apr", Facebook: 2780, Instagram: 3908, Twitter: 2000, LinkedIn: 1800 },
];


const pieData = [
  { name: "Facebook", value: 4000 },
  { name: "Instagram", value: 3000 },
  { name: "Twitter", value: 2500 },
  { name: "LinkedIn", value: 5000 },
];

const radarData = [
  { subject: "Mon", Facebook: 120, Instagram: 110, Twitter: 100, LinkedIn: 90 },
  { subject: "Tue", Facebook: 150, Instagram: 130, Twitter: 120, LinkedIn: 110 },
  { subject: "Wed", Facebook: 180, Instagram: 150, Twitter: 140, LinkedIn: 120 },
  { subject: "Thu", Facebook: 220, Instagram: 200, Twitter: 180, LinkedIn: 150 },
];

const scatterData = [
  { x: 10, y: 2000, z: 100 },
  { x: 20, y: 2500, z: 130 },
  { x: 30, y: 3000, z: 160 },
  { x: 40, y: 3500, z: 190 },
  { x: 50, y: 4000, z: 220 },
];

// Updated Colors
const COLORS = ["#4267B2", "#E4405F", "#1DA1F2", "#0077B5"]; // Facebook, Instagram, Twitter, LinkedIn

function TrendDashboard2() {
  const navigate = useNavigate();

  return React.createElement(
    "div",
    { className: "flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-300" },
    React.createElement(Sidebar),
    React.createElement(
      "div",
      { className: "flex-1 p-8 overflow-auto" },
      React.createElement("h1", { className: "text-white text-3xl font-bold mb-6" }, "Advanced Trend Analysis"),
      React.createElement("button", { 
        className: "absolute top-4 right-4 bg-transparent text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-200",
        onClick: () => navigate("/dashboard") 
      }, "←"),
      
      // Main Content
      React.createElement(
        "div",
        { className: "grid grid-cols-1 md:grid-cols-2 gap-8" },
        
        // Line Chart
        React.createElement(
          "div",
          { className: "bg-gray-800 p-6 rounded-lg shadow-xl" },
          React.createElement("h2", { className: "text-white text-xl mb-4" }, "Social Media Trend Over Time"),
          React.createElement(LineChart, { width: 500, height: 300, data: data },
            React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
            React.createElement(XAxis, { dataKey: "name", stroke: "#fff" }),
            React.createElement(YAxis, { stroke: "#fff" }),
            React.createElement(Tooltip),
            React.createElement(Legend),
            React.createElement(Line, { type: "monotone", dataKey: "Facebook", stroke: "#4267B2", strokeWidth: 2 }),
            React.createElement(Line, { type: "monotone", dataKey: "Instagram", stroke: "#E4405F", strokeWidth: 2 }),
            React.createElement(Line, { type: "monotone", dataKey: "Twitter", stroke: "#1DA1F2", strokeWidth: 2 }),
            React.createElement(Line, { type: "monotone", dataKey: "LinkedIn", stroke: "#0077B5", strokeWidth: 2 })
          )
        ),

        // Pie Chart
        React.createElement(
          "div",
          { className: "bg-gray-800 p-6 rounded-lg shadow-xl" },
          React.createElement("h2", { className: "text-white text-xl mb-4" }, "Social Media Distribution"),
          React.createElement(PieChart, { width: 500, height: 300 },
            React.createElement(Pie, { data: pieData, cx: 200, cy: 150, outerRadius: 100, fill: "#8884d8", dataKey: "value", label: true },
              pieData.map((entry, index) => React.createElement(Cell, { key: `cell-${index}`, fill: COLORS[index % COLORS.length] }))
            )
          )
        ),

        // Radar Chart
        React.createElement(
          "div",
          { className: "bg-gray-800 p-6 rounded-lg shadow-xl" },
          React.createElement("h2", { className: "text-white text-xl mb-4" }, "Radar Chart: Social Media Performance"),
          React.createElement(RadarChart, { outerRadius: 150, width: 500, height: 300, data: radarData },
            React.createElement(PolarGrid),
            React.createElement(PolarAngleAxis, { dataKey: "subject" }),
            React.createElement(PolarRadiusAxis, { angle: 30, domain: [0, 250] }),
            React.createElement(Radar, { name: "Facebook", dataKey: "Facebook", stroke: "#4267B2", fill: "#4267B2", fillOpacity: 0.6 }),
            React.createElement(Radar, { name: "Instagram", dataKey: "Instagram", stroke: "#E4405F", fill: "#E4405F", fillOpacity: 0.6 }),
            React.createElement(Radar, { name: "Twitter", dataKey: "Twitter", stroke: "#1DA1F2", fill: "#1DA1F2", fillOpacity: 0.6 }),
            React.createElement(Radar, { name: "LinkedIn", dataKey: "LinkedIn", stroke: "#0077B5", fill: "#0077B5", fillOpacity: 0.6 })
          )
        ),
        
        // Scatter Chart
        React.createElement(
          "div",
          { className: "bg-gray-800 p-6 rounded-lg shadow-xl" },
          React.createElement("h2", { className: "text-white text-xl mb-4" }, "User Engagement Comparison"),
          React.createElement(ScatterChart, { width: 500, height: 300 },
            React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
            React.createElement(XAxis, { dataKey: "x", stroke: "#fff" }), 
            React.createElement(YAxis, { stroke: "#fff" }), 
            React.createElement(Tooltip),
            React.createElement(Legend),
            React.createElement(Scatter, { name: "Facebook", data: scatterData, fill: "#4267B2" }),
            React.createElement(Scatter, { name: "Instagram", data: scatterData, fill: "#E4405F" }),
            React.createElement(Scatter, { name: "Twitter", data: scatterData, fill: "#1DA1F2" })
          )
        ),
        
        // Table
        React.createElement(
          "div",
          { className: "bg-gray-800 p-6 rounded-lg shadow-xl col-span-2" },
          React.createElement("h2", { className: "text-white text-xl mb-4" }, "Social Media Data Table"),
          React.createElement(
            "table", 
            { className: "min-w-full table-auto text-white" },
            React.createElement(
              "thead", 
              null,
              React.createElement(
                "tr", 
                null,
                React.createElement("th", { className: "border px-4 py-2" }, "Month"),
                React.createElement("th", { className: "border px-4 py-2" }, "Facebook"),
                React.createElement("th", { className: "border px-4 py-2" }, "Instagram"),
                React.createElement("th", { className: "border px-4 py-2" }, "Twitter"),
                React.createElement("th", { className: "border px-4 py-2" }, "LinkedIn")
              )
            ),
            React.createElement(
              "tbody", 
              null,
              data.map((row, index) => 
                React.createElement(
                  "tr", 
                  { key: index },
                  React.createElement("td", { className: "border px-4 py-2" }, row.name),
                  React.createElement("td", { className: "border px-4 py-2" }, row.Facebook),
                  React.createElement("td", { className: "border px-4 py-2" }, row.Instagram),
                  React.createElement("td", { className: "border px-4 py-2" }, row.Twitter),
                  React.createElement("td", { className: "border px-4 py-2" }, row.LinkedIn)
                )
              )
            )
          )
        )
      )
    )
  );
}

export default TrendDashboard2;
