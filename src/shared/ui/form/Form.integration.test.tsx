// src/shared/ui/form/Form.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

import {
  Form,
  FormCheckbox,
  FormFooter,
  FormHeader,
  FormInput,
  FormSelect,
  FormTextArea,
} from './';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('Form Integration Tests', () => {
  test('complete user registration flow', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    // Registration Schema
    const registrationSchema = z.object({
      name: z.string().min(2, 'Name is required'),
      email: z.string().email('Invalid email'),
      country: z.string().min(1, 'Please select a country'),
      bio: z.string().optional(),
      newsletter: z.boolean(),
      terms: z.boolean().refine((val) => val === true, 'You must accept terms'),
    });

    const countries = [
      { value: 'de', label: 'Germany' },
      { value: 'us', label: 'United States' },
    ];

    render(
      <Form
        schema={registrationSchema}
        defaultValues={{
          name: '',
          email: '',
          country: '',
          bio: '',
          newsletter: false,
          terms: false,
        }}
        onSubmit={onSubmit}
      >
        {(form) => (
          <>
            <FormHeader title="Create Account" description="Fill in your information" />

            <FormInput control={form.control} name="name" label="Full Name" required />

            <FormInput control={form.control} name="email" label="Email" type="email" required />

            <FormSelect
              control={form.control}
              name="country"
              label="Country"
              options={countries}
              required
            />

            <FormTextArea
              control={form.control}
              name="bio"
              label="About You"
              rows={4}
              placeholder="Tell us about yourself..."
            />

            <FormCheckbox
              control={form.control}
              name="newsletter"
              label="Subscribe to newsletter"
            />

            <FormCheckbox
              control={form.control}
              name="terms"
              label="I accept the terms and conditions"
              required
            />

            <FormFooter
              form={form}
              submitText="Create Account"
              showCancel
              onCancel={() => console.log('Cancelled')}
            />
          </>
        )}
      </Form>,
    );

    // Verify form renders
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Fill in your information')).toBeInTheDocument();

    // Fill form fields
    await user.type(screen.getByRole('textbox', { name: 'Full Name' }), 'John Doe');
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'john@example.com');

    // Select country
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Germany'));

    // Fill optional bio
    await user.type(screen.getByRole('textbox', { name: 'About You' }), 'Software developer');

    // Check newsletter
    await user.click(screen.getByRole('checkbox', { name: 'Subscribe to newsletter' }));

    // Accept terms
    await user.click(screen.getByRole('checkbox', { name: 'I accept the terms and conditions' }));

    // Submit form
    await user.click(screen.getByRole('button', { name: 'Create Account' }));

    // Verify submission
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        country: 'de',
        bio: 'Software developer',
        newsletter: true,
        terms: true,
      });
    });
  });

  test('shows validation errors on incomplete form', async () => {
    const user = userEvent.setup();

    const registrationSchema = z.object({
      name: z.string().min(2, 'Name is required'),
      email: z.string().email('Invalid email'),
      terms: z.boolean().refine((val) => val === true, 'You must accept terms'),
    });

    render(
      <Form
        schema={registrationSchema}
        defaultValues={{
          name: '',
          email: '',
          terms: false,
        }}
        onSubmit={() => {}}
      >
        {(form) => (
          <>
            <FormInput control={form.control} name="name" label="Name" required />
            <FormInput control={form.control} name="email" label="Email" required />
            <FormCheckbox control={form.control} name="terms" label="Accept Terms" required />
            <FormFooter form={form} />
          </>
        )}
      </Form>,
    );

    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /speichern/i }));

    // Should show all validation errors
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
      expect(screen.getByText('You must accept terms')).toBeInTheDocument();
    });
  });
});
