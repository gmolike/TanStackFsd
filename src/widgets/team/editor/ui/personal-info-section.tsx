// src/widgets/team/editor/ui/sections/personal-info-section.tsx
import { Card, CardContent, CardHeader } from '~/shared/shadcn';
import { FormDatePicker, FormInput, FormTextArea } from '~/shared/ui/form';

import type { FormData } from '../Editor';
import type { FieldPath, SectionProps } from '../model/types';

export const PersonalInfoSection = ({ control }: SectionProps) => (
  <Card>
    <CardHeader>
      <h2 className="text-lg font-semibold">Persönliche Informationen</h2>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          control={control}
          name={'firstName' as FieldPath<FormData>}
          label="Vorname"
          placeholder="Max"
          required
        />
        <FormInput
          control={control}
          name={'lastName' as FieldPath<FormData>}
          label="Nachname"
          placeholder="Mustermann"
          required
        />
      </div>

      <FormInput
        control={control}
        name={'email' as FieldPath<FormData>}
        label="E-Mail"
        type="email"
        placeholder="max.mustermann@example.com"
        required
      />

      <FormInput
        control={control}
        name={'phone' as FieldPath<FormData>}
        label="Telefon"
        type="tel"
        placeholder="+49 123 456789"
      />

      <FormDatePicker
        control={control}
        name={'birthDate' as FieldPath<FormData>}
        label="Geburtsdatum"
        placeholder="Wählen Sie ein Datum"
        max={new Date()}
      />

      <FormTextArea
        control={control}
        name={'bio' as FieldPath<FormData>}
        label="Biografie"
        placeholder="Erzählen Sie etwas über sich..."
        rows={4}
        description="Eine kurze Beschreibung (optional)"
      />
    </CardContent>
  </Card>
);
