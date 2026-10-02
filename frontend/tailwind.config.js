/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#141B2D',
          cream: '#F6F2EA',
          orange: '#C73E1D',
          amber: '#FFD580',
          'amber-dark': '#D97706',
          green: '#2D6A4F',
        }
      },
      fontFamily: {
        serif: ['Source Serif 4', 'Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
