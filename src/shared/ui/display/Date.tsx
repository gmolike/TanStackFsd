import { Calendar } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

import { TextDisplay } from '.';

type Props = {
  date?: Date | string | number | null;
  format?: 'short' | 'medium' | 'long' | 'relative';
  withIcon?: boolean;
  placeholder?: string;
  className?: string;
  locale?: string;
};

/**
 * DateDisplay
 * @description Komponente zur Anzeige von Datumswerten
 * @param date - Das Datum (Date, string oder number)
 * @param format - Anzeigeformat (short, medium, long, relative)
 * @param withIcon - Calendar-Icon anzeigen
 * @param locale - Locale für Formatierung (Standard: 'de-DE')
 */
export const DateDisplay = ({
  date,
  format = 'short',
  withIcon = false,
  placeholder = '-',
  className,
  locale = 'de-DE',
}: Props) => {
  if (!date) {
    return <TextDisplay text={null} placeholder={placeholder} className={className} />;
  }

  let dateObj: Date;
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string' || typeof date === 'number') {
    dateObj = new Date(date);
  } else {
    return <span className="text-muted-foreground">-</span>;
  }

  if (isNaN(dateObj.getTime())) {
    return <TextDisplay text={null} placeholder={placeholder} className={className} />;
  }

  const formatOptions: Record<typeof format, Intl.DateTimeFormatOptions> = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
    relative: {},
  };

  const formattedDate =
    format === 'relative'
      ? dateObj.toLocaleDateString(locale)
      : dateObj.toLocaleDateString(locale, formatOptions[format]);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {withIcon && <Calendar className="size-4 shrink-0 text-muted-foreground" />}
      <span>{formattedDate}</span>
    </div>
  );
};
