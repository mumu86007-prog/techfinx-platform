/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A84FF',
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CCFF',
          300: '#66B2FF',
          400: '#3399FF',
          500: '#0A84FF',
          600: '#0066CC',
          700: '#004D99',
          800: '#003366',
          900: '#001A33',
        },
        secondary: {
          DEFAULT: '#5E5CE6',
          50: '#F0F0FF',
          100: '#E1E1FF',
          200: '#C3C3FF',
          300: '#A5A5FF',
          400: '#8787FF',
          500: '#5E5CE6',
          600: '#4B4BB8',
          700: '#38388A',
          800: '#25255C',
          900: '#12122E',
        },
        success: '#34C759',
        warning: '#FF9500',
        error: '#FF3B30',
        background: '#F2F2F7',
        surface: '#FFFFFF',
        'text-primary': '#1C1C1E',
        'text-secondary': '#8A8A8E',
        border: '#E5E5EA',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      spacing: {
        'xs': '4px',
        's': '8px',
        'm': '16px',
        'l': '24px',
        'xl': '32px',
        'xxl': '48px',
      },
      borderRadius: {
        's': '8px',
        'm': '12px',
        'l': '16px',
      },
      boxShadow: {
        'light': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'heavy': '0 8px 25px rgba(0, 0, 0, 0.2)',
        'floating': '0 12px 40px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'loading': 'loading 1.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        loading: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}
