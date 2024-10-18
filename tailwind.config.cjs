// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './app.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        'vue-green': '#42b883',
        'vue-dark': '#35495e',
        'light-gray': '#eaeaea',
        'dark-gray': '#2c3e50',
        white: '#ffffff',
        black: '#000000',
        red: '#ff4c4c',
        blue: '#42a5f5',
        'card-grey': '#646464',
        'lighter-card-grey': '#4B4B4B',
      },
    },
  },
  plugins: [],
};
