import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import { AlertCircle, Check, Loader2 } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

import { footerStyles } from './model/styles';
import type { FooterButton, Props } from './model/types';
import { useController } from './model/useController';

/**
 * Footer Component - Form footer with action buttons and messages
 *
 * @template TFieldValues - Type of the form values
 *
 * @param form - React Hook Form instance (optional, will use context if not provided)
 * @param submit - Submit button configuration (button shown if object is provided)
 * @param cancel - Cancel button configuration (button shown if object is provided)
 * @param reset - Reset button configuration (button shown if object is provided)
 * @param customActions - Array of custom action buttons
 * @param links - Array of footer links (e.g., Help, Privacy)
 * @param errors - Array of error messages to display
 * @param successMessage - Success message to display
 * @param className - Additional CSS classes for the footer container
 * @param variant - Layout variant for the footer
 * @param sticky - Whether the footer should stick to the bottom
 *
 * @example
 * ```tsx
 * const form = useForm<FormData>();
 *
 * <FormFooter
 *   form={form}
 *   submit={{ label: "Speichern" }}
 *   cancel={{ onClick: handleCancel }}
 *   reset={{}}
 *   variant="default"
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  form,
  submit,
  cancel,
  reset,
  customActions = [],
  links = [],
  errors = [],
  successMessage,
  className,
  variant = 'default',
  sticky = false,
}: Props<TFieldValues>) => {
  const { allButtons } = useController({
    form,
    submit,
    cancel,
    reset,
    customActions,
  });

  const getButtonClasses = (button: FooterButton) =>
    cn(
      footerStyles.button.base,
      footerStyles.button.variant[button.variant || 'default'],
      button.variant === 'link' ? footerStyles.button.size.link : footerStyles.button.size.default,
      button.className,
    );

  const containerClasses = cn(
    footerStyles.container.base,
    sticky && footerStyles.container.sticky,
    className,
  );

  const layoutClasses = footerStyles.layout[variant];

  const actionsContainerClasses = cn(
    footerStyles.buttonContainer.base,
    variant === 'centered'
      ? footerStyles.buttonContainer.centered
      : variant === 'compact'
        ? footerStyles.buttonContainer.compact
        : footerStyles.buttonContainer.default,
  );

  const renderMessages = () => (
    <>
      {errors.length > 0 && (
        <div className={footerStyles.message.error.container}>
          <div className={footerStyles.message.error.wrapper}>
            <AlertCircle className={footerStyles.message.error.icon} />
            <div className="text-sm">
              {errors.length === 1 ? (
                <p className={footerStyles.message.error.text}>{errors[0]}</p>
              ) : (
                <ul className={footerStyles.message.error.list}>
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
        <div className={footerStyles.message.success.container}>
          <div className={footerStyles.message.success.wrapper}>
            <Check className={footerStyles.message.success.icon} />
            <p className={footerStyles.message.success.text}>{successMessage}</p>
          </div>
        </div>
      )}
    </>
  );

  const renderLinks = () => {
    if (links.length === 0) return null;

    return (
      <div className={footerStyles.links.container}>
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className={footerStyles.links.link}
            {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
          >
            {link.label}
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      <div className={layoutClasses}>
        {variant !== 'split' && renderMessages()}

        <div className={actionsContainerClasses}>
          {allButtons.map((button: FooterButton, index: number) => (
            <button
              key={index}
              type={button.type || 'button'}
              onClick={button.onClick}
              disabled={button.disabled}
              className={getButtonClasses(button)}
            >
              {button.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : button.icon}
              {button.label}
            </button>
          ))}
        </div>

        {variant === 'split' && <div className="flex-1">{renderMessages()}</div>}

        {variant !== 'compact' && renderLinks()}
      </div>

      {variant === 'compact' && links.length > 0 && (
        <div className={footerStyles.links.containerCompact}>
          <div className={footerStyles.links.container}>
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={footerStyles.links.link}
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

export const Footer = memo(Component) as typeof Component;
