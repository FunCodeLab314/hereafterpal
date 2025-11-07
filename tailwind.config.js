/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        light: {
          background: '#FBFBFB',
          surface: '#FFFFFF',
          textPrimary: '#262626',
          textSecondary: '#575757',
          primaryButton: '#444444',
          buttonText: '#FFFFFF',
          accent: '#b45309',
          border: '#EBEBEB',
        },
        dark: {
          background: '#0f172a',
          surface: '#1e293b',
          textPrimary: '#f1f5f9',
          textSecondary: '#94a3b8',
          primaryButton: '#e2e8f0',
          buttonText: '#1e293b',
          accent: '#f59e0b',
          border: '#334155',
        },
      },
      borderRadius: {
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}
