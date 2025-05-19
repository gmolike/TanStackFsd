// src/shared/ui/form/form.tsx
import { forwardRef, memo, useId } from 'react';
import type { ComponentRef } from 'react';
import type { FieldValues } from 'react-hook-form';

import { cn } from '~/shared/lib/utils';
import { FormLabel as ShadcnFormLabel } from '~/shared/shadcn/form';

import type { FormProps } from './model';
import { FormProvider, useFormController } from './model';

export {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '~/shared/shadcn/form';

export const FormLabel = forwardRef<
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

function FormComponent<TFormValues extends FieldValues = FieldValues>({
  schema,
  onSubmit,
  onError,
  children,
  className,
  mode,
  defaultValues,
  formId: providedFormId,
  externalForm,
  header,
  footer,
  disabled = false,
  noValidate = true,
  ...formProps
}: FormProps<TFormValues>) {
  const generatedId = useId();
  const formId = providedFormId || generatedId;

  const { form, handleSubmit, isFormDisabled } = useFormController<TFormValues>({
    schema,
    onSubmit,
    onError,
    mode,
    defaultValues,
    externalForm,
    disabled,
  });

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
        aria-disabled={isFormDisabled}
        {...formProps}
      >
        {isFormDisabled ? (
          <fieldset disabled className="space-y-6">
            {formContent}
          </fieldset>
        ) : (
          formContent
        )}
      </form>
    </FormProvider>
  );
}

// Wichtig: Typerhaltung beim memo-Export für Generics
export const Form = memo(FormComponent) as typeof FormComponent;
