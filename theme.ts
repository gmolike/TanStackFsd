/** @type {import('tailwindcss').Config} */

import { fontFamily } from 'tailwindcss/defaultTheme';
import { OptionalConfig } from 'tailwindcss/types/config';

export default {
  theme: {
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // BW Colors
        'bw-blue': {
          DEFAULT: 'hsl(var(--bw-blue-base))', // #13293d
          foreground: 'hsl(var(--bw-blue-foreground))', // #ffffff
          medium: 'hsl(var(--bw-blue-medium))', // #2A3E50
          light: 'hsl(var(--bw-blue-light))', // #425464
        },
        'bw-gold': {
          DEFAULT: 'hsl(var(--bw-gold-base))', // #debb6b
          1: 'hsl(var(--bw-gold-base))', // #debb6b
          foreground: 'hsl(var(--bw-gold-foreground))', // #13293d
          dark: 'hsl(var(--bw-gold-dark))', // #c38542
          3: 'hsl(var(--bw-gold-dark))', // #c38542
          light: 'hsl(var(--bw-gold-light))', // #f2e4c4
          2: 'hsl(var(--bw-gold-light))', // #f2e4c4
        },
        'bw-gray': {
          DEFAULT: 'hsl(var(--bw-gray-1))', // #74818e
          foreground: 'hsl(var(--bw-gray-1-foreground))', // #ffffff
          1: 'hsl(var(--bw-gray-1))', // #74818e
          '1-foreground': 'hsl(var(--bw-gray-1-foreground))', // #ffffff
          2: 'hsl(var(--bw-gray-2))', // #a1a9b1
          '2-foreground': 'hsl(var(--bw-gray-1-foreground))', // #ffffff
          3: 'hsl(var(--bw-gray-3))', // #b9bfc4
          '3-foreground': 'hsl(var(--bw-gray-3-foreground))', // #13293d
          4: 'hsl(var(--bw-gray-4))', // #d3d6d9
          '4-foreground': 'hsl(var(--bw-gray-4-foreground))', // #13293d
          5: 'hsl(var(--bw-gray-5))', // #e7e9eb
          '5-foreground': 'hsl(var(--bw-gray-3-foreground))', // #13293d
          6: 'hsl(var(--bw-gray-6))', // #f3f4f5
          '6-foreground': 'hsl(var(--bw-gray-3-foreground))', // #13293d
        },
        'bw-tsk': {
          heer: 'hsl(var(--bw-heer))', // #334811
          luftwaffe: 'hsl(var(--bw-luftwaffe))', // #2f84b0
          marine: 'hsl(var(--bw-marine))', // #183757
          cyber: 'hsl(var(--bw-cyber))', // #537d6c
          san: 'hsl(var(--bw-san))', // #c21411
          skb: 'hsl(var(--bw-skb))', // #d97a0a
          other: 'hsl(var(--bw-altorg))', // ##51646d
        },
        'bw-accent': {
          green: 'hsl(var(--bw-accent-green))', // #006600
          'green-foreground': 'hsl(var(--bw-accent-green-foreground))', // #ffffff
          'green-light': 'hsl(var(--bw-accent-green-light))', // #7BC56B
          'green-light-foreground': 'hsl(var(--bw-accent-green-light-foreground))', // #13293d
          red: 'hsl(var(--bw-accent-red))', // #aa0000
          'red-foreground': 'hsl(var(--bw-accent-red-foreground))', // #ffffff
          'red-light': 'hsl(var(--bw-accent-red-light))', // #ff8484
          'red-light-foreground': 'hsl(var(--bw-accent-red-light-foreground))', // #13293d
          yellow: 'hsl(var(--bw-accent-yellow))', // #f9b600
          'yellow-foreground': 'hsl(var(--bw-accent-red-light-foreground))', // #13293d
          'yellow-light': 'hsl(var(--bw-accent-yellow-light))', // #fbd37c
          'yellow-light-foreground': 'hsl(var(--bw-accent-red-light-foreground))', // #13293d
          blue: 'hsl(var(--bw-accent-blue))', //
          'blue-foreground': 'hsl(var(--bw-accent-blue-foreground))',
          'blue-light': 'hsl(var(--bw-accent-blue-light))', //
        },
        // ShadCn UI
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        display: ['var(--font-display)', ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
    },
  },
} satisfies Partial<OptionalConfig>;
