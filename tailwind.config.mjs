/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2a7d5f',
        secondary: '#3b82f6',
        accent: '#f59e0b',
        background: '#fdfcfb',
        foreground: '#111110',
      },
      fontFamily: {
        sans: ['var(--font-space)', 'sans-serif'],
        display: ['var(--font-syne)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
