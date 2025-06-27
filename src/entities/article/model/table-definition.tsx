/* eslint-disable react-refresh/only-export-components */
// src/entities/article/model/table-definition.tsx
import type { TableDefinition } from '~/shared/ui/dataTable';

import { articleLabels } from './labels';
import type { Article } from './schema';

// Article Number Cell
const ArticleNumberCell = ({ value }: { value: unknown }) => (
  <div className="font-mono text-xs">{String(value)}</div>
);

// Name Cell
const ArticleNameCell = ({ value }: { value: unknown }) => (
  <div className="font-medium">{String(value)}</div>
);

// Category Cell
const ArticleCategoryCell = ({ row }: { row: Article }) => (
  <div>
    {row.category}
    {row.subcategory && <span className="text-muted-foreground"> / {row.subcategory}</span>}
  </div>
);

// Price Cell
const ArticlePriceCell = ({ value }: { value: unknown }) => {
  const price = Number(value);
  const formatted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
  return <div className="font-medium">{formatted}</div>;
};

// Stock Cell
const ArticleStockCell = ({ row }: { row: Article }) => {
  const { stock, minStock, unit = 'Stück' } = row;
  const isLow = stock <= minStock;

  return (
    <div className={isLow ? 'font-medium text-orange-600' : ''}>
      {stock} {unit}
      {isLow && <span className="text-xs"> ⚠️</span>}
    </div>
  );
};

// Status Cell
const ArticleStatusCell = ({ value }: { value: unknown }) => {
  const status = value as Article['status'];
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
};

/**
 * Article Table Definition
 */
export const articleTableDefinition: TableDefinition<Article> = {
  labels: articleLabels,
  fields: [
    {
      id: 'articleNumber',
      cell: ArticleNumberCell,
    },
    {
      id: 'name',
      cell: ArticleNameCell,
    },
    {
      id: 'category',
      filterable: true,
      cell: ArticleCategoryCell,
    },
    {
      id: 'price',
      searchable: false,
      cell: ArticlePriceCell,
    },
    {
      id: 'stock',
      searchable: false,
      cell: ArticleStockCell,
    },
    {
      id: 'status',
      searchable: false,
      filterable: true,
      cell: ArticleStatusCell,
    },
    {
      id: 'actions',
      sortable: false,
      searchable: false,
      cell: 'actions',
    },
  ],
};

/**
 * Vordefinierte Spalten-Sets
 */
export const articleColumnSets = {
  // Vollständige Tabelle
  full: [
    'articleNumber',
    'name',
    'category',
    'price',
    'stock',
    'status',
    'actions',
  ] as Array<string>,

  // Kompakte Ansicht
  compact: ['articleNumber', 'name', 'price', 'stock'] as Array<string>,

  // Inventar-Ansicht
  inventory: ['articleNumber', 'name', 'category', 'stock', 'status'] as Array<string>,

  // Ohne Actions
  readOnly: ['articleNumber', 'name', 'category', 'price', 'stock', 'status'] as Array<string>,
};
