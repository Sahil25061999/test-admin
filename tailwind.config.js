/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode:'class',
  theme: {
    extend: {
      boxShadow:{
        "inner-sm":"var(--inset-drop-shadow)"
      },
      colors: {
        "white": "#f9fafb",
        "black": "#141414",
        "primary":"var(--primary-color)"
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
