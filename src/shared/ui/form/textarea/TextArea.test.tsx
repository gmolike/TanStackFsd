// src/shared/ui/form/textarea/TextArea.test.tsx
import { useForm } from 'react-hook-form';

import { waitFor } from '@testing-library/dom';
import type { RenderResult } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { Form as ShadcnForm } from '~/shared/shadcn';
import { cleanup, render } from '~/shared/test/test-utils';

import { TextArea } from './TextArea';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const setupTextArea = async (
  textAreaProps: Partial<Parameters<typeof TextArea>[0]> = {},
): Promise<RenderResult> => {
  const TestWrapper = ({ children }: { children: (form: any) => React.ReactNode }) => {
    const form = useForm({
      defaultValues: { bio: '' },
    });

    return (
      <ShadcnForm {...form}>
        <form>{children(form)}</form>
      </ShadcnForm>
    );
  };

  const renderResult = render(
    <TestWrapper>
      {(form) => <TextArea control={form.control} name="bio" label="Bio" {...textAreaProps} />}
    </TestWrapper>,
  );

  // Wait for textarea to be rendered
  await waitFor(() => {
    const textareas = renderResult.container.querySelectorAll('textarea');
    expect(textareas.length).toBeGreaterThan(0);
  });

  return renderResult;
};

describe('TextArea Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders textarea with label', async () => {
    const { getByText, getByPlaceholderText } = await setupTextArea({
      label: 'Biography',
      placeholder: 'Tell us about yourself',
    });

    getByText('Biography');
    getByPlaceholderText('Tell us about yourself');
  });

  test('accepts multiline input', async () => {
    const { container } = await setupTextArea();
    const user = userEvent.setup();

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (textarea) {
      await user.type(textarea, 'Line 1{Enter}Line 2');

      await waitFor(() => {
        expect(textarea.value).toBe('Line 1\nLine 2');
      });
    }
  });

  test('respects rows prop', async () => {
    const { container } = await setupTextArea({ rows: 5 });

    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('rows', '5');
  });
});
