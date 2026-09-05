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
        command: {
          bg: '#0B0F19',
          card: '#111827',
          cardHover: '#1F2937',
          border: '#1F293D',
          accent: '#10B981',
          accentGlow: '#059669',
          highlight: '#3B82F6',
          warning: '#F59E0B',
          danger: '#EF4444'
        },
        greenScore: {
          excellent: '#10B981',
          good: '#3B82F6',
          moderate: '#F59E0B',
          poor: '#F97316',
          critical: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'glow-blue': '0 0 20px -5px rgba(59, 130, 246, 0.3)',
        'glow-amber': '0 0 20px -5px rgba(245, 158, 11, 0.3)',
        'glow-red': '0 0 20px -5px rgba(239, 68, 68, 0.3)',
      }
    },
  },
  plugins: [],
}
