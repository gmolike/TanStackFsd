import { UserListFeature } from '~/features/user';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/ui/card';

type UserTableWidgetProps = {
  title?: string;
  description?: string;
};

export const UserTableWidget = ({
  title = 'User Management',
  description = 'View and manage users in the system',
}: UserTableWidgetProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <UserListFeature />
    </CardContent>
  </Card>
);
