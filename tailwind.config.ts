import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: {
          50: '#e8f8ff',
          100: '#c8edff',
          200: '#97deff',
          300: '#63ceff',
          400: '#35bfff',
          500: '#14b8ff',
          600: '#089ee3',
          700: '#067db4',
          800: '#065f87',
          900: '#064264',
          950: '#032438'
        },
        accent: {
          100: '#0b1524',
          200: '#0f1f38',
          300: '#102a4e',
          400: '#0c3567',
          500: '#0a4387',
          600: '#0a4ea3'
        },
        muted: '#6b7a90',
        surface: '#f2f6fb',
        border: '#d8e2f2'
      },
      boxShadow: {
        card: '0 15px 45px rgba(18, 38, 63, 0.12)',
        soft: '0 10px 30px rgba(0,0,0,0.08)'
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2.5s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 1 }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}

export default config
