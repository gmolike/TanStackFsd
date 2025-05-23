/**
 * Form Components Library
 */

// Form base components
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider,
  useFieldState,
  useForm,
  useFormContext,
  useFormController,
  useFormField,
  useFormId,
  useFormState,
} from './form';

// Field components with Form prefix
export { Checkbox as FormCheckbox } from './checkbox';
export { DatePicker as FormDatePicker } from './datePickerxx';
export { DateRange as FormDateRange } from './dateRangeXX';
export { Input as FormInput } from './input';
export { Select as FormSelect } from './select';
export { TextArea as FormTextArea } from './textarea';

// Layout components with Form prefix
export { Footer as FormFooter } from './footer';
export { Header as FormHeader } from './header';

// Re-export controllers for advanced usage
export { useCheckboxController } from './checkbox';
export { useDatePickerController } from './datePickerxx';
export { useFooterController } from './footer';
export { useHeaderController } from './header';
export { useInputController } from './input';
export { useSelectController } from './select';
export { useTextareaController } from './textarea';

// Re-export types for all components
// Form types
export type {
  ContextValue as FormContextValue,
  ProviderProps as FormProviderProps,
} from './form/model/Context';
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
} from './datePickerxx/model/types';
export type { Props as DateRangeProps } from './dateRangeXX/model/types';
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
  FooterButton,
  ControllerProps as FooterControllerProps,
  ControllerResult as FooterControllerResult,
  Props as FooterProps,
  StandardButtons,
} from './footer/model/types';
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
