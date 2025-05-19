// src/shared/ui/form/footer/ui.tsx
import { memo } from 'react';

import { AlertCircle, Check, Loader2 } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

import type { Action, Props } from './model/types';
import { useController } from './model/useController';

const FooterComponent = ({
  submitText,
  cancelText,
  resetText,
  showCancel = true,
  showReset = false,
  onCancel,
  onReset,
  actions = [],
  links = [],
  errors = [],
  successMessage,
  className,
  variant = 'default',
  sticky = false,
}: Props) => {
  const { allActions } = useController({
    submitText,
    cancelText,
    resetText,
    showCancel,
    showReset,
    onCancel,
    onReset,
    actions,
  });

  // Styling-Konstanten
  const buttonVariantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    link: 'text-primary underline-offset-4 hover:underline',
    default: 'bg-background hover:bg-accent hover:text-accent-foreground',
  } as const;

  const layoutVariantClasses = {
    default: 'space-y-4',
    compact: 'flex items-center justify-end gap-2',
    split: 'flex items-center justify-between',
    centered: 'flex flex-col items-center gap-4',
  } as const;

  // Container-Klassen
  const containerClasses = cn(
    'pt-6 border-t',
    sticky &&
      'sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
    className,
  );

  // Layout-Klassen
  const layoutClasses = layoutVariantClasses[variant];

  // Button-Klassen-Generator
  const getButtonClasses = (action: Action) =>
    cn(
      'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      buttonVariantClasses[action.variant || 'default'],
      action.variant === 'link' ? 'p-2' : 'h-10 px-4 py-2',
      action.className,
    );

  // Aktionskontainer-Klassen basierend auf variant
  const actionsContainerClasses = cn(
    'flex gap-2',
    variant === 'centered' ? 'flex-col-reverse' : 'flex-row-reverse',
    variant === 'compact' && 'flex-row',
  );

  return (
    <div className={containerClasses}>
      <div className={layoutClasses}>
        {/* Fehlermeldungen und Erfolgsmeldungen */}
        {variant !== 'split' && (
          <>
            {errors.length > 0 && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                  <div className="text-sm">
                    {errors.length === 1 ? (
                      <p className="text-destructive">{errors[0]}</p>
                    ) : (
                      <ul className="list-inside list-disc space-y-1 text-destructive">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="rounded-md border border-green-500/50 bg-green-500/10 p-3">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-600">{successMessage}</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Aktions-Buttons */}
        <div className={actionsContainerClasses}>
          {allActions.map((action: Action, index: number) => (
            <button
              key={index}
              type={action.type || 'button'}
              onClick={action.onClick}
              disabled={action.disabled}
              className={getButtonClasses(action)}
            >
              {action.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : action.icon}
              {action.label}
            </button>
          ))}
        </div>

        {/* Split variant - Nachrichten links */}
        {variant === 'split' && (
          <div className="flex-1">
            {errors.length > 0 && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                  <div className="text-sm">
                    {errors.length === 1 ? (
                      <p className="text-destructive">{errors[0]}</p>
                    ) : (
                      <ul className="list-inside list-disc space-y-1 text-destructive">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="rounded-md border border-green-500/50 bg-green-500/10 p-3">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-600">{successMessage}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Links */}
        {variant !== 'compact' && links.length > 0 && (
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="underline underline-offset-4 transition-colors hover:text-foreground"
                {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Links für compact variant */}
      {variant === 'compact' && links.length > 0 && (
        <div className="mt-4 flex justify-center">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="underline underline-offset-4 transition-colors hover:text-foreground"
                {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const Component = memo(FooterComponent);
