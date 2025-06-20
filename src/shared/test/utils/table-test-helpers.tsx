import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// Diese Types sollten aus deinem data-table Modul kommen
// Falls nicht vorhanden, hier als Beispiel:
export interface FieldDefinition<T> {
  id: string;
  accessor?: ((row: T) => unknown) | keyof T;
  sortable?: boolean;
  searchable?: boolean;
  cell?: React.ComponentType<{ value: unknown; row: T }> | 'default' | 'actions' | string;
}

export interface TableDefinition<T> {
  labels: Record<string, string>;
  fields: Array<FieldDefinition<T>>;
}

// Type für Cell Components
type CellComponent<T> = React.ComponentType<{ value: unknown; row: T }>;

/**
 * Helper to get value from accessor (handles both function and string)
 */
export function getAccessorValue<T>(field: FieldDefinition<T>, data: T): unknown {
  if (!field.accessor) return undefined;

  if (typeof field.accessor === 'function') {
    return field.accessor(data);
  }

  // Type assertion needed here as TypeScript can't narrow the type perfectly
  return (data as Record<string, unknown>)[field.accessor as string];
}

/**
 * Generic helper to test table field configurations
 */
export function testFieldConfiguration<T>(
  field: FieldDefinition<T>,
  expectedConfig: {
    sortable?: boolean;
    searchable?: boolean;
    cellType?: string | CellComponent<T>;
  },
) {
  if (expectedConfig.sortable !== undefined) {
    expect(field.sortable).toBe(expectedConfig.sortable);
  }
  if (expectedConfig.searchable !== undefined) {
    expect(field.searchable).toBe(expectedConfig.searchable);
  }
  if (expectedConfig.cellType !== undefined) {
    expect(field.cell).toBe(expectedConfig.cellType);
  }
}

/**
 * Generic helper to test accessor functions
 */
export function testAccessor<T>(field: FieldDefinition<T>, testData: T, expectedValue: unknown) {
  const value = getAccessorValue(field, testData);
  expect(value).toBe(expectedValue);
}

/**
 * Generic helper to test cell rendering
 */
export function testCellRendering<T>(
  field: FieldDefinition<T>,
  props: { value: unknown; row: T },
  assertions: (container: HTMLElement) => void,
) {
  if (typeof field.cell === 'function') {
    const Cell = field.cell as CellComponent<T>;
    const { container } = render(<Cell {...props} />);
    assertions(container);
  }
}

/**
 * Test all fields in a table definition
 */
export function testTableDefinition<T>(
  definition: TableDefinition<T>,
  config: {
    requiredFields: Array<string>;
    testData: T;
    fieldTests?: Record<
      string,
      {
        accessor?: unknown;
        config?: {
          sortable?: boolean;
          searchable?: boolean;
          cellType?: string | CellComponent<T>;
        };
      }
    >;
  },
) {
  describe('Table Definition', () => {
    it('should have all required fields', () => {
      const fieldIds = definition.fields.map((f) => f.id);
      config.requiredFields.forEach((fieldId) => {
        expect(fieldIds).toContain(fieldId);
      });
    });

    if (config.fieldTests) {
      Object.entries(config.fieldTests).forEach(([fieldId, tests]) => {
        describe(`Field: ${fieldId}`, () => {
          const field = definition.fields.find((f) => f.id === fieldId);

          if (!field) {
            it('should exist', () => {
              expect(field).toBeDefined();
            });
            return;
          }

          if (tests.config) {
            it('should have correct configuration', () => {
              testFieldConfiguration(field, tests.config);
            });
          }

          if (tests.accessor !== undefined && field.accessor) {
            it('should have correct accessor', () => {
              testAccessor(field, config.testData, tests.accessor);
            });
          }
        });
      });
    }
  });
}
