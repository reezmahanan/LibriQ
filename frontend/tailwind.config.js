/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eaf0f6',
          100: '#d4e0ee',
          200: '#acc1dd',
          300: '#83a2cc',
          400: '#4f78aa',
          500: '#2E6F95',
          600: '#1E3A5F',
          700: '#182e4b',
          800: '#122339',
          900: '#0c1727',
          DEFAULT: '#1E3A5F',
        },
        secondary: {
          50: '#edf5f9',
          100: '#d6e8f2',
          200: '#afd1e4',
          500: '#2E6F95',
          600: '#255a79',
          DEFAULT: '#2E6F95',
        },
        accent: {
          50: '#fffcf5',
          100: '#fef5df',
          200: '#fde9b8',
          300: '#fbd888',
          400: '#f7c458',
          500: '#F4B942',
          600: '#df9f24',
          700: '#b87c14',
          DEFAULT: '#F4B942',
        },
        surface: '#F7F9FC',
        mainText: '#1F2937',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
