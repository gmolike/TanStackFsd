import { z } from 'zod';

import {
  Form,
  FormDatePicker,
  FormFooter,
  FormHeader,
  FormInput,
  FormSelect,
  FormTextArea,
} from '~/shared/ui/form';

// Schema Definition
const userSchema = z.object({
  firstName: z.string().min(2, 'Mindestens 2 Zeichen'),
  lastName: z.string().min(2, 'Mindestens 2 Zeichen'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  birthDate: z.date().optional(),
  country: z.string().min(1, 'Bitte wählen Sie ein Land'),
  bio: z.string().max(500, 'Maximal 500 Zeichen').optional(),
});

type UserFormData = z.infer<typeof userSchema>;

// Beispiel-Komponente
export const UserForm = () => {
  const handleSubmit = async (data: UserFormData) => {
    console.log('Form submitted:', data);
    // API-Aufruf hier
  };

  const handleCancel = () => {
    console.log('Form cancelled');
    // Navigation oder Modal schließen
  };

  const countryOptions = [
    { value: 'de', label: 'Deutschland' },
    { value: 'at', label: 'Österreich' },
    { value: 'ch', label: 'Schweiz' },
    { value: 'us', label: 'USA' },
    { value: 'fr', label: 'Frankreich' },
  ];

  return (
    <Form
      schema={userSchema}
      defaultValues={{
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        bio: '',
      }}
      onSubmit={handleSubmit}
    >
      {(form) => (
        <>
          {/* Vereinfachter Header */}
          <FormHeader
            title="Benutzer erstellen"
            description="Füllen Sie die folgenden Felder aus, um einen neuen Benutzer anzulegen."
            variant="default"
          />

          {/* Form Fields mit Reset-Funktion */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                control={form.control}
                name="firstName"
                label="Vorname"
                placeholder="Max"
                required
                showReset={true} // Standard ist true
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
              label="E-Mail-Adresse"
              type="email"
              placeholder="max.mustermann@example.com"
              required
            />

            {/* DatePicker mit Clear-Button und Eingabefeld */}
            <FormDatePicker
              control={form.control}
              name="birthDate"
              label="Geburtsdatum"
              placeholder="Datum wählen"
              showClear={true} // Standard ist true
              max={new Date()}
            />

            {/* Select mit Clear-Button */}
            <FormSelect
              control={form.control}
              name="country"
              label="Land"
              placeholder="Land auswählen"
              options={countryOptions}
              required
              showClear={true}
            />

            {/* TextArea mit Reset-Button */}
            <FormTextArea
              control={form.control}
              name="bio"
              label="Über mich"
              placeholder="Erzählen Sie etwas über sich..."
              rows={4}
              showReset={true}
            />
          </div>

          {/* Vereinfachter Footer mit fester Button-Reihenfolge */}
          <FormFooter
            form={form}
            showReset={true}
            showCancel={true}
            onCancel={handleCancel}
            submitText="Benutzer erstellen"
            cancelText="Abbrechen"
            resetText="Formular zurücksetzen"
          />
        </>
      )}
    </Form>
  );
};
