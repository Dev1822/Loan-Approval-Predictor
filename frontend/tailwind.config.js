/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#0B0E14',
        'bg-card': '#151A22',
        'bg-input': '#1F2633',
        'primary': '#4F46E5',
        'primary-hover': '#6366F1',
        'secondary': '#7C3AED',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
