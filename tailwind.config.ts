import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: {
          50: '#eef5ff',
          100: '#dbe8ff',
          200: '#b9d1ff',
          300: '#8aadff',
          400: '#5e86ff',
          500: '#345cff',
          600: '#2545db',
          700: '#1d35ac',
          800: '#192f86',
          900: '#192c69',
          950: '#0f1b3f'
        },
        accent: {
          100: '#fff4e6',
          200: '#ffe2bf',
          300: '#ffcb8c',
          400: '#ffb354',
          500: '#ff941d',
          600: '#ed7b07'
        },
        muted: '#6b7280',
        surface: '#f7f8fb',
        border: '#e5e7eb'
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
