/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#000000',
          card: '#1C1C1E',
          green: '#34C759',
          text: '#FFFFFF',
          textMuted: '#8E8E93',
          border: '#38383A'
        }
      },
      borderRadius: {
        'ios': '20px'
      }
    },
  },
  plugins: [],
}