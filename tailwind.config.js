/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        primary: '#2563eb',
        'primary-light': '#3b82f6',
        'primary-dark': '#1d4ed8',
        muted: {
          DEFAULT: '#64748b',
          foreground: '#64748b',
        },
      },
      backdropBlur: { glass: '12px' },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.06)',
        'glass-hover': '0 16px 48px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
