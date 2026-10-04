/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#05070e',
          900: '#070913',
          850: '#0c1023',
          800: '#111730',
          700: '#1b2349',
          border: 'rgba(99, 102, 241, 0.2)',
          glow: 'rgba(79, 172, 254, 0.15)',
        },
        sky: {
          50: '#f8fafc',
          100: '#f1f5fd',
          200: '#e2ebfa',
          300: '#cbdcf7',
        },
        neon: {
          cyan: '#00f2fe',
          blue: '#4facfe',
          purple: '#9d4edd',
          pink: '#f72585',
          amber: '#fbbf24',
          emerald: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 16px rgba(79, 172, 254, 0.6))' },
        }
      }
    },
  },
  plugins: [],
}
