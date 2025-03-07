import { useState } from 'react';
import type { JSX } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { User, UserFilters, UserRole } from '~/entities/user';
import { userApi, UserBadge, UserRoleBadge, UserStatusBadge } from '~/entities/user';

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

// Paginierung
const ITEMS_PER_PAGE = 5;

export const List = (): JSX.Element => {
  // State
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({});
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ field: keyof User; direction: 'asc' | 'desc' }>({
    field: 'name',
    direction: 'asc',
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Query Client
  const queryClient = useQueryClient();

  // Queries
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users', page, filters, sort, search],
    queryFn: () =>
      userApi.getUsers({
        page,
        limit: ITEMS_PER_PAGE,
        filters: { ...filters, search: search || undefined },
        sort,
      }),
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (userId: string) => userApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    },
  });

  // Handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Zurück zur ersten Seite bei neuer Suche
  };

  const handleRoleFilterChange = (role: UserRole | '') => {
    setFilters((prev) => ({
      ...prev,
      role: role === '' ? undefined : role,
    }));
    setPage(1);
  };

  const handleStatusFilterChange = (status: 'active' | 'inactive' | '') => {
    setFilters((prev) => ({
      ...prev,
      status: status === '' ? undefined : status,
    }));
    setPage(1);
  };

  const handleSortChange = (field: keyof User) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
    }
  };

  // Pagination Logic
  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;

  if (isLoading) {
    return <div className="flex h-48 items-center justify-center">Loading users...</div>;
  }

  if (isError) {
    return <div className="rounded-md bg-red-50 p-4 text-red-800">Error: {error.toString()}</div>;
  }

  const users = data?.data || [];

  return (
    <div className="space-y-4">
      {/* Filter und Suche */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="flex-1">
          <InputShadcn
            placeholder="Search users..."
            value={search}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        <div className="flex space-x-2">
          <div className="w-40">
            <Select value={filters.role || ''} onValueChange={handleRoleFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-40">
            <Select value={filters.status || ''} onValueChange={handleStatusFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabelle */}
      <div className="rounded-md border">
        <Table>
          <TableCaption>List of users in the system</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSortChange('name')}>
                User
                {sort.field === 'name' && (
                  <span className="ml-1">{sort.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSortChange('role')}>
                Role
                {sort.field === 'role' && (
                  <span className="ml-1">{sort.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSortChange('status')}>
                Status
                {sort.field === 'status' && (
                  <span className="ml-1">{sort.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSortChange('lastLogin')}>
                Last Login
                {sort.field === 'lastLogin' && (
                  <span className="ml-1">{sort.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <UserBadge user={user} />
                  </TableCell>
                  <TableCell>
                    <UserRoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <UserStatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? (
                      new Date(user.lastLogin).toLocaleDateString()
                    ) : (
                      <span className="text-gray-400">Never</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(user)}
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
              Are you sure you want to delete user "{userToDelete?.name}"? This action cannot be
              undone.
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
