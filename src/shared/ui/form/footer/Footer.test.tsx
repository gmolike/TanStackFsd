// src/shared/ui/form/footer/Footer.test.tsx
import { useForm } from 'react-hook-form';

import { waitFor } from '@testing-library/dom';
import type { RenderResult } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { Form as ShadcnForm } from '~/shared/shadcn';
import { cleanup, render } from '~/shared/test/test-utils';

import { Footer } from './Footer';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const setupFooter = async (
  props: Partial<Parameters<typeof Footer>[0]> = {},
): Promise<RenderResult> => {
  const TestForm = () => {
    const form = useForm();
    return (
      <ShadcnForm {...form}>
        <form>
          <Footer {...props} />
        </form>
      </ShadcnForm>
    );
  };

  const renderResult = render(<TestForm />);

  // Wait for footer to be rendered
  await waitFor(() => {
    // Look for any button that could be the submit button
    const buttons = renderResult.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  return renderResult;
};

describe('Footer Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders submit button', async () => {
    const { queryByRole, getByText } = await setupFooter();

    // The button might have different text - check for common variations
    const submitButton =
      queryByRole('button', { name: 'Speichern' }) ||
      queryByRole('button', { name: /speichern/i }) ||
      getByText(/speichern/i);
    expect(submitButton).toBeTruthy();
  });

  test('shows cancel and reset buttons', async () => {
    const { queryByRole, getByText } = await setupFooter({ showCancel: true, showReset: true });

    // Look for cancel button
    const cancelButton =
      queryByRole('button', { name: 'Abbrechen' }) ||
      queryByRole('button', { name: /abbrechen/i }) ||
      getByText(/abbrechen/i);
    expect(cancelButton).toBeTruthy();

    // Look for reset button
    const resetButton =
      queryByRole('button', { name: 'Zurücksetzen' }) ||
      queryByRole('button', { name: /zurücksetzen/i }) ||
      getByText(/zurücksetzen/i);
    expect(resetButton).toBeTruthy();
  });

  test('calls onCancel handler', async () => {
    const onCancel = vi.fn();
    const { queryByRole, getByText } = await setupFooter({ showCancel: true, onCancel });
    const user = userEvent.setup();

    const cancelButton = queryByRole('button', { name: /abbrechen/i }) || getByText(/abbrechen/i);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (cancelButton) {
      await user.click(cancelButton);

      await waitFor(() => {
        expect(onCancel).toHaveBeenCalled();
      });
    }
  });

  test('displays error message', async () => {
    const { getByText } = await setupFooter({ error: 'Something went wrong' });

    getByText('Something went wrong');
  });

  test('displays success message', async () => {
    const { getByText } = await setupFooter({ success: 'Form saved successfully' });

    getByText('Form saved successfully');
  });
});
