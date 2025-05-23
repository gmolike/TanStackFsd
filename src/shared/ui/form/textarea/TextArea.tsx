import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/shared/shadcn/form';
import { Textarea as ShadcnTextarea } from '~/shared/shadcn/textarea';

import type { Props } from './model/types';
import { useController } from './model/useController';

/**
 * TextArea Component - Multi-line text input field with validation
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form (must be a valid path in TFieldValues)
 * @param label - Label text to display above the textarea
 * @param description - Helper text to display below the textarea
 * @param required - Whether the field is required
 * @param placeholder - Placeholder text for the textarea
 * @param disabled - Whether the textarea is disabled
 * @param className - Additional CSS classes for the form item container
 * @param rows - Number of visible text rows
 *
 * @example
 * ```tsx
 * const form = useForm<FormData>();
 *
 * <TextArea
 *   control={form.control}
 *   name="description"
 *   label="Description"
 *   required
 *   placeholder="Enter a detailed description..."
 *   rows={5}
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
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
    control,
    name,
    disabled,
    required,
    rows,
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
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

export const TextArea = memo(Component) as typeof Component;
