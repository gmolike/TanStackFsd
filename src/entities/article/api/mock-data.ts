// src/entities/article/api/mock-data.ts

import { array, commerce, random, string } from '~/shared/mock';

import {
  articleCategoryOptions,
  articleStatusOptions,
  articleTagOptions,
  articleUnitOptions,
  dimensionUnitOptions,
  getSubcategoryOptions,
  supplierOptions,
  taxRateOptions,
} from '../model/options';
import type { Article, CreateArticle, Dimensions, Supplier } from '../model/schema';

/**
 * Generiert Mock-Daten für einen Lieferanten
 */
const generateSupplier = (): Supplier => {
  const suppliers = Object.values(supplierOptions);
  return random.arrayElement(suppliers);
};

/**
 * Generiert Mock-Daten für Dimensionen basierend auf Kategorie
 */
const generateDimensions = (category: string): Dimensions | undefined => {
  // Digitale Produkte haben keine Dimensionen
  if (category === 'Software' || random.boolean(0.2)) {
    return undefined;
  }

  const unit = random.arrayElement(
    Object.keys(dimensionUnitOptions),
  ) as keyof typeof dimensionUnitOptions;

  // Kategorie-spezifische Dimensionen
  const dimensionRanges: Record<
    string,
    {
      length: [number, number];
      width: [number, number];
      height: [number, number];
      weight: [number, number];
    }
  > = {
    Elektronik: { length: [10, 50], width: [5, 40], height: [1, 30], weight: [100, 5000] },
    Computer: { length: [20, 60], width: [15, 50], height: [2, 40], weight: [500, 10000] },
    Zubehör: { length: [5, 30], width: [3, 25], height: [1, 15], weight: [50, 2000] },
    Gaming: { length: [10, 40], width: [5, 30], height: [2, 20], weight: [200, 3000] },
    Büro: { length: [10, 200], width: [10, 100], height: [5, 150], weight: [500, 50000] },
    Haushalt: { length: [10, 100], width: [10, 80], height: [10, 100], weight: [100, 20000] },
    default: { length: [5, 50], width: [5, 50], height: [1, 50], weight: [50, 5000] },
  };

  const ranges = dimensionRanges[category] || dimensionRanges.default;

  return {
    length: random.number(ranges.length[0], ranges.length[1]),
    width: random.number(ranges.width[0], ranges.width[1]),
    height: random.number(ranges.height[0], ranges.height[1]),
    weight: random.number(ranges.weight[0], ranges.weight[1]),
    unit,
  };
};

/**
 * Generiert kategorie-spezifische Produktnamen
 */
const generateProductName = (category: string, subcategory?: string): string => {
  const productNames: Record<string, Array<string>> = {
    // Elektronik
    Smartphones: [
      'iPhone 15 Pro',
      'Samsung Galaxy S24',
      'Google Pixel 8',
      'OnePlus 12',
      'Xiaomi 14',
    ],
    Tablets: ['iPad Pro 12.9"', 'Samsung Tab S9', 'Surface Pro 9', 'iPad Air', 'Lenovo Tab P12'],
    Kameras: ['Canon EOS R6', 'Sony Alpha 7 IV', 'Nikon Z9', 'Fujifilm X-T5', 'GoPro Hero 12'],
    Fernseher: [
      'LG OLED 65"',
      'Samsung QLED 55"',
      'Sony Bravia 75"',
      'Philips Ambilight 50"',
      'TCL 4K 43"',
    ],

    // Computer
    Laptops: [
      'MacBook Pro 16"',
      'Dell XPS 15',
      'ThinkPad X1 Carbon',
      'HP Spectre x360',
      'ASUS ZenBook',
    ],
    Desktops: ['iMac 24"', 'Dell OptiPlex', 'HP Elite Tower', 'Lenovo ThinkCentre', 'ASUS Mini PC'],
    Monitore: [
      'Dell UltraSharp 27"',
      'LG UltraWide 34"',
      'BenQ 4K Designer',
      'ASUS ProArt 32"',
      'Samsung Odyssey G9',
    ],
    Drucker: [
      'HP LaserJet Pro',
      'Canon PIXMA',
      'Epson EcoTank',
      'Brother Multifunktion',
      'Xerox WorkCentre',
    ],

    // Zubehör
    Eingabegeräte: [
      'Logitech MX Master 3S',
      'Apple Magic Keyboard',
      'Razer DeathAdder V3',
      'Keychron K2',
      'Wacom Intuos',
    ],
    Adapter: [
      'USB-C Hub 7-in-1',
      'HDMI zu DisplayPort',
      'Thunderbolt 4 Dock',
      'USB 3.0 Adapter',
      'Ethernet Adapter',
    ],
    Ständer: [
      'Laptop Stand Aluminium',
      'Monitor Arm Dual',
      'Tablet Halterung',
      'Smartphone Ständer',
      'Notebook Cooling Pad',
    ],

    // Software
    Software: [
      'Microsoft Office 365',
      'Adobe Creative Cloud',
      'Antivirus Pro 2024',
      'Windows 11 Pro',
      'AutoCAD 2024',
    ],

    // Gaming
    Gaming: [
      'PlayStation 5',
      'Xbox Series X',
      'Nintendo Switch OLED',
      'Steam Deck',
      'Gaming Chair RGB',
    ],

    // Default
    default: commerce.productName(),
  };

  const names = productNames[subcategory || category] || productNames.default;
  return typeof names === 'string' ? names : random.arrayElement(names);
};

