/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1F004E",
        secondary: "#A29F00",
        background: "#FFFFFF",
        text: "#000000",
      },
    },
  },
  plugins: [],
}