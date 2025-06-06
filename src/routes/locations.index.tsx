import { createFileRoute } from '@tanstack/react-router';

import { LocationsListPage } from '~/pages/locations';

export const Route = createFileRoute('/locations/')({
  component: LocationsListPage,
});
