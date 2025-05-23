import { memo } from 'react';
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from 'react-hook-form';

import { Checkbox as ShadcnCheckbox } from '~/shared/shadcn/checkbox';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../form';

import type { Props } from './model/types';
import { useController } from './model/useController';

const Component = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  disabled,
  className,
  side = 'right',
}: Props<TFieldValues>) => {
  const { isDisabled, groupClasses } = useController({
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

export const Checkbox = memo(Component);
