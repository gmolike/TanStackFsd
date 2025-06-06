import { useState } from 'react';

import type { Address } from '~/entities/team';

import {
  Button,
  Dialog as ShadCnDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/shared/shadcn';

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: Address | undefined;
  onChange: (value: Address) => void;
};

export const Dialog = ({ open, onOpenChange, value, onChange }: DialogProps) => {
  const [localAddress, setLocalAddress] = useState<Address>(
    value || { street: '', city: '', country: '', postalCode: '' },
  );

  const handleSave = () => {
    if (localAddress.street && localAddress.city && localAddress.country) {
      onChange(localAddress);
      onOpenChange(false);
    }
  };

  return (
    <ShadCnDialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adresse bearbeiten</DialogTitle>
          <DialogDescription>
            Geben Sie die Adressdaten ein. Alle Felder außer Postleitzahl sind erforderlich.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">
              Straße <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={localAddress.street}
              onChange={(e) => setLocalAddress({ ...localAddress, street: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Musterstraße 123"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Stadt <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={localAddress.city}
              onChange={(e) => setLocalAddress({ ...localAddress, city: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Berlin"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Land <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={localAddress.country}
              onChange={(e) => setLocalAddress({ ...localAddress, country: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Deutschland"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Postleitzahl</label>
            <input
              type="text"
              value={localAddress.postalCode || ''}
              onChange={(e) => setLocalAddress({ ...localAddress, postalCode: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="10115"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button
            onClick={handleSave}
            disabled={!localAddress.street || !localAddress.city || !localAddress.country}
          >
            Adresse speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </ShadCnDialog>
  );
};
