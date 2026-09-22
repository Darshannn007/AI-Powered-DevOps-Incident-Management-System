/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F4F6F8',       // Soft off-white canvas
          card: '#FFFFFF',     // Crisp white cards
          dark: '#111827',     // Deep slate text
          muted: '#6B7280',    // Secondary text
          border: '#E5E7EB',   // Subtle borders
          emerald: '#059669',  // Primary Accent Green from screenshot
          emeraldLight: '#10B981',
          emeraldDark: '#047857',
          mintBg: '#ECFDF5',   // Mint pill background
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
