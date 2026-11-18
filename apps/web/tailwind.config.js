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
          gold: '#F5B700',
          goldHover: '#DBA300',
          blue: '#16428C',
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
        },
        // SweetTape inspired tactile palette
        tape: {
          lime: '#B6FE00',
          limeHover: '#A4E800',
          forest: '#013900',
          forestDark: '#034102',
          cream: '#FDFBE8',
          butter: '#FFF1A2',
          yellow: '#FCD805',
          orange: '#FF7E00',
          ink: '#16110A',
          kraft: '#EBE4CC',
          kraftDark: '#DED7B5',
        }
      },
      boxShadow: {
        'bauhaus-red': '4px 4px 0px 0px #C91F32',
        'bauhaus-yellow': '4px 4px 0px 0px #F5B700',
        'bauhaus-white': '4px 4px 0px 0px #FFFFFF',
        'bauhaus-dark': '4px 4px 0px 0px #000000',
        'bauhaus-blue': '4px 4px 0px 0px #16428C',
        'tape': '3px 3px 0px 0px #16110A',
        'tape-lg': '6px 6px 0px 0px #16110A',
        'tape-lime': '4px 4px 0px 0px #B6FE00',
        'tape-yellow': '4px 4px 0px 0px #FCD805',
        'tape-peel': '0 8px 16px -4px rgba(22, 17, 10, 0.35), 4px 4px 0px 0px #16110A',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Inter"', '"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Montserrat"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Inter"', 'sans-serif'],
        apple: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Inter"', 'sans-serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
        syne: ['"Syne"', 'sans-serif'],
        condensed: ['"Bebas Neue"', '"Impact"', '"Arial Narrow"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
