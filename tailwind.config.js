/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#000000',
          elevated: '#08080a',
          surface: '#0f0f12',
          card: '#141418',
          hover: '#1a1a20',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-hover': 'rgba(255, 255, 255, 0.16)',
        },
        zinc: {
          850: '#1e1e24',
          925: '#0d0d10',
          950: '#08080a',
        },
        signal: {
          green: '#10b981',
          'green-dim': 'rgba(16, 185, 129, 0.12)',
          red: '#ef4444',
          'red-dim': 'rgba(239, 68, 68, 0.12)',
          amber: '#f59e0b',
          'amber-dim': 'rgba(245, 158, 11, 0.12)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'Geist', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'subtle-button': 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 1px 3px rgba(0, 0, 0, 0.5)',
        'elevated-card': '0 4px 20px -2px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'modal-depth': '0 24px 48px -12px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'glow-danger': '0 0 30px 2px rgba(239, 68, 68, 0.25)',
        'glow-success': '0 0 30px 2px rgba(16, 185, 129, 0.25)',
      }
    },
  },
  plugins: [],
}
