// ===== ExpandButton.tsx =====
// src/shared/ui/data-table/components/ExpandButton.tsx
import { ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '~/shared/shadcn';

import type { ExpandButtonProps } from '../types';

/**
 * Button zum Erweitern/Reduzieren der Tabelle
 *
 * @component
 * @param props - Button Konfiguration
 *
 * @example
 * ```tsx
 * <ExpandButton
 *   isExpanded={false}
 *   onToggle={handleToggle}
 *   collapsedCount={5}
 *   totalCount={100}
 * />
 * ```
 */
export const ExpandButton = ({
  isExpanded,
  onToggle,
  collapsedCount,
  totalCount,
  customText,
}: ExpandButtonProps) => {
  if (totalCount <= collapsedCount) return null;

  const expandText = customText?.expand ?? `Alle ${totalCount} Einträge anzeigen`;
  const collapseText = customText?.collapse ?? 'Weniger anzeigen';

  return (
    <div className="flex justify-center border-t py-4">
      <Button variant="ghost" onClick={onToggle} className="gap-2">
        {isExpanded ? (
          <>
            <ChevronUp className="h-4 w-4" />
            {collapseText}
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            {expandText}
          </>
        )}
      </Button>
    </div>
  );
};
