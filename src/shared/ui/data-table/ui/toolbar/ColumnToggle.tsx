import { Settings2 } from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/shared/shadcn';

import { useDataTableContext } from '../../lib/context';

export const ColumnToggle = () => {
  const { table, ui, props } = useDataTableContext();
  const columnLabels = props?.tableDefinition.labels || {};

  const getColumnLabel = (columnId: string): string => columnLabels[columnId] || columnId;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Settings2 className={ui.showColumnToggleText ? 'mr-2 h-4 w-4' : 'h-4 w-4'} />
          {ui.showColumnToggleText && 'Spalten'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[200px]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel>Sichtbare Spalten</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide() && column.id !== 'actions')
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
              onSelect={(e) => e.preventDefault()}
            >
              {getColumnLabel(column.id)}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
