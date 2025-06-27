import { Mail } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

import { TextDisplay } from '.';

type Props = {
  email?: string | null;
  withIcon?: boolean;
  asLink?: boolean;
  placeholder?: string;
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
};

/**
 * EmailDisplay
 * @description Komponente zur Anzeige von E-Mail-Adressen
 * @param email - Die E-Mail-Adresse
 * @param withIcon - Mail-Icon anzeigen (Standard: true)
 * @param asLink - Als klickbarer mailto-Link (Standard: true)
 */
export const Email = ({
  email,
  withIcon = true,
  asLink = true,
  placeholder = '-',
  className,
  iconSize = 'md',
}: Props) => {
  if (!email) {
    return <TextDisplay text={null} placeholder={placeholder} className={className} />;
  }

  const iconSizes = {
    sm: 'size-3',
    md: 'size-4',
    lg: 'h-5 w-5',
  };

  const content = (
    <>
      {withIcon && <Mail className={cn(iconSizes[iconSize], 'shrink-0 text-muted-foreground')} />}
      <span className="truncate">{email}</span>
    </>
  );

  if (asLink) {
    return (
      <a
        href={`mailto:${email}`}
        className={cn('flex items-center gap-2 hover:underline', className)}
      >
        {content}
      </a>
    );
  }

  return <div className={cn('flex items-center gap-2', className)}>{content}</div>;
};
