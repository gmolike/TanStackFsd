import { cn } from '~/shared/lib/utils';

type Props = {
  text?: string | number | null;
  placeholder?: string;
  className?: string;
  truncate?: boolean;
};

/**
 * TextDisplay
 * @description Komponente zur Anzeige von Text mit Fallback
 * @param text - Der anzuzeigende Text
 * @param placeholder - Platzhalter bei leerem Text (Standard: "-")
 * @param truncate - Text bei Überlänge abschneiden
 */
export const Text = ({ text, placeholder = '-', className, truncate = true }: Props) => {
  const hasValue = text !== null && text !== undefined && text !== '';

  return (
    <span className={cn(truncate && 'truncate', !hasValue && 'text-muted-foreground', className)}>
      {hasValue ? String(text) : placeholder}
    </span>
  );
};
