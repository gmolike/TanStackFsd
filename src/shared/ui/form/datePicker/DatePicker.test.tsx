// src/shared/ui/form/datePicker/DatePicker.test.tsx
import { useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { Form as ShadcnForm } from '~/shared/shadcn';

import { DatePicker } from './DatePicker';

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
    defaultValues: { birthDate: null },
  });

  return (
    <ShadcnForm {...form}>
      <form>{typeof children === 'function' ? children(form) : children}</form>
    </ShadcnForm>
  );
};

describe('DatePicker Component', () => {
  test('renders date picker', () => {
    render(
      <TestWrapper>
        {(form) => <DatePicker control={form.control} name="birthDate" label="Birth Date" />}
      </TestWrapper>,
    );

    expect(screen.getByText('Birth Date')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /datum auswählen/i })).toBeInTheDocument();
  });

  test('opens calendar on click', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        {(form) => <DatePicker control={form.control} name="birthDate" label="Birth Date" />}
      </TestWrapper>,
    );

    // Open calendar
    await user.click(screen.getByRole('button', { name: /datum auswählen/i }));

    // Calendar should be visible
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });
});
