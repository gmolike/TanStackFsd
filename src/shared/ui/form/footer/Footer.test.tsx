// src/shared/ui/form/footer/Footer.test.tsx
import { describe, expect, test, vi } from 'vitest';

import {
  createFormRef,
  mockData,
  renderWithForm,
  screen,
  testSchemas,
  userEvent,
  waitFor,
} from '../test-utils';

import { Footer } from './Footer';

describe('Footer Component', () => {
  const user = userEvent.setup();

  describe('Basic Rendering', () => {
    test('renders submit button by default', () => {
      renderWithForm(<Footer />, { schema: testSchemas.simple });

      expect(screen.getByRole('button', { name: /speichern/i })).toBeInTheDocument();
    });

    test('renders with custom submit text', () => {
      renderWithForm(<Footer submitText="Create Account" />, { schema: testSchemas.simple });

      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    });

    test('renders cancel button when showCancel is true', () => {
      renderWithForm(<Footer showCancel />, { schema: testSchemas.simple });

      expect(screen.getByRole('button', { name: /abbrechen/i })).toBeInTheDocument();
    });

    test('renders reset button when showReset is true', () => {
      renderWithForm(<Footer showReset />, { schema: testSchemas.simple });

      expect(screen.getByRole('button', { name: /zurücksetzen/i })).toBeInTheDocument();
    });

    test('renders buttons in correct order', () => {
      renderWithForm(<Footer showReset showCancel />, { schema: testSchemas.simple });

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveTextContent('Zurücksetzen');
      expect(buttons[1]).toHaveTextContent('Abbrechen');
      expect(buttons[2]).toHaveTextContent('Speichern');
    });
  });

  describe('Button States', () => {
    test('disables submit button when form is invalid', () => {
      const { FormWrapper, getForm } = createFormRef(testSchemas.simple);

      renderWithForm(
        <FormWrapper>
          <Footer form={getForm()} />
        </FormWrapper>,
      );

      const submitButton = screen.getByRole('button', { name: /speichern/i });
      expect(submitButton).toBeDisabled();
    });

    test('enables submit button when form is valid', async () => {
      const { FormWrapper, getForm } = createFormRef(
        testSchemas.simple,
        mockData.defaultValues.simple,
      );

      renderWithForm(
        <FormWrapper>
          <Footer form={getForm()} />
        </FormWrapper>,
      );

      // Form should be valid with default values
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /speichern/i });
        expect(submitButton).not.toBeDisabled();
      });
    });

    test('disables reset button when form is pristine', () => {
      const { FormWrapper, getForm } = createFormRef(
        testSchemas.simple,
        mockData.defaultValues.simple,
      );

      renderWithForm(
        <FormWrapper>
          <Footer form={getForm()} showReset />
        </FormWrapper>,
      );

      const resetButton = screen.getByRole('button', { name: /zurücksetzen/i });
      expect(resetButton).toBeDisabled();
    });

    test('enables reset button when form is dirty', async () => {
      const { FormWrapper, getForm } = createFormRef(
        testSchemas.simple,
        mockData.defaultValues.simple,
      );

      renderWithForm(
        <FormWrapper>
          <input {...getForm().register('name')} />
          <Footer form={getForm()} showReset />
        </FormWrapper>,
      );

      // Make form dirty
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'New Name');

      // Reset button should be enabled
      await waitFor(() => {
        const resetButton = screen.getByRole('button', { name: /zurücksetzen/i });
        expect(resetButton).not.toBeDisabled();
      });
    });
  });

  describe('Button Actions', () => {
    test('calls onCancel when cancel button clicked', async () => {
      const onCancel = vi.fn();
      renderWithForm(<Footer showCancel onCancel={onCancel} />, { schema: testSchemas.simple });

      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      await user.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test('resets form when reset button clicked', async () => {
      const onReset = vi.fn();
      const { FormWrapper, getForm } = createFormRef(
        testSchemas.simple,
        mockData.defaultValues.simple,
      );

      renderWithForm(
        <FormWrapper>
          <input {...getForm().register('name')} />
          <Footer form={getForm()} showReset onReset={onReset} />
        </FormWrapper>,
      );

      // Make form dirty
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'New Name');

      // Click reset
      const resetButton = screen.getByRole('button', { name: /zurücksetzen/i });
      await user.click(resetButton);

      // Should reset form and call onReset
      expect(input).toHaveValue('John Doe');
      expect(onReset).toHaveBeenCalledTimes(1);
    });

    test('submits form when submit button clicked', async () => {
      const onSubmit = vi.fn();
      const { FormWrapper, getForm } = createFormRef(
        testSchemas.simple,
        mockData.defaultValues.simple,
      );

      renderWithForm(
        <FormWrapper>
          <Footer form={getForm()} />
        </FormWrapper>,
        { onSubmit },
      );

      const submitButton = screen.getByRole('button', { name: /speichern/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(mockData.defaultValues.simple);
      });
    });
  });

  describe('Loading State', () => {
    test('shows loading state during submission', async () => {
      const onSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
      const { FormWrapper, getForm } = createFormRef(
        testSchemas.simple,
        mockData.defaultValues.simple,
      );

      renderWithForm(
        <FormWrapper>
          <Footer form={getForm()} />
        </FormWrapper>,
        { onSubmit },
      );

      const submitButton = screen.getByRole('button', { name: /speichern/i });
      await user.click(submitButton);

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText('Wird gespeichert...')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });

    test('disables all buttons during submission', async () => {
      const onSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
      const { FormWrapper, getForm } = createFormRef(
        testSchemas.simple,
        mockData.defaultValues.simple,
      );

      renderWithForm(
        <FormWrapper>
          <input {...getForm().register('name')} />
          <Footer form={getForm()} showReset showCancel />
        </FormWrapper>,
        { onSubmit },
      );

      // Make form dirty
      const input = screen.getByRole('textbox');
      await user.type(input, ' Updated');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /speichern/i });
      await user.click(submitButton);

      // All buttons should be disabled
      await waitFor(() => {
        const resetButton = screen.getByRole('button', { name: /zurücksetzen/i });
        const cancelButton = screen.getByRole('button', { name: /abbrechen/i });

        expect(resetButton).toBeDisabled();
        expect(cancelButton).toBeDisabled();
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Error Message', () => {
    test('displays error message when provided', () => {
      renderWithForm(<Footer error="Something went wrong. Please try again." />, {
        schema: testSchemas.simple,
      });

      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();

      // Should have error icon
      const errorContainer = screen.getByText(
        'Something went wrong. Please try again.',
      ).parentElement;
      expect(errorContainer?.querySelector('svg')).toBeInTheDocument();
    });

    test('has correct error styling', () => {
      renderWithForm(<Footer error="Error message" />, { schema: testSchemas.simple });

      const errorContainer = screen.getByText('Error message').parentElement;
      expect(errorContainer).toHaveClass('bg-destructive/10', 'text-destructive');
    });
  });

  describe('Success Message', () => {
    test('displays success message when provided', () => {
      renderWithForm(<Footer success="Form submitted successfully!" />, {
        schema: testSchemas.simple,
      });

      expect(screen.getByText('Form submitted successfully!')).toBeInTheDocument();

      // Should have success icon
      const successContainer = screen.getByText('Form submitted successfully!').parentElement;
      expect(successContainer?.querySelector('svg')).toBeInTheDocument();
    });

    test('has correct success styling', () => {
      renderWithForm(<Footer success="Success message" />, { schema: testSchemas.simple });

      const successContainer = screen.getByText('Success message').parentElement;
      expect(successContainer).toHaveClass('bg-green-50', 'text-green-600');
    });
  });

  describe('Custom Text', () => {
    test('uses custom button texts', () => {
      renderWithForm(
        <Footer
          showReset
          showCancel
          submitText="Save Changes"
          cancelText="Discard"
          resetText="Reset Form"
        />,
        { schema: testSchemas.simple },
      );

      expect(screen.getByRole('button', { name: 'Reset Form' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
    });
  });

  describe('Additional Props', () => {
    test('applies custom className', () => {
      const { container } = renderWithForm(<Footer className="custom-footer-class" />, {
        schema: testSchemas.simple,
      });

      const footer = container.querySelector('.custom-footer-class');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('space-y-4', 'border-t', 'pt-6');
    });
  });
});
