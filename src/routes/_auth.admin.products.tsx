import { createFileRoute } from '@tanstack/react-router';

import { ProductsPage } from '~/pages/admin/products';

export const Route = createFileRoute('/_auth/admin/products')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProductsPage />;
}
