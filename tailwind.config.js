/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#f0f3f9',
          100: '#d9e1f0',
          200: '#b3c3e1',
          300: '#8da5d2',
          400: '#6787c3',
          500: '#4169b4',
          600: '#2d4f8e',
          700: '#1B2B4B',
          800: '#152238',
          900: '#0e1926',
        },
        gold: {
          400: '#d4b96a',
          500: '#C9A84C',
          600: '#a8893a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
