import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import { Check, ChevronsUpDown, X } from 'lucide-react';

import { cn } from '~/shared/lib/utils';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/shared/shadcn';

import { FormFieldWrapper } from '../fieldWrapper';

import type { Props } from './model/types';
import { useController } from './model/useController';

/**
 * Combobox Component - Searchable dropdown with autocomplete
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form (must be a valid path in TFieldValues)
 * @param label - Label text to display above the combobox
 * @param description - Helper text to display below the combobox
 * @param required - Whether the field is required
 * @param placeholder - Placeholder text when no option is selected
 * @param searchPlaceholder - Placeholder text for the search input
 * @param disabled - Whether the combobox is disabled
 * @param className - Additional CSS classes for the form item container
 * @param options - Array of options to display in the dropdown
 * @param emptyText - Text to show when no options match the search
 * @param showReset - Whether to show reset to default button
 * @param showClear - Whether to show clear selection button
 * @param onSearchChange - Callback when search value changes (for async search)
 * @param loading - Whether options are being loaded
 *
 * @example
 * ```tsx
 * <FormCombobox
 *   control={form.control}
 *   name="framework"
 *   label="Framework"
 *   required
 *   options={[
 *     { value: 'next.js', label: 'Next.js' },
 *     { value: 'sveltekit', label: 'SvelteKit' },
 *     { value: 'nuxt.js', label: 'Nuxt.js' },
 *     { value: 'remix', label: 'Remix' }
 *   ]}
 *   placeholder="Select framework..."
 *   searchPlaceholder="Search framework..."
 *   emptyText="No framework found."
 *   showClear={true}
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  required,
  placeholder = 'Auswählen...',
  searchPlaceholder = 'Suchen...',
  disabled,
  className,
  options,
  emptyText = 'Keine Ergebnisse gefunden.',
  showReset = true,
  showClear = true,
  onSearchChange,
  loading = false,
}: Props<TFieldValues>) => {
  const {
    isDisabled,
    open,
    setOpen,
    searchValue,
    setSearchValue,
    filteredOptions,
    selectedOption,
    handleSelect,
    handleClear,
  } = useController({
    control,
    name,
    disabled,
    required,
    options,
    onSearchChange,
    loading,
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
        <div className="flex items-center gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  'flex-1 justify-between font-normal',
                  !field.value && 'text-muted-foreground',
                )}
                disabled={isDisabled}
                type="button"
              >
                {selectedOption?.label || placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onValueChange={setSearchValue}
                  disabled={loading}
                />
                <CommandList>
                  {loading ? (
                    <CommandEmpty>Wird geladen...</CommandEmpty>
                  ) : filteredOptions.length === 0 ? (
                    <CommandEmpty>{emptyText}</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {filteredOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => handleSelect(option.value, field.onChange)}
                          disabled={option.disabled}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value === option.value ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {showClear && field.value && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleClear(field.onChange)}
              aria-label="Auswahl löschen"
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    />
  );
};

export const Combobox = memo(Component) as typeof Component;
