import type { JSX } from 'react';

import { formatPrice } from '../api/format';
import type { Product, ProductCategory } from '../model/types';

type ProductCardVariant = 'compact' | 'default' | 'detailed';

type ProductCardProps = {
  product: Product;
  variant?: ProductCardVariant;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
};

const getCategoryColor = (category: ProductCategory): string => {
  switch (category) {
    case 'electronics':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'clothing':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'food':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'books':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const ProductCategoryBadge = ({ category }: { category: ProductCategory }): JSX.Element => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(
      category,
    )}`}
  >
    {category}
  </span>
);

export const ProductStockBadge = ({ stock }: { stock: number }): JSX.Element => {
  if (stock > 50) {
    return (
      <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        In Stock ({stock})
      </span>
    );
  }

  if (stock > 0) {
    return (
      <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
        Low Stock ({stock})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
      Out of Stock
    </span>
  );
};

export const ProductImage = ({
  product,
  size = 'md',
}: {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
}): JSX.Element => {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  return (
    <div className={`relative overflow-hidden rounded-md ${sizeClasses[size]} bg-gray-100`}>
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
          No Image
        </div>
      )}
    </div>
  );
};

export const ProductCard = ({
  product,
  variant = 'default',
  onEdit,
  onDelete,
}: ProductCardProps): JSX.Element => {
  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-3">
        <ProductImage product={product} size="sm" />
        <div className="flex flex-col">
          <span className="font-medium">{product.name}</span>
          <span className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</span>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex p-4">
          <ProductImage product={product} size="lg" />
          <div className="ml-4 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">{product.description}</p>
            <div className="mt-2 flex items-center space-x-2">
              <ProductCategoryBadge category={product.category} />
              <ProductStockBadge stock={product.stock} />
            </div>
            <div className="mt-auto pt-4">
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>
          </div>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex justify-end border-t border-gray-200 px-4 py-2">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="mr-2 inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(product)}
                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Default
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <ProductImage product={product} size="md" />
        <div className="flex flex-col">
          <span className="font-medium">{product.name}</span>
          <span className="mt-1 line-clamp-1 text-sm text-gray-500">{product.description}</span>
          <div className="mt-1 flex items-center space-x-2">
            <ProductCategoryBadge category={product.category} />
            <ProductStockBadge stock={product.stock} />
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <span className="mr-4 text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
        {(onEdit || onDelete) && (
          <div className="flex">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="mr-2 inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(product)}
                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
