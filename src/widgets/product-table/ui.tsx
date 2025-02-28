import { ProductListFeature } from '~/features/product/list/list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/ui/card';

type ProductTableWidgetProps = {
  title?: string;
  description?: string;
};

export const ProductTableWidget = ({
  title = 'Product Management',
  description = 'View and manage products in the system',
}: ProductTableWidgetProps) => (
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
