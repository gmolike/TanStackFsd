// src/shared/ui/form/select/ui.tsx
import { memo } from 'react';
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from 'react-hook-form';

import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/shared/shadcn/select';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../form';

import type { Props } from './model/types';
import { useController } from './model/useController';

const SelectComponent = <TFieldValues extends FieldValues = FieldValues>({
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
  const {
    isDisabled,
    hasEmptyOption,
    options: selectOptions,
    emptyOption: emptyOptionText,
  } = useController({
    name,
    disabled,
    required,
    options,
    emptyOption,
  });

  return (
    <FormField
      name={name}
      render={({
        field,
      }: {
        field: ControllerRenderProps<TFieldValues>;
        fieldState: ControllerFieldState;
      }) => (
        <FormItem className={className}>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <ShadcnSelect onValueChange={field.onChange} value={field.value} disabled={isDisabled}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {hasEmptyOption && <SelectItem value="">{emptyOptionText}</SelectItem>}
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

export const Component = memo(SelectComponent);
