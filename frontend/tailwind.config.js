/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'silk': {
          'sand': '#f5f1eb',
          'charcoal': '#1a1a1a',
          'gold': '#dbc39f',
          'mauve': '#554149',
          'clay': '#e3dbcf',
        },
      },
    },
  },
  plugins: [],
}

