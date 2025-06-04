// src/shared/ui/view-switcher/view-switcher.tsx
import { LayoutGrid, Table } from 'lucide-react';

import { Button } from '~/shared/shadcn';

export type ViewMode = 'table' | 'cards';

interface ViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

/**
 * ViewSwitcher Component
 * Ermöglicht das Umschalten zwischen verschiedenen Ansichtsmodi (Tabelle/Karten)
 *
 * @param currentView - Der aktuell aktive View-Modus
 * @param onViewChange - Callback-Funktion beim Wechsel des View-Modus
 */
export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex items-center gap-1 rounded-md border bg-background p-1">
      <Button
        variant={currentView === 'table' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        className="gap-2"
      >
        <Table className="h-4 w-4" />
        <span className="hidden sm:inline">Tabelle</span>
      </Button>
      <Button
        variant={currentView === 'cards' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('cards')}
        className="gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Karten</span>
      </Button>
    </div>
  );
}
