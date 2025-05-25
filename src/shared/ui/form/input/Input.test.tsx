// src/shared/ui/form/input/Input.test.tsx
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

import { Form as ShadcnForm } from '~/shared/shadcn';

import { Input } from './Input';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Test Wrapper
const TestWrapper = ({
  children,
}: {
  children: React.ReactNode | ((form: any) => React.ReactNode);
}) => {
  const form = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
      }),
    ),
    defaultValues: { name: '', email: '' },
  });

  return (
    <ShadcnForm {...form}>
      <form>{typeof children === 'function' ? children(form) : children}</form>
    </ShadcnForm>
  );
};

describe('Input Component', () => {
  test('renders input with label', () => {
    render(
      <TestWrapper>
        {(form) => (
          <Input control={form.control} name="name" label="Your Name" placeholder="Enter name" />
        )}
      </TestWrapper>,
    );

    expect(screen.getByText('Your Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });

  test('accepts user input', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        {(form) => <Input control={form.control} name="name" label="Name" />}
      </TestWrapper>,
    );

    const input = screen.getByRole('textbox', { name: 'Name' });
    await user.type(input, 'John Doe');

    expect(input).toHaveValue('John Doe');
  });

  test('shows required indicator', () => {
    render(
      <TestWrapper>
        {(form) => <Input control={form.control} name="name" label="Name" required />}
      </TestWrapper>,
    );

    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  test('can be disabled', () => {
    render(
      <TestWrapper>
        {(form) => <Input control={form.control} name="name" label="Name" disabled />}
      </TestWrapper>,
    );

    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toBeDisabled();
  });
});
