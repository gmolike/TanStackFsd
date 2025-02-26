import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, fullWidth = true, ...props }, ref) => {
    return (
      <input
        ref={ref}
        style={{
          display: 'block',
          width: fullWidth ? '100%' : 'auto',
          padding: '0.5rem 0.75rem',
          fontSize: '1rem',
          lineHeight: 1.5,
          color: 'var(--text-color)',
          backgroundColor: 'white',
          backgroundClip: 'padding-box',
          border: `1px solid ${error ? 'var(--error-color)' : '#e2e8f0'}`,
          borderRadius: '0.25rem',
          transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
          ...(props.disabled && {
            backgroundColor: '#f8fafc',
            opacity: 0.7,
            cursor: 'not-allowed',
          }),
        }}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
