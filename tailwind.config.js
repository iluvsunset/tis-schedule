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
        sans: ['Montserrat', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Montserrat', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        tis: {
          navy: '#00008A',
          'navy-dark': '#000055',
          'navy-subtle': '#070b24',
          'navy-card': '#0b1236',
          orange: '#ee5421',
          'orange-hover': '#d84413',
          'orange-light': '#ff6b3d',
          'soft-blue': '#f4f7ff',
        },
        od: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          border: 'var(--border)',
          accent: 'var(--accent)',
          fg: 'var(--fg)',
          muted: 'var(--fg-muted)',
        },
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
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'soft': '0 4px 20px -2px rgba(182, 190, 204, 0.25)',
        'soft-lg': '0 10px 30px -4px rgba(182, 190, 204, 0.35)',
      }
    },
  },
  plugins: [],
}
