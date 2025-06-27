import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BooleanDisplay } from '.';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Check: vi.fn(() => null),
  X: vi.fn(() => null),
}));

describe('BooleanDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders check icon for true value', async () => {
    const { container } = render(<BooleanDisplay value={true} />);

    const { Check, X } = await import('lucide-react');
    expect(Check).toHaveBeenCalled();
    expect(X).not.toHaveBeenCalled();

    // Prüfe Farbklasse
    expect(container.firstChild).toHaveClass('text-green-600');
  });

  it('renders x icon for false value', async () => {
    const { container } = render(<BooleanDisplay value={false} />);

    const { Check, X } = await import('lucide-react');
    expect(Check).not.toHaveBeenCalled();
    expect(X).toHaveBeenCalled();

    // Prüfe Farbklasse
    expect(container.firstChild).toHaveClass('text-red-600');
  });

  it('renders placeholder when value is null', () => {
    render(<BooleanDisplay value={null} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders placeholder when value is undefined', () => {
    render(<BooleanDisplay value={undefined} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders text variant with default labels', () => {
    const { rerender } = render(<BooleanDisplay value={true} variant="text" />);
    expect(screen.getByText('Ja')).toBeInTheDocument();

    rerender(<BooleanDisplay value={false} variant="text" />);
    expect(screen.getByText('Nein')).toBeInTheDocument();
  });

  it('renders text variant with custom labels', () => {
    const { rerender } = render(
      <BooleanDisplay value={true} variant="text" trueLabel="Aktiv" falseLabel="Inaktiv" />,
    );
    expect(screen.getByText('Aktiv')).toBeInTheDocument();

    rerender(
      <BooleanDisplay value={false} variant="text" trueLabel="Aktiv" falseLabel="Inaktiv" />,
    );
    expect(screen.getByText('Inaktiv')).toBeInTheDocument();
  });

  it('applies color classes by default', () => {
    const { container, rerender } = render(<BooleanDisplay value={true} />);
    expect(container.firstChild).toHaveClass('text-green-600');

    rerender(<BooleanDisplay value={false} />);
    expect(container.firstChild).toHaveClass('text-red-600');
  });

  it('does not apply color classes when withColor is false', () => {
    const { container, rerender } = render(<BooleanDisplay value={true} withColor={false} />);
    expect(container.firstChild).not.toHaveClass('text-green-600');

    rerender(<BooleanDisplay value={false} withColor={false} />);
    expect(container.firstChild).not.toHaveClass('text-red-600');
  });

  it('applies custom className', () => {
    const { container } = render(<BooleanDisplay value={true} className="custom-boolean" />);
    expect(container.firstChild).toHaveClass('custom-boolean');
  });

  it('does not call icon functions in text variant', async () => {
    render(<BooleanDisplay value={true} variant="text" />);

    const { Check, X } = await import('lucide-react');
    expect(Check).not.toHaveBeenCalled();
    expect(X).not.toHaveBeenCalled();
  });
});
