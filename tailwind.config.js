/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "cold-violet": "#8A2BE2", // Cold Violet
        "dark-violet": "#6A0DAD", // Dark Violet
      },
    },
  },
  plugins: [],
}

