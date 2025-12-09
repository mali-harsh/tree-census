/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2d8659',
      },
      animation: {
        slideInDown: 'slideInDown 0.4s ease-out',
        slideInUp: 'slideInUp 0.4s ease-out',
        slideInLeft: 'slideInLeft 0.4s ease-out',
        slideInRight: 'slideInRight 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
