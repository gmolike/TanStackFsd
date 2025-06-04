import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useFormState } from 'react-hook-form';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for DialogButton controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param props - Controller props
 * @param props.control - React Hook Form control object
 * @param props.disabled - Whether the button is disabled
 * @param props.emptyText - Text to show when value is empty
 * @param props.children - Children to render in the button
 *
 * @returns Controller result with state management and helpers
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  disabled,
  emptyText = 'Auswählen...',
  children,
}: ControllerProps<TFieldValues>): ControllerResult => {
  const { isSubmitting } = useFormState({ control });
  const [dialogOpen, setDialogOpen] = useState(false);

  const isDisabled = disabled || isSubmitting;

  /**
   * Check if the field has a value
   */
  const hasValue = useCallback(
    (value: unknown): boolean => value !== null && value !== undefined && value !== '',
    [],
  );

  /**
   * Get the display content for the button
   */
  const getDisplayContent = useCallback(
    (value: unknown): ReactNode => {
      // If children is a function, call it with the value
      if (typeof children === 'function') {
        const result = children(value);
        // If the function returns empty/null/undefined and no value, show empty text
        if (!result && !hasValue(value)) {
          return emptyText;
        }
        return result;
      }

      // If children is not a function and we have no value, show empty text
      if (!hasValue(value)) {
        return emptyText;
      }

      // Otherwise return children as-is
      return children;
    },
    [children, emptyText, hasValue],
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
