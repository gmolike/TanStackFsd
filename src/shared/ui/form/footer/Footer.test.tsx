// src/shared/ui/form/footer/Footer.test.tsx
import { useForm } from 'react-hook-form';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { Form as ShadcnForm } from '~/shared/shadcn';

import { Footer } from './Footer';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('Footer Component', () => {
  test('renders submit button', () => {
    const form = useForm();

    render(
      <ShadcnForm {...form}>
        <form>
          <Footer />
        </form>
      </ShadcnForm>,
    );

    expect(screen.getByRole('button', { name: /speichern/i })).toBeInTheDocument();
  });

  test('shows cancel and reset buttons', () => {
    const form = useForm();

    render(
      <ShadcnForm {...form}>
        <form>
          <Footer showCancel showReset />
        </form>
      </ShadcnForm>,
    );

    expect(screen.getByRole('button', { name: /abbrechen/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /zurücksetzen/i })).toBeInTheDocument();
  });

  test('calls onCancel handler', async () => {
    const user = userEvent.setup();
    const form = useForm();
    const onCancel = vi.fn();

    render(
      <ShadcnForm {...form}>
        <form>
          <Footer showCancel onCancel={onCancel} />
        </form>
      </ShadcnForm>,
    );

    await user.click(screen.getByRole('button', { name: /abbrechen/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  test('displays error message', () => {
    const form = useForm();

    render(
      <ShadcnForm {...form}>
        <form>
          <Footer error="Something went wrong" />
        </form>
      </ShadcnForm>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  test('displays success message', () => {
    const form = useForm();

    render(
      <ShadcnForm {...form}>
        <form>
          <Footer success="Form saved successfully" />
        </form>
      </ShadcnForm>,
    );

    expect(screen.getByText('Form saved successfully')).toBeInTheDocument();
  });
});
