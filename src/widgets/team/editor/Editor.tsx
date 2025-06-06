// src/widgets/team/editor/ui/index.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { UserPlus } from 'lucide-react';

import type {
  CreateTeamMember,
  CreateTeamMemberFormData,
  UpdateTeamMember,
  UpdateTeamMemberFormData,
} from '~/entities/team';
import {
  createTeamMemberFormSchema,
  updateTeamMemberFormSchema,
  useCreateTeamMember,
  useTeamMember,
  useUpdateTeamMember,
} from '~/entities/team';

import { toast } from '~/shared/hooks/use-toast';
import { FormFooter, FormHeader, FormProvider } from '~/shared/ui/form';

import { ErrorState, LoadingState } from './model/helper';
// Import sections
import { AddressSection } from './ui/address-section';
import { PersonalInfoSection } from './ui/personal-info-section';
import { ProfessionalInfoSection } from './ui/professional-info-section';
import { SettingsSection } from './ui/settings-section';

type Props = {
  memberId?: string;
};

export type FormData = CreateTeamMemberFormData | UpdateTeamMemberFormData;

export const Editor = ({ memberId }: Props) => {
  const navigate = useNavigate();
  const isEditMode = !!memberId;

  // API Hooks
  const { data: existingMember, isLoading: isLoadingMember } = useTeamMember(memberId || '');

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
    locationId: '',
  };

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
        locationId: existingMember.locationId || '',
      };
      form.reset(formData);
    }
  }, [existingMember, isEditMode, form]);

  const handleSubmit = (data: FormData) => {
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

  const handleCancel = () => {
    navigate({ to: '/team' });
  };

  if (isEditMode && isLoadingMember) {
    return <LoadingState />;
  }

  if (isEditMode && !existingMember && !isLoadingMember) {
    return <ErrorState onBack={handleCancel} />;
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit, handleError)} className="space-y-8">
          <FormHeader
            title={isEditMode ? 'Teammitglied bearbeiten' : 'Neues Teammitglied'}
            description={
              isEditMode
                ? 'Bearbeiten Sie die Daten des Teammitglieds'
                : 'Fügen Sie ein neues Teammitglied hinzu'
            }
            icon={UserPlus}
          />

          <PersonalInfoSection control={form.control} />
          <ProfessionalInfoSection control={form.control} />
          <AddressSection control={form.control} />
          <SettingsSection control={form.control} />

          <FormFooter
            submitText={isEditMode ? 'Änderungen speichern' : 'Teammitglied erstellen'}
            showCancel={true}
            cancelText="Abbrechen"
            onCancel={handleCancel}
            showReset={!isEditMode}
            resetText="Formular zurücksetzen"
          />
        </form>
      </FormProvider>
    </div>
  );
};
