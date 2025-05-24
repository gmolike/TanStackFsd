import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import {
  Checkbox as ShadcnCheckbox,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/shared/shadcn';

import type { Props } from './model/types';
import { useController } from './model/useController';

/**
 * Checkbox Component - Checkbox input with label positioning options
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form (must be a valid path in TFieldValues)
 * @param label - Label text to display with the checkbox
 * @param description - Helper text to display below the checkbox
 * @param required - Whether the field is required
 * @param disabled - Whether the checkbox is disabled
 * @param className - Additional CSS classes for the form item container
 * @param side - Position of the label relative to the checkbox
 *
 * @example
 * ```tsx
 * const form = useForm<FormData>();
 *
 * <Checkbox
 *   control={form.control}
 *   name="acceptTerms"
 *   label="I accept the terms and conditions"
 *   required
 *   side="right"
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  required,
  disabled,
  className,
  side = 'right',
}: Props<TFieldValues>) => {
  const { isDisabled, groupClasses } = useController({
    control,
    name,
    disabled,
    required,
    side,
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className={groupClasses}>
            <FormControl>
              <ShadcnCheckbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isDisabled}
                aria-required={required}
              />
            </FormControl>
            {label && (
              <FormLabel required={required} className="cursor-pointer font-normal">
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

export const Checkbox = memo(Component) as typeof Component;
