/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f9f5',
          100: '#e1f2e8',
          500: '#1b6e41',
          600: '#145733',
          700: '#104529',
          800: '#0c3520',
          900: '#082617'
        },
        sage: {
          50: '#f8faf8',
          100: '#edf2ed',
          200: '#dce5dd',
          300: '#c2d2c4',
          500: '#7a9e7f'
        },
        warm: {
          50: '#faf8f5',
          100: '#f3eee6',
          200: '#e7ddd0',
          300: '#d5c4b1'
        }
      }
    },
  },
  plugins: [],
}
