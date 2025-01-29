/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{vue,js}",
    "./pages/**/*.{vue,js}",
    "./app.vue",
    "./error.vue",
    "./layouts/**/*.{vue,js}",
    "./plugins/**/*.{vue,js}",
    "./utils/**/*.{vue,js}",
  ],
  theme: {
    colors: {
        transparent: 'transparent',
        'dark': '#18181b',
        'dark-blue': '#11212d',
        'dark-cyan': '#253745',
        'dark-blue-2': '#4a5c6a',
        'dark-gray': '#9babab',
        'light': '#ccd0cf',
        'green': '#235347',
        'light-green': '#8eb69b',
        'dark-green': '#163832',
        'dark-green-700': '#0b2b26'
      
      },
    extend: {},
  },
  plugins: [],
};