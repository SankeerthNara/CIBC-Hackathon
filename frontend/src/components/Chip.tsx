import React from 'react';

interface ChipProps {
  label: React.ReactNode;
  icon?: React.ReactNode;
  onRemove?: () => void;
  onClick?: () => void;
  active?: boolean;
  variant?: 'default' | 'amber' | 'navy' | 'green' | 'red';
  className?: string;
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  onRemove,
  onClick,
  active = false,
  variant = 'default',
  className = '',
  disabled = false,
}) => {
  const variantStyles = {
    default: active
      ? 'bg-slate-800 text-white border-slate-800'
      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200',
    amber: active
      ? 'bg-amber-400 text-amber-950 border-amber-500 font-semibold'
      : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100',
    navy: active
      ? 'bg-brand-navy text-white border-brand-navy'
      : 'bg-slate-100 text-brand-navy border-slate-200 hover:bg-slate-200',
    green: active
      ? 'bg-brand-green text-white border-brand-green'
      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
    red: active
      ? 'bg-brand-orange text-white border-brand-orange'
      : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
  };

  return (
    <span
      onClick={!disabled && onClick ? onClick : undefined}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
        onClick && !disabled ? 'cursor-pointer' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="text-current">{icon}</span>}
      <span>{label}</span>
      {onRemove && !disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 -mr-1 p-0.5 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Remove filter"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};
