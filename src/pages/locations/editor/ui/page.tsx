// src/pages/locations/editor/ui/page.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Building2, Loader2 } from 'lucide-react';

import { AddressDialog } from '~/features/team';

import type {
  Address,
  CreateLocation,
  LocationFormData,
  UpdateLocation,
} from '~/entities/location';
import {
  capacityUnitOptionsList,
  locationFormSchema,
  locationStatusOptionsList,
  locationTypeOptionsList,
  useCreateLocation,
  useLocation,
  useUpdateLocation,
} from '~/entities/location';
import { useTeamMembers } from '~/entities/team';

import { toast } from '~/shared/hooks/use-toast';
import { Alert, AlertDescription, Button, Card, CardContent, CardHeader } from '~/shared/shadcn';
import {
  FormDialogButton,
  FormFooter,
  FormHeader,
  FormInput,
  FormNumberInput,
  FormProvider,
  FormSelect,
  FormTextArea,
} from '~/shared/ui/form';

export const LocationsEditorPage = () => {
  const navigate = useNavigate();
  const { locationId } = useParams({ strict: false });
  const isEditMode = !!locationId && locationId !== 'new';

  // API Hooks
  const { data: existingLocation, isLoading: isLoadingLocation } = useLocation(locationId || '', {
    enabled: isEditMode,
  });

  // Hole Team-Mitglieder für Manager-Auswahl
  const { data: teamData } = useTeamMembers({
    filters: [{ field: 'role', operator: 'contains', value: 'Manager' }],
  });

  const managers = teamData?.data || [];

  const createMutation = useCreateLocation({
    onSuccess: (data) => {
      toast({
        title: 'Standort erstellt',
        description: `${data.name} wurde erfolgreich hinzugefügt.`,
      });
      navigate({ to: '/locations/$locationId', params: { locationId: data.id } });
    },
    onError: (error) => {
      toast({
        title: 'Fehler beim Erstellen',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useUpdateLocation({
    onSuccess: (data) => {
      toast({
        title: 'Änderungen gespeichert',
        description: 'Die Standortdaten wurden erfolgreich aktualisiert.',
      });
      navigate({ to: '/locations/$locationId', params: { locationId: data.id } });
    },
    onError: (error) => {
      toast({
        title: 'Fehler beim Speichern',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Form Setup
  const defaultValues: LocationFormData = {
    name: '',
    code: '',
    type: 'warehouse',
    status: 'active',
    address: {
      street: '',
      city: '',
      country: 'Deutschland',
      postalCode: '',
    },
    managerId: '',
    description: '',
    capacity: null,
    capacityUnit: 'sqm',
    operatingHours: null,
  };

  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Load existing data in edit mode
  useEffect(() => {
    if (isEditMode && existingLocation) {
      const formData: LocationFormData = {
        name: existingLocation.name,
        code: existingLocation.code,
        type: existingLocation.type,
        status: existingLocation.status,
        address: existingLocation.address,
        managerId: existingLocation.managerId || '',
        description: existingLocation.description || '',
        capacity: existingLocation.capacity || null,
        capacityUnit: existingLocation.capacityUnit || 'sqm',
        operatingHours: existingLocation.operatingHours || null,
      };
      form.reset(formData);
    }
  }, [existingLocation, isEditMode, form]);

  const handleSubmit = (data: LocationFormData) => {
    // Transform form data to API data
    const apiData: CreateLocation | UpdateLocation = {
      ...data,
      managerId: data.managerId || undefined,
      description: data.description || undefined,
      capacity: data.capacity || undefined,
      capacityUnit: data.capacity ? data.capacityUnit : undefined,
      operatingHours: data.operatingHours || undefined,
    };

    if (isEditMode) {
      updateMutation.mutate({ ...apiData, id: locationId } as UpdateLocation);
    } else {
      createMutation.mutate(apiData);
    }
  };

  const handleError = (errors: unknown) => {
    console.error('Form validation errors:', errors);
    toast({
      title: 'Validierungsfehler',
      description: 'Bitte überprüfen Sie Ihre Eingaben.',
      variant: 'destructive',
    });
  };

  // Loading state for edit mode
  if (isEditMode && isLoadingLocation) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Lade Standort...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state for edit mode
  if (isEditMode && !existingLocation && !isLoadingLocation) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Card>
          <CardHeader>
            <Alert variant="destructive">
              <AlertDescription>Standort nicht gefunden</AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate({ to: '/locations' })}>Zurück zur Übersicht</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit, handleError)} className="space-y-8">
          {/* Header */}
          <FormHeader
            title={isEditMode ? 'Standort bearbeiten' : 'Neuer Standort'}
            description={
              isEditMode
                ? 'Bearbeiten Sie die Daten des Standorts'
                : 'Fügen Sie einen neuen Standort hinzu'
            }
            icon={Building2}
          />

          {/* Allgemeine Informationen */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Allgemeine Informationen</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInput
                control={form.control}
                name="name"
                label="Name"
                placeholder="z.B. Hauptlager Berlin"
                required
                description="Ein eindeutiger Name für den Standort"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  control={form.control}
                  name="code"
                  label="Code"
                  placeholder="z.B. WBER-01"
                  required
                  description="Eindeutiger Code (nur Großbuchstaben, Zahlen und -)"
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    form.setValue('code', value);
                  }}
                />

                <FormSelect
                  control={form.control}
                  name="type"
                  options={locationTypeOptionsList}
                  label="Typ"
                  required
                />
              </div>

              <FormSelect
                control={form.control}
                name="status"
                options={locationStatusOptionsList}
                label="Status"
                required
              />

              <FormTextArea
                control={form.control}
                name="description"
                label="Beschreibung"
                placeholder="Beschreiben Sie den Standort..."
                rows={3}
                description="Zusätzliche Informationen zum Standort (optional)"
              />
            </CardContent>
          </Card>

          {/* Adresse */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Adresse</h2>
            </CardHeader>
            <CardContent>
              <FormDialogButton
                control={form.control}
                name="address"
                label="Adresse"
                dialog={({ open, onOpenChange, value, onChange }) => (
                  <AddressDialog
                    open={open}
                    onOpenChange={onOpenChange}
                    value={value as Address | undefined}
                    onChange={onChange}
                  />
                )}
                required
                emptyText="Klicken Sie hier, um die Adresse einzugeben"
                description="Vollständige Adresse des Standorts"
              >
                {(value) => {
                  const address = value as Address | undefined;
                  if (!address || !address.street) return null;
                  return (
                    <div className="text-left">
                      <div className="font-medium">{address.street}</div>
                      <div className="text-sm text-muted-foreground">
                        {address.postalCode} {address.city}, {address.country}
                      </div>
                    </div>
                  );
                }}
              </FormDialogButton>
            </CardContent>
          </Card>

          {/* Kapazität und Verwaltung */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Kapazität und Verwaltung</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormNumberInput
                  control={form.control}
                  name="capacity"
                  label="Kapazität"
                  placeholder="z.B. 5000"
                  min={0}
                  description="Lager- oder Bürofläche"
                />

                <FormSelect
                  control={form.control}
                  name="capacityUnit"
                  options={capacityUnitOptionsList}
                  label="Einheit"
                  disabled={!form.watch('capacity')}
                />
              </div>

              <FormSelect
                control={form.control}
                name="managerId"
                options={[
                  { value: '', label: '-- Kein Manager --' },
                  ...managers.map((m) => ({
                    value: m.id,
                    label: `${m.firstName} ${m.lastName} (${m.role})`,
                  })),
                ]}
                label="Standortleiter"
                emptyOption="-- Kein Manager --"
                description="Verantwortlicher für diesen Standort"
              />
            </CardContent>
          </Card>

          {/* Öffnungszeiten - Placeholder für später */}
          {/* <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Öffnungszeiten</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Öffnungszeiten können nach der Erstellung bearbeitet werden.
              </p>
            </CardContent>
          </Card> */}

          {/* Footer */}
          <FormFooter
            submitText={isEditMode ? 'Änderungen speichern' : 'Standort erstellen'}
            showCancel={true}
            cancelText="Abbrechen"
            onCancel={() => navigate({ to: '/locations' })}
            showReset={!isEditMode}
            resetText="Formular zurücksetzen"
          />
        </form>
      </FormProvider>
    </div>
  );
};
