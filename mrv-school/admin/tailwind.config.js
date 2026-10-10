/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        red: { DEFAULT: '#A31621', dark: '#7A0F18', 50: '#FBEAEB' },
        gold: { DEFAULT: '#E8A93B', light: '#F6D89C', dark: '#C4842A' },
        ink: '#1C1B1F',
        paper: '#F7F7F9',
        line: '#E5E4EA',
        slate: { DEFAULT: '#5B5A63', light: '#8B8A93' },
      },
      fontFamily: {
        display: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,27,31,0.04), 0 4px 12px rgba(28,27,31,0.06)',
      },
    },
  },
  plugins: [],
};
