/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'phish-email': '#6366f1', // indigo
        'phish-sms': '#14b8a6', // teal
        'phish-voice': '#f97316', // orange
        'phish-generic': '#8b5cf6', // violet
      },
    },
  },
  plugins: [],
}

