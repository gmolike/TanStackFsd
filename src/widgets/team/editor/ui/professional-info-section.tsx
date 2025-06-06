// src/widgets/team/editor/ui/sections/professional-info-section.tsx
import { departmentOptionsList, teamStatusOptions } from '~/entities/team';

import { Card, CardContent, CardHeader } from '~/shared/shadcn';
import { FormDatePicker, FormInput, FormSelect } from '~/shared/ui/form';

import type { FormData } from '../Editor';
import type { FieldPath, SectionProps } from '../model/types';

export const ProfessionalInfoSection = ({ control }: SectionProps) => (
  <Card>
    <CardHeader>
      <h2 className="text-lg font-semibold">Berufliche Informationen</h2>
    </CardHeader>
    <CardContent className="space-y-4">
      <FormInput
        control={control}
        name={'role' as FieldPath<FormData>}
        label="Rolle"
        placeholder="z.B. Senior Entwickler"
        required
      />

      <FormSelect
        control={control}
        name={'department' as FieldPath<FormData>}
        options={departmentOptionsList}
        label="Abteilung"
        placeholder="Wählen Sie eine Abteilung..."
        required
      />

      <FormSelect
        control={control}
        name={'status' as FieldPath<FormData>}
        options={Object.entries(teamStatusOptions).map(([key, opt]) => ({
          value: key,
          label: opt.label,
        }))}
        label="Status"
        required
      />

      <FormDatePicker
        control={control}
        name={'startDate' as FieldPath<FormData>}
        label="Eintrittsdatum"
        placeholder="Wählen Sie ein Datum"
        required
      />
    </CardContent>
  </Card>
);
