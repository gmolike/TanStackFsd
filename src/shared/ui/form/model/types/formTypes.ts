import type { ReactNode } from 'react';
import type { FieldValues, SubmitHandler, UseFormProps, UseFormReturn } from 'react-hook-form';

import type { ZodType } from 'zod';

// Form Controller Props
export type FormControllerProps<TFormValues extends FieldValues = FieldValues> = {
  schema?: ZodType<TFormValues>;
  onSubmit: SubmitHandler<TFormValues>;
  onError?: (errors: any) => void;
  mode?: UseFormProps<TFormValues>['mode'];
  defaultValues?: UseFormProps<TFormValues>['defaultValues'];
  externalForm?: UseFormReturn<TFormValues>;
  disabled?: boolean;
};

// Form Controller Result
export type FormControllerResult<TFormValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFormValues>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  hasErrors: boolean;
  submitCount: number;
  isFormDisabled: boolean;
};

// Form Component Props
export type FormProps<TFormValues extends FieldValues = FieldValues> = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'children'
> &
  FormControllerProps<TFormValues> & {
    children: ReactNode | ((form: UseFormReturn<TFormValues>) => ReactNode);
    formId?: string;
    header?: ReactNode;
    footer?: ReactNode;
  };
