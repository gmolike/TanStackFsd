import type { UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';

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
  const defaultDialog = ({
    open: dialogOpen,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    value: unknown;
    onChange: (value: any) => void;
    name: string;
  }) => (
    <div role="dialog" aria-hidden={!dialogOpen}>
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

  const defaultChildren = (value: unknown): React.ReactNode => {
    const item = value as TestItem | null;
    return item ? item.name : 'No item selected';
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
        >
          {props.children || defaultChildren}
        </DialogButton>
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

  test('renders button with empty text when no value', async () => {
    const { getByRole } = await setupDialogButton({
      emptyText: 'No item selected',
    });

    const button = getByRole('button');
    expect(button.textContent).toContain('No item selected');
  });

  test('displays value using children function', async () => {
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
            dialog={() => <div role="dialog">Test Dialog</div>}
          >
            {(value: unknown) => {
              const item = value as TestItem | null;
              return item?.name || 'Unknown';
            }}
          </DialogButton>
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

  test('renders children as static content', async () => {
    const { getByRole } = await setupDialogButton({
      children: 'Static Content',
    });

    await waitFor(() => {
      const button = getByRole('button');
      expect(button.textContent).toContain('Static Content');
    });
  });

  test('renders date range with children function', async () => {
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
            dialog={() => <div role="dialog">Date Range Dialog</div>}
          >
            {(value: unknown) => {
              const dateRange = value as DateRange | null;
              return dateRange ? `${dateRange.start} - ${dateRange.end}` : 'Select date range';
            }}
            }
          </DialogButton>
        )}
      </TestWrapper>,
    );

    await waitFor(() => {
      const button = getByRole('button');
      expect(button.textContent).toContain('2024-01-01 - 2024-12-31');
    });
  });

  test('renders additional content', async () => {
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

    const { getByText } = render(
      <TestWrapper>
        {(form) => (
          <DialogButton
            control={form.control}
            name="selectedItem"
            label="Select Item"
            dialog={() => <div role="dialog">Test Dialog</div>}
            additionalContent={(value: TestItem | null) => value && <span>ID: {value.id}</span>}
          >
            {(item: TestItem | null) => item?.name || 'Unknown'}
          </DialogButton>
        )}
      </TestWrapper>,
    );

    await waitFor(() => {
      getByText('ID: 1');
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

  test('renders with custom empty text', async () => {
    const { getByRole } = await setupDialogButton({
      emptyText: 'Please select an option',
      children: (value: TestItem | null) => value?.name || null,
    });

    await waitFor(() => {
      const button = getByRole('button');
      expect(button.textContent).toContain('Please select an option');
    });
  });

  test('renders static additional content', async () => {
    const { getByText } = await setupDialogButton({
      additionalContent: <div>This is additional info</div>,
    });

    await waitFor(() => {
      getByText('This is additional info');
    });
  });
});
