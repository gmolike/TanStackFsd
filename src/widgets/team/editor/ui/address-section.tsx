// src/widgets/team/editor/ui/sections/address-section.tsx
import { TeamAddressDialog } from '~/features/team';

import type { Address } from '~/entities/team';

import { Card, CardContent, CardHeader } from '~/shared/shadcn';
import { FormDialogButton } from '~/shared/ui/form';

import type { FormData } from '../Editor';
import type { FieldPath, SectionProps } from '../model/types';

export const AddressSection = ({ control }: SectionProps) => (
  <Card>
    <CardHeader>
      <h2 className="text-lg font-semibold">Adresse</h2>
    </CardHeader>
    <CardContent>
      <FormDialogButton
        control={control}
        name={'address' as FieldPath<FormData>}
        label="Adresse"
        dialog={({ open, onOpenChange, value, onChange }) => (
          <TeamAddressDialog
            open={open}
            onOpenChange={onOpenChange}
            value={value as Address | undefined}
            onChange={onChange}
          />
        )}
        emptyText="Klicken Sie hier, um eine Adresse hinzuzufügen"
        description="Heimatadresse des Teammitglieds (optional)"
      >
        {(value) => {
          const address = value as Address | undefined;
          if (!address || !address.street) return null;
          return (
            <div className="text-left">
              <div className="font-medium">{address.street}</div>
              <div className="text-sm text-muted-foreground">
                {address.postalCode} {address.city}, {address.country}
              </div>
            </div>
          );
        }}
      </FormDialogButton>
    </CardContent>
  </Card>
);
