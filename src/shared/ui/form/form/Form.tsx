import { memo } from 'react';
import type { ReactNode } from 'react';
import type { FieldValues, SubmitHandler, UseFormProps, UseFormReturn } from 'react-hook-form';
import { useForm as useRHFForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';

import { Form as ShadcnForm } from '~/shared/shadcn';

/**
 * Props for the Form component
 *
 * @template TFieldValues - Type of the form values
 */
export type FormProps<TFieldValues extends FieldValues = FieldValues> = {
  /**
   * Zod schema for form validation
   */
  schema?: ZodType<TFieldValues>;

  /**
   * Default values for form fields
   */
  defaultValues?: UseFormProps<TFieldValues>['defaultValues'];

  /**
   * Submit handler function
   */
  onSubmit: SubmitHandler<TFieldValues>;

  /**
   * Error handler function (optional)
   */
  onError?: (errors: any) => void;

  /**
   * Validation mode
   * @default 'onSubmit'
   */
  mode?: UseFormProps<TFieldValues>['mode'];

  /**
   * Children can be a function that receives the form instance or ReactNode
   */
  children: ReactNode | ((form: UseFormReturn<TFieldValues>) => ReactNode);

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Form ID
   */
  id?: string;
};

/**
 * Form Component - Wrapper around React Hook Form with Zod validation
 *
 * @template TFieldValues - Type of the form values
 *
 * @param schema - Zod schema for validation
 * @param defaultValues - Default form values
 * @param onSubmit - Submit handler
 * @param onError - Error handler
 * @param mode - Validation mode
 * @param children - Form content (can be function receiving form instance)
 * @param className - Additional CSS classes
 * @param id - Form ID
 *
 * @example
 * ```tsx
 * <Form
 *   schema={personSchema}
 *   defaultValues={{ firstName: '', lastName: '' }}
 *   onSubmit={handleSubmit}
 * >
 *   {(form) => (
 *     <>
 *       <FormInput control={form.control} name="firstName" />
 *       <FormFooter form={form} />
 *     </>
 *   )}
 * </Form>
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  onError,
  mode = 'onBlur',
  children,
  className,
  id,
}: FormProps<TFieldValues>) => {
  const form = useRHFForm<TFieldValues>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
    mode,
  });

  const handleSubmit = form.handleSubmit(onSubmit, onError);

  return (
    <ShadcnForm {...form}>
      <form id={id} onSubmit={handleSubmit} className={className}>
        {typeof children === 'function' ? children(form) : children}
      </form>
    </ShadcnForm>
  );
};

export const Form = memo(Component) as typeof Component;
