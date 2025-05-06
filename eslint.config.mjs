import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';
import playwrightPlugin from 'eslint-plugin-playwright';
import { FlatCompat } from '@eslint/eslintrc';
import importPlugin from 'eslint-plugin-import';
import { tanstackConfig } from '@tanstack/eslint-config';

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

// Environment setup
const NODE_ENV = process.env.NODE_ENV || 'development';
const API_URL = process.env.API_URL || getDefaultApiUrl(NODE_ENV);

console.log(`ESLint running with NODE_ENV=${NODE_ENV}, API_URL=${API_URL}`);

// Helper function for API URL
function getDefaultApiUrl(env) {
  const urls = {
    production: 'https://api.production.com',
    staging: 'https://api.staging.com',
    development: 'http://localhost:8090',
  };
  return urls[env] || urls.development;
}

// Create FlatCompat instance for legacy plugins
const compat = new FlatCompat();

// Configuration Sections
const baseConfig = [js.configs.recommended, ...tseslint.configs.recommended];

// Define all plugins in one place to avoid duplication
const pluginsConfig = {
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
    'simple-import-sort': simpleImportSort,
    '@tanstack/query': tanstackQuery,
    'jsx-a11y': jsxA11y,
    prettier: prettierPlugin,
    'react-refresh': reactRefresh,
    playwright: playwrightPlugin,
    import: importPlugin, // Import plugin defined once here
  },
};

const environmentConfig = {
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
};

// Rule configurations
const reactRules = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
  },
};

const reactHooksRules = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};

const reactRefreshRules = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
};

const commonJsRules = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'prefer-const': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'max-len': ['warn', { code: 100, ignoreUrls: true, ignoreStrings: true, ignoreComments: true }],
    'sort-imports': ['error', { ignoreMemberSort: true, ignoreDeclarationSort: true }],
  },
};

// Import rules defined separately with no plugin reference
const importRules = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    // Import plugin rules
    'import/order': 'off',
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off',
    'import/newline-after-import': 'error',
    
    // FSD import groups configuration
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // React imports
          ['^react$', '^react-dom$', '^react-router-dom', '^react.*'],

          // External libraries (node_modules)
          ['^@?\\w'],

          // FSD layers (descending order)
          ['^~/app(/.*|$)'],
          ['^~/pages(/.*|$)'],
          ['^~/widgets(/.*|$)'],
          ['^~/features(/.*|$)'],
          ['^~/entities(/.*|$)'],
          ['^~/shared(/.*|$)'],

          // Other absolute imports
          ['^~(/.*|$)'],

          // Relative imports from parent directory
          ['^\\.\\./'],

          // Relative imports from same directory
          ['^\\./'],

          // Style imports
          ['\\.css$', '\\.scss$', '\\.sass$', '\\.less$', '\\.module\\.css$'],

          // Type definitions
          ['^.+\\.types$', '.*\\.d\\.ts$'],

          // Special files (JSON, SVG, etc.)
          ['^.+\\.?(json|svg|png|jpg|jpeg)$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
  },
};

const tanstackQueryRules = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    '@tanstack/query/exhaustive-deps': 'error',
  },
};

const typescriptRules = {
  files: ['**/*.{ts,tsx}'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
  },
};

const jsonRules = {
  files: ['**/*.{js,json}'],
  rules: {
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
  },
};

// Special configurations
const testFilesExceptions = {
  files: ['**/tests/**', '**/e2e/**', '**/__tests__/**', '**/*.{spec,test}.{ts,tsx}'],
  rules: {
    'no-console': 'off',
    'max-len': 'off',
  },
};

const apiConfigExceptions = {
  files: ['**/shared/config/api.ts', '**/shared/api/base.ts'],
  rules: {
    'no-undef': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
};

const viteModuleExceptions = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  languageOptions: {
    globals: {
      'import.meta': 'readonly',
    },
  },
};

const prettierRules = {
  files: ['**/*.{js,jsx,ts,tsx,json,css,md}'],
  rules: {
    'prettier/prettier': 'error',
  },
};

const ignorePatterns = {
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
};

// Playwright configuration via FlatCompat
const playwrightConfig = compat.config({
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
});

// Filter tanstack config to avoid plugin conflicts
const filteredTanstackConfig = tanstackConfig.map(config => {
  // If this config entry contains plugins, filter out any plugins 
  // we're already defining to avoid conflicts
  if (config.plugins) {
    const filteredPlugins = { ...config.plugins };
    // Remove any plugins we're defining ourselves
    Object.keys(pluginsConfig.plugins).forEach(plugin => {
      delete filteredPlugins[plugin];
    });
    
    return {
      ...config,
      plugins: filteredPlugins
    };
  }
  return config;
});

// Export the final ESLint config
export default [
  // Base configurations
  ...filteredTanstackConfig,
  ...baseConfig,
  pluginsConfig,
  environmentConfig,

  // Rule configurations
  reactRules,
  reactHooksRules,
  reactRefreshRules,
  commonJsRules,
  importRules,
  tanstackQueryRules,

  // FSD Architecture Rules
  generalLayerRules,
  appLayerRules,
  pagesLayerRules,
  widgetsLayerRules,
  featuresLayerRules,
  entitiesLayerRules,
  sharedLayerRules,
  testFilesLayerRules,

  // TypeScript specific rules
  typescriptRules,
  jsonRules,

  // Playwright configuration
  ...playwrightConfig,

  // Special case configurations
  testFilesExceptions,
  apiConfigExceptions,
  viteModuleExceptions,

  // Ignore patterns
  ignorePatterns,

  // Prettier configuration (must be last)
  prettierRules,
  prettierConfig,
];