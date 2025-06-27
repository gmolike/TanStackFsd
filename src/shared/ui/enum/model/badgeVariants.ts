import { cva } from 'class-variance-authority';

const semanticColors = {
  default: 'border-transparent bg-gray-100 text-gray-800 hover:bg-gray-100/80',
  success: 'bg-green-100 text-green-800 hover:bg-green-100/80',
  warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80',
  error: 'bg-red-100 text-red-800 hover:bg-red-100/80',
  info: 'bg-blue-100 text-blue-800 hover:bg-blue-100/80',
  purple: 'bg-purple-100 text-purple-800 hover:bg-purple-100/80',
  orange: 'bg-orange-100 text-orange-800 hover:bg-orange-100/80',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
};

export type BadgeVariant = keyof typeof semanticColors;

export const badgeVariants = cva(
  'focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none',
  {
    variants: {
      variant: semanticColors,
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);
