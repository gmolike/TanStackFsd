import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import prettierConfig from 'eslint-config-prettier';

// ================= ENVIRONMENT CONFIGURATION =================

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

console.log(`🔧 ESLint running in ${NODE_ENV} mode`);

// ================= FSD LAYER RULES =================

const createFSDLayerRules = () => {
  const layers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];

  const createRestrictedImports = (currentLayer) => {
    const currentLayerIndex = layers.indexOf(currentLayer);
    const forbiddenLayers = layers.slice(0, currentLayerIndex);

    if (forbiddenLayers.length === 0) return [];

    return forbiddenLayers.map((layer) => ({
      name: `~/${layer}`,
      message: `${currentLayer} layer cannot import from ${layer} layer. FSD layers must follow hierarchy: shared -> entities -> features -> widgets -> pages -> app`,
    }));
  };

  return layers.map((layer) => ({
    files: [`src/${layer}/**/*.{ts,tsx,js,jsx}`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: createRestrictedImports(layer),
        },
      ],
    },
  }));
};

// ================= BASE CONFIGURATIONS =================

const baseConfig = {
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
      JSX: 'readonly',
      console: 'readonly',
      process: 'readonly',
      window: 'readonly',
      document: 'readonly',
      navigator: 'readonly',
      localStorage: 'readonly',
      sessionStorage: 'readonly',
      fetch: 'readonly',
      URL: 'readonly',
      URLSearchParams: 'readonly',
      FormData: 'readonly',
      File: 'readonly',
      Blob: 'readonly',
      FileReader: 'readonly',
      AbortController: 'readonly',
      ReadableStream: 'readonly',
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
};

// ================= PLUGIN CONFIGURATIONS =================

const pluginsConfig = {
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
    'react-refresh': reactRefreshPlugin,
    'jsx-a11y': jsxA11y,
    import: importPlugin,
    'simple-import-sort': simpleImportSort,
    '@tanstack/query': tanstackQuery,
  },
};

// ================= RULES CONFIGURATIONS =================

const reactRules = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    // React 19 optimized rules
    'react/react-in-jsx-scope': 'off', // Not needed in React 19
    'react/jsx-uses-react': 'off', // Not needed in React 19
    'react/prop-types': 'off', // We use TypeScript
    'react/display-name': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react/no-children-prop': 'error',
    'react/no-danger-with-children': 'error',
    'react/no-deprecated': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-find-dom-node': 'error',
    'react/no-is-mounted': 'error',
    'react/no-render-return-value': 'error',
    'react/no-string-refs': 'error',
    'react/no-unsafe': 'error',
    'react/require-render-return': 'error',
    'react/jsx-key': 'error',
    'react/jsx-no-comment-textnodes': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react/self-closing-comp': 'error',

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // React Refresh (for development)
    'react-refresh/only-export-components': IS_PRODUCTION ? 'off' : 'warn',
  },
};

const accessibilityRules = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    // Core accessibility rules
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/html-has-lang': 'error',
    'jsx-a11y/iframe-has-title': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/interactive-supports-focus': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/media-has-caption': 'warn',
    'jsx-a11y/mouse-events-have-key-events': 'warn',
    'jsx-a11y/no-access-key': 'error',
    'jsx-a11y/no-autofocus': 'warn',
    'jsx-a11y/no-distracting-elements': 'error',
    'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
    'jsx-a11y/no-redundant-roles': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    'jsx-a11y/scope': 'error',
    'jsx-a11y/tabindex-no-positive': 'error',
  },
};

const importRules = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    // Import organization
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // React and React-related imports
          ['^react$', '^react-dom', '^react-router', '^react.*'],

          // External libraries (node_modules)
          ['^@?\\w'],

          // FSD layers (descending hierarchy)
          ['^~/app(/.*|$)'],
          ['^~/pages(/.*|$)'],
          ['^~/widgets(/.*|$)'],
          ['^~/features(/.*|$)'],
          ['^~/entities(/.*|$)'],
          ['^~/shared(/.*|$)'],

          // Other internal imports
          ['^~(/.*|$)'],

          // Relative imports
          ['^\\.\\./'],
          ['^\\./'],

          // Type imports (should be separate)
          ['^.*\\u0000$'],

          // Style imports
          ['\\.css$', '\\.scss$', '\\.sass$', '\\.less$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',

    // Import rules
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off', // TypeScript handles this
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.{ts,tsx,js,jsx}',
          '**/*.spec.{ts,tsx,js,jsx}',
          '**/__tests__/**',
          '**/vitest.config.*',
          '**/vite.config.*',
          '**/playwright.config.*',
          '**/tailwind.config.*',
          '**/eslint.config.*',
        ],
      },
    ],
  },
};

