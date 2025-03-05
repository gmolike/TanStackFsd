// fsd-import-rules.mjs

// Define all possible layers
const LAYERS = {
  APP: 'app',
  PAGES: 'pages',
  WIDGETS: 'widgets',
  FEATURES: 'features',
  ENTITIES: 'entities',
  SHARED: 'shared',
};

// Helper to create import restriction patterns for a given layer
const createLayerPattern = (layer) => {
  return [
    `^(~/${layer}|${layer})(/.*)?$`,
    `^(/${layer})(/.*)?$`,
    `^(./${layer})(/.*)?$`,
    `^(../${layer})(/.*)?$`,
    `^(../../${layer})(/.*)?$`,
  ];
};

// Create pattern objects for each layer
const createRestrictionPattern = (layer, message) => {
  return {
    group: createLayerPattern(layer),
    message: message || `Cannot import from the ${layer} layer.`,
  };
};

// Define layer dependencies (what each layer can import)
const LAYER_DEPENDENCIES = {
  [LAYERS.APP]: [], // App can import from any layer
  [LAYERS.PAGES]: [LAYERS.APP],
  [LAYERS.WIDGETS]: [LAYERS.APP, LAYERS.PAGES],
  [LAYERS.FEATURES]: [LAYERS.APP, LAYERS.PAGES, LAYERS.WIDGETS],
  [LAYERS.ENTITIES]: [LAYERS.APP, LAYERS.PAGES, LAYERS.WIDGETS, LAYERS.FEATURES],
  [LAYERS.SHARED]: [LAYERS.APP, LAYERS.PAGES, LAYERS.WIDGETS, LAYERS.FEATURES, LAYERS.ENTITIES],
};

// Generate layer rules based on dependencies
const generateLayerRules = (layer) => {
  const restrictedLayers = LAYER_DEPENDENCIES[layer];

  if (restrictedLayers.length === 0) {
    return {
      files: [`**/${layer}/**/*.{js,jsx,ts,tsx}`],
      rules: {
        'no-restricted-imports': 'off',
      },
    };
  }

  const patterns = restrictedLayers.map((restrictedLayer) =>
    createRestrictionPattern(
      restrictedLayer,
      `${layer} cannot import from the ${restrictedLayer} layer.`,
    ),
  );

  return {
    files: [`**/${layer}/**/*.{js,jsx,ts,tsx}`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns,
        },
      ],
    },
  };
};

// Generate rules for each layer
const appLayerRules = generateLayerRules(LAYERS.APP);
const pagesLayerRules = generateLayerRules(LAYERS.PAGES);
const widgetsLayerRules = generateLayerRules(LAYERS.WIDGETS);
const featuresLayerRules = generateLayerRules(LAYERS.FEATURES);
const entitiesLayerRules = generateLayerRules(LAYERS.ENTITIES);
const sharedLayerRules = generateLayerRules(LAYERS.SHARED);

// Test files can import from anywhere
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

// General rules about layer imports
const generalLayerRules = {
  files: ['**/*.{js,jsx,ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          createRestrictionPattern(
            LAYERS.APP,
            'Imports from the app layer are not allowed except within the app layer itself.',
          ),
          createRestrictionPattern(
            LAYERS.PAGES,
            'Direct imports from pages are only allowed within the app layer.',
          ),
          createRestrictionPattern(
            LAYERS.WIDGETS,
            'Widgets can only be imported by app or pages layers.',
          ),
          createRestrictionPattern(
            LAYERS.FEATURES,
            'Features can only be imported by app, pages, or widgets layers.',
          ),
          createRestrictionPattern(
            LAYERS.ENTITIES,
            'Entities cannot be imported by the shared layer.',
          ),
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
