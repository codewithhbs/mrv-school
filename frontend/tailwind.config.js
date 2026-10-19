/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // `red` token = brand primary (now navy). Name kept so all pages re-theme.
        red: {
          DEFAULT: '#0B3B8C',
          dark: '#082C6B',
          deep: '#061F4D',
          50: '#EAF1FD',
        },
        navy: {
          DEFAULT: '#0A2A66',
          dark: '#071D49',
          deep: '#05153A',
          light: '#1E4FA8',
        },
        gold: {
          DEFAULT: '#F5B716',
          light: '#FFD76A',
          dark: '#D99A00',
        },
        accent: { pink: '#E5486B', teal: '#14A38B', sky: '#2F80ED' },
        ink: '#0A1F44',
        paper: '#F6F8FC',
        paper2: '#FFF7E8',
        slate: {
          DEFAULT: '#55607A',
          light: '#8A93A8',
        },
        line: '#E3E8F1',
      },
      fontFamily: {
        display: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        script: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        body: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1280px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(10,31,68,0.04), 0 8px 24px rgba(10,31,68,0.07)',
        cardHover: '0 4px 8px rgba(10,31,68,0.06), 0 18px 40px rgba(11,59,140,0.16)',
      },
      borderRadius: {
        card: '1rem',
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
