// src/shared/test/utils/mock-components.tsx
import type { ReactNode } from 'react';

type MockComponentProps = {
  children?: ReactNode;
  [key: string]: unknown;
};

type CellProps = {
  value: unknown;
};

/**
 * Create a mock component with testId
 */
export function createMockComponent(name: string) {
  return ({ children, ...props }: MockComponentProps) => (
    <div data-testid={`mock-${name}`} {...props}>
      {children}
    </div>
  );
}

/**
 * Mock multiple UI components at once
 */
export function mockUIComponents(components: Record<string, string>) {
  return Object.entries(components).reduce(
    (mocks, [exportName, testId]) => ({
      ...mocks,
      [exportName]: createMockComponent(testId),
    }),
    {} as Record<string, ReturnType<typeof createMockComponent>>,
  );
}

/**
 * Format date for consistent test comparisons
 */
function formatTestDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Export commonly used mocks with proper types
export const commonDataTableMocks = {
  BooleanCell: ({ value }: CellProps) => (
    <span data-testid="boolean-cell">{value ? 'Yes' : 'No'}</span>
  ),
  DateCell: ({ value }: CellProps) => (
    <span data-testid="date-cell">{value instanceof Date ? formatTestDate(value) : 'No date'}</span>
  ),
  EmailCell: ({ value }: CellProps) => (
    <a data-testid="email-cell" href={`mailto:${value}`}>
      {String(value)}
    </a>
  ),
  PhoneCell: ({ value }: CellProps) => (
    <a data-testid="phone-cell" href={`tel:${value}`}>
      {String(value)}
    </a>
  ),
  TextCell: ({ value }: CellProps) => <span data-testid="text-cell">{String(value)}</span>,
};
