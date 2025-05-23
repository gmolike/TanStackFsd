import { memo } from 'react';
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from 'react-hook-form';

import { Textarea as ShadcnTextarea } from '~/shared/shadcn/textarea';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../form';

import type { Props } from './model/types';
import { useController } from './model/useController';

const Component = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  placeholder,
  disabled,
  className,
  rows = 3,
}: Props<TFieldValues>) => {
  const {
    isDisabled,
    rows: controllerRows,
    ariaProps,
  } = useController({
    name,
    disabled,
    required,
    rows,
  });

  return (
    <FormField
      name={name}
      render={({
        field,
        fieldState,
      }: {
        field: ControllerRenderProps<TFieldValues>;
        fieldState: ControllerFieldState;
      }) => (
        <FormItem className={className}>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <FormControl>
            <ShadcnTextarea
              {...field}
              placeholder={placeholder}
              disabled={isDisabled}
              rows={controllerRows}
              {...ariaProps}
              aria-describedby={
                description || fieldState.error ? `${name}-description ${name}-error` : undefined
              }
            />
          </FormControl>
          {description && (
            <FormDescription id={`${name}-description`}>{description}</FormDescription>
          )}
          <FormMessage id={`${name}-error`} />
        </FormItem>
      )}
    />
  );
};

export const TextArea = memo(Component);
