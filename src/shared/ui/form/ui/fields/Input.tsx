import { forwardRef, memo } from 'react';
import type { ComponentRef } from 'react';
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from 'react-hook-form';

import { cn } from '~/shared/lib/utils';
import { InputShadcn } from '~/shared/shadcn/input';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../Form';
import { useInputController } from '../../model/controllers';
import type { InputProps } from '../../model/types/fieldTypes';

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
        <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
          {startIcon}
        </div>
      )}
      <InputShadcn
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

const InputComponent = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  placeholder,
  className,
  startIcon,
  endIcon,
  disabled,
  ...inputProps
}: InputProps<TFieldValues>) => {
  const { isDisabled, ariaProps } = useInputController({
    name,
    disabled,
    required,
    startIcon,
    endIcon,
  });
  return (
    <FormField
      name={name}
      render={({
        field,
        fieldState,
      }: {
        field: ControllerRenderProps<TFieldValues>;
        fieldState: ControllerFieldState;
      }) => (
        <FormItem className={className}>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <FormControl>
            <InputWithIcons
              {...field}
              {...inputProps}
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

export const Input = memo(InputComponent);
