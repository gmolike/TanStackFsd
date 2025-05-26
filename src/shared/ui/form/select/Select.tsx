import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import { X } from 'lucide-react';

import {
  Button,
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/shared/shadcn';

import { FormFieldWrapper } from '../fieldWrapper';

import type { Props } from './model/types';
import { useController } from './model/useController';

/**
 * Select Component - Dropdown with clear functionality
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
 * @param showReset - Whether to show reset to default button
 * @param showClear - Whether to show clear selection button
 *
 * @example
 * ```tsx
 * <FormSelect
 *   control={form.control}
 *   name="country"
 *   label="Country"
 *   required
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'de', label: 'Germany' }
 *   ]}
 *   showClear={true}
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
  showReset = true,
  showClear = true,
}: Props<TFieldValues>) => {
  const {
    isDisabled,
    hasEmptyOption,
    selectOptions,
    emptyOptionText,
    normalizedValue,
    open,
    setOpen,
  } = useController({
    control,
    name,
    disabled,
    required,
    options,
    emptyOption,
  });

  return (
    <FormFieldWrapper
      control={control}
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
      showReset={showReset}
      render={(field) => (
        <div className="flex items-center gap-2">
          <ShadcnSelect
            onValueChange={(value) => {
              field.onChange(value === '__empty__' ? '' : value);
            }}
            value={normalizedValue}
            disabled={isDisabled}
            open={open}
            onOpenChange={setOpen}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {hasEmptyOption && <SelectItem value="__empty__">{emptyOptionText}</SelectItem>}
              {selectOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </ShadcnSelect>
          {showClear && normalizedValue && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => field.onChange('')}
              aria-label="Auswahl löschen"
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    />
  );
};

export const Select = memo(Component) as typeof Component;
