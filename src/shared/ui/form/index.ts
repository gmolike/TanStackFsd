// Context
export { FormField, useFormField } from './Context';

// Form Base Components
export type { FormLayoutProps, FormProps } from './Form';
export { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from './Form';

// Field Components - Import without "Form" prefix and re-export with "Form" prefix
export { Checkbox as FormCheckbox } from './fields/Checkbox';
export { DatePicker as FormDate } from './fields/DatePicker';
export { DateRange as FormDateRange } from './fields/DateRange';
export { Input as FormInput } from './fields/Input';
export { Select as FormSelect } from './fields/Select';
export { TextArea as FormTextArea } from './fields/TextArea';

// Field Types - Import and re-export with "Form" prefix
export type { CheckboxProps as FormCheckboxProps } from './fields/Checkbox';
export type { DatePickerProps as FormDateProps } from './fields/DatePicker';
export type { DateRangeProps as FormDateRangeProps } from './fields/DateRange';
export type { InputProps as FormInputProps } from './fields/Input';
export type { SelectProps as FormSelectProps } from './fields/Select';
export type { TextAreaProps as FormTextAreaProps } from './fields/TextArea';
export type { BaseFieldProps, SelectOption } from './fields/types';

// Radix Components - Import without "Form" prefix and re-export with "Form" prefix
export type { CheckboxRadixProps as FormCheckboxRadixProps } from './radix/CheckboxRadix';
export { CheckboxRadix as FormCheckboxRadix } from './radix/CheckboxRadix';
export type { SelectRadixProps as FormSelectRadixProps } from './radix/SelectRadix';
export { SelectRadix as FormSelectRadix } from './radix/SelectRadix';

// Header Components - Import without "Form" prefix and re-export with "Form" prefix
export { Centered as FormHeaderCentered } from './header/Centered';
export { Header as FormHeader } from './header/Header';
export { Minimal as FormHeaderMinimal } from './header/Minimal';
export { WithProgress as FormHeaderWithProgress } from './header/WithProgress';
export { WithSteps as FormHeaderWithSteps } from './header/WithSteps';

// Header Types - Import and re-export with "Form" prefix
export type { HeaderProps as FormHeaderProps } from './header/Header';
export type { WithProgressProps as FormHeaderWithProgressProps } from './header/WithProgress';
export type { WithStepsProps as FormHeaderWithStepsProps } from './header/WithSteps';

// Footer Components - Import without "Form" prefix and re-export with "Form" prefix
export { Centered as FormFooterCentered } from './footer/Centered';
export { Compact as FormFooterCompact } from './footer/Compact';
export { Footer as FormFooter } from './footer/Footer';
export { Split as FormFooterSplit } from './footer/Split';
export { Steps as FormFooterSteps } from './footer/Steps';

// Footer Types - Import and re-export with "Form" prefix
export type {
  FooterAction as FormFooterAction,
  FooterProps as FormFooterProps,
} from './footer/Footer';
export type { StepsProps as FormFooterStepsProps } from './footer/Steps';

// Re-export React Hook Form types for convenience
export type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
export { useForm } from 'react-hook-form';

/*
 * Usage Examples:
 *
 * // External usage stays the same
 * import { FormInput, FormHeader, FormFooter } from '~/shared/ui/form';
 *
 * // Internal files are cleaner
 * fields/Input.tsx instead of fields/FormInput.tsx
 * header/Header.tsx instead of header/FormHeader.tsx
 *
 * // Benefits:
 * - Cleaner internal file structure
 * - Same external API
 * - Better organization
 * - Easier to maintain
 */
