/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bingooo: {
          dark: '#111111',
          black: '#0A0A0A',
          card: '#161616',
          border: '#282828',
          red: '#C91F32',
          redHover: '#B01828',
          gold: '#F5B700', // Bauhaus primary yellow / gold
          goldHover: '#DBA300',
          blue: '#16428C', // Bauhaus cobalt accent
          cream: '#F7F5F0',
          muted: '#8E8E93',
        },
        bauhaus: {
          red: '#C91F32',
          yellow: '#F5B700',
          blue: '#16428C',
          dark: '#111111',
          black: '#0A0A0A',
          surface: '#181818',
          border: '#333333',
          cream: '#F7F5F0',
          white: '#FFFFFF',
        }
      },
      boxShadow: {
        'bauhaus-red': '4px 4px 0px 0px #C91F32',
        'bauhaus-yellow': '4px 4px 0px 0px #F5B700',
        'bauhaus-white': '4px 4px 0px 0px #FFFFFF',
        'bauhaus-dark': '4px 4px 0px 0px #000000',
        'bauhaus-blue': '4px 4px 0px 0px #16428C',
      },
      fontFamily: {
        sans: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
