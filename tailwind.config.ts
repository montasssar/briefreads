/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind v4 works without content globs, but including them is fine for Next
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
