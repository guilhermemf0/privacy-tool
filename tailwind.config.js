/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cobalt: {
          DEFAULT: '#3B6CF8',
          light: '#5A85FF',
          dark: '#2952D9',
        },
        surface: {
          DEFAULT: '#1e293b',
          muted: '#263348',
          border: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'tactile': '0 1px 3px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3)',
        'tactile-lg': '0 4px 6px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.4)',
        'tactile-pressed': 'inset 0 2px 6px rgba(0,0,0,0.5)',
        'cobalt-glow': '0 0 20px rgba(59, 108, 248, 0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-ring': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 108, 248, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(59, 108, 248, 0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'medal-drop': {
          '0%': { opacity: '0', transform: 'translateY(-30px) scale(0.8)' },
          '60%': { transform: 'translateY(6px) scale(1.04)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s ease-out forwards',
        'scale-in': 'scale-in 0.35s ease-out forwards',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'medal-drop': 'medal-drop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
    },
  },
  plugins: [],
}
