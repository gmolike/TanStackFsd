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
import playwrightPlugin from 'eslint-plugin-playwright';
import { FlatCompat } from '@eslint/eslintrc';

// Import FSD layer rules
import {
  appLayerRules,
  pagesLayerRules,
  widgetsLayerRules,
  featuresLayerRules,
  entitiesLayerRules,
  sharedLayerRules,
  generalLayerRules,
  testFilesLayerRules,
} from './fsd-import-rules.mjs';

// Tell TypeScript to ignore type checking for this file
/* eslint-disable no-undef */
/* @ts-nocheck */

// Umgebungsvariablen aus process.env lesen
const NODE_ENV = process.env.NODE_ENV || 'development';
const API_URL =
  process.env.API_URL ||
  (NODE_ENV === 'production'
    ? 'https://api.production.com'
    : NODE_ENV === 'staging'
      ? 'https://api.staging.com'
      : 'http://localhost:8090');

console.log(`ESLint läuft mit NODE_ENV=${NODE_ENV}, API_URL=${API_URL}`);

// Erstellen eines FlatCompat-Instanz für ältere Plugins
const compat = new FlatCompat();

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Register all plugins at the root level
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      '@tanstack/query': tanstackQuery,
      'jsx-a11y': jsxA11y,
      prettier: prettierPlugin,
      'react-refresh': reactRefresh,
      playwright: playwrightPlugin,
    },
  },
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
        process: 'readonly',
        API_URL: 'readonly',
        NODE_ENV: 'readonly',
        // Browser-Globals hinzufügen
        document: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
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

      // Erweiterte Simple Import Sort Regeln für FSD
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. React und React-bezogene Importe zuerst
            ['^react$', '^react-dom$', '^react-router-dom', '^react.*'],

            // 2. Externe Bibliotheken (node_modules)
            ['^@?\\w'],

            // 3. FSD-Layers in absteigender Reihenfolge (app → shared)
            ['^~/app(/.*|$)'],
            ['^~/pages(/.*|$)'],
            ['^~/widgets(/.*|$)'],
            ['^~/features(/.*|$)'],
            ['^~/entities(/.*|$)'],
            ['^~/shared(/.*|$)'],

            // 4. Absolute Imports mit anderen Aliasen
            ['^~(/.*|$)'],

            // 5. Relative Imports aus dem übergeordneten Verzeichnis
            ['^\\.\\./'],

            // 6. Relative Imports aus dem gleichen Verzeichnis
            ['^\\./'],

            // 7. Stil-Importe
            ['\\.css$', '\\.scss$', '\\.sass$', '\\.less$', '\\.module\\.css$'],

            // 8. Typdefinitionen
            ['^.+\\.types$', '.*\\.d\\.ts$'],

            // 9. Spezielle Dateien wie JSON, SVG usw.
            ['^.+\\.?(json|svg|png|jpg|jpeg)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  // TanStack Query Rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@tanstack/query/exhaustive-deps': 'error',
    },
  },
  // FSD Architecture Rules - Using imported rules
  generalLayerRules, // Apply general rules first
  appLayerRules, // Then layer-specific overrides
  pagesLayerRules,
  widgetsLayerRules,
  featuresLayerRules,
  entitiesLayerRules,
  sharedLayerRules,
  testFilesLayerRules,
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
  // Playwright-Konfiguration über den FlatCompat-Adapter, falls es env verwendet
  ...compat.config({
    overrides: [
      {
        files: ['**/*.spec.ts', '**/*.test.ts', '**/e2e/**/*.ts', '**/tests/**/*.ts'],
        env: {
          node: true,
          'playwright/playwright': true,
        },
        rules: {
          '@typescript-eslint/no-non-null-assertion': 'off',
          '@typescript-eslint/no-explicit-any': 'off',
          'playwright/expect-expect': 'error',
          'playwright/no-focused-test': 'warn',
          'playwright/no-skipped-test': 'warn',
          'playwright/valid-expect': 'error',
          'playwright/no-conditional-expect': 'error',
          'playwright/no-wait-for-timeout': 'warn',
          'no-restricted-imports': 'off',
        },
      },
    ],
  }),

  // Verzeichnisse, die speziell für Tests sind, von bestimmten Regeln ausschließen
  {
    files: ['**/tests/**', '**/e2e/**', '**/__tests__/**', '**/*.{spec,test}.{ts,tsx}'],
    rules: {
      'no-console': 'off',
      'max-len': 'off',
    },
  },

  // Eine spezielle Regel für die API_URL-Konstante hinzufügen
  {
    files: ['**/shared/config/api.ts', '**/shared/api/base.ts'],
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        'import.meta': 'readonly',
      },
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
      'playwright-report/**',
      'test-results/**',
      'playwright/.cache/**',
    ],
  },
  // Apply prettier config (must be last)
  prettierConfig,
];
