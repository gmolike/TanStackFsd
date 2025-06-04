import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import type { FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { useFormState } from 'react-hook-form';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for DialogButton controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param props - Controller props
 * @param props.control - React Hook Form control object
 * @param props.name - Field name in the form
 * @param props.disabled - Whether the button is disabled
 * @param props.required - Whether the field is required
 * @param props.displayMode - How to display the button content
 * @param props.formatter - Function to format the value
 * @param props.emptyText - Text to show when value is empty
 * @param props.children - Children to render in the button
 *
 * @returns Controller result with state management and helpers
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  disabled,
  displayMode = 'value',
  formatter,
  emptyText = 'Auswählen...',
  children,
}: ControllerProps<TFieldValues>): ControllerResult<TFieldValues> => {
  const { isSubmitting } = useFormState({ control });
  const [dialogOpen, setDialogOpen] = useState(false);

  const isDisabled = disabled || isSubmitting;

  /**
   * Check if the field has a value
   */
  const hasValue = useCallback((value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
  }, []);

  /**
   * Get the display content for the button based on display mode
   */
  const getDisplayContent = useCallback(
    (value: any): ReactNode => {
      // If no value, always show empty text
      if (!hasValue(value)) {
        return emptyText;
      }

      switch (displayMode) {
        case 'children':
          // If children is a function, call it with the value
          if (typeof children === 'function') {
            return children(value);
          }
          // Otherwise return children as-is
          return children || emptyText;

        case 'formatted':
          // Use formatter if provided
          if (formatter) {
            return formatter(value);
          }
          // Fallback to string representation
          return String(value);

        case 'value':
        default:
          // Simple string representation of the value
          if (typeof value === 'object' && value !== null) {
            // For objects, try common display properties
            const objValue = value as Record<string, unknown>;
            return objValue.label || objValue.name || objValue.title || JSON.stringify(value);
          }
          return String(value);
      }
    },
    [displayMode, formatter, emptyText, children, hasValue],
  );

  /**
   * Handle button click
   */
  const handleClick = useCallback(() => {
    if (!isDisabled) {
      setDialogOpen(true);
    }
  }, [isDisabled]);

  return {
    isDisabled,
    dialogOpen,
    setDialogOpen,
    handleClick,
    getDisplayContent,
    hasValue,
  };
};
