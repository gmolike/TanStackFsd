// src/shared/ui/form/select/Select.test.tsx
import { useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { Form as ShadcnForm } from '~/shared/shadcn';

import { Select } from './Select';

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
    defaultValues: { country: '' },
  });

  return (
    <ShadcnForm {...form}>
      <form>{typeof children === 'function' ? children(form) : children}</form>
    </ShadcnForm>
  );
};

describe('Select Component', () => {
  const options = [
    { value: 'de', label: 'Germany' },
    { value: 'us', label: 'United States' },
  ];

  test('renders select with options', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        {(form) => (
          <Select control={form.control} name="country" label="Country" options={options} />
        )}
      </TestWrapper>,
    );

    // Open select
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    // Check options
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
  });

  test('selects option', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        {(form) => (
          <Select control={form.control} name="country" label="Country" options={options} />
        )}
      </TestWrapper>,
    );

    // Open and select
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    await user.click(screen.getByText('Germany'));

    // Should show selected value
    expect(screen.getByText('Germany')).toBeInTheDocument();
  });
});
