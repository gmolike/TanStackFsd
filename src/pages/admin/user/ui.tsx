import { JSX } from 'react';

import { UserTableWidget } from '~/widgets/user-table';

export const UsersPage = (): JSX.Element => (
  <div className="container mx-auto py-6">
    <h1 className="mb-6 text-3xl font-bold">User Management</h1>
    <UserTableWidget />
  </div>
);
