import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  fullWidth?: boolean;
  helperText?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, fullWidth = true, helperText, className = '', ...props }, ref) => {
    // Basis-Klassen
    const baseClasses =
      'px-3 py-2 bg-white border rounded text-gray-700 focus:outline-none focus:ring-2 transition-colors';

    // Fehler-Klassen
    const errorClasses = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
      : 'border-gray-300 focus:border-primary focus:ring-primary/50';

    // Breiten-Klassen
    const widthClasses = fullWidth ? 'w-full' : '';

    // Deaktiviert-Klassen
    const disabledClasses = props.disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : '';

    // Kombinierte Klassen
    const combinedClasses = `${baseClasses} ${errorClasses} ${widthClasses} ${disabledClasses} ${className}`;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        <input ref={ref} className={combinedClasses} {...props} />
        {helperText && (
          <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
