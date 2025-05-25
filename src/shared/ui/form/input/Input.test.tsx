// src/shared/ui/form/input/Input.test.tsx
import { Lock, Mail } from 'lucide-react';
import { describe, expect, test, vi } from 'vitest';

import {
  createFormRef,
  formAssertions,
  mockData,
  renderWithForm,
  screen,
  testSchemas,
  userEvent,
  waitFor,
} from '../test-utils';

import { Input } from './Input';

describe('Input Component', () => {
  const user = userEvent.setup();

  describe('Basic Rendering', () => {
    test('renders with label and placeholder', () => {
      renderWithForm(
        (form) => (
          <Input
            control={form.control}
            name="email"
            label="Email Address"
            placeholder="Enter your email"
          />
        ),
        { schema: testSchemas.simple },
      );

      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    });

    test('renders with description', () => {
      renderWithForm(
        (form) => (
          <Input
            control={form.control}
            name="email"
            label="Email"
            description="We'll never share your email"
          />
        ),
        { schema: testSchemas.simple },
      );

      expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
    });

    test('renders with start and end icons', () => {
      renderWithForm(
        (form) => (
          <Input
            control={form.control}
            name="email"
            label="Email"
            startIcon={<Mail data-testid="mail-icon" />}
            endIcon={<Lock data-testid="lock-icon" />}
          />
        ),
        { schema: testSchemas.simple },
      );

      expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
      expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
    });
  });

  describe('Type Detection', () => {
    test('detects email type from schema', () => {
      renderWithForm((form) => <Input control={form.control} name="email" label="Email" />, {
        schema: testSchemas.simple,
      });

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'email');
    });

    test('detects number type from schema', () => {
      renderWithForm((form) => <Input control={form.control} name="age" label="Age" />, {
        schema: testSchemas.simple,
      });

      const input = screen.getByLabelText('Age');
      expect(input).toHaveAttribute('type', 'number');
    });

    test('overrides detected type with explicit type', () => {
      renderWithForm(
        (form) => <Input control={form.control} name="email" label="Email" type="text" />,
        { schema: testSchemas.simple },
      );

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'text');
    });
  });

  describe('Required Field Detection', () => {
    test('detects required fields from schema', () => {
      const { container } = renderWithForm(
        (form) => <Input control={form.control} name="name" label="Name" />,
        { schema: testSchemas.simple },
      );

      formAssertions.isFieldRequired(container, 'name');
    });

    test('detects optional fields from schema', () => {
      const { container } = renderWithForm(
        (form) => <Input control={form.control} name="bio" label="Bio" />,
        { schema: testSchemas.simple },
      );

      const field = container.querySelector('[name="bio"]');
      expect(field).toHaveAttribute('aria-required', 'false');
    });

    test('overrides required detection with explicit prop', () => {
      const { container } = renderWithForm(
        (form) => <Input control={form.control} name="bio" label="Bio" required />,
        { schema: testSchemas.simple },
      );

      formAssertions.isFieldRequired(container, 'bio');
    });
  });

  describe('Reset Functionality', () => {
    test('shows reset button when value differs from default', async () => {
      const { FormWrapper, getForm } = createFormRef(
        testSchemas.simple,
        mockData.defaultValues.simple,
      );

      renderWithForm(
        <FormWrapper>
          <Input control={getForm().control} name="name" label="Name" />
        </FormWrapper>,
      );

      // Initially no reset button (value equals default)
      expect(screen.queryByLabelText('Auf Standardwert zurücksetzen')).not.toBeInTheDocument();

      // Change value
      const input = screen.getByLabelText('Name');
      await user.clear(input);
      await user.type(input, 'Jane Doe');

      // Reset button should appear
      await waitFor(() => {
        expect(screen.getByLabelText('Auf Standardwert zurücksetzen')).toBeInTheDocument();
      });
    });

    test('resets to default value when reset button clicked', async () => {
      const { FormWrapper, getForm } = createFormRef(
        testSchemas.simple,
        mockData.defaultValues.simple,
      );

      renderWithForm(
        <FormWrapper>
          <Input control={getForm().control} name="name" label="Name" />
        </FormWrapper>,
      );

      const input = screen.getByLabelText('Name');

      // Change value
      await user.clear(input);
      await user.type(input, 'Jane Doe');
      expect(input).toHaveValue('Jane Doe');

      // Click reset
      const resetButton = await screen.findByLabelText('Auf Standardwert zurücksetzen');
      await user.click(resetButton);

      // Should reset to default
      expect(input).toHaveValue('John Doe');
    });

    test('hides reset button when showReset is false', async () => {
      const { FormWrapper, getForm } = createFormRef(
        testSchemas.simple,
        mockData.defaultValues.simple,
      );

      renderWithForm(
        <FormWrapper>
          <Input control={getForm().control} name="name" label="Name" showReset={false} />
        </FormWrapper>,
      );

      // Change value
      const input = screen.getByLabelText('Name');
      await user.clear(input);
      await user.type(input, 'Jane Doe');

      // Reset button should not appear
      expect(screen.queryByLabelText('Auf Standardwert zurücksetzen')).not.toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    test('shows validation error on blur', async () => {
      const { FormWrapper, getForm } = createFormRef(testSchemas.simple);

      const { container } = renderWithForm(
        <FormWrapper>
          <Input control={getForm().control} name="name" label="Name" />
        </FormWrapper>,
      );

      const input = screen.getByLabelText('Name');

      // Type invalid value
      await user.type(input, 'a'); // Less than 2 characters
      await user.tab(); // Blur

      // Should show error
      await waitFor(() => {
        formAssertions.hasFieldError(container, 'name', 'Name must be at least 2 characters');
      });
    });

    test('validates email format', async () => {
      const { FormWrapper, getForm } = createFormRef(testSchemas.simple);

      const { container } = renderWithForm(
        <FormWrapper>
          <Input control={getForm().control} name="email" label="Email" />
        </FormWrapper>,
      );

      const input = screen.getByLabelText('Email');

      // Type invalid email
      await user.type(input, 'invalid-email');
      await user.tab();

      // Should show error
      await waitFor(() => {
        formAssertions.hasFieldError(container, 'email', 'Invalid email');
      });
    });
  });

  describe('Disabled State', () => {
    test('disables input when disabled prop is true', () => {
      const { container } = renderWithForm(
        (form) => <Input control={form.control} name="email" label="Email" disabled />,
        { schema: testSchemas.simple },
      );

      formAssertions.isFieldDisabled(container, 'email');
    });

    test('disables input during form submission', async () => {
      const onSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
      const { FormWrapper, getForm } = createFormRef(testSchemas.simple);

      const { container } = renderWithForm(
        <FormWrapper>
          <Input control={getForm().control} name="name" label="Name" />
          <button type="submit">Submit</button>
        </FormWrapper>,
        { onSubmit },
      );

      // Fill form
      const input = screen.getByLabelText('Name');
      await user.type(input, 'Valid Name');

      // Submit form
      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);

      // Should be disabled during submission
      await waitFor(() => {
        formAssertions.isFieldDisabled(container, 'name');
      });
    });
  });

  describe('Additional Props', () => {
    test('passes additional props to input element', () => {
      renderWithForm(
        (form) => (
          <Input
            control={form.control}
            name="email"
            label="Email"
            maxLength={50}
            autoComplete="email"
            data-testid="custom-input"
          />
        ),
        { schema: testSchemas.simple },
      );

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('maxLength', '50');
      expect(input).toHaveAttribute('autoComplete', 'email');
      expect(input).toHaveAttribute('data-testid', 'custom-input');
    });
  });
});
