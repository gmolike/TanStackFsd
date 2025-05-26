// src/shared/ui/form/select/Select.test.tsx
import { useForm } from 'react-hook-form';

import { waitFor } from '@testing-library/dom';
import type { RenderResult } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, test, vi } from 'vitest';

import { Form as ShadcnForm } from '~/shared/shadcn';
import { cleanup, render } from '~/shared/test/test-utils';

import { Select } from './Select';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const setupSelect = async (): Promise<RenderResult> => {
  const options = [
    { value: 'de', label: 'Germany' },
    { value: 'us', label: 'United States' },
  ];

  const TestWrapper = ({ children }: { children: (form: any) => React.ReactNode }) => {
    const form = useForm({
      defaultValues: { country: '' },
    });

    return (
      <ShadcnForm {...form}>
        <form>{children(form)}</form>
      </ShadcnForm>
    );
  };

  const renderResult = render(
    <TestWrapper>
      {(form) => <Select control={form.control} name="country" label="Country" options={options} />}
    </TestWrapper>,
  );

  // Wait for select to be rendered
  await waitFor(() => renderResult.getByRole('combobox'));

  return renderResult;
};

describe('Select Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders select with options', async () => {
    const { getByRole, getByText } = await setupSelect();
    const user = userEvent.setup();

    // Open select
    const trigger = getByRole('combobox');
    await user.click(trigger);

    // Check options
    await waitFor(() => {
      getByText('Germany');
      getByText('United States');
    });
  });

  test('selects option', async () => {
    const { getByRole, getByText } = await setupSelect();
    const user = userEvent.setup();

    // Open and select
    const trigger = getByRole('combobox');
    await user.click(trigger);

    await waitFor(() => getByText('Germany'));
    await user.click(getByText('Germany'));

    // Should show selected value
    await waitFor(() => {
      getByText('Germany');
    });
  });
});
