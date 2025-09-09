/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'oklch(0.1 0.02 250)',
        foreground: 'oklch(0.95 0.01 250)',
        primary: 'oklch(0.7 0.3 280)',
        'primary-foreground': 'oklch(1 0 0)',
        secondary: 'oklch(0.7 0.25 200)',
        'secondary-foreground': 'oklch(0.1 0 0)',
        muted: 'oklch(0.2 0.02 250)',
        'muted-foreground': 'oklch(0.6 0.01 250)',
        accent: 'oklch(0.8 0.3 320)',
        'accent-foreground': 'oklch(0.1 0 0)',
        destructive: 'oklch(0.6 0.25 25)',
        'destructive-foreground': 'oklch(1 0 0)',
        card: 'oklch(0.15 0.02 250 / 0.4)',
        'card-foreground': 'oklch(0.95 0.01 250)',
        popover: 'oklch(0.15 0.02 250 / 0.8)',
        'popover-foreground': 'oklch(0.95 0.01 250)',
        border: 'oklch(0.7 0.3 280 / 0.4)',
        input: 'oklch(0.1 0.02 250 / 0.3)',
        ring: 'oklch(0.7 0.3 280)',
      },
      fontFamily: {
        sans: ['Oxanium', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
      boxShadow: {
        'md': '0 8px 16px 0 hsl(250 50% 5% / 0.2)',
        'lg': '0 12px 24px 0 hsl(250 50% 5% / 0.3)',
      }
    },
  },
  plugins: [],
}
