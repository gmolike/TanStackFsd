import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DateDisplay } from '.';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Calendar: vi.fn(() => null),
}));

describe('DateDisplay', () => {
  const testDate = new Date('2024-01-15T10:30:00');
  const testDateString = '2024-01-15';
  const testTimestamp = testDate.getTime();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders date from Date object', () => {
    render(<DateDisplay date={testDate} />);
    expect(screen.getByText('15.01.2024')).toBeInTheDocument();
  });

  it('renders date from string', () => {
    render(<DateDisplay date={testDateString} />);
    expect(screen.getByText('15.01.2024')).toBeInTheDocument();
  });

  it('renders date from timestamp', () => {
    render(<DateDisplay date={testTimestamp} />);
    expect(screen.getByText('15.01.2024')).toBeInTheDocument();
  });

  it('renders placeholder when date is null', () => {
    render(<DateDisplay date={null} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders placeholder when date is undefined', () => {
    render(<DateDisplay date={undefined} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders placeholder for invalid date', () => {
    render(<DateDisplay date="invalid-date" />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(<DateDisplay date={null} placeholder="Kein Datum" />);
    expect(screen.getByText('Kein Datum')).toBeInTheDocument();
  });

  it('renders with different formats', () => {
    const { rerender } = render(<DateDisplay date={testDate} format="short" />);
    expect(screen.getByText('15.01.2024')).toBeInTheDocument();

    rerender(<DateDisplay date={testDate} format="medium" locale="de-DE" />);
    expect(screen.getByText('15. Jan. 2024')).toBeInTheDocument();

    rerender(<DateDisplay date={testDate} format="long" locale="de-DE" />);
    expect(screen.getByText(/Montag, 15\. Januar 2024/)).toBeInTheDocument();
  });

  it('renders without icon by default', async () => {
    render(<DateDisplay date={testDate} />);

    const { Calendar } = await import('lucide-react');
    expect(Calendar).not.toHaveBeenCalled();
  });

  it('renders with icon when withIcon is true', async () => {
    render(<DateDisplay date={testDate} withIcon />);

    const { Calendar } = await import('lucide-react');
    expect(Calendar).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(<DateDisplay date={testDate} className="custom-date" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-date');
  });

  it('respects custom locale', () => {
    render(<DateDisplay date={testDate} format="medium" locale="en-US" />);
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
  });
});
