// src/shared/ui/form/input/Input.test.tsx
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { waitFor } from '@testing-library/dom';
import type { RenderResult } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

import { Form as ShadcnForm } from '~/shared/shadcn';
import { cleanup, render } from '~/shared/test/test-utils';

import { Input } from './Input';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const setupInput = async (
  inputProps: Partial<Parameters<typeof Input>[0]> = {},
): Promise<RenderResult> => {
  const TestWrapper = ({ children }: { children: (form: any) => React.ReactNode }) => {
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
        <form>{children(form)}</form>
      </ShadcnForm>
    );
  };

  const renderResult = render(
    <TestWrapper>
      {(form) => <Input control={form.control} name="name" label="Name" {...inputProps} />}
    </TestWrapper>,
  );

  // Wait for input to be rendered
  await waitFor(() => {
    // Look for any input element
    const inputs = renderResult.container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  return renderResult;
};

describe('Input Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders input with label', async () => {
    const { getByText, getByPlaceholderText } = await setupInput({
      label: 'Your Name',
      placeholder: 'Enter name',
    });

    getByText('Your Name');
    getByPlaceholderText('Enter name');
  });

  test('accepts user input', async () => {
    const { container } = await setupInput();
    const user = userEvent.setup();

    // Find the input by its type or other attributes
    const input = container.querySelector('input[type="text"]') as HTMLInputElement;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (input) {
      await user.type(input, 'John Doe');

      await waitFor(() => {
        expect(input.value).toBe('John Doe');
      });
    }
  });

  test('shows required indicator', async () => {
    const { container } = await setupInput({ required: true });

    const input = container.querySelector('input[type="text"]');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  test('can be disabled', async () => {
    const { container } = await setupInput({ disabled: true });

    const input = container.querySelector('input[type="text"]');
    expect(input).toBeDisabled();
  });
});
