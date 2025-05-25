/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react-refresh/only-export-components */
// src/shared/ui/form/test-utils.tsx
// src/shared/ui/form/test-utils.tsx
import type { ReactElement, ReactNode } from 'react';
import type { Control, FieldValues, UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render as rtlRender, waitFor } from '@testing-library/react';
import { z } from 'zod';

import { Form as ShadcnForm } from '~/shared/shadcn';

// Mock control für Tests ohne Form Context
export function useMockControl<
  TFieldValues extends FieldValues = FieldValues,
>(): Control<TFieldValues> {
  const form = useForm<TFieldValues>();
  return form.control;
}

// Test schemas
export const testSchemas = {
  simple: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    age: z.number().min(18, 'Must be at least 18'),
    bio: z.string().optional(),
  }),

  withSelect: z.object({
    country: z.string().min(1, 'Please select a country'),
    language: z.string().optional(),
  }),

  withCheckbox: z.object({
    acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
    newsletter: z.boolean().optional(),
  }),

  withDate: z.object({
    birthDate: z.date().max(new Date(), 'Birth date cannot be in the future'),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  }),

  complex: z.object({
    personal: z.object({
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      email: z.string().email(),
    }),
    address: z.object({
      street: z.string().min(5),
      city: z.string().min(2),
      zipCode: z.string().regex(/^\d{5}$/, 'Invalid ZIP code'),
    }),
    preferences: z.object({
      theme: z.enum(['light', 'dark']),
      notifications: z.boolean(),
    }),
  }),
};

// Test form wrapper
interface TestFormProviderProps<TFieldValues extends FieldValues = FieldValues> {
  children: ReactNode | ((form: UseFormReturn<TFieldValues>) => ReactNode);
  schema?: z.ZodType<TFieldValues>;
  defaultValues?: Partial<TFieldValues>;
  onSubmit?: (data: TFieldValues) => void;
}

export function TestFormProvider<TFieldValues extends FieldValues = FieldValues>({
  children,
  schema,
  defaultValues,
  onSubmit = () => {},
}: TestFormProviderProps<TFieldValues>) {
  const form = useForm<TFieldValues>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: defaultValues as any,
    mode: 'onBlur',
  });

  return (
    <ShadcnForm {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {typeof children === 'function' ? children(form) : children}
      </form>
    </ShadcnForm>
  );
}

// Custom render function
interface CustomRenderOptions<TFieldValues extends FieldValues = FieldValues>
  extends Omit<RenderOptions, 'wrapper'> {
  schema?: z.ZodType<TFieldValues>;
  defaultValues?: Partial<TFieldValues>;
  onSubmit?: (data: TFieldValues) => void;
}

// Overloaded render function
export function renderWithForm<TFieldValues extends FieldValues = FieldValues>(
  ui: ReactElement | ((form: UseFormReturn<TFieldValues>) => ReactElement),
  options?: CustomRenderOptions<TFieldValues>,
): RenderResult;

export function renderWithForm<TFieldValues extends FieldValues = FieldValues>(
  ui: ReactElement | ((form: UseFormReturn<TFieldValues>) => ReactElement),
  { schema, defaultValues, onSubmit, ...renderOptions }: CustomRenderOptions<TFieldValues> = {},
): RenderResult {
  // Wenn ui eine Funktion ist, rendern wir es innerhalb des TestFormProvider
  if (typeof ui === 'function') {
    const Wrapper = () => (
      <TestFormProvider schema={schema} defaultValues={defaultValues} onSubmit={onSubmit}>
        {(form) => ui(form)}
      </TestFormProvider>
    );
    return rtlRender(<div />, { wrapper: Wrapper, ...renderOptions });
  }

  // Sonst ist es ein normales Element
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <TestFormProvider schema={schema} defaultValues={defaultValues} onSubmit={onSubmit}>
      {children}
    </TestFormProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Helper to create form with ref
export function createFormRef<TFieldValues extends FieldValues = FieldValues>(
  schema?: z.ZodType<TFieldValues>,
  defaultValues?: Partial<TFieldValues>,
) {
  let formRef: UseFormReturn<TFieldValues> | null = null;

  const FormWrapper = ({ children }: { children: ReactNode }) => (
    <TestFormProvider schema={schema} defaultValues={defaultValues}>
      {(form) => {
        formRef = form;
        return children;
      }}
    </TestFormProvider>
  );

  return { FormWrapper, getForm: () => formRef! };
}

// Mock data generators
export const mockData = {
  options: {
    countries: [
      { value: 'de', label: 'Germany' },
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'fr', label: 'France' },
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'de', label: 'German' },
      { value: 'fr', label: 'French' },
      { value: 'es', label: 'Spanish' },
    ],
    themes: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'system', label: 'System' },
    ],
  },
  defaultValues: {
    simple: {
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
      bio: 'Software developer',
    },
    complex: {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
      address: {
        street: '123 Main St',
        city: 'Berlin',
        zipCode: '12345',
      },
      preferences: {
        theme: 'light' as const,
        notifications: true,
      },
    },
  },
};

// Assertion helpers
export const formAssertions = {
  // Check if field has error
  hasFieldError: (container: HTMLElement, fieldName: string, errorMessage?: string) => {
    const field = container.querySelector(`[name="${fieldName}"]`);
    expect(field).toHaveAttribute('aria-invalid', 'true');

    if (errorMessage) {
      const error = container.querySelector(`[id="${fieldName}-form-message"]`);
      expect(error).toHaveTextContent(errorMessage);
    }
  },

  // Check if field is required
  isFieldRequired: (container: HTMLElement, fieldName: string) => {
    const field = container.querySelector(`[name="${fieldName}"]`);
    expect(field).toHaveAttribute('aria-required', 'true');

    const label = container.querySelector(`label[for="${fieldName}"]`);
    expect(label?.textContent).toContain('*'); // Assuming required indicator
  },

  // Check if field is disabled
  isFieldDisabled: (container: HTMLElement, fieldName: string) => {
    const field = container.querySelector(`[name="${fieldName}"]`);
    expect(field).toBeDisabled();
    expect(field).toHaveAttribute('aria-disabled', 'true');
  },

  // Check field value
  hasFieldValue: (container: HTMLElement, fieldName: string, value: any) => {
    const field = container.querySelector(`[name="${fieldName}"]`);
    expect(field).toHaveValue(value);
  },
};

// Wait helpers
export const waitForFormSubmit = async (submitButton: HTMLElement) => {
  const isSubmitting = () => submitButton.textContent?.includes('Wird gespeichert...');
  const isSubmitted = () => !isSubmitting();

  // Wait for submission to start
  await waitFor(() => expect(isSubmitting()).toBe(true));
  // Wait for submission to complete
  await waitFor(() => expect(isSubmitted()).toBe(true));
};

// Re-export testing library utilities
export { act, fireEvent, screen, waitFor } from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
