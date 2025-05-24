// src/shared/ui/form/textarea/TextArea.tsx - REFACTORED IN THIS CHAT
import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import { cn } from '~/shared/lib/utils';
import { Textarea as ShadcnTextarea } from '~/shared/shadcn';

import { FormFieldWrapper } from '../fieldWrapper';

import type { Props } from './model/types';
import { useController } from './model/useController';

/**
 * TextArea Component - Multi-line text input with reset functionality
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
 * @param showReset - Whether to show reset to default button
 *
 * @example
 * ```tsx
 * <FormTextArea
 *   control={form.control}
 *   name="description"
 *   label="Description"
 *   required
 *   placeholder="Enter a detailed description..."
 *   rows={5}
 *   showReset={true}
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
  showReset = true,
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
    <FormFieldWrapper
      control={control}
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
      showReset={showReset}
      render={(field) => (
        <ShadcnTextarea
          {...field}
          placeholder={placeholder}
          disabled={isDisabled}
          rows={controllerRows}
          {...ariaProps}
          className={cn(showReset && 'pr-10')}
        />
      )}
    />
  );
};

export const TextArea = memo(Component) as typeof Component;
