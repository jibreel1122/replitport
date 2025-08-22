import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'
import rtl from 'tailwindcss-rtl'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}'
  ],
  theme: {
    container: { center: true, padding: '2rem' },
    extend: {
      colors: {
        background: 'hsl(40 33% 98%)',
        foreground: 'hsl(24 10% 10%)',
        muted: 'hsl(30 20% 92%)',
        primary: {
          DEFAULT: 'hsl(24 65% 45%)',
          foreground: '#fff'
        },
        card: {
          DEFAULT: '#fff',
          foreground: 'hsl(24 10% 10%)'
        }
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      },
      boxShadow: {
        soft: '0 6px 24px rgba(0,0,0,0.06)'
      }
    }
  },
  plugins: [animate, rtl]
}

export default config