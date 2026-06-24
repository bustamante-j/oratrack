/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#071b33',
          900: '#0b2447',
          800: '#11345e',
          700: '#174776',
        },
        skybrand: {
          50: '#effaff',
          100: '#d9f3ff',
          200: '#bceaff',
          300: '#8edcff',
          400: '#58c5fb',
          500: '#2ca7ed',
          600: '#1687ca',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 55, 95, 0.08)',
        glow: '0 24px 70px rgba(44, 167, 237, 0.18)',
        editorial: '0 28px 90px rgba(7, 27, 51, 0.14)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', '"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        editorial: ['Newsreader', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
