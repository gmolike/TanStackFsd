import { cn } from '~/shared/lib/utils';

export type StatusBadgeProps = {
  status: 'active' | 'inactive' | 'vacation';
  className?: string;
};

const statusConfig = {
  active: {
    label: 'Aktiv',
    className: 'bg-green-100 text-green-800',
  },
  inactive: {
    label: 'Inaktiv',
    className: 'bg-gray-100 text-gray-800',
  },
  vacation: {
    label: 'Urlaub',
    className: 'bg-blue-100 text-blue-800',
  },
} as const;

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
};
