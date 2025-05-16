import React, { useState } from 'react';

import { FormInput, Settings, User, UserCheck } from 'lucide-react';
import { z } from 'zod';

import type { SelectOption } from '~/shared/ui/form';
import {
  Form,
  FormCheckbox,
  FormDate,
  FormFooter,
  FormHeader,
  FormSelect,
  FormTextarea,
} from '~/shared/ui/form';
// Schema Definition
const userProfileSchema = z.object({
  firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen lang sein'),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen lang sein'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z.string().optional(),
  birthDate: z.date().optional(),
  bio: z.string().max(500, 'Bio darf maximal 500 Zeichen lang sein').optional(),
  role: z.string().min(1, 'Bitte wählen Sie eine Rolle'),
  department: z.string().optional(),
  notifications: z.boolean().default(true),
  publicProfile: z.boolean().default(false),
});

type UserProfileFormData = z.infer<typeof userProfileSchema>;

const roleOptions: Array<SelectOption> = [
  { value: 'developer', label: 'Entwickler' },
  { value: 'designer', label: 'Designer' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Administrator' },
];

const departmentOptions: Array<SelectOption> = [
  { value: 'engineering', label: 'Technik' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Vertrieb' },
  { value: 'hr', label: 'Personal' },
];

export const UserProfileForm: React.FC = () => {
  const [errors, setErrors] = useState<Array<string>>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isEdit, setIsEdit] = useState(false);

  const handleSubmit = async (data: UserProfileFormData) => {
    try {
      setErrors([]);
      setSuccessMessage('');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate occasional error
      if (Math.random() > 0.8) {
        throw new Error('Serverseitiger Fehler beim Speichern');
      }

      setSuccessMessage('Profil erfolgreich gespeichert!');
      console.log('Profile saved:', data);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Unbekannter Fehler']);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        'Möchten Sie wirklich abbrechen? Nicht gespeicherte Änderungen gehen verloren.',
      )
    ) {
      setIsEdit(false);
      setErrors([]);
      setSuccessMessage('');
    }
  };

  const handleReset = () => {
    if (window.confirm('Möchten Sie wirklich alle Änderungen zurücksetzen?')) {
      setErrors([]);
      setSuccessMessage('');
    }
  };

  // Header Actions
  const headerActions = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setIsEdit(!isEdit)}
        className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
      >
        <Settings className="h-4 w-4" />
        {isEdit ? 'Vorschau' : 'Bearbeiten'}
      </button>
    </div>
  );

  // Footer Links
  const footerLinks = [
    { label: 'Datenschutz', href: '/privacy' },
    { label: 'Nutzungsbedingungen', href: '/terms' },
    { label: 'Hilfe', href: '/help', external: true },
  ];

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Form
        schema={userProfileSchema}
        defaultValues={{
          firstName: 'Max',
          lastName: 'Mustermann',
          email: 'max.mustermann@example.com',
          phone: '+49 123 456789',
          bio: '',
          role: 'developer',
          department: 'engineering',
          notifications: true,
          publicProfile: false,
        }}
        onSubmit={handleSubmit}
        header={
          <FormHeader
            title="Benutzerprofil"
            description="Verwalten Sie Ihre persönlichen Informationen und Kontoeinstellungen."
            subtitle="Alle Felder mit * sind erforderlich"
            icon={User}
            actions={headerActions}
            badge={
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Verifiziert
              </span>
            }
          />
        }
        footer={
          <FormFooter
            submitText="Profil speichern"
            cancelText="Abbrechen"
            resetText="Zurücksetzen"
            showCancel={true}
            showReset={true}
            onCancel={handleCancel}
            onReset={handleReset}
            errors={errors}
            successMessage={successMessage}
            links={footerLinks}
            actions={[
              {
                label: 'Als Vorlage speichern',
                variant: 'outline',
                onClick: () => console.log('Template saved'),
                icon: <UserCheck className="h-4 w-4" />,
              },
            ]}
            variant="default"
          />
        }
      >
        {({ formState: { isSubmitting, isDirty } }) => (
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Persönliche Informationen</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormInput
                  name="firstName"
                  label="Vorname"
                  required
                  disabled={!isEdit}
                  icon={<User className="h-4 w-4" />}
                />

                <FormInput name="lastName" label="Nachname" required disabled={!isEdit} />
              </div>

              <FormInput
                name="email"
                type="email"
                label="E-Mail-Adresse"
                required
                disabled={!isEdit}
                description="Ihre primäre E-Mail-Adresse für wichtige Benachrichtigungen"
              />

              <FormInput
                name="phone"
                type="tel"
                label="Telefonnummer"
                disabled={!isEdit}
                placeholder="+49 123 456789"
              />

              <FormDate
                name="birthDate"
                label="Geburtsdatum"
                disabled={!isEdit}
                max={new Date().toISOString().split('T')[0]}
                description="Wird nur für Altersverifikation verwendet"
              />

              <FormTextarea
                name="bio"
                label="Über mich"
                disabled={!isEdit}
                placeholder="Erzählen Sie uns etwas über sich..."
                rows={4}
                description="Kurze Beschreibung für Ihr öffentliches Profil (max. 500 Zeichen)"
              />
            </div>

            {/* Work Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Arbeitsplatz</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormSelect
                  name="role"
                  label="Rolle"
                  required
                  disabled={!isEdit}
                  options={roleOptions}
                  description="Ihre aktuelle Position"
                />

                <FormSelect
                  name="department"
                  label="Abteilung"
                  disabled={!isEdit}
                  options={departmentOptions}
                  emptyOption="Keine Abteilung"
                />
              </div>
            </div>

            {/* Privacy Settings Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Datenschutz & Benachrichtigungen</h3>

              <div className="space-y-3">
                <FormCheckbox
                  name="notifications"
                  disabled={!isEdit}
                  label="E-Mail-Benachrichtigungen erhalten"
                  description="Erhalten Sie Updates über wichtige Ereignisse"
                />

                <FormCheckbox
                  name="publicProfile"
                  disabled={!isEdit}
                  label="Öffentliches Profil"
                  description="Ihr Profil ist für andere Nutzer sichtbar"
                />
              </div>
            </div>

            {/* Status Indicator */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${isDirty ? 'bg-orange-500' : 'bg-green-500'}`}
                />
                <span className="text-sm text-muted-foreground">
                  {isDirty ? 'Ungespeicherte Änderungen' : 'Alle Änderungen gespeichert'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};
