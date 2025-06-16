import { Download } from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/shared/shadcn';

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

interface ExportButtonProps<TData> {
  data: Array<TData>;
  columns: Array<{ id: string; label: string }>;
  formats?: Array<ExportFormat>;
  onExport?: (format: ExportFormat, data: Array<TData>) => void;
}

export const ExportButton = <TData extends Record<string, unknown>>({
  data,
  formats = ['csv', 'excel', 'json'],
  onExport,
}: ExportButtonProps<TData>) => {
  const handleExport = (format: ExportFormat) => {
    if (onExport) {
      onExport(format, data);
    } else {
      // Default export implementation
      console.log(`Exporting ${data.length} rows as ${format}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {formats.includes('csv') && (
          <DropdownMenuItem onClick={() => handleExport('csv')}>
            Als CSV exportieren
          </DropdownMenuItem>
        )}
        {formats.includes('excel') && (
          <DropdownMenuItem onClick={() => handleExport('excel')}>
            Als Excel exportieren
          </DropdownMenuItem>
        )}
        {formats.includes('pdf') && (
          <DropdownMenuItem onClick={() => handleExport('pdf')}>
            Als PDF exportieren
          </DropdownMenuItem>
        )}
        {formats.includes('json') && (
          <DropdownMenuItem onClick={() => handleExport('json')}>
            Als JSON exportieren
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
