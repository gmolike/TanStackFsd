import { memo } from 'react';
import type { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2, RotateCcw } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

// Types
type FooterAction = {
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'link';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

type FooterProps = {
  submitText?: string;
  cancelText?: string;
  resetText?: string;
  showCancel?: boolean;
  showReset?: boolean;
  onCancel?: () => void;
  onReset?: () => void;
  actions?: Array<FooterAction>;
  links?: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
  errors?: Array<string>;
  successMessage?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'split' | 'centered';
  sticky?: boolean;
};

// Constants
const BUTTON_VARIANT_CLASSES = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  link: 'text-primary underline-offset-4 hover:underline',
  default: 'bg-background hover:bg-accent hover:text-accent-foreground',
} as const;

const LAYOUT_VARIANT_CLASSES = {
  default: 'space-y-4',
  compact: 'flex items-center justify-end gap-2',
  split: 'flex items-center justify-between',
  centered: 'flex flex-col items-center gap-4',
} as const;

// Utility Functions
const getButtonClasses = (action: FooterAction) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    BUTTON_VARIANT_CLASSES[action.variant || 'default'],
    action.variant === 'link' ? 'p-2' : 'h-10 px-4 py-2',
    action.className,
  );
  return baseClasses;
};

const getLayoutClasses = (variant: FooterProps['variant']) =>
  LAYOUT_VARIANT_CLASSES[variant || 'default'];

/**
 * Footer - Flexible footer for forms with automatic form state integration
 *
 * @param props.submitText - Text for submit button (default: "Speichern")
 * @param props.cancelText - Text for cancel button (default: "Abbrechen")
 * @param props.resetText - Text for reset button (default: "Zurücksetzen")
 * @param props.showCancel - Show cancel button (default: true)
 * @param props.showReset - Show reset button (default: false)
 * @param props.onCancel - Click handler for cancel button
 * @param props.onReset - Click handler for reset button
 * @param props.actions - Array of additional action buttons
 * @param props.links - Array of footer links (help, terms, etc.)
 * @param props.errors - Array of error messages to display
 * @param props.successMessage - Success message after submit
 * @param props.className - Additional CSS classes for footer
 * @param props.variant - Layout variant (default, compact, split, centered)
 * @param props.sticky - Fix footer to bottom of screen
 */
function FooterComponent({
  submitText = 'Speichern',
  cancelText = 'Abbrechen',
  resetText = 'Zurücksetzen',
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
}: FooterProps) {
  const form = useFormContext();
  const { formState } = form;
  const { isSubmitting, isDirty, isSubmitted, isValid } = formState;

  // Default actions
  const defaultActions: Array<FooterAction> = [
    ...(showReset
      ? [
          {
            label: resetText,
            variant: 'outline' as const,
            onClick: () => {
              form.reset();
              onReset?.();
            },
            disabled: !isDirty || isSubmitting,
            icon: <RotateCcw className="h-4 w-4" />,
            type: 'button' as const,
          },
        ]
      : []),
    ...(showCancel
      ? [
          {
            label: cancelText,
            variant: 'outline' as const,
            onClick: onCancel,
            disabled: isSubmitting,
            icon: <ArrowLeft className="h-4 w-4" />,
            type: 'button' as const,
          },
        ]
      : []),
    {
      label: isSubmitting
        ? 'Wird gespeichert...'
        : isSubmitted && isValid
          ? 'Gespeichert'
          : submitText,
      variant: 'primary' as const,
      type: 'submit' as const,
      disabled: isSubmitting,
      loading: isSubmitting,
      icon: isSubmitting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSubmitted && isValid ? (
        <Check className="h-4 w-4" />
      ) : (
        <ArrowRight className="h-4 w-4" />
      ),
    },
  ];

  const allActions = [...actions, ...defaultActions];

  const renderButton = (action: FooterAction, index: number) => (
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
  );

  const renderLinks = () => {
    if (links.length === 0) return null;

    return (
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
    );
  };

  const renderMessages = () => {
    if (errors.length === 0 && !successMessage) return null;

    return (
      <div className="space-y-2">
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
    );
  };

  const footerClasses = cn(
    'pt-6 border-t',
    sticky &&
      'sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
    className,
  );

  return (
    <div className={footerClasses}>
      <div className={getLayoutClasses(variant)}>
        {/* Messages first in most variants */}
        {variant !== 'split' && renderMessages()}

        {/* Actions */}
        <div
          className={cn(
            'flex gap-2',
            variant === 'centered' ? 'flex-col-reverse' : 'flex-row-reverse',
            variant === 'compact' && 'flex-row',
          )}
        >
          {allActions.map(renderButton)}
        </div>

        {/* Split variant - messages on left */}
        {variant === 'split' && <div className="flex-1">{renderMessages()}</div>}

        {/* Links */}
        {variant !== 'compact' && renderLinks()}
      </div>

      {/* Links for compact variant */}
      {variant === 'compact' && links.length > 0 && (
        <div className="mt-4 flex justify-center">{renderLinks()}</div>
      )}
    </div>
  );
}

export const Footer = memo(FooterComponent);
export type { FooterAction, FooterProps };
