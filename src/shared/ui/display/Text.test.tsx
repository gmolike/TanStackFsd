import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TextDisplay } from '.';

describe('TextDisplay', () => {
  it('renders text when provided', () => {
    render(<TextDisplay text="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders number when provided', () => {
    render(<TextDisplay text={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders placeholder when text is null', () => {
    render(<TextDisplay text={null} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders placeholder when text is undefined', () => {
    render(<TextDisplay text={undefined} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders placeholder when text is empty string', () => {
    render(<TextDisplay text="" />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(<TextDisplay text={null} placeholder="N/A" />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<TextDisplay text="Test" className="custom-class" />);
    expect(screen.getByText('Test')).toHaveClass('custom-class');
  });

  it('applies truncate class by default', () => {
    render(<TextDisplay text="Very long text that should be truncated" />);
    expect(screen.getByText('Very long text that should be truncated')).toHaveClass('truncate');
  });

  it('does not apply truncate class when truncate is false', () => {
    render(<TextDisplay text="Text" truncate={false} />);
    expect(screen.getByText('Text')).not.toHaveClass('truncate');
  });

  it('applies muted color to placeholder', () => {
    render(<TextDisplay text={null} />);
    expect(screen.getByText('-')).toHaveClass('text-muted-foreground');
  });
});
