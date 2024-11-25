/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700',
        secondary: '#FFC107',
        dark: '#2D2D2D'
      },
      fontFamily: {
        sans: ['Outfit Variable', 'sans-serif'],
      },
    },
  },
  plugins: [],
}