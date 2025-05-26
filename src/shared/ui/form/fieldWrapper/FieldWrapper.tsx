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

  const defaultValueRef = useRef<PathValue<TFieldValues, typeof name> | undefined>(undefined);

  useEffect(() => {
    const defaultValues = form.formState.defaultValues;
    if (defaultValues && defaultValueRef.current === undefined) {
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

  const isValueDifferent = (current: unknown, defaultVal: unknown): boolean => {
    if (current == null && defaultVal == null) return false;

    if (current == null || defaultVal == null) return true;

    if (current instanceof Date && defaultVal instanceof Date) {
      return current.getTime() !== defaultVal.getTime();
    }

    if (typeof current === 'string' && typeof defaultVal === 'string') {
      try {
        const currentDate = new Date(current);
        const defaultDate = new Date(defaultVal);
        if (!isNaN(currentDate.getTime()) && !isNaN(defaultDate.getTime())) {
          return currentDate.getTime() !== defaultDate.getTime();
        }
      } catch (error) {
        console.warn('Failed to parse date strings for comparison:', error);
        return current !== defaultVal;
      }
    }
    return current !== defaultVal;
  };
  const isDifferentFromDefault = isValueDifferent(currentValue, defaultValueRef.current);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex items-center justify-between">
            {label && <FormLabel required={required}>{label}</FormLabel>}
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
