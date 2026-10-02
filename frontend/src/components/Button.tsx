import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-brand-navy text-white hover:bg-slate-800 border-transparent shadow-sm focus:ring-brand-navy',
    secondary:
      'bg-white text-brand-navy border-slate-300 hover:bg-slate-50 focus:ring-slate-400',
    danger:
      'bg-brand-orange text-white hover:bg-rose-700 border-transparent shadow-sm focus:ring-brand-orange',
    success:
      'bg-brand-green text-white hover:bg-emerald-800 border-transparent shadow-sm focus:ring-brand-green',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 border-transparent focus:ring-slate-300',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
    md: 'text-sm px-4 py-2 rounded-md gap-2',
    lg: 'text-base px-5 py-2.5 rounded-lg gap-2.5',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        sizeStyles[size]
      } ${variantStyles[variant]} ${
        disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
