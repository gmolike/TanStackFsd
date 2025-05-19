/* eslint-disable @typescript-eslint/no-explicit-any */
// src/shared/ui/form/Form.tsx
import { forwardRef, useId } from 'react';
import type { ComponentRef, ReactNode } from 'react';
import type { FieldValues, SubmitHandler, UseFormProps, UseFormReturn } from 'react-hook-form';
import { useForm as useRHFForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';

import { cn } from '~/shared/lib/utils';
import { FormLabel as ShadcnFormLabel } from '~/shared/shadcn/form';

import { FormProvider } from './model/Context';

export {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '~/shared/shadcn/form';

const FormLabel = forwardRef<
  ComponentRef<typeof ShadcnFormLabel>,
  React.ComponentPropsWithoutRef<typeof ShadcnFormLabel> & {
    required?: boolean;
  }
>(({ className, required, children, ...props }, ref) => (
  <ShadcnFormLabel ref={ref} className={className} {...props}>
    {children}
    {required && (
      <span
        className="ml-1 text-destructive"
        aria-label="Pflichtfeld"
        title="Dieses Feld ist erforderlich"
      >
        *
      </span>
    )}
  </ShadcnFormLabel>
));
FormLabel.displayName = 'FormLabel';

// Form Component Props
interface FormProps<TFormValues extends FieldValues = FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
  schema?: ZodType<TFormValues>;
  onSubmit: SubmitHandler<TFormValues>;
  onError?: (errors: any) => void;
  children: ReactNode | ((form: UseFormReturn<TFormValues>) => ReactNode);
  mode?: UseFormProps<TFormValues>['mode'];
  defaultValues?: UseFormProps<TFormValues>['defaultValues'];
  formId?: string;
  form?: UseFormReturn<TFormValues>; // Allow external form instance
  header?: ReactNode;
  footer?: ReactNode;
  disabled?: boolean; // Global form disable
}

/**
 * Form - Main form component with integrated contexts
 */
const Form = <TFormValues extends FieldValues = FieldValues>({
  schema,
  onSubmit,
  onError,
  children,
  className,
  mode = 'onSubmit',
  defaultValues,
  formId: providedFormId,
  form: externalForm,
  header,
  footer,
  disabled = false,
  noValidate = true,
  ...formProps
}: FormProps<TFormValues>) => {
  const generatedId = useId();
  const formId = providedFormId || generatedId;

  const internalForm = useRHFForm<TFormValues>({
    resolver: schema ? zodResolver(schema) : undefined,
    mode,
    defaultValues,
  });
  const form = externalForm || internalForm;

  const handleSubmit = form.handleSubmit(onSubmit, onError);

  const formContent = (
    <>
      {header}
      <div className="space-y-6">{typeof children === 'function' ? children(form) : children}</div>
      {footer}
    </>
  );

  return (
    <FormProvider form={form} formId={formId}>
      <form
        id={formId}
        onSubmit={handleSubmit}
        className={cn('space-y-6', className)}
        noValidate={noValidate}
        aria-disabled={disabled}
        {...formProps}
      >
        {disabled ? (
          <fieldset disabled className="space-y-6">
            {formContent}
          </fieldset>
        ) : (
          formContent
        )}
      </form>
    </FormProvider>
  );
};

export { Form, FormLabel };
export type { FieldValues, FormProps, SubmitHandler, UseFormReturn };
