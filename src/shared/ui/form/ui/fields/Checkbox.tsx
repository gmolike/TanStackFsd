import { memo } from 'react';
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from 'react-hook-form';

import { Checkbox as ShadcnCheckbox } from '~/shared/shadcn/checkbox';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../Form';
import { useCheckboxController } from '../../model/controllers';
import type { CheckboxProps } from '../../model/types/fieldTypes';

const CheckboxComponent = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  disabled,
  className,
  side = 'right',
}: CheckboxProps<TFieldValues>) => {
  const { isDisabled, groupClasses } = useCheckboxController({
    name,
    disabled,
    required,
    side,
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
          <div className={groupClasses}>
            <FormControl>
              <ShadcnCheckbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isDisabled}
              />
            </FormControl>
            {label && (
              <FormLabel required={required} className="cursor-pointer">
                {label}
              </FormLabel>
            )}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const Checkbox = memo(CheckboxComponent);
