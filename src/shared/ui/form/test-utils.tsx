/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ReactNode } from 'react';
import type { DefaultValues, UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodSchema } from 'zod';

import { Form as ShadcnForm } from '~/shared/shadcn';

/**
 * Generic Test Wrapper für Form Components
 *
 * @example
 * ```tsx
 * render(
 *   <FormTestWrapper defaultValues={{ name: '' }}>
 *     {(form) => (
 *       <FormInput control={form.control} name="name" label="Name" />
 *     )}
 *   </FormTestWrapper>
 * );
 * ```
 */
export interface FormTestWrapperProps<
  TFieldValues extends Record<string, any> = Record<string, any>,
> {
  children: ReactNode | ((form: UseFormReturn<TFieldValues>) => ReactNode);
  defaultValues?: DefaultValues<TFieldValues>;
  schema?: ZodSchema<TFieldValues>;
}

export function FormTestWrapper<TFieldValues extends Record<string, any> = Record<string, any>>({
  children,
  defaultValues,
  schema,
}: FormTestWrapperProps<TFieldValues>) {
  const form = useForm<TFieldValues>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: defaultValues as DefaultValues<TFieldValues>,
  });

  return (
    <ShadcnForm {...form}>
      <form>{typeof children === 'function' ? children(form) : children}</form>
    </ShadcnForm>
  );
}

/**
 * Vordefinierte Test Wrapper für spezifische Komponenten
 */

// Input Test Wrapper
export const InputTestWrapper = ({
  children,
}: {
  children: (form: UseFormReturn<{ name: string; email: string }>) => ReactNode;
}) => <FormTestWrapper defaultValues={{ name: '', email: '' }}>{children}</FormTestWrapper>;

// Select Test Wrapper
export const SelectTestWrapper = ({
  children,
}: {
  children: (form: UseFormReturn<{ country: string }>) => ReactNode;
}) => <FormTestWrapper defaultValues={{ country: '' }}>{children}</FormTestWrapper>;

// Checkbox Test Wrapper
export const CheckboxTestWrapper = ({
  children,
}: {
  children: (form: UseFormReturn<{ terms: boolean }>) => ReactNode;
}) => <FormTestWrapper defaultValues={{ terms: false }}>{children}</FormTestWrapper>;

// DatePicker Test Wrapper
export const DatePickerTestWrapper = ({
  children,
}: {
  children: (form: UseFormReturn<{ birthDate: Date | null }>) => ReactNode;
}) => (
  <FormTestWrapper<{ birthDate: Date | null }> defaultValues={{ birthDate: null }}>
    {children}
  </FormTestWrapper>
);

// TextArea Test Wrapper
export const TextAreaTestWrapper = ({
  children,
}: {
  children: (form: UseFormReturn<{ bio: string }>) => ReactNode;
}) => <FormTestWrapper defaultValues={{ bio: '' }}>{children}</FormTestWrapper>;
