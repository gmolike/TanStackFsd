export type UserRole = 'admin' | 'user' | 'editor';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
};

export type UserFilters = {
  role?: UserRole;
  status?: 'active' | 'inactive';
  search?: string;
};

export type UsersQueryParams = {
  page: number;
  limit: number;
  filters?: UserFilters;
  sort?: {
    field: keyof User;
    direction: 'asc' | 'desc';
  };
};
