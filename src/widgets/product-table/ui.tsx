import type { JSX } from 'react';

import { ProductListFeature } from '~/features/product/list/list';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/shadcn';

type ProductTableWidgetProps = {
  title?: string;
  description?: string;
};

export const ProductTableWidget = ({
  title = 'Product Management',
  description = 'View and manage products in the system',
}: ProductTableWidgetProps): JSX.Element => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <ProductListFeature />
    </CardContent>
  </Card>
);
