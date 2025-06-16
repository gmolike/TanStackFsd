import type { Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import {
  ShadCnTableBody as TableBodyElement,
  ShadCnTableCell,
  ShadCnTableRow,
} from '~/shared/shadcn';

import { useDataTableContext } from '../../lib/context';

export const TableBody = () => {
  const { displayRows, table } = useDataTableContext();

  if (displayRows.length === 0) {
    return (
      <TableBodyElement>
        <ShadCnTableRow>
          <ShadCnTableCell
            colSpan={table.getAllColumns().length}
            className="h-24 text-center text-muted-foreground"
          >
            Keine Ergebnisse gefunden.
          </ShadCnTableCell>
        </ShadCnTableRow>
      </TableBodyElement>
    );
  }

  return (
    <TableBodyElement>
      {displayRows.map((row: Row<Record<string, unknown>>) => (
        <ShadCnTableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <ShadCnTableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </ShadCnTableCell>
          ))}
        </ShadCnTableRow>
      ))}
    </TableBodyElement>
  );
};
