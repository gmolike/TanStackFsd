/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // FSD-spezifische Farbpalette
        primary: {
          light: '#60a5fa', // blue-400
          DEFAULT: '#3b82f6', // blue-500
          dark: '#2563eb', // blue-600
        },
        secondary: {
          light: '#fb923c', // orange-400
          DEFAULT: '#f97316', // orange-500
          dark: '#ea580c', // orange-600
        },
        accent: {
          light: '#a78bfa', // violet-400
          DEFAULT: '#8b5cf6', // violet-500
          dark: '#7c3aed', // violet-600
        },
        // Schichten-spezifische Farbhinweise (optional)
        app: '#3b82f6',
        pages: '#8b5cf6',
        widgets: '#f97316',
        features: '#14b8a6',
        entities: '#06b6d4',
        shared: '#6366f1',
      },
      // Andere Theme-Erweiterungen hier
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
