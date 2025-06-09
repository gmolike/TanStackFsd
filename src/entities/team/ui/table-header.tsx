// src/entities/team/ui/table-headers/index.tsx
import { ArrowUpDown } from 'lucide-react';

import { Button } from '~/shared/shadcn';

/**
 * CSDoc: Sortable Header Component
 * @description Header mit Sortier-Funktionalität
 */
export const SortableHeader = ({ column, label }: { column: any; label: string }) => (
  <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
    {label}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

/**
 * CSDoc: Simple Header Component
 * @description Einfacher Header ohne Funktionalität
 */
export const SimpleHeader = ({ label }: { label: string }) => <span>{label}</span>;
