/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
    fadeUp: {
      '0%': { opacity: '0', transform: 'translateY(16px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },

  },
      colors: {
        accent: {
          light: '#0AB5CB',
          dark: '#379AE6',
        },
        bg: {
          light: '#FFFFFF',
          dark: '#0C111D',
        },
      },
    },
  },
  plugins: [],
}




