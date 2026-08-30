/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          DEFAULT: '#F5F2EB',
          dark: '#E4DFD5',
          light: '#FAF9F6',
        },
        charcoal: {
          DEFAULT: '#1E1E1C',
          light: '#2E2E2C',
          dark: '#111110',
        },
        gold: {
          DEFAULT: '#C59B27',
          light: '#E2B22E',
          dark: '#A68220',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
