// src/shared/ui/form/checkbox/Checkbox.test.tsx
import { useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { Form as ShadcnForm } from '~/shared/shadcn';

import { Checkbox } from './Checkbox';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const TestWrapper = ({
  children,
}: {
  children: React.ReactNode | ((form: any) => React.ReactNode);
}) => {
  const form = useForm({
    defaultValues: { terms: false },
  });

  return (
    <ShadcnForm {...form}>
      <form>{typeof children === 'function' ? children(form) : children}</form>
    </ShadcnForm>
  );
};

describe('Checkbox Component', () => {
  test('renders checkbox with label', () => {
    render(
      <TestWrapper>
        {(form) => <Checkbox control={form.control} name="terms" label="Accept terms" />}
      </TestWrapper>,
    );

    expect(screen.getByText('Accept terms')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  test('toggles checkbox', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        {(form) => <Checkbox control={form.control} name="terms" label="Accept terms" />}
      </TestWrapper>,
    );

    const checkbox = screen.getByRole('checkbox');

    // Initially unchecked
    expect(checkbox).not.toBeChecked();

    // Click to check
    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    // Click to uncheck
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