const typeScriptRules = {
  files: ['**/*.{ts,tsx}'],
  rules: {
    // TypeScript 5.7 optimized rules
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'warn',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: false,
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': false,
        'ts-nocheck': false,
        'ts-check': false,
      },
    ],
  },
};

const generalRules = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    // General code quality
    'no-console': IS_PRODUCTION ? 'error' : ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-debugger': IS_PRODUCTION ? 'error' : 'warn',
    'no-alert': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
    'object-shorthand': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'prefer-arrow-callback': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-rename': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-return': 'error',
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true,
      },
    ],

    // Performance
    'no-nested-ternary': 'warn',
    'no-unneeded-ternary': 'error',
    'no-else-return': 'error',

    // Best practices
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-param-reassign': ['error', { props: false }],
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    radix: 'error',
    yoda: 'error',
  },
};

const tanstackQueryRules = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    '@tanstack/query/exhaustive-deps': 'error',
    '@tanstack/query/no-rest-destructuring': 'warn',
    '@tanstack/query/stable-query-client': 'error',
  },
};

// ================= SPECIAL CASE CONFIGURATIONS =================

const testFilesRules = {
  files: [
    '**/*.test.{js,jsx,ts,tsx}',
    '**/*.spec.{js,jsx,ts,tsx}',
    '**/__tests__/**/*.{js,jsx,ts,tsx}',
    '**/tests/**/*.{js,jsx,ts,tsx}',
  ],
  rules: {
    // Relax rules for test files
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'import/no-extraneous-dependencies': 'off',

    // Allow any imports in tests (for testing cross-layer dependencies)
    'no-restricted-imports': 'off',
  },
};

const configFilesRules = {
  files: [
    '*.config.{js,mjs,ts}',
    '**/*.config.{js,mjs,ts}',
    '**/vite.config.*',
    '**/vitest.config.*',
    '**/playwright.config.*',
    '**/tailwind.config.*',
    '**/eslint.config.*',
  ],
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};

const storybookRules = {
  files: ['**/*.stories.{js,jsx,ts,tsx}', '**/.storybook/**/*.{js,jsx,ts,tsx}'],
  rules: {
    'no-restricted-imports': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};

// ================= IGNORE PATTERNS =================

const ignorePatterns = {
  ignores: [
    // Build outputs
    'dist/**',
    'build/**',
    'coverage/**',
    '.next/**',
    '.nuxt/**',

    // Dependencies
    'node_modules/**',
    '.pnpm-store/**',

    // Generated files
    'src/routeTree.gen.ts',
    '**/*.d.ts',

    // IDE and OS
    '.vscode/**',
    '.idea/**',
    '.DS_Store',
    'Thumbs.db',

    // Logs
    '*.log',
    'logs/**',

    // Test outputs
    'playwright-report/**',
    'test-results/**',
    '.playwright/**',

    // Misc
    '.env.*',
    '.vercel/**',
    '.netlify/**',

    // Legacy config files
    '.eslintrc.*',
    '.prettierrc.*',
  ],
};

// ================= MAIN CONFIGURATION EXPORT =================

export default [
  // Base configurations
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // Environment and plugins
  baseConfig,
  pluginsConfig,

  // Core rules
  generalRules,
  reactRules,
  accessibilityRules,
  importRules,
  typeScriptRules,
  tanstackQueryRules,

  // FSD Architecture rules
  ...createFSDLayerRules(),

  // Special cases
  testFilesRules,
  configFilesRules,
  storybookRules,

  // TypeScript project configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Prettier (must be last to override formatting rules)
  prettierConfig,

  // Ignore patterns
  ignorePatterns,
];
