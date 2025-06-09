// src/shared/ui/data-table/columns/article-columns.tsx
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import type { Article } from '~/entities/article';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/shared/shadcn';

/**
 * Spalten-Definition für die Artikel-Tabelle
 */
export const articleColumns: Array<ColumnDef<Article>> = [
  {
    accessorKey: 'articleNumber',
    header: 'Art.-Nr.',
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue('articleNumber')}</div>,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Kategorie
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const category = row.getValue('category');
      const subcategory = row.original.subcategory;
      return (
        <div>
          {category}
          {subcategory && <span className="text-muted-foreground"> / {subcategory}</span>}
        </div>
      );
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Preis
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
      }).format(price);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Bestand
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const stock = row.getValue('stock');
      const minStock = row.original.minStock;
      const unit = row.original.unit || 'Stück';
      const isLow = stock <= minStock;

      return (
        <div className={isLow ? 'font-medium text-orange-600' : ''}>
          {stock} {unit}
          {isLow && <span className="text-xs"> ⚠️</span>}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status');
      const statusColors = {
        available: 'bg-green-100 text-green-800',
        unavailable: 'bg-red-100 text-red-800',
        discontinued: 'bg-gray-100 text-gray-800',
        coming_soon: 'bg-blue-100 text-blue-800',
      };
      const statusLabels = {
        available: 'Verfügbar',
        unavailable: 'Nicht verfügbar',
        discontinued: 'Eingestellt',
        coming_soon: 'Demnächst',
      };
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status]}`}
        >
          {statusLabels[status]}
        </span>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const article = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menü öffnen</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(article.articleNumber)}>
              Artikelnummer kopieren
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Details anzeigen</DropdownMenuItem>
            <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
            <DropdownMenuItem>Duplizieren</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Löschen</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
