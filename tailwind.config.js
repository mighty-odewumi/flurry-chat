/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{jsx, js, ts, tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryblue: "#4a86b7",
        bluegradient: "#2448b1",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
}
