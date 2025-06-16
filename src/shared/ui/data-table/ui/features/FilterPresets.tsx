import { Filter } from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/shared/shadcn';

export interface FilterPreset {
  label: string;
  filters: Record<string, unknown>;
  description?: string;
}

interface FilterPresetsProps {
  presets: Array<FilterPreset>;
  onSelect: (preset: FilterPreset) => void;
  currentPreset?: string;
}

export const FilterPresets = ({ presets, onSelect, currentPreset }: FilterPresetsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        {currentPreset ?? 'Filter'}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-[200px]">
      <DropdownMenuLabel>Schnellfilter</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {presets.map((preset) => (
        <DropdownMenuItem
          key={preset.label}
          onClick={() => onSelect(preset)}
          className="flex flex-col items-start"
        >
          <span className="font-medium">{preset.label}</span>
          {preset.description && (
            <span className="text-xs text-muted-foreground">{preset.description}</span>
          )}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
