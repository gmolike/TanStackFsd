import type { Product, ProductsQueryParams } from '../model/types';

// Mock Daten für die Demo
const MOCK_PRODUCTS: Array<Product> = [
  {
    id: '1',
    name: 'Laptop Pro',
    description: 'High-performance laptop for professionals',
    price: 1299.99,
    stock: 50,
    category: 'electronics',
    imageUrl: 'https://via.placeholder.com/150',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-04-10T14:30:00Z',
  },
  {
    id: '2',
    name: 'Smartphone X',
    description: 'Latest smartphone with advanced features',
    price: 899.99,
    stock: 100,
    category: 'electronics',
    imageUrl: 'https://via.placeholder.com/150',
    createdAt: '2023-02-05T09:30:00Z',
    updatedAt: '2023-04-15T11:20:00Z',
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    description: 'Comfortable cotton t-shirt for everyday wear',
    price: 19.99,
    stock: 200,
    category: 'clothing',
    imageUrl: 'https://via.placeholder.com/150',
    createdAt: '2023-02-10T14:45:00Z',
    updatedAt: '2023-04-20T10:15:00Z',
  },
  {
    id: '4',
    name: 'Organic Apples',
    description: 'Fresh organic apples from local farms',
    price: 3.99,
    stock: 150,
    category: 'food',
    imageUrl: 'https://via.placeholder.com/150',
    createdAt: '2023-03-01T08:15:00Z',
    updatedAt: '2023-03-01T08:15:00Z',
  },
  {
    id: '5',
    name: 'Programming Guide',
    description: 'Comprehensive guide to modern programming',
    price: 39.99,
    stock: 75,
    category: 'books',
    imageUrl: 'https://via.placeholder.com/150',
    createdAt: '2023-03-15T11:30:00Z',
    updatedAt: '2023-04-01T09:45:00Z',
  },
];

export const productApi = {
  getProducts: async ({
    page = 1,
    limit = 10,
    filters,
    sort,
  }: ProductsQueryParams): Promise<{
    data: Array<Product>;
    total: number;
  }> => {
    // In einer echten App würde hier ein API-Aufruf stehen
    // Simuliere eine API-Antwort mit den Mock-Daten
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredProducts = [...MOCK_PRODUCTS];

    // Filtern
    if (filters) {
      if (filters.category) {
        filteredProducts = filteredProducts.filter(
          (product) => product.category === filters.category,
        );
      }
      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          (product) => filters.minPrice !== undefined && product.price >= filters.minPrice,
        );
      }
      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          (product) => filters.maxPrice !== undefined && product.price <= filters.maxPrice,
        );
      }
      if (filters.inStock !== undefined) {
        filteredProducts = filteredProducts.filter(
          (product) => product.stock > 0 === filters.inStock,
        );
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm),
        );
      }
    }

    // Sortieren
    if (sort) {
      filteredProducts.sort((a, b) => {
        const aValue = a[sort.field];
        const bValue = b[sort.field];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sort.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (aValue === undefined) return sort.direction === 'asc' ? -1 : 1;
        if (bValue === undefined) return sort.direction === 'asc' ? 1 : -1;

        return sort.direction === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      });
    }

    // Paginierung
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

    return {
      data: paginatedProducts,
      total: filteredProducts.length,
    };
  },

  getProductById: async (id: string): Promise<Product | null> => {
    // Simuliere API-Aufruf
    await new Promise((resolve) => setTimeout(resolve, 300));

    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    return product || null;
  },

  createProduct: async (
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Product> => {
    // Simuliere API-Aufruf
    await new Promise((resolve) => setTimeout(resolve, 800));

    const now = new Date().toISOString();
    const newProduct: Product = {
      id: `${MOCK_PRODUCTS.length + 1}`,
      ...productData,
      createdAt: now,
      updatedAt: now,
    };

    // In einer echten App würden wir hier das neue Produkt zum Server senden
    // Für die Demo fügen wir es zum lokalen Array hinzu
    MOCK_PRODUCTS.push(newProduct);

    return newProduct;
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    // Simuliere API-Aufruf
    await new Promise((resolve) => setTimeout(resolve, 700));

    const productIndex = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    // In einer echten App würden wir hier die Änderungen an den Server senden
    // Für die Demo aktualisieren wir nur das lokale Array
    const updatedProduct = {
      ...MOCK_PRODUCTS[productIndex],
      ...productData,
      updatedAt: new Date().toISOString(),
    };

    MOCK_PRODUCTS[productIndex] = updatedProduct;
    return updatedProduct;
  },

  deleteProduct: async (id: string): Promise<void> => {
    // Simuliere API-Aufruf
    await new Promise((resolve) => setTimeout(resolve, 600));

    const productIndex = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    // In einer echten App würden wir hier das Produkt vom Server löschen
    // Für die Demo entfernen wir es aus dem lokalen Array
    MOCK_PRODUCTS.splice(productIndex, 1);
  },
};
