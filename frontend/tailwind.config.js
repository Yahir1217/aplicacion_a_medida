/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      padding: {
        'safe': 'env(safe-area-inset-top)',
      }
    },
  },
  plugins: [],
}
