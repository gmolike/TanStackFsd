import { useState } from 'react';

import type { Article } from '~/entities/article';

import {
  InputShadcn as Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/shared/shadcn';

interface ArticleListProps {
  articles: Array<Article>;
}

export function ArticleList({ articles }: ArticleListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = articles.filter((article) =>
    article.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);

  return (
    <>
      <div className="flex items-center space-x-2">
        <Input
          type="search"
          placeholder="Artikel suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Kategorie</TableHead>
              <TableHead className="text-right">Preis</TableHead>
              <TableHead className="text-right">Lagerbestand</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.id}</TableCell>
                <TableCell>{article.name}</TableCell>
                <TableCell>{article.category}</TableCell>
                <TableCell className="text-right">{formatPrice(article.price)}</TableCell>
                <TableCell className="text-right">{article.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
