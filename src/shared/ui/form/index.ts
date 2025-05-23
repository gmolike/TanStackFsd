/**
 * Form Components Library
 *
 * @module shared/ui/form
 */

// Export our Form wrapper component
export type { FormProps } from './form/Form';
export { Form } from './form/Form';

// Re-export React Hook Form utilities
export type {
  Control,
  FieldErrors,
  FieldPath,
  FieldValues,
  SubmitHandler,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
export { FormProvider, useFormContext } from 'react-hook-form';

// Field components with Form prefix
export { Checkbox as FormCheckbox } from './checkbox';
export { DatePicker as FormDatePicker } from './datePicker';
export { DateRange as FormDateRange } from './dateRange';
export { Input as FormInput } from './input';
export { Select as FormSelect } from './select';
export { TextArea as FormTextArea } from './textarea';

// Layout components with Form prefix
export { Footer as FormFooter } from './footer';
export { Header as FormHeader } from './header';

// Re-export controllers for advanced usage
export { useCheckboxController } from './checkbox';
export { useDatePickerController } from './datePicker';
export { useFooterController } from './footer';
export { useHeaderController } from './header';
export { useInputController } from './input';
export { useSelectController } from './select';
export { useTextareaController } from './textarea';

// Re-export types for all components
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
} from './datePicker/model/types';
export type { Props as DateRangeProps } from './dateRange/model/types';
export type {
  BaseFieldProps,
  ControllerProps as InputControllerProps,
  ControllerResult as InputControllerResult,
  InputHTMLType,
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
  ButtonType,
  ButtonVariant,
  FooterButton,
  ControllerProps as FooterControllerProps,
  ControllerResult as FooterControllerResult,
  Props as FooterProps,
  StandardButtonConfig,
} from './footer/model/types';
export type {
  ControllerProps as HeaderControllerProps,
  ControllerResult as HeaderControllerResult,
  Props as HeaderProps,
  WithProgressProps as HeaderWithProgressProps,
  WithStepsProps as HeaderWithStepsProps,
} from './header/model/types';
