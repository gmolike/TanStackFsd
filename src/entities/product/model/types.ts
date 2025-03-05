export type ProductCategory = 'electronics' | 'clothing' | 'food' | 'books' | 'other';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductFilters = {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
};

export type ProductsQueryParams = {
  page: number;
  limit: number;
  filters?: ProductFilters;
  sort?: {
    field: keyof Product;
    direction: 'asc' | 'desc';
  };
};
