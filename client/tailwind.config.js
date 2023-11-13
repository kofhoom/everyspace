/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.tsx",
    "./src/components/**/*.tsx",
    "./pages/**/*.tsx",
  ],
  theme: {
    extend: {},
    screens: {
      sm: { max: "500px" },
      ms: { max: "690px" },
      md: { max: "768px" },
      lg: { max: "1024px" },
    },
  },
  plugins: [],
};
