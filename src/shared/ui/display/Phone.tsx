import { Phone as PhoneIcon } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

import { TextDisplay } from '.';

type Props = {
  phone?: string | null;
  withIcon?: boolean;
  asLink?: boolean;
  placeholder?: string;
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
};

/**
 * PhoneDisplay
 * @description Komponente zur Anzeige von Telefonnummern
 * @param phone - Die Telefonnummer
 * @param withIcon - Phone-Icon anzeigen (Standard: true)
 * @param asLink - Als klickbarer tel-Link (Standard: true)
 */
export const Phone = ({
  phone,
  withIcon = true,
  asLink = true,
  placeholder = '-',
  className,
  iconSize = 'md',
}: Props) => {
  if (!phone) {
    return <TextDisplay text={null} placeholder={placeholder} className={className} />;
  }

  const iconSizes = {
    sm: 'size-3',
    md: 'size-4',
    lg: 'size-5',
  };

  const displayPhone = phone;

  const content = (
    <>
      {withIcon && (
        <PhoneIcon className={cn(iconSizes[iconSize], 'shrink-0 text-muted-foreground')} />
      )}
      <span>{displayPhone}</span>
    </>
  );
  if (asLink) {
    return (
      <a href={`tel:${phone}`} className={cn('flex items-center gap-2 hover:underline', className)}>
        {content}
      </a>
    );
  }

  return <div className={cn('flex items-center gap-2', className)}>{content}</div>;
};
