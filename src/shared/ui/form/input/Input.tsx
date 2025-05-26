import { forwardRef, memo } from 'react';
import type { ComponentRef } from 'react';
import type { FieldValues } from 'react-hook-form';

import { cn } from '~/shared/lib/utils';
import { InputShadcn } from '~/shared/shadcn';

import { FormFieldWrapper } from '../fieldWrapper';

import type { Props } from './model/types';
import { useController } from './model/useController';

const InputWithIcons = forwardRef<
  ComponentRef<typeof InputShadcn>,
  React.ComponentPropsWithoutRef<typeof InputShadcn> & {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    wrapperClassName?: string;
  }
>(({ startIcon, endIcon, className, wrapperClassName, ...props }, ref) => {
  if (!startIcon && !endIcon) {
    return <InputShadcn ref={ref} className={className} {...props} />;
  }

  return (
    <div className={cn('relative', wrapperClassName)}>
      {startIcon && (
        <div className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
          {startIcon}
        </div>
      )}
      <InputShadcn
        ref={ref}
        className={cn(startIcon && 'pl-10', endIcon && 'pr-10', className)}
        {...props}
      />
      {endIcon && (
        <div className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
          {endIcon}
        </div>
      )}
    </div>
  );
});
InputWithIcons.displayName = 'InputWithIcons';

/**
 * Input Component - Form input field with reset functionality
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form (must be a valid path in TFieldValues)
 * @param label - Label text to display above the input
 * @param description - Helper text to display below the input
 * @param required - Whether the field is required
 * @param placeholder - Placeholder text for the input
 * @param className - Additional CSS classes for the form item container
 * @param startIcon - Icon component to display at the start of the input
 * @param endIcon - Icon component to display at the end of the input
 * @param disabled - Whether the input is disabled
 * @param type - HTML input type
 * @param showReset - Whether to show reset to default button
 * @param ...inputProps - Additional props passed to the underlying input element
 *
 * @example
 * ```tsx
 * <FormInput
 *   control={form.control}
 *   name="email"
 *   label="Email Address"
 *   placeholder="Enter your email"
 *   startIcon={<Mail className="h-4 w-4" />}
 *   showReset={true}
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  required,
  placeholder,
  className,
  startIcon,
  endIcon,
  disabled,
  type,
  showReset = true,
  ...inputProps
}: Props<TFieldValues>) => {
  const { isDisabled, ariaProps, isRequired, inputType } = useController({
    control,
    name,
    disabled,
    required,
    type,
  });

  return (
    <FormFieldWrapper
      control={control}
      name={name}
      label={label}
      description={description}
      required={isRequired}
      className={className}
      showReset={showReset}
      render={(field) => (
        <InputWithIcons
          {...field}
          {...inputProps}
          value={field.value ?? ''}
          type={inputType}
          placeholder={placeholder}
          disabled={isDisabled}
          startIcon={startIcon}
          endIcon={endIcon}
          {...ariaProps}
          className={cn(showReset && 'pr-10')}
        />
      )}
    />
  );
};

export const Input = memo(Component) as typeof Component;
