// src/shared/ui/form/footer/Footer.tsx - REFACTORED IN THIS CHAT
import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import { ArrowLeft, ArrowRight, Loader2, RotateCcw } from 'lucide-react';

import { cn } from '~/shared/lib/utils';
import { Button } from '~/shared/shadcn';

import type { Props } from './model/types';
import { useController } from './model/useController';

/**
 * Footer Component - Simplified form footer with fixed button order
 * Button order is always: Reset -> Cancel -> Submit
 *
 * @template TFieldValues - Type of the form values
 *
 * @param form - React Hook Form instance (optional, will use context if not provided)
 * @param onSubmit - Submit handler (form submission is handled automatically)
 * @param onCancel - Cancel handler
 * @param onReset - Reset handler (in addition to form reset)
 * @param showReset - Whether to show reset button
 * @param showCancel - Whether to show cancel button
 * @param submitText - Text for submit button
 * @param cancelText - Text for cancel button
 * @param resetText - Text for reset button
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <FormFooter
 *   form={form}
 *   showReset={true}
 *   showCancel={true}
 *   onCancel={handleCancel}
 *   submitText="Speichern"
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  form,
  onSubmit,
  onCancel,
  onReset,
  showReset = false,
  showCancel = false,
  submitText = 'Speichern',
  cancelText = 'Abbrechen',
  resetText = 'Zurücksetzen',
  className,
}: Props<TFieldValues>) => {
  const { formState, handleReset } = useController({
    form,
    onReset,
  });

  const { isSubmitting, isDirty, isValid } = formState;

  return (
    <div className={cn('flex items-center justify-end gap-2 border-t pt-6', className)}>
      {/* Reset Button - always first */}
      {showReset && (
        <Button
          type="button"
          variant="danger"
          onClick={handleReset}
          disabled={!isDirty || isSubmitting}
        >
          <RotateCcw className="h-4 w-4" />
          {resetText}
        </Button>
      )}

      {/* Cancel Button - always second */}
      {showCancel && (
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          <ArrowLeft className="h-4 w-4" />
          {cancelText}
        </Button>
      )}

      {/* Submit Button - always last */}
      <Button type="submit" disabled={isSubmitting || !isValid} onClick={onSubmit}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Wird gespeichert...
          </>
        ) : (
          <>
            {submitText}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export const Footer = memo(Component) as typeof Component;
