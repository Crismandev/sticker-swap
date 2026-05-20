import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      colors: {
        'bg-base':  '#0a0a0f',
        'bg-card':  '#12121a',
        gold:       '#FAC71E',
        owned:      '#4ade80',
        repeated:   '#FAC71E',
        reject:     '#fb7185',
        foil:       'rgba(192,160,255,0.6)',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      borderRadius: {
        card:   '20px',
        chip:   '10px',
        pill:   '99px',
        button: '12px',
      },
    },
  },
  plugins: [],
}

export default config
