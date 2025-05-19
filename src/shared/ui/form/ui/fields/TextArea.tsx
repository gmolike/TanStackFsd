import { memo } from 'react';
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from 'react-hook-form';

import { Textarea as ShadcnTextarea } from '~/shared/shadcn/textarea';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../Form';
import { useTextAreaController } from '../../model/controllers';
import type { TextAreaProps } from '../../model/types/fieldTypes';

const TextAreaComponent = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  placeholder,
  disabled,
  className,
  rows = 3,
}: TextAreaProps<TFieldValues>) => {
  const {
    isDisabled,
    rows: controllerRows,
    ariaProps,
  } = useTextAreaController({
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

export const TextArea = memo(TextAreaComponent);
