import { useState } from 'react';

import { CalendarRange, Mail, Phone, User } from 'lucide-react';
import { z } from 'zod';

import {
  Form,
  FormDate,
  FormFooter,
  FormHeader,
  FormInput,
  FormSelect,
  FormTextArea,
} from '~/shared/ui/form';

// Zeitslots für die Termine
const TIME_SLOTS = [
  { value: '09:00', label: '09:00 Uhr' },
  { value: '10:00', label: '10:00 Uhr' },
  { value: '11:00', label: '11:00 Uhr' },
  { value: '13:00', label: '13:00 Uhr' },
  { value: '14:00', label: '14:00 Uhr' },
  { value: '15:00', label: '15:00 Uhr' },
  { value: '16:00', label: '16:00 Uhr' },
];

// Schema für Formularvalidierung mit Zod
const appointmentSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  phone: z.string().optional(),
  date: z.date({
    required_error: 'Bitte wählen Sie ein Datum',
    invalid_type_error: 'Das ist kein gültiges Datum',
  }),
  timeSlot: z.string().min(1, 'Bitte wählen Sie eine Uhrzeit'),
  notes: z.string().optional(),
});

// Typisierung für das Formular
type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export const TerminForm = () => {
  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const handleSubmit = async (data: AppointmentFormValues) => {
    try {
      // Hier würden Sie normalerweise die Daten an Ihr Backend senden
      console.log('Formular abgesendet mit:', data);

      // Simuliere eine erfolgreiche Übermittlung
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage(
        `Termin erfolgreich gebucht für ${data.date.toLocaleDateString()} um ${data.timeSlot} Uhr.`,
      );
    } catch (error) {
      console.error('Fehler beim Absenden des Formulars:', error);
    }
  };

  return (
    <Form<AppointmentFormValues>
      schema={appointmentSchema}
      onSubmit={handleSubmit}
      defaultValues={{
        name: '',
        email: '',
        phone: '',
        notes: '',
      }}
      header={
        <FormHeader
          title="Termin vereinbaren"
          description="Füllen Sie das Formular aus, um einen Termin zu buchen."
          icon={CalendarRange}
        />
      }
      footer={
        <FormFooter
          submitText="Termin buchen"
          showCancel={true}
          cancelText="Abbrechen"
          onCancel={() => window.history.back()}
          successMessage={successMessage}
        />
      }
    >
      <FormInput
        name="name"
        label="Name"
        placeholder="Max Mustermann"
        required
        startIcon={<User />}
      />

      <FormInput
        name="email"
        label="E-Mail"
        type="email"
        placeholder="ihre-email@beispiel.de"
        required
        startIcon={<Mail />}
      />

      <FormInput
        name="phone"
        label="Telefonnummer"
        placeholder="+49 123 4567890"
        description="Optional: Für Rückfragen"
        startIcon={<Phone />}
      />

      <FormDate
        name="date"
        label="Datum"
        required
        description="Wählen Sie den gewünschten Tag für Ihren Termin"
      />

      <FormSelect
        name="timeSlot"
        label="Uhrzeit"
        placeholder="Wählen Sie eine Uhrzeit"
        options={TIME_SLOTS}
        required
        description="Verfügbare Termine zwischen 9:00 und 17:00 Uhr"
      />

      <FormTextArea
        name="notes"
        label="Anmerkungen"
        placeholder="Haben Sie besondere Wünsche oder Anmerkungen zu Ihrem Termin?"
        rows={4}
      />
    </Form>
  );
};
