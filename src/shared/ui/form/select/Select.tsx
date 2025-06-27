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
 * @param testId - accessible in tests via data-testid
 * @param disabled - Whether the select is disabled
 * @param className - Additional CSS classes for the form item container
 * @param enumConfig - Array of options to display in the dropdown
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
const Component = <
  TFieldValues extends FieldValues = FieldValues,
  TEnum extends Record<string, string | number> = Record<string, string>,
>({
  control,
  name,
  label,
  description,
  required,
  placeholder = 'Auswählen...',
  testId,
  disabled,
  className,
  enumConfig,
  emptyOption,
  showReset = true,
  showClear = true,
}: Props<TFieldValues, TEnum>) => {
  const {
    isDisabled,
    hasEmptyOption,
    enumOptions,
    emptyOptionText,
    normalizedValue,
    displayValue,
    open,
    setOpen,
    onValueChange,
    handleLocalReset,
  } = useController({
    control,
    name,
    disabled,
    required,
    enumConfig,
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
            onValueChange={(value) => onValueChange(value, field.onChange)}
            value={normalizedValue}
            disabled={isDisabled}
            open={open}
            onOpenChange={setOpen}
          >
            <SelectTrigger className="flex-1" data-testid={testId}>
              <SelectValue placeholder={placeholder}>{displayValue}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {hasEmptyOption && <SelectItem value="__empty__">{emptyOptionText}</SelectItem>}

              {enumOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
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
              onClick={() => handleLocalReset(() => field.onChange)}
              aria-label="Auswahl löschen"
              className="shrink-0"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      )}
    />
  );
};

export const Select = memo(Component) as typeof Component;
