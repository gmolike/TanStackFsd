// src/entities/location/ui/type-badge.tsx
import { cn } from '~/shared/lib/utils';

import { locationTypeOptions } from '../model/options';

export type LocationTypeBadgeProps = {
  type: keyof typeof locationTypeOptions;
  className?: string;
  showIcon?: boolean;
};

export const LocationTypeBadge = ({ type, className, showIcon = true }: LocationTypeBadgeProps) => {
  const config = locationTypeOptions[type];

  const typeColors = {
    warehouse: 'text-blue-600',
    office: 'text-gray-600',
    store: 'text-green-600',
    production: 'text-orange-600',
  };

  return (
    <div className={cn('flex items-center gap-2', typeColors[type], className)}>
      {showIcon && <span>{config.icon}</span>}
      <span>{config.label}</span>
    </div>
  );
};
