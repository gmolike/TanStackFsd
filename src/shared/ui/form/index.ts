// src/shared/ui/form/index.ts
/**
 * Form Components Library
 *
 * Enthält typsichere Formularkomponenten nach Feature-Sliced Design Architektur
 */

// Form base components
export {
  Component as Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  Label as FormLabel,
  FormMessage,
  Provider as FormProvider,
  useFieldState,
  useForm,
  useFormContext,
  useController as useFormController,
  useFormField,
  useFormId,
  useFormState,
} from './form';

// Field components with Form prefix
export { Component as FormCheckbox } from './checkbox';
export { Component as FormDate } from './datepicker';
export { Component as FormDateRange } from './daterange';
export { Component as FormInput } from './input';
export { Component as FormSelect } from './select';
export { Component as FormTextArea } from './textarea';

// Layout components with Form prefix
export { Component as FormFooter } from './footer';
export { Component as FormFooterSteps } from './footer-steps';
export { Component as FormHeader } from './header';

// Re-export controllers for advanced usage
export { useController as useCheckboxController } from './checkbox';
export { useController as useDatePickerController } from './datepicker';
export { useController as useFooterController } from './footer';
export { useController as useFooterStepsController } from './footer-steps';
export { useController as useHeaderController } from './header';
export { useController as useInputController } from './input';
export { useController as useSelectController } from './select';
export { useController as useTextareaController } from './textarea';

// Re-export types for all components
// Form types
export type {
  ContextValue as FormContextValue,
  ProviderProps as FormProviderProps,
} from './form/model/context';
export type {
  ControllerProps as FormControllerProps,
  Props as FormProps,
} from './form/model/types';

// Field types
export type {
  ControllerProps as CheckboxControllerProps,
  ControllerResult as CheckboxControllerResult,
  Props as CheckboxProps,
} from './checkbox/model/types';
export type {
  ControllerProps as DatePickerControllerProps,
  ControllerResult as DatePickerControllerResult,
  Props as DatePickerProps,
} from './datepicker/model/types';
export type { Props as DateRangeProps } from './daterange/model/types';
export type {
  ControllerProps as InputControllerProps,
  ControllerResult as InputControllerResult,
  Props as InputProps,
} from './input/model/types';
export type {
  ControllerProps as SelectControllerProps,
  ControllerResult as SelectControllerResult,
  Option as SelectOption,
  Props as SelectProps,
} from './select/model/types';
export type {
  ControllerProps as TextareaControllerProps,
  ControllerResult as TextareaControllerResult,
  Props as TextareaProps,
} from './textarea/model/types';

// Layout types
export type {
  Action as FooterAction,
  ControllerProps as FooterControllerProps,
  ControllerResult as FooterControllerResult,
  Props as FooterProps,
} from './footer/model/types';
export type {
  ControllerProps as FooterStepsControllerProps,
  ControllerResult as FooterStepsControllerResult,
  StepsProps as FooterStepsProps,
} from './footer-steps/model/types';
export type {
  ControllerProps as HeaderControllerProps,
  ControllerResult as HeaderControllerResult,
  Props as HeaderProps,
  WithProgressProps as HeaderWithProgressProps,
  WithStepsProps as HeaderWithStepsProps,
} from './header/model/types';

// React Hook Form Re-Exports für Kompatibilität
export type { FieldPath, FieldValues } from 'react-hook-form';
export { useForm as useRHFForm } from 'react-hook-form';
