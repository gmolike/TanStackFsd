// src/shared/ui/form/form.tsx
import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { FieldValues, SubmitHandler, UseFormProps, UseFormReturn } from 'react-hook-form';
import { useForm as useRHFForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';

import { cn } from '~/shared/lib/utils';
// Enhanced FormLabel with required indicator
import { FormLabel as ShadcnFormLabel } from '~/shared/shadcn/form';

import { FormProvider } from './Context';

// Re-export ShadCN components directly
export {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '~/shared/shadcn/form';

const FormLabel = forwardRef<
  React.ElementRef<typeof ShadcnFormLabel>,
  React.ComponentPropsWithoutRef<typeof ShadcnFormLabel> & {
    required?: boolean;
  }
>(({ className, required, children, ...props }, ref) => (
  <ShadcnFormLabel ref={ref} className={className} {...props}>
    {children}
    {required && <span className="ml-1 text-destructive">*</span>}
  </ShadcnFormLabel>
));
FormLabel.displayName = 'FormLabel';

// Form Component Props
interface FormProps<TFormValues extends FieldValues = FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
  schema?: ZodType<TFormValues>;
  onSubmit: SubmitHandler<TFormValues>;
  children: ReactNode | ((form: UseFormReturn<TFormValues>) => ReactNode);
  mode?: UseFormProps<TFormValues>['mode'];
  defaultValues?: UseFormProps<TFormValues>['defaultValues'];
  formId?: string;
  form?: UseFormReturn<TFormValues>; // Allow external form instance
}

/**
 * Form - Main form component with integrated contexts
 */
const Form = <TFormValues extends FieldValues = FieldValues>({
  schema,
  onSubmit,
  children,
  className,
  mode = 'onSubmit',
  defaultValues,
  formId,
  form: externalForm,
  ...formProps
}: FormProps<TFormValues>) => {
  const internalForm = useRHFForm<TFormValues>({
    resolver: schema ? zodResolver(schema) : undefined,
    mode,
    defaultValues,
  });
  const form = externalForm || internalForm;

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <FormProvider form={form} formId={formId}>
      <form onSubmit={handleSubmit} className={cn('space-y-6', className)} {...formProps}>
        {typeof children === 'function' ? children(form) : children}
      </form>
    </FormProvider>
  );
};

// Export components
export { Form, FormLabel };

// Export types
export type { FieldValues, FormProps, SubmitHandler, UseFormReturn };
