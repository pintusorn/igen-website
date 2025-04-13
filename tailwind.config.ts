import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
	playfair: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config

