/** @type {import('tailwindcss').Config} */

/* ==========================================================================
   COZY CREAM PALETTE
   Every Tailwind colour family used in the app is re-generated from a warm,
   slightly desaturated HSL ramp. Existing utility classes (text-slate-500,
   bg-amber-100, border-rose-200 ...) therefore recolour automatically into
   latte / oat / butter / blush / sage / misty-blue / lavender pastels.
   ========================================================================== */
const hslToHex = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
};

const STOPS = { 50: 97, 100: 93, 200: 86, 300: 77, 400: 66, 500: 57, 600: 47, 700: 38, 800: 29, 900: 21, 950: 13 };

const ramp = (h, s) =>
  Object.fromEntries(Object.entries(STOPS).map(([k, l]) => [k, hslToHex(h, s, l)]));

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
      spacing: {
        '4.5': '1.125rem',
      },
      fontFamily: {
        sans: ['Nunito', '"Baloo 2"', 'ui-rounded', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Baloo 2"', 'Nunito', 'ui-rounded', 'system-ui', 'sans-serif'],
        // "mono" is used all over the app for times / small labels: keep it round & friendly.
        mono: ['Nunito', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      colors: {
        white: '#ffffff',
        // Warm latte neutrals (replaces cold slate)
        slate: ramp(30, 20),
        gray: ramp(30, 16),
        zinc: ramp(30, 14),
        neutral: ramp(30, 14),
        stone: ramp(30, 18),
        // Soft pastel accents
        amber: ramp(38, 62),
        yellow: ramp(44, 66),
        orange: ramp(18, 66),
        rose: ramp(354, 58),
        red: ramp(6, 56),
        pink: ramp(335, 50),
        sky: ramp(201, 46),
        blue: ramp(214, 42),
        cyan: ramp(188, 36),
        teal: ramp(170, 30),
        emerald: ramp(150, 30),
        green: ramp(140, 30),
        indigo: ramp(248, 34),
        violet: ramp(262, 34),
        purple: ramp(276, 32),
        tis: {
          navy: '#00008A',
          'navy-dark': '#000055',
          orange: '#ee5421',
          'orange-hover': '#d84413',
          'orange-light': '#ff6b3d',
          cream: '#f4f1e6',
        },
        od: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          border: 'var(--border)',
          accent: 'var(--accent)',
          fg: 'var(--fg)',
          muted: 'var(--fg-muted)',
        },
        cream: {
          DEFAULT: '#f4f1e6',
          50: '#fffdf7',
          100: '#faf7ee',
          200: '#f4f1e6',
          300: '#ece7d6',
          400: '#e1dac3',
          500: '#d1c8ac',
        },
        cocoa: {
          300: '#b8a994',
          500: '#8f7d69',
          700: '#6b5a4a',
          900: '#4a3b2f',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        '2xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'soft': 'var(--shadow-sm)',
        'soft-lg': 'var(--shadow-md)',
        'puffy': 'var(--shadow-puffy)',
      },
    },
  },
  plugins: [],
}
