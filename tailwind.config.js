export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'esb': {
          'navy': '#000000',
          'royal': '#21e9c5',
          'blue': '#21e9c5',
          'sky': '#a2fece',
          'gold': '#fef7da',
          'green': '#00ffb2',
          'amber': '#fd88fd',
          'red': '#e0b8ff',
          'slate': '#ffffff',
          'pink': '#f7cdfe',
          'mint': '#a2fece',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        accent: ['Kalam', 'cursive'],
      },
      borderRadius: {
        'indo': '24px',
        'indo-sm': '12px',
      },
      boxShadow: {
        'indo': '4px 4px 0 #000',
        'indo-md': '4px 4px 0 #000',
        'indo-lg': '8px 8px 0 #000',
        'indo-hover': '2px 2px 0 #000',
        'indo-active': '0 0 0 #000',
      },
    },
  },
  plugins: [],
}
