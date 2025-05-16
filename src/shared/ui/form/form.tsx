import { forwardRef } from 'react';
import type { FormHTMLAttributes, ReactNode } from 'react';
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

import { cn } from '~/shared/lib/utils';
// Import ShadCN form components
import {
  Form as ShadcnForm,
  FormControl as ShadcnFormControl,
  FormDescription as ShadcnFormDescription,
  FormField as ShadcnFormField,
  FormItem as ShadcnFormItem,
  FormLabel as ShadcnFormLabel,
  FormMessage as ShadcnFormMessage,
} from '~/shared/shadcn/form'; // These need to be installed from ShadCN

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

type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  control: any; // TODO: Fix type from react-hook-form
  name: TName;
  render: (props: any) => ReactNode;
};

type FormItemProps = React.HTMLAttributes<HTMLDivElement>;

type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

type FormControlProps = React.HTMLAttributes<HTMLDivElement>;

type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

type FormMessageProps = React.HTMLAttributes<HTMLParagraphElement>;

/**
 * Form - Main form component with React Hook Form and ShadCN integration
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
        <ShadcnForm {...methods}>
          <form onSubmit={handleSubmit} className={cn('space-y-4', className)} {...props}>
            {typeof children === 'function' ? children(methods) : children}
          </form>
        </ShadcnForm>
        {footer}
      </div>
    </FormProvider>
  );
};

/**
 * FormField - ShadCN FormField wrapper for consistent API
 */
export const FormField = <TFieldValues extends FieldValues>({
  ...props
}: FormFieldProps<TFieldValues>) => <ShadcnFormField {...props} />;

/**
 * FormItem - ShadCN FormItem wrapper
 */
export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => <ShadcnFormItem ref={ref} className={className} {...props} />,
);
FormItem.displayName = 'FormItem';

/**
 * FormLabel - Enhanced ShadCN FormLabel with required indicator
 *
 * @param props.required - Shows asterisk (*) for required fields
 */
export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <ShadcnFormLabel ref={ref} className={className} {...props}>
      {children}
      {required && <span className="ml-1 text-destructive">*</span>}
    </ShadcnFormLabel>
  ),
);
FormLabel.displayName = 'FormLabel';

/**
 * FormControl - ShadCN FormControl wrapper
 */
export const FormControl = forwardRef<HTMLDivElement, FormControlProps>(({ ...props }, ref) => (
  <ShadcnFormControl ref={ref} {...props} />
));
FormControl.displayName = 'FormControl';

/**
 * FormDescription - ShadCN FormDescription wrapper
 */
export const FormDescription = forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ ...props }, ref) => <ShadcnFormDescription ref={ref} {...props} />,
);
FormDescription.displayName = 'FormDescription';

/**
 * FormMessage - ShadCN FormMessage wrapper
 */
export const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ ...props }, ref) => <ShadcnFormMessage ref={ref} {...props} />,
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
