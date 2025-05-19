import { useCallback } from 'react';
import type { FieldValues } from 'react-hook-form';

import { useForm } from '../../form';

import type { ControllerProps, ControllerResult } from './types';

export const useController = <TFieldValues extends FieldValues = FieldValues>({
  name,
  disabled,
  required,
  startIcon,
  endIcon,
}: ControllerProps<TFieldValues>): ControllerResult<TFieldValues> => {
  const form = useForm<TFieldValues>();
  const { formState } = form;
  const isDisabled = disabled || formState.isSubmitting;

  const fieldState = form.getFieldState(name, formState);
  const { error } = fieldState;

  const hasIcons = !!startIcon || !!endIcon;

  const startIconClasses = 'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground';
  const endIconClasses = 'absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground';

  const inputClasses = useCallback(() => {
    const classes = [];
    if (startIcon) classes.push('pl-10');
    if (endIcon) classes.push('pr-10');
    return classes.join(' ');
  }, [startIcon, endIcon])();

  const ariaProps = {
    'aria-invalid': !!error,
    'aria-required': !!required,
    'aria-disabled': isDisabled,
  };

  return {
    form,
    isDisabled,
    hasIcons,
    startIconClasses,
    endIconClasses,
    inputClasses,
    ariaProps,
  };
};
