import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

import { toast } from '~/shared/hooks/use-toast';
import {
  Form,
  FormCheckbox,
  FormDatePicker,
  FormDateRange,
  FormFooter,
  FormHeader,
  FormInput,
  FormSelect,
  FormTextArea,
} from '~/shared/ui/form';

// Schema Definition mit allen Feldtypen
const userSchema = z.object({
  // Text Inputs
  firstName: z.string().min(2, 'Mindestens 2 Zeichen'),
  lastName: z.string().min(2, 'Mindestens 2 Zeichen'),

  // Email (automatisch erkannter Typ)
  email: z.string().email('Ungültige E-Mail-Adresse'),

  // Passwort
  password: z.string().min(8, 'Mindestens 8 Zeichen'),

  // Nummer
  age: z.number().min(18, 'Mindestens 18 Jahre').max(120, 'Maximal 120 Jahre').optional(),

  // Telefon
  phone: z
    .string()
    .regex(/^[\d\s\-+\\()]+$/, 'Ungültige Telefonnummer')
    .optional(),

  // URL
  website: z.string().url('Ungültige URL').optional(),

  // DatePicker
  birthDate: z.date().optional(),
  joinDate: z.date().optional(),

  // Date Range
  employmentStartDate: z.date().optional(),
  employmentEndDate: z.date().optional(),

  // Select
  country: z.string().min(1, 'Bitte wählen Sie ein Land'),
  language: z.string().min(1, 'Bitte wählen Sie eine Sprache'),

  // Checkbox
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Sie müssen die AGB akzeptieren',
  }),

  // Optional Checkbox
  newsletter: z.boolean().optional(),

  // TextArea
  bio: z.string().max(500, 'Maximal 500 Zeichen').optional(),

  // Additional Fields for testing
  notes: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

// Simulierte API-Funktion
const saveUser = async (): Promise<{ id: string }> => {
  // Simuliere API-Aufruf
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simuliere zufälligen Fehler (20% Chance)
      if (Math.random() < 0.2) {
        reject(new Error('Netzwerkfehler: Der Server ist momentan nicht erreichbar.'));
      } else {
        resolve({ id: '12345' });
      }
    }, 2000);
  });

  return { id: '12345' };
};

