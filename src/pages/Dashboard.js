import React from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, 
  PieChart, Pie, Cell, AreaChart, Area, ResponsiveContainer
} from "recharts";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const data = [
  { name: "Jan", Facebook: 200, Instagram: 300, Twitter: 150, TikTok: 400, LinkedIn: 120 },
  { name: "Feb", Facebook: 250, Instagram: 350, Twitter: 180, TikTok: 450, LinkedIn: 140 },
  { name: "Mar", Facebook: 300, Instagram: 400, Twitter: 200, TikTok: 500, LinkedIn: 160 },
  { name: "Apr", Facebook: 280, Instagram: 420, Twitter: 210, TikTok: 550, LinkedIn: 170 },
];

const pieData = [
  { name: "Facebook", value: 4000 },
  { name: "Instagram", value: 2400 },
  { name: "Twitter", value: 2000 },
  { name: "TikTok", value: 3000 },
  { name: "LinkedIn", value: 1800 },
];

const engagementData = [
  { platform: "Facebook", likes: 1200, shares: 800, comments: 500 },
  { platform: "Instagram", likes: 1500, shares: 900, comments: 600 },
  { platform: "Twitter", likes: 1000, shares: 700, comments: 400 },
  { platform: "TikTok", likes: 1800, shares: 1200, comments: 800 },
  { platform: "LinkedIn", likes: 900, shares: 500, comments: 300 },
];

const COLORS = ["#3b5998", "#E1306C", "#1DA1F2", "#69C9D0", "#0077B5"];

function TrendDashboard() {
  const navigate = useNavigate();

  return React.createElement(
    "div",
    { className: "flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-300" },
    React.createElement(Sidebar),
    React.createElement(
      "div",
      { className: "flex-1 p-8 overflow-auto" },
      React.createElement("h1", { className: "text-white text-3xl font-bold mb-6" }, "Social Media Trend Analysis"),
      React.createElement(
        "button",
        { 
          className: "absolute top-4 right-4 bg-transparent text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-200",
          onClick: () => navigate("/dashboard-2") 
        },
        "→"
      ),
      React.createElement(
        "div",
        { className: "grid grid-cols-1 md:grid-cols-2 gap-8" },
        React.createElement(
          "div",
          { className: "bg-gray-800 p-6 rounded-lg shadow-xl" },
          React.createElement("h2", { className: "text-white text-xl mb-4" }, "Trending Posts Over Time"),
          React.createElement(LineChart, { width: 500, height: 300, data: data },
            React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
            React.createElement(XAxis, { dataKey: "name", stroke: "#fff" }),
            React.createElement(YAxis, { stroke: "#fff" }),
            React.createElement(Tooltip),
            React.createElement(Legend),
            React.createElement(Line, { type: "monotone", dataKey: "Facebook", stroke: "#4267B2", strokeWidth: 2 }),
            React.createElement(Line, { type: "monotone", dataKey: "Instagram", stroke: "#E1306C", strokeWidth: 2 }),
            React.createElement(Line, { type: "monotone", dataKey: "Twitter", stroke: "#1DA1F2", strokeWidth: 2 }),
            React.createElement(Line, { type: "monotone", dataKey: "TikTok", stroke: "#000000", strokeWidth: 2 }),
            React.createElement(Line, { type: "monotone", dataKey: "LinkedIn", stroke: "#0077B5", strokeWidth: 2 })
          )
        ),
        React.createElement(
          "div",
          { className: "bg-gray-800 p-6 rounded-lg shadow-xl" },
          React.createElement("h2", { className: "text-white text-xl mb-4" }, "New Histogram Chart"),
          React.createElement(BarChart, { width: 500, height: 300, data: data },
            React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
            React.createElement(XAxis, { dataKey: "name", stroke: "#fff" }),
            React.createElement(YAxis, { stroke: "#fff" }),
            React.createElement(Tooltip),
            React.createElement(Legend),
            React.createElement(Bar, { dataKey: "Facebook", stackId: "a", fill: "#4267B2" }),
            React.createElement(Bar, { dataKey: "Instagram", stackId: "a", fill: "#E1306C" }),
            React.createElement(Bar, { dataKey: "Twitter", stackId: "a", fill: "#1DA1F2" })
          )
        ),
        React.createElement(
          "div",
          { className: "bg-gray-800 p-6 rounded-lg shadow-xl" },
          React.createElement("h2", { className: "text-white text-xl mb-4" }, "Social Media Share Distribution"),
          React.createElement(PieChart, { width: 500, height: 300 },
            React.createElement(Pie, { data: pieData, cx: 200, cy: 150, outerRadius: 100, fill: "#8884d8", dataKey: "value", label: true },
              pieData.map((entry, index) => React.createElement(Cell, { key: `cell-${index}`, fill: COLORS[index % COLORS.length] }))
            )
          )
        ),
        React.createElement(
          "div",
          { className: "bg-gray-800 p-6 rounded-lg shadow-xl" },
          React.createElement("h2", { className: "text-white text-xl mb-4" }, "Engagement Over Time"),
          React.createElement(AreaChart, { width: 500, height: 300, data: engagementData },
            React.createElement(CartesianGrid, { strokeDasharray: "3 3" }),
            React.createElement(XAxis, { dataKey: "platform", stroke: "#fff" }),
            React.createElement(YAxis, { stroke: "#fff" }),
            React.createElement(Tooltip),
            React.createElement(Legend),
            React.createElement(Area, { type: "monotone", dataKey: "likes", stroke: "#FF5733", fill: "#FF5733" }),
            React.createElement(Area, { type: "monotone", dataKey: "shares", stroke: "#33FF57", fill: "#33FF57" }),
            React.createElement(Area, { type: "monotone", dataKey: "comments", stroke: "#3357FF", fill: "#3357FF" })
          )
        )
      )
    )
  );
}

export default TrendDashboard;
