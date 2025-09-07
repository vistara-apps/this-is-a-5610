/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 95%, 45%)',
        accent: 'hsl(30, 90%, 55%)',
        bg: 'hsl(210, 15%, 97%)',
        surface: 'hsl(210, 15%, 100%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(210, 15%, 20%, 0.1)',
      },
    },
  },
  plugins: [],
}