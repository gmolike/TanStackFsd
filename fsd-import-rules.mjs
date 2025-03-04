// fsd-import-rules.mjs
const appLayerRules = {
  files: ['**/app/**/*.{js,jsx,ts,tsx}'],
  rules: {
    // App can import from any layer
    'no-restricted-imports': 'off',
  },
};

const pagesLayerRules = {
  files: ['**/pages/**/*.{js,jsx,ts,tsx}'],
  rules: {
    // Pages can import from everything except app
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '^(~/app|app)(/.*)?$',
              '^(/app)(/.*)?$',
              '^(./app)(/.*)?$',
              '^(../app)(/.*)?$',
              '^(../../app)(/.*)?$',
            ],
            message: 'Pages cannot import from the app layer.',
          },
        ],
      },
    ],
  },
};

const widgetsLayerRules = {
  files: ['**/widgets/**/*.{js,jsx,ts,tsx}'],
  rules: {
    // Widgets can import from features, entities, shared
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '^(~/app|app)(/.*)?$',
              '^(/app)(/.*)?$',
              '^(./app)(/.*)?$',
              '^(../app)(/.*)?$',
              '^(../../app)(/.*)?$',
            ],
            message: 'Widgets cannot import from the app layer.',
          },
          {
            group: [
              '^(~/pages|pages)(/.*)?$',
              '^(/pages)(/.*)?$',
              '^(./pages)(/.*)?$',
              '^(../pages)(/.*)?$',
              '^(../../pages)(/.*)?$',
            ],
            message: 'Widgets cannot import from the pages layer.',
          },
        ],
      },
    ],
  },
};

const featuresLayerRules = {
  files: ['**/features/**/*.{js,jsx,ts,tsx}'],
  rules: {
    // Features can import from entities, shared
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '^(~/app|app)(/.*)?$',
              '^(/app)(/.*)?$',
              '^(./app)(/.*)?$',
              '^(../app)(/.*)?$',
              '^(../../app)(/.*)?$',
            ],
            message: 'Features cannot import from the app layer.',
          },
          {
            group: [
              '^(~/pages|pages)(/.*)?$',
              '^(/pages)(/.*)?$',
              '^(./pages)(/.*)?$',
              '^(../pages)(/.*)?$',
              '^(../../pages)(/.*)?$',
            ],
            message: 'Features cannot import from the pages layer.',
          },
          {
            group: [
              '^(~/widgets|widgets)(/.*)?$',
              '^(/widgets)(/.*)?$',
              '^(./widgets)(/.*)?$',
              '^(../widgets)(/.*)?$',
              '^(../../widgets)(/.*)?$',
            ],
            message: 'Features cannot import from the widgets layer.',
          },
        ],
      },
    ],
  },
};

const entitiesLayerRules = {
  files: ['**/entities/**/*.{js,jsx,ts,tsx}'],
  rules: {
    // Entities can import from shared
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '^(~/app|app)(/.*)?$',
              '^(/app)(/.*)?$',
              '^(./app)(/.*)?$',
              '^(../app)(/.*)?$',
              '^(../../app)(/.*)?$',
            ],
            message: 'Entities cannot import from the app layer.',
          },
          {
            group: [
              '^(~/pages|pages)(/.*)?$',
              '^(/pages)(/.*)?$',
              '^(./pages)(/.*)?$',
              '^(../pages)(/.*)?$',
              '^(../../pages)(/.*)?$',
            ],
            message: 'Entities cannot import from the pages layer.',
          },
          {
            group: [
              '^(~/widgets|widgets)(/.*)?$',
              '^(/widgets)(/.*)?$',
              '^(./widgets)(/.*)?$',
              '^(../widgets)(/.*)?$',
              '^(../../widgets)(/.*)?$',
            ],
            message: 'Entities cannot import from the widgets layer.',
          },
          {
            group: [
              '^(~/features|features)(/.*)?$',
              '^(/features)(/.*)?$',
              '^(./features)(/.*)?$',
              '^(../features)(/.*)?$',
              '^(../../features)(/.*)?$',
            ],
            message: 'Entities cannot import from the features layer.',
          },
        ],
      },
    ],
  },
};

