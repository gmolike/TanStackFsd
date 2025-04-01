import type { JSX } from 'react';

import { ProductTableWidget } from '~/widgets/product-table';

export const ProductsPage = (): JSX.Element => (
  <div className="container mx-auto py-6">
    <h1 className="mb-6 text-3xl font-bold">Product Management</h1>
    <ProductTableWidget />
  </div>
);
