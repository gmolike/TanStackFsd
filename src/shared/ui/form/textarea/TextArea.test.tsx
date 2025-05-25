// src/shared/ui/form/textarea/TextArea.test.tsx
import { useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { Form as ShadcnForm } from '~/shared/shadcn';

import { TextArea } from './TextArea';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const TestWrapper = ({
  children,
}: {
  children: React.ReactNode | ((form: any) => React.ReactNode);
}) => {
  const form = useForm({
    defaultValues: { bio: '' },
  });

  return (
    <ShadcnForm {...form}>
      <form>{typeof children === 'function' ? children(form) : children}</form>
    </ShadcnForm>
  );
};

describe('TextArea Component', () => {
  test('renders textarea with label', () => {
    render(
      <TestWrapper>
        {(form) => (
          <TextArea
            control={form.control}
            name="bio"
            label="Biography"
            placeholder="Tell us about yourself"
          />
        )}
      </TestWrapper>,
    );

    expect(screen.getByText('Biography')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tell us about yourself')).toBeInTheDocument();
  });

  test('accepts multiline input', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        {(form) => <TextArea control={form.control} name="bio" label="Bio" />}
      </TestWrapper>,
    );

    const textarea = screen.getByRole('textbox', { name: 'Bio' });
    await user.type(textarea, 'Line 1{Enter}Line 2');

    expect(textarea).toHaveValue('Line 1\nLine 2');
  });

  test('respects rows prop', () => {
    render(
      <TestWrapper>
        {(form) => <TextArea control={form.control} name="bio" label="Bio" rows={5} />}
      </TestWrapper>,
    );

    const textarea = screen.getByRole('textbox', { name: 'Bio' });
    expect(textarea).toHaveAttribute('rows', '5');
  });
});
