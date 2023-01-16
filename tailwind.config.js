/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "gelato-button": "#1C4BA3",
      },
    },
  },
  plugins: [require("daisyui")],
};
