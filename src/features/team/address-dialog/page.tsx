// src/features/team-editor/ui/address-dialog.tsx
import { useState } from 'react';

import type { Address } from '~/entities/team';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/shared/shadcn';

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: Address | undefined;
  onChange: (value: Address) => void;
}

export const AddressDialog = ({ open, onOpenChange, value, onChange }: AddressDialogProps) => {
  const [localAddress, setLocalAddress] = useState<Address>(
    value || { street: '', city: '', country: '', postalCode: '' },
  );

  const handleSave = () => {
    // Simple validation
    if (localAddress.street && localAddress.city && localAddress.country) {
      onChange(localAddress);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
          <DialogDescription>
            Enter your address details. All fields except postal code are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">
              Street <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={localAddress.street}
              onChange={(e) => setLocalAddress({ ...localAddress, street: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              placeholder="123 Main St"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              City <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={localAddress.city}
              onChange={(e) => setLocalAddress({ ...localAddress, city: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              placeholder="New York"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Country <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={localAddress.country}
              onChange={(e) => setLocalAddress({ ...localAddress, country: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              placeholder="USA"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Postal Code</label>
            <input
              type="text"
              value={localAddress.postalCode || ''}
              onChange={(e) => setLocalAddress({ ...localAddress, postalCode: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              placeholder="10001"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!localAddress.street || !localAddress.city || !localAddress.country}
          >
            Save Address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
