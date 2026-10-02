import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  accent?: 'navy' | 'orange' | 'amber' | 'green' | 'none';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  headerAction,
  accent = 'none',
  onClick,
}) => {
  const accentClasses = {
    none: '',
    navy: 'border-t-4 border-t-brand-navy',
    orange: 'border-t-4 border-t-brand-orange',
    amber: 'border-t-4 border-t-brand-amber-dark',
    green: 'border-t-4 border-t-brand-green',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-slate-200 shadow-sm transition-all ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow' : ''
      } ${accentClasses[accent]} ${className}`}
    >
      {(title || headerAction) && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            {title && (
              <h3 className="font-serif text-lg font-semibold text-brand-navy tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};
