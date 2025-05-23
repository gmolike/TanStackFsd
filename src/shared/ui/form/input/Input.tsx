import { forwardRef, memo } from 'react';
import type { ComponentRef } from 'react';
import type { FieldValues } from 'react-hook-form';

import { cn } from '~/shared/lib/utils';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/shared/shadcn/form';
import { InputShadcn } from '~/shared/shadcn/input';

import type { Props } from './model/types';
import { useController } from './model/useController';

/**
 * InputWithIcons - Input component with optional start and end icons
 *
 * @param startIcon - Icon to display at the start of the input
 * @param endIcon - Icon to display at the end of the input
 * @param className - Additional CSS classes for the input
 * @param wrapperClassName - Additional CSS classes for the wrapper div
 */
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
 * Input Component - Form input field with validation and accessibility features
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form (must be a valid path in TFieldValues)
 * @param label - Label text to display above the input
 * @param description - Helper text to display below the input
 * @param required - Whether the field is required (auto-detected from schema if not provided)
 * @param placeholder - Placeholder text for the input
 * @param className - Additional CSS classes for the form item container
 * @param startIcon - Icon component to display at the start of the input
 * @param endIcon - Icon component to display at the end of the input
 * @param disabled - Whether the input is disabled
 * @param type - HTML input type (auto-detected from schema if not provided)
 * @param ...inputProps - Additional props passed to the underlying input element
 *
 * @example
 * ```tsx
 * const form = useForm<FormData>();
 *
 * <Input
 *   control={form.control}
 *   name="email"
 *   label="Email Address"
 *   placeholder="Enter your email"
 *   startIcon={<Mail className="h-4 w-4" />}
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
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel required={isRequired}>{label}</FormLabel>}
          <FormControl>
            <InputWithIcons
              {...field}
              {...inputProps}
              type={inputType}
              placeholder={placeholder}
              disabled={isDisabled}
              startIcon={startIcon}
              endIcon={endIcon}
              {...ariaProps}
              aria-describedby={
                description || fieldState.error ? `${name}-description ${name}-error` : undefined
              }
            />
          </FormControl>
          {description && (
            <FormDescription id={`${name}-description`}>{description}</FormDescription>
          )}
          <FormMessage id={`${name}-error`} />
        </FormItem>
      )}
    />
  );
};

export const Input = memo(Component) as typeof Component;
