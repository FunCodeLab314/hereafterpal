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
        // Serif for headings - dignified and classic
        serif: ['Playfair Display', 'Crimson Text', 'Lora', 'serif'],
        // Sans-serif for body - modern readability
        sans: ['Inter', 'Source Sans Pro', 'system-ui', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        // Light Mode - Primary memorial palette
        memorial: {
          // Backgrounds
          bg: '#FAF9F7',          // Soft warm white
          surface: '#FFFFFF',     // Pure white
          // Text
          text: '#2C2C2C',        // Deep charcoal
          textSecondary: '#6B6B6B', // Warm gray
          // Accents
          gold: '#C9A961',        // Muted gold
          divider: '#E8E8E8',     // Very light gray
        },
        // Dark Mode - Peaceful night sky
        memorialDark: {
          bg: '#0A0F1C',          // Deep navy blue
          surface: '#141B2D',     // Slightly lighter navy
          text: '#F5F5F5',        // Soft white
          textSecondary: '#B0B0B0', // Light gray
          gold: '#D4AF76',        // Soft amber
          divider: '#1F2937',     // Dark divider
        },
        // Legacy colors (keeping for existing components)
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
      spacing: {
        // Memorial spacing system
        '1': '4px',   // Icon padding, tiny gaps
        '2': '8px',   // Component padding, small gaps
        '4': '16px',  // Card padding, section padding (mobile)
        '6': '24px',  // Section padding (tablet)
        '8': '32px',  // Section gaps (mobile)
        '12': '48px', // Section gaps (tablet/desktop)
        '16': '64px', // Major section dividers
      },
      borderRadius: {
        'memorial': '8px',  // Warm rounded corners
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
      lineHeight: {
        'relaxed': '1.7',
        'loose': '1.8',
      },
      letterSpacing: {
        'heading': '0.02em',  // Slightly increased for elegance
      },
      fontSize: {
        // Mobile-first typography scale
        'xs': '12px',
        'sm': '14px',
        'base': '14px',      // Mobile base
        'base-desktop': '16px', // Desktop base
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
      },
      boxShadow: {
        'memorial': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'memorial-lg': '0 4px 16px rgba(0, 0, 0, 0.08)',
      },
      transitionDuration: {
        '300': '300ms',  // Gentle transitions
      },
      minHeight: {
        'touch': '44px',  // Minimum touch target
      },
      minWidth: {
        'touch': '44px',  // Minimum touch target
      },
    },
  },
  plugins: [],
}
