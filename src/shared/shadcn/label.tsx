// src/shared/shadcn/label.tsx
import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/shared/lib/utils';

/**
 * CSDoc: Label Component
 * @description An accessible label component built on Radix UI
 * @example
 * ```tsx
 * <Label htmlFor="email">Email Address</Label>
 * <Input id="email" type="email" />
 * ```
 */

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
  ),
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
