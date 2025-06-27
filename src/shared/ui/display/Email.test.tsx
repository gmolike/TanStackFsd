import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EmailDisplay } from '.';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Mail: vi.fn(() => null),
}));

describe('EmailDisplay', () => {
  const testEmail = 'test@example.com';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email with icon by default', async () => {
    render(<EmailDisplay email={testEmail} />);
    expect(screen.getByText(testEmail)).toBeInTheDocument();

    // Prüfe ob Mail Icon aufgerufen wurde
    const { Mail } = await import('lucide-react');
    expect(Mail).toHaveBeenCalled();
  });

  it('renders as mailto link by default', () => {
    render(<EmailDisplay email={testEmail} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `mailto:${testEmail}`);
  });

  it('renders without icon when withIcon is false', async () => {
    render(<EmailDisplay email={testEmail} withIcon={false} />);
    expect(screen.getByText(testEmail)).toBeInTheDocument();

    const { Mail } = await import('lucide-react');
    expect(Mail).not.toHaveBeenCalled();
  });

  it('renders without link when asLink is false', () => {
    render(<EmailDisplay email={testEmail} asLink={false} />);
    expect(screen.getByText(testEmail)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders placeholder when email is null', () => {
    render(<EmailDisplay email={null} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders placeholder when email is undefined', () => {
    render(<EmailDisplay email={undefined} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(<EmailDisplay email={null} placeholder="No email" />);
    expect(screen.getByText('No email')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<EmailDisplay email={testEmail} className="custom-email" />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom-email');
  });

  it.skip('renders with different icon sizes', async () => {
    const { rerender } = render(<EmailDisplay email={testEmail} iconSize="sm" />);
    const { Mail } = await import('lucide-react');

    // Prüfe ob Mail mit className aufgerufen wurde
    expect(Mail).toHaveBeenCalledWith(
      expect.objectContaining({
        className: expect.stringContaining('size-3'),
      }),
      expect.anything(),
    );

    vi.clearAllMocks();
    rerender(<EmailDisplay email={testEmail} iconSize="md" />);
    expect(Mail).toHaveBeenCalledWith(
      expect.objectContaining({
        className: expect.stringContaining('size-4'),
      }),
      expect.anything(),
    );

    vi.clearAllMocks();
    rerender(<EmailDisplay email={testEmail} iconSize="lg" />);
    expect(Mail).toHaveBeenCalledWith(
      expect.objectContaining({
        className: expect.stringContaining('h-5 w-5'),
      }),
      expect.anything(),
    );
  });
});
