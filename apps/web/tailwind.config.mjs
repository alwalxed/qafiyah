// tailwind.config.mjs
import debugScreens from 'tailwindcss-debug-screens';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      xxs: '20rem' /* 320px */,
      xs: '30rem' /* 480px */,
      sm: '40rem' /* 640px */,
      md: '48rem' /* 768px */,
      lg: '64rem' /* 1024px */,
      xl: '80rem' /* 1280px */,
      '2xl': '96rem' /* 1536px */,
      '3xl': '112rem' /* 1792px */,
      '4xl': '128rem' /* 2048px */,
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-ibm-plex-sans-arabic)'],
      },
    },
  },
  plugins: [debugScreens],
};

export default config;
