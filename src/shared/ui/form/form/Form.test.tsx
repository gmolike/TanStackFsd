/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// src/shared/ui/form/form/Form.test.tsx
import { waitFor } from '@testing-library/dom';
import type { RenderResult } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

import { cleanup, render } from '~/shared/test/test-utils';

import { Input } from '../input/Input';

import { Form } from './Form';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const setupForm = async (onSubmit: vi.Mock = vi.fn()): Promise<RenderResult> => {
  const schema = z.object({
    name: z.string().min(2, { message: 'String must contain at least 2 character(s)' }),
    email: z.string().email({ message: 'Invalid email' }),
  });

  const renderResult = render(
    <Form schema={schema} defaultValues={{ name: '', email: '' }} onSubmit={onSubmit}>
      {(form) => (
        <>
          <Input control={form.control} name="name" label="Name" />
          <Input control={form.control} name="email" label="Email" />
          <button type="submit">Submit</button>
        </>
      )}
    </Form>,
  );

  // Wait for form to be rendered
  await waitFor(() => renderResult.getByText('Name'));

  return renderResult;
};

describe('Form Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders form with inputs', async () => {
    const { getByText } = await setupForm();

    getByText('Name');
    getByText('Email');
  });

  test('shows validation errors', async () => {
    const { getByText } = await setupForm();
    const user = userEvent.setup();

    // Submit without filling fields
    const submitButton = getByText('Submit');
    await user.click(submitButton);

    // Should show errors - use exact text
    await waitFor(() => {
      getByText('String must contain at least 2 character(s)');
      getByText('Invalid email');
    });
  });

  test('submits valid form', async () => {
    const onSubmit = vi.fn();
    const { getByText, container } = await setupForm(onSubmit);
    const user = userEvent.setup();

    // Fill form - use container.querySelector instead
    const nameInput = container.querySelector('input[name="name"]') as HTMLInputElement;
    if (nameInput) {
      await user.clear(nameInput);
      await user.type(nameInput, 'John Doe');
    }

    const emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
    if (emailInput) {
      await user.clear(emailInput);
      await user.type(emailInput, 'john@example.com');
    }

    // Submit
    await user.click(getByText('Submit'));

    // Should call onSubmit - check only the first argument (form data)
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      const firstCall = onSubmit.mock.calls[0];
      expect(firstCall[0]).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
      });
    });
  });
});
