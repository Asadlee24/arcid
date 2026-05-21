/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#020408',
        'bg-secondary': '#0a1020',
        'bg-card': '#0d1929',
        'accent-primary': '#00ff88',
        'accent-secondary': '#0066ff',
        'accent-gold': '#ffd700',
        'text-primary': '#e8f4f8',
        'text-secondary': '#6b8fa8',
      },
      fontFamily: {
        display: ['Orbitron', 'monospace'],
        mono: ['"Space Mono"', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
