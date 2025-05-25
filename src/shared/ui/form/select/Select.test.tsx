// src/shared/ui/form/select/Select.test.tsx
import { describe, expect, test } from 'vitest';

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

import { Select } from './Select';

describe('Select Component', () => {
  const user = userEvent.setup();

  describe('Basic Rendering', () => {
    test('renders with label and placeholder', () => {
      renderWithForm(
        <Select
          control={{} as any}
          name="country"
          label="Country"
          placeholder="Choose a country"
          options={mockData.options.countries}
        />,
        { schema: testSchemas.withSelect },
      );

      expect(screen.getByLabelText('Country')).toBeInTheDocument();
      expect(screen.getByText('Choose a country')).toBeInTheDocument();
    });

    test('renders with description', () => {
      renderWithForm(
        <Select
          control={{} as any}
          name="country"
          label="Country"
          description="Select your country of residence"
          options={mockData.options.countries}
        />,
        { schema: testSchemas.withSelect },
      );

      expect(screen.getByText('Select your country of residence')).toBeInTheDocument();
    });

    test('renders all options when clicked', async () => {
      renderWithForm(
        <Select
          control={{} as any}
          name="country"
          label="Country"
          options={mockData.options.countries}
        />,
        { schema: testSchemas.withSelect },
      );

      // Open select
      const trigger = screen.getByRole('combobox', { name: 'Country' });
      await user.click(trigger);

      // Check all options are visible
      for (const option of mockData.options.countries) {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      }
    });
  });

  describe('Empty Option', () => {
    test('renders empty option when provided', async () => {
      renderWithForm(
        <Select
          control={{} as any}
          name="country"
          label="Country"
          options={mockData.options.countries}
          emptyOption="None selected"
        />,
        { schema: testSchemas.withSelect },
      );

      // Open select
      const trigger = screen.getByRole('combobox', { name: 'Country' });
      await user.click(trigger);

      // Empty option should be first
      expect(screen.getByText('None selected')).toBeInTheDocument();
    });

    test('selects empty option to clear value', async () => {
      const { FormWrapper, getForm } = createFormRef(testSchemas.withSelect, {
        country: 'de',
      });

      renderWithForm(
        <FormWrapper>
          <Select
            control={getForm().control}
            name="country"
            label="Country"
            options={mockData.options.countries}
            emptyOption="None"
          />
        </FormWrapper>,
      );

      // Initially has value
      expect(screen.getByText('Germany')).toBeInTheDocument();

      // Open and select empty option
      const trigger = screen.getByRole('combobox', { name: 'Country' });
      await user.click(trigger);
      await user.click(screen.getByText('None'));

      // Value should be cleared
      await waitFor(() => {
        expect(screen.queryByText('Germany')).not.toBeInTheDocument();
        expect(getForm().getValues('country')).toBe('');
      });
    });
  });

  describe('Clear Button', () => {
    test('shows clear button when value is selected', async () => {
      const { FormWrapper, getForm } = createFormRef(testSchemas.withSelect, {
        country: 'de',
      });

      renderWithForm(
        <FormWrapper>
          <Select
            control={getForm().control}
            name="country"
            label="Country"
            options={mockData.options.countries}
          />
        </FormWrapper>,
      );

      // Clear button should be visible
      expect(screen.getByLabelText('Auswahl löschen')).toBeInTheDocument();
    });

    test('clears value when clear button clicked', async () => {
      const { FormWrapper, getForm } = createFormRef(testSchemas.withSelect, {
        country: 'de',
      });

      renderWithForm(
        <FormWrapper>
          <Select
            control={getForm().control}
            name="country"
            label="Country"
            options={mockData.options.countries}
          />
        </FormWrapper>,
      );

      // Click clear button
      const clearButton = screen.getByLabelText('Auswahl löschen');
      await user.click(clearButton);

      // Value should be cleared
      await waitFor(() => {
        expect(screen.queryByText('Germany')).not.toBeInTheDocument();
        // Use getForm() to check the value instead of container
        expect(getForm().getValues('country')).toBe('');
      });
    });

    test('hides clear button when showClear is false', () => {
      const { FormWrapper, getForm } = createFormRef(testSchemas.withSelect, {
        country: 'de',
      });

      renderWithForm(
        <FormWrapper>
          <Select
            control={getForm().control}
            name="country"
            label="Country"
            options={mockData.options.countries}
            showClear={false}
          />
        </FormWrapper>,
      );

      // Clear button should not be visible
      expect(screen.queryByLabelText('Auswahl löschen')).not.toBeInTheDocument();
    });
  });

  describe('Reset Functionality', () => {
    test('shows reset button when value differs from default', async () => {
      const { FormWrapper, getForm } = createFormRef(testSchemas.withSelect, {
        country: 'de',
      });

      renderWithForm(
        <FormWrapper>
          <Select
            control={getForm().control}
            name="country"
            label="Country"
            options={mockData.options.countries}
          />
        </FormWrapper>,
      );

      // Initially no reset button (value equals default)
      expect(screen.queryByLabelText('Auf Standardwert zurücksetzen')).not.toBeInTheDocument();

      // Change value
      const trigger = screen.getByRole('combobox', { name: 'Country' });
      await user.click(trigger);
      await user.click(screen.getByText('United States'));

      // Reset button should appear
      await waitFor(() => {
        expect(screen.getByLabelText('Auf Standardwert zurücksetzen')).toBeInTheDocument();
      });
    });

    test('resets to default value when reset button clicked', async () => {
      const { FormWrapper, getForm } = createFormRef(testSchemas.withSelect, {
        country: 'de',
      });

      renderWithForm(
        <FormWrapper>
          <Select
            control={getForm().control}
            name="country"
            label="Country"
            options={mockData.options.countries}
          />
        </FormWrapper>,
      );

      // Change value
      const trigger = screen.getByRole('combobox', { name: 'Country' });
      await user.click(trigger);
      await user.click(screen.getByText('United States'));

      // Verify changed
      expect(screen.getByText('United States')).toBeInTheDocument();

      // Click reset
      const resetButton = await screen.findByLabelText('Auf Standardwert zurücksetzen');
      await user.click(resetButton);

      // Should reset to default
      await waitFor(() => {
        expect(screen.getByText('Germany')).toBeInTheDocument();
      });
    });
  });

  describe('Disabled Options', () => {
    test('renders disabled options correctly', async () => {
      const optionsWithDisabled = [
        ...mockData.options.countries,
        { value: 'disabled', label: 'Disabled Option', disabled: true },
      ];

      renderWithForm(
        <Select control={{} as any} name="country" label="Country" options={optionsWithDisabled} />,
        { schema: testSchemas.withSelect },
      );

      // Open select
      const trigger = screen.getByRole('combobox', { name: 'Country' });
      await user.click(trigger);

      // Check disabled option
      const disabledOption = screen.getByText('Disabled Option');
      expect(disabledOption.closest('[role="option"]')).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Validation', () => {
    test('shows validation error for required field', async () => {
      const { FormWrapper, getForm } = createFormRef(testSchemas.withSelect);

      const { container } = renderWithForm(
        <FormWrapper>
          <Select
            control={getForm().control}
            name="country"
            label="Country"
            options={mockData.options.countries}
          />
          <button type="submit">Submit</button>
        </FormWrapper>,
      );

      // Try to submit without selecting
      const submitButton = screen.getByText('Submit');
      await user.click(submitButton);

      // Should show error
      await waitFor(() => {
        formAssertions.hasFieldError(container, 'country', 'Please select a country');
      });
    });
  });

  describe('Disabled State', () => {
    test('disables select when disabled prop is true', () => {
      renderWithForm(
        <Select
          control={{} as any}
          name="country"
          label="Country"
          options={mockData.options.countries}
          disabled
        />,
        { schema: testSchemas.withSelect },
      );

      const trigger = screen.getByRole('combobox', { name: 'Country' });
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
