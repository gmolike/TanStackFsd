import { Article } from '~/entities/article';
import { ArticleList } from '~/widgets/article-list';

export function ArticlesPage() {
  // Mock data - später durch API-Call ersetzen
  const articles: Array<Article> = [
    { id: '1', name: 'Laptop Pro 15"', price: 1299.99, stock: 12, category: 'Elektronik' },
    { id: '2', name: 'Wireless Mouse', price: 29.99, stock: 45, category: 'Zubehör' },
    { id: '3', name: 'USB-C Hub', price: 49.99, stock: 23, category: 'Zubehör' },
    { id: '4', name: 'Monitor 27"', price: 399.99, stock: 8, category: 'Elektronik' },
    { id: '5', name: 'Tastatur Mechanisch', price: 89.99, stock: 15, category: 'Zubehör' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Artikel</h1>
        <p className="mt-2 text-gray-600">Übersicht aller verfügbaren Artikel</p>
      </div>

      <ArticleList articles={articles} />
    </div>
  );
}
