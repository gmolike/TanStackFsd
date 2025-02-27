// Konfiguration für ESLint 9.x
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';

// Tell TypeScript to ignore type checking for this file

/* @ts-nocheck */

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Register all plugins at the root level
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      '@tanstack/query': tanstackQuery,
      'jsx-a11y': jsxA11y,
      prettier: prettierPlugin,
      'react-refresh': reactRefresh,
    },
  },
  // Add React settings and basic configuration
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
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
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },
  // React Rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
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
  // JS/TS Common Rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // JavaScript Best Practices
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prefer-const': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'max-len': [
        'warn',
        { code: 100, ignoreUrls: true, ignoreStrings: true, ignoreComments: true },
      ],
    },
  },
  // Import & Sorting Rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Import Rules
      'import/order': 'off', // Deaktiviert, weil wir simple-import-sort verwenden
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off', // TypeScript kümmert sich darum
      'import/newline-after-import': 'error',

      // Simple Import Sort
      'simple-import-sort/imports': 'error', // Vereinfachte Regel für v12+
      'simple-import-sort/exports': 'error',
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
  // TanStack Query Rules - Korrigiert für aktuelle Plugin-Version
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Nur Regeln verwenden, die in der aktuellen Version existieren
      '@tanstack/query/exhaustive-deps': 'error',
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
              group: ['app', '~/app'],
              message: 'Imports from the app layer are not allowed.',
            },
            // pages darf nur von app importiert werden
            {
              group: ['pages/*', '~/pages/*'],
              message: 'Direct imports from pages are not allowed. Import from app instead.',
            },
            // widgets darf nur von app oder pages importiert werden
            {
              group: ['widgets/*', '~/widgets/*'],
              message: 'Widgets can only be imported by app or pages.',
            },
            // features darf nur von app, pages oder widgets importiert werden
            {
              group: ['features/*', '~/features/*'],
              message: 'Features can only be imported by app, pages, or widgets.',
            },
            // entities darf nicht von shared importiert werden
            {
              group: ['entities/*', '~/entities/*'],
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
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  // Prettier Rules - muss am Ende stehen
  {
    files: ['**/*.{js,jsx,ts,tsx,json,css,md}'],
    rules: {
      'prettier/prettier': 'error',
    },
  },
  // Files to ignore
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.eslintrc.cjs',
      '.husky/**',
      '**/*.css',
      '**/*.scss',
    ],
  },
  // Apply prettier config (must be last)
  prettierConfig,
];
