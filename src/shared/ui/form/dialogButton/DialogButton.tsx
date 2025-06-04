import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import { cn } from '~/shared/lib/utils';
import { Button } from '~/shared/shadcn';

import { FormFieldWrapper } from '../fieldWrapper';

import type { Props } from './model/types';
import { useController } from './model/useController';

/**
 * DialogButton Component - Button field that opens a dialog for value selection
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form (must be a valid path in TFieldValues)
 * @param label - Label text to display above the button
 * @param description - Helper text to display below the button
 * @param required - Whether the field is required
 * @param placeholder - Placeholder text (deprecated, use emptyText)
 * @param disabled - Whether the button is disabled
 * @param className - Additional CSS classes for the form item container
 * @param children - Content to render in the button (required)
 * @param additionalContent - Additional content to display below the button
 * @param emptyText - Text to show when the field value is empty and children returns empty
 * @param variant - Button variant from ShadCN
 * @param size - Button size
 * @param icon - Icon to display on the left side of the button
 * @param endIcon - Icon to display on the right side of the button
 * @param dialog - Dialog component to render when button is clicked (required)
 * @param buttonClassName - Additional CSS classes for the button
 * @param fullWidth - Whether the button should take full width
 * @param showReset - Whether to show reset to default button
 *
 * @example
 * ```tsx
 * // With user picker dialog
 * <DialogButton
 *   control={form.control}
 *   name="selectedUser"
 *   label="Select User"
 *   icon={UserIcon}
 *   endIcon={ChevronDown}
 *   dialog={({ open, onOpenChange, value, onChange }) => (
 *     <UserPickerDialog
 *       open={open}
 *       onOpenChange={onOpenChange}
 *       value={value}
 *       onSelect={onChange}
 *     />
 *   )}
 * >
 *   {(value) => value?.name || 'No user selected'}
 * </DialogButton>
 *
 * // With additional content
 * <DialogButton
 *   control={form.control}
 *   name="dateRange"
 *   label="Date Range"
 *   icon={CalendarIcon}
 *   additionalContent={(value) => value && (
 *     <span className="text-xs text-muted-foreground">
 *       Duration: {calculateDays(value.start, value.end)} days
 *     </span>
 *   )}
 *   dialog={<DateRangeDialog />}
 * >
 *   {(value) => value ? `${formatDate(value.start)} - ${formatDate(value.end)}` : 'Select dates'}
 * </DialogButton>
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  required,
  placeholder, // Deprecated, use emptyText
  disabled,
  className,
  children,
  additionalContent,
  emptyText = placeholder || 'Auswählen...',
  variant = 'outline',
  size = 'default',
  icon: Icon,
  endIcon: EndIcon,
  dialog,
  buttonClassName,
  fullWidth = true,
  showReset = true,
}: Props<TFieldValues>) => {
  const { isDisabled, dialogOpen, setDialogOpen, handleClick, getDisplayContent, hasValue } =
    useController({
      control,
      disabled,
      emptyText,
      children,
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
      render={(field) => {
        const displayContent = getDisplayContent(field.value);
        const isEmpty = !hasValue(field.value);

        // Get additional content if provided
        const additionalContentNode = additionalContent
          ? typeof additionalContent === 'function'
            ? additionalContent(field.value)
            : additionalContent
          : null;

        return (
          <>
            <div className="space-y-1">
              <Button
                type="button"
                variant={variant}
                size={size}
                onClick={handleClick}
                disabled={isDisabled}
                className={cn(
                  fullWidth && 'w-full',
                  'justify-start',
                  isEmpty && 'text-muted-foreground',
                  buttonClassName,
                )}
              >
                {/* Left Icon */}
                {Icon && <Icon className="h-4 w-4 shrink-0" />}

                {/* Content */}
                <span className={cn('flex-1', isEmpty ? 'font-normal' : 'font-medium')}>
                  {displayContent}
                </span>

                {/* Right Icon */}
                {EndIcon && <EndIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
              </Button>

              {/* Additional Content */}
              {additionalContentNode && <div className="px-1">{additionalContentNode}</div>}
            </div>

            {/* Dialog - always rendered as function */}
            {dialog({
              open: dialogOpen,
              onOpenChange: setDialogOpen,
              value: field.value,
              onChange: field.onChange,
              name: name as string,
            })}
          </>
        );
      }}
    />
  );
};

export const DialogButton = memo(Component) as typeof Component;
