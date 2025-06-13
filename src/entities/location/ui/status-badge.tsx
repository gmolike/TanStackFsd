// src/entities/location/ui/status-badge.tsx
import { cn } from '~/shared/lib/utils';

import { locationStatusOptions } from '../model/options';

export type LocationStatusBadgeProps = {
  status: keyof typeof locationStatusOptions;
  className?: string;
};

export const LocationStatusBadge = ({ status, className }: LocationStatusBadgeProps) => {
  const config = locationStatusOptions[status];

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusColors[status],
        className,
      )}
    >
      {config.label}
    </span>
  );
};
