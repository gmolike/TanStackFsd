import { Check, X } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

import { TextDisplay } from '.';

type Props = {
  value?: boolean | null;
  variant?: 'icon' | 'text';
  trueLabel?: string;
  falseLabel?: string;
  withColor?: boolean;
  className?: string;
};

/**
 * BooleanDisplay
 * @description Komponente zur Anzeige von Boolean-Werten
 * @param value - Der Boolean-Wert
 * @param variant - Anzeigevariante (icon, text)
 * @param trueLabel - Label für true (Standard: "Ja")
 * @param falseLabel - Label für false (Standard: "Nein")
 * @param withColor - Farben verwenden (grün/rot)
 */
export const BooleanDisplay = ({
  value,
  variant = 'icon',
  trueLabel = 'Ja',
  falseLabel = 'Nein',
  withColor = true,
  className,
}: Props) => {
  if (value === null || value === undefined) {
    return <TextDisplay text={null} className={className} />;
  }

  const color = value ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500';

  const colorClasses = withColor ? color : '';

  if (variant === 'icon') {
    return (
      <div className={cn('flex items-center', colorClasses, className)}>
        {value ? <Check className="size-4" /> : <X className="size-4" />}
      </div>
    );
  }

  return <span className={cn(colorClasses, className)}>{value ? trueLabel : falseLabel}</span>;
};
