import { Metadata } from 'next';

import { ProductTableWidget } from '~/widgets/product-table';

export const metadata: Metadata = {
  title: 'Product Management',
  description: 'Manage products in the system',
};

export const ProductsPage = () => (
  <div className="container mx-auto py-6">
    <h1 className="mb-6 text-3xl font-bold">Product Management</h1>
    <ProductTableWidget />
  </div>
);
