import { memo } from 'react';
import type { FieldValues } from 'react-hook-';
import { Controller } from 'react-hook-';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '~/shared/lib/utils';

import { Control, Description, Item, Label, Message } from '../';
import { Field } from '../Context';
import type { BaseFieldProps, SelectOption } from '../fields/types';

// Types
type SelectRadixProps<TFieldValues extends FieldValues = FieldValues> =
  BaseFieldProps<TFieldValues> & {
    options: Array<SelectOption>;
    emptyOption?: string;
  };

// Constants
const SELECT_TRIGGER_CLASSES = `
  flex h-10 w-full items-center justify-between rounded-md border border-input
  bg-background px-3 py-2 text-sm ring-offset-background
  placeholder:text-muted-foreground focus:outline-none focus:ring-2
  focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
  [&>span]:line-clamp-1
`.trim();

const SELECT_CONTENT_CLASSES = `
  relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border
  bg-popover text-popover-foreground shadow-md
  data-[state=open]:animate-in data-[state=closed]:animate-out
  data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
  data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
  data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
  data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
`.trim();

const SELECT_ITEM_CLASSES = `
  relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2
  text-sm outline-none focus:bg-accent focus:text-accent-foreground
  data-[disabled]:pointer-events-none data-[disabled]:opacity-50
`.trim();

// Utility Functions
const getSelectErrorClasses = (hasError: boolean) =>
  hasError ? 'border-destructive focus:ring-destructive' : '';

/**
 * SelectRadix - Enhanced select dropdown with Radix UI for custom styling
 *
 * @param props.name - Unique field name for React Hook From
 * @param props.label - Optional label text above select
 * @param props.description - Optional help text below select
 * @param props.required - Shows asterisk (*) for required fields
 * @param props.disabled - Disables the select field
 * @param props.placeholder - Placeholder text (default: "Auswählen...")
 * @param props.className - Additional CSS classes
 * @param props.options - Array of options with value and label
 * @param props.emptyOption - Optional text for empty option
 */
function SelectRadixComponent<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required,
  placeholder = 'Auswählen...',
  disabled,
  className,
  options,
  emptyOption,
}: SelectRadixProps<TFieldValues>) {
  return (
    <Field name={name}>
      <Controller
        name={name}
        render={({ field, fieldState }) => (
          <Item className={className}>
            {label && <Label required={required}>{label}</Label>}
            <Control>
              <SelectPrimitive.Root
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectPrimitive.Trigger
                  className={cn(SELECT_TRIGGER_CLASSES, getSelectErrorClasses(!!fieldState.error))}
                >
                  <SelectPrimitive.Value placeholder={placeholder} />
                  <SelectPrimitive.Icon asChild>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>

                <SelectPrimitive.Portal>
                  <SelectPrimitive.Content className={SELECT_CONTENT_CLASSES} position="popper">
                    <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
                      <ChevronUp className="h-4 w-4" />
                    </SelectPrimitive.ScrollUpButton>

                    <SelectPrimitive.Viewport className="p-1">
                      {emptyOption && (
                        <SelectPrimitive.Item value="" className={SELECT_ITEM_CLASSES}>
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
                          className={SELECT_ITEM_CLASSES}
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
            </Control>
            {description && <Description>{description}</Description>}
            {fieldState.error && <Message>{fieldState.error.message}</Message>}
          </Item>
        )}
      />
    </Field>
  );
}

export const SelectRadix = memo(SelectRadixComponent);
export type { SelectRadixProps };
