// 1. Form-Komponenten
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './Form';

// 2. Formularfelder mit Form-Präfix
export { Checkbox as FormCheckbox } from './ui/fields/Checkbox';
export { DatePicker as FormDate } from './ui/fields/DatePicker';
export { DateRange as FormDateRange } from './ui/fields/DateRange';
export { Input as FormInput } from './ui/fields/Input';
export { Select as FormSelect } from './ui/fields/Select';
export { TextArea as FormTextArea } from './ui/fields/TextArea';

// 3. Header-Komponenten
export { Header as FormHeader } from './ui/header/Header';

// 4. Footer-Komponenten
export { Footer as FormFooter } from './ui/footer/Footer';
export { Steps as FormFooterSteps } from './ui/footer/Steps';

// 5. Context und Provider für fortgeschrittene Anwendungsfälle
export type { FormContextValue, FormProviderProps } from './model/Context';
export { FormProvider } from './model/Context';

// 6. Hooks für direkte Verwendung
export {
  useFieldState,
  useForm,
  useFormContext,
  useFormField,
  useFormId,
  useFormState,
} from './model/hooks';

// 7. Controller für eigene UI-Implementierungen
export {
  useCheckboxController,
  useDatePickerController,
  useFooterController,
  useFormController,
  useHeaderController,
  useInputController,
  useSelectController,
  useStepsController,
  useTextAreaController,
} from './model/controllers';

// 8. Typen für Komponenten-Props
export type {
  BaseFieldProps,
  CheckboxProps as FormCheckboxProps,
  DatePickerProps as FormDateProps,
  DateRangeProps as FormDateRangeProps,
  InputProps as FormInputProps,
  SelectProps as FormSelectProps,
  TextAreaProps as FormTextAreaProps,
  SelectOption,
} from './model/types/fieldTypes';
export type {
  FooterAction as FormFooterAction,
  FooterProps as FormFooterProps,
  StepsProps as FormFooterStepsProps,
} from './model/types/footerTypes';
export type {
  FormControllerProps as FormControllerOptions,
  FormProps,
} from './model/types/formTypes';
export type {
  HeaderProps as FormHeaderProps,
  WithProgressProps as FormHeaderWithProgressProps,
  WithStepsProps as FormHeaderWithStepsProps,
} from './model/types/headerTypes';

// 9. React Hook Form Re-Exports für Kompatibilität
export type { FieldPath, FieldValues } from 'react-hook-form';
export { useForm as useRHFForm } from 'react-hook-form';
