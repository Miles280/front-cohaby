/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#2c3045', // au lieu de #1e202c (plus clair)
        'violet': '#60519b', // violet accent inchangé
        'dark-gray': '#363a54', // au lieu de #31323e, plus clair
        'light-gray': '#bfc0d1', // inchangé
        'section-bg-1': '#43485f', // plus clair que #31323e pour sections
        'section-bg-2': '#384060', // intermédiaire pour la présentation
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