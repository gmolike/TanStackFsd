import tailwindPlugin from 'prettier-plugin-tailwindcss';

/** @type {import("prettier").Config} */
export default {
  plugins: [tailwindPlugin],
  semi: true,
  tabWidth: 2,
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  jsxSingleQuote: false,
  bracketSpacing: true,
  endOfLine: 'auto',
  overrides: [
    {
      files: '*.json',
      options: {
        parser: 'json',
        trailingComma: 'none'
      }
    }
  ]
};