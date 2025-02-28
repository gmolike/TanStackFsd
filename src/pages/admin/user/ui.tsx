import { Metadata } from 'next';

import { UserTableWidget } from '~/widgets/user-table';

export const metadata: Metadata = {
  title: 'User Management',
  description: 'Manage users in the system',
};

export const UsersPage = () => (
  <div className="container mx-auto py-6">
    <h1 className="mb-6 text-3xl font-bold">User Management</h1>
    <UserTableWidget />
  </div>
);
