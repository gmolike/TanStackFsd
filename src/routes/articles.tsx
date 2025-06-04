// src/routes/articles.tsx
import { useState } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import {
  InputShadcn as Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../shared/shadcn';

// ================= TYPES =================
type Article = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
};

// ================= LOGIC =================
const articlesRoute = createFileRoute('/articles')({
  component: ArticlesPage,
});

function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - später durch API-Call ersetzen
  const articles: Array<Article> = [
    { id: '1', name: 'Laptop Pro 15"', price: 1299.99, stock: 12, category: 'Elektronik' },
    { id: '2', name: 'Wireless Mouse', price: 29.99, stock: 45, category: 'Zubehör' },
    { id: '3', name: 'USB-C Hub', price: 49.99, stock: 23, category: 'Zubehör' },
    { id: '4', name: 'Monitor 27"', price: 399.99, stock: 8, category: 'Elektronik' },
    { id: '5', name: 'Tastatur Mechanisch', price: 89.99, stock: 15, category: 'Zubehör' },
  ];

  const filteredArticles = articles.filter((article) =>
    article.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);

  // ================= RETURN =================
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Artikel</h1>
        <p className="mt-2 text-gray-600">Übersicht aller verfügbaren Artikel</p>
      </div>

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
    </div>
  );
}

export const Route = articlesRoute;
