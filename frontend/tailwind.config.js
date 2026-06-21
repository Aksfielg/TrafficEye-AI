/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        asphalt: '#14171B',
        amber: '#FFB627',
        violation: '#E2462F',
        radar: '#3FC1C9',
        concrete: '#9CA3AF',
        paper: '#F2F1ED',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      keyframes: {
        scanline: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        }
      },
      animation: {
        scanline: 'scanline 2s linear forwards',
      }
    },
  },
  plugins: [],
}
