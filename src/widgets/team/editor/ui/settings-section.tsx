// src/widgets/team/editor/ui/sections/settings-section.tsx
import { Card, CardContent, CardHeader } from '~/shared/shadcn';
import { FormCheckbox } from '~/shared/ui/form';

import type { FormData } from '../Editor';
import type { FieldPath, SectionProps } from '../model/types';

export const SettingsSection = ({ control }: SectionProps) => (
  <Card>
    <CardHeader>
      <h2 className="text-lg font-semibold">Einstellungen</h2>
    </CardHeader>
    <CardContent className="space-y-4">
      <FormCheckbox
        control={control}
        name={'newsletter' as FieldPath<FormData>}
        label="Newsletter abonnieren"
        description="Erhält Updates und Neuigkeiten per E-Mail"
      />

      <FormCheckbox
        control={control}
        name={'remoteWork' as FieldPath<FormData>}
        label="Remote-Arbeit erlaubt"
        description="Kann von zu Hause aus arbeiten"
      />
    </CardContent>
  </Card>
);
