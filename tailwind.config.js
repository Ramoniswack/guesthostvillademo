/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFFFFF',
        sand: '#FFFFFF',
        forest: { DEFAULT: '#1F3D2B', dark: '#14291D' },
        sage: { DEFAULT: '#8FA68A', dark: '#4A634C', light: '#D2DDD3' },
        sun: { DEFAULT: '#E5A924', dark: '#C98F12', text: '#8A5D00' },
        navy: '#1F3D2B',
        ink: '#18291E',
        muted: '#4D6153',
        leaf: '#2E6F40',
        meat: '#8A5D00',
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
