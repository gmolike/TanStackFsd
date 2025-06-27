import type { PropsWithChildren } from 'react';

import { CommandEmpty } from '~/shared/shadcn';

type Props = {
  isLoading: boolean;
  filteredOptionsLength: number;
  emptyText: string;
};

export const CommandListTemplate = ({
  children,
  isLoading,
  filteredOptionsLength,
  emptyText,
}: PropsWithChildren<Props>) => {
  if (isLoading) return <CommandEmpty>Wird geladen...</CommandEmpty>;
  if (filteredOptionsLength === 0) return <CommandEmpty>{emptyText}</CommandEmpty>;
  return <>{children}</>;
};