// Beispiel-Komponente mit allen Form-Komponenten
export const UserForm = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [submitSuccess, setSubmitSuccess] = useState<string | undefined>();

  const handleSubmit = async (data: UserFormData) => {
    // Reset messages
    setSubmitError(undefined);
    setSubmitSuccess(undefined);

    try {
      console.log('Form submitted:', data);

      // API-Aufruf
      const result = await saveUser();

      // Success handling
      setSubmitSuccess('Benutzer wurde erfolgreich erstellt!');

      // Show toast
      toast({
        title: 'Benutzer erstellt',
        description: `Benutzer ${data.firstName} ${data.lastName} wurde erfolgreich angelegt!`,
      });

      // Navigate after short delay
      setTimeout(() => {
        navigate({ to: `/users/${result.id}` });
      }, 1500);
    } catch (error) {
      // Error handling
      const errorMessage =
        error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten.';
      setSubmitError(errorMessage);

      // Also show error toast
      toast({
        title: 'Fehler beim Erstellen',
        description: `Fehler beim Speichern. Bitte versuchen Sie es erneut.`,
      });
    }
  };

  const handleCancel = () => {
    console.log('Form cancelled');
    // Navigation zurück
    navigate({ to: '/admin' });
  };

  const countryOptions = [
    { value: 'de', label: 'Deutschland' },
    { value: 'at', label: 'Österreich' },
    { value: 'ch', label: 'Schweiz' },
    { value: 'us', label: 'USA' },
    { value: 'fr', label: 'Frankreich' },
    { value: 'uk', label: 'Vereinigtes Königreich' },
    { value: 'it', label: 'Italien' },
    { value: 'es', label: 'Spanien' },
  ];

  const languageOptions = [
    { value: 'de', label: 'Deutsch' },
    { value: 'en', label: 'Englisch' },
    { value: 'fr', label: 'Französisch' },
    { value: 'es', label: 'Spanisch' },
    { value: 'it', label: 'Italienisch' },
    { value: 'pt', label: 'Portugiesisch' },
    { value: 'ru', label: 'Russisch' },
    { value: 'zh', label: 'Chinesisch' },
  ];

  return (
    <Form
      schema={userSchema}
      defaultValues={{
        firstName: 'Max',
        email: 'max.mustermann@example.com',
        password: '',
        age: 25,
        phone: '+49 123 456789',
        website: 'https://example.com',
        birthDate: new Date('2028-01-01'),
        joinDate: undefined,
        acceptTerms: false,
        newsletter: true,
        bio: 'Dies ist eine Beispiel-Biografie.',
        notes: '',
      }}
      onSubmit={handleSubmit}
    >
      {(form) => (
        <>
          {/* Form Header */}
          <FormHeader
            title="Alle Form-Komponenten Demo"
            description="Dieses Formular zeigt alle verfügbaren Form-Komponenten mit verschiedenen Konfigurationen."
            variant="default"
          />

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Section: Persönliche Daten */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Persönliche Daten</h3>

              {/* Text Inputs in Grid */}
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

              {/* Email - Typ wird automatisch erkannt */}
              <FormInput
                control={form.control}
                name="email"
                label="E-Mail-Adresse"
                placeholder="max.mustermann@example.com"
                required
              />

              {/* Password Input */}
              <FormInput
                control={form.control}
                name="password"
                label="Passwort"
                type="password"
                placeholder="Mindestens 8 Zeichen"
                required
              />

              {/* Number Input */}
              <FormInput
                control={form.control}
                name="age"
                label="Alter"
                type="number"
                placeholder="18"
              />

              {/* Phone Input */}
              <FormInput
                control={form.control}
                name="phone"
                label="Telefonnummer"
                type="tel"
                placeholder="+49 123 456789"
              />

              {/* URL Input */}
              <FormInput
                control={form.control}
                name="website"
                label="Website"
                type="url"
                placeholder="https://example.com"
              />
            </div>

            {/* Section: Datum-Auswahl */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Datum-Auswahl</h3>

              {/* DatePicker with Text Input (onChange updates immediately) */}
              <FormDatePicker
                control={form.control}
                name="birthDate"
                label="Geburtsdatum"
                description="Mit Texteingabe - Datum wird beim Tippen validiert"
                placeholder="Datum wählen oder eingeben"
                max={new Date()}
                dateFormat="dd.MM.yyyy"
                allowInput={true}
              />

              {/* Simple DatePicker (Calendar only - like your original) */}
              <FormDatePicker
                control={form.control}
                name="joinDate"
                label="Eintrittsdatum"
                description="Nur Kalenderauswahl - keine Texteingabe"
                placeholder="Datum auswählen"
                dateFormat="dd.MM.yyyy"
                allowInput={false}
              />

              {/* Date Range */}
              <FormDateRange
                control={form.control}
                startName="employmentStartDate"
                endName="employmentEndDate"
                label="Beschäftigungszeitraum"
                startLabel="Von"
                endLabel="Bis"
              />
            </div>

            {/* Section: Auswahl-Felder */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Auswahl-Felder</h3>

              {/* Select with Clear */}
              <FormSelect
                control={form.control}
                name="country"
                label="Land"
                placeholder="Land auswählen"
                options={countryOptions}
                required
                emptyOption="Kein Land ausgewählt"
              />

              {/* Second Select for Languages */}
              <FormSelect
                control={form.control}
                name="language"
                label="Hauptsprache"
                placeholder="Sprache auswählen"
                options={languageOptions}
              />
            </div>

            {/* Section: Checkboxen */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Checkboxen</h3>

              {/* Required Checkbox */}
              <FormCheckbox
                control={form.control}
                name="acceptTerms"
                label="Ich akzeptiere die AGB"
                required
                side="right"
                description="Sie müssen die AGB akzeptieren, um fortzufahren."
              />

              {/* Optional Checkbox */}
              <FormCheckbox
                control={form.control}
                name="newsletter"
                label="Newsletter abonnieren"
                side="right"
                description="Erhalten Sie Updates und Neuigkeiten per E-Mail."
              />
            </div>

            {/* Section: Textbereiche */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Textbereiche</h3>

              {/* TextArea mit Character Count */}
              <FormTextArea
                control={form.control}
                name="bio"
                label="Über mich"
                placeholder="Erzählen Sie etwas über sich..."
                rows={4}
                showReset={true}
                description="Maximal 500 Zeichen"
              />

              {/* Additional Notes */}
              <FormTextArea
                control={form.control}
                name="notes"
                label="Zusätzliche Notizen"
                placeholder="Weitere Informationen..."
              />
            </div>
          </div>

          {/* Form Footer mit Error/Success Handling */}
          <FormFooter
            form={form}
            showReset={true}
            showCancel={true}
            onCancel={handleCancel}
            submitText="Benutzer erstellen"
            cancelText="Abbrechen"
            resetText="Formular zurücksetzen"
            error={submitError}
            success={submitSuccess}
          />
        </>
      )}
    </Form>
  );
};
