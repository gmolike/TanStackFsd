import { forwardRef, memo } from 'react';
import type { ComponentRef } from 'react';
import type { FieldValues } from 'react-hook-form';

import { cn } from '~/shared/lib/utils';
import { InputShadcn as ShadcnInput } from '~/shared/shadcn/input';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../Form';
import { useForm } from '../model/hook';

import type { BaseFieldProps } from './types';

// Types - only form-specific props, everything else goes through
export type InputProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
  } & Omit<React.ComponentPropsWithoutRef<typeof ShadcnInput>, 'name'>;

// Enhanced Input with wrapper for icons
const InputWithIcons = forwardRef<
  ComponentRef<typeof ShadcnInput>,
  React.ComponentPropsWithoutRef<typeof ShadcnInput> & {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    wrapperClassName?: string;
  }
>(({ startIcon, endIcon, className, wrapperClassName, ...props }, ref) => {
  if (!startIcon && !endIcon) {
    return <ShadcnInput ref={ref} className={className} {...props} />;
  }

  return (
    <div className={cn('relative', wrapperClassName)}>
      {startIcon && (
        <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
          {startIcon}
        </div>
      )}
      <ShadcnInput
        ref={ref}
        className={cn(startIcon && 'pl-10', endIcon && 'pr-10', className)}
        {...props}
      />
      {endIcon && (
        <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
          {endIcon}
        </div>
      )}
    </div>
  );
});
InputWithIcons.displayName = 'InputWithIcons';

/**
 * InputComponent - Enhanced ShadCN Input field with automatic validation and accessibility
 */
const InputComponent = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  className,
  startIcon,
  endIcon,
  disabled,
  ...inputProps // All other props go directly to the input
}: InputProps<TFieldValues>) => {
  const form = useForm<TFieldValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <FormControl>
            <InputWithIcons
              {...field}
              {...inputProps} // Pass all input-specific props
              disabled={disabled || form.formState.isSubmitting}
              startIcon={startIcon}
              endIcon={endIcon}
              aria-invalid={fieldState.invalid}
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

export const Input = memo(InputComponent);
