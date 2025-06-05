// src/pages/team/editor/ui/page.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Loader2, UserPlus } from 'lucide-react';

import { AddressDialog } from '~/features/team';

import type {
  Address,
  CreateTeamMember,
  CreateTeamMemberFormData,
  UpdateTeamMember,
  UpdateTeamMemberFormData,
} from '~/entities/team';
import {
  createTeamMemberFormSchema,
  departmentOptionsList,
  teamStatusOptions,
  updateTeamMemberFormSchema,
  useCreateTeamMember,
  useTeamMember,
  useUpdateTeamMember,
} from '~/entities/team';

import { toast } from '~/shared/hooks/use-toast';
import { Alert, AlertDescription, Button, Card, CardContent, CardHeader } from '~/shared/shadcn';
import {
  FormCheckbox,
  FormDatePicker,
  FormDialogButton,
  FormFooter,
  FormHeader,
  FormInput,
  FormProvider,
  FormSelect,
  FormTextArea,
} from '~/shared/ui/form';

export const TeamEditorPage = () => {
  const navigate = useNavigate();
  const { memberId } = useParams({ strict: false });
  const isEditMode = !!memberId && memberId !== 'new';

  // API Hooks
  const { data: existingMember, isLoading: isLoadingMember } = useTeamMember(memberId || '', {
    enabled: isEditMode,
  });

  const createMutation = useCreateTeamMember({
    onSuccess: (data) => {
      toast({
        title: 'Teammitglied erstellt',
        description: `${data.firstName} ${data.lastName} wurde erfolgreich hinzugefügt.`,
      });
      navigate({ to: '/team/$memberId', params: { memberId: data.id } });
    },
    onError: (error) => {
      toast({
        title: 'Fehler beim Erstellen',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useUpdateTeamMember({
    onSuccess: (data) => {
      toast({
        title: 'Änderungen gespeichert',
        description: 'Die Daten wurden erfolgreich aktualisiert.',
      });
      navigate({ to: '/team/$memberId', params: { memberId: data.id } });
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
  const defaultValues: CreateTeamMemberFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    status: 'active',
    bio: '',
    birthDate: null,
    startDate: new Date(),
    address: null,
    newsletter: false,
    remoteWork: false,
  };

  type FormData = CreateTeamMemberFormData | UpdateTeamMemberFormData;

  const form = useForm<FormData>({
    resolver: zodResolver(isEditMode ? updateTeamMemberFormSchema : createTeamMemberFormSchema),
    defaultValues: isEditMode
      ? ({ id: memberId, ...defaultValues } as UpdateTeamMemberFormData)
      : defaultValues,
    mode: 'onChange',
  });

  // Load existing data in edit mode
  useEffect(() => {
    if (isEditMode && existingMember) {
      const formData: UpdateTeamMemberFormData = {
        id: existingMember.id,
        firstName: existingMember.firstName,
        lastName: existingMember.lastName,
        email: existingMember.email,
        phone: existingMember.phone || '',
        role: existingMember.role,
        department: existingMember.department,
        status: existingMember.status,
        bio: existingMember.bio || '',
        birthDate: existingMember.birthDate ? new Date(existingMember.birthDate) : null,
        startDate: new Date(existingMember.startDate),
        address: existingMember.address || null,
        newsletter: existingMember.newsletter,
        remoteWork: existingMember.remoteWork,
      };
      form.reset(formData);
    }
  }, [existingMember, isEditMode, form]);

  const handleSubmit = (data: FormData) => {
    // Transform form data to API data
    const apiData: CreateTeamMember | UpdateTeamMember = {
      ...data,
      phone: data.phone || undefined,
      bio: data.bio || undefined,
      birthDate: data.birthDate || undefined,
      address: data.address || undefined,
    };

    if (isEditMode && 'id' in apiData) {
      updateMutation.mutate(apiData);
    } else {
      const { ...createData } = apiData as CreateTeamMember;
      createMutation.mutate(createData);
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
  if (isEditMode && isLoadingMember) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Lade Teammitglied...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state for edit mode
  if (isEditMode && !existingMember && !isLoadingMember) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Card>
          <CardHeader>
            <Alert variant="destructive">
              <AlertDescription>Teammitglied nicht gefunden</AlertDescription>
            </Alert>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate({ to: '/team' })}>Zurück zur Übersicht</Button>
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
            title={isEditMode ? 'Teammitglied bearbeiten' : 'Neues Teammitglied'}
            description={
              isEditMode
                ? 'Bearbeiten Sie die Daten des Teammitglieds'
                : 'Fügen Sie ein neues Teammitglied hinzu'
            }
            icon={UserPlus}
          />

          {/* Persönliche Informationen */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Persönliche Informationen</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  control={form.control}
                  name="firstName"
                  label="Vorname"
                  placeholder="Max"
                  required
                />
                <FormInput
                  control={form.control}
                  name="lastName"
                  label="Nachname"
                  placeholder="Mustermann"
                  required
                />
              </div>

              <FormInput
                control={form.control}
                name="email"
                label="E-Mail"
                type="email"
                placeholder="max.mustermann@example.com"
                required
              />

              <FormInput
                control={form.control}
                name="phone"
                label="Telefon"
                type="tel"
                placeholder="+49 123 456789"
              />

              <FormDatePicker
                control={form.control}
                name="birthDate"
                label="Geburtsdatum"
                placeholder="Wählen Sie ein Datum"
                max={new Date()}
              />

              <FormTextArea
                control={form.control}
                name="bio"
                label="Biografie"
                placeholder="Erzählen Sie etwas über sich..."
                rows={4}
                description="Eine kurze Beschreibung (optional)"
              />
            </CardContent>
          </Card>

          {/* Berufliche Informationen */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Berufliche Informationen</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInput
                control={form.control}
                name="role"
                label="Rolle"
                placeholder="z.B. Senior Entwickler"
                required
              />

              <FormSelect
                control={form.control}
                name="department"
                options={departmentOptionsList}
                label="Abteilung"
                placeholder="Wählen Sie eine Abteilung..."
                required
              />

              <FormSelect
                control={form.control}
                name="status"
                options={Object.entries(teamStatusOptions).map(([key, opt]) => ({
                  value: key,
                  label: opt.label,
                }))}
                label="Status"
                required
              />

              <FormDatePicker
                control={form.control}
                name="startDate"
                label="Eintrittsdatum"
                placeholder="Wählen Sie ein Datum"
                required
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
                emptyText="Klicken Sie hier, um eine Adresse hinzuzufügen"
                description="Heimatadresse des Teammitglieds (optional)"
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

          {/* Einstellungen */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Einstellungen</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormCheckbox
                control={form.control}
                name="newsletter"
                label="Newsletter abonnieren"
                description="Erhält Updates und Neuigkeiten per E-Mail"
              />

              <FormCheckbox
                control={form.control}
                name="remoteWork"
                label="Remote-Arbeit erlaubt"
                description="Kann von zu Hause aus arbeiten"
              />
            </CardContent>
          </Card>

          {/* Footer */}
          <FormFooter
            submitText={isEditMode ? 'Änderungen speichern' : 'Teammitglied erstellen'}
            showCancel={true}
            cancelText="Abbrechen"
            onCancel={() => navigate({ to: '/team' })}
            showReset={!isEditMode}
            resetText="Formular zurücksetzen"
          />
        </form>
      </FormProvider>
    </div>
  );
};
