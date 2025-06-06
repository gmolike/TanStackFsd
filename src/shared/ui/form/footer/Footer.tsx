import { memo } from 'react';
import type { FieldValues } from 'react-hook-form';

import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2, RotateCcw } from 'lucide-react';

import { cn } from '~/shared/lib/utils';
import { Button } from '~/shared/shadcn';

import type { Props } from './model/types';
import { useController } from './model/useController';

/**
 * Footer Component - Form footer with error/success messages
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
 * @param error - Error message to display
 * @param success - Success message to display
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
 *   error={submitError}
 *   success={submitSuccess}
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
  error,
  success,
  className,
  children,
}: Props<TFieldValues>) => {
  const { formState, handleReset } = useController({
    form,
    onReset,
  });

  const { isSubmitting, isDirty, isValid } = formState;

  return (
    <div className={cn('space-y-4 border-t pt-6', className)}>
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Buttons - MIT ÄNDERUNG HIER */}
      <div className={cn('flex items-center', children ? 'justify-between' : 'justify-end')}>
        {/* Children content on the left */}
        {children && <div className="flex items-center">{children}</div>}

        {/* Buttons on the right */}
        <div className="flex items-center gap-2">
          {/* Reset Button - always first */}
          {showReset && (
            <Button
              type="button"
              variant="destructive"
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
      </div>
    </div>
  );
};

export const Footer = memo(Component) as typeof Component;
