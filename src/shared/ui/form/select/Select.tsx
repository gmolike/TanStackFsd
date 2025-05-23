import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/shared/shadcn/form';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/shared/shadcn/select';

import type { Props } from './model/types';
import { useController } from './model/useController';

/**
 * Select Component - Dropdown selection field with validation
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form (must be a valid path in TFieldValues)
 * @param label - Label text to display above the select
 * @param description - Helper text to display below the select
 * @param required - Whether the field is required
 * @param placeholder - Placeholder text when no option is selected
 * @param disabled - Whether the select is disabled
 * @param className - Additional CSS classes for the form item container
 * @param options - Array of options to display in the dropdown
 * @param emptyOption - Text for an empty/null option (e.g., "None selected")
 *
 * @example
 * ```tsx
 * const form = useForm<FormData>();
 *
 * <Select
 *   control={form.control}
 *   name="country"
 *   label="Country"
 *   required
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'de', label: 'Germany' },
 *     { value: 'fr', label: 'France' }
 *   ]}
 *   placeholder="Select a country"
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  required,
  placeholder = 'Auswählen...',
  disabled,
  className,
  options,
  emptyOption,
}: Props<TFieldValues>) => {
  const { isDisabled, hasEmptyOption, selectOptions, emptyOptionText } = useController({
    control,
    name,
    disabled,
    required,
    options,
    emptyOption,
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <ShadcnSelect
            onValueChange={(value) => {
              // Convert "__empty__" back to empty string for form
              field.onChange(value === '__empty__' ? '' : value);
            }}
            value={field.value || ''}
            disabled={isDisabled}
          >
            <FormControl>
              <SelectTrigger aria-invalid={!!fieldState.error} aria-required={required}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {hasEmptyOption && <SelectItem value="__empty__">{emptyOptionText}</SelectItem>}
              {selectOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </ShadcnSelect>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const Select = memo(Component) as typeof Component;
