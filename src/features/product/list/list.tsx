import { JSX, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  formatPrice,
  Product,
  productApi,
  ProductCard,
  ProductCategory,
  ProductCategoryBadge,
  ProductFilters,
} from '~/entities/product';

import { Button } from '~/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/shared/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/shared/ui/dropdown-menu';
import { InputShadcn } from '~/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/shared/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/shared/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/shared/ui/tabs';

// Paginierung
const ITEMS_PER_PAGE = 5;

export const ProductListFeature = (): JSX.Element => {
  // State
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ field: keyof Product; direction: 'asc' | 'desc' }>({
    field: 'name',
    direction: 'asc',
  });
  const [viewType, setViewType] = useState<'table' | 'grid'>('table');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Query Client
  const queryClient = useQueryClient();

  // Queries
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', page, filters, sort, search],
    queryFn: () =>
      productApi.getProducts({
        page,
        limit: ITEMS_PER_PAGE,
        filters: { ...filters, search: search || undefined },
        sort,
      }),
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (productId: string) => productApi.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    },
  });

  // Handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Zurück zur ersten Seite bei neuer Suche
  };

  const handleCategoryFilterChange = (category: ProductCategory | '') => {
    setFilters((prev) => ({
      ...prev,
      category: category === '' ? undefined : (category as ProductCategory),
    }));
    setPage(1);
  };

  const handleInStockFilterChange = (inStock: string) => {
    if (inStock === 'all') {
      const { inStock: _, ...rest } = filters;
      console.warn('rest', _);
      setFilters(rest);
    } else {
      setFilters((prev) => ({
        ...prev,
        inStock: inStock === 'true',
      }));
    }
    setPage(1);
  };

  const handleSortChange = (field: keyof Product) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id);
    }
  };

  const handleEditProduct = (product: Product) => {
    // This would typically navigate to edit page or open a modal
    console.warn('Edit product:', product);
  };

  // Pagination Logic
  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;

  if (isLoading) {
    return <div className="flex h-48 items-center justify-center">Loading products...</div>;
  }

  if (isError) {
    return <div className="rounded-md bg-red-50 p-4 text-red-800">Error: {error?.toString()}</div>;
  }

  const products = data?.data || [];

  return (
    <div className="space-y-4">
      {/* Filter und Suche */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="flex-1">
          <InputShadcn
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        <div className="flex space-x-2">
          <div className="w-40">
            <Select value={filters.category || ''} onValueChange={handleCategoryFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-40">
            <Select
              value={filters.inStock === undefined ? 'all' : filters.inStock ? 'true' : 'false'}
              onValueChange={handleInStockFilterChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="true">In Stock</SelectItem>
                <SelectItem value="false">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto">
            <Tabs value={viewType} onValueChange={(v) => setViewType(v as 'table' | 'grid')}>
              <TabsList>
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="grid">Grid</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Tabellen- oder Grid-Ansicht */}
      <TabsContent value="table" className="mt-0">
        <div className="rounded-md border">
          <Table>
            <TableCaption>List of products</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('name')}>
                  Product
                  {sort.field === 'name' && (
                    <span className="ml-1">{sort.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('category')}>
                  Category
                  {sort.field === 'category' && (
                    <span className="ml-1">{sort.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('price')}>
                  Price
                  {sort.field === 'price' && (
                    <span className="ml-1">{sort.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('stock')}>
                  Stock
                  {sort.field === 'stock' && (
                    <span className="ml-1">{sort.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="max-w-xs truncate text-sm text-gray-500">
                            {product.description.substring(0, 50)}
                            {product.description.length > 50 ? '...' : ''}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ProductCategoryBadge category={product.category} />
                    </TableCell>
                    <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteClick(product)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="grid" className="mt-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 ? (
            <div className="col-span-full py-8 text-center text-gray-500">No products found</div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="detailed"
                onEdit={handleEditProduct}
                onDelete={handleDeleteClick}
              />
            ))
          )}
        </div>
      </TabsContent>

      {/* Paginierung */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete product "{productToDelete?.name}"? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
