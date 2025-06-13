import { Button } from '~/shared/shadcn';

import { useDataTableContext } from '../../lib/context';

export type BulkAction = {
  label: string;
  action: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  icon?: React.ReactNode;
};

type BulkActionsProps<TData extends Record<string, unknown> = Record<string, unknown>> = {
  actions: Array<BulkAction>;
  onAction?: (action: string, rows: Array<TData>) => void;
};

export const BulkActions = <TData extends Record<string, unknown> = Record<string, unknown>>({
  actions,
  onAction,
}: BulkActionsProps<TData>) => {
  const { selection, table } = useDataTableContext<TData>();
  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);

  if (selection.selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{selection.selectedCount} ausgewählt</span>
      {actions.map((action) => (
        <Button
          key={action.action}
          variant={action.variant ?? 'outline'}
          size="sm"
          onClick={() => onAction?.(action.action, selectedRows)}
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  );
};
