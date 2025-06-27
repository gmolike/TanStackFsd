import { useEffect, useState } from 'react';
import type { FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';

import { getEnumLabel } from '~/shared/ui/enum';

import type { ControllerProps, ControllerResult, EnumOption } from './types';
/**
 * Hook for Select controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form
 * @param disabled - Whether the select is disabled
 * @param required - Whether the field is required
 * @param options - Array of options
 * @param emptyOption - Text for empty option
 *
 * @returns Controller result with processed state
 */
export const useController = <
  TFieldValues extends FieldValues = FieldValues,
  TEnum extends Record<string, string | number> = Record<string, string>,
>({
  control,
  name,
  disabled,
  enumConfig,
  emptyOption,
}: ControllerProps<TFieldValues, TEnum>): ControllerResult => {
  const { isSubmitting } = useFormState({ control });
  const fieldValue = useWatch({ control, name });
  const [open, setOpen] = useState(false);
  const form = useFormContext<TFieldValues>();

  const isDisabled = disabled || isSubmitting;
  const normalizedValue = String(fieldValue ?? '');

  // Generiere Options aus Enum Config
  const enumOptions: Array<EnumOption> = Object.keys(enumConfig.enumObj).map((key) => ({
    value: key,
    label: getEnumLabel(key, enumConfig.variants, enumConfig.enumObj, key),
  }));

  // Display Value für SelectValue
  const displayValue = normalizedValue
    ? getEnumLabel(normalizedValue, enumConfig.variants, enumConfig.enumObj)
    : undefined;

  const handleLocalReset = (onChange: (value: string) => void) => {
    form.setValue(name, undefined as PathValue<TFieldValues, typeof name>, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    onChange('');
  };

  const onValueChange = (
    value: string,
    onChange: (newValue: PathValue<TFieldValues, FieldPath<TFieldValues>>) => void,
  ) => {
    const tempValue = value === '__empty__' ? '' : value;
    form.setValue(name, tempValue as PathValue<TFieldValues, typeof name>, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    onChange(tempValue as PathValue<TFieldValues, FieldPath<TFieldValues>>);
  };

  useEffect(() => {
    setOpen(false);
  }, [normalizedValue]);

  return {
    isDisabled,
    hasEmptyOption: !!emptyOption,
    enumOptions,
    emptyOptionText: emptyOption || '',
    normalizedValue,
    displayValue,
    open,
    setOpen,
    onValueChange,
    handleLocalReset,
  };
};
