/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3A86FF',
        secondary: '#FFBE0B',
        accent: '#F4A261',
        dark: '#1F2937',
        light: '#F9FAFB',
        grayish: '#6B7280',
      },
      fontFamily: {
        'sans': ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '25px',
        'lg': '8px',
      }
    }
  },
  plugins: [],
}