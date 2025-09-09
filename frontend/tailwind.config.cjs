/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        'background-main': '#111827',
        'background-secondary': '#1F2937',
        success: '#10B981',
        warning: '#FBBF24',
        error: '#EF4444',
        'text-main': '#F9FAFB',
        'text-secondary': '#9CA3AF',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'lg': '12px',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(157, 78, 221, 0.5)', // Primary Accent glow
      }
    },
  },
  plugins: [],
}