/**
 * Generiert einen einzelnen Artikel mit allen erforderlichen Feldern
 */
export const generateArticle = (overrides?: Partial<CreateArticle>): Article => {
  const category =
    overrides?.category || random.arrayElement(Object.values(articleCategoryOptions)).value;
  const subcategoryOptions = getSubcategoryOptions(category);
  const subcategory =
    subcategoryOptions.length > 0 ? random.arrayElement(subcategoryOptions).value : undefined;

  const isDigital = category === 'Software' || (category === 'Gaming' && random.boolean(0.3));
  const price = commerce.price(
    10,
    category === 'Computer' || category === 'Elektronik' ? 5000 : 1000,
  );
  const purchasePrice = isDigital ? undefined : (price * random.number(40, 70)) / 100;

  // Basis-Artikel
  const article: Article = {
    id: random.uuid(),
    articleNumber: string.articleNumber(`${category.substring(0, 3).toUpperCase()}`),
    name: generateProductName(category, subcategory),
    description: commerce.productDescription(generateProductName(category, subcategory)),
    price,
    purchasePrice,
    stock: isDigital ? 999 : random.number(0, 100),
    minStock: isDigital ? 0 : random.number(5, 20),
    maxStock: isDigital ? undefined : random.number(50, 200),
    category,
    subcategory,
    tags: random.arrayElements(
      Object.values(articleTagOptions).map((opt) => opt.value),
      random.number(0, 4),
    ),
    status: random.arrayElement(
      Object.keys(articleStatusOptions),
    ) as keyof typeof articleStatusOptions,
    dimensions: generateDimensions(category),
    ean: isDigital ? undefined : string.ean(),
    manufacturer: commerce.manufacturer(),
    supplier: isDigital ? undefined : random.boolean(0.7) ? generateSupplier() : undefined,
    createdAt: random.date(new Date(2023, 0, 1), new Date()),
    updatedAt: random.boolean(0.3) ? random.date(new Date(2023, 6, 1), new Date()) : undefined,
    availableFrom: random.boolean(0.1)
      ? random.date(new Date(), new Date(2024, 11, 31))
      : undefined,
    availableUntil: random.boolean(0.05)
      ? random.date(new Date(2024, 6, 1), new Date(2025, 11, 31))
      : undefined,
    taxRate: random.arrayElement(Object.values(taxRateOptions)).value,
    unit: isDigital ? 'Lizenz' : random.arrayElement(Object.values(articleUnitOptions)).value,
    isDigital,
    imageUrl: `https://picsum.photos/400/300?random=${random.number(1, 1000)}`,
    thumbnailUrl: `https://picsum.photos/150/150?random=${random.number(1, 1000)}`,
    ...overrides,
  };

  return article;
};

/**
 * Generiert mehrere Artikel
 */
export const generateArticles = (
  count: number,
  overrides?: Partial<CreateArticle>,
): Array<Article> => array.of(count, () => generateArticle(overrides));

/**
 * Generiert Artikel für eine spezifische Kategorie
 */
export const generateArticlesByCategory = (category: string, count: number): Array<Article> =>
  generateArticles(count, { category });

/**
 * Generiert einen Mix aus verschiedenen Artikel-Typen
 */
export const generateArticleMix = (totalCount: number = 50): Array<Article> => {
  const categories = Object.values(articleCategoryOptions).map((opt) => opt.value);
  const articles: Array<Article> = [];

  // Verteile Artikel gleichmäßig auf Kategorien
  const perCategory = Math.floor(totalCount / categories.length);
  const remainder = totalCount % categories.length;

  categories.forEach((category, index) => {
    const count = perCategory + (index < remainder ? 1 : 0);
    articles.push(...generateArticlesByCategory(category, count));
  });

  return articles;
};

/**
 * Generiert Beispiel-Artikel für Tests
 */
export const mockArticles = {
  // Einzelne vordefinierte Artikel
  laptop: generateArticle({
    articleNumber: 'COMP-LAPTOP-001',
    name: 'MacBook Pro 16" M3 Max',
    category: 'Computer',
    subcategory: 'Laptops',
    price: 3999.99,
    purchasePrice: 2999.99,
    stock: 8,
    minStock: 5,
    maxStock: 20,
    tags: ['Premium', 'Neu', 'Bestseller'],
    status: 'available',
  }),

  mouse: generateArticle({
    articleNumber: 'ACC-MOUSE-001',
    name: 'Logitech MX Master 3S',
    category: 'Zubehör',
    subcategory: 'Eingabegeräte',
    price: 119.99,
    purchasePrice: 79.99,
    stock: 45,
    minStock: 10,
    maxStock: 100,
    tags: ['Bestseller'],
    status: 'available',
  }),

  software: generateArticle({
    articleNumber: 'SOFT-OFFICE-001',
    name: 'Microsoft Office 365 Business',
    category: 'Software',
    price: 299.99,
    stock: 999,
    minStock: 0,
    isDigital: true,
    tags: ['Lizenz', 'Business'],
    status: 'available',
  }),

  // Batch-Generatoren
  generateLaptops: (count: number) => generateArticlesByCategory('Computer', count),
  generateAccessories: (count: number) => generateArticlesByCategory('Zubehör', count),
  generateSoftware: (count: number) => generateArticlesByCategory('Software', count),
  generateAll: generateArticleMix,
};
