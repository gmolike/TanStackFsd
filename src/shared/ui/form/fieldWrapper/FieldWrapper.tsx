// src/shared/ui/form/fieldWrapper/FieldWrapper.tsx
import { memo, useEffect, useRef } from 'react';
import type { FieldValues, PathValue } from 'react-hook-form';
import { useFormContext, useWatch } from 'react-hook-form';

import { RotateCcw } from 'lucide-react';

import {
  Button,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/shared/shadcn';

import type { Props } from './model/types';

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
  const form = useFormContext<TFieldValues>();
  const currentValue = useWatch({ control, name });

  // Store the initial default value with proper typing
  const defaultValueRef = useRef<PathValue<TFieldValues, typeof name> | undefined>(undefined);

  useEffect(() => {
    // Capture the default value on mount
    const defaultValues = form.formState.defaultValues;
    if (defaultValues && defaultValueRef.current === undefined) {
      // Navigate through nested paths
      const pathParts = (name as string).split('.');
      let value: unknown = defaultValues;

      for (const part of pathParts) {
        if (value && typeof value === 'object' && part in value) {
          value = (value as Record<string, unknown>)[part];
        } else {
          value = undefined;
          break;
        }
      }

      defaultValueRef.current = value as PathValue<TFieldValues, typeof name>;
    }
  }, [form.formState.defaultValues, name]);

  const handleReset = () => {
    form.setValue(name, defaultValueRef.current as PathValue<TFieldValues, typeof name>, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const isDifferentFromDefault = currentValue !== defaultValueRef.current;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex items-center justify-between">
            {label && <FormLabel required={required}>{label}</FormLabel>}
            {/* Always reserve space for reset button to prevent layout shift */}
            <div className="h-6 w-6">
              {showReset && isDifferentFromDefault && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleReset}
                  aria-label="Auf Standardwert zurücksetzen"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <FormControl>{render(field)}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const FieldWrapper = memo(Component) as typeof Component;
