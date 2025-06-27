import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PhoneDisplay } from '.';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Phone: vi.fn(() => null),
}));

describe('PhoneDisplay', () => {
  const testPhone = '+49 123 456789';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders phone with icon by default', async () => {
    render(<PhoneDisplay phone={testPhone} />);
    expect(screen.getByText(testPhone)).toBeInTheDocument();

    const { Phone } = await import('lucide-react');
    expect(Phone).toHaveBeenCalled();
  });

  it('renders as tel link by default', () => {
    render(<PhoneDisplay phone={testPhone} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `tel:${testPhone}`);
  });

  it('renders without icon when withIcon is false', async () => {
    render(<PhoneDisplay phone={testPhone} withIcon={false} />);
    expect(screen.getByText(testPhone)).toBeInTheDocument();

    const { Phone } = await import('lucide-react');
    expect(Phone).not.toHaveBeenCalled();
  });

  it('renders without link when asLink is false', () => {
    render(<PhoneDisplay phone={testPhone} asLink={false} />);
    expect(screen.getByText(testPhone)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders placeholder when phone is null', () => {
    render(<PhoneDisplay phone={null} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders placeholder when phone is undefined', () => {
    render(<PhoneDisplay phone={undefined} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(<PhoneDisplay phone={null} placeholder="Keine Nummer" />);
    expect(screen.getByText('Keine Nummer')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<PhoneDisplay phone={testPhone} className="custom-phone" />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom-phone');
  });

  it.skip('renders with different icon sizes', async () => {
    const { rerender } = render(<PhoneDisplay phone={testPhone} iconSize="sm" />);
    const { Phone } = await import('lucide-react');

    expect(Phone).toHaveBeenCalledWith(
      expect.objectContaining({
        className: expect.stringContaining('size-3'),
      }),
      expect.anything(),
    );

    vi.clearAllMocks();
    rerender(<PhoneDisplay phone={testPhone} iconSize="md" />);
    expect(Phone).toHaveBeenCalledWith(
      expect.objectContaining({
        className: expect.stringContaining('size-4'),
      }),
      expect.anything(),
    );

    vi.clearAllMocks();
    rerender(<PhoneDisplay phone={testPhone} iconSize="lg" />);
    expect(Phone).toHaveBeenCalledWith(
      expect.objectContaining({
        className: expect.stringContaining('h-5 w-5'),
      }),
      expect.anything(),
    );
  });
});
