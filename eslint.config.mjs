// eslint.config.js - JavaScript version with explicit plugin registration
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import tanstackQueryPlugin from '@tanstack/eslint-plugin-query';
import prettierConfig from 'eslint-config-prettier';

// Tell TypeScript to ignore type checking for this file
/* eslint-disable */
/* @ts-nocheck */

// Register all the plugins at the root level
const plugins = {
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooksPlugin, 
    'react-refresh': reactRefreshPlugin,
    'jsx-a11y': jsxA11yPlugin,
    '@tanstack/query': tanstackQueryPlugin
  }
};

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // Register all plugins at the root level to avoid TypeScript errors
  plugins,
  // Add React settings and basic configuration
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // React Rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  // React Hooks Rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  // React Refresh Rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  // JSX A11y rules
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-role': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/heading-has-content': 'warn',
      'jsx-a11y/html-has-lang': 'warn',
      'jsx-a11y/iframe-has-title': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/mouse-events-have-key-events': 'warn',
      'jsx-a11y/no-access-key': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-distracting-elements': 'warn',
      'jsx-a11y/no-interactive-element-to-noninteractive-role': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'warn',
      'jsx-a11y/no-noninteractive-tabindex': 'warn',
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'jsx-a11y/scope': 'warn',
      'jsx-a11y/tabindex-no-positive': 'warn',
    },
  },
  // TanStack Query rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@tanstack/query/exhaustive-deps': 'error',
      '@tanstack/query/prefer-query-object-syntax': 'error',
      '@tanstack/query/stable-query-client': 'error',
    },
  },
  // FSD architecture rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // FSD-specific layer rules
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            // app darf nicht von anderen Schichten importiert werden
            {
              group: ['app'],
              message: 'Imports from the app layer are not allowed.',
            },
            // pages darf nur von app importiert werden
            {
              group: ['pages/*'],
              message: 'Direct imports from pages are not allowed. Import from app instead.',
            },
            // widgets darf nur von app oder pages importiert werden
            {
              group: ['widgets/*'],
              message: 'Widgets can only be imported by app or pages.',
            },
            // features darf nur von app, pages oder widgets importiert werden
            {
              group: ['features/*'],
              message: 'Features can only be imported by app, pages, or widgets.',
            },
            // entities darf nicht von shared importiert werden
            {
              group: ['entities/*'],
              message: 'Entities can not be imported by shared layer.',
            },
          ],
        },
      ],
    },
  },
  // TypeScript specific rules
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  // Files to ignore
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '.eslintrc.cjs'],
  },
  // Apply prettier config (must be last)
  prettierConfig
];