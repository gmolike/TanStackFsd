import { forwardRef, useId } from 'react';
import type { FormHTMLAttributes, ReactNode } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

import { cn } from '~/shared/lib/utils';

// Types
type FormProps<T extends FieldValues> = {
  schema?: z.ZodSchema<T>;
  defaultValues?: T;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  children: ((methods: UseFormReturn<T>) => ReactNode) | ReactNode;
  onSubmit?: (data: T) => void | Promise<void>;
  form?: UseFormReturn<T>;
} & FormHTMLAttributes<HTMLFormElement>;

type FormLayoutProps = {
  header?: ReactNode;
  footer?: ReactNode;
  containerClassName?: string;
};

type FormItemProps = React.HTMLAttributes<HTMLDivElement>;

type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

type FormControlProps = React.HTMLAttributes<HTMLDivElement>;

type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

type FormMessageProps = React.HTMLAttributes<HTMLParagraphElement>;

/**
 * Form - Main form component with React Hook Form integration
 *
 * @param props.schema - Zod schema for validation
 * @param props.defaultValues - Default form values
 * @param props.mode - Validation mode (default: "onSubmit")
 * @param props.children - Form content or render function
 * @param props.onSubmit - Submit handler
 * @param props.form - External form instance
 * @param props.header - Header content
 * @param props.footer - Footer content
 * @param props.containerClassName - Container CSS classes
 * @param props.className - Form CSS classes
 */
export const Form = <T extends FieldValues>({
  schema,
  defaultValues,
  mode = 'onSubmit',
  children,
  onSubmit,
  form,
  className,
  header,
  footer,
  containerClassName,
  ...props
}: FormProps<T> & FormLayoutProps) => {
  const methods =
    form ||
    useForm<T>({
      resolver: schema ? zodResolver(schema) : undefined,
      defaultValues,
      mode,
    });

  const handleSubmit = methods.handleSubmit(async (data) => {
    await onSubmit?.(data);
  });

  return (
    <FormProvider {...methods}>
      <div className={cn('space-y-6', containerClassName)}>
        {header}
        <form onSubmit={handleSubmit} className={cn('space-y-4', className)} {...props}>
          {typeof children === 'function' ? children(methods) : children}
        </form>
        {footer}
      </div>
    </FormProvider>
  );
};

/**
 * FormItem - Container for form field components
 */
export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => {
    const id = useId();
    return <div ref={ref} className={cn('space-y-2', className)} {...props} id={id} />;
  },
);
FormItem.displayName = 'FormItem';

/**
 * FormLabel - Label component with required indicator
 *
 * @param props.required - Shows asterisk (*) for required fields
 */
export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('block text-sm font-medium text-foreground', className)}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-destructive">*</span>}
    </label>
  ),
);
FormLabel.displayName = 'FormLabel';

/**
 * FormControl - Control wrapper component
 */
export const FormControl = forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('relative', className)} {...props} />
  ),
);
FormControl.displayName = 'FormControl';

/**
 * FormDescription - Help text component
 */
export const FormDescription = forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  ),
);
FormDescription.displayName = 'FormDescription';

/**
 * FormMessage - Error message component
 */
export const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm font-medium text-destructive', className)} {...props}>
      {children}
    </p>
  ),
);
FormMessage.displayName = 'FormMessage';

// Exports
export type { FormLayoutProps, FormProps };
export type {
  FormControlProps,
  FormDescriptionProps,
  FormItemProps,
  FormLabelProps,
  FormMessageProps,
};
