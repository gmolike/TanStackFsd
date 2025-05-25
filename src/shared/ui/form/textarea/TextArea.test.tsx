// src/shared/ui/form/textarea/TextArea.test.tsx
import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

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

import { TextArea } from './TextArea';

describe('TextArea Component', () => {
  const user = userEvent.setup();

  describe('Basic Rendering', () => {
    test('renders with label and placeholder', () => {
      renderWithForm(
        <TextArea
          control={{} as any}
          name="bio"
          label="Biography"
          placeholder="Tell us about yourself"
        />,
        { schema: testSchemas.simple },
      );

      expect(screen.getByLabelText('Biography')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Tell us about yourself')).toBeInTheDocument();
    });

    test('renders with description', () => {
      renderWithForm(
        <TextArea
          control={{} as any}
          name="bio"
          label="Bio"
          description="Write a short bio (optional)"
        />,
        { schema: testSchemas.simple },
      );

      expect(screen.getByText('Write a short bio (optional)')).toBeInTheDocument();
    });

    test('renders with custom rows', () => {
      renderWithForm(<TextArea control={{} as any} name="bio" label="Bio" rows={5} />, {
        schema: testSchemas.simple,
      });

      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toHaveAttribute('rows', '5');
    });

    test('defaults to 3 rows', () => {
      renderWithForm(<TextArea control={{} as any} name="bio" label="Bio" />, {
        schema: testSchemas.simple,
      });

      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toHaveAttribute('rows', '3');
    });
  });

  describe('User Input', () => {
    test('accepts text input', async () => {
      const { FormWrapper, getForm } = createFormRef(testSchemas.simple);

      renderWithForm(
        <FormWrapper>
          <TextArea control={getForm().control} name="bio" label="Bio" />
        </FormWrapper>,
      );

      const textarea = screen.getByLabelText('Bio');
      const testText = 'This is my biography.\nIt has multiple lines.\nAnd some more text.';

      await user.type(textarea, testText);
      expect(textarea).toHaveValue(testText);
    });

    test('handles multiline input', async () => {
      const { FormWrapper, getForm } = createFormRef(testSchemas.simple);

      renderWithForm(
        <FormWrapper>
          <TextArea control={getForm().control} name="bio" label="Bio" />
        </FormWrapper>,
      );

      const textarea = screen.getByLabelText('Bio');

      // Type with line breaks
      await user.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3');
      expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3');
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
          <TextArea control={getForm().control} name="bio" label="Bio" />
        </FormWrapper>,
      );

      // Initially no reset button (value equals default)
      expect(screen.queryByLabelText('Auf Standardwert zurücksetzen')).not.toBeInTheDocument();

      // Change value
      const textarea = screen.getByLabelText('Bio');
      await user.clear(textarea);
      await user.type(textarea, 'New bio content');

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
          <TextArea control={getForm().control} name="bio" label="Bio" />
        </FormWrapper>,
      );

      const textarea = screen.getByLabelText('Bio');

      // Change value
      await user.clear(textarea);
      await user.type(textarea, 'New bio content');
      expect(textarea).toHaveValue('New bio content');

      // Click reset
      const resetButton = await screen.findByLabelText('Auf Standardwert zurücksetzen');
      await user.click(resetButton);

      // Should reset to default
      expect(textarea).toHaveValue('Software developer');
    });

    test('hides reset button when showReset is false', async () => {
      const { FormWrapper, getForm } = createFormRef(
        testSchemas.simple,
        mockData.defaultValues.simple,
      );

      renderWithForm(
        <FormWrapper>
          <TextArea control={getForm().control} name="bio" label="Bio" showReset={false} />
        </FormWrapper>,
      );

      // Change value
      const textarea = screen.getByLabelText('Bio');
      await user.clear(textarea);
      await user.type(textarea, 'New bio content');

      // Reset button should not appear
      expect(screen.queryByLabelText('Auf Standardwert zurücksetzen')).not.toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    test('shows validation error for long text', async () => {
      // Create schema with max length
      const schemaWithMaxLength = testSchemas.simple.extend({
        bio: testSchemas.simple.shape.bio.refine(
          (val) => !val || val.length <= 100,
          'Bio must be 100 characters or less',
        ),
      });

      const { FormWrapper, getForm } = createFormRef(schemaWithMaxLength);

      const { container } = renderWithForm(
        <FormWrapper>
          <TextArea control={getForm().control} name="bio" label="Bio" />
        </FormWrapper>,
      );

      const textarea = screen.getByLabelText('Bio');

      // Type text longer than 100 characters
      const longText = 'a'.repeat(101);
      await user.type(textarea, longText);
      await user.tab(); // Blur to trigger validation

      // Should show error
      await waitFor(() => {
        const errorElement = container.querySelector('[id="bio-form-message"]');
        expect(errorElement).toHaveTextContent('Bio must be 100 characters or less');
      });
    });
  });

  describe('Disabled State', () => {
    test('disables textarea when disabled prop is true', () => {
      const { container } = renderWithForm(
        <TextArea control={{} as any} name="bio" label="Bio" disabled />,
        { schema: testSchemas.simple },
      );

      formAssertions.isFieldDisabled(container, 'bio');
    });

    test('disables during form submission', async () => {
      const onSubmit = vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
      const { FormWrapper, getForm } = createFormRef(testSchemas.simple);

      const { container } = renderWithForm(
        <FormWrapper>
          <TextArea control={getForm().control} name="bio" label="Bio" />
          <button type="submit">Submit</button>
        </FormWrapper>,
        { onSubmit },
      );

      // Fill required fields
      const textarea = screen.getByLabelText('Bio');
      await user.type(textarea, 'Some bio text');

      // Submit form
      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);

      // Should be disabled during submission
      await waitFor(() => {
        formAssertions.isFieldDisabled(container, 'bio');
      });
    });
  });

  describe('ARIA Attributes', () => {
    test('has correct ARIA attributes', () => {
      renderWithForm(<TextArea control={{} as any} name="bio" label="Bio" required />, {
        schema: testSchemas.simple,
      });

      const textarea = screen.getByLabelText('Bio');
      expect(textarea).toHaveAttribute('aria-required', 'true');
      expect(textarea).toHaveAttribute('aria-invalid', 'false');
      expect(textarea).toHaveAttribute('aria-disabled', 'false');
    });

    test('updates aria-invalid on error', async () => {
      const schemaWithRequired = z.object({
        bio: z.string().min(10, 'Bio must be at least 10 characters'),
      });

      const { FormWrapper, getForm } = createFormRef(schemaWithRequired);

      renderWithForm(
        <FormWrapper>
          <TextArea control={getForm().control} name="bio" label="Bio" />
        </FormWrapper>,
      );

      const textarea = screen.getByLabelText('Bio');

      // Type short text
      await user.type(textarea, 'Short');
      await user.tab();

      // Should have aria-invalid
      await waitFor(() => {
        expect(textarea).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });

  describe('Additional Props', () => {
    test('passes className to form item', () => {
      const { container } = renderWithForm(
        <TextArea control={{} as any} name="bio" label="Bio" className="custom-textarea-wrapper" />,
        { schema: testSchemas.simple },
      );

      const formItem = container.querySelector('.custom-textarea-wrapper');
      expect(formItem).toBeInTheDocument();
    });
  });
});
