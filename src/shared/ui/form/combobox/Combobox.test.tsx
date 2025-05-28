import { useForm } from 'react-hook-form';

import { waitFor } from '@testing-library/dom';
import type { RenderResult } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { Form as ShadcnForm } from '~/shared/shadcn';
import { cleanup, render } from '~/shared/test/test-utils';

import { Combobox } from './Combobox';

const setupCombobox = async (): Promise<RenderResult> => {
  const options = [
    { value: 'next', label: 'Next.js' },
    { value: 'svelte', label: 'SvelteKit' },
    { value: 'nuxt', label: 'Nuxt.js' },
    { value: 'remix', label: 'Remix' },
  ];

  const TestWrapper = ({ children }: { children: (form: any) => React.ReactNode }) => {
    const form = useForm({
      defaultValues: { framework: '' },
    });

    return (
      <ShadcnForm {...form}>
        <form>{children(form)}</form>
      </ShadcnForm>
    );
  };

  const renderResult = render(
    <TestWrapper>
      {(form) => (
        <Combobox
          control={form.control}
          name="framework"
          label="Framework"
          options={options}
          placeholder="Select framework..."
          searchPlaceholder="Search framework..."
        />
      )}
    </TestWrapper>,
  );

  // Wait for combobox to be rendered
  await waitFor(() => renderResult.getByRole('combobox'));

  return renderResult;
};

describe('Combobox Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders combobox with placeholder', async () => {
    const { getByRole } = await setupCombobox();

    const trigger = getByRole('combobox');
    expect(trigger.textContent).toContain('Select framework...');
  });

  test('opens dropdown on click', async () => {
    const { getByRole, getByPlaceholderText } = await setupCombobox();
    const user = userEvent.setup();

    const trigger = getByRole('combobox');
    await user.click(trigger);

    // Should show search input
    await waitFor(() => {
      getByPlaceholderText('Search framework...');
    });
  });

  test('filters options based on search', async () => {
    const { getByRole, getByPlaceholderText, getByText, queryByText } = await setupCombobox();
    const user = userEvent.setup();

    // Open combobox
    const trigger = getByRole('combobox');
    await user.click(trigger);

    // Type in search
    const searchInput = getByPlaceholderText('Search framework...');
    await user.type(searchInput, 'next');

    // Should show matching option
    await waitFor(() => {
      getByText('Next.js');
      // Should not show non-matching options
      expect(queryByText('SvelteKit')).toBeNull();
    });
  });

  test('selects option', async () => {
    const { getByRole, getByText } = await setupCombobox();
    const user = userEvent.setup();

    // Open and select
    const trigger = getByRole('combobox');
    await user.click(trigger);

    await waitFor(() => getByText('Next.js'));
    await user.click(getByText('Next.js'));

    // Should show selected value
    await waitFor(() => {
      expect(trigger.textContent).toContain('Next.js');
    });
  });

  test('clears selection', async () => {
    const { getByRole, getByText, getByLabelText } = await setupCombobox();
    const user = userEvent.setup();

    // Select an option first
    const trigger = getByRole('combobox');
    await user.click(trigger);
    await waitFor(() => getByText('Next.js'));
    await user.click(getByText('Next.js'));

    // Clear selection
    const clearButton = getByLabelText('Auswahl löschen');
    await user.click(clearButton);

    // Should show placeholder again
    await waitFor(() => {
      expect(trigger.textContent).toContain('Select framework...');
    });
  });

  test('handles async search callback', async () => {
    const onSearchChange = vi.fn();

    const TestWrapper = ({ children }: { children: (form: any) => React.ReactNode }) => {
      const form = useForm({
        defaultValues: { framework: '' },
      });

      return (
        <ShadcnForm {...form}>
          <form>{children(form)}</form>
        </ShadcnForm>
      );
    };

    const { getByRole, getByPlaceholderText } = render(
      <TestWrapper>
        {(form) => (
          <Combobox
            control={form.control}
            name="framework"
            label="Framework"
            options={[]}
            onSearchChange={onSearchChange}
          />
        )}
      </TestWrapper>,
    );

    const user = userEvent.setup();

    // Open and search
    await user.click(getByRole('combobox'));
    const searchInput = getByPlaceholderText('Suchen...');
    await user.type(searchInput, 'test');

    // Should call onSearchChange after debounce
    await waitFor(
      () => {
        expect(onSearchChange).toHaveBeenCalledWith('test');
      },
      { timeout: 500 },
    );
  });

  test('shows loading state', async () => {
    const TestWrapper = ({ children }: { children: (form: any) => React.ReactNode }) => {
      const form = useForm({
        defaultValues: { framework: '' },
      });

      return (
        <ShadcnForm {...form}>
          <form>{children(form)}</form>
        </ShadcnForm>
      );
    };

    const { getByRole, getByText } = render(
      <TestWrapper>
        {(form) => (
          <Combobox
            control={form.control}
            name="framework"
            label="Framework"
            options={[]}
            loading={true}
          />
        )}
      </TestWrapper>,
    );

    const user = userEvent.setup();

    // Open combobox
    await user.click(getByRole('combobox'));

    // Should show loading message
    await waitFor(() => {
      getByText('Wird geladen...');
    });
  });
});
