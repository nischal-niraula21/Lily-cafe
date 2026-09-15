/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lily: {
          bg: '#0b0908',
          panel: '#15110e',
          gold: '#d9ad5f',
          cream: '#f4ead9'
        }
      }
    },
  },
  plugins: [],
};
