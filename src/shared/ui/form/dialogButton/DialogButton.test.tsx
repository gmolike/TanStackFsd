import { useForm } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';

import { waitFor } from '@testing-library/dom';
import type { RenderResult } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Calendar } from 'lucide-react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { Form as ShadcnForm } from '~/shared/shadcn';
import { cleanup, render } from '~/shared/test/test-utils';

import { DialogButton } from './DialogButton';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

interface TestItem {
  id: number;
  name: string;
}

interface DateRange {
  start: string;
  end: string;
}

const setupDialogButton = async (
  props: Partial<Parameters<typeof DialogButton>[0]> = {},
): Promise<RenderResult> => {
  const defaultDialog = ({ open }: { open: boolean }) => (
    <div role="dialog" aria-hidden={!open}>
      Default Test Dialog
    </div>
  );

  const TestWrapper = ({
    children,
  }: {
    children: (form: UseFormReturn<{ selectedItem: TestItem | null }>) => React.ReactNode;
  }) => {
    const form = useForm<{ selectedItem: TestItem | null }>({
      defaultValues: { selectedItem: null },
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
        <DialogButton
          control={form.control}
          name="selectedItem"
          label="Select Item"
          dialog={defaultDialog}
          {...props}
        />
      )}
    </TestWrapper>,
  );

  // Wait for button to be rendered
  await waitFor(() => renderResult.getByRole('button'));

  return renderResult;
};

describe('DialogButton Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders button with empty text', async () => {
    const { getByRole } = await setupDialogButton({
      emptyText: 'No item selected',
    });

    const button = getByRole('button');
    expect(button.textContent).toContain('No item selected');
  });

  test('displays formatted value', async () => {
    const TestWrapper = ({
      children,
    }: {
      children: (form: UseFormReturn<{ selectedItem: TestItem | null }>) => React.ReactNode;
    }) => {
      const form = useForm<{ selectedItem: TestItem | null }>({
        defaultValues: { selectedItem: { id: 1, name: 'Test Item' } },
      });

      return (
        <ShadcnForm {...form}>
          <form>{children(form)}</form>
        </ShadcnForm>
      );
    };

    const { getByRole } = render(
      <TestWrapper>
        {(form) => (
          <DialogButton
            control={form.control}
            name="selectedItem"
            label="Select Item"
            displayMode="formatted"
            formatter={(item) => item?.name || 'Unknown'}
          />
        )}
      </TestWrapper>,
    );

    await waitFor(() => {
      const button = getByRole('button');
      expect(button.textContent).toContain('Test Item');
    });
  });

  test('renders with icon', async () => {
    const { getByRole, container } = await setupDialogButton({
      icon: Calendar,
    });

    getByRole('button');

    // Check if SVG icon is present
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  test('renders children as function', async () => {
    const TestWrapper = ({
      children,
    }: {
      children: (form: UseFormReturn<{ selectedItem: DateRange | null }>) => React.ReactNode;
    }) => {
      const form = useForm<{ selectedItem: DateRange | null }>({
        defaultValues: { selectedItem: { start: '2024-01-01', end: '2024-12-31' } },
      });

      return (
        <ShadcnForm {...form}>
          <form>{children(form)}</form>
        </ShadcnForm>
      );
    };

    const { getByRole } = render(
      <TestWrapper>
        {(form) => (
          <DialogButton
            control={form.control}
            name="selectedItem"
            label="Date Range"
            displayMode="children"
            dialog={() => <div role="dialog">Date Range Dialog</div>}
          >
            {(value) => (value ? `${value.start} - ${value.end}` : 'Select date range')}
          </DialogButton>
        )}
      </TestWrapper>,
    );

    await waitFor(() => {
      const button = getByRole('button');
      expect(button.textContent).toContain('2024-01-01 - 2024-12-31');
    });
  });

  test('opens dialog when clicked', async () => {
    const { getByRole } = await setupDialogButton({
      dialog: ({ open, onOpenChange }) => (
        <div role="dialog" aria-hidden={!open}>
          {open && <button onClick={() => onOpenChange(false)}>Close</button>}
        </div>
      ),
    });
    const user = userEvent.setup();

    const button = getByRole('button');
    await user.click(button);

    // Dialog should be rendered and open
    await waitFor(() => {
      const dialog = document.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
      expect(dialog?.getAttribute('aria-hidden')).toBe('false');
    });
  });

  test('requires dialog prop', async () => {
    const TestWrapper = ({
      children,
    }: {
      children: (form: UseFormReturn<{ selectedItem: TestItem | null }>) => React.ReactNode;
    }) => {
      const form = useForm<{ selectedItem: TestItem | null }>({
        defaultValues: { selectedItem: null },
      });

      return (
        <ShadcnForm {...form}>
          <form>{children(form)}</form>
        </ShadcnForm>
      );
    };

    const { getByRole } = render(
      <TestWrapper>
        {(form) => (
          <DialogButton
            control={form.control}
            name="selectedItem"
            label="Select Item"
            dialog={({ open }) => (
              <div role="dialog" data-testid="test-dialog" aria-hidden={!open}>
                Test Dialog
              </div>
            )}
          />
        )}
      </TestWrapper>,
    );

    await waitFor(() => {
      getByRole('button');
      // Dialog should be in the DOM
      const dialog = document.querySelector('[data-testid="test-dialog"]');
      expect(dialog).toBeTruthy();
    });
  });
});
