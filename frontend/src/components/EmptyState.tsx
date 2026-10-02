import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`p-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mb-4">
        {icon || (
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>
      <h3 className="font-serif text-lg font-bold text-brand-navy mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
