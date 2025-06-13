// src/entities/article/ui/status-badge.tsx
import { cn } from '~/shared/lib/utils';

import { articleStatusOptions } from '../model/options';

export type ArticleStatusBadgeProps = {
  status: keyof typeof articleStatusOptions;
  className?: string;
};

export const ArticleStatusBadge = ({ status, className }: ArticleStatusBadgeProps) => {
  const config = articleStatusOptions[status];

  const statusColors = {
    available: 'bg-green-100 text-green-800',
    unavailable: 'bg-red-100 text-red-800',
    discontinued: 'bg-gray-100 text-gray-800',
    coming_soon: 'bg-blue-100 text-blue-800',
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
