import React from 'react';

export type BadgeVariant =
  | 'current'
  | '1-30'
  | '31-60'
  | '61-90'
  | '90+'
  | 'severe'
  | 'possible'
  | 'clear'
  | 'approved'
  | 'pending'
  | 'overridden'
  | 'pass'
  | 'warn'
  | 'fail'
  | 'neutral'
  | 'specialist';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
  size = 'md',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    current: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    '1-30': 'bg-amber-50 text-amber-800 border-amber-200',
    '31-60': 'bg-orange-50 text-orange-800 border-orange-200',
    '61-90': 'bg-rose-100 text-rose-800 border-rose-300 font-semibold',
    '90+': 'bg-red-800 text-white border-red-900 font-bold',
    severe: 'bg-brand-orange text-white border-brand-orange font-bold animate-pulse',
    possible: 'bg-amber-100 text-amber-900 border-amber-300 font-medium',
    clear: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    approved: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
    pending: 'bg-amber-100 text-amber-900 border-amber-300',
    overridden: 'bg-purple-100 text-purple-800 border-purple-300 font-semibold',
    pass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-medium',
    warn: 'bg-amber-100 text-amber-900 border-amber-300 font-medium',
    fail: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    specialist: 'bg-indigo-100 text-indigo-800 border-indigo-300 font-semibold',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border tracking-wide uppercase ${
        sizeStyles[size]
      } ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
