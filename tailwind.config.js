/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7EF',
        sand: '#F3ECDD',
        forest: { DEFAULT: '#2F4A3A', dark: '#1F3328' },
        sage: { DEFAULT: '#8FA68A', dark: '#566F52', light: '#C7D5C3' }, // sage-dark = readable label text on cream
        sun: { DEFAULT: '#F7941D', dark: '#E0820E', text: '#A85500' },
        navy: '#0B3C5D',
        ink: '#26302A',
        muted: '#5C6859', // slightly darker than brief (#6B7568) to pass AA on sand,
        leaf: '#3F7A4A',
        meat: '#A5422B',
      },
      fontFamily: {
        // Apple system fonts (SF Pro) on Apple devices; Inter is the closest match everywhere else
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', 'Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        warm: '0 14px 34px -16px rgba(47,74,58,.35)',
        soft: '0 6px 18px -8px rgba(47,74,58,.25)',
      },
    },
  },
  plugins: [],
}
