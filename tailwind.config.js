/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '420px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4k': '2560px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Quicksand"', 'sans-serif'],
      },
      colors: {
        theme: {
          pink: {
            50: '#fff1f2',
            100: '#ffe4e6',
            200: '#fecdd3',
            300: '#fda4af',
            400: '#fb7185',
            500: '#f43f5e',
            600: '#e11d48',
          },
          lavender: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',
          },
          mint: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
          },
          peach: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
          }
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(182, 190, 204, 0.25)',
        'soft-lg': '0 10px 30px -4px rgba(182, 190, 204, 0.35)',
        'cute-pink': '0 8px 24px -4px rgba(251, 113, 133, 0.25)',
        'cute-purple': '0 8px 24px -4px rgba(167, 139, 250, 0.25)',
        'cute-mint': '0 8px 24px -4px rgba(74, 222, 128, 0.25)',
        'cute-peach': '0 8px 24px -4px rgba(251, 146, 60, 0.25)',
      }
    },
  },
  plugins: [],
}
