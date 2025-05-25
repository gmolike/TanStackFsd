// src/shared/ui/form/checkbox/Checkbox.test.tsx
import { describe, expect, test, vi } from 'vitest';

import {
  createFormRef,
  renderWithForm,
  screen,
  testSchemas,
  userEvent,
  waitFor,
} from '../test-utils';

import { Checkbox } from './Checkbox';

describe('Checkbox Component', () => {
  const user = userEvent.setup();

  describe('Basic Rendering', () => {
    test('renders with label', () => {
      renderWithForm(
        <Checkbox
          control={{} as any}
          name="acceptTerms"
          label="I accept the terms and conditions"
        />,
        { schema: testSchemas.withCheckbox },
      );

      expect(screen.getByLabelText('I accept the terms and conditions')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    test('renders with description', () => {
      renderWithForm(
        <Checkbox
          control={{} as any}
          name="acceptTerms"
          label="Accept Terms"
          description="You must accept to continue"
        />,
        { schema: testSchemas.withCheckbox },
      );

      expect(screen.getByText('You must accept to continue')).toBeInTheDocument();
    });
  });

  describe('Label Positioning', () => {
    test('renders label on the right by default', () => {
      const { container } = renderWithForm(
        <Checkbox control={{} as any} name="acceptTerms" label="Accept" />,
        { schema: testSchemas.withCheckbox },
      );

      const wrapper = container.querySelector('.flex.items-center.space-x-2');
      expect(wrapper).toBeInTheDocument();
    });

    test('renders label on top when side="top"', () => {
      const { container } = renderWithForm(
        <Checkbox control={{} as any} name="acceptTerms" label="Accept" side="top" />,
        { schema: testSchemas.withCheckbox },
      );

      const wrapper = container.querySelector('.flex.flex-col-reverse.gap-2');
      expect(wrapper).toBeInTheDocument();
    });

    test('renders label on left when side="left"', () => {
      const { container } = renderWithForm(
        <Checkbox control={{} as any} name="acceptTerms" label="Accept" side="left" />,
        { schema: testSchemas.withCheckbox },
      );

      const wrapper = container.querySelector('.flex.flex-row-reverse.justify-end.gap-2');
      expect(wrapper).toBeInTheDocument();
    });

    test('renders label on bottom when side="bottom"', () => {
      const { container } = renderWithForm(
        <Checkbox control={{} as any} name="acceptTerms" label="Accept" side="bottom" />,
        { schema: testSchemas.withCheckbox },
      );

      const wrapper = container.querySelector('.flex.flex-col.gap-2');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Checked State', () => {
    test('toggles checked state on click', async () => {
      const { FormWrapper, getForm } = createFormRef(testSchemas.withCheckbox);

      renderWithForm(
        <FormWrapper>
          <Checkbox control={getForm().control} name="acceptTerms" label="Accept Terms" />
        </FormWrapper>,
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

    test('toggles on label click', async () => {
      const { FormWrapper, getForm } = createFormRef(testSchemas.withCheckbox);

      renderWithForm(
        <FormWrapper>
          <Checkbox control={getForm().control} name="acceptTerms" label="Accept Terms" />
        </FormWrapper>,
      );

      const label = screen.getByText('Accept Terms');
      const checkbox = screen.getByRole('checkbox');

      // Click label
      await user.click(label);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Required Field', () => {
    test('shows required indicator', () => {
      renderWithForm(
        <Checkbox control={{} as any} name="acceptTerms" label="Accept Terms" required />,
        { schema: testSchemas.withCheckbox },
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-required', 'true');
    });

    test('validates required checkbox', async () => {
      const { FormWrapper, getForm } = createFormRef(testSchemas.withCheckbox);

      const { container } = renderWithForm(
        <FormWrapper>
          <Checkbox control={getForm().control} name="acceptTerms" label="Accept Terms" />
          <button type="submit">Submit</button>
        </FormWrapper>,
      );

      // Try to submit without checking
      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);

      // Should show error
      await waitFor(() => {
        const errorElement = container.querySelector('[id="acceptTerms-form-message"]');
        expect(errorElement).toHaveTextContent('You must accept the terms');
      });
    });
  });

  describe('Default Values', () => {
    test('renders with default checked state', () => {
      const { FormWrapper, getForm } = createFormRef(testSchemas.withCheckbox, {
        acceptTerms: true,
        newsletter: false,
      });

      renderWithForm(
        <FormWrapper>
          <Checkbox control={getForm().control} name="acceptTerms" label="Accept Terms" />
          <Checkbox control={getForm().control} name="newsletter" label="Newsletter" />
        </FormWrapper>,
      );

      expect(screen.getByLabelText('Accept Terms')).toBeChecked();
      expect(screen.getByLabelText('Newsletter')).not.toBeChecked();
    });
  });

  describe('Disabled State', () => {
    test('disables checkbox when disabled prop is true', () => {
      renderWithForm(
        <Checkbox control={{} as any} name="acceptTerms" label="Accept Terms" disabled />,
        { schema: testSchemas.withCheckbox },
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
      expect(checkbox).toHaveAttribute('aria-required', 'true'); // Still required even when disabled
    });

    test('disables during form submission', async () => {
      const onSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
      const { FormWrapper, getForm } = createFormRef(testSchemas.withCheckbox, {
        acceptTerms: true,
      });

      renderWithForm(
        <FormWrapper>
          <Checkbox control={getForm().control} name="acceptTerms" label="Accept Terms" />
          <button type="submit">Submit</button>
        </FormWrapper>,
        { onSubmit },
      );

      // Submit form
      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);

      // Should be disabled during submission
      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBeDisabled();
      });
    });
  });

  describe('Additional Props', () => {
    test('passes className to form item', () => {
      const { container } = renderWithForm(
        <Checkbox
          control={{} as any}
          name="acceptTerms"
          label="Accept Terms"
          className="custom-class"
        />,
        { schema: testSchemas.withCheckbox },
      );

      const formItem = container.querySelector('.custom-class');
      expect(formItem).toBeInTheDocument();
    });
  });
});
