// src/pages/articles/detail/ui/page.tsx
import { useParams } from '@tanstack/react-router';
import { Box, Calendar, Package, Tag, TrendingUp, Truck } from 'lucide-react';

import type { Article } from '~/entities/article';

import { Button, Card, CardContent, CardHeader, CardTitle } from '~/shared/shadcn';

// Mock function - später durch API-Call ersetzen
function getArticleById(id: string): Article | undefined {
  const mockArticles: Array<Article> = [
    {
      id: '1',
      articleNumber: 'ART-001',
      name: 'Laptop Pro 15"',
      description:
        'Hochleistungs-Laptop mit 15 Zoll Display, perfekt für professionelle Anwendungen. Ausgestattet mit dem neuesten Intel Core i7 Prozessor, 16GB RAM und 512GB SSD.',
      price: 1299.99,
      purchasePrice: 899.99,
      stock: 12,
      minStock: 5,
      maxStock: 50,
      category: 'Elektronik',
      subcategory: 'Laptops',
      tags: ['Business', 'Premium', 'Intel'],
      status: 'available',
      dimensions: {
        length: 35.6,
        width: 24.3,
        height: 1.8,
        weight: 1850,
        unit: 'cm',
      },
      ean: '4251234567890',
      manufacturer: 'TechPro GmbH',
      supplier: {
        id: 'SUP-001',
        name: 'Mega Electronics',
        contactPerson: 'Thomas Müller',
        email: 'thomas@megaelectronics.de',
        phone: '+49 30 12345678',
      },
      createdAt: new Date('2024-01-15'),
      taxRate: 19,
      unit: 'Stück',
      isDigital: false,
      imageUrl: 'https://via.placeholder.com/400x300',
      thumbnailUrl: 'https://via.placeholder.com/150x150',
    },
    {
      id: '2',
      articleNumber: 'ART-002',
      name: 'Wireless Mouse',
      description:
        'Ergonomische kabellose Maus mit präzisem optischen Sensor und langer Akkulaufzeit.',
      price: 29.99,
      stock: 45,
      minStock: 10,
      category: 'Zubehör',
      subcategory: 'Eingabegeräte',
      tags: ['Wireless', 'Ergonomisch'],
      status: 'available',
      createdAt: new Date('2024-02-01'),
      taxRate: 19,
      unit: 'Stück',
      isDigital: false,
    },
    // ... weitere Mock-Daten
  ];

  return mockArticles.find((article) => article.id === id);
}

export function ArticlesDetailPage() {
  const { articleId } = useParams({ from: '/articles/$articleId' });
  const article = getArticleById(articleId);

  if (!article) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-muted-foreground">Artikel nicht gefunden</p>
            <Button className="mt-4" onClick={() => window.history.back()}>
              Zurück zur Übersicht
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const margin = article.purchasePrice
    ? (((article.price - article.purchasePrice) / article.price) * 100).toFixed(1)
    : null;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => window.history.back()}>
          ← Zurück zur Übersicht
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Hauptinformationen */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{article.name}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Art.-Nr.: {article.articleNumber}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[article.status]}`}
                >
                  {statusLabels[article.status]}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {article.imageUrl && (
                <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={article.imageUrl}
                    alt={article.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {article.description && (
                <div>
                  <h3 className="mb-2 font-medium">Beschreibung</h3>
                  <p className="text-muted-foreground">{article.description}</p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Kategorie</p>
                    <p className="font-medium">
                      {article.category}
                      {article.subcategory && ` / ${article.subcategory}`}
                    </p>
                  </div>
                </div>
                {article.manufacturer && (
                  <div className="flex items-center gap-3">
                    <Box className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Hersteller</p>
                      <p className="font-medium">{article.manufacturer}</p>
                    </div>
                  </div>
                )}
                {article.ean && (
                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">EAN</p>
                      <p className="font-medium">{article.ean}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Angelegt am</p>
                    <p className="font-medium">
                      {article.createdAt.toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {article.tags.length > 0 && (
                <div>
                  <h3 className="mb-2 font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-md bg-secondary px-2 py-1 text-sm text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {article.dimensions && (
            <Card>
              <CardHeader>
                <CardTitle>Abmessungen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {article.dimensions.length && (
                    <div>
                      <p className="text-sm text-muted-foreground">Länge</p>
                      <p className="font-medium">
                        {article.dimensions.length} {article.dimensions.unit}
                      </p>
                    </div>
                  )}
                  {article.dimensions.width && (
                    <div>
                      <p className="text-sm text-muted-foreground">Breite</p>
                      <p className="font-medium">
                        {article.dimensions.width} {article.dimensions.unit}
                      </p>
                    </div>
                  )}
                  {article.dimensions.height && (
                    <div>
                      <p className="text-sm text-muted-foreground">Höhe</p>
                      <p className="font-medium">
                        {article.dimensions.height} {article.dimensions.unit}
                      </p>
                    </div>
                  )}
                  {article.dimensions.weight && (
                    <div>
                      <p className="text-sm text-muted-foreground">Gewicht</p>
                      <p className="font-medium">{article.dimensions.weight} g</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {article.supplier && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Lieferant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Firma</p>
                  <p className="font-medium">{article.supplier.name}</p>
                </div>
                {article.supplier.contactPerson && (
                  <div>
                    <p className="text-sm text-muted-foreground">Ansprechpartner</p>
                    <p className="font-medium">{article.supplier.contactPerson}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {article.supplier.email && (
                    <div>
                      <p className="text-sm text-muted-foreground">E-Mail</p>
                      <a
                        href={`mailto:${article.supplier.email}`}
                        className="text-primary hover:underline"
                      >
                        {article.supplier.email}
                      </a>
                    </div>
                  )}
                  {article.supplier.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Telefon</p>
                      <a
                        href={`tel:${article.supplier.phone}`}
                        className="text-primary hover:underline"
                      >
                        {article.supplier.phone}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Seitenleiste mit Preis und Lagerinfos */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preisinformationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Verkaufspreis</p>
                <p className="text-2xl font-bold">{article.price.toFixed(2)} €</p>
                <p className="text-sm text-muted-foreground">inkl. {article.taxRate}% MwSt.</p>
              </div>
              {article.purchasePrice && (
                <>
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground">Einkaufspreis</p>
                    <p className="text-lg font-medium">{article.purchasePrice.toFixed(2)} €</p>
                  </div>
                  {margin && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Marge</p>
                        <p className="font-medium text-green-600">{margin}%</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lagerbestand</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Aktueller Bestand</p>
                <p className="text-xl font-bold">
                  {article.stock} {article.unit}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-3">
                <div>
                  <p className="text-sm text-muted-foreground">Mindestbestand</p>
                  <p className="font-medium">{article.minStock}</p>
                </div>
                {article.maxStock && (
                  <div>
                    <p className="text-sm text-muted-foreground">Maximalbestand</p>
                    <p className="font-medium">{article.maxStock}</p>
                  </div>
                )}
              </div>
              {article.stock <= article.minStock && (
                <div className="border-t pt-3">
                  <p className="text-sm font-medium text-orange-600">
                    ⚠️ Mindestbestand unterschritten
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eigenschaften</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Digital</span>
                <span
                  className={`text-sm font-medium ${article.isDigital ? 'text-green-600' : 'text-gray-500'}`}
                >
                  {article.isDigital ? 'Ja' : 'Nein'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Einheit</span>
                <span className="text-sm font-medium">{article.unit}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