const sharedLayerRules = {
  files: ['**/shared/**/*.{js,jsx,ts,tsx}'],
  rules: {
    // Shared cannot import from any other layer
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '^(~/app|app)(/.*)?$',
              '^(/app)(/.*)?$',
              '^(./app)(/.*)?$',
              '^(../app)(/.*)?$',
              '^(../../app)(/.*)?$',
            ],
            message: 'Shared cannot import from the app layer.',
          },
          {
            group: [
              '^(~/pages|pages)(/.*)?$',
              '^(/pages)(/.*)?$',
              '^(./pages)(/.*)?$',
              '^(../pages)(/.*)?$',
              '^(../../pages)(/.*)?$',
            ],
            message: 'Shared cannot import from the pages layer.',
          },
          {
            group: [
              '^(~/widgets|widgets)(/.*)?$',
              '^(/widgets)(/.*)?$',
              '^(./widgets)(/.*)?$',
              '^(../widgets)(/.*)?$',
              '^(../../widgets)(/.*)?$',
            ],
            message: 'Shared cannot import from the widgets layer.',
          },
          {
            group: [
              '^(~/features|features)(/.*)?$',
              '^(/features)(/.*)?$',
              '^(./features)(/.*)?$',
              '^(../features)(/.*)?$',
              '^(../../features)(/.*)?$',
            ],
            message: 'Shared cannot import from the features layer.',
          },
          {
            group: [
              '^(~/entities|entities)(/.*)?$',
              '^(/entities)(/.*)?$',
              '^(./entities)(/.*)?$',
              '^(../entities)(/.*)?$',
              '^(../../entities)(/.*)?$',
            ],
            message: 'Shared cannot import from the entities layer.',
          },
        ],
      },
    ],
  },
};

const testFilesLayerRules = {
  files: [
    '**/*.spec.ts',
    '**/*.test.ts',
    '**/e2e/**/*.ts',
    '**/tests/**/*.ts',
    '**/__tests__/**/*.{js,jsx,ts,tsx}',
    '**/playwright/**/*.{js,jsx,ts,tsx}',
  ],
  rules: {
    'no-restricted-imports': 'off',
  },
};

const generalLayerRules = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    // FSD-specific layer rules with fixed import paths
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          // Prevent importing from higher layers
          {
            group: [
              // Regex patterns to match absolute and relative imports for each layer
              '^(~/app|app)(/.*)?$',
              '^(/app)(/.*)?$',
              '^(./app)(/.*)?$',
              '^(../app)(/.*)?$',
              '^(../../app)(/.*)?$',
            ],
            message:
              'Imports from the app layer are not allowed except within the app layer itself.',
          },
          {
            group: [
              '^(~/pages|pages)(/.*)?$',
              '^(/pages)(/.*)?$',
              '^(./pages)(/.*)?$',
              '^(../pages)(/.*)?$',
              '^(../../pages)(/.*)?$',
            ],
            message: 'Direct imports from pages are only allowed within the app layer.',
          },
          {
            group: [
              '^(~/widgets|widgets)(/.*)?$',
              '^(/widgets)(/.*)?$',
              '^(./widgets)(/.*)?$',
              '^(../widgets)(/.*)?$',
              '^(../../widgets)(/.*)?$',
            ],
            message: 'Widgets can only be imported by app or pages layers.',
          },
          {
            group: [
              '^(~/features|features)(/.*)?$',
              '^(/features)(/.*)?$',
              '^(./features)(/.*)?$',
              '^(../features)(/.*)?$',
              '^(../../features)(/.*)?$',
            ],
            message: 'Features can only be imported by app, pages, or widgets layers.',
          },
          {
            group: [
              '^(~/entities|entities)(/.*)?$',
              '^(/entities)(/.*)?$',
              '^(./entities)(/.*)?$',
              '^(../entities)(/.*)?$',
              '^(../../entities)(/.*)?$',
            ],
            message: 'Entities cannot be imported by the shared layer.',
          },
        ],
      },
    ],
  },
};

export {
  appLayerRules,
  pagesLayerRules,
  widgetsLayerRules,
  featuresLayerRules,
  entitiesLayerRules,
  sharedLayerRules,
  generalLayerRules,
  testFilesLayerRules,
};
