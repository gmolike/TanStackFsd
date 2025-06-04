// src/shared/ui/badge.tsx
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '~/shared/lib/utils';

// ================= TYPES =================
export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

// ================= LOGIC =================
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * Badge component for displaying status or labels
 * @param {BadgeProps} props - Component props
 * @returns {JSX.Element} Badge component
 */
export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  // ================= RETURN =================
  <div className={cn(badgeVariants({ variant }), className)} {...props} />
);
