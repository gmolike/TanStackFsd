import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EnumBadge } from './Badge';
import { createEnumVariantConfig } from './model/utils';

enum TestStatus {
  ACTIVE = 'Aktiv',
  INACTIVE = 'Inaktiv',
  PENDING = 'Ausstehend',
}

// Config mit neuem Format
const testConfig = createEnumVariantConfig(TestStatus, {
  ACTIVE: 'success',
  INACTIVE: 'default',
  PENDING: 'warning',
});

describe('EnumBadge', () => {
  it('zeigt Enum-Value als Label', () => {
    render(<EnumBadge value="ACTIVE" config={testConfig} />);
    expect(screen.getByTestId('enum-badge')).toHaveTextContent('Aktiv');
  });

  it('funktioniert mit überschriebenem Label', () => {
    const configWithLabel = createEnumVariantConfig(TestStatus, {
      ACTIVE: { label: 'Online', variant: 'success' },
      INACTIVE: 'default',
      PENDING: 'warning',
    });

    render(<EnumBadge value="ACTIVE" config={configWithLabel} />);
    expect(screen.getByTestId('enum-badge')).toHaveTextContent('Online');
  });

  it('wendet korrekte Variante an', () => {
    render(<EnumBadge value="PENDING" config={testConfig} />);

    const badge = screen.getByTestId('enum-badge');
    expect(badge).toHaveAttribute('data-variant', 'warning');
  });
});
