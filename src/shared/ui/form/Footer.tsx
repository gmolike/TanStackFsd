import React from 'react';
import { useFormContext } from 'react-hook-form';

import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2, RotateCcw } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

export interface FormFooterAction {
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'link';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface FormFooterProps {
  submitText?: string;
  cancelText?: string;
  resetText?: string;
  showCancel?: boolean;
  showReset?: boolean;
  onCancel?: () => void;
  onReset?: () => void;
  actions?: Array<FormFooterAction>;
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
}

/**
 * Ein flexibler Footer für Formulare mit automatischer Form-State Integration und verschiedenen Layout-Optionen.
 *
 * @param submitText - Text für den Submit-Button (Standard: "Speichern")
 * @param cancelText - Text für den Cancel-Button (Standard: "Abbrechen")
 * @param resetText - Text für den Reset-Button (Standard: "Zurücksetzen")
 * @param showCancel - Zeigt Cancel-Button an (Standard: true)
 * @param showReset - Zeigt Reset-Button an (Standard: false)
 * @param onCancel - Click-Handler für Cancel-Button
 * @param onReset - Click-Handler für Reset-Button
 * @param actions - Array von zusätzlichen Action-Buttons
 * @param links - Array von Footer-Links (Hilfe, AGB, etc.)
 * @param errors - Array von Fehlermeldungen zur Anzeige
 * @param successMessage - Erfolgsmeldung nach Submit
 * @param className - Zusätzliche CSS-Klassen für den Footer
 * @param variant - Layout-Variante (default, compact, split, centered)
 * @param sticky - Fixiert Footer am unteren Bildschirmrand
 */
export const FormFooter: React.FC<FormFooterProps> = ({
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
}) => {
  const form = useFormContext();
  const { formState } = form;
  const { isSubmitting, isDirty, isSubmitted, isValid } = formState;

  // Default actions
  const defaultActions: Array<FormFooterAction> = [
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

  const renderButton = (action: FormFooterAction, index: number) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      {
        // Variants
        'bg-primary text-primary-foreground hover:bg-primary/90': action.variant === 'primary',
        'bg-secondary text-secondary-foreground hover:bg-secondary/80':
          action.variant === 'secondary',
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground':
          action.variant === 'outline',
        'bg-destructive text-destructive-foreground hover:bg-destructive/90':
          action.variant === 'destructive',
        'text-primary underline-offset-4 hover:underline': action.variant === 'link',
        'bg-background hover:bg-accent hover:text-accent-foreground': action.variant === 'default',
      },
      // Sizes
      action.variant === 'link' ? 'p-2' : 'h-10 px-4 py-2',
      action.className,
    );

    return (
      <button
        key={index}
        type={action.type || 'button'}
        onClick={action.onClick}
        disabled={action.disabled}
        className={baseClasses}
      >
        {action.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : action.icon}
        {action.label}
      </button>
    );
  };

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

  const getLayoutClasses = () => {
    switch (variant) {
      case 'compact':
        return 'flex items-center justify-end gap-2';
      case 'split':
        return 'flex items-center justify-between';
      case 'centered':
        return 'flex flex-col items-center gap-4';
      default:
        return 'space-y-4';
    }
  };

  const footerClasses = cn(
    'pt-6 border-t',
    sticky &&
      'sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
    className,
  );

  return (
    <div className={footerClasses}>
      <div className={getLayoutClasses()}>
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
};

// Pre-styled variants

/**
 * Kompakte Footer-Variante mit minimaler Darstellung.
 */
export const FormFooterCompact: React.FC<Omit<FormFooterProps, 'variant'>> = (props) => (
  <FormFooter {...props} variant="compact" />
);

/**
 * Split-Footer mit Messages links und Buttons rechts.
 */
export const FormFooterSplit: React.FC<Omit<FormFooterProps, 'variant'>> = (props) => (
  <FormFooter {...props} variant="split" />
);

/**
 * Zentrierte Footer-Variante für Onboarding und Login-Formulare.
 */
export const FormFooterCentered: React.FC<Omit<FormFooterProps, 'variant'>> = (props) => (
  <FormFooter {...props} variant="centered" />
);

// Specialized footers
export interface FormFooterStepsProps extends Omit<FormFooterProps, 'actions' | 'submitText'> {
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  nextText?: string;
  previousText?: string;
  finishText?: string;
  skipText?: string;
  allowSkip?: boolean;
}

/**
 * Spezieller Footer für mehrstufige Formulare mit automatischer Navigation.
 *
 * @param currentStep - Aktueller Schritt (1-basiert)
 * @param totalSteps - Gesamtanzahl der Schritte
 * @param onNext - Handler für den "Weiter"-Button
 * @param onPrevious - Handler für den "Zurück"-Button
 * @param onSkip - Handler für den "Überspringen"-Button
 * @param nextText - Text für "Weiter"-Button (Standard: "Weiter")
 * @param previousText - Text für "Zurück"-Button (Standard: "Zurück")
 * @param finishText - Text für finalen Submit-Button (Standard: "Abschließen")
 * @param skipText - Text für "Überspringen"-Button (Standard: "Überspringen")
 * @param allowSkip - Erlaubt das Überspringen von Schritten (Standard: false)
 */
export const FormFooterSteps: React.FC<FormFooterStepsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  nextText = 'Weiter',
  previousText = 'Zurück',
  finishText = 'Abschließen',
  skipText = 'Überspringen',
  allowSkip = false,
  ...props
}) => {
  const isFirst = currentStep === 1;
  const isLast = currentStep === totalSteps;

  const actions: Array<FormFooterAction> = [
    ...(allowSkip && !isLast
      ? [
          {
            label: skipText,
            variant: 'link' as const,
            onClick: onSkip,
          },
        ]
      : []),
    ...(isFirst
      ? []
      : [
          {
            label: previousText,
            variant: 'outline' as const,
            onClick: onPrevious,
            icon: <ArrowLeft className="h-4 w-4" />,
          },
        ]),
    {
      label: isLast ? finishText : nextText,
      variant: 'primary',
      onClick: isLast ? undefined : onNext,
      type: isLast ? 'submit' : 'button',
      icon: isLast ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />,
    },
  ];

  return <FormFooter {...props} actions={actions} showCancel={false} showReset={false} />;
};
