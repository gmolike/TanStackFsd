import type { FieldValues } from 'react-hook-form';
import { useFormState } from 'react-hook-form';

import { z } from 'zod';

import type { ControllerProps, ControllerResult, InputHTMLType } from './types';

/**
 * Extract schema metadata from the form's resolver
 */
const getFieldSchema = <TFieldValues extends FieldValues>(
  control: TFieldValues,
  fieldName: string,
): z.ZodTypeAny | undefined => {
  try {
    // Access the schema through the resolver
    const resolver = control._options?.resolver;
    if (!resolver) return undefined;

    // Try to get the schema from the resolver context
    const schema = resolver.__zodSchema;
    if (!schema || !schema.shape) return undefined;

    // Get the field schema
    const fieldParts = fieldName.split('.');
    let currentSchema = schema.shape;

    for (const part of fieldParts) {
      currentSchema = currentSchema[part];
      if (!currentSchema) return undefined;
    }

    return currentSchema;
  } catch {
    return undefined;
  }
};

/**
 * Check if a Zod schema is required
 */
const isSchemaRequired = (schema: z.ZodTypeAny): boolean => {
  // Check if it's optional
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return false;
  }

  // Check if it's a default
  if (schema instanceof z.ZodDefault) {
    return false;
  }

  return true;
};

/**
 * Infer input type from Zod schema
 */
const inferInputType = (schema: z.ZodTypeAny): InputHTMLType => {
  // Unwrap optional/nullable/default
  let baseSchema = schema;
  while (
    baseSchema instanceof z.ZodOptional ||
    baseSchema instanceof z.ZodNullable ||
    baseSchema instanceof z.ZodDefault
  ) {
    baseSchema = baseSchema._def.innerType;
  }

  // Check for string with specific checks
  if (baseSchema instanceof z.ZodString) {
    const checks = baseSchema._def.checks;
    for (const check of checks) {
      if (check.kind === 'email') return 'email';
      if (check.kind === 'url') return 'url';
    }
    return 'text';
  }

  // Check for number
  if (baseSchema instanceof z.ZodNumber) {
    return 'number';
  }

  // Check for date
  if (baseSchema instanceof z.ZodDate) {
    return 'date';
  }

  return 'text';
};

/**
 * Hook for Input controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form
 * @param disabled - Whether the field is disabled
 * @param required - Whether the field is required (overrides schema detection)
 * @param type - HTML input type (overrides schema detection)
 *
 * @returns Controller result with disabled state, required state, input type, and ARIA props
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  disabled,
  required: explicitRequired,
  type: explicitType,
}: ControllerProps<TFieldValues>): ControllerResult => {
  const { isSubmitting, errors } = useFormState({ control });
  const fieldError = errors[name];

  // Get field schema
  const fieldSchema = getFieldSchema(control, name as string);

  // Determine if required (explicit takes precedence)
  const isRequired =
    explicitRequired !== undefined ? explicitRequired : isSchemaRequired(fieldSchema ?? z.string());

  // Determine input type (explicit takes precedence)
  const inputType = explicitType || inferInputType(fieldSchema ?? z.string());

  const isDisabled = disabled || isSubmitting;

  const ariaProps = {
    'aria-invalid': !!fieldError,
    'aria-required': isRequired,
    'aria-disabled': isDisabled,
  };

  return {
    isDisabled,
    isRequired,
    inputType,
    ariaProps,
  };
};
