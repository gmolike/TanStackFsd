import type { FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

import { FormField } from './Context';
import type { BaseFieldProps, SelectOption } from './Field';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from './Form';

// Radix Checkbox Implementation
type FormCheckboxRadixProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues>;

type CheckboxProps<TFieldValues extends FieldValues = FieldValues> =
  FormCheckboxRadixProps<TFieldValues>;

/**
 * Eine erweiterte Checkbox mit Radix UI für bessere Accessibility und Custom Styling.
 *
 * @param name - Eindeutiger Feldname für React Hook Form
 * @param label - Optionaler Label-Text neben der Checkbox
 * @param description - Optionaler Hilfstext unter der Checkbox
 * @param required - Zeigt Sternchen (*) bei Pflichtfeldern an
 * @param disabled - Deaktiviert die Checkbox
 * @param className - Zusätzliche CSS-Klassen
 */
export const FormCheckboxRadix = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  disabled,
  className,
}: CheckboxProps<TFieldValues>) => (
  <FormField name={name}>
    <Controller
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          <div className="flex items-center space-x-2">
            <FormControl>
              <CheckboxPrimitive.Root
                id={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className={cn(
                  'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
                  fieldState.error && 'border-destructive',
                )}
              >
                <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
                  <Check className="h-4 w-4" />
                </CheckboxPrimitive.Indicator>
              </CheckboxPrimitive.Root>
            </FormControl>
            {label && (
              <LabelPrimitive.Root htmlFor={field.name} asChild>
                <FormLabel required={required} className="cursor-pointer">
                  {label}
                </FormLabel>
              </LabelPrimitive.Root>
            )}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  </FormField>
);

// Radix Select Implementation
type FormSelectRadixProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    options: Array<SelectOption>;
    emptyOption?: string;
  };

type SelectProps<TFieldValues extends FieldValues = FieldValues> =
  FormSelectRadixProps<TFieldValues>;

/**
 * Ein erweitertes Select-Dropdown mit Radix UI für custom Styling und bessere UX.
 *
 * @param name - Eindeutiger Feldname für React Hook Form
 * @param label - Optionaler Label-Text über dem Select
 * @param description - Optionaler Hilfstext unter dem Select
 * @param required - Zeigt Sternchen (*) bei Pflichtfeldern an
 * @param disabled - Deaktiviert das Select-Feld
 * @param placeholder - Placeholder-Text (Standard: "Auswählen...")
 * @param className - Zusätzliche CSS-Klassen
 * @param options - Array von Optionen mit value und label
 * @param emptyOption - Optionaler Text für eine leere Option
 */
export const FormSelectRadix = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  placeholder = 'Auswählen...',
  disabled,
  className,
  options,
  emptyOption,
}: SelectProps<TFieldValues>) => (
  <FormField name={name}>
    <Controller
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <FormControl>
            <SelectPrimitive.Root
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectPrimitive.Trigger
                className={cn(
                  'flex h-10 w-full items-center justify-between rounded-md border border-input',
                  'bg-background px-3 py-2 text-sm ring-offset-background',
                  'placeholder:text-muted-foreground focus:outline-none focus:ring-2',
                  'focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  '[&>span]:line-clamp-1',
                  fieldState.error && 'border-destructive focus:ring-destructive',
                )}
              >
                <SelectPrimitive.Value placeholder={placeholder} />
                <SelectPrimitive.Icon asChild>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </SelectPrimitive.Icon>
              </SelectPrimitive.Trigger>

              <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                  className={cn(
                    'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border',
                    'bg-popover text-popover-foreground shadow-md',
                    'data-[state=open]:animate-in data-[state=closed]:animate-out',
                    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
                    'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                  )}
                  position="popper"
                >
                  <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
                    <ChevronUp className="h-4 w-4" />
                  </SelectPrimitive.ScrollUpButton>

                  <SelectPrimitive.Viewport className="p-1">
                    {emptyOption && (
                      <SelectPrimitive.Item
                        value=""
                        className={cn(
                          'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2',
                          'text-sm outline-none focus:bg-accent focus:text-accent-foreground',
                          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                        )}
                      >
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          <SelectPrimitive.ItemIndicator>
                            <Check className="h-4 w-4" />
                          </SelectPrimitive.ItemIndicator>
                        </span>
                        <SelectPrimitive.ItemText>{emptyOption}</SelectPrimitive.ItemText>
                      </SelectPrimitive.Item>
                    )}

                    {options.map((option) => (
                      <SelectPrimitive.Item
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        className={cn(
                          'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2',
                          'text-sm outline-none focus:bg-accent focus:text-accent-foreground',
                          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                        )}
                      >
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          <SelectPrimitive.ItemIndicator>
                            <Check className="h-4 w-4" />
                          </SelectPrimitive.ItemIndicator>
                        </span>
                        <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                      </SelectPrimitive.Item>
                    ))}
                  </SelectPrimitive.Viewport>

                  <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
                    <ChevronDown className="h-4 w-4" />
                  </SelectPrimitive.ScrollDownButton>
                </SelectPrimitive.Content>
              </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  </FormField>
);

export type { FormCheckboxRadixProps, FormSelectRadixProps };
