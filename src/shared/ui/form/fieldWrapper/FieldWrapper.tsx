import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import { RotateCcw } from 'lucide-react';

import {
  Button,
  ShadCnFormControl,
  ShadCnFormDescription,
  ShadCnFormField,
  ShadCnFormItem,
  ShadCnFormLabel,
  ShadCnFormMessage,
} from '~/shared/shadcn';

import type { Props } from './model/types';
import { useController } from './model/useController';

/**
 * FormFieldWrapper Component - Wrapper with reset functionality
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form (must be a valid path in TFieldValues)
 * @param label - Label text to display above the field
 * @param description - Helper text to display below the field
 * @param required - Whether the field is required
 * @param className - Additional CSS classes for the form item container
 * @param showReset - Whether to show reset button
 * @param render - Render function for the field
 *
 * @example
 * ```tsx
 * <FormFieldWrapper
 *   control={form.control}
 *   name="email"
 *   label="Email"
 *   required
 *   render={(field) => (
 *     <Input {...field} type="email" placeholder="Enter email" />
 *   )}
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  required,
  className,
  showReset = true,
  render,
}: Props<TFieldValues>) => {
  const { isDifferentFromDefault, handleReset } = useController({
    control,
    name,
    showReset,
  });
  return (
    <ShadCnFormField
      control={control}
      name={name}
      render={({ field }) => (
        <ShadCnFormItem className={className}>
          <div className="flex items-center justify-between">
            {label && <ShadCnFormLabel required={required}>{label}</ShadCnFormLabel>}
            <div className="size-6">
              {showReset && isDifferentFromDefault && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={handleReset}
                  aria-label="Auf Standardwert zurücksetzen"
                >
                  <RotateCcw className="size-3" />
                </Button>
              )}
            </div>
          </div>
          <ShadCnFormControl>{render(field)}</ShadCnFormControl>
          {description && <ShadCnFormDescription>{description}</ShadCnFormDescription>}
          <ShadCnFormMessage />
        </ShadCnFormItem>
      )}
    />
  );
};

export const FieldWrapper = memo(Component) as typeof Component;
