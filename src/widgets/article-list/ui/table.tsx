// src/widgets/article-list/ui/table.tsx
import { useState } from 'react';

import { Link, useNavigate } from '@tanstack/react-router';
import { ChevronRight, Grid3X3, List, Package, Tag } from 'lucide-react';

import type { Article } from '~/entities/article';
import { articleColumnSets, articleTableDefinition } from '~/entities/article';

import { Button, Card, CardContent, CardHeader, CardTitle } from '~/shared/shadcn';
import { DataTable } from '~/shared/ui/data-table';

interface ArticleListProps {
  articles: Array<Article>;
  defaultView?: 'grid' | 'table';
}

export function ArticleList({ articles, defaultView = 'grid' }: ArticleListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>(defaultView);
  const navigate = useNavigate();

  const handleRowClick = (article: Article) => {
    navigate({ to: '/articles/$articleId', params: { articleId: article.id } });
  };

  const handleAddClick = () => {
    navigate({ to: '/articles' });
  };

  const handleEdit = (article: Article) => {
    navigate({ to: '/articles' });
  };

  const handleDelete = (article: Article) => {
    // Implement delete logic
    console.log('Delete article:', article.id);
  };

  // Grid view remains the same...
  const renderGridView = () => {
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            to="/articles/$articleId"
            params={{ articleId: article.id }}
            className="group"
          >
            <Card className="h-full transition-all hover:border-primary/20 hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-2 text-lg transition-colors group-hover:text-primary">
                      {article.name}
                    </CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Art.-Nr.: {article.articleNumber}
                    </p>
                  </div>
                  <ChevronRight className="ml-2 h-5 w-5 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {article.imageUrl && (
                  <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={article.imageUrl}
                      alt={article.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{article.price.toFixed(2)} €</span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[article.status]}`}
                    >
                      {statusLabels[article.status]}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>
                        {article.stock} {article.unit || 'Stück'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      <span>{article.category}</span>
                    </div>
                  </div>

                  {article.stock <= (article.minStock || 0) && (
                    <p className="text-xs font-medium text-orange-600">⚠️ Niedriger Lagerbestand</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  };

  const renderTableView = () => (
    <DataTable
      // Table Definition
      tableDefinition={articleTableDefinition}
      // Type-safe column selection
      selectableColumns={articleColumnSets.full}
      data={articles}
      // ID handling - KEINE selectedId, da wir auf der List-Route sind
      idKey="id"
      // Callbacks
      onRowClick={handleRowClick}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAddClick}
      // UI Options
      searchPlaceholder="Artikel suchen..."
      addButtonText="Neuer Artikel"
      showColumnToggle={true}
      pageSize={20}
      // Sticky Features
      stickyActionColumn={true}
      stickyHeader={true}
    />
  );

  return (
    <div className="space-y-4">
      {/* View Switcher */}
      <div className="flex justify-end">
        <div className="flex gap-1 rounded-md border p-1">
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            onClick={() => setViewMode('grid')}
            className="gap-2"
          >
            <Grid3X3 className="h-4 w-4" />
            Karten
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            onClick={() => setViewMode('table')}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            Tabelle
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? renderGridView() : renderTableView()}
    </div>
  );
}
