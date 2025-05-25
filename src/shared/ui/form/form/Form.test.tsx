// src/shared/ui/form/form/Form.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

import { Input } from '../input/Input';

import { Form } from './Form';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('Form Component', () => {
  // Simple test schema
  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
  });

  test('renders form with inputs', () => {
    render(
      <Form schema={schema} defaultValues={{ name: '', email: '' }} onSubmit={() => {}}>
        {(form) => (
          <>
            <Input control={form.control} name="name" label="Name" />
            <Input control={form.control} name="email" label="Email" />
          </>
        )}
      </Form>,
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  test('shows validation errors', async () => {
    const user = userEvent.setup();

    render(
      <Form schema={schema} defaultValues={{ name: '', email: '' }} onSubmit={() => {}}>
        {(form) => (
          <>
            <Input control={form.control} name="name" label="Name" />
            <Input control={form.control} name="email" label="Email" />
            <button type="submit">Submit</button>
          </>
        )}
      </Form>,
    );

    // Submit without filling fields
    await user.click(screen.getByText('Submit'));

    // Should show errors
    await waitFor(() => {
      expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  test('submits valid form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
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

    // Fill form
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'John Doe');
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'john@example.com');

    // Submit
    await user.click(screen.getByText('Submit'));

    // Should call onSubmit
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
      });
    });
  });
});
