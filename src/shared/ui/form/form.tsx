import React from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

import { cn } from '~/shared/lib/utils';

type FormProps<T extends FieldValues> = {
  schema?: z.ZodSchema<T>;
  defaultValues?: T;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  children: ((methods: UseFormReturn<T>) => React.ReactNode) | React.ReactNode;
  onSubmit?: (data: T) => void | Promise<void>;
  form?: UseFormReturn<T>;
} & React.FormHTMLAttributes<HTMLFormElement>;

type FormLayoutProps = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  containerClassName?: string;
};

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

// Form Item Components
export const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return <div ref={ref} className={cn('space-y-2', className)} {...props} id={id} />;
  },
);
FormItem.displayName = 'FormItem';

export const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & {
    required?: boolean;
  }
>(({ className, required, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('block text-sm font-medium text-foreground', className)}
    {...props}
  >
    {children}
    {required && <span className="ml-1 text-destructive">*</span>}
  </label>
));
FormLabel.displayName = 'FormLabel';

export const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('relative', className)} {...props} />
  ),
);
FormControl.displayName = 'FormControl';

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
FormDescription.displayName = 'FormDescription';

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm font-medium text-destructive', className)} {...props}>
    {children}
  </p>
));
FormMessage.displayName = 'FormMessage';

export type { FormLayoutProps, FormProps };
