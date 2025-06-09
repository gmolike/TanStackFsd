// src/shared/ui/expandable-data-table/expand-button.tsx
import { ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '~/shared/shadcn';

import type { ExpandButtonProps } from './types';

/**
 * Button zum Erweitern/Reduzieren der Tabelle
 * @component
 */
export const ExpandButton = ({
  isExpanded,
  onToggle,
  collapsedCount,
  totalCount,
}: ExpandButtonProps) => {
  if (totalCount <= collapsedCount) return null;

  return (
    <div className="flex justify-center border-t py-4">
      <Button variant="ghost" onClick={onToggle} className="gap-2">
        {isExpanded ? (
          <>
            <ChevronUp className="h-4 w-4" />
            Weniger anzeigen
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            Alle {totalCount} Einträge anzeigen
          </>
        )}
      </Button>
    </div>
  );
};
