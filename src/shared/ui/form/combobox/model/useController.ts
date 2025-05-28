import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { useFormState, useWatch } from 'react-hook-form';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for Combobox controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param props - Controller props
 * @param props.control - React Hook Form control object
 * @param props.name - Field name in the form
 * @param props.disabled - Whether the combobox is disabled
 * @param props.required - Whether the field is required
 * @param props.options - Array of options
 * @param props.onSearchChange - Callback when search changes
 * @param props.loading - Whether options are loading
 *
 * @returns Controller result with state and event handlers
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  disabled,
  options,
  onSearchChange,
}: ControllerProps<TFieldValues>): ControllerResult<TFieldValues> => {
  const { isSubmitting } = useFormState({ control });
  const fieldValue = useWatch({ control, name });
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const isDisabled = disabled || isSubmitting;

  // Find selected option
  const selectedOption = useMemo(
    () => options.find((option) => option.value === fieldValue),
    [options, fieldValue],
  );

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchValue) return options;

    const search = searchValue.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(search));
  }, [options, searchValue]);

  // Handle search change with optional callback
  useEffect(() => {
    if (onSearchChange && searchValue) {
      const timer = setTimeout(() => {
        onSearchChange(searchValue);
      }, 300); // Debounce search

      return () => clearTimeout(timer);
    }
  }, [searchValue, onSearchChange]);

  // Reset search when closing
  useEffect(() => {
    if (!open) {
      setSearchValue('');
    }
  }, [open]);

  /**
   * Handle option selection
   */
  const handleSelect = useCallback(
    (
      value: string,
      onChange: (selectedValue: PathValue<TFieldValues, FieldPath<TFieldValues>>) => void,
    ) => {
      onChange(value as PathValue<TFieldValues, FieldPath<TFieldValues>>);
      setOpen(false);
      setSearchValue('');
    },
    [],
  );

  /**
   * Handle clear button click
   */
  const handleClear = useCallback(
    (onChange: (value: PathValue<TFieldValues, FieldPath<TFieldValues>>) => void) => {
      onChange('' as PathValue<TFieldValues, FieldPath<TFieldValues>>);
      setSearchValue('');
    },
    [],
  );

  return {
    isDisabled,
    open,
    setOpen,
    searchValue,
    setSearchValue,
    filteredOptions,
    selectedOption,
    handleSelect,
    handleClear,
  };
};
