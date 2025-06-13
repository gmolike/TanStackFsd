// src/entities/article/model/table-definition.tsx
import type { ExtractFieldIds, FieldDefinition, TableDefinition } from '~/shared/ui/data-table';

import { articleLabels } from './labels';
import type { Article } from './schema';

// Article Number Cell
const ArticleNumberCell = ({ value }: { value: unknown; row: Article }) => (
  <div className="font-mono text-xs">{String(value)}</div>
);

// Name Cell
const ArticleNameCell = ({ value }: { value: unknown; row: Article }) => (
  <div className="font-medium">{String(value)}</div>
);

// Category Cell
const ArticleCategoryCell = ({ row }: { value: unknown; row: Article }) => (
  <div>
    {row.category}
    {row.subcategory && <span className="text-muted-foreground"> / {row.subcategory}</span>}
  </div>
);

// Price Cell
const ArticlePriceCell = ({ value }: { value: unknown; row: Article }) => {
  const price = Number(value);
  const formatted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
  return <div className="font-medium">{formatted}</div>;
};

// Stock Cell
const ArticleStockCell = ({ row }: { value: unknown; row: Article }) => {
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
const ArticleStatusCell = ({ value }: { value: unknown; row: Article }) => {
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
 * Article Table Field Definitions
 */
const articleFields: FieldDefinition<Article>[] = [
  {
    id: 'articleNumber',
    accessor: (row: Article) => row.articleNumber,
    sortable: true,
    searchable: true,
    cell: ArticleNumberCell,
  },
  {
    id: 'name',
    accessor: (row: Article) => row.name,
    sortable: true,
    searchable: true,
    cell: ArticleNameCell,
  },
  {
    id: 'category',
    accessor: (row: Article) => row.category,
    sortable: true,
    searchable: true,
    filterable: true,
    cell: ArticleCategoryCell,
  },
  {
    id: 'price',
    accessor: (row: Article) => row.price,
    sortable: true,
    searchable: false,
    cell: ArticlePriceCell,
  },
  {
    id: 'stock',
    accessor: (row: Article) => row.stock,
    sortable: true,
    searchable: false,
    cell: ArticleStockCell,
  },
  {
    id: 'status',
    accessor: (row: Article) => row.status,
    sortable: false,
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
];

/**
 * Article Table Definition
 */
export const articleTableDefinition: TableDefinition<Article> = {
  labels: articleLabels,
  fields: articleFields,
};

// Type für die verfügbaren Spalten-IDs
type ArticleColumnId = ExtractFieldIds<typeof articleTableDefinition>;

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
  ] as ArticleColumnId[],

  // Kompakte Ansicht
  compact: ['articleNumber', 'name', 'price', 'stock'] as ArticleColumnId[],

  // Inventar-Ansicht
  inventory: ['articleNumber', 'name', 'category', 'stock', 'status'] as ArticleColumnId[],

  // Ohne Actions
  readOnly: ['articleNumber', 'name', 'category', 'price', 'stock', 'status'] as ArticleColumnId[],
};
