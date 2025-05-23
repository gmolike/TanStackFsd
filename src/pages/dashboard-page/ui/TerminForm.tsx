import { z } from 'zod';

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

// Define the validation schema
const personSchema = z.object({
  firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen haben'),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen haben'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  role: z.string().min(1, 'Bitte wählen Sie eine Rolle'),
  birthDate: z.date().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  bio: z.string().max(500, 'Maximal 500 Zeichen').optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Sie müssen die Bedingungen akzeptieren',
  }),
});

// Infer the type from the schema
type PersonFormData = z.infer<typeof personSchema>;

// Role options for the select
const roleOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'user', label: 'Benutzer' },
  { value: 'guest', label: 'Gast' },
];

export function PersonForm() {
  // Handle form submission
  const handleSubmit = async (data: PersonFormData) => {
    console.log('Form submitted:', data);
    // Your submission logic here
  };

  const handleCancel = () => {
    console.log('Form cancelled');
    // Your cancel logic here
  };

  return (
    <Form
      schema={personSchema}
      defaultValues={{
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        bio: '',
        acceptTerms: false,
      }}
      onSubmit={handleSubmit}
    >
      {(form) => (
        <>
          {/* Form Header as child */}
          <FormHeader
            title="Person anlegen"
            description="Füllen Sie alle erforderlichen Felder aus, um eine neue Person anzulegen."
            variant="default"
          />

          {/* Form Fields */}
          <div className="space-y-6">
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

            <FormSelect
              control={form.control}
              name="role"
              label="Rolle"
              options={roleOptions}
              placeholder="Rolle auswählen"
              emptyOption="Keine Rolle"
              required
            />

            <FormDatePicker
              control={form.control}
              name="birthDate"
              label="Geburtsdatum"
              max={new Date()}
              placeholder="Datum auswählen"
            />

            <FormDateRange
              control={form.control}
              startName="startDate"
              endName="endDate"
              label="Beschäftigungszeitraum"
              startLabel="Beginn"
              endLabel="Ende"
            />

            <FormTextArea
              control={form.control}
              name="bio"
              label="Biografie"
              placeholder="Erzählen Sie uns etwas über sich..."
              rows={4}
            />

            <FormCheckbox
              control={form.control}
              name="acceptTerms"
              label="Ich akzeptiere die Allgemeinen Geschäftsbedingungen"
              required
            />
          </div>

          {/* Form Footer as child */}
          <FormFooter
            form={form}
            submit={{ label: 'Person anlegen' }}
            cancel={{ onClick: handleCancel }}
            reset={{}}
            links={[
              { label: 'Hilfe', href: '/help' },
              { label: 'Datenschutz', href: '/privacy' },
            ]}
            variant="default"
          />
        </>
      )}
    </Form>
  );
}

// Alternative: Simple form with only submit button
export function SimpleForm() {
  return (
    <Form
      schema={personSchema}
      defaultValues={{ firstName: '', lastName: '' }}
      onSubmit={(data) => console.log(data)}
    >
      {(form) => (
        <>
          <FormInput control={form.control} name="firstName" label="Vorname" />
          <FormInput control={form.control} name="lastName" label="Nachname" />

          {/* Only submit button is shown */}
          <FormFooter form={form} submit={{}} />
        </>
      )}
    </Form>
  );
}
