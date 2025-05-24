// src/features/example/ui/SimpleFormExample.tsx
import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

import { toast } from '~/shared/hooks/use-toast';
import { Form, FormFooter, FormHeader, FormInput } from '~/shared/ui/form';

// Simple schema
const simpleSchema = z.object({
  name: z.string().min(2, 'Mindestens 2 Zeichen'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
});

type SimpleFormData = z.infer<typeof simpleSchema>;

// API simulation
const saveData = async (): Promise<{ id: string }> => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 30% error rate
      if (Math.random() < 0.3) {
        reject(new Error('Server-Fehler: Bitte versuchen Sie es später erneut.'));
      } else {
        resolve({ id: Date.now().toString() });
      }
    }, 1500);
  });

  return { id: Date.now().toString() };
};

/**
 * Simple Form Example demonstrating the complete workflow:
 * 1. Form submission
 * 2. Error handling in footer
 * 3. Success toast + navigation
 */
export const SimpleFormExample = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const handleSubmit = async (data: SimpleFormData) => {
    // Clear previous messages
    setError(undefined);
    setSuccess(undefined);

    try {
      // Call API
      const result = await saveData();

      // Show success in footer briefly
      setSuccess('Erfolgreich gespeichert!');

      // Show toast notification
      toast({
        title: 'Benutzer erstellt',
        description: `${data.name} wurde erfolgreich angelegt!`,
      });
      console.log('Saved data:', result);
      // Navigate after delay
      setTimeout(() => {
        navigate({ to: `/dashboard` });
      }, 1000);
    } catch (err) {
      // Show error in footer
      const message = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten';
      setError(message);

      // Optional: Also show error toast
      toast({
        title: 'Fehler beim Erstellen',
        description: `Fehler beim Speichern. Bitte versuchen Sie es erneut.`,
      });
    }
  };

  const handleCancel = () => {
    navigate({ to: '/' });
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Form
        schema={simpleSchema}
        defaultValues={{
          name: '',
          email: '',
        }}
        onSubmit={handleSubmit}
      >
        {(form) => (
          <>
            <FormHeader
              title="Workflow Beispiel"
              description="Dieses Formular zeigt den kompletten Submit-Workflow mit Error Handling und Navigation."
            />

            <div className="space-y-4">
              <FormInput
                control={form.control}
                name="name"
                label="Name"
                placeholder="Max Mustermann"
                required
              />

              <FormInput
                control={form.control}
                name="email"
                label="E-Mail"
                placeholder="max@example.com"
                required
              />
            </div>

            <FormFooter
              form={form}
              showCancel={true}
              showReset={true}
              onCancel={handleCancel}
              submitText="Speichern"
              error={error}
              success={success}
            />
          </>
        )}
      </Form>

      {/* Info Box */}
      <div className="mt-8 rounded-lg bg-blue-50 p-4">
        <h3 className="mb-2 font-semibold text-blue-900">Workflow Demo:</h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• 30% Fehlerwahrscheinlichkeit beim Speichern</li>
          <li>• Bei Fehler: Nachricht im Footer</li>
          <li>• Bei Erfolg: Toast + Navigation nach 1 Sekunde</li>
          <li>• Reset-Button setzt auf Standardwerte zurück</li>
        </ul>
      </div>
    </div>
  );
};
