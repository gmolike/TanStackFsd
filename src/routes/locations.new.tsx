import { createFileRoute } from '@tanstack/react-router';

import { LocationsEditorPage } from '~/pages/locations';

export const Route = createFileRoute('/locations/new')({
  component: LocationsEditorPage,
});
