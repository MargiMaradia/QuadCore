/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'silk': {
          'charcoal': '#1a1a1a',
          'gold': '#dbc39f',
          'mauve': '#6b6b6b',
          'sand': '#f5f3f0',
          'clay': '#e3dbcf',
        },
      },
    },
  },
  plugins: [],
}

