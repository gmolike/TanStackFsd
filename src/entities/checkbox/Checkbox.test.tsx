import * as React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Checkbox } from './Checkbox';

describe('Checkbox Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('should be unchecked by default', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('should be checked when defaultChecked is true', () => {
    render(<Checkbox defaultChecked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('should toggle when clicked', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('should call onCheckedChange when state changes', () => {
    const handleChange = vi.fn();
    render(<Checkbox onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Checkbox disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('should not toggle when disabled', () => {
    const handleChange = vi.fn();
    render(<Checkbox disabled onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should handle controlled state', () => {
    const ControlledCheckbox = () => {
      const [checked, setChecked] = React.useState(false);
      return (
        <Checkbox
          checked={checked}
          onCheckedChange={setChecked}
          data-testid="controlled-checkbox"
        />
      );
    };

    render(<ControlledCheckbox />);
    const checkbox = screen.getByTestId('controlled-checkbox');

    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('should support custom className', () => {
    render(<Checkbox className="custom-class" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('custom-class');
  });

  it('should support aria-label', () => {
    render(<Checkbox aria-label="Accept terms" />);
    const checkbox = screen.getByLabelText('Accept terms');
    expect(checkbox).toBeInTheDocument();
  });

  it('should work with label', () => {
    render(
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <label htmlFor="terms">Accept terms and conditions</label>
      </div>,
    );

    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Accept terms and conditions');

    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(label);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('should handle indeterminate state', () => {
    render(<Checkbox checked="indeterminate" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
  });
});
