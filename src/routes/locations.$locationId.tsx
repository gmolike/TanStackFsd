import { createFileRoute } from '@tanstack/react-router';

import { LocationsDetailPage } from '~/pages/locations';

export const Route = createFileRoute('/locations/$locationId')({
  component: LocationsDetailPage,
});
