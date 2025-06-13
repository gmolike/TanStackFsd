import { ShadCnTableBody, ShadCnTableCell, ShadCnTableRow } from '~/shared/shadcn';

import { useDataTableContext } from '../DataTableProvider';

import { TableRow } from './TableRow';

export const TableBody = () => {
  const { displayRows, table } = useDataTableContext();

  if (displayRows.length === 0) {
    return (
      <ShadCnTableBody>
        <ShadCnTableRow>
          <ShadCnTableCell
            colSpan={table.getAllColumns().length}
            className="h-24 text-center text-muted-foreground"
          >
            Keine Ergebnisse gefunden.
          </ShadCnTableCell>
        </ShadCnTableRow>
      </ShadCnTableBody>
    );
  }

  return (
    <ShadCnTableBody>
      {displayRows.map((row) => (
        <TableRow key={row.id} row={row} />
      ))}
    </ShadCnTableBody>
  );
};
