// src/entities/location/index.ts

// ===== MODEL EXPORTS =====

// Types
export type {
  Address,
  CreateLocation,
  CreateLocationInventory,
  Location,
  LocationFormData,
  LocationInventory,
  OperatingHours,
  UpdateLocation,
  UpdateLocationInventory,
} from './model/schema';

// Schemas (für Validierung in Forms)
export {
  addressSchema,
  createLocationInventorySchema,
  createLocationSchema,
  locationFormSchema,
  locationInventorySchema,
  locationSchema,
  operatingHoursSchema,
  updateLocationInventorySchema,
  updateLocationSchema,
} from './model/schema';

// Options und Konstanten
export {
  capacityUnitOptions,
  capacityUnitOptionsList,
  locationStatusOptions,
  locationStatusOptionsList,
  locationTypeOptions,
  locationTypeOptionsList,
  mockCities,
  operatingHoursTemplates,
  storageLocationPrefixes,
} from './model/options';

// ===== API EXPORTS =====

// Query Hooks
export {
  useGlobalLocationStats,
  useLocation,
  useLocationInventory,
  useLocationManager,
  useLocations,
  useLocationsByStatus,
  useLocationsByType,
  useLocationStats,
  useLocationTeamMembers,
} from './api/useApi';

// Mutation Hooks
export {
  useAddArticleToLocation,
  useCreateLocation,
  useDeleteLocation,
  useRemoveArticleFromLocation,
  useResetLocations,
  useUpdateLocation,
  useUpdateLocationInventory,
} from './api/useApi';

// Mock API (für direkte Verwendung in Tests)
export { locationMockApi } from './api/mock-api';

// Mock Data Generators (für Tests)
export {
  generateLocation,
  generateLocationInventory,
  generateLocationMix,
  generateLocations,
  generateLocationsByCity,
  mockLocations,
} from './api/mock-data';
