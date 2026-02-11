export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'esb': {
          'navy': '#1B2A4A',
          'royal': '#2E5090',
          'blue': '#3B82F6',
          'sky': '#60A5FA',
          'gold': '#F59E0B',
          'green': '#10B981',
          'amber': '#F59E0B',
          'red': '#EF4444',
          'slate': '#F1F5F9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
