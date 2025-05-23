import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';

import { cn } from '~/shared/lib/utils';
import { Label } from '~/shared/shadcn/label';

interface FormLabelProps extends ComponentPropsWithoutRef<typeof Label> {
  required?: boolean;
}

export const FormLabel = forwardRef<ElementRef<typeof Label>, FormLabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <Label ref={ref} className={cn(className)} {...props}>
      {children}
      {required && (
        <span className="ml-1 text-destructive" aria-label="erforderlich">
          *
        </span>
      )}
    </Label>
  ),
);
FormLabel.displayName = 'FormLabel';
