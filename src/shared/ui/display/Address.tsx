import { cn } from '~/shared/lib/utils';

import { TextDisplay } from '.';

type Props = {
  address?: {
    street?: string;
    postalCode?: string;
    city?: string;
    country?: string;
  } | null;
  format?: 'inline' | 'multiline';
  hideEmpty?: boolean;
  className?: string;
};

/**
 * AddressDisplay
 * @description Komponente zur Anzeige von Adressen
 * @param address - Adress-Objekt
 * @param format - inline oder multiline Darstellung
 * @param hideEmpty - Leere Felder ausblenden
 */
export const Address = ({ address, format = 'inline', hideEmpty = true, className }: Props) => {
  if (!address) {
    return <TextDisplay text={null} className={className} />;
  }

  const parts = [
    address.street,
    [address.postalCode, address.city].join(' '),
    address.country,
  ].filter((part) => !hideEmpty || part);

  if (parts.length === 0) {
    return <TextDisplay text={null} className={className} />;
  }

  if (format === 'inline') {
    return <span className={cn('truncate', className)}>{parts.join(', ')}</span>;
  }

  return (
    <div className={cn('space-y-1', className)}>
      {parts.map((part, index) => (
        <div key={index}>{part}</div>
      ))}
    </div>
  );
};
