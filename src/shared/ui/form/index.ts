// src/shared/ui/form/index.ts
// Context and Provider
export type { FormContextValue, FormProviderProps } from './Context';
export { FormProvider } from './Context';

// Hooks - All form-related hooks in one place
export {
  useFieldState,
  useForm,
  useFormContext,
  useFormField,
  useFormId,
  useFormState,
} from './hook';

// Base Form Components
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './Form';

// Form Field Components
export { Checkbox as FormCheckbox } from './fields/Checkbox';
export { DatePicker as FormDate } from './fields/DatePicker';
export { DateRange as FormDateRange } from './fields/DateRange';
export { Input as FormInput } from './fields/Input';
export { Select as FormSelect } from './fields/Select';
export { TextArea as FormTextArea } from './fields/TextArea';

// Types
export type { FieldValues, FormProps, SubmitHandler, UseFormReturn } from './Form';

// Field Types
export type { CheckboxProps as FormCheckboxProps } from './fields/Checkbox';
export type { DatePickerProps as FormDateProps } from './fields/DatePicker';
export type { DateRangeProps as FormDateRangeProps } from './fields/DateRange';
export type { InputProps as FormInputProps } from './fields/Input';
export type { SelectProps as FormSelectProps } from './fields/Select';
export type { TextAreaProps as FormTextAreaProps } from './fields/TextArea';
export type { BaseFieldProps, SelectOption } from './fields/types';

// Header Components
export { Centered as FormHeaderCentered } from './header/Centered';
export { Header as FormHeader } from './header/Header';
export { Minimal as FormHeaderMinimal } from './header/Minimal';
export { WithProgress as FormHeaderWithProgress } from './header/WithProgress';
export { WithSteps as FormHeaderWithSteps } from './header/WithSteps';

// Header Types
export type { HeaderProps as FormHeaderProps } from './header/Header';
export type { WithProgressProps as FormHeaderWithProgressProps } from './header/WithProgress';
export type { WithStepsProps as FormHeaderWithStepsProps } from './header/WithSteps';

// Footer Components
export { Centered as FormFooterCentered } from './footer/Centered';
export { Compact as FormFooterCompact } from './footer/Compact';
export { Footer as FormFooter } from './footer/Footer';
export { Split as FormFooterSplit } from './footer/Split';
export { Steps as FormFooterSteps } from './footer/Steps';

// Footer Types
export type {
  FooterAction as FormFooterAction,
  FooterProps as FormFooterProps,
} from './footer/Footer';
export type { StepsProps as FormFooterStepsProps } from './footer/Steps';

// Re-export React Hook Form types for convenience
export type { FieldPath, FieldValues as RHFFieldValues } from 'react-hook-form';

// Re-export React Hook Form useForm as useRHFForm to avoid conflicts
export { useForm as useRHFForm } from 'react-hook-form';
