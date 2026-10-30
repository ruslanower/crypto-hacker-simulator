/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#070B11',
        surface: '#0F1722',
        card: '#131E2D',
        neonGreen: '#00FF66',
        neonCyan: '#00F0FF',
        neonAmber: '#FFB800',
        neonRed: '#FF2A55',
        borderDark: '#1E2D3D',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0, 255, 102, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 255, 102, 0.7)' },
        },
      },
    },
  },
  plugins: [],
}
