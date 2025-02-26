import { JSX, type ButtonHTMLAttributes } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps): JSX.Element => {
  const baseStyles =
    'btn inline-flex items-center justify-center rounded font-medium focus:outline-none transition-colors';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizeStyles = {
    sm: 'text-sm px-3 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  const disabledStyles = props.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '0.25rem',
        fontWeight: 500,
        transition: 'background-color 0.2s',
        ...(variant === 'primary' && {
          backgroundColor: 'var(--primary-color)',
          color: 'white',
        }),
        ...(variant === 'secondary' && {
          backgroundColor: '#e5e7eb',
          color: '#1f2937',
        }),
        ...(variant === 'outline' && {
          backgroundColor: 'transparent',
          border: '1px solid #e5e7eb',
          color: '#4b5563',
        }),
        ...(variant === 'danger' && {
          backgroundColor: 'var(--error-color)',
          color: 'white',
        }),
        ...(size === 'sm' && {
          fontSize: '0.875rem',
          padding: '0.375rem 0.75rem',
        }),
        ...(size === 'md' && {
          fontSize: '1rem',
          padding: '0.5rem 1rem',
        }),
        ...(size === 'lg' && {
          fontSize: '1.125rem',
          padding: '0.75rem 1.5rem',
        }),
        ...(fullWidth && {
          width: '100%',
        }),
        ...(props.disabled && {
          opacity: 0.6,
          cursor: 'not-allowed',
        }),
      }}
      {...props}
    >
      {children}
    </button>
  );
};
