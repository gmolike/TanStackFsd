import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createEnumCell } from './Cell';
import { createEnumVariantConfig } from './model/utils';

enum TestStatus {
  ACTIVE = 'Aktiv',
  INACTIVE = 'Inaktiv',
}

const testConfig = createEnumVariantConfig(TestStatus, {
  ACTIVE: 'success',
  INACTIVE: 'default',
});

describe('createEnumCell', () => {
  it('rendert als Label per default', () => {
    const CellComponent = createEnumCell(testConfig);
    render(<CellComponent value="ACTIVE" />);

    expect(screen.getByText('Aktiv')).toBeInTheDocument();
    expect(screen.queryByTestId('enum-badge')).not.toBeInTheDocument();
  });

  it('rendert als Badge wenn angegeben', () => {
    const CellComponent = createEnumCell(testConfig, 'badge');
    render(<CellComponent value="ACTIVE" />);

    expect(screen.getByTestId('enum-badge')).toBeInTheDocument();
    expect(screen.getByTestId('enum-badge')).toHaveTextContent('Aktiv');
  });

  it('handhabt null Werte', () => {
    const CellComponent = createEnumCell(testConfig);
    render(<CellComponent value={null} />);

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
