/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: '#A31621',
          dark: '#7A0F18',
          deep: '#5C0B12',
          50: '#FBEAEB',
        },
        gold: {
          DEFAULT: '#E8A93B',
          light: '#F6D89C',
          dark: '#C4842A',
        },
        ink: '#1C1B1F',
        paper: '#FBF8F3',
        paper2: '#F4EEE2',
        slate: {
          DEFAULT: '#5B5A63',
          light: '#8B8A93',
        },
        line: '#E7E1D6',
      },
      fontFamily: {
        display: ['var(--font-petrona)', 'Georgia', 'serif'],
        body: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
      },
      maxWidth: {
        container: '1280px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,27,31,0.04), 0 8px 24px rgba(28,27,31,0.06)',
        cardHover: '0 4px 8px rgba(28,27,31,0.06), 0 16px 40px rgba(163,22,33,0.12)',
      },
      borderRadius: {
        card: '0.875rem',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
