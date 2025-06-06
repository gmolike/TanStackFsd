// Page Components
export { LocationsDetailPage } from './detail/ui/page';
export { LocationsEditorPage } from './editor/ui/page';
export { LocationsListPage } from './list/page';

// Detail Tab Components (für Wiederverwendung)
export { InventoryTab } from './detail/ui/inventory-tab';
export { OverviewTab } from './detail/ui/overview-tab';
export { TeamTab } from './detail/ui/team-tab';

// List View Components (für Wiederverwendung)
export { LocationCardView } from './list/ui/card-view';
export { LocationTableView } from './list/ui/table-view';

// Re-export API hooks for convenience (optional)
// This allows pages to import both components and hooks from one place
export {
  useCreateLocation,
  useDeleteLocation,
  useLocation,
  useLocationInventory,
  useLocationManager,
  useLocations,
  useLocationStats,
  useLocationTeamMembers,
  useUpdateLocation,
} from '~/entities/location';
