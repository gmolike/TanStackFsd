import type { ReactNode } from 'react';

import { cn } from '~/shared/lib/utils';

import { TextMightyOverflow } from './TextMightyOverflow';

/**
 * Info Item Component
 * @description Eine wiederverwendbare Komponente zur strukturierten Anzeige von Informationen mit Icon, Label und Wert
 * @param icon - Icon-Element (z.B. Lucide Icon)
 * @param label - Beschreibungstext für den Wert
 * @param value - Der anzuzeigende Wert als ReactNode
 * @param id - Optionale eindeutige ID für React keys (falls label nicht eindeutig)
 * @param className - Optionale CSS-Klassen für das Container-Element
 * @param iconClassName - Optionale CSS-Klassen für das Icon
 * @param labelClassName - Optionale CSS-Klassen für das Label
 * @param valueClassName - Optionale CSS-Klassen für den Wert
 * @param withTextOverflow - Aktiviert Text-Overflow für zu lange Inhalte (default: true)
 * @example
 * ```tsx
 * <InfoItem
 *   icon={<Mail className="size-4" />}
 *   label="E-Mail"
 *   value={<a href={`mailto:${email}`} className="text-primary hover:underline">{email}</a>}
 *   withTextOverflow
 * />
 * ```
 */
export type InfoItemProps = {
  icon?: ReactNode;
  label: string;
  value: ReactNode | undefined;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  withTextOverflow?: boolean;
  highlightMissing?: boolean;
};

export const InfoItem = ({
  icon,
  label,
  value,
  className,
  iconClassName,
  labelClassName,
  valueClassName,
  highlightMissing,
  withTextOverflow = true,
}: InfoItemProps) => {
  const shouldHighlight = highlightMissing && !value;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('flex-shrink-0 text-muted-foreground', iconClassName)}>{icon}</div>
      <div className={cn('min-w-0', withTextOverflow && 'flex-1')}>
        <TextMightyOverflow
          className={cn(
            'text-sm text-muted-foreground',
            withTextOverflow && 'truncate',
            labelClassName,
          )}
        >
          {label}
        </TextMightyOverflow>
        <TextMightyOverflow
          className={cn(
            'font-bold',
            withTextOverflow && 'truncate',
            valueClassName,
            shouldHighlight ? 'rounded bg-bw-accent-red/65 px-2' : undefined,
          )}
        >
          {value || '–'}
        </TextMightyOverflow>
      </div>
    </div>
  );
};
